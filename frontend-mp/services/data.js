/**
 * 数据服务层
 */

const storage = require('../utils/storage');
const util = require('../utils/util');
const constants = require('../config/constants');
const mockData = require('../config/mock-data');
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

  return { lostList, marketList, newsList };
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
  getWeatherAlertNotifications
};
