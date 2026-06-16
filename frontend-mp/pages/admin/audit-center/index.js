const app = getApp();
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const auditService = require('../../../services/auditService');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    tabs: constants.AUDIT_TYPE_TABS,
    activeTab: 'scenery_publish',
    auditItems: [],
    auditStats: {},
    totalPending: 0,
    loading: false,
    showRejectModal: false,
    rejectTargetId: '',
    rejectTargetType: '',
    rejectReason: '',
    showLogModal: false,
    auditLogs: [],
    logTargetId: '',
    showSensitiveModal: false,
    sensitiveWords: [],
    newSensitiveWord: '',
    showDetailModal: false,
    detailItem: null
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
    const { activeTab } = this.data;
    const auditItems = auditService.getAuditItemsByType(activeTab);
    const { stats, totalPending } = auditService.getAuditStats();
    const tabs = this.data.tabs;
    const tabMap = {};
    tabs.forEach(t => { tabMap[t.value] = t; });

    const formattedItems = auditItems.map(item => ({
      ...item,
      typeColor: (tabMap[item.type] || {}).color || '#6B7280',
      typeIcon: (tabMap[item.type] || {}).icon || '📋',
      time: util.formatTime(item.time, 'MM-DD HH:mm'),
      statusText: item.status === 'pending' ? '待审核' : item.status === 'approved' ? '已通过' : item.status === 'rejected' ? '已驳回' : '已封禁'
    }));

    this.setData({
      auditItems: formattedItems,
      auditStats: stats,
      totalPending
    });
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ activeTab: value });
    this.loadData();
  },

  onApprove(e) {
    const { id, type } = e.currentTarget.dataset;
    const self = this;

    wx.showModal({
      title: '确认通过',
      content: '确定通过该审核吗？',
      success(res) {
        if (res.confirm) {
          const operatorId = (app.globalData.userInfo || {}).id;
          const result = auditService.approveItem(id, type, operatorId);
          if (result.success) {
            util.showSuccess(result.message);
            self.loadData();
          }
        }
      }
    });
  },

  onRejectTap(e) {
    const { id, type } = e.currentTarget.dataset;
    this.setData({
      showRejectModal: true,
      rejectTargetId: id,
      rejectTargetType: type,
      rejectReason: ''
    });
  },

  onRejectReasonInput(e) {
    this.setData({ rejectReason: e.detail.value });
  },

  onRejectConfirm() {
    const { rejectTargetId, rejectTargetType, rejectReason } = this.data;
    if (!rejectReason.trim()) {
      util.showToast('请填写驳回原因');
      return;
    }

    const operatorId = (app.globalData.userInfo || {}).id;
    const result = auditService.rejectItem(rejectTargetId, rejectTargetType, rejectReason.trim(), operatorId);
    if (result.success) {
      util.showSuccess(result.message);
      this.setData({ showRejectModal: false });
      this.loadData();
    }
  },

  onRejectCancel() {
    this.setData({ showRejectModal: false });
  },

  onBan(e) {
    const { id, type } = e.currentTarget.dataset;
    const self = this;

    wx.showModal({
      title: '确认封禁',
      content: '封禁后该用户将无法使用平台功能，确定封禁吗？',
      editable: true,
      placeholderText: '请输入封禁原因',
      success(res) {
        if (res.confirm) {
          const reason = res.content || '违规封禁';
          const operatorId = (app.globalData.userInfo || {}).id;
          const result = auditService.banItem(id, type, reason, operatorId);
          if (result.success) {
            util.showSuccess(result.message);
            self.loadData();
          }
        }
      }
    });
  },

  onViewLog(e) {
    const { id } = e.currentTarget.dataset;
    const logs = auditService.getAuditLogs(null, id).map(log => ({
      ...log,
      time: util.formatTime(log.createTime, 'MM-DD HH:mm'),
      resultText: log.result === 'approved' ? '通过' : log.result === 'rejected' ? '驳回' : '封禁'
    }));
    this.setData({
      showLogModal: true,
      auditLogs: logs,
      logTargetId: id
    });
  },

  onCloseLog() {
    this.setData({ showLogModal: false });
  },

  onDetailTap(e) {
    const { index } = e.currentTarget.dataset;
    const item = this.data.auditItems[index];
    if (item) {
      this.setData({
        showDetailModal: true,
        detailItem: item
      });
    }
  },

  onCloseDetail() {
    this.setData({ showDetailModal: false });
  },

  onManageSensitive() {
    const words = auditService.getSensitiveWords();
    this.setData({
      showSensitiveModal: true,
      sensitiveWords: words,
      newSensitiveWord: ''
    });
  },

  onCloseSensitive() {
    this.setData({ showSensitiveModal: false });
  },

  onSensitiveInput(e) {
    this.setData({ newSensitiveWord: e.detail.value });
  },

  onAddSensitive() {
    const { newSensitiveWord } = this.data;
    if (!newSensitiveWord.trim()) {
      util.showToast('请输入敏感词');
      return;
    }
    const result = auditService.addSensitiveWord(newSensitiveWord.trim());
    if (result.success) {
      this.setData({
        sensitiveWords: auditService.getSensitiveWords(),
        newSensitiveWord: ''
      });
      util.showSuccess(result.message);
    } else {
      util.showToast(result.message);
    }
  },

  onRemoveSensitive(e) {
    const { word } = e.currentTarget.dataset;
    const self = this;
    wx.showModal({
      title: '删除敏感词',
      content: `确定删除"${word}"吗？`,
      success(res) {
        if (res.confirm) {
          const result = auditService.removeSensitiveWord(word);
          if (result.success) {
            self.setData({ sensitiveWords: auditService.getSensitiveWords() });
            util.showSuccess(result.message);
          }
        }
      }
    });
  }
});
