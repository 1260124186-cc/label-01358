const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const fileUtil = require('../../utils/file');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    id: '',
    detail: null,
    isFavorite: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id });
      this.loadDetail();
    }
  },

  onShow() {
    if (this.data.id) {
      this.checkFavorite();
    }
  },

  loadDetail() {
    const detail = dataService.getLostFoundDetail(this.data.id);

    if (detail) {
      const formattedDetail = {
        ...detail,
        timeText: util.relativeTime(detail.createTime),
        itemTypeText: constants.getLabelByValue(constants.ITEM_TYPES, detail.itemType),
        locationText: constants.getLabelByValue(constants.LOCATIONS, detail.location)
      };

      this.setData({ detail: formattedDetail });

      // 添加到浏览历史
      dataService.addHistory(detail, 'lostFound');

      // 检查收藏状态
      this.checkFavorite();
    }
  },

  checkFavorite() {
    const isFavorite = dataService.isFavorite(this.data.id, 'lostFound');
    this.setData({ isFavorite });
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    const urls = this.data.detail.images;
    fileUtil.previewImage(urls, urls[index]);
  },

  onToggleFavorite() {
    // 检查登录状态
    if (!util.checkLogin()) {
      return;
    }

    const { id, isFavorite, detail } = this.data;

    if (isFavorite) {
      dataService.removeFavorite(id, 'lostFound');
      this.setData({ isFavorite: false });
      util.showSuccess('已取消收藏');
    } else {
      dataService.addFavorite(detail, 'lostFound');
      this.setData({ isFavorite: true });
      util.showSuccess('收藏成功');
    }
  },

  onCallPhone() {
    // 检查登录状态
    if (!util.checkLogin()) {
      return;
    }

    const { phone } = this.data.detail;
    wx.makePhoneCall({
      phoneNumber: phone,
      fail: () => {
        // 用户取消或失败
      }
    });
  }
});
