const app = getApp();
const constants = require('../../../config/constants');
const adminService = require('../../../services/adminService');
const campusService = require('../../../services/campusService');
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
    },
    currentCampusId: null,
    currentCampusName: '',
    currentCampusIcon: '🏫',
    managedCampuses: [],
    showCampusSelector: false,
    isSuperAdmin: false
  },

  onLoad() {
    this.loadAdminPermission();
    this.loadStats();
  },

  onShow() {
    this.loadAdminPermission();
    this.loadStats();
  },

  loadAdminPermission() {
    const userInfo = app.globalData.userInfo || {};
    const userId = userInfo.id;
    const managedCampuses = campusService.getAdminManagedCampuses(userId);
    const isSuperAdmin = managedCampuses.includes('all');
    const currentCampusId = isSuperAdmin ? campusService.getCurrentCampusId() : (managedCampuses[0] || null);
    const currentCampus = campusService.getCampusById(currentCampusId);

    this.setData({
      managedCampuses,
      isSuperAdmin,
      currentCampusId,
      currentCampusName: currentCampus ? currentCampus.name : '',
      currentCampusIcon: currentCampus ? (currentCampus.icon || '🏫') : '🏫'
    });
  },

  loadStats() {
    const { currentCampusId, isSuperAdmin } = this.data;
    const campusId = isSuperAdmin ? currentCampusId : currentCampusId;
    const stats = adminService.getStats(campusId);
    this.setData({ stats });
  },

  onCampusTap() {
    if (this.data.managedCampuses.length <= 1) {
      util.showToast('您只有一个校区管理权限');
      return;
    }
    this.setData({ showCampusSelector: true });
  },

  onCampusConfirm(e) {
    const { campusId } = e.detail;
    const { managedCampuses, isSuperAdmin } = this.data;

    if (!isSuperAdmin && !managedCampuses.includes(campusId)) {
      util.showError('您无权限管理该校区');
      return;
    }

    this.setData({ showCampusSelector: false });
    const campus = campusService.getCampusById(campusId);
    this.setData({
      currentCampusId: campusId,
      currentCampusName: campus ? campus.name : '',
      currentCampusIcon: campus ? (campus.icon || '🏫') : '🏫'
    });
    this.loadStats();
    util.showToast('已切换管理校区');
  },

  onCampusClose() {
    this.setData({ showCampusSelector: false });
  },

  onModuleTap(e) {
    const { id } = e.currentTarget.dataset;

    if (!util.checkLogin()) return;

    const { currentCampusId, isSuperAdmin, managedCampuses } = this.data;

    if (managedCampuses.length === 0) {
      util.showError('您无管理权限');
      return;
    }

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
      const params = [];
      if (currentCampusId) params.push(`campusId=${currentCampusId}`);
      if (isSuperAdmin) params.push('superAdmin=1');
      const finalUrl = params.length > 0 ? `${url}?${params.join('&')}` : url;
      util.navigateTo(finalUrl);
    }
  }
});
