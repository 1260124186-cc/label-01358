const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    darkMode: false,
    loading: true,
    submitting: false,
    activeTab: 'form',
    userId: '',
    visitTypes: constants.ALUMNI_VISIT_TYPES,
    visitStatusMap: constants.ALUMNI_VISIT_STATUS_MAP,
    formData: {
      visitType: '',
      visitDate: '',
      companionCount: 1,
      visitorName: '',
      visitorIdCard: '',
      visitorPhone: '',
      plateNumber: '',
      purpose: ''
    },
    companionOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    companionIndex: 0,
    appointments: [],
    showTypePicker: false
  },

  onLoad() {
    const currentUser = app.globalData.userInfo;
    this.setData({
      userId: currentUser ? currentUser.id : ''
    });
    this.loadAppointments();
    setTimeout(() => {
      this.setData({ loading: false });
    }, 500);
  },

  onShow() {
    if (!this.data.loading) {
      this.loadAppointments();
    }
  },

  onPullDownRefresh() {
    this.loadAppointments();
    wx.stopPullDownRefresh();
  },

  loadAppointments() {
    const appointments = dataService.getMyAlumniVisitAppointments(this.data.userId).map(item => ({
      ...item,
      typeInfo: constants.ALUMNI_VISIT_TYPES.find(t => t.value === item.visitType),
      statusInfo: constants.ALUMNI_VISIT_STATUS_MAP[item.status],
      formattedDate: item.visitDate,
      formattedTime: util.formatDate(item.createTime)
    }));
    this.setData({ appointments });
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ activeTab: value });
  },

  onTypePickerTap() {
    this.setData({ showTypePicker: true });
  },

  onTypeSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      'formData.visitType': value,
      showTypePicker: false
    });
  },

  onCloseTypePicker() {
    this.setData({ showTypePicker: false });
  },

  onDateChange(e) {
    this.setData({ 'formData.visitDate': e.detail.value });
  },

  onCompanionChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      companionIndex: index,
      'formData.companionCount': this.data.companionOptions[index]
    });
  },

  onVisitorNameInput(e) {
    this.setData({ 'formData.visitorName': e.detail.value });
  },

  onVisitorIdCardInput(e) {
    this.setData({ 'formData.visitorIdCard': e.detail.value });
  },

  onVisitorPhoneInput(e) {
    this.setData({ 'formData.visitorPhone': e.detail.value });
  },

  onPlateNumberInput(e) {
    this.setData({ 'formData.plateNumber': e.detail.value });
  },

  onPurposeInput(e) {
    this.setData({ 'formData.purpose': e.detail.value });
  },

  validateForm() {
    const { formData } = this.data;

    if (!formData.visitType) {
      util.showToast('请选择返校类型');
      return false;
    }

    if (!formData.visitDate) {
      util.showToast('请选择预约日期');
      return false;
    }

    if (!formData.visitorName.trim()) {
      util.showToast('请输入来访人员姓名');
      return false;
    }

    if (formData.visitorName.trim().length < 2) {
      util.showToast('请输入正确的姓名');
      return false;
    }

    if (!formData.visitorIdCard.trim()) {
      util.showToast('请输入身份证号');
      return false;
    }

    const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!idCardReg.test(formData.visitorIdCard.trim())) {
      util.showToast('请输入正确的身份证号');
      return false;
    }

    if (!formData.visitorPhone.trim()) {
      util.showToast('请输入联系方式');
      return false;
    }

    const phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(formData.visitorPhone.trim())) {
      util.showToast('请输入正确的手机号');
      return false;
    }

    return true;
  },

  async onSubmit() {
    if (!this.validateForm()) return;

    this.setData({ submitting: true });

    try {
      const result = dataService.submitAlumniVisitAppointment({
        userId: this.data.userId,
        ...this.data.formData,
        visitorName: this.data.formData.visitorName.trim(),
        visitorIdCard: this.data.formData.visitorIdCard.trim(),
        visitorPhone: this.data.formData.visitorPhone.trim(),
        plateNumber: this.data.formData.plateNumber.trim(),
        purpose: this.data.formData.purpose.trim()
      });

      if (result) {
        util.showSuccess('预约提交成功');
        this.resetForm();
        this.loadAppointments();
        this.setData({ activeTab: 'records' });
      } else {
        util.showToast('提交失败，请稍后重试');
      }
    } catch (error) {
      console.error('提交预约失败:', error);
      util.showToast('提交失败，请稍后重试');
    } finally {
      this.setData({ submitting: false });
    }
  },

  resetForm() {
    this.setData({
      formData: {
        visitType: '',
        visitDate: '',
        companionCount: 1,
        visitorName: '',
        visitorIdCard: '',
        visitorPhone: '',
        plateNumber: '',
        purpose: ''
      },
      companionIndex: 0
    });
  },

  stopPropagation() {}
});
