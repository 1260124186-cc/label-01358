const i18n = require('../../utils/i18n');
const util = require('../../utils/util');
const constants = require('../../config/constants');
const storage = require('../../utils/storage');

const MOCK_BUDDIES = [
  {
    id: 'b1',
    name: '李明',
    nameEn: 'Leo Li',
    avatar: '👨‍🎓',
    major: '计算机科学',
    majorEn: 'Computer Science',
    grade: 'junior',
    bio: '热爱编程和音乐，有两年Buddy经验，熟悉校园各类事务',
    bioEn: 'Love coding and music, 2 years Buddy experience, familiar with campus affairs',
    hobbies: ['sports', 'music', 'gaming'],
    languages: ['zh', 'en'],
    rating: 4.9,
    matchCount: 12,
    status: 'available',
    tags: ['耐心', '友好', '技术达人']
  },
  {
    id: 'b2',
    name: '王芳',
    nameEn: 'Fiona Wang',
    avatar: '👩‍🎓',
    major: '英语',
    majorEn: 'English',
    grade: 'senior',
    bio: '英语专业，曾在加拿大交换一年，擅长跨文化交流',
    bioEn: 'English major, exchanged in Canada for 1 year, good at cross-cultural communication',
    hobbies: ['reading', 'travel', 'language'],
    languages: ['zh', 'en', 'fr'],
    rating: 4.8,
    matchCount: 18,
    status: 'available',
    tags: ['开朗', '健谈', '文化达人']
  },
  {
    id: 'b3',
    name: '张伟',
    nameEn: 'David Zhang',
    avatar: '🧑‍🎓',
    major: '机械工程',
    majorEn: 'Mechanical Engineering',
    grade: 'master',
    bio: '研究生在读，喜欢运动和美食，可以带你探索城市美食',
    bioEn: 'Graduate student, love sports and food, can show you city food tour',
    hobbies: ['sports', 'food', 'photography'],
    languages: ['zh', 'en'],
    rating: 4.7,
    matchCount: 8,
    status: 'available',
    tags: ['运动', '美食', '阳光']
  },
  {
    id: 'b4',
    name: '陈思雨',
    nameEn: 'Silvia Chen',
    avatar: '👩‍🎨',
    major: '艺术设计',
    majorEn: 'Art & Design',
    grade: 'sophomore',
    bio: '艺术设计专业，擅长绘画和手工艺，喜欢组织文化活动',
    bioEn: 'Art major, good at painting and crafts, love organizing cultural events',
    hobbies: ['art', 'music', 'dance'],
    languages: ['zh', 'en', 'ja'],
    rating: 5.0,
    matchCount: 6,
    status: 'available',
    tags: ['文艺', '创意', '热情']
  },
  {
    id: 'b5',
    name: '刘浩然',
    nameEn: 'Henry Liu',
    avatar: '👨‍🔬',
    major: '生物学',
    majorEn: 'Biology',
    grade: 'freshman',
    bio: '大一新生，虽然年轻但很热心，愿意一起探索校园',
    bioEn: 'Freshman, young but enthusiastic, willing to explore campus together',
    hobbies: ['reading', 'gaming', 'cooking'],
    languages: ['zh', 'en'],
    rating: 4.6,
    matchCount: 3,
    status: 'available',
    tags: ['热心', '好学', '有趣']
  },
  {
    id: 'b6',
    name: '赵雅琪',
    nameEn: 'Yuki Zhao',
    avatar: '👩‍🏫',
    major: '中国语言文学',
    majorEn: 'Chinese Language & Literature',
    grade: 'master',
    bio: '中文系研究生，喜欢中国传统文化，可以教你中文和书法',
    bioEn: 'Chinese literature grad student, love traditional culture, can teach Chinese & calligraphy',
    hobbies: ['reading', 'art', 'language'],
    languages: ['zh', 'en', 'ko'],
    rating: 4.9,
    matchCount: 15,
    status: 'available',
    tags: ['温柔', '博学', '耐心']
  }
];

