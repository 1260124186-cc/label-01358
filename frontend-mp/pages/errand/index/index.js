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
    taskTypes: constants.ERRAND_TASK_TYPES,
    currentType: '',
    hallStatus: constants.ERRAND_HALL_STATUS,
    currentStatus: 'all',
    bountyRanges: constants.ERRAND_BOUNTY_RANGES,
    currentBountyRange: '',
    currentBountyText: '',
    sortOptions: constants.ERRAND_SORT_OPTIONS,
    currentSort: 'latest',
    showBountyPicker: false,
    showSortPicker: false,
    searchKeyword: '',
    orderStats: {
      pending: 0,
      processing: 0,
      completed: 0
    }
  },

  onLoad() {
    dataService.checkTimeoutOrders();
    this.loadList();
  },

  onShow() {
    dataService.checkTimeoutOrders();
    this.loadList();
  },

  onPullDownRefresh() {
    dataService.checkTimeoutOrders();
    this.loadList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadList() {
    this.setData({ loading: true });

    return new Promise((resolve) => {
      const currentSortOption = constants.ERRAND_SORT_OPTIONS.find(s => s.value === this.data.currentSort);
      const currentBountyOption = constants.ERRAND_BOUNTY_RANGES.find(b => b.value === this.data.currentBountyRange);

      const filters = {
        type: this.data.currentType || '',
        status: this.data.currentStatus,
        bountyRange: currentBountyOption ? { min: currentBountyOption.min, max: currentBountyOption.max } : undefined,
        sortField: currentSortOption ? currentSortOption.field : 'createTime',
        sortOrder: currentSortOption ? currentSortOption.order : 'desc',
        keyword: this.data.searchKeyword
      };

      const list = dataService.getErrandHallList(filters);

      const formattedList = list.map(item => {
        const typeInfo = constants.ERRAND_TASK_TYPES.find(t => t.value === item.type);
        const statusInfo = constants.ERRAND_ORDER_STATUS.find(s => s.value === item.status);

        let deadlineText = '';
        if (item.deadline) {
          const diff = item.deadline - Date.now();
          if (diff <= 0) {
            deadlineText = '已截止';
          } else if (diff < 3600000) {
            deadlineText = Math.ceil(diff / 60000) + '分钟后';
          } else if (diff < 86400000) {
            deadlineText = Math.ceil(diff / 3600000) + '小时后';
          } else {
            deadlineText = Math.ceil(diff / 86400000) + '天后';
          }
        }

        let description = '';
        if (item.type === 'express') {
          description = item.pickupCode ? '取件码: ' + item.pickupCode : '';
        } else if (item.type === 'purchase') {
          description = item.purchaseItem || '';
        } else if (item.type === 'delivery') {
          description = item.deliveryItem || '';
        } else if (item.type === 'queue') {
          description = item.queuePurpose || '';
        } else {
          description = item.otherDesc || '';
        }

        return {
          ...item,
          typeText: typeInfo ? typeInfo.label : item.type,
          typeIcon: typeInfo ? typeInfo.icon : '📌',
          typeColor: typeInfo ? typeInfo.color : '#8B5CF6',
          typeGradient: typeInfo ? typeInfo.gradient : '',
          statusText: statusInfo ? statusInfo.label : item.status,
          statusColor: statusInfo ? statusInfo.color : '#666',
          statusIcon: statusInfo ? statusInfo.icon : '📋',
          bountyText: '¥' + (item.bounty || 0),
          deadlineText,
          description,
          pickupLocation: item.pickupLocation || '',
          deliveryLocation: item.deliveryLocation || '',
          publisherName: item.userName || '匿名用户',
          publisherAvatar: item.userAvatar || '',
          timeText: util.relativeTime(item.createTime)
        };
      });

      const allOrders = dataService.getErrandOrderList();
      const pending = allOrders.filter(o => o.status === 'pending').length;
      const processing = allOrders.filter(o => o.status === 'accepted' || o.status === 'in_progress').length;
      const completed = allOrders.filter(o => o.status === 'completed').length;

      this.setData({
        list: formattedList,
        loading: false,
        refreshing: false,
        orderStats: { pending, processing, completed }
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

  onShowBountyPicker() {
    this.setData({ showBountyPicker: true });
  },

  onHideBountyPicker() {
    this.setData({ showBountyPicker: false });
  },

  onBountySelect(e) {
    const { value } = e.currentTarget.dataset;
    const item = constants.ERRAND_BOUNTY_RANGES.find(i => i.value === value);

    this.setData({
      currentBountyRange: value,
      currentBountyText: item && value ? item.label : '',
      showBountyPicker: false
    });

    this.loadList();
  },

  onShowSortPicker() {
    this.setData({ showSortPicker: true });
  },

  onHideSortPicker() {
    this.setData({ showSortPicker: false });
  },

  onSortSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      currentSort: value,
      showSortPicker: false
    });
    this.loadList();
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearchConfirm() {
    this.loadList();
  },

  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo('/pages/errand/order-detail/index?id=' + item.id);
  },

  onPublish() {
    util.navigateTo('/pages/errand/task-create/index');
  },

  stopPropagation() {}
});
