const mockData = require('../../config/mock-data');
const util = require('../../utils/util');
const dataService = require('../../services/data');

Page({
  data: {
    weatherData: null,
    loading: true,
    darkMode: false,
    forecastMinTemp: 0,
    forecastMaxTemp: 0,
    forecastTempRange: 1
  },

  onLoad() {
    this.loadThemeState();
    this.loadData();
  },

  onShow() {
    this.loadThemeState();
  },

  loadThemeState() {
    const app = getApp();
    const { isDark } = app.globalData;
    this.setData({ darkMode: isDark || false });
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const weatherData = mockData.WEATHER_DATA;

        const temps = weatherData.forecast.reduce((acc, day) => {
          acc.mins.push(day.temperatureMin);
          acc.maxs.push(day.temperatureMax);
          return acc;
        }, { mins: [], maxs: [] });

        const forecastMinTemp = Math.min(...temps.mins);
        const forecastMaxTemp = Math.max(...temps.maxs);
        const forecastTempRange = forecastMaxTemp - forecastMinTemp || 1;

        // 同步天气预警到消息中心
        dataService.syncWeatherAlertsToNotifications();

        this.setData({
          weatherData,
          forecastMinTemp,
          forecastMaxTemp,
          forecastTempRange,
          loading: false
        });

        resolve();
      }, 300);
    });
  },

  getAlertIcon(type) {
    const icons = {
      rainstorm: '⛈️',
      heat: '🌡️',
      other: '📢'
    };
    return icons[type] || icons.other;
  },

  onWeatherCardTap() {
    util.showToast('刷新成功');
    this.loadData();
  },

  onAlertTap(e) {
    const { alert } = e.currentTarget.dataset;
    if (alert.announcementId) {
      util.navigateTo(`/pages/announcement-detail/index?id=${alert.announcementId}`);
    } else {
      wx.showModal({
        title: alert.title,
        content: alert.content,
        showCancel: false,
        confirmText: '知道了'
      });
    }
  },

  getTempBarStyle(day) {
    const { forecastMinTemp, forecastTempRange } = this.data;
    const left = ((day.temperatureMin - forecastMinTemp) / forecastTempRange) * 100;
    const width = ((day.temperatureMax - day.temperatureMin) / forecastTempRange) * 100;
    return `left: ${left}%; width: ${width}%;`;
  }
});
