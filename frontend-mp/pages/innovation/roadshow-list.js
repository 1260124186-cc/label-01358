const dataService = require('../../services/data');
const constants = require('../../config/constants');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    statusOptions: constants.INNOVATION_ROADSHOW_STATUS,
    roadshows: [],
    filteredRoadshows: [],
    selectedStatus: '',
    searchKeyword: '',
    showStatusFilter: false,
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
      status: this.data.selectedStatus
    };
    const roadshows = dataService.getInnovationRoadshowList(filters).map(item => ({
      ...item,
      statusInfo: constants.INNOVATION_ROADSHOW_STATUS.find(s => s.value === item.status),
      progress: Math.min(100, Math.round((item.registeredCount / item.maxParticipants) * 100)),
      dateText: item.date,
      timeText: `${item.startTime}-${item.endTime}`,
      highlightsText: (item.highlights || []).join(' · ')
    }));
    this.setData({
      roadshows,
      filteredRoadshows: roadshows,
      loading: false
    });
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value }, () => {
      this.loadData();
    });
  },

  onStatusFilterTap() {
    this.setData({ showStatusFilter: true });
  },

  onStatusSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      selectedStatus: value,
      showStatusFilter: false
    }, () => {
      this.loadData();
    });
  },

  onClearStatusFilter() {
    this.setData({
      selectedStatus: '',
      showStatusFilter: false
    }, () => {
      this.loadData();
    });
  },

  onCloseFilter() {
    this.setData({ showStatusFilter: false });
  },

  onRoadshowTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/innovation/roadshow-detail?id=${id}`
    });
  },

  stopPropagation() {}
});
