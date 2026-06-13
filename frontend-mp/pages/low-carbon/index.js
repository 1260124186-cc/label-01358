const app = getApp();
const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    checkinTypes: [],
    todayCheckins: {},
    totalPoints: 0,
    totalCarbon: 0,
    checkinDays: 0,
    todayCount: 0,
    recentRecords: [],
    tip: '',
    showCheckinSuccess: false,
    checkinResult: null
  },

  onLoad() {
    this.setData({
      checkinTypes: constants.LOW_CARBON_CHECKIN_TYPES
    });
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const userId = (app.globalData.userInfo || {}).id || 'test_user';
    const points = dataService.getLowCarbonPoints(userId);
    const todayCheckins = dataService.getTodayCheckins(userId);
    const records = dataService.getLowCarbonPointsRecord(userId, 5);

    const todayCount = Object.keys(todayCheckins).length;

    const recentRecords = records.map(r => {
      const typeInfo = constants.LOW_CARBON_CHECKIN_MAP[r.type] || {};
      return {
        ...r,
        label: typeInfo.label || r.type,
        icon: typeInfo.icon || '🌿',
        timeText: util.formatTime(r.createTime, 'MM-DD HH:mm')
      };
    });

    const tip = constants.LOW_CARBON_TIPS[Math.floor(Math.random() * constants.LOW_CARBON_TIPS.length)];

    this.setData({
      totalPoints: points.totalPoints,
      totalCarbon: points.totalCarbon,
      checkinDays: points.checkinDays,
      todayCheckins,
      todayCount,
      recentRecords,
      tip
    });
  },

  onCheckin(e) {
    const { type } = e.currentTarget.dataset;
    const userId = (app.globalData.userInfo || {}).id || 'test_user';
    const result = dataService.doLowCarbonCheckin(userId, type);

    if (result.success) {
      this.setData({
        showCheckinSuccess: true,
        checkinResult: result
      });

      setTimeout(() => {
        this.setData({ showCheckinSuccess: false, checkinResult: null });
      }, 2000);
    } else {
      wx.showToast({ title: result.message, icon: 'none' });
    }

    this.loadData();
  },

  onNavLeaderboard() {
    util.navigateTo('/pages/low-carbon/leaderboard');
  },

  onNavWeeklyReport() {
    util.navigateTo('/pages/low-carbon/weekly-report');
  },

  onNavActivity() {
    util.navigateTo('/pages/low-carbon/activity');
  },

  onNavRedeem() {
    util.navigateTo('/pages/low-carbon/redeem');
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  }
});
