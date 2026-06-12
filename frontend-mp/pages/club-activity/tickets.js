const {
  TICKET_ORDER_TABS,
  TICKET_ORDER_STATUS_MAP,
  TICKET_REFUND_RULES,
  THEME_MODES
} = require('../../config/constants.js');
const dataService = require('../../services/data.js');
const { getThemeMode } = require('../../utils/theme.js');

Page({
  data: {
    currentTab: 'all',
    tabs: TICKET_ORDER_TABS,
    orders: [],
    filteredOrders: [],
    wallet: { balance: 0 },
    isDark: false,
    showTicketModal: false,
    selectedOrder: null,
    selectedTicketIndex: 0,
    showRefundModal: false,
    refundCalc: null,
    refundReason: ''
  },

  onLoad() {
    this.initData();
  },

  onShow() {
    this.initData();
  },

  initData() {
    const isDark = getThemeMode() === THEME_MODES.DARK;
    const orders = dataService.getTicketOrderList() || [];
    const wallet = dataService.getUserWallet() || { balance: 0 };
    this.setData({ isDark, orders, wallet });
    this.applyFilter();
  },

  applyFilter() {
    const { currentTab, orders } = this.data;
    let filtered;
    if (currentTab === 'all') {
      filtered = [...orders];
    } else {
      filtered = orders.filter(o => o.status === currentTab);
    }
    filtered.sort((a, b) => b.createdAt - a.createdAt);
    this.setData({ filteredOrders: filtered });
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value }, () => this.applyFilter());
  },

  onOrderTap(e) {
    const { orderId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/club-activity/detail?id=${this.data.orders.find(o => o.orderId === orderId).activityId}`
    });
  },

  onGoToActivity(e) {
    const { activityId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/club-activity/detail?id=${activityId}`
    });
  },

  onShowTicket(e) {
    e.stopPropagation();
    const { orderId } = e.currentTarget.dataset;
    const order = this.data.orders.find(o => o.orderId === orderId);
    this.setData({
      showTicketModal: true,
      selectedOrder: order,
      selectedTicketIndex: 0
    });
  },

  onCloseTicket() {
    this.setData({
      showTicketModal: false,
      selectedOrder: null
    });
  },

  onSwitchTicket(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ selectedTicketIndex: index });
  },

  onCopyCode() {
    const { selectedOrder, selectedTicketIndex } = this.data;
    if (!selectedOrder) return;
    const ticket = selectedOrder.tickets[selectedTicketIndex];
    wx.setClipboardData({
      data: ticket.ticketCode,
      success: () => wx.showToast({ title: '票码已复制', icon: 'none' })
    });
  },

  onOpenRefund(e) {
    e.stopPropagation();
    const { orderId } = e.currentTarget.dataset;
    const calc = dataService.calculateRefund(orderId);
    this.setData({
      showRefundModal: true,
      selectedOrder: this.data.orders.find(o => o.orderId === orderId),
      refundCalc: calc,
      refundReason: ''
    });
  },

  onCloseRefund() {
    this.setData({
      showRefundModal: false,
      selectedOrder: null,
      refundCalc: null,
      refundReason: ''
    });
  },

  onRefundReasonInput(e) {
    this.setData({ refundReason: e.detail.value });
  },

  onConfirmRefund() {
    const { selectedOrder, refundReason } = this.data;
    if (!selectedOrder) return;

    wx.showModal({
      title: '确认退票',
      content: `确认申请退票？将退回 ¥${(this.data.refundCalc.refundAmount / 100).toFixed(2)}`,
      confirmText: '确认退票',
      confirmColor: '#10B981',
      success: (res) => {
        if (!res.confirm) return;
        const result = dataService.requestRefund(selectedOrder.orderId, refundReason || '个人原因');
        if (result.success) {
          wx.showToast({ title: '退票成功', icon: 'success' });
          this.setData({ showRefundModal: false });
          this.initData();
        } else {
          wx.showToast({ title: result.message || '退票失败', icon: 'none' });
        }
      }
    });
  },

  formatDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  },

  formatMoney(cents) {
    return (cents / 100).toFixed(2);
  },

  formatActivityStart(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    return `${month}-${day} ${hh}:${mm}`;
  }
});
