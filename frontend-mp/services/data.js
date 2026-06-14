/**
 * 数据服务层
 */

const storage = require('../utils/storage');
const { STORAGE_KEYS } = storage;
const util = require('../utils/util');
const constants = require('../config/constants');
const mockData = require('../config/mock-data');

let studyMaterialsInitialized = false;
let studyRewardsInitialized = false;
let campusShopsInitialized = false;
let shopReviewsInitialized = false;
let volunteerInitialized = false;
let canteenInitialized = false;
let canteenReviewsInitialized = false;
let dishReviewsInitialized = false;
let innovationProjectsInitialized = false;
let innovationMentorsInitialized = false;
let innovationRoadshowsInitialized = false;
let innovationPoliciesInitialized = false;
let innovationIncubatorsInitialized = false;
let alumniPostsInitialized = false;
let alumniMentorsInitialized = false;
let alumniCardBenefitsInitialized = false;
let alumniProfilesInitialized = false;

function initVolunteerData() {
  if (volunteerInitialized) return;
  const existing = storage.get(STORAGE_KEYS.VOLUNTEER_ACTIVITY_LIST);
  if (!existing || existing.length === 0) {
    const now = Date.now();
    const activities = mockData.MOCK_VOLUNTEER_ACTIVITIES.map((item, index) => ({
      id: 'mock_vol_' + index + '_' + now,
      ...item,
      registrations: (item.registrations || []).map((r, rIdx) => ({
        id: 'reg_' + index + '_' + rIdx + '_' + now,
        ...r
      })),
      views: item.views || 0,
      createTime: now - (index + 1) * 86400000,
      updateTime: now - (index + 1) * 86400000
    }));
    storage.set(STORAGE_KEYS.VOLUNTEER_ACTIVITY_LIST, activities);

    const hoursRecords = mockData.MOCK_VOLUNTEER_HOURS_RECORDS.map((item, index) => ({
      id: 'hours_' + index + '_' + now,
      ...item,
      activityId: activities[index < activities.length ? index : 0] ? activities[index < activities.length ? index : 0].id : ''
    }));
    storage.set(STORAGE_KEYS.VOLUNTEER_HOURS_RECORD_LIST, hoursRecords);
  }
  volunteerInitialized = true;
}

function initStudyMaterials() {
  if (studyMaterialsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.STUDY_MATERIALS_LIST);
  if (!existing || existing.length === 0) {
    const materials = mockData.MOCK_STUDY_MATERIALS.map((item, index) => ({
      id: util.generateId(),
      ...item,
      uploaderId: 'user_' + index,
      views: Math.floor(Math.random() * 500),
      createTime: Date.now() - index * 86400000,
      updateTime: Date.now() - index * 86400000
    }));
    storage.set(STORAGE_KEYS.STUDY_MATERIALS_LIST, materials);
  }
  studyMaterialsInitialized = true;
}

function initStudyRewards() {
  if (studyRewardsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.STUDY_REWARDS_LIST);
  if (!existing || existing.length === 0) {
    const rewards = mockData.MOCK_STUDY_REWARDS.map((item, index) => ({
      id: util.generateId(),
      ...item,
      publisherId: 'user_' + (index + 10),
      createTime: Date.now() - (index + 1) * 86400000,
      updateTime: Date.now() - (index + 1) * 86400000
    }));
    storage.set(STORAGE_KEYS.STUDY_REWARDS_LIST, rewards);
  }
  studyRewardsInitialized = true;
}

function filterByKeyword(list, keyword, fields) {
  if (!keyword) return list;
  const keywordLower = keyword.toLowerCase();
  return list.filter(item =>
    fields.some(field => {
      const value = item[field];
      return value && value.toLowerCase().includes(keywordLower);
    })
  );
}

function getTimeRangeMs(rangeValue) {
  const now = Date.now();
  const day = 86400000;
  switch (rangeValue) {
    case '1d': return now - day;
    case '3d': return now - 3 * day;
    case '1w': return now - 7 * day;
    case '1m': return now - 30 * day;
    default: return 0;
  }
}

function sortByField(list, sortValue, sortOptions) {
  if (!sortValue) return list;
  const option = sortOptions.find(o => o.value === sortValue);
  if (!option) return list;
  const { field, order } = option;
  return list.slice().sort((a, b) => {
    const va = a[field] !== undefined ? a[field] : 0;
    const vb = b[field] !== undefined ? b[field] : 0;
    if (typeof va === 'string' && typeof vb === 'string') {
      return order === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    }
    return order === 'asc' ? va - vb : vb - va;
  });
}

function paginateList(list, page = 1, pageSize = 15) {
  const total = list.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageList = list.slice(start, end);
  const hasMore = end < total;

  return {
    list: pageList,
    total,
    page,
    pageSize,
    hasMore,
    totalPages: Math.ceil(total / pageSize)
  };
}

// ==================== 失物招领 ====================

/**
 * 获取失物招领列表
 */
function getLostFoundList(filters = {}) {
  let list = storage.getList(STORAGE_KEYS.LOST_FOUND_LIST);

  if (filters.type) {
    list = list.filter(item => item.type === filters.type);
  }

  if (filters.itemType) {
    list = list.filter(item => item.itemType === filters.itemType);
  }

  if (filters.timeRange) {
    const timeThreshold = getTimeRangeMs(filters.timeRange);
    if (timeThreshold) {
      list = list.filter(item => item.createTime >= timeThreshold);
    }
  }

  list = filterByKeyword(list, filters.keyword, ['title', 'description']);

  list = sortByField(list, filters.sort || 'latest', constants.SORT_OPTIONS);

  return list;
}

function getLostFoundListPaged(pagination = {}) {
  const { page = 1, pageSize = 15, filters = {} } = pagination;
  const list = getLostFoundList(filters);
  return paginateList(list, page, pageSize);
}

/**
 * 获取失物招领详情
 */
function getLostFoundDetail(id) {
  const list = storage.getList(STORAGE_KEYS.LOST_FOUND_LIST);
  const item = list.find(item => item.id === id) || null;
  if (item) {
    item.userName = item.userName || '匿名用户';
    item.userAvatar = item.userAvatar || '';
    item.status = item.status || 'active';
  }
  return item;
}

/**
 * 发布失物招领
 */
function publishLostFound(data) {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const item = {
    id: util.generateId(),
    ...data,
    userId: userInfo.id || 'anonymous',
    userName: userInfo.nickName || '匿名用户',
    userAvatar: userInfo.avatarUrl || '',
    createTime: Date.now(),
    updateTime: Date.now(),
    status: 'active'
  };

  const success = storage.addToList(STORAGE_KEYS.LOST_FOUND_LIST, item);
  return success ? item : null;
}

/**
 * 获取我的失物招领列表
 */
function getMyLostFoundList(userId, status = '') {
  let list = storage.getList(STORAGE_KEYS.LOST_FOUND_LIST);
  list = list.filter(item => item.userId === userId);
  if (status && status !== 'all') {
    list = list.filter(item => item.status === status);
  }
  return list.sort((a, b) => b.createTime - a.createTime);
}

/**
 * 更新失物招领
 */
function updateLostFound(id, updates) {
  return storage.updateInList(STORAGE_KEYS.LOST_FOUND_LIST, id, {
    ...updates,
    updateTime: Date.now()
  });
}

/**
 * 删除失物招领
 */
function deleteLostFound(id) {
  const success = storage.removeFromList(STORAGE_KEYS.LOST_FOUND_LIST, id);
  if (success) {
    removeFavorite(id, 'lostFound');
    removeHistory(id, 'lostFound');
  }
  return success;
}

// ==================== 二手市场 ====================

/**
 * 获取二手商品列表
 */
function getMarketList(filters = {}) {
  let list = storage.getList(STORAGE_KEYS.MARKET_LIST);

  if (filters.category) {
    list = list.filter(item => item.category === filters.category);
  }

  if (filters.minPrice !== undefined) {
    list = list.filter(item => item.price >= filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    list = list.filter(item => item.price <= filters.maxPrice);
  }

  if (filters.status) {
    list = list.filter(item => item.status === filters.status);
  }

  if (filters.timeRange) {
    const timeThreshold = getTimeRangeMs(filters.timeRange);
    if (timeThreshold) {
      list = list.filter(item => item.createTime >= timeThreshold);
    }
  }

  list = filterByKeyword(list, filters.keyword, ['title', 'description']);

  return list;
}

/**
 * 获取二手商品详情
 */
function getMarketDetail(id) {
  const list = storage.getList(STORAGE_KEYS.MARKET_LIST);
  return list.find(item => item.id === id) || null;
}

/**
 * 发布二手商品
 */
function publishMarketItem(data) {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const item = {
    id: util.generateId(),
    ...data,
    userId: userInfo.id || 'anonymous',
    userName: userInfo.nickName || '匿名用户',
    userAvatar: userInfo.avatarUrl || '',
    createTime: Date.now(),
    updateTime: Date.now(),
    status: 'selling',
    views: 0
  };

  const success = storage.addToList(STORAGE_KEYS.MARKET_LIST, item);
  return success ? item : null;
}

/**
 * 获取我的二手商品列表
 */
function getMyMarketList(userId, status = '') {
  let list = storage.getList(STORAGE_KEYS.MARKET_LIST);
  list = list.filter(item => item.userId === userId);
  if (status && status !== 'all') {
    list = list.filter(item => item.status === status);
  }
  return list.sort((a, b) => b.createTime - a.createTime);
}

/**
 * 更新二手商品
 */
function updateMarketItem(id, updates) {
  return storage.updateInList(STORAGE_KEYS.MARKET_LIST, id, {
    ...updates,
    updateTime: Date.now()
  });
}

/**
 * 删除二手商品
 */
function deleteMarketItem(id) {
  const success = storage.removeFromList(STORAGE_KEYS.MARKET_LIST, id);
  if (success) {
    removeFavorite(id, 'market');
    removeHistory(id, 'market');
  }
  return success;
}

/**
 * 增加商品浏览量
 */
function increaseMarketViews(id) {
  const item = getMarketDetail(id);
  if (item) {
    return storage.updateInList(STORAGE_KEYS.MARKET_LIST, id, {
      views: (item.views || 0) + 1
    });
  }
  return false;
}

// ==================== 收藏 ====================

/**
 * 获取收藏列表
 */
function getFavorites(type = '') {
  let list = storage.getList(STORAGE_KEYS.FAVORITES);
  if (type) {
    list = list.filter(item => item.type === type);
  }
  return list;
}

/**
 * 添加收藏
 */
function addFavorite(item, type) {
  const favorite = {
    id: item.id,
    type,
    data: item,
    createTime: Date.now()
  };

  // 检查是否已收藏
  if (isFavorite(item.id, type)) {
    return false;
  }

  return storage.addToList(STORAGE_KEYS.FAVORITES, favorite);
}

/**
 * 取消收藏
 */
function removeFavorite(id, type) {
  const list = storage.getList(STORAGE_KEYS.FAVORITES);
  const newList = list.filter(item => !(item.id === id && item.type === type));
  return storage.set(STORAGE_KEYS.FAVORITES, newList);
}

/**
 * 检查是否已收藏
 */
function isFavorite(id, type) {
  const list = storage.getList(STORAGE_KEYS.FAVORITES);
  return list.some(item => item.id === id && item.type === type);
}

/**
 * 清空收藏
 */
function clearFavorites() {
  return storage.clearList(STORAGE_KEYS.FAVORITES);
}

// ==================== 浏览历史 ====================

/**
 * 获取浏览历史
 */
function getHistory(type = '') {
  let list = storage.getList(STORAGE_KEYS.HISTORY);
  if (type) {
    list = list.filter(item => item.type === type);
  }
  return list;
}

/**
 * 添加浏览历史
 */
function addHistory(item, type) {
  const list = storage.getList(STORAGE_KEYS.HISTORY);

  // 移除已存在的相同记录
  const newList = list.filter(h => !(h.id === item.id && h.type === type));

  // 添加到开头
  newList.unshift({
    id: item.id,
    type,
    data: item,
    viewTime: Date.now()
  });

  // 限制历史记录数量
  if (newList.length > 100) {
    newList.splice(100);
  }

  return storage.set(STORAGE_KEYS.HISTORY, newList);
}

/**
 * 清空浏览历史
 */
function clearHistory(type = '') {
  if (type) {
    const list = storage.getList(STORAGE_KEYS.HISTORY);
    const newList = list.filter(item => item.type !== type);
    return storage.set(STORAGE_KEYS.HISTORY, newList);
  }
  return storage.clearList(STORAGE_KEYS.HISTORY);
}

/**
 * 删除单条历史记录
 */
function removeHistory(id, type) {
  const list = storage.getList(STORAGE_KEYS.HISTORY);
  const newList = list.filter(item => !(item.id === id && item.type === type));
  return storage.set(STORAGE_KEYS.HISTORY, newList);
}

function globalSearch(filters) {
  const {
    keyword,
    tab,
    category,
    minPrice,
    maxPrice,
    timeRange,
    sort
  } = filters;

  let lostList = [];
  let marketList = [];
  let newsList = [];
  let phonebookList = [];

  if (tab === 'all' || tab === 'lost') {
    lostList = getLostFoundList({
      keyword,
      itemType: category,
      timeRange
    });
    lostList = lostList.map(item => ({
      ...item,
      _type: 'lost',
      timeText: util.relativeTime(item.createTime),
      itemTypeText: constants.getLabelByValue(constants.ITEM_TYPES, item.itemType),
      locationText: constants.getLabelByValue(constants.LOCATIONS, item.location)
    }));
    lostList = sortByField(lostList, sort, constants.SORT_OPTIONS);
  }

  if (tab === 'all' || tab === 'market') {
    marketList = getMarketList({
      keyword,
      category,
      minPrice,
      maxPrice,
      timeRange
    });
    marketList = marketList.map(item => ({
      ...item,
      _type: 'market',
      priceText: util.formatPrice(item.price),
      timeText: util.relativeTime(item.createTime),
      statusText: constants.getLabelByValue(constants.MARKET_STATUS, item.status),
      categoryText: constants.getLabelByValue(constants.MARKET_CATEGORIES, item.category)
    }));
    marketList = sortByField(marketList, sort, constants.SORT_OPTIONS);
  }

  if (tab === 'all' || tab === 'news') {
    newsList = mockData.CAMPUS_NEWS.slice();
    if (timeRange) {
      const timeThreshold = getTimeRangeMs(timeRange);
      if (timeThreshold) {
        newsList = newsList.filter(item => item.createTime >= timeThreshold);
      }
    }
    newsList = filterByKeyword(newsList, keyword, ['title', 'summary']);
    newsList = newsList.map(item => ({
      ...item,
      _type: 'news',
      timeText: util.relativeTime(item.createTime)
    }));
    newsList = sortByField(newsList, sort, constants.SORT_OPTIONS);
  }

  if (tab === 'all' || tab === 'phonebook') {
    if (keyword) {
      phonebookList = searchPhonebook(keyword);
    } else if (category) {
      phonebookList = getPhonebookItemsByCategory(category);
    } else {
      phonebookList = getPhonebookAllItems();
    }
    phonebookList = phonebookList.map(item => ({
      ...item,
      _type: 'phonebook'
    }));
  }

  return { lostList, marketList, newsList, phonebookList };
}

// ==================== 问卷调研 ====================

function getSurveyList(filters = {}) {
  let list = storage.getList(STORAGE_KEYS.SURVEY_LIST);

  if (filters.status) {
    list = list.filter(item => item.status === filters.status);
  }

  list = filterByKeyword(list, filters.keyword, ['title', 'description']);

  return list;
}

function getSurveyDetail(id) {
  const list = storage.getList(STORAGE_KEYS.SURVEY_LIST);
  return list.find(item => item.id === id) || null;
}

function createSurvey(data) {
  const item = {
    id: util.generateId(),
    ...data,
    createTime: Date.now(),
    updateTime: Date.now(),
    status: 'active',
    responseCount: 0
  };

  const success = storage.addToList(STORAGE_KEYS.SURVEY_LIST, item);
  return success ? item : null;
}

function updateSurvey(id, updates) {
  return storage.updateInList(STORAGE_KEYS.SURVEY_LIST, id, {
    ...updates,
    updateTime: Date.now()
  });
}

function deleteSurvey(id) {
  storage.removeFromList(STORAGE_KEYS.SURVEY_LIST, id);
  const responses = storage.getList(STORAGE_KEYS.SURVEY_RESPONSES);
  const remaining = responses.filter(r => r.surveyId !== id);
  storage.set(STORAGE_KEYS.SURVEY_RESPONSES, remaining);
  return true;
}

function closeSurvey(id) {
  return storage.updateInList(STORAGE_KEYS.SURVEY_LIST, id, {
    status: 'closed',
    updateTime: Date.now()
  });
}

function hasUserResponded(surveyId, userId) {
  const responses = storage.getList(STORAGE_KEYS.SURVEY_RESPONSES);
  return responses.some(r => r.surveyId === surveyId && r.userId === userId);
}

function submitSurveyResponse(surveyId, userId, answers) {
  if (hasUserResponded(surveyId, userId)) {
    return false;
  }

  const response = {
    id: util.generateId(),
    surveyId,
    userId,
    answers,
    createTime: Date.now()
  };

  storage.addToList(STORAGE_KEYS.SURVEY_RESPONSES, response);

  const survey = getSurveyDetail(surveyId);
  if (survey) {
    storage.updateInList(STORAGE_KEYS.SURVEY_LIST, surveyId, {
      responseCount: (survey.responseCount || 0) + 1
    });
  }

  return response;
}

function getSurveyResponses(surveyId) {
  const responses = storage.getList(STORAGE_KEYS.SURVEY_RESPONSES);
  return responses.filter(r => r.surveyId === surveyId);
}

function calculatePercentages(items, total) {
  if (total <= 0) {
    return items.map(() => 0);
  }

  const rawPercentages = items.map(item => item.count / total * 100);
  const floored = rawPercentages.map(p => Math.floor(p));
  let remainder = 100 - floored.reduce((sum, p) => sum + p, 0);

  const differences = rawPercentages.map((p, i) => ({
    index: i,
    diff: p - floored[i]
  }));

  differences.sort((a, b) => b.diff - a.diff);

  const result = [...floored];
  let i = 0;
  while (remainder > 0) {
    result[differences[i % differences.length].index]++;
    remainder--;
    i++;
  }

  return result;
}

function getSurveyStatistics(surveyId) {
  const survey = getSurveyDetail(surveyId);
  if (!survey) return null;

  const responses = getSurveyResponses(surveyId);
  const questions = survey.questions || [];

  const stats = questions.map(q => {
    const stat = {
      id: q.id,
      title: q.title,
      type: q.type,
      totalCount: responses.length
    };

    if (q.type === 'single') {
      const optionCounts = (q.options || []).map(opt => ({
        label: opt,
        count: 0,
        percentage: 0
      }));

      responses.forEach(r => {
        const answer = r.answers.find(a => a.questionId === q.id);
        if (answer && answer.value) {
          const idx = q.options.indexOf(answer.value);
          if (idx > -1) {
            optionCounts[idx].count++;
          }
        }
      });

      const singlePercentages = calculatePercentages(optionCounts, responses.length);
      optionCounts.forEach((opt, idx) => {
        opt.percentage = singlePercentages[idx];
      });

      stat.options = optionCounts;
    } else if (q.type === 'multiple') {
      const optionCounts = (q.options || []).map(opt => ({
        label: opt,
        count: 0,
        percentage: 0
      }));

      responses.forEach(r => {
        const answer = r.answers.find(a => a.questionId === q.id);
        if (answer && Array.isArray(answer.value)) {
          answer.value.forEach(v => {
            const idx = q.options.indexOf(v);
            if (idx > -1) {
              optionCounts[idx].count++;
            }
          });
        }
      });

      const totalSelections = optionCounts.reduce((sum, opt) => sum + opt.count, 0);
      const multiPercentages = calculatePercentages(optionCounts, totalSelections);
      optionCounts.forEach((opt, idx) => {
        opt.percentage = multiPercentages[idx];
      });

      stat.options = optionCounts;
    } else if (q.type === 'fill') {
      const fillAnswers = [];
      responses.forEach(r => {
        const answer = r.answers.find(a => a.questionId === q.id);
        if (answer && answer.value) {
          fillAnswers.push(answer.value);
        }
      });
      stat.fillAnswers = fillAnswers;
    }

    return stat;
  });

  return {
    survey,
    totalResponses: responses.length,
    questionStats: stats
  };
}

// ==================== 消息通知 ====================

const DEFAULT_NOTIFICATION_SETTINGS = {
  system: true,
  interaction: true,
  transaction: true,
  activity: true,
  survey: true
};

function getNotificationSettings() {
  const settings = storage.get(STORAGE_KEYS.NOTIFICATION_SETTINGS);
  return { ...DEFAULT_NOTIFICATION_SETTINGS, ...(settings || {}) };
}

function updateNotificationSettings(type, enabled) {
  const settings = getNotificationSettings();
  settings[type] = enabled;
  return storage.set(STORAGE_KEYS.NOTIFICATION_SETTINGS, settings);
}

function getNotificationList(filters = {}) {
  let list = storage.getList(STORAGE_KEYS.NOTIFICATIONS);

  if (filters.type) {
    list = list.filter(item => item.type === filters.type);
  }

  if (filters.read !== undefined) {
    list = list.filter(item => item.read === filters.read);
  }

  return list.sort((a, b) => b.createTime - a.createTime);
}

function getNotificationDetail(id) {
  const list = storage.getList(STORAGE_KEYS.NOTIFICATIONS);
  return list.find(item => item.id === id) || null;
}

function createNotification(data) {
  const settings = getNotificationSettings();
  if (settings[data.type] === false) {
    return null;
  }

  const item = {
    id: util.generateId(),
    ...data,
    read: false,
    createTime: Date.now()
  };

  const success = storage.addToList(STORAGE_KEYS.NOTIFICATIONS, item);
  return success ? item : null;
}

function markNotificationRead(id) {
  return storage.updateInList(STORAGE_KEYS.NOTIFICATIONS, id, { read: true });
}

function markAllNotificationsRead(type = '') {
  const list = storage.getList(STORAGE_KEYS.NOTIFICATIONS);
  const updatedList = list.map(item => {
    if (type && item.type !== type) return item;
    return { ...item, read: true };
  });
  return storage.set(STORAGE_KEYS.NOTIFICATIONS, updatedList);
}

function getUnreadCount(type = '') {
  const list = storage.getList(STORAGE_KEYS.NOTIFICATIONS);
  const unread = list.filter(item => {
    if (type && item.type !== type) return false;
    return !item.read;
  });
  return unread.length;
}

function getUnreadCountByType() {
  const list = storage.getList(STORAGE_KEYS.NOTIFICATIONS);
  const counts = {};
  constants.NOTIFICATION_TYPES.forEach(type => {
    counts[type.value] = 0;
  });
  list.forEach(item => {
    if (!item.read && counts[item.type] !== undefined) {
      counts[item.type]++;
    }
  });
  return counts;
}

function deleteNotification(id) {
  return storage.removeFromList(STORAGE_KEYS.NOTIFICATIONS, id);
}

function clearNotifications(type = '') {
  if (type) {
    const list = storage.getList(STORAGE_KEYS.NOTIFICATIONS);
    const newList = list.filter(item => item.type !== type);
    return storage.set(STORAGE_KEYS.NOTIFICATIONS, newList);
  }
  return storage.clearList(STORAGE_KEYS.NOTIFICATIONS);
}

function convertWeatherAlertToNotification(alert) {
  const iconMap = {
    rainstorm: '⛈️',
    heat: '🌡️',
    other: '📢'
  };

  const levelColorMap = {
    danger: { color: '#FEE2E2', iconColor: '#EF4444' },
    warning: { color: '#FEF3C7', iconColor: '#F59E0B' },
    info: { color: '#DBEAFE', iconColor: '#3B82F6' }
  };

  const levelStyle = levelColorMap[alert.level] || levelColorMap.info;

  return {
    type: 'system',
    subType: 'weather_alert',
    title: alert.title,
    content: alert.content,
    extra: {
      alertId: alert.id,
      alertType: alert.type,
      level: alert.level,
      announcementId: alert.announcementId,
      preview: `有效期至 ${alert.validUntil}`,
      icon: iconMap[alert.type] || iconMap.other,
      typeColor: levelStyle.color,
      typeIconColor: levelStyle.iconColor
    },
    createTime: new Date(alert.publishTime).getTime()
  };
}

function syncWeatherAlertsToNotifications() {
  const weatherData = mockData.WEATHER_DATA;
  if (!weatherData || !weatherData.campusAlerts) {
    return [];
  }

  const existingNotifications = getNotificationList();
  const existingAlertIds = existingNotifications
    .filter(n => n.subType === 'weather_alert' && n.extra && n.extra.alertId)
    .map(n => n.extra.alertId);

  const createdNotifications = [];

  weatherData.campusAlerts.forEach(alert => {
    if (!existingAlertIds.includes(alert.id)) {
      const notificationData = convertWeatherAlertToNotification(alert);
      const created = createNotification(notificationData);
      if (created) {
        createdNotifications.push(created);
      }
    }
  });

  return createdNotifications;
}

function getWeatherAlertNotifications() {
  return getNotificationList({ type: 'system' })
    .filter(n => n.subType === 'weather_alert');
}

// ==================== 学习资料 ====================

function getStudyMaterialsList(filters = {}) {
  initStudyMaterials();
  let list = storage.getList(STORAGE_KEYS.STUDY_MATERIALS_LIST);

  if (filters.category) {
    list = list.filter(item => item.category === filters.category);
  }

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['title', 'description', 'courseName', 'teacher', 'semester']);
  }

  if (filters.courseName) {
    list = list.filter(item => item.courseName && item.courseName.includes(filters.courseName));
  }

  if (filters.teacher) {
    list = list.filter(item => item.teacher && item.teacher.includes(filters.teacher));
  }

  if (filters.semester) {
    list = list.filter(item => item.semester === filters.semester);
  }

  if (filters.timeRange) {
    const timeThreshold = getTimeRangeMs(filters.timeRange);
    if (timeThreshold) {
      list = list.filter(item => item.createTime >= timeThreshold);
    }
  }

  return sortByField(list, filters.sort || 'latest', constants.SORT_OPTIONS);
}

