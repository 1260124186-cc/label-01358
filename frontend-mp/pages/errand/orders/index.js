const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

const app = getApp();

mixPage({
  data: {
    darkMode: false,
    topTabs: constants.ERRAND_ORDER_TABS,
    currentTopTab: 'published',
    subTabs: constants.ERRAND_PUBLISHED_TABS,
    currentSubTab: 'all',
    orders: [],
    loading: false
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadData() {
    this.setData({ loading: true });
    return new Promise((resolve) => {
      const userId = (app.globalData.userInfo && app.globalData.userInfo.id) || 'test_user';
      let list;

      if (this.data.currentTopTab === 'published') {
        list = dataService.getMyPublishedOrders(userId);
      } else {
        list = dataService.getMyAcceptedOrders(userId);
      }

      if (this.data.currentSubTab !== 'all') {
        list = list.filter(item => item.status === this.data.currentSubTab);
      }

      const orders = list.map(item => {
        const statusInfo = constants.ERRAND_ORDER_STATUS.find(s => s.value === item.status) || {};
        const typeInfo = constants.ERRAND_TASK_TYPES.find(t => t.value === item.type) || {};

        return {
          ...item,
          statusText: statusInfo.label || item.status,
          statusColor: statusInfo.color || '#666',
          statusIcon: statusInfo.icon || '📋',
          typeText: typeInfo.label || item.type,
          typeIcon: typeInfo.icon || '📌',
          typeColor: typeInfo.color || '#666',
          timeText: util.relativeTime(item.createTime),
          bountyText: '¥' + (item.bounty || 0),
          descText: this._getDescText(item),
          locationText: this._getLocationText(item),
          isCompletedUnrated: item.status === 'completed' && !item.rating,
          isCancellable: this.data.currentTopTab === 'published' && item.status === 'pending'
        };
      });

      this.setData({
        orders,
        loading: false
      });

      resolve();
    });
  },

  _getDescText(item) {
    switch (item.type) {
      case 'express':
        return '取件码: ' + (item.pickupCode || '-');
      case 'purchase':
        return item.purchaseItem || '代买商品';
      case 'delivery':
        return item.deliveryItem || '代送物品';
      case 'queue':
        return item.queueTarget || '代排队';
      default:
        return item.description || '';
    }
  },

  _getLocationText(item) {
    const parts = [];
    if (item.pickupLocation) parts.push(item.pickupLocation);
    if (item.deliveryAddress) parts.push(item.deliveryAddress);
    return parts.join(' → ') || '-';
  },

  onTopTabChange(e) {
    const { tab } = e.currentTarget.dataset;
    const subTabs = tab === 'published'
      ? constants.ERRAND_PUBLISHED_TABS
      : constants.ERRAND_ACCEPTED_TABS;

    this.setData({
      currentTopTab: tab,
      subTabs,
      currentSubTab: 'all'
    });
    this.loadData();
  },

  onSubTabChange(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({ currentSubTab: tab });
    this.loadData();
  },

  onOrderTap(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo('/pages/errand/order-detail/index?id=' + item.id);
  },

  onCancelOrder(e) {
    const { id } = e.currentTarget.dataset;
    util.showConfirm('确定要取消该订单吗？').then(confirmed => {
      if (confirmed) {
        const result = dataService.cancelErrandOrder(id, '用户取消');
        if (result && !result.error) {
          util.showSuccess('已取消');
          this.loadData();
        } else {
          util.showError(result && result.error ? result.error : '取消失败');
        }
      }
    });
  },

  onRateOrder(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo('/pages/errand/rate/index?id=' + id);
  }
});
