const app = getApp();
const dataService = require('../../services/data');
const util = require('../../utils/util');
const constants = require('../../config/constants');
const fontsizeUtil = require('../../utils/fontsize');

Page({
  data: {
    darkMode: false,
    colorScheme: 'coral',
    fontSizeClass: 'font-size-standard',
    fontSize: 'standard',
    activeTab: 'all',
    viewMode: 'list',
    tabs: [
      { value: 'all', label: '全部' },
      ...constants.NOTIFICATION_TYPES
    ],
    notifications: [],
    filteredNotifications: [],
    groupedNotifications: [],
    unreadCount: 0,
    unreadCountByType: {}
  },

  onLoad(options) {
    this.loadThemeState();
    this.loadFontState();
    
    if (options && options.type) {
      this.setData({ activeTab: options.type });
    }
  },

  onShow() {
    this.loadThemeState();
    this.loadFontState();
    this.loadNotifications();
    this.loadUnreadCount();
  },

  onPullDownRefresh() {
    this.loadNotifications();
    this.loadUnreadCount();
    wx.stopPullDownRefresh();
  },

  loadThemeState() {
    const { isDark, colorScheme } = app.globalData;
    this.setData({
      darkMode: isDark || false,
      colorScheme: colorScheme || 'coral'
    });
  },

  loadFontState() {
    const fontState = fontsizeUtil.init();
    this.setData({
      fontSizeClass: fontState.className,
      fontSize: fontState.size
    });
  },

  loadNotifications() {
    const { activeTab } = this.data;
    const filters = activeTab !== 'all' ? { type: activeTab } : {};
    const notifications = dataService.getNotificationList(filters);
    
    const filteredNotifications = notifications.map(item => {
      const typeConfig = constants.NOTIFICATION_TYPES.find(t => t.value === item.type);
      let typeIcon = typeConfig ? typeConfig.icon : '📩';
      let typeColor = typeConfig ? typeConfig.color : '#F3F4F6';
      let typeIconColor = typeConfig ? typeConfig.iconColor : '#6B7280';

      if (item.subType === 'weather_alert' && item.extra) {
        if (item.extra.icon) {
          typeIcon = item.extra.icon;
        }
        if (item.extra.typeColor) {
          typeColor = item.extra.typeColor;
        }
        if (item.extra.typeIconColor) {
          typeIconColor = item.extra.typeIconColor;
        }
      }

      return {
        ...item,
        typeLabel: typeConfig ? typeConfig.label : '',
        typeIcon,
        typeColor,
        typeIconColor,
        timeText: util.relativeTime(item.createTime)
      };
    });

    const groupedNotifications = this._buildGroups(filteredNotifications);

    this.setData({
      notifications,
      filteredNotifications,
      groupedNotifications
    });
  },

  _buildGroups(notifications) {
    const groups = [
      { key: 'system', label: '系统公告', icon: '📢', items: [] },
      { key: 'interaction', label: '互动提醒', icon: '💬', items: [] },
      { key: 'transaction', label: '交易提醒', icon: '🛒', items: [] },
      { key: 'activity', label: '活动提醒', icon: '🎉', items: [] },
      { key: 'survey', label: '问卷邀请', icon: '📋', items: [] },
      { key: 'keyword', label: '订阅提醒', icon: '🔔', items: [] }
    ];

    notifications.forEach(item => {
      const group = groups.find(g => g.key === item.type);
      if (group) {
        group.items.push(item);
      } else {
        groups[groups.length - 1].items.push(item);
      }
    });

    return groups.filter(g => g.items.length > 0);
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

  onViewModeChange(e) {
    const { mode } = e.currentTarget.dataset;
    this.setData({ viewMode: mode });
  },

  onNotificationTap(e) {
    const { id, type, extra, subtype } = e.currentTarget.dataset;
    
    dataService.markNotificationRead(id);
    this.loadNotifications();
    this.loadUnreadCount();

    if (subtype === 'weather_alert' && extra) {
      if (extra.announcementId) {
        util.navigateTo(`/pages/announcement-detail/index?id=${extra.announcementId}`);
      } else {
        util.navigateTo('/pages/weather/index');
      }
    } else if (type === 'system' && extra && extra.announcementId) {
      util.navigateTo(`/pages/announcement-detail/index?id=${extra.announcementId}`);
    } else if (type === 'interaction' && extra) {
      if (extra.lostFoundId) {
        const detail = dataService.getLostFoundDetail(extra.lostFoundId);
        if (!detail) {
          util.showToast('该内容已不存在');
          return;
        }
        util.navigateTo(`/pages/lost-found-detail/index?id=${extra.lostFoundId}`);
      } else if (extra.marketId) {
        const detail = dataService.getMarketDetail(extra.marketId);
        if (!detail) {
          util.showToast('该商品已不存在');
          return;
        }
        util.navigateTo(`/pages/market-detail/index?id=${extra.marketId}`);
      }
    } else if (type === 'transaction' && extra) {
      if (extra.lostFoundId) {
        const detail = dataService.getLostFoundDetail(extra.lostFoundId);
        if (!detail) {
          util.showToast('该内容已不存在');
          return;
        }
        util.navigateTo(`/pages/lost-found-detail/index?id=${extra.lostFoundId}`);
      } else if (extra.marketId) {
        const detail = dataService.getMarketDetail(extra.marketId);
        if (!detail) {
          util.showToast('该商品已不存在');
          return;
        }
        util.navigateTo(`/pages/market-detail/index?id=${extra.marketId}`);
      }
    } else if (type === 'survey' && extra && extra.surveyId) {
      const detail = dataService.getSurveyDetail(extra.surveyId);
      if (!detail) {
        util.showToast('该问卷已不存在');
        return;
      }
      util.navigateTo(`/pages/survey-fill/index?id=${extra.surveyId}`);
    } else if (type === 'activity' && extra && extra.url) {
      util.navigateTo(extra.url);
    } else if (type === 'keyword') {
      const notificationData = e.currentTarget.dataset.data;
      if (notificationData && notificationData.moduleType && notificationData.contentId) {
        const { moduleType, contentId } = notificationData;
        if (moduleType === 'lost_found') {
          const detail = dataService.getLostFoundDetail(contentId);
          if (!detail) {
            util.showToast('该内容已不存在');
            return;
          }
          util.navigateTo(`/pages/lost-found-detail/index?id=${contentId}`);
        } else if (moduleType === 'market') {
          const detail = dataService.getMarketDetail(contentId);
          if (!detail) {
            util.showToast('该商品已不存在');
            return;
          }
          util.navigateTo(`/pages/market-detail/index?id=${contentId}`);
        } else if (moduleType === 'forum') {
          util.navigateTo(`/pages/forum/detail/index?id=${contentId}`);
        } else {
          util.showToast('暂无详情');
        }
      } else {
        util.navigateTo('/pages/keyword-subscription/index');
      }
    } else {
      util.showToast('暂无详情');
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
