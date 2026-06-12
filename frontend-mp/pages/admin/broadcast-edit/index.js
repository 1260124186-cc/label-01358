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
    description: '',
    audioUrl: '',
    audioUrlDisplay: '',
    cover: '',
    anchor: '',
    duration: 0,
    durationText: '00:00',
    status: 'published',
    statusList: constants.PUBLISH_STATUS,
    statusIndex: 1,
    publishTimeText: '',
    publishDate: '',
    publishTimePart: '',
    publishTime: Date.now(),
    showStatusPicker: false,
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
      wx.setNavigationBarTitle({ title: '编辑节目' });
    } else {
      wx.setNavigationBarTitle({ title: '新增节目' });
      this.setData(this._updatePublishParts(util.formatTime(Date.now(), 'YYYY-MM-DD HH:mm')));
    }
  },

  loadDetail(id) {
    const detail = adminService.getBroadcastProgramById(id);
    if (detail) {
      const statusIndex = constants.PUBLISH_STATUS.findIndex(s => s.value === detail.status);
      this.setData({
        title: detail.title,
        description: detail.description,
        audioUrl: detail.audioUrl,
        audioUrlDisplay: detail.audioUrl && detail.audioUrl.length > 50 ? detail.audioUrl.substring(0, 50) + '...' : (detail.audioUrl || ''),
        cover: detail.cover,
        anchor: detail.anchor,
        duration: detail.duration || 0,
        durationText: this.formatDuration(detail.duration),
        status: detail.status,
        statusIndex: statusIndex >= 0 ? statusIndex : 1,
        publishTime: detail.publishTime,
        ...this._updatePublishParts(util.formatTime(detail.publishTime, 'YYYY-MM-DD HH:mm'))
      });
    }
  },

  formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  },

  parseDuration(text) {
    const parts = text.split(':');
    if (parts.length === 2) {
      const mins = parseInt(parts[0]) || 0;
      const secs = parseInt(parts[1]) || 0;
      return mins * 60 + secs;
    }
    return 0;
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  onDescInput(e) {
    this.setData({ description: e.detail.value });
  },

  onAudioUrlInput(e) {
    const audioUrl = e.detail.value;
    this.setData({
      audioUrl,
      audioUrlDisplay: audioUrl && audioUrl.length > 50 ? audioUrl.substring(0, 50) + '...' : (audioUrl || '')
    });
  },

  onAnchorInput(e) {
    this.setData({ anchor: e.detail.value });
  },

  onDurationInput(e) {
    const value = e.detail.value;
    const seconds = this.parseDuration(value);
    this.setData({
      durationText: this.formatDuration(seconds),
      duration: seconds
    });
  },

  onDurationBlur(e) {
    const value = e.detail.value;
    const seconds = this.parseDuration(value);
    this.setData({
      durationText: this.formatDuration(seconds),
      duration: seconds
    });
  },

  async onChooseAudio() {
    try {
      const res = await new Promise((resolve, reject) => {
        wx.chooseMessageFile({
          count: 1,
          type: 'file',
          extension: ['mp3', 'wav', 'aac', 'm4a'],
          success: resolve,
          fail: reject
        });
      });

      if (res.tempFiles && res.tempFiles.length > 0) {
        const file = res.tempFiles[0];
        this.setData({
          audioUrl: file.path,
          audioUrlDisplay: file.path && file.path.length > 50 ? file.path.substring(0, 50) + '...' : (file.path || ''),
          duration: Math.floor((file.size || 0) / 16000) || 180,
          durationText: this.formatDuration(Math.floor((file.size || 0) / 16000) || 180)
        });
        util.showToast('音频选择成功');
      }
    } catch (err) {
      util.showError('选择音频失败');
    }
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
    const { id, isEdit, title, description, audioUrl, cover, anchor, duration, status, publishTime, submitting } = this.data;

    if (submitting) return;

    if (!title.trim()) {
      util.showToast('请输入节目名称');
      return;
    }

    if (!audioUrl.trim()) {
      util.showToast('请上传或填写音频地址');
      return;
    }

    this.setData({ submitting: true });
    util.showLoading('保存中...');

    const data = {
      title: title.trim(),
      description: description.trim(),
      audioUrl: audioUrl.trim(),
      cover,
      anchor: anchor.trim(),
      duration,
      status,
      publishTime
    };

    setTimeout(() => {
      if (isEdit) {
        adminService.updateBroadcastProgram(id, data);
      } else {
        adminService.createBroadcastProgram(data);
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
