const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    tabs: [
      { value: 'pending', label: '待确认' },
      { value: 'confirmed', label: '已确认' },
      { value: 'completed', label: '已完成' },
      { value: 'all', label: '全部' }
    ],
    currentTab: 'pending',
    list: [],
    loading: false,
    showRejectModal: false,
    rejectReason: '',
    currentAppointmentId: '',
    showRescheduleModal: false,
    dateList: [],
    dateIndex: 0,
    timeSlots: constants.RENTAL_VIEWING_TIME_SLOTS,
    timeSlotIndex: -1
  },

  onLoad() {
    this.initDateList();
    this.loadList();
  },

  onShow() {
    this.loadList();
  },

  onPullDownRefresh() {
    this.loadList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  initDateList() {
    const dateList = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const weekDay = weekDays[date.getDay()];
      const dateStr = `${date.getFullYear()}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dateList.push({
        value: dateStr,
        label: i === 0 ? '今天' : (i === 1 ? '明天' : `${month}/${day}`),
        subLabel: weekDay
      });
    }
    this.setData({ dateList });
  },

  loadList() {
    if (!util.checkLogin()) {
      this.setData({ list: [], loading: false });
      return Promise.resolve();
    }

    this.setData({ loading: true });

    return new Promise((resolve) => {
      const app = getApp();
      const userInfo = app.globalData.userInfo || {};

      const filters = {
        publisherId: userInfo.id || 'anonymous',
        status: this.data.currentTab
      };

      const list = dataService.getViewingAppointmentList(filters);

      const formattedList = list.map(item => {
        const statusInfo = constants.RENTAL_VIEWING_STATUS_MAP[item.status] || {};
        return {
          ...item,
          statusText: statusInfo.label || item.status,
          statusColor: statusInfo.color || '#999',
          timeText: `${item.date} ${item.timeSlot}`,
          createTimeText: util.relativeTime(item.createTime)
        };
      });

      this.setData({
        list: formattedList,
        loading: false
      });

      resolve();
    });
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
    this.loadList();
  },

  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo(`/pages/rental-viewing-appointment-detail/index?id=${item.id}`);
  },

  onConfirm(e) {
    const { item } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认预约',
      content: '确认接受这次看房预约吗？',
      confirmText: '确认',
      success: (res) => {
        if (res.confirm) {
          dataService.confirmViewingAppointment(item.id);
          util.showSuccess('已确认预约');
          this.loadList();
        }
      }
    });
  },

  onShowRejectModal(e) {
    const { item } = e.currentTarget.dataset;
    this.setData({
      showRejectModal: true,
      rejectReason: '',
      currentAppointmentId: item.id
    });
  },

  onHideRejectModal() {
    this.setData({ showRejectModal: false });
  },

  onRejectReasonInput(e) {
    this.setData({ rejectReason: e.detail.value });
  },

  onSubmitReject() {
    if (!this.data.rejectReason.trim()) {
      util.showToast('请填写拒绝原因');
      return;
    }

    dataService.rejectViewingAppointment(
      this.data.currentAppointmentId,
      this.data.rejectReason
    );

    util.showSuccess('已拒绝预约');
    this.setData({ showRejectModal: false });
    this.loadList();
  },

  onShowRescheduleModal(e) {
    const { item } = e.currentTarget.dataset;
    this.setData({
      showRescheduleModal: true,
      currentAppointmentId: item.id,
      dateIndex: 0,
      timeSlotIndex: -1
    });
  },

  onHideRescheduleModal() {
    this.setData({ showRescheduleModal: false });
  },

  onRescheduleDateSelect(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ dateIndex: index });
  },

  onRescheduleTimeSelect(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ timeSlotIndex: index });
  },

  onSubmitReschedule() {
    if (this.data.timeSlotIndex === -1) {
      util.showToast('请选择时间');
      return;
    }

    const newDate = this.data.dateList[this.data.dateIndex].value;
    const newTimeSlot = this.data.timeSlots[this.data.timeSlotIndex].value;

    dataService.rescheduleViewingAppointment(
      this.data.currentAppointmentId,
      newDate,
      newTimeSlot
    );

    util.showSuccess('改期成功');
    this.setData({ showRescheduleModal: false });
    this.loadList();
  },

  onCallUser(e) {
    const { item } = e.currentTarget.dataset;
    if (!item.userPhone) return;

    wx.makePhoneCall({
      phoneNumber: item.userPhone,
      fail: () => {
        util.showToast('拨号失败');
      }
    });
  },

  stopPropagation() {}
});
