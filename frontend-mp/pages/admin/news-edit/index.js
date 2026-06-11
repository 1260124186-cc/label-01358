const adminService = require('../../../services/adminService');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const fileUtil = require('../../../utils/file');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    id: '',
    isEdit: false,
    title: '',
    summary: '',
    content: '',
    cover: '',
    images: [],
    category: 'notice',
    categoryIndex: 0,
    categories: [],
    tags: [],
    tagInput: '',
    isTop: false,
    status: 'published',
    statusList: constants.PUBLISH_STATUS,
    statusIndex: 1,
    publishTimeText: '',
    publishTime: Date.now(),
    showCategoryPicker: false,
    showStatusPicker: false,
    submitting: false
  },

  onLoad(options) {
    const categories = constants.NEWS_CATEGORIES.filter(c => c.value !== 'all');
    this.setData({ categories });

    if (options.id) {
      this.setData({ id: options.id, isEdit: true });
      this.loadDetail(options.id);
      wx.setNavigationBarTitle({ title: '编辑动态' });
    } else {
      wx.setNavigationBarTitle({ title: '新增动态' });
      this.setData({
        category: categories[0] ? categories[0].value : 'notice',
        publishTimeText: util.formatTime(Date.now(), 'YYYY-MM-DD HH:mm')
      });
    }
  },

  loadDetail(id) {
    const detail = adminService.getCampusNewsById(id);
    if (detail) {
      const statusIndex = constants.PUBLISH_STATUS.findIndex(s => s.value === detail.status);
      const categoryIndex = this.data.categories.findIndex(c => c.value === detail.category);
      this.setData({
        title: detail.title,
        summary: detail.summary,
        content: detail.content,
        cover: detail.cover,
        images: detail.images || [],
        category: detail.category,
        categoryIndex: categoryIndex >= 0 ? categoryIndex : 0,
        tags: detail.tags || [],
        isTop: !!detail.isTop,
        status: detail.status,
        statusIndex: statusIndex >= 0 ? statusIndex : 1,
        publishTime: detail.publishTime,
        publishTimeText: util.formatTime(detail.publishTime, 'YYYY-MM-DD HH:mm')
      });
    }
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  onSummaryInput(e) {
    this.setData({ summary: e.detail.value });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  onTagInput(e) {
    this.setData({ tagInput: e.detail.value });
  },

  onAddTag() {
    const { tagInput, tags } = this.data;
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) {
      util.showToast('标签已存在');
      return;
    }
    if (tags.length >= 5) {
      util.showToast('最多添加5个标签');
      return;
    }
    this.setData({
      tags: [...tags, trimmed],
      tagInput: ''
    });
  },

  onRemoveTag(e) {
    const { index } = e.currentTarget.dataset;
    const tags = this.data.tags.slice();
    tags.splice(index, 1);
    this.setData({ tags });
  },

  onToggleTop() {
    this.setData({ isTop: !this.data.isTop });
  },

  onChooseCover() {
    fileUtil.chooseImage(1, ['compressed'], ['album', 'camera']).then(paths => {
      if (paths && paths.length > 0) {
        this.setData({ cover: paths[0] });
      }
    }).catch(err => {
      console.error('选择图片失败:', err);
      util.showError('选择图片失败');
    });
  },

  onPreviewCover() {
    if (this.data.cover) {
      fileUtil.previewImage([this.data.cover]);
    }
  },

  onRemoveCover() {
    util.showConfirm('确定要删除封面吗？').then(confirm => {
      if (confirm) {
        this.setData({ cover: '' });
      }
    });
  },

  onAddImages() {
    const remaining = 9 - this.data.images.length;
    if (remaining <= 0) {
      util.showToast('最多添加9张图片');
      return;
    }
    fileUtil.chooseImage(remaining, ['compressed'], ['album', 'camera']).then(paths => {
      if (paths && paths.length > 0) {
        this.setData({
          images: [...this.data.images, ...paths].slice(0, 9)
        });
      }
    }).catch(err => {
      console.error('选择图片失败:', err);
      util.showError('选择图片失败');
    });
  },

  onPreviewImage(e) {
    const { src } = e.currentTarget.dataset;
    fileUtil.previewImage(this.data.images, src);
  },

  onRemoveImage(e) {
    const { index } = e.currentTarget.dataset;
    const images = this.data.images.slice();
    images.splice(index, 1);
    this.setData({ images });
  },

  onCategoryTap() {
    this.setData({ showCategoryPicker: true });
  },

  onCategorySelect(e) {
    const { value, index } = e.currentTarget.dataset;
    this.setData({
      category: value,
      categoryIndex: index,
      showCategoryPicker: false
    });
  },

  onCloseCategoryPicker() {
    this.setData({ showCategoryPicker: false });
  },

  onStatusTap() {
    this.setData({ showStatusPicker: true });
  },

  onStatusSelect(e) {
    const { value, index } = e.currentTarget.dataset;
    this.setData({
      status: value,
      statusIndex: index,
      showStatusPicker: false
    });
  },

  onCloseStatusPicker() {
    this.setData({ showStatusPicker: false });
  },

  onDateChange(e) {
    const date = e.detail.value;
    const current = util.formatTime(this.data.publishTime, 'HH:mm');
    const dateTime = `${date} ${current}`;
    const timestamp = new Date(dateTime.replace(/-/g, '/')).getTime();
    this.setData({
      publishTime: timestamp,
      publishTimeText: util.formatTime(timestamp, 'YYYY-MM-DD HH:mm')
    });
  },

  onTimeChange(e) {
    const time = e.detail.value;
    const current = util.formatTime(this.data.publishTime, 'YYYY-MM-DD');
    const dateTime = `${current} ${time}`;
    const timestamp = new Date(dateTime.replace(/-/g, '/')).getTime();
    this.setData({
      publishTime: timestamp,
      publishTimeText: util.formatTime(timestamp, 'YYYY-MM-DD HH:mm')
    });
  },

  stopBubble() {},

  async onSubmit() {
    const { id, isEdit, title, summary, content, cover, images, category, tags, isTop, status, publishTime, submitting } = this.data;

    if (submitting) return;

    if (!title.trim()) {
      util.showToast('请输入标题');
      return;
    }

    if (!summary.trim()) {
      util.showToast('请输入摘要');
      return;
    }

    if (!content.trim()) {
      util.showToast('请输入内容');
      return;
    }

    this.setData({ submitting: true });
    util.showLoading('保存中...');

    const data = {
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      cover,
      images,
      category,
      tags,
      isTop,
      status,
      publishTime
    };

    setTimeout(() => {
      if (isEdit) {
        adminService.updateCampusNews(id, data);
      } else {
        adminService.createCampusNews(data);
      }

      util.hideLoading();
      this.setData({ submitting: false });
      util.showSuccess(isEdit ? '修改成功' : '创建成功');

      setTimeout(() => {
        util.navigateBack();
      }, 1200);
    }, 500);
  }
});
