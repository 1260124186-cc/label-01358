const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    order: null,
    statusSteps: []
  },

  onLoad(options) {
    if (options.id) {
      this.loadOrder(options.id);
    }
  },

  loadOrder(id) {
    const order = dataService.getErrandOrderDetail(id);
    if (!order) {
      util.showToast('订单不存在');
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const statusInfo = constants.ERRAND_ORDER_STATUS.find(s => s.value === order.status);
    const statusSteps = [
      { label: '待处理', value: 'pending', done: false, active: false },
      { label: '处理中', value: 'processing', done: false, active: false },
      { label: '已完成', value: 'completed', done: false, active: false }
    ];

    const statusOrder = ['pending', 'processing', 'completed'];
    const currentIndex = statusOrder.indexOf(order.status);

    statusSteps.forEach((step, index) => {
      if (index < currentIndex) {
        step.done = true;
      } else if (index === currentIndex) {
        step.active = true;
      }
    });

    const formattedOrder = {
      ...order,
      statusText: statusInfo ? statusInfo.label : order.status,
      statusColor: statusInfo ? statusInfo.color : '#666',
      statusIcon: statusInfo ? statusInfo.icon : '📋',
      typeText: order.type === 'express' ? '快递代取' : '打印复印',
      typeIcon: order.type === 'express' ? '📦' : '🖨️',
      timeText: util.formatTime(order.createTime, 'YYYY-MM-DD HH:mm'),
      priceText: order.type === 'express' ? '¥' + (order.bounty || 0) : '¥' + util.formatPrice(order.totalPrice || 0)
    };

    this.setData({
      order: formattedOrder,
      statusSteps
    });
  },

  onCancel() {
    if (!this.data.order) return;
    util.showConfirm('确定要取消该订单吗？').then(confirmed => {
      if (confirmed) {
        const result = dataService.cancelErrandOrder(this.data.order.id);
        if (result) {
          util.showSuccess('已取消').then(() => {
            this.loadOrder(this.data.order.id);
          });
        } else {
          util.showError('取消失败');
        }
      }
    });
  },

  onCopyPickupCode() {
    if (!this.data.order || !this.data.order.pickupCode) return;
    wx.setClipboardData({
      data: this.data.order.pickupCode,
      success: () => {
        util.showToast('已复制取件码');
      }
    });
  },

  onCallPhone() {
    if (!this.data.order || !this.data.order.contactPhone) return;
    wx.makePhoneCall({
      phoneNumber: this.data.order.contactPhone,
      fail: () => {}
    });
  }
});
