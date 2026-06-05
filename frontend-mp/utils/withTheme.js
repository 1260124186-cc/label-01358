const themeUtil = require('./theme');

function mixPage(pageOptions) {
  const originalOnShow = pageOptions.onShow;
  const originalOnLoad = pageOptions.onLoad;

  pageOptions.data = pageOptions.data || {};
  pageOptions.data.darkMode = false;

  pageOptions.onLoad = function (options) {
    this._syncTheme();
    if (originalOnLoad) {
      originalOnLoad.call(this, options);
    }
  };

  pageOptions.onShow = function () {
    this._syncTheme();
    if (originalOnShow) {
      originalOnShow.call(this);
    }
  };

  pageOptions._syncTheme = function () {
    const app = getApp();
    if (app && app.globalData) {
      const isDark = app.globalData.isDark;
      if (this.data.darkMode !== isDark) {
        this.setData({ darkMode: !!isDark });
      }
    }
  };

  return Page(pageOptions);
}

module.exports = { mixPage };
