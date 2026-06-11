const themeUtil = require('./theme');
const fontsizeUtil = require('./fontsize');

function mixPage(pageOptions) {
  const originalOnShow = pageOptions.onShow;
  const originalOnLoad = pageOptions.onLoad;

  pageOptions.data = pageOptions.data || {};
  pageOptions.data.darkMode = false;
  pageOptions.data.colorScheme = 'coral';
  pageOptions.data.fontSizeClass = 'font-size-standard';

  pageOptions.onLoad = function (options) {
    this._syncTheme();
    this._syncFont();
    if (originalOnLoad) {
      originalOnLoad.call(this, options);
    }
  };

  pageOptions.onShow = function () {
    this._syncTheme();
    this._syncFont();
    if (originalOnShow) {
      originalOnShow.call(this);
    }
  };

  pageOptions._syncTheme = function () {
    const app = getApp();
    if (app && app.globalData) {
      const isDark = app.globalData.isDark;
      const colorScheme = app.globalData.colorScheme || 'coral';
      const updates = {};
      if (this.data.darkMode !== isDark) {
        updates.darkMode = !!isDark;
      }
      if (this.data.colorScheme !== colorScheme) {
        updates.colorScheme = colorScheme;
      }
      if (Object.keys(updates).length > 0) {
        this.setData(updates);
      }
    }
  };

  pageOptions._syncFont = function () {
    const fontState = fontsizeUtil.init();
    const className = fontState.className;
    if (this.data.fontSizeClass !== className) {
      this.setData({ fontSizeClass: className, fontSize: fontState.size });
    }
  };

  return Page(pageOptions);
}

module.exports = { mixPage };
