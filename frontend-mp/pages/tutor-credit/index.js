const app = getApp();
const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    userId: '',
    creditScore: 0,
    creditLevel: {},
    approvedCount: 0,
    currentTab: 'certify',
    tabs: [
      { value: 'certify', label: '立即认证' },
      { value: 'records', label: '我的认证记录' }
    ],
    creditTypes: [],
    creditTypeStatusMap: {},
    creditBinds: [],
    showModal: false,
    currentCreditType: null,
    formName: '',
    formIdNumber: '',
    formPhotos: [],
    submitting: false
  },

  onLoad() {
    const userInfo = app.globalData.userInfo || {};
    const userId = userInfo.id || 'test_user';
    const creditTypes = constants.TUTOR_CREDIT_TYPES || [];

    this.setData({
      userId,
      creditTypes
    });

    this.loadCreditData();
  },

  onShow() {
    this.loadCreditData();
  },

  loadCreditData() {
    const { userId, creditTypes } = this.data;

    const creditScore = dataService.getUserCreditScore(userId);
    const approvedBinds = dataService.getTutorCreditBinds({ userId, status: 'approved' });
    const allBinds = dataService.getTutorCreditBinds({ userId });

    const creditLevels = constants.ERRAND_CREDIT_LEVELS || [];
    const creditLevel = creditLevels.find(l => creditScore >= l.min && creditScore <= l.max) || creditLevels[creditLevels.length - 1] || {};

    const creditTypeStatusMap = {};
    creditTypes.forEach(type => {
      const bind = allBinds.find(b => b.type === type.value);
      if (bind) {
        creditTypeStatusMap[type.value] = {
          status: bind.status,
          bindId: bind.id
        };
      } else {
        creditTypeStatusMap[type.value] = {
          status: '',
          bindId: ''
        };
      }
    });

    const formattedBinds = allBinds.map(bind => {
      const typeInfo = creditTypes.find(t => t.value === bind.type) || {};
      const statusInfo = constants.TUTOR_CREDIT_STATUS_MAP[bind.status] || {};
      return {
        ...bind,
        typeName: typeInfo.label || bind.type,
        typeIcon: typeInfo.icon || '📋',
        typeScore: typeInfo.score || 0,
        statusLabel: statusInfo.label || bind.status,
        statusColor: statusInfo.color || '#6B7280',
        submitTimeText: util.formatTime(bind.submitTime, 'YYYY-MM-DD HH:mm')
      };
    });

    this.setData({
      creditScore,
      creditLevel,
      approvedCount: approvedBinds.length,
      creditTypeStatusMap,
      creditBinds: formattedBinds
    });
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
  },

  onCreditTypeTap(e) {
    const { type } = e.currentTarget.dataset;
    const creditType = this.data.creditTypes.find(t => t.value === type);
    if (!creditType) return;

    const statusInfo = this.data.creditTypeStatusMap[type] || {};
    if (statusInfo.status === 'approved') {
      util.showToast('该认证已通过');
      return;
    }
    if (statusInfo.status === 'pending') {
      util.showToast('该认证正在审核中');
      return;
    }

    this.setData({
      showModal: true,
      currentCreditType: creditType,
      formName: '',
      formIdNumber: '',
      formPhotos: []
    });
  },

  onCloseModal() {
    if (this.data.submitting) return;
    this.setData({ showModal: false, currentCreditType: null });
  },

  onFormNameInput(e) {
    this.setData({ formName: e.detail.value });
  },

  onFormIdNumberInput(e) {
    this.setData({ formIdNumber: e.detail.value });
  },

  async onChoosePhoto() {
    const { formPhotos } = this.data;
    const remaining = 2 - formPhotos.length;
    if (remaining <= 0) {
      util.showToast('最多上传2张照片');
      return;
    }

    try {
      const res = await new Promise((resolve, reject) => {
        wx.chooseMedia({
          count: remaining,
          mediaType: ['image'],
          sourceType: ['album', 'camera'],
          sizeType: ['compressed'],
          success: resolve,
          fail: reject
        });
      });

      const tempFiles = res.tempFiles || [];
      const newPhotos = tempFiles.map(f => f.tempFilePath);
      this.setData({
        formPhotos: [...formPhotos, ...newPhotos]
      });
    } catch (e) {}
  },

  onRemovePhoto(e) {
    const { index } = e.currentTarget.dataset;
    const formPhotos = this.data.formPhotos.slice();
    formPhotos.splice(index, 1);
    this.setData({ formPhotos });
  },

  onPreviewPhoto(e) {
    const { index } = e.currentTarget.dataset;
    wx.previewImage({
      urls: this.data.formPhotos,
      current: this.data.formPhotos[index]
    });
  },

  async onSubmitCredit() {
    if (this.data.submitting) return;

    const { currentCreditType, formName, formPhotos, userId } = this.data;

    if (!currentCreditType) {
      util.showError('请选择认证类型');
      return;
    }

    if (util.isEmpty(formName)) {
      util.showToast('请输入认证名称');
      return;
    }

    if (formPhotos.length === 0) {
      util.showToast('请上传证件照片');
      return;
    }

    const submitData = {
      type: currentCreditType.value,
      name: formName.trim(),
      idNumber: this.data.formIdNumber.trim(),
      photos: formPhotos
    };

    this.setData({ submitting: true });
    util.showLoading('提交中...');

    try {
      const result = dataService.submitTutorCreditBind(submitData);
      util.hideLoading();

      if (result) {
        await util.showSuccess('提交成功');
        this.setData({
          showModal: false,
          currentCreditType: null,
          submitting: false
        });
        this.loadCreditData();
      } else {
        this.setData({ submitting: false });
        util.showError('提交失败，请重试');
      }
    } catch (e) {
      util.hideLoading();
      this.setData({ submitting: false });
      util.showError('提交失败，请重试');
    }
  },

  async onRecalculateScore() {
    const { userId } = this.data;
    util.showLoading('计算中...');

    try {
      const newScore = dataService.recalculateUserCreditScore(userId);
      util.hideLoading();

      if (typeof newScore === 'number') {
        this.loadCreditData();
        await util.showSuccess('信用分已更新');
      } else {
        util.showError('计算失败');
      }
    } catch (e) {
      util.hideLoading();
      util.showError('计算失败');
    }
  }
});
