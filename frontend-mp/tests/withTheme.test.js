let themeChangeCallbacks = [];
const mockWx = {
  getSystemInfoSync: jest.fn(() => ({ theme: 'light', statusBarHeight: 20 })),
  onThemeChange: jest.fn((cb) => themeChangeCallbacks.push(cb))
};

global.wx = mockWx;

let mockAppGlobalData = { themeMode: 'system', isDark: false };
global.getApp = jest.fn(() => ({ globalData: mockAppGlobalData }));
global.getCurrentPages = jest.fn(() => []);

const mockStorage = {
  _store: {},
  get: jest.fn((key) => mockStorage._store[key] || null),
  set: jest.fn((key, data) => { mockStorage._store[key] = data; return true; }),
  remove: jest.fn((key) => { delete mockStorage._store[key]; return true; })
};

jest.mock('../utils/storage', () => mockStorage);

const { mixPage } = require('../utils/withTheme');

let capturedPageOptions = null;
const originalPage = global.Page;

beforeEach(() => {
  mockStorage._store = {};
  mockAppGlobalData = { themeMode: 'system', isDark: false };
  capturedPageOptions = null;
  global.Page = jest.fn((options) => { capturedPageOptions = options; });
});

afterAll(() => {
  global.Page = originalPage;
});

describe('mixPage', () => {
  test('应注入 darkMode 数据字段', () => {
    mixPage({ data: { list: [] } });
    expect(capturedPageOptions.data.darkMode).toBe(false);
    expect(capturedPageOptions.data.list).toEqual([]);
  });

  test('应注入 _syncTheme 方法', () => {
    mixPage({ data: {} });
    expect(typeof capturedPageOptions._syncTheme).toBe('function');
  });

  test('onLoad 时应调用 _syncTheme', () => {
    const onLoad = jest.fn();
    mixPage({ data: {}, onLoad });
    capturedPageOptions.onLoad({});
    expect(onLoad).toHaveBeenCalledWith({});
  });

  test('onShow 时应调用 _syncTheme', () => {
    const onShow = jest.fn();
    mixPage({ data: {}, onShow });
    capturedPageOptions.onShow();
    expect(onShow).toHaveBeenCalled();
  });

  test('_syncTheme 应根据 globalData.isDark 设置 darkMode', () => {
    mixPage({ data: {} });
    const mockSetData = jest.fn();
    capturedPageOptions.data = { darkMode: false };
    capturedPageOptions.setData = mockSetData;

    mockAppGlobalData.isDark = true;
    capturedPageOptions._syncTheme();
    expect(mockSetData).toHaveBeenCalledWith({ darkMode: true });
  });

  test('_syncTheme 值相同时不应调用 setData', () => {
    mixPage({ data: {} });
    const mockSetData = jest.fn();
    capturedPageOptions.data = { darkMode: false };
    capturedPageOptions.setData = mockSetData;

    mockAppGlobalData.isDark = false;
    capturedPageOptions._syncTheme();
    expect(mockSetData).not.toHaveBeenCalled();
  });

  test('无 onLoad / onShow 时不应报错', () => {
    mixPage({ data: {} });
    expect(() => capturedPageOptions.onLoad({})).not.toThrow();
    expect(() => capturedPageOptions.onShow()).not.toThrow();
  });

  test('应保留其他自定义方法', () => {
    const customMethod = jest.fn();
    mixPage({ data: {}, customMethod });
    expect(typeof capturedPageOptions.customMethod).toBe('function');
  });
});
