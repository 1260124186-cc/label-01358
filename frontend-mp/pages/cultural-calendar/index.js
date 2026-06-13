const i18n = require('../../utils/i18n');
const util = require('../../utils/util');
const constants = require('../../config/constants');
const storage = require('../../utils/storage');

const MOCK_EVENTS = [
  {
    id: 'e1',
    title: '端午节文化体验',
    titleEn: 'Dragon Boat Festival Experience',
    category: 'festival',
    date: '2026-06-20',
    time: '14:00-17:00',
    location: '学生活动中心多功能厅',
    locationEn: 'Student Activity Center Multi-function Hall',
    organizer: '国际交流处',
    organizerEn: 'International Office',
    capacity: 50,
    registered: 42,
    status: 'registering',
    desc: '体验传统端午节文化，学习包粽子、制作香囊、了解屈原故事',
    descEn: 'Experience Dragon Boat Festival culture, learn to make zongzi, sachets, and learn about Qu Yuan',
    tags: ['免费', '传统文化']
  },
  {
    id: 'e2',
    title: '中国书法工作坊',
    titleEn: 'Chinese Calligraphy Workshop',
    category: 'workshop',
    date: '2026-06-22',
    time: '18:30-20:30',
    location: '艺术楼302教室',
    locationEn: 'Art Building Room 302',
    organizer: '学生书画协会',
    organizerEn: 'Student Calligraphy & Painting Association',
    capacity: 30,
    registered: 28,
    status: 'registering',
    desc: '由书法专业老师指导，学习毛笔书法基础，体验中华书法艺术',
    descEn: 'Guided by calligraphy teachers, learn basic brush calligraphy and experience Chinese art',
    tags: ['免费', '艺术']
  },
  {
    id: 'e3',
    title: '故宫文化之旅',
    titleEn: 'Forbidden City Cultural Tour',
    category: 'tour',
    date: '2026-06-25',
    time: '08:30-16:00',
    location: '故宫博物院',
    locationEn: 'The Palace Museum',
    organizer: '国际交流处',
    organizerEn: 'International Office',
    capacity: 40,
    registered: 40,
    status: 'full',
    desc: '专业导游讲解，游览故宫博物院，感受明清皇家建筑的宏伟',
    descEn: 'Professional guide, visit the Forbidden City, experience Ming and Qing imperial architecture',
    tags: ['需缴费', '城市游览']
  },
  {
    id: 'e4',
    title: '国际学生欢迎晚会',
    titleEn: 'International Student Welcome Party',
    category: 'social',
    date: '2026-06-28',
    time: '18:00-21:00',
    location: '大学生活动中心大礼堂',
    locationEn: 'University Activity Center Auditorium',
    organizer: '校学生会',
    organizerEn: 'Student Union',
    capacity: 200,
    registered: 156,
    status: 'registering',
    desc: '各国学生文化展示，精彩节目表演，美食自助，结识新朋友',
    descEn: 'Cultural showcase from around the world, performances, buffet dinner, make new friends',
    tags: ['免费', '社交']
  },
  {
    id: 'e5',
    title: '中外学生足球友谊赛',
    titleEn: 'International Student Football Match',
    category: 'sports',
    date: '2026-07-02',
    time: '15:00-17:30',
    location: '学校足球场',
    locationEn: 'Campus Football Field',
    organizer: '体育部',
    organizerEn: 'Sports Department',
    capacity: 60,
    registered: 35,
    status: 'registering',
    desc: '中外学生混合组队足球友谊赛，增进友谊，健康运动',
    descEn: 'Mixed international and local student friendly football match, build friendship, stay healthy',
    tags: ['免费', '运动']
  },
  {
    id: 'e6',
    title: '学术讲座：中国经济发展',
    titleEn: 'Lecture: China Economic Development',
    category: 'academic',
    date: '2026-07-05',
    time: '14:00-16:00',
    location: '图书馆报告厅',
    locationEn: 'Library Lecture Hall',
    organizer: '经济学院',
    organizerEn: 'School of Economics',
    capacity: 150,
    registered: 89,
    status: 'registering',
    desc: '知名经济学教授分享中国经济发展历程与未来趋势',
    descEn: 'Renowned economics professor shares China economic development and future trends',
    tags: ['免费', '学术']
  },
  {
    id: 'e7',
    title: '茶艺文化体验课',
    titleEn: 'Tea Ceremony Experience',
    category: 'workshop',
    date: '2026-07-08',
    time: '15:00-17:00',
    location: '国际交流中心茶室',
    locationEn: 'International Center Tea Room',
    organizer: '国际交流处',
    organizerEn: 'International Office',
    capacity: 20,
    registered: 18,
    status: 'registering',
    desc: '了解中国茶文化，学习茶艺礼仪，品尝各类名茶',
    descEn: 'Learn about Chinese tea culture, tea ceremony etiquette, and taste various famous teas',
    tags: ['免费', '传统文化']
  },
  {
    id: 'e8',
    title: '长城一日游',
    titleEn: 'Great Wall Day Trip',
    category: 'tour',
    date: '2026-07-12',
    time: '07:00-19:00',
    location: '慕田峪长城',
    locationEn: 'Mutianyu Great Wall',
    organizer: '国际交流处',
    organizerEn: 'International Office',
    capacity: 60,
    registered: 52,
    status: 'registering',
    desc: '游览万里长城慕田峪段，感受世界奇迹的壮观',
    descEn: 'Visit Mutianyu section of the Great Wall, experience the world wonder',
    tags: ['需缴费', '城市游览']
  }
];

