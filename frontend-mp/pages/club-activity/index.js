const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    tabs: [],
    currentTab: 'ongoing',
    categories: [],
    currentCategory: '',
    activityList: [],
    refreshing: false
  },

  onLoad() {
    this.setData({
      tabs: constants.CLUB_ACTIVITY_TABS,
      categories: constants.CLUB_ACTIVITY_CATEGORIES
    });
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    util.showLoading();
    const filters = {};
    const app = getApp();
    const userInfo = app.globalData.userInfo || {};
    const userId = userInfo.id || 'test_user';

    if (this.data.currentTab === 'my') {
      const list = dataService.getUserRegisteredActivities(userId);
      this.processList(list);
      util.hideLoading();
      return;
    }

    if (this.data.currentTab && this.data.currentTab !== 'all') {
      filters.status = this.data.currentTab;
    }

    if (this.data.currentCategory) {
      filters.category = this.data.currentCategory;
    }

    const list = dataService.getClubActivityList(filters);
    this.processList(list);
    util.hideLoading();
  },

  processList(list) {
    const formattedList = list.map(item => {
      const categoryItem = constants.CLUB_ACTIVITY_CATEGORIES.find(c => c.value === item.category) || {};
      const statusValue = item.activityStatus || this.computeStatus(item);
      const statusItem = constants.CLUB_ACTIVITY_STATUS.find(s => s.value === statusValue) || {};
      const registrationCount = (item.registrations || []).length;
      const remainingCount = Math.max(0, (item.capacity || 0) - registrationCount);
      const isFull = registrationCount >= (item.capacity || 0);
      const deadlineMs = new Date(item.deadline).getTime();
      const isDeadlinePassed = Date.now() > deadlineMs;

      return {
        ...item,
        categoryIcon: categoryItem.icon || '📌',
        categoryLabel: categoryItem.label || '其他',
        categoryColor: categoryItem.color || '#6B7280',
        statusLabel: statusItem.label || '',
        statusColor: statusItem.color || '#6B7280',
        activityTimeText: util.formatTime(item.activityTime, 'MM-DD HH:mm'),
        endTimeText: util.formatTime(item.endTime, 'MM-DD HH:mm'),
        deadlineText: util.formatTime(item.deadline, 'MM-DD HH:mm'),
        registrationCount,
        remainingCount,
        isFull,
        progressPercent: Math.min(100, Math.round(registrationCount / (item.capacity || 1) * 100)),
        canRegister: statusValue === 'upcoming' && !isFull && !isDeadlinePassed,
        userStatus: item.userRegistration ? (item.userRegistration.checkedIn ? 'checkedIn' : 'registered') : ''
      };
    });

    this.setData({
      activityList: formattedList,
      refreshing: false
    });
  },

  computeStatus(item) {
    const now = Date.now();
    const startMs = new Date(item.activityTime).getTime();
    const endMs = new Date(item.endTime).getTime();
    if (now > endMs) return 'ended';
    if (now >= startMs) return 'ongoing';
    return 'upcoming';
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
    util.navigateTo('/pages/club-activity/detail?id=' + id);
  },

  onCalendar() {
    util.navigateTo('/pages/club-activity/calendar');
  },

  onGoTickets() {
    if (!util.checkLogin()) return;
    util.navigateTo('/pages/club-activity/tickets');
  },

  onClubs() {
    util.navigateTo('/pages/club/index');
  },

  onPublish() {
    if (!util.checkLogin()) return;
    util.navigateTo('/pages/club-activity/publish');
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
