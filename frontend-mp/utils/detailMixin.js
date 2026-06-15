const dataService = require('../services/data');
const util = require('./util');

const DEFAULT_DETAIL_OPTIONS = {
  type: '',
  enableFavorite: true,
  enableShare: true,
  enableReport: true,
  enableContact: true,
  contactField: 'phone',
  contactNameField: 'contact',
  detailIdField: 'id',
  shareTitle: '',
  shareImage: '',
  reportPagePath: '/pages/report/index'
};

function mixinDetail(pageOptions, options = {}) {
  const config = { ...DEFAULT_DETAIL_OPTIONS, ...options };

  const originalOnLoad = pageOptions.onLoad;
  const originalOnShow = pageOptions.onShow;

  pageOptions.data = pageOptions.data || {};
  pageOptions.data.isFavorite = false;
  pageOptions.data.isOwner = false;
  pageOptions.data.showShareCard = false;
  pageOptions.data.detailConfig = config;

  pageOptions.onLoad = function (query) {
    this._detailId = query && query.id ? query.id : '';
    this._detailConfig = config;

    if (originalOnLoad) {
      originalOnLoad.call(this, query);
    }
  };

  pageOptions.onShow = function () {
    if (originalOnShow) {
      originalOnShow.call(this);
    }

    if (this._detailId && config.enableFavorite) {
      this.checkFavorite();
    }
  };

  pageOptions.checkFavorite = function () {
    if (!config.enableFavorite || !this._detailId) return;
    const isFavorite = dataService.isFavorite(this._detailId, config.type);
    this.setData({ isFavorite });
  };

  pageOptions.checkOwner = function (ownerId) {
    const app = getApp();
    const userInfo = app.globalData.userInfo || {};
    const currentUserId = userInfo.id || '';
    const isOwner = !!(currentUserId && ownerId && currentUserId === ownerId);
    this.setData({ isOwner });
    return isOwner;
  };

  pageOptions.onToggleFavorite = function () {
    if (!config.enableFavorite) return;
    if (!util.checkLogin()) return;

    const { isFavorite, detail } = this.data;

    if (isFavorite) {
      dataService.removeFavorite(this._detailId, config.type);
      this.setData({ isFavorite: false });
      util.showSuccess('已取消收藏');
    } else {
      dataService.addFavorite(detail, config.type);
      this.setData({ isFavorite: true });
      util.showSuccess('收藏成功');
    }
  };

  pageOptions.onShare = function () {
    if (!config.enableShare) return;
    if (wx.showShareMenu) {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });
    }
    this.setData({ showShareCard: true });
  };

  pageOptions.onCloseShareCard = function () {
    this.setData({ showShareCard: false });
  };

  pageOptions.onSaveShareImage = function () {
    const { detail } = this.data;
    if (!detail) return;

    const images = detail.images || [];
    if (images.length === 0) {
      util.showError('保存失败');
      return;
    }

    wx.showLoading({ title: '保存中...' });

    const imageUrl = images[0];

    const saveToAlbum = (filePath) => {
      wx.saveImageToPhotosAlbum({
        filePath,
        success: () => {
          wx.hideLoading();
          util.showSuccess('已保存到相册');
        },
        fail: (err) => {
          wx.hideLoading();
          if (err.errMsg && err.errMsg.includes('auth deny')) {
            wx.showModal({
              title: '提示',
              content: '需要您授权保存图片到相册',
              confirmText: '去授权',
              success: (res) => {
                if (res.confirm) {
                  wx.openSetting();
                }
              }
            });
          } else {
            util.showError('保存失败');
          }
        }
      });
    };

    if (imageUrl.startsWith('http')) {
      wx.downloadFile({
        url: imageUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            saveToAlbum(res.tempFilePath);
          } else {
            wx.hideLoading();
            util.showError('保存失败');
          }
        },
        fail: () => {
          wx.hideLoading();
          util.showError('保存失败');
        }
      });
    } else {
      saveToAlbum(imageUrl);
    }
  };

  pageOptions.onReport = function () {
    if (!config.enableReport) return;
    if (!util.checkLogin()) return;

    const { detail } = this.data;
    const targetId = detail && detail[config.detailIdField] ? detail[config.detailIdField] : this._detailId;
    util.navigateTo(`${config.reportPagePath}?targetType=${config.type}&targetId=${targetId}`);
  };

  pageOptions.onContact = function () {
    if (!config.enableContact) return;
    if (!util.checkLogin()) return;

    const { detail } = this.data;
    if (!detail) return;

    const phone = detail[config.contactField];
    if (!phone) {
      util.showToast('暂无联系方式');
      return;
    }

    wx.makePhoneCall({
      phoneNumber: phone,
      fail: () => {}
    });
  };

  pageOptions.onCopyContact = function () {
    const { detail } = this.data;
    if (!detail) return;

    const contact = detail[config.contactNameField] || detail[config.contactField] || '';
    if (!contact) {
      util.showToast('暂无联系方式');
      return;
    }

    wx.setClipboardData({
      data: contact,
      success: () => {
        util.showSuccess('已复制');
      }
    });
  };

  pageOptions.getShareTitle = function () {
    const { detail } = this.data;
    if (!detail) return config.shareTitle || '详情';
    return detail.title || detail.name || config.shareTitle || '详情';
  };

  pageOptions.getShareImage = function () {
    const { detail } = this.data;
    if (!detail) return config.shareImage || '';
    const images = detail.images || [];
    return images[0] || detail.cover || detail.image || config.shareImage || '';
  };

  pageOptions.getSharePath = function () {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    return `/${currentPage.route}?id=${this._detailId}`;
  };

  pageOptions.onShareAppMessage = function () {
    return {
      title: this.getShareTitle(),
      path: this.getSharePath(),
      imageUrl: this.getShareImage()
    };
  };

  pageOptions.onShareTimeline = function () {
    return {
      title: this.getShareTitle(),
      imageUrl: this.getShareImage()
    };
  };

  return pageOptions;
}

module.exports = {
  mixinDetail,
  DEFAULT_DETAIL_OPTIONS
};
