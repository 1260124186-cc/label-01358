const LANG_KEY = 'app_language';
const DEFAULT_LANG = 'zh';

const translations = {
  zh: {
    common: {
      loading: '加载中...',
      confirm: '确定',
      cancel: '取消',
      back: '返回',
      more: '更多',
      search: '搜索',
      noData: '暂无数据',
      error: '出错了',
      success: '成功'
    },
    intl: {
      title: '国际生服务专区',
      subtitle: 'International Student Services',
      switchLang: 'Switch to English',
      welcome: '欢迎来到国际生服务专区',
      welcomeEn: 'Welcome to International Student Services',
      quickGuide: '生活指南',
      quickGuideEn: 'Living Guide',
      visaGuide: '签证居留',
      visaGuideEn: 'Visa & Residence',
      medicalIns: '医疗保险',
      medicalInsEn: 'Medical Insurance',
      bankAccount: '银行开户',
      bankAccountEn: 'Bank Account',
      simCard: 'SIM卡办理',
      simCardEn: 'SIM Card',
      buddyMatch: 'Buddy结对',
      buddyMatchEn: 'Buddy Program',
      culturalEvents: '文化活动日历',
      culturalEventsEn: 'Cultural Events',
      emergency: '紧急热线',
      emergencyEn: 'Emergency Hotline',
      emergencyEnglish: '英语紧急热线',
      emergencyEnglishEn: 'English Emergency Line',
      findBuddy: '寻找我的Buddy',
      findBuddyEn: 'Find My Buddy',
      viewEvents: '查看活动日历',
      viewEventsEn: 'View Event Calendar',
      callHotline: '拨打紧急热线',
      callHotlineEn: 'Call Emergency Hotline',
      language: '语言',
      languageZh: '中文',
      languageEn: 'English'
    },
    guide: {
      title: '生活指南',
      titleEn: 'Living Guide',
      visa: '签证与居留许可',
      visaEn: 'Visa & Residence Permit',
      visaDesc: '学生签证申请、居留许可办理流程与材料清单',
      visaDescEn: 'Student visa application, residence permit process and documents',
      medical: '医疗保险',
      medicalEn: 'Medical Insurance',
      medicalDesc: '学校医保政策、就医流程与常用医疗词汇',
      medicalDescEn: 'School insurance policy, medical process and vocabulary',
      bank: '银行开户',
      bankEn: 'Bank Account Opening',
      bankDesc: '主流银行开户指南、手机银行使用、跨境汇款',
      bankDescEn: 'Bank account guide, mobile banking, international transfer',
      sim: 'SIM卡办理',
      simEn: 'SIM Card Application',
      simDesc: '运营商对比、套餐推荐、实名认证流程',
      simDescEn: 'Carrier comparison, plans, real-name registration',
      steps: '办理步骤',
      stepsEn: 'Steps',
      requiredDocs: '所需材料',
      requiredDocsEn: 'Required Documents',
      tips: '温馨提示',
      tipsEn: 'Tips',
      contact: '咨询电话',
      contactEn: 'Contact'
    },
    buddy: {
      title: 'Buddy匹配',
      titleEn: 'Buddy Matching',
      subtitle: '与本地学生结对，快速适应校园生活',
      subtitleEn: 'Pair with local students to adapt quickly',
      findBuddy: '一键匹配Buddy',
      findBuddyEn: 'Find My Buddy',
      myBuddy: '我的Buddy',
      myBuddyEn: 'My Buddy',
      recommended: '推荐Buddy',
      recommendedEn: 'Recommended Buddies',
      matched: '已匹配',
      matchedEn: 'Matched',
      available: '可匹配',
      availableEn: 'Available',
      requestMatch: '申请结对',
      requestMatchEn: 'Request Match',
      cancelMatch: '取消结对',
      cancelMatchEn: 'Cancel Match',
      viewProfile: '查看详情',
      viewProfileEn: 'View Profile',
      hobbies: '兴趣爱好',
      hobbiesEn: 'Hobbies',
      languages: '语言能力',
      languagesEn: 'Languages',
      major: '专业',
      majorEn: 'Major',
      grade: '年级',
      gradeEn: 'Grade',
      bio: '个人简介',
      bioEn: 'Bio',
      successTitle: '匹配成功！',
      successTitleEn: 'Match Successful!',
      successMsg: '你已成功与Buddy结对，请查收消息通知',
      successMsgEn: 'You have been matched. Check your notifications for details.'
    },
    calendar: {
      title: '文化活动日历',
      titleEn: 'Cultural Events Calendar',
      today: '今天',
      todayEn: 'Today',
      upcoming: '即将开始',
      upcomingEn: 'Upcoming',
      allEvents: '全部活动',
      allEventsEn: 'All Events',
      register: '立即报名',
      registerEn: 'Register Now',
      registered: '已报名',
      registeredEn: 'Registered',
      full: '已满员',
      fullEn: 'Full',
      location: '活动地点',
      locationEn: 'Location',
      time: '活动时间',
      timeEn: 'Time',
      organizer: '主办方',
      organizerEn: 'Organizer',
      capacity: '活动名额',
      capacityEn: 'Capacity',
      registeredCount: '已报名人数',
      registeredCountEn: 'Registered',
      category: {
        festival: '传统节日',
        festivalEn: 'Traditional Festival',
        workshop: '文化工坊',
        workshopEn: 'Cultural Workshop',
        tour: '城市游览',
        tourEn: 'City Tour',
        social: '社交聚会',
        socialEn: 'Social Gathering',
        sports: '体育活动',
        sportsEn: 'Sports Event',
        academic: '学术交流',
        academicEn: 'Academic Exchange'
      }
    },
    emergency: {
      title: '紧急热线',
      titleEn: 'Emergency Hotline',
      subtitle: '24小时英语援助服务',
      subtitleEn: '24-Hour English Assistance',
      englishHotline: '英语紧急热线',
      englishHotlineEn: 'English Emergency Line',
      englishHotlineDesc: '全天候英语服务，处理各类紧急事务',
      englishHotlineDescEn: '24/7 English service for all emergencies',
      campusPolice: '校园安保',
      campusPoliceEn: 'Campus Security',
      campusPoliceDesc: '校园内安全问题、遗失物品等',
      campusPoliceDescEn: 'Campus safety, lost items, etc.',
      hospital: '校医院急诊',
      hospitalEn: 'Hospital Emergency',
      hospitalDesc: '24小时急诊医疗服务',
      hospitalDescEn: '24-hour emergency medical service',
      mentalHealth: '心理咨询热线',
      mentalHealthEn: 'Mental Health Hotline',
      mentalHealthDesc: '专业心理咨询师在线援助',
      mentalHealthDescEn: 'Professional counselor online support',
      internationalOffice: '国际交流处',
      internationalOfficeEn: 'International Office',
      internationalOfficeDesc: '签证、居留、学籍相关事务',
      internationalOfficeDescEn: 'Visa, residence, academic affairs',
      callNow: '立即拨打',
      callNowEn: 'Call Now',
      warning: '如遇生命危险，请立即拨打 120 或 110',
      warningEn: 'For life-threatening emergencies, call 120 or 110 immediately'
    }
  },
  en: {
    common: {
      loading: 'Loading...',
      confirm: 'Confirm',
      cancel: 'Cancel',
      back: 'Back',
      more: 'More',
      search: 'Search',
      noData: 'No data',
      error: 'Error',
      success: 'Success'
    },
    intl: {
      title: 'International Student Services',
      subtitle: '国际生服务专区',
      switchLang: '切换到中文',
      welcome: 'Welcome to International Student Services',
      welcomeEn: '欢迎来到国际生服务专区',
      quickGuide: 'Living Guide',
      quickGuideEn: '生活指南',
      visaGuide: 'Visa & Residence',
      visaGuideEn: '签证居留',
      medicalIns: 'Medical Insurance',
      medicalInsEn: '医疗保险',
      bankAccount: 'Bank Account',
      bankAccountEn: '银行开户',
      simCard: 'SIM Card',
      simCardEn: 'SIM卡办理',
      buddyMatch: 'Buddy Program',
      buddyMatchEn: 'Buddy结对',
      culturalEvents: 'Cultural Events',
      culturalEventsEn: '文化活动日历',
      emergency: 'Emergency Hotline',
      emergencyEn: '紧急热线',
      emergencyEnglish: 'English Emergency Line',
      emergencyEnglishEn: '英语紧急热线',
      findBuddy: 'Find My Buddy',
      findBuddyEn: '寻找我的Buddy',
      viewEvents: 'View Event Calendar',
      viewEventsEn: '查看活动日历',
      callHotline: 'Call Emergency Hotline',
      callHotlineEn: '拨打紧急热线',
      language: 'Language',
      languageZh: '中文',
      languageEn: 'English'
    },
    guide: {
      title: 'Living Guide',
      titleEn: '生活指南',
      visa: 'Visa & Residence Permit',
      visaEn: '签证与居留许可',
      visaDesc: 'Student visa application, residence permit process and documents',
      visaDescEn: '学生签证申请、居留许可办理流程与材料清单',
      medical: 'Medical Insurance',
      medicalEn: '医疗保险',
      medicalDesc: 'School insurance policy, medical process and vocabulary',
      medicalDescEn: '学校医保政策、就医流程与常用医疗词汇',
      bank: 'Bank Account Opening',
      bankEn: '银行开户',
      bankDesc: 'Bank account guide, mobile banking, international transfer',
      bankDescEn: '主流银行开户指南、手机银行使用、跨境汇款',
      sim: 'SIM Card Application',
      simEn: 'SIM卡办理',
      simDesc: 'Carrier comparison, plans, real-name registration',
      simDescEn: '运营商对比、套餐推荐、实名认证流程',
      steps: 'Steps',
      stepsEn: '办理步骤',
      requiredDocs: 'Required Documents',
      requiredDocsEn: '所需材料',
      tips: 'Tips',
      tipsEn: '温馨提示',
      contact: 'Contact',
      contactEn: '咨询电话'
    },
    buddy: {
      title: 'Buddy Matching',
      titleEn: 'Buddy匹配',
      subtitle: 'Pair with local students to adapt quickly',
      subtitleEn: '与本地学生结对，快速适应校园生活',
      findBuddy: 'Find My Buddy',
      findBuddyEn: '一键匹配Buddy',
      myBuddy: 'My Buddy',
      myBuddyEn: '我的Buddy',
      recommended: 'Recommended Buddies',
      recommendedEn: '推荐Buddy',
      matched: 'Matched',
      matchedEn: '已匹配',
      available: 'Available',
      availableEn: '可匹配',
      requestMatch: 'Request Match',
      requestMatchEn: '申请结对',
      cancelMatch: 'Cancel Match',
      cancelMatchEn: '取消结对',
      viewProfile: 'View Profile',
      viewProfileEn: '查看详情',
      hobbies: 'Hobbies',
      hobbiesEn: '兴趣爱好',
      languages: 'Languages',
      languagesEn: '语言能力',
      major: 'Major',
      majorEn: '专业',
      grade: 'Grade',
      gradeEn: '年级',
      bio: 'Bio',
      bioEn: '个人简介',
      successTitle: 'Match Successful!',
      successTitleEn: '匹配成功！',
      successMsg: 'You have been matched. Check your notifications for details.',
      successMsgEn: '你已成功与Buddy结对，请查收消息通知'
    },
    calendar: {
      title: 'Cultural Events Calendar',
      titleEn: '文化活动日历',
      today: 'Today',
      todayEn: '今天',
      upcoming: 'Upcoming',
      upcomingEn: '即将开始',
      allEvents: 'All Events',
      allEventsEn: '全部活动',
      register: 'Register Now',
      registerEn: '立即报名',
      registered: 'Registered',
      registeredEn: '已报名',
      full: 'Full',
      fullEn: '已满员',
      location: 'Location',
      locationEn: '活动地点',
      time: 'Time',
      timeEn: '活动时间',
      organizer: 'Organizer',
      organizerEn: '主办方',
      capacity: 'Capacity',
      capacityEn: '活动名额',
      registeredCount: 'Registered',
      registeredCountEn: '已报名人数',
      category: {
        festival: 'Traditional Festival',
        festivalEn: '传统节日',
        workshop: 'Cultural Workshop',
        workshopEn: '文化工坊',
        tour: 'City Tour',
        tourEn: '城市游览',
        social: 'Social Gathering',
        socialEn: '社交聚会',
        sports: 'Sports Event',
        sportsEn: '体育活动',
        academic: 'Academic Exchange',
        academicEn: '学术交流'
      }
    },
    emergency: {
      title: 'Emergency Hotline',
      titleEn: '紧急热线',
      subtitle: '24-Hour English Assistance',
      subtitleEn: '24小时英语援助服务',
      englishHotline: 'English Emergency Line',
      englishHotlineEn: '英语紧急热线',
      englishHotlineDesc: '24/7 English service for all emergencies',
      englishHotlineDescEn: '全天候英语服务，处理各类紧急事务',
      campusPolice: 'Campus Security',
      campusPoliceEn: '校园安保',
      campusPoliceDesc: 'Campus safety, lost items, etc.',
      campusPoliceDescEn: '校园内安全问题、遗失物品等',
      hospital: 'Hospital Emergency',
      hospitalEn: '校医院急诊',
      hospitalDesc: '24-hour emergency medical service',
      hospitalDescEn: '24小时急诊医疗服务',
      mentalHealth: 'Mental Health Hotline',
      mentalHealthEn: '心理咨询热线',
      mentalHealthDesc: 'Professional counselor online support',
      mentalHealthDescEn: '专业心理咨询师在线援助',
      internationalOffice: 'International Office',
      internationalOfficeEn: '国际交流处',
      internationalOfficeDesc: 'Visa, residence, academic affairs',
      internationalOfficeDescEn: '签证、居留、学籍相关事务',
      callNow: 'Call Now',
      callNowEn: '立即拨打',
      warning: 'For life-threatening emergencies, call 120 or 110 immediately',
      warningEn: '如遇生命危险，请立即拨打 120 或 110'
    }
  }
};

