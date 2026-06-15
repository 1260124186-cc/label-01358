const util = require('../../../utils/util');
const constants = require('../../../config/constants');
const dataService = require('../../../services/data');
const { mixPage } = require('../../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    darkMode: false,
    loading: true,
    userId: '',
    keyword: '',
    startDate: '',
    endDate: '',
    repairTypes: [],
    selectedType: 'all',
    orders: [],
    filteredOrders: []
  },

  onLoad() {
    const currentUser = app.globalData.userInfo;
    const userId = currentUser ? currentUser.id : '';
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    this.setData({
      userId,
      darkMode: app.globalData.darkMode || false,
      repairTypes: [{ value: 'all', label: '全部类型', icon: '📋', color: '#6B7280' }, ...constants.REPAIR_TYPES],
      endDate: util.formatTime(today, 'YYYY-MM-DD'),
      startDate: util.formatTime(thirtyDaysAgo, 'YYYY-MM-DD')
    });

    this.loadOrders();
  },

  onShow() {
    if (this.data.userId && !this.data.loading) {
      this.loadOrders();
    }
  },

  onPullDownRefresh() {
    this.loadOrders();
    wx.stopPullDownRefresh();
  },

  loadOrders() {
    this.setData({ loading: true });

    try {
      const orders = dataService.getRepairOrderList({
        userId: this.data.userId
      }).map(order => ({
        ...order,
        createTimeText: util.formatTime(order.createTime),
        urgentTypeLabel: order.isUrgent
          ? (constants.REPAIR_URGENT_TYPES.find(u => u.value === order.urgentType)?.label || '紧急')
          : ''
      }));

      this.setData({
        orders,
        loading: false
      });

      this.filterOrders();
    } catch (error) {
      console.error('加载工单列表失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  filterOrders() {
    const { orders, keyword, selectedType, startDate, endDate } = this.data;
    let filtered = [...orders];

    if (keyword && keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      filtered = filtered.filter(o =>
        (o.orderNo && o.orderNo.toLowerCase().includes(kw)) ||
        (o.dormitoryNo && o.dormitoryNo.toLowerCase().includes(kw)) ||
        (o.description && o.description.toLowerCase().includes(kw))
      );
    }

    if (selectedType && selectedType !== 'all') {
      filtered = filtered.filter(o => o.type === selectedType);
    }

    if (startDate) {
      const startTs = new Date(startDate + ' 00:00:00').getTime();
      filtered = filtered.filter(o => o.createTime >= startTs);
    }

    if (endDate) {
      const endTs = new Date(endDate + ' 23:59:59').getTime();
      filtered = filtered.filter(o => o.createTime <= endTs);
    }

    this.setData({ filteredOrders: filtered });
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  onSearch() {
    this.filterOrders();
  },

  onClearKeyword() {
    this.setData({ keyword: '' }, () => {
      this.filterOrders();
    });
  },

  onStartDateChange(e) {
    this.setData({ startDate: e.detail.value }, () => {
      this.filterOrders();
    });
  },

  onEndDateChange(e) {
    this.setData({ endDate: e.detail.value }, () => {
      this.filterOrders();
    });
  },

  onTypeTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ selectedType: value }, () => {
      this.filterOrders();
    });
  },

  onOrderTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/dorm-repair/detail/index?id=${id}`);
  },

  goBack() {
    wx.navigateBack();
  }
});