function getStudyMaterialDetail(id) {
  initStudyMaterials();
  const list = storage.getList(STORAGE_KEYS.STUDY_MATERIALS_LIST);
  return list.find(item => item.id === id) || null;
}

function publishStudyMaterial(data) {
  initStudyMaterials();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const item = {
    id: util.generateId(),
    ...data,
    uploaderId: userInfo.id || 'anonymous',
    uploaderName: userInfo.nickName || '匿名用户',
    uploaderAvatar: userInfo.avatarUrl || '',
    downloads: 0,
    favorites: 0,
    views: 0,
    createTime: Date.now(),
    updateTime: Date.now()
  };

  const success = storage.addToList(STORAGE_KEYS.STUDY_MATERIALS_LIST, item);
  return success ? item : null;
}

function increaseStudyMaterialDownloads(id) {
  const item = getStudyMaterialDetail(id);
  if (item) {
    return storage.updateInList(STORAGE_KEYS.STUDY_MATERIALS_LIST, id, {
      downloads: (item.downloads || 0) + 1
    });
  }
  return false;
}

function increaseStudyMaterialFavorites(id, increment = 1) {
  const item = getStudyMaterialDetail(id);
  if (item) {
    return storage.updateInList(STORAGE_KEYS.STUDY_MATERIALS_LIST, id, {
      favorites: Math.max(0, (item.favorites || 0) + increment)
    });
  }
  return false;
}

function increaseStudyMaterialViews(id) {
  const item = getStudyMaterialDetail(id);
  if (item) {
    return storage.updateInList(STORAGE_KEYS.STUDY_MATERIALS_LIST, id, {
      views: (item.views || 0) + 1
    });
  }
  return false;
}

// ==================== 悬赏求助 ====================

function getStudyRewardsList(filters = {}) {
  initStudyRewards();
  let list = storage.getList(STORAGE_KEYS.STUDY_REWARDS_LIST);

  if (filters.category) {
    list = list.filter(item => item.category === filters.category);
  }

  if (filters.status) {
    list = list.filter(item => item.status === filters.status);
  }

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['title', 'description', 'courseName', 'teacher', 'semester']);
  }

  if (filters.timeRange) {
    const timeThreshold = getTimeRangeMs(filters.timeRange);
    if (timeThreshold) {
      list = list.filter(item => item.createTime >= timeThreshold);
    }
  }

  return sortByField(list, filters.sort || 'latest', constants.SORT_OPTIONS);
}

function getStudyRewardDetail(id) {
  initStudyRewards();
  const list = storage.getList(STORAGE_KEYS.STUDY_REWARDS_LIST);
  return list.find(item => item.id === id) || null;
}

function publishStudyReward(data) {
  initStudyRewards();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const item = {
    id: util.generateId(),
    ...data,
    publisherId: userInfo.id || 'anonymous',
    publisherName: userInfo.nickName || '匿名用户',
    publisherAvatar: userInfo.avatarUrl || '',
    status: 'open',
    responses: [],
    views: 0,
    createTime: Date.now(),
    updateTime: Date.now()
  };

  const success = storage.addToList(STORAGE_KEYS.STUDY_REWARDS_LIST, item);
  return success ? item : null;
}

function addRewardResponse(rewardId, content, fileLinks = []) {
  const reward = getStudyRewardDetail(rewardId);
  if (!reward) return null;

  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const response = {
    id: util.generateId(),
    rewardId,
    responderId: userInfo.id || 'anonymous',
    responderName: userInfo.nickName || '匿名用户',
    responderAvatar: userInfo.avatarUrl || '',
    content,
    fileLinks,
    isAdopted: false,
    createTime: Date.now()
  };

  const responses = [...(reward.responses || []), response];
  const success = storage.updateInList(STORAGE_KEYS.STUDY_REWARDS_LIST, rewardId, {
    responses,
    updateTime: Date.now()
  });

  return success ? response : null;
}

function adoptRewardResponse(rewardId, responseId) {
  const reward = getStudyRewardDetail(rewardId);
  if (!reward) return false;

  const responses = (reward.responses || []).map(r => ({
    ...r,
    isAdopted: r.id === responseId
  }));

  return storage.updateInList(STORAGE_KEYS.STUDY_REWARDS_LIST, rewardId, {
    responses,
    status: 'adopted',
    adoptedResponseId: responseId,
    updateTime: Date.now()
  });
}

function closeStudyReward(rewardId) {
  const reward = getStudyRewardDetail(rewardId);
  if (!reward) return false;

  const success = storage.updateInList(STORAGE_KEYS.STUDY_REWARDS_LIST, rewardId, {
    status: 'closed',
    updateTime: Date.now()
  });

  if (success && reward.status === 'open') {
    updateUserPoints(reward.rewardPoints);
    return { success: true, refunded: reward.rewardPoints };
  }

  return success ? { success: true, refunded: 0 } : false;
}

function increaseStudyRewardViews(id) {
  const item = getStudyRewardDetail(id);
  if (item) {
    return storage.updateInList(STORAGE_KEYS.STUDY_REWARDS_LIST, id, {
      views: (item.views || 0) + 1
    });
  }
  return false;
}

// ==================== 用户积分 ====================

function getUserPoints() {
  const points = storage.get(STORAGE_KEYS.USER_POINTS);
  return typeof points === 'number' ? points : 100;
}

function updateUserPoints(amount) {
  const current = getUserPoints();
  const newPoints = Math.max(0, current + amount);
  storage.set(STORAGE_KEYS.USER_POINTS, newPoints);
  return newPoints;
}

function grantRewardPoints(responderId, points) {
  const app = getApp();
  const currentUser = app.globalData.userInfo || {};

  if (responderId === currentUser.id || responderId === 'test_user') {
    updateUserPoints(points);
    return true;
  }

  const transactions = storage.get(STORAGE_KEYS.POINT_TRANSACTIONS) || [];
  transactions.unshift({
    id: 'txn_' + Date.now(),
    type: 'reward_grant',
    responderId,
    points,
    createTime: Date.now()
  });
  storage.set(STORAGE_KEYS.POINT_TRANSACTIONS, transactions.slice(0, 100));
  return true;
}

// ==================== 校园黄页 ====================

function getEmergencyPhones() {
  return mockData.EMERGENCY_PHONES || [];
}

function getPhonebookCategories() {
  return mockData.PHONEBOOK_CATEGORIES || [];
}

function getPhonebookAllItems() {
  const categories = getPhonebookCategories();
  const allItems = [];
  categories.forEach(category => {
    (category.items || []).forEach(item => {
      allItems.push({
        ...item,
        categoryId: category.id,
        categoryName: category.name,
        categoryIcon: category.icon,
        categoryColor: category.color,
        categoryIconColor: category.iconColor
      });
    });
  });
  return allItems;
}

function getPhonebookItemsByCategory(categoryValue) {
  const categoryMap = {
    'department': 'c1',
    'logistics': 'c2',
    'medical': 'c3',
    'security': 'c4',
    'express': 'c5'
  };
  const categoryId = categoryMap[categoryValue];
  if (!categoryId) return [];

  const categories = getPhonebookCategories();
  const category = categories.find(c => c.id === categoryId);
  if (!category) return [];

  return (category.items || []).map(item => ({
    ...item,
    categoryId: category.id,
    categoryName: category.name,
    categoryIcon: category.icon,
    categoryColor: category.color,
    categoryIconColor: category.iconColor
  }));
}

function searchPhonebook(keyword) {
  if (!keyword) return [];
  const allItems = getPhonebookAllItems();
  return filterByKeyword(allItems, keyword, ['name', 'phone', 'address']);
}

function getServiceGuides() {
  return mockData.SERVICE_GUIDES || [];
}

function getServiceGuideDetail(type) {
  const details = mockData.SERVICE_GUIDE_DETAILS || {};
  return details[type] || null;
}

function makePhoneCall(phoneNumber) {
  return new Promise((resolve, reject) => {
    wx.makePhoneCall({
      phoneNumber,
      success: resolve,
      fail: reject
    });
  });
}

// ==================== 校园商家 ====================

function initCampusShops() {
  if (campusShopsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.CAMPUS_SHOP_LIST);
  if (!existing || existing.length === 0) {
    const now = Date.now();
    const shops = mockData.MOCK_CAMPUS_SHOPS.map((item, index) => ({
      id: 'mock_shop_' + index + '_' + now,
      ...item,
      views: Math.floor(Math.random() * 500) + 50,
      createTime: now - (index + 1) * 86400000,
      updateTime: now - (index + 1) * 86400000
    }));
    storage.set(STORAGE_KEYS.CAMPUS_SHOP_LIST, shops);
  }
  campusShopsInitialized = true;
}

function initShopReviews() {
  if (shopReviewsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.SHOP_REVIEWS);
  if (!existing || Object.keys(existing).length === 0) {
    const shops = storage.getList(STORAGE_KEYS.CAMPUS_SHOP_LIST);
    const reviewsMap = {};
    mockData.MOCK_SHOP_REVIEWS.forEach(mockReview => {
      const shop = shops[mockReview.shopIndex];
      if (shop) {
        reviewsMap[shop.id] = mockReview.reviews.map((r, idx) => ({
          id: 'review_' + mockReview.shopIndex + '_' + idx + '_' + Date.now(),
          shopId: shop.id,
          ...r
        }));
      }
    });
    storage.set(STORAGE_KEYS.SHOP_REVIEWS, reviewsMap);
  }
  shopReviewsInitialized = true;
}

function getCampusShopList(filters = {}) {
  initCampusShops();
  let list = storage.getList(STORAGE_KEYS.CAMPUS_SHOP_LIST);

  if (filters.category && filters.category !== 'all') {
    list = list.filter(item => item.category === filters.category);
  }

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['name', 'description', 'address']);
  }

  if (filters.studentDiscount) {
    list = list.filter(item => item.studentDiscount);
  }

  return sortByField(list, filters.sort || 'default', constants.SHOP_SORT_OPTIONS);
}

function getCampusShopDetail(id) {
  initCampusShops();
  const list = storage.getList(STORAGE_KEYS.CAMPUS_SHOP_LIST);
  return list.find(item => item.id === id) || null;
}

function increaseShopViews(id) {
  const item = getCampusShopDetail(id);
  if (item) {
    return storage.updateInList(STORAGE_KEYS.CAMPUS_SHOP_LIST, id, {
      views: (item.views || 0) + 1
    });
  }
  return false;
}

function getShopReviews(shopId) {
  initShopReviews();
  const reviewsMap = storage.get(STORAGE_KEYS.SHOP_REVIEWS) || {};
  return reviewsMap[shopId] || [];
}

function addShopReview(shopId, reviewData) {
  initShopReviews();
  const reviewsMap = storage.get(STORAGE_KEYS.SHOP_REVIEWS) || {};
  const reviews = reviewsMap[shopId] || [];

  const review = {
    id: util.generateId(),
    shopId,
    ...reviewData,
    createTime: Date.now()
  };

  reviews.unshift(review);
  reviewsMap[shopId] = reviews;
  storage.set(STORAGE_KEYS.SHOP_REVIEWS, reviewsMap);

  const shop = getCampusShopDetail(shopId);
  if (shop) {
    const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    const newRating = Math.round(totalRating / reviews.length * 10) / 10;
    storage.updateInList(STORAGE_KEYS.CAMPUS_SHOP_LIST, shopId, {
      rating: newRating,
      reviewCount: reviews.length,
      updateTime: Date.now()
    });
  }

  return review;
}

// ==================== 志愿服务 ====================

function getVolunteerActivityList(filters = {}) {
  initVolunteerData();
  let list = storage.getList(STORAGE_KEYS.VOLUNTEER_ACTIVITY_LIST);

  if (filters.status) {
    list = list.filter(item => item.status === filters.status);
  }

  if (filters.category) {
    list = list.filter(item => item.category === filters.category);
  }

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['title', 'description', 'location']);
  }

  return list.sort((a, b) => b.createTime - a.createTime);
}

function getVolunteerActivityDetail(id) {
  initVolunteerData();
  const list = storage.getList(STORAGE_KEYS.VOLUNTEER_ACTIVITY_LIST);
  return list.find(item => item.id === id) || null;
}

function publishVolunteerActivity(data) {
  initVolunteerData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const item = {
    id: util.generateId(),
    ...data,
    publisherId: userInfo.id || 'admin',
    publisherName: userInfo.nickName || '管理员',
    registrations: [],
    views: 0,
    createTime: Date.now(),
    updateTime: Date.now()
  };

  const success = storage.addToList(STORAGE_KEYS.VOLUNTEER_ACTIVITY_LIST, item);
  return success ? item : null;
}

function updateVolunteerActivity(id, updates) {
  return storage.updateInList(STORAGE_KEYS.VOLUNTEER_ACTIVITY_LIST, id, {
    ...updates,
    updateTime: Date.now()
  });
}

function increaseVolunteerViews(id) {
  const item = getVolunteerActivityDetail(id);
  if (item) {
    return storage.updateInList(STORAGE_KEYS.VOLUNTEER_ACTIVITY_LIST, id, {
      views: (item.views || 0) + 1
    });
  }
  return false;
}

function registerVolunteerActivity(activityId) {
  initVolunteerData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'test_user';
  const userName = userInfo.nickName || '志愿者';

  const activity = getVolunteerActivityDetail(activityId);
  if (!activity) return { success: false, message: '活动不存在' };

  if (activity.status !== 'recruiting') {
    return { success: false, message: '活动不在招募中' };
  }

  const registrations = activity.registrations || [];
  const alreadyRegistered = registrations.some(r => r.userId === userId);
  if (alreadyRegistered) {
    return { success: false, message: '您已报名该活动' };
  }

  if (registrations.length >= activity.requiredCount) {
    return { success: false, message: '报名人数已满' };
  }

  const registration = {
    id: util.generateId(),
    userId,
    userName,
    status: 'registered',
    registerTime: Date.now()
  };

  registrations.push(registration);
  storage.updateInList(STORAGE_KEYS.VOLUNTEER_ACTIVITY_LIST, activityId, {
    registrations,
    updateTime: Date.now()
  });

  return { success: true, registration };
}

function cancelVolunteerRegistration(activityId) {
  initVolunteerData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'test_user';

  const activity = getVolunteerActivityDetail(activityId);
  if (!activity) return false;

  const registrations = (activity.registrations || []).filter(r => r.userId !== userId);
  return storage.updateInList(STORAGE_KEYS.VOLUNTEER_ACTIVITY_LIST, activityId, {
    registrations,
    updateTime: Date.now()
  });
}

function checkinVolunteer(activityId, userId) {
  initVolunteerData();
  const activity = getVolunteerActivityDetail(activityId);
  if (!activity) return { success: false, message: '活动不存在' };

  const registrations = activity.registrations || [];
  const regIndex = registrations.findIndex(r => r.userId === userId);
  if (regIndex === -1) return { success: false, message: '未报名该活动' };

  if (registrations[regIndex].status === 'checked_in') {
    return { success: false, message: '已签到' };
  }

  if (registrations[regIndex].status === 'completed') {
    return { success: false, message: '已完成签到签退' };
  }

  registrations[regIndex] = {
    ...registrations[regIndex],
    status: 'checked_in',
    checkinTime: Date.now()
  };

  storage.updateInList(STORAGE_KEYS.VOLUNTEER_ACTIVITY_LIST, activityId, {
    registrations,
    updateTime: Date.now()
  });

  return { success: true };
}

function checkoutVolunteer(activityId, userId) {
  initVolunteerData();
  const activity = getVolunteerActivityDetail(activityId);
  if (!activity) return { success: false, message: '活动不存在' };

  const registrations = activity.registrations || [];
  const regIndex = registrations.findIndex(r => r.userId === userId);
  if (regIndex === -1) return { success: false, message: '未报名该活动' };

  if (registrations[regIndex].status !== 'checked_in') {
    return { success: false, message: '请先签到' };
  }

  registrations[regIndex] = {
    ...registrations[regIndex],
    status: 'completed',
    checkoutTime: Date.now()
  };

  storage.updateInList(STORAGE_KEYS.VOLUNTEER_ACTIVITY_LIST, activityId, {
    registrations,
    status: 'completed',
    updateTime: Date.now()
  });

  const hoursRecord = {
    id: util.generateId(),
    userId,
    userName: registrations[regIndex].userName,
    activityId,
    activityTitle: activity.title,
    hours: activity.hours,
    category: activity.category,
    semester: getCurrentSemester(),
    createTime: Date.now()
  };
  storage.addToList(STORAGE_KEYS.VOLUNTEER_HOURS_RECORD_LIST, hoursRecord);

  return { success: true, hours: activity.hours };
}

function scanCheckin(activityId) {
  initVolunteerData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'test_user';

  const activity = getVolunteerActivityDetail(activityId);
  if (!activity) return { success: false, message: '活动不存在' };

  const registrations = activity.registrations || [];
  const reg = registrations.find(r => r.userId === userId);

  if (!reg) {
    return registerVolunteerActivity(activityId);
  }

  if (reg.status === 'registered') {
    return checkinVolunteer(activityId, userId);
  }

  if (reg.status === 'checked_in') {
    return checkoutVolunteer(activityId, userId);
  }

  return { success: false, message: '已完成签到签退' };
}

function getCurrentSemester() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  if (month >= 2 && month <= 7) {
    return year + '-' + (year + 1) + '-2';
  } else {
    const y = month >= 8 ? year : year - 1;
    return y + '-' + (y + 1) + '-1';
  }
}

function getUserVolunteerHours(userId, semester) {
  initVolunteerData();
  const records = storage.getList(STORAGE_KEYS.VOLUNTEER_HOURS_RECORD_LIST);
  let userRecords = records.filter(r => r.userId === userId);

  if (semester) {
    userRecords = userRecords.filter(r => r.semester === semester);
  }

  const totalHours = userRecords.reduce((sum, r) => sum + (r.hours || 0), 0);
  const activityCount = userRecords.length;

  return {
    totalHours,
    activityCount,
    records: userRecords.sort((a, b) => b.createTime - a.createTime),
    semester
  };
}

function getVolunteerHoursByCategory(userId) {
  initVolunteerData();
  const records = storage.getList(STORAGE_KEYS.VOLUNTEER_HOURS_RECORD_LIST);
  const userRecords = records.filter(r => r.userId === userId);

  const categoryMap = {};
  userRecords.forEach(r => {
    if (!categoryMap[r.category]) {
      categoryMap[r.category] = { category: r.category, hours: 0, count: 0 };
    }
    categoryMap[r.category].hours += r.hours || 0;
    categoryMap[r.category].count += 1;
  });

  return Object.values(categoryMap).sort((a, b) => b.hours - a.hours);
}

function getVolunteerLeaderboard(semester) {
  initVolunteerData();
  const records = storage.getList(STORAGE_KEYS.VOLUNTEER_HOURS_RECORD_LIST);
  let filteredRecords = records;

  if (semester) {
    filteredRecords = records.filter(r => r.semester === semester);
  }

  const userMap = {};
  filteredRecords.forEach(r => {
    if (!userMap[r.userId]) {
      userMap[r.userId] = {
        userId: r.userId,
        userName: r.userName || '未知用户',
        totalHours: 0,
        activityCount: 0
      };
    }
    userMap[r.userId].totalHours += r.hours || 0;
    userMap[r.userId].activityCount += 1;
  });

  return Object.values(userMap).sort((a, b) => b.totalHours - a.totalHours);
}

function getUserRegistrations(userId) {
  initVolunteerData();
  const activities = storage.getList(STORAGE_KEYS.VOLUNTEER_ACTIVITY_LIST);
  const result = [];

  activities.forEach(activity => {
    const reg = (activity.registrations || []).find(r => r.userId === userId);
    if (reg) {
      result.push({
        ...activity,
        userRegistration: reg
      });
    }
  });

  return result.sort((a, b) => b.createTime - a.createTime);
}

let errandDataInitialized = false;

function initErrandData() {
  if (errandDataInitialized) return;
  const now = Date.now();
  const existingOrders = storage.get(STORAGE_KEYS.ERRAND_ORDER_LIST);
  if (!existingOrders || existingOrders.length === 0) {
    const orders = mockData.MOCK_ERRAND_ORDERS.map((item, index) => ({
      id: 'mock_errand_' + index + '_' + now,
      ...item,
      createTime: now - (index + 1) * 3600000,
      updateTime: now - (index + 1) * 3600000
    }));
    storage.set(STORAGE_KEYS.ERRAND_ORDER_LIST, orders);
  }
  const existingAddresses = storage.get(STORAGE_KEYS.ERRAND_ADDRESS_LIST);
  if (!existingAddresses || existingAddresses.length === 0) {
    const addresses = mockData.MOCK_ERRAND_ADDRESSES.map((item, index) => ({
      id: 'mock_addr_' + index + '_' + now,
      ...item,
      isDefault: index === 0
    }));
    storage.set(STORAGE_KEYS.ERRAND_ADDRESS_LIST, addresses);
  }
  const existingRunners = storage.get(STORAGE_KEYS.ERRAND_RUNNER_LIST);
  if (!existingRunners || existingRunners.length === 0) {
    storage.set(STORAGE_KEYS.ERRAND_RUNNER_LIST, mockData.MOCK_ERRAND_RUNNERS);
  }
  const existingViolations = storage.get(STORAGE_KEYS.ERRAND_VIOLATION_LIST);
  if (!existingViolations || existingViolations.length === 0) {
    storage.set(STORAGE_KEYS.ERRAND_VIOLATION_LIST, mockData.MOCK_ERRAND_VIOLATIONS);
  }
  errandDataInitialized = true;
}

