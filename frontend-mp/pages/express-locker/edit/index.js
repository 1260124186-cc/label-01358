const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    isEdit: false,
    id: '',
    expressCompanies: constants.EXPRESS_PICKUP_POINTS,
    selectedExpress: '',
    expressName: '',
    lockerLocation: '',
    pickupCode: '',
    deadlineDate: '',
    deadlineTime: '',
    remark: '',
    showExpressPicker: false,
    minDate: ''
  },

  onLoad(options) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const minDate = `${year}-${month}-${day}`;
    const defaultDate = `${year}-${month}-${day}`;
    const defaultTime = '18:00';

    this.setData({
      minDate,
      deadlineDate: defaultDate,
      deadlineTime: defaultTime
    });

    if (options.id) {
      this.setData({
        isEdit: true,
        id: options.id
      });
      this.loadDetail(options.id);
    }
  },

  loadDetail(id) {
    const detail = dataService.getExpressLockerDetail(id);
    if (detail) {
      const expressInfo = constants.EXPRESS_PICKUP_POINTS.find(e => e.value === detail.expressCompany);
      let deadlineDate = '';
      let deadlineTime = '';
      if (detail.deadline) {
        const date = new Date(detail.deadline);
        deadlineDate = util.formatTime(date, 'YYYY-MM-DD');
        deadlineTime = util.formatTime(date, 'HH:mm');
      }
      this.setData({
        selectedExpress: detail.expressCompany,
        expressName: expressInfo ? expressInfo.label : detail.expressCompany,
        lockerLocation: detail.lockerLocation || '',
        pickupCode: detail.pickupCode || '',
        deadlineDate,
        deadlineTime,
        remark: detail.remark || ''
      });
      wx.setNavigationBarTitle({ title: '编辑取件码' });
    }
  },

  onShowExpressPicker() {
    this.setData({ showExpressPicker: true });
  },

  onExpressSelect(e) {
    const { value, label } = e.currentTarget.dataset;
    this.setData({
      selectedExpress: value,
      expressName: label,
      showExpressPicker: false
    });
  },

  onCloseExpressPicker() {
    this.setData({ showExpressPicker: false });
  },

  onLockerLocationInput(e) {
    this.setData({ lockerLocation: e.detail.value });
  },

  onPickupCodeInput(e) {
    this.setData({ pickupCode: e.detail.value });
  },

  onDateChange(e) {
    this.setData({ deadlineDate: e.detail.value });
  },

  onTimeChange(e) {
    this.setData({ deadlineTime: e.detail.value });
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  preventBubble() {},

  onSubmit() {
    const { selectedExpress, lockerLocation, pickupCode, deadlineDate, deadlineTime, remark, isEdit, id } = this.data;

    if (!selectedExpress) {
      util.showToast('请选择快递公司');
      return;
    }
    if (!pickupCode.trim()) {
      util.showToast('请输入取件码');
      return;
    }

    let deadline = null;
    if (deadlineDate && deadlineTime) {
      deadline = new Date(`${deadlineDate} ${deadlineTime}`).getTime();
    }

    const data = {
      expressCompany: selectedExpress,
      lockerLocation: lockerLocation.trim(),
      pickupCode: pickupCode.trim(),
      deadline,
      remark: remark.trim()
    };

    let result;
    if (isEdit) {
      result = dataService.updateExpressLockerCode(id, data);
    } else {
      result = dataService.addExpressLockerCode(data);
    }

    if (result) {
      util.showSuccess(isEdit ? '保存成功' : '添加成功').then(() => {
        wx.navigateBack();
      });
    } else {
      util.showError(isEdit ? '保存失败' : '添加失败');
    }
  }
});
