const dataService = require('../../services/data');
const config = require('../../config/index');
const util = require('../../utils/util');
const fileUtil = require('../../utils/file');

Page({
  data: {
    id: '',
    detail: null,
    isFavorite: false,
    currentImageIndex: 0
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
    const detail = dataService.getMarketDetail(this.data.id);
    
    if (detail) {
      const formattedDetail = {
        ...detail,
        priceText: util.formatPrice(detail.price),
        originalPriceText: detail.originalPrice ? util.formatPrice(detail.originalPrice) : '',
        timeText: util.relativeTime(detail.createTime),
        categoryText: config.getLabelByValue(config.MARKET_CATEGORIES, detail.category),
        statusText: config.getLabelByValue(config.MARKET_STATUS, detail.status)
      };
      
      this.setData({ detail: formattedDetail });
      
      // 增加浏览量
      dataService.increaseMarketViews(this.data.id);
      
      // 添加到浏览历史
      dataService.addHistory(detail, 'market');
      
      // 检查收藏状态
      this.checkFavorite();
    }
  },

  checkFavorite() {
    const isFavorite = dataService.isFavorite(this.data.id, 'market');
    this.setData({ isFavorite });
  },

  onSwiperChange(e) {
    this.setData({
      currentImageIndex: e.detail.current
    });
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
      dataService.removeFavorite(id, 'market');
      this.setData({ isFavorite: false });
      util.showSuccess('已取消收藏');
    } else {
      dataService.addFavorite(detail, 'market');
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