function containsSensitiveWord(text) {
  if (!text) return false;
  return constants.SENSITIVE_WORDS.some(word => text.includes(word));
}

function getErrandHallList(filters = {}) {
  initErrandData();
  let list = storage.getList(STORAGE_KEYS.ERRAND_ORDER_LIST);

  if (filters.type) {
    list = list.filter(item => item.type === filters.type);
  }
  if (filters.status && filters.status !== 'all') {
    if (filters.status === 'accepted') {
      list = list.filter(item => item.status === 'accepted' || item.status === 'in_progress');
    } else {
      list = list.filter(item => item.status === filters.status);
    }
  }
  if (filters.bountyRange && filters.bountyRange.min !== undefined) {
    list = list.filter(item => item.bounty >= filters.bountyRange.min && item.bounty < filters.bountyRange.max);
  }
  if (filters.distanceRange && filters.distanceRange.min !== undefined) {
    list = list.filter(item => (item.distance || 0) >= filters.distanceRange.min && (item.distance || 0) < filters.distanceRange.max);
  }
  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    list = list.filter(item =>
      (item.remark && item.remark.toLowerCase().includes(kw)) ||
      (item.pickupLocation && item.pickupLocation.toLowerCase().includes(kw)) ||
      (item.deliveryLocation && item.deliveryLocation.toLowerCase().includes(kw)) ||
      (item.purchaseItem && item.purchaseItem.toLowerCase().includes(kw)) ||
      (item.otherDesc && item.otherDesc.toLowerCase().includes(kw))
    );
  }

  const sortField = filters.sortField || 'createTime';
  const sortOrder = filters.sortOrder || 'desc';
  list.sort((a, b) => {
    const aVal = a[sortField] || 0;
    const bVal = b[sortField] || 0;
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });
  return list;
}

function getErrandOrderList(filters = {}) {
  initErrandData();
  let list = storage.getList(STORAGE_KEYS.ERRAND_ORDER_LIST);
  if (filters.status && filters.status !== 'all') {
    list = list.filter(item => item.status === filters.status);
  }
  if (filters.type) {
    list = list.filter(item => item.type === filters.type);
  }
  if (filters.userId) {
    list = list.filter(item => item.userId === filters.userId);
  }
  if (filters.runnerId) {
    list = list.filter(item => item.runnerId === filters.runnerId);
  }
  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['pickupCode', 'deliveryLocation', 'purchaseItem', 'otherDesc', 'remark']);
  }
  return list.sort((a, b) => b.createTime - a.createTime);
}

function getMyPublishedOrders(userId) {
  initErrandData();
  return storage.getList(STORAGE_KEYS.ERRAND_ORDER_LIST)
    .filter(item => item.userId === userId)
    .sort((a, b) => b.createTime - a.createTime);
}

function getMyAcceptedOrders(runnerId) {
  initErrandData();
  return storage.getList(STORAGE_KEYS.ERRAND_ORDER_LIST)
    .filter(item => item.runnerId === runnerId)
    .sort((a, b) => b.createTime - a.createTime);
}

function getErrandOrderDetail(id) {
  initErrandData();
  return storage.getList(STORAGE_KEYS.ERRAND_ORDER_LIST).find(item => item.id === id) || null;
}

function checkTimeoutOrders() {
  initErrandData();
  const list = storage.getList(STORAGE_KEYS.ERRAND_ORDER_LIST);
  const now = Date.now();
  let changed = false;
  list.forEach(item => {
    if (item.status === 'pending' && item.deadline && now > item.deadline) {
      item.status = 'timeout';
      item.escrowStatus = 'refunded';
      item.updateTime = now;
      changed = true;
    }
  });
  if (changed) storage.set(STORAGE_KEYS.ERRAND_ORDER_LIST, list);
  return changed;
}

function createErrandOrder(data) {
  initErrandData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  if (containsSensitiveWord(data.remark) || containsSensitiveWord(data.otherDesc) || containsSensitiveWord(data.purchaseItem)) {
    return { error: '内容包含敏感词，请修改后重新发布' };
  }

  const taskType = constants.ERRAND_TASK_TYPES.find(t => t.value === data.type);
  const item = {
    id: util.generateId(),
    ...data,
    typeText: taskType ? taskType.label : data.type,
    userId: userInfo.id || 'test_user',
    userName: userInfo.nickName || '张同学',
    userAvatar: userInfo.avatarUrl || '',
    status: 'pending',
    escrowStatus: data.bounty > 0 ? 'frozen' : '',
    createTime: Date.now(),
    updateTime: Date.now()
  };
  storage.addToList(STORAGE_KEYS.ERRAND_ORDER_LIST, item);
  return item;
}

function acceptErrandOrder(orderId) {
  initErrandData();
  const order = getErrandOrderDetail(orderId);
  if (!order) return { error: '订单不存在' };
  if (order.status !== 'pending') return { error: '该订单已被接单或已取消' };
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  if (order.userId === (userInfo.id || 'test_user')) return { error: '不能接自己发布的订单' };
  const result = storage.updateInList(STORAGE_KEYS.ERRAND_ORDER_LIST, orderId, {
    status: 'accepted',
    runnerId: userInfo.id || 'test_user',
    runnerName: userInfo.nickName || '张同学',
    runnerAvatar: userInfo.avatarUrl || '',
    acceptedTime: Date.now(),
    updateTime: Date.now()
  });
  if (result) updateRunnerStats(userInfo.id || 'test_user', 'accept');
  return result || { error: '接单失败' };
}

function startErrandOrder(orderId) {
  initErrandData();
  const order = getErrandOrderDetail(orderId);
  if (!order) return { error: '订单不存在' };
  if (order.status !== 'accepted') return { error: '当前状态无法开始任务' };
  return storage.updateInList(STORAGE_KEYS.ERRAND_ORDER_LIST, orderId, {
    status: 'in_progress',
    startedTime: Date.now(),
    updateTime: Date.now()
  }) || { error: '操作失败' };
}

function completeErrandOrder(orderId) {
  initErrandData();
  const order = getErrandOrderDetail(orderId);
  if (!order) return { error: '订单不存在' };
  if (order.status !== 'in_progress' && order.status !== 'accepted') return { error: '当前状态无法完成任务' };
  const result = storage.updateInList(STORAGE_KEYS.ERRAND_ORDER_LIST, orderId, {
    status: 'completed',
    completedTime: Date.now(),
    escrowStatus: 'released',
    updateTime: Date.now()
  });
  if (result) updateRunnerStats(order.runnerId, 'complete');
  return result || { error: '操作失败' };
}

function rateErrandOrder(orderId, ratingType, ratingData) {
  initErrandData();
  const order = getErrandOrderDetail(orderId);
  if (!order) return { error: '订单不存在' };
  if (order.status !== 'completed') return { error: '只能评价已完成的订单' };
  const updateKey = ratingType === 'publisher' ? 'publisherRating' : 'runnerRating';
  if (order[updateKey]) return { error: '已经评价过了' };
  const update = { updateTime: Date.now() };
  update[updateKey] = { score: ratingData.score, tags: ratingData.tags || [], comment: ratingData.comment || '', time: Date.now() };
  return storage.updateInList(STORAGE_KEYS.ERRAND_ORDER_LIST, orderId, update);
}

function cancelErrandOrder(id, reason) {
  const order = getErrandOrderDetail(id);
  if (!order) return { error: '订单不存在' };
  if (order.status !== 'pending' && order.status !== 'accepted') return { error: '当前状态无法取消' };
  const result = storage.updateInList(STORAGE_KEYS.ERRAND_ORDER_LIST, id, {
    status: 'cancelled',
    escrowStatus: 'refunded',
    cancelReason: reason || '',
    updateTime: Date.now()
  });
  if (result && order.status === 'accepted' && order.runnerId) {
    updateRunnerStats(order.runnerId, 'cancel');
  }
  return result || { error: '取消失败' };
}

function updateErrandOrder(id, updates) {
  return storage.updateInList(STORAGE_KEYS.ERRAND_ORDER_LIST, id, { ...updates, updateTime: Date.now() });
}

function getRunnerProfile(userId) {
  initErrandData();
  return storage.getList(STORAGE_KEYS.ERRAND_RUNNER_LIST).find(item => item.id === userId) || null;
}

function updateRunnerStats(userId, action) {
  initErrandData();
  const list = storage.getList(STORAGE_KEYS.ERRAND_RUNNER_LIST);
  const idx = list.findIndex(item => item.id === userId);
  if (idx === -1) {
    const app = getApp();
    const userInfo = app.globalData.userInfo || {};
    list.push({ id: userId, name: userInfo.nickName || '张同学', avatar: userInfo.avatarUrl || '', creditScore: 100, totalOrders: 0, completedOrders: 0, goodRate: 100, violationCount: 0, level: 'excellent' });
    storage.set(STORAGE_KEYS.ERRAND_RUNNER_LIST, list);
    return;
  }
  const runner = list[idx];
  if (action === 'accept') runner.totalOrders = (runner.totalOrders || 0) + 1;
  else if (action === 'complete') {
    runner.completedOrders = (runner.completedOrders || 0) + 1;
    const completedRate = runner.totalOrders > 0 ? Math.round((runner.completedOrders / runner.totalOrders) * 100) : 100;
    runner.creditScore = Math.min(100, Math.max(0, completedRate));
  } else if (action === 'cancel') {
    runner.creditScore = Math.max(0, (runner.creditScore || 100) - 5);
    runner.violationCount = (runner.violationCount || 0) + 1;
  }
  const levelInfo = constants.ERRAND_CREDIT_LEVELS.find(l => runner.creditScore >= l.min && runner.creditScore <= l.max);
  runner.level = levelInfo ? levelInfo.label : '一般';
  list[idx] = runner;
  storage.set(STORAGE_KEYS.ERRAND_RUNNER_LIST, list);
}

function getRunnerCreditDetail(userId) {
  initErrandData();
  const runner = getRunnerProfile(userId);
  if (!runner) return null;
  const allOrders = storage.getList(STORAGE_KEYS.ERRAND_ORDER_LIST);
  const runnerOrders = allOrders.filter(item => item.runnerId === userId);
  const completedOrders = runnerOrders.filter(item => item.status === 'completed');
  const ratedOrders = completedOrders.filter(item => item.publisherRating);
  const goodRatings = ratedOrders.filter(item => item.publisherRating.score >= 4);
  const goodRate = ratedOrders.length > 0 ? Math.round((goodRatings.length / ratedOrders.length) * 100) : 100;
  const completionRate = runnerOrders.length > 0 ? Math.round((completedOrders.length / runnerOrders.length) * 100) : 0;
  const violations = storage.getList(STORAGE_KEYS.ERRAND_VIOLATION_LIST).filter(v => v.userId === userId);
  return { ...runner, goodRate, completionRate, totalCompleted: completedOrders.length, totalAccepted: runnerOrders.length, violations };
}

function addViolation(userId, type, typeText, orderId, desc) {
  initErrandData();
  storage.addToList(STORAGE_KEYS.ERRAND_VIOLATION_LIST, {
    id: util.generateId(), userId, type, typeText, orderId, time: Date.now(), desc
  });
  updateRunnerStats(userId, 'violation');
}

function getAddressList() {
  initErrandData();
  return storage.getList(STORAGE_KEYS.ERRAND_ADDRESS_LIST);
}

function getAddressDetail(id) {
  initErrandData();
  return storage.getList(STORAGE_KEYS.ERRAND_ADDRESS_LIST).find(item => item.id === id) || null;
}

function addAddress(data) {
  initErrandData();
  const item = { id: util.generateId(), ...data, isDefault: data.isDefault || false };
  if (item.isDefault) {
    const list = storage.getList(STORAGE_KEYS.ERRAND_ADDRESS_LIST);
    list.forEach(addr => { addr.isDefault = false; });
    storage.set(STORAGE_KEYS.ERRAND_ADDRESS_LIST, list);
  }
  storage.addToList(STORAGE_KEYS.ERRAND_ADDRESS_LIST, item);
  return item;
}

function updateAddress(id, updates) {
  initErrandData();
  if (updates.isDefault) {
    const list = storage.getList(STORAGE_KEYS.ERRAND_ADDRESS_LIST);
    list.forEach(addr => { addr.isDefault = false; });
    storage.set(STORAGE_KEYS.ERRAND_ADDRESS_LIST, list);
  }
  return storage.updateInList(STORAGE_KEYS.ERRAND_ADDRESS_LIST, id, updates);
}

function deleteAddress(id) {
  initErrandData();
  return storage.removeFromList(STORAGE_KEYS.ERRAND_ADDRESS_LIST, id);
}

function getDefaultAddress() {
  initErrandData();
  const list = storage.getList(STORAGE_KEYS.ERRAND_ADDRESS_LIST);
  return list.find(item => item.isDefault) || (list.length > 0 ? list[0] : null);
}

function calculatePrintPrice(colorType, sideType, copies, pages) {
  const colorOption = constants.PRINT_COLOR_OPTIONS.find(o => o.value === colorType) || constants.PRINT_COLOR_OPTIONS[0];
  const sideOption = constants.PRINT_SIDE_OPTIONS.find(o => o.value === sideType) || constants.PRINT_SIDE_OPTIONS[0];
  return Math.max(0.1, colorOption.pricePerPage * sideOption.priceMultiplier * copies * pages);
}

// ==================== 租房模块 ====================

let rentalInitialized = false;

function initRentalData() {
  if (rentalInitialized) return;
  const existing = storage.get(STORAGE_KEYS.RENTAL_LIST);
  if (!existing || existing.length === 0) {
    const now = Date.now();
    const houses = mockData.MOCK_RENTAL_HOUSES.map((item, index) => ({
      id: 'mock_rent_' + index + '_' + now,
      ...item,
      views: Math.floor(Math.random() * 200) + 50,
      createTime: now - (index + 1) * 86400000,
      updateTime: now - (index + 1) * 86400000
    }));
    storage.set(STORAGE_KEYS.RENTAL_LIST, houses);
  }
  rentalInitialized = true;
}

function getRentalList(filters = {}) {
  initRentalData();
  let list = storage.getList(STORAGE_KEYS.RENTAL_LIST);

  if (filters.locationType) {
    list = list.filter(item => item.locationType === filters.locationType);
  }

  if (filters.rentType && filters.rentType !== 'all') {
    list = list.filter(item => item.rentType === filters.rentType);
  }

  if (filters.houseType) {
    list = list.filter(item => item.houseType === filters.houseType);
  }

  if (filters.genderRequirement && filters.genderRequirement !== 'no_limit') {
    list = list.filter(item =>
      item.genderRequirement === 'no_limit' || item.genderRequirement === filters.genderRequirement
    );
  }

  if (filters.publisherType) {
    list = list.filter(item => item.publisherType === filters.publisherType);
  }

  if (filters.minRent !== undefined) {
    list = list.filter(item => item.rent >= filters.minRent);
  }
  if (filters.maxRent !== undefined && filters.maxRent !== Infinity) {
    list = list.filter(item => item.rent <= filters.maxRent);
  }

  if (filters.minDistance !== undefined) {
    list = list.filter(item => item.distance >= filters.minDistance);
  }
  if (filters.maxDistance !== undefined && filters.maxDistance !== Infinity) {
    list = list.filter(item => item.distance <= filters.maxDistance);
  }

  if (filters.timeRange) {
    const timeThreshold = getTimeRangeMs(filters.timeRange);
    if (timeThreshold) {
      list = list.filter(item => item.createTime >= timeThreshold);
    }
  }

  list = filterByKeyword(list, filters.keyword, ['title', 'description', 'address']);

  if (filters.facilities && filters.facilities.length > 0) {
    list = list.filter(item =>
      filters.facilities.every(f => item.facilities && item.facilities.includes(f))
    );
  }

  if (filters.status) {
    list = list.filter(item => item.status === filters.status);
  }

  return sortByField(list, filters.sort || 'latest', constants.RENTAL_SORT_OPTIONS);
}

function getRentalDetail(id) {
  initRentalData();
  const list = storage.getList(STORAGE_KEYS.RENTAL_LIST);
  return list.find(item => item.id === id) || null;
}

function publishRentalHouse(data) {
  initRentalData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const item = {
    id: util.generateId(),
    ...data,
    publisherId: userInfo.id || 'anonymous',
    publisherName: userInfo.nickName || '匿名用户',
    publisherAvatar: userInfo.avatarUrl || '',
    status: 'available',
    views: 0,
    createTime: Date.now(),
    updateTime: Date.now()
  };

  const success = storage.addToList(STORAGE_KEYS.RENTAL_LIST, item);
  return success ? item : null;
}

function updateRentalHouse(id, updates) {
  return storage.updateInList(STORAGE_KEYS.RENTAL_LIST, id, {
    ...updates,
    updateTime: Date.now()
  });
}

function deleteRentalHouse(id) {
  return storage.removeFromList(STORAGE_KEYS.RENTAL_LIST, id);
}

function increaseRentalViews(id) {
  const item = getRentalDetail(id);
  if (item) {
    return storage.updateInList(STORAGE_KEYS.RENTAL_LIST, id, {
      views: (item.views || 0) + 1
    });
  }
  return false;
}

function reportAgent(houseId, reason) {
  const reports = storage.getList(STORAGE_KEYS.RENTAL_AGENT_REPORTS);
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const report = {
    id: util.generateId(),
    houseId,
    reporterId: userInfo.id || 'anonymous',
    reason,
    createTime: Date.now()
  };

  reports.push(report);
  storage.set(STORAGE_KEYS.RENTAL_AGENT_REPORTS, reports);

  let publisherTypeChanged = false;
  const reportsForHouse = reports.filter(r => r.houseId === houseId);
  if (reportsForHouse.length >= 3) {
    const house = getRentalDetail(houseId);
    if (house && house.publisherType !== 'agent') {
      updateRentalHouse(houseId, { publisherType: 'agent' });
      publisherTypeChanged = true;
    }
  }

  return { report, publisherTypeChanged };
}

function getAgentReports() {
  return storage.getList(STORAGE_KEYS.RENTAL_AGENT_REPORTS);
}

function toggleFavorite(id, type, itemData) {
  const isFav = isFavorite(id, type);
  if (isFav) {
    removeFavorite(id, type);
  } else {
    addFavorite(itemData, type);
  }
  return { isFavorite: !isFav };
}

function getCompareList() {
  const list = storage.getList(STORAGE_KEYS.RENTAL_COMPARE_LIST);
  return list.map(item => item.data ? item.data : item);
}

function addToCompare(house) {
  const rawList = storage.getList(STORAGE_KEYS.RENTAL_COMPARE_LIST);
  const list = rawList.map(item => item.data ? item.data : item);
  if (list.length >= 3) {
    return { success: false, message: '最多只能对比3套房源' };
  }
  if (list.some(item => item.id === house.id)) {
    return { success: false, message: '该房源已在对比列表中' };
  }
  const toSave = house.data ? house : { id: house.id, data: house, addTime: Date.now() };
  const newRawList = [...rawList, toSave];
  storage.set(STORAGE_KEYS.RENTAL_COMPARE_LIST, newRawList);
  return { success: true };
}

function removeFromCompare(houseId) {
  const rawList = storage.getList(STORAGE_KEYS.RENTAL_COMPARE_LIST);
  const newRawList = rawList.filter(item => (item.data ? item.data.id : item.id) !== houseId);
  storage.set(STORAGE_KEYS.RENTAL_COMPARE_LIST, newRawList);
  return getCompareList();
}

function clearCompareList() {
  return storage.set(STORAGE_KEYS.RENTAL_COMPARE_LIST, []);
}

function isInCompareList(houseId) {
  const list = getCompareList();
  return list.some(item => item.id === houseId);
}

function getFacilityLabel(value) {
  const facility = constants.RENTAL_FACILITIES.find(f => f.value === value);
  return facility ? facility.label : value;
}

// ==================== 拼车模块 ====================

let carpoolInitialized = false;

function initCarpoolData() {
  if (carpoolInitialized) return;
  const existing = storage.get(STORAGE_KEYS.CARPOOL_LIST);
  if (!existing || existing.length === 0) {
    const now = Date.now();
    const carpools = mockData.MOCK_CARPOOLS.map((item, index) => ({
      id: 'mock_carpool_' + index + '_' + now,
      ...item,
      remainingSeats: item.totalSeats - item.currentMembers,
      views: Math.floor(Math.random() * 200) + 30,
      createTime: now - (index + 1) * 86400000,
      updateTime: now - (index + 1) * 86400000
    }));
    storage.set(STORAGE_KEYS.CARPOOL_LIST, carpools);
  }
  carpoolInitialized = true;
}

function getCarpoolList(filters = {}) {
  initCarpoolData();
  let list = storage.getList(STORAGE_KEYS.CARPOOL_LIST);

  if (filters.type && filters.type !== 'all') {
    list = list.filter(item => item.type === filters.type);
  }

  if (filters.destination) {
    list = list.filter(item => item.destination === filters.destination);
  }

  if (filters.status) {
    list = list.filter(item => item.status === filters.status);
  }

  if (filters.minPrice !== undefined) {
    list = list.filter(item => item.pricePerPerson >= filters.minPrice);
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== Infinity) {
    list = list.filter(item => item.pricePerPerson <= filters.maxPrice);
  }

  if (filters.date) {
    const filterDate = new Date(filters.date);
    const dayStart = new Date(filterDate.getFullYear(), filterDate.getMonth(), filterDate.getDate()).getTime();
    const dayEnd = dayStart + 86400000;
    list = list.filter(item => item.departureTime >= dayStart && item.departureTime < dayEnd);
  }

  list = filterByKeyword(list, filters.keyword, ['departure', 'remark', 'contactName']);

  return sortByField(list, filters.sort || 'latest', constants.CARPOOL_SORT_OPTIONS);
}

function getCarpoolDetail(id) {
  initCarpoolData();
  const list = storage.getList(STORAGE_KEYS.CARPOOL_LIST);
  return list.find(item => item.id === id) || null;
}

function publishCarpool(data) {
  initCarpoolData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const item = {
    id: util.generateId(),
    ...data,
    currentMembers: 1,
    remainingSeats: data.totalSeats - 1,
    publisherId: userInfo.id || 'anonymous',
    publisherName: userInfo.nickName || '匿名用户',
    publisherAvatar: userInfo.avatarUrl || '',
    status: 'recruiting',
    views: 0,
    members: [{
      userId: userInfo.id || 'anonymous',
      userName: userInfo.nickName || '匿名用户',
      confirmed: true,
      phone: data.contactPhone || ''
    }],
    createTime: Date.now(),
    updateTime: Date.now()
  };

  const success = storage.addToList(STORAGE_KEYS.CARPOOL_LIST, item);
  return success ? item : null;
}

function updateCarpool(id, updates) {
  return storage.updateInList(STORAGE_KEYS.CARPOOL_LIST, id, {
    ...updates,
    updateTime: Date.now()
  });
}

function deleteCarpool(id) {
  return storage.removeFromList(STORAGE_KEYS.CARPOOL_LIST, id);
}

