const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    tabs: [],
    currentTab: 'all',
    categories: [],
    currentCategory: '',
    activityList: [],
    refreshing: false
  },

  onLoad() {
    this.setData({
      tabs: constants.VOLUNTEER_TABS,
      categories: constants.VOLUNTEER_CATEGORIES
    });
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const filters = {};

    if (this.data.currentTab && this.data.currentTab !== 'all') {
      filters.status = this.data.currentTab;
    }

    if (this.data.currentCategory) {
      filters.category = this.data.currentCategory;
    }

    const list = dataService.getVolunteerActivityList(filters);

    const formattedList = list.map(item => {
      const categoryItem = constants.VOLUNTEER_CATEGORIES.find(c => c.value === item.category) || {};
      const statusItem = constants.VOLUNTEER_STATUS.find(s => s.value === item.status) || {};
      const registrationCount = (item.registrations || []).length;
      const isFull = registrationCount >= (item.requiredCount || 0);

      return {
        ...item,
        categoryIcon: categoryItem.icon || '📌',
        categoryLabel: categoryItem.label || constants.getLabelByValue(constants.VOLUNTEER_CATEGORIES, item.category),
        categoryColor: categoryItem.color || '#6B7280',
        statusLabel: statusItem.label || '',
        statusColor: statusItem.color || '#6B7280',
        timeText: util.formatTime(item.startTime, 'MM-DD HH:mm'),
        registrationCount,
        isFull,
        canRegister: item.status === 'recruiting' && !isFull
      };
    });

    this.setData({
      activityList: formattedList,
      refreshing: false
    });
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
    this.loadData();
  },

  onCategoryTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentCategory: this.data.currentCategory === value ? '' : value });
    this.loadData();
  },

  onNavToDetail(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo('/pages/volunteer/detail?id=' + id);
  },

  onMyHours() {
    util.navigateTo('/pages/volunteer/stats');
  },

  onLeaderboard() {
    util.navigateTo('/pages/volunteer/leaderboard');
  },

  onPublish() {
    util.navigateTo('/pages/volunteer/publish');
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
