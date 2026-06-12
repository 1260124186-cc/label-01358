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
    content: '',
    cover: '',
    isTop: false,
    status: 'published',
    statusList: constants.PUBLISH_STATUS,
    statusIndex: 1,
    publishTimeText: '',
    publishDate: '',
    publishTimePart: '',
    publishTime: Date.now(),
    showStatusPicker: false,
    showDatePicker: false,
    submitting: false
  },

  _updatePublishParts(text) {
    return {
      publishTimeText: text,
      publishDate: text ? text.substring(0, 10) : '',
      publishTimePart: text ? text.substring(11, 16) : ''
    };
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id, isEdit: true });
      this.loadDetail(options.id);
      wx.setNavigationBarTitle({ title: '编辑公告' });
    } else {
      wx.setNavigationBarTitle({ title: '新增公告' });
      this.setData(this._updatePublishParts(util.formatTime(Date.now(), 'YYYY-MM-DD HH:mm')));
    }
  },

  loadDetail(id) {
    const detail = adminService.getAnnouncementById(id);
    if (detail) {
      const statusIndex = constants.PUBLISH_STATUS.findIndex(s => s.value === detail.status);
      this.setData({
        title: detail.title,
        content: detail.content,
        cover: detail.cover,
        isTop: !!detail.isTop,
        status: detail.status,
        statusIndex: statusIndex >= 0 ? statusIndex : 1,
        publishTime: detail.publishTime,
        ...this._updatePublishParts(util.formatTime(detail.publishTime, 'YYYY-MM-DD HH:mm'))
      });
    }
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
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
      ...this._updatePublishParts(util.formatTime(timestamp, 'YYYY-MM-DD HH:mm'))
    });
  },

  onTimeChange(e) {
    const time = e.detail.value;
    const current = util.formatTime(this.data.publishTime, 'YYYY-MM-DD');
    const dateTime = `${current} ${time}`;
    const timestamp = new Date(dateTime.replace(/-/g, '/')).getTime();
    this.setData({
      publishTime: timestamp,
      ...this._updatePublishParts(util.formatTime(timestamp, 'YYYY-MM-DD HH:mm'))
    });
  },

  stopBubble() {},

  async onSubmit() {
    const { id, isEdit, title, content, cover, isTop, status, publishTime, submitting } = this.data;

    if (submitting) return;

    if (!title.trim()) {
      util.showToast('请输入标题');
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
      content: content.trim(),
      cover,
      isTop,
      status,
      publishTime
    };

    setTimeout(() => {
      if (isEdit) {
        adminService.updateAnnouncement(id, data);
      } else {
        adminService.createAnnouncement(data);
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
