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
    const DEFAULT_TYPE_INFO = { label: '其他', icon: '📌', color: '#6B7280' };
    const rawPosts = dataService.getAlumniPostList(filters) || [];
    const posts = rawPosts.map(item => {
      const safeItem = item || {};
      const typeInfo = constants.ALUMNI_POST_TYPE_MAP[safeItem.type] || DEFAULT_TYPE_INFO;
      return {
        id: safeItem.id || '',
        userAvatar: safeItem.userAvatar || '',
        userName: safeItem.userName || '',
        graduationYear: safeItem.graduationYear || '',
        company: safeItem.company || '',
        title: safeItem.title || '',
        content: safeItem.content || '',
        images: Array.isArray(safeItem.images) ? safeItem.images : [],
        views: safeItem.views || 0,
        likes: safeItem.likes || 0,
        comments: safeItem.comments || 0,
        typeInfo,
        formattedTime: util.formatDate(safeItem.createTime) || ''
      };
    });
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
    const DEFAULT_TITLE_INFO = { label: '其他', color: '#6B7280' };
    const DEFAULT_INDUSTRY_INFO = { label: '其他', color: '#6B7280', icon: '📌' };
    const rawMentors = dataService.getAlumniMentorList(filters) || [];
    const mentors = rawMentors.map(item => {
      const safeItem = item || {};
      const titleInfo = constants.ALUMNI_MENTOR_TITLES.find(t => t && t.value === safeItem.title) || DEFAULT_TITLE_INFO;
      const industryInfo = constants.ALUMNI_INDUSTRY_MAP[safeItem.industry] || DEFAULT_INDUSTRY_INFO;
      return {
        id: safeItem.id || '',
        avatar: safeItem.avatar || '',
        name: safeItem.name || '',
        company: safeItem.company || '',
        position: safeItem.position || '',
        rating: safeItem.rating || 0,
        successCases: safeItem.successCases || 0,
        availableSlots: safeItem.availableSlots || 0,
        titleInfo,
        industryInfo,
        expertiseText: (Array.isArray(safeItem.expertise) ? safeItem.expertise : []).join('、')
      };
    });
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
        statusInfo: constants.ALUMNI_VERIFY_STATUS_MAP[info.status] || { label: '未知', color: '#6B7280', icon: '📌' }
      };
    }
    this.setData({ verifyInfo });
  },

  onTabChange(e) {
    const value = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.value;
    this.setData({ activeTab: value || 'feed' });
  },

  onPostTypeChange(e) {
    const value = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.value;
    this.setData({ postType: value || 'all' }, () => {
      this.loadPosts();
    });
  },

  onSearchInput(e) {
    const val = (e && e.detail && e.detail.value) || '';
    this.setData({ searchKeyword: val }, () => {
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
    const value = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.value;
    this.setData({
      selectedIndustry: value || '',
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
    const value = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.value;
    this.setData({
      selectedTitle: value || '',
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
    const id = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.id;
    if (id) {
      wx.navigateTo({
        url: `/pages/alumni/post-detail?id=${id}`
      });
    }
  },

  onPublishTap() {
    wx.navigateTo({
      url: '/pages/alumni/post-publish'
    });
  },

  onMentorTap(e) {
    const id = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.id;
    if (id) {
      wx.navigateTo({
        url: `/pages/alumni/mentor-detail?id=${id}`
      });
    }
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
    const value = e && e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.value;
    if (value !== undefined && value !== null) {
      wx.navigateTo({
        url: `/pages/alumni/industry-distribution?industry=${value}`
      });
    }
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
