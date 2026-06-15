const util = require('../../utils/util');
const constants = require('../../config/constants');
const dataService = require('../../services/data');
const userService = require('../../services/userService');
const { mixPage } = require('../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    darkMode: false,
    loading: true,
    appointmentId: '',
    appointment: null,
    venue: null,
    userInfo: null,
    userId: '',
    isAdmin: false,
    showRejectModal: false,
    rejectRemark: '',
    timeSlotText: ''
  },

  onLoad(options) {
    const { id, admin } = options;
    const currentUser = app.globalData.userInfo;
    const userId = currentUser ? currentUser.id : '';
    const isAdmin = admin === '1' || userService.isAdmin(userId);

    this.setData({
      appointmentId: id,
      userId,
      isAdmin,
      darkMode: app.globalData.darkMode || false
    });

    this.loadAppointmentDetail();
  },

  onShow() {
    if (this.data.appointmentId && !this.data.loading) {
      this.loadAppointmentDetail();
    }
  },

  loadAppointmentDetail() {
    this.setData({ loading: true });

    try {
      const appointment = dataService.getVenueAppointmentDetail(this.data.appointmentId);

      if (!appointment) {
        util.showToast('预约不存在');
        setTimeout(() => wx.navigateBack(), 1500);
        return;
      }

      const venue = dataService.getVenueDetail(appointment.venueId);
      const user = userService.getUserById(appointment.userId);

      const timeSlots = appointment.timeSlots || [];
      const slotLabels = timeSlots.map(slot => {
        const slotInfo = constants.VENUE_TIME_SLOTS.find(s => s.value === slot);
        return slotInfo ? slotInfo.label : slot;
      });

      wx.setNavigationBarTitle({
        title: '预约详情'
      });

      const overtimeFee = appointment.overtimeFee || 0;
      const actualFee = appointment.actualFee || appointment.totalAmount || 0;

      this.setData({
        appointment: {
          ...appointment,
          createTimeText: util.formatTime(appointment.createTime),
          checkInTimeText: appointment.checkInTime ? util.formatTime(appointment.checkInTime) : '',
          checkOutTimeText: appointment.checkOutTime ? util.formatTime(appointment.checkOutTime) : '',
          approvalTimeText: appointment.approvalTime ? util.formatTime(appointment.approvalTime) : '',
          totalAmountText: appointment.totalAmount !== undefined ? `¥${appointment.totalAmount.toFixed(2)}` : '',
          actualFeeText: `¥${actualFee.toFixed(2)}`,
          overtimeFeeText: overtimeFee > 0 ? `¥${overtimeFee.toFixed(2)}` : ''
        },
        venue,
        userInfo: user ? userService.sanitizeUserInfo(user) : null,
        timeSlotText: slotLabels.length > 0 ? slotLabels.join('、') : '',
        loading: false
      });
    } catch (error) {
      console.error('加载预约详情失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  onApprove() {
    wx.showModal({
      title: '通过预约',
      content: '确认通过此预约申请？',
      confirmText: '确认通过',
      success: (res) => {
        if (res.confirm) {
          this.doApprove();
        }
      }
    });
  },

  doApprove() {
    try {
      const result = dataService.approveVenueAppointment(
        this.data.appointmentId,
        this.data.userId,
        ''
      );

      if (result.success) {
        util.showSuccess('已通过');
        this.loadAppointmentDetail();
      } else {
        util.showToast(result.message || '操作失败');
      }
    } catch (error) {
      console.error('审批失败:', error);
      util.showToast('操作失败');
    }
  },

  onReject() {
    this.setData({
      showRejectModal: true,
      rejectRemark: ''
    });
  },

  onRejectRemarkInput(e) {
    this.setData({ rejectRemark: e.detail.value });
  },

  onConfirmReject() {
    const { rejectRemark } = this.data;

    if (!rejectRemark.trim()) {
      util.showToast('请填写拒绝原因');
      return;
    }

    try {
      const result = dataService.rejectVenueAppointment(
        this.data.appointmentId,
        this.data.userId,
        rejectRemark.trim()
      );

      if (result.success) {
        util.showSuccess('已拒绝');
        this.setData({ showRejectModal: false });
        this.loadAppointmentDetail();
      } else {
        util.showToast(result.message || '操作失败');
      }
    } catch (error) {
      console.error('拒绝失败:', error);
      util.showToast('操作失败');
    }
  },

  onCancelReject() {
    this.setData({ showRejectModal: false });
  },

  onCheckIn() {
    wx.showModal({
      title: '确认签到',
      content: '确认开始使用场馆？请遵守场馆使用规定。',
      confirmText: '确认签到',
      success: (res) => {
        if (res.confirm) {
          this.doCheckIn();
        }
      }
    });
  },

  doCheckIn() {
    try {
      const result = dataService.checkInVenue(this.data.appointmentId, this.data.userId);

      if (result.success) {
        util.showSuccess('签到成功');
        this.loadAppointmentDetail();
      } else {
        util.showToast(result.message || '签到失败');
      }
    } catch (error) {
      console.error('签到失败:', error);
      util.showToast('签到失败');
    }
  },

  onCheckOut() {
    wx.showModal({
      title: '确认签退',
      content: '请确认已整理好物品，关闭设施，清理场地。',
      confirmText: '确认签退',
      success: (res) => {
        if (res.confirm) {
          this.doCheckOut();
        }
      }
    });
  },

  doCheckOut() {
    try {
      const result = dataService.checkOutVenue(this.data.appointmentId, this.data.userId);

      if (result.success) {
        if (result.isViolation) {
          const overtimeFee = result.overtimeFee || 0;
          wx.showModal({
            title: '签退成功',
            content: `注意：您已超时，产生超时费用¥${overtimeFee.toFixed(2)}，并扣除相应信用分。请下次按时归还。`,
            showCancel: false,
            confirmText: '我知道了',
            success: () => {
              this.loadAppointmentDetail();
            }
          });
        } else {
          util.showSuccess('签退成功');
          this.loadAppointmentDetail();
        }
      } else {
        util.showToast(result.message || '签退失败');
      }
    } catch (error) {
      console.error('签退失败:', error);
      util.showToast('签退失败');
    }
  },

  onCancel() {
    wx.showModal({
      title: '取消预约',
      content: '确定要取消此预约吗？',
      confirmText: '确定取消',
      confirmColor: '#F5222D',
      success: (res) => {
        if (res.confirm) {
          this.doCancel();
        }
      }
    });
  },

  doCancel() {
    try {
      const result = dataService.cancelVenueAppointment(
        this.data.appointmentId,
        this.data.userId
      );

      if (result.success) {
        util.showSuccess('取消成功');
        this.loadAppointmentDetail();
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
  },

  stopPropagation() {}
});
