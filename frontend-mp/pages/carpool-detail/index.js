const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    carpoolId: '',
    carpool: null,
    loading: true,
    isFavorite: false,
    isPublisher: false,
    isJoined: false,
    showSafetyModal: false,
    showShareCard: false,
    showLeaveModal: false,
    seatMap: [],
    statusFlow: [],
    luggageInfo: null,
    departureCountdown: ''
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.setData({ carpoolId: id });
      this.loadDetail();
    } else {
      util.showError('拼车信息不存在');
      wx.navigateBack();
    }

    this._countdownTimer = null;
  },

  onShow() {
    if (this.data.carpoolId) {
      this.loadDetail();
    }
    dataService.checkAndTriggerDepartureReminders();
  },

  onHide() {
    if (this._countdownTimer) {
      clearInterval(this._countdownTimer);
    }
  },

  onUnload() {
    if (this._countdownTimer) {
      clearInterval(this._countdownTimer);
    }
  },

  loadDetail() {
    this.setData({ loading: true });

    try {
      const carpool = dataService.getCarpoolDetail(this.data.carpoolId);
      if (!carpool) {
        util.showError('拼车信息不存在');
        wx.navigateBack();
        return;
      }

      dataService.increaseCarpoolViews(this.data.carpoolId);

      const typeInfo = constants.CARPOOL_TYPES.find(t => t.value === carpool.type);
      const statusInfo = constants.CARPOOL_STATUS.find(s => s.value === carpool.status);
      const destInfo = constants.CARPOOL_DESTINATIONS.find(d => d.value === carpool.destination);

      const departureDate = new Date(carpool.departureTime);
      const departureFormatted = util.formatTime(departureDate, 'YYYY-MM-DD HH:mm');

      const app = getApp();
      const userInfo = app.globalData.userInfo || {};
      const userId = userInfo.id || 'test_user';

      const isPublisher = carpool.publisherId === userId;
      const members = (carpool.members || []).map(m => ({
        ...m,
        isPublisher: m.userId === carpool.publisherId
      }));

      const isJoined = members.some(m => m.userId === userId);

      const seatMap = carpool.seatMap || dataService.buildSeatMap(
        carpool.totalSeats,
        carpool.driverSeatAvailable,
        carpool.passengerSeatAvailable,
        members
      );

      const statusFlow = this.buildStatusFlow(carpool.status);

      const luggageInfo = constants.CARPOOL_LUGGAGE_OPTIONS.find(
        l => l.value === (carpool.luggageSpace || 'none')
      );

      const formattedCarpool = {
        ...carpool,
        typeText: typeInfo ? typeInfo.label : '',
        typeIcon: typeInfo ? typeInfo.icon : '',
        typeColor: typeInfo ? typeInfo.color : '',
        statusText: statusInfo ? statusInfo.label : '',
        statusColor: statusInfo ? statusInfo.color : '',
        destinationText: carpool.destinationText || (destInfo ? destInfo.label : carpool.destination),
        departureFormatted,
        priceText: util.formatPrice(carpool.pricePerPerson),
        timeText: util.relativeTime(carpool.createTime),
        members
      };

      this.setData({
        carpool: formattedCarpool,
        isFavorite: dataService.isFavorite(this.data.carpoolId, 'carpool'),
        isPublisher,
        isJoined,
        loading: false,
        seatMap,
        statusFlow,
        luggageInfo
      });

      this.startCountdown(carpool.departureTime);
    } catch (e) {
      util.showError('加载失败');
      this.setData({ loading: false });
    }
  },

  buildStatusFlow(currentStatus) {
    const flow = [
      { value: 'recruiting', label: '招募中', icon: '📋' },
      { value: 'full', label: '已满', icon: '👥' },
      { value: 'departed', label: '已出发', icon: '🚗' },
      { value: 'completed', label: '已完成', icon: '✅' }
    ];

    const statusOrder = ['recruiting', 'full', 'departed', 'completed'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return flow.map((item, index) => ({
      ...item,
      completed: index < currentIndex,
      active: index === currentIndex
    }));
  },

  startCountdown(departureTime) {
    if (this._countdownTimer) {
      clearInterval(this._countdownTimer);
    }

    const updateCountdown = () => {
      const now = Date.now();
      const diff = departureTime - now;

      if (diff <= 0) {
        this.setData({ departureCountdown: '已过出发时间' });
        if (this._countdownTimer) {
          clearInterval(this._countdownTimer);
        }
        return;
      }

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);

      if (hours >= 24) {
        const days = Math.floor(hours / 24);
        this.setData({ departureCountdown: days + '天后出发' });
      } else if (hours >= 1) {
        this.setData({ departureCountdown: hours + '小时' + minutes + '分钟后出发' });
      } else {
        this.setData({ departureCountdown: minutes + '分钟后出发' });
      }
    };

    updateCountdown();
    this._countdownTimer = setInterval(updateCountdown, 60000);
  },

  onToggleFavorite() {
    if (!this.data.carpool) return;

    const result = dataService.toggleFavorite(this.data.carpoolId, 'carpool', {
      id: this.data.carpool.id,
      title: this.data.carpool.departure + ' → ' + this.data.carpool.destinationText,
      cover: '',
      price: this.data.carpool.pricePerPerson,
      type: 'carpool'
    });

    this.setData({
      isFavorite: result.isFavorite
    });

    util.showToast(result.isFavorite ? '已收藏' : '已取消收藏');
  },

  onJoinCarpool() {
    if (!util.checkLogin()) return;

    const result = dataService.joinCarpool(this.data.carpoolId);
    if (result.success) {
      util.showSuccess('申请成功，等待确认');
      this.loadDetail();
    } else {
      util.showToast(result.message);
    }
  },

  onConfirmMember(e) {
    const { userid } = e.currentTarget.dataset;
    const result = dataService.confirmCarpoolMember(this.data.carpoolId, userid);
    if (result.success) {
      util.showSuccess('已确认同行');
      this.loadDetail();
    } else {
      util.showToast(result.message);
    }
  },

  onRemoveMember(e) {
    const { userid, username } = e.currentTarget.dataset;
    wx.showModal({
      title: '移除成员',
      content: '确定要移除"' + username + '"吗？',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          const result = dataService.removeCarpoolMember(this.data.carpoolId, userid);
          if (result.success) {
            util.showSuccess('已移除');
            this.loadDetail();
          } else {
            util.showToast(result.message);
          }
        }
      }
    });
  },

  onLeaveCarpool() {
    this.setData({ showLeaveModal: true });
  },

  onConfirmLeave() {
    this.setData({ showLeaveModal: false });
    const result = dataService.leaveCarpool(this.data.carpoolId);
    if (result.success) {
      util.showSuccess('已退出拼车');
      this.loadDetail();
    } else {
      util.showToast(result.message);
    }
  },

  onCancelLeave() {
    this.setData({ showLeaveModal: false });
  },

  onUpdateStatus(e) {
    const { status } = e.currentTarget.dataset;
    dataService.updateCarpoolStatus(this.data.carpoolId, status);
    const statusInfo = constants.CARPOOL_STATUS.find(s => s.value === status);
    util.showSuccess('状态已更新为：' + (statusInfo ? statusInfo.label : status));
    this.loadDetail();
  },

  onDeleteCarpool() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这条拼车信息吗？',
      confirmColor: '#FF6B6B',
      success: (res) => {
        if (res.confirm) {
          dataService.deleteCarpool(this.data.carpoolId);
          util.showSuccess('已删除').then(() => {
            wx.navigateBack();
          });
        }
      }
    });
  },

  onCallPhone() {
    if (!this.data.carpool || !this.data.carpool.contactPhone) return;
    wx.makePhoneCall({
      phoneNumber: this.data.carpool.contactPhone,
      fail: () => {
        util.showToast('拨号失败');
      }
    });
  },

  onCopyWechat() {
    if (!this.data.carpool || !this.data.carpool.wechatId) {
      util.showToast('未提供微信号');
      return;
    }
    wx.setClipboardData({
      data: this.data.carpool.wechatId,
      success: () => {
        util.showToast('微信号已复制');
      }
    });
  },

  onShowShareCard() {
    this.setData({ showShareCard: true });
  },

  onHideShareCard() {
    this.setData({ showShareCard: false });
  },

  onShowSafetyModal() {
    this.setData({ showSafetyModal: true });
  },

  onHideSafetyModal() {
    this.setData({ showSafetyModal: false });
  },

  onSaveShareCard() {
    this.setData({ showShareCard: false });
    util.showSuccess('行程卡片已分享');
  },

  onShareAppMessage() {
    if (!this.data.carpool) return {};
    return {
      title: this.data.carpool.departure + ' → ' + this.data.carpool.destinationText + ' 拼车',
      path: '/pages/carpool-detail/index?id=' + this.data.carpoolId
    };
  },

  stopPropagation() {}
});
