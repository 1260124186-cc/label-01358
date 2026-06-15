const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    order: null,
    isUser: false,
    isWorker: false,
    isAdmin: false,
    showRatingModal: false,
    ratingScore: 0,
    selectedTags: [],
    ratingComment: '',
    ratingTagsList: constants.REPAIR_RATING_TAGS,
    timelineItems: [],
    expectedTimeText: '',
    previewImages: []
  },

  onLoad(options) {
    this.ratingTagsList = constants.REPAIR_RATING_TAGS;
    if (options.id) {
      this.loadOrder(options.id);
    }
  },

  onShow() {
    if (this.data.order) {
      this.loadOrder(this.data.order.id);
    }
  },

  loadOrder(id) {
    const order = dataService.getRepairOrderDetail(id);
    if (!order) {
      util.showToast('工单不存在');
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const app = getApp();
    const currentUserId = (app.globalData.userInfo && app.globalData.userInfo.id) || 'test_user';
    const userRole = (app.globalData.userInfo && app.globalData.userInfo.role) || 'user';

    const isUser = order.userId === currentUserId;
    const isWorker = order.workerId === currentUserId || userRole === 'repair_worker';
    const isAdmin = userRole === 'admin';

    const timeline = (order.timeline || []).map(item => {
      const statusInfo = constants.REPAIR_ORDER_STATUS.find(s => s.value === item.status);
      return {
        ...item,
        timeText: util.formatTime(item.time, 'YYYY-MM-DD HH:mm'),
        label: statusInfo ? statusInfo.label : item.status,
        icon: statusInfo ? statusInfo.icon : '📋',
        color: statusInfo ? statusInfo.color : '#666'
      };
    }).reverse();

    const timeSlotInfo = constants.REPAIR_TIME_SLOTS.find(t => t.value === order.preferredTime);
    const expectedTimeText = timeSlotInfo ? timeSlotInfo.label : '尽快上门';

    const images = order.images || [];

    const formattedOrder = {
      ...order,
      createTimeText: util.formatTime(order.createTime, 'YYYY-MM-DD HH:mm'),
      acceptTimeText: order.acceptTime ? util.formatTime(order.acceptTime, 'YYYY-MM-DD HH:mm') : '',
      startTimeText: order.startTime ? util.formatTime(order.startTime, 'YYYY-MM-DD HH:mm') : '',
      completeTimeText: order.completeTime ? util.formatTime(order.completeTime, 'YYYY-MM-DD HH:mm') : '',
      cancelTimeText: order.cancelTime ? util.formatTime(order.cancelTime, 'YYYY-MM-DD HH:mm') : '',
      ratingTimeText: order.ratingTime ? util.formatTime(order.ratingTime, 'YYYY-MM-DD HH:mm') : ''
    };

    this.setData({
      order: formattedOrder,
      isUser,
      isWorker,
      isAdmin,
      timelineItems: timeline,
      expectedTimeText,
      previewImages: images,
      showRatingModal: false,
      ratingScore: 0,
      selectedTags: [],
      ratingComment: ''
    });
  },

  onPreviewImage(e) {
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls: this.data.previewImages
    });
  },

  onCallWorker() {
    if (!this.data.order || !this.data.order.workerPhone) return;
    wx.makePhoneCall({
      phoneNumber: this.data.order.workerPhone,
      fail: () => {}
    });
  },

  onCancel() {
    if (!this.data.order) return;
    util.showConfirm('确定要取消该工单吗？').then(confirmed => {
      if (confirmed) {
        const result = dataService.cancelRepairOrder(this.data.order.id);
        if (result && result.success) {
          util.showSuccess('已取消').then(() => {
            this.loadOrder(this.data.order.id);
          });
        } else {
          util.showError((result && result.error) || '取消失败');
        }
      }
    });
  },

  onAccept() {
    if (!this.data.order) return;
    const app = getApp();
    const currentUserId = (app.globalData.userInfo && app.globalData.userInfo.id) || 'worker_1';
    const result = dataService.acceptRepairOrder(this.data.order.id, currentUserId);
    if (result && result.success) {
      util.showSuccess('接单成功').then(() => {
        this.loadOrder(this.data.order.id);
      });
    } else {
      util.showError((result && result.error) || '接单失败');
    }
  },

  onStart() {
    if (!this.data.order) return;
    const result = dataService.startRepairOrder(this.data.order.id);
    if (result && result.success) {
      util.showSuccess('已开始维修').then(() => {
        this.loadOrder(this.data.order.id);
      });
    } else {
      util.showError((result && result.error) || '操作失败');
    }
  },

  onComplete() {
    if (!this.data.order) return;
    util.showConfirm('确认已完成维修吗？').then(confirmed => {
      if (confirmed) {
        const result = dataService.completeRepairOrder(this.data.order.id);
        if (result && result.success) {
          util.showSuccess('维修已完成').then(() => {
            this.loadOrder(this.data.order.id);
          });
        } else {
          util.showError((result && result.error) || '操作失败');
        }
      }
    });
  },

  onRate() {
    this.setData({
      showRatingModal: true,
      ratingScore: 0,
      selectedTags: [],
      ratingComment: ''
    });
  },

  onCloseRating() {
    this.setData({ showRatingModal: false });
  },

  onRatingScore(e) {
    const score = Number(e.currentTarget.dataset.score);
    this.setData({ ratingScore: score });
  },

  onTagToggle(e) {
    const tag = e.currentTarget.dataset.tag;
    let selectedTags = this.data.selectedTags.slice();
    const idx = selectedTags.indexOf(tag);
    if (idx > -1) {
      selectedTags.splice(idx, 1);
    } else {
      selectedTags.push(tag);
    }
    this.setData({ selectedTags });
  },

  onRatingInput(e) {
    this.setData({ ratingComment: e.detail.value });
  },

  onSubmitRating() {
    if (this.data.ratingScore === 0) {
      util.showToast('请选择评分');
      return;
    }
    const { ratingScore, selectedTags, ratingComment, order } = this.data;
    const result = dataService.rateRepairOrder(order.id, {
      rating: ratingScore,
      tags: selectedTags,
      comment: ratingComment
    });
    if (result && result.success) {
      util.showSuccess('评价成功').then(() => {
        this.setData({ showRatingModal: false });
        this.loadOrder(order.id);
      });
    } else {
      util.showError((result && result.error) || '评价失败');
    }
  },

  preventBubble() {}
});
