const dataService = require('../../services/data');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    clubId: '',
    stats: {
      memberCount: 0,
      activityCount: 0,
      avgParticipationRate: 0,
      monthActiveCount: 0,
      announcementCount: 0,
      newMembersThisMonth: 0
    },
    recentActivities: [],
    memberGrowth: []
  },

  onLoad(options) {
    this.setData({ clubId: options.clubId });
    this.loadData();
  },

  onShow() {
    if (this.data.clubId) {
      this.loadData();
    }
  },

  loadData() {
    util.showLoading();
    
    const stats = dataService.getClubStats(this.data.clubId);
    const activities = dataService.getClubActivities(this.data.clubId);
    
    const recentActivities = activities
      .sort((a, b) => new Date(b.activityTime) - new Date(a.activityTime))
      .slice(0, 5)
      .map(item => {
        const registrations = item.registrations || [];
        const checkinCount = registrations.filter(r => r.checkedIn).length;
        const registrationCount = registrations.length;
        return {
          ...item,
          activityTimeText: util.formatTime(item.activityTime, 'MM-DD HH:mm'),
          registrationCount,
          checkinCount,
          participationRate: registrationCount > 0
            ? Math.round(checkinCount / registrationCount * 100)
            : 0
        };
      });

    this.setData({
      stats,
      recentActivities
    });
    
    this.generateMockChartData();
    util.hideLoading();
  },

  generateMockChartData() {
    const now = new Date();
    const memberGrowth = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      memberGrowth.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        count: Math.floor(Math.random() * 20) + 5
      });
    }
    this.setData({ memberGrowth });
  }
});
