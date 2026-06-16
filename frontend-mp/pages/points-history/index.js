const util = require('../../utils/util.js');
const pointsService = require('../../services/pointsService.js');
const constants = require('../../config/constants.js');
const app = getApp();

Page({
  data: {
    darkMode: false,
    loading: false,
    currentPoints: 0,
    totalEarn: 0,
    totalSpend: 0,
    totalRecords: 0,
    activeTab: 'all',
    tabs: [
      { value: 'all', label: '全部' },
      { value: 'in', label: '收入' },
      { value: 'out', label: '支出' }
    ],
    transactions: [],
    expiringPoints: null,
    soonestExpireText: ''
  },

  onLoad(options) {
    this.setData({
      darkMode: app.globalData.darkMode || false
    });
    if (!util.checkLogin(false)) {
      util.showToast('请先登录');
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/login/index' });
      }, 1500);
      return;
    }
    this.loadData();
  },

  onShow() {
    if (util.isLoggedIn()) {
      this.loadData();
    }
  },

  onPullDownRefresh() {
    this.loadData(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadData(callback) {
    this.setData({ loading: true });
    try {
      pointsService.checkAndClearExpiredPoints();
      const stats = pointsService.getTransactionStats();
      const expiringInfo = pointsService.getExpiringPoints();
      let soonestExpireText = '';
      if (expiringInfo.soonestExpire) {
        soonestExpireText = util.formatDate(expiringInfo.soonestExpire);
      }
      const transactions = this.filterTransactions(this.data.activeTab);
      this.setData({
        currentPoints: stats.currentPoints,
        totalEarn: stats.totalEarn,
        totalSpend: stats.totalSpend,
        totalRecords: stats.totalRecords,
        transactions,
        expiringPoints: expiringInfo.count,
        soonestExpireText,
        loading: false
      });
      if (callback) callback();
    } catch (error) {
      console.error('加载积分流水失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
      if (callback) callback();
    }
  },

  filterTransactions(tab) {
    let filters = {};
    if (tab !== 'all') {
      filters.direction = tab;
    }
    const transactions = pointsService.getTransactionList(null, filters);
    return transactions.map(item => {
      const typeInfo = constants.POINT_TRANSACTION_TYPE_MAP[item.type] || {};
      return {
        ...item,
        timeText: util.relativeTime(item.createTime),
        dateText: util.formatDate(item.createTime),
        fullTimeText: util.formatTime(item.createTime),
        pointsText: item.direction === 'in' ? `+${item.points}` : `-${item.points}`,
        pointsClass: item.direction === 'in' ? 'positive' : 'negative',
        typeIcon: typeInfo.icon || '📋',
        typeLabel: typeInfo.label || item.type,
        typeColor: typeInfo.color || '#666666'
      };
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.activeTab) return;
    this.setData({ activeTab: tab });
    const transactions = this.filterTransactions(tab);
    this.setData({ transactions });
  },

  goTasks() {
    wx.navigateTo({ url: '/pages/points-tasks/index' });
  },

  goMall() {
    wx.navigateTo({ url: '/pages/points-mall/index' });
  },

  goRules() {
    wx.navigateTo({ url: '/pages/points-rules/index' });
  },

  showTransactionDetail(e) {
    const item = e.currentTarget.dataset.item;
    if (!item) return;
    let content = `
【${item.typeLabel}】
积分变动：${item.pointsText}
变动前余额：${item.balanceBefore}
变动后余额：${item.balanceAfter}
交易时间：${item.fullTimeText}
`;
    if (item.description) {
      content += `\n说明：${item.description}`;
    }
    if (item.expireTime && item.direction === 'in') {
      content += `\n过期时间：${util.formatTime(item.expireTime)}`;
    }
    wx.showModal({
      title: '交易详情',
      content,
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  goBack() {
    wx.navigateBack();
  }
});
