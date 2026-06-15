const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    formData: {
      subjects: [],
      grades: [],
      hourlyRate: '',
      teachingMethod: '',
      availableDays: [],
      availableTimeSlots: [],
      intro: '',
      gradeProofImages: []
    },
    subjects: constants.TUTOR_SUBJECTS,
    grades: constants.TUTOR_GRADES,
    teachingMethods: constants.TUTOR_TEACHING_METHODS,
    weekdays: constants.TUTOR_WEEKDAYS,
    timeSlots: constants.TUTOR_TIME_SLOTS,
    proofImageLimit: 3,
    submitting: false
  },

  onSubjectToggle(e) {
    const { value } = e.currentTarget.dataset;
    const subjects = [...this.data.formData.subjects];
    const idx = subjects.indexOf(value);
    if (idx > -1) {
      subjects.splice(idx, 1);
    } else {
      subjects.push(value);
    }
    this.setData({ 'formData.subjects': subjects });
  },

  onGradeToggle(e) {
    const { value } = e.currentTarget.dataset;
    const grades = [...this.data.formData.grades];
    const idx = grades.indexOf(value);
    if (idx > -1) {
      grades.splice(idx, 1);
    } else {
      grades.push(value);
    }
    this.setData({ 'formData.grades': grades });
  },

  onHourlyRateInput(e) {
    const { value } = e.detail;
    this.setData({ 'formData.hourlyRate': value });
  },

  onMethodSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ 'formData.teachingMethod': value });
  },

  onWeekdayToggle(e) {
    const { value } = e.currentTarget.dataset;
    const availableDays = [...this.data.formData.availableDays];
    const idx = availableDays.indexOf(value);
    if (idx > -1) {
      availableDays.splice(idx, 1);
    } else {
      availableDays.push(value);
    }
    this.setData({ 'formData.availableDays': availableDays });
  },

  onTimeSlotToggle(e) {
    const { value } = e.currentTarget.dataset;
    const availableTimeSlots = [...this.data.formData.availableTimeSlots];
    const idx = availableTimeSlots.indexOf(value);
    if (idx > -1) {
      availableTimeSlots.splice(idx, 1);
    } else {
      availableTimeSlots.push(value);
    }
    this.setData({ 'formData.availableTimeSlots': availableTimeSlots });
  },

  onIntroInput(e) {
    const { value } = e.detail;
    this.setData({ 'formData.intro': value });
  },

  async onChooseProofImages() {
    const remaining = this.data.proofImageLimit - this.data.formData.gradeProofImages.length;
    if (remaining <= 0) {
      util.showToast('最多上传' + this.data.proofImageLimit + '张图片');
      return;
    }

    try {
      const res = await new Promise((resolve, reject) => {
        wx.chooseMedia({
          count: remaining,
          mediaType: ['image'],
          sourceType: ['album', 'camera'],
          sizeType: ['compressed'],
          success: resolve,
          fail: reject
        });
      });

      const tempFiles = res.tempFiles || [];
      const newImages = tempFiles.map(f => f.tempFilePath);
      const images = [...this.data.formData.gradeProofImages, ...newImages].slice(0, this.data.proofImageLimit);
      this.setData({ 'formData.gradeProofImages': images });
    } catch (e) {
      if (e && e.errMsg && e.errMsg.indexOf('cancel') === -1) {
        util.showToast('选择图片失败');
      }
    }
  },

  onRemoveProofImage(e) {
    const { index } = e.currentTarget.dataset;
    const images = [...this.data.formData.gradeProofImages];
    images.splice(index, 1);
    this.setData({ 'formData.gradeProofImages': images });
  },

  onPreviewProofImage(e) {
    const { index } = e.currentTarget.dataset;
    const urls = this.data.formData.gradeProofImages;
    wx.previewImage({
      current: urls[index],
      urls: urls
    });
  },

  validateForm() {
    const { formData } = this.data;

    if (!formData.subjects || formData.subjects.length === 0) {
      util.showToast('请选择擅长科目');
      return false;
    }

    if (!formData.grades || formData.grades.length === 0) {
      util.showToast('请选择辅导年级');
      return false;
    }

    if (!formData.hourlyRate || Number(formData.hourlyRate) <= 0) {
      util.showToast('请输入有效的时薪');
      return false;
    }

    if (Number(formData.hourlyRate) > 1000) {
      util.showToast('时薪不能超过1000元');
      return false;
    }

    if (!formData.teachingMethod) {
      util.showToast('请选择辅导方式');
      return false;
    }

    if ((!formData.availableDays || formData.availableDays.length === 0) &&
        (!formData.availableTimeSlots || formData.availableTimeSlots.length === 0)) {
      util.showToast('请选择可辅导时间');
      return false;
    }

    if (!formData.intro || formData.intro.trim().length < 10) {
      util.showToast('个人简介至少10个字');
      return false;
    }

    if (formData.intro.length > 500) {
      util.showToast('个人简介不能超过500字');
      return false;
    }

    return true;
  },

  async onSubmit() {
    if (!this.validateForm()) return;

    this.setData({ submitting: true });
    util.showLoading('发布中...');

    try {
      const { formData } = this.data;
      const submitData = {
        subjects: formData.subjects,
        grades: formData.grades,
        hourlyRate: Number(formData.hourlyRate),
        teachingMethod: formData.teachingMethod,
        availableDays: formData.availableDays,
        availableTimeSlots: formData.availableTimeSlots,
        intro: formData.intro.trim(),
        gradeProofImages: formData.gradeProofImages
      };

      const result = dataService.publishTutorProfile(submitData);

      if (result) {
        await util.showSuccess('发布成功');
        util.navigateBack();
      } else {
        util.showError('发布失败，请重试');
      }
    } catch (e) {
      util.showError('发布失败，请重试');
    } finally {
      this.setData({ submitting: false });
      util.hideLoading();
    }
  }
});
