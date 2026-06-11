const storage = require('./storage');

const THEME_KEY = 'theme_settings';

const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

const COLOR_SCHEMES = {
  coral: {
    name: '珊瑚红',
    icon: '🌊',
    primary: '#FF6B6B',
    primaryDark: '#EE5A5A',
    primaryLight: '#FFE8E8',
    secondary: '#4ECDC4',
    accent: '#FFE66D',
    tabBarSelectedColor: '#FF6B6B',
    darkPrimary: '#FF8A8A',
    darkPrimaryDark: '#FF6B6B',
    darkPrimaryLight: '#3D2020',
    darkTabBarSelectedColor: '#FF8A8A',
    darkNavBarBg: '#8B3A3A',
    navBarBg: '#FF6B6B',
    gradientPrimary: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
    gradientPrimaryDark: 'linear-gradient(135deg, #C04040 0%, #D06060 100%)'
  },
  blue: {
    name: '天际蓝',
    icon: '🔷',
    primary: '#4A90D9',
    primaryDark: '#3A7BC8',
    primaryLight: '#E3F0FC',
    secondary: '#5ED4CB',
    accent: '#A8D8FF',
    tabBarSelectedColor: '#4A90D9',
    darkPrimary: '#6BA8E8',
    darkPrimaryDark: '#4A90D9',
    darkPrimaryLight: '#1E2A3D',
    darkTabBarSelectedColor: '#6BA8E8',
    darkNavBarBg: '#2A3F5F',
    navBarBg: '#4A90D9',
    gradientPrimary: 'linear-gradient(135deg, #4A90D9 0%, #6BA8E8 100%)',
    gradientPrimaryDark: 'linear-gradient(135deg, #2A5080 0%, #3A6A9E 100%)'
  },
  green: {
    name: '翡翠绿',
    icon: '🌿',
    primary: '#2ECC71',
    primaryDark: '#27AE60',
    primaryLight: '#E8FAF0',
    secondary: '#4ECDC4',
    accent: '#A8E6CF',
    tabBarSelectedColor: '#2ECC71',
    darkPrimary: '#4ADE80',
    darkPrimaryDark: '#2ECC71',
    darkPrimaryLight: '#1A3328',
    darkTabBarSelectedColor: '#4ADE80',
    darkNavBarBg: '#1E5035',
    navBarBg: '#2ECC71',
    gradientPrimary: 'linear-gradient(135deg, #2ECC71 0%, #4ADE80 100%)',
    gradientPrimaryDark: 'linear-gradient(135deg, #1A7A42 0%, #2A9A5A 100%)'
  },
  purple: {
    name: '星空紫',
    icon: '🔮',
    primary: '#8B5CF6',
    primaryDark: '#7C3AED',
    primaryLight: '#F0E8FF',
    secondary: '#C084FC',
    accent: '#DDD6FE',
    tabBarSelectedColor: '#8B5CF6',
    darkPrimary: '#A78BFA',
    darkPrimaryDark: '#8B5CF6',
    darkPrimaryLight: '#2D1F4E',
    darkTabBarSelectedColor: '#A78BFA',
    darkNavBarBg: '#3B1F6E',
    navBarBg: '#8B5CF6',
    gradientPrimary: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
    gradientPrimaryDark: 'linear-gradient(135deg, #5B2F9E 0%, #7B4FBE 100%)'
  }
};

const DEFAULT_COLOR_SCHEME = 'coral';

