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
  ERRAND_RUNNER_LIST: 'errandRunnerList',
  ERRAND_VIOLATION_LIST: 'errandViolationList',
  RENTAL_LIST: 'rentalList',
  RENTAL_COMPARE_LIST: 'rentalCompareList',
  RENTAL_AGENT_REPORTS: 'rentalAgentReports',
  CARPOOL_LIST: 'carpoolList',
  CANTEEN_LIST: 'canteenList',
  DISH_LIST: 'dishList',
  CANTEEN_REVIEWS: 'canteenReviews',
  DISH_REVIEWS: 'dishReviews',
  FAVORITE_CANTEENS: 'favoriteCanteens',
  FAVORITE_DISHES: 'favoriteDishes',
  FORUM_POST_LIST: 'forumPostList',
  FORUM_COMMENTS: 'forumComments',
  FORUM_LIKES: 'forumLikes',
  FORUM_REPORTS: 'forumReports',
  FORUM_BANNED_USERS: 'forumBannedUsers',
  FORUM_TOPIC_STATS: 'forumTopicStats',
  CLUB_LIST: 'clubList',
  CLUB_MEMBER_LIST: 'clubMemberList',
  CLUB_ACTIVITY_LIST: 'clubActivityList',
  CLUB_ACTIVITY_REGISTRATION_LIST: 'clubActivityRegistrationList',
  CLUB_ACTIVITY_CHECKIN_LIST: 'clubActivityCheckinList',
  POI_LIST: 'poiList',
  MAP_FAVORITES: 'mapFavorites',
  MAP_SEARCH_HISTORY: 'mapSearchHistory',
  MAP_SETTINGS: 'mapSettings',
  COURSE_LIST: 'courseList',
  COURSE_SETTINGS: 'courseSettings',
  CLASS_REMINDERS: 'classReminders',
  EXAM_SCORES: 'examScores',
  EXAM_SCHEDULE: 'examSchedule',
  CLASSROOM_LIST: 'classroomList',
  FONT_SIZE_SETTINGS: 'font_size_settings',
  FEEDBACK_LIST: 'feedbackList',
  BROADCAST_FAVORITES: 'broadcastFavorites',
  BROADCAST_RECENT: 'broadcastRecent',
  BROADCAST_PLAY_MODE: 'broadcastPlayMode',
  BROADCAST_PLAYBACK_RATE: 'broadcastPlaybackRate',
  USERS: 'users',
  USER_REAL_NAME_VERIFY: 'userRealNameVerify',
  USER_CREDIT_SCORES: 'userCreditScores',
  REPORTS: 'reports',
  BLACKLIST: 'blacklist',
  USER_BEHAVIOR_LOG: 'userBehaviorLog',
  ANNOUNCEMENTS: 'announcements',
  CAMPUS_NEWS: 'campusNews',
  BROADCAST_PROGRAMS: 'broadcastPrograms',
  SCENERY_MANAGE: 'sceneryManage',
  LOST_FOUND_COMMENTS: 'lostFoundComments',
  MARKET_COMMENTS: 'marketComments',
  TICKET_ORDER_LIST: 'ticketOrderList',
  TICKET_VERIFY_LOG: 'ticketVerifyLog',
  USER_WALLET: 'userWallet',
  INNOVATION_PROJECT_LIST: 'innovationProjectList',
  INNOVATION_MENTOR_LIST: 'innovationMentorList',
  INNOVATION_ROADSHOW_LIST: 'innovationRoadshowList',
  INNOVATION_POLICY_LIST: 'innovationPolicyList',
  INNOVATION_INCUBATOR_LIST: 'innovationIncubatorList',
  INNOVATION_APPOINTMENT_LIST: 'innovationAppointmentList',
  INNOVATION_REGISTRATION_LIST: 'innovationRegistrationList',
  INNOVATION_MY_PROJECTS: 'innovationMyProjects',
  LOW_CARBON_CHECKIN_LIST: 'lowCarbonCheckinList',
  LOW_CARBON_POINTS: 'lowCarbonPoints',
  LOW_CARBON_POINTS_RECORD: 'lowCarbonPointsRecord',
  LOW_CARBON_ACTIVITY_LIST: 'lowCarbonActivityList',
  LOW_CARBON_ACTIVITY_REGISTRATION: 'lowCarbonActivityRegistration',
  LOW_CARBON_REDEEM_LIST: 'lowCarbonRedeemList',
  LOW_CARBON_REDEEM_ORDER: 'lowCarbonRedeemOrder',
  LOW_CARBON_WEEKLY_REPORT: 'lowCarbonWeeklyReport',
  APP_LANGUAGE: 'app_language',
  INTL_BUDDY_LIST: 'intlBuddyList',
  INTL_MY_BUDDY: 'intlMyBuddy',
  INTL_BUDDY_MATCH_REQUESTS: 'intlBuddyMatchRequests',
  INTL_CULTURAL_EVENTS: 'intlCulturalEvents',
  INTL_EVENT_REGISTRATIONS: 'intlEventRegistrations',
  ALUMNI_VERIFY_INFO: 'alumniVerifyInfo',
  ALUMNI_POST_LIST: 'alumniPostList',
  ALUMNI_MENTOR_LIST: 'alumniMentorList',
  ALUMNI_MENTOR_APPOINTMENTS: 'alumniMentorAppointments',
  ALUMNI_VISIT_APPOINTMENTS: 'alumniVisitAppointments',
  ALUMNI_CARD_BENEFITS: 'alumniCardBenefits',
  ALUMNI_PROFILE_LIST: 'alumniProfileList',
  TAKEOUT_MERCHANT_LIST: 'takeoutMerchantList',
  FAVORITE_TAKEOUT_MERCHANTS: 'favoriteTakeoutMerchants',
  TAKEOUT_PROMOTIONS: 'takeoutPromotions',
  GRADUATION_CHECKLIST: 'graduationChecklist',
  GRADUATION_ADMIN_SIGNS: 'graduationAdminSigns',
  GRADUATION_CERTIFICATE: 'graduationCertificate',
  SOS_EMERGENCY_CONTACTS: 'sosEmergencyContacts',
  SOS_HISTORY: 'sosHistory',
  SOS_SETTINGS: 'sosSettings',
  SAFETY_ARTICLES: 'safetyArticles',
  LAB_LIST: 'labList',
  LAB_APPOINTMENT_LIST: 'labAppointmentList',
  LAB_SAFETY_TRAINING: 'labSafetyTraining',
  LAB_VIOLATION_RECORDS: 'labViolationRecords',

  TRAINING_PLAN_LIST: 'trainingPlanList',
  TRAINING_PLAN_COURSES: 'trainingPlanCourses',
  SELECTED_COURSES: 'selectedCourses',
  COURSE_REVIEWS: 'courseReviews',
  COURSE_ASSISTANT_SETTINGS: 'courseAssistantSettings'
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
