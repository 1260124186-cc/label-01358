const util = require('../../utils/util');
const constants = require('../../config/constants');
const dataService = require('../../services/data');
const { mixPage } = require('../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    darkMode: false,
    loading: true,
    submitting: false,
    labId: '',
    lab: null,
    userId: '',
    canBook: false,
    canBookReason: '',
    needTraining: false,
    formData: {
      appointmentDate: '',
      timeSlot: '',
      participantCount: 1,
      purpose: '',
      contactPhone: ''
    },
    timeSlots: [],
    participantOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    participantIndex: 0,
    minDate: '',
    timeSlotCapacity: {}
  },

  onLoad(options) {
    const { id } = options;
    const currentUser = app.globalData.userInfo;

    const today = new Date();
    const minDate = util.formatDate(today.getTime());

    this.setData({
      labId: id,
      userId: currentUser ? currentUser.id : '',
      darkMode: app.globalData.darkMode || false,
      minDate
    });

    this.loadLabDetail();
  },

  onShow() {
    if (this.data.labId && !this.data.loading) {
      this.loadLabDetail();
    }
  },

  loadLabDetail() {
    this.setData({ loading: true });

    try {
      const lab = dataService.getLabDetail(this.data.labId);

      if (!lab) {
        util.showToast('实验室不存在');
        setTimeout(() => wx.navigateBack(), 1500);
        return;
      }

      const typeInfo = constants.LAB_TYPES.find(t => t.value === lab.type) || {};
      const timeSlots = (lab.openTimeSlots || []).map(slot => {
        const slotInfo = constants.LAB_TIME_SLOTS.find(s => s.value === slot);
        return slotInfo || { value: slot, label: slot };
      });

      const bookCheck = dataService.canBookLab(this.data.userId, lab);

      wx.setNavigationBarTitle({
        title: lab.name
      });

      this.setData({
        lab: {
          ...lab,
          typeIcon: typeInfo.icon || '🔬',
          typeLabel: typeInfo.label || '其他'
        },
        timeSlots,
        canBook: bookCheck.canBook,
        canBookReason: bookCheck.reason,
        needTraining: bookCheck.needTraining || false,
        loading: false
      });

      if (this.data.formData.appointmentDate) {
        this.loadTimeSlotCapacities();
      }
    } catch (error) {
      console.error('加载实验室详情失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  loadTimeSlotCapacities() {
    const { labId, formData, timeSlots } = this.data;
    const capacityMap = {};

    timeSlots.forEach(slot => {
      const capacity = dataService.getLabTimeSlotCapacity(
        labId,
        formData.appointmentDate,
        slot.value
      );
      capacityMap[slot.value] = capacity;
    });

    this.setData({ timeSlotCapacity: capacityMap });
  },

  onDateChange(e) {
    this.setData({
      'formData.appointmentDate': e.detail.value,
      'formData.timeSlot': ''
    }, () => {
      this.loadTimeSlotCapacities();
    });
  },

  onTimeSlotTap(e) {
    const { value } = e.currentTarget.dataset;
    const capacity = this.data.timeSlotCapacity[value];

    if (capacity && capacity.available <= 0) {
      util.showToast('该时段已满');
      return;
    }

    this.setData({ 'formData.timeSlot': value });
  },

  onParticipantChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      participantIndex: index,
      'formData.participantCount': this.data.participantOptions[index]
    });
  },

  onPurposeInput(e) {
    this.setData({ 'formData.purpose': e.detail.value });
  },

  onContactPhoneInput(e) {
    this.setData({ 'formData.contactPhone': e.detail.value });
  },

  validateForm() {
    const { formData, lab } = this.data;

    if (!formData.appointmentDate) {
      util.showToast('请选择预约日期');
      return false;
    }

    if (!formData.timeSlot) {
      util.showToast('请选择预约时段');
      return false;
    }

    const capacity = this.data.timeSlotCapacity[formData.timeSlot];
    if (capacity && formData.participantCount > capacity.available) {
      util.showToast('预约人数超出剩余容量');
      return false;
    }

    if (formData.participantCount > lab.capacity) {
      util.showToast(`预约人数不能超过容量${lab.capacity}人`);
      return false;
    }

    if (!formData.purpose.trim()) {
      util.showToast('请填写使用目的');
      return false;
    }

    if (!formData.contactPhone.trim()) {
      util.showToast('请填写联系电话');
      return false;
    }

    const phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(formData.contactPhone.trim())) {
      util.showToast('请输入正确的手机号');
      return false;
    }

    return true;
  },

  onSubmit() {
    if (!this.data.userId) {
      util.showToast('请先登录');
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/login/index' });
      }, 1500);
      return;
    }

    if (!this.data.canBook) {
      if (this.data.needTraining) {
        wx.showModal({
          title: '需要安全培训',
          content: `预约此实验室需要通过${this.data.lab.safetyLevelLabel}安全培训，是否前往完成培训？`,
          confirmText: '去培训',
          success: (res) => {
            if (res.confirm) {
              this.goToSafetyTraining();
            }
          }
        });
      } else {
        util.showToast(this.data.canBookReason || '不可预约');
      }
      return;
    }

    if (!this.validateForm()) return;

    this.setData({ submitting: true });

    try {
      const appointment = dataService.createLabAppointment({
        userId: this.data.userId,
        labId: this.data.labId,
        ...this.data.formData,
        purpose: this.data.formData.purpose.trim(),
        contactPhone: this.data.formData.contactPhone.trim()
      });

      if (appointment) {
        util.showSuccess('预约提交成功');
        setTimeout(() => {
          wx.redirectTo({ url: '/pages/lab-reservation/my-appointments' });
        }, 1500);
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

  goToSafetyTraining() {
    util.navigateTo('/pages/safety-education/index');
  },

  onTrainingComplete() {
    if (!this.data.lab) return;

    const result = dataService.setLabSafetyTrainingPassed(
      this.data.userId,
      this.data.lab.type
    );

    if (result && result.passed) {
      util.showSuccess('培训通过');
      const bookCheck = dataService.canBookLab(this.data.userId, this.data.lab);
      this.setData({
        canBook: bookCheck.canBook,
        canBookReason: bookCheck.reason,
        needTraining: bookCheck.needTraining || false
      });
    }
  },

  goBack() {
    wx.navigateBack();
  }
});
