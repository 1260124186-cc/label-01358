const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    list: [],
    loading: false,
    refreshing: false,
    tabs: [
      { value: 'all', label: '全部' },
      { value: 'recruiting', label: '拼团中' },
      { value: 'success', label: '已成团' },
      { value: 'failed', label: '已流团' }
    ],
    currentTab: 'all',
    userPoints: 0
  },

  onLoad() {
    this.loadList();
  },

  onShow() {
    this.loadList();
    this.loadUserPoints();
  },

  onPullDownRefresh() {
    this.loadList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadUserPoints() {
    this.setData({ userPoints: dataService.getUserPoints() });
  },

  loadList() {
    this.setData({ loading: true });

    return new Promise((resolve) => {
      const list = dataService.getMyGroupBuys();

      const app = getApp();
      const userInfo = app.globalData.userInfo || {};
      const userId = userInfo.id || 'test_user';

      const formattedList = list
        .filter(item => {
          if (this.data.currentTab === 'all') return true;
          return item.status === this.data.currentTab;
        })
        .map(item => {
          const statusInfo = constants.GROUP_BUY_STATUS_MAP[item.status];
          const isPublisher = item.publisherId === userId;
          const myMember = (item.members || []).find(m => m.userId === userId);
          const myQuantity = myMember ? myMember.quantity : 0;
          const myAmount = myQuantity * item.unitPrice;

          const progressPercent = Math.min(100, Math.floor((item.joinedCount / item.minCount) * 100));
          const remainingCount = Math.max(0, item.minCount - item.joinedCount);

          return {
            ...item,
            statusText: statusInfo ? statusInfo.label : '',
            statusColor: statusInfo ? statusInfo.color : '',
            role: isPublisher ? 'publisher' : 'member',
            myQuantity,
            myAmount,
            progressPercent,
            remainingCount,
            timeText: util.relativeTime(item.createTime)
          };
        })
        .sort((a, b) => b.createTime - a.createTime);

      this.setData({
        list: formattedList,
        loading: false,
        refreshing: false
      });

      resolve();
    });
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadList();
    this.loadUserPoints();
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
    this.loadList();
  },

  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo('/pages/group-buy-detail/index?id=' + item.id);
  },

  onViewTransactions() {
    util.showToast('积分明细功能开发中');
  }
});
