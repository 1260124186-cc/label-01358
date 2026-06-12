const mockData = require('../../config/mock-data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    categories: constants.SCENERY_CATEGORIES,
    activeCategory: 'all',
    activeCategoryLabel: '全部',
    collections: [],
    sceneryList: [],
    filteredList: [],
    showCollection: false,
    currentCollection: null,
    collectionItems: []
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  getCategoryLabel(value) {
    const category = constants.SCENERY_CATEGORIES.find(function(c) {
      return c.value === value;
    });
    return category ? category.label : '全部';
  },

  loadData() {
    const sceneryList = mockData.SCENERY_LIST
      .filter(item => item.reviewStatus === 'approved')
      .map(item => ({
        ...item,
        image: item.image || '/assets/images/default-scenery.png',
        categoryInfo: constants.SCENERY_CATEGORY_MAP[item.category],
        seasonInfo: constants.SCENERY_SEASONS.find(function(s) {
          return s.value === item.season;
        })
      }));

    const collections = mockData.SCENERY_COLLECTIONS.slice(0, 4);

    this.setData({
      sceneryList,
      collections,
      filteredList: sceneryList,
      activeCategoryLabel: this.getCategoryLabel(this.data.activeCategory)
    });
  },

  onCategoryChange(e) {
    const { value } = e.currentTarget.dataset;
    const filteredList = value === 'all'
      ? this.data.sceneryList
      : this.data.sceneryList.filter(function(item) {
        return item.category === value;
      });

    this.setData({
      activeCategory: value,
      filteredList,
      activeCategoryLabel: this.getCategoryLabel(value)
    });
  },

  onItemTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/scenery-detail/index?id=${id}`);
  },

  onPublishTap() {
    if (!util.checkLogin()) return;
    util.navigateTo('/pages/scenery-publish/index');
  },

  onCollectionTap(e) {
    const { id } = e.currentTarget.dataset;
    const collection = mockData.SCENERY_COLLECTIONS.find(function(c) {
      return c.id === id;
    });
    if (!collection) return;

    const collectionItems = this.data.sceneryList.filter(function(item) {
      if (collection.type === 'season') {
        return item.season === collection.season;
      }
      if (collection.type === 'solar_term') {
        return collection.solarTerms.includes(item.solarTerm);
      }
      return true;
    }).slice(0, 12);

    this.setData({
      showCollection: true,
      currentCollection: collection,
      collectionItems
    });
  },

  onCloseCollection() {
    this.setData({
      showCollection: false,
      currentCollection: null,
      collectionItems: []
    });
  },

  onCollectionItemTap(e) {
    const { id } = e.currentTarget.dataset;
    this.onCloseCollection();
    util.navigateTo(`/pages/scenery-detail/index?id=${id}`);
  },

  onViewAllCollections() {
    util.navigateTo('/pages/scenery-collection/index');
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
    util.showToast('刷新成功');
  },

  onShareAppMessage() {
    return {
      title: '校园风光 - 发现校园之美',
      path: '/pages/scenery/index'
    };
  }
});
