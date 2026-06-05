const mockStorage = {
  _store: {},
  get: jest.fn((key) => mockStorage._store[key] || null),
  set: jest.fn((key, data) => {
    mockStorage._store[key] = data;
    return true;
  }),
  remove: jest.fn((key) => {
    delete mockStorage._store[key];
    return true;
  })
};

jest.mock('../utils/storage', () => mockStorage);

let themeChangeCallbacks = [];
const mockWx = {
  getSystemInfoSync: jest.fn(() => ({ theme: 'light', statusBarHeight: 20 })),
  onThemeChange: jest.fn((cb) => {
    themeChangeCallbacks.push(cb);
  }),
  setStorageSync: jest.fn(),
  getStorageSync: jest.fn()
};

global.wx = mockWx;

let mockAppGlobalData = { themeMode: 'system', isDark: false };
const mockApp = jest.fn(() => ({ globalData: mockAppGlobalData }));
global.getApp = mockApp;

let mockPages = [];
global.getCurrentPages = jest.fn(() => mockPages);

const theme = require('../utils/theme');

beforeEach(() => {
  mockStorage._store = {};
  mockStorage.get.mockClear();
  mockStorage.set.mockClear();
  mockWx.getSystemInfoSync.mockClear();
  mockWx.onThemeChange.mockClear();
  mockAppGlobalData = { themeMode: 'system', isDark: false };
  mockApp.mockClear();
  mockApp.mockReturnValue({ globalData: mockAppGlobalData });
  mockPages = [];
  themeChangeCallbacks = [];
});

describe('THEMES 常量', () => {
  test('应导出三种主题模式', () => {
    expect(theme.THEMES.LIGHT).toBe('light');
    expect(theme.THEMES.DARK).toBe('dark');
    expect(theme.THEMES.SYSTEM).toBe('system');
  });
});

describe('getSettings', () => {
  test('无存储时应返回默认 system 模式', () => {
    const settings = theme.getSettings();
    expect(settings).toEqual({ mode: 'system' });
  });

  test('有存储时应返回保存的设置', () => {
    mockStorage._store['theme_settings'] = { mode: 'dark' };
    const settings = theme.getSettings();
    expect(settings).toEqual({ mode: 'dark' });
  });
});

describe('saveSettings', () => {
  test('应调用 storage.set 保存设置', () => {
    theme.saveSettings({ mode: 'dark' });
    expect(mockStorage.set).toHaveBeenCalledWith('theme_settings', { mode: 'dark' });
  });
});

describe('getSystemTheme', () => {
  test('系统为深色时应返回 dark', () => {
    mockWx.getSystemInfoSync.mockReturnValue({ theme: 'dark' });
    expect(theme.getSystemTheme()).toBe('dark');
  });

  test('系统为浅色时应返回 light', () => {
    mockWx.getSystemInfoSync.mockReturnValue({ theme: 'light' });
    expect(theme.getSystemTheme()).toBe('light');
  });

  test('wx API 异常时应降级返回 light', () => {
    mockWx.getSystemInfoSync.mockImplementation(() => { throw new Error('fail'); });
    expect(theme.getSystemTheme()).toBe('light');
  });

  test('theme 属性为空时应返回 light', () => {
    mockWx.getSystemInfoSync.mockReturnValue({ });
    expect(theme.getSystemTheme()).toBe('light');
  });
});

describe('getResolvedTheme', () => {
  test('light 模式应直接返回 light', () => {
    expect(theme.getResolvedTheme('light')).toBe('light');
  });

  test('dark 模式应直接返回 dark', () => {
    expect(theme.getResolvedTheme('dark')).toBe('dark');
  });

  test('system 模式应委托给 getSystemTheme', () => {
    mockWx.getSystemInfoSync.mockReturnValue({ theme: 'dark' });
    expect(theme.getResolvedTheme('system')).toBe('dark');
    mockWx.getSystemInfoSync.mockReturnValue({ theme: 'light' });
    expect(theme.getResolvedTheme('system')).toBe('light');
  });
});

describe('applyTheme', () => {
  test('dark 模式应将所有页面的 darkMode 设为 true', () => {
    const mockPage1 = { data: {}, setData: jest.fn() };
    const mockPage2 = { data: {}, setData: jest.fn() };
    mockPages = [mockPage1, mockPage2];

    const result = theme.applyTheme('dark');
    expect(result).toBe('dark');
    expect(mockPage1.setData).toHaveBeenCalledWith({ darkMode: true });
    expect(mockPage2.setData).toHaveBeenCalledWith({ darkMode: true });
  });

  test('light 模式应将所有页面的 darkMode 设为 false', () => {
    const mockPage = { data: {}, setData: jest.fn() };
    mockPages = [mockPage];

    const result = theme.applyTheme('light');
    expect(result).toBe('light');
    expect(mockPage.setData).toHaveBeenCalledWith({ darkMode: false });
  });

  test('应更新 app.globalData', () => {
    theme.applyTheme('dark');
    expect(mockAppGlobalData.themeMode).toBe('dark');
    expect(mockAppGlobalData.isDark).toBe(true);

    theme.applyTheme('light');
    expect(mockAppGlobalData.themeMode).toBe('light');
    expect(mockAppGlobalData.isDark).toBe(false);
  });

  test('system 模式应解析为实际系统主题', () => {
    mockWx.getSystemInfoSync.mockReturnValue({ theme: 'dark' });
    const result = theme.applyTheme('system');
    expect(result).toBe('dark');
  });

  test('页面无 setData 方法时不应报错', () => {
    mockPages = [{ data: {} }];
    expect(() => theme.applyTheme('dark')).not.toThrow();
  });

  test('getCurrentPages 异常时不应报错', () => {
    global.getCurrentPages.mockImplementation(() => { throw new Error('fail'); });
    expect(() => theme.applyTheme('dark')).not.toThrow();
    global.getCurrentPages.mockImplementation(() => mockPages);
  });
});

