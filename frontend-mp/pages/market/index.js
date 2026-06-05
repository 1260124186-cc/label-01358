const dataService = require('../../services/data');
const config = require('../../config/index');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    list: [],
    loading: false,
    refreshing: false,
    categories: config.MARKET_CATEGORIES,
    priceRanges: config.PRICE_RANGES,
    currentCategory: '',
    currentPriceRange: '',
    currentPriceText: '',
    minPrice: undefined,
    maxPrice: undefined,
    showPricePicker: false
  },

  onLoad() {
    this.loadList();
  },

  onShow() {
    this.loadList();
  },

  onPullDownRefresh() {
    this.loadList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadList() {
    this.setData({ loading: true });

    return new Promise((resolve) => {
      const filters = {};

      if (this.data.currentCategory) {
        filters.category = this.data.currentCategory;
      }

      if (this.data.minPrice !== undefined) {
        filters.minPrice = this.data.minPrice;
      }

      if (this.data.maxPrice !== undefined && this.data.maxPrice !== Infinity) {
        filters.maxPrice = this.data.maxPrice;
      }

      const list = dataService.getMarketList(filters);

      const formattedList = list.map(item => ({
        ...item,
        priceText: util.formatPrice(item.price),
        statusText: config.getLabelByValue(config.MARKET_STATUS, item.status)
      }));

      this.setData({
        list: formattedList,
        loading: false,
        refreshing: false
      });

      resolve();
    });
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadList();
  },

  onCategoryChange(e) {
    const { category } = e.currentTarget.dataset;
    this.setData({ currentCategory: category });
    this.loadList();
  },

  onShowPricePicker() {
    this.setData({ showPricePicker: true });
  },

  onHidePricePicker() {
    this.setData({ showPricePicker: false });
  },

  onPriceSelect(e) {
    const { value, min, max } = e.currentTarget.dataset;
    const item = this.data.priceRanges.find(i => i.value === value);

    this.setData({
      currentPriceRange: value,
      currentPriceText: item ? item.label : '',
      minPrice: min !== undefined ? min : undefined,
      maxPrice: max !== undefined ? max : undefined,
      showPricePicker: false
    });

    this.loadList();
  },

  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo(`/pages/market-detail/index?id=${item.id}`);
  },

  onPublish() {
    // 检查登录状态
    if (!util.checkLogin()) {
      return;
    }
    util.navigateTo('/pages/market-publish/index');
  },

  stopPropagation() {
    // 阻止事件冒泡
  }
});
