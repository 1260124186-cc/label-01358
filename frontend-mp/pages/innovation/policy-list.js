const dataService = require('../../services/data');
const constants = require('../../config/constants');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    typeOptions: constants.INNOVATION_POLICY_TYPES,
    policies: [],
    filteredPolicies: [],
    selectedType: '',
    searchKeyword: '',
    showTypeFilter: false,
    loading: true
  },

  onLoad() {
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData() {
    this.setData({ loading: true });
    dataService.initAllInnovationData();
    const filters = {
      keyword: this.data.searchKeyword,
      type: this.data.selectedType
    };
    const policies = dataService.getInnovationPolicyList(filters).map(item => ({
      ...item,
      typeInfo: constants.INNOVATION_POLICY_TYPES.find(t => t.value === item.type),
      tagsText: (item.tags || []).join(' · ')
    }));
    this.setData({
      policies,
      filteredPolicies: policies,
      loading: false
    });
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value }, () => {
      this.loadData();
    });
  },

  onTypeFilterTap() {
    this.setData({ showTypeFilter: true });
  },

  onTypeSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      selectedType: value,
      showTypeFilter: false
    }, () => {
      this.loadData();
    });
  },

  onClearTypeFilter() {
    this.setData({
      selectedType: '',
      showTypeFilter: false
    }, () => {
      this.loadData();
    });
  },

  onCloseFilter() {
    this.setData({ showTypeFilter: false });
  },

  onPolicyTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/innovation/policy-detail?id=${id}`
    });
  },

  onFavoriteTap(e) {
    const { id } = e.currentTarget.dataset;
    dataService.togglePolicyFavorite(id);
    this.loadData();
  },

  stopPropagation() {}
});
