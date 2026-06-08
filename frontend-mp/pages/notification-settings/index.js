const app = getApp();
const dataService = require('../../services/data');
const util = require('../../utils/util');
const constants = require('../../config/constants');

Page({
  data: {
    darkMode: false,
    settings: {},
    settingItems: []
  },

  onLoad() {
    this.loadThemeState();
    this.loadSettings();
  },

  onShow() {
    this.loadThemeState();
  },

  loadThemeState() {
    const { isDark } = app.globalData;
    this.setData({
      darkMode: isDark || false
    });
  },

  loadSettings() {
    const settings = dataService.getNotificationSettings();
    const settingItems = constants.NOTIFICATION_TYPES.map(type => ({
      ...type,
      enabled: settings[type.value] !== false
    }));
    
    this.setData({
      settings,
      settingItems
    });
  },

  onToggleSetting(e) {
    const { type } = e.currentTarget.dataset;
    const { value } = e.detail;
    
    dataService.updateNotificationSettings(type, value);
    this.loadSettings();
    
    const typeLabel = constants.getLabelByValue(constants.NOTIFICATION_TYPES, type);
    util.showToast(`${typeLabel}推送已${value ? '开启' : '关闭'}`);
  },

  async onClearAll() {
    const confirm = await util.showConfirm('确定要清空所有通知消息吗？此操作不可恢复。');
    
    if (confirm) {
      dataService.clearNotifications();
      util.showSuccess('已清空所有消息');
    }
  }
});
