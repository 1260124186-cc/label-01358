const mockData = require('../../../config/mock-data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

let pageOptions = {
  data: {
    darkMode: false,
    showSkeleton: true,
    currentTab: 'activities',
    activities: [],
    stats: null,
    roles: constants.VOLUNTEER_ROLES,
    form: {
      name: '',
      phone: '',
      wechat: '',
      age: '',
      occupation: '',
      role: '',
      experience: '',
      availableTime: '',
      skills: '',
      reason: '',
      agreeProtocol: false
    },
    showSuccess: false,
    submitting: false
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.setData({ darkMode: util.isDarkMode() });
  },

  onRefresh() {
    this.loadData();
  },

  loadData() {
    this.setData({ showSkeleton: true });

    setTimeout(() => {
      const activities = mockData.SHELTER_VOLUNTEER_ACTIVITIES
        .map(item => ({
          ...item,
          typeLabel: constants.VOLUNTEER_ROLES.find(r => r.value === item.type)?.label || '',
          typeIcon: constants.VOLUNTEER_ROLES.find(r => r.value === item.type)?.icon || '',
          typeColor: constants.VOLUNTEER_ROLES.find(r => r.value === item.type)?.color || '',
          dateText: util.formatTime(item.startTime, 'MM月DD日'),
          timeText: util.formatTime(item.startTime, 'HH:mm') + ' - ' + util.formatTime(item.endTime, 'HH:mm'),
          progress: Math.round((item.currentParticipants / item.maxParticipants) * 100),
          startText: util.relativeTime(item.startTime)
        }))
        .sort((a, b) => a.startTime - b.startTime);

      const totalVolunteers = activities.reduce((s, a) => s + a.currentParticipants, 0);
      const stats = {
        activityCount: activities.length,
        totalVolunteers
      };

      this.setData({
        activities,
        stats,
        showSkeleton: false
      });

      wx.stopPullDownRefresh();
    }, 600);
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`form.${field}`]: value
    });
  },

  onRoleTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      'form.role': value
    });
  },

  onActivityTap(e) {
    const { id } = e.currentTarget.dataset;
    const activity = this.data.activities.find(a => a.id === id);
    if (activity) {
      wx.showModal({
        title: activity.title,
        content: `活动时间：${activity.dateText} ${activity.timeText}\n活动地点：${activity.location}\n\n${activity.description}\n\n当前已报名：${activity.currentParticipants}/${activity.maxParticipants}人`,
        confirmText: '立即报名',
        success: (res) => {
          if (res.confirm) {
            this.setData({ currentTab: 'signup' });
          }
        }
      });
    }
  },

  onProtocolTap() {
    wx.showModal({
      title: '志愿者协议',
      content: '《志愿者服务协议》\n\n1. 志愿者需年满18周岁，身体健康，热爱动物。\n\n2. 志愿者需保证提供的个人信息真实有效。\n\n3. 志愿者需服从救助站的统一安排和管理。\n\n4. 志愿者需按时参加培训和志愿服务活动。\n\n5. 志愿者在服务过程中需注意个人安全，遵守操作规程。\n\n6. 志愿者需对救助站的信息保密，不得擅自对外发布。\n\n7. 志愿者有权享受救助站提供的培训和相关福利。\n\n8. 如因故无法参加活动，需提前24小时请假。\n\n9. 本协议最终解释权归救助站所有。',
      showCancel: false,
      confirmText: '我已阅读'
    });
  },

  validateForm() {
    const { form } = this.data;
    if (!form.name.trim()) {
      wx.showToast({ title: '请填写姓名', icon: 'none' });
      return false;
    }
    if (!form.phone.trim()) {
      wx.showToast({ title: '请填写手机号', icon: 'none' });
      return false;
    }
    if (!/^1[3-9]\d{9}$/.test(form.phone.trim())) {
      wx.showToast({ title: '请填写正确的手机号', icon: 'none' });
      return false;
    }
    if (!form.role) {
      wx.showToast({ title: '请选择服务角色', icon: 'none' });
      return false;
    }
    if (!form.availableTime.trim()) {
      wx.showToast({ title: '请填写可服务时间', icon: 'none' });
      return false;
    }
    if (!form.reason.trim()) {
      wx.showToast({ title: '请填写报名理由', icon: 'none' });
      return false;
    }
    if (!form.agreeProtocol) {
      wx.showToast({ title: '请同意志愿者协议', icon: 'none' });
      return false;
    }
    return true;
  },

  onSubmit() {
    if (!this.validateForm()) return;
    if (this.data.submitting) return;

    this.setData({ submitting: true });

    setTimeout(() => {
      this.setData({
        submitting: false,
        showSuccess: true
      });
    }, 1500);
  },

  onSuccessClose() {
    this.setData({ showSuccess: false });
    util.navigateBack();
  },

  onCallPhone() {
    wx.makePhoneCall({ phoneNumber: '13800138000' });
  },

  catchNoop() {}
};

mixPage(pageOptions);
