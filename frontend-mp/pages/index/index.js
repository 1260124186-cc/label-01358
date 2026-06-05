const config = require('../../config/index');
const util = require('../../utils/util');

Page({
  data: {
    announcements: [],
    navItems: [
      {
        id: 'lost-found',
        name: '失物招领',
        icon: '/assets/icons/nav-lost.png',
        bgColor: 'linear-gradient(135deg, #FFE8E8 0%, #FFCECE 100%)',
        url: '/pages/lost-found/index'
      },
      {
        id: 'market',
        name: '二手市场',
        icon: '/assets/icons/nav-market.png',
        bgColor: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
        url: '/pages/market/index'
      },
      {
        id: 'scenery',
        name: '校园风光',
        icon: '/assets/icons/nav-scenery.png',
        bgColor: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
        url: '/pages/scenery/index'
      },
      {
        id: 'broadcast',
        name: '校园广播',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
        url: '/pages/broadcast/index'
      }
    ],
    newsList: [],
    refreshing: false,
    darkMode: false
  },

  onLoad() {
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
      // 加载公告
      const announcements = config.ANNOUNCEMENTS.map(item => ({
        ...item,
        image: item.image || '/assets/images/default-banner.png'
      }));

      // 加载动态
      const newsList = config.CAMPUS_NEWS.map(item => ({
        ...item,
        timeText: util.relativeTime(item.createTime),
        image: item.image || '/assets/images/default-news.png'
      }));

      this.setData({
        announcements,
        newsList,
        refreshing: false
      });

      resolve();
    });
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadData();
  },

  onAnnouncementTap(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo(`/pages/announcement-detail/index?id=${item.id}`);
  },

  onNavTap(e) {
    const { item } = e.currentTarget.dataset;
    if (item.url) {
      if (item.id === 'lost-found' || item.id === 'market') {
        util.switchTab(item.url);
      } else {
        util.navigateTo(item.url);
      }
    }
  },

  onNewsTap(e) {
    const { item } = e.currentTarget.dataset;
    util.showToast('动态详情开发中');
  },

  onMoreNews() {
    util.showToast('更多动态开发中');
  },

  onQuickPublish(e) {
    const { type } = e.currentTarget.dataset;

    // 检查登录状态
    if (!util.checkLogin()) {
      return;
    }

    if (type === 'lost') {
      util.navigateTo('/pages/lost-found-publish/index');
    } else if (type === 'market') {
      util.navigateTo('/pages/market-publish/index');
    }
  }
});
