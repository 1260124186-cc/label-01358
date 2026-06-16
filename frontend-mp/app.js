const theme = require('./utils/theme');
const storage = require('./utils/storage');
const mockData = require('./config/mock-data');
const config = require('./config/index');
const dataService = require('./services/data');
const userService = require('./services/userService');
const security = require('./utils/security');
const sosService = require('./services/sosService');
const campusService = require('./services/campusService');
const constants = require('./config/constants');

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
    seedDataConfig: config.SEED_DATA_CONFIG,
    currentCampusId: null,
    currentCampus: null,
    favoritesCrossCampus: true
  },

  onLaunch() {
    this.initSystemInfo();
    campusService.initCampusData();
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
          userId: 'test_user',
          createTime: now - (index + 10) * 86400000,
          updateTime: now - (index + 10) * 86400000,
          status: 'selling',
          views: Math.floor(Math.random() * 200) + 50
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

      let mallProducts = storage.get(STORAGE_KEYS.POINT_MALL_PRODUCTS);
      if (needsReset || !mallProducts || mallProducts.length === 0) {
        mallProducts = [
          {
            id: 'coupon_001',
            name: '校园超市10元优惠券',
            description: '全场满50元可用，不可叠加',
            icon: '🏷️',
            category: 'coupon',
            type: 'coupon',
            price: 100,
            stock: 999,
            maxPerUser: 5,
            validityDays: 30,
            merchantId: 'shop_001',
            merchantName: '校园生活超市',
            tag: '热销',
            unit: '张'
          },
          {
            id: 'coupon_002',
            name: '奶茶店5元代金券',
            description: '无门槛使用，全场饮品通用',
            icon: '🧋',
            category: 'coupon',
            type: 'coupon',
            price: 50,
            stock: 999,
            maxPerUser: 10,
            validityDays: 15,
            merchantId: 'shop_002',
            merchantName: '校园奶茶店',
            unit: '张'
          },
          {
            id: 'coupon_003',
            name: '打印店8折券',
            description: '打印、复印均可使用，单次最多优惠10元',
            icon: '🖨️',
            category: 'coupon',
            type: 'coupon',
            price: 30,
            stock: 999,
            maxPerUser: 3,
            validityDays: 60,
            merchantId: 'shop_003',
            merchantName: '校园打印中心',
            unit: '张'
          },
          {
            id: 'top_001',
            name: '失物招领置顶1天',
            description: '发布的失物信息在首页置顶展示24小时',
            icon: '📌',
            category: 'top_publish',
            type: 'top_publish',
            price: 200,
            stock: 999,
            maxPerUser: 10,
            validityDays: 7,
            topDuration: 1,
            module: 'lost-found',
            unit: '次'
          },
          {
            id: 'top_002',
            name: '二手市场置顶3天',
            description: '发布的二手商品在首页置顶展示72小时',
            icon: '📌',
            category: 'top_publish',
            type: 'top_publish',
            price: 500,
            stock: 999,
            maxPerUser: 5,
            validityDays: 7,
            topDuration: 3,
            module: 'market',
            tag: '推荐',
            unit: '次'
          },
          {
            id: 'top_003',
            name: '失物招领置顶7天',
            description: '发布的失物信息在首页置顶展示7天',
            icon: '📌',
            category: 'top_publish',
            type: 'top_publish',
            price: 1000,
            stock: 999,
            maxPerUser: 3,
            validityDays: 7,
            topDuration: 7,
            module: 'lost-found',
            tag: '超值',
            unit: '次'
          },
          {
            id: 'bonus_001',
            name: '悬赏加成券+20%',
            description: '发布悬赏时使用，可提高20%的悬赏金额曝光加成',
            icon: '⚡',
            category: 'reward_bonus',
            type: 'reward_bonus',
            price: 300,
            stock: 999,
            maxPerUser: 5,
            validityDays: 30,
            bonusPercentage: 20,
            unit: '张'
          },
          {
            id: 'bonus_002',
            name: '悬赏加成券+50%',
            description: '发布悬赏时使用，可提高50%的悬赏金额曝光加成',
            icon: '⚡',
            category: 'reward_bonus',
            type: 'reward_bonus',
            price: 600,
            stock: 999,
            maxPerUser: 3,
            validityDays: 30,
            bonusPercentage: 50,
            tag: '限量',
            unit: '张'
          },
          {
            id: 'other_001',
            name: '头像框（7天）',
            description: '限时专属头像框，彰显身份',
            icon: '🎨',
            category: 'other',
            type: 'avatar_frame',
            price: 200,
            stock: 999,
            maxPerUser: 1,
            validityDays: 7,
            unit: '个'
          },
          {
            id: 'other_002',
            name: '昵称颜色（30天）',
            description: '自定义昵称颜色，炫酷十足',
            icon: '🌈',
            category: 'other',
            type: 'nickname_color',
            price: 500,
            stock: 999,
            maxPerUser: 1,
            validityDays: 30,
            unit: '个'
          }
        ];
        storage.set(STORAGE_KEYS.POINT_MALL_PRODUCTS, mallProducts);
      }

      let pointTransactions = storage.get(STORAGE_KEYS.POINT_TRANSACTIONS);
      if (needsReset || !pointTransactions || pointTransactions.length === 0) {
        pointTransactions = [
          {
            id: 'txn_' + (now - 86400000),
            userId: 'test_user',
            type: 'signin',
            points: 10,
            direction: 'in',
            balanceBefore: 490,
            balanceAfter: 500,
            description: '每日签到',
            relatedId: null,
            createTime: now - 86400000,
            expireTime: now + 365 * 86400000
          },
          {
            id: 'txn_' + (now - 2 * 86400000),
            userId: 'test_user',
            type: 'signin',
            points: 10,
            direction: 'in',
            balanceBefore: 480,
            balanceAfter: 490,
            description: '每日签到',
            relatedId: null,
            createTime: now - 2 * 86400000,
            expireTime: now + 365 * 86400000
          },
          {
            id: 'txn_' + (now - 3 * 86400000),
            userId: 'test_user',
            type: 'signin',
            points: 10,
            direction: 'in',
            balanceBefore: 470,
            balanceAfter: 480,
            description: '每日签到',
            relatedId: null,
            createTime: now - 3 * 86400000,
            expireTime: now + 365 * 86400000
          },
          {
            id: 'txn_' + (now - 5 * 86400000),
            userId: 'test_user',
            type: 'exchange',
            points: 50,
            direction: 'out',
            balanceBefore: 520,
            balanceAfter: 470,
            description: '兑换奶茶店5元代金券',
            relatedId: 'coupon_002',
            createTime: now - 5 * 86400000,
            expireTime: null
          },
          {
            id: 'txn_' + (now - 7 * 86400000),
            userId: 'test_user',
            type: 'reward_earn',
            points: 100,
            direction: 'in',
            balanceBefore: 420,
            balanceAfter: 520,
            description: '帮助他人找回遗失物品获得奖励',
            relatedId: 'mock_lf_0_' + now,
            createTime: now - 7 * 86400000,
            expireTime: now + 365 * 86400000
          },
          {
            id: 'txn_' + (now - 10 * 86400000),
            userId: 'test_user',
            type: 'first_lost',
            points: 50,
            direction: 'in',
            balanceBefore: 370,
            balanceAfter: 420,
            description: '首次发布失物招领',
            relatedId: null,
            createTime: now - 10 * 86400000,
            expireTime: now + 365 * 86400000
          },
          {
            id: 'txn_' + (now - 15 * 86400000),
            userId: 'test_user',
            type: 'real_name',
            points: 100,
            direction: 'in',
            balanceBefore: 270,
            balanceAfter: 370,
            description: '完成实名认证',
            relatedId: null,
            createTime: now - 15 * 86400000,
            expireTime: now + 365 * 86400000
          },
          {
            id: 'txn_' + (now - 20 * 86400000),
            userId: 'test_user',
            type: 'survey',
            points: 20,
            direction: 'in',
            balanceBefore: 250,
            balanceAfter: 270,
            description: '参与校园满意度问卷',
            relatedId: 'mock_sv_0_' + now,
            createTime: now - 20 * 86400000,
            expireTime: now + 365 * 86400000
          },
          {
            id: 'txn_' + (now - 25 * 86400000),
            userId: 'test_user',
            type: 'admin_grant',
            points: 200,
            direction: 'in',
            balanceBefore: 50,
            balanceAfter: 250,
            description: '管理员发放：新用户注册奖励',
            relatedId: null,
            createTime: now - 25 * 86400000,
            expireTime: now + 365 * 86400000
          },
          {
            id: 'txn_' + (now - 30 * 86400000),
            userId: 'test_user',
            type: 'volunteer',
            points: 30,
            direction: 'in',
            balanceBefore: 20,
            balanceAfter: 50,
            description: '参与图书馆志愿活动',
            relatedId: null,
            createTime: now - 30 * 86400000,
            expireTime: now + 365 * 86400000
          },
          {
            id: 'txn_' + (now - 35 * 86400000),
            userId: 'test_user',
            type: 'signin',
            points: 10,
            direction: 'in',
            balanceBefore: 10,
            balanceAfter: 20,
            description: '每日签到',
            relatedId: null,
            createTime: now - 35 * 86400000,
            expireTime: now + 365 * 86400000
          },
          {
            id: 'txn_' + (now - 36 * 86400000),
            userId: 'test_user',
            type: 'signin',
            points: 10,
            direction: 'in',
            balanceBefore: 0,
            balanceAfter: 10,
            description: '每日签到',
            relatedId: null,
            createTime: now - 36 * 86400000,
            expireTime: now + 365 * 86400000
          }
        ];
        storage.set(STORAGE_KEYS.POINT_TRANSACTIONS, pointTransactions);
      }

      let pointCompletedTasks = storage.get(STORAGE_KEYS.POINT_COMPLETED_TASKS);
      if (needsReset || !pointCompletedTasks || pointCompletedTasks.length === 0) {
        pointCompletedTasks = [
          {
            id: 'task_' + (now - 36 * 86400000),
            userId: 'test_user',
            type: 'daily_signin',
            taskType: 'daily',
            completeTime: now - 36 * 86400000,
            points: 10
          },
          {
            id: 'task_' + (now - 35 * 86400000),
            userId: 'test_user',
            type: 'daily_signin',
            taskType: 'daily',
            completeTime: now - 35 * 86400000,
            points: 10
          },
          {
            id: 'task_' + (now - 30 * 86400000),
            userId: 'test_user',
            type: 'volunteer',
            taskType: 'repeatable',
            completeTime: now - 30 * 86400000,
            points: 30
          },
          {
            id: 'task_' + (now - 25 * 86400000),
            userId: 'test_user',
            type: 'admin_grant',
            taskType: 'once',
            completeTime: now - 25 * 86400000,
            points: 200
          },
          {
            id: 'task_' + (now - 20 * 86400000),
            userId: 'test_user',
            type: 'survey',
            taskType: 'repeatable',
            completeTime: now - 20 * 86400000,
            points: 20
          },
          {
            id: 'task_' + (now - 15 * 86400000),
            userId: 'test_user',
            type: 'real_name',
            taskType: 'once',
            completeTime: now - 15 * 86400000,
            points: 100
          },
          {
            id: 'task_' + (now - 10 * 86400000),
            userId: 'test_user',
            type: 'first_lost',
            taskType: 'once',
            completeTime: now - 10 * 86400000,
            points: 50
          },
          {
            id: 'task_' + (now - 3 * 86400000),
            userId: 'test_user',
            type: 'daily_signin',
            taskType: 'daily',
            completeTime: now - 3 * 86400000,
            points: 10
          },
          {
            id: 'task_' + (now - 2 * 86400000),
            userId: 'test_user',
            type: 'daily_signin',
            taskType: 'daily',
            completeTime: now - 2 * 86400000,
            points: 10
          },
          {
            id: 'task_' + (now - 1 * 86400000),
            userId: 'test_user',
            type: 'daily_signin',
            taskType: 'daily',
            completeTime: now - 1 * 86400000,
            points: 10
          }
        ];
        storage.set(STORAGE_KEYS.POINT_COMPLETED_TASKS, pointCompletedTasks);
      }

      let pointMallOrders = storage.get(STORAGE_KEYS.POINT_MALL_ORDERS);
      if (needsReset || !pointMallOrders || pointMallOrders.length === 0) {
        pointMallOrders = [
          {
            id: 'order_' + (now - 5 * 86400000),
            userId: 'test_user',
            productId: 'coupon_002',
            productName: '奶茶店5元代金券',
            productIcon: '🧋',
            type: 'coupon',
            quantity: 1,
            totalPoints: 50,
            status: 'pending',
            couponCode: 'MT2024' + Math.floor(Math.random() * 10000),
            createTime: now - 5 * 86400000,
            expireTime: now + 10 * 86400000
          }
        ];
        storage.set(STORAGE_KEYS.POINT_MALL_ORDERS, pointMallOrders);
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

      try {
        dataService.initLowCarbonData();
      } catch (e) {
        console.error('初始化低碳数据失败:', e);
      }

      try {
        sosService.initSOSData();
      } catch (e) {
        console.error('初始化SOS数据失败:', e);
      }

      try {
        dataService.initWorkStudyData();
      } catch (e) {
        console.error('初始化勤工助学数据失败:', e);
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
          dealCount: 3
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
  },

  getCurrentCampus() {
    return this.globalData.currentCampus || campusService.getCurrentCampus();
  },

  getCurrentCampusId() {
    return this.globalData.currentCampusId || campusService.getCurrentCampusId();
  },

  getCurrentCampusName() {
    const campus = this.getCurrentCampus();
    return campus ? campus.name : '';
  },

  getCampusList() {
    return campusService.getCampusList();
  },

  switchCampus(campusId, options = {}) {
    const result = campusService.switchCampus(campusId, {
      ...options,
      onSuccess: (res) => {
        this.globalData.currentCampusId = res.campus.id;
        this.globalData.currentCampus = res.campus;
        if (typeof options.onSuccess === 'function') {
          options.onSuccess(res);
        }
      }
    });
    return result;
  }
});
