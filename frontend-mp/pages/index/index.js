const mockData = require('../../config/mock-data');
const util = require('../../utils/util');
const dataService = require('../../services/data');

Page({
  data: {
    announcements: [],
    navItems: [
      {
        id: 'weather',
        name: '今日天气',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
        url: '/pages/weather/index'
      },
      {
        id: 'phonebook',
        name: '校园黄页',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
        url: '/pages/campus-phonebook/index'
      },
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
        id: 'rental',
        name: '校园租房',
        icon: '/assets/icons/nav-market.png',
        bgColor: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
        url: '/pages/rental/index'
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
      },
      {
        id: 'study',
        name: '学习资料',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
        url: '/pages/study-materials/index'
      },
      {
        id: 'campus-shop',
        name: '校园商家',
        icon: '/assets/icons/nav-market.png',
        bgColor: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
        url: '/pages/campus-shop/index'
      },
      {
        id: 'canteen',
        name: '食堂菜谱',
        icon: '/assets/icons/nav-market.png',
        bgColor: 'linear-gradient(135deg, #FEF9C3 0%, #FEF08A 100%)',
        url: '/pages/canteen/index'
      },
      {
        id: 'errand',
        name: '跑腿服务',
        icon: '/assets/icons/nav-market.png',
        bgColor: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
        url: '/pages/errand/index'
      },
      {
        id: 'carpool',
        name: '拼车出行',
        icon: '/assets/icons/nav-market.png',
        bgColor: 'linear-gradient(135deg, #CCFBF1 0%, #99F6E4 100%)',
        url: '/pages/carpool/index'
      },
      {
        id: 'forum',
        name: '校园论坛',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)',
        url: '/pages/forum/index/index'
      }
    ],
    weatherData: null,
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
      const announcements = mockData.ANNOUNCEMENTS.map(item => ({
        ...item,
        image: item.image || '/assets/images/default-banner.png'
      }));

      // 加载动态
      const newsList = mockData.CAMPUS_NEWS.map(item => ({
        ...item,
        timeText: util.relativeTime(item.createTime),
        image: item.image || '/assets/images/default-news.png'
      }));

      // 加载天气数据
      const weatherData = mockData.WEATHER_DATA;

      // 同步天气预警到消息中心
      dataService.syncWeatherAlertsToNotifications();

      this.setData({
        announcements,
        newsList,
        weatherData,
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

    if (!util.checkLogin()) {
      return;
    }

    if (type === 'lost') {
      util.navigateTo('/pages/lost-found-publish/index');
    } else if (type === 'market') {
      util.navigateTo('/pages/market-publish/index');
    }
  },

  onSearchTap() {
    util.navigateTo('/pages/search/index');
  },

  onWeatherTap() {
    util.navigateTo('/pages/weather/index');
  },

  onQuickStudyEntry() {
    util.navigateTo('/pages/study-materials/index');
  }
});
