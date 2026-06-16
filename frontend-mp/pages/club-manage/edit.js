const dataService = require('../../services/data');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    clubId: '',
    club: null,
    name: '',
    description: '',
    cover: '',
    type: '',
    saving: false
  },

  onLoad(options) {
    this.setData({ clubId: options.clubId });
    this.loadData();
  },

  loadData() {
    util.showLoading();
    const club = dataService.getClubDetail(this.data.clubId);
    if (!club) {
      util.hideLoading();
      util.showToast('社团不存在');
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }

    this.setData({
      club,
      name: club.name || '',
      description: club.description || '',
      cover: club.cover || '',
      type: club.type || ''
    });
    util.hideLoading();
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  onDescInput(e) {
    this.setData({ description: e.detail.value });
  },

  onChooseCover() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({ cover: tempFilePath });
      }
    });
  },

  onSave() {
    if (!this.data.name.trim()) {
      util.showToast('请输入社团名称');
      return;
    }
    if (!this.data.description.trim()) {
      util.showToast('请输入社团简介');
      return;
    }

    this.setData({ saving: true });

    const updates = {
      name: this.data.name.trim(),
      description: this.data.description.trim(),
      cover: this.data.cover
    };

    setTimeout(() => {
      const result = dataService.updateClubInfo(this.data.clubId, updates);
      this.setData({ saving: false });

      if (result.success) {
        util.showToast('保存成功');
        setTimeout(() => {
          wx.navigateBack();
        }, 800);
      } else {
        util.showToast(result.message || '保存失败');
      }
    }, 500);
  }
});
