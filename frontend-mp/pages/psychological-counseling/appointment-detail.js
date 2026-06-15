const util = require('../../utils/util');
const constants = require('../../config/constants');
const dataService = require('../../services/data');
const { mixPage } = require('../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    darkMode: false,
    loading: true,
    appointmentId: '',
    appointment: null,
    counselor: null,
    timeline: [],
    cancellationRules: null,
    reminderText: '',
    consultationMethodText: '',
    showCancelModal: false,
    cancelReason: '',
    cancelReasons: ['时间冲突', '临时有事', '已自行解决', '其他原因']
  },

  onLoad(options) {
    const { id } = options;
    this.setData({
      appointmentId: id,
      darkMode: app.globalData.darkMode || false,
      cancellationRules: constants.PSYCHOLOGICAL_CANCELLATION_RULES
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
      const appointment = dataService.getPsychologicalAppointmentDetail(this.data.appointmentId);

      if (!appointment) {
        util.showToast('预约不存在');
        setTimeout(() => wx.navigateBack(), 1500);
        return;
      }

      const timeline = this.buildTimeline(appointment);
      const reminderText = this.getReminderText(appointment.reminder);
      const consultationMethodText = this.getConsultationMethodText(appointment.consultationMethod);

      wx.setNavigationBarTitle({
        title: '预约详情'
      });

      this.setData({
        appointment: {
          ...appointment,
          createTimeText: util.formatTime(appointment.createTime),
          maskedProblem: this.maskProblemDescription(appointment.problemDescription)
        },
        counselor: appointment.counselor,
        timeline,
        reminderText,
        consultationMethodText,
        loading: false
      });
    } catch (error) {
      console.error('加载预约详情失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  buildTimeline(appointment) {
    const events = [];
    const statusMap = constants.PSYCHOLOGICAL_APPOINTMENT_STATUS_MAP;

    events.push({
      status: 'submitted',
      label: '提交预约',
      icon: '📝',
      color: '#3B82F6',
      time: appointment.createTime,
      timeText: util.formatTime(appointment.createTime),
      done: true
    });

    if (appointment.timeline && appointment.timeline.length > 0) {
      appointment.timeline.forEach(item => {
        const statusInfo = statusMap[item.status] || {};
        events.push({
          status: item.status,
          label: statusInfo.label || item.status,
          icon: statusInfo.icon || '📋',
          color: statusInfo.color || '#6B7280',
          time: item.time,
          timeText: util.formatTime(item.time),
          remark: item.remark,
          done: true
        });
      });
    } else {
      if (appointment.status === 'confirmed' || appointment.status === 'completed') {
        events.push({
          status: 'confirmed',
          label: '预约确认',
          icon: '✅',
          color: '#3B82F6',
          time: appointment.confirmTime || appointment.createTime,
          timeText: util.formatTime(appointment.confirmTime || appointment.createTime),
          done: true
        });
      }

      if (appointment.status === 'completed') {
        events.push({
          status: 'completed',
          label: '咨询完成',
          icon: '🎉',
          color: '#10B981',
          time: appointment.completeTime || Date.now(),
          timeText: util.formatTime(appointment.completeTime || Date.now()),
          done: true
        });
      }
    }

    if (appointment.status === 'pending') {
      events.push({
        status: 'confirmed',
        label: '等待确认',
        icon: '⏳',
        color: '#F59E0B',
        done: false
      });
    }

    if (appointment.status === 'pending' || appointment.status === 'confirmed') {
      events.push({
        status: 'completed',
        label: '待完成',
        icon: '🎯',
        color: '#9CA3AF',
        done: false
      });
    }

    return events.sort((a, b) => (a.time || 0) - (b.time || 0));
  },

  getReminderText(reminder) {
    if (!reminder || reminder === 'none') return '不提醒';
    const option = constants.PSYCHOLOGICAL_REMINDER_OPTIONS.find(o => o.value === reminder);
    return option ? option.label : '不提醒';
  },

  getConsultationMethodText(method) {
    const methodMap = {
      online: '线上咨询',
      offline: '线下面谈'
    };
    return methodMap[method] || method || '未设置';
  },

  maskProblemDescription(text) {
    if (!text) return '';
    if (text.length <= 6) return text.charAt(0) + '****';
    return text.substring(0, 3) + '****' + text.substring(text.length - 3);
  },

  onCancel() {
    this.setData({
      showCancelModal: true,
      cancelReason: ''
    });
  },

  onCancelModalClose() {
    this.setData({ showCancelModal: false });
  },

  onCancelReasonSelect(e) {
    const { reason } = e.currentTarget.dataset;
    this.setData({ cancelReason: reason });
  },

  onCancelReasonInput(e) {
    this.setData({ cancelReason: e.detail.value });
  },

  onConfirmCancel() {
    const { cancelReason, appointmentId } = this.data;

    if (!cancelReason.trim()) {
      util.showToast('请选择取消原因');
      return;
    }

    try {
      const result = dataService.cancelPsychologicalAppointment(appointmentId, cancelReason.trim());

      if (result.success) {
        this.setData({ showCancelModal: false });

        if (result.penaltyNote) {
          wx.showModal({
            title: '取消成功',
            content: result.penaltyNote,
            showCancel: false,
            confirmText: '我知道了',
            success: () => {
              this.loadAppointmentDetail();
            }
          });
        } else {
          util.showSuccess('取消成功');
          this.loadAppointmentDetail();
        }
      } else {
        util.showToast(result.error || '取消失败');
      }
    } catch (error) {
      console.error('取消预约失败:', error);
      util.showToast('取消失败');
    }
  },

  onReschedule() {
    util.navigateTo(`/pages/psychological-counseling/reschedule?id=${this.data.appointmentId}`);
  },

  onReview() {
    util.showToast('评价功能开发中');
  },

  stopPropagation() {},

  goBack() {
    wx.navigateBack();
  }
});
