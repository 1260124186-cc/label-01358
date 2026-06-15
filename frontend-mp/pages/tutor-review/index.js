const app = getApp();
const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    appointmentId: '',
    role: '',
    appointment: null,
    targetRole: '',
    targetUser: {},
    rating: 5,
    positiveTags: [],
    negativeTags: [],
    selectedPositiveTags: [],
    selectedNegativeTags: [],
    content: '',
    submitting: false
  },

  onLoad(options) {
    const appointmentId = options.appointmentId || '';
    const role = options.role || 'student';

    const reviewTags = constants.TUTOR_REVIEW_TAGS || [];
    const positiveTags = reviewTags.filter(t => t.positive);
    const negativeTags = reviewTags.filter(t => !t.positive);

    let appointment = null;
    let targetRole = '';
    let targetUser = {};

    if (appointmentId) {
      appointment = dataService.getTutorAppointmentDetail(appointmentId);
      if (appointment) {
        if (role === 'tutor') {
          targetRole = 'student';
          targetUser = {
            id: appointment.studentId,
            name: appointment.studentName || '同学',
            avatar: appointment.studentAvatar || ''
          };
        } else {
          targetRole = 'tutor';
          targetUser = {
            id: appointment.tutorId,
            name: appointment.tutorName || '老师',
            avatar: appointment.tutorAvatar || ''
          };
        }
      }
    }

    this.setData({
      appointmentId,
      role,
      appointment,
      targetRole,
      targetUser,
      positiveTags,
      negativeTags
    });
  },

  onRatingTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ rating: Number(value) });
  },

  onPositiveTagTap(e) {
    const { value } = e.currentTarget.dataset;
    const selected = this.data.selectedPositiveTags.slice();
    const idx = selected.indexOf(value);
    if (idx > -1) {
      selected.splice(idx, 1);
    } else {
      selected.push(value);
    }
    this.setData({ selectedPositiveTags: selected });
  },

  onNegativeTagTap(e) {
    const { value } = e.currentTarget.dataset;
    const selected = this.data.selectedNegativeTags.slice();
    const idx = selected.indexOf(value);
    if (idx > -1) {
      selected.splice(idx, 1);
    } else {
      selected.push(value);
    }
    this.setData({ selectedNegativeTags: selected });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  async onSubmit() {
    if (this.data.submitting) return;

    const { appointmentId, role, targetRole, targetUser, rating, selectedPositiveTags, selectedNegativeTags, content, appointment } = this.data;

    if (!appointmentId || !appointment) {
      util.showError('预约信息不存在');
      return;
    }

    if (rating <= 0) {
      util.showToast('请选择评分');
      return;
    }

    const userInfo = app.globalData.userInfo || {};
    const tags = [...selectedPositiveTags, ...selectedNegativeTags];

    const reviewData = {
      appointmentId,
      reviewerRole: role,
      targetRole,
      tutorId: targetRole === 'tutor' ? targetUser.id : (appointment.tutorId || ''),
      studentId: targetRole === 'student' ? targetUser.id : (appointment.studentId || ''),
      rating,
      tags,
      content
    };

    this.setData({ submitting: true });
    util.showLoading('提交中...');

    try {
      const result = dataService.addTutorReview(reviewData);
      util.hideLoading();

      if (result) {
        await util.showSuccess('评价完成');
        setTimeout(() => {
          util.navigateBack();
        }, 1500);
      } else {
        util.showError('提交失败，请重试');
      }
    } catch (e) {
      util.hideLoading();
      util.showError('提交失败，请重试');
    } finally {
      this.setData({ submitting: false });
    }
  }
});
