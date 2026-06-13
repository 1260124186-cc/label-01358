const app = getApp();
const dataService = require('../../services/data');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    report: null
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const userId = (app.globalData.userInfo || {}).id || 'test_user';
    const report = dataService.getWeeklyCarbonReport(userId);

    const maxDailyPoints = report.maxDailyPoints || 1;
    const dailyData = report.dailyData.map(d => ({
      ...d,
      barHeight: d.points > 0 ? Math.max(20, (d.points / maxDailyPoints) * 100) : 0
    }));

    this.setData({
      report: {
        ...report,
        dailyData
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '我的低碳足迹周报',
      path: '/pages/low-carbon/index'
    };
  }
});
