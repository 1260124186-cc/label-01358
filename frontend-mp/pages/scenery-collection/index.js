const mockData = require('../../config/mock-data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    activeTab: 'season',
    tabs: [
      { value: 'season', label: '四季主题', icon: '🌸' },
      { value: 'solar_term', label: '节气主题', icon: '🌿' },
      { value: 'theme', label: '精选合集', icon: '✨' }
    ],
    seasonCollections: [],
    solarTermCollections: [],
    themeCollections: [],
    currentCollections: [],
    showDetail: false,
    selectedCollection: null,
    collectionItems: []
  },

  onLoad() {
    this.loadCollections();
  },

  loadCollections() {
    util.showLoading();
    
    const collections = mockData.SCENERY_COLLECTIONS || [];
    const allScenery = mockData.SCENERY_LIST.filter(s => s.reviewStatus === 'approved');
    
    const seasonCollections = collections.filter(c => c.type === 'season').map(c => ({
      ...c,
      items: allScenery.filter(s => s.season === c.season)
    }));
    
    const solarTermCollections = collections.filter(c => c.type === 'solar_term').map(c => ({
      ...c,
      items: allScenery.filter(s => c.solarTerms.includes(s.solarTerm))
    }));
    
    const themeCollections = collections.filter(c => c.type === 'theme').map(c => ({
      ...c,
      items: allScenery.slice(0, 8)
    }));

    this.setData({
      seasonCollections,
      solarTermCollections,
      themeCollections,
      currentCollections: seasonCollections
    });

    util.hideLoading();
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    let currentCollections = [];
    
    switch (value) {
      case 'season':
        currentCollections = this.data.seasonCollections;
        break;
      case 'solar_term':
        currentCollections = this.data.solarTermCollections;
        break;
      case 'theme':
        currentCollections = this.data.themeCollections;
        break;
    }

    this.setData({
      activeTab: value,
      currentCollections
    });
  },

  onOpenCollection(e) {
    const { id } = e.currentTarget.dataset;
    const allCollections = [
      ...this.data.seasonCollections,
      ...this.data.solarTermCollections,
      ...this.data.themeCollections
    ];
    const collection = allCollections.find(c => c.id === id);
    
    if (collection) {
      this.setData({
        selectedCollection: collection,
        collectionItems: collection.items || [],
        showDetail: true
      });
    }
  },

  onCloseDetail() {
    this.setData({
      showDetail: false,
      selectedCollection: null,
      collectionItems: []
    });
  },

  onItemTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/scenery-detail/index?id=${id}`);
  },

  onShareAppMessage() {
    if (this.data.selectedCollection) {
      return {
        title: `${this.data.selectedCollection.title} - 校园风光合集`,
        path: `/pages/scenery-collection/index`,
        imageUrl: this.data.selectedCollection.cover
      };
    }
    return {
      title: '校园风光 - 主题合集',
      path: '/pages/scenery-collection/index'
    };
  }
});
