const util = require('../../utils/util');
const constants = require('../../config/constants');
const dataService = require('../../services/data');
const { mixPage } = require('../../utils/withTheme');
const app = getApp();

const CONSULTATION_METHODS = [
  { value: 'all', label: '全部' },
  { value: 'online', label: '线上' },
  { value: 'offline', label: '线下' }
];

const SORT_OPTIONS = [
  { value: 'rating', label: '评分最高' },
  { value: 'experience', label: '经验最丰富' },
  { value: 'sessions', label: '咨询次数最多' }
];

mixPage({
  data: {
    darkMode: false,
    loading: true,
    searchKeyword: '',
    currentSpecialty: 'all',
    currentMethod: 'all',
    currentSort: 'rating',
    specialties: [{ value: 'all', label: '全部', icon: '💬' }].concat(constants.PSYCHOLOGICAL_COUNSELOR_SPECIALTIES),
    consultationMethods: CONSULTATION_METHODS,
    sortOptions: SORT_OPTIONS,
    counselors: [],
    filteredCounselors: [],
    crisisHotlines: [],
    primaryHotline: null,
    userId: '',
    anonymousId: '',
    showPrivacyTip: true
  },

  onLoad() {
    const currentUser = app.globalData.userInfo;
    const anonymousId = dataService.generateAnonymousUserId();
    this.setData({
      userId: currentUser ? currentUser.id : '',
      anonymousId,
      darkMode: app.globalData.darkMode || false
    });
    this.loadCrisisHotlines();
    this.loadCounselors();
  },

  onShow() {
    if (!this.data.loading) {
      this.loadCounselors();
    }
  },

  onPullDownRefresh() {
    this.loadCounselors();
    wx.stopPullDownRefresh();
  },

  loadCrisisHotlines() {
    try {
      const hotlines = dataService.getPsychologicalCrisisHotlines();
      const primary = hotlines.find(h => h.isPrimary) || hotlines[0] || null;
      this.setData({
        crisisHotlines: hotlines,
        primaryHotline: primary
      });
    } catch (error) {
      console.error('加载危机热线失败:', error);
    }
  },

  loadCounselors() {
    this.setData({ loading: true });

    try {
      const filters = {
        specialty: this.data.currentSpecialty,
        consultationMethod: this.data.currentMethod,
        keyword: this.data.searchKeyword,
        sort: this.data.currentSort
      };

      const counselors = dataService.getPsychologicalCounselorList(filters);

      this.setData({
        counselors,
        filteredCounselors: counselors,
        loading: false
      });
    } catch (error) {
      console.error('加载咨询师列表失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  filterCounselors() {
    const { counselors, currentSpecialty, currentMethod, searchKeyword, currentSort } = this.data;

    const filters = {
      specialty: currentSpecialty,
      consultationMethod: currentMethod,
      keyword: searchKeyword,
      sort: currentSort
    };

    const filtered = dataService.getPsychologicalCounselorList(filters);
    this.setData({ filteredCounselors: filtered });
  },

  onSpecialtyTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentSpecialty: value }, () => {
      this.filterCounselors();
    });
  },

  onMethodTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentMethod: value }, () => {
      this.filterCounselors();
    });
  },

  onSortTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentSort: value }, () => {
      this.filterCounselors();
    });
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value }, () => {
      this.filterCounselors();
    });
  },

  onSearchClear() {
    this.setData({ searchKeyword: '' }, () => {
      this.filterCounselors();
    });
  },

  onCounselorTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/psychological-counseling/detail?id=${id}`);
  },

  onMyAppointmentsTap() {
    if (!this.data.userId) {
      util.showToast('请先登录');
      setTimeout(() => {
        util.navigateTo('/pages/login/index');
      }, 1500);
      return;
    }
    util.navigateTo('/pages/psychological-counseling/my-appointments');
  },

  onCallHotlineTap() {
    const hotline = this.data.primaryHotline;
    if (!hotline || !hotline.phone) {
      util.showToast('暂无热线电话');
      return;
    }
    dataService.callCrisisHotline(hotline.phone);
  },

  onArticlesTap() {
    util.navigateTo('/pages/psychological-counseling/articles');
  },

  onPrivacyClose() {
    this.setData({ showPrivacyTip: false });
  }
});
