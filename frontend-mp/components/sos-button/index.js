const util = require('../../utils/util');
const constants = require('../../config/constants');
const sosService = require('../../services/sosService');

Component({
  properties: {
    showShortcuts: {
      type: Boolean,
      value: true
    }
  },

  data: {
    pressing: false,
    triggered: false,
    pressSeconds: 0,
    progressDashArray: '0 283',
    hintText: '长按3秒触发求助',
    showConfirm: false,
    showSuccess: false,
    notifyTargets: [],
    lastSOSRecord: null,
    pressTimer: null,
    progressInterval: null
  },

  lifetimes: {
    attached() {
      this.loadNotifyTargets();
    },
    detached() {
      this.clearTimers();
    }
  },

  methods: {
    loadNotifyTargets() {
      const settings = sosService.getSOSSettings();
      const contacts = sosService.getEmergencyContacts();
      const targets = [];
      
      if (settings.notifyAdmin) {
        const adminContacts = sosService.getCampusSecurityContacts().filter(c => 
          c.id === 'security_office' || c.id === 'campus_police'
        );
        adminContacts.forEach(c => {
          targets.push({
            id: c.id,
            name: c.name,
            icon: c.icon
          });
        });
      }
      
      if (settings.notifyContacts) {
        contacts.forEach(c => {
          targets.push({
            id: c.id,
            name: c.name,
            icon: '👤'
          });
        });
      }
      
      this.setData({ notifyTargets: targets });
    },

    onTouchStart(e) {
      e.preventDefault();
      this.setData({ pressing: true, pressSeconds: 0 });
      
      this.data.pressTimer = setTimeout(() => {
        this.onLongPress();
      }, constants.SOS_TRIGGER_DURATION);
      
      let elapsed = 0;
      this.data.progressInterval = setInterval(() => {
        elapsed += 100;
        const seconds = Math.floor(elapsed / 1000);
        const progress = Math.min(elapsed / constants.SOS_TRIGGER_DURATION, 1);
        const dashOffset = progress * 283;
        
        this.setData({
          pressSeconds: seconds,
          progressDashArray: `${dashOffset} 283`,
          hintText: `松开取消，继续按住 ${Math.ceil((constants.SOS_TRIGGER_DURATION - elapsed) / 1000)} 秒`
        });
      }, 100);
    },

    onTouchEnd() {
      this.clearTimers();
      
      if (this.data.pressing && !this.data.triggered) {
        this.setData({
          pressing: false,
          pressSeconds: 0,
          progressDashArray: '0 283',
          hintText: '长按3秒触发求助'
        });
      }
    },

    onLongPress() {
      this.clearTimers();
      this.setData({
        triggered: true,
        pressing: false,
        showConfirm: true,
        hintText: '长按3秒触发求助'
      });
      
      try {
        wx.vibrateShort({});
      } catch (e) {}
    },

    clearTimers() {
      if (this.data.pressTimer) {
        clearTimeout(this.data.pressTimer);
        this.setData({ pressTimer: null });
      }
      if (this.data.progressInterval) {
        clearInterval(this.data.progressInterval);
        this.setData({ progressInterval: null });
      }
    },

    onCancelConfirm() {
      this.setData({
        showConfirm: false,
        triggered: false
      });
    },

    async onConfirmTrigger() {
      this.setData({ showConfirm: false });
      
      util.showLoading('正在发送求助信号...');
      
      try {
        const result = await sosService.triggerSOS();
        
        const record = {
          ...result,
          timeText: util.formatTime(result.timestamp)
        };
        
        this.setData({
          lastSOSRecord: record,
          showSuccess: true,
          triggered: false
        });
      } catch (e) {
        console.error('SOS trigger failed:', e);
        util.showError('发送失败，请重试');
      } finally {
        util.hideLoading();
      }
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

    onCloseSuccess() {
      this.setData({ showSuccess: false });
    },

    onContactsTap() {
      util.navigateTo('/pages/emergency-contacts/index');
    },

    onSettingsTap() {
      util.navigateTo('/pages/sos-settings/index');
    },

    onSafetyTap() {
      util.navigateTo('/pages/safety-education/index');
    },

    noop() {}
  }
});
