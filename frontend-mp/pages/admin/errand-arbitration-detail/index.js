const app = getApp();
const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    disputeId: '',
    dispute: null,
    order: null,
    publisherProfile: null,
    runnerProfile: null,
    escrowLog: [],
    statusInfo: null,
    showArbitrateModal: false,
    arbitrateResult: '',
    arbitrateRemark: '',
    publisherAmount: 0,
    runnerAmount: 0,
    showSplitInput: false,
    canArbitrate: false
  },

  onLoad(options) {
    if (options && options.id) {
      this.setData({ disputeId: options.id });
      this.loadData();
    }
  },

  onShow() {
    if (this.data.disputeId) {
      this.loadData();
    }
  },

  loadData() {
    const dispute = dataService.getDisputeDetail(this.data.disputeId);
    if (!dispute) {
      util.showToast('申诉记录不存在');
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const order = dataService.getErrandOrderDetail(dispute.orderId);
    const statusInfo = constants.ERRAND_DISPUTE_STATUS_MAP[dispute.status] || {};

    const publisherProfile = dataService.getRunnerCreditDetail(dispute.initiatorRole === 'publisher' ? dispute.initiatorId : dispute.respondentId);
    const runnerProfile = dataService.getRunnerCreditDetail(dispute.initiatorRole === 'runner' ? dispute.initiatorId : dispute.respondentId);

    const escrowLog = dataService.getEscrowLogByOrder(dispute.orderId).map(log => ({
      ...log,
      timeText: util.formatTime(log.time, 'MM-DD HH:mm')
    }));

    const canArbitrate = dispute.status === 'pending' || dispute.status === 'reviewing';

    const taskTypeInfo = constants.ERRAND_TASK_TYPES.find(t => t.value === dispute.orderType);

    const formattedDispute = {
      ...dispute,
      typeText: taskTypeInfo ? taskTypeInfo.label : dispute.orderType,
      typeIcon: taskTypeInfo ? taskTypeInfo.icon : '📌',
      bountyText: '¥' + (dispute.orderBounty || 0),
      createTimeText: util.formatTime(dispute.createTime, 'YYYY-MM-DD HH:mm'),
      initiatorRoleText: dispute.initiatorRole === 'publisher' ? '发布者' : '跑手'
    };

    if (order) {
      order.timeText = util.formatTime(order.createTime, 'YYYY-MM-DD HH:mm');
    }

    this.setData({
      dispute: formattedDispute,
      order,
      publisherProfile,
      runnerProfile,
      escrowLog,
      statusInfo,
      canArbitrate
    });
  },

  onViewOrder() {
    if (this.data.order) {
      util.navigateTo('/pages/errand/order-detail/index?id=' + this.data.order.id);
    }
  },

  onOpenArbitrate() {
    if (!this.data.canArbitrate) return;
    this.setData({
      showArbitrateModal: true,
      arbitrateResult: '',
      arbitrateRemark: '',
      publisherAmount: 0,
      runnerAmount: 0,
      showSplitInput: false
    });
  },

  onCloseArbitrate() {
    this.setData({ showArbitrateModal: false });
  },

  onResultSelect(e) {
    const { value } = e.currentTarget.dataset;
    const showSplitInput = value === 'resolved_split';
    const bounty = this.data.dispute ? this.data.dispute.orderBounty : 0;

    this.setData({
      arbitrateResult: value,
      showSplitInput,
      publisherAmount: showSplitInput ? Math.floor(bounty / 2) : (value === 'resolved_publisher' ? bounty : 0),
      runnerAmount: showSplitInput ? Math.floor(bounty / 2) : (value === 'resolved_runner' ? bounty : 0)
    });
  },

  onPublisherAmountInput(e) {
    const val = parseFloat(e.detail.value) || 0;
    const bounty = this.data.dispute ? this.data.dispute.orderBounty : 0;
    const publisherAmount = Math.min(Math.max(0, val), bounty);
    const runnerAmount = bounty - publisherAmount;
    this.setData({ publisherAmount, runnerAmount });
  },

  onRunnerAmountInput(e) {
    const val = parseFloat(e.detail.value) || 0;
    const bounty = this.data.dispute ? this.data.dispute.orderBounty : 0;
    const runnerAmount = Math.min(Math.max(0, val), bounty);
    const publisherAmount = bounty - runnerAmount;
    this.setData({ runnerAmount, publisherAmount });
  },

  onRemarkInput(e) {
    this.setData({ arbitrateRemark: e.detail.value });
  },

  onSubmitArbitration() {
    const { arbitrateResult, arbitrateRemark, publisherAmount, runnerAmount, dispute } = this.data;

    if (!arbitrateResult) {
      util.showToast('请选择仲裁结果');
      return;
    }

    if (arbitrateResult === 'resolved_split') {
      const total = Number(publisherAmount) + Number(runnerAmount);
      if (total !== dispute.orderBounty) {
        util.showToast('分配金额总和需等于赏金');
        return;
      }
    }

    const resultText = {
      'resolved_publisher': '发布者胜诉，全额退还',
      'resolved_runner': '跑手胜诉，全额结算',
      'resolved_split': '部分分配',
      'malicious': '恶意申诉'
    };

    util.showConfirm('确认仲裁结果：' + (resultText[arbitrateResult] || '') + '？').then(confirmed => {
      if (!confirmed) return;

      const result = dataService.arbitrateDispute(this.data.disputeId, {
        result: arbitrateResult,
        remark: arbitrateRemark,
        publisherAmount: Number(publisherAmount),
        runnerAmount: Number(runnerAmount)
      });

      if (result && result.error) {
        util.showToast(result.error);
        return;
      }

      if (result) {
        util.showSuccess('仲裁完成').then(() => {
          this.setData({ showArbitrateModal: false });
          this.loadData();
        });
      } else {
        util.showError('仲裁失败，请重试');
      }
    });
  },

  onPreviewImage(e) {
    const { url, urls } = e.currentTarget.dataset;
    if (urls && urls.length > 0) {
      wx.previewImage({
        current: url,
        urls: urls
      });
    }
  },

  preventBubble() {}
});
