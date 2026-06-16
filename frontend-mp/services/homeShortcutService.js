const storage = require('../utils/storage');

const DEFAULT_SHORTCUT_IDS = [
  'schedule', 'campus-card', 'canteen', 'library',
  'errand', 'lost-found', 'market', 'forum'
];

const MAX_RECENTLY_USED = 6;

function loadShortcuts() {
  const data = storage.get(storage.STORAGE_KEYS.HOME_SHORTCUTS);
  if (data && data.shortcutIds) {
    return data;
  }
  const defaultData = {
    shortcutIds: DEFAULT_SHORTCUT_IDS.slice(),
    version: 1
  };
  storage.set(storage.STORAGE_KEYS.HOME_SHORTCUTS, defaultData);
  return defaultData;
}

function saveShortcuts(shortcutIds) {
  const data = {
    shortcutIds: shortcutIds,
    version: 1
  };
  storage.set(storage.STORAGE_KEYS.HOME_SHORTCUTS, data);
  return data;
}

function resetShortcuts() {
  const defaultData = {
    shortcutIds: DEFAULT_SHORTCUT_IDS.slice(),
    version: 1
  };
  storage.set(storage.STORAGE_KEYS.HOME_SHORTCUTS, defaultData);
  return defaultData;
}

function loadRecentlyUsed() {
  const list = storage.getList(storage.STORAGE_KEYS.HOME_RECENTLY_USED);
  return list;
}

function addRecentlyUsed(serviceId) {
  if (!serviceId) return;
  let list = loadRecentlyUsed();
  list = list.filter(id => id !== serviceId);
  list.unshift(serviceId);
  if (list.length > MAX_RECENTLY_USED) {
    list = list.slice(0, MAX_RECENTLY_USED);
  }
  storage.set(storage.STORAGE_KEYS.HOME_RECENTLY_USED, list);
  return list;
}

function loadHiddenModules() {
  const list = storage.getList(storage.STORAGE_KEYS.HOME_HIDDEN_MODULES);
  return list;
}

function saveHiddenModules(hiddenIds) {
  storage.set(storage.STORAGE_KEYS.HOME_HIDDEN_MODULES, hiddenIds);
}

function toggleHiddenModule(serviceId) {
  let hidden = loadHiddenModules();
  const idx = hidden.indexOf(serviceId);
  if (idx > -1) {
    hidden.splice(idx, 1);
  } else {
    hidden.push(serviceId);
  }
  saveHiddenModules(hidden);
  return hidden;
}

