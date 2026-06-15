const dataService = require('../../services/data');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    appointmentId: '',
    appointment: null,
    loading: true,
    checkedIn: false,
    checkInTime: '',
    inputCode: '',
    showCodeInput: false,
    scanMode: 'scan'
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.setData({ appointmentId: id });
      this.loadAppointment();
    }
  },

  onShow() {
    if (this.data.appointmentId) {
      this.loadAppointment();
    }
  },

  loadAppointment() {
    this.setData({ loading: true });

    const appointment = dataService.getViewingAppointmentDetail(this.data.appointmentId);

    if (!appointment) {
      util.showError('预约不存在');
      this.setData({ loading: false });
      return;
    }

    const checkedIn = appointment.status === 'completed' && appointment.checkInTime;
    const checkInTime = appointment.checkInTime ? util.formatTime(appointment.checkInTime) : '';

    this.setData({
      appointment,
      checkedIn,
      checkInTime,
      loading: false
    });
  },

  onScanCode() {
    if (!util.checkLogin()) return;

    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode', 'barCode'],
      success: (res) => {
        const code = res.result;
        this.verifyAndCheckIn(code);
      },
      fail: () => {
        util.showToast('扫码失败');
      }
    });
  },

  onShowCodeInput() {
    this.setData({ showCodeInput: true, inputCode: '' });
  },

  onHideCodeInput() {
    this.setData({ showCodeInput: false });
  },

  onCodeInput(e) {
    this.setData({ inputCode: e.detail.value });
  },

  onVerifyCode() {
    const code = this.data.inputCode.trim().toUpperCase();
    if (!code) {
      util.showToast('请输入签到码');
      return;
    }
    this.verifyAndCheckIn(code);
  },

  verifyAndCheckIn(code) {
    const appointment = dataService.verifyCheckInCode(code);

    if (!appointment) {
      util.showError('签到码无效或预约已过期');
      return;
    }

    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.doCheckIn(appointment.id, {
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
      fail: () => {
        this.doCheckIn(appointment.id, null);
      }
    });
  },

  doCheckIn(appointmentId, location) {
    const result = dataService.checkInViewing(appointmentId, location);

    if (result.success) {
      util.showSuccess('签到成功');
      this.setData({
        showCodeInput: false,
        checkedIn: true,
        checkInTime: util.formatTime(result.checkIn.checkInTime),
        appointment: result.appointment
      });
    } else {
      util.showError(result.message || '签到失败');
    }
  },

  onGenerateCode() {
    if (!this.data.appointment) return;

    wx.showModal({
      title: '签到码',
      content: this.data.appointment.checkInCode,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  onCopyCode() {
    if (!this.data.appointment) return;

    wx.setClipboardData({
      data: this.data.appointment.checkInCode,
      success: () => {
        util.showToast('签到码已复制');
      }
    });
  },

  stopPropagation() {}
});