function increaseCarpoolViews(id) {
  const item = getCarpoolDetail(id);
  if (item) {
    return storage.updateInList(STORAGE_KEYS.CARPOOL_LIST, id, {
      views: (item.views || 0) + 1
    });
  }
  return false;
}

function joinCarpool(carpoolId) {
  initCarpoolData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'test_user';
  const userName = userInfo.nickName || '匿名用户';

  const carpool = getCarpoolDetail(carpoolId);
  if (!carpool) return { success: false, message: '拼车信息不存在' };

  if (carpool.status !== 'recruiting') {
    return { success: false, message: '该拼车已不在招募中' };
  }

  const members = carpool.members || [];
  const alreadyJoined = members.some(m => m.userId === userId);
  if (alreadyJoined) {
    return { success: false, message: '您已加入该拼车' };
  }

  if (carpool.remainingSeats <= 0) {
    return { success: false, message: '已无剩余座位' };
  }

  const member = {
    userId,
    userName,
    confirmed: false,
    phone: '',
    joinTime: Date.now()
  };

  members.push(member);
  const currentMembers = members.length;
  const remainingSeats = carpool.totalSeats - currentMembers;
  const newStatus = remainingSeats <= 0 ? 'full' : 'recruiting';

  storage.updateInList(STORAGE_KEYS.CARPOOL_LIST, carpoolId, {
    members,
    currentMembers,
    remainingSeats,
    status: newStatus,
    updateTime: Date.now()
  });

  return { success: true, member };
}

function confirmCarpoolMember(carpoolId, memberId) {
  initCarpoolData();
  const carpool = getCarpoolDetail(carpoolId);
  if (!carpool) return { success: false, message: '拼车信息不存在' };

  const members = (carpool.members || []).map(m => {
    if (m.userId === memberId) {
      return { ...m, confirmed: true, confirmTime: Date.now() };
    }
    return m;
  });

  storage.updateInList(STORAGE_KEYS.CARPOOL_LIST, carpoolId, {
    members,
    updateTime: Date.now()
  });

  return { success: true };
}

function leaveCarpool(carpoolId) {
  initCarpoolData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'test_user';

  const carpool = getCarpoolDetail(carpoolId);
  if (!carpool) return { success: false, message: '拼车信息不存在' };

  if (carpool.publisherId === userId) {
    return { success: false, message: '发布者不能退出，请删除拼车信息' };
  }

  const members = (carpool.members || []).filter(m => m.userId !== userId);
  const currentMembers = members.length;
  const remainingSeats = carpool.totalSeats - currentMembers;

  storage.updateInList(STORAGE_KEYS.CARPOOL_LIST, carpoolId, {
    members,
    currentMembers,
    remainingSeats,
    status: remainingSeats > 0 ? 'recruiting' : carpool.status,
    updateTime: Date.now()
  });

  return { success: true };
}function updateCarpoolStatus(carpoolId, status) {
  return updateCarpool(carpoolId, { status });
}

// ==================== 食堂菜谱模块 ====================

const CROWD_LEVEL_VALUES = ['idle', 'moderate', 'crowded'];
const CROWD_LEVEL_DESCS = {
  idle: '用餐人数较少，无需排队',
  moderate: '用餐人数适中，稍等片刻即可',
  crowded: '用餐人数较多，建议错峰'
};

function initCanteenData() {
  if (canteenInitialized) return;
  const existing = storage.get(STORAGE_KEYS.CANTEEN_LIST);
  if (!existing || existing.length === 0) {
    const now = Date.now();
    const favoriteCanteenIds = storage.getList(STORAGE_KEYS.FAVORITE_CANTEENS);
    const canteens = mockData.MOCK_CANTEENS.map((item, index) => ({
      id: item.id,
      ...item,
      isFavorite: favoriteCanteenIds.includes(item.id),
      views: item.views || Math.floor(Math.random() * 500) + 100,
      createTime: now - (index + 1) * 86400000,
      updateTime: now - (index + 1) * 86400000
    }));
    storage.set(STORAGE_KEYS.CANTEEN_LIST, canteens);
  }
  const existingDishes = storage.get(STORAGE_KEYS.DISH_LIST);
  if (!existingDishes || existingDishes.length === 0) {
    storage.set(STORAGE_KEYS.DISH_LIST, mockData.MOCK_DISHES || []);
  }
  if (!canteenReviewsInitialized) {
    const existingCR = storage.get(STORAGE_KEYS.CANTEEN_REVIEWS);
    if (!existingCR && mockData.MOCK_CANTEEN_REVIEWS) {
      const crMap = {};
      mockData.MOCK_CANTEEN_REVIEWS.forEach(r => {
        if (!crMap[r.canteenId]) crMap[r.canteenId] = [];
        crMap[r.canteenId].push(r);
      });
      storage.set(STORAGE_KEYS.CANTEEN_REVIEWS, crMap);
    }
    canteenReviewsInitialized = true;
  }
  if (!dishReviewsInitialized) {
    const existingDR = storage.get(STORAGE_KEYS.DISH_REVIEWS);
    if (!existingDR && mockData.MOCK_DISH_REVIEWS) {
      const drMap = {};
      mockData.MOCK_DISH_REVIEWS.forEach(r => {
        if (!drMap[r.dishId]) drMap[r.dishId] = [];
        drMap[r.dishId].push(r);
      });
      storage.set(STORAGE_KEYS.DISH_REVIEWS, drMap);
    }
    dishReviewsInitialized = true;
  }
  canteenInitialized = true;
}

function getAllDishes() {
  initCanteenData();
  return storage.getList(STORAGE_KEYS.DISH_LIST);
}

function getCanteenList(filters = {}) {
  initCanteenData();
  let list = storage.getList(STORAGE_KEYS.CANTEEN_LIST);

  const favoriteCanteenIds = storage.getList(STORAGE_KEYS.FAVORITE_CANTEENS);

  list = list.map(item => {
    const levelValue = CROWD_LEVEL_VALUES[Math.floor(Math.random() * 3)];
    return {
      ...item,
      crowdLevel: levelValue,
      crowdDesc: CROWD_LEVEL_DESCS[levelValue],
      isFavorite: favoriteCanteenIds.includes(item.id)
    };
  });

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['name', 'location', 'tags']);
    const dishes = getAllDishes();
    const matchedDishCanteenIds = filterByKeyword(dishes, filters.keyword, ['name', 'recommendReason']).map(d => d.canteenId);
    const canteenFromDishes = list.filter(c => matchedDishCanteenIds.includes(c.id));
    const merged = [...list];
    canteenFromDishes.forEach(c => {
      if (!merged.find(m => m.id === c.id)) merged.push(c);
    });
    list = merged;
  }

  if (filters.minRating !== undefined) {
    list = list.filter(item => item.rating >= filters.minRating);
  }

  return list.sort((a, b) => b.rating - a.rating);
}

function getCanteenDetail(id) {
  initCanteenData();
  const list = storage.getList(STORAGE_KEYS.CANTEEN_LIST);
  const canteen = list.find(item => item.id === id);
  if (canteen) {
    const levelValue = CROWD_LEVEL_VALUES[Math.floor(Math.random() * 3)];
    const favoriteCanteenIds = storage.getList(STORAGE_KEYS.FAVORITE_CANTEENS);
    return {
      ...canteen,
      crowdLevel: levelValue,
      crowdDesc: CROWD_LEVEL_DESCS[levelValue],
      isFavorite: favoriteCanteenIds.includes(canteen.id)
    };
  }
  return null;
}

function getTodayRecommends() {
  initCanteenData();
  const allDishes = getAllDishes();
  const recommends = allDishes.filter(d => d.isRecommend).slice(0, 4);
  return recommends.map(d => ({
    ...d,
    priceText: util.formatPrice(d.price),
    originalPriceText: d.originalPrice ? util.formatPrice(d.originalPrice) : null
  }));
}

function getNewDishes() {
  initCanteenData();
  const allDishes = getAllDishes();
  const newDishes = allDishes.filter(d => d.isNew).slice(0, 6);
  return newDishes.map(d => ({
    ...d,
    priceText: util.formatPrice(d.price),
    originalPriceText: d.originalPrice ? util.formatPrice(d.originalPrice) : null
  }));
}

function getDishesByCanteenAndMeal(canteenId, mealType) {
  initCanteenData();
  const allDishes = getAllDishes();
  let matched = allDishes.filter(d => d.canteenId === canteenId);
  if (mealType) {
    matched = matched.filter(d => !d.mealType || d.mealType === mealType);
  }
  return matched.map(d => ({
    ...d,
    priceText: util.formatPrice(d.price),
    originalPriceText: d.originalPrice ? util.formatPrice(d.originalPrice) : null
  }));
}

function getDishDetail(dishId) {
  initCanteenData();
  const allDishes = getAllDishes();
  const dish = allDishes.find(item => item.id === dishId);
  if (!dish) return null;
  return {
    dish: {
      ...dish,
      priceText: util.formatPrice(dish.price),
      originalPriceText: dish.originalPrice ? util.formatPrice(dish.originalPrice) : null
    },
    canteenId: dish.canteenId,
    canteenName: dish.canteenName,
    mealType: dish.mealType
  };
}

function getDishReviews(dishId) {
  initCanteenData();
  const reviewsMap = storage.get(STORAGE_KEYS.DISH_REVIEWS) || {};
  return (reviewsMap[dishId] || []).sort((a, b) => b.createTime - a.createTime);
}

function addDishReview(dishIdOrReview, reviewData) {
  initCanteenData();
  const reviewsMap = storage.get(STORAGE_KEYS.DISH_REVIEWS) || {};
  let dishId;
  let newReviewData;
  if (typeof dishIdOrReview === 'object') {
    newReviewData = dishIdOrReview;
    dishId = newReviewData.dishId;
  } else {
    dishId = dishIdOrReview;
    newReviewData = { dishId, ...reviewData };
  }
  if (!reviewsMap[dishId]) {
    reviewsMap[dishId] = [];
  }

  const newReview = {
    id: util.generateId(),
    ...newReviewData,
    likes: 0,
    createTime: Date.now()
  };

  reviewsMap[dishId].unshift(newReview);
  storage.set(STORAGE_KEYS.DISH_REVIEWS, reviewsMap);
  return newReview;
}

function getCanteenReviews(canteenId) {
  initCanteenData();
  const reviewsMap = storage.get(STORAGE_KEYS.CANTEEN_REVIEWS) || {};
  return (reviewsMap[canteenId] || []).sort((a, b) => b.createTime - a.createTime);
}

function toggleFavoriteCanteen(canteenId) {
  initCanteenData();
  let favorites = storage.getList(STORAGE_KEYS.FAVORITE_CANTEENS);
  const index = favorites.indexOf(canteenId);
  if (index > -1) {
    favorites.splice(index, 1);
    storage.set(STORAGE_KEYS.FAVORITE_CANTEENS, favorites);
    return { isFavorite: false };
  } else {
    favorites.unshift(canteenId);
    storage.set(STORAGE_KEYS.FAVORITE_CANTEENS, favorites);
    return { isFavorite: true };
  }
}

function isFavoriteCanteen(canteenId) {
  const favorites = storage.getList(STORAGE_KEYS.FAVORITE_CANTEENS);
  return favorites.includes(canteenId);
}

function toggleFavoriteDish(dishId) {
  initCanteenData();
  let favorites = storage.getList(STORAGE_KEYS.FAVORITE_DISHES);
  const index = favorites.indexOf(dishId);
  if (index > -1) {
    favorites.splice(index, 1);
    storage.set(STORAGE_KEYS.FAVORITE_DISHES, favorites);
    return { isFavorite: false };
  } else {
    favorites.unshift(dishId);
    storage.set(STORAGE_KEYS.FAVORITE_DISHES, favorites);
    return { isFavorite: true };
  }
}

function isFavoriteDish(dishId) {
  const favorites = storage.getList(STORAGE_KEYS.FAVORITE_DISHES);
  return favorites.includes(dishId);
}

function getFavoriteCanteens() {
  initCanteenData();
  const favoriteIds = storage.getList(STORAGE_KEYS.FAVORITE_CANTEENS);
  const list = storage.getList(STORAGE_KEYS.CANTEEN_LIST);
  const favoriteCanteenIds = storage.getList(STORAGE_KEYS.FAVORITE_CANTEENS);
  return favoriteIds.map(id => {
    const item = list.find(c => c.id === id);
    if (item) {
      return { ...item, isFavorite: favoriteCanteenIds.includes(id) };
    }
    return null;
  }).filter(Boolean);
}

function getFavoriteDishes() {
  initCanteenData();
  const favoriteIds = storage.getList(STORAGE_KEYS.FAVORITE_DISHES);
  const allDishes = getAllDishes();
  return favoriteIds.map(id => {
    const d = allDishes.find(item => item.id === id);
    if (d) {
      return {
        ...d,
        priceText: util.formatPrice(d.price),
        originalPriceText: d.originalPrice ? util.formatPrice(d.originalPrice) : null
      };
    }
    return null;
  }).filter(Boolean);
}

// ==================== 校园论坛 ====================

let forumInitialized = false;

function initForumData() {
  if (forumInitialized) return;
  const existing = storage.get(STORAGE_KEYS.FORUM_POST_LIST);
  if (!existing || existing.length === 0) {
    const now = Date.now();
    const posts = mockData.MOCK_FORUM_POSTS.map((item, index) => {
      const comments = (item.comments || []).map((c, cIdx) => ({
        id: 'fc_' + index + '_' + cIdx + '_' + now,
        ...c,
        createTime: c.createTime || (now - (cIdx + 1) * 3600000)
      }));
      return {
        id: 'forum_' + index + '_' + now,
        ...item,
        comments,
        commentCount: item.commentCount || comments.length,
        userId: 'mock_user_' + index,
        likes: item.likes || 0,
        favorites: item.favorites || 0,
        views: item.views || 0,
        hotScore: item.hotScore || 0,
        createTime: now - (index + 1) * 86400000,
        updateTime: now - (index + 1) * 86400000
      };
    });
    storage.set(STORAGE_KEYS.FORUM_POST_LIST, posts);

    const topicStats = {};
    constants.FORUM_TOPIC_LIST.forEach(t => { topicStats[t.value] = 0; });
    posts.forEach(post => {
      (post.topics || []).forEach(topic => {
        if (topicStats[topic] !== undefined) {
          topicStats[topic]++;
        }
      });
    });
    storage.set(STORAGE_KEYS.FORUM_TOPIC_STATS, topicStats);
  }
  forumInitialized = true;
}

function checkSensitiveWords(content) {
  const words = constants.SENSITIVE_WORDS;
  const found = words.filter(w => content.includes(w));
  return { hasSensitive: found.length > 0, words: found };
}

function isUserBanned(userId) {
  const bannedUsers = storage.getList(STORAGE_KEYS.FORUM_BANNED_USERS);
  return bannedUsers.some(u => u.userId === userId && (!u.banExpiry || u.banExpiry > Date.now()));
}

function getForumPostList(filters = {}) {
  initForumData();
  let list = storage.getList(STORAGE_KEYS.FORUM_POST_LIST);

  if (filters.type) {
    list = list.filter(item => item.type === filters.type);
  }

  if (filters.topic) {
    list = list.filter(item => item.topics && item.topics.includes(filters.topic));
  }

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['title', 'content', 'authorName']);
  }

  if (filters.isAnonymous !== undefined) {
    list = list.filter(item => item.isAnonymous === filters.isAnonymous);
  }

  if (filters.sort === 'hot') {
    list = list.slice().sort((a, b) => (b.hotScore || 0) - (a.hotScore || 0));
  } else if (filters.sort === 'latest') {
    list = list.slice().sort((a, b) => b.createTime - a.createTime);
  } else {
    list = list.slice().sort((a, b) => (b.hotScore || 0) - (a.hotScore || 0));
  }

  return list;
}

function getForumPostDetail(id) {
  initForumData();
  const list = storage.getList(STORAGE_KEYS.FORUM_POST_LIST);
  return list.find(item => item.id === id) || null;
}

function publishForumPost(data) {
  initForumData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'anonymous';

  if (isUserBanned(userId)) {
    return { success: false, message: '您已被封禁，无法发帖' };
  }

  const sensitiveCheck = checkSensitiveWords(data.title + data.content);
  if (sensitiveCheck.hasSensitive) {
    return { success: false, message: '内容包含敏感词：' + sensitiveCheck.words.join('、') };
  }

  const item = {
    id: util.generateId(),
    ...data,
    userId,
    authorName: data.isAnonymous ? '匿名用户' : (userInfo.nickName || '匿名用户'),
    authorAvatar: data.isAnonymous ? '' : (userInfo.avatarUrl || ''),
    likes: 0,
    commentCount: 0,
    favorites: 0,
    views: 0,
    hotScore: 0,
    comments: [],
    createTime: Date.now(),
    updateTime: Date.now()
  };

  storage.addToList(STORAGE_KEYS.FORUM_POST_LIST, item);

  if (data.topics && data.topics.length > 0) {
    const topicStats = storage.get(STORAGE_KEYS.FORUM_TOPIC_STATS) || {};
    data.topics.forEach(topic => {
      topicStats[topic] = (topicStats[topic] || 0) + 1;
    });
    storage.set(STORAGE_KEYS.FORUM_TOPIC_STATS, topicStats);
  }

  return { success: true, data: item };
}

function increaseForumPostViews(id) {
  const item = getForumPostDetail(id);
  if (item) {
    const newViews = (item.views || 0) + 1;
    storage.updateInList(STORAGE_KEYS.FORUM_POST_LIST, id, {
      views: newViews,
      hotScore: calculateHotScore(item.likes || 0, item.commentCount || 0, newViews, item.createTime)
    });
  }
}

function calculateHotScore(likes, comments, views, createTime) {
  const now = Date.now();
  const hoursSincePost = Math.max(1, (now - createTime) / 3600000);
  return Math.round((likes * 3 + comments * 2 + views * 0.5) / Math.pow(hoursSincePost + 2, 1.5) * 100);
}

function toggleForumPostLike(postId) {
  initForumData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'anonymous';

  let likes = storage.getList(STORAGE_KEYS.FORUM_LIKES);
  const existing = likes.find(l => l.postId === postId && l.userId === userId);

  const post = getForumPostDetail(postId);
  if (!post) return { success: false, message: '帖子不存在' };

  let isLiked;
  if (existing) {
    likes = likes.filter(l => !(l.postId === postId && l.userId === userId));
    isLiked = false;
  } else {
    likes.push({ postId, userId, createTime: Date.now() });
    isLiked = true;
  }
  storage.set(STORAGE_KEYS.FORUM_LIKES, likes);

  const newLikes = isLiked ? (post.likes || 0) + 1 : Math.max(0, (post.likes || 0) - 1);
  storage.updateInList(STORAGE_KEYS.FORUM_POST_LIST, postId, {
    likes: newLikes,
    hotScore: calculateHotScore(newLikes, post.commentCount || 0, post.views || 0, post.createTime)
  });

  return { success: true, isLiked, likes: newLikes };
}

function isForumPostLiked(postId) {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'anonymous';

  const likes = storage.getList(STORAGE_KEYS.FORUM_LIKES);
  return likes.some(l => l.postId === postId && l.userId === userId);
}

function addForumComment(postId, content, isAnonymous) {
  initForumData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'anonymous';

  if (isUserBanned(userId)) {
    return { success: false, message: '您已被封禁，无法评论' };
  }

  const sensitiveCheck = checkSensitiveWords(content);
  if (sensitiveCheck.hasSensitive) {
    return { success: false, message: '评论包含敏感词' };
  }

  const post = getForumPostDetail(postId);
  if (!post) return { success: false, message: '帖子不存在' };

  const comment = {
    id: util.generateId(),
    postId,
    content,
    userId,
    authorName: isAnonymous ? '匿名用户' : (userInfo.nickName || '匿名用户'),
    authorAvatar: isAnonymous ? '' : (userInfo.avatarUrl || ''),
    isAnonymous: !!isAnonymous,
    likes: 0,
    createTime: Date.now()
  };

  const comments = [...(post.comments || []), comment];
  const newCommentCount = comments.length;
  storage.updateInList(STORAGE_KEYS.FORUM_POST_LIST, postId, {
    comments,
    commentCount: newCommentCount,
    updateTime: Date.now(),
    hotScore: calculateHotScore(post.likes || 0, newCommentCount, post.views || 0, post.createTime)
  });

  return { success: true, data: comment };
}

function toggleForumCommentLike(postId, commentId) {
  initForumData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'anonymous';

  const post = getForumPostDetail(postId);
  if (!post) return { success: false };

  let likeKey = 'forum_comment_likes';
  let likes = storage.getList(likeKey);
  const existing = likes.find(l => l.commentId === commentId && l.userId === userId);

  let isLiked;
  if (existing) {
    likes = likes.filter(l => !(l.commentId === commentId && l.userId === userId));
    isLiked = false;
  } else {
    likes.push({ commentId, userId, createTime: Date.now() });
    isLiked = true;
  }
  storage.set(likeKey, likes);

  const comments = (post.comments || []).map(c => {
    if (c.id === commentId) {
      return { ...c, likes: isLiked ? (c.likes || 0) + 1 : Math.max(0, (c.likes || 0) - 1) };
    }
    return c;
  });

  storage.updateInList(STORAGE_KEYS.FORUM_POST_LIST, postId, { comments });

  return { success: true, isLiked };
}

function toggleForumPostFavorite(postId) {
  const post = getForumPostDetail(postId);
  if (!post) return { success: false };

  const isFav = isFavorite(postId, 'forum');
  if (isFav) {
    removeFavorite(postId, 'forum');
    const newFavs = Math.max(0, (post.favorites || 0) - 1);
    storage.updateInList(STORAGE_KEYS.FORUM_POST_LIST, postId, { favorites: newFavs });
    return { success: true, isFavorite: false };
  } else {
    addFavorite(post, 'forum');
    const newFavs = (post.favorites || 0) + 1;
    storage.updateInList(STORAGE_KEYS.FORUM_POST_LIST, postId, { favorites: newFavs });
    return { success: true, isFavorite: true };
  }
}

function isForumPostFavorited(postId) {
  return isFavorite(postId, 'forum');
}

function deleteForumPost(postId) {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'anonymous';

  const post = getForumPostDetail(postId);
  if (!post) return { success: false, message: '帖子不存在' };
  if (post.userId !== userId && userId !== 'admin') {
    return { success: false, message: '无权删除' };
  }

  storage.removeFromList(STORAGE_KEYS.FORUM_POST_LIST, postId);

  if (post.topics && post.topics.length > 0) {
    const topicStats = storage.get(STORAGE_KEYS.FORUM_TOPIC_STATS) || {};
    post.topics.forEach(topic => {
      if (topicStats[topic] !== undefined) {
        topicStats[topic] = Math.max(0, topicStats[topic] - 1);
      }
    });
    storage.set(STORAGE_KEYS.FORUM_TOPIC_STATS, topicStats);
  }

  return { success: true };
}

function reportForumPost(postId, reason) {
  initForumData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'anonymous';

  const reports = storage.getList(STORAGE_KEYS.FORUM_REPORTS);
  const existing = reports.find(r => r.postId === postId && r.reporterId === userId);
  if (existing) return { success: false, message: '您已举报过该帖子' };

  reports.push({
    id: util.generateId(),
    postId,
    reporterId: userId,
    reason,
    createTime: Date.now(),
    status: 'pending'
  });
  storage.set(STORAGE_KEYS.FORUM_REPORTS, reports);

  const postReports = reports.filter(r => r.postId === postId);
  if (postReports.length >= 5) {
    deleteForumPost(postId);
  }

  return { success: true, message: '举报成功' };
}

