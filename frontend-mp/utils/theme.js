const storage = require('./storage');

const THEME_KEY = 'theme_settings';

const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

const TAB_BAR_STYLES = {
  light: {
    color: '#BDC3C7',
    selectedColor: '#FF6B6B',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white'
  },
  dark: {
    color: '#6B7280',
    selectedColor: '#FF8A8A',
    backgroundColor: '#1A1D28',
    borderStyle: 'black'
  }
};

const NAV_BAR_STYLES = {
  light: {
    frontColor: '#ffffff',
    backgroundColor: '#FF6B6B'
  },
  dark: {
    frontColor: '#ffffff',
    backgroundColor: '#8B3A3A'
  }
};

function getSettings() {
  return storage.get(THEME_KEY) || { mode: THEMES.SYSTEM };
}

function saveSettings(settings) {
  storage.set(THEME_KEY, settings);
}

function getSystemTheme() {
  try {
    const res = wx.getSystemInfoSync();
    return res.theme || 'light';
  } catch (e) {
    return 'light';
  }
}

function getResolvedTheme(mode) {
  if (mode === THEMES.SYSTEM) {
    return getSystemTheme();
  }
  return mode;
}

function updateTabBarStyle(isDark) {
  const styleKey = isDark ? 'dark' : 'light';
  const style = TAB_BAR_STYLES[styleKey];
  try {
    wx.setTabBarStyle({
      color: style.color,
      selectedColor: style.selectedColor,
      backgroundColor: style.backgroundColor,
      borderStyle: style.borderStyle
    });
  } catch (e) {}
}

function updateNavigationBarStyle(isDark) {
  const styleKey = isDark ? 'dark' : 'light';
  const style = NAV_BAR_STYLES[styleKey];
  try {
    wx.setNavigationBarColor({
      frontColor: style.frontColor,
      backgroundColor: style.backgroundColor,
      animation: { duration: 300, timingFunc: 'easeIn' }
    });
  } catch (e) {}
}

function applyTheme(mode) {
  const resolved = getResolvedTheme(mode);
  const isDark = resolved === THEMES.DARK;

  const app = getApp();
  if (app && app.globalData) {
    app.globalData.themeMode = mode;
    app.globalData.isDark = isDark;
  }

  try {
    const pages = getCurrentPages();
    pages.forEach(p => {
      if (p && p.setData) {
        p.setData({ darkMode: isDark });
      }
    });
  } catch (e) {}

  updateTabBarStyle(isDark);
  updateNavigationBarStyle(isDark);

  return resolved;
}

let _themeChangeHandler = null;

function init() {
  const settings = getSettings();
  const resolved = applyTheme(settings.mode);

  if (!_themeChangeHandler) {
    try {
      _themeChangeHandler = function (result) {
        const currentSettings = getSettings();
        if (currentSettings.mode === THEMES.SYSTEM) {
          applyTheme(THEMES.SYSTEM);
        }
      };
      wx.onThemeChange(_themeChangeHandler);
    } catch (e) {}
  }

  return { mode: settings.mode, resolved, isDark: resolved === THEMES.DARK };
}

function setMode(mode) {
  if (!Object.values(THEMES).includes(mode)) {
    mode = THEMES.SYSTEM;
  }
  const settings = { mode };
  saveSettings(settings);
  const resolved = applyTheme(mode);
  return { mode, resolved, isDark: resolved === THEMES.DARK };
}

function isDarkMode() {
  const settings = getSettings();
  return getResolvedTheme(settings.mode) === THEMES.DARK;
}

module.exports = {
  THEMES,
  TAB_BAR_STYLES,
  NAV_BAR_STYLES,
  getSettings,
  saveSettings,
  getSystemTheme,
  getResolvedTheme,
  updateTabBarStyle,
  updateNavigationBarStyle,
  applyTheme,
  init,
  setMode,
  isDarkMode
};
