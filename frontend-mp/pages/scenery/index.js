const mockData = require('../../config/mock-data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    categories: constants.SCENERY_CATEGORIES,
    activeCategory: 'all',
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

  loadData() {
    const sceneryList = mockData.SCENERY_LIST
      .filter(item => item.reviewStatus === 'approved')
      .map(item => ({
        ...item,
        image: item.image || '/assets/images/default-scenery.png',
        categoryInfo: constants.SCENERY_CATEGORY_MAP[item.category],
        seasonInfo: constants.SCENERY_SEASONS.find(s => s.value === item.season)
      }));

    const collections = mockData.SCENERY_COLLECTIONS.slice(0, 4);

    this.setData({
      sceneryList,
      collections,
      filteredList: sceneryList
    });
  },

  onCategoryChange(e) {
    const { value } = e.currentTarget.dataset;
    const filteredList = value === 'all'
      ? this.data.sceneryList
      : this.data.sceneryList.filter(item => item.category === value);

    this.setData({
      activeCategory: value,
      filteredList
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
    const collection = mockData.SCENERY_COLLECTIONS.find(c => c.id === id);
    if (!collection) return;

    const collectionItems = this.data.sceneryList.filter(item => {
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
