const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    id: '',
    detail: null,
    userRegistration: null,
    categoryInfo: null,
    statusInfo: null,
    startTimeText: '',
    endTimeText: '',
    registeredCount: 0
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id });
      this.loadDetail();
    }
  },

  onShow() {
    if (this.data.id) {
      this.loadDetail();
    }
  },

  loadDetail() {
    util.showLoading();
    const detail = dataService.getVolunteerActivityDetail(this.data.id);

    if (detail) {
      const categoryInfo = constants.VOLUNTEER_CATEGORIES.find(c => c.value === detail.category) || {};
      const statusInfo = constants.VOLUNTEER_STATUS.find(s => s.value === detail.status) || {};

      const app = getApp();
      const userInfo = app.globalData.userInfo || {};
      const userId = userInfo.id || 'test_user';
      const registrations = detail.registrations || [];
      const userRegistration = registrations.find(r => r.userId === userId) || null;

      const formattedRegistrations = registrations.map(r => {
        const regStatusMap = {
          registered: { label: '已报名', color: '#F59E0B' },
          checked_in: { label: '已签到', color: '#3B82F6' },
          completed: { label: '已完成', color: '#10B981' }
        };
        const regStatus = regStatusMap[r.status] || { label: r.status, color: '#6B7280' };
        return {
          ...r,
          statusLabel: regStatus.label,
          statusColor: regStatus.color
        };
      });

      this.setData({
        detail,
        categoryInfo,
        statusInfo,
        userRegistration,
        startTimeText: util.formatTime(detail.startTime, 'YYYY-MM-DD HH:mm'),
        endTimeText: util.formatTime(detail.endTime, 'YYYY-MM-DD HH:mm'),
        registeredCount: registrations.length,
        formattedRegistrations
      });

      dataService.increaseVolunteerViews(this.data.id);
      dataService.addHistory(detail, 'volunteer');
    }

    util.hideLoading();
  },

  async registerVolunteerActivity() {
    if (!util.checkLogin()) return;

    const confirmed = await util.showConfirm('确认报名该志愿活动？');
    if (!confirmed) return;

    util.showLoading('报名中...');
    try {
      const result = dataService.registerVolunteerActivity(this.data.id);
      if (result.success) {
        await util.showSuccess('报名成功');
        this.loadDetail();
      } else {
        util.showError(result.message || '报名失败');
      }
    } catch (e) {
      util.showError('报名失败，请重试');
    } finally {
      util.hideLoading();
    }
  },

  async cancelRegistration() {
    const confirmed = await util.showConfirm('确认取消报名？取消后需重新报名。');
    if (!confirmed) return;

    util.showLoading('取消中...');
    try {
      const result = dataService.cancelVolunteerRegistration(this.data.id);
      if (result) {
        await util.showSuccess('已取消报名');
        this.loadDetail();
      } else {
        util.showError('取消失败');
      }
    } catch (e) {
      util.showError('取消失败，请重试');
    } finally {
      util.hideLoading();
    }
  },

  onScanCheckin() {
    if (!util.checkLogin()) return;

    wx.scanCode({
      onlyFromCamera: false,
      scanType: ['qrCode'],
      success: (res) => {
        let activityId = '';
        try {
          const result = typeof res.result === 'string' ? JSON.parse(res.result) : res.result;
          activityId = result.activityId || result.id || '';
        } catch (e) {
          if (typeof res.result === 'string' && res.result.indexOf('activityId=') !== -1) {
            const match = res.result.match(/activityId=([^&]+)/);
            activityId = match ? match[1] : '';
          } else {
            activityId = res.result;
          }
        }

        if (!activityId) {
          util.showError('无效的签到二维码');
          return;
        }

        this.doScanCheckin(activityId);
      },
      fail: () => {
        util.showToast('已取消扫码');
      }
    });
  },

  async doScanCheckin(activityId) {
    util.showLoading('处理中...');
    try {
      const result = dataService.scanCheckin(activityId);
      if (result.success) {
        await util.showSuccess('操作成功');
        this.loadDetail();
      } else {
        util.showError(result.message || '操作失败');
      }
    } catch (e) {
      util.showError('操作失败，请重试');
    } finally {
      util.hideLoading();
    }
  },

  async onCheckin() {
    if (!util.checkLogin()) return;

    const app = getApp();
    const userId = app.globalData.userInfo?.id || 'test_user';

    util.showLoading('签到中...');
    try {
      const result = dataService.checkinVolunteer(this.data.id, userId);
      if (result.success) {
        await util.showSuccess('签到成功');
        this.loadDetail();
      } else {
        util.showError(result.message || '签到失败');
      }
    } catch (e) {
      util.showError('签到失败，请重试');
    } finally {
      util.hideLoading();
    }
  },

  async onCheckout() {
    if (!util.checkLogin()) return;

    const confirmed = await util.showConfirm('确认签退？签退后将记录志愿时长。');
    if (!confirmed) return;

    const app = getApp();
    const userId = app.globalData.userInfo?.id || 'test_user';

    util.showLoading('签退中...');
    try {
      const result = dataService.checkoutVolunteer(this.data.id, userId);
      if (result.success) {
        await util.showSuccess('签退成功，已记录' + (result.hours || '') + '小时志愿时长');
        this.loadDetail();
      } else {
        util.showError(result.message || '签退失败');
      }
    } catch (e) {
      util.showError('签退失败，请重试');
    } finally {
      util.hideLoading();
    }
  },

  onCallPhone() {
    const { detail } = this.data;
    if (!detail || !detail.contactPhone) return;
    wx.makePhoneCall({
      phoneNumber: detail.contactPhone,
      fail: () => {}
    });
  },

  onViewCertificate() {
    wx.navigateTo({
      url: '/pages/volunteer/certificate?activityId=' + this.data.id
    });
  },

  onShareAppMessage() {
    const { detail } = this.data;
    return {
      title: detail ? detail.title : '志愿活动',
      path: '/pages/volunteer/detail?id=' + this.data.id
    };
  }
});
