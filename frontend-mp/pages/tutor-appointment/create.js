const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    tutorId: '',
    demandId: '',
    targetInfo: null,
    isTutorMode: false,
    subjectMap: {},
    timeSlots: constants.TUTOR_TIME_SLOTS,
    timeSlotIndex: -1,
    methodOptions: [
      { value: 'online', label: '线上辅导', icon: '💻' },
      { value: 'offline', label: '线下辅导', icon: '🏫' }
    ],
    formData: {
      appointmentDate: '',
      timeSlot: '',
      teachingMethod: '',
      location: '',
      remark: ''
    },
    submitting: false
  },

  onLoad(options) {
    const subjectMap = {};
    constants.TUTOR_SUBJECTS.forEach(s => {
      subjectMap[s.value] = s;
    });

    this.setData({ subjectMap });

    if (options.tutorId) {
      this.setData({
      tutorId: options.tutorId,
      isTutorMode: true
    });
      this.loadTutorInfo(options.tutorId);
    } else if (options.demandId) {
      this.setData({
        demandId: options.demandId,
        isTutorMode: false
      });
      this.loadDemandInfo(options.demandId);
    }
  },

  loadTutorInfo(tutorId) {
    const tutor = dataService.getTutorDetail(tutorId);
    if (tutor) {
      const subjectList = (tutor.subjects || []).map(s => {
        const subj = this.data.subjectMap[s] || {};
        return subj.label || s;
      });
      this.setData({
        targetInfo: {
          ...tutor,
          displayName: tutor.tutorName,
          displayAvatar: tutor.tutorAvatar,
          subjectListText: subjectList.join('、'),
          rateText: `¥${tutor.hourlyRate || 0}/小时`,
          ratingText: (tutor.rating || 0).toFixed(1) + '分',
          collegeText: tutor.college || ''
        }
      });
    }
  },

  loadDemandInfo(demandId) {
    const demand = dataService.getTutorDemandDetail(demandId);
    if (demand) {
      const subject = this.data.subjectMap[demand.subject] || {};
      const gradeMap = {};
      constants.TUTOR_GRADES.forEach(g => {
        gradeMap[g.value] = g.label;
      });
      this.setData({
        targetInfo: {
          ...demand,
          displayName: demand.studentName,
          displayAvatar: demand.studentAvatar,
          subjectListText: subject.label || '',
          rateText: `预算: ¥${demand.budget || demand.maxBudget || 0}/小时`,
          gradeText: gradeMap[demand.grade] || '',
          targetGradeText: gradeMap[demand.targetGrade] || '',
          budgetText: `预算: ¥${demand.budget || 0}`,
          locationText: demand.location || ''
        }
      });
    }
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  onDateChange(e) {
    this.setData({ 'formData.appointmentDate': e.detail.value });
  },

  onTimeSlotTap(e) {
    const { index } = e.currentTarget.dataset;
    const slot = this.data.timeSlots[index];
    this.setData({
      timeSlotIndex: index,
      'formData.timeSlot': slot.value
    });
  },

  onMethodTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      'formData.teachingMethod': value
    });
  },

  validateForm() {
    const { formData } = this.data;

    if (!formData.appointmentDate) {
      util.showToast('请选择试课日期');
      return false;
    }

    if (!formData.timeSlot) {
      util.showToast('请选择试课时间段');
      return false;
    }

    if (!formData.teachingMethod) {
      util.showToast('请选择辅导方式');
      return false;
    }

    if (formData.teachingMethod === 'offline' && !formData.location.trim()) {
      util.showToast('请输入线下地点');
      return false;
    }

    return true;
  },

  async onSubmit() {
    if (!util.checkLogin()) return;
    if (!this.validateForm()) return;

    this.setData({ submitting: true });
    util.showLoading('提交中...');

    try {
      const app = getApp();
      const userInfo = app.globalData.userInfo || {};
      const { formData, isTutorMode, tutorId, demandId, targetInfo } = this.data;

      let tutorUserId = '';
      let tutorName = '';
      let tutorAvatar = '';
      let studentUserId = '';
      let studentName = '';
      let studentAvatar = '';
      let subject = '';
      let actualTutorId = '';

      if (isTutorMode) {
        tutorUserId = targetInfo.tutorId || '';
        actualTutorId = tutorId;
        tutorName = targetInfo.tutorName || '';
        tutorAvatar = targetInfo.tutorAvatar || '';
        studentUserId = userInfo.id || 'test_user';
        studentName = userInfo.nickName || '匿名用户';
        studentAvatar = userInfo.avatarUrl || '';
        subject = (targetInfo.subjects && targetInfo.subjects[0]) || '';
      } else {
        actualTutorId = '';
        tutorUserId = userInfo.id || 'test_user';
        tutorName = userInfo.nickName || '匿名用户';
        tutorAvatar = userInfo.avatarUrl || '';
        studentUserId = targetInfo.publisherId || '';
        studentName = targetInfo.studentName || '';
        studentAvatar = targetInfo.studentAvatar || '';
        subject = targetInfo.subject || '';
      }

      const submitData = {
        tutorId: actualTutorId || tutorUserId,
        tutorUserId,
        tutorName,
        tutorAvatar,
        studentId: studentUserId,
        studentName,
        studentAvatar,
        demandId: demandId || '',
        subject,
        appointmentDate: formData.appointmentDate,
        timeSlot: formData.timeSlot,
        teachingMethod: formData.teachingMethod,
        location: formData.location.trim(),
        remark: formData.remark.trim()
      };

      const result = dataService.createTutorAppointment(submitData);

      if (result) {
        await util.showSuccess('预约提交成功');
        util.navigateTo('/pages/tutor-appointment/detail?id=' + result.id);
      } else {
        util.showError('提交失败，请重试');
      }
    } catch (e) {
      util.showError('提交失败，请重试');
    } finally {
      this.setData({ submitting: false });
      util.hideLoading();
    }
  }
});