function banForumUser(userId, duration) {
  const bannedUsers = storage.getList(STORAGE_KEYS.FORUM_BANNED_USERS);
  const existing = bannedUsers.find(u => u.userId === userId);

  if (existing) {
    existing.banExpiry = duration ? Date.now() + duration : null;
    existing.updateTime = Date.now();
  } else {
    bannedUsers.push({
      userId,
      banExpiry: duration ? Date.now() + duration : null,
      createTime: Date.now()
    });
  }

  storage.set(STORAGE_KEYS.FORUM_BANNED_USERS, bannedUsers);
  return { success: true };
}

function followForumAuthor(authorId) {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'anonymous';

  if (authorId === userId) return { success: false, message: '不能关注自己' };

  let followList = storage.getList('forumFollows');
  const existing = followList.find(f => f.followerId === userId && f.followingId === authorId);

  if (existing) {
    followList = followList.filter(f => !(f.followerId === userId && f.followingId === authorId));
    storage.set('forumFollows', followList);
    return { success: true, isFollowing: false };
  } else {
    followList.push({ followerId: userId, followingId: authorId, createTime: Date.now() });
    storage.set('forumFollows', followList);
    return { success: true, isFollowing: true };
  }
}

function isFollowingAuthor(authorId) {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'anonymous';

  const followList = storage.getList('forumFollows');
  return followList.some(f => f.followerId === userId && f.followingId === authorId);
}

function getForumTopicStats() {
  initForumData();
  return storage.get(STORAGE_KEYS.FORUM_TOPIC_STATS) || {};
}

function getUserForumPosts(userId) {
  initForumData();
  const list = storage.getList(STORAGE_KEYS.FORUM_POST_LIST);
  return list.filter(item => item.userId === userId).sort((a, b) => b.createTime - a.createTime);
}

// ==================== 社团模块 ====================

let clubInitialized = false;

function initClubData() {
  if (clubInitialized) return;
  const existingClubs = storage.get(STORAGE_KEYS.CLUB_LIST);
  const existingActivities = storage.get(STORAGE_KEYS.CLUB_ACTIVITY_LIST);

  if (!existingClubs || existingClubs.length === 0) {
    const clubs = mockData.MOCK_CLUBS.map((item, index) => ({
      ...item,
      createTime: Date.now() - (index + 10) * 86400000,
      updateTime: Date.now() - (index + 1) * 86400000
    }));
    storage.set(STORAGE_KEYS.CLUB_LIST, clubs);
    storage.set(STORAGE_KEYS.CLUB_MEMBER_LIST, mockData.MOCK_CLUB_MEMBERS);
  }

  if (!existingActivities || existingActivities.length === 0) {
    const now = Date.now();
    const activities = mockData.MOCK_CLUB_ACTIVITIES.map((item, index) => ({
      id: item.id,
      ...item,
      registrations: [],
      checkins: [],
      views: Math.floor(Math.random() * 300) + 50,
      createTime: now - (index + 2) * 86400000,
      updateTime: now - (index + 1) * 86400000
    }));
    storage.set(STORAGE_KEYS.CLUB_ACTIVITY_LIST, activities);
  }

  clubInitialized = true;
}

function getActivityStatus(activity) {
  const now = Date.now();
  const startTime = new Date(activity.activityTime).getTime();
  const endTime = new Date(activity.endTime).getTime();

  if (activity.status === 'cancelled') return 'cancelled';
  if (now > endTime) return 'ended';
  if (now >= startTime && now <= endTime) return 'ongoing';
  return 'upcoming';
}

function getClubList(filters = {}) {
  initClubData();
  let list = storage.getList(STORAGE_KEYS.CLUB_LIST);

  if (filters.type) {
    list = list.filter(item => item.type === filters.type);
  }

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['name', 'slogan', 'description']);
  }

  return list.sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0));
}

function getClubDetail(clubId) {
  initClubData();
  const list = storage.getList(STORAGE_KEYS.CLUB_LIST);
  return list.find(item => item.id === clubId) || null;
}

function getClubMembers(clubId) {
  initClubData();
  const memberMap = storage.get(STORAGE_KEYS.CLUB_MEMBER_LIST) || {};
  return memberMap[clubId] || [];
}

function getClubActivities(clubId, status = '') {
  initClubData();
  let list = storage.getList(STORAGE_KEYS.CLUB_ACTIVITY_LIST);
  list = list.filter(item => item.clubId === clubId);

  if (status) {
    list = list.filter(item => getActivityStatus(item) === status);
  }

  return list.sort((a, b) => new Date(b.activityTime) - new Date(a.activityTime));
}

function isClubMember(clubId, userId) {
  initClubData();
  const memberMap = storage.get(STORAGE_KEYS.CLUB_MEMBER_LIST) || {};
  const members = memberMap[clubId] || [];
  return members.some(m => m.userId === userId);
}

function joinClub(clubId, memberData) {
  initClubData();
  const memberMap = storage.get(STORAGE_KEYS.CLUB_MEMBER_LIST) || {};
  const members = memberMap[clubId] || [];

  if (members.some(m => m.userId === memberData.userId)) {
    return { success: false, message: '您已是该社团成员' };
  }

  const newMember = {
    id: util.generateId(),
    ...memberData,
    role: 'member',
    joinTime: Date.now()
  };
  members.push(newMember);
  memberMap[clubId] = members;
  storage.set(STORAGE_KEYS.CLUB_MEMBER_LIST, memberMap);

  const club = getClubDetail(clubId);
  if (club) {
    storage.updateInList(STORAGE_KEYS.CLUB_LIST, clubId, {
      memberCount: (club.memberCount || 0) + 1,
      updateTime: Date.now()
    });
  }

  return { success: true, member: newMember };
}

function leaveClub(clubId, userId) {
  initClubData();
  const memberMap = storage.get(STORAGE_KEYS.CLUB_MEMBER_LIST) || {};
  let members = memberMap[clubId] || [];

  const member = members.find(m => m.userId === userId);
  if (!member) {
    return false;
  }
  if (member.role === 'president') {
    return { success: false, message: '社长不能直接退出社团' };
  }

  members = members.filter(m => m.userId !== userId);
  memberMap[clubId] = members;
  storage.set(STORAGE_KEYS.CLUB_MEMBER_LIST, memberMap);

  const club = getClubDetail(clubId);
  if (club) {
    storage.updateInList(STORAGE_KEYS.CLUB_LIST, clubId, {
      memberCount: Math.max(0, (club.memberCount || 0) - 1),
      updateTime: Date.now()
    });
  }

  return { success: true };
}

// ==================== 社团活动模块 ====================

function getClubActivityList(filters = {}) {
  initClubData();
  let list = storage.getList(STORAGE_KEYS.CLUB_ACTIVITY_LIST);

  if (filters.status && filters.status !== 'my') {
    list = list.filter(item => getActivityStatus(item) === filters.status);
  }

  if (filters.category) {
    list = list.filter(item => item.category === filters.category);
  }

  if (filters.clubId) {
    list = list.filter(item => item.clubId === filters.clubId);
  }

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['title', 'description', 'location', 'clubName']);
  }

  return list.sort((a, b) => new Date(a.activityTime) - new Date(b.activityTime));
}

function getClubActivityDetail(id) {
  initClubData();
  const list = storage.getList(STORAGE_KEYS.CLUB_ACTIVITY_LIST);
  return list.find(item => item.id === id) || null;
}

function publishClubActivity(data) {
  initClubData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const item = {
    id: util.generateId(),
    ...data,
    publisherId: userInfo.id || 'admin',
    publisherName: userInfo.nickName || '管理员',
    registrations: [],
    checkins: [],
    views: 0,
    createTime: Date.now(),
    updateTime: Date.now()
  };

  const success = storage.addToList(STORAGE_KEYS.CLUB_ACTIVITY_LIST, item);
  if (success) {
    const club = getClubDetail(data.clubId);
    if (club) {
      storage.updateInList(STORAGE_KEYS.CLUB_LIST, data.clubId, {
        activityCount: (club.activityCount || 0) + 1,
        updateTime: Date.now()
      });
    }
  }
  return success ? item : null;
}

function updateClubActivity(id, updates) {
  return storage.updateInList(STORAGE_KEYS.CLUB_ACTIVITY_LIST, id, {
    ...updates,
    updateTime: Date.now()
  });
}

function increaseClubActivityViews(id) {
  const item = getClubActivityDetail(id);
  if (item) {
    return storage.updateInList(STORAGE_KEYS.CLUB_ACTIVITY_LIST, id, {
      views: (item.views || 0) + 1
    });
  }
  return false;
}

function registerClubActivity(activityId) {
  initClubData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'test_user';
  const userName = userInfo.nickName || '同学';

  const activity = getClubActivityDetail(activityId);
  if (!activity) return { success: false, message: '活动不存在' };

  const now = Date.now();
  const deadline = new Date(activity.deadline).getTime();
  if (now > deadline) {
    return { success: false, message: '报名已截止' };
  }

  const registrations = activity.registrations || [];
  const alreadyRegistered = registrations.some(r => r.userId === userId);
  if (alreadyRegistered) {
    return { success: false, message: '您已报名该活动' };
  }

  if (registrations.length >= (activity.capacity || 0)) {
    return { success: false, message: '报名人数已满' };
  }

  const registration = {
    id: util.generateId(),
    userId,
    userName,
    userAvatar: userInfo.avatarUrl || '',
    status: 'registered',
    registerTime: Date.now()
  };

  registrations.push(registration);
  storage.updateInList(STORAGE_KEYS.CLUB_ACTIVITY_LIST, activityId, {
    registrations,
    updateTime: Date.now()
  });

  return { success: true, registration };
}

function cancelClubActivityRegistration(activityId) {
  initClubData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'test_user';

  const activity = getClubActivityDetail(activityId);
  if (!activity) return { success: false, message: '活动不存在' };

  const now = Date.now();
  const startTime = new Date(activity.activityTime).getTime();
  if (now >= startTime - 3600000) {
    return { success: false, message: '活动开始前1小时不可取消报名' };
  }

  const registrations = (activity.registrations || []).filter(r => r.userId !== userId);
  storage.updateInList(STORAGE_KEYS.CLUB_ACTIVITY_LIST, activityId, {
    registrations,
    updateTime: Date.now()
  });

  return { success: true };
}

function getUserRegisteredActivities(userId) {
  initClubData();
  const activities = storage.getList(STORAGE_KEYS.CLUB_ACTIVITY_LIST);
  const result = [];

  activities.forEach(activity => {
    const reg = (activity.registrations || []).find(r => r.userId === userId);
    if (reg) {
      result.push({
        ...activity,
        userRegistration: reg,
        activityStatus: getActivityStatus(activity)
      });
    }
  });

  return result.sort((a, b) => new Date(b.activityTime) - new Date(a.activityTime));
}

function checkinClubActivity(activityId, code) {
  initClubData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'test_user';

  const activity = getClubActivityDetail(activityId);
  if (!activity) return { success: false, message: '活动不存在' };

  const status = getActivityStatus(activity);
  const today = new Date().toDateString();
  const activityDate = new Date(activity.activityTime).toDateString();
  if (today !== activityDate) {
    return { success: false, message: '仅活动当天可签到' };
  }

  const registrations = activity.registrations || [];
  const regIndex = registrations.findIndex(r => r.userId === userId);
  if (regIndex === -1) return { success: false, message: '您未报名该活动' };

  if (registrations[regIndex].checkedIn) {
    return { success: false, message: '您已签到' };
  }

  if (code && activity.checkInCode && code !== activity.checkInCode) {
    return { success: false, message: '签到码不正确' };
  }

  registrations[regIndex] = {
    ...registrations[regIndex],
    checkedIn: true,
    checkinTime: Date.now()
  };

  storage.updateInList(STORAGE_KEYS.CLUB_ACTIVITY_LIST, activityId, {
    registrations,
    updateTime: Date.now()
  });

  return { success: true };
}

function isUserRegisteredForActivity(activityId, userId) {
  const activity = getClubActivityDetail(activityId);
  if (!activity) return false;
  return (activity.registrations || []).some(r => r.userId === userId);
}

function getClubActivityRegistrations(activityId) {
  const activity = getClubActivityDetail(activityId);
  if (!activity) return [];
  return activity.registrations || [];
}

function getClubActivitiesByDate(year, month) {
  initClubData();
  const list = storage.getList(STORAGE_KEYS.CLUB_ACTIVITY_LIST);
  const result = {};

  list.forEach(activity => {
    const startDate = new Date(activity.activityTime);
    const startY = startDate.getFullYear();
    const startM = startDate.getMonth();

    if (year === startY && month === startM) {
      const day = startDate.getDate();
      if (!result[day]) result[day] = [];
      result[day].push({
        id: activity.id,
        title: activity.title,
        clubName: activity.clubName,
        timeStr: util.formatTime(activity.activityTime, 'HH:mm'),
        category: activity.category,
        status: getActivityStatus(activity)
      });
    }
  });

  return result;
}

// ==================== 票务系统模块 ====================

function generateTicketCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'TK-';
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateQRContent(orderId, ticketCode, activityId) {
  return JSON.stringify({
    o: orderId,
    t: ticketCode,
    a: activityId,
    ts: Date.now()
  });
}

function getUserWallet() {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'test_user';
  const wallets = storage.get(STORAGE_KEYS.USER_WALLET) || {};
  if (!wallets[userId]) {
    wallets[userId] = { balance: 1000, frozen: 0, updateTime: Date.now() };
    storage.set(STORAGE_KEYS.USER_WALLET, wallets);
  }
  return wallets[userId];
}

function updateWalletBalance(amount, type = 'deduct') {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'test_user';
  const wallets = storage.get(STORAGE_KEYS.USER_WALLET) || {};
  if (!wallets[userId]) {
    wallets[userId] = { balance: 1000, frozen: 0, updateTime: Date.now() };
  }
  const wallet = wallets[userId];
  if (type === 'deduct') {
    if (wallet.balance < amount) {
      return { success: false, message: '余额不足' };
    }
    wallet.balance -= amount;
  } else if (type === 'add') {
    wallet.balance += amount;
  }
  wallet.updateTime = Date.now();
  wallets[userId] = wallet;
  storage.set(STORAGE_KEYS.USER_WALLET, wallets);
  return { success: true, balance: wallet.balance };
}

function getActivityTicketInfo(activityId) {
  const activity = getClubActivityDetail(activityId);
  if (!activity) return null;
  const orders = storage.getList(STORAGE_KEYS.TICKET_ORDER_LIST).filter(
    o => o.activityId === activityId && ['paid', 'checked_in'].includes(o.status)
  );
  const soldCount = orders.reduce((sum, o) => sum + (o.quantity || 1), 0);
  const stock = activity.ticketStock !== undefined ? activity.ticketStock : (activity.capacity || 0);
  const salesStart = activity.ticketSalesStart || activity.createTime;
  const salesEnd = activity.ticketSalesEnd || activity.deadline;
  const now = Date.now();
  return {
    ...activity,
    soldCount,
    remainingStock: Math.max(0, stock - soldCount),
    stock,
    isOnSale: now >= new Date(salesStart).getTime() && now <= new Date(salesEnd).getTime(),
    salesStart,
    salesEnd,
    ticketPrice: activity.ticketPrice !== undefined ? activity.ticketPrice : (activity.fee || 0),
    isFree: (activity.ticketPrice !== undefined ? activity.ticketPrice : (activity.fee || 0)) === 0,
    refundRule: activity.refundRule || 'no_refund'
  };
}

function createTicketOrder(activityId, quantity = 1, payMethod = 'balance') {
  initClubData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'test_user';

  const ticketInfo = getActivityTicketInfo(activityId);
  if (!ticketInfo) return { success: false, message: '活动不存在' };

  if (!ticketInfo.isOnSale && !ticketInfo.isFree) {
    return { success: false, message: '不在售票时间范围内' };
  }
  if (ticketInfo.remainingStock < quantity) {
    return { success: false, message: '库存不足，剩余' + ticketInfo.remainingStock + '张' };
  }

  const existingPaid = storage.getList(STORAGE_KEYS.TICKET_ORDER_LIST).filter(
    o => o.activityId === activityId && o.userId === userId && ['paid', 'checked_in'].includes(o.status)
  );
  const existingQty = existingPaid.reduce((sum, o) => sum + (o.quantity || 1), 0);
  if (existingQty + quantity > 5) {
    return { success: false, message: '每人最多购买5张票' };
  }

  const pricePerTicket = ticketInfo.ticketPrice || 0;
  const totalAmount = pricePerTicket * quantity;

  if (totalAmount > 0 && payMethod === 'balance') {
    const wallet = getUserWallet();
    if (wallet.balance < totalAmount) {
      return { success: false, message: '余额不足，请充值', needRecharge: true };
    }
    const payResult = updateWalletBalance(totalAmount, 'deduct');
    if (!payResult.success) {
      return { success: false, message: payResult.message };
    }
  }

  const tickets = [];
  for (let i = 0; i < quantity; i++) {
    const code = generateTicketCode();
    tickets.push({
      code,
      qrContent: generateQRContent('', code, activityId),
      verified: false,
      verifiedTime: null
    });
  }

  const order = {
    id: 'order_' + util.generateId(),
    userId,
    userName: userInfo.nickName || '同学',
    userAvatar: userInfo.avatarUrl || '',
    userPhone: userInfo.phone || '',
    activityId,
    activityTitle: ticketInfo.title,
    activityCover: ticketInfo.cover,
    activityTime: ticketInfo.activityTime,
    activityLocation: ticketInfo.location,
    organizerName: ticketInfo.organizerName || ticketInfo.clubName,
    organizerPhone: ticketInfo.organizerPhone || '',
    pricePerTicket,
    quantity,
    totalAmount,
    payMethod: totalAmount > 0 ? payMethod : 'free',
    status: totalAmount > 0 ? 'paid' : 'paid',
    tickets,
    refundRule: ticketInfo.refundRule || 'no_refund',
    createTime: Date.now(),
    payTime: Date.now(),
    updateTime: Date.now(),
    refundTime: null,
    refundAmount: 0,
    refundReason: ''
  };

  tickets.forEach(t => {
    t.qrContent = generateQRContent(order.id, t.code, activityId);
  });

  storage.addToList(STORAGE_KEYS.TICKET_ORDER_LIST, order);

  const activity = getClubActivityDetail(activityId);
  const registrations = activity.registrations || [];
  if (!registrations.some(r => r.userId === userId)) {
    registrations.push({
      id: 'reg_' + util.generateId(),
      userId,
      userName: userInfo.nickName || '同学',
      userAvatar: userInfo.avatarUrl || '',
      status: 'registered',
      registerTime: Date.now(),
      orderId: order.id,
      ticketCount: quantity
    });
    storage.updateInList(STORAGE_KEYS.CLUB_ACTIVITY_LIST, activityId, {
      registrations,
      updateTime: Date.now()
    });
  }

  return { success: true, order };
}

function getTicketOrderList(filters = {}) {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'test_user';
  let list = storage.getList(STORAGE_KEYS.TICKET_ORDER_LIST);

  if (filters.role !== 'organizer') {
    list = list.filter(o => o.userId === userId);
  } else if (filters.activityId) {
    list = list.filter(o => o.activityId === filters.activityId);
  }

  if (filters.status && filters.status !== 'all') {
    list = list.filter(o => o.status === filters.status);
  }

  if (filters.activityId && filters.role !== 'organizer') {
    list = list.filter(o => o.activityId === filters.activityId);
  }

  return list.sort((a, b) => b.createTime - a.createTime);
}

function getTicketOrderDetail(orderId) {
  const list = storage.getList(STORAGE_KEYS.TICKET_ORDER_LIST);
  return list.find(o => o.id === orderId) || null;
}

function calculateRefund(orderId) {
  const order = getTicketOrderDetail(orderId);
  if (!order) return { success: false, message: '订单不存在' };
  if (!['paid'].includes(order.status)) {
    return { success: false, message: '该订单状态不可退票' };
  }

  const now = Date.now();
  const activityStart = new Date(order.activityTime).getTime();
  const hoursBeforeStart = (activityStart - now) / (1000 * 60 * 60);

  const refundRules = constants.TICKET_REFUND_RULES;
  const rule = refundRules.find(r => r.value === order.refundRule) || refundRules[0];
  let refundAmount = 0;
  let canRefund = false;
  let reason = '';

  switch (order.refundRule) {
    case 'no_refund':
      canRefund = false;
      reason = '该活动不支持退票';
      break;
    case 'before_24h':
      canRefund = hoursBeforeStart >= 24;
      refundAmount = canRefund ? order.totalAmount : 0;
      reason = canRefund ? '活动开始前24小时以上，全额退款' : '距离活动开始不足24小时，不可退票';
      break;
    case 'before_48h':
      canRefund = hoursBeforeStart >= 48;
      refundAmount = canRefund ? order.totalAmount : 0;
      reason = canRefund ? '活动开始前48小时以上，全额退款' : '距离活动开始不足48小时，不可退票';
      break;
    case 'before_24h_partial':
      if (hoursBeforeStart >= 24) {
        canRefund = true;
        refundAmount = order.totalAmount;
        reason = '活动开始前24小时以上，全额退款';
      } else if (hoursBeforeStart > 0) {
        canRefund = true;
        refundAmount = Math.floor(order.totalAmount * 0.5);
        reason = '距离活动开始不足24小时，退还50%';
      } else {
        canRefund = false;
        reason = '活动已开始，不可退票';
      }
      break;
    case 'flexible':
      canRefund = hoursBeforeStart > 0;
      refundAmount = canRefund ? Math.floor(order.totalAmount * 0.9) : 0;
      reason = canRefund ? '扣除10%手续费后退款' : '活动已开始，不可退票';
      break;
    default:
      canRefund = false;
      reason = '未知退票规则';
  }

  return {
    success: true,
    canRefund,
    refundAmount,
    originalAmount: order.totalAmount,
    hoursBeforeStart: Math.round(hoursBeforeStart * 10) / 10,
    ruleDesc: rule.desc,
    reason
  };
}

function requestRefund(orderId, reason = '') {
  const calcResult = calculateRefund(orderId);
  if (!calcResult.success) return calcResult;
  if (!calcResult.canRefund) {
    return { success: false, message: calcResult.reason };
  }

  const order = getTicketOrderDetail(orderId);
  if (order.totalAmount > 0 && calcResult.refundAmount > 0) {
    updateWalletBalance(calcResult.refundAmount, 'add');
  }

  const success = storage.updateInList(STORAGE_KEYS.TICKET_ORDER_LIST, orderId, {
    status: 'refunded',
    refundAmount: calcResult.refundAmount,
    refundReason: reason,
    refundTime: Date.now(),
    updateTime: Date.now()
  });

  if (success) {
    const app = getApp();
    const userInfo = app.globalData.userInfo || {};
    const userId = userInfo.id || 'test_user';
    const activity = getClubActivityDetail(order.activityId);
    if (activity) {
      const registrations = (activity.registrations || []).filter(r => r.userId !== userId || r.orderId !== orderId);
      storage.updateInList(STORAGE_KEYS.CLUB_ACTIVITY_LIST, order.activityId, {
        registrations,
        updateTime: Date.now()
      });
    }
  }

  return success ? { success: true, refundAmount: calcResult.refundAmount } : { success: false, message: '退票失败' };
}

