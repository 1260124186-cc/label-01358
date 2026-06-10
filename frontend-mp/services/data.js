/**
 * 数据服务层
 */

const storage = require('../utils/storage');
const util = require('../utils/util');
const constants = require('../config/constants');
const mockData = require('../config/mock-data');

let studyMaterialsInitialized = false;
let studyRewardsInitialized = false;
let campusShopsInitialized = false;
let shopReviewsInitialized = false;
let volunteerInitialized = false;

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
const { STORAGE_KEYS } = storage;

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

  return list;
}

/**
 * 获取失物招领详情
 */
function getLostFoundDetail(id) {
  const list = storage.getList(STORAGE_KEYS.LOST_FOUND_LIST);
  return list.find(item => item.id === id) || null;
}

/**
 * 发布失物招领
 */
function publishLostFound(data) {
  const item = {
    id: util.generateId(),
    ...data,
    createTime: Date.now(),
    updateTime: Date.now(),
    status: 'active'
  };

  const success = storage.addToList(STORAGE_KEYS.LOST_FOUND_LIST, item);
  return success ? item : null;
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
  return storage.removeFromList(STORAGE_KEYS.LOST_FOUND_LIST, id);
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
  const item = {
    id: util.generateId(),
    ...data,
    createTime: Date.now(),
    updateTime: Date.now(),
    status: 'selling',
    views: 0
  };

  const success = storage.addToList(STORAGE_KEYS.MARKET_LIST, item);
  return success ? item : null;
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
  return storage.removeFromList(STORAGE_KEYS.MARKET_LIST, id);
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
  const existingOrders = storage.get(STORAGE_KEYS.ERRAND_ORDER_LIST);
  if (!existingOrders || existingOrders.length === 0) {
    const now = Date.now();
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
  errandDataInitialized = true;
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

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['pickupCode', 'deliveryAddress', 'fileName', 'orderId']);
  }

  return list.sort((a, b) => b.createTime - a.createTime);
}

function getErrandOrderDetail(id) {
  initErrandData();
  const list = storage.getList(STORAGE_KEYS.ERRAND_ORDER_LIST);
  return list.find(item => item.id === id) || null;
}

function createErrandOrder(data) {
  initErrandData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const item = {
    id: util.generateId(),
    ...data,
    userId: userInfo.id || 'test_user',
    userName: userInfo.nickName || '匿名用户',
    userAvatar: userInfo.avatarUrl || '',
    status: 'pending',
    createTime: Date.now(),
    updateTime: Date.now()
  };

  storage.addToList(STORAGE_KEYS.ERRAND_ORDER_LIST, item);
  return item;
}

function updateErrandOrder(id, updates) {
  return storage.updateInList(STORAGE_KEYS.ERRAND_ORDER_LIST, id, {
    ...updates,
    updateTime: Date.now()
  });
}

function cancelErrandOrder(id) {
  const order = getErrandOrderDetail(id);
  if (!order) return false;
  if (order.status !== 'pending') return false;
  return storage.updateInList(STORAGE_KEYS.ERRAND_ORDER_LIST, id, {
    status: 'cancelled',
    updateTime: Date.now()
  });
}

function getAddressList() {
  initErrandData();
  return storage.getList(STORAGE_KEYS.ERRAND_ADDRESS_LIST);
}

function getAddressDetail(id) {
  initErrandData();
  const list = storage.getList(STORAGE_KEYS.ERRAND_ADDRESS_LIST);
  return list.find(item => item.id === id) || null;
}

function addAddress(data) {
  initErrandData();
  const item = {
    id: util.generateId(),
    ...data,
    isDefault: data.isDefault || false
  };

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
}

function updateCarpoolStatus(carpoolId, status) {
  return updateCarpool(carpoolId, { status });
}

module.exports = {
  getLostFoundList,
  getLostFoundDetail,
  publishLostFound,
  updateLostFound,
  deleteLostFound,

  getMarketList,
  getMarketDetail,
  publishMarketItem,
  updateMarketItem,
  deleteMarketItem,
  increaseMarketViews,

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
  getErrandOrderDetail,
  createErrandOrder,
  updateErrandOrder,
  cancelErrandOrder,
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
  updateCarpoolStatus
};
