const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    formData: {
      subject: '',
      grade: '',
      budgetRange: '',
      customBudgetMin: '',
      customBudgetMax: '',
      teachingMethod: '',
      weekdays: [],
      timeSlots: [],
      description: '',
      contactName: '',
      contactPhone: ''
    },
    subjects: constants.TUTOR_SUBJECTS,
    subjectIndex: -1,
    grades: constants.TUTOR_GRADES,
    gradeIndex: -1,
    hourlyRanges: constants.TUTOR_HOURLY_RANGES,
    budgetRangeIndex: 0,
    teachingMethods: constants.TUTOR_TEACHING_METHODS,
    teachingMethodIndex: -1,
    weekdays: constants.TUTOR_WEEKDAYS,
    timeSlots: constants.TUTOR_TIME_SLOTS,
    submitting: false,
    showCustomBudget: false
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  onSubjectChange(e) {
    const index = e.detail.value;
    const item = this.data.subjects[index];
    this.setData({
      subjectIndex: index,
      'formData.subject': item.value
    });
  },

  onGradeChange(e) {
    const index = e.detail.value;
    const item = this.data.grades[index];
    this.setData({
      gradeIndex: index,
      'formData.grade': item.value
    });
  },

  onBudgetRangeChange(e) {
    const index = e.detail.value;
    const item = this.data.hourlyRanges[index];
    const showCustom = item.value === 'custom';
    this.setData({
      budgetRangeIndex: index,
      'formData.budgetRange': item.value,
      showCustomBudget: showCustom
    });
  },

  onTeachingMethodChange(e) {
    const index = e.detail.value;
    const item = this.data.teachingMethods[index];
    this.setData({
      teachingMethodIndex: index,
      'formData.teachingMethod': item.value
    });
  },

  onWeekdayToggle(e) {
    const { value } = e.currentTarget.dataset;
    const weekdays = [...this.data.formData.weekdays];
    const idx = weekdays.indexOf(value);
    if (idx > -1) {
      weekdays.splice(idx, 1);
    } else {
      weekdays.push(value);
    }
    this.setData({
      'formData.weekdays': weekdays
    });
  },

  onTimeSlotToggle(e) {
    const { value } = e.currentTarget.dataset;
    const timeSlots = [...this.data.formData.timeSlots];
    const idx = timeSlots.indexOf(value);
    if (idx > -1) {
      timeSlots.splice(idx, 1);
    } else {
      timeSlots.push(value);
    }
    this.setData({
      'formData.timeSlots': timeSlots
    });
  },

  validateForm() {
    const { formData, showCustomBudget } = this.data;

    if (!formData.subject) {
      util.showToast('请选择辅导科目');
      return false;
    }

    if (!formData.grade) {
      util.showToast('请选择辅导年级');
      return false;
    }

    if (!formData.budgetRange) {
      util.showToast('请选择预算范围');
      return false;
    }

    if (showCustomBudget) {
      const min = Number(formData.customBudgetMin);
      const max = Number(formData.customBudgetMax);
      if (!min || min <= 0) {
        util.showToast('请输入最低预算');
        return false;
      }
      if (!max || max <= 0) {
        util.showToast('请输入最高预算');
        return false;
      }
      if (max < min) {
        util.showToast('最高预算不能低于最低预算');
        return false;
      }
    }

    if (!formData.teachingMethod) {
      util.showToast('请选择辅导方式');
      return false;
    }

    if (formData.weekdays.length === 0) {
      util.showToast('请选择可辅导时间（周几）');
      return false;
    }

    if (formData.timeSlots.length === 0) {
      util.showToast('请选择可辅导时间段');
      return false;
    }

    if (!formData.description.trim()) {
      util.showToast('请填写详细描述');
      return false;
    }

    if (!formData.contactName.trim()) {
      util.showToast('请输入联系人姓名');
      return false;
    }

    if (!formData.contactPhone.trim()) {
      util.showToast('请输入联系电话');
      return false;
    }

    if (!util.isValidPhone(formData.contactPhone)) {
      util.showToast('请输入正确的手机号');
      return false;
    }

    return true;
  },

  async onSubmit() {
    if (!this.validateForm()) return;

    this.setData({ submitting: true });
    util.showLoading('发布中...');

    try {
      const { formData, hourlyRanges, budgetRangeIndex } = this.data;
      const rangeItem = hourlyRanges[budgetRangeIndex];
      let budget = 0;
      let maxBudget = 0;

      if (formData.budgetRange === 'custom') {
        budget = Number(formData.customBudgetMin);
        maxBudget = Number(formData.customBudgetMax);
      } else if (rangeItem) {
        budget = rangeItem.min === 0 ? 0 : rangeItem.min;
        maxBudget = rangeItem.max === Infinity ? 9999 : rangeItem.max;
      }

      const submitData = {
        subject: formData.subject,
        grade: formData.grade,
        targetGrade: formData.grade,
        budget,
        maxBudget,
        teachingMethod: formData.teachingMethod,
        preferredDays: formData.weekdays,
        preferredTimeSlots: formData.timeSlots,
        description: formData.description.trim(),
        contactName: formData.contactName.trim(),
        contactPhone: formData.contactPhone.trim(),
        status: 'open'
      };

      const result = dataService.publishTutorDemand(submitData);

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
