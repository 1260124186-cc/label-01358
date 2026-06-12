const dataService = require('../../services/data');
const constants = require('../../config/constants');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    roadshowId: '',
    roadshow: null,
    isRegistered: false,
    showRegisterModal: false,
    registerForm: {
      name: '',
      phone: '',
      organization: '',
      note: ''
    },
    loading: true,
    submitting: false
  },

  onLoad(options) {
    const { id } = options;
    this.setData({ roadshowId: id });
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData() {
    this.setData({ loading: true });
    dataService.initAllInnovationData();
    const roadshow = dataService.getInnovationRoadshowDetail(this.data.roadshowId);
    if (roadshow) {
      dataService.increaseRoadshowViews(this.data.roadshowId);
      const isRegistered = dataService.isRegisteredForRoadshow(this.data.roadshowId, 'current_user');
      const processedRoadshow = {
        ...roadshow,
        statusInfo: constants.INNOVATION_ROADSHOW_STATUS.find(s => s.value === roadshow.status),
        dateText: roadshow.date,
        timeText: `${roadshow.startTime}-${roadshow.endTime}`,
        progress: Math.min(100, Math.round((roadshow.registeredCount / roadshow.maxParticipants) * 100)),
        highlightsText: (roadshow.highlights || []).join(' · ')
      };
      this.setData({
        roadshow: processedRoadshow,
        isRegistered,
        loading: false
      });
    } else {
      this.setData({ loading: false });
      wx.showToast({ title: '路演不存在', icon: 'none' });
    }
  },

  onRegisterTap() {
    if (this.data.isRegistered) {
      wx.showModal({
        title: '取消报名',
        content: '确定要取消本次路演活动的报名吗？',
        success: (res) => {
          if (res.confirm) {
            this.cancelRegistration();
          }
        }
      });
    } else {
      if (this.data.roadshow.status === 'ended') {
        wx.showToast({ title: '活动已结束', icon: 'none' });
        return;
      }
      if (this.data.roadshow.registeredCount >= this.data.roadshow.maxParticipants) {
        wx.showToast({ title: '报名人数已满', icon: 'none' });
        return;
      }
      this.setData({ showRegisterModal: true });
    }
  },

  onFormInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`registerForm.${field}`]: e.detail.value
    });
  },

  onCloseModal() {
    this.setData({ showRegisterModal: false });
  },

  onSubmitRegister() {
    const { name, phone } = this.data.registerForm;
    if (!name || !phone) {
      wx.showToast({ title: '请填写姓名和手机号', icon: 'none' });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });
    const result = dataService.registerForRoadshow(
      this.data.roadshowId,
      'current_user',
      this.data.registerForm
    );
    this.setData({ submitting: false });

    if (result.success) {
      wx.showToast({ title: '报名成功', icon: 'success' });
      this.setData({ showRegisterModal: false });
      this.loadData();
    } else {
      wx.showToast({ title: result.message || '报名失败', icon: 'none' });
    }
  },

  cancelRegistration() {
    const result = dataService.cancelRoadshowRegistration(this.data.roadshowId, 'current_user');
    if (result.success) {
      wx.showToast({ title: '已取消报名', icon: 'success' });
      this.loadData();
    } else {
      wx.showToast({ title: result.message || '取消失败', icon: 'none' });
    }
  },

  onShareAppMessage() {
    return {
      title: this.data.roadshow ? this.data.roadshow.title : '路演活动',
      path: `/pages/innovation/roadshow-detail?id=${this.data.roadshowId}`
    };
  },

  stopPropagation() {}
});
