const util = require('../../../utils/util');
const constants = require('../../../config/constants');
const dataService = require('../../../services/data');
const userService = require('../../../services/userService');
const { mixPage } = require('../../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    darkMode: false,
    loading: true,
    currentTab: 'pending',
    tabs: constants.VENUE_ADMIN_TABS,
    appointments: [],
    filteredAppointments: [],
    isAdmin: false,
    adminId: '',
    showRejectModal: false,
    rejectRemark: '',
    currentAppointmentId: ''
  },

  onLoad() {
    const currentUser = app.globalData.userInfo;
    const adminId = currentUser ? currentUser.id : '';
    const isAdmin = userService.isAdmin(adminId);

    this.setData({
      adminId,
      isAdmin,
      darkMode: app.globalData.darkMode || false
    });

    if (!isAdmin) {
      util.showToast('无管理员权限');
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    this.loadAppointments();
  },

  onShow() {
    if (this.data.isAdmin && !this.data.loading) {
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
      const appointments = dataService.getVenueAppointmentList({}).map(appt => {
        const statusInfo = constants.VENUE_APPOINTMENT_STATUS_MAP[appt.status] || {};
        const user = userService.getUserById(appt.userId);
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
          userName: user ? user.nickName : '未知用户',
          userAvatar: user ? user.avatarUrl : '',
          createTimeText: util.formatTime(appt.createTime),
          approvalTimeText: appt.approvalTime ? util.formatTime(appt.approvalTime) : '',
          timeSlotText: slotLabels.length > 0 ? slotLabels.join('、') : '',
          totalAmountText: appt.totalAmount ? `¥${appt.totalAmount}` : ''
        };
      });

      this.setData({
        appointments,
        loading: false
      });

      this.filterAppointments();
    } catch (error) {
      console.error('加载预约列表失败:', error);
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

  onApprove(e) {
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '通过预约',
      content: '确认通过此预约申请？',
      confirmText: '确认通过',
      success: (res) => {
        if (res.confirm) {
          this.doApprove(id);
        }
      }
    });
  },

  doApprove(appointmentId) {
    try {
      const result = dataService.approveVenueAppointment(
        appointmentId,
        this.data.adminId,
        ''
      );

      if (result.success) {
        util.showSuccess('已通过');
        this.loadAppointments();
      } else {
        util.showToast(result.message || '操作失败');
      }
    } catch (error) {
      console.error('审批失败:', error);
      util.showToast('操作失败');
    }
  },

  onReject(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({
      currentAppointmentId: id,
      showRejectModal: true,
      rejectRemark: ''
    });
  },

  onRejectRemarkInput(e) {
    this.setData({ rejectRemark: e.detail.value });
  },

  onConfirmReject() {
    const { currentAppointmentId, rejectRemark, adminId } = this.data;

    if (!rejectRemark.trim()) {
      util.showToast('请填写拒绝原因');
      return;
    }

    try {
      const result = dataService.rejectVenueAppointment(
        currentAppointmentId,
        adminId,
        rejectRemark.trim()
      );

      if (result.success) {
        util.showSuccess('已拒绝');
        this.setData({ showRejectModal: false });
        this.loadAppointments();
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

  onAppointmentTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/venue-reservation/appointment-detail?id=${id}&admin=1`
    });
  },

  goBack() {
    wx.navigateBack();
  },

  stopPropagation() {}
});
