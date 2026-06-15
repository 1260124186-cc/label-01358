const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    list: [],
    loading: false,
    refreshing: false,
    tabs: constants.GROUP_BUY_TABS,
    currentTab: 'all',
    categories: [{ value: 'all', label: '全部分类', icon: '🏷️' }, ...constants.GROUP_BUY_CATEGORIES],
    currentCategory: 'all',
    priceRanges: constants.GROUP_BUY_PRICE_RANGES,
    currentPriceRange: '',
    currentPriceText: '',
    minPrice: undefined,
    maxPrice: undefined,
    sortOptions: constants.GROUP_BUY_SORT_OPTIONS,
    currentSort: 'latest',
    showPricePicker: false,
    showSortPicker: false,
    searchKeyword: ''
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
      const filters = {
        type: this.data.currentTab === 'mine' ? 'mine' : '',
        status: this.data.currentTab !== 'all' && this.data.currentTab !== 'mine' ? this.data.currentTab : '',
        category: this.data.currentCategory,
        minPrice: this.data.minPrice,
        maxPrice: this.data.maxPrice,
        sort: this.data.currentSort,
        keyword: this.data.searchKeyword
      };

      const list = dataService.getGroupBuyList(filters);

      const formattedList = list.map(item => {
        const categoryInfo = constants.GROUP_BUY_CATEGORIES.find(c => c.value === item.category);
        const statusInfo = constants.GROUP_BUY_STATUS_MAP[item.status];
        const pickupInfo = constants.GROUP_BUY_PICKUP_POINTS.find(p => p.value === item.pickupPoint);

        const deadline = new Date(item.deadline);
        const now = Date.now();
        let deadlineLabel = '';
        const diff = deadline.getTime() - now;
        if (diff <= 0) {
          deadlineLabel = '已截止';
        } else if (diff < 3600000) {
          deadlineLabel = Math.floor(diff / 60000) + '分钟后截止';
        } else if (diff < 86400000) {
          deadlineLabel = Math.floor(diff / 3600000) + '小时后截止';
        } else {
          deadlineLabel = Math.floor(diff / 86400000) + '天后截止';
        }

        const progressPercent = Math.min(100, Math.floor((item.joinedCount / item.minCount) * 100));
        const remainingCount = Math.max(0, item.minCount - item.joinedCount);

        return {
          ...item,
          categoryIcon: categoryInfo ? categoryInfo.icon : '🛒',
          categoryText: categoryInfo ? categoryInfo.label : '其他',
          statusText: statusInfo ? statusInfo.label : '',
          statusColor: statusInfo ? statusInfo.color : '',
          pickupPointText: pickupInfo ? pickupInfo.label : item.pickupPoint,
          deadlineLabel,
          progressPercent,
          remainingCount,
          timeText: util.relativeTime(item.createTime)
        };
      });

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

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
    this.loadList();
  },

  onCategoryChange(e) {
    const { value } = e.currentTarget.dataset;
    const newCat = this.data.currentCategory === value ? 'all' : value;
    this.setData({ currentCategory: newCat });
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
      currentPriceText: item ? item.label : '价格',
      minPrice: min !== undefined ? min : undefined,
      maxPrice: max !== undefined ? max : undefined,
      showPricePicker: false
    });

    this.loadList();
  },

  onShowSortPicker() {
    this.setData({ showSortPicker: true });
  },

  onHideSortPicker() {
    this.setData({ showSortPicker: false });
  },

  onSortSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      currentSort: value,
      showSortPicker: false
    });
    this.loadList();
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearchConfirm() {
    this.loadList();
  },

  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo('/pages/group-buy-detail/index?id=' + item.id);
  },

  onPublish() {
    if (!util.checkLogin()) return;
    util.navigateTo('/pages/group-buy-publish/index');
  },

  stopPropagation() {}
});
