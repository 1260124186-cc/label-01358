const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    pickupPoints: constants.EXPRESS_PICKUP_POINTS,
    selectedPickupPoint: '',
    pickupPointText: '',
    pickupCode: '',
    bounty: 3,
    bountyOptions: [1, 2, 3, 5, 8, 10],
    deliveryAddress: '',
    contactPhone: '',
    remark: '',
    showPickupPicker: false,
    addresses: []
  },

  onLoad() {
    this.loadDefaultAddress();
  },

  loadDefaultAddress() {
    const defaultAddr = dataService.getDefaultAddress();
    if (defaultAddr) {
      this.setData({
        deliveryAddress: defaultAddr.building + ' ' + defaultAddr.room,
        contactPhone: defaultAddr.phone
      });
    }
  },

  onShowPickupPicker() {
    this.setData({ showPickupPicker: true });
  },

  onPickupPointSelect(e) {
    const { value, label } = e.currentTarget.dataset;
    this.setData({
      selectedPickupPoint: value,
      pickupPointText: label,
      showPickupPicker: false
    });
  },

  onClosePickupPicker() {
    this.setData({ showPickupPicker: false });
  },

  onPickupCodeInput(e) {
    this.setData({ pickupCode: e.detail.value });
  },

  onBountySelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ bounty: value });
  },

  onBountyInput(e) {
    const val = parseFloat(e.detail.value);
    if (!isNaN(val) && val > 0) {
      this.setData({ bounty: val });
    }
  },

  onAddressInput(e) {
    this.setData({ deliveryAddress: e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ contactPhone: e.detail.value });
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value });
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

  onSubmit() {
    const { selectedPickupPoint, pickupPointText, pickupCode, bounty, deliveryAddress, contactPhone, remark } = this.data;

    if (!selectedPickupPoint) {
      util.showToast('请选择快递点');
      return;
    }
    if (!pickupCode.trim()) {
      util.showToast('请输入取件码');
      return;
    }
    if (!deliveryAddress.trim()) {
      util.showToast('请输入送达地址');
      return;
    }
    if (!contactPhone.trim()) {
      util.showToast('请输入联系电话');
      return;
    }

    const order = dataService.createErrandOrder({
      type: 'express',
      pickupPoint: selectedPickupPoint,
      pickupPointText,
      pickupCode: pickupCode.trim(),
      bounty,
      deliveryAddress: deliveryAddress.trim(),
      contactPhone: contactPhone.trim(),
      remark: remark.trim()
    });

    if (order) {
      util.showSuccess('下单成功').then(() => {
        wx.navigateBack();
      });
    } else {
      util.showError('下单失败');
    }
  }
});
