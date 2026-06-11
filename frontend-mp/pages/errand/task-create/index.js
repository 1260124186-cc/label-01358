const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    taskTypes: constants.ERRAND_TASK_TYPES,
    selectedType: 'express',
    pickupPoints: constants.EXPRESS_PICKUP_POINTS,
    purchaseCategories: constants.ERRAND_PURCHASE_CATEGORIES,
    selectedPickupPoint: '',
    pickupPointText: '',
    pickupCode: '',
    selectedPurchaseCategory: '',
    purchaseCategoryText: '',
    purchaseItem: '',
    deliveryItem: '',
    queueLocation: '',
    queuePurpose: '',
    otherDesc: '',
    bounty: 3,
    bountyOptions: [2, 3, 5, 8, 10, 15],
    deadline: '',
    deadlineDate: '',
    deadlineTime: '',
    pickupLocation: '',
    deliveryLocation: '',
    contactPhone: '',
    remark: '',
    showPickupPicker: false,
    showPurchaseCategoryPicker: false,
    addresses: []
  },

  onLoad(options) {
    if (options && options.type) {
      this.setData({ selectedType: options.type });
    }
    this.loadDefaultAddress();
  },

  loadDefaultAddress() {
    const defaultAddr = dataService.getDefaultAddress();
    if (defaultAddr) {
      this.setData({
        deliveryLocation: defaultAddr.building + ' ' + defaultAddr.room,
        contactPhone: defaultAddr.phone
      });
    }
  },

  onTypeSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ selectedType: value });
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

  onShowPurchaseCategoryPicker() {
    this.setData({ showPurchaseCategoryPicker: true });
  },

  onPurchaseCategorySelect(e) {
    const { value, label } = e.currentTarget.dataset;
    this.setData({
      selectedPurchaseCategory: value,
      purchaseCategoryText: label,
      showPurchaseCategoryPicker: false
    });
  },

  onClosePurchaseCategoryPicker() {
    this.setData({ showPurchaseCategoryPicker: false });
  },

  onPickupCodeInput(e) {
    this.setData({ pickupCode: e.detail.value });
  },

  onPurchaseItemInput(e) {
    this.setData({ purchaseItem: e.detail.value });
  },

  onDeliveryItemInput(e) {
    this.setData({ deliveryItem: e.detail.value });
  },

  onQueueLocationInput(e) {
    this.setData({ queueLocation: e.detail.value });
  },

  onQueuePurposeInput(e) {
    this.setData({ queuePurpose: e.detail.value });
  },

  onOtherDescInput(e) {
    this.setData({ otherDesc: e.detail.value });
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

  onDeadlineDateChange(e) {
    this.setData({ deadlineDate: e.detail.value });
    this.updateDeadline();
  },

  onDeadlineTimeChange(e) {
    this.setData({ deadlineTime: e.detail.value });
    this.updateDeadline();
  },

  updateDeadline() {
    const { deadlineDate, deadlineTime } = this.data;
    if (deadlineDate && deadlineTime) {
      this.setData({ deadline: deadlineDate + ' ' + deadlineTime });
    }
  },

  onPickupLocationInput(e) {
    this.setData({ pickupLocation: e.detail.value });
  },

  onDeliveryLocationInput(e) {
    this.setData({ deliveryLocation: e.detail.value });
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
      deliveryLocation: address,
      contactPhone: phone || this.data.contactPhone
    });
  },

  validateForm() {
    const { selectedType, selectedPickupPoint, pickupCode, selectedPurchaseCategory, purchaseItem, deliveryItem, queueLocation, queuePurpose, otherDesc, bounty, deadline, deliveryLocation, contactPhone } = this.data;

    if (selectedType === 'express') {
      if (!selectedPickupPoint) {
        util.showToast('请选择快递点');
        return false;
      }
      if (!pickupCode.trim()) {
        util.showToast('请输入取件码');
        return false;
      }
    }

    if (selectedType === 'purchase') {
      if (!selectedPurchaseCategory) {
        util.showToast('请选择代买类别');
        return false;
      }
      if (!purchaseItem.trim()) {
        util.showToast('请输入代买物品');
        return false;
      }
    }

    if (selectedType === 'delivery') {
      if (!deliveryItem.trim()) {
        util.showToast('请输入代送物品');
        return false;
      }
    }

    if (selectedType === 'queue') {
      if (!queueLocation.trim()) {
        util.showToast('请输入排队地点');
        return false;
      }
      if (!queuePurpose.trim()) {
        util.showToast('请输入排队目的');
        return false;
      }
    }

    if (selectedType === 'other') {
      if (!otherDesc.trim()) {
        util.showToast('请输入任务描述');
        return false;
      }
    }

    if (!bounty || bounty <= 0) {
      util.showToast('请设置赏金');
      return false;
    }

    if (!deadline) {
      util.showToast('请选择截止时间');
      return false;
    }

    if (!deliveryLocation.trim()) {
      util.showToast('请输入送达地点');
      return false;
    }

    if (!contactPhone.trim()) {
      util.showToast('请输入联系方式');
      return false;
    }

    return true;
  },

  onSubmit() {
    if (!this.validateForm()) return;

    const { selectedType, selectedPickupPoint, pickupPointText, pickupCode, selectedPurchaseCategory, purchaseCategoryText, purchaseItem, deliveryItem, queueLocation, queuePurpose, otherDesc, bounty, deadline, pickupLocation, deliveryLocation, contactPhone, remark } = this.data;

    const orderData = {
      type: selectedType,
      bounty,
      deadline: new Date(deadline).getTime(),
      pickupLocation: pickupLocation.trim(),
      deliveryLocation: deliveryLocation.trim(),
      contactPhone: contactPhone.trim(),
      remark: remark.trim()
    };

    if (selectedType === 'express') {
      orderData.pickupPoint = selectedPickupPoint;
      orderData.pickupPointText = pickupPointText;
      orderData.pickupCode = pickupCode.trim();
    }

    if (selectedType === 'purchase') {
      orderData.purchaseCategory = selectedPurchaseCategory;
      orderData.purchaseCategoryText = purchaseCategoryText;
      orderData.purchaseItem = purchaseItem.trim();
    }

    if (selectedType === 'delivery') {
      orderData.deliveryItem = deliveryItem.trim();
    }

    if (selectedType === 'queue') {
      orderData.queueLocation = queueLocation.trim();
      orderData.queuePurpose = queuePurpose.trim();
    }

    if (selectedType === 'other') {
      orderData.otherDesc = otherDesc.trim();
    }

    const result = dataService.createErrandOrder(orderData);

    if (result && result.error) {
      util.showToast(result.error);
      return;
    }

    if (result) {
      util.showSuccess('下单成功').then(() => {
        wx.navigateBack();
      });
    } else {
      util.showError('下单失败');
    }
  }
});
