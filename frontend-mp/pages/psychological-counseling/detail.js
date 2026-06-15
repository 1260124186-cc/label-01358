const util = require('../../utils/util');
const constants = require('../../config/constants');
const dataService = require('../../services/data');
const { mixPage } = require('../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    loading: true,
    submitting: false,
    counselorId: '',
    counselor: null,
    userId: '',
    anonymousId: '',
    dateOptions: [],
    dateIndex: -1,
    selectedDate: '',
    availableSlots: [],
    reminderOptions: constants.PSYCHOLOGICAL_REMINDER_OPTIONS,
    reminderIndex: 0,
    cancellationRules: null,
    consultMethodOptions: [
      { value: 'online', label: '线上咨询' },
      { value: 'offline', label: '线下咨询' }
    ],
    consultMethodIndex: 0,
    formData: {
      timeSlot: '',
      problemDescription: '',
      consultMethod: 'online',
      reminder: 'none'
    }
  },

  onLoad(options) {
    const { id } = options;
    const currentUser = app.globalData.userInfo;

    const dateOptions = this.generateDateOptions();
    const anonymousId = dataService.generateAnonymousUserId();
    const cancellationRules = dataService.getCancellationRules();

    this.setData({
      counselorId: id,
      userId: currentUser ? currentUser.id : '',
      anonymousId,
      dateOptions,
      cancellationRules
    });

    this.loadCounselorDetail();
  },

  generateDateOptions() {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const value = this.formatDateString(date);
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const label = i === 0 ? '今天' : (i === 1 ? '明天' : weekDays[date.getDay()]);
      options.push({
        value,
        label: `${label} ${this.formatMonthDay(date)}`
      });
    }
    return options;
  },

  formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  formatMonthDay(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  },

  loadCounselorDetail() {
    this.setData({ loading: true });

    try {
      const counselor = dataService.getPsychologicalCounselorDetail(this.data.counselorId);

      if (!counselor) {
        util.showToast('咨询师不存在');
        setTimeout(() => wx.navigateBack(), 1500);
        return;
      }

      wx.setNavigationBarTitle({
        title: counselor.name
      });

      this.setData({
        counselor,
        loading: false
      });
    } catch (error) {
      console.error('加载咨询师详情失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  loadAvailableSlots() {
    const { counselorId, selectedDate } = this.data;
    if (!selectedDate) {
      this.setData({ availableSlots: [] });
      return;
    }

    try {
      const slots = dataService.getAvailableTimeSlots(counselorId, selectedDate);
      this.setData({ availableSlots: slots });
    } catch (error) {
      console.error('加载可约时段失败:', error);
      this.setData({ availableSlots: [] });
    }
  },

  onDateChange(e) {
    const index = parseInt(e.detail.value);
    const selectedDate = this.data.dateOptions[index].value;

    this.setData({
      dateIndex: index,
      selectedDate,
      'formData.timeSlot': ''
    }, () => {
      this.loadAvailableSlots();
    });
  },

  onTimeSlotTap(e) {
    const { value, available } = e.currentTarget.dataset;

    if (!available) {
      util.showToast('该时段已约满');
      return;
    }

    this.setData({ 'formData.timeSlot': value });
  },

  onProblemInput(e) {
    this.setData({ 'formData.problemDescription': e.detail.value });
  },

  onConsultMethodChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      consultMethodIndex: index,
      'formData.consultMethod': this.data.consultMethodOptions[index].value
    });
  },

  onReminderChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      reminderIndex: index,
      'formData.reminder': this.data.reminderOptions[index].value
    });
  },

  validateForm() {
    const { selectedDate, formData } = this.data;

    if (!selectedDate) {
      util.showToast('请选择预约日期');
      return false;
    }

    if (!formData.timeSlot) {
      util.showToast('请选择预约时段');
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

    if (!this.validateForm()) return;

    this.setData({ submitting: true });

    try {
      const result = dataService.createPsychologicalAppointment({
        userId: this.data.userId,
        counselorId: this.data.counselorId,
        appointmentDate: this.data.selectedDate,
        timeSlot: this.data.formData.timeSlot,
        problemDescription: this.data.formData.problemDescription.trim(),
        consultMethod: this.data.formData.consultMethod,
        reminder: this.data.formData.reminder,
        anonymousId: this.data.anonymousId
      });

      if (result && result.success) {
        util.showSuccess('预约提交成功');
        setTimeout(() => {
          wx.redirectTo({ url: `/pages/psychological-counseling/appointment-detail?id=${result.appointment.id}` });
        }, 1500);
      } else {
        util.showToast(result?.error || '提交失败，请稍后重试');
      }
    } catch (error) {
      console.error('提交预约失败:', error);
      util.showToast('提交失败，请稍后重试');
    } finally {
      this.setData({ submitting: false });
    }
  }
});
