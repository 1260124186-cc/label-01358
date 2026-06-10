const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    services: [
      {
        id: 'express',
        name: '快递代取',
        icon: '📦',
        desc: '快递送到手，省时又省力',
        gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
        url: '/pages/errand/express-create/index'
      },
      {
        id: 'print',
        name: '打印复印',
        icon: '🖨️',
        desc: '在线提交，轻松打印',
        gradient: 'linear-gradient(135deg, #4ECDC4 0%, #6EE7DE 100%)',
        url: '/pages/errand/print-create/index'
      }
    ],
    recentOrders: [],
    orderStats: {
      pending: 0,
      processing: 0,
      completed: 0
    }
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
    return new Promise((resolve) => {
      const allOrders = dataService.getErrandOrderList();
      const pending = allOrders.filter(o => o.status === 'pending').length;
      const processing = allOrders.filter(o => o.status === 'processing').length;
      const completed = allOrders.filter(o => o.status === 'completed').length;

      const recentOrders = allOrders.slice(0, 5).map(item => {
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
        recentOrders,
        orderStats: { pending, processing, completed }
      });

      resolve();
    });
  },

  onServiceTap(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo(item.url);
  },

  onOrdersTap() {
    util.navigateTo('/pages/errand/orders/index');
  },

  onOrderTap(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo('/pages/errand/order-detail/index?id=' + item.id);
  },

  onAddressTap() {
    util.navigateTo('/pages/errand/address/index');
  }
});