function getSettings() {
  return storage.get(THEME_KEY) || { mode: THEMES.SYSTEM, colorScheme: DEFAULT_COLOR_SCHEME };
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

function getColorScheme() {
  const settings = getSettings();
  return settings.colorScheme || DEFAULT_COLOR_SCHEME;
}

function getColorSchemeConfig(colorScheme) {
  return COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES[DEFAULT_COLOR_SCHEME];
}

function updateTabBarStyle(isDark, colorScheme) {
  const cs = getColorSchemeConfig(colorScheme);
  const styleKey = isDark ? 'dark' : 'light';
  const selectedColor = isDark ? cs.darkTabBarSelectedColor : cs.tabBarSelectedColor;
  const baseStyle = {
    light: {
      color: '#BDC3C7',
      backgroundColor: '#FFFFFF',
      borderStyle: 'white'
    },
    dark: {
      color: '#6B7280',
      backgroundColor: '#1A1D28',
      borderStyle: 'black'
    }
  };
  const style = { ...baseStyle[styleKey], selectedColor };
  try {
    wx.setTabBarStyle(style);
  } catch (e) {}
}

function updateNavigationBarStyle(isDark, colorScheme) {
  const cs = getColorSchemeConfig(colorScheme);
  const backgroundColor = isDark ? cs.darkNavBarBg : cs.navBarBg;
  try {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor,
      animation: { duration: 300, timingFunc: 'easeIn' }
    });
  } catch (e) {}
}

function applyTheme(mode, colorScheme) {
  const resolved = getResolvedTheme(mode);
  const isDark = resolved === THEMES.DARK;
  const cs = colorScheme || getColorScheme();

  const app = getApp();
  if (app && app.globalData) {
    app.globalData.themeMode = mode;
    app.globalData.isDark = isDark;
    app.globalData.colorScheme = cs;
  }

  try {
    const pages = getCurrentPages();
    pages.forEach(p => {
      if (p && p.setData) {
        p.setData({ darkMode: isDark, colorScheme: cs });
      }
    });
  } catch (e) {}

  updateTabBarStyle(isDark, cs);
  updateNavigationBarStyle(isDark, cs);

  return resolved;
}

let _themeChangeHandler = null;

function init() {
  const settings = getSettings();
  const resolved = applyTheme(settings.mode, settings.colorScheme);

  if (!_themeChangeHandler) {
    try {
      _themeChangeHandler = function (result) {
        const currentSettings = getSettings();
        if (currentSettings.mode === THEMES.SYSTEM) {
          applyTheme(THEMES.SYSTEM, currentSettings.colorScheme);
        }
      };
      wx.onThemeChange(_themeChangeHandler);
    } catch (e) {}
  }

  return { mode: settings.mode, resolved, isDark: resolved === THEMES.DARK, colorScheme: settings.colorScheme || DEFAULT_COLOR_SCHEME };
}

function setMode(mode) {
  if (!Object.values(THEMES).includes(mode)) {
    mode = THEMES.SYSTEM;
  }
  const settings = getSettings();
  settings.mode = mode;
  saveSettings(settings);
  const resolved = applyTheme(mode, settings.colorScheme);
  return { mode, resolved, isDark: resolved === THEMES.DARK, colorScheme: settings.colorScheme };
}

function setColorScheme(colorScheme) {
  if (!COLOR_SCHEMES[colorScheme]) {
    colorScheme = DEFAULT_COLOR_SCHEME;
  }
  const settings = getSettings();
  settings.colorScheme = colorScheme;
  saveSettings(settings);
  const resolved = applyTheme(settings.mode, colorScheme);
  return { mode: settings.mode, resolved, isDark: resolved === THEMES.DARK, colorScheme };
}

function isDarkMode() {
  const settings = getSettings();
  return getResolvedTheme(settings.mode) === THEMES.DARK;
}

module.exports = {
  THEMES,
  COLOR_SCHEMES,
  DEFAULT_COLOR_SCHEME,
  TAB_BAR_STYLES: null,
  NAV_BAR_STYLES: null,
  getSettings,
  saveSettings,
  getSystemTheme,
  getResolvedTheme,
  getColorScheme,
  getColorSchemeConfig,
  updateTabBarStyle,
  updateNavigationBarStyle,
  applyTheme,
  init,
  setMode,
  setColorScheme,
  isDarkMode
};
