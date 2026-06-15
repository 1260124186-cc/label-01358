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
    repairTypes: constants.REPAIR_TYPES,
    currentType: '',
    userTabs: constants.REPAIR_USER_TABS,
    currentStatus: 'all',
    orderStats: {
      pending: 0,
      processing: 0,
      toRate: 0,
      completed: 0
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

  getCurrentUserId() {
    const app = getApp();
    const userInfo = app.globalData.userInfo || {};
    return userInfo.id || 'test_user';
  },

  loadList() {
    this.setData({ loading: true });

    return new Promise((resolve) => {
      const userId = this.getCurrentUserId();
      const currentStatus = this.data.currentStatus;

      let list = dataService.getMyRepairOrders(userId, currentStatus);

      if (this.data.currentType) {
        list = list.filter(item => item.type === this.data.currentType);
      }

      const formattedList = list.map(item => {
        const typeInfo = constants.REPAIR_TYPES.find(t => t.value === item.type);
        const statusInfo = constants.REPAIR_ORDER_STATUS.find(s => s.value === item.status);

        let description = item.description || '';
        if (description.length > 50) {
          description = description.substring(0, 50) + '...';
        }

        const urgentInfo = item.isUrgent
          ? (constants.REPAIR_URGENT_TYPES.find(u => u.value === item.urgentType) || {})
          : {};

        return {
          ...item,
          typeText: typeInfo ? typeInfo.label : item.type,
          typeIcon: typeInfo ? typeInfo.icon : '🔧',
          typeColor: typeInfo ? typeInfo.color : '#8B5CF6',
          typeGradient: typeInfo ? typeInfo.gradient : '',
          statusText: statusInfo ? statusInfo.label : item.status,
          statusColor: statusInfo ? statusInfo.color : '#666',
          statusIcon: statusInfo ? statusInfo.icon : '📋',
          description,
          dormitoryText: item.dormitoryNo || item.dormitory || item.dormitoryNumber || '',
          timeText: util.relativeTime(item.createTime),
          urgentText: urgentInfo.label || '',
          urgentIcon: urgentInfo.icon || '',
          isUrgent: !!item.isUrgent
        };
      });

      const stats = dataService.getRepairOrderStats(userId);
      const allOrders = dataService.getMyRepairOrders(userId);
      const toRateCount = allOrders.filter(o => o.status === 'completed').length;
      const completedCount = allOrders.filter(o => o.status === 'rated').length;

      this.setData({
        list: formattedList,
        loading: false,
        refreshing: false,
        orderStats: {
          pending: stats.pending || 0,
          processing: stats.processing || 0,
          toRate: toRateCount,
          completed: completedCount
        }
      });

      resolve();
    });
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadList();
  },

  onTypeChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentType: this.data.currentType === value ? '' : value });
    this.loadList();
  },

  onStatusChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentStatus: value });
    this.loadList();
  },

  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo('/pages/dorm-repair/detail/index?id=' + item.id);
  },

  onSubmit() {
    util.navigateTo('/pages/dorm-repair/create/index');
  },

  onStatTap(e) {
    const { status } = e.currentTarget.dataset;
    this.setData({ currentStatus: status });
    this.loadList();
  },

  stopPropagation() {}
});
