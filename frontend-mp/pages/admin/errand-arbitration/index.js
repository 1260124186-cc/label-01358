const app = getApp();
const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    tabs: constants.ERRAND_ARBITRATION_TABS,
    activeTab: 'pending',
    disputeList: [],
    loading: false,
    stats: {
      pending: 0,
      processing: 0,
      resolved: 0,
      total: 0
    }
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
    util.showToast('已刷新');
  },

  loadData() {
    this.setData({ loading: true });

    const allList = dataService.getArbitrationList({});
    const pendingList = allList.filter(item => item.status === 'pending');
    const processingList = allList.filter(item => item.status === 'reviewing');
    const resolvedList = allList.filter(item =>
      item.status === 'resolved_publisher' ||
      item.status === 'resolved_runner' ||
      item.status === 'resolved_split' ||
      item.status === 'malicious'
    );

    const stats = {
      pending: pendingList.length,
      processing: processingList.length,
      resolved: resolvedList.length,
      total: allList.length
    };

    let displayList = [];
    switch (this.data.activeTab) {
      case 'pending':
        displayList = pendingList;
        break;
      case 'processing':
        displayList = processingList;
        break;
      case 'resolved':
        displayList = resolvedList;
        break;
      default:
        displayList = allList;
    }

    const formattedList = displayList.map(item => {
      const statusInfo = constants.ERRAND_DISPUTE_STATUS_MAP[item.status] || {};
      const taskTypeInfo = constants.ERRAND_TASK_TYPES.find(t => t.value === item.orderType);

      return {
        ...item,
        statusText: statusInfo.label || item.status,
        statusColor: statusInfo.color || '#666',
        statusIcon: statusInfo.icon || '📋',
        typeText: taskTypeInfo ? taskTypeInfo.label : item.orderType,
        typeIcon: taskTypeInfo ? taskTypeInfo.icon : '📌',
        bountyText: '¥' + (item.orderBounty || 0),
        timeText: util.formatTime(item.createTime, 'MM-DD HH:mm'),
        initiatorRoleText: item.initiatorRole === 'publisher' ? '发布者' : '跑手'
      };
    });

    this.setData({
      disputeList: formattedList,
      stats,
      loading: false
    });
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ activeTab: value });
    this.loadData();
  },

  onItemTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo('/pages/admin/errand-arbitration-detail/index?id=' + id);
  },

  goBack() {
    wx.navigateBack();
  }
});
