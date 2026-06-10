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
  addShopReview
};
