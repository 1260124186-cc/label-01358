const mockData = require('../../config/mock-data');
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
    const detail = mockData.ANNOUNCEMENTS.find(item => item.id === id);

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
  },

  onShareAppMessage() {
    const { detail } = this.data;
    if (detail) {
      return {
        title: `【公告】${detail.title}`,
        path: `/pages/announcement-detail/index?id=${detail.id}`,
        imageUrl: detail.image || ''
      };
    }
    return {
      title: '校园公告',
      path: '/pages/broadcast/index'
    };
  },

  onShareTimeline() {
    const { detail } = this.data;
    if (detail) {
      return {
        title: `【公告】${detail.title}`,
        imageUrl: detail.image || ''
      };
    }
    return {
      title: '校园公告'
    };
  }
});
