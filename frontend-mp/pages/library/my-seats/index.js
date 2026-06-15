const util = require('../../../utils/util');
const constants = require('../../../config/constants');
const dataService = require('../../../services/data');
const { mixPage } = require('../../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    darkMode: false,
    loading: true,
    userId: 'user_001',
    activeTab: 'upcoming',
    tabs: constants.LIBRARY_SEAT_RESERVATION_TABS,
    reservationList: [],
    hasTimeoutRecords: false,
    timeoutTip: '温馨提示：预约开始后15分钟内未签到，系统将自动释放座位'
  },

  onLoad() {
    const currentUser = app.globalData.userInfo;
    this.setData({
      userId: currentUser ? currentUser.id : 'user_001',
      darkMode: app.globalData.isDark || false
    });
    this.loadData();
  },

  onShow() {
    if (!this.data.loading) {
      this.loadData();
    }
  },

  onPullDownRefresh() {
    this.loadData(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadData(callback) {
    this.setData({ loading: true });
    try {
      const { userId, activeTab } = this.data;
      dataService.checkTimeoutSeatReservations(userId);
      const list = dataService.getMySeatReservations(userId, { tab: activeTab });

      const processedList = list.map(item => {
        const startDate = new Date(item.startTime);
        const endDate = new Date(item.endTime);
        return {
          ...item,
          dateText: item.date,
          timeSlotText: item.timeSlotLabel || '',
          startTimeText: util.formatTime(item.startTime, 'HH:mm'),
          endTimeText: util.formatTime(item.endTime, 'HH:mm'),
          statusText: item.statusInfo ? item.statusInfo.label : '',
          statusColor: item.statusInfo ? item.statusInfo.color : '#999',
          statusIcon: item.statusInfo ? item.statusInfo.icon : '📌',
          checkInTimeText: item.checkInTime ? util.formatTime(item.checkInTime, 'HH:mm') : '',
          checkOutTimeText: item.checkOutTime ? util.formatTime(item.checkOutTime, 'HH:mm') : '',
          createTimeText: util.formatTime(item.createTime, 'YYYY-MM-DD HH:mm'),
          isTimeout: item.displayStatus === 'timeout'
        };
      });

      const hasTimeoutRecords = processedList.some(item => item.isTimeout);

      this.setData({
        reservationList: processedList,
        hasTimeoutRecords,
        loading: false
      });

      if (callback) callback();
    } catch (error) {
      console.error('加载预约数据失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
      if (callback) callback();
    }
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    if (value === this.data.activeTab) return;
    this.setData({ activeTab: value }, () => {
      this.loadData();
    });
  },

  async onCheckInTap(e) {
    const { id } = e.currentTarget.dataset;
    const record = this.data.reservationList.find(r => r.id === id);
    if (!record) return;

    const now = Date.now();
    const startTime = record.startTime || 0;
    const diffMinutes = Math.round((startTime - now) / 60000);

    if (now < startTime - 15 * 60000) {
      util.showToast(`签到时间未到，请提前15分钟内签到（还剩${diffMinutes}分钟）`);
      return;
    }

    const confirm = await util.showConfirm(
      `确认签到 ${record.roomName} ${record.seatNumber}号座位？\n时段：${record.timeSlotText}`,
      '确认签到'
    );
    if (!confirm) return;

    try {
      util.showLoading('签到中...');
      const result = dataService.checkInSeatReservation(id);
      util.hideLoading();

      if (result.success) {
        await util.showSuccess('签到成功');
        this.loadData();
      } else {
        util.showToast(result.message || '签到失败');
      }
    } catch (error) {
      console.error('签到失败:', error);
      util.hideLoading();
      util.showToast('签到失败，请重试');
    }
  },

  async onCheckOutTap(e) {
    const { id } = e.currentTarget.dataset;
    const record = this.data.reservationList.find(r => r.id === id);
    if (!record) return;

    const confirm = await util.showConfirm(
      `确认签退 ${record.roomName} ${record.seatNumber}号座位？\n签退后将结束本次座位使用`,
      '确认签退'
    );
    if (!confirm) return;

    try {
      util.showLoading('签退中...');
      const result = dataService.checkOutSeatReservation(id);
      util.hideLoading();

      if (result.success) {
        await util.showSuccess('签退成功');
        this.loadData();
      } else {
        util.showToast(result.message || '签退失败');
      }
    } catch (error) {
      console.error('签退失败:', error);
      util.hideLoading();
      util.showToast('签退失败，请重试');
    }
  },

  async onCancelTap(e) {
    const { id } = e.currentTarget.dataset;
    const record = this.data.reservationList.find(r => r.id === id);
    if (!record) return;

    const confirm = await util.showConfirm(
      `确认取消 ${record.roomName} ${record.seatNumber}号座位的预约？\n日期：${record.dateText}\n时段：${record.timeSlotText}`,
      '确认取消'
    );
    if (!confirm) return;

    try {
      util.showLoading('取消中...');
      const result = dataService.cancelSeatReservation(id);
      util.hideLoading();

      if (result.success) {
        await util.showSuccess('取消成功');
        this.loadData();
      } else {
        util.showToast(result.message || '取消失败');
      }
    } catch (error) {
      console.error('取消失败:', error);
      util.hideLoading();
      util.showToast('取消失败，请重试');
    }
  },

  goBack() {
    util.navigateBack();
  }
});
