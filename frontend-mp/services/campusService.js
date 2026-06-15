const storage = require('../utils/storage');
const { STORAGE_KEYS } = storage;
const constants = require('../config/constants');
const util = require('../utils/util');

const CAMPUS_SCOPED_STORAGE_KEYS = [
  STORAGE_KEYS.LOST_FOUND_LIST,
  STORAGE_KEYS.MARKET_LIST,
  STORAGE_KEYS.RENTAL_LIST,
  STORAGE_KEYS.POI_LIST,
  STORAGE_KEYS.CANTEEN_LIST,
  STORAGE_KEYS.DISH_LIST,
  STORAGE_KEYS.CANTEEN_REVIEWS,
  STORAGE_KEYS.DISH_REVIEWS,
  STORAGE_KEYS.FAVORITE_CANTEENS,
  STORAGE_KEYS.FAVORITE_DISHES,
  STORAGE_KEYS.FORUM_POST_LIST,
  STORAGE_KEYS.FORUM_COMMENTS,
  STORAGE_KEYS.FORUM_LIKES,
  STORAGE_KEYS.FORUM_REPORTS,
  STORAGE_KEYS.CLUB_LIST,
  STORAGE_KEYS.CLUB_MEMBER_LIST,
  STORAGE_KEYS.CLUB_ACTIVITY_LIST,
  STORAGE_KEYS.CLUB_ACTIVITY_REGISTRATION_LIST,
  STORAGE_KEYS.CLUB_ACTIVITY_CHECKIN_LIST,
  STORAGE_KEYS.CAMPUS_SHOP_LIST,
  STORAGE_KEYS.SHOP_REVIEWS,
  STORAGE_KEYS.VOLUNTEER_ACTIVITY_LIST,
  STORAGE_KEYS.VOLUNTEER_REGISTRATION_LIST,
  STORAGE_KEYS.VOLUNTEER_CHECKIN_LIST,
  STORAGE_KEYS.VOLUNTEER_HOURS_RECORD_LIST,
  STORAGE_KEYS.ERRAND_ORDER_LIST,
  STORAGE_KEYS.CARPOOL_LIST,
  STORAGE_KEYS.GROUP_BUY_LIST,
  STORAGE_KEYS.GROUP_BUY_ORDER_LIST,
  STORAGE_KEYS.CAMPUS_NEWS,
  STORAGE_KEYS.ANNOUNCEMENTS,
  STORAGE_KEYS.MAP_SEARCH_HISTORY,
  STORAGE_KEYS.HISTORY,
  STORAGE_KEYS.SEARCH_HISTORY,
  STORAGE_KEYS.EXPRESS_LOCKER_LIST,
  STORAGE_KEYS.REPAIR_ORDER_LIST,
  STORAGE_KEYS.LAB_LIST,
  STORAGE_KEYS.LAB_APPOINTMENT_LIST,
  STORAGE_KEYS.VENUE_LIST,
  STORAGE_KEYS.VENUE_APPOINTMENT_LIST,
  STORAGE_KEYS.COURSE_LIST,
  STORAGE_KEYS.CLASSROOM_LIST,
  STORAGE_KEYS.EXAM_SCHEDULE,
  STORAGE_KEYS.LIBRARY_BOOK_LIST,
  STORAGE_KEYS.LIBRARY_READING_ROOM_LIST,
  STORAGE_KEYS.LIBRARY_SEAT_LIST,
  STORAGE_KEYS.LIBRARY_SEAT_RESERVATION_LIST,
  STORAGE_KEYS.BUS_ROUTE_LIST,
  STORAGE_KEYS.BUS_VEHICLE_LIST,
  STORAGE_KEYS.TICKET_ORDER_LIST,
  STORAGE_KEYS.VOTING_LIST
];

function getCampusList() {
  let list = storage.get(STORAGE_KEYS.CAMPUS_LIST);
  if (!list || !Array.isArray(list) || list.length === 0) {
    list = constants.DEFAULT_CAMPUSES.filter(c => c.enabled).sort((a, b) => a.sort - b.sort);
    storage.set(STORAGE_KEYS.CAMPUS_LIST, list);
  }
  return list.filter(c => c.enabled !== false);
}

function getCampusById(campusId) {
  const list = getCampusList();
  return list.find(c => c.id === campusId) || null;
}

function getCurrentCampusId() {
  const campusId = storage.get(STORAGE_KEYS.CURRENT_CAMPUS_ID);
  if (campusId) {
    const campus = getCampusById(campusId);
    if (campus) return campusId;
  }
  return constants.CAMPUS_ID_DEFAULT;
}

function getCurrentCampus() {
  const campusId = getCurrentCampusId();
  return getCampusById(campusId) || getCampusById(constants.CAMPUS_ID_DEFAULT);
}

