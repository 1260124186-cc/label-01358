const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

const SAFE_MAIN_TABS = [
  { value: 'feed', label: '校友动态', icon: '📢' },
  { value: 'mentors', label: '导师计划', icon: '👨‍🏫' },
  { value: 'industry', label: '行业分布', icon: '📊' },
  { value: 'services', label: '校友服务', icon: '🎫' }
];
const SAFE_POST_TYPES = [
  { value: 'all', label: '全部', icon: '📋', color: '#6B7280' },
  { value: 'share', label: '经验分享', icon: '💡', color: '#3B82F6' },
  { value: 'job', label: '招聘内推', icon: '💼', color: '#10B981' },
  { value: 'activity', label: '校友活动', icon: '🎉', color: '#F59E0B' },
  { value: 'help', label: '求助提问', icon: '❓', color: '#8B5CF6' },
  { value: 'life', label: '生活日常', icon: '🌈', color: '#EC4899' }
];
const SAFE_INDUSTRIES = [
  { value: 'internet', label: '互联网/IT', color: '#3B82F6', icon: '💻' },
  { value: 'finance', label: '金融/投资', color: '#10B981', icon: '💰' },
  { value: 'education', label: '教育/培训', color: '#F59E0B', icon: '📚' },
  { value: 'medical', label: '医疗/健康', color: '#EF4444', icon: '🏥' },
  { value: 'manufacturing', label: '制造业', color: '#8B5CF6', icon: '🏭' },
  { value: 'consulting', label: '咨询/服务', color: '#EC4899', icon: '💼' },
  { value: 'media', label: '传媒/广告', color: '#14B8A6', icon: '📺' },
  { value: 'government', label: '政府/事业单位', color: '#6366F1', icon: '🏛️' },
  { value: 'real_estate', label: '房地产/建筑', color: '#F97316', icon: '🏢' },
  { value: 'retail', label: '零售/电商', color: '#22C55E', icon: '🛒' },
  { value: 'other', label: '其他行业', color: '#6B7280', icon: '📌' }
];
const SAFE_MENTOR_TITLES = [
  { value: 'ceo', label: '企业CEO/创始人', color: '#6366F1' },
  { value: 'director', label: '总监/高管', color: '#3B82F6' },
  { value: 'manager', label: '部门经理', color: '#10B981' },
  { value: 'senior_engineer', label: '资深工程师', color: '#F59E0B' },
  { value: 'professor', label: '教授/研究员', color: '#8B5CF6' },
  { value: 'investor', label: '投资人', color: '#EC4899' },
  { value: 'lawyer', label: '律师', color: '#14B8A6' },
  { value: 'doctor', label: '医生', color: '#EF4444' }
];

function getSafeConstant(constantValue, fallback) {
  return Array.isArray(constantValue) && constantValue.length > 0 ? constantValue : fallback;
}

mixPage({
  data: {
    darkMode: false,
    activeTab: 'feed',
    postType: 'all',
    mainTabs: getSafeConstant(constants.ALUMNI_MAIN_TABS, SAFE_MAIN_TABS),
    postTypes: getSafeConstant(constants.ALUMNI_POST_TYPES, []).length > 0
      ? [{ value: 'all', label: '全部', icon: '📋', color: '#6B7280' }, ...getSafeConstant(constants.ALUMNI_POST_TYPES, [])]
      : SAFE_POST_TYPES,
    industryOptions: getSafeConstant(constants.ALUMNI_INDUSTRIES, SAFE_INDUSTRIES),
    titleOptions: getSafeConstant(constants.ALUMNI_MENTOR_TITLES, SAFE_MENTOR_TITLES),
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
    const POST_TYPE_MAP = constants.ALUMNI_POST_TYPE_MAP || {};
    const rawPosts = dataService.getAlumniPostList(filters) || [];
    const posts = rawPosts.map(item => {
      const safeItem = item || {};
      const typeInfo = POST_TYPE_MAP[safeItem.type] || DEFAULT_TYPE_INFO;
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
    const MENTOR_TITLES = Array.isArray(constants.ALUMNI_MENTOR_TITLES) ? constants.ALUMNI_MENTOR_TITLES : [];
    const INDUSTRY_MAP = constants.ALUMNI_INDUSTRY_MAP || {};
    const rawMentors = dataService.getAlumniMentorList(filters) || [];
    const mentors = rawMentors.map(item => {
      const safeItem = item || {};
      const titleInfo = MENTOR_TITLES.find(t => t && t.value === safeItem.title) || DEFAULT_TITLE_INFO;
      const industryInfo = INDUSTRY_MAP[safeItem.industry] || DEFAULT_INDUSTRY_INFO;
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
    if (info && typeof info === 'object' && !Array.isArray(info)) {
      const STATUS_MAP = constants.ALUMNI_VERIFY_STATUS_MAP || {};
      verifyInfo = {
        ...info,
        statusInfo: STATUS_MAP[info.status] || { label: '未知', color: '#6B7280', icon: '📌' }
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
