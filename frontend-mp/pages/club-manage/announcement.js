const dataService = require('../../services/data');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    clubId: '',
    announcements: [],
    showPublish: false,
    title: '',
    content: '',
    isImportant: false
  },

  onLoad(options) {
    this.setData({ clubId: options.clubId });
    this.loadData();
  },

  onShow() {
    if (this.data.clubId) {
      this.loadData();
    }
  },

  loadData() {
    util.showLoading();
    const announcements = dataService.getClubAnnouncements(this.data.clubId);
    const formattedList = announcements
      .sort((a, b) => b.createTime - a.createTime)
      .map(item => ({
        ...item,
        createTimeText: util.formatTime(item.createTime, 'YYYY-MM-DD HH:mm')
      }));
    
    this.setData({ announcements: formattedList });
    util.hideLoading();
  },

  onPublishTap() {
    this.setData({ showPublish: true });
  },

  onClosePublish() {
    this.setData({
      showPublish: false,
      title: '',
      content: '',
      isImportant: false
    });
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  onToggleImportant() {
    this.setData({ isImportant: !this.data.isImportant });
  },

  onSubmit() {
    if (!this.data.title.trim()) {
      util.showToast('请输入标题');
      return;
    }
    if (!this.data.content.trim()) {
      util.showToast('请输入内容');
      return;
    }

    const result = dataService.publishClubAnnouncement(
      this.data.clubId,
      this.data.title.trim(),
      this.data.content.trim(),
      this.data.isImportant
    );

    if (result.success) {
      util.showToast('发布成功');
      this.onClosePublish();
      this.loadData();
    } else {
      util.showToast(result.message || '发布失败');
    }
  },

  onDelete(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '删除公告',
      content: '确定删除该公告？',
      success: (res) => {
        if (res.confirm) {
          const result = dataService.deleteClubAnnouncement(this.data.clubId, id);
          if (result.success) {
            util.showToast('已删除');
            this.loadData();
          } else {
            util.showToast(result.message || '删除失败');
          }
        }
      }
    });
  }
});
