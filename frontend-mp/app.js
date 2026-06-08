const theme = require('./utils/theme');
const storage = require('./utils/storage');
const mockData = require('./config/mock-data');

App({
  globalData: {
    userInfo: null,
    systemInfo: null,
    statusBarHeight: 0,
    navBarHeight: 44,
    themeMode: 'system',
    isDark: false
  },

  onLaunch() {
    this.initSystemInfo();
    this.loadUserInfo();
    this.initTestAccount();
    this.initTheme();
    this.initMockData();
  },

  initMockData() {
    try {
      const { STORAGE_KEYS } = storage;
      const now = Date.now();

      let lostFoundList = storage.get(STORAGE_KEYS.LOST_FOUND_LIST);
      if (!lostFoundList || lostFoundList.length === 0) {
        lostFoundList = mockData.MOCK_LOST_FOUND.map((item, index) => ({
          id: 'mock_lf_' + index + '_' + now,
          ...item,
          userId: 'test_user',
          createTime: now - (index + 10) * 86400000,
          updateTime: now - (index + 10) * 86400000,
          status: 'active',
          views: Math.floor(Math.random() * 100) + 10
        }));
        storage.set(STORAGE_KEYS.LOST_FOUND_LIST, lostFoundList);
      }

      let marketList = storage.get(STORAGE_KEYS.MARKET_LIST);
      if (!marketList || marketList.length === 0) {
        marketList = mockData.MOCK_MARKET_ITEMS.map((item, index) => ({
          id: 'mock_mk_' + index + '_' + now,
          ...item,
          userId: 'test_user',
          createTime: now - (index + 10) * 86400000,
          updateTime: now - (index + 10) * 86400000,
          status: 'selling',
          views: Math.floor(Math.random() * 200) + 50
        }));
        storage.set(STORAGE_KEYS.MARKET_LIST, marketList);
      }

      let surveyList = storage.get(STORAGE_KEYS.SURVEY_LIST);
      if (!surveyList || surveyList.length === 0) {
        surveyList = mockData.MOCK_SURVEYS.map((item, index) => ({
          id: 'mock_sv_' + index + '_' + now,
          ...item,
          userId: 'admin',
          createTime: now - (index + 5) * 86400000,
          updateTime: now - (index + 5) * 86400000,
          status: 'active',
          responseCount: Math.floor(Math.random() * 50) + 10
        }));
        storage.set(STORAGE_KEYS.SURVEY_LIST, surveyList);
      }

      const notifications = storage.get(STORAGE_KEYS.NOTIFICATIONS);
      if (!notifications || notifications.length === 0) {
        const mockNotifications = mockData.NOTIFICATION_TEMPLATES.map((template, index) => {
          const extra = { ...template.extra };

          if (extra.lostFoundIndex !== undefined && lostFoundList[extra.lostFoundIndex]) {
            extra.lostFoundId = lostFoundList[extra.lostFoundIndex].id;
            delete extra.lostFoundIndex;
          }
          if (extra.marketIndex !== undefined && marketList[extra.marketIndex]) {
            extra.marketId = marketList[extra.marketIndex].id;
            delete extra.marketIndex;
          }
          if (extra.surveyIndex !== undefined && surveyList[extra.surveyIndex]) {
            extra.surveyId = surveyList[extra.surveyIndex].id;
            delete extra.surveyIndex;
          }

          return {
            id: 'mock_notif_' + index + '_' + now,
            type: template.type,
            subType: template.subType,
            title: template.title,
            content: template.content,
            extra,
            read: index >= 5,
            createTime: now - template.timeOffset
          };
        });
        storage.set(STORAGE_KEYS.NOTIFICATIONS, mockNotifications);
      }

      const settings = storage.get(STORAGE_KEYS.NOTIFICATION_SETTINGS);
      if (!settings) {
        storage.set(STORAGE_KEYS.NOTIFICATION_SETTINGS, {
          system: true,
          interaction: true,
          transaction: true,
          activity: true,
          survey: true
        });
      }
    } catch (e) {
      console.error('初始化mock数据失败:', e);
    }
  },

  // 初始化测试账号
  initTestAccount() {
    try {
      const users = wx.getStorageSync('users') || [];
      const testAccountExists = users.some(u => u.account === 'test');
      if (!testAccountExists) {
        users.push({
          nickName: 'test',
          account: 'test',
          password: '123456',
          avatarUrl: '',
          createTime: Date.now()
        });
        wx.setStorageSync('users', users);
      }
    } catch (e) {
      console.error('初始化测试账号失败:', e);
    }
  },

  initSystemInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      this.globalData.systemInfo = systemInfo;
      this.globalData.statusBarHeight = systemInfo.statusBarHeight || 20;
    } catch (e) {
      console.error('获取系统信息失败:', e);
    }
  },

  initTheme() {
    try {
      const result = theme.init();
      this.globalData.themeMode = result.mode;
      this.globalData.isDark = result.isDark;
    } catch (e) {
      console.error('初始化主题失败:', e);
    }
  },

  setThemeMode(mode) {
    try {
      const result = theme.setMode(mode);
      return result;
    } catch (e) {
      console.error('设置主题失败:', e);
      return { mode, resolved: mode, isDark: false };
    }
  },

  loadUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.globalData.userInfo = userInfo;
      }
    } catch (e) {
      console.error('读取用户信息失败:', e);
    }
  },

  updateUserInfo(userInfo) {
    this.globalData.userInfo = userInfo;
    try {
      wx.setStorageSync('userInfo', userInfo);
    } catch (e) {
      console.error('保存用户信息失败:', e);
    }
  },

  clearUserInfo() {
    this.globalData.userInfo = null;
    try {
      wx.removeStorageSync('userInfo');
    } catch (e) {
      console.error('清除用户信息失败:', e);
    }
  }
});