describe('init', () => {
  test('首次初始化默认为 system 模式', () => {
    mockWx.getSystemInfoSync.mockReturnValue({ theme: 'light' });
    const result = theme.init();
    expect(result.mode).toBe('system');
    expect(result.isDark).toBe(false);
  });

  test('已保存 dark 模式时应恢复 dark', () => {
    mockStorage._store['theme_settings'] = { mode: 'dark' };
    const result = theme.init();
    expect(result.mode).toBe('dark');
    expect(result.isDark).toBe(true);
  });

  test('init 调用 wx.onThemeChange 注册回调（仅首次）', () => {
    const beforeCount = mockWx.onThemeChange.mock.calls.length;
    theme.init();
    const afterCount = mockWx.onThemeChange.mock.calls.length;
    expect(afterCount).toBeGreaterThanOrEqual(beforeCount);
  });

  test('系统主题变化时 system 模式应自动跟随', () => {
    mockStorage._store['theme_settings'] = { mode: 'system' };
    theme.init();

    mockWx.getSystemInfoSync.mockReturnValue({ theme: 'dark' });
    const mockPage = { data: {}, setData: jest.fn() };
    mockPages = [mockPage];

    theme.setMode('system');
    const handler = mockWx.onThemeChange.mock.calls[mockWx.onThemeChange.mock.calls.length - 1];
    if (handler) {
      handler[0]({ theme: 'dark' });
    }

    expect(mockPage.setData).toHaveBeenCalledWith({ darkMode: true });
  });

  test('系统主题变化时非 system 模式不应跟随', () => {
    mockStorage._store['theme_settings'] = { mode: 'light' };
    theme.init();

    const mockPage = { data: {}, setData: jest.fn() };
    mockPages = [mockPage];

    const handler = mockWx.onThemeChange.mock.calls[mockWx.onThemeChange.mock.calls.length - 1];
    if (handler) {
      handler[0]({ theme: 'dark' });
    }
    expect(mockPage.setData).not.toHaveBeenCalled();
  });

  test('多次 init 不应重复注册 onThemeChange', () => {
    const beforeCount = mockWx.onThemeChange.mock.calls.length;
    theme.init();
    const afterFirstCount = mockWx.onThemeChange.mock.calls.length;
    theme.init();
    const afterSecondCount = mockWx.onThemeChange.mock.calls.length;
    expect(afterSecondCount - beforeCount).toBeLessThanOrEqual(afterFirstCount - beforeCount + 1);
  });
});

describe('setMode', () => {
  test('设置 dark 模式应持久化并返回结果', () => {
    const result = theme.setMode('dark');
    expect(result.mode).toBe('dark');
    expect(result.resolved).toBe('dark');
    expect(result.isDark).toBe(true);
    expect(mockStorage.set).toHaveBeenCalledWith('theme_settings', { mode: 'dark' });
  });

  test('设置 light 模式应持久化并返回结果', () => {
    const result = theme.setMode('light');
    expect(result.mode).toBe('light');
    expect(result.resolved).toBe('light');
    expect(result.isDark).toBe(false);
  });

  test('设置 system 模式应解析为当前系统主题', () => {
    mockWx.getSystemInfoSync.mockReturnValue({ theme: 'light' });
    const result = theme.setMode('system');
    expect(result.mode).toBe('system');
    expect(result.resolved).toBe('light');
  });

  test('传入无效模式时应降级为 system', () => {
    const result = theme.setMode('invalid');
    expect(result.mode).toBe('system');
  });

  test('设置模式后应通知所有页面', () => {
    const mockPage = { data: {}, setData: jest.fn() };
    mockPages = [mockPage];
    theme.setMode('dark');
    expect(mockPage.setData).toHaveBeenCalledWith({ darkMode: true });
  });
});

describe('isDarkMode', () => {
  test('dark 模式下应返回 true', () => {
    mockStorage._store['theme_settings'] = { mode: 'dark' };
    expect(theme.isDarkMode()).toBe(true);
  });

  test('light 模式下应返回 false', () => {
    mockStorage._store['theme_settings'] = { mode: 'light' };
    expect(theme.isDarkMode()).toBe(false);
  });

  test('system 模式下应根据系统主题返回', () => {
    mockStorage._store['theme_settings'] = { mode: 'system' };
    mockWx.getSystemInfoSync.mockReturnValue({ theme: 'dark' });
    expect(theme.isDarkMode()).toBe(true);
    mockWx.getSystemInfoSync.mockReturnValue({ theme: 'light' });
    expect(theme.isDarkMode()).toBe(false);
  });
});
