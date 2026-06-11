const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    colorOptions: constants.PRINT_COLOR_OPTIONS,
    sideOptions: constants.PRINT_SIDE_OPTIONS,
    paperOptions: constants.PRINT_PAPER_OPTIONS,
    fileName: '',
    filePages: 1,
    colorType: 'bw',
    sideType: 'single',
    paperSize: 'a4',
    copies: 1,
    totalPrice: 0.1,
    pickupTime: '',
    pickupTimeOptions: ['今天 12:00-14:00', '今天 16:00-18:00', '今天 18:00-20:00', '明天 10:00-12:00', '明天 14:00-16:00'],
    showTimePicker: false,
    contactPhone: '',
    deliveryAddress: '',
    remark: ''
  },

  onLoad() {
    this.loadDefaultAddress();
    this.calculatePrice();
  },

  loadDefaultAddress() {
    const defaultAddr = dataService.getDefaultAddress();
    if (defaultAddr) {
      this.setData({
        contactPhone: defaultAddr.phone,
        deliveryAddress: defaultAddr.building + ' ' + defaultAddr.room
      });
    }
  },

  onFileNameInput(e) {
    this.setData({ fileName: e.detail.value });
  },

  onFilePagesInput(e) {
    const pages = parseInt(e.detail.value) || 1;
    this.setData({ filePages: Math.max(1, pages) });
    this.calculatePrice();
  },

  onColorSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ colorType: value });
    this.calculatePrice();
  },

  onSideSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ sideType: value });
    this.calculatePrice();
  },

  onPaperSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ paperSize: value });
  },

  onCopiesChange(e) {
    const { action } = e.currentTarget.dataset;
    let copies = this.data.copies;
    if (action === 'minus') {
      copies = Math.max(1, copies - 1);
    } else {
      copies = Math.min(100, copies + 1);
    }
    this.setData({ copies });
    this.calculatePrice();
  },

  onCopiesInput(e) {
    const val = parseInt(e.detail.value) || 1;
    this.setData({ copies: Math.max(1, Math.min(100, val)) });
    this.calculatePrice();
  },

  calculatePrice() {
    const { colorType, sideType, copies, filePages } = this.data;
    const price = dataService.calculatePrintPrice(colorType, sideType, copies, filePages);
    this.setData({ totalPrice: Math.round(price * 100) / 100 });
  },

  onShowTimePicker() {
    this.setData({ showTimePicker: true });
  },

  onTimeSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ pickupTime: value, showTimePicker: false });
  },

  onCloseTimePicker() {
    this.setData({ showTimePicker: false });
  },

  onPhoneInput(e) {
    this.setData({ contactPhone: e.detail.value });
  },

  onAddressInput(e) {
    this.setData({ deliveryAddress: e.detail.value });
  },

  onSelectAddress() {
    util.navigateTo('/pages/errand/address/index?select=1');
  },

  onSelectAddressResult(address, phone) {
    this.setData({
      deliveryAddress: address,
      contactPhone: phone || this.data.contactPhone
    });
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
  },

  preventBubble() {},

  onSubmit() {
    const { fileName, filePages, colorType, sideType, paperSize, copies, totalPrice, pickupTime, contactPhone, deliveryAddress, remark } = this.data;

    if (!fileName.trim()) {
      util.showToast('请输入文件名');
      return;
    }
    if (!pickupTime) {
      util.showToast('请选择取件时间');
      return;
    }
    if (!contactPhone.trim()) {
      util.showToast('请输入联系电话');
      return;
    }

    const colorOption = constants.PRINT_COLOR_OPTIONS.find(o => o.value === colorType);
    const sideOption = constants.PRINT_SIDE_OPTIONS.find(o => o.value === sideType);

    const order = dataService.createErrandOrder({
      type: 'print',
      fileName: fileName.trim(),
      filePages,
      colorType,
      colorTypeText: colorOption ? colorOption.label : colorType,
      sideType,
      sideTypeText: sideOption ? sideOption.label : sideType,
      paperSize,
      copies,
      totalPrice,
      pickupTime,
      contactPhone: contactPhone.trim(),
      pickupLocation: '打印店',
      deliveryLocation: deliveryAddress.trim(),
      remark: remark.trim()
    });

    if (order && !order.error) {
      util.showSuccess('下单成功').then(() => {
        wx.navigateBack();
      });
    } else if (order && order.error) {
      util.showToast(order.error);
    } else {
      util.showError('下单失败');
    }
  }
});
