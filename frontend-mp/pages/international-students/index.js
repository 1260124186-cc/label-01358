const i18n = require('../../utils/i18n');
const util = require('../../utils/util');
const constants = require('../../config/constants');
const storage = require('../../utils/storage');

Page({
  data: {
    lang: 'zh',
    darkMode: false,
    navItems: [],
    serviceCards: [],
    quickActions: []
  },

  onLoad() {
    this.initPage();
  },

  onShow() {
    this.initPage();
  },

  initPage() {
    const lang = i18n.getLanguage();
    const app = getApp();
    const { isDark } = app.globalData;

    const navItems = this.getNavItems(lang);
    const serviceCards = this.getServiceCards(lang);
    const quickActions = this.getQuickActions(lang);

    this.setData({
      lang,
      darkMode: isDark || false,
      navItems,
      serviceCards,
      quickActions
    });
  },

  getNavItems(lang) {
    const t = (key) => i18n.t(key, lang);
    return constants.INTL_GUIDE_CATEGORIES.map(item => ({
      value: item.value,
      name: lang === 'zh' ? item.label : item.labelEn,
      icon: item.icon,
      bgColor: item.gradient,
      url: `/pages/international-guide/index?category=${item.value}`
    }));
  },

  getServiceCards(lang) {
    const t = (key) => i18n.t(key, lang);
    return [
      {
        id: 'buddy',
        title: t('intl.buddyMatch'),
        titleEn: t('intl.buddyMatchEn'),
        subtitle: lang === 'zh' ? '与本地学生结对，快速适应校园生活' : 'Pair with local students to adapt quickly',
        icon: '🤝',
        gradient: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
        url: '/pages/buddy-match/index',
        actionText: t('intl.findBuddy'),
        actionTextEn: t('intl.findBuddyEn')
      },
      {
        id: 'calendar',
        title: t('intl.culturalEvents'),
        titleEn: t('intl.culturalEventsEn'),
        subtitle: lang === 'zh' ? '探索中国文化，参与精彩校园活动' : 'Explore Chinese culture, join campus events',
        icon: '🎉',
        gradient: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
        url: '/pages/cultural-calendar/index',
        actionText: t('intl.viewEvents'),
        actionTextEn: t('intl.viewEventsEn')
      },
      {
        id: 'emergency',
        title: t('intl.emergency'),
        titleEn: t('intl.emergencyEn'),
        subtitle: lang === 'zh' ? '24小时英语紧急援助服务' : '24-hour English emergency assistance',
        icon: '🚨',
        gradient: 'linear-gradient(135deg, #FA709A 0%, #FEE140 100%)',
        url: '/pages/emergency-hotline/index',
        actionText: t('intl.callHotline'),
        actionTextEn: t('intl.callHotlineEn')
      }
    ];
  },

  getQuickActions(lang) {
    const t = (key) => i18n.t(key, lang);
    return [
      {
        id: 'visa',
        title: t('intl.visaGuide'),
        titleEn: t('intl.visaGuideEn'),
        icon: '🛂',
        color: '#3B82F6'
      },
      {
        id: 'medical',
        title: t('intl.medicalIns'),
        titleEn: t('intl.medicalInsEn'),
        icon: '🏥',
        color: '#EF4444'
      },
      {
        id: 'bank',
        title: t('intl.bankAccount'),
        titleEn: t('intl.bankAccountEn'),
        icon: '🏦',
        color: '#10B981'
      },
      {
        id: 'sim',
        title: t('intl.simCard'),
        titleEn: t('intl.simCardEn'),
        icon: '📱',
        color: '#8B5CF6'
      }
    ];
  },

  onSwitchLanguage() {
    const newLang = i18n.toggleLanguage();
    wx.vibrateShort({ type: 'light' });
    util.showToast(newLang === 'zh' ? '已切换到中文' : 'Switched to English');
    this.initPage();
  },

  onNavTap(e) {
    const { item } = e.currentTarget.dataset;
    if (item.url) {
      util.navigateTo(item.url);
    }
  },

  onServiceTap(e) {
    const { item } = e.currentTarget.dataset;
    if (item.url) {
      util.navigateTo(item.url);
    }
  },

  onQuickActionTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/international-guide/index?category=${id}`);
  },

  onShareAppMessage() {
    const lang = this.data.lang;
    const title = lang === 'zh' ? '国际生服务专区' : 'International Student Services';
    return {
      title,
      path: '/pages/international-students/index'
    };
  }
});
