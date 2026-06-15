const util = require('../../utils/util');
const constants = require('../../config/constants');
const dataService = require('../../services/data');
const { mixPage } = require('../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    darkMode: false,
    loading: true,
    userId: '',
    libraryInfo: {
      name: '校图书馆',
      openTime: '08:00 - 22:00',
      todayVisitors: 0,
      totalSeats: 0,
      availableSeats: 0
    },
    menus: [],
    borrowSummary: {
      currentCount: 0,
      overdueCount: 0,
      canRenewCount: 0
    },
    reminders: []
  },

  onLoad() {
    const currentUser = app.globalData.userInfo;
    const userId = currentUser ? currentUser.id : 'user_001';
    this.setData({
      userId,
      darkMode: app.globalData.isDark || false
    });
    dataService.initAllLibraryData();
    this.loadLibraryData();
  },

  onShow() {
    if (!this.data.loading) {
      this.loadLibraryData();
    }
  },

  onPullDownRefresh() {
    this.loadLibraryData();
    wx.stopPullDownRefresh();
  },

  loadLibraryData() {
    this.setData({ loading: true });

    try {
      const menus = constants.LIBRARY_HOME_MENUS.map(menu => ({ ...menu }));

      const rooms = dataService.getLibraryReadingRoomList();
      const totalSeats = rooms.reduce((sum, r) => sum + (r.totalCount || 0), 0);
      const availableSeats = rooms.reduce((sum, r) => sum + (r.availableCount || 0), 0);
      const todayVisitors = Math.floor(Math.random() * 500) + 800;

      const libraryInfo = {
        name: '校图书馆',
        openTime: '08:00 - 22:00',
        todayVisitors,
        totalSeats,
        availableSeats
      };

      const borrowSummary = dataService.getBorrowSummary(this.data.userId) || {};
      const reminders = dataService.checkLibraryReminders(this.data.userId) || [];

      this.setData({
        menus,
        libraryInfo,
        borrowSummary,
        reminders,
        loading: false
      });
    } catch (error) {
      console.error('加载图书馆数据失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  onMenuTap(e) {
    const { path } = e.currentTarget.dataset;
    if (path) {
      util.navigateTo(path);
    }
  },

  onReminderTap(e) {
    const { type, relatedid } = e.currentTarget.dataset;
    if (type === 'borrow_due') {
      util.navigateTo('/pages/library/my-borrow');
    } else if (type === 'seat_start') {
      util.navigateTo('/pages/library/seat-reservation');
    }
  }
});
