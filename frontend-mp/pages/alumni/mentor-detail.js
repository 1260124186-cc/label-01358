const dataService = require('../../services/data');
const constants = require('../../config/constants');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    mentorId: '',
    mentor: null,
    loading: true,
    availableTimeSlots: []
  },

  onLoad(options) {
    const { id } = options;
    this.setData({ mentorId: id });
    this.loadMentorDetail();
  },

  loadMentorDetail() {
    this.setData({ loading: true });
    const mentor = dataService.getAlumniMentorDetail(this.data.mentorId);
    if (mentor) {
      const processed = {
        ...mentor,
        titleInfo: constants.ALUMNI_MENTOR_TITLES.find(t => t.value === mentor.title),
        expertiseText: (mentor.expertise || []).join('、'),
        expertiseChips: (mentor.expertise || []).map(item => item),
        collegeInfo: constants.ALUMNI_COLLEGES.find(c => c.value === mentor.college)
      };
      this.setData({
        mentor: processed,
        availableTimeSlots: constants.ALUMNI_APPOINTMENT_TIME_SLOTS.slice(0, 5),
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
    wx.navigateTo({
      url: `/pages/alumni/mentor-appointment?id=${this.data.mentorId}`
    });
  },

  stopPropagation() {}
});
