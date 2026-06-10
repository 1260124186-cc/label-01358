const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    formData: {
      title: '',
      category: '',
      description: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      location: '',
      requiredCount: '',
      hours: '',
      contactName: '',
      contactPhone: ''
    },
    categories: constants.VOLUNTEER_CATEGORIES,
    categoryIndex: -1,
    submitting: false
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  onCategoryChange(e) {
    const index = e.detail.value;
    const item = this.data.categories[index];
    this.setData({
      categoryIndex: index,
      'formData.category': item.value
    });
  },

  onStartDateChange(e) {
    this.setData({ 'formData.startDate': e.detail.value });
  },

  onStartTimeChange(e) {
    this.setData({ 'formData.startTime': e.detail.value });
  },

  onEndDateChange(e) {
    this.setData({ 'formData.endDate': e.detail.value });
  },

  onEndTimeChange(e) {
    this.setData({ 'formData.endTime': e.detail.value });
  },

  validateForm() {
    const { formData } = this.data;

    if (!formData.title.trim()) {
      util.showToast('请输入活动标题');
      return false;
    }

    if (!formData.category) {
      util.showToast('请选择活动分类');
      return false;
    }

    if (!formData.startDate || !formData.startTime) {
      util.showToast('请选择开始时间');
      return false;
    }

    if (!formData.endDate || !formData.endTime) {
      util.showToast('请选择结束时间');
      return false;
    }

    const startMs = new Date(formData.startDate + ' ' + formData.startTime).getTime();
    const endMs = new Date(formData.endDate + ' ' + formData.endTime).getTime();
    if (endMs <= startMs) {
      util.showToast('结束时间必须晚于开始时间');
      return false;
    }

    if (!formData.location.trim()) {
      util.showToast('请输入活动地点');
      return false;
    }

    if (!formData.requiredCount || Number(formData.requiredCount) <= 0) {
      util.showToast('请输入招募人数');
      return false;
    }

    if (!formData.hours || Number(formData.hours) <= 0) {
      util.showToast('请输入志愿时长');
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
        title: formData.title.trim(),
        category: formData.category,
        description: formData.description.trim(),
        startTime: formData.startDate + ' ' + formData.startTime,
        endTime: formData.endDate + ' ' + formData.endTime,
        location: formData.location.trim(),
        requiredCount: Number(formData.requiredCount),
        hours: Number(formData.hours),
        contactName: formData.contactName.trim(),
        contactPhone: formData.contactPhone.trim(),
        status: 'recruiting'
      };

      const result = dataService.publishVolunteerActivity(submitData);

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
