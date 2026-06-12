const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    activity: null,
    activityId: '',
    categoryLabel: '',
    categoryIcon: '',
    categoryColor: '',
    statusLabel: '',
    statusColor: '',
    isRegistered: false,
    isCheckedIn: false,
    canRegister: false,
    canCancel: false,
    canCheckIn: false,
    showCheckInModal: false,
    showQrModal: false,
    checkInInput: '',
    registrationCount: 0,
    remainingCount: 0,
    progressPercent: 0,
    isFull: false,
    ticketInfo: null,
    userOrders: [],
    userActiveOrder: null,
    showBuyModal: false,
    buyQuantity: 1,
    maxQuantity: 5,
    showTicketDetailModal: false,
    selectedTicketIndex: 0,
    walletBalance: 0,
    showRefundModal: false,
    refundCalc: null,
    refundReason: '',
    refundRuleDesc: '',
    isOrganizer: false,
    ticketStats: null
  },

  onLoad(options) {
    this.setData({ activityId: options.id });
    dataService.increaseClubActivityViews(options.id);
    this.loadDetail();
  },

  onShow() {
    if (this.data.activityId) {
      this.loadDetail();
    }
  },

  loadDetail() {
    util.showLoading();
    const app = getApp();
    const userInfo = app.globalData.userInfo || {};
    const userId = userInfo.id || 'test_user';

    const activity = dataService.getClubActivityDetail(this.data.activityId);
    if (!activity) {
      util.hideLoading();
      util.showToast('活动不存在');
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }

    dataService.increaseClubActivityViews(this.data.activityId);

    const categoryItem = constants.CLUB_ACTIVITY_CATEGORIES.find(c => c.value === activity.category) || {};
    const statusValue = activity.activityStatus || this.computeStatus(activity);
    const statusItem = constants.CLUB_ACTIVITY_STATUS.find(s => s.value === statusValue) || {};

    const registrations = dataService.getClubActivityRegistrations(this.data.activityId) || [];
    const registrationCount = registrations.length;
    const remainingCount = Math.max(0, (activity.capacity || 0) - registrationCount);
    const isFull = registrationCount >= (activity.capacity || 0);

    const userReg = registrations.find(r => r.userId === userId);
    const isRegistered = !!userReg;
    const isCheckedIn = isRegistered && userReg.checkedIn;

    const deadlineMs = new Date(activity.deadline).getTime();
    const isDeadlinePassed = Date.now() > deadlineMs;
    const startMs = new Date(activity.activityTime).getTime();
    const now = Date.now();

    const canRegister = statusValue === 'upcoming' && !isRegistered && !isFull && !isDeadlinePassed;
    const canCancel = isRegistered && !isCheckedIn && (startMs - now > 3600 * 1000);
    const canCheckIn = isRegistered && !isCheckedIn && statusValue !== 'ended';

    const activityDay = new Date(activity.activityTime).toDateString();
    const today = new Date().toDateString();
    const isCheckInDay = activityDay === today;

    const isOrganizer = activity.publisherId === userId || (userInfo.role === 'admin');

    const ticketInfo = dataService.getActivityTicketInfo(this.data.activityId);
    const userOrders = dataService.getUserOrdersByActivity(this.data.activityId, userId);
    const userActiveOrder = userOrders.find(o => ['paid', 'checked_in'].includes(o.status)) || null;

    const wallet = dataService.getUserWallet();

    const refundRuleItem = constants.TICKET_REFUND_RULES.find(r => r.value === (activity.refundRule || 'no_refund'));

    let ticketStats = null;
    if (isOrganizer) {
      ticketStats = dataService.getActivityTicketStats(this.data.activityId);
    }

    this.setData({
      activity: {
        ...activity,
        activityTimeText: util.formatTime(activity.activityTime, 'YYYY-MM-DD HH:mm'),
        endTimeText: util.formatTime(activity.endTime, 'MM-DD HH:mm'),
        deadlineText: util.formatTime(activity.deadline, 'YYYY-MM-DD HH:mm'),
        createdAtText: util.formatTime(activity.createdAt, 'YYYY-MM-DD'),
        ticketSalesStartText: activity.ticketSalesStart ? util.formatTime(activity.ticketSalesStart, 'MM-DD HH:mm') : '',
        ticketSalesEndText: activity.ticketSalesEnd ? util.formatTime(activity.ticketSalesEnd, 'MM-DD HH:mm') : ''
      },
      categoryLabel: categoryItem.label || '其他',
      categoryIcon: categoryItem.icon || '📌',
      categoryColor: categoryItem.color || '#6B7280',
      statusLabel: statusItem.label || '',
      statusColor: statusItem.color || '#6B7280',
      statusValue,
      isRegistered,
      isCheckedIn,
      canRegister,
      canCancel,
      canCheckIn: canCheckIn && isCheckInDay,
      registrationCount,
      remainingCount,
      progressPercent: Math.min(100, Math.round(registrationCount / (activity.capacity || 1) * 100)),
      isFull,
      isCheckInDay,
      ticketInfo: ticketInfo ? {
        ...ticketInfo,
        salesStartText: util.formatTime(ticketInfo.salesStart, 'MM-DD HH:mm'),
        salesEndText: util.formatTime(ticketInfo.salesEnd, 'MM-DD HH:mm')
      } : null,
      userOrders: userOrders.map(o => ({
        ...o,
        createTimeText: util.formatTime(o.createTime, 'MM-DD HH:mm'),
        payTimeText: util.formatTime(o.payTime, 'MM-DD HH:mm'),
        activityTimeText: util.formatTime(o.activityTime, 'YYYY-MM-DD HH:mm'),
        statusLabel: (constants.TICKET_ORDER_STATUS_MAP[o.status] || {}).label || o.status,
        statusColor: (constants.TICKET_ORDER_STATUS_MAP[o.status] || {}).color || '#6B7280',
        statusIcon: (constants.TICKET_ORDER_STATUS_MAP[o.status] || {}).icon || '📋'
      })),
      userActiveOrder: userActiveOrder ? {
        ...userActiveOrder,
        createTimeText: util.formatTime(userActiveOrder.createTime, 'MM-DD HH:mm'),
        activityTimeText: util.formatTime(userActiveOrder.activityTime, 'YYYY-MM-DD HH:mm')
      } : null,
      walletBalance: wallet ? wallet.balance : 0,
      refundRuleDesc: refundRuleItem ? refundRuleItem.desc : '不可退票',
      isOrganizer,
      ticketStats
    });

    util.hideLoading();
  },

  computeStatus(item) {
    const now = Date.now();
    const startMs = new Date(item.activityTime).getTime();
    const endMs = new Date(item.endTime).getTime();
    if (item.cancelled) return 'cancelled';
    if (now > endMs) return 'ended';
    if (now >= startMs) return 'ongoing';
    return 'upcoming';
  },

  onRegister() {
    if (!util.checkLogin()) return;
    if (this.data.ticketInfo && !this.data.ticketInfo.isFree && this.data.ticketInfo.ticketPrice > 0) {
      this.setData({
        showBuyModal: true,
        buyQuantity: 1,
        maxQuantity: Math.min(5, this.data.ticketInfo.remainingStock || 5)
      });
      return;
    }
    util.showModal('确认报名', `确认报名「${this.data.activity.title}」吗？报名后请按时参加。`).then(confirm => {
      if (!confirm) return;
      util.showLoading('报名中...');
      const result = dataService.registerClubActivity(this.data.activityId);
      if (result.success) {
        util.hideLoading();
        util.showSuccess('报名成功');
        setTimeout(() => this.loadDetail(), 500);
      } else {
        util.hideLoading();
        util.showError(result.message || '报名失败');
      }
    });
  },

  onCancel() {
    if (!util.checkLogin()) return;
    util.showModal('取消报名', '确认取消报名吗？取消后名额将释放给其他同学。').then(confirm => {
      if (!confirm) return;
      util.showLoading();
      const result = dataService.cancelClubActivityRegistration(this.data.activityId);
      if (result.success) {
        util.hideLoading();
        util.showSuccess('已取消报名');
        setTimeout(() => this.loadDetail(), 500);
      } else {
        util.hideLoading();
        util.showError(result.message || '取消失败');
      }
    });
  },

  onQuantityMinus() {
    const q = Math.max(1, this.data.buyQuantity - 1);
    this.setData({ buyQuantity: q });
  },

  onQuantityPlus() {
    const q = Math.min(this.data.maxQuantity, this.data.buyQuantity + 1);
    this.setData({ buyQuantity: q });
  },

  onQuantityChange(e) {
    let v = parseInt(e.detail.value) || 1;
    v = Math.max(1, Math.min(this.data.maxQuantity, v));
    this.setData({ buyQuantity: v });
  },

  onCloseBuy() {
    this.setData({ showBuyModal: false });
  },

  onConfirmBuy() {
    if (!util.checkLogin()) return;
    const { buyQuantity, activityId, ticketInfo } = this.data;
    const total = (ticketInfo.ticketPrice || 0) * buyQuantity;
    const priceText = total > 0 ? `共 ${buyQuantity} 张，合计 ¥${total}` : '共 ' + buyQuantity + ' 张（免费）';

    util.showModal('确认购票', `确认购买「${this.data.activity.title}」的门票吗？\n${priceText}\n${this.data.refundRuleDesc || ''}`).then(async confirm => {
      if (!confirm) return;
      util.showLoading('处理中...');
      const result = dataService.createTicketOrder(activityId, buyQuantity, 'balance');
      util.hideLoading();
      if (result.success) {
        util.showSuccess('购票成功');
        this.setData({ showBuyModal: false });
        setTimeout(() => {
          this.loadDetail();
          this.setData({ showTicketDetailModal: true, selectedTicketIndex: 0 });
        }, 500);
      } else {
        util.showError(result.message || '购票失败');
      }
    });
  },

  onShowUserOrder() {
    if (this.data.userActiveOrder) {
      this.setData({ showTicketDetailModal: true, selectedTicketIndex: 0 });
    }
  },

  onCloseTicketDetail() {
    this.setData({ showTicketDetailModal: false });
  },

  onTicketSwitch(e) {
    const idx = e.currentTarget.dataset.index;
    this.setData({ selectedTicketIndex: idx });
  },

  onShowCheckIn() {
    this.setData({ showCheckInModal: true, checkInInput: '' });
  },

  onCloseCheckIn() {
    this.setData({ showCheckInModal: false, checkInInput: '' });
  },

  onCheckInInput(e) {
    this.setData({ checkInInput: e.detail.value });
  },

  onCheckInSubmit() {
    const code = this.data.checkInInput.trim().toUpperCase();
    if (!code) {
      util.showToast('请输入签到码');
      return;
    }
    util.showLoading('签到中...');
    const result = dataService.checkinClubActivity(this.data.activityId, code);
    if (result.success) {
      util.hideLoading();
      util.showSuccess('签到成功');
      this.setData({ showCheckInModal: false });
      setTimeout(() => this.loadDetail(), 500);
    } else {
      util.hideLoading();
      util.showError(result.message || '签到码错误');
    }
  },

  onShowQr() {
    if (!this.data.isCheckInDay) {
      util.showToast('仅活动当天可查看签到码');
      return;
    }
    this.setData({ showQrModal: true });
  },

  onCloseQr() {
    this.setData({ showQrModal: false });
  },

  onRequestRefund() {
    if (!this.data.userActiveOrder) return;
    const calc = dataService.calculateRefund(this.data.userActiveOrder.id);
    if (!calc.success) {
      util.showError(calc.message);
      return;
    }
    this.setData({
      showRefundModal: true,
      refundCalc: calc,
      refundReason: ''
    });
  },

  onRefundReasonInput(e) {
    this.setData({ refundReason: e.detail.value });
  },

  onCloseRefund() {
    this.setData({ showRefundModal: false });
  },

  onConfirmRefund() {
    if (!this.data.userActiveOrder) return;
    const calc = this.data.refundCalc;
    if (!calc || !calc.canRefund) {
      util.showError(calc?.reason || '不可退票');
      return;
    }
    util.showModal('确认退票', `确定申请退票吗？\n将退款 ¥${calc.refundAmount}`).then(confirm => {
      if (!confirm) return;
      util.showLoading('处理中...');
      const result = dataService.requestRefund(this.data.userActiveOrder.id, this.data.refundReason);
      util.hideLoading();
      if (result.success) {
        util.showSuccess('退票成功');
        this.setData({ showRefundModal: false });
        setTimeout(() => this.loadDetail(), 500);
      } else {
        util.showError(result.message || '退票失败');
      }
    });
  },

  onCopyTicketCode(e) {
    const code = e.currentTarget.dataset.code;
    wx.setClipboardData({
      data: code,
      success: () => util.showToast('票码已复制')
    });
  },

  onCallOrganizer() {
    const phone = this.data.activity && this.data.activity.organizerPhone;
    if (!phone) {
      util.showToast('暂无联系电话');
      return;
    }
    wx.makePhoneCall({ phoneNumber: phone });
  },

  onCopyLocation() {
    wx.setClipboardData({
      data: this.data.activity.location,
      success: () => util.showToast('地点已复制')
    });
  },

  onNavToClub() {
    util.navigateTo('/pages/club/index?id=' + this.data.activity.clubId);
  },

  onNavToScanVerify() {
    util.navigateTo('/pages/club-activity/verify?id=' + this.data.activityId);
  },

  onNavToManage() {
    util.navigateTo('/pages/club-activity/manage?id=' + this.data.activityId);
  },

  preventBubble() {},

  onShareAppMessage() {
    return {
      title: this.data.activity ? this.data.activity.title : '社团活动',
      path: '/pages/club-activity/detail?id=' + this.data.activityId
    };
  }
});
