const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

const CROWD_COLOR_MAP = {
  idle: '#52C41A',
  moderate: '#FAAD14',
  crowded: '#FF4D4F'
};

mixPage({
  data: {
    darkMode: false,
    keyword: '',
    todayRecommends: [],
    newDishes: [],
    canteenList: [],
    refreshing: false,
    crowdLevels: constants.CANTEEN_CROWD_LEVELS,
    timeSegments: constants.CANTEEN_TIME_SEGMENTS,
    crowdColorMap: CROWD_COLOR_MAP
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
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

  loadData() {
    const filters = {};
    if (this.data.keyword) {
      filters.keyword = this.data.keyword;
    }

    const todayRecommends = dataService.getTodayRecommends();
    const newDishes = dataService.getNewDishes();
    const canteenList = dataService.getCanteenList(filters);

    const formattedList = canteenList.map(item => {
      const crowdLevel = item.crowdLevel || 'idle';
      const crowdInfo = constants.CANTEEN_CROWD_LEVELS.find(c => c.value === crowdLevel) || {};

      const formattedHours = constants.CANTEEN_TIME_SEGMENTS.map(seg => ({
        key: seg.value,
        label: seg.label,
        icon: seg.icon,
        time: (item.businessHours && item.businessHours[seg.value]) || '--:--'
      }));

      return {
        ...item,
        stars: this.formatStars(item.rating),
        ratingText: (item.rating || 0).toFixed(1),
        reviewCountText: item.reviewCount ? item.reviewCount + '条评价' : '暂无评价',
        crowdLevel,
        crowdLabel: crowdInfo.label || '未知',
        crowdColor: crowdInfo.color || CROWD_COLOR_MAP[crowdLevel] || '#999999',
        crowdDesc: item.crowdDesc || crowdInfo.desc || '',
        businessHoursFormatted: formattedHours
      };
    });

    this.setData({
      todayRecommends,
      newDishes,
      canteenList: formattedList,
      refreshing: false
    });
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  onSearch() {
    this.loadData();
  },

  onCanteenTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/canteen/detail?id=${id}`);
  },

  onToggleFavoriteCanteen(e) {
    const { id, index } = e.currentTarget.dataset;
    e.stopPropagation && e.stopPropagation();

    const result = dataService.toggleFavoriteCanteen(id);
    const list = [...this.data.canteenList];
    if (list[index] && list[index].id === id) {
      list[index].isFavorite = result.isFavorite;
      this.setData({ canteenList: list });
    }
    util.showToast(result.isFavorite ? '已收藏' : '已取消收藏');
  },

  onDishTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/canteen/dish-detail?id=${id}`);
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadData();
  }
});
