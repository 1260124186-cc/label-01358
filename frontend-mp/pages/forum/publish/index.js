const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const fileUtil = require('../../utils/file');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    formData: {
      type: 'qa',
      title: '',
      content: '',
      images: [],
      topics: [],
      isAnonymous: false
    },
    postTypes: constants.FORUM_POST_TYPES,
    topicList: constants.FORUM_TOPIC_LIST,
    topicLabels: [],
    showTopicPicker: false,
    submitting: false
  },

  onTypeSelect(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({ 'formData.type': type });
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({ [`formData.${field}`]: e.detail.value });
  },

  onToggleAnonymous() {
    this.setData({ 'formData.isAnonymous': !this.data.formData.isAnonymous });
  },

  onShowTopicPicker() { this.setData({ showTopicPicker: true }); },
  onHideTopicPicker() { this.setData({ showTopicPicker: false }); },

  onToggleTopic(e) {
    const { value } = e.currentTarget.dataset;
    let topics = [...this.data.formData.topics];
    const idx = topics.indexOf(value);
    if (idx > -1) {
      topics.splice(idx, 1);
    } else {
      if (topics.length >= 3) { util.showToast('最多选择3个话题'); return; }
      topics.push(value);
    }
    const topicLabels = topics.map(t => {
      const found = constants.FORUM_TOPIC_LIST.find(tp => tp.value === t);
      return found ? found.label : t;
    });
    this.setData({ 'formData.topics': topics, topicLabels });
  },

  async onChooseImage() {
    try {
      const remaining = 9 - this.data.formData.images.length;
      if (remaining <= 0) { util.showToast('最多上传9张图片'); return; }
      const tempFiles = await fileUtil.chooseImage(remaining);
      if (tempFiles.length > 0) {
        const images = [...this.data.formData.images, ...tempFiles];
        this.setData({ 'formData.images': images.slice(0, 9) });
      }
    } catch (e) { util.showError('选择图片失败'); }
  },

  onDeleteImage(e) {
    const { index } = e.currentTarget.dataset;
    const images = [...this.data.formData.images];
    images.splice(index, 1);
    this.setData({ 'formData.images': images });
  },

  validateForm() {
    const { formData } = this.data;
    if (!formData.title.trim()) { util.showToast('请输入标题'); return false; }
    if (formData.title.length > 50) { util.showToast('标题不能超过50字'); return false; }
    if (!formData.content.trim()) { util.showToast('请输入内容'); return false; }
    return true;
  },

  async onSubmit() {
    if (!this.validateForm()) return;
    this.setData({ submitting: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const savedImages = [];
      for (const tempPath of this.data.formData.images) {
        try {
          const fileName = fileUtil.generateFileName('jpg');
          const savedPath = await fileUtil.copyTempFile(tempPath, fileName);
          savedImages.push(savedPath);
        } catch (e) { savedImages.push(tempPath); }
      }
      const data = { ...this.data.formData, images: savedImages };
      const result = dataService.publishForumPost(data);
      if (result.success) {
        await util.showSuccess('发布成功');
        wx.navigateBack({ delta: 1, fail: () => { wx.switchTab({ url: '/pages/index/index' }); } });
      } else {
        util.showError(result.message || '发布失败');
      }
    } catch (e) { util.showError('发布失败，请重试'); }
    finally { this.setData({ submitting: false }); }
  }
});
