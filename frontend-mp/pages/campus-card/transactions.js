const mockData = require('../../config/mock-data');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    currentTab: 'all',
    tabs: [
      { value: 'all', label: '全部' },
      { value: 'canteen', label: '食堂', icon: '🍜' },
      { value: 'supermarket', label: '超市', icon: '🛒' },
      { value: 'bathroom', label: '浴室', icon: '🚿' },
      { value: 'recharge', label: '充值', icon: '💰' }
    ],
    allTransactions: [],
    filteredList: [],
    groupedList: [],
    summary: {
      totalConsume: 0,
      totalRecharge: 0,
      count: 0
    },
    refreshing: false
  },

  onLoad() {
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadData() {
    return new Promise((resolve) => {
      const allTransactions = mockData.CAMPUS_CARD_TRANSACTIONS.map(t => ({
        ...t,
        amountText: t.type === 'recharge' ? `+${t.amount.toFixed(2)}` : `-${t.amount.toFixed(2)}`,
        timeText: util.formatTime(t.createTime, 'HH:mm'),
        dateText: util.formatTime(t.createTime, 'YYYY-MM-DD'),
        dateDisplay: this.formatDateDisplay(t.createTime)
      })).sort((a, b) => b.createTime - a.createTime);

      let totalConsume = 0;
      let totalRecharge = 0;
      allTransactions.forEach(t => {
        if (t.type === 'recharge') {
          totalRecharge += t.amount;
        } else {
          totalConsume += t.amount;
        }
      });

      this.setData({
        allTransactions,
        summary: {
          totalConsume,
          totalRecharge,
          count: allTransactions.length
        }
      });

      this.filterTransactions(this.data.currentTab);
      resolve();
    });
  },

  formatDateDisplay(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (targetDate.getTime() === today.getTime()) {
      return '今天';
    } else if (targetDate.getTime() === yesterday.getTime()) {
      return '昨天';
    } else {
      return util.formatTime(timestamp, 'MM月DD日');
    }
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
    this.filterTransactions(value);
  },

  filterTransactions(tab) {
    let filtered;
    if (tab === 'all') {
      filtered = this.data.allTransactions;
    } else {
      filtered = this.data.allTransactions.filter(t => t.category === tab);
    }

    const grouped = this.groupByDate(filtered);

    this.setData({
      filteredList: filtered,
      groupedList: grouped
    });
  },

  groupByDate(list) {
    const groups = {};
    list.forEach(item => {
      const key = item.dateText;
      if (!groups[key]) {
        groups[key] = {
          dateText: item.dateText,
          dateDisplay: item.dateDisplay,
          items: [],
          dayConsume: 0,
          dayRecharge: 0
        };
      }
      groups[key].items.push(item);
      if (item.type === 'recharge') {
        groups[key].dayRecharge += item.amount;
      } else {
        groups[key].dayConsume += item.amount;
      }
    });

    return Object.values(groups).sort((a, b) => {
      return new Date(b.dateText).getTime() - new Date(a.dateText).getTime();
    });
  },

  onTransactionTap(e) {
    const { item } = e.currentTarget.dataset;
    wx.showModal({
      title: '交易详情',
      content: `交易类型：${item.categoryName}\n交易地点：${item.merchant}\n交易金额：${item.amountText}\n交易时间：${util.formatTime(item.createTime)}\n剩余余额：¥${item.balanceAfter.toFixed(2)}`,
      showCancel: false,
      confirmText: '知道了'
    });
  }
});
