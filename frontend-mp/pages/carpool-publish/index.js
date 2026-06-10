const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    formData: {
      type: 'car_seeking',
      departure: '',
      destination: '',
      destinationText: '',
      departureTime: '',
      totalSeats: 4,
      pricePerPerson: '',
      costSharing: 'AA分摊',
      remark: '',
      contactName: '',
      contactPhone: '',
      wechatId: '',
      verified: false
    },
    carpoolTypes: constants.CARPOOL_TYPES,
    destinations: constants.CARPOOL_DESTINATIONS,
    costSharingOptions: ['AA分摊', '包车均摊', '车主承担', '面议'],
    costSharingIndex: 0,
    destinationIndex: -1,
    submitting: false
  },

  onLoad() {
    const app = getApp();
    const userInfo = app.globalData.userInfo || {};
    if (userInfo.nickName) {
      this.setData({
        'formData.contactName': userInfo.nickName
      });
    }
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      ['formData.' + field]: value
    });
  },

  onTypeChange(e) {
    const { value } = e.currentTarget.dataset;
    const updates = { 'formData.type': value };
    if (value === 'person_seeking') {
      updates['formData.totalSeats'] = 1;
    } else if (value === 'car_seeking' && this.data.formData.totalSeats === 1) {
      updates['formData.totalSeats'] = 4;
    } else if (value === 'charter' && this.data.formData.totalSeats < 4) {
      updates['formData.totalSeats'] = 6;
    }
    this.setData(updates);
  },

  onDestinationChange(e) {
    const index = e.detail.value;
    const item = this.data.destinations[index];
    this.setData({
      destinationIndex: index,
      'formData.destination': item.value,
      'formData.destinationText': item.label
    });
  },

  onDepartureTimeChange(e) {
    this.setData({
      'formData.departureTime': e.detail.value
    });
  },

  onSeatsChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      'formData.totalSeats': parseInt(value)
    });
  },

  onSeatsInput(e) {
    const val = parseInt(e.detail.value);
    if (val > 0 && val <= 20) {
      this.setData({
        'formData.totalSeats': val
      });
    }
  },

  onCostSharingChange(e) {
    const index = e.detail.value;
    const options = this.data.costSharingOptions;
    this.setData({
      costSharingIndex: index,
      'formData.costSharing': options[index]
    });
  },

  validateForm() {
    const { formData } = this.data;

    if (!formData.departure.trim()) {
      util.showToast('请输入出发地');
      return false;
    }

    if (!formData.destination) {
      util.showToast('请选择目的地');
      return false;
    }

    if (!formData.departureTime) {
      util.showToast('请选择出发时间');
      return false;
    }

    if (new Date(formData.departureTime).getTime() <= Date.now()) {
      util.showToast('出发时间需在当前时间之后');
      return false;
    }

    if (!formData.pricePerPerson || parseFloat(formData.pricePerPerson) < 0) {
      util.showToast('请输入有效的费用');
      return false;
    }

    if (!formData.contactName.trim()) {
      util.showToast('请输入联系人姓名');
      return false;
    }

    if (!formData.contactPhone.trim()) {
      util.showToast('请输入联系电话');
      return false;
    }

    if (!util.isValidPhone(formData.contactPhone)) {
      util.showToast('请输入正确的手机号');
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
        departure: this.data.formData.departure.trim(),
        pricePerPerson: parseFloat(this.data.formData.pricePerPerson),
        totalSeats: this.data.formData.totalSeats
      };

      const result = dataService.publishCarpool(data);

      if (result) {
        await util.showSuccess('发布成功');
        wx.navigateBack({
          delta: 1,
          fail: () => {
            wx.switchTab({ url: '/pages/carpool/index' });
          }
        });
      } else {
        util.showError('发布失败，请重试');
      }
    } catch (e) {
      util.showError('发布失败，请重试');
    } finally {
      this.setData({ submitting: false });
    }
  }
});
