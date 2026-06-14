const util = require('../../utils/util');
const constants = require('../../config/constants');
const sosService = require('../../services/sosService');

Page({
  data: {
    darkMode: false,
    history: []
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
    
    const history = sosService.getSOSHistory().map(record => {
      const statusInfo = constants.SOS_STATUS_MAP[record.status] || constants.SOS_STATUS_MAP.pending;
      let locationText = '';
      if (record.location) {
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
      history
    });
  },

  onCallSecurity() {
    const contacts = sosService.getCampusSecurityContacts();
    const security = contacts.find(c => c.id === 'security_office');
    if (security) {
      wx.makePhoneCall({
        phoneNumber: security.phone,
        fail: () => {}
      });
    }
  },

  onCallContact(e) {
    const { item } = e.currentTarget.dataset;
    const contacts = item.emergencyContacts;
    if (contacts && contacts.length > 0) {
      const primary = contacts.find(c => c.isPrimary) || contacts[0];
      if (primary && primary.phone) {
        wx.makePhoneCall({
          phoneNumber: primary.phone,
          fail: () => {}
        });
      }
    }
  }
});