function getTodaySummary() {
  const now = new Date();
  const today = now.getDay() || 7;
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeNum = currentHour * 100 + currentMinute;

  const courseList = storage.getList(storage.STORAGE_KEYS.COURSE_LIST);
  const TIME_SLOTS = [
    { slot: 1, start: '08:00', end: '08:45', startNum: 800, endNum: 845 },
    { slot: 2, start: '08:55', end: '09:40', startNum: 855, endNum: 940 },
    { slot: 3, start: '10:00', end: '10:45', startNum: 1000, endNum: 1045 },
    { slot: 4, start: '10:55', end: '11:40', startNum: 1055, endNum: 1140 },
    { slot: 5, start: '14:00', end: '14:45', startNum: 1400, endNum: 1445 },
    { slot: 6, start: '14:55', end: '15:40', startNum: 1455, endNum: 1540 },
    { slot: 7, start: '16:00', end: '16:45', startNum: 1600, endNum: 1645 },
    { slot: 8, start: '16:55', end: '17:40', startNum: 1655, endNum: 1740 },
    { slot: 9, start: '19:00', end: '19:45', startNum: 1900, endNum: 1945 },
    { slot: 10, start: '19:55', end: '20:40', startNum: 1955, endNum: 2040 }
  ];

  let nextCourse = null;
  const todayCourses = courseList.filter(c => c.dayOfWeek === today);

  for (const course of todayCourses) {
    const startSlot = TIME_SLOTS.find(s => s.slot === course.startSlot);
    if (startSlot && startSlot.startNum > currentTimeNum) {
      if (!nextCourse || startSlot.startNum < TIME_SLOTS.find(s => s.slot === nextCourse.startSlot).startNum) {
        nextCourse = course;
      }
    }
  }

  const errandOrders = storage.getList(storage.STORAGE_KEYS.ERRAND_ORDER_LIST);
  const pendingErrands = errandOrders.filter(o =>
    o.userId === 'test_user' && (o.status === 'pending' || o.status === 'accepted' || o.status === 'in_progress')
  );

  const notifications = storage.getList(storage.STORAGE_KEYS.NOTIFICATIONS);
  const unreadCount = notifications.filter(n => !n.read).length;

  const clubActivities = storage.getList(storage.STORAGE_KEYS.CLUB_ACTIVITY_LIST);
  const upcomingActivities = clubActivities.filter(a => {
    if (!a.startTime) return false;
    const startTime = new Date(a.startTime);
    const diff = startTime.getTime() - now.getTime();
    return diff > 0 && diff < 86400000;
  });

  return {
    nextCourse: nextCourse ? {
      name: nextCourse.name,
      classroom: nextCourse.classroom,
      startTime: TIME_SLOTS.find(s => s.slot === nextCourse.startSlot)?.start || '',
      endTime: TIME_SLOTS.find(s => s.slot === nextCourse.endSlot)?.end || ''
    } : null,
    pendingErrandCount: pendingErrands.length,
    unreadNotificationCount: unreadCount,
    upcomingActivities: upcomingActivities.slice(0, 2).map(a => ({
      name: a.name || a.title,
      startTime: a.startTime
    }))
  };
}

function getWeatherCourseTip(weatherData, courseList) {
  if (!weatherData || !weatherData.current) return null;

  const weather = weatherData.current.weather || '';
  const isRainy = /雨|阵雨|雷阵/.test(weather);
  const now = new Date();
  const today = now.getDay() || 7;
  const currentHour = now.getHours();

  const todayCourses = (courseList || []).filter(c => c.dayOfWeek === today);

  const afternoonCourses = todayCourses.filter(c => c.startSlot >= 5 && c.startSlot <= 8);
  const teachingBuildingCourses = todayCourses.filter(c =>
    /教学楼|A栋|B栋|C栋|D栋|E栋/.test(c.classroom || '')
  );

  const tips = [];

  if (isRainy) {
    tips.push('☔ 记得带伞出门哦');
  }

  if (isRainy && teachingBuildingCourses.length > 0) {
    const buildings = [...new Set(teachingBuildingCourses.map(c => {
      const match = c.classroom.match(/[A-E]栋/);
      return match ? match[0] : c.classroom;
    }))];
    if (buildings.length > 0) {
      tips.push('🏫 下午在' + buildings.join('、') + '有课，雨天路滑注意安全');
    }
  }

  if (currentHour < 14 && afternoonCourses.length > 0) {
    const nextAfternoon = afternoonCourses[0];
    const building = nextAfternoon.classroom.match(/[A-E]栋/) ? nextAfternoon.classroom.match(/[A-E]栋/)[0] : nextAfternoon.classroom;
    if (!isRainy || !teachingBuildingCourses.length) {
      tips.push('📚 下午在' + building + '有「' + nextAfternoon.name + '」');
    }
  }

  return tips.length > 0 ? tips.join('\n') : null;
}

module.exports = {
  DEFAULT_SHORTCUT_IDS,
  MAX_RECENTLY_USED,
  loadShortcuts,
  saveShortcuts,
  resetShortcuts,
  loadRecentlyUsed,
  addRecentlyUsed,
  loadHiddenModules,
  saveHiddenModules,
  toggleHiddenModule,
  getTodaySummary,
  getWeatherCourseTip
};
