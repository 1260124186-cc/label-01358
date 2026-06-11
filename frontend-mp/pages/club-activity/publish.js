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
      clubId: '',
      clubName: '',
      cover: '',
      description: '',
      activityDate: '',
      activityTime: '',
      endDate: '',
      endTime: '',
      location: '',
      capacity: '',
      deadlineDate: '',
      deadlineTime: '',
      fee: 0,
      tags: [],
      organizerName: '',
      organizerPhone: ''
    },
    categories: constants.CLUB_ACTIVITY_CATEGORIES,
    categoryIndex: -1,
    clubList: [],
    clubIndex: -1,
    submitting: false,
    tagInput: ''
  },

  onLoad() {
    const clubs = dataService.getClubList();
    this.setData({
      clubList: clubs.map(c => ({ id: c.id, name: c.name }))
    });
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

  onClubChange(e) {
    const index = e.detail.value;
    const item = this.data.clubList[index];
    this.setData({
      clubIndex: index,
      'formData.clubId': item.id,
      'formData.clubName': item.name
    });
  },

  onActivityDateChange(e) {
    this.setData({ 'formData.activityDate': e.detail.value });
  },
  onActivityTimeChange(e) {
    this.setData({ 'formData.activityTime': e.detail.value });
  },
  onEndDateChange(e) {
    this.setData({ 'formData.endDate': e.detail.value });
  },
  onEndTimeChange(e) {
    this.setData({ 'formData.endTime': e.detail.value });
  },
  onDeadlineDateChange(e) {
    this.setData({ 'formData.deadlineDate': e.detail.value });
  },
  onDeadlineTimeChange(e) {
    this.setData({ 'formData.deadlineTime': e.detail.value });
  },

  onTagInput(e) {
    this.setData({ tagInput: e.detail.value });
  },

  onAddTag() {
    const tag = this.data.tagInput.trim();
    if (!tag) return;
    if (this.data.formData.tags.includes(tag)) {
      util.showToast('该标签已存在');
      return;
    }
    if (this.data.formData.tags.length >= 5) {
      util.showToast('最多添加5个标签');
      return;
    }
    const tags = [...this.data.formData.tags, tag];
    this.setData({
      'formData.tags': tags,
      tagInput: ''
    });
  },

  onRemoveTag(e) {
    const { index } = e.currentTarget.dataset;
    const tags = this.data.formData.tags.filter((_, i) => i !== index);
    this.setData({ 'formData.tags': tags });
  },

  onChooseCover() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const file = res.tempFiles[0];
        this.setData({
          'formData.cover': file.tempFilePath
        });
      }
    });
  },

  validateForm() {
    const { formData } = this.data;

    if (!formData.title.trim()) {
      util.showToast('请输入活动标题');
      return false;
    }
    if (!formData.clubId) {
      util.showToast('请选择所属社团');
      return false;
    }
    if (!formData.category) {
      util.showToast('请选择活动分类');
      return false;
    }
    if (!formData.cover) {
      util.showToast('请上传活动封面');
      return false;
    }
    if (!formData.activityDate || !formData.activityTime) {
      util.showToast('请选择活动开始时间');
      return false;
    }
    if (!formData.endDate || !formData.endTime) {
      util.showToast('请选择活动结束时间');
      return false;
    }
    if (!formData.location.trim()) {
      util.showToast('请输入活动地点');
      return false;
    }
    if (!formData.capacity || Number(formData.capacity) <= 0) {
      util.showToast('请输入人数上限');
      return false;
    }
    if (!formData.deadlineDate || !formData.deadlineTime) {
      util.showToast('请选择报名截止时间');
      return false;
    }
    if (!formData.description.trim()) {
      util.showToast('请输入活动详情');
      return false;
    }

    const startMs = new Date(formData.activityDate + ' ' + formData.activityTime).getTime();
    const endMs = new Date(formData.endDate + ' ' + formData.endTime).getTime();
    const deadlineMs = new Date(formData.deadlineDate + ' ' + formData.deadlineTime).getTime();

    if (endMs <= startMs) {
      util.showToast('结束时间必须晚于开始时间');
      return false;
    }
    if (deadlineMs >= startMs) {
      util.showToast('报名截止必须早于活动开始');
      return false;
    }
    if (deadlineMs <= Date.now()) {
      util.showToast('报名截止时间必须晚于当前');
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
        clubId: formData.clubId,
        clubName: formData.clubName,
        category: formData.category,
        cover: formData.cover,
        description: formData.description.trim(),
        activityTime: formData.activityDate + ' ' + formData.activityTime,
        endTime: formData.endDate + ' ' + formData.endTime,
        location: formData.location.trim(),
        capacity: Number(formData.capacity),
        deadline: formData.deadlineDate + ' ' + formData.deadlineTime,
        fee: Number(formData.fee) || 0,
        tags: formData.tags,
        organizerName: formData.organizerName.trim() || '管理员',
        organizerPhone: formData.organizerPhone.trim(),
        images: [formData.cover],
        checkInCode: 'CHECKIN-' + Date.now().toString(36).toUpperCase()
      };

      const result = dataService.publishClubActivity(submitData);

      if (result) {
        await util.showSuccess('发布成功');
        setTimeout(() => {
          wx.navigateBack();
        }, 800);
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
