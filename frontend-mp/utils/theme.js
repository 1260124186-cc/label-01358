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

function applyTheme(mode, page) {
  const resolved = getResolvedTheme(mode);
  const isDark = resolved === THEMES.DARK;

  if (page && page.setData) {
    page.setData({ darkMode: isDark });
  }

  const pages = getCurrentPages();
  pages.forEach(p => {
    if (p && p.setData) {
      p.setData({ darkMode: isDark });
    }
  });

  try {
    wx.setPageStyle({
      style: {
        darkmode: isDark
      }
    });
  } catch (e) {}

  return resolved;
}

function init() {
  const settings = getSettings();
  const resolved = applyTheme(settings.mode);

  try {
    wx.onThemeChange((result) => {
      const currentSettings = getSettings();
      if (currentSettings.mode === THEMES.SYSTEM) {
        const isDark = result.theme === THEMES.DARK;
        const pages = getCurrentPages();
        pages.forEach(p => {
          if (p && p.setData) {
            p.setData({ darkMode: isDark });
          }
        });
      }
    });
  } catch (e) {}

  return { mode: settings.mode, resolved, isDark: resolved === THEMES.DARK };
}

function setMode(mode) {
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
