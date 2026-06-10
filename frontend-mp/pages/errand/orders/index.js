const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    tabs: constants.ERRAND_ORDER_TABS,
    currentTab: 'all',
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
      const filters = {};
      if (this.data.currentTab !== 'all') {
        filters.status = this.data.currentTab;
      }

      const list = dataService.getErrandOrderList(filters);
      const orders = list.map(item => {
        const statusInfo = constants.ERRAND_ORDER_STATUS.find(s => s.value === item.status);
        return {
          ...item,
          statusText: statusInfo ? statusInfo.label : item.status,
          statusColor: statusInfo ? statusInfo.color : '#666',
          statusIcon: statusInfo ? statusInfo.icon : '📋',
          typeText: item.type === 'express' ? '快递代取' : '打印复印',
          typeIcon: item.type === 'express' ? '📦' : '🖨️',
          timeText: util.relativeTime(item.createTime),
          priceText: item.type === 'express' ? '¥' + (item.bounty || 0) : '¥' + util.formatPrice(item.totalPrice || 0)
        };
      });

      this.setData({
        orders,
        loading: false
      });

      resolve();
    });
  },

  onTabChange(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({ currentTab: tab });
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
        const result = dataService.cancelErrandOrder(id);
        if (result) {
          util.showSuccess('已取消');
          this.loadData();
        } else {
          util.showError('取消失败');
        }
      }
    });
  }
});
