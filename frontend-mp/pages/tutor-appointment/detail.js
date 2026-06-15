const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    id: '',
    detail: null,
    statusInfo: {},
    isTutorSide: false,
    currentUserId: '',
    subjectLabel: '',
    timeSlotLabel: '',
    methodText: '',
    appointmentTimeText: '',
    createTimeText: '',
    showActions: false
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
    const detail = dataService.getTutorAppointmentDetail(this.data.id);

    if (detail) {
      const app = getApp();
      const userInfo = app.globalData.userInfo || {};
      const currentUserId = userInfo.id || 'test_user';
      const isTutorSide = detail.tutorId === currentUserId || detail.tutorUserId === currentUserId;

      const statusInfo = constants.TUTOR_APPOINTMENT_STATUS_MAP[detail.status] || {};

      const subjectMap = {};
      constants.TUTOR_SUBJECTS.forEach(s => {
        subjectMap[s.value] = s;
      });
      const subject = subjectMap[detail.subject] || {};

      const timeSlotMap = {};
      constants.TUTOR_TIME_SLOTS.forEach(t => {
        timeSlotMap[t.value] = t;
      });
      const timeSlot = timeSlotMap[detail.timeSlot] || {};

      let methodText = '';
      if (detail.teachingMethod === 'online') {
        methodText = '线上辅导';
      } else if (detail.teachingMethod === 'offline') {
        methodText = '线下辅导';
      }

      let appointmentTimeText = '';
      if (detail.appointmentDate) {
        appointmentTimeText = detail.appointmentDate;
        if (timeSlot.label) {
          appointmentTimeText += ' ' + timeSlot.label;
          if (timeSlot.start && timeSlot.end) {
            appointmentTimeText += ` (${timeSlot.start}-${timeSlot.end})`;
          }
        }
      }

      this.setData({
        detail,
        statusInfo,
        isTutorSide,
        currentUserId,
        subjectLabel: subject.label || '',
        timeSlotLabel: timeSlot.label || '',
        methodText,
        appointmentTimeText,
        createTimeText: util.formatTime(detail.createTime, 'YYYY-MM-DD HH:mm')
      });
    }

    util.hideLoading();
  },

  async onConfirm() {
    if (!util.checkLogin()) return;

    const confirmed = await util.showConfirm('确认接受此次试课预约？');
    if (!confirmed) return;

    util.showLoading('处理中...');
    try {
      const result = dataService.confirmTutorAppointment(this.data.id);
      if (result) {
        await util.showSuccess('已确认预约');
        this.loadDetail();
      } else {
        util.showError('操作失败');
      }
    } catch (e) {
      util.showError('操作失败，请重试');
    } finally {
      util.hideLoading();
    }
  },

  async onCancel() {
    if (!util.checkLogin()) return;

    const confirmed = await util.showConfirm('确认取消此次预约？取消后将无法恢复。');
    if (!confirmed) return;

    util.showLoading('处理中...');
    try {
      const result = dataService.cancelTutorAppointment(this.data.id);
      if (result) {
        await util.showSuccess('已取消预约');
        this.loadDetail();
      } else {
        util.showError('操作失败');
      }
    } catch (e) {
      util.showError('操作失败，请重试');
    } finally {
      util.hideLoading();
    }
  },

  async onStartSession() {
    if (!util.checkLogin()) return;

    const confirmed = await util.showConfirm('确认开始试课？开始后状态将变为试课中。');
    if (!confirmed) return;

    util.showLoading('处理中...');
    try {
      const result = dataService.startTutorSession(this.data.id);
      if (result) {
        await util.showSuccess('试课已开始');
        this.loadDetail();
      } else {
        util.showError('操作失败');
      }
    } catch (e) {
      util.showError('操作失败，请重试');
    } finally {
      util.hideLoading();
    }
  },

  async onComplete() {
    if (!util.checkLogin()) return;

    const confirmed = await util.showConfirm('确认完成此次试课？完成后可以进行评价。');
    if (!confirmed) return;

    util.showLoading('处理中...');
    try {
      const result = dataService.completeTutorAppointment(this.data.id);
      if (result) {
        await util.showSuccess('试课已完成');
        this.loadDetail();
      } else {
        util.showError('操作失败');
      }
    } catch (e) {
      util.showError('操作失败，请重试');
    } finally {
      util.hideLoading();
    }
  },

  onReview() {
    if (!util.checkLogin()) return;
    const { detail, isTutorSide } = this.data;
    const targetId = isTutorSide ? detail.studentId : detail.tutorId;
    util.navigateTo('/pages/tutor-review/index?appointmentId=' + this.data.id + '&targetId=' + targetId + '&role=' + (isTutorSide ? 'tutor' : 'student'));
  },

  onNavToTutor() {
    const { detail } = this.data;
    if (detail.tutorId) {
      util.navigateTo('/pages/tutor/detail?id=' + detail.tutorId);
    }
  },

  onNavToDemand() {
    const { detail } = this.data;
    if (detail.demandId) {
      util.navigateTo('/pages/tutor-demand/detail?id=' + detail.demandId);
    }
  }
});
