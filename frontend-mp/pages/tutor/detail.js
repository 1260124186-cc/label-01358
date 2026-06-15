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
    gradeLabels: [],
    teachingMethodInfo: null,
    weekdayLabels: [],
    timeSlotLabels: [],
    reviews: [],
    reviewCount: 0,
    averageRating: 0,
    creditTags: [],
    createTimeText: ''
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
    const detail = dataService.getTutorDetail(this.data.id);

    if (detail) {
      const statusInfo = constants.TUTOR_STATUS_MAP[detail.status] || {};
      const subjectInfo = constants.TUTOR_SUBJECTS.find(s => s.value === detail.subject) || {};
      const teachingMethodInfo = constants.TUTOR_TEACHING_METHODS.find(m => m.value === detail.teachingMethod) || {};

      const gradeLabels = (detail.grades || []).map(g => {
        const gradeInfo = constants.TUTOR_GRADES.find(gr => gr.value === g);
        return gradeInfo ? gradeInfo.label : g;
      });

      const weekdayLabels = (detail.availableDays || []).map(d => {
        const weekdayInfo = constants.TUTOR_WEEKDAYS.find(w => w.value === String(d));
        return weekdayInfo ? weekdayInfo.label : d;
      });

      const timeSlotLabels = (detail.availableTimeSlots || []).map(t => {
        const slotInfo = constants.TUTOR_TIME_SLOTS.find(s => s.value === t);
        return slotInfo ? slotInfo.label : t;
      });

      const creditTags = (detail.creditVerifications || []).map(c => {
        const creditType = constants.TUTOR_CREDIT_TYPES.find(t => t.value === c.type);
        return {
          type: c.type,
          label: creditType ? creditType.label : c.type,
          icon: creditType ? creditType.icon : '✅',
          status: c.status
        };
      });

      const reviews = dataService.getTutorReviews({ tutorId: this.data.id });
      const formattedReviews = reviews.map(r => ({
        ...r,
        createTimeText: util.relativeTime(r.createTime)
      }));

      const reviewCount = reviews.length;
      const averageRating = reviewCount > 0
        ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount).toFixed(1)
        : '0.0';

      this.setData({
        detail,
        statusInfo,
        subjectInfo,
        gradeLabels,
        teachingMethodInfo,
        weekdayLabels,
        timeSlotLabels,
        creditTags,
        reviews: formattedReviews,
        reviewCount,
        averageRating,
        createTimeText: util.relativeTime(detail.createTime)
      });

      dataService.addHistory(detail, 'tutor');
    }

    util.hideLoading();
  },

  onPreviewImage(e) {
    const { url } = e.currentTarget.dataset;
    const urls = this.data.detail.proofImages || [];
    if (!url && urls.length === 0) return;

    const current = url || urls[0];
    wx.previewImage({
      current,
      urls: urls
    });
  },

  onViewMatchedDemands() {
    if (!util.checkLogin()) return;
    wx.navigateTo({
      url: '/pages/tutor-match/index?tutorId=' + this.data.id
    });
  },

  onBookAppointment() {
    if (!util.checkLogin()) return;
    wx.navigateTo({
      url: '/pages/tutor-appointment/create?tutorId=' + this.data.id
    });
  },

  onShareAppMessage() {
    const { detail } = this.data;
    return {
      title: detail ? `${detail.tutorName} - ${this.data.subjectInfo.label || '家教'}导师` : '家教导师',
      path: '/pages/tutor/detail?id=' + this.data.id
    };
  }
});
