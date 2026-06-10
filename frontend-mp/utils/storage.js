/**
 * 本地存储封装
 */

const STORAGE_KEYS = {
  USER_INFO: 'userInfo',
  LOST_FOUND_LIST: 'lostFoundList',
  MARKET_LIST: 'marketList',
  FAVORITES: 'favorites',
  HISTORY: 'history',
  THEME_SETTINGS: 'theme_settings',
  SEARCH_HISTORY: 'searchHistory',
  SURVEY_LIST: 'surveyList',
  SURVEY_RESPONSES: 'surveyResponses',
  NOTIFICATIONS: 'notifications',
  NOTIFICATION_SETTINGS: 'notificationSettings',
  STUDY_MATERIALS_LIST: 'studyMaterialsList',
  STUDY_REWARDS_LIST: 'studyRewardsList',
  USER_POINTS: 'userPoints',
  POINT_TRANSACTIONS: 'pointTransactions',
  CAMPUS_SHOP_LIST: 'campusShopList',
  SHOP_REVIEWS: 'shopReviews',
  VOLUNTEER_ACTIVITY_LIST: 'volunteerActivityList',
  VOLUNTEER_REGISTRATION_LIST: 'volunteerRegistrationList',
  VOLUNTEER_CHECKIN_LIST: 'volunteerCheckinList',
  VOLUNTEER_HOURS_RECORD_LIST: 'volunteerHoursRecordList',
  ERRAND_ORDER_LIST: 'errandOrderList',
  ERRAND_ADDRESS_LIST: 'errandAddressList',
  RENTAL_LIST: 'rentalList',
  RENTAL_COMPARE_LIST: 'rentalCompareList',
  RENTAL_AGENT_REPORTS: 'rentalAgentReports'
};

/**
 * 同步获取存储数据
 */
function get(key) {
  try {
    return wx.getStorageSync(key) || null;
  } catch (e) {
    console.error(`Storage get error [${key}]:`, e);
    return null;
  }
}

/**
 * 同步设置存储数据
 */
function set(key, data) {
  try {
    wx.setStorageSync(key, data);
    return true;
  } catch (e) {
    console.error(`Storage set error [${key}]:`, e);
    return false;
  }
}

/**
 * 同步删除存储数据
 */
function remove(key) {
  try {
    wx.removeStorageSync(key);
    return true;
  } catch (e) {
    console.error(`Storage remove error [${key}]:`, e);
    return false;
  }
}

/**
 * 异步获取存储数据
 */
function getAsync(key) {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key,
      success: (res) => resolve(res.data),
      fail: () => resolve(null)
    });
  });
}

/**
 * 异步设置存储数据
 */
function setAsync(key, data) {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key,
      data,
      success: () => resolve(true),
      fail: (err) => reject(err)
    });
  });
}

/**
 * 获取列表数据
 */
function getList(key) {
  const data = get(key);
  return Array.isArray(data) ? data : [];
}

/**
 * 添加到列表
 */
function addToList(key, item) {
  const list = getList(key);
  list.unshift(item);
  return set(key, list);
}

/**
 * 从列表中删除
 */
function removeFromList(key, id, idField = 'id') {
  const list = getList(key);
  const newList = list.filter(item => item[idField] !== id);
  return set(key, newList);
}

/**
 * 更新列表中的项
 */
function updateInList(key, id, updates, idField = 'id') {
  const list = getList(key);
  const index = list.findIndex(item => item[idField] === id);
  if (index > -1) {
    list[index] = { ...list[index], ...updates };
    return set(key, list);
  }
  return false;
}

/**
 * 检查项是否在列表中
 */
function isInList(key, id, idField = 'id') {
  const list = getList(key);
  return list.some(item => item[idField] === id);
}

/**
 * 清空列表
 */
function clearList(key) {
  return set(key, []);
}

function getSearchHistory() {
  return getList(STORAGE_KEYS.SEARCH_HISTORY);
}

function addSearchHistory(keyword) {
  if (!keyword || !keyword.trim()) return false;
  const trimmed = keyword.trim();
  const list = getList(STORAGE_KEYS.SEARCH_HISTORY);
  const filtered = list.filter(item => item !== trimmed);
  filtered.unshift(trimmed);
  if (filtered.length > 20) filtered.splice(20);
  return set(STORAGE_KEYS.SEARCH_HISTORY, filtered);
}

function removeSearchHistory(keyword) {
  const list = getList(STORAGE_KEYS.SEARCH_HISTORY);
  const newList = list.filter(item => item !== keyword);
  return set(STORAGE_KEYS.SEARCH_HISTORY, newList);
}

function clearSearchHistory() {
  return set(STORAGE_KEYS.SEARCH_HISTORY, []);
}

module.exports = {
  STORAGE_KEYS,
  get,
  set,
  remove,
  getAsync,
  setAsync,
  getList,
  addToList,
  removeFromList,
  updateInList,
  isInList,
  clearList,
  getSearchHistory,
  addSearchHistory,
  removeSearchHistory,
  clearSearchHistory
};
