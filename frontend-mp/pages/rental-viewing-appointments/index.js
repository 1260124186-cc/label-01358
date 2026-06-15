const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    tabs: constants.RENTAL_VIEWING_TABS,
    currentTab: 'all',
    list: [],
    loading: false
  },

  onLoad() {
    this.loadList();
  },

  onShow() {
    this.loadList();
  },

  onPullDownRefresh() {
    this.loadList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadList() {
    if (!util.checkLogin()) {
      this.setData({ list: [], loading: false });
      return Promise.resolve();
    }

    this.setData({ loading: true });

    return new Promise((resolve) => {
      const app = getApp();
      const userInfo = app.globalData.userInfo || {};

      const filters = {
        userId: userInfo.id || 'anonymous',
        status: this.data.currentTab
      };

      const list = dataService.getViewingAppointmentList(filters);

      const formattedList = list.map(item => {
        const statusInfo = constants.RENTAL_VIEWING_STATUS_MAP[item.status] || {};
        return {
          ...item,
          statusText: statusInfo.label || item.status,
          statusColor: statusInfo.color || '#999',
          timeText: `${item.date} ${item.timeSlot}`,
          createTimeText: util.relativeTime(item.createTime)
        };
      });

      this.setData({
        list: formattedList,
        loading: false
      });

      resolve();
    });
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
    this.loadList();
  },

  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo(`/pages/rental-viewing-appointment-detail/index?id=${item.id}`);
  },

  onCancelAppointment(e) {
    const { item } = e.currentTarget.dataset;
    wx.showModal({
      title: '取消预约',
      content: '确定要取消这次看房预约吗？',
      confirmText: '确定取消',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          dataService.cancelViewingAppointment(item.id, false);
          util.showSuccess('已取消预约');
          this.loadList();
        }
      }
    });
  },

  onGoToCheckIn(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo(`/pages/rental-checkin/index?id=${item.id}`);
  },

  onGoToContract() {
    util.navigateTo('/pages/rental-contract-helper/index');
  }
});
