const {
  THEME_MODES,
  TICKET_ORDER_STATUS_MAP,
  STORAGE_KEYS
} = require('../../config/constants.js');
const dataService = require('../../services/data.js');
const storage = require('../../utils/storage.js');
const { getThemeMode } = require('../../utils/theme.js');

Page({
  data: {
    activityId: '',
    activity: null,
    isDark: false,
    verifyLogs: [],
    stats: { sold: 0, verified: 0, total: 0 },
    showVerifyModal: false,
    verifyResult: null,
    showTicketInput: false,
    ticketInput: ''
  },

  onLoad(options) {
    const activityId = options.activityId;
    this.setData({ activityId, isDark: getThemeMode() === THEME_MODES.DARK });
    this.initData();
  },

  onShow() {
    this.initData();
  },

  onBack() {
    wx.navigateBack({ delta: 1, fail: () => wx.switchTab({ url: '/pages/club-activity/list' }) });
  },

  initData() {
    if (!this.data.activityId) return;
    const activity = dataService.getActivityDetail(this.data.activityId);
    const stats = dataService.getActivityTicketStats(this.data.activityId) || { sold: 0, verified: 0, total: 0 };
    const allLogs = storage.get(STORAGE_KEYS.TICKET_VERIFY_LOG) || [];
    const verifyLogs = allLogs
      .filter(l => l.activityId === this.data.activityId)
      .sort((a, b) => b.verifiedAt - a.verifiedAt);
    this.setData({ activity, stats, verifyLogs });
  },

  onScanQR() {
    wx.scanCode({
      scanType: ['qrCode'],
      success: (res) => {
        this.processVerify(null, res.result);
      },
      fail: () => {
        wx.showToast({ title: '扫码取消', icon: 'none' });
      }
    });
  },

  onInputTicket() {
    this.setData({ showTicketInput: true, ticketInput: '' });
  },

  onCloseInput() {
    this.setData({ showTicketInput: false, ticketInput: '' });
  },

  onTicketCodeInput(e) {
    this.setData({ ticketInput: e.detail.value.toUpperCase() });
  },

  onConfirmTicketInput() {
    const code = (this.data.ticketInput || '').trim();
    if (!code) {
      wx.showToast({ title: '请输入票码', icon: 'none' });
      return;
    }
    this.setData({ showTicketInput: false });
    this.processVerify(code, null);
  },

  processVerify(ticketCode, qrContent) {
    let result;
    if (qrContent) {
      result = dataService.verifyTicketByQR(qrContent, this.data.activityId);
    } else {
      result = dataService.verifyTicketByCode(ticketCode, this.data.activityId);
    }

    this.setData({
      showVerifyModal: true,
      verifyResult: result
    });

    if (result.success) {
      wx.vibrateShort({ type: 'light' });
      this.initData();
    } else {
      wx.vibrateShort({ type: 'heavy' });
    }
  },

  onCloseVerify() {
    this.setData({ showVerifyModal: false, verifyResult: null });
  },

  formatDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  },

  formatActivityTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hh = d.getHours().toString().padStart(2, '0');
    const mm = d.getMinutes().toString().padStart(2, '0');
    return `${month}-${day} ${hh}:${mm}`;
  }
});
