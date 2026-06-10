const app = getApp();
const dataService = require('../../services/data');
const constants = require('../../config/constants');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    semesterIndex: 0,
    semesterOptions: [],
    semesterValues: [],
    leaderboard: [],
    currentUserRank: null,
    loading: true
  },

  onLoad() {
    const semesterOptions = constants.SEMESTER_OPTIONS.map(s => s.label);
    const semesterValues = constants.SEMESTER_OPTIONS.map(s => s.value);
    const currentSemester = dataService.getCurrentSemester();
    const semesterIndex = semesterValues.indexOf(currentSemester);

    this.setData({
      semesterOptions,
      semesterValues,
      semesterIndex: semesterIndex >= 0 ? semesterIndex : 0
    });

    this.loadData();
  },

  onShow() {
    const isDark = app.globalData.isDark;
    if (this.data.darkMode !== isDark) {
      this.setData({ darkMode: !!isDark });
    }
  },

  loadData() {
    const { semesterValues, semesterIndex } = this.data;
    const semester = semesterValues[semesterIndex];

    const list = dataService.getVolunteerLeaderboard(semester);

    const userId = (app.globalData.userInfo || {}).id || 'test_user';

    const leaderboard = list.map((item, index) => {
      let medalIcon = '';
      let medalBg = '';
      if (index === 0) { medalIcon = '🥇'; medalBg = '#FFD700'; }
      else if (index === 1) { medalIcon = '🥈'; medalBg = '#C0C0C0'; }
      else if (index === 2) { medalIcon = '🥉'; medalBg = '#CD7F32'; }

      return {
        ...item,
        rank: index + 1,
        medalIcon,
        medalBg,
        isTop3: index < 3,
        isMe: item.userId === userId
      };
    });

    const currentUserRank = leaderboard.find(item => item.isMe) || null;

    this.setData({
      leaderboard,
      currentUserRank,
      loading: false
    });
  },

  onSemesterChange(e) {
    this.setData({ semesterIndex: e.detail.value });
    this.loadData();
  }
});
