const app = getApp();
const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    lostFoundId: '',
    lostFoundTitle: '',
    list: [],
    currentTab: 'all',
    tabs: [
      { value: 'all', label: '全部' },
      { value: 'pending', label: '待审核' },
      { value: 'approved', label: '已通过' },
      { value: 'rejected', label: '已拒绝' }
    ],
    expandedIds: {},
    showRejectModal: false,
    rejectApplicationId: '',
    rejectReason: '',
    verifyCodeVisible: false,
    verifyCodeData: null,
    verifyCodeExpireText: ''
  },

  onLoad(options) {
    if (!util.checkLogin()) {
      return;
    }
    if (options.id) {
      this.setData({ lostFoundId: options.id });
      this.loadLostFoundTitle();
      this.loadList();
    }
  },

  onShow() {
    if (this.data.lostFoundId) {
      this.loadList();
    }
  },

  loadLostFoundTitle() {
    const detail = dataService.getLostFoundDetail(this.data.lostFoundId);
    if (detail) {
      this.setData({ lostFoundTitle: detail.title || '' });
    }
  },

  loadList() {
    const { lostFoundId, currentTab } = this.data;
    const statusFilter = currentTab === 'all' ? '' : currentTab;
    const rawList = dataService.getClaimApplicationsByLostFound(lostFoundId, statusFilter);

    const list = rawList.map(item => {
      const statusInfo = constants.CLAIM_APPLICATION_STATUS_MAP[item.status] || {};
      return {
        ...item,
        timeText: util.relativeTime(item.createTime),
        reviewTimeText: item.reviewTime ? util.formatTime(item.reviewTime) : '',
        statusLabel: statusInfo.label || item.status,
        statusColor: statusInfo.color || '#6B7280',
        statusIcon: statusInfo.icon || '',
        hasImages: item.images && item.images.length > 0
      };
    });

    this.setData({ list });
  },

  onTabChange(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({ currentTab: tab });
    this.loadList();
  },

  onToggleExpand(e) {
    const { id } = e.currentTarget.dataset;
    const expandedIds = { ...this.data.expandedIds };
    expandedIds[id] = !expandedIds[id];
    this.setData({ expandedIds });
  },

  onPreviewImage(e) {
    const { urls, current } = e.currentTarget.dataset;
    wx.previewImage({
      urls,
      current
    });
  },

  async onApprove(e) {
    const { item } = e.currentTarget.dataset;
    const confirm = await util.showConfirm(`确定通过「${item.applicantName}」的认领申请吗？通过后将生成核验码。`);
    if (!confirm) return;

    util.showLoading('处理中...');
    try {
      const result = dataService.reviewClaimApplication(item.id, 'approve');
      util.hideLoading();

      if (result) {
        util.showSuccess('审核通过');
        this.showVerifyCode(result.verifyCode, result.verifyCodeExpireAt);
        this.loadList();
      } else {
        util.showError('操作失败，请重试');
      }
    } catch (e) {
      util.hideLoading();
      util.showError('操作失败，请重试');
    }
  },

  onShowRejectModal(e) {
    const { item } = e.currentTarget.dataset;
    this.setData({
      showRejectModal: true,
      rejectApplicationId: item.id,
      rejectReason: ''
    });
  },

  onHideRejectModal() {
    this.setData({
      showRejectModal: false,
      rejectApplicationId: '',
      rejectReason: ''
    });
  },

  onRejectReasonInput(e) {
    this.setData({ rejectReason: e.detail.value });
  },

  async onConfirmReject() {
    const { rejectApplicationId, rejectReason } = this.data;
    if (!rejectReason || !rejectReason.trim()) {
      util.showToast('请填写拒绝原因');
      return;
    }

    util.showLoading('处理中...');
    try {
      const result = dataService.reviewClaimApplication(rejectApplicationId, 'reject', rejectReason.trim());
      util.hideLoading();

      if (result) {
        util.showSuccess('已拒绝');
        this.onHideRejectModal();
        this.loadList();
      } else {
        util.showError('操作失败，请重试');
      }
    } catch (e) {
      util.hideLoading();
      util.showError('操作失败，请重试');
    }
  },

  onShowVerifyCode(e) {
    const { item } = e.currentTarget.dataset;
    const codeData = dataService.getVerifyCodeByApplication(item.id);
    if (codeData) {
      this.showVerifyCode(codeData.code, codeData.expireAt);
    } else {
      util.showError('核验码不存在');
    }
  },

  showVerifyCode(code, expireAt) {
    const expireDate = new Date(expireAt);
    const expireText = util.formatTime(expireAt, 'MM-DD HH:mm');
    this.setData({
      verifyCodeVisible: true,
      verifyCodeData: { code, expireAt, expireText },
      verifyCodeExpireText: expireText
    });
  },

  onHideVerifyCode() {
    this.setData({
      verifyCodeVisible: false,
      verifyCodeData: null
    });
  },

  onCopyVerifyCode() {
    const { verifyCodeData } = this.data;
    if (!verifyCodeData) return;
    wx.setClipboardData({
      data: verifyCodeData.code,
      success: () => {
        util.showToast('核验码已复制');
      }
    });
  },

  stopPropagation() {}
});
