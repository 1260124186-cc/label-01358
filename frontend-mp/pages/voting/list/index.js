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
    ]
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
      const filters = {};
      if (this.data.currentTab !== 'all') {
        filters.status = this.data.currentTab;
      }

      const list = dataService.getVotingList(filters);
      const app = getApp();
      const userId = app.globalData.userInfo ? app.globalData.userInfo.account : '';

      const formattedList = list.map(item => {
        const hasVoted = userId ? dataService.hasUserVoted(item.id, userId) : false;
        const statusInfo = constants.VOTING_STATUS_MAP[item.status] || {};
        const candidateCount = (item.candidates || []).length;
        const timeText = this.formatVotingTime(item);

        return {
          ...item,
          statusInfo,
          timeText,
          candidateCount,
          hasVoted,
          isOwner: item.creator === userId
        };
      });

      this.setData({
        list: formattedList,
        loading: false,
        refreshing: false
      });

      resolve();
    });
  },

  formatVotingTime(item) {
    const now = Date.now();
    if (item.status === 'pending' && item.startTime) {
      return `距离开始：${util.relativeTime(item.startTime)}`;
    } else if (item.status === 'active' && item.endTime) {
      const remain = item.endTime - now;
      if (remain > 0) {
        const days = Math.floor(remain / 86400000);
        const hours = Math.floor((remain % 86400000) / 3600000);
        const minutes = Math.floor((remain % 3600000) / 60000);
        if (days > 0) return `剩余 ${days}天${hours}小时`;
        if (hours > 0) return `剩余 ${hours}小时${minutes}分钟`;
        return `剩余 ${minutes}分钟`;
      }
    }
    return util.relativeTime(item.createTime);
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
    const { item } = e.currentTarget.dataset;
    if (item.status === 'published') {
      util.navigateTo(`/pages/voting/result/index?id=${item.id}`);
      return;
    }
    if (item.status === 'ended') {
      util.navigateTo(`/pages/voting/result/index?id=${item.id}`);
      return;
    }
    if (item.status === 'pending') {
      util.navigateTo(`/pages/voting/detail/index?id=${item.id}`);
      return;
    }
    const app = getApp();
    const userId = app.globalData.userInfo ? app.globalData.userInfo.account : '';
    if (item.hasVoted || dataService.hasUserVoted(item.id, userId)) {
      util.navigateTo(`/pages/voting/result/index?id=${item.id}`);
    } else {
      util.navigateTo(`/pages/voting/detail/index?id=${item.id}`);
    }
  },

  onViewResult(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/voting/result/index?id=${id}`);
  },

  onCreate() {
    if (!util.checkLogin()) return;
    util.navigateTo('/pages/voting/create/index');
  },

  onDeleteVoting(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除吗？',
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
