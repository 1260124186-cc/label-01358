const mockData = require('../config/mock-data');
const storage = require('../utils/storage');
const constants = require('../config/constants');

const createMockUtil = () => ({
  navigateTo: jest.fn(),
  switchTab: jest.fn(),
  showToast: jest.fn(),
  relativeTime: jest.fn((time) => '1小时前'),
  checkLogin: jest.fn(() => true),
  showConfirm: jest.fn(() => Promise.resolve(true)),
  showSuccess: jest.fn(),
  generateId: jest.fn(() => 'test-id-' + Math.random().toString(36).substr(2, 9))
});

let mockUtil;
let dataService;

describe('天气预警通知类型常量', () => {
  test('NOTIFICATION_SUB_TYPES 应包含 weather_alert 子类型', () => {
    const systemSubTypes = constants.NOTIFICATION_SUB_TYPES.system;
    const weatherAlertType = systemSubTypes.find(t => t.value === 'weather_alert');
    expect(weatherAlertType).toBeDefined();
    expect(weatherAlertType.label).toBe('天气预警');
  });
});

describe('天气预警同步功能', () => {
  const initDataService = () => {
    jest.resetModules();
    mockUtil = createMockUtil();
    jest.doMock('../utils/util', () => mockUtil);
    jest.doMock('../config/mock-data', () => mockData);
    try {
      storage.remove(storage.STORAGE_KEYS.NOTIFICATIONS);
    } catch (e) {}
    return require('../services/data');
  };

  beforeEach(() => {
    dataService = initDataService();
  });

  afterEach(() => {
    try {
      storage.remove(storage.STORAGE_KEYS.NOTIFICATIONS);
    } catch (e) {}
  });

  describe('convertWeatherAlertToNotification', () => {
    test('应正确将暴雨预警转换为通知', () => {
      const rainstormAlert = mockData.WEATHER_DATA.campusAlerts[0];
      const notification = dataService.convertWeatherAlertToNotification(rainstormAlert);

      expect(notification.type).toBe('system');
      expect(notification.subType).toBe('weather_alert');
      expect(notification.title).toBe(rainstormAlert.title);
      expect(notification.content).toBe(rainstormAlert.content);
      expect(notification.extra.alertId).toBe(rainstormAlert.id);
      expect(notification.extra.alertType).toBe('rainstorm');
      expect(notification.extra.level).toBe('danger');
      expect(notification.extra.announcementId).toBe(rainstormAlert.announcementId);
      expect(notification.extra.icon).toBe('⛈️');
      expect(notification.extra.typeColor).toBe('#FEE2E2');
      expect(notification.extra.typeIconColor).toBe('#EF4444');
      expect(notification.createTime).toBe(new Date(rainstormAlert.publishTime).getTime());
    });

    test('应正确将高温预警转换为通知', () => {
      const heatAlert = mockData.WEATHER_DATA.campusAlerts[1];
      const notification = dataService.convertWeatherAlertToNotification(heatAlert);

      expect(notification.type).toBe('system');
      expect(notification.subType).toBe('weather_alert');
      expect(notification.title).toBe(heatAlert.title);
      expect(notification.content).toBe(heatAlert.content);
      expect(notification.extra.alertId).toBe(heatAlert.id);
      expect(notification.extra.alertType).toBe('heat');
      expect(notification.extra.level).toBe('warning');
      expect(notification.extra.announcementId).toBe(heatAlert.announcementId);
      expect(notification.extra.icon).toBe('🌡️');
      expect(notification.extra.typeColor).toBe('#FEF3C7');
      expect(notification.extra.typeIconColor).toBe('#F59E0B');
      expect(notification.createTime).toBe(new Date(heatAlert.publishTime).getTime());
    });

    test('未知类型预警应使用默认图标和样式', () => {
      const unknownAlert = {
        id: 'alert-test',
        type: 'other',
        title: '测试预警',
        content: '测试内容',
        level: 'info',
        publishTime: '2026-06-08 10:00',
        validUntil: '2026-06-08 20:00'
      };

      const notification = dataService.convertWeatherAlertToNotification(unknownAlert);

      expect(notification.extra.icon).toBe('📢');
      expect(notification.extra.typeColor).toBe('#DBEAFE');
      expect(notification.extra.typeIconColor).toBe('#3B82F6');
    });

    test('未知等级预警应使用 info 等级样式', () => {
      const unknownLevelAlert = {
        id: 'alert-test2',
        type: 'rainstorm',
        title: '测试预警',
        content: '测试内容',
        level: 'unknown',
        publishTime: '2026-06-08 10:00',
        validUntil: '2026-06-08 20:00'
      };

      const notification = dataService.convertWeatherAlertToNotification(unknownLevelAlert);

      expect(notification.extra.typeColor).toBe('#DBEAFE');
      expect(notification.extra.typeIconColor).toBe('#3B82F6');
    });

    test('preview 应包含有效期信息', () => {
      const alert = mockData.WEATHER_DATA.campusAlerts[0];
      const notification = dataService.convertWeatherAlertToNotification(alert);

      expect(notification.extra.preview).toContain('有效期至');
      expect(notification.extra.preview).toContain(alert.validUntil);
    });
  });

  describe('syncWeatherAlertsToNotifications', () => {
    test('首次同步应创建所有天气预警通知', () => {
      const created = dataService.syncWeatherAlertsToNotifications();
      expect(created.length).toBe(2);

      const notifications = dataService.getNotificationList();
      const weatherNotifications = notifications.filter(n => n.subType === 'weather_alert');
      expect(weatherNotifications.length).toBe(2);
    });

    test('重复同步不应重复创建通知', () => {
      const firstCreated = dataService.syncWeatherAlertsToNotifications();
      expect(firstCreated.length).toBe(2);

      const secondCreated = dataService.syncWeatherAlertsToNotifications();
      expect(secondCreated.length).toBe(0);

      const notifications = dataService.getNotificationList();
      const weatherNotifications = notifications.filter(n => n.subType === 'weather_alert');
      expect(weatherNotifications.length).toBe(2);
    });

    test('创建的通知应包含正确的预警类型', () => {
      dataService.syncWeatherAlertsToNotifications();
      const notifications = dataService.getNotificationList();
      const weatherNotifications = notifications.filter(n => n.subType === 'weather_alert');

      const alertTypes = weatherNotifications.map(n => n.extra.alertType);
      expect(alertTypes).toContain('rainstorm');
      expect(alertTypes).toContain('heat');
    });

    test('创建的通知应标记为未读', () => {
      dataService.syncWeatherAlertsToNotifications();
      const notifications = dataService.getNotificationList();
      const weatherNotifications = notifications.filter(n => n.subType === 'weather_alert');

      weatherNotifications.forEach(n => {
        expect(n.read).toBe(false);
      });
    });

    test('创建的通知应包含创建时间', () => {
      dataService.syncWeatherAlertsToNotifications();
      const notifications = dataService.getNotificationList();
      const weatherNotifications = notifications.filter(n => n.subType === 'weather_alert');

      weatherNotifications.forEach(n => {
        expect(typeof n.createTime).toBe('number');
        expect(n.createTime).toBeGreaterThan(0);
      });
    });

    test('天气数据为空时应返回空数组', () => {
      jest.resetModules();
      mockUtil = createMockUtil();
      jest.doMock('../utils/util', () => mockUtil);
      jest.doMock('../config/mock-data', () => ({
        ...mockData,
        WEATHER_DATA: null
      }));
      const testDataService = require('../services/data');

      const created = testDataService.syncWeatherAlertsToNotifications();
      expect(created).toEqual([]);

      jest.resetModules();
      jest.doMock('../config/mock-data', () => mockData);
    });

    test('天气预警为空时应返回空数组', () => {
      jest.resetModules();
      mockUtil = createMockUtil();
      jest.doMock('../utils/util', () => mockUtil);
      jest.doMock('../config/mock-data', () => ({
        ...mockData,
        WEATHER_DATA: { ...mockData.WEATHER_DATA, campusAlerts: null }
      }));
      const testDataService = require('../services/data');

      const created = testDataService.syncWeatherAlertsToNotifications();
      expect(created).toEqual([]);

      jest.resetModules();
      jest.doMock('../config/mock-data', () => mockData);
    });
  });

  describe('getWeatherAlertNotifications', () => {
    test('应只返回天气预警通知', () => {
      dataService.createNotification({
        type: 'system',
        subType: 'announcement',
        title: '普通公告',
        content: '普通公告内容'
      });

      dataService.syncWeatherAlertsToNotifications();

      const weatherNotifications = dataService.getWeatherAlertNotifications();
      expect(weatherNotifications.length).toBe(2);

      weatherNotifications.forEach(n => {
        expect(n.subType).toBe('weather_alert');
      });
    });

    test('无天气预警通知时应返回空数组', () => {
      dataService.createNotification({
        type: 'system',
        subType: 'announcement',
        title: '普通公告',
        content: '普通公告内容'
      });

      const weatherNotifications = dataService.getWeatherAlertNotifications();
      expect(weatherNotifications).toEqual([]);
    });
  });
});

