const app = getApp();
const mockData = require('../../config/mock-data');
const util = require('../../utils/util');
const dataService = require('../../services/data');
const campusService = require('../../services/campusService');

Page({
  data: {
    currentCampusId: null,
    currentCampusName: '',
    currentCampusIcon: '🏫',
    showCampusSelector: false,
    announcements: [],
    navItems: [
      {
        id: 'sos',
        name: 'SOS 求助',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #FF6B6B 0%, #EE5A5A 100%)',
        url: '/pages/sos-settings/index'
      },
      {
        id: 'emergency-contacts',
        name: '紧急联系人',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
        url: '/pages/emergency-contacts/index'
      },
      {
        id: 'safety-education',
        name: '安全科普',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
        url: '/pages/safety-education/index'
      },
      {
        id: 'psychological-counseling',
        name: '心理咨询',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #A8E6CF 0%, #667EEA 100%)',
        url: '/pages/psychological-counseling/index'
      },
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
        id: 'campus-card',
        name: '校园卡',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
        url: '/pages/campus-card/index'
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
        id: 'campus-map',
        name: '校园地图',
        icon: '/assets/icons/nav-scenery.png',
        bgColor: 'linear-gradient(135deg, #CFFAFE 0%, #A5F3FC 100%)',
        url: '/pages/campus-map/index'
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
        id: 'takeout',
        name: '校园外卖',
        icon: '/assets/icons/nav-market.png',
        bgColor: 'linear-gradient(135deg, #FFE4E6 0%, #FECDD3 100%)',
        url: '/pages/takeout/index'
      },
      {
        id: 'errand',
        name: '跑腿服务',
        icon: '/assets/icons/nav-market.png',
        bgColor: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
        url: '/pages/errand/index/index'
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
      },
      {
        id: 'schedule',
        name: '课程表',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
        url: '/pages/schedule/index'
      },
      {
        id: 'academic',
        name: '教务查询',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)',
        url: '/pages/academic/index'
      },
      {
        id: 'course-assistant',
        name: '选课助手',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
        url: '/pages/course-assistant/index'
      },
      {
        id: 'classroom-query',
        name: '空教室',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
        url: '/pages/classroom-query/index'
      },
      {
        id: 'exam-schedule',
        name: '考试安排',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
        url: '/pages/exam-schedule/index'
      },
      {
        id: 'low-carbon',
        name: '低碳打卡',
        icon: '/assets/icons/nav-scenery.png',
        bgColor: 'linear-gradient(135deg, #D1FAE5 0%, #6EE7B7 100%)',
        url: '/pages/low-carbon/index'
      },
      {
        id: 'international',
        name: '国际生专区',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
        url: '/pages/international-students/index'
      },
      {
        id: 'graduation',
        name: '毕业离校',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
        url: '/pages/graduation/index'
      },
      {
        id: 'work-study',
        name: '勤工助学',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
        url: '/pages/work-study/index'
      },
      {
        id: 'library',
        name: '图书馆',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        url: '/pages/library/index'
      },
      {
        id: 'voting',
        name: '校园投票',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
        url: '/pages/voting/list/index'
      },
      {
        id: 'tutor',
        name: '家教辅导',
        icon: '/assets/icons/nav-broadcast.png',
        bgColor: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
        url: '/pages/tutor/index'
      }
    ],
    weatherData: null,
    newsList: [],
    refreshing: false,
    darkMode: false,
    colorScheme: 'coral',
    fontSizeClass: 'font-size-standard'
  },

  onLoad() {
    this.checkOnboarding();
    this.checkCampusSelection();
    this.loadData();
    this.loadThemeState();
    this.loadFontState();
  },

  onShow() {
    this.loadCampusInfo();
    this.loadThemeState();
    this.loadFontState();
  },

  checkCampusSelection() {
    const hasSelected = campusService.hasSelectedCampus();
    if (!hasSelected) {
      this.setData({ showCampusSelector: true });
    } else {
      this.loadCampusInfo();
    }
  },

  loadCampusInfo() {
    const campus = app.getCurrentCampus();
    if (campus) {
      this.setData({
        currentCampusId: campus.id,
        currentCampusName: campus.name,
        currentCampusIcon: campus.icon || '🏫'
      });
    }
  },

  checkOnboarding() {
    try {
      const shown = wx.getStorageSync('onboarding_shown');
      if (!shown) {
        wx.navigateTo({ url: '/pages/onboarding/index' });
      }
    } catch (e) {}
  },

  loadThemeState() {
    const app = getApp();
    const { isDark, colorScheme } = app.globalData;
    this.setData({
      darkMode: isDark || false,
      colorScheme: colorScheme || 'coral'
    });
  },

  loadFontState() {
    const fontsizeUtil = require('../../utils/fontsize');
    const fontState = fontsizeUtil.init();
    this.setData({
      fontSizeClass: fontState.className
    });
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
    util.navigateTo(`/pages/news-detail/index?id=${item.id}`);
  },

  onMoreNews() {
    util.navigateTo('/pages/news-list/index');
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
  },

  onSOSTriggered(e) {
    const { record } = e.detail;
    if (record) {
      util.showToast('求助信号已发送！');
    }
  },

  onCampusTap() {
    this.setData({ showCampusSelector: true });
  },

  onCampusConfirm(e) {
    const { campusId } = e.detail;
    const oldCampusId = this.data.currentCampusId;

    app.switchCampus(campusId, {
      showToast: true,
      onSuccess: () => {
        this.loadCampusInfo();
        this.setData({ showCampusSelector: false });

        if (oldCampusId && oldCampusId !== campusId) {
          this.loadData();
        }
      }
    });
  },

  onCampusClose() {
    const hasSelected = campusService.hasSelectedCampus();
    if (!hasSelected) {
      util.showToast('请先选择校区', 'none');
      return;
    }
    this.setData({ showCampusSelector: false });
  }
});
