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
  },

  async onResetMockData() {
    const confirm = await util.showConfirm('确定要重新初始化所有测试数据吗？这将清除所有旧数据并重新生成。');
    
    if (confirm) {
      try {
        const storage = require('../../utils/storage');
        const { STORAGE_KEYS } = storage;
        
        storage.remove(STORAGE_KEYS.LOST_FOUND_LIST);
        storage.remove(STORAGE_KEYS.MARKET_LIST);
        storage.remove(STORAGE_KEYS.SURVEY_LIST);
        storage.remove(STORAGE_KEYS.NOTIFICATIONS);
        storage.remove(STORAGE_KEYS.FAVORITES);
        storage.remove(STORAGE_KEYS.HISTORY);
        
        wx.removeStorageSync('mock_data_version');
        
        const app = getApp();
        app.initMockData();
        
        util.showSuccess('数据已重置');
        
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      } catch (e) {
        console.error('重置数据失败:', e);
        util.showError('重置失败');
      }
    }
  }
});
