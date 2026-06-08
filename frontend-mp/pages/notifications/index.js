const app = getApp();
const dataService = require('../../services/data');
const util = require('../../utils/util');
const constants = require('../../config/constants');

Page({
  data: {
    darkMode: false,
    activeTab: 'all',
    tabs: [
      { value: 'all', label: '全部' },
      ...constants.NOTIFICATION_TYPES
    ],
    notifications: [],
    filteredNotifications: [],
    unreadCount: 0,
    unreadCountByType: {}
  },

  onLoad() {
    this.loadThemeState();
  },

  onShow() {
    this.loadThemeState();
    this.loadNotifications();
    this.loadUnreadCount();
  },

  onPullDownRefresh() {
    this.loadNotifications();
    this.loadUnreadCount();
    wx.stopPullDownRefresh();
  },

  loadThemeState() {
    const { isDark } = app.globalData;
    this.setData({
      darkMode: isDark || false
    });
  },

  loadNotifications() {
    const { activeTab } = this.data;
    const filters = activeTab !== 'all' ? { type: activeTab } : {};
    const notifications = dataService.getNotificationList(filters);
    
    const filteredNotifications = notifications.map(item => {
      const typeConfig = constants.NOTIFICATION_TYPES.find(t => t.value === item.type);
      return {
        ...item,
        typeLabel: typeConfig ? typeConfig.label : '',
        typeIcon: typeConfig ? typeConfig.icon : '📩',
        typeColor: typeConfig ? typeConfig.color : '#F3F4F6',
        typeIconColor: typeConfig ? typeConfig.iconColor : '#6B7280',
        timeText: util.relativeTime(item.createTime)
      };
    });

    this.setData({
      notifications,
      filteredNotifications
    });
  },

  loadUnreadCount() {
    const unreadCount = dataService.getUnreadCount();
    const unreadCountByType = dataService.getUnreadCountByType();
    this.setData({
      unreadCount,
      unreadCountByType
    });
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ activeTab: value }, () => {
      this.loadNotifications();
    });
  },

  onNotificationTap(e) {
    const { id, type, extra } = e.currentTarget.dataset;
    
    dataService.markNotificationRead(id);
    this.loadNotifications();
    this.loadUnreadCount();

    if (type === 'system' && extra && extra.announcementId) {
      util.navigateTo(`/pages/announcement-detail/index?id=${extra.announcementId}`);
    } else if (type === 'interaction' && extra) {
      if (extra.lostFoundId) {
        util.navigateTo(`/pages/lost-found-detail/index?id=${extra.lostFoundId}`);
      } else if (extra.marketId) {
        util.navigateTo(`/pages/market-detail/index?id=${extra.marketId}`);
      }
    } else if (type === 'transaction' && extra) {
      if (extra.lostFoundId) {
        util.navigateTo(`/pages/lost-found-detail/index?id=${extra.lostFoundId}`);
      } else if (extra.marketId) {
        util.navigateTo(`/pages/market-detail/index?id=${extra.marketId}`);
      }
    } else if (type === 'survey' && extra && extra.surveyId) {
      util.navigateTo(`/pages/survey-fill/index?id=${extra.surveyId}`);
    } else if (type === 'activity' && extra && extra.url) {
      util.navigateTo(extra.url);
    }
  },

  async onMarkAllRead() {
    const { activeTab } = this.data;
    const type = activeTab !== 'all' ? activeTab : '';
    
    const confirm = await util.showConfirm(
      type ? `确定要将${constants.getLabelByValue(constants.NOTIFICATION_TYPES, type)}全部标记为已读吗？` : '确定要将全部消息标记为已读吗？'
    );
    
    if (confirm) {
      dataService.markAllNotificationsRead(type);
      this.loadNotifications();
      this.loadUnreadCount();
      util.showSuccess('操作成功');
    }
  },

  onSettings() {
    util.navigateTo('/pages/notification-settings/index');
  },

  async onDelete(e) {
    const { id } = e.currentTarget.dataset;
    const confirm = await util.showConfirm('确定要删除这条消息吗？');
    
    if (confirm) {
      dataService.deleteNotification(id);
      this.loadNotifications();
      this.loadUnreadCount();
      util.showSuccess('删除成功');
    }
  }
});
