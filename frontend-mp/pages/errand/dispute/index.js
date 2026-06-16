const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    orderId: '',
    order: null,
    disputeReasons: constants.ERRAND_DISPUTE_REASONS,
    selectedReason: '',
    selectedReasonText: '',
    description: '',
    evidence: [],
    showReasonPicker: false,
    disputeWindowHours: constants.ERRAND_DISPUTE_WINDOW_HOURS,
    remainingTime: '',
    canSubmit: false
  },

  onLoad(options) {
    if (options && options.id) {
      this.setData({ orderId: options.id });
      this.loadOrder();
    }
  },

  loadOrder() {
    const order = dataService.getErrandOrderDetail(this.data.orderId);
    if (!order) {
      util.showToast('订单不存在');
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    if (!dataService.canDispute(order)) {
      util.showToast('已超过申诉时限');
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const existingDispute = dataService.getOrderDispute(order.id);
    if (existingDispute) {
      util.showToast('已有申诉正在处理');
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const remainingMs = order.completedTime + constants.ERRAND_DISPUTE_WINDOW_HOURS * 3600 * 1000 - Date.now();
    const remainingHours = Math.floor(remainingMs / 3600000);
    const remainingMinutes = Math.floor((remainingMs % 3600000) / 60000);
    const remainingTime = `${remainingHours}小时${remainingMinutes}分钟`;

    const taskTypeInfo = constants.ERRAND_TASK_TYPES.find(t => t.value === order.type);

    this.setData({
      order: {
        ...order,
        typeText: taskTypeInfo ? taskTypeInfo.label : order.type,
        typeIcon: taskTypeInfo ? taskTypeInfo.icon : '📌',
        bountyText: '¥' + (order.bounty || 0)
      },
      remainingTime
    });

    this.checkCanSubmit();
  },

  onShowReasonPicker() {
    this.setData({ showReasonPicker: true });
  },

  onCloseReasonPicker() {
    this.setData({ showReasonPicker: false });
  },

  onReasonSelect(e) {
    const { value, label } = e.currentTarget.dataset;
    this.setData({
      selectedReason: value,
      selectedReasonText: label,
      showReasonPicker: false
    });
    this.checkCanSubmit();
  },

  onDescriptionInput(e) {
    this.setData({ description: e.detail.value });
    this.checkCanSubmit();
  },

  onUploadEvidence() {
    const that = this;
    wx.chooseImage({
      count: 3 - that.data.evidence.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const newEvidence = res.tempFilePaths || [];
        const evidence = [...that.data.evidence, ...newEvidence].slice(0, 3);
        that.setData({ evidence });
      }
    });
  },

  onRemoveEvidence(e) {
    const { index } = e.currentTarget.dataset;
    const evidence = this.data.evidence.slice();
    evidence.splice(index, 1);
    this.setData({ evidence });
  },

  checkCanSubmit() {
    const { selectedReason, description } = this.data;
    const canSubmit = selectedReason && description.trim().length >= 10;
    this.setData({ canSubmit });
  },

  onSubmit() {
    if (!this.data.canSubmit) {
      if (!this.data.selectedReason) {
        util.showToast('请选择申诉原因');
      } else if (this.data.description.trim().length < 10) {
        util.showToast('请详细描述问题（至少10字）');
      }
      return;
    }

    util.showConfirm('确认提交申诉？提交后将进入仲裁流程。').then(confirmed => {
      if (!confirmed) return;

      const result = dataService.createDispute(this.data.orderId, {
        reason: this.data.selectedReason,
        description: this.data.description.trim(),
        evidence: this.data.evidence
      });

      if (result && result.error) {
        util.showToast(result.error);
        return;
      }

      if (result) {
        util.showSuccess('申诉已提交').then(() => {
          wx.navigateBack();
        });
      } else {
        util.showError('提交失败，请重试');
      }
    });
  },

  preventBubble() {}
});
