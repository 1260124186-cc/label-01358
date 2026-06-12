const dataService = require('../../services/data');
const constants = require('../../config/constants');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    titleOptions: constants.INNOVATION_MENTOR_TITLES,
    mentors: [],
    filteredMentors: [],
    selectedTitle: '',
    searchKeyword: '',
    showTitleFilter: false,
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
      title: this.data.selectedTitle
    };
    const mentors = dataService.getInnovationMentorList(filters).map(item => ({
      ...item,
      titleInfo: constants.INNOVATION_MENTOR_TITLES.find(t => t.value === item.title),
      researchAreasText: (item.researchAreas || []).join('、')
    }));
    this.setData({
      mentors,
      filteredMentors: mentors,
      loading: false
    });
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value }, () => {
      this.loadData();
    });
  },

  onTitleFilterTap() {
    this.setData({ showTitleFilter: true });
  },

  onTitleSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      selectedTitle: value,
      showTitleFilter: false
    }, () => {
      this.loadData();
    });
  },

  onClearTitleFilter() {
    this.setData({
      selectedTitle: '',
      showTitleFilter: false
    }, () => {
      this.loadData();
    });
  },

  onCloseFilter() {
    this.setData({ showTitleFilter: false });
  },

  onMentorTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/innovation/mentor-detail?id=${id}`
    });
  },

  stopPropagation() {}
});
