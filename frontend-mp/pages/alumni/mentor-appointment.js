const dataService = require('../../services/data');
const constants = require('../../config/constants');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    mentorId: '',
    mentor: null,
    loading: true,
    appointmentDate: '',
    appointmentDateText: '',
    appointmentTime: '',
    appointmentTopic: '',
    appointmentDescription: '',
    contactInfo: '',
    appointmentDateOptions: [],
    appointmentTimeOptions: constants.ALUMNI_APPOINTMENT_TIME_SLOTS,
    showDatePicker: false,
    showTimePicker: false,
    submitting: false
  },

  onLoad(options) {
    const { id } = options;
    this.setData({ mentorId: id });
    this.initDateOptions();
    this.loadMentorDetail();
  },

  initDateOptions() {
    const options = [];
    const now = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const weekDay = weekDays[date.getDay()];
      const value = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const label = `${month}月${day}日 ${weekDay}`;
      options.push({ value, label });
    }
    this.setData({ appointmentDateOptions: options });
  },

  loadMentorDetail() {
    this.setData({ loading: true });
    const mentor = dataService.getAlumniMentorDetail(this.data.mentorId);
    if (mentor) {
      const processed = {
        ...mentor,
        titleInfo: constants.ALUMNI_MENTOR_TITLES.find(t => t.value === mentor.title)
      };
      this.setData({
        mentor: processed,
        loading: false
      });
      wx.setNavigationBarTitle({
        title: '预约咨询'
      });
    } else {
      wx.showToast({ title: '导师不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
    }
  },

  onDatePickerTap() {
    this.setData({ showDatePicker: true });
  },

  onDateSelect(e) {
    const { value, label } = e.currentTarget.dataset;
    this.setData({
      appointmentDate: value,
      appointmentDateText: label,
      showDatePicker: false
    });
  },

  onTimePickerTap() {
    this.setData({ showTimePicker: true });
  },

  onTimeSelect(e) {
    const { value, label } = e.currentTarget.dataset;
    this.setData({
      appointmentTime: value,
      appointmentTimeText: label,
      showTimePicker: false
    });
  },

  onTopicInput(e) {
    this.setData({ appointmentTopic: e.detail.value });
  },

  onDescriptionInput(e) {
    this.setData({ appointmentDescription: e.detail.value });
  },

  onContactInput(e) {
    this.setData({ contactInfo: e.detail.value });
  },

  onCloseDatePicker() {
    this.setData({ showDatePicker: false });
  },

  onCloseTimePicker() {
    this.setData({ showTimePicker: false });
  },

  onSubmitAppointment() {
    const { appointmentDate, appointmentTime, appointmentTopic, appointmentDescription, contactInfo, mentorId } = this.data;

    if (!appointmentDate) {
      wx.showToast({ title: '请选择预约日期', icon: 'none' });
      return;
    }
    if (!appointmentTime) {
      wx.showToast({ title: '请选择预约时间', icon: 'none' });
      return;
    }
    if (!appointmentTopic.trim()) {
      wx.showToast({ title: '请输入咨询主题', icon: 'none' });
      return;
    }
    if (!appointmentDescription.trim()) {
      wx.showToast({ title: '请输入问题描述', icon: 'none' });
      return;
    }
    if (appointmentDescription.length < 10) {
      wx.showToast({ title: '问题描述至少10个字符', icon: 'none' });
      return;
    }
    if (!contactInfo.trim()) {
      wx.showToast({ title: '请输入联系方式', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    const result = dataService.createAlumniMentorAppointment(mentorId, {
      date: appointmentDate,
      dateText: this.data.appointmentDateText,
      time: appointmentTime,
      timeText: this.data.appointmentTimeText,
      topic: appointmentTopic.trim(),
      description: appointmentDescription.trim(),
      contact: contactInfo.trim(),
      fee: this.data.mentor.appointmentFee
    });

    this.setData({ submitting: false });

    if (result) {
      wx.showToast({ title: '预约提交成功', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } else {
      wx.showToast({ title: '预约失败，请重试', icon: 'none' });
    }
  },

  stopPropagation() {}
});
