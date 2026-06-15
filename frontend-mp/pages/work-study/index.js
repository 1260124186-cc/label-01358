const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    tabs: [],
    currentTab: 'all',
    departments: [],
    currentDepartment: 'all',
    sortOptions: [
      { value: 'latest', label: '最新发布' },
      { value: 'wage_desc', label: '时薪高到低' },
      { value: 'wage_asc', label: '时薪低到高' }
    ],
    currentSort: 'latest',
    jobList: [],
    refreshing: false,
    searchKeyword: ''
  },

  onLoad() {
    dataService.initWorkStudyData();
    this.setData({
      tabs: constants.WORK_STUDY_JOB_TABS,
      departments: [{ value: 'all', label: '全部部门', icon: '🏢' }, ...constants.WORK_STUDY_DEPARTMENTS]
    });
    this.loadData();
  },

  onShow() {
    dataService.initWorkStudyData();
    this.loadData();
  },

  loadData() {
    const filters = {
      status: this.data.currentTab,
      department: this.data.currentDepartment,
      sort: this.data.currentSort,
      keyword: this.data.searchKeyword
    };

    const list = dataService.getWorkStudyJobList(filters);

    const formattedList = list.map(item => {
      const deptItem = constants.WORK_STUDY_DEPARTMENTS.find(d => d.value === item.department) || {};
      const statusItem = constants.WORK_STUDY_JOB_STATUS_MAP[item.status] || {};
      const isFull = (item.currentCount || 0) >= (item.recruitCount || 0);
      const remaining = Math.max(0, (item.recruitCount || 0) - (item.currentCount || 0));

      return {
        ...item,
        deptIcon: deptItem.icon || '📌',
        deptLabel: deptItem.label || item.departmentName || '',
        statusLabel: statusItem.label || '',
        statusColor: statusItem.color || '#6B7280',
        statusIcon: statusItem.icon || '',
        isFull,
        remaining,
        canApply: item.status === 'recruiting' && !isFull,
        createTimeText: util.formatTime(item.createTime, 'MM-DD')
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

  onDepartmentTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentDepartment: this.data.currentDepartment === value ? 'all' : value });
    this.loadData();
  },

  onSortChange(e) {
    const { value } = e.detail;
    this.setData({ currentSort: value });
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

  onNavToDetail(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo('/pages/work-study/detail?id=' + id);
  },

  onMyApplications() {
    util.navigateTo('/pages/work-study/my-applications');
  },

  onMyHours() {
    util.navigateTo('/pages/work-study/hours');
  },

  onSalary() {
    util.navigateTo('/pages/work-study/salary');
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
