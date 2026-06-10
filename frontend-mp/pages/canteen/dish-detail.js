const dataService = require('../../services/data');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    id: '',
    dish: null,
    canteenId: '',
    canteenName: '',
    mealType: '',
    isFavorite: false,
    reviews: [],
    avgRating: 0,
    ratingFull: 0,
    totalReviews: 0,
    recommendRate: 0,
    recommendCount: 0,
    avoidCount: 0,
    ringDeg: 0,
    showReviewModal: false,
    reviewRating: 0,
    reviewContent: '',
    reviewRecommend: null,
    canSubmit: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id });
      this.loadDetail();
      this.loadReviews();
    }
  },

  onShow() {
    if (this.data.id) {
      this.checkFavoriteStatus();
    }
  },

  loadDetail() {
    util.showLoading();
    const result = dataService.getDishDetail(this.data.id);

    if (result) {
      const mealTypeMap = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐' };
      const mealTypeLabel = mealTypeMap[result.mealType] || '';
      this.setData({
        dish: result.dish,
        canteenId: result.canteenId,
        canteenName: result.canteenName,
        mealType: result.mealType,
        mealTypeLabel
      });
      this.checkFavoriteStatus();
    }

    util.hideLoading();
  },

  loadReviews() {
    const reviews = dataService.getDishReviews(this.data.id);
    const formattedReviews = reviews.map(r => ({
      ...r,
      timeText: util.relativeTime(r.createTime),
      liked: false
    }));

    const totalReviews = formattedReviews.length;
    let avgRating = 0;
    let recommendCount = 0;
    let avoidCount = 0;

    if (totalReviews > 0) {
      const totalRating = formattedReviews.reduce((sum, r) => sum + (r.rating || 0), 0);
      avgRating = Math.round(totalRating / totalReviews * 10) / 10;
      recommendCount = formattedReviews.filter(r => r.recommend === true).length;
      avoidCount = formattedReviews.filter(r => r.recommend === false).length;
    }

    const ratingFull = Math.round(avgRating);
    const recommendTotal = recommendCount + avoidCount;
    const recommendRate = recommendTotal > 0 ? Math.round(recommendCount / recommendTotal * 100) : 0;
    const ringDeg = Math.round(recommendRate * 3.6);

    this.setData({
      reviews: formattedReviews,
      avgRating,
      ratingFull,
      totalReviews,
      recommendCount,
      avoidCount,
      recommendRate,
      ringDeg
    });
  },

  checkFavoriteStatus() {
    const isFavorite = dataService.isFavoriteDish(this.data.id);
    this.setData({ isFavorite });
  },

  onToggleFavoriteDish() {
    if (!util.checkLogin()) return;
    const { dish } = this.data;
    if (!dish) return;

    const result = dataService.toggleFavoriteDish(this.data.id);
    this.setData({ isFavorite: result.isFavorite });
    util.showToast(result.isFavorite ? '收藏成功' : '已取消收藏');
  },

  onShowReviewModal() {
    if (!util.checkLogin()) return;
    this.setData({
      showReviewModal: true,
      reviewRating: 0,
      reviewContent: '',
      reviewRecommend: null,
      canSubmit: false
    });
  },

  onCloseReviewModal() {
    this.setData({
      showReviewModal: false,
      reviewRating: 0,
      reviewContent: '',
      reviewRecommend: null,
      canSubmit: false
    });
  },

  onRatingChange(e) {
    const { rating } = e.currentTarget.dataset;
    this.setData({
      reviewRating: rating
    });
    this.updateCanSubmit();
  },

  onReviewInput(e) {
    this.setData({
      reviewContent: e.detail.value
    });
    this.updateCanSubmit();
  },

  onRecommendTap(e) {
    const { value } = e.currentTarget.dataset;
    const currentValue = this.data.reviewRecommend;
    const newValue = currentValue === value ? null : value;
    this.setData({
      reviewRecommend: newValue
    });
  },

  updateCanSubmit() {
    const { reviewRating, reviewContent } = this.data;
    const canSubmit = reviewRating > 0 && reviewContent.trim().length > 0;
    this.setData({ canSubmit });
  },

  async onSubmitReview() {
    const { reviewRating, reviewContent, reviewRecommend, id } = this.data;

    if (reviewRating <= 0) {
      util.showToast('请选择评分');
      return;
    }

    if (!reviewContent.trim()) {
      util.showToast('请输入点评内容');
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
        recommend: reviewRecommend
      };

      const result = dataService.addDishReview(id, reviewData);
      if (result) {
        await util.showSuccess('点评成功');
        this.setData({
          showReviewModal: false,
          reviewRating: 0,
          reviewContent: '',
          reviewRecommend: null,
          canSubmit: false
        });
        this.loadReviews();
      } else {
        util.showError('点评失败，请重试');
      }
    } catch (e) {
      util.showError('点评失败，请重试');
    } finally {
      util.hideLoading();
    }
  },

  onLikeReview(e) {
    const { index } = e.currentTarget.dataset;
    const reviews = this.data.reviews;
    const review = reviews[index];

    if (!review) return;

    if (review.liked) {
      util.showToast('您已经点过赞了');
      return;
    }

    reviews[index] = {
      ...review,
      likes: (review.likes || 0) + 1,
      liked: true
    };

    this.setData({ reviews });
  },

  onShareAppMessage() {
    const { dish, canteenName } = this.data;
    return {
      title: dish ? `${dish.name} - ${canteenName}` : '菜品详情',
      path: `/pages/canteen/dish-detail?id=${this.data.id}`
    };
  }
});
