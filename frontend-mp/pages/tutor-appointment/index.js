const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    tabs: constants.TUTOR_APPOINTMENT_STATUS,
    currentTab: 'all',
    appointmentList: [],
    refreshing: false,
    subjectMap: {},
    timeSlotMap: {}
  },

  onLoad() {
    const subjectMap = {};
    constants.TUTOR_SUBJECTS.forEach(s => {
      subjectMap[s.value] = s;
    });
    const timeSlotMap = {};
    constants.TUTOR_TIME_SLOTS.forEach(t => {
      timeSlotMap[t.value] = t;
    });

    this.setData({
      subjectMap,
      timeSlotMap
    });

    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const app = getApp();
    const userInfo = app.globalData.userInfo || {};
    const userId = userInfo.id || 'test_user';
    const { currentTab, subjectMap, timeSlotMap } = this.data;

    const filters = { userId };
    if (currentTab && currentTab !== 'all') {
      filters.status = currentTab;
    }

    const list = dataService.getTutorAppointmentList(filters);

    const formattedList = list.map(item => {
      const statusInfo = constants.TUTOR_APPOINTMENT_STATUS_MAP[item.status] || {};
      const subject = subjectMap[item.subject] || {};
      const timeSlot = timeSlotMap[item.timeSlot] || {};
      const isTutorSide = item.tutorId === userId;
      const otherName = isTutorSide ? item.studentName : item.tutorName;
      const otherAvatar = isTutorSide ? item.studentAvatar : item.tutorAvatar;

      let appointmentTimeText = '';
      if (item.appointmentDate) {
        appointmentTimeText = item.appointmentDate;
        if (timeSlot.label) {
          appointmentTimeText += ' ' + timeSlot.label;
        }
      }

      return {
        ...item,
        statusLabel: statusInfo.label || item.status,
        statusColor: statusInfo.color || '#6B7280',
        statusIcon: statusInfo.icon || '',
        subjectLabel: subject.label || '',
        subjectIcon: subject.icon || '',
        timeSlotLabel: timeSlot.label || '',
        appointmentTimeText,
        otherName,
        otherAvatar,
        isTutorSide,
        methodText: item.teachingMethod === 'online' ? '线上' : item.teachingMethod === 'offline' ? '线下' : ''
      };
    });

    this.setData({
      appointmentList: formattedList,
      refreshing: false
    });
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
    this.loadData();
  },

  onNavToDetail(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo('/pages/tutor-appointment/detail?id=' + id);
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadData();
  }
});
