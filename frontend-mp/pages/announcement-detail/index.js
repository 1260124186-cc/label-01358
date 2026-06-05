const config = require('../../config/index');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    detail: null
  },

  onLoad(options) {
    if (options.id) {
      this.loadDetail(options.id);
    }
  },

  loadDetail(id) {
    const detail = config.ANNOUNCEMENTS.find(item => item.id === id);

    if (detail) {
      this.setData({
        detail: {
          ...detail,
          timeText: util.formatTime(detail.createTime, 'YYYY-MM-DD HH:mm')
        }
      });

      wx.setNavigationBarTitle({
        title: detail.title.substring(0, 10) + (detail.title.length > 10 ? '...' : '')
      });
    }
  }
});