Page({
  data: {
    lang: 'zh',
    darkMode: false,
    activeTab: 'all',
    tabs: [],
    categoryFilters: [],
    events: [],
    filteredEvents: [],
    selectedEvent: null,
    showDetail: false,
    registeredIds: []
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

    const tabs = [
      { value: 'all', label: lang === 'zh' ? '全部活动' : 'All Events', icon: '📋' },
      { value: 'upcoming', label: lang === 'zh' ? '即将开始' : 'Upcoming', icon: '⏰' },
      { value: 'registering', label: lang === 'zh' ? '报名中' : 'Registering', icon: '✅' }
    ];

    const categoryFilters = constants.INTL_EVENT_CATEGORIES.map(c => ({
      value: c.value,
      label: lang === 'zh' ? c.label : c.labelEn,
      icon: c.icon,
      color: c.color
    }));

    const registeredIds = storage.get(storage.STORAGE_KEYS.INTL_EVENT_REGISTRATIONS) || [];

    const events = this.formatEvents(MOCK_EVENTS, lang, registeredIds);
    const filteredEvents = this.filterEvents(events, this.data.activeTab, null);

    this.setData({
      lang,
      darkMode: isDark || false,
      tabs,
      categoryFilters,
      events,
      filteredEvents,
      registeredIds
    });

    wx.setNavigationBarTitle({
      title: lang === 'zh' ? '文化活动日历' : 'Cultural Events'
    });
  },

  formatEvents(events, lang, registeredIds) {
    const categoryMap = {};
    constants.INTL_EVENT_CATEGORIES.forEach(c => {
      categoryMap[c.value] = { label: c.label, labelEn: c.labelEn, icon: c.icon, color: c.color };
    });
    const statusMap = {};
    constants.INTL_EVENT_STATUS.forEach(s => {
      statusMap[s.value] = { label: s.label, labelEn: s.labelEn, color: s.color };
    });

    return events.map(e => {
      const cat = categoryMap[e.category] || {};
      const status = statusMap[e.status] || {};
      return {
        ...e,
        displayTitle: lang === 'zh' ? e.title : e.titleEn,
        displayLocation: lang === 'zh' ? e.location : e.locationEn,
        displayOrganizer: lang === 'zh' ? e.organizer : e.organizerEn,
        displayDesc: lang === 'zh' ? e.desc : e.descEn,
        categoryLabel: lang === 'zh' ? cat.label : cat.labelEn,
        categoryIcon: cat.icon,
        categoryColor: cat.color,
        statusLabel: lang === 'zh' ? status.label : status.labelEn,
        statusColor: status.color,
        isRegistered: registeredIds.includes(e.id),
        progressPercent: Math.min(100, Math.round((e.registered / e.capacity) * 100)),
        displayDate: this.formatEventDate(e.date, lang)
      };
    });
  },

  formatEventDate(dateStr, lang) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = lang === 'zh' 
      ? ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekday = weekdays[date.getDay()];
    return lang === 'zh' ? `${month}月${day}日 ${weekday}` : `${weekday}, ${month}/${day}`;
  },

  filterEvents(events, tab, category) {
    let result = [...events];
    const now = Date.now();

    if (tab === 'upcoming') {
      result = result.filter(e => new Date(e.date + 'T' + e.time.split('-')[0]).getTime() > now);
    } else if (tab === 'registering') {
      result = result.filter(e => e.status === 'registering');
    }

    if (category && category !== 'all') {
      result = result.filter(e => e.category === category);
    }

    return result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    const filteredEvents = this.filterEvents(this.data.events, value, null);
    this.setData({ activeTab: value, filteredEvents });
  },

  onCategoryFilterTap(e) {
    const { value } = e.currentTarget.dataset;
    const filteredEvents = this.filterEvents(this.data.events, 'all', value);
    this.setData({ filteredEvents });
  },

  onEventTap(e) {
    const { id } = e.currentTarget.dataset;
    const event = this.data.filteredEvents.find(ev => ev.id === id);
    if (event) {
      this.setData({ selectedEvent: event, showDetail: true });
    }
  },

  onCloseDetail() {
    this.setData({ showDetail: false, selectedEvent: null });
  },

  onRegister(e) {
    const { id } = e.currentTarget.dataset;
    const lang = this.data.lang;
    const event = this.data.events.find(ev => ev.id === id);
    if (!event) return;

    if (event.status === 'full') {
      util.showToast(lang === 'zh' ? '活动已满员' : 'Event is full');
      return;
    }

    util.showModal(
      lang === 'zh' 
        ? `确定报名参加"${event.displayTitle}"吗？`
        : `Confirm registration for "${event.displayTitle}"?`,
      lang === 'zh' ? '活动报名' : 'Event Registration'
    ).then(confirmed => {
      if (confirmed) {
        let registeredIds = storage.get(storage.STORAGE_KEYS.INTL_EVENT_REGISTRATIONS) || [];
        if (!registeredIds.includes(id)) {
          registeredIds.push(id);
          storage.set(storage.STORAGE_KEYS.INTL_EVENT_REGISTRATIONS, registeredIds);
        }
        wx.vibrateShort({ type: 'light' });
        util.showSuccess(lang === 'zh' ? '报名成功！' : 'Registration Successful!');
        this.initPage();
        this.setData({ showDetail: false, selectedEvent: null });
      }
    });
  },

  onCancelRegister(e) {
    const { id } = e.currentTarget.dataset;
    const lang = this.data.lang;
    util.showModal(
      lang === 'zh' ? '确定取消报名吗？' : 'Confirm cancel registration?',
      lang === 'zh' ? '取消报名' : 'Cancel'
    ).then(confirmed => {
      if (confirmed) {
        let registeredIds = storage.get(storage.STORAGE_KEYS.INTL_EVENT_REGISTRATIONS) || [];
        registeredIds = registeredIds.filter(rid => rid !== id);
        storage.set(storage.STORAGE_KEYS.INTL_EVENT_REGISTRATIONS, registeredIds);
        util.showToast(lang === 'zh' ? '已取消报名' : 'Registration cancelled');
        this.initPage();
        this.setData({ showDetail: false, selectedEvent: null });
      }
    });
  },

  onSwitchLanguage() {
    i18n.toggleLanguage();
    this.initPage();
  }
});
