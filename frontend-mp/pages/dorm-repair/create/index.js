const { mixPage } = require('../../../utils/withTheme');
const constants = require('../../../config/constants');
const { createRepairOrder } = require('../../../services/data');

mixPage({
  data: {
    repairTypes: constants.REPAIR_TYPES,
    urgentTypes: constants.REPAIR_URGENT_TYPES,
    timeSlots: constants.REPAIR_TIME_SLOTS,
    selectedType: '',
    dormitoryNo: '',
    description: '',
    maxDescription: 500,
    imageList: [],
    maxImages: 4,
    selectedTimeSlot: '',
    isUrgent: false,
    selectedUrgentType: '',
    submitting: false
  },

  onTypeSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ selectedType: value });
  },

  onDormitoryInput(e) {
    this.setData({ dormitoryNo: e.detail.value });
  },

  onDescriptionInput(e) {
    this.setData({ description: e.detail.value });
  },

  onChooseImage() {
    const remaining = this.data.maxImages - this.data.imageList.length;
    if (remaining <= 0) return;

    wx.chooseMedia({
      count: remaining,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFiles.map(file => file.tempFilePath);
        this.setData({
          imageList: [...this.data.imageList, ...newImages].slice(0, this.data.maxImages)
        });
      }
    });
  },

  onDeleteImage(e) {
    const { index } = e.currentTarget.dataset;
    const imageList = [...this.data.imageList];
    imageList.splice(index, 1);
    this.setData({ imageList });
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    wx.previewImage({
      current: this.data.imageList[index],
      urls: this.data.imageList
    });
  },

  onTimeSlotSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ selectedTimeSlot: value });
  },

  onUrgentSwitch() {
    const newIsUrgent = !this.data.isUrgent;
    this.setData({
      isUrgent: newIsUrgent,
      selectedUrgentType: newIsUrgent ? this.data.selectedUrgentType : ''
    });
  },

  onUrgentTypeSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ selectedUrgentType: value });
  },

  onSubmit() {
    if (!this.data.selectedType) {
      wx.showToast({ title: '请选择报修类型', icon: 'none' });
      return;
    }
    if (!this.data.dormitoryNo.trim()) {
      wx.showToast({ title: '请输入宿舍号', icon: 'none' });
      return;
    }
    if (!this.data.description.trim()) {
      wx.showToast({ title: '请输入问题描述', icon: 'none' });
      return;
    }
    if (this.data.isUrgent && !this.data.selectedUrgentType) {
      wx.showToast({ title: '请选择紧急报修类型', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    const orderData = {
      type: this.data.selectedType,
      dormitoryNo: this.data.dormitoryNo.trim(),
      description: this.data.description.trim(),
      images: this.data.imageList,
      preferredTime: this.data.selectedTimeSlot,
      isUrgent: this.data.isUrgent,
      urgentType: this.data.isUrgent ? this.data.selectedUrgentType : ''
    };

    try {
      const result = createRepairOrder(orderData);
      if (result) {
        wx.showToast({ title: '提交成功', icon: 'success' });
        setTimeout(() => {
          wx.navigateBack({
            fail: () => {
              wx.switchTab({ url: '/pages/index/index' });
            }
          });
        }, 1200);
      } else {
        wx.showToast({ title: '提交失败，请重试', icon: 'none' });
        this.setData({ submitting: false });
      }
    } catch (err) {
      wx.showToast({ title: '提交失败，请重试', icon: 'none' });
      this.setData({ submitting: false });
    }
  }
});
