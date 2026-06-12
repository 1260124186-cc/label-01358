const theme = require('./utils/theme');
const storage = require('./utils/storage');
const mockData = require('./config/mock-data');
const config = require('./config/index');
const dataService = require('./services/data');
const userService = require('./services/userService');
const security = require('./utils/security');

App({
  globalData: {
    userInfo: null,
    systemInfo: null,
    statusBarHeight: 0,
    navBarHeight: 44,
    themeMode: 'system',
    isDark: false,
    colorScheme: 'coral',
    seedDataEnabled: config.ENABLE_SEED_DATA,
    seedDataConfig: config.SEED_DATA_CONFIG
  },

  onLaunch() {
    this.initSystemInfo();
    this.loadUserInfo();
    this.initTestAccount();
    this.initTheme();
    if (config.ENABLE_SEED_DATA) {
      this.initMockData();
    }
  },

  initMockData() {
    try {
      const { STORAGE_KEYS } = storage;
      const MOCK_DATA_VERSION = 'v4';
      const now = Date.now();

      const storedVersion = wx.getStorageSync('mock_data_version');
      const needsReset = storedVersion !== MOCK_DATA_VERSION;

      const lostFoundIds = {};
      const marketIds = {};
      const surveyIds = {};
      const studyIds = {};
      const rewardIds = {};
      const shopIds = {};

      let lostFoundList = storage.get(STORAGE_KEYS.LOST_FOUND_LIST);
      if (needsReset || !lostFoundList || lostFoundList.length === 0) {
        lostFoundList = mockData.MOCK_LOST_FOUND.map((item, index) => ({
          id: 'mock_lf_' + index + '_' + now,
          ...item,
          userId: index === 0 ? 'test_user' : ('user_' + index),
          userName: item.userName || '匿名用户',
          userAvatar: item.userAvatar || '',
          createTime: now - (index + 10) * 86400000,
          updateTime: now - (index + 10) * 86400000,
          status: item.status || 'active',
          views: Math.floor(Math.random() * 100) + 10
        }));
        storage.set(STORAGE_KEYS.LOST_FOUND_LIST, lostFoundList);
      }
      lostFoundList.forEach((item, index) => {
        lostFoundIds[index] = item.id;
      });

      let marketList = storage.get(STORAGE_KEYS.MARKET_LIST);
      if (needsReset || !marketList || marketList.length === 0) {
        marketList = mockData.MOCK_MARKET_ITEMS.map((item, index) => ({
          id: 'mock_mk_' + index + '_' + now,
          ...item,
          userId: item.userId || 'test_user',
          userName: item.userName || '测试用户',
          createTime: item.createTime || (now - (index + 10) * 86400000),
          updateTime: item.updateTime || (now - (index + 10) * 86400000),
          status: item.status || 'selling',
          views: item.views !== undefined ? item.views : (Math.floor(Math.random() * 200) + 50)
        }));
        storage.set(STORAGE_KEYS.MARKET_LIST, marketList);
      }
      marketList.forEach((item, index) => {
        marketIds[index] = item.id;
      });

      let surveyList = storage.get(STORAGE_KEYS.SURVEY_LIST);
      if (needsReset || !surveyList || surveyList.length === 0) {
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
      surveyList.forEach((item, index) => {
        surveyIds[index] = item.id;
      });

      let studyMaterialsList = storage.get(STORAGE_KEYS.STUDY_MATERIALS_LIST);
      if (needsReset || !studyMaterialsList || studyMaterialsList.length === 0) {
        studyMaterialsList = mockData.MOCK_STUDY_MATERIALS.map((item, index) => ({
          id: 'mock_study_' + index + '_' + now,
          ...item,
          publisherId: 'test_user',
          createTime: now - (index + 10) * 86400000,
          updateTime: now - (index + 10) * 86400000,
          downloads: Math.floor(Math.random() * 500) + 10,
          favorites: Math.floor(Math.random() * 100) + 5,
          views: Math.floor(Math.random() * 1000) + 50
        }));
        storage.set(STORAGE_KEYS.STUDY_MATERIALS_LIST, studyMaterialsList);
      }
      studyMaterialsList.forEach((item, index) => {
        studyIds[index] = item.id;
      });

      let studyRewardsList = storage.get(STORAGE_KEYS.STUDY_REWARDS_LIST);
      if (needsReset || !studyRewardsList || studyRewardsList.length === 0) {
        studyRewardsList = mockData.MOCK_STUDY_REWARDS.map((item, index) => ({
          id: 'mock_reward_' + index + '_' + now,
          ...item,
          publisherId: index === 0 ? 'test_user' : 'other_user',
          createTime: now - (index + 5) * 86400000,
          updateTime: now - (index + 5) * 86400000,
          views: Math.floor(Math.random() * 200) + 20,
          responses: (item.responses || []).map((resp, respIndex) => ({
            ...resp,
            id: 'resp_' + index + '_' + respIndex + '_' + now,
            responderId: 'resp_user_' + respIndex,
            responderName: resp.responderName || ('同学' + (respIndex + 1)),
            createTime: now - (respIndex + 1) * 3600000
          }))
        }));
        storage.set(STORAGE_KEYS.STUDY_REWARDS_LIST, studyRewardsList);
      }
      studyRewardsList.forEach((item, index) => {
        rewardIds[index] = item.id;
      });

      let campusShopList = storage.get(STORAGE_KEYS.CAMPUS_SHOP_LIST);
      if (needsReset || !campusShopList || campusShopList.length === 0) {
        campusShopList = mockData.MOCK_CAMPUS_SHOPS.map((item, index) => ({
          id: 'mock_shop_' + index + '_' + now,
          ...item,
          views: Math.floor(Math.random() * 500) + 50,
          createTime: now - (index + 1) * 86400000,
          updateTime: now - (index + 1) * 86400000
        }));
        storage.set(STORAGE_KEYS.CAMPUS_SHOP_LIST, campusShopList);
      }
      campusShopList.forEach((item, index) => {
        shopIds[index] = item.id;
      });

      let shopReviewsMap = storage.get(STORAGE_KEYS.SHOP_REVIEWS);
      if (needsReset || !shopReviewsMap || Object.keys(shopReviewsMap).length === 0) {
        shopReviewsMap = {};
        mockData.MOCK_SHOP_REVIEWS.forEach(mockReview => {
          const shop = campusShopList[mockReview.shopIndex];
          if (shop) {
            shopReviewsMap[shop.id] = mockReview.reviews.map((r, idx) => ({
              id: 'review_' + mockReview.shopIndex + '_' + idx + '_' + now,
              shopId: shop.id,
              ...r
            }));
          }
        });
        storage.set(STORAGE_KEYS.SHOP_REVIEWS, shopReviewsMap);
      }

      let userPoints = storage.get(STORAGE_KEYS.USER_POINTS);
      if (userPoints === null || userPoints === undefined) {
        storage.set(STORAGE_KEYS.USER_POINTS, 500);
      }

      let notifications = storage.get(STORAGE_KEYS.NOTIFICATIONS);

      const hasInvalidNotifications = notifications && notifications.some(n => {
        if (n.extra) {
          if (n.extra.lostFoundId && !lostFoundList.find(l => l.id === n.extra.lostFoundId)) {
            return true;
          }
          if (n.extra.marketId && !marketList.find(m => m.id === n.extra.marketId)) {
            return true;
          }
          if (n.extra.surveyId && !surveyList.find(s => s.id === n.extra.surveyId)) {
            return true;
          }
        }
        return false;
      });

      if (needsReset || !notifications || notifications.length === 0 || hasInvalidNotifications) {
        const mockNotifications = mockData.NOTIFICATION_TEMPLATES.map((template, index) => {
          const extra = { ...template.extra };

          if (extra.lostFoundIndex !== undefined && lostFoundIds[extra.lostFoundIndex]) {
            extra.lostFoundId = lostFoundIds[extra.lostFoundIndex];
            delete extra.lostFoundIndex;
          }
          if (extra.marketIndex !== undefined && marketIds[extra.marketIndex]) {
            extra.marketId = marketIds[extra.marketIndex];
            delete extra.marketIndex;
          }
          if (extra.surveyIndex !== undefined && surveyIds[extra.surveyIndex]) {
            extra.surveyId = surveyIds[extra.surveyIndex];
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

      try {
        dataService.initClubData();
      } catch (e) {
        console.error('初始化社团数据失败:', e);
      }

      try {
        dataService.initMapData();
      } catch (e) {
        console.error('初始化地图数据失败:', e);
      }

      wx.setStorageSync('mock_data_version', MOCK_DATA_VERSION);
    } catch (e) {
      console.error('初始化mock数据失败:', e);
    }
  },

  // 初始化测试账号
  initTestAccount() {
    try {
      userService.initLegacyUsers();

      const users = userService.getUserList();
      const testAccountExists = users.some(u => u.account === 'test');
      if (!testAccountExists) {
        const hashedPassword = security.hashPassword('123456');
        const testUser = {
          id: 'test_user',
          nickName: '测试用户',
          account: 'test',
          passwordHash: hashedPassword.hash,
          passwordSalt: hashedPassword.salt,
          passwordIterations: hashedPassword.iterations,
          avatarUrl: '',
          gender: 0,
          birthday: '',
          region: [],
          signature: '这是一个测试账号',
          realNameVerified: true,
          realNameInfo: {
            realName: '张三',
            studentId: '2024001001',
            department: '计算机学院',
            status: 'approved'
          },
          creditScore: 85,
          creditLevel: userService.getCreditLevel(85),
          createTime: Date.now(),
          updateTime: Date.now(),
          lastLoginTime: Date.now(),
          status: 'active',
          publishCount: 5,
          dealCount: 3,
          isAdmin: true
        };
        users.push(testUser);
        storage.set(storage.STORAGE_KEYS.USERS, users);
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

  setColorScheme(colorScheme) {
    try {
      const result = theme.setColorScheme(colorScheme);
      return result;
    } catch (e) {
      console.error('设置主题色失败:', e);
      return { colorScheme, isDark: false };
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