describe('消息中心天气预警展示', () => {
  let pageConfig;
  let instance;

  const initDataService = () => {
    jest.resetModules();
    mockUtil = createMockUtil();
    jest.doMock('../utils/util', () => mockUtil);
    jest.doMock('../config/mock-data', () => mockData);
    try {
      storage.remove(storage.STORAGE_KEYS.NOTIFICATIONS);
    } catch (e) {}
    return require('../services/data');
  };

  beforeEach(() => {
    dataService = initDataService();
    global.Page.mockClear();
  });

  afterEach(() => {
    try {
      storage.remove(storage.STORAGE_KEYS.NOTIFICATIONS);
    } catch (e) {}
  });

  test('天气预警通知应使用预警特定的图标和颜色', () => {
    require('../pages/notifications/index');
    pageConfig = global.Page.mock.calls[0][0];
    instance = {
      data: { ...pageConfig.data },
      setData: jest.fn((updates) => {
        instance.data = { ...instance.data, ...updates };
      })
    };

    dataService.syncWeatherAlertsToNotifications();
    pageConfig.loadNotifications.call(instance);

    const weatherNotifications = instance.data.filteredNotifications.filter(
      n => n.subType === 'weather_alert'
    );

    expect(weatherNotifications.length).toBe(2);

    const rainstormNotification = weatherNotifications.find(n => n.extra.alertType === 'rainstorm');
    expect(rainstormNotification.typeIcon).toBe('⛈️');
    expect(rainstormNotification.typeColor).toBe('#FEE2E2');
    expect(rainstormNotification.typeIconColor).toBe('#EF4444');

    const heatNotification = weatherNotifications.find(n => n.extra.alertType === 'heat');
    expect(heatNotification.typeIcon).toBe('🌡️');
    expect(heatNotification.typeColor).toBe('#FEF3C7');
    expect(heatNotification.typeIconColor).toBe('#F59E0B');
  });

  test('非天气预警通知应使用默认图标和颜色', () => {
    require('../pages/notifications/index');
    pageConfig = global.Page.mock.calls[0][0];
    instance = {
      data: { ...pageConfig.data },
      setData: jest.fn((updates) => {
        instance.data = { ...instance.data, ...updates };
      })
    };

    dataService.createNotification({
      type: 'system',
      subType: 'announcement',
      title: '普通公告',
      content: '普通公告内容'
    });

    pageConfig.loadNotifications.call(instance);

    const normalNotification = instance.data.filteredNotifications.find(
      n => n.subType === 'announcement'
    );

    const typeConfig = constants.NOTIFICATION_TYPES.find(t => t.value === 'system');
    expect(normalNotification.typeIcon).toBe(typeConfig.icon);
    expect(normalNotification.typeColor).toBe(typeConfig.color);
    expect(normalNotification.typeIconColor).toBe(typeConfig.iconColor);
  });

  test('点击有公告关联的天气预警应跳转到公告详情', () => {
    require('../pages/notifications/index');
    pageConfig = global.Page.mock.calls[0][0];

    dataService.syncWeatherAlertsToNotifications();
    const notifications = dataService.getNotificationList();
    const weatherAlert = notifications.find(n => n.subType === 'weather_alert' && n.extra.announcementId);

    const instance = {
      data: { ...pageConfig.data },
      setData: jest.fn(),
      loadNotifications: jest.fn(),
      loadUnreadCount: jest.fn()
    };

    pageConfig.onNotificationTap.call(instance, {
      currentTarget: {
        dataset: {
          id: weatherAlert.id,
          type: weatherAlert.type,
          subtype: weatherAlert.subType,
          extra: weatherAlert.extra
        }
      }
    });

    expect(mockUtil.navigateTo).toHaveBeenCalledWith(
      `/pages/announcement-detail/index?id=${weatherAlert.extra.announcementId}`
    );
  });

  test('点击无公告关联的天气预警应跳转到天气页面', () => {
    require('../pages/notifications/index');
    pageConfig = global.Page.mock.calls[0][0];

    dataService.createNotification({
      type: 'system',
      subType: 'weather_alert',
      title: '测试预警',
      content: '测试内容',
      extra: {
        alertId: 'test-no-announcement',
        alertType: 'rainstorm',
        level: 'danger'
      }
    });

    const notifications = dataService.getNotificationList();
    const weatherAlert = notifications.find(n => n.extra.alertId === 'test-no-announcement');

    const instance = {
      data: { ...pageConfig.data },
      setData: jest.fn(),
      loadNotifications: jest.fn(),
      loadUnreadCount: jest.fn()
    };

    pageConfig.onNotificationTap.call(instance, {
      currentTarget: {
        dataset: {
          id: weatherAlert.id,
          type: weatherAlert.type,
          subtype: weatherAlert.subType,
          extra: weatherAlert.extra
        }
      }
    });

    expect(mockUtil.navigateTo).toHaveBeenCalledWith('/pages/weather/index');
  });

  test('点击天气预警后应标记为已读', () => {
    require('../pages/notifications/index');
    pageConfig = global.Page.mock.calls[0][0];
    instance = {
      data: { ...pageConfig.data },
      setData: jest.fn((updates) => {
        instance.data = { ...instance.data, ...updates };
      }),
      loadNotifications: jest.fn(),
      loadUnreadCount: jest.fn()
    };

    dataService.syncWeatherAlertsToNotifications();
    const notifications = dataService.getNotificationList();
    const weatherAlert = notifications.find(n => n.subType === 'weather_alert');

    expect(weatherAlert.read).toBe(false);

    pageConfig.onNotificationTap.call(instance, {
      currentTarget: {
        dataset: {
          id: weatherAlert.id,
          type: weatherAlert.type,
          subtype: weatherAlert.subType,
          extra: weatherAlert.extra
        }
      }
    });

    const updatedAlert = dataService.getNotificationDetail(weatherAlert.id);
    expect(updatedAlert.read).toBe(true);
  });
});

