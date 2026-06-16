const app = getApp();
const mockData = require('../../config/mock-data');
const util = require('../../utils/util');
const dataService = require('../../services/data');
const campusService = require('../../services/campusService');
const homeShortcutService = require('../../services/homeShortcutService');

const ALL_SERVICES = [
  { id: 'sos', name: 'SOS 求助', icon: '🆘', bgColor: 'linear-gradient(135deg, #FF6B6B 0%, #EE5A5A 100%)', url: '/pages/sos-settings/index' },
  { id: 'emergency-contacts', name: '紧急联系人', icon: '📞', bgColor: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)', url: '/pages/emergency-contacts/index' },
  { id: 'safety-education', name: '安全科普', icon: '🛡️', bgColor: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)', url: '/pages/safety-education/index' },
  { id: 'psychological-counseling', name: '心理咨询', icon: '💚', bgColor: 'linear-gradient(135deg, #A8E6CF 0%, #667EEA 100%)', url: '/pages/psychological-counseling/index' },
  { id: 'weather', name: '今日天气', icon: '🌤️', bgColor: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)', url: '/pages/weather/index' },
  { id: 'phonebook', name: '校园黄页', icon: '📖', bgColor: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)', url: '/pages/campus-phonebook/index' },
  { id: 'campus-card', name: '校园卡', icon: '💳', bgColor: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)', url: '/pages/campus-card/index' },
  { id: 'lost-found', name: '失物招领', icon: '🔍', bgColor: 'linear-gradient(135deg, #FFE8E8 0%, #FFCECE 100%)', url: '/pages/lost-found/index' },
  { id: 'market', name: '二手市场', icon: '🏷️', bgColor: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)', url: '/pages/market/index' },
  { id: 'rental', name: '校园租房', icon: '🏠', bgColor: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', url: '/pages/rental/index' },
  { id: 'scenery', name: '校园风光', icon: '📷', bgColor: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)', url: '/pages/scenery/index' },
  { id: 'campus-map', name: '校园地图', icon: '🗺️', bgColor: 'linear-gradient(135deg, #CFFAFE 0%, #A5F3FC 100%)', url: '/pages/campus-map/index' },
  { id: 'broadcast', name: '校园广播', icon: '📻', bgColor: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', url: '/pages/broadcast/index' },
  { id: 'study', name: '学习资料', icon: '📚', bgColor: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)', url: '/pages/study-materials/index' },
  { id: 'campus-shop', name: '校园商家', icon: '🏪', bgColor: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)', url: '/pages/campus-shop/index' },
  { id: 'canteen', name: '食堂菜谱', icon: '🍜', bgColor: 'linear-gradient(135deg, #FEF9C3 0%, #FEF08A 100%)', url: '/pages/canteen/index' },
  { id: 'takeout', name: '校园外卖', icon: '🛵', bgColor: 'linear-gradient(135deg, #FFE4E6 0%, #FECDD3 100%)', url: '/pages/takeout/index' },
  { id: 'errand', name: '跑腿服务', icon: '🏃', bgColor: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)', url: '/pages/errand/index/index' },
  { id: 'carpool', name: '拼车出行', icon: '🚗', bgColor: 'linear-gradient(135deg, #CCFBF1 0%, #99F6E4 100%)', url: '/pages/carpool/index' },
  { id: 'forum', name: '校园论坛', icon: '💬', bgColor: 'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)', url: '/pages/forum/index/index' },
  { id: 'schedule', name: '课程表', icon: '📅', bgColor: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)', url: '/pages/schedule/index' },
  { id: 'academic', name: '教务查询', icon: '📊', bgColor: 'linear-gradient(135deg, #43E97B 0%, #38F9D7 100%)', url: '/pages/academic/index' },
  { id: 'course-assistant', name: '选课助手', icon: '🎯', bgColor: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)', url: '/pages/course-assistant/index' },
  { id: 'classroom-query', name: '空教室', icon: '🏫', bgColor: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)', url: '/pages/classroom-query/index' },
  { id: 'exam-schedule', name: '考试安排', icon: '📝', bgColor: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)', url: '/pages/exam-schedule/index' },
  { id: 'low-carbon', name: '低碳打卡', icon: '🌿', bgColor: 'linear-gradient(135deg, #D1FAE5 0%, #6EE7B7 100%)', url: '/pages/low-carbon/index' },
  { id: 'international', name: '国际生专区', icon: '🌍', bgColor: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)', url: '/pages/international-students/index' },
  { id: 'graduation', name: '毕业离校', icon: '🎓', bgColor: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)', url: '/pages/graduation/index' },
  { id: 'work-study', name: '勤工助学', icon: '💼', bgColor: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)', url: '/pages/work-study/index' },
  { id: 'library', name: '图书馆', icon: '📖', bgColor: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', url: '/pages/library/index' },
  { id: 'voting', name: '校园投票', icon: '🗳️', bgColor: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)', url: '/pages/voting/list/index' },
  { id: 'tutor', name: '家教辅导', icon: '👨‍🏫', bgColor: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', url: '/pages/tutor/index' }
];

function getServiceById(id) {
  return ALL_SERVICES.find(s => s.id === id) || null;
}

Page({
  data: {
    currentCampusId: null,
    currentCampusName: '',
    currentCampusIcon: '🏫',
    showCampusSelector: false,
    announcements: [],
    weatherData: null,
    newsList: [],
    refreshing: false,
    darkMode: false,
    colorScheme: 'coral',
    fontSizeClass: 'font-size-standard',

    shortcutItems: [],
    allServicesExpanded: false,
    allServicesItems: [],
    hiddenServiceIds: [],
    recentlyUsedItems: [],

    editMode: false,
    editItems: [],
    dragItemId: null,
    dragStartIdx: null,
    dragCurrentIdx: null,

    todaySummary: {
      nextCourse: null,
      pendingErrandCount: 0,
      unreadNotificationCount: 0,
      upcomingActivities: []
    },
    weatherCourseTip: ''
  },

  onLoad() {
    this.checkOnboarding();
    this.checkCampusSelection();
    this.loadData();
    this.loadThemeState();
    this.loadFontState();
    this.loadShortcuts();
    this.loadTodaySummary();
  },

  onShow() {
    this.loadCampusInfo();
    this.loadThemeState();
    this.loadFontState();
    this.loadRecentlyUsed();
    this.loadTodaySummary();
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
    const appInstance = getApp();
    const { isDark, colorScheme } = appInstance.globalData;
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

  loadShortcuts() {
    const shortcutConfig = homeShortcutService.loadShortcuts();
    const hiddenIds = homeShortcutService.loadHiddenModules();
    const shortcutItems = shortcutConfig.shortcutIds
      .map(id => getServiceById(id))
      .filter(s => s && hiddenIds.indexOf(s.id) === -1);

    const allServicesItems = ALL_SERVICES.filter(s => hiddenIds.indexOf(s.id) === -1);

    this.setData({
      shortcutItems: shortcutItems,
      allServicesItems: allServicesItems,
      hiddenServiceIds: hiddenIds
    });
  },

  loadRecentlyUsed() {
    const recentIds = homeShortcutService.loadRecentlyUsed();
    const hiddenIds = this.data.hiddenServiceIds;
    const recentItems = recentIds
      .map(id => getServiceById(id))
      .filter(s => s && hiddenIds.indexOf(s.id) === -1);
    this.setData({ recentlyUsedItems: recentItems });
  },

  loadTodaySummary() {
    const summary = homeShortcutService.getTodaySummary();
    const courseList = require('../../utils/storage').getList(require('../../utils/storage').STORAGE_KEYS.COURSE_LIST);
    const weatherData = this.data.weatherData || mockData.WEATHER_DATA;
    const tip = homeShortcutService.getWeatherCourseTip(weatherData, courseList);
    this.setData({
      todaySummary: summary,
      weatherCourseTip: tip || ''
    });
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadData() {
    return new Promise((resolve) => {
      const announcements = mockData.ANNOUNCEMENTS.map(item => ({
        ...item,
        image: item.image || '/assets/images/default-banner.png'
      }));

      const newsList = mockData.CAMPUS_NEWS.map(item => ({
        ...item,
        timeText: util.relativeTime(item.createTime),
        image: item.image || '/assets/images/default-news.png'
      }));

      const weatherData = mockData.WEATHER_DATA;

      dataService.syncWeatherAlertsToNotifications();

      this.setData({
        announcements,
        newsList,
        weatherData,
        refreshing: false
      });

      this.loadTodaySummary();
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

  onServiceTap(e) {
    const { id } = e.currentTarget.dataset;
    const service = getServiceById(id);
    if (!service) return;
    if (this.data.editMode) return;

    homeShortcutService.addRecentlyUsed(id);

    if (service.id === 'lost-found' || service.id === 'market') {
      util.switchTab(service.url);
    } else {
      util.navigateTo(service.url);
    }
  },

  onMoreNews() {
    util.navigateTo('/pages/news-list/index');
  },

  onQuickPublish(e) {
    const { type } = e.currentTarget.dataset;
    if (!util.checkLogin()) return;
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
  },

  onToggleAllServices() {
    this.setData({
      allServicesExpanded: !this.data.allServicesExpanded
    });
  },

  onShortcutLongPress() {
    const shortcutConfig = homeShortcutService.loadShortcuts();
    const hiddenIds = homeShortcutService.loadHiddenModules();
    const editItems = shortcutConfig.shortcutIds
      .map(id => {
        const svc = getServiceById(id);
        return svc ? { ...svc, hidden: hiddenIds.indexOf(id) > -1 } : null;
      })
      .filter(Boolean);

    this.setData({
      editMode: true,
      editItems: editItems
    });
  },

  onEditItemMove(e) {
    const touch = e.touches[0];
    const query = wx.createSelectorQuery();
    query.selectAll('.edit-grid-item').boundingClientRect();
    query.exec((res) => {
      if (!res || !res[0]) return;
      const items = res[0];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (touch.clientX >= item.left && touch.clientX <= item.right &&
            touch.clientY >= item.top && touch.clientY <= item.bottom) {
          if (i !== this.data.dragCurrentIdx) {
            const newItems = [...this.data.editItems];
            const dragItem = newItems.splice(this.data.dragStartIdx, 1)[0];
            newItems.splice(i, 0, dragItem);
            this.setData({
              editItems: newItems,
              dragStartIdx: i,
              dragCurrentIdx: i
            });
          }
          break;
        }
      }
    });
  },

  onEditItemTouchStart(e) {
    const { idx } = e.currentTarget.dataset;
    this.setData({
      dragItemId: this.data.editItems[idx].id,
      dragStartIdx: idx,
      dragCurrentIdx: idx
    });
  },

  onEditItemTouchEnd() {
    this.setData({
      dragItemId: null,
      dragStartIdx: null,
      dragCurrentIdx: null
    });
  },

  onEditItemToggleHide(e) {
    const { idx } = e.currentTarget.dataset;
    const editItems = [...this.data.editItems];
    editItems[idx].hidden = !editItems[idx].hidden;
    this.setData({ editItems: editItems });
  },

  onEditDone() {
    const editItems = this.data.editItems;
    const shortcutIds = editItems.filter(item => !item.hidden).map(item => item.id);
    const hiddenIds = editItems.filter(item => item.hidden).map(item => item.id);

    homeShortcutService.saveShortcuts(shortcutIds);
    homeShortcutService.saveHiddenModules(hiddenIds);

    const shortcutItems = shortcutIds.map(id => getServiceById(id)).filter(Boolean);
    const allServicesItems = ALL_SERVICES.filter(s => hiddenIds.indexOf(s.id) === -1);

    this.setData({
      editMode: false,
      shortcutItems: shortcutItems,
      allServicesItems: allServicesItems,
      hiddenServiceIds: hiddenIds,
      editItems: []
    });

    this.loadRecentlyUsed();
    util.showToast('已保存');
  },

  onEditReset() {
    const defaultConfig = homeShortcutService.resetShortcuts();
    const shortcutItems = defaultConfig.shortcutIds.map(id => getServiceById(id)).filter(Boolean);
    homeShortcutService.saveHiddenModules([]);
    this.setData({
      editItems: defaultConfig.shortcutIds.map(id => {
        const svc = getServiceById(id);
        return svc ? { ...svc, hidden: false } : null;
      }).filter(Boolean),
      shortcutItems: shortcutItems,
      allServicesItems: ALL_SERVICES.slice(),
      hiddenServiceIds: []
    });
  },

  onAddShortcutFromAll(e) {
    const { id } = e.currentTarget.dataset;
    const shortcutConfig = homeShortcutService.loadShortcuts();
    if (shortcutConfig.shortcutIds.indexOf(id) > -1) {
      util.showToast('已在常用服务中', 'none');
      return;
    }
    if (shortcutConfig.shortcutIds.length >= 8) {
      util.showToast('最多添加8个常用服务', 'none');
      return;
    }
    shortcutConfig.shortcutIds.push(id);
    homeShortcutService.saveShortcuts(shortcutConfig.shortcutIds);
    const shortcutItems = shortcutConfig.shortcutIds.map(sid => getServiceById(sid)).filter(Boolean);
    this.setData({ shortcutItems: shortcutItems });
    util.showToast('已添加');
  },

  onSummaryTap(e) {
    const { type } = e.currentTarget.dataset;
    if (type === 'course') {
      util.navigateTo('/pages/schedule/index');
    } else if (type === 'errand') {
      util.navigateTo('/pages/errand/orders/index');
    } else if (type === 'notification') {
      util.navigateTo('/pages/notifications/index');
    } else if (type === 'activity') {
      util.navigateTo('/pages/club-activity/index');
    }
  }
});
