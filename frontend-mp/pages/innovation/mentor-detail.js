const dataService = require('../../services/data');
const constants = require('../../config/constants');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    mentorId: '',
    mentor: null,
    loading: true,
    showAppointmentModal: false,
    appointmentDate: '',
    appointmentTime: '',
    appointmentPurpose: '',
    appointmentDateOptions: [],
    appointmentTimeOptions: [
      { value: '09:00', label: '09:00' },
      { value: '10:00', label: '10:00' },
      { value: '11:00', label: '11:00' },
      { value: '14:00', label: '14:00' },
      { value: '15:00', label: '15:00' },
      { value: '16:00', label: '16:00' }
    ],
    showDatePicker: false,
    showTimePicker: false
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
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const weekDay = weekDays[date.getDay()];
      const value = `${month}月${day}日`;
      options.push({
        value,
        label: `${value} ${weekDay}`
      });
    }
    this.setData({ appointmentDateOptions: options });
  },

  loadMentorDetail() {
    this.setData({ loading: true });
    const mentor = dataService.getInnovationMentorDetail(this.data.mentorId);
    if (mentor) {
      const processed = {
        ...mentor,
        titleInfo: constants.INNOVATION_MENTOR_TITLES.find(t => t.value === mentor.title),
        researchAreasText: (mentor.researchAreas || []).join('、'),
        researchAreaChips: (mentor.researchAreas || []).map(item => item),
        expertisesText: (mentor.expertise || []).join('、')
      };
      this.setData({
        mentor: processed,
        loading: false
      });
      wx.setNavigationBarTitle({
        title: mentor.name
      });
    } else {
      wx.showToast({ title: '导师不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
    }
  },

  onAppointmentTap() {
    this.setData({
      showAppointmentModal: true,
      appointmentDate: '',
      appointmentTime: '',
      appointmentPurpose: ''
    });
  },

  onCloseAppointmentModal() {
    this.setData({ showAppointmentModal: false });
  },

  onDatePickerTap() {
    this.setData({ showDatePicker: true });
  },

  onDateSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      appointmentDate: value,
      showDatePicker: false
    });
  },

  onTimePickerTap() {
    this.setData({ showTimePicker: true });
  },

  onTimeSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      appointmentTime: value,
      showTimePicker: false
    });
  },

  onPurposeInput(e) {
    this.setData({ appointmentPurpose: e.detail.value });
  },

  onCloseDatePicker() {
    this.setData({ showDatePicker: false });
  },

  onCloseTimePicker() {
    this.setData({ showTimePicker: false });
  },

  onSubmitAppointment() {
    const { appointmentDate, appointmentTime, appointmentPurpose } = this.data;
    
    if (!appointmentDate) {
      wx.showToast({ title: '请选择预约日期', icon: 'none' });
      return;
    }
    if (!appointmentTime) {
      wx.showToast({ title: '请选择预约时间', icon: 'none' });
      return;
    }
    if (!appointmentPurpose.trim()) {
      wx.showToast({ title: '请输入预约事由', icon: 'none' });
      return;
    }
    if (appointmentPurpose.length < 10) {
      wx.showToast({ title: '预约事由至少10个字符', icon: 'none' });
      return;
    }

    const result = dataService.createMentorAppointment(this.data.mentorId, {
      date: appointmentDate,
      time: appointmentTime,
      purpose: appointmentPurpose.trim()
    });

    if (result) {
      wx.showToast({ title: '预约成功', icon: 'success' });
      this.setData({ showAppointmentModal: false });
    } else {
      wx.showToast({ title: '预约失败', icon: 'none' });
    }
  },

  stopPropagation() {}
});