function getCurrentCampusName() {
  const campus = getCurrentCampus();
  return campus ? campus.name : '';
}

function hasSelectedCampus() {
  return !!storage.get(STORAGE_KEYS.CAMPUS_SELECTED);
}

function setCurrentCampus(campusId) {
  const campus = getCampusById(campusId);
  if (!campus) {
    return { success: false, message: '校区不存在' };
  }

  const oldCampusId = storage.get(STORAGE_KEYS.CURRENT_CAMPUS_ID);

  storage.set(STORAGE_KEYS.CURRENT_CAMPUS_ID, campusId);
  storage.set(STORAGE_KEYS.CAMPUS_SELECTED, true);

  const app = getApp();
  if (app && app.globalData) {
    app.globalData.currentCampusId = campusId;
    app.globalData.currentCampus = campus;
  }

  return {
    success: true,
    message: `已切换到${campus.name}`,
    campus,
    oldCampusId
  };
}

function filterListByCampus(list, campusId) {
  if (!list || !Array.isArray(list)) return [];
  const targetCampusId = campusId || getCurrentCampusId();
  return list.filter(item => {
    if (!item) return false;
    if (!item.campusId) return true;
    return item.campusId === targetCampusId;
  });
}

function attachCampusIdToData(data, campusId) {
  const targetCampusId = campusId || getCurrentCampusId();
  if (Array.isArray(data)) {
    return data.map(item => ({
      ...item,
      campusId: item.campusId || targetCampusId
    }));
  }
  if (data && typeof data === 'object') {
    return {
      ...data,
      campusId: data.campusId || targetCampusId
    };
  }
  return data;
}

function clearViewCache() {
  try {
    const config = constants.CAMPUS_SWITCH_CONFIG;
    if (!config.clearViewCache) return;

    const viewCache = storage.get(STORAGE_KEYS.VIEW_CACHE) || {};
    viewCache[Date.now()] = { cleared: true };
    storage.set(STORAGE_KEYS.VIEW_CACHE, viewCache);

    storage.remove(STORAGE_KEYS.SEARCH_HISTORY);
    storage.remove(STORAGE_KEYS.MAP_SEARCH_HISTORY);
    storage.remove(STORAGE_KEYS.HISTORY);

    if (!config.favoritesCrossCampus) {
    }

  } catch (e) {
    console.error('清除视图缓存失败:', e);
  }
}

function switchCampus(campusId, options = {}) {
  const result = setCurrentCampus(campusId);
  if (!result.success) {
    return result;
  }

  const config = constants.CAMPUS_SWITCH_CONFIG;

  if (config.clearViewCache) {
    clearViewCache();
  }

  if (config.notifyOnSwitch && options.showToast !== false) {
    util.showToast(result.message);
  }

  if (typeof options.onSuccess === 'function') {
    options.onSuccess(result);
  }

  return result;
}

function isCampusDataScoped(dataScopeKey) {
  const scope = constants.CAMPUS_DATA_SCOPES.find(s => s.key === dataScopeKey);
  return scope ? scope.campusScoped : true;
}

function getAdminManagedCampuses(userId) {
  const app = getApp();
  const userInfo = (app && app.globalData && app.globalData.userInfo) || {};
  const targetUserId = userId || userInfo.id;

  if (!targetUserId) return [];

  const managed = storage.get(STORAGE_KEYS.ADMIN_MANAGED_CAMPUSES);
  if (managed && managed[targetUserId]) {
    return managed[targetUserId];
  }

  const allCampuses = getCampusList();
  return allCampuses.map(c => c.id);
}

function canManageCampus(campusId, userId) {
  const managedCampuses = getAdminManagedCampuses(userId);
  return managedCampuses.includes(campusId) || managedCampuses.includes('all');
}

function initCampusData() {
  try {
    getCampusList();
    const currentId = getCurrentCampusId();
    const app = getApp();
    if (app && app.globalData) {
      app.globalData.currentCampusId = currentId;
      app.globalData.currentCampus = getCampusById(currentId);
      app.globalData.favoritesCrossCampus = constants.CAMPUS_SWITCH_CONFIG.favoritesCrossCampus;
    }
    return true;
  } catch (e) {
    console.error('初始化校区数据失败:', e);
    return false;
  }
}

module.exports = {
  CAMPUS_SCOPED_STORAGE_KEYS,
  getCampusList,
  getCampusById,
  getCurrentCampusId,
  getCurrentCampus,
  getCurrentCampusName,
  hasSelectedCampus,
  setCurrentCampus,
  switchCampus,
  filterListByCampus,
  attachCampusIdToData,
  clearViewCache,
  isCampusDataScoped,
  getAdminManagedCampuses,
  canManageCampus,
  initCampusData
};
