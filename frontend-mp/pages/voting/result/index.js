const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    votingId: '',
    voting: null,
    statistics: null,
    statusInfo: {},
    loading: true,
    totalVotes: 0,
    startTimeText: '',
    endTimeText: '',
    publishTimeText: '',
    isOwner: false,
    canViewResult: false,
    currentTab: 'ranking',
    tabs: [
      { value: 'ranking', label: '结果排名' },
      { value: 'voters', label: '投票明细' }
    ],
    showVoterTab: false
  },

  onLoad(options) {
    this.setData({ votingId: options.id || '' });
    this.loadResult();
  },

  onPullDownRefresh() {
    this.loadResult().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadResult() {
    const { votingId } = this.data;
    if (!votingId) {
      util.showError('参数错误');
      return Promise.resolve();
    }

    this.setData({ loading: true });

    return new Promise((resolve) => {
      const voting = dataService.getVotingDetail(votingId);
      const app = getApp();
      const userInfo = app.globalData.userInfo || null;
      const userId = userInfo ? userInfo.account : '';

      if (!voting) {
        this.setData({ loading: false, voting: null });
        util.showError('投票不存在');
        resolve();
        return;
      }

      const statusInfo = constants.VOTING_STATUS_MAP[voting.status] || {};
      const rawStatistics = dataService.getVotingStatistics(votingId);
      let statistics = rawStatistics;
      if (rawStatistics && rawStatistics.voterList) {
        statistics = {
          ...rawStatistics,
          voterList: rawStatistics.voterList.map(v => ({
            ...v,
            createTimeText: util.formatTime(v.createTime)
          }))
        };
      }
      const showVoterTab = voting.visibility === 'realname' && statistics && statistics.voterList && statistics.voterList.length > 0;

      this.setData({
        voting,
        statistics,
        statusInfo,
        totalVotes: statistics ? statistics.totalVotes : 0,
        startTimeText: util.formatTime(voting.startTime),
        endTimeText: util.formatTime(voting.endTime),
        publishTimeText: voting.publishTime ? util.formatTime(voting.publishTime) : '',
        isOwner: voting.creator === userId,
        canViewResult: statistics ? statistics.canViewResult : false,
        showVoterTab,
        loading: false
      });

      resolve();
    });
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
  },

  onBackToVote() {
    wx.redirectTo({
      url: `/pages/voting/detail/index?id=${this.data.votingId}`
    });
  },

  onPublishResult() {
    wx.showModal({
      title: '公示结果',
      content: '公示后所有人均可查看详细投票结果，确认公示？',
      confirmColor: '#8B5CF6',
      success: (res) => {
        if (res.confirm) {
          const result = dataService.publishVotingResult(this.data.votingId);
          if (result) {
            util.showSuccess('已公示');
            this.loadResult();
          } else {
            util.showError('操作失败');
          }
        }
      }
    });
  },

  onShareAppMessage() {
    const { voting } = this.data;
    return {
      title: `【投票结果】${voting ? voting.title : '校园投票'}`,
      path: `/pages/voting/result/index?id=${this.data.votingId}`
    };
  }
});