function verifyTicketByCode(ticketCode, activityId) {
  const orders = storage.getList(STORAGE_KEYS.TICKET_ORDER_LIST).filter(o => o.activityId === activityId);
  let matchedOrder = null;
  let matchedTicket = null;
  let ticketIndex = -1;

  for (const order of orders) {
    const idx = (order.tickets || []).findIndex(t => t.code === ticketCode);
    if (idx > -1) {
      matchedOrder = order;
      matchedTicket = order.tickets[idx];
      ticketIndex = idx;
      break;
    }
  }

  if (!matchedOrder || !matchedTicket) {
    return { success: false, message: '票码无效，请核对' };
  }
  if (!['paid', 'checked_in'].includes(matchedOrder.status)) {
    return { success: false, message: '订单状态异常：' + (constants.TICKET_ORDER_STATUS_MAP[matchedOrder.status]?.label || matchedOrder.status) };
  }
  if (matchedTicket.verified) {
    return {
      success: false,
      message: '该票已验票，请勿重复验票',
      alreadyVerified: true,
      verifyTime: matchedTicket.verifiedTime,
      order: matchedOrder
    };
  }

  const now = Date.now();
  const activityStart = new Date(matchedOrder.activityTime).getTime();
  const activityEnd = activityStart + 4 * 60 * 60 * 1000;
  if (now < activityStart - 2 * 60 * 60 * 1000) {
    return { success: false, message: '验票时间未到，请提前2小时内验票' };
  }

  matchedOrder.tickets[ticketIndex].verified = true;
  matchedOrder.tickets[ticketIndex].verifiedTime = now;
  const allVerified = matchedOrder.tickets.every(t => t.verified);
  matchedOrder.status = allVerified ? 'checked_in' : 'paid';
  matchedOrder.updateTime = now;

  storage.updateInList(STORAGE_KEYS.TICKET_ORDER_LIST, matchedOrder.id, matchedOrder);

  const activity = getClubActivityDetail(activityId);
  if (activity) {
    const registrations = activity.registrations || [];
    const regIdx = registrations.findIndex(r => r.userId === matchedOrder.userId);
    if (regIdx > -1) {
      registrations[regIdx].checkedIn = true;
      registrations[regIdx].checkinTime = now;
      storage.updateInList(STORAGE_KEYS.CLUB_ACTIVITY_LIST, activityId, {
        registrations,
        updateTime: now
      });
    }
  }

  storage.addToList(STORAGE_KEYS.TICKET_VERIFY_LOG, {
    id: 'vlog_' + util.generateId(),
    ticketCode,
    orderId: matchedOrder.id,
    activityId,
    userId: matchedOrder.userId,
    userName: matchedOrder.userName,
    verifyTime: now,
    status: 'success'
  });

  return {
    success: true,
    message: '验票成功',
    order: matchedOrder,
    ticket: matchedOrder.tickets[ticketIndex]
  };
}

function verifyTicketByQR(qrContent, activityId) {
  try {
    const data = JSON.parse(qrContent);
    if (!data || !data.t) {
      return { success: false, message: '二维码内容无效' };
    }
    if (activityId && data.a && data.a !== activityId) {
      return { success: false, message: '该票不属于此活动' };
    }
    return verifyTicketByCode(data.t, data.a || activityId);
  } catch (e) {
    return verifyTicketByCode(qrContent, activityId);
  }
}

function getActivityTicketStats(activityId) {
  const activity = getActivityTicketInfo(activityId);
  if (!activity) return null;
  const orders = storage.getList(STORAGE_KEYS.TICKET_ORDER_LIST).filter(o => o.activityId === activityId);
  const paidOrders = orders.filter(o => ['paid', 'checked_in'].includes(o.status));
  const verifiedCount = paidOrders.reduce((sum, o) => sum + (o.tickets || []).filter(t => t.verified).length, 0);
  const refundedOrders = orders.filter(o => o.status === 'refunded');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const refundedAmount = refundedOrders.reduce((sum, o) => sum + (o.refundAmount || 0), 0);
  return {
    stock: activity.stock,
    soldCount: activity.soldCount,
    remainingStock: activity.remainingStock,
    paidOrderCount: paidOrders.length,
    verifiedCount,
    refundedCount: refundedOrders.length,
    totalRevenue,
    refundedAmount,
    netRevenue: totalRevenue - refundedAmount,
    attendRate: activity.soldCount > 0 ? Math.round(verifiedCount / activity.soldCount * 100) : 0
  };
}

function getUserOrdersByActivity(activityId, userId) {
  return storage.getList(STORAGE_KEYS.TICKET_ORDER_LIST).filter(
    o => o.activityId === activityId && o.userId === userId
  ).sort((a, b) => b.createTime - a.createTime);
}

let mapDataInitialized = false;

function initMapData() {
  if (mapDataInitialized) return;
  const existing = storage.get(STORAGE_KEYS.POI_LIST);
  if (!existing || existing.length === 0) {
    const now = Date.now();
    const pois = mockData.MOCK_POI_LIST.map((item, index) => ({
      id: 'poi_' + index + '_' + now,
      ...item,
      views: Math.floor(Math.random() * 200) + 10,
      createTime: now - (index + 1) * 86400000,
      updateTime: now - (index + 1) * 86400000
    }));
    storage.set(STORAGE_KEYS.POI_LIST, pois);
  }
  mapDataInitialized = true;
}

function getPOIList(filters = {}) {
  initMapData();
  let list = storage.getList(STORAGE_KEYS.POI_LIST);

  if (filters.category && filters.category !== 'all') {
    list = list.filter(item => item.category === filters.category);
  }

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['name', 'description', 'address', 'buildingNumber']);
  }

  if (filters.isHighlight) {
    list = list.filter(item => item.isHighlight === true);
  }

  return list.sort((a, b) => (b.views || 0) - (a.views || 0));
}

function getPOIDetail(id) {
  initMapData();
  const list = storage.getList(STORAGE_KEYS.POI_LIST);
  return list.find(item => item.id === id) || null;
}

function searchPOI(keyword) {
  if (!keyword) return [];
  return getPOIList({ keyword });
}

function getPOIByCategory(category) {
  return getPOIList({ category });
}

function getHighlightPOIs() {
  return getPOIList({ isHighlight: true });
}

function getRoutes() {
  return mockData.MOCK_ROUTES || [];
}

function getRouteById(id) {
  const routes = getRoutes();
  return routes.find(r => r.id === id) || null;
}

function findRoute(startPOIId, endPOIId) {
  const routes = getRoutes();
  const startPOI = getPOIDetail(startPOIId);
  const endPOI = getPOIDetail(endPOIId);

  if (!startPOI || !endPOI) return null;

  const matchedRoute = routes.find(r =>
    (r.startPoint.name === startPOI.name || r.startPoint.name.includes(startPOI.name)) &&
    (r.endPoint.name === endPOI.name || r.endPoint.name.includes(endPOI.name))
  );

  if (matchedRoute) {
    return {
      ...matchedRoute,
      startPOI,
      endPOI
    };
  }

  const dx = endPOI.x - startPOI.x;
  const dy = endPOI.y - startPOI.y;
  const distance = Math.sqrt(dx * dx + dy * dy) * 10;
  const duration = Math.ceil(distance / 70);

  const midPoints = [];
  const steps = Math.max(3, Math.abs(Math.round(dx / 10)) + Math.abs(Math.round(dy / 10)));
  for (let i = 1; i < steps; i++) {
    midPoints.push({
      x: startPOI.x + (dx * i / steps),
      y: startPOI.y + (dy * i / steps)
    });
  }

  const path = [
    { x: startPOI.x, y: startPOI.y },
    ...midPoints,
    { x: endPOI.x, y: endPOI.y }
  ];

  const instructions = [
    { step: 1, text: `从${startPOI.name}出发`, direction: '出发', distance: 0 },
    { step: 2, text: `向${dy < 0 ? '北' : '南'}${dx > 0 ? '东' : dx < 0 ? '西' : ''}方向直行`, direction: '直行', distance: Math.round(distance * 0.6) },
    { step: 3, text: `到达${endPOI.name}`, direction: '到达', distance: 0 }
  ];

  return {
    id: 'custom_' + Date.now(),
    name: `${startPOI.name} 到 ${endPOI.name}`,
    startPoint: { name: startPOI.name, x: startPOI.x, y: startPOI.y },
    endPoint: { name: endPOI.name, x: endPOI.x, y: endPOI.y },
    distance: Math.round(distance),
    duration,
    path,
    instructions,
    startPOI,
    endPOI
  };
}

function getOrientationGuide() {
  const guide = mockData.ORIENTATION_GUIDE || [];
  const pois = getPOIList();

  return guide.map(item => {
    const poi = pois.find(p => p.name === item.poiName);
    return {
      ...item,
      poiId: poi ? poi.id : null
    };
  });
}

function getFreshmanRegistrationFlow() {
  const flow = mockData.FRESHMAN_REGISTRATION_FLOW || [];
  const pois = getPOIList();

  return flow.map(item => {
    const poi = pois.find(p => p.name === item.poiName);
    return {
      ...item,
      poiId: poi ? poi.id : null
    };
  });
}

function toggleMapFavorite(poiId) {
  const favorites = storage.getList(STORAGE_KEYS.MAP_FAVORITES);
  const existingIndex = favorites.findIndex(f => f.poiId === poiId);

  if (existingIndex > -1) {
    favorites.splice(existingIndex, 1);
    storage.set(STORAGE_KEYS.MAP_FAVORITES, favorites);
    return { favorited: false };
  } else {
    const poi = getPOIDetail(poiId);
    if (poi) {
      favorites.unshift({
        poiId,
        name: poi.name,
        category: poi.category,
        addTime: Date.now()
      });
      storage.set(STORAGE_KEYS.MAP_FAVORITES, favorites);
      return { favorited: true };
    }
    return { favorited: false };
  }
}

function isMapFavorite(poiId) {
  const favorites = storage.getList(STORAGE_KEYS.MAP_FAVORITES);
  return favorites.some(f => f.poiId === poiId);
}

function getMapFavorites() {
  const favorites = storage.getList(STORAGE_KEYS.MAP_FAVORITES);
  return favorites.map(f => ({
    ...f,
    poi: getPOIDetail(f.poiId)
  })).filter(f => f.poi);
}

function getMapSearchHistory() {
  return storage.getList(STORAGE_KEYS.MAP_SEARCH_HISTORY);
}

function addMapSearchHistory(keyword) {
  if (!keyword || !keyword.trim()) return false;
  const trimmed = keyword.trim();
  const list = storage.getList(STORAGE_KEYS.MAP_SEARCH_HISTORY);
  const filtered = list.filter(item => item !== trimmed);
  filtered.unshift(trimmed);
  if (filtered.length > 10) filtered.splice(10);
  return storage.set(STORAGE_KEYS.MAP_SEARCH_HISTORY, filtered);
}

function clearMapSearchHistory() {
  return storage.set(STORAGE_KEYS.MAP_SEARCH_HISTORY, []);
}

function getMapSettings() {
  const defaultSettings = {
    mapType: 'handdrawn',
    showLabels: true,
    showPOIs: true,
    showRoute: true,
    enable3D: false
  };
  const settings = storage.get(STORAGE_KEYS.MAP_SETTINGS);
  return { ...defaultSettings, ...(settings || {}) };
}

function updateMapSettings(updates) {
  const current = getMapSettings();
  const newSettings = { ...current, ...updates };
  storage.set(STORAGE_KEYS.MAP_SETTINGS, newSettings);
  return newSettings;
}

// ==================== 课程表模块 ====================
let courseDataInitialized = false;

function initCourseData() {
  if (courseDataInitialized) return;
  const existing = storage.get(STORAGE_KEYS.COURSE_LIST);
  if (!existing || existing.length === 0) {
    const courses = mockData.MOCK_COURSES.map((item, index) => ({
      id: 'mock_course_' + index + '_' + Date.now(),
      ...item,
      createTime: Date.now()
    }));
    storage.set(STORAGE_KEYS.COURSE_LIST, courses);
  }
  const existingSettings = storage.get(STORAGE_KEYS.COURSE_SETTINGS);
  if (!existingSettings) {
    storage.set(STORAGE_KEYS.COURSE_SETTINGS, { ...mockData.MOCK_COURSE_SETTINGS });
  }
  courseDataInitialized = true;
}

function getCourseList(filters = {}) {
  initCourseData();
  let list = storage.getList(STORAGE_KEYS.COURSE_LIST);
  if (filters.semester) {
    list = list.filter(item => item.semester === filters.semester);
  }
  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['name', 'teacher', 'classroom']);
  }
  return list;
}

function getCoursesByDay(dayOfWeek) {
  return getCourseList().filter(c => c.dayOfWeek === dayOfWeek)
    .sort((a, b) => a.startSlot - b.startSlot);
}

function getCoursesByWeek() {
  const result = {};
  for (let i = 1; i <= 7; i++) {
    result[i] = getCoursesByDay(i);
  }
  return result;
}

function getCourseDetail(id) {
  initCourseData();
  const list = storage.getList(STORAGE_KEYS.COURSE_LIST);
  return list.find(item => item.id === id) || null;
}

function addCourse(data) {
  initCourseData();
  const colorIndex = data.colorIndex !== undefined ? data.colorIndex :
    Math.floor(Math.random() * constants.COURSE_COLORS.length);
  const item = {
    id: util.generateId(),
    ...data,
    colorIndex,
    createTime: Date.now()
  };
  const success = storage.addToList(STORAGE_KEYS.COURSE_LIST, item);
  if (success) scheduleClassReminders();
  return success ? item : null;
}

function updateCourse(id, updates) {
  initCourseData();
  const success = storage.updateInList(STORAGE_KEYS.COURSE_LIST, id, {
    ...updates,
    updateTime: Date.now()
  });
  if (success) scheduleClassReminders();
  return success;
}

function deleteCourse(id) {
  initCourseData();
  const success = storage.removeFromList(STORAGE_KEYS.COURSE_LIST, id);
  if (success) scheduleClassReminders();
  return success;
}

function importCourses(text) {
  initCourseData();
  const lines = text.split('\n').filter(l => l.trim());
  const imported = [];
  const colorCount = constants.COURSE_COLORS.length;
  let colorIdx = 0;

  lines.forEach(line => {
    const parts = line.split(/[,，\t|]/).map(s => s.trim());
    if (parts.length >= 5) {
      const [name, teacher, classroom, dayStr, slotStr, weeks, credit] = parts;
      const dayOfWeek = parseInt(dayStr) || 1;
      const slots = slotStr.split('-').map(s => parseInt(s));
      const startSlot = slots[0] || 1;
      const endSlot = slots[1] || startSlot;
      imported.push({
        id: util.generateId(),
        name,
        teacher,
        classroom,
        dayOfWeek: Math.max(1, Math.min(7, dayOfWeek)),
        startSlot,
        endSlot,
        colorIndex: colorIdx % colorCount,
        weeks: weeks || '1-16周',
        credit: parseFloat(credit) || 2,
        semester: getCurrentSemester(),
        createTime: Date.now()
      });
      colorIdx++;
    }
  });

  if (imported.length > 0) {
    const existing = storage.getList(STORAGE_KEYS.COURSE_LIST);
    storage.set(STORAGE_KEYS.COURSE_LIST, [...existing, ...imported]);
    scheduleClassReminders();
  }
  return imported;
}

function getCourseSettings() {
  initCourseData();
  return storage.get(STORAGE_KEYS.COURSE_SETTINGS) || { ...mockData.MOCK_COURSE_SETTINGS };
}

function updateCourseSettings(updates) {
  initCourseData();
  const current = getCourseSettings();
  const newSettings = { ...current, ...updates };
  storage.set(STORAGE_KEYS.COURSE_SETTINGS, newSettings);
  scheduleClassReminders();
  return newSettings;
}

function getTodayCourses() {
  const today = new Date().getDay();
  const dayOfWeek = today === 0 ? 7 : today;
  return getCoursesByDay(dayOfWeek);
}

// ==================== 考试成绩 ====================
let examScoreInitialized = false;

function initExamScoreData() {
  if (examScoreInitialized) return;
  const existing = storage.get(STORAGE_KEYS.EXAM_SCORES);
  if (!existing || existing.length === 0) {
    storage.set(STORAGE_KEYS.EXAM_SCORES, [...mockData.MOCK_EXAM_SCORES]);
  }
  examScoreInitialized = true;
}

function getExamScoreList(filters = {}) {
  initExamScoreData();
  let list = storage.getList(STORAGE_KEYS.EXAM_SCORES);
  if (filters.semester) {
    list = list.filter(item => item.semester === filters.semester);
  }
  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['courseName']);
  }
  if (filters.courseType) {
    list = list.filter(item => item.courseType === filters.courseType);
  }
  return list;
}

function getExamScoresBySemester() {
  const scores = getExamScoreList();
  const result = {};
  scores.forEach(s => {
    if (!result[s.semester]) result[s.semester] = [];
    result[s.semester].push(s);
  });
  return result;
}

function calculateGPA(scores) {
  if (!scores || scores.length === 0) return { gpa: 0, totalCredit: 0, weightedSum: 0 };
  let totalCredit = 0;
  let weightedSum = 0;
  scores.forEach(s => {
    if (s.courseType === '必修' || s.courseType === '选修') {
      const gpa = constants.getGPA(s.score);
      totalCredit += s.credit;
      weightedSum += gpa * s.credit;
    }
  });
  return {
    gpa: totalCredit > 0 ? Math.round(weightedSum / totalCredit * 100) / 100 : 0,
    totalCredit,
    weightedSum
  };
}

function calculateCreditStats() {
  const scores = getExamScoreList();
  const passed = scores.filter(s => s.score >= 60);
  const failed = scores.filter(s => s.score < 60);
  const required = scores.filter(s => s.courseType === '必修');
  const elective = scores.filter(s => s.courseType === '选修');

  return {
    totalCourses: scores.length,
    passedCount: passed.length,
    failedCount: failed.length,
    totalCredit: scores.reduce((sum, s) => sum + (s.credit || 0), 0),
    earnedCredit: passed.reduce((sum, s) => sum + (s.credit || 0), 0),
    requiredCredit: required.filter(s => s.score >= 60).reduce((sum, s) => sum + (s.credit || 0), 0),
    electiveCredit: elective.filter(s => s.score >= 60).reduce((sum, s) => sum + (s.credit || 0), 0),
    gpa: calculateGPA(scores).gpa
  };
}

function getFailedCourses() {
  return getExamScoreList().filter(s => s.score < 60);
}

// ==================== 考试安排 ====================
let examScheduleInitialized = false;

function initExamScheduleData() {
  if (examScheduleInitialized) return;
  const existing = storage.get(STORAGE_KEYS.EXAM_SCHEDULE);
  if (!existing || existing.length === 0) {
    storage.set(STORAGE_KEYS.EXAM_SCHEDULE, [...mockData.MOCK_EXAM_SCHEDULE]);
  }
  examScheduleInitialized = true;
}

function getExamScheduleList(filters = {}) {
  initExamScheduleData();
  let list = storage.getList(STORAGE_KEYS.EXAM_SCHEDULE);
  if (filters.isCompleted !== undefined) {
    list = list.filter(item => item.isCompleted === filters.isCompleted);
  }
  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['courseName', 'classroom']);
  }
  return list.sort((a, b) => {
    const dateA = new Date(a.examDate + ' ' + a.startTime).getTime();
    const dateB = new Date(b.examDate + ' ' + b.startTime).getTime();
    return dateA - dateB;
  });
}

function getUpcomingExams() {
  return getExamScheduleList({ isCompleted: false });
}

function getExamCountdown() {
  const upcoming = getUpcomingExams();
  if (upcoming.length === 0) return null;
  const now = Date.now();
  const countdowns = upcoming.map(exam => {
    const examTime = new Date(exam.examDate + ' ' + exam.startTime).getTime();
    const diff = examTime - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return {
      ...exam,
      timestamp: examTime,
      diff,
      days,
      hours,
      minutes,
      isExpired: diff <= 0
    };
  });
  return countdowns.filter(c => !c.isExpired).sort((a, b) => a.diff - b.diff);
}

function markExamCompleted(id) {
  initExamScheduleData();
  return storage.updateInList(STORAGE_KEYS.EXAM_SCHEDULE, id, {
    isCompleted: true,
    completedAt: Date.now()
  });
}

// ==================== 空教室查询 ====================
let classroomDataInitialized = false;
let classroomScheduleInitialized = false;

function initClassroomData() {
  if (classroomDataInitialized) return;
  const existing = storage.get(STORAGE_KEYS.CLASSROOM_LIST);
  if (!existing || existing.length === 0) {
    storage.set(STORAGE_KEYS.CLASSROOM_LIST, [...mockData.MOCK_CLASSROOMS]);
  }
  classroomDataInitialized = true;
}

function getClassroomList(filters = {}) {
  initClassroomData();
  let list = storage.getList(STORAGE_KEYS.CLASSROOM_LIST);
  if (filters.building && filters.building !== 'all') {
    list = list.filter(item => item.building === filters.building);
  }
  if (filters.type) {
    list = list.filter(item => item.type === filters.type);
  }
  if (filters.minCapacity !== undefined) {
    list = list.filter(item => item.capacity >= filters.minCapacity);
  }
  if (filters.hasProjector) {
    list = list.filter(item => item.hasProjector);
  }
  if (filters.hasAc) {
    list = list.filter(item => item.hasAc);
  }
  return list;
}

function generateClassroomSchedule() {
  if (classroomScheduleInitialized) return;
  const courses = getCourseList();
  const schedule = {};

  courses.forEach(course => {
    const match = course.classroom.match(/^([A-E])栋(\d+)/);
    if (match) {
      const building = match[1];
      const room = match[2];
      const id = `cr_${building}_${room}`;
      if (!schedule[id]) schedule[id] = {};
      for (let slot = course.startSlot; slot <= course.endSlot; slot++) {
        if (!schedule[id][course.dayOfWeek]) schedule[id][course.dayOfWeek] = {};
        schedule[id][course.dayOfWeek][slot] = {
          courseName: course.name,
          teacher: course.teacher,
          weeks: course.weeks
        };
      }
    }
  });

  const randomOccupied = 0.2;
  const classrooms = getClassroomList();
  classrooms.forEach(cr => {
    if (!schedule[cr.id]) schedule[cr.id] = {};
    for (let day = 1; day <= 7; day++) {
      if (!schedule[cr.id][day]) schedule[cr.id][day] = {};
      for (let slot = 1; slot <= 10; slot++) {
        if (!schedule[cr.id][day][slot] && Math.random() < randomOccupied) {
          schedule[cr.id][day][slot] = {
            courseName: '临时占用',
            teacher: '—',
            weeks: '活动占用'
          };
        }
      }
    }
  });

  storage.set('classroomScheduleData', schedule);
  classroomScheduleInitialized = true;
}

function getClassroomSchedule(classroomId) {
  initClassroomData();
  generateClassroomSchedule();
  const schedule = storage.get('classroomScheduleData') || {};
  return schedule[classroomId] || {};
}

function getAvailableClassrooms(filters = {}) {
  initClassroomData();
  generateClassroomSchedule();
  const { dayOfWeek, startSlot, endSlot, building } = filters;
  const classrooms = getClassroomList({ building: building || 'all' });
  const schedule = storage.get('classroomScheduleData') || {};

  return classrooms.filter(cr => {
    const crSchedule = schedule[cr.id] || {};
    const daySchedule = crSchedule[dayOfWeek] || {};
    for (let slot = startSlot; slot <= endSlot; slot++) {
      if (daySchedule[slot]) return false;
    }
    return true;
  });
}