describe('首页和天气页同步功能', () => {
  const initDataService = () => {
    jest.resetModules();
    mockUtil = createMockUtil();
    jest.doMock('../utils/util', () => mockUtil);
    jest.doMock('../config/mock-data', () => mockData);
    try {
      storage.remove(storage.STORAGE_KEYS.NOTIFICATIONS);
    } catch (e) {}
    return require('../services/data');
  };

  beforeEach(() => {
    dataService = initDataService();
    global.Page.mockClear();
  });

  afterEach(() => {
    try {
      storage.remove(storage.STORAGE_KEYS.NOTIFICATIONS);
    } catch (e) {}
  });

  test('首页加载数据时应同步天气预警到消息中心', async () => {
    require('../pages/index/index');
    const pageConfig = global.Page.mock.calls[0][0];
    const instance = {
      data: { ...pageConfig.data },
      setData: jest.fn((updates) => {
        instance.data = { ...instance.data, ...updates };
      })
    };

    await pageConfig.loadData.call(instance);

    const weatherNotifications = dataService.getWeatherAlertNotifications();
    expect(weatherNotifications.length).toBe(2);
  });

  test('天气详情页加载数据时应同步天气预警到消息中心', async () => {
    jest.useFakeTimers();
    require('../pages/weather/index');
    const pageConfig = global.Page.mock.calls[0][0];
    const instance = {
      data: { ...pageConfig.data },
      setData: jest.fn((updates) => {
        instance.data = { ...instance.data, ...updates };
      })
    };

    const promise = pageConfig.loadData.call(instance);
    jest.runAllTimers();
    await promise;

    const weatherNotifications = dataService.getWeatherAlertNotifications();
    expect(weatherNotifications.length).toBe(2);
    jest.useRealTimers();
  });

  test('多次加载数据不应重复创建预警通知', async () => {
    require('../pages/index/index');
    const pageConfig = global.Page.mock.calls[0][0];
    const instance = {
      data: { ...pageConfig.data },
      setData: jest.fn((updates) => {
        instance.data = { ...instance.data, ...updates };
      })
    };

    await pageConfig.loadData.call(instance);
    await pageConfig.loadData.call(instance);
    await pageConfig.loadData.call(instance);

    const weatherNotifications = dataService.getWeatherAlertNotifications();
    expect(weatherNotifications.length).toBe(2);
  });
});

