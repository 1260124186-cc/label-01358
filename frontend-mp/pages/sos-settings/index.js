const util = require('../../utils/util');
const constants = require('../../config/constants');
const sosService = require('../../services/sosService');

Page({
  data: {
    darkMode: false,
    settings: {},
    history: [],
    recentHistory: []
  },

  onLoad() {
    this.loadPage();
  },

  onShow() {
    this.loadPage();
  },

  loadPage() {
    const app = getApp();
    const { isDark } = app.globalData;
    
    const settings = sosService.getSOSSettings();
    const history = sosService.getSOSHistory().map(record => {
      const statusInfo = constants.SOS_STATUS_MAP[record.status] || constants.SOS_STATUS_MAP.pending;
      let locationText = '';
      if (record.nearestPOI) {
        locationText = record.nearestPOI.name;
      } else if (record.location) {
        locationText = `${record.location.latitude.toFixed(4)}, ${record.location.longitude.toFixed(4)}`;
      }
      
      return {
        ...record,
        statusText: statusInfo.label,
        statusColor: statusInfo.color,
        statusBg: statusInfo.color + '20',
        locationText,
        timeText: util.formatTime(record.timestamp)
      };
    }).sort((a, b) => b.timestamp - a.timestamp);
    
    this.setData({
      darkMode: isDark || false,
      settings,
      history,
      recentHistory: history.slice(0, 3)
    });
  },

  onNotifyAdminChange(e) {
    const value = e.detail.value;
    sosService.updateSOSSettings({ notifyAdmin: value });
    this.setData({
      'settings.notifyAdmin': value
    });
  },

  onNotifyContactsChange(e) {
    const value = e.detail.value;
    sosService.updateSOSSettings({ notifyContacts: value });
    this.setData({
      'settings.notifyContacts': value
    });
  },

  onSoundAlertChange(e) {
    const value = e.detail.value;
    sosService.updateSOSSettings({ soundAlert: value });
    this.setData({
      'settings.soundAlert': value
    });
  },

  onVibrateAlertChange(e) {
    const value = e.detail.value;
    sosService.updateSOSSettings({ vibrateAlert: value });
    this.setData({
      'settings.vibrateAlert': value
    });
  },

  onAutoCallChange(e) {
    const value = e.detail.value;
    if (value) {
      util.showConfirm(
        '开启后，触发SOS将自动拨打保卫处电话。确认开启吗？',
        '自动拨号确认'
      ).then(confirmed => {
        if (confirmed) {
          sosService.updateSOSSettings({ autoCall: true });
          this.setData({
            'settings.autoCall': true
          });
        } else {
          this.setData({
            'settings.autoCall': false
          });
        }
      });
    } else {
      sosService.updateSOSSettings({ autoCall: false });
      this.setData({
        'settings.autoCall': false
      });
    }
  },

  onContactsTap() {
    util.navigateTo('/pages/emergency-contacts/index');
  },

  onSafetyTap() {
    util.navigateTo('/pages/safety-education/index');
  },

  onHistoryTap() {
    util.navigateTo('/pages/sos-history/index');
  }
});