// ==================== 上课提醒 ====================
function scheduleClassReminders() {
  const settings = getCourseSettings();
  if (!settings.enableReminder || !settings.reminderMinutes) {
    clearClassReminders();
    return [];
  }

  const todayCourses = getTodayCourses();
  const reminders = [];
  const now = new Date();

  todayCourses.forEach(course => {
    const slot = constants.getSlotTime(course.startSlot);
    if (!slot) return;

    const [sh, sm] = slot.start.split(':').map(Number);
    const startTime = new Date();
    startTime.setHours(sh, sm, 0, 0);

    const remindTime = new Date(startTime.getTime() - settings.reminderMinutes * 60 * 1000);
    const diffMs = remindTime.getTime() - now.getTime();

    if (diffMs > 0) {
      reminders.push({
        id: 'reminder_' + course.id,
        courseId: course.id,
        courseName: course.name,
        classroom: course.classroom,
        teacher: course.teacher,
        startSlot: course.startSlot,
        startTime: slot.start,
        remindAt: remindTime.getTime(),
        minutesBefore: settings.reminderMinutes,
        scheduled: true
      });
    }
  });

  storage.set(STORAGE_KEYS.CLASS_REMINDERS, reminders);
  return reminders;
}

function getClassReminders() {
  return storage.getList(STORAGE_KEYS.CLASS_REMINDERS);
}

function clearClassReminders() {
  return storage.set(STORAGE_KEYS.CLASS_REMINDERS, []);
}

// ==================== 创新创业项目工坊 ====================

function initInnovationProjects() {
  if (innovationProjectsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.INNOVATION_PROJECT_LIST);
  if (!existing || existing.length === 0) {
    const now = Date.now();
    const projects = mockData.MOCK_INNOVATION_PROJECTS.map((item, index) => ({
      id: 'innov_proj_' + index + '_' + now,
      ...item,
      publisherId: 'user_' + (index + 1),
      views: item.views || 0,
      likes: item.likes || 0,
      createTime: now - (index + 1) * 86400000,
      updateTime: now - (index + 1) * 86400000
    }));
    storage.set(STORAGE_KEYS.INNOVATION_PROJECT_LIST, projects);
  }
  innovationProjectsInitialized = true;
}

function initInnovationMentors() {
  if (innovationMentorsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.INNOVATION_MENTOR_LIST);
  if (!existing || existing.length === 0) {
    const mentors = mockData.MOCK_INNOVATION_MENTORS.map((item, index) => ({
      id: 'innov_mentor_' + index,
      ...item
    }));
    storage.set(STORAGE_KEYS.INNOVATION_MENTOR_LIST, mentors);
  }
  innovationMentorsInitialized = true;
}

function initInnovationRoadshows() {
  if (innovationRoadshowsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.INNOVATION_ROADSHOW_LIST);
  if (!existing || existing.length === 0) {
    const now = Date.now();
    const roadshows = mockData.MOCK_INNOVATION_ROADSHOWS.map((item, index) => ({
      id: 'innov_roadshow_' + index + '_' + now,
      ...item,
      views: item.views || 0,
      createTime: item.createTime || now
    }));
    storage.set(STORAGE_KEYS.INNOVATION_ROADSHOW_LIST, roadshows);
  }
  innovationRoadshowsInitialized = true;
}

function initInnovationPolicies() {
  if (innovationPoliciesInitialized) return;
  const existing = storage.get(STORAGE_KEYS.INNOVATION_POLICY_LIST);
  if (!existing || existing.length === 0) {
    const policies = mockData.MOCK_INNOVATION_POLICIES.map((item, index) => ({
      id: 'innov_policy_' + index,
      ...item
    }));
    storage.set(STORAGE_KEYS.INNOVATION_POLICY_LIST, policies);
  }
  innovationPoliciesInitialized = true;
}

function initInnovationIncubators() {
  if (innovationIncubatorsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.INNOVATION_INCUBATOR_LIST);
  if (!existing || existing.length === 0) {
    const incubators = mockData.MOCK_INNOVATION_INCUBATORS.map((item, index) => ({
      id: 'innov_incubator_' + index,
      ...item
    }));
    storage.set(STORAGE_KEYS.INNOVATION_INCUBATOR_LIST, incubators);
  }
  innovationIncubatorsInitialized = true;
}

function initAllInnovationData() {
  initInnovationProjects();
  initInnovationMentors();
  initInnovationRoadshows();
  initInnovationPolicies();
  initInnovationIncubators();
}

function getInnovationProjectList(filters = {}) {
  initInnovationProjects();
  let list = storage.getList(STORAGE_KEYS.INNOVATION_PROJECT_LIST);

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['title', 'description', 'highlights']);
  }

  if (filters.field) {
    list = list.filter(item => item.field === filters.field);
  }

  if (filters.stage) {
    list = list.filter(item => item.stage === filters.stage);
  }

  if (filters.tab) {
    if (filters.tab === 'recruiting') {
      list = list.filter(item => item.recruitingRoles && item.recruitingRoles.length > 0);
    } else if (filters.tab === 'financing') {
      list = list.filter(item => item.financingStage && item.financingStage !== 'none');
    }
  }

  if (filters.status) {
    list = list.filter(item => item.status === filters.status);
  }

  return list.sort((a, b) => b.createTime - a.createTime);
}

function getInnovationProjectDetail(id) {
  initInnovationProjects();
  const list = storage.getList(STORAGE_KEYS.INNOVATION_PROJECT_LIST);
  return list.find(item => item.id === id) || null;
}

function publishInnovationProject(data) {
  initInnovationProjects();
  const now = Date.now();
  const project = {
    id: util.generateId(),
    ...data,
    views: 0,
    likes: 0,
    status: 'active',
    createTime: now,
    updateTime: now
  };
  storage.addToList(STORAGE_KEYS.INNOVATION_PROJECT_LIST, project);
  return project;
}

function updateInnovationProject(id, updates) {
  initInnovationProjects();
  const result = storage.updateInList(STORAGE_KEYS.INNOVATION_PROJECT_LIST, id, {
    ...updates,
    updateTime: Date.now()
  });
  return result;
}

function deleteInnovationProject(id) {
  initInnovationProjects();
  return storage.removeFromList(STORAGE_KEYS.INNOVATION_PROJECT_LIST, id);
}

function increaseInnovationProjectViews(id) {
  initInnovationProjects();
  const list = storage.getList(STORAGE_KEYS.INNOVATION_PROJECT_LIST);
  const index = list.findIndex(item => item.id === id);
  if (index > -1) {
    list[index].views = (list[index].views || 0) + 1;
    storage.set(STORAGE_KEYS.INNOVATION_PROJECT_LIST, list);
    return list[index].views;
  }
  return 0;
}

function getMyInnovationProjects(userId) {
  initInnovationProjects();
  const list = storage.getList(STORAGE_KEYS.INNOVATION_PROJECT_LIST);
  return list.filter(item => item.publisherId === userId);
}

function getInnovationMentorList(filters = {}) {
  initInnovationMentors();
  let list = storage.getList(STORAGE_KEYS.INNOVATION_MENTOR_LIST);

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['name', 'department', 'researchAreas']);
  }

  if (filters.title) {
    list = list.filter(item => item.title === filters.title);
  }

  if (filters.sortBy === 'rating') {
    list = list.sort((a, b) => b.rating - a.rating);
  } else if (filters.sortBy === 'appointments') {
    list = list.sort((a, b) => b.appointmentCount - a.appointmentCount);
  }

  return list;
}

function getInnovationMentorDetail(id) {
  initInnovationMentors();
  const list = storage.getList(STORAGE_KEYS.INNOVATION_MENTOR_LIST);
  return list.find(item => item.id === id) || null;
}

function createMentorAppointment(mentorId, appointmentData) {
  const appointments = storage.getList(STORAGE_KEYS.INNOVATION_APPOINTMENT_LIST);
  const appointment = {
    id: util.generateId(),
    mentorId,
    ...appointmentData,
    status: 'pending',
    createTime: Date.now()
  };
  appointments.unshift(appointment);
  storage.set(STORAGE_KEYS.INNOVATION_APPOINTMENT_LIST, appointments);
  return appointment;
}

function getMentorAppointments(mentorId) {
  return storage.getList(STORAGE_KEYS.INNOVATION_APPOINTMENT_LIST)
    .filter(item => item.mentorId === mentorId)
    .sort((a, b) => b.createTime - a.createTime);
}

function getMyMentorAppointments(userId) {
  return storage.getList(STORAGE_KEYS.INNOVATION_APPOINTMENT_LIST)
    .filter(item => item.userId === userId)
    .sort((a, b) => b.createTime - a.createTime);
}

function updateAppointmentStatus(appointmentId, status) {
  return storage.updateInList(STORAGE_KEYS.INNOVATION_APPOINTMENT_LIST, appointmentId, { status });
}

function getInnovationRoadshowList(filters = {}) {
  initInnovationRoadshows();
  let list = storage.getList(STORAGE_KEYS.INNOVATION_ROADSHOW_LIST);

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['title', 'subtitle', 'description']);
  }

  if (filters.status) {
    list = list.filter(item => item.status === filters.status);
  }

  return list.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });
}

function getInnovationRoadshowDetail(id) {
  initInnovationRoadshows();
  const list = storage.getList(STORAGE_KEYS.INNOVATION_ROADSHOW_LIST);
  return list.find(item => item.id === id) || null;
}

function registerForRoadshow(roadshowId, userId, userInfo) {
  initInnovationRoadshows();
  const roadshows = storage.getList(STORAGE_KEYS.INNOVATION_ROADSHOW_LIST);
  const index = roadshows.findIndex(item => item.id === roadshowId);
  if (index > -1) {
    roadshows[index].registeredCount = (roadshows[index].registeredCount || 0) + 1;
    storage.set(STORAGE_KEYS.INNOVATION_ROADSHOW_LIST, roadshows);

    const registrations = storage.getList(STORAGE_KEYS.INNOVATION_REGISTRATION_LIST);
    const registration = {
      id: util.generateId(),
      roadshowId,
      userId,
      ...userInfo,
      status: 'registered',
      createTime: Date.now()
    };
    registrations.unshift(registration);
    storage.set(STORAGE_KEYS.INNOVATION_REGISTRATION_LIST, registrations);
    return registration;
  }
  return null;
}

function cancelRoadshowRegistration(roadshowId, userId) {
  initInnovationRoadshows();
  const roadshows = storage.getList(STORAGE_KEYS.INNOVATION_ROADSHOW_LIST);
  const index = roadshows.findIndex(item => item.id === roadshowId);
  if (index > -1 && roadshows[index].registeredCount > 0) {
    roadshows[index].registeredCount--;
    storage.set(STORAGE_KEYS.INNOVATION_ROADSHOW_LIST, roadshows);

    const registrations = storage.getList(STORAGE_KEYS.INNOVATION_REGISTRATION_LIST);
    const filtered = registrations.filter(
      item => !(item.roadshowId === roadshowId && item.userId === userId)
    );
    storage.set(STORAGE_KEYS.INNOVATION_REGISTRATION_LIST, filtered);
    return true;
  }
  return false;
}

function isRegisteredForRoadshow(roadshowId, userId) {
  const registrations = storage.getList(STORAGE_KEYS.INNOVATION_REGISTRATION_LIST);
  return registrations.some(item => item.roadshowId === roadshowId && item.userId === userId);
}

function getMyRoadshowRegistrations(userId) {
  return storage.getList(STORAGE_KEYS.INNOVATION_REGISTRATION_LIST)
    .filter(item => item.userId === userId)
    .sort((a, b) => b.createTime - a.createTime);
}

function increaseRoadshowViews(id) {
  initInnovationRoadshows();
  const list = storage.getList(STORAGE_KEYS.INNOVATION_ROADSHOW_LIST);
  const index = list.findIndex(item => item.id === id);
  if (index > -1) {
    list[index].views = (list[index].views || 0) + 1;
    storage.set(STORAGE_KEYS.INNOVATION_ROADSHOW_LIST, list);
    return list[index].views;
  }
  return 0;
}

function getInnovationPolicyList(filters = {}) {
  initInnovationPolicies();
  let list = storage.getList(STORAGE_KEYS.INNOVATION_POLICY_LIST);

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['title', 'summary', 'content', 'tags']);
  }

  if (filters.type) {
    list = list.filter(item => item.type === filters.type);
  }

  return list.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}

function getInnovationPolicyDetail(id) {
  initInnovationPolicies();
  const list = storage.getList(STORAGE_KEYS.INNOVATION_POLICY_LIST);
  return list.find(item => item.id === id) || null;
}

function togglePolicyFavorite(id) {
  initInnovationPolicies();
  const list = storage.getList(STORAGE_KEYS.INNOVATION_POLICY_LIST);
  const index = list.findIndex(item => item.id === id);
  if (index > -1) {
    list[index].isFavorite = !list[index].isFavorite;
    storage.set(STORAGE_KEYS.INNOVATION_POLICY_LIST, list);
    return list[index].isFavorite;
  }
  return false;
}

function getFavoritePolicies() {
  initInnovationPolicies();
  const list = storage.getList(STORAGE_KEYS.INNOVATION_POLICY_LIST);
  return list.filter(item => item.isFavorite);
}

function getInnovationIncubatorList(filters = {}) {
  initInnovationIncubators();
  let list = storage.getList(STORAGE_KEYS.INNOVATION_INCUBATOR_LIST);

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['name', 'description', 'services']);
  }

  if (filters.type) {
    list = list.filter(item => item.type === filters.type);
  }

  if (filters.level) {
    list = list.filter(item => item.level === filters.level);
  }

  return list;
}

function getInnovationIncubatorDetail(id) {
  initInnovationIncubators();
  const list = storage.getList(STORAGE_KEYS.INNOVATION_INCUBATOR_LIST);
  return list.find(item => item.id === id) || null;
}

function applyForIncubator(incubatorId, applicationData) {
  const applications = storage.getList(STORAGE_KEYS.INNOVATION_MY_PROJECTS);
  const application = {
    id: util.generateId(),
    incubatorId,
    ...applicationData,
    status: 'pending',
    createTime: Date.now()
  };
  applications.unshift(application);
  storage.set(STORAGE_KEYS.INNOVATION_MY_PROJECTS, applications);
  return application;
}

let lowCarbonInitialized = false;

function initLowCarbonData() {
  if (lowCarbonInitialized) return;
  const now = Date.now();

  let activityList = storage.get(STORAGE_KEYS.LOW_CARBON_ACTIVITY_LIST);
  if (!activityList || activityList.length === 0) {
    activityList = mockData.MOCK_LOW_CARBON_ACTIVITIES.map((item, index) => ({
      id: 'mock_lca_' + index + '_' + now,
      ...item,
      registrations: [],
      status: 'registering',
      views: Math.floor(Math.random() * 200) + 50,
      createTime: now - index * 86400000,
      updateTime: now - index * 86400000
    }));
    storage.set(STORAGE_KEYS.LOW_CARBON_ACTIVITY_LIST, activityList);
  }

  let rewardList = storage.get(STORAGE_KEYS.LOW_CARBON_REDEEM_LIST);
  if (!rewardList || rewardList.length === 0) {
    rewardList = mockData.MOCK_LOW_CARBON_REWARDS.map((item, index) => ({
      id: 'mock_lcr_' + index + '_' + now,
      ...item,
      createTime: now - index * 86400000
    }));
    storage.set(STORAGE_KEYS.LOW_CARBON_REDEEM_LIST, rewardList);
  }

  let pointsData = storage.get(STORAGE_KEYS.LOW_CARBON_POINTS);
  if (pointsData === null || pointsData === undefined) {
    const userId = 'test_user';
    pointsData = {
      [userId]: {
        totalPoints: 120,
        totalCarbon: 9.8,
        checkinDays: 8,
        categoryCounts: { walk_to_school: 5, empty_plate: 6, paperless: 3, public_transport: 2 }
      }
    };
    storage.set(STORAGE_KEYS.LOW_CARBON_POINTS, pointsData);
  }

  let pointsRecord = storage.get(STORAGE_KEYS.LOW_CARBON_POINTS_RECORD);
  if (!pointsRecord || Object.keys(pointsRecord).length === 0) {
    const userId = 'test_user';
    const records = [];
    for (let i = 1; i <= 8; i++) {
      const types = ['walk_to_school', 'empty_plate', 'paperless', 'public_transport'];
      const type = types[i % types.length];
      const typeInfo = constants.LOW_CARBON_CHECKIN_MAP[type];
      records.push({
        id: 'lcr_' + i + '_' + now,
        userId,
        type,
        points: typeInfo.points,
        carbon: typeInfo.carbon,
        date: util.formatTime(now - i * 86400000, 'YYYY-MM-DD'),
        createTime: now - i * 86400000
      });
    }
    pointsRecord = { [userId]: records };
    storage.set(STORAGE_KEYS.LOW_CARBON_POINTS_RECORD, pointsRecord);
  }

  let checkinList = storage.get(STORAGE_KEYS.LOW_CARBON_CHECKIN_LIST);
  if (!checkinList) {
    checkinList = {};
    storage.set(STORAGE_KEYS.LOW_CARBON_CHECKIN_LIST, checkinList);
  }

  let registrationList = storage.get(STORAGE_KEYS.LOW_CARBON_ACTIVITY_REGISTRATION);
  if (!registrationList) {
    registrationList = {};
    storage.set(STORAGE_KEYS.LOW_CARBON_ACTIVITY_REGISTRATION, registrationList);
  }

  let redeemOrders = storage.get(STORAGE_KEYS.LOW_CARBON_REDEEM_ORDER);
  if (!redeemOrders) {
    redeemOrders = {};
    storage.set(STORAGE_KEYS.LOW_CARBON_REDEEM_ORDER, redeemOrders);
  }

  lowCarbonInitialized = true;
}

function doLowCarbonCheckin(userId, type) {
  const today = util.formatTime(Date.now(), 'YYYY-MM-DD');
  const checkinKey = userId + '_' + today;
  const checkinList = storage.get(STORAGE_KEYS.LOW_CARBON_CHECKIN_LIST) || {};

  if (checkinList[checkinKey] && checkinList[checkinKey][type]) {
    return { success: false, message: '今日已打卡' };
  }

  if (!checkinList[checkinKey]) {
    checkinList[checkinKey] = {};
  }
  checkinList[checkinKey][type] = { time: Date.now() };
  storage.set(STORAGE_KEYS.LOW_CARBON_CHECKIN_LIST, checkinList);

  const typeInfo = constants.LOW_CARBON_CHECKIN_MAP[type];
  if (!typeInfo) return { success: false, message: '无效打卡类型' };

  let pointsData = storage.get(STORAGE_KEYS.LOW_CARBON_POINTS) || {};
  if (!pointsData[userId]) {
    pointsData[userId] = { totalPoints: 0, totalCarbon: 0, checkinDays: 0, categoryCounts: {} };
  }
  const userPoints = pointsData[userId];
  userPoints.totalPoints += typeInfo.points;
  userPoints.totalCarbon = Math.round((userPoints.totalCarbon + typeInfo.carbon) * 100) / 100;
  userPoints.categoryCounts[type] = (userPoints.categoryCounts[type] || 0) + 1;

  const allDates = Object.keys(checkinList).filter(k => k.startsWith(userId + '_'));
  userPoints.checkinDays = allDates.length;

  storage.set(STORAGE_KEYS.LOW_CARBON_POINTS, pointsData);

  let pointsRecord = storage.get(STORAGE_KEYS.LOW_CARBON_POINTS_RECORD) || {};
  if (!pointsRecord[userId]) pointsRecord[userId] = [];
  pointsRecord[userId].unshift({
    id: util.generateId(),
    userId,
    type,
    points: typeInfo.points,
    carbon: typeInfo.carbon,
    date: today,
    createTime: Date.now()
  });
  storage.set(STORAGE_KEYS.LOW_CARBON_POINTS_RECORD, pointsRecord);

  return {
    success: true,
    points: typeInfo.points,
    carbon: typeInfo.carbon,
    totalPoints: userPoints.totalPoints,
    totalCarbon: userPoints.totalCarbon,
    label: typeInfo.label,
    icon: typeInfo.icon
  };
}

function getTodayCheckins(userId) {
  const today = util.formatTime(Date.now(), 'YYYY-MM-DD');
  const checkinKey = userId + '_' + today;
  const checkinList = storage.get(STORAGE_KEYS.LOW_CARBON_CHECKIN_LIST) || {};
  return checkinList[checkinKey] || {};
}

function getLowCarbonPoints(userId) {
  const pointsData = storage.get(STORAGE_KEYS.LOW_CARBON_POINTS) || {};
  return pointsData[userId] || { totalPoints: 0, totalCarbon: 0, checkinDays: 0, categoryCounts: {} };
}

function getLowCarbonPointsRecord(userId, limit) {
  const pointsRecord = storage.get(STORAGE_KEYS.LOW_CARBON_POINTS_RECORD) || {};
  const records = pointsRecord[userId] || [];
  return limit ? records.slice(0, limit) : records;
}

function getLowCarbonLeaderboard(period) {
  const leaderboardData = mockData.MOCK_LOW_CARBON_LEADERBOARD.map((item, index) => ({
    ...item,
    rank: index + 1
  }));

  const pointsData = storage.get(STORAGE_KEYS.LOW_CARBON_POINTS) || {};
  const userId = 'test_user';
  if (pointsData[userId]) {
    const userEntry = {
      userId,
      userName: '测试用户',
      totalPoints: pointsData[userId].totalPoints,
      totalCarbon: pointsData[userId].totalCarbon,
      checkinDays: pointsData[userId].checkinDays,
      walkCount: pointsData[userId].categoryCounts.walk_to_school || 0,
      emptyPlateCount: pointsData[userId].categoryCounts.empty_plate || 0,
      paperlessCount: pointsData[userId].categoryCounts.paperless || 0,
      transportCount: pointsData[userId].categoryCounts.public_transport || 0
    };

    const existingIdx = leaderboardData.findIndex(item => item.userId === userId);
    if (existingIdx >= 0) {
      leaderboardData[existingIdx] = userEntry;
    } else {
      leaderboardData.push(userEntry);
    }
  }

  leaderboardData.sort((a, b) => b.totalPoints - a.totalPoints);
  leaderboardData.forEach((item, index) => { item.rank = index + 1; });

  if (period === 'week') {
    return leaderboardData.map(item => ({
      ...item,
      totalPoints: Math.floor(item.totalPoints * 0.15),
      totalCarbon: Math.round(item.totalCarbon * 0.15 * 100) / 100
    }));
  }
  if (period === 'month') {
    return leaderboardData.map(item => ({
      ...item,
      totalPoints: Math.floor(item.totalPoints * 0.4),
      totalCarbon: Math.round(item.totalCarbon * 0.4 * 100) / 100
    }));
  }

  return leaderboardData;
}

function getLowCarbonActivityList(filters) {
  let list = storage.getList(STORAGE_KEYS.LOW_CARBON_ACTIVITY_LIST);

  if (filters) {
    if (filters.type) list = list.filter(item => item.type === filters.type);
    if (filters.status) list = list.filter(item => item.status === filters.status);
  }

  return list;
}

function registerForEcoActivity(userId, activityId) {
  const list = storage.getList(STORAGE_KEYS.LOW_CARBON_ACTIVITY_LIST);
  const activity = list.find(a => a.id === activityId);
  if (!activity) return { success: false, message: '活动不存在' };
  if (activity.registrations && activity.registrations.length >= activity.maxParticipants) {
    return { success: false, message: '名额已满' };
  }

  const regList = storage.get(STORAGE_KEYS.LOW_CARBON_ACTIVITY_REGISTRATION) || {};
  if (regList[userId] && regList[userId].includes(activityId)) {
    return { success: false, message: '已报名' };
  }

  if (!activity.registrations) activity.registrations = [];
  activity.registrations.push({ userId, time: Date.now() });
  if (activity.registrations.length >= activity.maxParticipants) {
    activity.status = 'full';
  }
  storage.set(STORAGE_KEYS.LOW_CARBON_ACTIVITY_LIST, list);

  if (!regList[userId]) regList[userId] = [];
  regList[userId].push(activityId);
  storage.set(STORAGE_KEYS.LOW_CARBON_ACTIVITY_REGISTRATION, regList);

  return { success: true, message: '报名成功' };
}

