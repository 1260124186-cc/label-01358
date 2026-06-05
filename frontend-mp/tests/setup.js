global.wx = {
  _store: {},
  getSystemInfoSync: jest.fn(() => ({
    theme: 'light',
    statusBarHeight: 20,
    pixelRatio: 2,
    windowWidth: 375,
    windowHeight: 667
  })),
  getWindowInfo: jest.fn(() => ({
    pixelRatio: 2,
    windowWidth: 375,
    windowHeight: 667
  })),
  getStorageSync: jest.fn((key) => {
    if (key === 'users') {
      return [{
        nickName: 'test',
        account: 'test',
        password: '123456',
        avatarUrl: '',
        createTime: Date.now()
      }];
    }
    return wx._store[key] !== undefined ? wx._store[key] : null;
  }),
  setStorageSync: jest.fn((key, data) => {
    wx._store[key] = data;
  }),
  removeStorageSync: jest.fn((key) => {
    delete wx._store[key];
  }),
  showToast: jest.fn(),
  showModal: jest.fn(),
  navigateTo: jest.fn(),
  navigateBack: jest.fn(),
  redirectTo: jest.fn(),
  switchTab: jest.fn(),
  stopPullDownRefresh: jest.fn(),
  onThemeChange: jest.fn(),
  setTabBarStyle: jest.fn(),
  setNavigationBarColor: jest.fn(),
  createSelectorQuery: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    fields: jest.fn().mockReturnThis(),
    exec: jest.fn((cb) => cb && cb([{ node: { getContext: () => ({}) }, width: 300, height: 150 }]))
  })),
  createCanvasContext: jest.fn(() => ({
    setFillStyle: jest.fn(),
    setStrokeStyle: jest.fn(),
    setLineWidth: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    rect: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn(),
    draw: jest.fn(),
    setFontSize: jest.fn(),
    setTextAlign: jest.fn(),
    setTextBaseline: jest.fn(),
    fillText: jest.fn()
  })),
  getImageInfo: jest.fn(),
  canvasGetImageData: jest.fn(),
  canvasPutImageData: jest.fn()
};

global.Page = jest.fn();

global.App = jest.fn();

global.getCurrentPages = jest.fn(() => []);

global.getApp = jest.fn(() => ({
  globalData: {
    userInfo: {
      account: 'test',
      nickName: 'test',
      avatarUrl: ''
    },
    systemInfo: {
      theme: 'light',
      statusBarHeight: 20,
      pixelRatio: 2
    },
    statusBarHeight: 20,
    navBarHeight: 44,
    themeMode: 'light',
    isDark: false
  }
}));

console.warn = jest.fn();
console.error = jest.fn();

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});
