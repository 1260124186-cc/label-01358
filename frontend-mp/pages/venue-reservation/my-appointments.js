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
    tabs: constants.VENUE_MY_APPOINTMENT_TABS,
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
      const appointments = dataService.getVenueAppointmentList({
        userId: this.data.userId
      }).map(appt => {
        const statusInfo = constants.VENUE_APPOINTMENT_STATUS_MAP[appt.status] || {};
        const timeSlots = appt.timeSlots || [];
        const slotLabels = timeSlots.map(slot => {
          const slotInfo = constants.VENUE_TIME_SLOTS.find(s => s.value === slot);
          return slotInfo ? slotInfo.label : slot;
        });

        return {
          ...appt,
          statusLabel: statusInfo.label,
          statusColor: statusInfo.color,
          statusIcon: statusInfo.icon,
          createTimeText: util.formatDate(appt.createTime),
          checkInTimeText: appt.checkInTime ? util.formatTime(appt.checkInTime) : '',
          checkOutTimeText: appt.checkOutTime ? util.formatTime(appt.checkOutTime) : '',
          timeSlotText: slotLabels.length > 0 ? slotLabels.join('、') : '',
          totalAmountText: appt.totalAmount !== undefined ? `¥${appt.totalAmount}` : ''
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
      if (currentTab === 'pending') {
        filtered = filtered.filter(a => a.status === 'pending');
      } else if (currentTab === 'approved') {
        filtered = filtered.filter(a => a.status === 'approved');
      } else if (currentTab === 'using') {
        filtered = filtered.filter(a => a.status === 'checked_in');
      } else if (currentTab === 'completed') {
        filtered = filtered.filter(a => a.status === 'checked_out' || a.status === 'violation');
      } else if (currentTab === 'cancelled') {
        filtered = filtered.filter(a => a.status === 'cancelled' || a.status === 'rejected');
      }
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
    util.navigateTo(`/pages/venue-reservation/appointment-detail?id=${id}`);
  },

  onCheckIn(e) {
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '确认签到',
      content: '确认开始使用场馆？请遵守场馆使用规定。',
      confirmText: '确认签到',
      success: (res) => {
        if (res.confirm) {
          this.doCheckIn(id);
        }
      }
    });
  },

  doCheckIn(appointmentId) {
    try {
      const result = dataService.checkInVenue(appointmentId, this.data.userId);

      if (result.success) {
        util.showSuccess('签到成功');
        this.loadAppointments();
      } else {
        util.showToast(result.message || '签到失败');
      }
    } catch (error) {
      console.error('签到失败:', error);
      util.showToast('签到失败');
    }
  },

  onCheckOut(e) {
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '确认签退',
      content: '请确认已整理好物品，关闭设施，清理场地。',
      confirmText: '确认签退',
      success: (res) => {
        if (res.confirm) {
          this.doCheckOut(id);
        }
      }
    });
  },

  doCheckOut(appointmentId) {
    try {
      const result = dataService.checkOutVenue(appointmentId, this.data.userId);

      if (result.success) {
        if (result.isViolation) {
          wx.showModal({
            title: '签退成功',
            content: `注意：您已超时${result.overtimeMinutes}分钟，扣除${result.creditDeduct}分信用分，并产生超时费用¥${result.overtimeFee}。请下次按时归还。`,
            showCancel: false,
            confirmText: '我知道了',
            success: () => {
              this.loadAppointments();
            }
          });
        } else {
          util.showSuccess('签退成功');
          this.loadAppointments();
        }
      } else {
        util.showToast(result.message || '签退失败');
      }
    } catch (error) {
      console.error('签退失败:', error);
      util.showToast('签退失败');
    }
  },

  onCancel(e) {
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '取消预约',
      content: '确定要取消此预约吗？',
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
      const result = dataService.cancelVenueAppointment(appointmentId, this.data.userId);

      if (result.success) {
        util.showSuccess('取消成功');
        this.loadAppointments();
      } else {
        util.showToast(result.message || '取消失败');
      }
    } catch (error) {
      console.error('取消预约失败:', error);
      util.showToast('取消失败');
    }
  },

  goBack() {
    wx.navigateBack();
  }
});
