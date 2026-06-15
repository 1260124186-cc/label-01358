const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    currentTab: 'all',
    currentFilter: null,
    showFilter: false,
    searchKeyword: '',
    jobList: [],
    refreshing: false,
    filterValues: {
      industry: 'all',
      grade: 'all',
      convertible: 'all'
    },
    mainTabs: [],
    sortOptions: [],
    currentSort: 'latest',
    industries: [],
    grades: [],
    convertibleOptions: []
  },

  onLoad() {
    dataService.initJobRecruitmentData();
    this.setData({
      mainTabs: constants.JOB_MAIN_TABS,
      sortOptions: constants.JOB_SORT_OPTIONS,
      industries: [{ value: 'all', label: '全部行业' }, ...constants.JOB_INDUSTRIES],
      grades: [{ value: 'all', label: '全部年级' }, ...constants.JOB_GRADE_REQUIREMENTS],
      convertibleOptions: [
        { value: 'all', label: '不限' },
        { value: 'yes', label: '可转正' },
        { value: 'no', label: '不可转正' }
      ]
    });
    this.loadData();
  },

  onShow() {
    dataService.initJobRecruitmentData();
    this.loadData();
  },

  loadData() {
    const filters = {
      type: this.data.currentTab,
      industry: this.data.filterValues.industry,
      grade: this.data.filterValues.grade,
      convertible: this.data.filterValues.convertible,
      keyword: this.data.searchKeyword,
      sort: this.data.currentSort
    };

    const list = dataService.getJobList(filters);

    const formattedList = list.map(item => {
      const typeItem = constants.JOB_TYPES.find(t => t.value === item.type) || {};
      const industryItem = constants.JOB_INDUSTRIES.find(i => i.value === item.industry) || {};
      const statusItem = constants.JOB_STATUS_MAP[item.status] || {};
      const isExpired = item.deadline && item.deadline < Date.now();
      const daysLeft = item.deadline ? Math.ceil((item.deadline - Date.now()) / 86400000) : null;

      return {
        ...item,
        typeLabel: typeItem.label || '',
        industryLabel: industryItem.label || '',
        statusLabel: statusItem.label || '',
        statusColor: statusItem.color || '#6B7280',
        isExpired,
        daysLeft,
        deadlineText: item.deadline ? util.formatTime(item.deadline, 'YYYY-MM-DD') : '',
        salaryText: item.salaryMin && item.salaryMax 
          ? `¥${item.salaryMin}-${item.salaryMax}${item.salaryUnit || '/月'}`
          : '面议',
        isFavorited: dataService.isJobFavorited(item.id)
      };
    });

    this.setData({
      jobList: formattedList,
      refreshing: false
    });
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
    this.loadData();
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearchConfirm() {
    this.loadData();
  },

  onClearSearch() {
    this.setData({ searchKeyword: '' });
    this.loadData();
  },

  onToggleFilter() {
    this.setData({ showFilter: !this.data.showFilter });
  },

  onFilterItemTap(e) {
    const { type, value } = e.currentTarget.dataset;
    this.setData({
      [`filterValues.${type}`]: value
    });
  },

  onSortTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentSort: value });
    this.loadData();
  },

  onResetFilter() {
    this.setData({
      filterValues: {
        industry: 'all',
        grade: 'all',
        convertible: 'all'
      }
    });
  },

  onConfirmFilter() {
    this.setData({ showFilter: false });
    this.loadData();
  },

  onNavToDetail(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo('/pages/job-recruitment/detail?id=' + id);
  },

  onNavToReferral() {
    util.navigateTo('/pages/job-recruitment/referral');
  },

  onNavToCalendar() {
    util.navigateTo('/pages/job-recruitment/calendar');
  },

  onNavToMyApplications() {
    util.navigateTo('/pages/job-recruitment/my-applications');
  },

  onToggleFavorite(e) {
    e.stopPropagation();
    const { id } = e.currentTarget.dataset;
    const isFavorited = dataService.toggleJobFavorite(id);
    
    wx.showToast({
      title: isFavorited ? '已收藏' : '已取消收藏',
      icon: 'success',
      duration: 1500
    });
    
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadData();
  }
});
