const app = getApp();
const dataService = require('../../services/data');
const constants = require('../../config/constants');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    tabs: [],
    currentTab: 'total',
    leaderboard: [],
    currentUserRank: null
  },

  onLoad() {
    this.setData({
      tabs: constants.LOW_CARBON_LEADERBOARD_TABS
    });
    this.loadData();
  },

  loadData() {
    const userId = (app.globalData.userInfo || {}).id || 'test_user';
    const list = dataService.getLowCarbonLeaderboard(this.data.currentTab);

    const leaderboard = list.map((item, index) => {
      let medalIcon = '';
      if (index === 0) medalIcon = '🥇';
      else if (index === 1) medalIcon = '🥈';
      else if (index === 2) medalIcon = '🥉';

      return {
        ...item,
        rank: index + 1,
        medalIcon,
        isTop3: index < 3,
        isMe: item.userId === userId
      };
    });

    const currentUserRank = leaderboard.find(item => item.isMe) || null;

    this.setData({ leaderboard, currentUserRank });
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
    this.loadData();
  }
});
