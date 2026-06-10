const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    categories: [],
    currentCategory: 'all',
    keyword: '',
    shopList: [],
    refreshing: false
  },

  onLoad() {
    this.setData({
      categories: constants.SHOP_CATEGORIES
    });
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const filters = {};

    if (this.data.currentCategory && this.data.currentCategory !== 'all') {
      filters.category = this.data.currentCategory;
    }

    if (this.data.keyword) {
      filters.keyword = this.data.keyword;
    }

    const list = dataService.getCampusShopList(filters);

    const formattedList = list.map(item => {
      const rating = item.rating || 0;
      const fullStars = Math.floor(rating);
      const halfStar = rating - fullStars >= 0.5;
      const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
      const stars = [];
      for (let i = 0; i < fullStars; i++) stars.push('full');
      if (halfStar) stars.push('half');
      for (let i = 0; i < emptyStars; i++) stars.push('empty');

      return {
        ...item,
        stars,
        ratingText: rating.toFixed(1),
        categoryLabel: constants.getLabelByValue(constants.SHOP_CATEGORIES, item.category)
      };
    });

    this.setData({
      shopList: formattedList,
      refreshing: false
    });
  },

  onCategoryTap(e) {
    const { category } = e.currentTarget.dataset;
    this.setData({ currentCategory: category });
    this.loadData();
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  onSearch() {
    this.loadData();
  },

  onShopTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/campus-shop/detail?id=${id}`);
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
