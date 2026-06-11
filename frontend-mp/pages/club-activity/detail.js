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
    isFull: false
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

    this.setData({
      activity: {
        ...activity,
        activityTimeText: util.formatTime(activity.activityTime, 'YYYY-MM-DD HH:mm'),
        endTimeText: util.formatTime(activity.endTime, 'MM-DD HH:mm'),
        deadlineText: util.formatTime(activity.deadline, 'YYYY-MM-DD HH:mm'),
        createdAtText: util.formatTime(activity.createdAt, 'YYYY-MM-DD')
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
      isCheckInDay
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

  preventBubble() {},

  onShareAppMessage() {
    return {
      title: this.data.activity ? this.data.activity.title : '社团活动',
      path: '/pages/club-activity/detail?id=' + this.data.activityId
    };
  }
});
