const constants = require('../../../config/constants');
const adminService = require('../../../services/adminService');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    modules: constants.ADMIN_MODULES,
    stats: {
      announcementCount: 0,
      newsCount: 0,
      broadcastCount: 0,
      sceneryCount: 0
    }
  },

  onLoad() {
    this.loadStats();
  },

  onShow() {
    this.loadStats();
  },

  loadStats() {
    const stats = adminService.getStats();
    this.setData({ stats });
  },

  onModuleTap(e) {
    const { id } = e.currentTarget.dataset;

    if (!util.checkLogin()) return;

    const routeMap = {
      announcement: '/pages/admin/announcement-list/index',
      news: '/pages/admin/news-list/index',
      broadcast: '/pages/admin/broadcast-list/index',
      scenery: '/pages/admin/scenery-list/index',
      graduation: '/pages/admin/graduation-verify/index',
      voting: '/pages/admin/voting-list/index'
    };

    const url = routeMap[id];
    if (url) {
      util.navigateTo(url);
    }
  }
});
