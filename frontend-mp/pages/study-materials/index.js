const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    currentTab: 'materials',
    tabs: constants.STUDY_TABS,
    categories: constants.STUDY_MATERIAL_CATEGORIES,
    currentCategory: '',
    searchKeyword: '',
    materialsList: [],
    rewardsList: [],
    loading: false,
    refreshing: false,
    userPoints: 0
  },

  onLoad() {
    this.loadData();
    this.loadUserPoints();
  },

  onShow() {
    this.loadData();
    this.loadUserPoints();
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadUserPoints() {
    const points = dataService.getUserPoints();
    this.setData({ userPoints: points });
  },

  loadData() {
    this.setData({ loading: true });

    return new Promise((resolve) => {
      const filters = {};
      if (this.data.currentCategory) {
        filters.category = this.data.currentCategory;
      }
      if (this.data.searchKeyword) {
        filters.keyword = this.data.searchKeyword;
      }

      const materials = dataService.getStudyMaterialsList(filters);
      const rewards = dataService.getStudyRewardsList(filters);

      const formattedMaterials = materials.map(item => {
        const categoryInfo = constants.STUDY_MATERIAL_CATEGORIES.find(c => c.value === item.category);
        return {
          ...item,
          categoryText: categoryInfo ? categoryInfo.label : item.category,
          categoryColor: categoryInfo ? categoryInfo.color : '#999',
          categoryIcon: categoryInfo ? categoryInfo.icon : '📚',
          timeText: util.relativeTime(item.createTime),
          fileTypeText: constants.getLabelByValue(constants.FILE_TYPE_OPTIONS, item.fileType)
        };
      });

      const formattedRewards = rewards.map(item => {
        const categoryInfo = constants.STUDY_MATERIAL_CATEGORIES.find(c => c.value === item.category);
        const statusInfo = constants.STUDY_REWARD_STATUS.find(s => s.value === item.status);
        return {
          ...item,
          categoryText: categoryInfo ? categoryInfo.label : item.category,
          categoryColor: categoryInfo ? categoryInfo.color : '#999',
          categoryIcon: categoryInfo ? categoryInfo.icon : '📚',
          statusText: statusInfo ? statusInfo.label : item.status,
          statusColor: statusInfo ? statusInfo.color : '#666',
          timeText: util.relativeTime(item.createTime),
          responseCount: (item.responses || []).length
        };
      });

      this.setData({
        materialsList: formattedMaterials,
        rewardsList: formattedRewards,
        loading: false,
        refreshing: false
      });

      resolve();
    });
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadData();
  },

  onTabChange(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({ currentTab: tab });
  },

  onCategoryChange(e) {
    const { category } = e.currentTarget.dataset;
    this.setData({ currentCategory: this.data.currentCategory === category ? '' : category });
    this.loadData();
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearchConfirm() {
    this.loadData();
  },

  onMaterialTap(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo(`/pages/study-materials/detail?id=${item.id}`);
  },

  onRewardTap(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo(`/pages/study-reward/detail?id=${item.id}`);
  },

  onPublish() {
    if (!util.checkLogin()) {
      return;
    }

    if (this.data.currentTab === 'materials') {
      util.navigateTo('/pages/study-materials/upload');
    } else {
      util.navigateTo('/pages/study-reward/publish');
    }
  },

  stopPropagation() {}
});
