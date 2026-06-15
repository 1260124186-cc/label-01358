const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    groupBuyId: '',
    groupBuy: null,
    loading: true,
    isPublisher: false,
    isJoined: false,
    quantity: 1,
    totalCost: 0,
    submitting: false
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.setData({ groupBuyId: id });
      this.loadDetail();
    } else {
      util.showError('团购信息不存在');
      wx.navigateBack();
    }
  },

  onShow() {
    if (this.data.groupBuyId) {
      this.loadDetail();
    }
  },

  loadDetail() {
    this.setData({ loading: true });

    try {
      const groupBuy = dataService.getGroupBuyDetail(this.data.groupBuyId);
      if (!groupBuy) {
        util.showError('团购信息不存在');
        wx.navigateBack();
        return;
      }

      dataService.increaseGroupBuyViews(this.data.groupBuyId);

      const categoryInfo = constants.GROUP_BUY_CATEGORIES.find(c => c.value === groupBuy.category);
      const statusInfo = constants.GROUP_BUY_STATUS_MAP[groupBuy.status];
      const pickupInfo = constants.GROUP_BUY_PICKUP_POINTS.find(p => p.value === groupBuy.pickupPoint);

      const deadline = new Date(groupBuy.deadline);
      const deadlineFormatted = util.formatTime(deadline, 'YYYY-MM-DD HH:mm');

      const now = Date.now();
      const diff = deadline.getTime() - now;
      let countdownText = '';
      if (diff <= 0) {
        countdownText = '已截止';
      } else if (diff < 3600000) {
        countdownText = Math.floor(diff / 60000) + '分钟后截止';
      } else if (diff < 86400000) {
        countdownText = Math.floor(diff / 3600000) + '小时后截止';
      } else {
        countdownText = Math.floor(diff / 86400000) + '天后截止';
      }

      const progressPercent = Math.min(100, Math.floor((groupBuy.joinedCount / groupBuy.minCount) * 100));
      const remainingCount = Math.max(0, groupBuy.minCount - groupBuy.joinedCount);

      const app = getApp();
      const userInfo = app.globalData.userInfo || {};
      const userId = userInfo.id || 'test_user';

      const isPublisher = groupBuy.publisherId === userId;
      const members = (groupBuy.members || []).map(m => ({
        ...m,
        isPublisher: m.userId === groupBuy.publisherId
      }));
      const isJoined = members.some(m => m.userId === userId);

      const formattedGroupBuy = {
        ...groupBuy,
        categoryIcon: categoryInfo ? categoryInfo.icon : '🛒',
        categoryText: categoryInfo ? categoryInfo.label : '其他',
        statusText: statusInfo ? statusInfo.label : '',
        statusColor: statusInfo ? statusInfo.color : '',
        pickupPointText: pickupInfo ? pickupInfo.label : groupBuy.pickupPoint,
        deadlineFormatted,
        countdownText,
        progressPercent,
        remainingCount,
        timeText: util.relativeTime(groupBuy.createTime),
        members
      };

      this.setData({
        groupBuy: formattedGroupBuy,
        isPublisher,
        isJoined,
        totalCost: this.data.quantity * groupBuy.unitPrice,
        loading: false
      });
    } catch (e) {
      console.error('[GroupBuy] load detail error:', e);
      util.showError('加载失败');
      this.setData({ loading: false });
    }
  },

  onMinusQty() {
    const val = Math.max(1, this.data.quantity - 1);
    this.setData({
      quantity: val,
      totalCost: val * this.data.groupBuy.unitPrice
    });
  },

  onPlusQty() {
    const maxLeft = this.data.groupBuy.maxCount - this.data.groupBuy.joinedCount;
    const val = Math.min(maxLeft, this.data.quantity + 1);
    this.setData({
      quantity: val,
      totalCost: val * this.data.groupBuy.unitPrice
    });
  },

  onQtyInput(e) {
    let val = parseInt(e.detail.value);
    if (isNaN(val) || val < 1) val = 1;
    const maxLeft = this.data.groupBuy.maxCount - this.data.groupBuy.joinedCount;
    if (val > maxLeft) val = maxLeft;
    this.setData({
      quantity: val,
      totalCost: val * this.data.groupBuy.unitPrice
    });
  },

  async onJoinGroup() {
    if (!util.checkLogin()) return;

    const currentPoints = dataService.getUserPoints();
    if (currentPoints < this.data.totalCost) {
      wx.showModal({
        title: '积分不足',
        content: `当前积分：${currentPoints}，需要：${this.data.totalCost}`,
        showCancel: false,
        confirmColor: '#FF6B6B'
      });
      return;
    }

    wx.showModal({
      title: '确认参团',
      content: `将预付 ${this.data.totalCost} 积分购买 ${this.data.quantity} 件「${this.data.groupBuy.productName}」`,
      confirmText: '确认参团',
      confirmColor: '#FF6B6B',
      success: async (res) => {
        if (res.confirm) {
          this.setData({ submitting: true });
          try {
            const result = dataService.joinGroupBuy(this.data.groupBuyId, this.data.quantity);
            if (result.success) {
              await util.showSuccess(result.message);
              this.loadDetail();
            } else {
              util.showToast(result.message);
            }
          } catch (e) {
            console.error('[GroupBuy] join error:', e);
            util.showError('参团失败');
          } finally {
            this.setData({ submitting: false });
          }
        }
      }
    });
  },

  onLeaveGroup() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出该团购吗？预付积分将自动退回。',
      confirmColor: '#FF6B6B',
      success: async (res) => {
        if (res.confirm) {
          this.setData({ submitting: true });
          try {
            const result = dataService.leaveGroupBuy(this.data.groupBuyId);
            if (result.success) {
              await util.showSuccess(result.message);
              this.loadDetail();
            } else {
              util.showToast(result.message);
            }
          } catch (e) {
            console.error('[GroupBuy] leave error:', e);
            util.showError('操作失败');
          } finally {
            this.setData({ submitting: false });
          }
        }
      }
    });
  },

  onDeleteGroup() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个团购吗？已参团的用户积分将自动退回。',
      confirmColor: '#FF6B6B',
      success: async (res) => {
        if (res.confirm) {
          const members = this.data.groupBuy.members || [];
          members.forEach(m => {
            if (m.paid && m.userId !== this.data.groupBuy.publisherId) {
              const refund = this.data.groupBuy.unitPrice * m.quantity;
              dataService.addPoints(refund, `团购退款：${this.data.groupBuy.productName}`);
            }
          });
          dataService.deleteGroupBuy(this.data.groupBuyId);
          await util.showSuccess('已删除');
          wx.navigateBack();
        }
      }
    });
  },

  onShareAppMessage() {
    if (!this.data.groupBuy) return {};
    return {
      title: `【团购】${this.data.groupBuy.productName} - 还差${this.data.groupBuy.remainingCount}件成团！`,
      path: '/pages/group-buy-detail/index?id=' + this.data.groupBuyId
    };
  }
});
