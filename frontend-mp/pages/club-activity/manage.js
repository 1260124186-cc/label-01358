const {
  THEME_MODES,
  TICKET_ORDER_STATUS_MAP,
  CHECKIN_STATUS_MAP,
  CLUB_ACTIVITY_CATEGORY_MAP,
  CLUB_ACTIVITY_STATUS_MAP
} = require('../../config/constants.js');
const dataService = require('../../services/data.js');
const { getThemeMode } = require('../../utils/theme.js');

Page({
  data: {
    activityId: '',
    activity: null,
    isDark: false,
    currentView: 'registrations',
    viewTabs: [
      { value: 'registrations', label: '报名名单' },
      { value: 'orders', label: '购票订单' }
    ],
    ticketStats: { sold: 0, verified: 0, refunded: 0, revenue: 0 },
    registrations: [],
    orders: [],
    orderVerifiedCounts: {},
    orderUnverifiedCounts: {},
    orderHasUnverified: {},
    showDetailModal: false,
    selectedItem: null,
    selectedType: 'registration',
    selectedVerifiedCount: 0,
    selectedUnverifiedCount: 0,
    selectedHasUnverified: false,
    statusMap: {}
  },

  onLoad(options) {
    const activityId = options.activityId;
    this.setData({ activityId, isDark: getThemeMode() === THEME_MODES.DARK });
    this.initData();
  },

  onShow() {
    this.initData();
  },

  initData() {
    if (!this.data.activityId) return;
    const activity = dataService.getActivityDetail(this.data.activityId);
    const ticketStats = dataService.getActivityTicketStats(this.data.activityId) || { sold: 0, verified: 0, refunded: 0, revenue: 0 };

    const registrations = activity && activity.registrations ? activity.registrations : [];
    const sortedRegs = [...registrations].sort((a, b) => b.registeredAt - a.registeredAt);

    const allOrders = dataService.getTicketOrderList() || [];
    const orders = allOrders
      .filter(o => o.activityId === this.data.activityId)
      .sort((a, b) => b.createdAt - a.createdAt);

    const orderVerifiedCounts = {};
    const orderUnverifiedCounts = {};
    const orderHasUnverified = {};
    orders.forEach(o => {
      const tickets = o.tickets || [];
      let vc = 0, uc = 0;
      tickets.forEach(t => { t.verified ? vc++ : uc++; });
      orderVerifiedCounts[o.orderId] = vc;
      orderUnverifiedCounts[o.orderId] = uc;
      orderHasUnverified[o.orderId] = uc > 0;
    });

    this.setData({
      activity,
      ticketStats,
      registrations: sortedRegs,
      orders,
      orderVerifiedCounts,
      orderUnverifiedCounts,
      orderHasUnverified,
      statusMap: TICKET_ORDER_STATUS_MAP
    });
  },

  onBack() {
    wx.navigateBack({ delta: 1, fail: () => wx.switchTab({ url: '/pages/club-activity/list' }) });
  },

  onSwitchView(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentView: value });
  },

  onGoVerify() {
    wx.navigateTo({
      url: `/pages/club-activity/verify?activityId=${this.data.activityId}`
    });
  },

  onShowRegistrationDetail(e) {
    const { userId } = e.currentTarget.dataset;
    const item = this.data.registrations.find(r => r.userId === userId);
    this.setData({
      showDetailModal: true,
      selectedItem: item,
      selectedType: 'registration'
    });
  },

  onShowOrderDetail(e) {
    const { orderId } = e.currentTarget.dataset;
    const item = this.data.orders.find(o => o.orderId === orderId);
    const tickets = item && item.tickets ? item.tickets : [];
    let vc = 0, uc = 0;
    tickets.forEach(t => { t.verified ? vc++ : uc++; });
    this.setData({
      showDetailModal: true,
      selectedItem: item,
      selectedType: 'order',
      selectedVerifiedCount: vc,
      selectedUnverifiedCount: uc,
      selectedHasUnverified: uc > 0
    });
  },

  onCloseDetail() {
    this.setData({
      showDetailModal: false,
      selectedItem: null
    });
  },

  onToggleCheckIn(e) {
    e.stopPropagation();
    const { userId } = e.currentTarget.dataset;
    const activity = this.data.activity;
    const registrations = activity.registrations.map(r => {
      if (r.userId === userId) {
        return {
          ...r,
          checkedIn: !r.checkedIn,
          checkInTime: !r.checkedIn ? Date.now() : null,
          checkInStatus: !r.checkedIn ? 'checked_in' : 'registered'
        };
      }
      return r;
    });
    const result = dataService.updateActivity(this.data.activityId, { registrations });
    if (result) {
      wx.showToast({ title: '状态已更新', icon: 'success' });
      this.initData();
      this.setData({ selectedItem: registrations.find(r => r.userId === userId) });
    } else {
      wx.showToast({ title: '更新失败', icon: 'none' });
    }
  },

  onManualVerify(e) {
    e.stopPropagation();
    const { orderId } = e.currentTarget.dataset;
    const order = this.data.orders.find(o => o.orderId === orderId);
    if (!order) return;

    const unVerifiedTickets = (order.tickets || []).filter(t => !t.verified);
    if (unVerifiedTickets.length === 0) {
      wx.showToast({ title: '此订单已全部验票', icon: 'none' });
      return;
    }

    const tickets = order.tickets.map((t, i) => {
      if (!t.verified && i === 0) {
        return { ...t, verified: true, verifiedAt: Date.now() };
      }
      return t;
    });

    const verifiedTicket = tickets.find(t => t.verifiedAt && !order.tickets.find(ot => ot.ticketCode === t.ticketCode && ot.verified));
    const ticketCode = (unVerifiedTickets[0] || {}).ticketCode;

    const verifyResult = dataService.verifyTicketByCode(ticketCode, this.data.activityId);
    if (verifyResult.success) {
      wx.showToast({ title: `验票成功 ${ticketCode}`, icon: 'success' });
      this.initData();
    } else {
      wx.showToast({ title: verifyResult.message || '验票失败', icon: 'none' });
    }
  },

  onExportData() {
    const text = this.generateExportText();
    wx.setClipboardData({
      data: text,
      success: () => wx.showToast({ title: '数据已复制到剪贴板', icon: 'success' })
    });
  },

  generateExportText() {
    const { activity, registrations, orders, ticketStats } = this.data;
    let text = `=== 活动管理数据 ===\n`;
    text += `活动名称：${activity.title}\n`;
    text += `活动时间：${this.formatFullTime(activity.startAt)} ~ ${this.formatFullTime(activity.endAt)}\n`;
    text += `报名人数：${registrations.length} / ${activity.capacity || '不限'}\n\n`;

    if (!activity.isFreeTicket && ticketStats.sold > 0) {
      text += `--- 票务统计 ---\n`;
      text += `已售票数：${ticketStats.sold}\n`;
      text += `已验票：${ticketStats.verified}\n`;
      text += `已退票：${ticketStats.refunded}\n`;
      text += `总收入：¥${this.formatMoney(ticketStats.revenue)}\n\n`;
    }

    if (registrations.length > 0) {
      text += `--- 报名名单 (${registrations.length}人) ---\n`;
      text += `序号\t姓名\t学号\t专业\t报名时间\t签到状态\n`;
      registrations.forEach((r, i) => {
        const statusText = r.checkedIn ? '已签到' : '未签到';
        text += `${i + 1}\t${r.userName}\t${r.studentNo || '-'}\t${r.major || '-'}\t${this.formatFullTime(r.registeredAt)}\t${statusText}\n`;
      });
      text += `\n`;
    }

    if (orders.length > 0) {
      text += `--- 购票订单 (${orders.length}单) ---\n`;
      text += `订单号\t购票人\t数量\t金额\t状态\t购票时间\n`;
      orders.forEach(o => {
        const status = (TICKET_ORDER_STATUS_MAP[o.status] || {}).label || o.status;
        text += `${o.orderId}\t${o.buyerName}\t${o.quantity}\t¥${this.formatMoney(o.totalAmount)}\t${status}\t${this.formatFullTime(o.createdAt)}\n`;
      });
    }

    return text;
  },

  formatMoney(cents) {
    return (cents / 100).toFixed(2);
  },

  formatFullTime(ts) {
    if (!ts) return '-';
    const d = new Date(ts);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  },

  formatShortTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }
});