describe('通知设置对天气预警的影响', () => {
  const initDataService = () => {
    jest.resetModules();
    mockUtil = createMockUtil();
    jest.doMock('../utils/util', () => mockUtil);
    try {
      storage.remove(storage.STORAGE_KEYS.NOTIFICATIONS);
      storage.remove(storage.STORAGE_KEYS.NOTIFICATION_SETTINGS);
    } catch (e) {}
    return require('../services/data');
  };

  beforeEach(() => {
    dataService = initDataService();
  });

  afterEach(() => {
    try {
      storage.remove(storage.STORAGE_KEYS.NOTIFICATIONS);
      storage.remove(storage.STORAGE_KEYS.NOTIFICATION_SETTINGS);
    } catch (e) {}
  });

  test('系统通知关闭时不应创建天气预警通知', () => {
    dataService.updateNotificationSettings('system', false);

    const created = dataService.syncWeatherAlertsToNotifications();
    expect(created.length).toBe(0);

    const notifications = dataService.getNotificationList();
    expect(notifications.length).toBe(0);
  });

  test('系统通知开启时应正常创建天气预警通知', () => {
    dataService.updateNotificationSettings('system', true);

    const created = dataService.syncWeatherAlertsToNotifications();
    expect(created.length).toBe(2);

    const notifications = dataService.getNotificationList();
    expect(notifications.length).toBe(2);
  });

  test('默认设置应允许创建天气预警通知', () => {
    const created = dataService.syncWeatherAlertsToNotifications();
    expect(created.length).toBe(2);
  });
});
