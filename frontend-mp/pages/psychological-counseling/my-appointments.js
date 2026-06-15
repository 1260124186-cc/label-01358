const util = require('../../utils/util');
const constants = require('../../config/constants');
const dataService = require('../../services/data');
const { mixPage } = require('../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    darkMode: false,
    loading: true,
    userId: '',
    currentTab: 'all',
    tabs: constants.PSYCHOLOGICAL_APPOINTMENT_TABS,
    appointments: [],
    filteredAppointments: []
  },

  onLoad() {
    const currentUser = app.globalData.userInfo;
    const userId = currentUser ? currentUser.id : '';

    this.setData({
      userId,
      darkMode: app.globalData.darkMode || false
    });

    if (!userId) {
      util.showToast('请先登录');
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/login/index' });
      }, 1500);
      return;
    }

    this.loadAppointments();
  },

  onShow() {
    if (this.data.userId && !this.data.loading) {
      this.loadAppointments();
    }
  },

  onPullDownRefresh() {
    this.loadAppointments();
    wx.stopPullDownRefresh();
  },

  loadAppointments() {
    this.setData({ loading: true });

    try {
      const appointments = dataService.getPsychologicalAppointmentList({
        userId: this.data.userId
      }).map(appt => {
        return {
          ...appt,
          createTimeText: util.formatDate(appt.createTime)
        };
      });

      this.setData({
        appointments,
        loading: false
      });

      this.filterAppointments();
    } catch (error) {
      console.error('加载预约记录失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  filterAppointments() {
    const { appointments, currentTab } = this.data;
    let filtered = [...appointments];

    if (currentTab !== 'all') {
      filtered = filtered.filter(a => a.status === currentTab);
    }

    this.setData({ filteredAppointments: filtered });
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value }, () => {
      this.filterAppointments();
    });
  },

  onAppointmentTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/psychological-counseling/appointment-detail?id=${id}`);
  },

  onCancel(e) {
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '取消预约',
      content: '确定要取消此心理咨询预约吗？',
      confirmText: '确定取消',
      confirmColor: '#F5222D',
      success: (res) => {
        if (res.confirm) {
          this.doCancel(id);
        }
      }
    });
  },

  doCancel(appointmentId) {
    try {
      const result = dataService.cancelPsychologicalAppointment(appointmentId, '用户主动取消');

      if (result.success) {
        if (result.penaltyNote) {
          wx.showModal({
            title: '取消成功',
            content: result.penaltyNote,
            showCancel: false,
            confirmText: '我知道了',
            success: () => {
              this.loadAppointments();
            }
          });
        } else {
          util.showSuccess('取消成功');
          this.loadAppointments();
        }
      } else {
        util.showToast(result.error || '取消失败');
      }
    } catch (error) {
      console.error('取消预约失败:', error);
      util.showToast('取消失败');
    }
  },

  onReschedule(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/psychological-counseling/reschedule?id=${id}`);
  },

  onViewDetail(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/psychological-counseling/appointment-detail?id=${id}`);
  },

  goBack() {
    wx.navigateBack();
  }
});