function cancelEcoActivityRegistration(userId, activityId) {
  const list = storage.getList(STORAGE_KEYS.LOW_CARBON_ACTIVITY_LIST);
  const activity = list.find(a => a.id === activityId);
  if (!activity) return { success: false, message: '活动不存在' };

  if (activity.registrations) {
    activity.registrations = activity.registrations.filter(r => r.userId !== userId);
    if (activity.status === 'full') activity.status = 'registering';
  }
  storage.set(STORAGE_KEYS.LOW_CARBON_ACTIVITY_LIST, list);

  const regList = storage.get(STORAGE_KEYS.LOW_CARBON_ACTIVITY_REGISTRATION) || {};
  if (regList[userId]) {
    regList[userId] = regList[userId].filter(id => id !== activityId);
    storage.set(STORAGE_KEYS.LOW_CARBON_ACTIVITY_REGISTRATION, regList);
  }

  return { success: true, message: '取消成功' };
}

function getLowCarbonRewardList(category) {
  let list = storage.getList(STORAGE_KEYS.LOW_CARBON_REDEEM_LIST);
  if (category && category !== 'all') {
    list = list.filter(item => item.category === category);
  }
  return list;
}

function redeemReward(userId, rewardId) {
  const list = storage.getList(STORAGE_KEYS.LOW_CARBON_REDEEM_LIST);
  const reward = list.find(r => r.id === rewardId);
  if (!reward) return { success: false, message: '礼品不存在' };
  if (reward.stock <= 0) return { success: false, message: '库存不足' };

  const pointsData = storage.get(STORAGE_KEYS.LOW_CARBON_POINTS) || {};
  const userPoints = pointsData[userId] || { totalPoints: 0 };
  if (userPoints.totalPoints < reward.points) return { success: false, message: '积分不足' };

  userPoints.totalPoints -= reward.points;
  pointsData[userId] = userPoints;
  storage.set(STORAGE_KEYS.LOW_CARBON_POINTS, pointsData);

  reward.stock -= 1;
  storage.set(STORAGE_KEYS.LOW_CARBON_REDEEM_LIST, list);

  const orderList = storage.get(STORAGE_KEYS.LOW_CARBON_REDEEM_ORDER) || {};
  if (!orderList[userId]) orderList[userId] = [];
  orderList[userId].unshift({
    id: util.generateId(),
    rewardId,
    rewardTitle: reward.title,
    points: reward.points,
    category: reward.category,
    status: 'success',
    createTime: Date.now()
  });
  storage.set(STORAGE_KEYS.LOW_CARBON_REDEEM_ORDER, orderList);

  return { success: true, message: '兑换成功', remainingPoints: userPoints.totalPoints };
}

function getLowCarbonRedeemOrders(userId) {
  const orderList = storage.get(STORAGE_KEYS.LOW_CARBON_REDEEM_ORDER) || {};
  return orderList[userId] || [];
}

function getWeeklyCarbonReport(userId) {
  const pointsData = storage.get(STORAGE_KEYS.LOW_CARBON_POINTS) || {};
  const userPoints = pointsData[userId] || { totalPoints: 0, totalCarbon: 0, checkinDays: 0, categoryCounts: {} };

  const now = new Date();
  const dayOfWeek = now.getDay() || 7;
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek + 1);
  weekStart.setHours(0, 0, 0, 0);

  const pointsRecord = storage.get(STORAGE_KEYS.LOW_CARBON_POINTS_RECORD) || {};
  const allRecords = pointsRecord[userId] || [];

  const weekRecords = allRecords.filter(r => r.createTime >= weekStart.getTime());
  const weekPoints = weekRecords.reduce((sum, r) => sum + r.points, 0);
  const weekCarbon = weekRecords.reduce((sum, r) => sum + r.carbon, 0);

  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const dailyData = weekDays.map((day, index) => {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + index);
    const dayStr = util.formatTime(dayDate.getTime(), 'YYYY-MM-DD');
    const dayRecords = weekRecords.filter(r => r.date === dayStr);
    return {
      day,
      points: dayRecords.reduce((sum, r) => sum + r.points, 0),
      carbon: Math.round(dayRecords.reduce((sum, r) => sum + r.carbon, 0) * 100) / 100,
      count: dayRecords.length
    };
  });

  const maxDailyPoints = Math.max(1, ...dailyData.map(d => d.points));

  const categoryBreakdown = constants.LOW_CARBON_CHECKIN_TYPES.map(type => {
    const weekTypeRecords = weekRecords.filter(r => r.type === type.value);
    return {
      type: type.value,
      label: type.label,
      icon: type.icon,
      count: weekTypeRecords.length,
      points: weekTypeRecords.reduce((sum, r) => sum + r.points, 0),
      carbon: Math.round(weekTypeRecords.reduce((sum, r) => sum + r.carbon, 0) * 100) / 100
    };
  }).filter(c => c.count > 0);

  const leaderboard = getLowCarbonLeaderboard('week');
  const myRank = leaderboard.find(item => item.userId === userId);
  const rankPercent = myRank ? Math.round((1 - (myRank.rank - 1) / leaderboard.length) * 100) : 0;

  return {
    totalPoints: userPoints.totalPoints,
    totalCarbon: userPoints.totalCarbon,
    totalDays: userPoints.checkinDays,
    weekPoints,
    weekCarbon: Math.round(weekCarbon * 100) / 100,
    weekCheckinDays: dailyData.filter(d => d.count > 0).length,
    dailyData,
    maxDailyPoints,
    categoryBreakdown,
    rank: myRank ? myRank.rank : 0,
    rankPercent,
    tip: constants.LOW_CARBON_TIPS[Math.floor(Math.random() * constants.LOW_CARBON_TIPS.length)]
  };
}

// ==================== 校友圈 ====================

function initAllAlumniData() {
  initAlumniPosts();
  initAlumniMentors();
  initAlumniCardBenefits();
  initAlumniProfiles();
}

function initAlumniPosts() {
  if (alumniPostsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.ALUMNI_POST_LIST);
  if (!existing || existing.length === 0) {
    const now = Date.now();
    const posts = mockData.MOCK_ALUMNI_POSTS.map((item, index) => ({
      id: 'alumni_post_' + index + '_' + now,
      ...item,
      likes: item.likes || 0,
      comments: item.comments || [],
      views: item.views || 0,
      createTime: now - (index + 1) * 86400000
    }));
    storage.set(STORAGE_KEYS.ALUMNI_POST_LIST, posts);
  }
  alumniPostsInitialized = true;
}

function getAlumniPostList(filters = {}) {
  initAlumniPosts();
  let list = storage.getList(STORAGE_KEYS.ALUMNI_POST_LIST);

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['title', 'content', 'authorName']);
  }

  if (filters.type) {
    list = list.filter(item => item.type === filters.type);
  }

  return list.sort((a, b) => b.createTime - a.createTime);
}

function getAlumniPostDetail(id) {
  initAlumniPosts();
  const list = storage.getList(STORAGE_KEYS.ALUMNI_POST_LIST);
  return list.find(item => item.id === id) || null;
}

function publishAlumniPost(data) {
  initAlumniPosts();
  const now = Date.now();
  const post = {
    id: 'alumni_post_' + now,
    ...data,
    likes: 0,
    comments: [],
    views: 0,
    createTime: now
  };
  storage.addToList(STORAGE_KEYS.ALUMNI_POST_LIST, post);
  return post;
}

function likeAlumniPost(id) {
  initAlumniPosts();
  const list = storage.getList(STORAGE_KEYS.ALUMNI_POST_LIST);
  const index = list.findIndex(item => item.id === id);
  if (index > -1) {
    list[index].likes = (list[index].likes || 0) + 1;
    storage.set(STORAGE_KEYS.ALUMNI_POST_LIST, list);
    return list[index];
  }
  return null;
}

function initAlumniMentors() {
  if (alumniMentorsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.ALUMNI_MENTOR_LIST);
  if (!existing || existing.length === 0) {
    const mentors = mockData.MOCK_ALUMNI_MENTORS.map((item, index) => ({
      id: 'alumni_mentor_' + index,
      ...item
    }));
    storage.set(STORAGE_KEYS.ALUMNI_MENTOR_LIST, mentors);
  }
  alumniMentorsInitialized = true;
}

function getAlumniMentorList(filters = {}) {
  initAlumniMentors();
  let list = storage.getList(STORAGE_KEYS.ALUMNI_MENTOR_LIST);

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['name', 'title', 'company', 'industry', 'college']);
  }

  if (filters.industry) {
    list = list.filter(item => item.industry === filters.industry);
  }

  if (filters.title) {
    list = list.filter(item => item.title === filters.title);
  }

  if (filters.college) {
    list = list.filter(item => item.college === filters.college);
  }

  return list;
}

function getAlumniMentorDetail(id) {
  initAlumniMentors();
  const list = storage.getList(STORAGE_KEYS.ALUMNI_MENTOR_LIST);
  return list.find(item => item.id === id) || null;
}

function createAlumniMentorAppointment(mentorId, data) {
  initAlumniMentors();
  const appointments = storage.get(STORAGE_KEYS.ALUMNI_MENTOR_APPOINTMENTS) || [];
  const now = Date.now();
  const appointment = {
    id: 'alumni_appt_' + now,
    mentorId,
    ...data,
    status: 'pending',
    createTime: now
  };
  appointments.push(appointment);
  storage.set(STORAGE_KEYS.ALUMNI_MENTOR_APPOINTMENTS, appointments);
  return appointment;
}

function getMyAlumniMentorAppointments(userId) {
  const appointments = storage.get(STORAGE_KEYS.ALUMNI_MENTOR_APPOINTMENTS) || [];
  const mentorMap = {};
  const mentors = storage.getList(STORAGE_KEYS.ALUMNI_MENTOR_LIST);
  mentors.forEach(m => { mentorMap[m.id] = m; });

  return appointments
    .filter(a => a.userId === userId)
    .map(a => ({
      ...a,
      mentorInfo: mentorMap[a.mentorId] || null
    }))
    .sort((a, b) => b.createTime - a.createTime);
}

function updateAlumniAppointmentStatus(appointmentId, status) {
  const appointments = storage.get(STORAGE_KEYS.ALUMNI_MENTOR_APPOINTMENTS) || [];
  const index = appointments.findIndex(a => a.id === appointmentId);
  if (index > -1) {
    appointments[index].status = status;
    storage.set(STORAGE_KEYS.ALUMNI_MENTOR_APPOINTMENTS, appointments);
    return appointments[index];
  }
  return null;
}

function getAlumniVerifyInfo(userId) {
  const verifyInfo = storage.get(STORAGE_KEYS.ALUMNI_VERIFY_INFO) || {};
  return verifyInfo[userId] || null;
}

function submitAlumniVerify(userId, data) {
  const verifyInfo = storage.get(STORAGE_KEYS.ALUMNI_VERIFY_INFO) || {};
  const now = Date.now();
  verifyInfo[userId] = {
    ...data,
    userId,
    status: 'pending',
    submitTime: now,
    updateTime: now
  };
  storage.set(STORAGE_KEYS.ALUMNI_VERIFY_INFO, verifyInfo);
  return verifyInfo[userId];
}

function submitAlumniVisitAppointment(data) {
  const appointments = storage.get(STORAGE_KEYS.ALUMNI_VISIT_APPOINTMENTS) || [];
  const now = Date.now();
  const appointment = {
    id: 'visit_appt_' + now,
    ...data,
    status: 'pending',
    createTime: now
  };
  appointments.push(appointment);
  storage.set(STORAGE_KEYS.ALUMNI_VISIT_APPOINTMENTS, appointments);
  return appointment;
}

function getMyAlumniVisitAppointments(userId) {
  const appointments = storage.get(STORAGE_KEYS.ALUMNI_VISIT_APPOINTMENTS) || [];
  return appointments
    .filter(a => a.userId === userId)
    .sort((a, b) => b.createTime - a.createTime);
}

function initAlumniCardBenefits() {
  if (alumniCardBenefitsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.ALUMNI_CARD_BENEFITS);
  if (!existing || existing.length === 0) {
    const benefits = mockData.MOCK_ALUMNI_CARD_BENEFITS.map((item, index) => ({
      id: 'alumni_benefit_' + index,
      ...item
    }));
    storage.set(STORAGE_KEYS.ALUMNI_CARD_BENEFITS, benefits);
  }
  alumniCardBenefitsInitialized = true;
}

function getAlumniCardBenefits() {
  initAlumniCardBenefits();
  return storage.getList(STORAGE_KEYS.ALUMNI_CARD_BENEFITS);
}

function initAlumniProfiles() {
  if (alumniProfilesInitialized) return;
  const existing = storage.get(STORAGE_KEYS.ALUMNI_PROFILE_LIST);
  if (!existing || existing.length === 0) {
    const profiles = mockData.MOCK_ALUMNI_PROFILES.map((item, index) => ({
      id: 'alumni_profile_' + index,
      ...item
    }));
    storage.set(STORAGE_KEYS.ALUMNI_PROFILE_LIST, profiles);
  }
  alumniProfilesInitialized = true;
}

function getAlumniProfileList(filters = {}) {
  initAlumniProfiles();
  let list = storage.getList(STORAGE_KEYS.ALUMNI_PROFILE_LIST);

  if (filters.industry) {
    list = list.filter(item => item.industry === filters.industry);
  }

  if (filters.college) {
    list = list.filter(item => item.college === filters.college);
  }

  if (filters.graduationYear) {
    list = list.filter(item => item.graduationYear === filters.graduationYear);
  }

  return list;
}

function getAlumniIndustryDistribution() {
  initAlumniProfiles();
  const profiles = storage.getList(STORAGE_KEYS.ALUMNI_PROFILE_LIST);
  const industryCount = {};

  profiles.forEach(p => {
    if (p.industry) {
      industryCount[p.industry] = (industryCount[p.industry] || 0) + 1;
    }
  });

  const industries = constants.ALUMNI_INDUSTRIES;
  const distribution = industries.map(ind => ({
    value: ind.value,
    label: ind.label,
    count: industryCount[ind.value] || 0,
    color: ind.color
  }));

  const total = distribution.reduce((sum, d) => sum + d.count, 0);
  distribution.forEach(d => {
    d.percent = total > 0 ? Math.round((d.count / total) * 100) : 0;
  });

  return {
    total,
    distribution: distribution.sort((a, b) => b.count - a.count)
  };
}

module.exports = {
  paginateList,

  getLostFoundList,
  getLostFoundListPaged,
  getLostFoundDetail,
  publishLostFound,
  updateLostFound,
  deleteLostFound,
  getMyLostFoundList,

  getMarketList,
  getMarketDetail,
  publishMarketItem,
  updateMarketItem,
  deleteMarketItem,
  increaseMarketViews,
  getMyMarketList,

  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  clearFavorites,

  getHistory,
  addHistory,
  clearHistory,
  removeHistory,

  globalSearch,

  getSurveyList,
  getSurveyDetail,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  closeSurvey,
  hasUserResponded,
  submitSurveyResponse,
  getSurveyResponses,
  getSurveyStatistics,

  getNotificationSettings,
  updateNotificationSettings,
  getNotificationList,
  getNotificationDetail,
  createNotification,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadCount,
  getUnreadCountByType,
  deleteNotification,
  clearNotifications,
  convertWeatherAlertToNotification,
  syncWeatherAlertsToNotifications,
  getWeatherAlertNotifications,

  getStudyMaterialsList,
  getStudyMaterialDetail,
  publishStudyMaterial,
  increaseStudyMaterialDownloads,
  increaseStudyMaterialFavorites,
  increaseStudyMaterialViews,

  getStudyRewardsList,
  getStudyRewardDetail,
  publishStudyReward,
  addRewardResponse,
  adoptRewardResponse,
  closeStudyReward,
  increaseStudyRewardViews,

  getUserPoints,
  updateUserPoints,
  grantRewardPoints,

  getEmergencyPhones,
  getPhonebookCategories,
  getPhonebookAllItems,
  getPhonebookItemsByCategory,
  searchPhonebook,
  getServiceGuides,
  getServiceGuideDetail,
  makePhoneCall,

  getCampusShopList,
  getCampusShopDetail,
  increaseShopViews,
  getShopReviews,
  addShopReview,

  getVolunteerActivityList,
  getVolunteerActivityDetail,
  publishVolunteerActivity,
  updateVolunteerActivity,
  increaseVolunteerViews,
  registerVolunteerActivity,
  cancelVolunteerRegistration,
  checkinVolunteer,
  checkoutVolunteer,
  scanCheckin,
  getCurrentSemester,
  getUserVolunteerHours,
  getVolunteerHoursByCategory,
  getVolunteerLeaderboard,
  getUserRegistrations,

  getErrandOrderList,
  getErrandHallList,
  getErrandOrderDetail,
  createErrandOrder,
  updateErrandOrder,
  cancelErrandOrder,
  acceptErrandOrder,
  startErrandOrder,
  completeErrandOrder,
  rateErrandOrder,
  checkTimeoutOrders,
  getMyPublishedOrders,
  getMyAcceptedOrders,
  getRunnerProfile,
  getRunnerCreditDetail,
  addViolation,
  containsSensitiveWord,
  getAddressList,
  getAddressDetail,
  addAddress,
  updateAddress,
  deleteAddress,
  getDefaultAddress,
  calculatePrintPrice,

  getRentalList,
  getRentalDetail,
  publishRentalHouse,
  updateRentalHouse,
  deleteRentalHouse,
  increaseRentalViews,
  reportAgent,
  getAgentReports,
  toggleFavorite,
  getCompareList,
  addToCompare,
  removeFromCompare,
  clearCompareList,
  isInCompareList,
  getFacilityLabel,

  getCarpoolList,
  getCarpoolDetail,
  publishCarpool,
  updateCarpool,
  deleteCarpool,
  increaseCarpoolViews,
  joinCarpool,
  confirmCarpoolMember,
  leaveCarpool,
  updateCarpoolStatus,

  initCanteenData,
  getAllDishes,
  getCanteenList,
  getCanteenDetail,
  getTodayRecommends,
  getNewDishes,
  getDishesByCanteenAndMeal,
  getDishDetail,
  getDishReviews,
  addDishReview,
  getCanteenReviews,
  toggleFavoriteCanteen,
  isFavoriteCanteen,
  toggleFavoriteDish,
  isFavoriteDish,
  getFavoriteCanteens,
  getFavoriteDishes,

  initForumData,
  getForumPostList,
  getForumPostDetail,
  publishForumPost,
  increaseForumPostViews,
  toggleForumPostLike,
  isForumPostLiked,
  addForumComment,
  toggleForumCommentLike,
  toggleForumPostFavorite,
  isForumPostFavorited,
  deleteForumPost,
  reportForumPost,
  banForumUser,
  followForumAuthor,
  isFollowingAuthor,
  getForumTopicStats,
  getUserForumPosts,
  checkSensitiveWords,
  isUserBanned,

  initClubData,
  getClubList,
  getClubDetail,
  getClubMembers,
  getClubActivities,
  isClubMember,
  joinClub,
  leaveClub,

  getClubActivityList,
  getClubActivityDetail,
  publishClubActivity,
  updateClubActivity,
  increaseClubActivityViews,
  registerClubActivity,
  cancelClubActivityRegistration,
  getUserRegisteredActivities,
  checkinClubActivity,
  isUserRegisteredForActivity,
  getClubActivityRegistrations,
  getClubActivitiesByDate,

  generateTicketCode,
  getUserWallet,
  updateWalletBalance,
  getActivityTicketInfo,
  createTicketOrder,
  getTicketOrderList,
  getTicketOrderDetail,
  calculateRefund,
  requestRefund,
  verifyTicketByCode,
  verifyTicketByQR,
  getActivityTicketStats,
  getUserOrdersByActivity,

  initMapData,
  getPOIList,
  getPOIDetail,
  searchPOI,
  getPOIByCategory,
  getHighlightPOIs,
  getRoutes,
  getRouteById,
  findRoute,
  getOrientationGuide,
  getFreshmanRegistrationFlow,
  toggleMapFavorite,
  isMapFavorite,
  getMapFavorites,
  getMapSearchHistory,
  addMapSearchHistory,
  clearMapSearchHistory,
  getMapSettings,
  updateMapSettings,

  // ==================== 课程表模块 ====================
  initCourseData,
  getCourseList,
  getCoursesByDay,
  getCoursesByWeek,
  getCourseDetail,
  addCourse,
  updateCourse,
  deleteCourse,
  importCourses,
  getCourseSettings,
  updateCourseSettings,
  getTodayCourses,

  // ==================== 考试成绩 ====================
  initExamScoreData,
  getExamScoreList,
  getExamScoresBySemester,
  calculateGPA,
  calculateCreditStats,
  getFailedCourses,

  // ==================== 考试安排 ====================
  initExamScheduleData,
  getExamScheduleList,
  getUpcomingExams,
  getExamCountdown,
  markExamCompleted,

  // ==================== 空教室查询 ====================
  initClassroomData,
  getClassroomList,
  getAvailableClassrooms,
  getClassroomSchedule,

  // ==================== 上课提醒 ====================
  scheduleClassReminders,
  getClassReminders,
  clearClassReminders,

  // ==================== 创新创业项目工坊 ====================
  initAllInnovationData,
  getInnovationProjectList,
  getInnovationProjectDetail,
  publishInnovationProject,
  updateInnovationProject,
  deleteInnovationProject,
  increaseInnovationProjectViews,
  getMyInnovationProjects,
  getInnovationMentorList,
  getInnovationMentorDetail,
  createMentorAppointment,
  getMentorAppointments,
  getMyMentorAppointments,
  updateAppointmentStatus,
  getInnovationRoadshowList,
  getInnovationRoadshowDetail,
  registerForRoadshow,
  cancelRoadshowRegistration,
  isRegisteredForRoadshow,
  getMyRoadshowRegistrations,
  increaseRoadshowViews,
  getInnovationPolicyList,
  getInnovationPolicyDetail,
  togglePolicyFavorite,
  getFavoritePolicies,
  getInnovationIncubatorList,
  getInnovationIncubatorDetail,
  applyForIncubator,

  initLowCarbonData,
  doLowCarbonCheckin,
  getTodayCheckins,
  getLowCarbonPoints,
  getLowCarbonPointsRecord,
  getLowCarbonLeaderboard,
  getLowCarbonActivityList,
  registerForEcoActivity,
  cancelEcoActivityRegistration,
  getLowCarbonRewardList,
  redeemReward,
  getLowCarbonRedeemOrders,
  getWeeklyCarbonReport,

  initAllAlumniData,
  getAlumniVerifyInfo,
  submitAlumniVerify,
  getAlumniPostList,
  getAlumniPostDetail,
  publishAlumniPost,
  likeAlumniPost,
  getAlumniMentorList,
  getAlumniMentorDetail,
  createAlumniMentorAppointment,
  getMyAlumniMentorAppointments,
  updateAlumniAppointmentStatus,
  submitAlumniVisitAppointment,
  getMyAlumniVisitAppointments,
  getAlumniCardBenefits,
  getAlumniIndustryDistribution,
  getAlumniProfileList
};
