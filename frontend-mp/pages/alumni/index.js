const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    activeTab: 'feed',
    postType: 'all',
    mainTabs: constants.ALUMNI_MAIN_TABS,
    postTypes: [{ value: 'all', label: '全部', icon: '📋', color: '#6B7280' }, ...constants.ALUMNI_POST_TYPES],
    industryOptions: constants.ALUMNI_INDUSTRIES,
    titleOptions: constants.ALUMNI_MENTOR_TITLES,
    posts: [],
    filteredPosts: [],
    mentors: [],
    filteredMentors: [],
    selectedIndustry: '',
    selectedTitle: '',
    searchKeyword: '',
    showIndustryFilter: false,
    showTitleFilter: false,
    loading: true,
    verifyInfo: null,
    currentUserId: 'user_1'
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    if (!this.data.loading) {
      this.loadPosts();
      this.loadMentors();
      this.loadVerifyInfo();
    }
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData() {
    this.setData({ loading: true });
    dataService.initAllAlumniData();
    this.loadPosts();
    this.loadMentors();
    this.loadVerifyInfo();
    setTimeout(() => {
      this.setData({ loading: false });
    }, 500);
  },

  loadPosts() {
    const filters = {
      keyword: this.data.searchKeyword
    };
    if (this.data.postType !== 'all') {
      filters.type = this.data.postType;
    }
    const posts = dataService.getAlumniPostList(filters).map(item => ({
      ...item,
      typeInfo: constants.ALUMNI_POST_TYPE_MAP[item.type],
      formattedTime: util.formatDate(item.createTime)
    }));
    this.setData({
      posts,
      filteredPosts: posts
    });
  },

  loadMentors() {
    const filters = {
      keyword: this.data.searchKeyword,
      industry: this.data.selectedIndustry,
      title: this.data.selectedTitle
    };
    const mentors = dataService.getAlumniMentorList(filters).map(item => ({
      ...item,
      titleInfo: constants.ALUMNI_MENTOR_TITLES.find(t => t.value === item.title),
      industryInfo: constants.ALUMNI_INDUSTRY_MAP[item.industry],
      expertiseText: (item.expertise || []).join('、')
    }));
    this.setData({
      mentors,
      filteredMentors: mentors
    });
  },

  loadVerifyInfo() {
    const info = dataService.getAlumniVerifyInfo(this.data.currentUserId);
    let verifyInfo = null;
    if (info) {
      verifyInfo = {
        ...info,
        statusInfo: constants.ALUMNI_VERIFY_STATUS_MAP[info.status]
      };
    }
    this.setData({ verifyInfo });
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ activeTab: value });
  },

  onPostTypeChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ postType: value }, () => {
      this.loadPosts();
    });
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value }, () => {
      this.applyFilters();
    });
  },

  applyFilters() {
    switch (this.data.activeTab) {
      case 'feed':
        this.loadPosts();
        break;
      case 'mentors':
        this.loadMentors();
        break;
    }
  },

  onIndustryFilterTap() {
    this.setData({ showIndustryFilter: true });
  },

  onIndustrySelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      selectedIndustry: value,
      showIndustryFilter: false
    }, () => {
      this.loadMentors();
    });
  },

  onClearIndustryFilter() {
    this.setData({
      selectedIndustry: '',
      showIndustryFilter: false
    }, () => {
      this.loadMentors();
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
      this.loadMentors();
    });
  },

  onClearTitleFilter() {
    this.setData({
      selectedTitle: '',
      showTitleFilter: false
    }, () => {
      this.loadMentors();
    });
  },

  onCloseFilter() {
    this.setData({
      showIndustryFilter: false,
      showTitleFilter: false
    });
  },

  onPostTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/alumni/post-detail?id=${id}`
    });
  },

  onPublishTap() {
    wx.navigateTo({
      url: '/pages/alumni/post-publish'
    });
  },

  onMentorTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/alumni/mentor-detail?id=${id}`
    });
  },

  onMentorsTap() {
    this.setData({ activeTab: 'mentors' });
  },

  onIndustryTap() {
    this.setData({ activeTab: 'industry' });
  },

  onServicesTap() {
    this.setData({ activeTab: 'services' });
  },

  onIndustryDistributionTap() {
    wx.navigateTo({
      url: '/pages/alumni/industry-distribution'
    });
  },

  onIndustryItemTap(e) {
    const { value } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/alumni/industry-distribution?industry=${value}`
    });
  },

  onVerifyTap() {
    wx.navigateTo({
      url: '/pages/alumni/verify'
    });
  },

  onVisitTap() {
    wx.navigateTo({
      url: '/pages/alumni/visit-appointment'
    });
  },

  onCardBenefitsTap() {
    wx.navigateTo({
      url: '/pages/alumni/card-benefits'
    });
  },

  stopPropagation() {}
});
