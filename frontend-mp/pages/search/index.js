const dataService = require('../../services/data');
const constants = require('../../config/constants');
const storage = require('../../utils/storage');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    keyword: '',
    currentTab: 'all',
    tabs: constants.SEARCH_TABS,
    searchHistory: [],
    showHistory: true,
    showResults: false,
    showFilterPanel: false,
    lostList: [],
    marketList: [],
    newsList: [],
    phonebookList: [],
    sortOptions: constants.SORT_OPTIONS,
    timeRanges: constants.TIME_RANGES,
    priceRanges: constants.PRICE_RANGES,
    marketCategories: constants.MARKET_CATEGORIES,
    lostItemTypes: constants.ITEM_TYPES,
    currentSort: 'latest',
    currentSortText: '最新',
    currentTimeRange: '',
    currentTimeText: '时间',
    currentPriceRange: '',
    currentPriceText: '价格',
    minPrice: undefined,
    maxPrice: undefined,
    currentCategory: '',
    currentCategoryText: '分类',
    activeFilter: ''
  },

  onLoad(options) {
    const keyword = options.keyword || '';
    const searchHistory = storage.getSearchHistory();
    this.setData({ searchHistory });

    if (keyword) {
      this.setData({ keyword });
      this.doSearch(keyword);
    }
  },

  onInputChange(e) {
    this.setData({ keyword: e.detail.value });
  },

  onClearInput() {
    this.setData({
      keyword: '',
      showResults: false,
      showHistory: true,
      lostList: [],
      marketList: [],
      newsList: [],
      phonebookList: []
    });
  },

  onSearch() {
    const keyword = this.data.keyword.trim();
    if (!keyword) {
      util.showToast('请输入搜索关键词');
      return;
    }
    this.doSearch(keyword);
  },

  doSearch(keyword) {
    storage.addSearchHistory(keyword);
    const searchHistory = storage.getSearchHistory();

    const results = dataService.globalSearch({
      keyword,
      tab: this.data.currentTab,
      category: this.data.currentCategory,
      minPrice: this.data.minPrice,
      maxPrice: this.data.maxPrice,
      timeRange: this.data.currentTimeRange,
      sort: this.data.currentSort
    });

    this.setData({
      lostList: results.lostList,
      marketList: results.marketList,
      newsList: results.newsList,
      phonebookList: results.phonebookList || [],
      showResults: true,
      showHistory: false,
      searchHistory
    });
  },

  onHistoryTap(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ keyword });
    this.doSearch(keyword);
  },

  onRemoveHistory(e) {
    const keyword = e.currentTarget.dataset.keyword;
    storage.removeSearchHistory(keyword);
    this.setData({ searchHistory: storage.getSearchHistory() });
  },

  onClearHistory() {
    storage.clearSearchHistory();
    this.setData({ searchHistory: [] });
  },

  onTabChange(e) {
    const tab = e.currentTarget.dataset.value;
    this.setData({ currentTab: tab });
    if (this.data.showResults) {
      this.doSearch(this.data.keyword.trim());
    }
  },

  onToggleFilter(e) {
    const filter = e.currentTarget.dataset.filter;
    if (this.data.activeFilter === filter) {
      this.setData({ activeFilter: '', showFilterPanel: false });
    } else {
      this.setData({ activeFilter: filter, showFilterPanel: true });
    }
  },

  onCloseFilter() {
    this.setData({ activeFilter: '', showFilterPanel: false });
  },

  onSortSelect(e) {
    const value = e.currentTarget.dataset.value;
    const option = this.data.sortOptions.find(o => o.value === value);
    this.setData({
      currentSort: value,
      currentSortText: option ? option.label : '最新',
      activeFilter: '',
      showFilterPanel: false
    });
    if (this.data.showResults) {
      this.doSearch(this.data.keyword.trim());
    }
  },

  onTimeSelect(e) {
    const value = e.currentTarget.dataset.value;
    const option = this.data.timeRanges.find(o => o.value === value);
    this.setData({
      currentTimeRange: value,
      currentTimeText: option ? option.label : '时间',
      activeFilter: '',
      showFilterPanel: false
    });
    if (this.data.showResults) {
      this.doSearch(this.data.keyword.trim());
    }
  },

  onPriceSelect(e) {
    const { value, min, max } = e.currentTarget.dataset;
    const option = this.data.priceRanges.find(o => o.value === value);
    this.setData({
      currentPriceRange: value,
      currentPriceText: option ? option.label : '价格',
      minPrice: min !== undefined ? min : undefined,
      maxPrice: max !== undefined ? max : undefined,
      activeFilter: '',
      showFilterPanel: false
    });
    if (this.data.showResults) {
      this.doSearch(this.data.keyword.trim());
    }
  },

  onCategorySelect(e) {
    const value = e.currentTarget.dataset.value;
    const categories = this.data.currentTab === 'lost'
      ? this.data.lostItemTypes
      : this.data.marketCategories;
    const option = categories.find(o => o.value === value);
    this.setData({
      currentCategory: value,
      currentCategoryText: option ? option.label : '分类',
      activeFilter: '',
      showFilterPanel: false
    });
    if (this.data.showResults) {
      this.doSearch(this.data.keyword.trim());
    }
  },

  onResetFilters() {
    this.setData({
      currentSort: 'latest',
      currentSortText: '最新',
      currentTimeRange: '',
      currentTimeText: '时间',
      currentPriceRange: '',
      currentPriceText: '价格',
      minPrice: undefined,
      maxPrice: undefined,
      currentCategory: '',
      currentCategoryText: '分类',
      activeFilter: '',
      showFilterPanel: false
    });
    if (this.data.showResults) {
      this.doSearch(this.data.keyword.trim());
    }
  },

  onLostItemTap(e) {
    const item = e.currentTarget.dataset.item;
    util.navigateTo(`/pages/lost-found-detail/index?id=${item.id}`);
  },

  onMarketItemTap(e) {
    const item = e.currentTarget.dataset.item;
    util.navigateTo(`/pages/market-detail/index?id=${item.id}`);
  },

  onNewsItemTap(e) {
    const item = e.currentTarget.dataset.item;
    util.navigateTo(`/pages/news-detail/index?id=${item.id}`);
  },

  onPhonebookCall(e) {
    const { phone } = e.currentTarget.dataset;
    if (!phone) {
      util.showToast('电话号码无效');
      return;
    }
    dataService.makePhoneCall(phone).catch((err) => {
      if (err && err.errMsg && !err.errMsg.includes('cancel')) {
        util.showToast('拨号失败，请重试');
      }
    });
  },

  onGoBack() {
    util.navigateBack();
  },

  stopPropagation() {}
});
