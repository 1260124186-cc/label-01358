const mockData = require('../../config/mock-data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    categories: constants.NEWS_CATEGORIES,
    activeCategory: 'all',
    sortOptions: constants.NEWS_SORT_OPTIONS,
    currentSort: 'latest',
    currentSortText: '最新发布',
    newsList: [],
    filteredList: [],
    refreshing: false,
    showSortPanel: false
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const newsList = mockData.CAMPUS_NEWS.map(item => ({
      ...item,
      timeText: util.relativeTime(item.createTime),
      image: item.image || '/assets/images/default-news.png',
      categoryInfo: constants.NEWS_CATEGORY_MAP[item.category]
    }));

    this.setData({ newsList });
    this.applyFilters();
  },

  applyFilters() {
    const { newsList, activeCategory, currentSort } = this.data;
    let filteredList = newsList.slice();

    if (activeCategory !== 'all') {
      filteredList = filteredList.filter(item => item.category === activeCategory);
    }

    const sortOption = constants.NEWS_SORT_OPTIONS.find(o => o.value === currentSort);
    if (sortOption) {
      const { field, order } = sortOption;
      filteredList.sort((a, b) => {
        const va = a[field] || 0;
        const vb = b[field] || 0;
        return order === 'asc' ? va - vb : vb - va;
      });
    }

    this.setData({
      filteredList,
      refreshing: false
    });
  },

  onCategoryChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ activeCategory: value });
    this.applyFilters();
  },

  onSortTap() {
    this.setData({ showSortPanel: true });
  },

  onSortSelect(e) {
    const { value } = e.currentTarget.dataset;
    const option = constants.NEWS_SORT_OPTIONS.find(o => o.value === value);
    this.setData({
      currentSort: value,
      currentSortText: option ? option.label : '最新发布',
      showSortPanel: false
    });
    this.applyFilters();
  },

  onCloseSortPanel() {
    this.setData({ showSortPanel: false });
  },

  onNewsTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/news-detail/index?id=${id}`);
  },

  onPullDownRefresh() {
    this.setData({ refreshing: true });
    setTimeout(() => {
      this.loadData();
      wx.stopPullDownRefresh();
      util.showToast('刷新成功');
    }, 500);
  },

  stopPropagation() {}
});
