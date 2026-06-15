const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    formData: {
      productName: '',
      description: '',
      category: 'food',
      unitPrice: '',
      minCount: 5,
      maxCount: 20,
      deadline: '',
      pickupPoint: '',
      pickupTime: '',
      remark: ''
    },
    categories: constants.GROUP_BUY_CATEGORIES,
    categoryIndex: 0,
    pickupPoints: constants.GROUP_BUY_PICKUP_POINTS,
    pickupPointIndex: -1,
    deadlineRange: [[], [], [], [], []],
    deadlineValue: [0, 0, 0, 0, 0],
    deadlineText: '',
    submitting: false
  },

  onLoad() {
    this.initDeadlinePicker();
  },

  initDeadlinePicker() {
    const now = new Date();
    const years = [];
    const months = [];
    const days = [];
    const hours = [];
    const minutes = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(now.getTime() + i * 86400000);
      if (i === 0 || d.getFullYear() !== years[years.length - 1]) {
        years.push(d.getFullYear());
      }
    }

    for (let i = 1; i <= 12; i++) {
      months.push(i);
    }

    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }

    for (let i = 0; i <= 23; i++) {
      hours.push(i);
    }

    for (let i = 0; i <= 59; i++) {
      minutes.push(i);
    }

    const defaultDate = new Date(now.getTime() + 86400000);
    const yearIdx = years.indexOf(defaultDate.getFullYear());
    const monthIdx = defaultDate.getMonth();
    const dayIdx = defaultDate.getDate() - 1;
    const hourIdx = defaultDate.getHours();
    const minuteIdx = 0;

    this.setData({
      deadlineRange: [years, months, days, hours, minutes],
      deadlineValue: [yearIdx >= 0 ? yearIdx : 0, monthIdx, dayIdx, hourIdx, minuteIdx]
    });
    this.updateDeadlineText();
  },

  updateDeadlineText() {
    const { deadlineRange, deadlineValue } = this.data;
    const year = deadlineRange[0][deadlineValue[0]];
    const month = String(deadlineRange[1][deadlineValue[1]]).padStart(2, '0');
    const day = String(deadlineRange[2][deadlineValue[2]]).padStart(2, '0');
    const hour = String(deadlineRange[3][deadlineValue[3]]).padStart(2, '0');
    const minute = String(deadlineRange[4][deadlineValue[4]]).padStart(2, '0');

    const text = `${year}-${month}-${day} ${hour}:${minute}`;
    const timestamp = new Date(year, parseInt(month) - 1, day, hour, minute).getTime();

    this.setData({
      deadlineText: text,
      'formData.deadline': timestamp
    });
  },

  onDeadlineChange(e) {
    this.setData({ deadlineValue: e.detail.value });
    this.updateDeadlineText();
  },

  onDeadlineColumnChange(e) {
    const { column, value } = e.detail;
    const newVal = [...this.data.deadlineValue];
    newVal[column] = value;
    this.setData({ deadlineValue: newVal });
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      ['formData.' + field]: value
    });
  },

  onCategoryChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      categoryIndex: index,
      'formData.category': this.data.categories[index].value
    });
  },

  onPickupPointChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      pickupPointIndex: index,
      'formData.pickupPoint': this.data.pickupPoints[index].value
    });
  },

  onMinCountMinus() {
    const val = Math.max(2, this.data.formData.minCount - 1);
    this.setData({ 'formData.minCount': val });
  },

  onMinCountPlus() {
    const val = Math.min(100, this.data.formData.minCount + 1);
    this.setData({ 'formData.minCount': val });
  },

  onMinCountInput(e) {
    let val = parseInt(e.detail.value);
    if (isNaN(val) || val < 2) val = 2;
    if (val > 100) val = 100;
    this.setData({ 'formData.minCount': val });
  },

  onMaxCountMinus() {
    const val = Math.max(this.data.formData.minCount, this.data.formData.maxCount - 1);
    this.setData({ 'formData.maxCount': val });
  },

  onMaxCountPlus() {
    const val = Math.min(500, this.data.formData.maxCount + 1);
    this.setData({ 'formData.maxCount': val });
  },

  onMaxCountInput(e) {
    let val = parseInt(e.detail.value);
    if (isNaN(val) || val < this.data.formData.minCount) val = this.data.formData.minCount;
    if (val > 500) val = 500;
    this.setData({ 'formData.maxCount': val });
  },

  validateForm() {
    const { formData } = this.data;

    if (!formData.productName.trim()) {
      util.showToast('请输入商品名称');
      return false;
    }

    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      util.showToast('请输入有效的单价');
      return false;
    }

    if (!formData.description.trim()) {
      util.showToast('请输入商品描述');
      return false;
    }

    if (!formData.deadline || formData.deadline <= Date.now()) {
      util.showToast('截止时间需在当前时间之后');
      return false;
    }

    if (!formData.pickupPoint) {
      util.showToast('请选择取货地点');
      return false;
    }

    return true;
  },

  async onSubmit() {
    if (!this.validateForm()) return;

    this.setData({ submitting: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const data = {
        ...this.data.formData,
        productName: this.data.formData.productName.trim(),
        description: this.data.formData.description.trim(),
        unitPrice: parseFloat(this.data.formData.unitPrice),
        minCount: parseInt(this.data.formData.minCount),
        maxCount: parseInt(this.data.formData.maxCount)
      };

      const result = dataService.publishGroupBuy(data);

      if (result) {
        await util.showSuccess('发布成功');
        wx.navigateBack({
          delta: 1,
          fail: () => {
            wx.switchTab({ url: '/pages/group-buy/index' });
          }
        });
      } else {
        util.showError('发布失败，请重试');
      }
    } catch (e) {
      console.error('[GroupBuy] publish error:', e);
      util.showError('发布失败，请重试');
    } finally {
      this.setData({ submitting: false });
    }
  }
});
