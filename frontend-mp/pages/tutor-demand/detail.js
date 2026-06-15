const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    id: '',
    detail: null,
    statusInfo: null,
    subjectInfo: null,
    gradeInfo: null,
    teachingMethodInfo: null,
    weekdayLabels: [],
    timeSlotLabels: [],
    budgetText: '',
    createTimeText: '',
    publishTimeText: ''
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id });
      this.loadDetail();
    }
  },

  onShow() {
    if (this.data.id) {
      this.loadDetail();
    }
  },

  loadDetail() {
    util.showLoading();
    const detail = dataService.getTutorDemandDetail(this.data.id);

    if (detail) {
      const statusInfo = constants.TUTOR_DEMAND_STATUS_MAP[detail.status] || {};
      const subjectInfo = constants.TUTOR_SUBJECTS.find(s => s.value === detail.subject) || {};
      const gradeInfo = constants.TUTOR_GRADES.find(g => g.value === detail.grade) || {};
      const teachingMethodInfo = constants.TUTOR_TEACHING_METHODS.find(m => m.value === detail.teachingMethod) || {};

      const weekdayLabels = (detail.preferredDays || []).map(d => {
        const weekdayInfo = constants.TUTOR_WEEKDAYS.find(w => w.value === String(d));
        return weekdayInfo ? weekdayInfo.label : d;
      });

      const timeSlotLabels = (detail.preferredTimeSlots || []).map(t => {
        const slotInfo = constants.TUTOR_TIME_SLOTS.find(s => s.value === t);
        return slotInfo ? slotInfo.label : t;
      });

      let budgetText = '';
      if (detail.budget !== undefined && detail.maxBudget !== undefined) {
        if (detail.budget === detail.maxBudget) {
          budgetText = '¥' + detail.budget + '/小时';
        } else if (detail.maxBudget >= 9999) {
          budgetText = '¥' + detail.budget + '元以上/小时';
        } else {
          budgetText = '¥' + detail.budget + ' - ¥' + detail.maxBudget + '/小时';
        }
      } else if (detail.budget !== undefined) {
        budgetText = '¥' + detail.budget + '/小时';
      }

      this.setData({
        detail,
        statusInfo,
        subjectInfo,
        gradeInfo,
        teachingMethodInfo,
        weekdayLabels,
        timeSlotLabels,
        budgetText,
        createTimeText: util.relativeTime(detail.createTime),
        publishTimeText: util.formatTime(detail.createTime, 'YYYY-MM-DD HH:mm')
      });

      dataService.addHistory(detail, 'tutorDemand');
    }

    util.hideLoading();
  },

  onViewMatchedTutors() {
    if (!util.checkLogin()) return;
    wx.navigateTo({
      url: '/pages/tutor-match/index?demandId=' + this.data.id
    });
  },

  onApplyTutor() {
    if (!util.checkLogin()) return;
    wx.navigateTo({
      url: '/pages/tutor-appointment/create?demandId=' + this.data.id
    });
  },

  onCallPhone() {
    const { detail } = this.data;
    if (!detail || !detail.contactPhone) return;
    wx.makePhoneCall({
      phoneNumber: detail.contactPhone,
      fail: () => {}
    });
  },

  onShareAppMessage() {
    const { detail, subjectInfo } = this.data;
    return {
      title: detail ? `${subjectInfo.label || '家教'}辅导需求 - ${detail.grade || ''}` : '家教需求',
      path: '/pages/tutor-demand/detail?id=' + this.data.id
    };
  }
});
