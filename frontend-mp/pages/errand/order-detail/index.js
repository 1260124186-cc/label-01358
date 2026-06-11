const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    order: null,
    statusSteps: [],
    isPublisher: false,
    isRunner: false,
    runnerProfile: null,
    escrowInfo: null,
    publisherRating: null,
    runnerRating: null,
    canRate: false,
    ratingType: '',
    showRatingModal: false,
    ratingScore: 0,
    ratingTags: [],
    selectedTags: [],
    ratingComment: '',
    ratingTagsList: constants.ERRAND_RATING_TAGS
  },

  onLoad(options) {
    this.ratingTagsList = constants.ERRAND_RATING_TAGS;
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
    const order = dataService.getErrandOrderDetail(id);
    if (!order) {
      util.showToast('订单不存在');
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const app = getApp();
    const currentUserId = (app.globalData.userInfo && app.globalData.userInfo.id) || 'test_user';
    const isPublisher = order.userId === currentUserId;
    const isRunner = order.runnerId === currentUserId;

    const statusInfo = constants.ERRAND_ORDER_STATUS.find(s => s.value === order.status);
    const taskTypeInfo = constants.ERRAND_TASK_TYPES.find(t => t.value === order.type);

    const statusSteps = [
      { label: '待接单', value: 'pending', done: false, active: false },
      { label: '已接单', value: 'accepted', done: false, active: false },
      { label: '进行中', value: 'in_progress', done: false, active: false },
      { label: '已完成', value: 'completed', done: false, active: false }
    ];

    const flowOrder = ['pending', 'accepted', 'in_progress', 'completed'];
    const currentIndex = flowOrder.indexOf(order.status);

    statusSteps.forEach((step, index) => {
      if (index < currentIndex) {
        step.done = true;
      } else if (index === currentIndex) {
        step.active = true;
      }
    });

    let runnerProfile = null;
    if (order.runnerId && (order.status === 'accepted' || order.status === 'in_progress' || order.status === 'completed')) {
      runnerProfile = dataService.getRunnerProfile(order.runnerId);
    }

    let escrowInfo = null;
    if (order.escrowStatus) {
      const escrowStatusInfo = constants.ERRAND_ESCROW_STATUS.find(s => s.value === order.escrowStatus);
      escrowInfo = {
        status: order.escrowStatus,
        label: escrowStatusInfo ? escrowStatusInfo.label : order.escrowStatus,
        color: escrowStatusInfo ? escrowStatusInfo.color : '#666',
        icon: escrowStatusInfo ? escrowStatusInfo.icon : '🔒'
      };
    }

    let canRate = false;
    let ratingType = '';
    if (order.status === 'completed') {
      if (isPublisher && !order.publisherRating) {
        canRate = true;
        ratingType = 'publisher';
      } else if (isRunner && !order.runnerRating) {
        canRate = true;
        ratingType = 'runner';
      }
    }

    const typeText = taskTypeInfo ? taskTypeInfo.label : order.type;
    const typeIcon = taskTypeInfo ? taskTypeInfo.icon : '📌';

    let purchaseCategoryText = '';
    if (order.type === 'purchase' && order.purchaseCategory) {
      const catInfo = constants.ERRAND_PURCHASE_CATEGORIES.find(c => c.value === order.purchaseCategory);
      purchaseCategoryText = catInfo ? catInfo.label : order.purchaseCategory;
    }

    let pickupPointText = '';
    if (order.type === 'express' && order.pickupPoint) {
      const pointInfo = constants.EXPRESS_PICKUP_POINTS.find(p => p.value === order.pickupPoint);
      pickupPointText = pointInfo ? pointInfo.label : order.pickupPoint;
    }

    const formattedOrder = {
      ...order,
      statusText: statusInfo ? statusInfo.label : order.status,
      statusColor: statusInfo ? statusInfo.color : '#666',
      statusIcon: statusInfo ? statusInfo.icon : '📋',
      typeText,
      typeIcon,
      purchaseCategoryText,
      pickupPointText,
      timeText: util.formatTime(order.createTime, 'YYYY-MM-DD HH:mm')
    };

    let creditLevelText = '';
    let creditLevelColor = '';
    if (runnerProfile && runnerProfile.creditScore !== undefined) {
      const levelInfo = constants.ERRAND_CREDIT_LEVELS.find(l => runnerProfile.creditScore >= l.min && runnerProfile.creditScore <= l.max);
      if (levelInfo) {
        creditLevelText = levelInfo.label;
        creditLevelColor = levelInfo.color;
      }
    }

    this.setData({
      order: formattedOrder,
      statusSteps,
      isPublisher,
      isRunner,
      runnerProfile: runnerProfile ? { ...runnerProfile, creditLevelText, creditLevelColor } : null,
      escrowInfo,
      publisherRating: order.publisherRating || null,
      runnerRating: order.runnerRating || null,
      canRate,
      ratingType,
      showRatingModal: false,
      ratingScore: 0,
      selectedTags: [],
      ratingComment: ''
    });
  },

  onCancel() {
    if (!this.data.order) return;
    util.showConfirm('确定要取消该订单吗？').then(confirmed => {
      if (confirmed) {
        const result = dataService.cancelErrandOrder(this.data.order.id);
        if (result && !result.error) {
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
    const result = dataService.acceptErrandOrder(this.data.order.id);
    if (result && !result.error) {
      util.showSuccess('接单成功').then(() => {
        this.loadOrder(this.data.order.id);
      });
    } else {
      util.showError((result && result.error) || '接单失败');
    }
  },

  onStartTask() {
    if (!this.data.order) return;
    const result = dataService.startErrandOrder(this.data.order.id);
    if (result && !result.error) {
      util.showSuccess('任务已开始').then(() => {
        this.loadOrder(this.data.order.id);
      });
    } else {
      util.showError((result && result.error) || '操作失败');
    }
  },

  onComplete() {
    if (!this.data.order) return;
    util.showConfirm('确认已完成该任务吗？').then(confirmed => {
      if (confirmed) {
        const result = dataService.completeErrandOrder(this.data.order.id);
        if (result && !result.error) {
          util.showSuccess('任务已完成').then(() => {
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
    const { ratingType, ratingScore, selectedTags, ratingComment, order } = this.data;
    const result = dataService.rateErrandOrder(order.id, ratingType, {
      score: ratingScore,
      tags: selectedTags,
      comment: ratingComment
    });
    if (result && !result.error) {
      util.showSuccess('评价成功').then(() => {
        this.setData({ showRatingModal: false });
        this.loadOrder(order.id);
      });
    } else {
      util.showError((result && result.error) || '评价失败');
    }
  },

  onCopyPickupCode() {
    if (!this.data.order || !this.data.order.pickupCode) return;
    wx.setClipboardData({
      data: this.data.order.pickupCode,
      success: () => {
        util.showToast('已复制取件码');
      }
    });
  },

  onCallPhone() {
    if (!this.data.order || !this.data.order.contactPhone) return;
    wx.makePhoneCall({
      phoneNumber: this.data.order.contactPhone,
      fail: () => {}
    });
  },

  preventBubble() {}
});
