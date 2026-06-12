const dataService = require('../../services/data');
const constants = require('../../config/constants');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    incubatorId: '',
    incubator: null,
    showApplyModal: false,
    applyForm: {
      projectName: '',
      teamSize: '',
      contactName: '',
      contactPhone: '',
      description: ''
    },
    loading: true,
    submitting: false
  },

  onLoad(options) {
    const { id } = options;
    this.setData({ incubatorId: id });
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData() {
    this.setData({ loading: true });
    dataService.initAllInnovationData();
    const incubator = dataService.getInnovationIncubatorDetail(this.data.incubatorId);
    if (incubator) {
      dataService.increaseIncubatorViews(this.data.incubatorId);
      const processedIncubator = {
        ...incubator,
        typeInfo: constants.INNOVATION_INCUBATOR_TYPES.find(t => t.value === incubator.type),
        occupancyRate: Math.round((incubator.inCubatedCount / incubator.capacity) * 100)
      };
      this.setData({
        incubator: processedIncubator,
        loading: false
      });
    } else {
      this.setData({ loading: false });
      wx.showToast({ title: '孵化器不存在', icon: 'none' });
    }
  },

  onApplyTap() {
    this.setData({ showApplyModal: true });
  },

  onFormInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`applyForm.${field}`]: e.detail.value
    });
  },

  onCloseModal() {
    this.setData({ showApplyModal: false });
  },

  onSubmitApply() {
    const { projectName, contactName, contactPhone } = this.data.applyForm;
    if (!projectName || !contactName || !contactPhone) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(contactPhone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });
    const result = dataService.applyForIncubator(this.data.incubatorId, this.data.applyForm);
    this.setData({ submitting: false });

    if (result.success) {
      wx.showToast({ title: '申请已提交', icon: 'success' });
      this.setData({ showApplyModal: false });
    } else {
      wx.showToast({ title: result.message || '申请失败', icon: 'none' });
    }
  },

  onContactTap() {
    if (this.data.incubator && this.data.incubator.contactPhone) {
      wx.makePhoneCall({
        phoneNumber: this.data.incubator.contactPhone
      });
    }
  },

  onShareAppMessage() {
    return {
      title: this.data.incubator ? this.data.incubator.name : '孵化器详情',
      path: `/pages/innovation/incubator-detail?id=${this.data.incubatorId}`
    };
  },

  stopPropagation() {}
});
