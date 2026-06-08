const dataService = require('../../services/data');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    guideType: '',
    guideDetail: null,
    loading: true,
    refreshing: false
  },

  onLoad(options) {
    const { type } = options;
    this.setData({ guideType: type || '' });
    this.loadData();
  },

  onShow() {
    this.loadThemeState();
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadThemeState() {
    const app = getApp();
    const { isDark } = app.globalData;
    this.setData({ darkMode: isDark || false });
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadData();
  },

  loadData() {
    return new Promise((resolve) => {
      if (!this.data.guideType) {
        this.setData({
          guideDetail: null,
          loading: false,
          refreshing: false
        });
        resolve();
        return;
      }

      const detail = dataService.getServiceGuideDetail(this.data.guideType);

      if (detail && detail.sections) {
        const processedSections = detail.sections.map(section => ({
          ...section,
          content: this.processContent(section.content)
        }));
        detail.sections = processedSections;
      }

      if (detail) {
        wx.setNavigationBarTitle({ title: detail.title });
      }

      this.setData({
        guideDetail: detail,
        loading: false,
        refreshing: false
      });

      resolve();
    });
  },

  processContent(content) {
    if (!content) return '';
    return content.replace(/\\n/g, '\n');
  },

  onCallPhone(e) {
    const { phone } = e.currentTarget.dataset;
    if (!phone) {
      util.showToast('电话号码无效');
      return;
    }

    dataService.makePhoneCall(phone).catch((err) => {
      if (err && err.errMsg && !err.errMsg.includes('cancel')) {
        util.showToast('拨号失败，请重试');
      }
    });
  }
});