Page({
  data: {
    lang: 'zh',
    darkMode: false,
    buddies: [],
    myBuddy: null,
    selectedBuddy: null,
    showDetail: false
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

    const myBuddy = storage.get(storage.STORAGE_KEYS.INTL_MY_BUDDY) || null;
    const buddies = this.formatBuddies(MOCK_BUDDIES, lang, myBuddy);

    this.setData({
      lang,
      darkMode: isDark || false,
      buddies,
      myBuddy
    });

    wx.setNavigationBarTitle({
      title: lang === 'zh' ? 'Buddy匹配' : 'Buddy Matching'
    });
  },

  formatBuddies(buddies, lang, myBuddy) {
    const myBuddyId = myBuddy ? myBuddy.id : null;
    const gradeMap = {};
    constants.INTL_BUDDY_GRADES.forEach(g => {
      gradeMap[g.value] = { label: g.label, labelEn: g.labelEn };
    });
    const hobbyMap = {};
    constants.INTL_BUDDY_HOBBIES.forEach(h => {
      hobbyMap[h.value] = { label: h.label, labelEn: h.labelEn, icon: h.icon };
    });
    const langMap = {};
    constants.INTL_BUDDY_LANGUAGES.forEach(l => {
      langMap[l.value] = { label: l.label, labelEn: l.labelEn };
    });

    return buddies.map(b => ({
      ...b,
      displayName: lang === 'zh' ? b.name : b.nameEn,
      displayMajor: lang === 'zh' ? b.major : b.majorEn,
      displayGrade: gradeMap[b.grade] ? (lang === 'zh' ? gradeMap[b.grade].label : gradeMap[b.grade].labelEn) : b.grade,
      displayBio: lang === 'zh' ? b.bio : b.bioEn,
      isMyBuddy: b.id === myBuddyId,
      hobbyIcons: b.hobbies.slice(0, 3).map(h => hobbyMap[h] ? hobbyMap[h].icon : '⭐'),
      hobbyLabels: b.hobbies.map(h => hobbyMap[h] ? (lang === 'zh' ? hobbyMap[h].label : hobbyMap[h].labelEn) : h),
      langLabels: b.languages.map(l => langMap[l] ? (lang === 'zh' ? langMap[l].label : langMap[l].labelEn) : l)
    }));
  },

  onBuddyTap(e) {
    const { id } = e.currentTarget.dataset;
    const buddy = this.data.buddies.find(b => b.id === id);
    if (buddy) {
      this.setData({
        selectedBuddy: buddy,
        showDetail: true
      });
    }
  },

  onCloseDetail() {
    this.setData({ showDetail: false, selectedBuddy: null });
  },

  onMatchRequest(e) {
    const { id } = e.currentTarget.dataset;
    const buddy = this.data.buddies.find(b => b.id === id);
    if (!buddy) return;

    const lang = this.data.lang;
    util.showModal(
      lang === 'zh' 
        ? `确定要申请与${buddy.displayName}结对吗？`
        : `Confirm request to match with ${buddy.displayName}?`,
      lang === 'zh' ? '申请结对' : 'Match Request'
    ).then(confirmed => {
      if (confirmed) {
        storage.set(storage.STORAGE_KEYS.INTL_MY_BUDDY, {
          id: buddy.id,
          name: buddy.name,
          nameEn: buddy.nameEn,
          matchTime: Date.now()
        });
        wx.vibrateShort({ type: 'light' });
        util.showSuccess(lang === 'zh' ? '匹配成功！' : 'Match Success!');
        this.initPage();
        this.setData({ showDetail: false, selectedBuddy: null });
      }
    });
  },

  onCancelMatch() {
    const lang = this.data.lang;
    util.showModal(
      lang === 'zh' ? '确定要取消当前结对吗？' : 'Confirm cancel current match?',
      lang === 'zh' ? '取消结对' : 'Cancel Match'
    ).then(confirmed => {
      if (confirmed) {
        storage.remove(storage.STORAGE_KEYS.INTL_MY_BUDDY);
        util.showToast(lang === 'zh' ? '已取消结对' : 'Match cancelled');
        this.initPage();
      }
    });
  },

  onContactBuddy() {
    const lang = this.data.lang;
    util.showToast(lang === 'zh' ? '消息功能开发中...' : 'Messaging coming soon...');
  },

  onAutoMatch() {
    const lang = this.data.lang;
    util.showLoading(lang === 'zh' ? '智能匹配中...' : 'Matching...');
    setTimeout(() => {
      util.hideLoading();
      const available = this.data.buddies.filter(b => !b.isMyBuddy);
      if (available.length > 0) {
        const randomBuddy = available[Math.floor(Math.random() * available.length)];
        this.onBuddyTap({ currentTarget: { dataset: { id: randomBuddy.id } } });
      }
    }, 1500);
  },

  onSwitchLanguage() {
    i18n.toggleLanguage();
    this.initPage();
  }
});
