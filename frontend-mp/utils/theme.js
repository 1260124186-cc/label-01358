const storage = require('./storage');

const THEME_KEY = 'theme_settings';

const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
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
  getSettings,
  saveSettings,
  getSystemTheme,
  getResolvedTheme,
  applyTheme,
  init,
  setMode,
  isDarkMode
};
