const dataService = require('../../services/data');
const constants = require('../../config/constants');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    typeOptions: constants.INNOVATION_INCUBATOR_TYPES,
    incubators: [],
    filteredIncubators: [],
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
    const incubators = dataService.getInnovationIncubatorList(filters).map(item => ({
      ...item,
      typeInfo: constants.INNOVATION_INCUBATOR_TYPES.find(t => t.value === item.type),
      servicesText: (item.services || []).map(s => s.name).join(' · ')
    }));
    this.setData({
      incubators,
      filteredIncubators: incubators,
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

  onIncubatorTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/innovation/incubator-detail?id=${id}`
    });
  },

  stopPropagation() {}
});
