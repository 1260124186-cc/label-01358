const app = getApp();
const dataService = require('../../services/data');
const util = require('../../utils/util');
const themeUtil = require('../../utils/theme');
const fontsizeUtil = require('../../utils/fontsize');
const campusService = require('../../services/campusService');
const keywordService = require('../../services/keywordSubscriptionService');

Page({
  data: {
    userInfo: {},
    favoritesCount: 0,
    historyCount: 0,
    unreadCount: 0,
    keywordSubscriptionCount: 0,
    darkMode: false,
    themeMode: 'system',
    colorScheme: 'coral',
    fontSize: 'standard',
    fontSizeClass: 'font-size-standard',
    colorSchemes: [],
    currentCampusId: null,
    currentCampusName: '',
    currentCampusIcon: '🏫',
    showCampusSelector: false,
    favoritesCrossCampus: true
  },

  onLoad() {
    this.loadUserInfo();
    this.loadThemeState();
    this.loadFontState();
    this.loadCampusInfo();
  },

  onShow() {
    this.loadUserInfo();
    this.loadCounts();
    this.loadThemeState();
    this.loadFontState();
    this.loadCampusInfo();
  },

  loadCampusInfo() {
    const campus = app.getCurrentCampus();
    const crossCampus = app.globalData.favoritesCrossCampus !== false;
    if (campus) {
      this.setData({
        currentCampusId: campus.id,
        currentCampusName: campus.name,
        currentCampusIcon: campus.icon || '🏫',
        favoritesCrossCampus: crossCampus
      });
    }
  },

  loadThemeState() {
    const { themeMode, isDark, colorScheme } = app.globalData;
    const schemes = Object.entries(themeUtil.COLOR_SCHEMES).map(([key, config]) => ({
      value: key,
      name: config.name,
      icon: config.icon,
      primary: config.primary,
      primaryLight: config.primaryLight
    }));
    this.setData({
      themeMode: themeMode || 'system',
      darkMode: isDark || false,
      colorScheme: colorScheme || 'coral',
      colorSchemes: schemes
    });
  },

  loadFontState() {
    const fontState = fontsizeUtil.init();
    this.setData({
      fontSize: fontState.size,
      fontSizeClass: fontState.className
    });
  },

  onThemeToggle() {
    const currentMode = this.data.themeMode;
    let newMode;
    if (currentMode === 'system') {
      newMode = themeUtil.getSystemTheme() === 'dark' ? 'light' : 'dark';
    } else {
      newMode = currentMode === 'light' ? 'dark' : 'light';
    }
    const result = app.setThemeMode(newMode);
    this.setData({
      themeMode: result.mode,
      darkMode: result.isDark
    });
  },

  onThemeModeChange(e) {
    const { mode } = e.currentTarget.dataset;
    const result = app.setThemeMode(mode);
    this.setData({
      themeMode: result.mode,
      darkMode: result.isDark
    });
  },

  onColorSchemeChange(e) {
    const { scheme } = e.currentTarget.dataset;
    const result = app.setColorScheme(scheme);
    this.setData({
      colorScheme: result.colorScheme
    });
  },

  onFontSizeChange(e) {
    const { size } = e.currentTarget.dataset;
    const result = fontsizeUtil.setFontSize(size);
    this.setData({
      fontSize: result.size,
      fontSizeClass: result.config.className
    });
  },

  loadUserInfo() {
    const userInfo = app.globalData.userInfo || {};
    this.setData({ userInfo });
  },

  loadCounts() {
    const favorites = dataService.getFavorites();
    const history = dataService.getHistory();
    const unreadCount = dataService.getUnreadCount();
    const keywordSubscriptions = dataService.getKeywordSubscriptions();

    this.setData({
      favoritesCount: favorites.length,
      historyCount: history.length,
      unreadCount,
      keywordSubscriptionCount: keywordSubscriptions.length
    });
  },

  onEditProfile() {
    if (!this.data.userInfo.nickName) {
      util.navigateTo('/pages/login/index');
    } else {
      util.navigateTo('/pages/profile-edit/index');
    }
  },

  onMenuTap(e) {
    const { type } = e.currentTarget.dataset;

    if (['favorites', 'history', 'myLostFound', 'myMarket', 'keywordSubscription'].includes(type)) {
      if (!util.checkLogin()) {
        return;
      }
    }

    switch (type) {
      case 'notifications':
        util.navigateTo('/pages/notifications/index');
        break;
      case 'favorites':
        util.navigateTo('/pages/favorites/index');
        break;
      case 'history':
        util.navigateTo('/pages/history/index');
        break;
      case 'myLostFound':
        util.navigateTo('/pages/my-lost-found/index');
        break;
      case 'myMarket':
        util.navigateTo('/pages/my-market/index');
        break;
      case 'feedback':
        util.navigateTo('/pages/feedback/index');
        break;
      case 'changelog':
        util.navigateTo('/pages/changelog/index');
        break;
      case 'admin':
        util.navigateTo('/pages/admin/index/index');
        break;
      case 'keywordSubscription':
        util.navigateTo('/pages/keyword-subscription/index');
        break;
    }
  },

  async onClearCache() {
    const confirm = await util.showConfirm('确定要清除所有缓存数据吗？这将清除您的浏览历史。');

    if (confirm) {
      dataService.clearHistory();
      this.loadCounts();
      util.showSuccess('清除成功');
    }
  },

  onAbout() {
    wx.showModal({
      title: '关于我们',
      content: '校园生活服务小程序 v2.0.0\n\n为校园师生提供便捷的失物招领、二手交易、校园资讯等服务。',
      showCancel: false,
      confirmColor: '#FF6B6B'
    });
  },

  async onLogout() {
    const confirm = await util.showConfirm('确定要退出登录吗？');

    if (confirm) {
      app.globalData.userInfo = {};
      wx.removeStorageSync('userInfo');

      dataService.clearFavorites();
      dataService.clearHistory();

      this.setData({
        userInfo: {},
        favoritesCount: 0,
        historyCount: 0
      });
      util.showSuccess('已退出登录');
    }
  },

  onCampusTap() {
    this.setData({ showCampusSelector: true });
  },

  onCampusConfirm(e) {
    const { campusId } = e.detail;

    app.switchCampus(campusId, {
      showToast: true,
      onSuccess: () => {
        this.loadCampusInfo();
        this.loadCounts();
        this.setData({ showCampusSelector: false });
      }
    });
  },

  onCampusClose() {
    this.setData({ showCampusSelector: false });
  },

  onToggleFavoritesCrossCampus(e) {
    const value = e.detail.value;
    app.globalData.favoritesCrossCampus = value;
    const storage = require('../../utils/storage');
    storage.set(storage.STORAGE_KEYS.FAVORITES_CROSS_CAMPUS, value);
    this.setData({ favoritesCrossCampus: value });
    this.loadCounts();
    util.showToast(value ? '收藏已设为跨校区可见' : '收藏已按校区隔离');
  }
});
