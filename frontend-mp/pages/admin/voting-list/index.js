const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    list: [],
    loading: false,
    refreshing: false,
    currentTab: 'all',
    tabs: [
      { value: 'all', label: '全部' },
      { value: 'pending', label: '未开始' },
      { value: 'active', label: '投票中' },
      { value: 'ended', label: '已结束' },
      { value: 'published', label: '已公示' }
    ],
    stats: {
      total: 0,
      active: 0,
      ended: 0,
      totalVotes: 0
    }
  },

  onLoad() {
    this.loadList();
  },

  onShow() {
    this.loadList();
  },

  onPullDownRefresh() {
    this.loadList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadList() {
    this.setData({ loading: true });

    return new Promise((resolve) => {
      const app = getApp();
      const userId = app.globalData.userInfo ? app.globalData.userInfo.account : '';

      const filters = {};
      if (this.data.currentTab !== 'all') {
        filters.status = this.data.currentTab;
      }

      const allList = dataService.getVotingList({});
      const list = this.data.currentTab !== 'all'
        ? allList.filter(item => item.status === this.data.currentTab)
        : allList;

      const stats = {
        total: allList.length,
        active: allList.filter(i => i.status === 'active').length,
        ended: allList.filter(i => i.status === 'ended' || i.status === 'published').length,
        totalVotes: allList.reduce((sum, i) => sum + (i.voteCount || 0), 0)
      };

      const formattedList = list.map(item => {
        const statusInfo = constants.VOTING_STATUS_MAP[item.status] || {};
        const candidateCount = (item.candidates || []).length;
        return {
          ...item,
          statusInfo,
          candidateCount,
          createTimeText: util.formatTime(item.createTime),
          endTimeText: util.formatTime(item.endTime)
        };
      });

      this.setData({
        list: formattedList,
        stats,
        loading: false,
        refreshing: false
      });

      resolve();
    });
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
    this.loadList();
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadList();
  },

  onItemTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/voting/detail/index?id=${id}`);
  },

  onViewResult(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/voting/result/index?id=${id}`);
  },

  onCreate() {
    if (!util.checkLogin()) return;
    util.navigateTo('/pages/voting/create/index');
  },

  onPublish(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '公示结果',
      content: '公示后所有人均可查看详细投票结果，确认公示？',
      confirmColor: '#8B5CF6',
      success: (res) => {
        if (res.confirm) {
          const result = dataService.publishVotingResult(id);
          if (result) {
            util.showSuccess('已公示');
            this.loadList();
          } else {
            util.showError('操作失败');
          }
        }
      }
    });
  },

  onEnd(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '提前结束投票',
      content: '结束后将无法再接收新的投票，确定要提前结束吗？',
      confirmColor: '#FF6B6B',
      success: (res) => {
        if (res.confirm) {
          const result = dataService.updateVoting(id, {
            endTime: Date.now() - 1,
            status: 'ended'
          });
          if (result) {
            util.showSuccess('已结束');
            this.loadList();
          } else {
            util.showError('操作失败');
          }
        }
      }
    });
  },

  onDelete(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: '删除后所有投票数据将无法恢复，确定要删除吗？',
      confirmColor: '#FF6B6B',
      success: (res) => {
        if (res.confirm) {
          dataService.deleteVoting(id);
          util.showSuccess('已删除');
          this.loadList();
        }
      }
    });
  }
});
