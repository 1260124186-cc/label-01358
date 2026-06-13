const i18n = require('../../utils/i18n');
const util = require('../../utils/util');
const constants = require('../../config/constants');

Page({
  data: {
    lang: 'zh',
    darkMode: false,
    contacts: [],
    emergencyPhraseVisible: false
  },

  onLoad() {
    this.initPage();
  },

  onShow() {
    this.initPage();
  },

  initPage() {
    const lang = i18n.getLanguage();
    const app = getApp();
    const { isDark } = app.globalData;

    const contacts = constants.INTL_EMERGENCY_CONTACTS.map(c => ({
      ...c,
      displayName: lang === 'zh' ? c.name : c.nameEn,
      displayDesc: lang === 'zh' ? c.description : c.descriptionEn,
      displayHours: lang === 'zh' ? c.hours : c.hoursEn
    }));

    this.setData({
      lang,
      darkMode: isDark || false,
      contacts
    });

    wx.setNavigationBarTitle({
      title: lang === 'zh' ? '紧急英语热线' : 'Emergency Hotlines'
    });
  },

  onCallTap(e) {
    const { phone } = e.currentTarget.dataset;
    if (!phone) return;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: () => {},
      fail: (err) => {
        if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
          util.showToast(this.data.lang === 'zh' ? '拨号失败' : 'Call failed');
        }
      }
    });
  },

  onSosTap() {
    const lang = this.data.lang;
    util.showModal(
      lang === 'zh' 
        ? '确定拨打校园安保紧急电话吗？如遇紧急情况请保持冷静。'
        : 'Confirm calling campus security emergency line? Stay calm in case of emergency.',
      lang === 'zh' ? '紧急呼叫' : 'Emergency Call'
    ).then(confirmed => {
      if (confirmed) {
        wx.vibrateLong({});
        wx.makePhoneCall({
          phoneNumber: '110',
          fail: () => {}
        });
      }
    });
  },

  togglePhrases() {
    this.setData({ emergencyPhraseVisible: !this.data.emergencyPhraseVisible });
  },

  onCopyPhrase(e) {
    const { text } = e.currentTarget.dataset;
    wx.setClipboardData({
      data: text,
      success: () => {
        util.showToast(this.data.lang === 'zh' ? '已复制' : 'Copied');
      }
    });
  },

  onSwitchLanguage() {
    i18n.toggleLanguage();
    this.initPage();
  }
});