function getLanguage() {
  try {
    return wx.getStorageSync(LANG_KEY) || DEFAULT_LANG;
  } catch (e) {
    console.error('[i18n] getLanguage error:', e);
    return DEFAULT_LANG;
  }
}

function setLanguage(lang) {
  try {
    if (lang === 'zh' || lang === 'en') {
      wx.setStorageSync(LANG_KEY, lang);
      return true;
    }
    return false;
  } catch (e) {
    console.error('[i18n] setLanguage error:', e);
    return false;
  }
}

function t(key, lang) {
  const currentLang = lang || getLanguage();
  const keys = key.split('.');
  let value = translations[currentLang];

  for (let i = 0; i < keys.length; i++) {
    if (value && value[keys[i]] !== undefined) {
      value = value[keys[i]];
    } else {
      value = key;
      break;
    }
  }

  return value || key;
}

function getAllTranslations(lang) {
  const currentLang = lang || getLanguage();
  return translations[currentLang] || translations[DEFAULT_LANG];
}

function toggleLanguage() {
  const current = getLanguage();
  const next = current === 'zh' ? 'en' : 'zh';
  setLanguage(next);
  return next;
}

module.exports = {
  LANG_KEY,
  DEFAULT_LANG,
  getLanguage,
  setLanguage,
  t,
  getAllTranslations,
  toggleLanguage
};
