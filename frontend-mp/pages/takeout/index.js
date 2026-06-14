const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

const PROMOTION_ICON_MAP = {
  discount: '🏷️',
  full_reduction: '💰',
  coupon: '🎫',
  gift: '🎁',
  free_delivery: '🚚'
};

mixPage({
  data: {
    darkMode: false,
    keyword: '',
    categories: constants.TAKEOUT_CATEGORIES,
    sortOptions: constants.TAKEOUT_SORT_OPTIONS,
    currentCategory: 'all',
    currentSort: 'comprehensive',
    promotionBanners: [],
    todayDiscounts: [],
    merchantList: [],
    refreshing: false,
    loading: true,
    promotionIconMap: PROMOTION_ICON_MAP
  },

  onLoad() {
    this.loadAllData();
  },

  onShow() {
    this.loadAllData();
  },

  formatStars(rating) {
    const r = rating || 0;
    const fullStars = Math.floor(r);
    const halfStar = r - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    const stars = [];
    for (let i = 0; i < fullStars; i++) stars.push('full');
    if (halfStar) stars.push('half');
    for (let i = 0; i < emptyStars; i++) stars.push('empty');
    return stars;
  },

  formatBusinessHours(businessHours) {
    if (!businessHours) return '';
    const segments = constants.CANTEEN_TIME_SEGMENTS || [
      { value: 'breakfast', label: '早餐' },
      { value: 'lunch', label: '午餐' },
      { value: 'dinner', label: '晚餐' }
    ];
    return segments
      .map(seg => businessHours[seg.value] !== '--:--' ? `${seg.label}:${businessHours[seg.value]}` : null)
      .filter(Boolean)
      .join('  |  ');
  },

  loadAllData() {
    this.setData({ loading: true });

    const promotionBanners = dataService.getTakeoutPromotionBanners();
    const todayDiscounts = dataService.getTodayAllDiscounts().slice(0, 10);

    const filters = {
      keyword: this.data.keyword,
      category: this.data.currentCategory,
      sort: this.data.currentSort
    };
    const merchantList = dataService.getTakeoutMerchantList(filters);

    const formattedMerchants = merchantList.map(item => {
      const deliveryTypeInfo = constants.TAKEOUT_DELIVERY_TYPES.find(d => d.value === item.deliveryType) || {};
      return {
        ...item,
        stars: this.formatStars(item.rating),
        ratingText: (item.rating || 0).toFixed(1),
        reviewCountText: item.reviewCount ? item.reviewCount + '条评价' : '暂无评价',
        salesText: item.sales ? `月售${item.sales}` : '',
        distanceText: item.distance !== undefined ? (item.distance < 1 ? `${(item.distance * 1000).toFixed(0)}m` : `${item.distance.toFixed(1)}km`) : '',
        deliveryTypeText: deliveryTypeInfo.label || '',
        deliveryTypeIcon: deliveryTypeInfo.icon || '',
        businessHoursText: this.formatBusinessHours(item.businessHours),
        deliveryFeeText: item.deliveryFee === 0 ? '免配送费' : `配送费¥${item.deliveryFee}`,
        freeDeliveryText: item.freeDeliveryOver ? `满¥${item.freeDeliveryOver}免配送` : '',
        minOrderText: item.minOrderPrice ? `¥${item.minOrderPrice}起送` : ''
      };
    });

    const formattedDiscounts = todayDiscounts.map(item => ({
      ...item,
      discountPercent: Math.round((1 - item.discountPrice / item.originalPrice) * 100)
    }));

    this.setData({
      promotionBanners,
      todayDiscounts: formattedDiscounts,
      merchantList: formattedMerchants,
      loading: false,
      refreshing: false
    });
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  onSearch() {
    this.loadAllData();
  },

  onCategoryTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentCategory: value }, () => {
      this.loadAllData();
    });
  },

  onSortTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentSort: value }, () => {
      this.loadAllData();
    });
  },

  onMerchantTap(e) {
    const { id } = e.currentTarget.dataset;
    util.showToast('商家详情功能开发中');
  },

  onToggleFavorite(e) {
    const { id, index } = e.currentTarget.dataset;
    e.stopPropagation && e.stopPropagation();

    const result = dataService.toggleFavoriteTakeoutMerchant(id);
    const list = [...this.data.merchantList];
    if (list[index] && list[index].id === id) {
      list[index].isFavorite = result.isFavorite;
      this.setData({ merchantList: list });
    }
    util.showToast(result.isFavorite ? '已收藏' : '已取消收藏');
  },

  onDiscountTap(e) {
    const { merchantId } = e.currentTarget.dataset;
    if (merchantId) {
      util.showToast('商家详情功能开发中');
    }
  },

  onBannerTap(e) {
    const { item } = e.currentTarget.dataset;
    if (item && item.link) {
      util.navigateTo(item.link);
    }
  },

  onPullDownRefresh() {
    this.loadAllData();
    wx.stopPullDownRefresh();
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadAllData();
  }
});
