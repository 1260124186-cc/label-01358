const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    id: '',
    detail: null,
    reviews: [],
    currentImageIndex: 0,
    showReviewModal: false,
    reviewRating: 5,
    reviewContent: ''
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id });
      this.loadDetail();
    }
  },

  onShow() {
    if (this.data.id) {
      this.loadReviews();
    }
  },

  loadDetail() {
    util.showLoading();
    const detail = dataService.getCampusShopDetail(this.data.id);

    if (detail) {
      const categoryInfo = constants.SHOP_CATEGORIES.find(c => c.value === detail.category);
      const ratingInfo = this.formatRating(detail.rating);

      const formattedCoupons = (detail.coupons || []).map(coupon => {
        const typeInfo = constants.COUPON_TYPES.find(t => t.value === coupon.type);
        return {
          ...coupon,
          typeLabel: typeInfo ? typeInfo.label : coupon.type,
          typeIcon: typeInfo ? typeInfo.icon : '🎫'
        };
      });

      const formattedDetail = {
        ...detail,
        categoryText: categoryInfo ? categoryInfo.label : detail.category,
        categoryIcon: categoryInfo ? categoryInfo.icon : '🏪',
        ratingInfo,
        coupons: formattedCoupons
      };

      this.setData({ detail: formattedDetail });

      dataService.increaseShopViews(this.data.id);
      dataService.addHistory(detail, 'campus-shop');
    }

    util.hideLoading();
  },

  loadReviews() {
    const reviews = dataService.getShopReviews(this.data.id);
    const formattedReviews = reviews.map(r => ({
      ...r,
      timeText: util.relativeTime(r.createTime)
    }));
    this.setData({ reviews: formattedReviews });
  },

  onSwiperChange(e) {
    this.setData({
      currentImageIndex: e.detail.current
    });
  },

  onCallPhone() {
    const { detail } = this.data;
    if (!detail || !detail.phone) return;
    wx.makePhoneCall({
      phoneNumber: detail.phone,
      fail: () => {}
    });
  },

  onShowReviewModal() {
    if (!util.checkLogin()) return;
    this.setData({ showReviewModal: true });
  },

  onCloseReviewModal() {
    this.setData({ showReviewModal: false, reviewRating: 5, reviewContent: '' });
  },

  onRatingTap(e) {
    const { rating } = e.currentTarget.dataset;
    this.setData({ reviewRating: rating });
  },

  onReviewInput(e) {
    this.setData({ reviewContent: e.detail.value });
  },

  async onSubmitReview() {
    const { reviewRating, reviewContent, id } = this.data;
    if (!reviewContent.trim()) {
      util.showToast('请输入评价内容');
      return;
    }

    util.showLoading('提交中...');

    try {
      const app = getApp();
      const userInfo = app.globalData.userInfo || {};
      const reviewData = {
        userName: userInfo.nickName || '匿名用户',
        avatar: userInfo.avatarUrl || '',
        rating: reviewRating,
        content: reviewContent.trim(),
        images: []
      };

      const result = dataService.addShopReview(id, reviewData);
      if (result) {
        await util.showSuccess('评价成功');
        this.setData({ showReviewModal: false, reviewRating: 5, reviewContent: '' });
        this.loadReviews();
        this.loadDetail();
      } else {
        util.showError('评价失败，请重试');
      }
    } catch (e) {
      util.showError('评价失败，请重试');
    } finally {
      util.hideLoading();
    }
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    const urls = this.data.detail.images;
    wx.previewImage({
      current: urls[index],
      urls
    });
  },

  formatRating(rating) {
    const r = Math.max(0, Math.min(5, rating || 0));
    const full = Math.floor(r);
    const half = (r - full) >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return { full, half, empty };
  },

  onShareAppMessage() {
    const { detail } = this.data;
    return {
      title: detail ? detail.name : '校园店铺',
      path: `/pages/campus-shop/detail?id=${this.data.id}`
    };
  }
});
