/**
 * 数据服务层
 */

const storage = require('../utils/storage');
const { STORAGE_KEYS } = storage;
const util = require('../utils/util');
const constants = require('../config/constants');
const mockData = require('../config/mock-data');
const campusService = require('./campusService');

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
let takeoutInitialized = false;
let scholarshipInitialized = false;
let workStudyInitialized = false;
let jobRecruitmentInitialized = false;
let psychologicalInitialized = false;
let busDataInitialized = false;
let libraryBooksInitialized = false;
let libraryBorrowInitialized = false;
let libraryRoomsInitialized = false;
let librarySeatsInitialized = false;
let librarySeatReservationsInitialized = false;
let libraryRecommendationsInitialized = false;

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

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
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

  if (campusService.isCampusDataScoped('lostFound')) {
    list = campusService.filterListByCampus(list, filters.campusId);
  }

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
    status: 'active',
    campusId: data.campusId || campusService.getCurrentCampusId()
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

  if (campusService.isCampusDataScoped('market')) {
    list = campusService.filterListByCampus(list, filters.campusId);
  }

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

function getMarketListPaged(pagination = {}) {
  const { page = 1, pageSize = 15, filters = {} } = pagination;
  let list = getMarketList(filters);

  if (filters.userLatitude && filters.userLongitude) {
    list = list.map(item => {
      if (item.latitude && item.longitude) {
        const distance = calculateDistance(
          filters.userLatitude,
          filters.userLongitude,
          item.latitude,
          item.longitude
        );
        return { ...item, _distance: distance };
      }
      return { ...item, _distance: Infinity };
    });

    if (filters.minDistance !== undefined) {
      list = list.filter(item => item._distance >= filters.minDistance);
    }
    if (filters.maxDistance !== undefined) {
      list = list.filter(item => item._distance <= filters.maxDistance);
    }

    list.sort((a, b) => {
      if (a._distance === Infinity && b._distance === Infinity) return b.createTime - a.createTime;
      if (a._distance === Infinity) return 1;
      if (b._distance === Infinity) return -1;
      return a._distance - b._distance;
    });
  } else {
    list = list.sort((a, b) => b.createTime - a.createTime);
  }

  return paginateList(list, page, pageSize);
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
    views: 0,
    campusId: data.campusId || campusService.getCurrentCampusId()
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

// ==================== 二手议价 ====================

function checkAndUpdateExpiredOffers(itemId = '') {
  const list = storage.getList(STORAGE_KEYS.MARKET_OFFERS);
  const now = Date.now();
  const timeoutMs = constants.MARKET_OFFER_TIMEOUT_HOURS * 60 * 60 * 1000;
  let hasChanges = false;

  const updatedList = list.map(offer => {
    if (itemId && offer.itemId !== itemId) return offer;
    if (offer.status !== 'pending' && offer.status !== 'countered') return offer;

    const expireTime = (offer.updateTime || offer.createTime) + timeoutMs;
    if (now >= expireTime) {
      hasChanges = true;
      return { ...offer, status: 'expired', updateTime: now };
    }
    return offer;
  });

  if (hasChanges) {
    storage.set(STORAGE_KEYS.MARKET_OFFERS, updatedList);
  }

  return hasChanges;
}

function getMarketOffersByItem(itemId, options = {}) {
  checkAndUpdateExpiredOffers(itemId);

  const list = storage.getList(STORAGE_KEYS.MARKET_OFFERS);
  let offers = list.filter(item => item.itemId === itemId);

  if (options.status) {
    offers = offers.filter(item => item.status === options.status);
  }

  if (options.userId) {
    offers = offers.filter(item => item.userId === options.userId);
  }

  return offers.sort((a, b) => b.createTime - a.createTime);
}

function getMarketOffersByUser(userId, options = {}) {
  checkAndUpdateExpiredOffers();

  const list = storage.getList(STORAGE_KEYS.MARKET_OFFERS);
  let offers = list.filter(item => {
    if (options.role === 'buyer') {
      return item.userId === userId;
    } else if (options.role === 'seller') {
      return item.sellerId === userId;
    }
    return item.userId === userId || item.sellerId === userId;
  });

  if (options.status) {
    offers = offers.filter(item => item.status === options.status);
  }

  return offers.sort((a, b) => b.createTime - a.createTime);
}

function getMarketOfferDetail(offerId) {
  checkAndUpdateExpiredOffers();

  const list = storage.getList(STORAGE_KEYS.MARKET_OFFERS);
  return list.find(item => item.id === offerId) || null;
}

function createMarketOffer(itemId, data) {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  if (!userInfo.id) {
    return { success: false, message: '请先登录' };
  }

  const item = getMarketDetail(itemId);
  if (!item) {
    return { success: false, message: '商品不存在' };
  }

  if (item.status !== 'selling') {
    return { success: false, message: '商品不在出售中，无法议价' };
  }

  if (item.userId === userInfo.id) {
    return { success: false, message: '不能对自己的商品出价' };
  }

  if (!data.price || data.price <= 0) {
    return { success: false, message: '请输入有效的出价金额' };
  }

  checkAndUpdateExpiredOffers(itemId);

  const existingOffers = getMarketOffersByItem(itemId, { userId: userInfo.id });
  const hasPendingOffer = existingOffers.some(
    o => o.status === 'pending' || o.status === 'countered'
  );

  if (hasPendingOffer) {
    return { success: false, message: '您已有待处理的出价，请等待卖家回复' };
  }

  const offer = {
    id: util.generateId(),
    itemId,
    itemTitle: item.title,
    itemImage: item.images && item.images[0] ? item.images[0] : '',
    itemPrice: item.price,
    userId: userInfo.id,
    userName: userInfo.nickName || '匿名用户',
    userAvatar: userInfo.avatarUrl || '',
    sellerId: item.userId,
    sellerName: item.userName || '卖家',
    price: Number(data.price),
    message: data.message || '',
    status: 'pending',
    createTime: Date.now(),
    updateTime: Date.now(),
    history: [
      {
        action: 'offer',
        price: Number(data.price),
        message: data.message || '',
        operatorId: userInfo.id,
        operatorName: userInfo.nickName || '匿名用户',
        time: Date.now()
      }
    ]
  };

  const success = storage.addToList(STORAGE_KEYS.MARKET_OFFERS, offer);

  if (success) {
    createNotification({
      userId: item.userId,
      type: 'transaction',
      subType: 'offer',
      title: '收到新的议价',
      content: `${userInfo.nickName || '有人'}对商品「${item.title}」出价 ¥${data.price}`,
      data: {
        offerId: offer.id,
        itemId,
        price: data.price
      }
    });

    return { success: true, data: offer };
  }

  return { success: false, message: '出价失败，请重试' };
}

function acceptMarketOffer(offerId) {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const offer = getMarketOfferDetail(offerId);
  if (!offer) {
    return { success: false, message: '出价记录不存在' };
  }

  if (offer.sellerId !== userInfo.id) {
    return { success: false, message: '只有卖家才能接受出价' };
  }

  if (offer.status !== 'pending' && offer.status !== 'countered') {
    return { success: false, message: '该出价状态无法接受' };
  }

  const item = getMarketDetail(offer.itemId);
  if (!item) {
    return { success: false, message: '商品不存在' };
  }

  if (item.status !== 'selling') {
    return { success: false, message: '商品状态已变更，无法接受出价' };
  }

  const list = storage.getList(STORAGE_KEYS.MARKET_OFFERS);
  const updatedList = list.map(o => {
    if (o.id === offerId) {
      return {
        ...o,
        status: 'accepted',
        updateTime: Date.now(),
        history: [
          ...o.history,
          {
            action: 'accept',
            price: o.price,
            message: '',
            operatorId: userInfo.id,
            operatorName: userInfo.nickName || '卖家',
            time: Date.now()
          }
        ]
      };
    }
    if (o.itemId === offer.itemId && o.id !== offerId && (o.status === 'pending' || o.status === 'countered')) {
      return {
        ...o,
        status: 'cancelled',
        updateTime: Date.now(),
        history: [
          ...o.history,
          {
            action: 'auto_cancel',
            price: o.price,
            message: '卖家已接受其他出价',
            operatorId: 'system',
            operatorName: '系统',
            time: Date.now()
          }
        ]
      };
    }
    return o;
  });

  storage.set(STORAGE_KEYS.MARKET_OFFERS, updatedList);

  updateMarketItem(offer.itemId, { status: 'reserved' });

  createNotification({
    userId: offer.userId,
    type: 'transaction',
    subType: 'offer_accepted',
    title: '出价已被接受',
    content: `卖家接受了您对商品「${item.title}」的出价 ¥${offer.price}`,
    data: {
      offerId,
      itemId: offer.itemId,
      price: offer.price
    }
  });

  const otherBuyers = updatedList
    .filter(o => o.itemId === offer.itemId && o.id !== offerId && o.status === 'cancelled')
    .map(o => o.userId);

  otherBuyers.forEach(buyerId => {
    if (buyerId !== offer.userId) {
      createNotification({
        userId: buyerId,
        type: 'transaction',
        subType: 'offer_cancelled',
        title: '出价已失效',
        content: `商品「${item.title}」已被其他买家预订`,
        data: {
          itemId: offer.itemId
        }
      });
    }
  });

  return { success: true };
}

function rejectMarketOffer(offerId, reason = '') {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const offer = getMarketOfferDetail(offerId);
  if (!offer) {
    return { success: false, message: '出价记录不存在' };
  }

  if (offer.sellerId !== userInfo.id) {
    return { success: false, message: '只有卖家才能拒绝出价' };
  }

  if (offer.status !== 'pending' && offer.status !== 'countered') {
    return { success: false, message: '该出价状态无法拒绝' };
  }

  const item = getMarketDetail(offer.itemId);

  const success = storage.updateInList(STORAGE_KEYS.MARKET_OFFERS, offerId, {
    status: 'rejected',
    rejectReason: reason,
    updateTime: Date.now(),
    history: [
      ...offer.history,
      {
        action: 'reject',
        price: offer.price,
        message: reason,
        operatorId: userInfo.id,
        operatorName: userInfo.nickName || '卖家',
        time: Date.now()
      }
    ]
  });

  if (success) {
    createNotification({
      userId: offer.userId,
      type: 'transaction',
      subType: 'offer_rejected',
      title: '出价被拒绝',
      content: `卖家拒绝了您对商品「${item ? item.title : ''}」的出价 ¥${offer.price}`,
      data: {
        offerId,
        itemId: offer.itemId,
        price: offer.price
      }
    });
  }

  return { success };
}

function counterMarketOffer(offerId, counterPrice, message = '') {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const offer = getMarketOfferDetail(offerId);
  if (!offer) {
    return { success: false, message: '出价记录不存在' };
  }

  if (offer.sellerId !== userInfo.id) {
    return { success: false, message: '只有卖家才能还价' };
  }

  if (offer.status !== 'pending' && offer.status !== 'countered') {
    return { success: false, message: '该出价状态无法还价' };
  }

  if (!counterPrice || counterPrice <= 0) {
    return { success: false, message: '请输入有效的还价金额' };
  }

  const item = getMarketDetail(offer.itemId);

  const success = storage.updateInList(STORAGE_KEYS.MARKET_OFFERS, offerId, {
    status: 'countered',
    price: Number(counterPrice),
    updateTime: Date.now(),
    history: [
      ...offer.history,
      {
        action: 'counter',
        price: Number(counterPrice),
        message,
        operatorId: userInfo.id,
        operatorName: userInfo.nickName || '卖家',
        time: Date.now()
      }
    ]
  });

  if (success) {
    createNotification({
      userId: offer.userId,
      type: 'transaction',
      subType: 'offer_countered',
      title: '卖家还价了',
      content: `卖家对商品「${item ? item.title : ''}」还价 ¥${counterPrice}`,
      data: {
        offerId,
        itemId: offer.itemId,
        price: counterPrice
      }
    });
  }

  return { success };
}

function cancelMarketOffer(offerId) {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const offer = getMarketOfferDetail(offerId);
  if (!offer) {
    return { success: false, message: '出价记录不存在' };
  }

  if (offer.userId !== userInfo.id) {
    return { success: false, message: '只有买家才能取消出价' };
  }

  if (offer.status !== 'pending' && offer.status !== 'countered') {
    return { success: false, message: '该出价状态无法取消' };
  }

  const item = getMarketDetail(offer.itemId);

  const success = storage.updateInList(STORAGE_KEYS.MARKET_OFFERS, offerId, {
    status: 'cancelled',
    updateTime: Date.now(),
    history: [
      ...offer.history,
      {
        action: 'cancel',
        price: offer.price,
        message: '',
        operatorId: userInfo.id,
        operatorName: userInfo.nickName || '买家',
        time: Date.now()
      }
    ]
  });

  if (success) {
    createNotification({
      userId: offer.sellerId,
      type: 'transaction',
      subType: 'offer_cancelled',
      title: '买家取消了出价',
      content: `${userInfo.nickName || '买家'}取消了对商品「${item ? item.title : ''}」的出价`,
      data: {
        offerId,
        itemId: offer.itemId
      }
    });
  }

  return { success };
}

function hasActiveOffer(itemId, userId) {
  checkAndUpdateExpiredOffers(itemId);

  const offers = getMarketOffersByItem(itemId, { userId });
  return offers.some(o => o.status === 'pending' || o.status === 'countered');
}

function getItemActiveOfferCount(itemId) {
  checkAndUpdateExpiredOffers(itemId);

  const offers = getMarketOffersByItem(itemId);
  return offers.filter(o => o.status === 'pending' || o.status === 'countered').length;
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
      stat.wordFrequency = computeWordFrequency(fillAnswers);
    } else if (q.type === 'nps') {
      const scoreCounts = {};
      for (let i = 0; i <= 10; i++) scoreCounts[i] = 0;
      let totalScore = 0;
      let scoreCount = 0;
      let promoters = 0, passives = 0, detractors = 0;

      responses.forEach(r => {
        const answer = r.answers.find(a => a.questionId === q.id);
        if (answer && answer.value !== '' && answer.value !== undefined) {
          const score = Number(answer.value);
          if (!isNaN(score) && score >= 0 && score <= 10) {
            scoreCounts[score]++;
            totalScore += score;
            scoreCount++;
            if (score >= 9) promoters++;
            else if (score >= 7) passives++;
            else detractors++;
          }
        }
      });

      const npsOptions = Object.keys(scoreCounts).map(k => ({
        label: k,
        count: scoreCounts[k],
        percentage: scoreCount > 0 ? Math.round(scoreCounts[k] / scoreCount * 100) : 0
      }));

      stat.options = npsOptions;
      stat.npsScore = scoreCount > 0 ? Math.round(((promoters - detractors) / scoreCount) * 100) : 0;
      stat.avgScore = scoreCount > 0 ? Math.round((totalScore / scoreCount) * 10) / 10 : 0;
      stat.promoters = promoters;
      stat.passives = passives;
      stat.detractors = detractors;
    } else if (q.type === 'likert') {
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let totalScore = 0;
      let scoreCount = 0;

      responses.forEach(r => {
        const answer = r.answers.find(a => a.questionId === q.id);
        if (answer && answer.value !== '' && answer.value !== undefined) {
          const score = Number(answer.value);
          if (score >= 1 && score <= 5) {
            distribution[score]++;
            totalScore += score;
            scoreCount++;
          }
        }
      });

      const likertOptions = Object.keys(distribution).map(k => ({
        label: constants.LIKERT_OPTIONS.find(o => o.value === Number(k)) ? constants.LIKERT_OPTIONS.find(o => o.value === Number(k)).label : k,
        count: distribution[k],
        percentage: scoreCount > 0 ? Math.round(distribution[k] / scoreCount * 100) : 0
      }));

      stat.options = likertOptions;
      stat.avgScore = scoreCount > 0 ? Math.round((totalScore / scoreCount) * 100) / 100 : 0;
    } else if (q.type === 'date') {
      const dateAnswers = [];
      responses.forEach(r => {
        const answer = r.answers.find(a => a.questionId === q.id);
        if (answer && answer.value) {
          dateAnswers.push(answer.value);
        }
      });
      stat.dateAnswers = dateAnswers;
    }

    return stat;
  });

  return {
    survey,
    totalResponses: responses.length,
    questionStats: stats
  };
}

function evaluateLogicRule(rule, answers, questions) {
  const sourceAnswer = answers[rule.sourceQuestionId];
  if (sourceAnswer === undefined || sourceAnswer === null || sourceAnswer === '') return false;

  const targetValue = rule.value;

  switch (rule.operator) {
    case 'eq':
      return String(sourceAnswer) === String(targetValue);
    case 'neq':
      return String(sourceAnswer) !== String(targetValue);
    case 'contains':
      if (Array.isArray(sourceAnswer)) return sourceAnswer.includes(targetValue);
      return String(sourceAnswer).includes(String(targetValue));
    case 'gt':
      return Number(sourceAnswer) > Number(targetValue);
    case 'lt':
      return Number(sourceAnswer) < Number(targetValue);
    case 'gte':
      return Number(sourceAnswer) >= Number(targetValue);
    case 'lte':
      return Number(sourceAnswer) <= Number(targetValue);
    default:
      return false;
  }
}

function getVisibleQuestions(survey, answers) {
  const questions = survey.questions || [];
  const logicRules = survey.logicRules || [];
  const hiddenIds = new Set();

  logicRules.forEach(rule => {
    const matched = evaluateLogicRule(rule, answers, questions);
    if (rule.action === 'show') {
      if (!matched) hiddenIds.add(rule.targetQuestionId);
    } else if (rule.action === 'skip') {
      if (matched) hiddenIds.add(rule.targetQuestionId);
    }
  });

  return questions.filter(q => !hiddenIds.has(q.id));
}

function isSurveyExpired(survey) {
  if (!survey.settings || !survey.settings.deadline) return false;
  return Date.now() > survey.settings.deadline;
}

function isSurveyResponseLimitReached(survey) {
  if (!survey.settings || !survey.settings.maxResponses) return false;
  return (survey.responseCount || 0) >= survey.settings.maxResponses;
}

function canFillSurvey(survey) {
  if (survey.status === 'closed') return { canFill: false, reason: '该问卷已结束' };
  if (isSurveyExpired(survey)) return { canFill: false, reason: '该问卷已过截止时间' };
  if (isSurveyResponseLimitReached(survey)) return { canFill: false, reason: '该问卷已达到答题人数上限' };
  return { canFill: true };
}

function canViewResult(survey, userId) {
  if (survey.creator === userId) return true;
  if (survey.settings && survey.settings.publicResults) return true;
  return false;
}

function getMyParticipatedSurveys(userId) {
  const responses = storage.getList(STORAGE_KEYS.SURVEY_RESPONSES);
  const userResponses = responses.filter(r => r.userId === userId);
  const surveyIds = [...new Set(userResponses.map(r => r.surveyId))];
  const allSurveys = storage.getList(STORAGE_KEYS.SURVEY_LIST);
  return allSurveys.filter(s => surveyIds.includes(s.id)).map(s => {
    const myResponse = userResponses.find(r => r.surveyId === s.id);
    return {
      ...s,
      myResponseTime: myResponse ? myResponse.createTime : null,
      isOwner: s.creator === userId
    };
  }).sort((a, b) => (b.myResponseTime || 0) - (a.myResponseTime || 0));
}

function computeWordFrequency(texts) {
  const stopWords = new Set(['的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这']);
  const wordCount = {};
  texts.forEach(text => {
    if (!text) return;
    const words = text.split(/[\s,，。！？!?；;：:、\n\r]+/).filter(w => w.length > 1 && !stopWords.has(w));
    words.forEach(w => {
      wordCount[w] = (wordCount[w] || 0) + 1;
    });
  });
  return Object.entries(wordCount)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 30);
}

function generateSurveyCSV(surveyId) {
  const survey = getSurveyDetail(surveyId);
  if (!survey) return '';

  const responses = getSurveyResponses(surveyId);
  const questions = survey.questions || [];

  const headers = ['序号', ...questions.map((q, i) => `第${i + 1}题: ${q.title}`)];
  const rows = responses.map((r, idx) => {
    const row = [idx + 1];
    questions.forEach(q => {
      const answer = r.answers.find(a => a.questionId === q.id);
      if (!answer || !answer.value) {
        row.push('');
      } else if (Array.isArray(answer.value)) {
        row.push(answer.value.join('|'));
      } else {
        row.push(String(answer.value));
      }
    });
    return row;
  });

  const csvLines = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))];
  return csvLines.join('\n');
}

function getSurveyDashboardData(surveyId) {
  const survey = getSurveyDetail(surveyId);
  if (!survey) return null;

  const responses = getSurveyResponses(surveyId);
  const dayMap = {};
  responses.forEach(r => {
    const d = new Date(r.createTime);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    dayMap[key] = (dayMap[key] || 0) + 1;
  });

  const now = new Date();
  const dailyData = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    dailyData.push({ date: key, count: dayMap[key] || 0 });
  }

  const npsStats = {};
  (survey.questions || []).filter(q => q.type === 'nps').forEach(q => {
    const promoterCount = { count: 0 };
    const passiveCount = { count: 0 };
    const detractorCount = { count: 0 };
    let totalScore = 0;
    let scoreCount = 0;

    responses.forEach(r => {
      const answer = r.answers.find(a => a.questionId === q.id);
      if (answer && answer.value !== '' && answer.value !== undefined) {
        const score = Number(answer.value);
        if (!isNaN(score)) {
          totalScore += score;
          scoreCount++;
          if (score >= 9) promoterCount.count++;
          else if (score >= 7) passiveCount.count++;
          else detractorCount.count++;
        }
      }
    });

    npsStats[q.id] = {
      promoters: promoterCount.count,
      passives: passiveCount.count,
      detractors: detractorCount.count,
      npsScore: scoreCount > 0 ? Math.round(((promoterCount.count - detractorCount.count) / scoreCount) * 100) : 0,
      avgScore: scoreCount > 0 ? Math.round((totalScore / scoreCount) * 10) / 10 : 0,
      totalResponses: scoreCount
    };
  });

  const likertStats = {};
  (survey.questions || []).filter(q => q.type === 'likert').forEach(q => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalScore = 0;
    let scoreCount = 0;

    responses.forEach(r => {
      const answer = r.answers.find(a => a.questionId === q.id);
      if (answer && answer.value !== '' && answer.value !== undefined) {
        const score = Number(answer.value);
        if (score >= 1 && score <= 5) {
          distribution[score]++;
          totalScore += score;
          scoreCount++;
        }
      }
    });

    likertStats[q.id] = {
      distribution,
      avgScore: scoreCount > 0 ? Math.round((totalScore / scoreCount) * 100) / 100 : 0,
      totalResponses: scoreCount
    };
  });

  return {
    survey,
    totalResponses: responses.length,
    dailyData,
    npsStats,
    likertStats
  };
}

// ==================== 校园投票 ====================

let votingInitialized = false;

function initVotingData() {
  if (votingInitialized) return;
  const existing = storage.get(STORAGE_KEYS.VOTING_LIST);
  if (!existing || existing.length === 0) {
    const now = Date.now();
    const mockVotings = mockData.MOCK_VOTINGS || [];
    const votings = mockVotings.map((item, index) => ({
      id: 'mock_vote_' + index + '_' + now,
      ...item,
      candidates: (item.candidates || []).map((c, cIdx) => ({
        id: 'cand_' + index + '_' + cIdx + '_' + now,
        voteCount: 0,
        ...c
      })),
      voteCount: 0,
      createTime: now - (index + 2) * 86400000,
      updateTime: now - (index + 2) * 86400000
    }));
    storage.set(STORAGE_KEYS.VOTING_LIST, votings);

    const mockRecords = mockData.MOCK_VOTING_RECORDS || [];
    const records = mockRecords.map((item, index) => ({
      id: 'mock_vr_' + index + '_' + now,
      ...item,
      createTime: now - Math.floor(Math.random() * 86400000)
    }));
    storage.set(STORAGE_KEYS.VOTING_RECORDS, records);
  }
  votingInitialized = true;
}

function updateVotingStatus(voting) {
  const now = Date.now();
  let status = voting.status;
  if (voting.startTime && now < voting.startTime) {
    status = 'pending';
  } else if (voting.endTime && now > voting.endTime) {
    if (voting.status !== 'published') {
      status = 'ended';
    }
  } else {
    if (voting.status !== 'published') {
      status = 'active';
    }
  }
  return status;
}

function getVotingList(filters = {}) {
  initVotingData();
  let list = storage.getList(STORAGE_KEYS.VOTING_LIST);

  list = list.map(item => {
    const newStatus = updateVotingStatus(item);
    if (newStatus !== item.status) {
      storage.updateInList(STORAGE_KEYS.VOTING_LIST, item.id, { status: newStatus, updateTime: Date.now() });
      return { ...item, status: newStatus };
    }
    return item;
  });

  if (filters.status) {
    list = list.filter(item => item.status === filters.status);
  }

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['title', 'description']);
  }

  if (filters.creator) {
    list = list.filter(item => item.creator === filters.creator);
  }

  list.sort((a, b) => b.createTime - a.createTime);
  return list;
}

function getVotingDetail(id) {
  initVotingData();
  const list = storage.getList(STORAGE_KEYS.VOTING_LIST);
  let voting = list.find(item => item.id === id) || null;
  if (voting) {
    const newStatus = updateVotingStatus(voting);
    if (newStatus !== voting.status) {
      storage.updateInList(STORAGE_KEYS.VOTING_LIST, id, { status: newStatus, updateTime: Date.now() });
      voting = { ...voting, status: newStatus };
    }
  }
  return voting;
}

function createVoting(data) {
  const now = Date.now();
  let initialStatus = 'pending';
  if (data.startTime && now >= data.startTime) {
    if (data.endTime && now > data.endTime) {
      initialStatus = 'ended';
    } else {
      initialStatus = 'active';
    }
  }

  const item = {
    id: util.generateId(),
    ...data,
    candidates: (data.candidates || []).map((c, idx) => ({
      id: 'cand_' + now + '_' + idx,
      voteCount: 0,
      ...c
    })),
    voteCount: 0,
    createTime: now,
    updateTime: now,
    status: initialStatus
  };

  const success = storage.addToList(STORAGE_KEYS.VOTING_LIST, item);
  return success ? item : null;
}

function updateVoting(id, updates) {
  return storage.updateInList(STORAGE_KEYS.VOTING_LIST, id, {
    ...updates,
    updateTime: Date.now()
  });
}

function deleteVoting(id) {
  storage.removeFromList(STORAGE_KEYS.VOTING_LIST, id);
  const records = storage.getList(STORAGE_KEYS.VOTING_RECORDS);
  const remaining = records.filter(r => r.votingId !== id);
  storage.set(STORAGE_KEYS.VOTING_RECORDS, remaining);
  return true;
}

function publishVotingResult(id) {
  return storage.updateInList(STORAGE_KEYS.VOTING_LIST, id, {
    status: 'published',
    publishTime: Date.now(),
    updateTime: Date.now()
  });
}

function hasUserVoted(votingId, userId) {
  const records = storage.getList(STORAGE_KEYS.VOTING_RECORDS);
  return records.some(r => r.votingId === votingId && r.userId === userId);
}

function checkVotingEligibility(voting, userInfo) {
  if (!voting || !userInfo) return { eligible: false, reason: '请先登录' };

  const eligibility = voting.eligibility || { type: 'all' };

  switch (eligibility.type) {
    case 'all':
      return { eligible: true };
    case 'college':
      if (!eligibility.colleges || eligibility.colleges.length === 0) {
        return { eligible: true };
      }
      if (eligibility.colleges.includes(userInfo.college)) {
        return { eligible: true };
      }
      return { eligible: false, reason: '仅指定学院学生可投票' };
    case 'grade':
      if (!eligibility.grades || eligibility.grades.length === 0) {
        return { eligible: true };
      }
      if (eligibility.grades.includes(userInfo.grade)) {
        return { eligible: true };
      }
      return { eligible: false, reason: '仅指定年级学生可投票' };
    case 'major':
      if (!eligibility.majors || eligibility.majors.length === 0) {
        return { eligible: true };
      }
      if (eligibility.majors.includes(userInfo.major)) {
        return { eligible: true };
      }
      return { eligible: false, reason: '仅指定专业学生可投票' };
    case 'custom':
      if (!eligibility.userIds || eligibility.userIds.length === 0) {
        return { eligible: true };
      }
      if (eligibility.userIds.includes(userInfo.account)) {
        return { eligible: true };
      }
      return { eligible: false, reason: '您不在投票名单内' };
    default:
      return { eligible: true };
  }
}

function submitVote(votingId, userId, userName, candidateIds) {
  if (hasUserVoted(votingId, userId)) {
    return { success: false, message: '您已经投过票了' };
  }

  const voting = getVotingDetail(votingId);
  if (!voting) {
    return { success: false, message: '投票不存在' };
  }

  if (voting.status !== 'active') {
    const statusText = constants.VOTING_STATUS_MAP[voting.status] ? constants.VOTING_STATUS_MAP[voting.status].label : voting.status;
    return { success: false, message: `当前投票状态：${statusText}，无法投票` };
  }

  if (!candidateIds || candidateIds.length === 0) {
    return { success: false, message: '请选择候选人' };
  }

  if (voting.type === 'single' && candidateIds.length > 1) {
    return { success: false, message: '单选投票只能选择一位候选人' };
  }

  if (voting.maxChoices && candidateIds.length > voting.maxChoices) {
    return { success: false, message: `最多只能选择 ${voting.maxChoices} 位候选人` };
  }

  const validCandidateIds = (voting.candidates || []).map(c => c.id);
  for (const cid of candidateIds) {
    if (!validCandidateIds.includes(cid)) {
      return { success: false, message: '候选人无效' };
    }
  }

  const record = {
    id: util.generateId(),
    votingId,
    userId,
    userName: voting.visibility === 'anonymous' ? '匿名用户' : (userName || userId),
    candidateIds,
    visibility: voting.visibility,
    createTime: Date.now()
  };

  storage.addToList(STORAGE_KEYS.VOTING_RECORDS, record);

  const candidates = voting.candidates || [];
  const updatedCandidates = candidates.map(c => {
    if (candidateIds.includes(c.id)) {
      return { ...c, voteCount: (c.voteCount || 0) + 1 };
    }
    return c;
  });

  storage.updateInList(STORAGE_KEYS.VOTING_LIST, votingId, {
    candidates: updatedCandidates,
    voteCount: (voting.voteCount || 0) + 1,
    updateTime: Date.now()
  });

  return { success: true, record };
}

function getVotingRecords(votingId) {
  const records = storage.getList(STORAGE_KEYS.VOTING_RECORDS);
  return records.filter(r => r.votingId === votingId);
}

function getUserVotingRecord(votingId, userId) {
  const records = storage.getList(STORAGE_KEYS.VOTING_RECORDS);
  return records.find(r => r.votingId === votingId && r.userId === userId) || null;
}

function getVotingStatistics(votingId) {
  const voting = getVotingDetail(votingId);
  if (!voting) return null;

  const records = getVotingRecords(votingId);
  const candidates = voting.candidates || [];
  const totalVotes = voting.voteCount || 0;

  const sortedCandidates = [...candidates].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
  const maxVotes = sortedCandidates.length > 0 ? (sortedCandidates[0].voteCount || 0) : 0;
  const winners = sortedCandidates.filter(c => (c.voteCount || 0) === maxVotes && maxVotes > 0);

  const candidateStats = candidates.map(c => {
    const count = c.voteCount || 0;
    const percentage = totalVotes > 0 ? Math.round(count / totalVotes * 100) : 0;
    const barWidth = maxVotes > 0 ? Math.round(count / maxVotes * 100) : 0;
    return {
      ...c,
      count,
      percentage,
      barWidth,
      rank: sortedCandidates.findIndex(s => s.id === c.id) + 1,
      isWinner: winners.some(w => w.id === c.id)
    };
  }).sort((a, b) => b.count - a.count);

  const visibilityIsRealname = voting.visibility === 'realname';
  const voterList = visibilityIsRealname
    ? records.map(r => ({ userId: r.userId, userName: r.userName, createTime: r.createTime }))
    : [];

  return {
    voting,
    totalVotes,
    candidateStats,
    winners: winners.map(w => w.name || w.title),
    voterList,
    canViewResult: voting.status === 'ended' || voting.status === 'published' || (voting.showRealTimeResult && voting.status === 'active')
  };
}

// ==================== 消息通知 ====================

const DEFAULT_NOTIFICATION_SETTINGS = {
  system: true,
  interaction: true,
  transaction: true,
  activity: true,
  survey: true,
  keyword: true
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

  if (filters.minReward !== undefined) {
    list = list.filter(item => item.rewardPoints >= filters.minReward);
  }

  if (filters.maxReward !== undefined && filters.maxReward !== Infinity) {
    list = list.filter(item => item.rewardPoints <= filters.maxReward);
  }

  if (filters.subject) {
    list = list.filter(item => item.subject === filters.subject);
  }

  list = list.map(item => ({
    ...item,
    responseCount: (item.responses || []).length
  }));

  return sortByField(list, filters.sort || 'latest', constants.STUDY_REWARD_SORT_OPTIONS);
}

function getStudyRewardsListPaged(pagination = {}) {
  const { page = 1, pageSize = 15, filters = {} } = pagination;
  let list = getStudyRewardsList(filters);
  return paginateList(list, page, pageSize);
}

function getMyStudyRewards(type = 'published', filters = {}) {
  initStudyRewards();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'anonymous';

  let list = storage.getList(STORAGE_KEYS.STUDY_REWARDS_LIST);

  if (type === 'published') {
    list = list.filter(item => item.publisherId === userId);
  } else if (type === 'answered') {
    list = list.filter(item => {
      const responses = item.responses || [];
      return responses.some(r => r.responderId === userId);
    });
  }

  if (filters.status) {
    list = list.filter(item => item.status === filters.status);
  }

  list = list.map(item => ({
    ...item,
    responseCount: (item.responses || []).length
  }));

  return list.sort((a, b) => b.createTime - a.createTime);
}

function getMyStudyRewardsPaged(type = 'published', pagination = {}) {
  const { page = 1, pageSize = 15, filters = {} } = pagination;
  let list = getMyStudyRewards(type, filters);
  return paginateList(list, page, pageSize);
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

function addPoints(amount, reason = '') {
  const newPoints = updateUserPoints(amount);
  const transactions = storage.get(STORAGE_KEYS.POINT_TRANSACTIONS) || [];
  transactions.unshift({
    id: 'txn_' + Date.now() + Math.random().toString(36).substr(2, 5),
    type: 'earn',
    amount,
    reason,
    balance: newPoints,
    createTime: Date.now()
  });
  storage.set(STORAGE_KEYS.POINT_TRANSACTIONS, transactions.slice(0, 100));
  return newPoints;
}

function deductPoints(amount, reason = '') {
  const current = getUserPoints();
  if (current < amount) return false;
  const newPoints = updateUserPoints(-amount);
  const transactions = storage.get(STORAGE_KEYS.POINT_TRANSACTIONS) || [];
  transactions.unshift({
    id: 'txn_' + Date.now() + Math.random().toString(36).substr(2, 5),
    type: 'spend',
    amount,
    reason,
    balance: newPoints,
    createTime: Date.now()
  });
  storage.set(STORAGE_KEYS.POINT_TRANSACTIONS, transactions.slice(0, 100));
  return true;
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

function getGuideCategories() {
  return mockData.GUIDE_CATEGORIES || [];
}

function getGuideList(category) {
  var allGuides = mockData.GUIDE_LIST_DATA || [];
  if (category && category !== 'all') {
    allGuides = allGuides.filter(function(g) { return g.category === category; });
  }
  return allGuides;
}

function searchGuides(keyword) {
  if (!keyword || !keyword.trim()) return [];
  var kw = keyword.trim().toLowerCase();
  var allGuides = mockData.GUIDE_LIST_DATA || [];
  return allGuides.filter(function(g) {
    return g.title.toLowerCase().indexOf(kw) > -1 ||
           g.summary.toLowerCase().indexOf(kw) > -1;
  });
}

function getGuideDetail(guideId) {
  var allGuides = mockData.GUIDE_LIST_DATA || [];
  return allGuides.find(function(g) { return g.id === guideId; }) || null;
}

function getGuideFavorites() {
  return storage.getList(STORAGE_KEYS.GUIDE_FAVORITES);
}

function addGuideFavorite(guideId) {
  var favs = getGuideFavorites();
  if (favs.indexOf(guideId) === -1) {
    favs.push(guideId);
    storage.set(STORAGE_KEYS.GUIDE_FAVORITES, favs);
  }
  return true;
}

function removeGuideFavorite(guideId) {
  var favs = getGuideFavorites();
  var newFavs = favs.filter(function(id) { return id !== guideId; });
  storage.set(STORAGE_KEYS.GUIDE_FAVORITES, newFavs);
  return true;
}

function isGuideFavorited(guideId) {
  var favs = getGuideFavorites();
  return favs.indexOf(guideId) > -1;
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

  if (campusService.isCampusDataScoped('campusShop')) {
    list = campusService.filterListByCampus(list, filters.campusId);
  }

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
      const wasFrozen = item.escrowStatus === 'frozen';
      item.status = 'timeout';
      item.escrowStatus = item.bounty > 0 ? 'refunded' : '';
      item.timeoutTime = now;
      item.updateTime = now;
      changed = true;

      if (item.bounty > 0 && wasFrozen) {
        addPoints(item.bounty, '跑腿订单超时退款');
        addEscrowLog(item.id, 'refund', item.bounty, {
          userId: item.userId,
          action: 'refund',
          remark: '订单超时，退还赏金'
        });
      }
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

  const bounty = Number(data.bounty) || 0;
  if (bounty > 0) {
    const currentPoints = getUserPoints();
    if (currentPoints < bounty) {
      return { error: '积分不足，请先获取积分' };
    }
    const deductResult = deductPoints(bounty, '发布跑腿订单托管');
    if (!deductResult) {
      return { error: '积分扣除失败，请重试' };
    }
  }

  const taskType = constants.ERRAND_TASK_TYPES.find(t => t.value === data.type);
  const item = {
    id: util.generateId(),
    ...data,
    bounty,
    typeText: taskType ? taskType.label : data.type,
    userId: userInfo.id || 'test_user',
    userName: userInfo.nickName || '张同学',
    userAvatar: userInfo.avatarUrl || '',
    status: 'pending',
    escrowStatus: bounty > 0 ? 'frozen' : '',
    escrowAmount: bounty,
    createTime: Date.now(),
    updateTime: Date.now()
  };
  storage.addToList(STORAGE_KEYS.ERRAND_ORDER_LIST, item);

  if (bounty > 0) {
    addEscrowLog(item.id, 'freeze', bounty, {
      userId: item.userId,
      userName: item.userName,
      action: 'freeze',
      remark: '发布订单，冻结赏金'
    });
  }

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

  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const currentUserId = userInfo.id || 'test_user';
  const isPublisher = order.userId === currentUserId;
  const isRunner = order.runnerId === currentUserId;

  if (!isPublisher && !isRunner) {
    return { error: '无权操作此订单' };
  }

  const result = storage.updateInList(STORAGE_KEYS.ERRAND_ORDER_LIST, orderId, {
    status: 'completed',
    completedTime: Date.now(),
    completedBy: currentUserId,
    escrowStatus: order.escrowStatus === 'disputed' ? 'disputed' : 'released',
    updateTime: Date.now()
  });

  if (result) {
    updateRunnerStats(order.runnerId, 'complete');

    if (order.bounty > 0 && order.escrowStatus !== 'disputed') {
      grantRewardPoints(order.runnerId, order.bounty);
      addPoints(order.bounty, '跑腿订单完成赏金');

      addEscrowLog(orderId, 'release', order.bounty, {
        fromUserId: order.userId,
        toUserId: order.runnerId,
        action: 'release',
        remark: '订单完成，结算给跑手'
      });
    }
  }

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

  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const currentUserId = userInfo.id || 'test_user';
  if (order.userId !== currentUserId) {
    return { error: '只有发布者可以取消订单' };
  }

  const result = storage.updateInList(STORAGE_KEYS.ERRAND_ORDER_LIST, id, {
    status: 'cancelled',
    escrowStatus: order.bounty > 0 ? 'refunded' : '',
    cancelReason: reason || '',
    cancelTime: Date.now(),
    updateTime: Date.now()
  });

  if (result) {
    if (order.status === 'accepted' && order.runnerId) {
      updateRunnerStats(order.runnerId, 'cancel');
    }

    if (order.bounty > 0 && order.escrowStatus === 'frozen') {
      addPoints(order.bounty, '取消跑腿订单退款');

      addEscrowLog(id, 'refund', order.bounty, {
        userId: order.userId,
        action: 'refund',
        remark: '订单取消，退还赏金'
      });
    }
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

function addEscrowLog(orderId, action, amount, extra = {}) {
  initErrandData();
  const log = {
    id: util.generateId(),
    orderId,
    action,
    amount,
    time: Date.now(),
    ...extra
  };
  const logs = storage.getList(STORAGE_KEYS.ERRAND_ESCROW_LOG);
  logs.unshift(log);
  storage.set(STORAGE_KEYS.ERRAND_ESCROW_LOG, logs.slice(0, 200));
  return log;
}

function getEscrowLogByOrder(orderId) {
  initErrandData();
  return storage.getList(STORAGE_KEYS.ERRAND_ESCROW_LOG).filter(log => log.orderId === orderId);
}

function canDispute(orderOrId) {
  let order = null;
  if (typeof orderOrId === 'string') {
    order = getErrandOrderDetail(orderOrId);
  } else {
    order = orderOrId;
  }

  const result = {
    can: false,
    remainingMs: 0,
    reason: ''
  };

  if (!order) {
    result.reason = '订单不存在';
    return result;
  }
  if (order.status !== 'completed') {
    result.reason = '只有已完成的订单可以申诉';
    return result;
  }
  if (!order.completedTime) {
    result.reason = '订单完成时间异常';
    return result;
  }

  const disputeWindow = constants.ERRAND_DISPUTE_WINDOW_HOURS * 3600 * 1000;
  const now = Date.now();
  const elapsed = now - order.completedTime;
  result.remainingMs = Math.max(0, disputeWindow - elapsed);

  if (elapsed < disputeWindow) {
    result.can = true;
  } else {
    result.reason = '已超过申诉时限';
  }

  return result;
}

function getDisputeList(filters = {}) {
  initErrandData();
  let list = storage.getList(STORAGE_KEYS.ERRAND_DISPUTE_LIST);

  if (filters.status && filters.status !== 'all') {
    list = list.filter(item => item.status === filters.status);
  }
  if (filters.userId) {
    list = list.filter(item => item.initiatorId === filters.userId || item.respondentId === filters.userId);
  }
  if (filters.orderId) {
    list = list.filter(item => item.orderId === filters.orderId);
  }
  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    list = list.filter(item =>
      (item.reasonText && item.reasonText.toLowerCase().includes(kw)) ||
      (item.description && item.description.toLowerCase().includes(kw))
    );
  }

  return list.sort((a, b) => b.createTime - a.createTime);
}

function getDisputeDetail(id) {
  initErrandData();
  return storage.getList(STORAGE_KEYS.ERRAND_DISPUTE_LIST).find(item => item.id === id) || null;
}

function createDispute(orderId, disputeData) {
  initErrandData();
  const order = getErrandOrderDetail(orderId);
  if (!order) return { error: '订单不存在' };
  if (order.status !== 'completed') return { error: '只有已完成的订单可以申诉' };

  const disputeCheck = canDispute(order);
  if (!disputeCheck.can) {
    return { error: disputeCheck.reason || '无法发起申诉' };
  }

  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const currentUserId = userInfo.id || 'test_user';

  const isPublisher = order.userId === currentUserId;
  const isRunner = order.runnerId === currentUserId;

  if (!isPublisher && !isRunner) {
    return { error: '只有订单相关方可以发起申诉' };
  }

  const existingDispute = getDisputeList({ orderId }).find(d => d.status === 'pending' || d.status === 'reviewing');
  if (existingDispute) {
    return { error: '该订单已有申诉正在处理中' };
  }

  const reasonInfo = constants.ERRAND_DISPUTE_REASONS.find(r => r.value === disputeData.reason);

  const dispute = {
    id: util.generateId(),
    orderId,
    orderType: order.type,
    orderBounty: order.bounty,
    initiatorId: currentUserId,
    initiatorName: userInfo.nickName || '张同学',
    initiatorAvatar: userInfo.avatarUrl || '',
    initiatorRole: isPublisher ? 'publisher' : 'runner',
    respondentId: isPublisher ? order.runnerId : order.userId,
    respondentName: isPublisher ? (order.runnerName || '跑手') : (order.userName || '发布者'),
    respondentAvatar: isPublisher ? (order.runnerAvatar || '') : (order.userAvatar || ''),
    reason: disputeData.reason,
    reasonText: reasonInfo ? reasonInfo.label : disputeData.reason,
    description: disputeData.description || '',
    evidence: disputeData.evidence || [],
    status: 'pending',
    createTime: Date.now(),
    updateTime: Date.now()
  };

  storage.addToList(STORAGE_KEYS.ERRAND_DISPUTE_LIST, dispute);

  storage.updateInList(STORAGE_KEYS.ERRAND_ORDER_LIST, orderId, {
    escrowStatus: 'disputed',
    hasDispute: true,
    updateTime: Date.now()
  });

  return dispute;
}

function getArbitrationList(filters = {}) {
  return getDisputeList(filters);
}

function arbitrateDispute(disputeId, arbitrationData) {
  initErrandData();
  const dispute = getDisputeDetail(disputeId);
  if (!dispute) return { error: '申诉记录不存在' };
  if (dispute.status === 'resolved_publisher' || dispute.status === 'resolved_runner' ||
      dispute.status === 'resolved_split' || dispute.status === 'malicious') {
    return { error: '该申诉已裁决' };
  }

  const app = getApp();
  const adminInfo = app.globalData.userInfo || {};

  const result = storage.updateInList(STORAGE_KEYS.ERRAND_DISPUTE_LIST, disputeId, {
    status: arbitrationData.result,
    arbitratorId: adminInfo.id || 'admin',
    arbitratorName: adminInfo.nickName || '管理员',
    arbitrationRemark: arbitrationData.remark || '',
    publisherAmount: arbitrationData.publisherAmount || 0,
    runnerAmount: arbitrationData.runnerAmount || 0,
    arbitrationTime: Date.now(),
    updateTime: Date.now()
  });

  if (result) {
    const order = getErrandOrderDetail(dispute.orderId);
    if (order) {
      let escrowStatus = '';
      const bounty = order.bounty || 0;

      if (arbitrationData.result === 'resolved_publisher') {
        escrowStatus = 'refunded';
        addPoints(bounty, '仲裁胜诉，退还赏金');
        addEscrowLog(dispute.orderId, 'refund', bounty, {
          arbitratorId: adminInfo.id || 'admin',
          remark: '仲裁：发布者胜诉，全额退还'
        });
      } else if (arbitrationData.result === 'resolved_runner') {
        escrowStatus = 'released';
        grantRewardPoints(order.runnerId, bounty);
        addEscrowLog(dispute.orderId, 'release', bounty, {
          arbitratorId: adminInfo.id || 'admin',
          remark: '仲裁：跑手胜诉，全额结算'
        });
      } else if (arbitrationData.result === 'resolved_split') {
        const pubAmount = arbitrationData.publisherAmount || 0;
        const runAmount = arbitrationData.runnerAmount || 0;
        if (pubAmount > 0) {
          addPoints(pubAmount, '仲裁部分退还赏金');
        }
        if (runAmount > 0) {
          grantRewardPoints(order.runnerId, runAmount);
        }
        addEscrowLog(dispute.orderId, 'split', bounty, {
          arbitratorId: adminInfo.id || 'admin',
          publisherAmount: pubAmount,
          runnerAmount: runAmount,
          remark: '仲裁：部分分配'
        });
        escrowStatus = 'released';
      } else if (arbitrationData.result === 'malicious') {
        escrowStatus = 'released';
        addViolation(dispute.initiatorId, 'malicious_dispute', '恶意申诉', dispute.orderId, '恶意申诉，扣除信用分');
        grantRewardPoints(order.runnerId, bounty);
        addEscrowLog(dispute.orderId, 'release', bounty, {
          arbitratorId: adminInfo.id || 'admin',
          remark: '恶意申诉，结算给跑手'
        });
      }

      storage.updateInList(STORAGE_KEYS.ERRAND_ORDER_LIST, dispute.orderId, {
        escrowStatus,
        disputeResult: arbitrationData.result,
        updateTime: Date.now()
      });

      storage.addToList(STORAGE_KEYS.ERRAND_ARBITRATION_LOG, {
        id: util.generateId(),
        disputeId,
        orderId: dispute.orderId,
        arbitratorId: adminInfo.id || 'admin',
        arbitratorName: adminInfo.nickName || '管理员',
        result: arbitrationData.result,
        remark: arbitrationData.remark || '',
        createTime: Date.now()
      });
    }
  }

  return result || { error: '仲裁失败' };
}

function getOrderDispute(orderId) {
  initErrandData();
  const list = storage.getList(STORAGE_KEYS.ERRAND_DISPUTE_LIST).filter(d => d.orderId === orderId);
  return list.length > 0 ? list[0] : null;
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

// ==================== 快递柜取件码模块 ====================

function getExpressLockerList(status = 'all') {
  let list = storage.getList(STORAGE_KEYS.EXPRESS_LOCKER_LIST);
  const now = Date.now();
  list = list.map(item => {
    let currentStatus = item.status;
    if (currentStatus === 'pending' && item.deadline && item.deadline < now) {
      currentStatus = 'expired';
    }
    const statusInfo = constants.EXPRESS_LOCKER_STATUS_MAP[currentStatus] || {};
    const expressInfo = constants.EXPRESS_PICKUP_POINTS.find(e => e.value === item.expressCompany) || {};
    return {
      ...item,
      currentStatus,
      statusText: statusInfo.label || currentStatus,
      statusColor: statusInfo.color || '#666',
      statusIcon: statusInfo.icon || '📦',
      expressName: expressInfo.label || item.expressCompany,
      expressIcon: expressInfo.icon || '📦',
      deadlineText: item.deadline ? util.formatTime(item.deadline, 'MM-dd HH:mm') : '-',
      remainingText: _getRemainingTime(item.deadline, currentStatus),
      isExpiringSoon: _isExpiringSoon(item.deadline, currentStatus)
    };
  });
  if (status !== 'all') {
    list = list.filter(item => item.currentStatus === status);
  }
  return list.sort((a, b) => {
    if (a.currentStatus === 'picked' && b.currentStatus !== 'picked') return 1;
    if (a.currentStatus !== 'picked' && b.currentStatus === 'picked') return -1;
    if (a.currentStatus === 'expired' && b.currentStatus === 'pending') return 1;
    if (a.currentStatus === 'pending' && b.currentStatus === 'expired') return -1;
    return b.createTime - a.createTime;
  });
}

function _getRemainingTime(deadline, status) {
  if (!deadline || status === 'picked') return '';
  const now = Date.now();
  const diff = deadline - now;
  if (diff <= 0) return '已过期';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  if (days > 0) return `剩余 ${days}天${hours}小时`;
  if (hours > 0) return `剩余 ${hours}小时${minutes}分钟`;
  return `剩余 ${minutes}分钟`;
}

function _isExpiringSoon(deadline, status) {
  if (!deadline || status !== 'pending') return false;
  const now = Date.now();
  const diff = deadline - now;
  return diff > 0 && diff < 24 * 60 * 60 * 1000;
}

function getExpressLockerDetail(id) {
  return storage.getList(STORAGE_KEYS.EXPRESS_LOCKER_LIST).find(item => item.id === id) || null;
}

function addExpressLockerCode(data) {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const item = {
    id: util.generateId(),
    ...data,
    userId: userInfo.id || 'test_user',
    status: 'pending',
    createTime: Date.now(),
    updateTime: Date.now(),
    pickedTime: null
  };
  storage.addToList(STORAGE_KEYS.EXPRESS_LOCKER_LIST, item);
  return item;
}

function updateExpressLockerCode(id, updates) {
  return storage.updateInList(STORAGE_KEYS.EXPRESS_LOCKER_LIST, id, {
    ...updates,
    updateTime: Date.now()
  });
}

function markAsPicked(id) {
  return storage.updateInList(STORAGE_KEYS.EXPRESS_LOCKER_LIST, id, {
    status: 'picked',
    pickedTime: Date.now(),
    updateTime: Date.now()
  });
}

function deleteExpressLockerCode(id) {
  return storage.removeFromList(STORAGE_KEYS.EXPRESS_LOCKER_LIST, id);
}

function getExpiringSoonCount() {
  const list = getExpressLockerList('pending');
  return list.filter(item => item.isExpiringSoon).length;
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

  if (campusService.isCampusDataScoped('rental')) {
    list = campusService.filterListByCampus(list, filters.campusId);
  }

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
    updateTime: Date.now(),
    campusId: data.campusId || campusService.getCurrentCampusId()
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

// ==================== 租房看房预约 ====================

function createViewingAppointment(data) {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const house = getRentalDetail(data.houseId);

  if (!house) {
    return { success: false, message: '房源不存在' };
  }

  const appointment = {
    id: util.generateId(),
    houseId: data.houseId,
    houseTitle: house.title,
    houseCover: house.images && house.images[0] ? house.images[0] : '',
    houseAddress: house.address || '',
    rent: house.rent || 0,
    publisherId: house.publisherId || '',
    publisherName: house.publisherName || '',
    publisherPhone: house.contactPhone || '',
    userId: userInfo.id || 'anonymous',
    userName: userInfo.nickName || '匿名用户',
    userAvatar: userInfo.avatarUrl || '',
    userPhone: data.userPhone || '',
    date: data.date,
    timeSlot: data.timeSlot,
    message: data.message || '',
    status: 'pending',
    checkInCode: generateCheckInCode(),
    checkInTime: null,
    checkInLocation: null,
    rejectReason: '',
    rescheduleCount: 0,
    createTime: Date.now(),
    updateTime: Date.now()
  };

  const list = storage.getList(STORAGE_KEYS.RENTAL_VIEWING_APPOINTMENTS);
  list.unshift(appointment);
  storage.set(STORAGE_KEYS.RENTAL_VIEWING_APPOINTMENTS, list);

  addNotification({
    id: util.generateId(),
    type: 'rental_viewing',
    title: '新的看房预约',
    content: `${appointment.userName} 预约了 ${appointment.houseTitle} 的看房`,
    relatedId: appointment.id,
    receiverId: house.publisherId,
    read: false,
    createTime: Date.now()
  });

  return { success: true, appointment };
}

function generateCheckInCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function getViewingAppointmentList(filters = {}) {
  let list = storage.getList(STORAGE_KEYS.RENTAL_VIEWING_APPOINTMENTS);

  if (filters.userId) {
    list = list.filter(item => item.userId === filters.userId);
  }

  if (filters.publisherId) {
    list = list.filter(item => item.publisherId === filters.publisherId);
  }

  if (filters.status && filters.status !== 'all') {
    list = list.filter(item => item.status === filters.status);
  }

  if (filters.houseId) {
    list = list.filter(item => item.houseId === filters.houseId);
  }

  return list.sort((a, b) => b.createTime - a.createTime);
}

function getViewingAppointmentDetail(id) {
  const list = storage.getList(STORAGE_KEYS.RENTAL_VIEWING_APPOINTMENTS);
  return list.find(item => item.id === id) || null;
}

function updateViewingAppointment(id, updates) {
  const list = storage.getList(STORAGE_KEYS.RENTAL_VIEWING_APPOINTMENTS);
  const index = list.findIndex(item => item.id === id);
  if (index > -1) {
    list[index] = { ...list[index], ...updates, updateTime: Date.now() };
    storage.set(STORAGE_KEYS.RENTAL_VIEWING_APPOINTMENTS, list);
    return list[index];
  }
  return null;
}

function confirmViewingAppointment(id) {
  const appointment = updateViewingAppointment(id, { status: 'confirmed' });
  if (appointment) {
    addNotification({
      id: util.generateId(),
      type: 'rental_viewing',
      title: '看房预约已确认',
      content: `您预约的 ${appointment.houseTitle} 看房已被确认`,
      relatedId: id,
      receiverId: appointment.userId,
      read: false,
      createTime: Date.now()
    });
  }
  return appointment;
}

function rejectViewingAppointment(id, reason) {
  const appointment = updateViewingAppointment(id, { status: 'rejected', rejectReason: reason || '' });
  if (appointment) {
    addNotification({
      id: util.generateId(),
      type: 'rental_viewing',
      title: '看房预约被拒绝',
      content: `您预约的 ${appointment.houseTitle} 看房被拒绝：${reason || '暂无原因'}`,
      relatedId: id,
      receiverId: appointment.userId,
      read: false,
      createTime: Date.now()
    });
  }
  return appointment;
}

function rescheduleViewingAppointment(id, newDate, newTimeSlot) {
  const list = storage.getList(STORAGE_KEYS.RENTAL_VIEWING_APPOINTMENTS);
  const index = list.findIndex(item => item.id === id);
  if (index > -1) {
    const appointment = list[index];
    list[index] = {
      ...appointment,
      date: newDate,
      timeSlot: newTimeSlot,
      status: 'pending',
      rescheduleCount: (appointment.rescheduleCount || 0) + 1,
      updateTime: Date.now()
    };
    storage.set(STORAGE_KEYS.RENTAL_VIEWING_APPOINTMENTS, list);

    addNotification({
      id: util.generateId(),
      type: 'rental_viewing',
      title: '看房预约改期',
      content: `您的 ${appointment.houseTitle} 看房预约已改期`,
      relatedId: id,
      receiverId: appointment.userId,
      read: false,
      createTime: Date.now()
    });

    return list[index];
  }
  return null;
}

function cancelViewingAppointment(id, isPublisher = false) {
  const appointment = updateViewingAppointment(id, { status: 'cancelled' });
  if (appointment) {
    const receiverId = isPublisher ? appointment.userId : appointment.publisherId;
    addNotification({
      id: util.generateId(),
      type: 'rental_viewing',
      title: '看房预约已取消',
      content: `${appointment.houseTitle} 的看房预约已取消`,
      relatedId: id,
      receiverId: receiverId,
      read: false,
      createTime: Date.now()
    });
  }
  return appointment;
}

function completeViewingAppointment(id) {
  return updateViewingAppointment(id, { status: 'completed' });
}

function checkInViewing(appointmentId, location) {
  const appointment = getViewingAppointmentDetail(appointmentId);
  if (!appointment) {
    return { success: false, message: '预约不存在' };
  }
  if (appointment.status !== 'confirmed') {
    return { success: false, message: '预约未确认，无法签到' };
  }

  const updated = updateViewingAppointment(appointmentId, {
    checkInTime: Date.now(),
    checkInLocation: location || null,
    status: 'completed'
  });

  if (updated) {
    const checkInRecord = {
      id: util.generateId(),
      appointmentId: appointmentId,
      houseId: appointment.houseId,
      userId: appointment.userId,
      publisherId: appointment.publisherId,
      checkInTime: Date.now(),
      checkInLocation: location || null,
      verified: true
    };

    const checkinList = storage.getList(STORAGE_KEYS.RENTAL_VIEWING_CHECKINS);
    checkinList.unshift(checkInRecord);
    storage.set(STORAGE_KEYS.RENTAL_VIEWING_CHECKINS, checkinList);

    return { success: true, checkIn: checkInRecord, appointment: updated };
  }

  return { success: false, message: '签到失败' };
}

function verifyCheckInCode(code) {
  const list = storage.getList(STORAGE_KEYS.RENTAL_VIEWING_APPOINTMENTS);
  const appointment = list.find(item => item.checkInCode === code && item.status === 'confirmed');
  return appointment || null;
}

function getViewingCheckins(filters = {}) {
  let list = storage.getList(STORAGE_KEYS.RENTAL_VIEWING_CHECKINS);
  if (filters.userId) {
    list = list.filter(item => item.userId === filters.userId);
  }
  if (filters.publisherId) {
    list = list.filter(item => item.publisherId === filters.publisherId);
  }
  if (filters.houseId) {
    list = list.filter(item => item.houseId === filters.houseId);
  }
  return list.sort((a, b) => b.checkInTime - a.checkInTime);
}

function hasPendingAppointment(houseId, userId) {
  const list = storage.getList(STORAGE_KEYS.RENTAL_VIEWING_APPOINTMENTS);
  return list.some(item =>
    item.houseId === houseId &&
    item.userId === userId &&
    ['pending', 'confirmed'].includes(item.status)
  );
}

// ==================== 租房合同助手 ====================

function getContractChecklist(userId) {
  const key = `${STORAGE_KEYS.RENTAL_CONTRACT_CHECKLIST}_${userId}`;
  const saved = storage.get(key);
  if (saved) return saved;

  const defaultList = constants.RENTAL_CONTRACT_CHECKLIST.map(category => ({
    ...category,
    items: category.items.map(item => ({
      ...item,
      checked: false,
      note: ''
    }))
  }));

  return defaultList;
}

function saveContractChecklist(userId, checklist) {
  const key = `${STORAGE_KEYS.RENTAL_CONTRACT_CHECKLIST}_${userId}`;
  return storage.set(key, checklist);
}

function toggleContractCheckItem(userId, categoryIndex, itemIndex) {
  const checklist = getContractChecklist(userId);
  if (checklist[categoryIndex] && checklist[categoryIndex].items[itemIndex]) {
    checklist[categoryIndex].items[itemIndex].checked = !checklist[categoryIndex].items[itemIndex].checked;
    saveContractChecklist(userId, checklist);
    return checklist;
  }
  return checklist;
}

function updateContractCheckNote(userId, categoryIndex, itemIndex, note) {
  const checklist = getContractChecklist(userId);
  if (checklist[categoryIndex] && checklist[categoryIndex].items[itemIndex]) {
    checklist[categoryIndex].items[itemIndex].note = note;
    saveContractChecklist(userId, checklist);
    return checklist;
  }
  return checklist;
}

function resetContractChecklist(userId) {
  const defaultList = constants.RENTAL_CONTRACT_CHECKLIST.map(category => ({
    ...category,
    items: category.items.map(item => ({
      ...item,
      checked: false,
      note: ''
    }))
  }));
  saveContractChecklist(userId, defaultList);
  return defaultList;
}

function getContractCheckProgress(userId) {
  const checklist = getContractChecklist(userId);
  let total = 0;
  let checked = 0;
  checklist.forEach(category => {
    category.items.forEach(item => {
      total++;
      if (item.checked) checked++;
    });
  });
  return {
    total,
    checked,
    percentage: total > 0 ? Math.round((checked / total) * 100) : 0
  };
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

  const seatMap = buildSeatMap(data.totalSeats, data.driverSeatAvailable, data.passengerSeatAvailable, [{
    userId: userInfo.id || 'anonymous',
    userName: userInfo.nickName || '匿名用户',
    confirmed: true,
    seatType: 'driver',
    phone: data.contactPhone || ''
  }]);

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
    seatMap,
    members: [{
      userId: userInfo.id || 'anonymous',
      userName: userInfo.nickName || '匿名用户',
      confirmed: true,
      seatType: 'driver',
      phone: data.contactPhone || ''
    }],
    createTime: Date.now(),
    updateTime: Date.now()
  };

  const success = storage.addToList(STORAGE_KEYS.CARPOOL_LIST, item);
  if (success) {
    scheduleDepartureReminder(item.id, data.departureTime);
  }
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

  const seatMap = carpool.seatMap || buildSeatMap(carpool.totalSeats, carpool.driverSeatAvailable, carpool.passengerSeatAvailable, members);
  const availableSeat = seatMap.find(s => s.status === 'available');
  const seatType = availableSeat ? availableSeat.type : '';

  const member = {
    userId,
    userName,
    confirmed: false,
    seatType,
    phone: '',
    joinTime: Date.now()
  };

  members.push(member);

  const updatedSeatMap = updateSeatMap(seatMap, members, carpool.driverSeatAvailable, carpool.passengerSeatAvailable);

  const currentMembers = members.length;
  const remainingSeats = carpool.totalSeats - currentMembers;
  const newStatus = remainingSeats <= 0 ? 'full' : 'recruiting';

  storage.updateInList(STORAGE_KEYS.CARPOOL_LIST, carpoolId, {
    members,
    currentMembers,
    remainingSeats,
    seatMap: updatedSeatMap,
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

  const seatMap = carpool.seatMap || buildSeatMap(carpool.totalSeats, carpool.driverSeatAvailable, carpool.passengerSeatAvailable, members);
  const updatedSeatMap = updateSeatMap(seatMap, members, carpool.driverSeatAvailable, carpool.passengerSeatAvailable);

  storage.updateInList(STORAGE_KEYS.CARPOOL_LIST, carpoolId, {
    members,
    seatMap: updatedSeatMap,
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
  const seatMap = carpool.seatMap || buildSeatMap(carpool.totalSeats, carpool.driverSeatAvailable, carpool.passengerSeatAvailable, members);
  const updatedSeatMap = updateSeatMap(seatMap, members, carpool.driverSeatAvailable, carpool.passengerSeatAvailable);

  const currentMembers = members.length;
  const remainingSeats = carpool.totalSeats - currentMembers;

  storage.updateInList(STORAGE_KEYS.CARPOOL_LIST, carpoolId, {
    members,
    currentMembers,
    remainingSeats,
    seatMap: updatedSeatMap,
    status: remainingSeats > 0 ? 'recruiting' : carpool.status,
    updateTime: Date.now()
  });

  return { success: true };
}

function removeCarpoolMember(carpoolId, memberId) {
  initCarpoolData();
  const carpool = getCarpoolDetail(carpoolId);
  if (!carpool) return { success: false, message: '拼车信息不存在' };

  const memberToRemove = (carpool.members || []).find(m => m.userId === memberId);
  if (!memberToRemove) return { success: false, message: '该成员不存在' };

  if (memberToRemove.confirmed) {
    return { success: false, message: '已确认成员不可移除，请联系其自行退出' };
  }

  const members = (carpool.members || []).filter(m => m.userId !== memberId);
  const seatMap = carpool.seatMap || buildSeatMap(carpool.totalSeats, carpool.driverSeatAvailable, carpool.passengerSeatAvailable, members);
  const updatedSeatMap = updateSeatMap(seatMap, members, carpool.driverSeatAvailable, carpool.passengerSeatAvailable);

  const currentMembers = members.length;
  const remainingSeats = carpool.totalSeats - currentMembers;

  storage.updateInList(STORAGE_KEYS.CARPOOL_LIST, carpoolId, {
    members,
    currentMembers,
    remainingSeats,
    seatMap: updatedSeatMap,
    status: remainingSeats > 0 ? 'recruiting' : carpool.status,
    updateTime: Date.now()
  });

  return { success: true };
}

function buildSeatMap(totalSeats, driverSeatAvailable, passengerSeatAvailable, members) {
  const seatTypes = constants.CARPOOL_SEAT_TYPES || [];
  const allSeats = ['driver', 'passenger', 'rear_left', 'rear_mid', 'rear_right'];

  const seats = [];
  const usedSeats = [];

  for (let i = 0; i < totalSeats; i++) {
    const type = allSeats[i] || ('extra_' + (i - 4));
    let status = 'available';
    let occupiedBy = null;

    if (type === 'driver' && driverSeatAvailable === false) {
      status = 'unavailable';
    } else if (type === 'passenger' && passengerSeatAvailable === false) {
      status = 'unavailable';
    }

    const member = (members || []).find(m => m.seatType === type);
    if (member) {
      status = member.confirmed ? 'occupied' : 'pending';
      occupiedBy = member.userId;
      usedSeats.push(type);
    }

    const seatInfo = seatTypes.find(s => s.value === type);

    seats.push({
      index: i,
      type,
      label: seatInfo ? seatInfo.label : ('座位' + (i + 1)),
      icon: seatInfo ? seatInfo.icon : '💺',
      status,
      occupiedBy
    });
  }

  return seats;
}

function updateSeatMap(seatMap, members, driverSeatAvailable, passengerSeatAvailable) {
  if (!seatMap || seatMap.length === 0) {
    return buildSeatMap((members || []).length, driverSeatAvailable, passengerSeatAvailable, members);
  }

  return seatMap.map(seat => {
    let status = 'available';
    let occupiedBy = null;

    if (seat.type === 'driver' && driverSeatAvailable === false) {
      status = 'unavailable';
    } else if (seat.type === 'passenger' && passengerSeatAvailable === false) {
      status = 'unavailable';
    }

    const member = (members || []).find(m => m.seatType === seat.type);
    if (member) {
      status = member.confirmed ? 'occupied' : 'pending';
      occupiedBy = member.userId;
    }

    return { ...seat, status, occupiedBy };
  });
}

function scheduleDepartureReminder(carpoolId, departureTime) {
  if (!departureTime) return;

  const reminders = storage.getList(STORAGE_KEYS.CARPOOL_DEPARTURE_REMINDERS);
  const reminderTime = departureTime - 2 * 60 * 60 * 1000;
  const now = Date.now();

  if (reminderTime <= now) return;

  reminders.push({
    id: util.generateId(),
    carpoolId,
    reminderTime,
    departureTime,
    triggered: false,
    createTime: now
  });

  storage.set(STORAGE_KEYS.CARPOOL_DEPARTURE_REMINDERS, reminders);
}

function checkAndTriggerDepartureReminders() {
  const reminders = storage.getList(STORAGE_KEYS.CARPOOL_DEPARTURE_REMINDERS);
  const now = Date.now();
  let changed = false;

  reminders.forEach(reminder => {
    if (!reminder.triggered && reminder.reminderTime <= now) {
      reminder.triggered = true;
      changed = true;

      const carpool = getCarpoolDetail(reminder.carpoolId);
      if (carpool && (carpool.status === 'recruiting' || carpool.status === 'full')) {
        const confirmedMembers = (carpool.members || []).filter(m => m.confirmed);
        const notifications = storage.getList(STORAGE_KEYS.NOTIFICATIONS);

        confirmedMembers.forEach(member => {
          notifications.unshift({
            id: util.generateId(),
            type: 'activity',
            subType: 'reminder',
            title: '出发提醒',
            content: '您参与的拼车 "' + carpool.departure + ' → ' + (carpool.destinationText || carpool.destination) + '" 将在2小时后出发，请做好准备',
            extra: { carpoolId: reminder.carpoolId },
            read: false,
            createTime: now
          });
        });

        storage.set(STORAGE_KEYS.NOTIFICATIONS, notifications);
      }
    }
  });

  if (changed) {
    storage.set(STORAGE_KEYS.CARPOOL_DEPARTURE_REMINDERS, reminders);
  }
}

function updateCarpoolStatus(carpoolId, status) {
  return updateCarpool(carpoolId, { status });
}

// ==================== 团购拼单模块 ====================

let groupBuyInitialized = false;

function initGroupBuyData() {
  if (groupBuyInitialized) return;
  const existing = storage.get(STORAGE_KEYS.GROUP_BUY_LIST);
  if (!existing || existing.length === 0) {
    const now = Date.now();
    const groupBuys = mockData.MOCK_GROUP_BUYS.map((item, index) => ({
      id: 'mock_gb_' + index + '_' + now,
      ...item,
      createTime: now - (index + 1) * 86400000,
      updateTime: now - (index + 1) * 86400000
    }));
    storage.set(STORAGE_KEYS.GROUP_BUY_LIST, groupBuys);
  }
  groupBuyInitialized = true;
}

function checkAndUpdateGroupBuyStatus(groupBuyId) {
  const groupBuy = getGroupBuyDetail(groupBuyId);
  if (!groupBuy) return;

  const now = Date.now();
  const deadline = new Date(groupBuy.deadline).getTime();

  if (groupBuy.status === 'recruiting') {
    if (now > deadline) {
      if (groupBuy.joinedCount >= groupBuy.minCount) {
        updateGroupBuy(groupBuyId, { status: 'success' });
        addGroupBuyNotification(groupBuyId, {
          type: 'success',
          title: '团购成团啦！',
          content: `「${groupBuy.productName}」已成功成团，请留意取货通知。`
        });
      } else {
        updateGroupBuy(groupBuyId, { status: 'failed' });
        addGroupBuyNotification(groupBuyId, {
          type: 'failed',
          title: '团购流团了',
          content: `「${groupBuy.productName}」未达到成团人数，积分将自动退回。`
        });
      }
    } else if (groupBuy.joinedCount >= groupBuy.minCount) {
      updateGroupBuy(groupBuyId, { status: 'success' });
      addGroupBuyNotification(groupBuyId, {
        type: 'success',
        title: '团购成团啦！',
        content: `「${groupBuy.productName}」已成功成团，请留意取货通知。`
      });
    }
  }
}

function getGroupBuyList(filters = {}) {
  initGroupBuyData();
  let list = storage.getList(STORAGE_KEYS.GROUP_BUY_LIST);

  list.forEach(item => checkAndUpdateGroupBuyStatus(item.id));
  list = storage.getList(STORAGE_KEYS.GROUP_BUY_LIST);

  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'test_user';

  if (filters.type === 'mine') {
    list = list.filter(item =>
      item.publisherId === userId ||
      (item.members || []).some(m => m.userId === userId)
    );
  } else if (filters.status && filters.status !== 'all') {
    list = list.filter(item => item.status === filters.status);
  }

  if (filters.category && filters.category !== 'all') {
    list = list.filter(item => item.category === filters.category);
  }

  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    list = list.filter(item =>
      item.productName.toLowerCase().includes(keyword) ||
      (item.description || '').toLowerCase().includes(keyword)
    );
  }

  if (filters.minPrice !== undefined) {
    list = list.filter(item => item.unitPrice >= filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    list = list.filter(item => item.unitPrice <= filters.maxPrice);
  }

  if (filters.sort) {
    const sortInfo = constants.GROUP_BUY_SORT_OPTIONS.find(s => s.value === filters.sort);
    if (sortInfo) {
      list.sort((a, b) => {
        let va = a[sortInfo.field];
        let vb = b[sortInfo.field];
        if (typeof va === 'string') va = va.toLowerCase();
        if (typeof vb === 'string') vb = vb.toLowerCase();
        if (sortInfo.order === 'asc') {
          return va > vb ? 1 : -1;
        } else {
          return va < vb ? 1 : -1;
        }
      });
    }
  }

  return list;
}

function getGroupBuyDetail(id) {
  initGroupBuyData();
  checkAndUpdateGroupBuyStatus(id);
  const list = storage.getList(STORAGE_KEYS.GROUP_BUY_LIST);
  return list.find(item => item.id === id) || null;
}

function publishGroupBuy(data) {
  initGroupBuyData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'test_user';
  const userName = userInfo.nickName || '匿名用户';

  const newItem = {
    id: 'gb_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    ...data,
    publisherId: userId,
    publisherName: userName,
    publisherAvatar: userInfo.avatarUrl || '',
    status: 'recruiting',
    joinedCount: 1,
    views: 0,
    members: [
      {
        userId,
        userName,
        avatar: userInfo.avatarUrl || '',
        quantity: 1,
        joinTime: Date.now(),
        paid: true
      }
    ],
    createTime: Date.now(),
    updateTime: Date.now()
  };

  storage.addToList(STORAGE_KEYS.GROUP_BUY_LIST, newItem);
  return newItem;
}

function updateGroupBuy(id, updates) {
  return storage.updateInList(STORAGE_KEYS.GROUP_BUY_LIST, id, {
    ...updates,
    updateTime: Date.now()
  });
}

function deleteGroupBuy(id) {
  return storage.removeFromList(STORAGE_KEYS.GROUP_BUY_LIST, id);
}

function increaseGroupBuyViews(id) {
  const item = getGroupBuyDetail(id);
  if (item) {
    return storage.updateInList(STORAGE_KEYS.GROUP_BUY_LIST, id, {
      views: item.views + 1
    });
  }
  return false;
}

function joinGroupBuy(groupBuyId, quantity = 1) {
  initGroupBuyData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'test_user';
  const userName = userInfo.nickName || '匿名用户';

  const groupBuy = getGroupBuyDetail(groupBuyId);
  if (!groupBuy) return { success: false, message: '团购不存在' };

  if (groupBuy.status !== 'recruiting') {
    return { success: false, message: '该团购已不在拼团中' };
  }

  const now = Date.now();
  const deadline = new Date(groupBuy.deadline).getTime();
  if (now > deadline) {
    return { success: false, message: '团购已截止' };
  }

  const members = groupBuy.members || [];
  const existingMember = members.find(m => m.userId === userId);
  if (existingMember) {
    return { success: false, message: '您已参加该团购' };
  }

  const currentTotal = members.reduce((sum, m) => sum + m.quantity, 0);
  if (currentTotal + quantity > groupBuy.maxCount) {
    return { success: false, message: '超出最大购买数量' };
  }

  const cost = groupBuy.unitPrice * quantity;
  const currentPoints = getUserPoints();
  if (currentPoints < cost) {
    return { success: false, message: `积分不足，当前积分：${currentPoints}` };
  }

  deductPoints(cost, `团购预付：${groupBuy.productName}`);

  const member = {
    userId,
    userName,
    avatar: userInfo.avatarUrl || '',
    quantity,
    joinTime: Date.now(),
    paid: true
  };

  members.push(member);
  const joinedCount = members.reduce((sum, m) => sum + m.quantity, 0);

  let newStatus = groupBuy.status;
  if (joinedCount >= groupBuy.minCount) {
    newStatus = 'success';
    addGroupBuyNotification(groupBuyId, {
      type: 'success',
      title: '团购成团啦！',
      content: `「${groupBuy.productName}」已成功成团，请留意取货通知。`
    });
  }

  storage.updateInList(STORAGE_KEYS.GROUP_BUY_LIST, groupBuyId, {
    members,
    joinedCount,
    status: newStatus,
    updateTime: Date.now()
  });

  return { success: true, message: '参团成功', cost };
}

function leaveGroupBuy(groupBuyId) {
  initGroupBuyData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'test_user';

  const groupBuy = getGroupBuyDetail(groupBuyId);
  if (!groupBuy) return { success: false, message: '团购不存在' };

  if (groupBuy.status === 'ended') {
    return { success: false, message: '团购已结束，无法退出' };
  }

  const members = groupBuy.members || [];
  const memberIndex = members.findIndex(m => m.userId === userId);
  if (memberIndex === -1) {
    return { success: false, message: '您未参加该团购' };
  }

  const leavingMember = members[memberIndex];
  const refund = groupBuy.unitPrice * leavingMember.quantity;

  if (groupBuy.status === 'success') {
    addPoints(refund, `团购退款：${groupBuy.productName}`);
  } else if (leavingMember.paid) {
    addPoints(refund, `团购退款：${groupBuy.productName}`);
  }

  members.splice(memberIndex, 1);
  const joinedCount = members.reduce((sum, m) => sum + m.quantity, 0);

  let newStatus = groupBuy.status;
  if (groupBuy.status === 'success' && joinedCount < groupBuy.minCount) {
    newStatus = 'recruiting';
  }

  storage.updateInList(STORAGE_KEYS.GROUP_BUY_LIST, groupBuyId, {
    members,
    joinedCount,
    status: newStatus,
    updateTime: Date.now()
  });

  return { success: true, message: '已退出团购，积分已退回', refund };
}

function getMyGroupBuys() {
  initGroupBuyData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userInfo.id || 'test_user';

  const list = storage.getList(STORAGE_KEYS.GROUP_BUY_LIST);
  return list.filter(item =>
    item.publisherId === userId ||
    (item.members || []).some(m => m.userId === userId)
  );
}

function addGroupBuyNotification(groupBuyId, notification) {
  const notifications = storage.getList(STORAGE_KEYS.GROUP_BUY_NOTIFICATIONS);
  notifications.unshift({
    id: 'gb_notif_' + Date.now().toString(36),
    groupBuyId,
    ...notification,
    read: false,
    createTime: Date.now()
  });
  storage.set(STORAGE_KEYS.GROUP_BUY_NOTIFICATIONS, notifications);
}

function getGroupBuyNotifications() {
  return storage.getList(STORAGE_KEYS.GROUP_BUY_NOTIFICATIONS);
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

  if (campusService.isCampusDataScoped('canteen')) {
    list = campusService.filterListByCampus(list, filters.campusId);
  }

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

  if (campusService.isCampusDataScoped('forum')) {
    list = campusService.filterListByCampus(list, filters.campusId);
  }

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
    updateTime: Date.now(),
    campusId: data.campusId || campusService.getCurrentCampusId()
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
  const existingJoinRequests = storage.get(STORAGE_KEYS.CLUB_JOIN_REQUESTS);
  const existingAnnouncements = storage.get(STORAGE_KEYS.CLUB_ANNOUNCEMENTS);

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

  if (!existingJoinRequests) {
    storage.set(STORAGE_KEYS.CLUB_JOIN_REQUESTS, mockData.MOCK_CLUB_JOIN_REQUESTS || {});
  }

  if (!existingAnnouncements) {
    storage.set(STORAGE_KEYS.CLUB_ANNOUNCEMENTS, mockData.MOCK_CLUB_ANNOUNCEMENTS || {});
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

  if (campusService.isCampusDataScoped('club')) {
    list = campusService.filterListByCampus(list, filters.campusId);
  }

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

function isClubAdmin(clubId, userId) {
  initClubData();
  const club = getClubDetail(clubId);
  if (!club) return false;
  return (club.admins || []).includes(userId);
}

function isClubPresident(clubId, userId) {
  initClubData();
  const club = getClubDetail(clubId);
  if (!club) return false;
  return club.presidentId === userId;
}

function getClubJoinRequests(clubId, status = '') {
  initClubData();
  const requestMap = storage.get(STORAGE_KEYS.CLUB_JOIN_REQUESTS) || {};
  let requests = requestMap[clubId] || [];
  if (status) {
    requests = requests.filter(r => r.status === status);
  }
  return requests.sort((a, b) => b.createTime - a.createTime);
}

function getPendingJoinRequestCount(clubId) {
  const requests = getClubJoinRequests(clubId, 'pending');
  return requests.length;
}

function submitJoinRequest(clubId, userData, reason = '') {
  initClubData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const userId = userData.userId || userInfo.id || 'test_user';

  if (isClubMember(clubId, userId)) {
    return { success: false, message: '您已是该社团成员' };
  }

  const requestMap = storage.get(STORAGE_KEYS.CLUB_JOIN_REQUESTS) || {};
  const requests = requestMap[clubId] || [];

  const existingRequest = requests.find(r => r.userId === userId && r.status === 'pending');
  if (existingRequest) {
    return { success: false, message: '您已有待审批的申请' };
  }

  const club = getClubDetail(clubId);
  if (!club) {
    return { success: false, message: '社团不存在' };
  }

  if (club.needApproval === false) {
    const result = joinClub(clubId, {
      userId,
      name: userData.userName || userInfo.nickname || '新成员',
      avatar: userData.avatar || userInfo.avatar || '',
      role: 'member'
    });
    return result;
  }

  const newRequest = {
    id: util.generateId(),
    userId,
    userName: userData.userName || userInfo.nickname || '新成员',
    avatar: userData.avatar || userInfo.avatar || '',
    studentNo: userData.studentNo || '',
    major: userData.major || '',
    grade: userData.grade || '',
    reason,
    status: 'pending',
    createTime: Date.now()
  };

  requests.unshift(newRequest);
  requestMap[clubId] = requests;
  storage.set(STORAGE_KEYS.CLUB_JOIN_REQUESTS, requestMap);

  return { success: true, request: newRequest, message: '申请已提交，等待社长审核' };
}

function approveJoinRequest(clubId, requestId) {
  initClubData();
  const requestMap = storage.get(STORAGE_KEYS.CLUB_JOIN_REQUESTS) || {};
  const requests = requestMap[clubId] || [];
  const requestIndex = requests.findIndex(r => r.id === requestId);

  if (requestIndex === -1) {
    return { success: false, message: '申请不存在' };
  }

  const request = requests[requestIndex];
  if (request.status !== 'pending') {
    return { success: false, message: '申请已处理' };
  }

  const result = joinClub(clubId, {
    userId: request.userId,
    name: request.userName,
    avatar: request.avatar,
    role: 'member'
  });

  if (result.success) {
    requests[requestIndex] = { ...request, status: 'approved', approveTime: Date.now() };
    requestMap[clubId] = requests;
    storage.set(STORAGE_KEYS.CLUB_JOIN_REQUESTS, requestMap);
    return { success: true, message: '已通过申请' };
  }

  return result;
}

function rejectJoinRequest(clubId, requestId, reason = '') {
  initClubData();
  const requestMap = storage.get(STORAGE_KEYS.CLUB_JOIN_REQUESTS) || {};
  const requests = requestMap[clubId] || [];
  const requestIndex = requests.findIndex(r => r.id === requestId);

  if (requestIndex === -1) {
    return { success: false, message: '申请不存在' };
  }

  const request = requests[requestIndex];
  if (request.status !== 'pending') {
    return { success: false, message: '申请已处理' };
  }

  requests[requestIndex] = { ...request, status: 'rejected', rejectReason: reason, rejectTime: Date.now() };
  requestMap[clubId] = requests;
  storage.set(STORAGE_KEYS.CLUB_JOIN_REQUESTS, requestMap);

  return { success: true, message: '已拒绝申请' };
}

function removeClubMember(clubId, userId) {
  return leaveClub(clubId, userId);
}

function updateMemberRole(clubId, userId, newRole) {
  initClubData();
  const memberMap = storage.get(STORAGE_KEYS.CLUB_MEMBER_LIST) || {};
  const members = memberMap[clubId] || [];
  const memberIndex = members.findIndex(m => m.userId === userId);

  if (memberIndex === -1) {
    return { success: false, message: '成员不存在' };
  }

  if (newRole === 'president') {
    const oldPresidentIndex = members.findIndex(m => m.role === 'president');
    if (oldPresidentIndex > -1) {
      members[oldPresidentIndex] = { ...members[oldPresidentIndex], role: 'member' };
    }
    const club = getClubDetail(clubId);
    if (club) {
      storage.updateInList(STORAGE_KEYS.CLUB_LIST, clubId, {
        presidentId: userId,
        presidentName: members[memberIndex].name,
        presidentAvatar: members[memberIndex].avatar
      });
    }
  }

  members[memberIndex] = { ...members[memberIndex], role: newRole };
  memberMap[clubId] = members;
  storage.set(STORAGE_KEYS.CLUB_MEMBER_LIST, memberMap);

  return { success: true, message: '角色已更新' };
}

function updateClubInfo(clubId, updates) {
  initClubData();
  const success = storage.updateInList(STORAGE_KEYS.CLUB_LIST, clubId, {
    ...updates,
    updateTime: Date.now()
  });
  return success;
}

function getClubAnnouncements(clubId) {
  initClubData();
  const announcementMap = storage.get(STORAGE_KEYS.CLUB_ANNOUNCEMENTS) || {};
  const announcements = announcementMap[clubId] || [];
  return announcements.sort((a, b) => b.createTime - a.createTime);
}

function publishClubAnnouncement(clubId, title, content, isImportant = false) {
  initClubData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const club = getClubDetail(clubId);

  const announcementMap = storage.get(STORAGE_KEYS.CLUB_ANNOUNCEMENTS) || {};
  const announcements = announcementMap[clubId] || [];

  const newAnnouncement = {
    id: util.generateId(),
    title,
    content,
    publisherId: userInfo.id || 'admin',
    publisherName: userInfo.nickname || '管理员',
    isImportant,
    clubId,
    clubName: club ? club.name : '',
    createTime: Date.now()
  };

  announcements.unshift(newAnnouncement);
  announcementMap[clubId] = announcements;
  storage.set(STORAGE_KEYS.CLUB_ANNOUNCEMENTS, announcementMap);

  createNotification({
    type: 'activity',
    subType: 'club_announcement',
    title: `${club ? club.name : '社团'}发布新公告`,
    content: title,
    data: {
      clubId,
      announcementId: newAnnouncement.id,
      clubName: club ? club.name : ''
    },
    extra: {
      isImportant,
      icon: isImportant ? '📌' : '📢',
      typeColor: isImportant ? '#FEF3C7' : '#DBEAFE',
      typeIconColor: isImportant ? '#F59E0B' : '#3B82F6'
    }
  });

  return { success: true, announcement: newAnnouncement };
}

function deleteClubAnnouncement(clubId, announcementId) {
  initClubData();
  const announcementMap = storage.get(STORAGE_KEYS.CLUB_ANNOUNCEMENTS) || {};
  const announcements = announcementMap[clubId] || [];
  const filtered = announcements.filter(a => a.id !== announcementId);
  announcementMap[clubId] = filtered;
  storage.set(STORAGE_KEYS.CLUB_ANNOUNCEMENTS, announcementMap);
  return true;
}

function getClubStats(clubId) {
  initClubData();
  const club = getClubDetail(clubId);
  if (!club) return null;

  const members = getClubMembers(clubId);
  const activities = getClubActivities(clubId);
  const announcements = getClubAnnouncements(clubId);

  const memberCount = members.length;
  const activityCount = activities.length;
  const announcementCount = announcements.length;

  const now = Date.now();
  const oneMonthAgo = now - 30 * 86400000;

  const monthActivities = activities.filter(a => {
    const activityTime = new Date(a.activityTime).getTime();
    return activityTime >= oneMonthAgo && activityTime <= now;
  });

  const newMembersThisMonth = members.filter(m => {
    return m.joinTime && m.joinTime >= oneMonthAgo;
  }).length;

  let totalRegistrations = 0;
  let totalCheckins = 0;
  let recentActiveMembers = new Set();

  activities.forEach(activity => {
    const regs = activity.registrations || [];
    totalRegistrations += regs.length;
    const checkins = regs.filter(r => r.checkedIn);
    totalCheckins += checkins.length;

    const activityTime = new Date(activity.activityTime).getTime();
    if (activityTime >= oneMonthAgo) {
      regs.forEach(r => recentActiveMembers.add(r.userId));
    }
  });

  const avgParticipationRate = memberCount > 0 && activityCount > 0
    ? Math.round((totalRegistrations / activityCount) / memberCount * 100)
    : 0;

  const monthActiveCount = recentActiveMembers.size;

  return {
    memberCount,
    activityCount,
    announcementCount,
    monthActivityCount: monthActivities.length,
    avgParticipationRate,
    monthActiveCount,
    recentActiveCount: monthActiveCount,
    newMembersThisMonth,
    totalRegistrations,
    totalCheckins
  };
}

function updateActivity(activityId, updates) {
  return updateClubActivity(activityId, updates);
}

function getActivityDetail(activityId) {
  return getClubActivityDetail(activityId);
}

function exportCheckinData(activityId) {
  initClubData();
  const activity = getClubActivityDetail(activityId);
  if (!activity) return null;

  const registrations = activity.registrations || [];
  let text = `=== ${activity.title} 签到表 ===\n`;
  text += `活动时间：${activity.activityTime}\n`;
  text += `活动地点：${activity.location}\n`;
  text += `应到人数：${registrations.length}\n`;
  const checkedCount = registrations.filter(r => r.checkedIn).length;
  text += `实到人数：${checkedCount}\n`;
  text += `签到率：${registrations.length > 0 ? Math.round(checkedCount / registrations.length * 100) : 0}%\n\n`;
  text += `序号\t姓名\t学号\t专业\t签到状态\t签到时间\n`;

  registrations.forEach((r, i) => {
    const status = r.checkedIn ? '已签到' : '未签到';
    const checkTime = r.checkInTime ? new Date(r.checkInTime).toLocaleString() : '-';
    text += `${i + 1}\t${r.userName || r.name || '-'}\t${r.studentNo || '-'}\t${r.major || '-'}\t${status}\t${checkTime}\n`;
  });

  return text;
}

function scanCheckin(activityId, userId) {
  initClubData();
  const activity = getClubActivityDetail(activityId);
  if (!activity) {
    return { success: false, message: '活动不存在' };
  }

  const registrations = activity.registrations || [];
  const regIndex = registrations.findIndex(r => r.userId === userId);

  if (regIndex === -1) {
    return { success: false, message: '未报名该活动' };
  }

  if (registrations[regIndex].checkedIn) {
    return { success: false, message: '已签到', alreadyChecked: true };
  }

  registrations[regIndex] = {
    ...registrations[regIndex],
    checkedIn: true,
    checkInTime: Date.now(),
    checkInStatus: 'checked_in'
  };

  const success = updateClubActivity(activityId, { registrations });
  if (success) {
    return { success: true, message: '签到成功', registration: registrations[regIndex] };
  }
  return { success: false, message: '签到失败' };
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

  if (campusService.isCampusDataScoped('poi')) {
    list = campusService.filterListByCampus(list, filters.campusId);
  }

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

function initTakeoutData() {
  if (takeoutInitialized) return;
  const existing = storage.get(STORAGE_KEYS.TAKEOUT_MERCHANT_LIST);
  if (!existing || existing.length === 0) {
    const favoriteMerchantIds = storage.getList(STORAGE_KEYS.FAVORITE_TAKEOUT_MERCHANTS);
    const merchants = mockData.MOCK_TAKEOUT_MERCHANTS.map((item, index) => ({
      ...item,
      isFavorite: favoriteMerchantIds.includes(item.id),
      views: Math.floor(Math.random() * 500) + 100,
      createTime: Date.now() - (index + 1) * 86400000,
      updateTime: Date.now() - (index + 1) * 86400000
    }));
    storage.set(STORAGE_KEYS.TAKEOUT_MERCHANT_LIST, merchants);
  }
  takeoutInitialized = true;
}

function getTakeoutMerchantList(filters = {}) {
  initTakeoutData();
  let list = storage.getList(STORAGE_KEYS.TAKEOUT_MERCHANT_LIST);
  const favoriteMerchantIds = storage.getList(STORAGE_KEYS.FAVORITE_TAKEOUT_MERCHANTS);

  list = list.map(item => ({
    ...item,
    isFavorite: favoriteMerchantIds.includes(item.id)
  }));

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['name', 'location', 'tags']);
  }

  if (filters.category && filters.category !== 'all') {
    list = list.filter(item => item.category === filters.category);
  }

  if (filters.onlyOpen) {
    list = list.filter(item => item.isOpen);
  }

  if (filters.onlyFavorite) {
    list = list.filter(item => item.isFavorite);
  }

  if (filters.minRating !== undefined) {
    list = list.filter(item => item.rating >= filters.minRating);
  }

  if (filters.maxDeliveryFee !== undefined) {
    list = list.filter(item => item.deliveryFee <= filters.maxDeliveryFee);
  }

  const sortValue = filters.sort || 'comprehensive';
  list = sortByField(list, sortValue, constants.TAKEOUT_SORT_OPTIONS);

  return list;
}

function getTakeoutMerchantDetail(id) {
  initTakeoutData();
  const list = storage.getList(STORAGE_KEYS.TAKEOUT_MERCHANT_LIST);
  const merchant = list.find(item => item.id === id);
  if (merchant) {
    const favoriteMerchantIds = storage.getList(STORAGE_KEYS.FAVORITE_TAKEOUT_MERCHANTS);
    return {
      ...merchant,
      isFavorite: favoriteMerchantIds.includes(merchant.id)
    };
  }
  return null;
}

function toggleFavoriteTakeoutMerchant(merchantId) {
  initTakeoutData();
  let favorites = storage.getList(STORAGE_KEYS.FAVORITE_TAKEOUT_MERCHANTS);
  const index = favorites.indexOf(merchantId);
  if (index > -1) {
    favorites.splice(index, 1);
    storage.set(STORAGE_KEYS.FAVORITE_TAKEOUT_MERCHANTS, favorites);
    return { isFavorite: false };
  } else {
    favorites.unshift(merchantId);
    storage.set(STORAGE_KEYS.FAVORITE_TAKEOUT_MERCHANTS, favorites);
    return { isFavorite: true };
  }
}

function isFavoriteTakeoutMerchant(merchantId) {
  const favorites = storage.getList(STORAGE_KEYS.FAVORITE_TAKEOUT_MERCHANTS);
  return favorites.includes(merchantId);
}

function getFavoriteTakeoutMerchants() {
  initTakeoutData();
  const favoriteMerchantIds = storage.getList(STORAGE_KEYS.FAVORITE_TAKEOUT_MERCHANTS);
  const list = storage.getList(STORAGE_KEYS.TAKEOUT_MERCHANT_LIST);
  return list
    .filter(item => favoriteMerchantIds.includes(item.id))
    .map(item => ({ ...item, isFavorite: true }));
}

function getTakeoutPromotionBanners() {
  return mockData.MOCK_TAKEOUT_PROMOTIONS_BANNER || [];
}

function getTodayAllDiscounts() {
  initTakeoutData();
  const list = storage.getList(STORAGE_KEYS.TAKEOUT_MERCHANT_LIST);
  const allDiscounts = [];
  list.forEach(merchant => {
    if (merchant.todayDiscounts && merchant.todayDiscounts.length > 0) {
      merchant.todayDiscounts.forEach(discount => {
        allDiscounts.push({
          ...discount,
          merchantId: merchant.id,
          merchantName: merchant.name,
          merchantCover: merchant.cover
        });
      });
    }
  });
  return allDiscounts;
}

// ==================== 毕业离校 ====================

let graduationInitialized = false;

function initGraduationChecklist(userId) {
  if (graduationInitialized) return;

  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const targetUserId = userId || userInfo.id || 'test_user';

  const existing = storage.get(STORAGE_KEYS.GRADUATION_CHECKLIST);
  const allChecklists = existing || {};

  const mockStudents = [
    { userId: 'stu_001', userName: '张同学', studentId: '2022001001', college: '计算机学院', major: '软件工程', className: '2022级1班' },
    { userId: 'stu_002', userName: '李同学', studentId: '2022001002', college: '计算机学院', major: '计算机科学与技术', className: '2022级2班' },
    { userId: 'stu_003', userName: '王同学', studentId: '2022002001', college: '电子信息学院', major: '电子信息工程', className: '2022级1班' },
    { userId: 'stu_004', userName: '刘同学', studentId: '2022003001', college: '经济管理学院', major: '工商管理', className: '2022级1班' },
    { userId: 'stu_005', userName: '陈同学', studentId: '2022004001', college: '外国语学院', major: '英语', className: '2022级1班' }
  ];

  mockStudents.forEach(student => {
    if (!allChecklists[student.userId]) {
      const items = constants.GRADUATION_ITEMS.map((item, idx) => {
        let status = 'pending';
        let adminSigned = false;
        let signTime = null;
        let signAdmin = null;

        if (student.userId === 'stu_001') {
          if (idx === 0) { status = 'completed'; adminSigned = true; signTime = Date.now() - 86400000 * 3; signAdmin = '王管理员'; }
          else if (idx === 1) { status = 'completed'; adminSigned = true; signTime = Date.now() - 86400000 * 2; signAdmin = '赵管理员'; }
          else if (idx === 2) { status = 'processing'; }
          else if (idx === 3) { status = 'processing'; }
        } else if (student.userId === 'stu_002') {
          if (idx === 0) { status = 'completed'; adminSigned = true; signTime = Date.now() - 86400000 * 5; signAdmin = '王管理员'; }
          else if (idx === 1) { status = 'completed'; adminSigned = true; signTime = Date.now() - 86400000 * 4; signAdmin = '赵管理员'; }
          else if (idx === 2) { status = 'completed'; adminSigned = true; signTime = Date.now() - 86400000 * 2; signAdmin = '孙管理员'; }
          else if (idx === 3) { status = 'completed'; adminSigned = true; signTime = Date.now() - 86400000; signAdmin = '周管理员'; }
          else if (idx === 4) { status = 'processing'; }
        } else if (student.userId === 'stu_003') {
          if (idx === 0) { status = 'processing'; }
        } else if (student.userId === 'stu_004') {
          if (idx === 0) { status = 'completed'; adminSigned = true; signTime = Date.now() - 86400000 * 7; signAdmin = '王管理员'; }
          else if (idx === 1) { status = 'completed'; adminSigned = true; signTime = Date.now() - 86400000 * 6; signAdmin = '赵管理员'; }
          else if (idx === 2) { status = 'completed'; adminSigned = true; signTime = Date.now() - 86400000 * 5; signAdmin = '孙管理员'; }
          else if (idx === 3) { status = 'completed'; adminSigned = true; signTime = Date.now() - 86400000 * 4; signAdmin = '周管理员'; }
          else if (idx === 4) { status = 'completed'; adminSigned = true; signTime = Date.now() - 86400000 * 3; signAdmin = '吴管理员'; }
        }

        return {
          ...item,
          status,
          adminSigned,
          signTime,
          signAdmin,
          updateTime: signTime || null
        };
      });

      allChecklists[student.userId] = {
        userId: student.userId,
        userName: student.userName,
        studentId: student.studentId,
        college: student.college,
        major: student.major,
        className: student.className,
        items,
        createTime: Date.now() - 86400000 * 10,
        updateTime: Date.now(),
        completed: items.every(i => i.status === 'completed'),
        certificateGenerated: student.userId === 'stu_004'
      };

      if (student.userId === 'stu_004') {
        const certificates = storage.get(STORAGE_KEYS.GRADUATION_CERTIFICATE) || {};
        certificates[student.userId] = {
          certificateNumber: `GRAD${Date.now()}`,
          userName: student.userName,
          studentId: student.studentId,
          college: student.college,
          major: student.major,
          className: student.className,
          issueDate: new Date(Date.now() - 86400000 * 2).toLocaleDateString('zh-CN'),
          items: items.map(i => ({
            name: i.name,
            department: i.department,
            signAdmin: i.signAdmin
          })),
          qrCode: '/assets/images/qrcode.png',
          createTime: Date.now() - 86400000 * 2
        };
        storage.set(STORAGE_KEYS.GRADUATION_CERTIFICATE, certificates);
      }
    }
  });

  if (!allChecklists[targetUserId]) {
    const items = constants.GRADUATION_ITEMS.map(item => ({
      ...item,
      status: 'pending',
      adminSigned: false,
      signTime: null,
      signAdmin: null,
      updateTime: null
    }));

    allChecklists[targetUserId] = {
      userId: targetUserId,
      userName: userInfo.nickName || '张同学',
      studentId: '2022001001',
      college: '计算机学院',
      major: '软件工程',
      className: '2022级1班',
      items,
      createTime: Date.now(),
      updateTime: Date.now(),
      completed: false,
      certificateGenerated: false
    };
  }

  storage.set(STORAGE_KEYS.GRADUATION_CHECKLIST, allChecklists);
  graduationInitialized = true;
}

function getGraduationChecklist(userId) {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const targetUserId = userId || userInfo.id || 'test_user';

  initGraduationChecklist(targetUserId);

  const allChecklists = storage.get(STORAGE_KEYS.GRADUATION_CHECKLIST) || {};
  const checklist = allChecklists[targetUserId];

  if (checklist) {
    const completedCount = checklist.items.filter(item => item.status === 'completed').length;
    const totalCount = checklist.items.length;
    checklist.progress = Math.round((completedCount / totalCount) * 100);
    checklist.completed = completedCount === totalCount;
  }

  return checklist;
}

function updateGraduationItemStatus(itemId, status, userId) {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const targetUserId = userId || userInfo.id || 'test_user';

  const allChecklists = storage.get(STORAGE_KEYS.GRADUATION_CHECKLIST) || {};
  const checklist = allChecklists[targetUserId];

  if (!checklist) return false;

  const itemIndex = checklist.items.findIndex(item => item.id === itemId);
  if (itemIndex === -1) return false;

  checklist.items[itemIndex].status = status;
  checklist.items[itemIndex].updateTime = Date.now();
  checklist.updateTime = Date.now();

  storage.set(STORAGE_KEYS.GRADUATION_CHECKLIST, allChecklists);
  return true;
}

function getGraduationProgress(userId) {
  const checklist = getGraduationChecklist(userId);
  if (!checklist) return 0;
  return checklist.progress;
}

function adminSignGraduationItem(userId, itemId, adminName, department) {
  const allChecklists = storage.get(STORAGE_KEYS.GRADUATION_CHECKLIST) || {};
  const checklist = allChecklists[userId];

  if (!checklist) return { success: false, message: '未找到该学生的离校清单' };

  const itemIndex = checklist.items.findIndex(item => item.id === itemId);
  if (itemIndex === -1) return { success: false, message: '未找到该办理项' };

  if (checklist.items[itemIndex].status !== 'processing') {
    return { success: false, message: '该项目状态不是办理中，无法签字确认' };
  }

  checklist.items[itemIndex].status = 'completed';
  checklist.items[itemIndex].adminSigned = true;
  checklist.items[itemIndex].signTime = Date.now();
  checklist.items[itemIndex].signAdmin = adminName || '管理员';
  checklist.items[itemIndex].signDepartment = department || checklist.items[itemIndex].department;
  checklist.items[itemIndex].updateTime = Date.now();
  checklist.updateTime = Date.now();

  const completedCount = checklist.items.filter(item => item.status === 'completed').length;
  checklist.progress = Math.round((completedCount / checklist.items.length) * 100);
  checklist.completed = completedCount === checklist.items.length;

  storage.set(STORAGE_KEYS.GRADUATION_CHECKLIST, allChecklists);

  return {
    success: true,
    message: '签字确认成功',
    progress: checklist.progress,
    completed: checklist.completed
  };
}

function getAllGraduationChecklists() {
  const allChecklists = storage.get(STORAGE_KEYS.GRADUATION_CHECKLIST) || {};
  return Object.values(allChecklists).map(checklist => {
    const completedCount = checklist.items.filter(item => item.status === 'completed').length;
    const totalCount = checklist.items.length;
    return {
      ...checklist,
      progress: Math.round((completedCount / totalCount) * 100),
      completed: completedCount === totalCount
    };
  }).sort((a, b) => b.updateTime - a.updateTime);
}

function getGraduationCertificate(userId) {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const targetUserId = userId || userInfo.id || 'test_user';

  const certificates = storage.get(STORAGE_KEYS.GRADUATION_CERTIFICATE) || {};
  return certificates[targetUserId] || null;
}

function generateGraduationCertificate(userId) {
  const checklist = getGraduationChecklist(userId);
  if (!checklist) return { success: false, message: '未找到离校清单' };
  if (!checklist.completed) return { success: false, message: '离校手续尚未全部完成' };

  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  const targetUserId = userId || userInfo.id || 'test_user';

  const certificates = storage.get(STORAGE_KEYS.GRADUATION_CERTIFICATE) || {};

  const certificate = {
    id: 'cert_' + Date.now(),
    userId: targetUserId,
    userName: checklist.userName,
    studentId: checklist.studentId,
    college: checklist.college,
    major: checklist.major,
    className: checklist.className,
    certificateNumber: 'BY' + Date.now(),
    issueDate: util.formatTime(Date.now(), 'YYYY-MM-DD'),
    items: checklist.items.map(item => ({
      name: item.name,
      department: item.department,
      signAdmin: item.signAdmin,
      signTime: item.signTime
    })),
    generateTime: Date.now(),
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent('graduation:' + targetUserId)
  };

  certificates[targetUserId] = certificate;
  storage.set(STORAGE_KEYS.GRADUATION_CERTIFICATE, certificates);

  const allChecklists = storage.get(STORAGE_KEYS.GRADUATION_CHECKLIST) || {};
  if (allChecklists[targetUserId]) {
    allChecklists[targetUserId].certificateGenerated = true;
    allChecklists[targetUserId].certificateId = certificate.id;
    storage.set(STORAGE_KEYS.GRADUATION_CHECKLIST, allChecklists);
  }

  return { success: true, certificate };
}

// ==================== 实验室/设备预约 ====================

let labsInitialized = false;
let labAppointmentsInitialized = false;

function initLabData() {
  if (labsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.LAB_LIST);
  if (!existing || existing.length === 0) {
    const labs = constants.MOCK_LABS.map((item, index) => ({
      ...item,
      createTime: Date.now() - index * 86400000,
      updateTime: Date.now() - index * 86400000
    }));
    storage.set(STORAGE_KEYS.LAB_LIST, labs);
  }
  labsInitialized = true;
}

function initLabAppointments() {
  if (labAppointmentsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.LAB_APPOINTMENT_LIST);
  if (!existing || existing.length === 0) {
    storage.set(STORAGE_KEYS.LAB_APPOINTMENT_LIST, []);
  }
  labAppointmentsInitialized = true;
}

function getLabList(filters = {}) {
  initLabData();
  let list = storage.getList(STORAGE_KEYS.LAB_LIST);

  if (filters.type && filters.type !== 'all') {
    list = list.filter(item => item.type === filters.type);
  }

  if (filters.keyword) {
    const keywordLower = filters.keyword.toLowerCase();
    list = list.filter(item =>
      item.name.toLowerCase().includes(keywordLower) ||
      item.building.toLowerCase().includes(keywordLower) ||
      item.description.toLowerCase().includes(keywordLower)
    );
  }

  return list;
}

function getLabDetail(labId) {
  initLabData();
  const list = storage.getList(STORAGE_KEYS.LAB_LIST);
  const lab = list.find(item => item.id === labId) || null;
  if (lab) {
    const safetyLevelInfo = constants.LAB_SAFETY_LEVEL_MAP[lab.safetyLevel] || {};
    return {
      ...lab,
      safetyLevelLabel: safetyLevelInfo.label,
      safetyLevelColor: safetyLevelInfo.color,
      safetyLevelDesc: safetyLevelInfo.desc
    };
  }
  return null;
}

function getLabAppointmentList(filters = {}) {
  initLabAppointments();
  let list = storage.getList(STORAGE_KEYS.LAB_APPOINTMENT_LIST);

  if (filters.userId) {
    list = list.filter(item => item.userId === filters.userId);
  }

  if (filters.labId) {
    list = list.filter(item => item.labId === filters.labId);
  }

  if (filters.status && filters.status !== 'all') {
    if (filters.status === 'using') {
      list = list.filter(item => item.status === 'checked_in');
    } else if (filters.status === 'completed') {
      list = list.filter(item => item.status === 'checked_out' || item.status === 'violation');
    } else {
      list = list.filter(item => item.status === filters.status);
    }
  }

  return list.sort((a, b) => b.createTime - a.createTime);
}

function getLabAppointmentDetail(appointmentId) {
  initLabAppointments();
  const list = storage.getList(STORAGE_KEYS.LAB_APPOINTMENT_LIST);
  const appointment = list.find(item => item.id === appointmentId) || null;

  if (appointment) {
    const lab = getLabDetail(appointment.labId);
    const statusInfo = constants.LAB_APPOINTMENT_STATUS_MAP[appointment.status] || {};
    return {
      ...appointment,
      labName: lab ? lab.name : '',
      labType: lab ? lab.type : '',
      building: lab ? lab.building : '',
      room: lab ? lab.room : '',
      statusLabel: statusInfo.label,
      statusColor: statusInfo.color,
      statusIcon: statusInfo.icon
    };
  }
  return null;
}

function createLabAppointment(data) {
  initLabAppointments();
  const appointments = storage.get(STORAGE_KEYS.LAB_APPOINTMENT_LIST) || [];
  const now = Date.now();

  const appointment = {
    id: 'lab_appt_' + now,
    ...data,
    status: 'pending',
    checkInTime: null,
    checkOutTime: null,
    approvalTime: null,
    approverId: null,
    approvalRemark: '',
    createTime: now,
    updateTime: now
  };

  appointments.push(appointment);
  storage.set(STORAGE_KEYS.LAB_APPOINTMENT_LIST, appointments);

  return appointment;
}

function cancelLabAppointment(appointmentId, userId) {
  initLabAppointments();
  const appointments = storage.get(STORAGE_KEYS.LAB_APPOINTMENT_LIST) || [];
  const index = appointments.findIndex(item => item.id === appointmentId);

  if (index > -1) {
    if (appointments[index].userId !== userId) {
      return { success: false, message: '无权取消此预约' };
    }
    if (appointments[index].status !== 'pending' && appointments[index].status !== 'approved') {
      return { success: false, message: '当前状态不可取消' };
    }

    appointments[index].status = 'cancelled';
    appointments[index].updateTime = Date.now();
    storage.set(STORAGE_KEYS.LAB_APPOINTMENT_LIST, appointments);
    return { success: true, appointment: appointments[index] };
  }

  return { success: false, message: '预约不存在' };
}

function approveLabAppointment(appointmentId, approverId, remark = '') {
  initLabAppointments();
  const appointments = storage.get(STORAGE_KEYS.LAB_APPOINTMENT_LIST) || [];
  const index = appointments.findIndex(item => item.id === appointmentId);

  if (index > -1) {
    if (appointments[index].status !== 'pending') {
      return { success: false, message: '当前状态不可审批' };
    }

    appointments[index].status = 'approved';
    appointments[index].approvalTime = Date.now();
    appointments[index].approverId = approverId;
    appointments[index].approvalRemark = remark;
    appointments[index].updateTime = Date.now();
    storage.set(STORAGE_KEYS.LAB_APPOINTMENT_LIST, appointments);
    return { success: true, appointment: appointments[index] };
  }

  return { success: false, message: '预约不存在' };
}

function rejectLabAppointment(appointmentId, approverId, remark = '') {
  initLabAppointments();
  const appointments = storage.get(STORAGE_KEYS.LAB_APPOINTMENT_LIST) || [];
  const index = appointments.findIndex(item => item.id === appointmentId);

  if (index > -1) {
    if (appointments[index].status !== 'pending') {
      return { success: false, message: '当前状态不可审批' };
    }

    appointments[index].status = 'rejected';
    appointments[index].approvalTime = Date.now();
    appointments[index].approverId = approverId;
    appointments[index].approvalRemark = remark;
    appointments[index].updateTime = Date.now();
    storage.set(STORAGE_KEYS.LAB_APPOINTMENT_LIST, appointments);
    return { success: true, appointment: appointments[index] };
  }

  return { success: false, message: '预约不存在' };
}

function checkInLab(appointmentId, userId) {
  initLabAppointments();
  const appointments = storage.get(STORAGE_KEYS.LAB_APPOINTMENT_LIST) || [];
  const index = appointments.findIndex(item => item.id === appointmentId);

  if (index > -1) {
    if (appointments[index].userId !== userId) {
      return { success: false, message: '无权操作此预约' };
    }
    if (appointments[index].status !== 'approved') {
      return { success: false, message: '当前状态不可签到' };
    }

    appointments[index].status = 'checked_in';
    appointments[index].checkInTime = Date.now();
    appointments[index].updateTime = Date.now();
    storage.set(STORAGE_KEYS.LAB_APPOINTMENT_LIST, appointments);
    return { success: true, appointment: appointments[index] };
  }

  return { success: false, message: '预约不存在' };
}

function checkOutLab(appointmentId, userId) {
  initLabAppointments();
  const userService = require('./userService');
  const appointments = storage.get(STORAGE_KEYS.LAB_APPOINTMENT_LIST) || [];
  const index = appointments.findIndex(item => item.id === appointmentId);

  if (index > -1) {
    if (appointments[index].userId !== userId) {
      return { success: false, message: '无权操作此预约' };
    }
    if (appointments[index].status !== 'checked_in') {
      return { success: false, message: '当前状态不可签退' };
    }

    const appointment = appointments[index];
    const lab = getLabDetail(appointment.labId);

    const isViolation = checkLabViolation(appointment, lab);

    appointments[index].status = isViolation ? 'violation' : 'checked_out';
    appointments[index].checkOutTime = Date.now();
    appointments[index].updateTime = Date.now();

    if (isViolation) {
      appointments[index].violationType = 'late_return';
      appointments[index].violationDesc = '未按时归还/签退';

      const violationRecord = {
        id: 'lab_violation_' + Date.now(),
        userId: appointment.userId,
        appointmentId: appointment.id,
        labId: appointment.labId,
        type: 'late_return',
        description: '未按时归还/签退',
        scoreChange: -5,
        createTime: Date.now()
      };

      const violations = storage.get(STORAGE_KEYS.LAB_VIOLATION_RECORDS) || [];
      violations.push(violationRecord);
      storage.set(STORAGE_KEYS.LAB_VIOLATION_RECORDS, violations);

      userService.updateCreditScore(appointment.userId, -5, 'violation', {
        reason: '实验室预约超时未签退',
        appointmentId: appointment.id
      });
    }

    storage.set(STORAGE_KEYS.LAB_APPOINTMENT_LIST, appointments);
    return {
      success: true,
      appointment: appointments[index],
      isViolation: isViolation
    };
  }

  return { success: false, message: '预约不存在' };
}

function checkLabViolation(appointment, lab) {
  if (!appointment || !lab) return false;

  const timeSlot = appointment.timeSlot;
  if (!timeSlot) return false;

  const timeParts = timeSlot.split('-');
  if (timeParts.length !== 2) return false;

  const endTimeStr = timeParts[1];
  const endTimeParts = endTimeStr.split(':');
  const endHour = parseInt(endTimeParts[0]);
  const endMinute = parseInt(endTimeParts[1]);

  const appointmentDate = new Date(appointment.appointmentDate);
  const endDateTime = new Date(appointmentDate);
  endDateTime.setHours(endHour, endMinute, 0, 0);

  const now = Date.now();
  const bufferTime = 10 * 60 * 1000;

  return now > endDateTime.getTime() + bufferTime;
}

function getLabSafetyTrainingStatus(userId, labType) {
  const trainingData = storage.get(STORAGE_KEYS.LAB_SAFETY_TRAINING) || {};
  const userTraining = trainingData[userId] || {};

  if (labType) {
    return userTraining[labType] || { passed: false, passTime: null };
  }

  return userTraining;
}

function setLabSafetyTrainingPassed(userId, labType) {
  const trainingData = storage.get(STORAGE_KEYS.LAB_SAFETY_TRAINING) || {};
  if (!trainingData[userId]) {
    trainingData[userId] = {};
  }

  trainingData[userId][labType] = {
    passed: true,
    passTime: Date.now()
  };

  storage.set(STORAGE_KEYS.LAB_SAFETY_TRAINING, trainingData);
  return trainingData[userId][labType];
}

function canBookLab(userId, lab) {
  if (!userId || !lab) return { canBook: false, reason: '参数错误' };

  const safetyLevel = lab.safetyLevel;
  const levelNumber = parseInt(safetyLevel.replace('level', ''));

  if (levelNumber <= 2) {
    return { canBook: true, reason: '' };
  }

  const trainingStatus = getLabSafetyTrainingStatus(userId, lab.type);
  if (trainingStatus && trainingStatus.passed) {
    return { canBook: true, reason: '' };
  }

  return {
    canBook: false,
    reason: `需通过${constants.LAB_SAFETY_LEVEL_MAP[safetyLevel]?.label || ''}安全培训`,
    needTraining: true,
    labType: lab.type
  };
}

function getLabViolationRecords(userId) {
  const records = storage.get(STORAGE_KEYS.LAB_VIOLATION_RECORDS) || [];
  if (userId) {
    return records.filter(r => r.userId === userId).sort((a, b) => b.createTime - a.createTime);
  }
  return records.sort((a, b) => b.createTime - a.createTime);
}

function getLabTimeSlotCapacity(labId, date, timeSlot) {
  const appointments = getLabAppointmentList({
    labId,
    status: 'all'
  }).filter(a =>
    a.appointmentDate === date &&
    a.timeSlot === timeSlot &&
    (a.status === 'pending' || a.status === 'approved' || a.status === 'checked_in')
  );

  const lab = getLabDetail(labId);
  const capacity = lab ? lab.capacity : 0;
  const used = appointments.length;

  return {
    capacity,
    used,
    available: Math.max(0, capacity - used)
  };
}

// ==================== 场馆预约模块 ====================

let venuesInitialized = false;
let venueAppointmentsInitialized = false;

function initVenueData() {
  if (venuesInitialized) return;
  const existing = storage.get(STORAGE_KEYS.VENUE_LIST);
  if (!existing || existing.length === 0) {
    const venues = constants.MOCK_VENUES.map((item, index) => ({
      ...item,
      createTime: Date.now() - index * 86400000,
      updateTime: Date.now() - index * 86400000
    }));
    storage.set(STORAGE_KEYS.VENUE_LIST, venues);
  }
  venuesInitialized = true;
}

function initVenueAppointments() {
  if (venueAppointmentsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.VENUE_APPOINTMENT_LIST);
  if (!existing || existing.length === 0) {
    storage.set(STORAGE_KEYS.VENUE_APPOINTMENT_LIST, []);
  }
  venueAppointmentsInitialized = true;
}

function getVenueList(filters = {}) {
  initVenueData();
  let list = storage.getList(STORAGE_KEYS.VENUE_LIST);

  if (filters.type && filters.type !== 'all') {
    list = list.filter(item => item.type === filters.type);
  }

  if (filters.keyword) {
    const keywordLower = filters.keyword.toLowerCase();
    list = list.filter(item =>
      item.name.toLowerCase().includes(keywordLower) ||
      item.building.toLowerCase().includes(keywordLower) ||
      item.description.toLowerCase().includes(keywordLower)
    );
  }

  return list;
}

function getVenueDetail(venueId) {
  initVenueData();
  const list = storage.getList(STORAGE_KEYS.VENUE_LIST);
  const venue = list.find(item => item.id === venueId) || null;
  if (venue) {
    const typeInfo = constants.VENUE_TYPES.find(t => t.value === venue.type) || {};
    return {
      ...venue,
      typeIcon: typeInfo.icon || '🏟️',
      typeLabel: typeInfo.label || '其他'
    };
  }
  return null;
}

function getVenueAppointmentList(filters = {}) {
  initVenueAppointments();
  let list = storage.getList(STORAGE_KEYS.VENUE_APPOINTMENT_LIST);

  if (filters.userId) {
    list = list.filter(item => item.userId === filters.userId);
  }

  if (filters.venueId) {
    list = list.filter(item => item.venueId === filters.venueId);
  }

  if (filters.status && filters.status !== 'all') {
    if (filters.status === 'using') {
      list = list.filter(item => item.status === 'checked_in');
    } else if (filters.status === 'completed') {
      list = list.filter(item => item.status === 'checked_out' || item.status === 'violation');
    } else {
      list = list.filter(item => item.status === filters.status);
    }
  }

  list = list.map(appt => {
    const venue = getVenueDetail(appt.venueId);
    const statusInfo = constants.VENUE_APPOINTMENT_STATUS_MAP[appt.status] || {};
    const typeInfo = venue ? (constants.VENUE_TYPES.find(t => t.value === venue.type) || {}) : {};
    return {
      ...appt,
      venueName: venue ? venue.name : '',
      venueTypeIcon: typeInfo.icon || '',
      venueTypeLabel: typeInfo.label || '',
      statusLabel: statusInfo.label,
      statusColor: statusInfo.color,
      statusIcon: statusInfo.icon
    };
  });

  return list.sort((a, b) => b.createTime - a.createTime);
}

function getVenueAppointmentDetail(appointmentId) {
  initVenueAppointments();
  const list = storage.getList(STORAGE_KEYS.VENUE_APPOINTMENT_LIST);
  const appointment = list.find(item => item.id === appointmentId) || null;

  if (appointment) {
    const venue = getVenueDetail(appointment.venueId);
    const statusInfo = constants.VENUE_APPOINTMENT_STATUS_MAP[appointment.status] || {};
    const typeInfo = venue ? (constants.VENUE_TYPES.find(t => t.value === venue.type) || {}) : {};
    const price = appointment.isStudent ? (venue ? venue.studentPrice : 0) : (venue ? venue.normalPrice : 0);
    const totalPrice = price * appointment.slotCount;

    return {
      ...appointment,
      venueName: venue ? venue.name : '',
      venueType: venue ? venue.type : '',
      venueTypeIcon: typeInfo.icon || '',
      venueTypeLabel: typeInfo.label || '',
      building: venue ? venue.building : '',
      room: venue ? venue.room : '',
      statusLabel: statusInfo.label,
      statusColor: statusInfo.color,
      statusIcon: statusInfo.icon,
      unitPrice: price,
      totalPrice: totalPrice,
      totalAmount: appointment.totalAmount !== undefined ? appointment.totalAmount : totalPrice,
      venueCover: venue ? venue.cover : ''
    };
  }
  return null;
}

function createVenueAppointment(data) {
  initVenueAppointments();
  const appointments = storage.get(STORAGE_KEYS.VENUE_APPOINTMENT_LIST) || [];
  const venue = getVenueDetail(data.venueId);
  const now = Date.now();

  const slotCount = Array.isArray(data.timeSlots) ? data.timeSlots.length : 1;
  const timeSlotStr = Array.isArray(data.timeSlots) ? data.timeSlots.join(',') : data.timeSlot;
  const isStudent = data.isStudent !== undefined ? data.isStudent : true;
  const unitPrice = venue ? (isStudent ? venue.studentPrice : venue.normalPrice) : 0;
  const totalAmount = unitPrice * slotCount;

  const appointment = {
    id: 'venue_appt_' + now,
    ...data,
    timeSlot: timeSlotStr,
    timeSlots: Array.isArray(data.timeSlots) ? data.timeSlots : [data.timeSlot],
    slotCount: slotCount,
    status: venue && venue.needApproval ? 'pending' : 'approved',
    checkInTime: null,
    checkOutTime: null,
    approvalTime: venue && venue.needApproval ? null : now,
    approverId: venue && venue.needApproval ? null : 'system_auto',
    approvalRemark: venue && venue.needApproval ? '' : '系统自动审批通过',
    isStudent: isStudent,
    unitPrice: unitPrice,
    totalAmount: totalAmount,
    actualFee: 0,
    overtimeFee: 0,
    violationType: null,
    violationDesc: null,
    createTime: now,
    updateTime: now
  };

  appointments.push(appointment);
  storage.set(STORAGE_KEYS.VENUE_APPOINTMENT_LIST, appointments);

  return appointment;
}

function cancelVenueAppointment(appointmentId, userId) {
  initVenueAppointments();
  const appointments = storage.get(STORAGE_KEYS.VENUE_APPOINTMENT_LIST) || [];
  const index = appointments.findIndex(item => item.id === appointmentId);

  if (index > -1) {
    if (appointments[index].userId !== userId) {
      return { success: false, message: '无权取消此预约' };
    }
    if (appointments[index].status !== 'pending' && appointments[index].status !== 'approved') {
      return { success: false, message: '当前状态不可取消' };
    }

    appointments[index].status = 'cancelled';
    appointments[index].updateTime = Date.now();
    storage.set(STORAGE_KEYS.VENUE_APPOINTMENT_LIST, appointments);
    return { success: true, appointment: appointments[index] };
  }

  return { success: false, message: '预约不存在' };
}

function approveVenueAppointment(appointmentId, approverId, remark = '') {
  initVenueAppointments();
  const appointments = storage.get(STORAGE_KEYS.VENUE_APPOINTMENT_LIST) || [];
  const index = appointments.findIndex(item => item.id === appointmentId);

  if (index > -1) {
    if (appointments[index].status !== 'pending') {
      return { success: false, message: '当前状态不可审批' };
    }

    appointments[index].status = 'approved';
    appointments[index].approvalTime = Date.now();
    appointments[index].approverId = approverId;
    appointments[index].approvalRemark = remark;
    appointments[index].updateTime = Date.now();
    storage.set(STORAGE_KEYS.VENUE_APPOINTMENT_LIST, appointments);
    return { success: true, appointment: appointments[index] };
  }

  return { success: false, message: '预约不存在' };
}

function rejectVenueAppointment(appointmentId, approverId, remark = '') {
  initVenueAppointments();
  const appointments = storage.get(STORAGE_KEYS.VENUE_APPOINTMENT_LIST) || [];
  const index = appointments.findIndex(item => item.id === appointmentId);

  if (index > -1) {
    if (appointments[index].status !== 'pending') {
      return { success: false, message: '当前状态不可审批' };
    }

    appointments[index].status = 'rejected';
    appointments[index].approvalTime = Date.now();
    appointments[index].approverId = approverId;
    appointments[index].approvalRemark = remark;
    appointments[index].updateTime = Date.now();
    storage.set(STORAGE_KEYS.VENUE_APPOINTMENT_LIST, appointments);
    return { success: true, appointment: appointments[index] };
  }

  return { success: false, message: '预约不存在' };
}

function checkInVenue(appointmentId, userId) {
  initVenueAppointments();
  const appointments = storage.get(STORAGE_KEYS.VENUE_APPOINTMENT_LIST) || [];
  const index = appointments.findIndex(item => item.id === appointmentId);

  if (index > -1) {
    if (appointments[index].userId !== userId) {
      return { success: false, message: '无权操作此预约' };
    }
    if (appointments[index].status !== 'approved') {
      return { success: false, message: '当前状态不可签到' };
    }

    appointments[index].status = 'checked_in';
    appointments[index].checkInTime = Date.now();
    appointments[index].updateTime = Date.now();
    storage.set(STORAGE_KEYS.VENUE_APPOINTMENT_LIST, appointments);
    return { success: true, appointment: appointments[index] };
  }

  return { success: false, message: '预约不存在' };
}

function checkOutVenue(appointmentId, userId) {
  initVenueAppointments();
  const userService = require('./userService');
  const appointments = storage.get(STORAGE_KEYS.VENUE_APPOINTMENT_LIST) || [];
  const index = appointments.findIndex(item => item.id === appointmentId);

  if (index > -1) {
    if (appointments[index].userId !== userId) {
      return { success: false, message: '无权操作此预约' };
    }
    if (appointments[index].status !== 'checked_in') {
      return { success: false, message: '当前状态不可签退' };
    }

    const appointment = appointments[index];
    const venue = getVenueDetail(appointment.venueId);

    const result = checkVenueViolation(appointment, venue);

    appointments[index].status = result.isViolation ? 'violation' : 'checked_out';
    appointments[index].checkOutTime = Date.now();
    appointments[index].actualFee = result.actualFee;
    appointments[index].overtimeFee = result.overtimeFee;
    appointments[index].updateTime = Date.now();

    if (result.isViolation) {
      appointments[index].violationType = result.violationType;
      appointments[index].violationDesc = result.violationDesc;

      const violationRecord = {
        id: 'venue_violation_' + Date.now(),
        userId: appointment.userId,
        appointmentId: appointment.id,
        venueId: appointment.venueId,
        type: result.violationType,
        description: result.violationDesc,
        fee: result.overtimeFee,
        createTime: Date.now()
      };

      const violations = storage.get(STORAGE_KEYS.VENUE_VIOLATION_RECORDS) || [];
      violations.push(violationRecord);
      storage.set(STORAGE_KEYS.VENUE_VIOLATION_RECORDS, violations);

      const violationInfo = constants.VENUE_VIOLATION_TYPES_MAP[result.violationType] || {};
      if (violationInfo.score) {
        userService.updateCreditScore(
          appointment.userId,
          violationInfo.score,
          `场馆预约违约：${violationInfo.label}`
        );
      }
    }

    storage.set(STORAGE_KEYS.VENUE_APPOINTMENT_LIST, appointments);
    return {
      success: true,
      appointment: appointments[index],
      isViolation: result.isViolation,
      violationType: result.violationType,
      actualFee: result.actualFee,
      overtimeFee: result.overtimeFee
    };
  }

  return { success: false, message: '预约不存在' };
}

function checkVenueViolation(appointment, venue) {
  if (!appointment || !venue || !appointment.checkInTime) {
    return { isViolation: false, actualFee: 0, overtimeFee: 0 };
  }

  const now = Date.now();
  const timeSlots = appointment.timeSlots || [];
  const slotCount = timeSlots.length;
  const unitPrice = appointment.isStudent ? venue.studentPrice : venue.normalPrice;
  const baseFee = unitPrice * slotCount;

  const lastSlot = timeSlots[timeSlots.length - 1];
  const slotInfo = constants.VENUE_TIME_SLOTS.find(s => s.value === lastSlot);

  if (!slotInfo) {
    return { isViolation: false, actualFee: baseFee, overtimeFee: 0 };
  }

  const appointmentDate = appointment.appointmentDate;
  const [year, month, day] = appointmentDate.split('-').map(Number);
  const endHour = Math.floor(slotInfo.endMinute / 60);
  const endMinute = slotInfo.endMinute % 60;
  const scheduledEndTime = new Date(year, month - 1, day, endHour, endMinute, 0).getTime();

  const overtimeMs = now - scheduledEndTime;
  const overtimeMinutes = Math.floor(overtimeMs / 60000);

  if (overtimeMinutes > 15) {
    const overtimeHours = Math.ceil((overtimeMinutes - 15) / 60);
    const overtimeFee = overtimeHours * unitPrice * 1.5;
    const violationInfo = constants.VENUE_VIOLATION_TYPES_MAP.late_checkout || {};

    return {
      isViolation: true,
      violationType: 'late_checkout',
      violationDesc: `超时${overtimeMinutes}分钟签退，超时费用${overtimeFee.toFixed(2)}元`,
      actualFee: baseFee + overtimeFee,
      overtimeFee: overtimeFee
    };
  }

  return {
    isViolation: false,
    actualFee: baseFee,
    overtimeFee: 0
  };
}

function canBookVenue(userId, venue) {
  if (!userId) {
    return { canBook: false, reason: '请先登录' };
  }

  if (!venue) {
    return { canBook: false, reason: '场馆不存在' };
  }

  const userService = require('./userService');
  const user = userService.getUserById(userId);
  if (!user) {
    return { canBook: false, reason: '用户不存在' };
  }

  if (user.creditScore < 60) {
    return { canBook: false, reason: '信用分不足60分，无法预约' };
  }

  const activeAppointments = getVenueAppointmentList({
    userId,
    status: 'approved'
  });

  if (activeAppointments.length >= 3) {
    return { canBook: false, reason: '已有3个待使用预约，请先使用后再预约' };
  }

  return { canBook: true, reason: '' };
}

function getVenueViolationRecords(userId) {
  const records = storage.get(STORAGE_KEYS.VENUE_VIOLATION_RECORDS) || [];
  if (userId) {
    return records.filter(r => r.userId === userId).sort((a, b) => b.createTime - a.createTime);
  }
  return records.sort((a, b) => b.createTime - a.createTime);
}

function getVenueTimeSlotCapacity(venueId, date, timeSlot) {
  const appointments = getVenueAppointmentList({
    venueId,
    status: 'all'
  }).filter(a =>
    a.appointmentDate === date &&
    (a.timeSlots || []).includes(timeSlot) &&
    (a.status === 'pending' || a.status === 'approved' || a.status === 'checked_in')
  );

  const venue = getVenueDetail(venueId);
  const capacity = venue ? venue.capacity : 0;
  const used = appointments.length;

  return {
    capacity,
    used,
    available: Math.max(0, capacity - used)
  };
}

function getVenueDateSlotsInfo(venueId, date) {
  const venue = getVenueDetail(venueId);
  if (!venue) return [];

  const openSlots = venue.openTimeSlots || [];
  const result = [];

  openSlots.forEach(slotValue => {
    const slotInfo = constants.VENUE_TIME_SLOTS.find(s => s.value === slotValue);
    if (slotInfo) {
      const capacityInfo = getVenueTimeSlotCapacity(venueId, date, slotValue);
      result.push({
        ...slotInfo,
        capacity: capacityInfo.capacity,
        used: capacityInfo.used,
        available: capacityInfo.available,
        isAvailable: capacityInfo.available > 0
      });
    }
  });

  return result;
}

// ==================== 选课助手模块 ====================

let trainingPlanInitialized = false;
let trainingPlanCoursesInitialized = false;
let courseReviewsInitialized = false;
let selectedCoursesInitialized = false;

function initTrainingPlanData() {
  if (trainingPlanInitialized) return;
  const existing = storage.get(STORAGE_KEYS.TRAINING_PLAN_LIST);
  if (!existing || existing.length === 0) {
    storage.set(STORAGE_KEYS.TRAINING_PLAN_LIST, [...mockData.MOCK_TRAINING_PLANS]);
  }
  trainingPlanInitialized = true;
}

function initTrainingPlanCourses() {
  if (trainingPlanCoursesInitialized) return;
  const existing = storage.get(STORAGE_KEYS.TRAINING_PLAN_COURSES);
  if (!existing || existing.length === 0) {
    storage.set(STORAGE_KEYS.TRAINING_PLAN_COURSES, [...mockData.MOCK_TRAINING_PLAN_COURSES]);
  }
  trainingPlanCoursesInitialized = true;
}

function initCourseReviews() {
  if (courseReviewsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.COURSE_REVIEWS);
  if (!existing || existing.length === 0) {
    storage.set(STORAGE_KEYS.COURSE_REVIEWS, [...mockData.MOCK_COURSE_REVIEWS]);
  }
  courseReviewsInitialized = true;
}

function initSelectedCourses() {
  if (selectedCoursesInitialized) return;
  const existing = storage.get(STORAGE_KEYS.SELECTED_COURSES);
  if (!existing) {
    storage.set(STORAGE_KEYS.SELECTED_COURSES, []);
  }
  selectedCoursesInitialized = true;
}

function initCourseAssistantData() {
  initTrainingPlanData();
  initTrainingPlanCourses();
  initCourseReviews();
  initSelectedCourses();
}

function getTrainingPlanList() {
  initTrainingPlanData();
  return storage.getList(STORAGE_KEYS.TRAINING_PLAN_LIST);
}

function getTrainingPlanDetail(planId) {
  initTrainingPlanData();
  const list = storage.getList(STORAGE_KEYS.TRAINING_PLAN_LIST);
  return list.find(item => item.id === planId) || null;
}

function getTrainingPlanCourses(filters = {}) {
  initTrainingPlanCourses();
  let list = storage.getList(STORAGE_KEYS.TRAINING_PLAN_COURSES);

  if (filters.planId) {
    list = list.filter(item => item.planId === filters.planId);
  }
  if (filters.semester) {
    list = list.filter(item => item.semester === filters.semester);
  }
  if (filters.type) {
    list = list.filter(item => item.type === filters.type);
  }
  if (filters.status) {
    list = list.filter(item => item.status === filters.status);
  }
  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['name', 'courseCode', 'teacher']);
  }

  return list.sort((a, b) => {
    if (a.semester !== b.semester) return a.semester.localeCompare(b.semester);
    if (a.type !== b.type) {
      const typeOrder = { required: 0, major: 1, elective: 2, general: 3, practice: 4 };
      return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
    }
    return a.courseCode.localeCompare(b.courseCode);
  });
}

function getTrainingPlanCourseDetail(id) {
  initTrainingPlanCourses();
  const list = storage.getList(STORAGE_KEYS.TRAINING_PLAN_COURSES);
  return list.find(item => item.id === id) || null;
}

function getTrainingPlanCourseByCode(courseCode) {
  initTrainingPlanCourses();
  const list = storage.getList(STORAGE_KEYS.TRAINING_PLAN_COURSES);
  return list.find(item => item.courseCode === courseCode) || null;
}

function updateTrainingPlanCourseStatus(id, status, score = null) {
  initTrainingPlanCourses();
  const updates = { status };
  if (score !== null) {
    updates.score = score;
  }
  return storage.updateInList(STORAGE_KEYS.TRAINING_PLAN_COURSES, id, updates);
}

function calculateTrainingPlanProgress(planId) {
  const courses = getTrainingPlanCourses({ planId });
  const plan = getTrainingPlanDetail(planId);

  const result = {
    totalCourses: courses.length,
    completedCourses: 0,
    studyingCourses: 0,
    pendingCourses: 0,
    failedCourses: 0,
    totalCredits: plan ? plan.totalCredits : 0,
    earnedCredits: 0,
    requiredCredits: plan ? plan.requiredCredits : 0,
    earnedRequiredCredits: 0,
    electiveCredits: plan ? plan.electiveCredits : 0,
    earnedElectiveCredits: 0,
    generalCredits: 0,
    earnedGeneralCredits: 0,
    majorCredits: 0,
    earnedMajorCredits: 0,
    practiceCredits: 0,
    earnedPracticeCredits: 0
  };

  courses.forEach(course => {
    if (course.status === 'completed') {
      result.completedCourses++;
      result.earnedCredits += course.credit;
      if (course.type === 'required') {
        result.earnedRequiredCredits += course.credit;
      } else if (course.type === 'elective') {
        result.earnedElectiveCredits += course.credit;
      } else if (course.type === 'general') {
        result.earnedGeneralCredits += course.credit;
      } else if (course.type === 'major') {
        result.earnedMajorCredits += course.credit;
      } else if (course.type === 'practice') {
        result.earnedPracticeCredits += course.credit;
      }
    } else if (course.status === 'studying') {
      result.studyingCourses++;
    } else if (course.status === 'pending') {
      result.pendingCourses++;
    } else if (course.status === 'failed') {
      result.failedCourses++;
    }

    if (course.type === 'required') {
      result.requiredCredits += course.credit;
    } else if (course.type === 'general') {
      result.generalCredits += course.credit;
    } else if (course.type === 'major') {
      result.majorCredits += course.credit;
    } else if (course.type === 'practice') {
      result.practiceCredits += course.credit;
    }
  });

  result.progressPercent = result.totalCredits > 0
    ? Math.min(100, Math.round(result.earnedCredits / result.totalCredits * 100))
    : 0;

  return result;
}

function getSelectedCourses(filters = {}) {
  initSelectedCourses();
  let list = storage.getList(STORAGE_KEYS.SELECTED_COURSES);

  if (filters.semester) {
    list = list.filter(item => item.semester === filters.semester);
  }

  return list;
}

function getSelectedCourseById(id) {
  initSelectedCourses();
  const list = storage.getList(STORAGE_KEYS.SELECTED_COURSES);
  return list.find(item => item.id === id) || null;
}

function getSelectedCoursesBySemester(semester) {
  return getSelectedCourses({ semester });
}

function calculateSelectedCredits(semester) {
  const selected = getSelectedCoursesBySemester(semester);
  return selected.reduce((sum, item) => sum + item.credit, 0);
}

function checkTimeConflict(selectedCourses, newCourseClass) {
  if (!newCourseClass) return null;

  for (const selected of selectedCourses) {
    if (!selected.selectedClass) continue;

    if (selected.selectedClass.dayOfWeek === newCourseClass.dayOfWeek) {
      const selectedStart = selected.selectedClass.startSlot;
      const selectedEnd = selected.selectedClass.endSlot;
      const newStart = newCourseClass.startSlot;
      const newEnd = newCourseClass.endSlot;

      if (!(newEnd < selectedStart || newStart > selectedEnd)) {
        return {
          type: 'time',
          message: `与"${selected.name}"时间冲突`,
          conflictWith: selected,
          details: {
            day: newCourseClass.dayOfWeek,
            slots: `${Math.min(selectedStart, newStart)}-${Math.max(selectedEnd, newEnd)}节`
          }
        };
      }
    }
  }

  return null;
}

function checkPrerequisite(planCourses, course) {
  if (!course.prerequisites || course.prerequisites.length === 0) return null;

  const completedCourseCodes = planCourses
    .filter(c => c.status === 'completed')
    .map(c => c.courseCode);

  for (const prereq of course.prerequisites) {
    if (!completedCourseCodes.includes(prereq)) {
      const prereqCourse = planCourses.find(c => c.courseCode === prereq);
      return {
        type: 'prerequisite',
        message: `先修课程"${prereqCourse ? prereqCourse.name : prereq}"未完成`,
        prerequisite: prereq
      };
    }
  }

  return null;
}

function checkCreditLimit(semester, currentSelected, newCredit, maxCredits = constants.DEFAULT_MAX_CREDITS) {
  const currentCredits = currentSelected.reduce((sum, item) => sum + item.credit, 0);
  const totalAfterAdd = currentCredits + newCredit;

  if (totalAfterAdd > maxCredits) {
    return {
      type: 'credit',
      message: `学分超限：当前${currentCredits}学分，添加后${totalAfterAdd}学分，上限${maxCredits}学分`,
      details: {
        current: currentCredits,
        adding: newCredit,
        total: totalAfterAdd,
        limit: maxCredits
      }
    };
  }

  return null;
}

function checkAlreadyCompleted(course) {
  if (course.status === 'completed') {
    return {
      type: 'completed',
      message: `"${course.name}"已修完成，绩点${course.score ? (course.score >= 90 ? '4.0' : (course.score >= 85 ? '3.7' : '3.3')) : '—'}`
    };
  }
  return null;
}

function checkAllConflicts(planCourses, selectedCourses, course, selectedClass, semester, maxCredits) {
  const conflicts = [];

  const completedConflict = checkAlreadyCompleted(course);
  if (completedConflict) conflicts.push(completedConflict);

  const prereqConflict = checkPrerequisite(planCourses, course);
  if (prereqConflict) conflicts.push(prereqConflict);

  const timeConflict = checkTimeConflict(selectedCourses, selectedClass);
  if (timeConflict) conflicts.push(timeConflict);

  const creditConflict = checkCreditLimit(semester, selectedCourses, course.credit, maxCredits);
  if (creditConflict) conflicts.push(creditConflict);

  return {
    hasConflict: conflicts.length > 0,
    hasError: conflicts.some(c => c.type === 'time' || c.type === 'prerequisite'),
    hasWarning: conflicts.some(c => c.type === 'credit' || c.type === 'completed'),
    conflicts
  };
}

function addSelectedCourse(course, selectedClass, semester) {
  initSelectedCourses();
  const selectedCourses = getSelectedCourses();

  const existingIndex = selectedCourses.findIndex(item =>
    item.courseCode === course.courseCode && item.semester === semester
  );

  if (existingIndex > -1) {
    selectedCourses[existingIndex] = {
      ...selectedCourses[existingIndex],
      selectedClass,
      updateTime: Date.now()
    };
  } else {
    const colorIndex = Math.floor(Math.random() * constants.COURSE_COLORS.length);
    selectedCourses.push({
      id: util.generateId(),
      courseCode: course.courseCode,
      name: course.name,
      type: course.type,
      credit: course.credit,
      semester,
      selectedClass,
      colorIndex,
      description: course.description,
      teacher: selectedClass ? selectedClass.teacher : '',
      createTime: Date.now(),
      updateTime: Date.now()
    });
  }

  storage.set(STORAGE_KEYS.SELECTED_COURSES, selectedCourses);
  return true;
}

function removeSelectedCourse(id) {
  initSelectedCourses();
  return storage.removeFromList(STORAGE_KEYS.SELECTED_COURSES, id);
}

function clearSelectedCourses(semester) {
  initSelectedCourses();
  if (semester) {
    const list = storage.getList(STORAGE_KEYS.SELECTED_COURSES);
    const filtered = list.filter(item => item.semester !== semester);
    storage.set(STORAGE_KEYS.SELECTED_COURSES, filtered);
    return true;
  }
  return storage.set(STORAGE_KEYS.SELECTED_COURSES, []);
}

function getSelectedCoursesByWeek(semester) {
  const selected = getSelectedCoursesBySemester(semester);
  const result = {};

  for (let day = 1; day <= 7; day++) {
    result[day] = [];
    const slotMap = {};

    selected.forEach(course => {
      if (!course.selectedClass || course.selectedClass.dayOfWeek !== day) return;

      const color = constants.COURSE_COLORS[course.colorIndex % constants.COURSE_COLORS.length];
      const slotSpan = course.selectedClass.endSlot - course.selectedClass.startSlot + 1;
      const slotLabel = course.selectedClass.startSlot === course.selectedClass.endSlot
        ? `第${course.selectedClass.startSlot}节`
        : `第${course.selectedClass.startSlot}-${course.selectedClass.endSlot}节`;

      for (let s = course.selectedClass.startSlot; s <= course.selectedClass.endSlot; s++) {
        slotMap[s] = course.id;
      }

      result[day].push({
        ...course,
        color,
        slotSpan,
        slotLabel,
        topIndex: course.selectedClass.startSlot - 1,
        classroom: course.selectedClass.classroom,
        teacher: course.selectedClass.teacher,
        weeks: course.selectedClass.weeks
      });
    });

    result[day].slotMap = slotMap;
  }

  return result;
}

function syncSelectedToSchedule(semester) {
  const selected = getSelectedCoursesBySemester(semester);

  selected.forEach(course => {
    if (!course.selectedClass) return;

    const existingCourse = getCourseList().find(c =>
      c.name === course.name && c.semester === semester
    );

    if (!existingCourse) {
      addCourse({
        name: course.name,
        teacher: course.selectedClass.teacher,
        classroom: course.selectedClass.classroom,
        dayOfWeek: course.selectedClass.dayOfWeek,
        startSlot: course.selectedClass.startSlot,
        endSlot: course.selectedClass.endSlot,
        weeks: course.selectedClass.weeks,
        semester,
        colorIndex: course.colorIndex
      });
    }
  });

  return true;
}

function getCourseReviews(filters = {}) {
  initCourseReviews();
  let list = storage.getList(STORAGE_KEYS.COURSE_REVIEWS);

  if (filters.courseCode) {
    list = list.filter(item => item.courseCode === filters.courseCode);
  }
  if (filters.courseName) {
    list = list.filter(item => item.courseName.includes(filters.courseName));
  }
  if (filters.minRating) {
    list = list.filter(item => item.rating >= filters.minRating);
  }

  return list.sort((a, b) => b.createTime - a.createTime);
}

function getCourseReviewStats(courseCode) {
  const reviews = getCourseReviews({ courseCode });
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      avgRating: 0,
      avgDifficulty: 0,
      avgWorkload: 0,
      ratingDistribution: [0, 0, 0, 0, 0]
    };
  }

  const difficultyMap = { very_easy: 1, easy: 2, medium: 3, hard: 4, very_hard: 5 };
  const workloadMap = { very_light: 1, light: 2, medium: 3, heavy: 4, very_heavy: 5 };

  const totalReviews = reviews.length;
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  const avgDifficulty = reviews.reduce((sum, r) => sum + (difficultyMap[r.difficulty] || 3), 0) / totalReviews;
  const avgWorkload = reviews.reduce((sum, r) => sum + (workloadMap[r.workload] || 3), 0) / totalReviews;

  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach(r => {
    if (r.rating >= 1 && r.rating <= 5) {
      ratingDistribution[r.rating - 1]++;
    }
  });

  return {
    totalReviews,
    avgRating: Math.round(avgRating * 10) / 10,
    avgDifficulty: Math.round(avgDifficulty * 10) / 10,
    avgWorkload: Math.round(avgWorkload * 10) / 10,
    ratingDistribution
  };
}

function addCourseReview(reviewData) {
  initCourseReviews();
  const review = {
    id: util.generateId(),
    ...reviewData,
    createTime: Date.now(),
    likes: 0
  };
  return storage.addToList(STORAGE_KEYS.COURSE_REVIEWS, review);
}

function likeCourseReview(reviewId) {
  initCourseReviews();
  const list = storage.getList(STORAGE_KEYS.COURSE_REVIEWS);
  const index = list.findIndex(item => item.id === reviewId);
  if (index > -1) {
    list[index].likes = (list[index].likes || 0) + 1;
    storage.set(STORAGE_KEYS.COURSE_REVIEWS, list);
    return true;
  }
  return false;
}

function getForumCoursePosts(courseName) {
  if (!courseName) return [];
  const filters = { topic: 'course_selection', keyword: courseName };
  return getForumPostList(filters);
}

function getCourseAssistantSettings() {
  return storage.get(STORAGE_KEYS.COURSE_ASSISTANT_SETTINGS) || {
    maxCredits: constants.DEFAULT_MAX_CREDITS,
    minCredits: constants.DEFAULT_MIN_CREDITS,
    currentSemester: '3',
    currentPlanId: 'plan_cs_2024'
  };
}

function updateCourseAssistantSettings(updates) {
  const current = getCourseAssistantSettings();
  const newSettings = { ...current, ...updates };
  storage.set(STORAGE_KEYS.COURSE_ASSISTANT_SETTINGS, newSettings);
  return newSettings;
}

function importTrainingPlanCourses(courses, planId) {
  initTrainingPlanCourses();
  const existing = storage.getList(STORAGE_KEYS.TRAINING_PLAN_COURSES);
  const now = Date.now();

  const imported = courses.map((course, index) => ({
    id: 'imported_' + index + '_' + now,
    planId,
    status: 'pending',
    score: null,
    availableClasses: [],
    ...course
  }));

  const merged = [...existing, ...imported];
  storage.set(STORAGE_KEYS.TRAINING_PLAN_COURSES, merged);
  return imported;
}

function getSemesterOptions() {
  return [
    { value: '1', label: '第1学期' },
    { value: '2', label: '第2学期' },
    { value: '3', label: '第3学期' },
    { value: '4', label: '第4学期' },
    { value: '5', label: '第5学期' },
    { value: '6', label: '第6学期' },
    { value: '7', label: '第7学期' },
    { value: '8', label: '第8学期' }
  ];
}

function getCategoryOptions() {
  return [
    { value: 'all', label: '全部' },
    { value: 'required', label: '必修' },
    { value: 'major', label: '专业' },
    { value: 'elective', label: '选修' },
    { value: 'general', label: '通识' },
    { value: 'practice', label: '实践' }
  ];
}

// ==================== 关键词订阅 ====================

function getKeywordSubscriptions() {
  return storage.getList(STORAGE_KEYS.KEYWORD_SUBSCRIPTIONS);
}

function getKeywordSubscriptionById(id) {
  const list = getKeywordSubscriptions();
  return list.find(item => item.id === id) || null;
}

function addKeywordSubscription(keyword, modules = ['lost_found', 'market', 'forum']) {
  if (!keyword || !keyword.trim()) {
    return { success: false, message: '关键词不能为空' };
  }

  const trimmedKeyword = keyword.trim();
  const list = getKeywordSubscriptions();

  const existing = list.find(item =>
    item.keyword.toLowerCase() === trimmedKeyword.toLowerCase()
  );

  if (existing) {
    return { success: false, message: '该关键词已订阅' };
  }

  if (list.length >= 20) {
    return { success: false, message: '最多订阅20个关键词' };
  }

  const subscription = {
    id: util.generateId(),
    keyword: trimmedKeyword,
    modules: modules,
    enabled: true,
    createTime: Date.now(),
    updateTime: Date.now(),
    matchCount: 0,
    lastMatchTime: null
  };

  const success = storage.addToList(STORAGE_KEYS.KEYWORD_SUBSCRIPTIONS, subscription);
  return success
    ? { success: true, data: subscription }
    : { success: false, message: '订阅失败' };
}

function updateKeywordSubscription(id, updates) {
  const updateData = {
    ...updates,
    updateTime: Date.now()
  };
  const success = storage.updateInList(STORAGE_KEYS.KEYWORD_SUBSCRIPTIONS, id, updateData);
  return success;
}

function deleteKeywordSubscription(id) {
  return storage.removeFromList(STORAGE_KEYS.KEYWORD_SUBSCRIPTIONS, id);
}

function toggleKeywordSubscription(id) {
  const subscription = getKeywordSubscriptionById(id);
  if (!subscription) return false;
  return updateKeywordSubscription(id, { enabled: !subscription.enabled });
}

function getKeywordSubscriptionSettings() {
  const settings = storage.get(STORAGE_KEYS.KEYWORD_SUBSCRIPTION_SETTINGS);
  return { ...constants.DEFAULT_KEYWORD_SUBSCRIPTION_SETTINGS, ...(settings || {}) };
}

function updateKeywordSubscriptionSettings(updates) {
  const current = getKeywordSubscriptionSettings();
  const newSettings = { ...current, ...updates };
  return storage.set(STORAGE_KEYS.KEYWORD_SUBSCRIPTION_SETTINGS, newSettings);
}

function matchKeywordsInContent(content, moduleType) {
  if (!content) return [];

  const subscriptions = getKeywordSubscriptions().filter(s => s.enabled);
  const matches = [];
  const contentLower = content.toLowerCase();

  subscriptions.forEach(subscription => {
    if (!subscription.modules.includes(moduleType)) return;

    const keywordLower = subscription.keyword.toLowerCase();
    if (contentLower.includes(keywordLower)) {
      matches.push({
        subscriptionId: subscription.id,
        keyword: subscription.keyword,
        position: contentLower.indexOf(keywordLower)
      });
    }
  });

  return matches;
}

function recordKeywordNotification(subscriptionId, keyword, moduleType, contentId, title) {
  const log = storage.getList(STORAGE_KEYS.KEYWORD_NOTIFICATION_LOG);
  const today = new Date().toDateString();
  const todayCount = log.filter(l =>
    new Date(l.createTime).toDateString() === today
  ).length;

  const settings = getKeywordSubscriptionSettings();
  if (todayCount >= settings.maxDailyNotifications) {
    return null;
  }

  const existing = log.find(l =>
    l.subscriptionId === subscriptionId &&
    l.contentId === contentId &&
    l.moduleType === moduleType
  );

  if (existing) {
    return null;
  }

  const logEntry = {
    id: util.generateId(),
    subscriptionId,
    keyword,
    moduleType,
    contentId,
    title,
    createTime: Date.now()
  };

  storage.addToList(STORAGE_KEYS.KEYWORD_NOTIFICATION_LOG, logEntry);

  updateKeywordSubscription(subscriptionId, {
    matchCount: (getKeywordSubscriptionById(subscriptionId)?.matchCount || 0) + 1,
    lastMatchTime: Date.now()
  });

  return logEntry;
}

function isInDNDPeriod() {
  const settings = getKeywordSubscriptionSettings();
  if (!settings.dndEnabled) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startHour, startMin] = settings.dndStartTime.split(':').map(Number);
  const [endHour, endMin] = settings.dndEndTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
  } else {
    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
  }
}

function checkAndCreateKeywordNotification(content, title, moduleType, contentId) {
  const settings = getKeywordSubscriptionSettings();
  if (!settings.enabled) return [];

  if (isInDNDPeriod()) return [];

  const matches = matchKeywordsInContent(content + ' ' + title, moduleType);
  const notifications = [];

  matches.forEach(match => {
    const logEntry = recordKeywordNotification(
      match.subscriptionId,
      match.keyword,
      moduleType,
      contentId,
      title
    );

    if (logEntry) {
      const moduleLabels = {
        'lost_found': '失物招领',
        'market': '二手市场',
        'forum': '校园论坛'
      };

      const notification = createNotification({
        type: 'keyword',
        subType: 'keyword_alert',
        title: `关键词「${match.keyword}」有新内容`,
        content: `在${moduleLabels[moduleType]}中发现新的匹配内容：${title.substring(0, 50)}...`,
        data: {
          moduleType,
          contentId,
          keyword: match.keyword,
          matchPosition: match.position
        }
      });

      if (notification) {
        notifications.push(notification);
      }
    }
  });

  return notifications;
}

module.exports = {
  calculateDistance,
  paginateList,

  getLostFoundList,
  getLostFoundListPaged,
  getLostFoundDetail,
  publishLostFound,
  updateLostFound,
  deleteLostFound,
  getMyLostFoundList,

  getMarketList,
  getMarketListPaged,
  getMarketDetail,
  publishMarketItem,
  updateMarketItem,
  deleteMarketItem,
  increaseMarketViews,
  getMyMarketList,

  getMarketOffersByItem,
  getMarketOffersByUser,
  getMarketOfferDetail,
  createMarketOffer,
  acceptMarketOffer,
  rejectMarketOffer,
  counterMarketOffer,
  cancelMarketOffer,
  hasActiveOffer,
  getItemActiveOfferCount,
  checkAndUpdateExpiredOffers,

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
  getVisibleQuestions,
  canFillSurvey,
  canViewResult,
  getMyParticipatedSurveys,
  computeWordFrequency,
  generateSurveyCSV,
  getSurveyDashboardData,

  getVotingList,
  getVotingDetail,
  createVoting,
  updateVoting,
  deleteVoting,
  publishVotingResult,
  hasUserVoted,
  checkVotingEligibility,
  submitVote,
  getVotingRecords,
  getUserVotingRecord,
  getVotingStatistics,

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
  getStudyRewardsListPaged,
  getMyStudyRewards,
  getMyStudyRewardsPaged,
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
  getGuideCategories,
  getGuideList,
  searchGuides,
  getGuideDetail,
  getGuideFavorites,
  addGuideFavorite,
  removeGuideFavorite,
  isGuideFavorited,
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
  addEscrowLog,
  getEscrowLogByOrder,
  canDispute,
  getDisputeList,
  getDisputeDetail,
  createDispute,
  getArbitrationList,
  arbitrateDispute,
  getOrderDispute,
  getAddressList,
  getAddressDetail,
  addAddress,
  updateAddress,
  deleteAddress,
  getDefaultAddress,
  calculatePrintPrice,

  getExpressLockerList,
  getExpressLockerDetail,
  addExpressLockerCode,
  updateExpressLockerCode,
  markAsPicked,
  deleteExpressLockerCode,
  getExpiringSoonCount,

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

  createViewingAppointment,
  getViewingAppointmentList,
  getViewingAppointmentDetail,
  updateViewingAppointment,
  confirmViewingAppointment,
  rejectViewingAppointment,
  rescheduleViewingAppointment,
  cancelViewingAppointment,
  completeViewingAppointment,
  checkInViewing,
  verifyCheckInCode,
  getViewingCheckins,
  hasPendingAppointment,

  getContractChecklist,
  saveContractChecklist,
  toggleContractCheckItem,
  updateContractCheckNote,
  resetContractChecklist,
  getContractCheckProgress,

  getCarpoolList,
  getCarpoolDetail,
  publishCarpool,
  updateCarpool,
  deleteCarpool,
  increaseCarpoolViews,
  joinCarpool,
  confirmCarpoolMember,
  leaveCarpool,
  removeCarpoolMember,
  updateCarpoolStatus,
  buildSeatMap,
  updateSeatMap,
  scheduleDepartureReminder,
  checkAndTriggerDepartureReminders,

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
  isClubAdmin,
  isClubPresident,
  getClubJoinRequests,
  getPendingJoinRequestCount,
  submitJoinRequest,
  approveJoinRequest,
  rejectJoinRequest,
  removeClubMember,
  updateMemberRole,
  updateClubInfo,
  getClubAnnouncements,
  publishClubAnnouncement,
  deleteClubAnnouncement,
  getClubStats,
  updateActivity,
  getActivityDetail,
  exportCheckinData,
  scanCheckin,

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
  getAlumniProfileList,

  initTakeoutData,
  getTakeoutMerchantList,
  getTakeoutMerchantDetail,
  toggleFavoriteTakeoutMerchant,
  isFavoriteTakeoutMerchant,
  getFavoriteTakeoutMerchants,
  getTakeoutPromotionBanners,
  getTodayAllDiscounts,

  // ==================== 毕业离校 ====================
  initGraduationChecklist,
  getGraduationChecklist,
  updateGraduationItemStatus,
  getGraduationProgress,
  adminSignGraduationItem,
  getAllGraduationChecklists,
  getGraduationCertificate,
  generateGraduationCertificate,

  // ==================== 实验室/设备预约 ====================
  initLabData,
  getLabList,
  getLabDetail,
  getLabAppointmentList,
  getLabAppointmentDetail,
  createLabAppointment,
  cancelLabAppointment,
  approveLabAppointment,
  rejectLabAppointment,
  checkInLab,
  checkOutLab,
  getLabSafetyTrainingStatus,
  setLabSafetyTrainingPassed,
  canBookLab,
  getLabViolationRecords,
  getLabTimeSlotCapacity,

  // ==================== 场馆预约模块 ====================
  initVenueData,
  getVenueList,
  getVenueDetail,
  getVenueAppointmentList,
  getVenueAppointmentDetail,
  createVenueAppointment,
  cancelVenueAppointment,
  approveVenueAppointment,
  rejectVenueAppointment,
  checkInVenue,
  checkOutVenue,
  canBookVenue,
  getVenueViolationRecords,
  getVenueTimeSlotCapacity,
  getVenueDateSlotsInfo,

  // ==================== 选课助手模块 ====================
  initCourseAssistantData,
  getTrainingPlanList,
  getTrainingPlanDetail,
  getTrainingPlanCourses,
  getTrainingPlanCourseDetail,
  getTrainingPlanCourseByCode,
  updateTrainingPlanCourseStatus,
  calculateTrainingPlanProgress,
  getSelectedCourses,
  getSelectedCourseById,
  getSelectedCoursesBySemester,
  calculateSelectedCredits,
  checkTimeConflict,
  checkPrerequisite,
  checkCreditLimit,
  checkAlreadyCompleted,
  checkAllConflicts,
  addSelectedCourse,
  removeSelectedCourse,
  clearSelectedCourses,
  getSelectedCoursesByWeek,
  syncSelectedToSchedule,
  getCourseReviews,
  getCourseReviewStats,
  addCourseReview,
  likeCourseReview,
  getForumCoursePosts,
  getCourseAssistantSettings,
  updateCourseAssistantSettings,
  importTrainingPlanCourses,
  getSemesterOptions,
  getCategoryOptions,

  initScholarshipData,
  getScholarshipPolicyList,
  getScholarshipPolicyDetail,
  getScholarshipUserProfile,
  getMatchedScholarships,
  getScholarshipApplicationList,
  getScholarshipApplicationDetail,
  createScholarshipApplication,
  getScholarshipMaterialList,
  getScholarshipMaterialDetail,
  getScholarshipPublicList,
  getScholarshipPublicDetail,

  initWorkStudyData,
  getWorkStudyJobList,
  getWorkStudyJobDetail,
  increaseWorkStudyJobViews,
  getWorkStudyApplicationList,
  getWorkStudyApplicationDetail,
  createWorkStudyApplication,
  hasAppliedForJob,
  getWorkStudyHoursRecords,
  createWorkStudyHoursRecord,
  getTotalHoursByMonth,
  getWorkStudySalaryList,
  getApprovedApplications,

  getKeywordSubscriptions,
  getKeywordSubscriptionById,
  addKeywordSubscription,
  updateKeywordSubscription,
  deleteKeywordSubscription,
  toggleKeywordSubscription,
  getKeywordSubscriptionSettings,
  updateKeywordSubscriptionSettings,
  matchKeywordsInContent,
  recordKeywordNotification,
  isInDNDPeriod,
  checkAndCreateKeywordNotification
};

function initScholarshipData() {
  if (scholarshipInitialized) return;
  const existingPolicies = storage.get(STORAGE_KEYS.SCHOLARSHIP_POLICY_LIST);
  if (!existingPolicies || existingPolicies.length === 0) {
    const policies = mockData.MOCK_SCHOLARSHIP_POLICIES.map((item, index) => ({
      id: item.id,
      ...item
    }));
    storage.set(STORAGE_KEYS.SCHOLARSHIP_POLICY_LIST, policies);

    const applications = mockData.MOCK_SCHOLARSHIP_APPLICATIONS.map(item => ({
      ...item
    }));
    storage.set(STORAGE_KEYS.SCHOLARSHIP_APPLICATION_LIST, applications);

    const materials = mockData.MOCK_SCHOLARSHIP_MATERIALS.map(item => ({
      ...item
    }));
    storage.set(STORAGE_KEYS.SCHOLARSHIP_MATERIAL_LIST, materials);

    const publicList = mockData.MOCK_SCHOLARSHIP_PUBLIC_LIST.map(item => ({
      ...item
    }));
    storage.set(STORAGE_KEYS.SCHOLARSHIP_PUBLIC_LIST, publicList);

    const userProfile = {
      ...mockData.MOCK_SCHOLARSHIP_USER_PROFILE
    };
    storage.set(STORAGE_KEYS.SCHOLARSHIP_USER_PROFILE, userProfile);
  }
  scholarshipInitialized = true;
}

function getScholarshipPolicyList(filters = {}) {
  let list = storage.getList(STORAGE_KEYS.SCHOLARSHIP_POLICY_LIST);

  if (filters.category) {
    list = list.filter(item => item.category === filters.category);
  }

  if (filters.level) {
    list = list.filter(item => item.level === filters.level);
  }

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['name', 'description', 'sponsor']);
  }

  if (filters.sort === 'amount') {
    list = list.sort((a, b) => b.amount - a.amount);
  } else if (filters.sort === 'deadline') {
    list = list.sort((a, b) => {
      const aDate = new Date(a.applyEndDate);
      const bDate = new Date(b.applyEndDate);
      return aDate - bDate;
    });
  }

  return list;
}

function getScholarshipPolicyDetail(id) {
  const list = storage.getList(STORAGE_KEYS.SCHOLARSHIP_POLICY_LIST);
  return list.find(item => item.id === id) || null;
}

function getScholarshipUserProfile() {
  return storage.get(STORAGE_KEYS.SCHOLARSHIP_USER_PROFILE) || null;
}

function getMatchedScholarships() {
  const policies = getScholarshipPolicyList();
  const profile = getScholarshipUserProfile();
  if (!profile) return [];

  const { gpa, comprehensiveRankPercent, hasDisciplinaryAction, college, awards, clubPositions, researchExperience, familyEconomicStatus, volunteerHours } = profile;

  return policies.map(policy => {
    const matchResult = {
      ...policy,
      matchScore: 0,
      matchLevel: 'low',
      matchReasons: [],
      unmetConditions: [],
      isEligible: true
    };

    const eligibility = policy.eligibility || [];
    const benefits = policy.benefits || [];

    if (gpa >= 3.8) {
      matchResult.matchScore += 30;
      matchResult.matchReasons.push('GPA成绩优异');
    } else if (gpa >= 3.5) {
      matchResult.matchScore += 20;
      matchResult.matchReasons.push('GPA成绩良好');
    } else if (gpa >= 3.2) {
      matchResult.matchScore += 10;
      matchResult.matchReasons.push('GPA成绩达标');
    } else {
      matchResult.isEligible = false;
      matchResult.unmetConditions.push('GPA未达到最低要求');
    }

    if (comprehensiveRankPercent <= 5) {
      matchResult.matchScore += 25;
      matchResult.matchReasons.push('综合测评排名前5%');
    } else if (comprehensiveRankPercent <= 15) {
      matchResult.matchScore += 15;
      matchResult.matchReasons.push('综合测评排名前15%');
    } else if (comprehensiveRankPercent <= 30) {
      matchResult.matchScore += 5;
      matchResult.matchReasons.push('综合测评排名前30%');
    }

    if (hasDisciplinaryAction) {
      matchResult.isEligible = false;
      matchResult.unmetConditions.push('存在违纪记录');
    } else {
      matchResult.matchScore += 10;
      matchResult.matchReasons.push('无违纪记录');
    }

    if (awards && awards.length > 0) {
      matchResult.matchScore += 15;
      matchResult.matchReasons.push(`拥有${awards.length}项获奖经历`);
    }

    if (clubPositions && clubPositions.length > 0) {
      matchResult.matchScore += 10;
      matchResult.matchReasons.push(`担任${clubPositions.length}项学生干部经历`);
    }

    if (researchExperience && researchExperience.length > 0) {
      matchResult.matchScore += 10;
      matchResult.matchReasons.push('拥有科研经历');
    }

    if (volunteerHours >= 50) {
      matchResult.matchScore += 5;
      matchResult.matchReasons.push('志愿服务时长充足');
    }

    if (policy.category === 'enterprise' && college === '计算机学院') {
      matchResult.matchScore += 10;
      matchResult.matchReasons.push('学院匹配');
    }

    if (policy.category === 'special' && policy.name.includes('社会工作') && clubPositions.length > 0) {
      matchResult.matchScore += 15;
    }

    if (policy.category === 'special' && policy.name.includes('创新创业') && awards.some(a => a.name.includes('竞赛'))) {
      matchResult.matchScore += 15;
    }

    if (policy.level === 'postgraduate' && !profile.grade.includes('202')) {
      matchResult.isEligible = false;
      matchResult.unmetConditions.push('仅限研究生');
    }

    if (matchResult.matchScore >= 60) {
      matchResult.matchLevel = 'high';
    } else if (matchResult.matchScore >= 30) {
      matchResult.matchLevel = 'medium';
    }

    return matchResult;
  }).filter(item => item.isEligible).sort((a, b) => b.matchScore - a.matchScore);
}

function getScholarshipApplicationList(userId = 'test_user') {
  const list = storage.getList(STORAGE_KEYS.SCHOLARSHIP_APPLICATION_LIST);
  return list.filter(item => item.userId === userId);
}

function getScholarshipApplicationDetail(id) {
  const list = storage.getList(STORAGE_KEYS.SCHOLARSHIP_APPLICATION_LIST);
  return list.find(item => item.id === id) || null;
}

function createScholarshipApplication(data) {
  const app = {
    id: util.generateId(),
    userId: 'test_user',
    applyTime: Date.now(),
    status: 'pending',
    currentStep: 1,
    totalSteps: 5,
    steps: [
      { name: '提交申请', status: 'completed', time: Date.now(), remark: '申请已提交' },
      { name: '班级初审', status: 'pending', time: null, remark: '' },
      { name: '学院审核', status: 'pending', time: null, remark: '' },
      { name: '学校评审', status: 'pending', time: null, remark: '' },
      { name: '奖学金发放', status: 'pending', time: null, remark: '' }
    ],
    ...data
  };
  storage.addToList(STORAGE_KEYS.SCHOLARSHIP_APPLICATION_LIST, app);
  return app;
}

function getScholarshipMaterialList(scholarshipId) {
  let list = storage.getList(STORAGE_KEYS.SCHOLARSHIP_MATERIAL_LIST);

  if (scholarshipId) {
    const policy = getScholarshipPolicyDetail(scholarshipId);
    if (policy) {
      const requiredMaterials = [];
      if (policy.name.includes('国家励志') || policy.name.includes('励志')) {
        requiredMaterials.push('mat_001', 'mat_002', 'mat_003', 'mat_004');
      } else if (policy.name.includes('社会工作')) {
        requiredMaterials.push('mat_001', 'mat_002', 'mat_003', 'mat_005');
      } else if (policy.name.includes('创新创业')) {
        requiredMaterials.push('mat_001', 'mat_002', 'mat_003', 'mat_006');
      } else {
        requiredMaterials.push('mat_001', 'mat_002', 'mat_003');
      }
      list = list.filter(item => requiredMaterials.includes(item.id));
    }
  }
  return list;
}

function getScholarshipMaterialDetail(id) {
  const list = storage.getList(STORAGE_KEYS.SCHOLARSHIP_MATERIAL_LIST);
  return list.find(item => item.id === id) || null;
}

function getScholarshipPublicList(filters = {}) {
  let list = storage.getList(STORAGE_KEYS.SCHOLARSHIP_PUBLIC_LIST);

  if (filters.year) {
    list = list.filter(item => item.year === filters.year);
  }

  if (filters.scholarshipId) {
    list = list.filter(item => item.scholarshipId === filters.scholarshipId);
  }

  if (filters.college) {
    list = list.filter(item => item.college === filters.college);
  }

  return list.sort((a, b) => b.publishTime - a.publishTime);
}

function getScholarshipPublicDetail(id) {
  const list = storage.getList(STORAGE_KEYS.SCHOLARSHIP_PUBLIC_LIST);
  return list.find(item => item.id === id) || null;
}

function initWorkStudyData() {
  if (workStudyInitialized) return;
  const existingJobs = storage.get(STORAGE_KEYS.WORK_STUDY_JOB_LIST);
  if (!existingJobs || existingJobs.length === 0) {
    const jobs = mockData.MOCK_WORK_STUDY_JOBS.map((item, index) => ({
      id: item.id,
      ...item,
      createTime: Date.now() - (index + 1) * 86400000,
      updateTime: Date.now() - (index + 1) * 86400000
    }));
    storage.set(STORAGE_KEYS.WORK_STUDY_JOB_LIST, jobs);

    const applications = mockData.MOCK_WORK_STUDY_APPLICATIONS.map(item => ({
      ...item
    }));
    storage.set(STORAGE_KEYS.WORK_STUDY_APPLICATION_LIST, applications);

    const hoursRecords = mockData.MOCK_WORK_STUDY_HOURS_RECORDS.map(item => ({
      ...item
    }));
    storage.set(STORAGE_KEYS.WORK_STUDY_HOURS_RECORD_LIST, hoursRecords);

    const salaries = mockData.MOCK_WORK_STUDY_SALARIES.map(item => ({
      ...item
    }));
    storage.set(STORAGE_KEYS.WORK_STUDY_SALARY_LIST, salaries);
  }
  workStudyInitialized = true;
}

function getWorkStudyJobList(filters = {}) {
  let list = storage.getList(STORAGE_KEYS.WORK_STUDY_JOB_LIST);

  if (filters.status && filters.status !== 'all') {
    list = list.filter(item => item.status === filters.status);
  }

  if (filters.department && filters.department !== 'all') {
    list = list.filter(item => item.department === filters.department);
  }

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['title', 'workContent', 'requirements']);
  }

  if (filters.sort === 'wage_desc') {
    list = list.sort((a, b) => b.hourlyWage - a.hourlyWage);
  } else if (filters.sort === 'wage_asc') {
    list = list.sort((a, b) => a.hourlyWage - b.hourlyWage);
  } else {
    list = list.sort((a, b) => b.createTime - a.createTime);
  }

  return list;
}

function getWorkStudyJobDetail(id) {
  const list = storage.getList(STORAGE_KEYS.WORK_STUDY_JOB_LIST);
  const job = list.find(item => item.id === id) || null;
  if (job) {
    const currentApplications = storage.getList(STORAGE_KEYS.WORK_STUDY_APPLICATION_LIST)
      .filter(app => app.jobId === id && app.status === 'approved').length;
    job.currentCount = currentApplications || job.currentCount || 0;
  }
  return job;
}

function increaseWorkStudyJobViews(id) {
  const list = storage.getList(STORAGE_KEYS.WORK_STUDY_JOB_LIST);
  const index = list.findIndex(item => item.id === id);
  if (index > -1) {
    list[index].views = (list[index].views || 0) + 1;
    storage.set(STORAGE_KEYS.WORK_STUDY_JOB_LIST, list);
  }
}

function getWorkStudyApplicationList(filters = {}) {
  let list = storage.getList(STORAGE_KEYS.WORK_STUDY_APPLICATION_LIST);

  if (filters.userId) {
    list = list.filter(item => item.userId === filters.userId);
  }

  if (filters.status && filters.status !== 'all') {
    list = list.filter(item => item.status === filters.status);
  }

  if (filters.jobId) {
    list = list.filter(item => item.jobId === filters.jobId);
  }

  return list.sort((a, b) => b.applyTime - a.applyTime);
}

function getWorkStudyApplicationDetail(id) {
  const list = storage.getList(STORAGE_KEYS.WORK_STUDY_APPLICATION_LIST);
  return list.find(item => item.id === id) || null;
}

function createWorkStudyApplication(data) {
  const app = {
    id: util.generateId(),
    status: 'pending',
    applyTime: Date.now(),
    reviewTime: null,
    reviewRemark: '',
    ...data
  };
  storage.addToList(STORAGE_KEYS.WORK_STUDY_APPLICATION_LIST, app);
  return app;
}

function hasAppliedForJob(jobId, userId = 'test_user') {
  const list = storage.getList(STORAGE_KEYS.WORK_STUDY_APPLICATION_LIST);
  return list.some(item => item.jobId === jobId && item.userId === userId);
}

function getWorkStudyHoursRecords(filters = {}) {
  let list = storage.getList(STORAGE_KEYS.WORK_STUDY_HOURS_RECORD_LIST);

  if (filters.userId) {
    list = list.filter(item => item.userId === filters.userId);
  }

  if (filters.applicationId) {
    list = list.filter(item => item.applicationId === filters.applicationId);
  }

  if (filters.jobId) {
    list = list.filter(item => item.jobId === filters.jobId);
  }

  if (filters.status && filters.status !== 'all') {
    list = list.filter(item => item.status === filters.status);
  }

  if (filters.month) {
    list = list.filter(item => item.date && item.date.startsWith(filters.month));
  }

  return list.sort((a, b) => {
    const dateA = new Date(a.date + ' ' + a.startTime);
    const dateB = new Date(b.date + ' ' + b.startTime);
    return dateB - dateA;
  });
}

function createWorkStudyHoursRecord(data) {
  const record = {
    id: util.generateId(),
    status: 'pending',
    submitTime: Date.now(),
    confirmTime: null,
    ...data
  };
  storage.addToList(STORAGE_KEYS.WORK_STUDY_HOURS_RECORD_LIST, record);
  return record;
}

function getTotalHoursByMonth(userId, month) {
  const records = getWorkStudyHoursRecords({ userId, month, status: 'confirmed' });
  return records.reduce((sum, r) => sum + (r.hours || 0), 0);
}

function getWorkStudySalaryList(filters = {}) {
  let list = storage.getList(STORAGE_KEYS.WORK_STUDY_SALARY_LIST);

  if (filters.userId) {
    list = list.filter(item => item.userId === filters.userId);
  }

  if (filters.status && filters.status !== 'all') {
    list = list.filter(item => item.status === filters.status);
  }

  return list.sort((a, b) => b.month.localeCompare(a.month));
}

function getApprovedApplications(userId = 'test_user') {
  return getWorkStudyApplicationList({ userId, status: 'approved' });
}

let tutorDataInitialized = false;

function initTutorData() {
  if (tutorDataInitialized) return;
  const existingTutors = storage.get(STORAGE_KEYS.TUTOR_LIST);
  if (!existingTutors || existingTutors.length === 0) {
    const tutors = mockData.MOCK_TUTOR_LIST.map((item, index) => ({
      id: item.id,
      ...item
    }));
    storage.set(STORAGE_KEYS.TUTOR_LIST, tutors);

    const demands = mockData.MOCK_TUTOR_DEMAND_LIST.map(item => ({
      id: item.id,
      ...item
    }));
    storage.set(STORAGE_KEYS.TUTOR_DEMAND_LIST, demands);

    const appointments = mockData.MOCK_TUTOR_APPOINTMENT_LIST.map(item => ({
      id: item.id,
      ...item
    }));
    storage.set(STORAGE_KEYS.TUTOR_APPOINTMENT_LIST, appointments);

    const reviews = mockData.MOCK_TUTOR_REVIEW_LIST.map(item => ({
      id: item.id,
      ...item
    }));
    storage.set(STORAGE_KEYS.TUTOR_REVIEW_LIST, reviews);

    const creditBinds = mockData.MOCK_TUTOR_CREDIT_BIND_LIST.map(item => ({
      id: item.id,
      ...item
    }));
    storage.set(STORAGE_KEYS.TUTOR_CREDIT_BIND_LIST, creditBinds);
  }
  tutorDataInitialized = true;
}

function getTutorList(filters = {}) {
  initTutorData();
  let list = storage.getList(STORAGE_KEYS.TUTOR_LIST);

  if (filters.subject) {
    list = list.filter(item => (item.subjects || []).includes(filters.subject));
  }
  if (filters.grade) {
    list = list.filter(item => (item.grades || []).includes(filters.grade));
  }
  if (filters.teachingMethod && filters.teachingMethod !== 'both') {
    list = list.filter(item =>
      item.teachingMethod === 'both' || item.teachingMethod === filters.teachingMethod
    );
  }
  if (filters.status) {
    list = list.filter(item => item.status === filters.status);
  }
  if (filters.minHourlyRate !== undefined) {
    list = list.filter(item => item.hourlyRate >= filters.minHourlyRate);
  }
  if (filters.maxHourlyRate !== undefined) {
    list = list.filter(item => item.hourlyRate <= filters.maxHourlyRate);
  }
  if (filters.minCreditScore !== undefined) {
    list = list.filter(item => (item.creditScore || 0) >= filters.minCreditScore);
  }
  if (filters.minRating !== undefined) {
    list = list.filter(item => (item.rating || 0) >= filters.minRating);
  }
  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['tutorName', 'intro', 'college', 'major']);
  }

  list = sortByField(list, filters.sort || 'latest', constants.TUTOR_SORT_OPTIONS);
  return list;
}

function getTutorDetail(id) {
  initTutorData();
  const list = storage.getList(STORAGE_KEYS.TUTOR_LIST);
  const tutor = list.find(item => item.id === id) || null;
  if (tutor) {
    tutor.views = (tutor.views || 0) + 1;
    storage.updateInList(STORAGE_KEYS.TUTOR_LIST, id, { views: tutor.views });
  }
  return tutor;
}

function publishTutorProfile(data) {
  initTutorData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const item = {
    id: util.generateId(),
    tutorId: userInfo.id || 'anonymous',
    tutorName: userInfo.nickName || '匿名用户',
    tutorAvatar: userInfo.avatarUrl || '',
    college: userInfo.college || '',
    grade: userInfo.grade || '',
    subjects: [],
    grades: [],
    hourlyRate: 0,
    teachingMethod: 'both',
    availableDays: [],
    availableTimeSlots: [],
    intro: '',
    gradeProofImages: [],
    tags: [],
    status: 'active',
    rating: 0,
    reviewCount: 0,
    sessionCount: 0,
    creditScore: 0,
    views: 0,
    ...data,
    createTime: Date.now(),
    updateTime: Date.now()
  };

  const success = storage.addToList(STORAGE_KEYS.TUTOR_LIST, item);
  return success ? item : null;
}

function updateTutorProfile(id, updates) {
  return storage.updateInList(STORAGE_KEYS.TUTOR_LIST, id, {
    ...updates,
    updateTime: Date.now()
  });
}

function updateTutorStatus(id, status) {
  return storage.updateInList(STORAGE_KEYS.TUTOR_LIST, id, {
    status,
    updateTime: Date.now()
  });
}

function getMyTutorProfile(userId) {
  initTutorData();
  const list = storage.getList(STORAGE_KEYS.TUTOR_LIST);
  return list.find(item => item.tutorId === userId) || null;
}

function getTutorDemandList(filters = {}) {
  initTutorData();
  let list = storage.getList(STORAGE_KEYS.TUTOR_DEMAND_LIST);

  if (filters.subject) {
    list = list.filter(item => item.subject === filters.subject);
  }
  if (filters.grade) {
    list = list.filter(item => item.grade === filters.grade);
  }
  if (filters.teachingMethod && filters.teachingMethod !== 'both') {
    list = list.filter(item =>
      item.teachingMethod === 'both' || item.teachingMethod === filters.teachingMethod
    );
  }
  if (filters.status) {
    list = list.filter(item => item.status === filters.status);
  }
  if (filters.maxBudget !== undefined) {
    list = list.filter(item => (item.maxBudget || item.budget) <= filters.maxBudget);
  }
  if (filters.urgent) {
    list = list.filter(item => item.urgent === true);
  }
  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['studentName', 'description', 'location', 'targetGrade']);
  }

  return list.sort((a, b) => {
    if (a.urgent !== b.urgent) return a.urgent ? -1 : 1;
    return b.createTime - a.createTime;
  });
}

function getTutorDemandDetail(id) {
  initTutorData();
  const list = storage.getList(STORAGE_KEYS.TUTOR_DEMAND_LIST);
  const demand = list.find(item => item.id === id) || null;
  if (demand) {
    demand.views = (demand.views || 0) + 1;
    storage.updateInList(STORAGE_KEYS.TUTOR_DEMAND_LIST, id, { views: demand.views });
  }
  return demand;
}

function publishTutorDemand(data) {
  initTutorData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const item = {
    id: util.generateId(),
    publisherId: userInfo.id || 'anonymous',
    studentName: userInfo.nickName || '匿名用户',
    studentAvatar: userInfo.avatarUrl || '',
    subject: '',
    grade: '',
    targetGrade: '',
    budget: 0,
    maxBudget: 0,
    teachingMethod: 'both',
    preferredDays: [],
    preferredTimeSlots: [],
    duration: 2,
    description: '',
    location: '',
    urgent: false,
    status: 'open',
    views: 0,
    ...data,
    createTime: Date.now(),
    updateTime: Date.now()
  };

  const success = storage.addToList(STORAGE_KEYS.TUTOR_DEMAND_LIST, item);
  return success ? item : null;
}

function updateTutorDemand(id, updates) {
  return storage.updateInList(STORAGE_KEYS.TUTOR_DEMAND_LIST, id, {
    ...updates,
    updateTime: Date.now()
  });
}

function closeTutorDemand(id) {
  return updateTutorDemand(id, { status: 'closed' });
}

function getMyTutorDemands(userId) {
  initTutorData();
  const list = storage.getList(STORAGE_KEYS.TUTOR_DEMAND_LIST);
  return list.filter(item => item.publisherId === userId).sort((a, b) => b.createTime - a.createTime);
}

function matchTutorsForDemand(demandId) {
  const demand = getTutorDemandDetail(demandId);
  if (!demand) return [];

  const tutors = getTutorList();

  return tutors.map(tutor => {
    let matchScore = 0;
    const matchReasons = [];
    const unmetConditions = [];

    if ((tutor.subjects || []).includes(demand.subject)) {
      matchScore += 30;
      matchReasons.push('擅长科目匹配');
    } else {
      unmetConditions.push('科目不匹配');
    }

    if ((tutor.grades || []).includes(demand.grade)) {
      matchScore += 20;
      matchReasons.push('辅导年级匹配');
    } else {
      unmetConditions.push('辅导年级不匹配');
    }

    if (tutor.teachingMethod === 'both' || tutor.teachingMethod === demand.teachingMethod || demand.teachingMethod === 'both') {
      matchScore += 15;
      matchReasons.push('辅导方式匹配');
    } else {
      unmetConditions.push('辅导方式不匹配');
    }

    const tutorRate = tutor.hourlyRate || 0;
    const maxBudget = demand.maxBudget || demand.budget || 0;
    if (tutorRate <= maxBudget) {
      matchScore += 15;
      matchReasons.push('时薪在预算内');
      if (tutorRate <= (demand.budget || 0)) {
        matchScore += 5;
        matchReasons.push('低于预期预算');
      }
    } else {
      unmetConditions.push('时薪超出预算');
    }

    const hasCommonDay = (tutor.availableDays || []).some(d =>
      (demand.preferredDays || []).includes(d)
    );
    const hasCommonTime = (tutor.availableTimeSlots || []).some(t =>
      (demand.preferredTimeSlots || []).includes(t)
    );
    if (hasCommonDay && hasCommonTime) {
      matchScore += 15;
      matchReasons.push('辅导时间匹配');
    } else if (hasCommonDay || hasCommonTime) {
      matchScore += 8;
      matchReasons.push('部分时间匹配');
    }

    const rating = tutor.rating || 0;
    if (rating >= 4.5) {
      matchScore += 8;
      matchReasons.push('高评分导师');
    } else if (rating >= 4.0) {
      matchScore += 5;
    }

    const creditScore = tutor.creditScore || 0;
    if (creditScore >= 80) {
      matchScore += 5;
      matchReasons.push('高信用分');
    }

    if (tutor.status !== 'active') {
      matchScore = Math.max(0, matchScore - 20);
      unmetConditions.push('导师当前不在接单状态');
    }

    let matchLevel = 'low';
    if (matchScore >= 65) {
      matchLevel = 'high';
    } else if (matchScore >= 40) {
      matchLevel = 'medium';
    }

    return {
      ...tutor,
      matchScore,
      matchLevel,
      matchReasons,
      unmetConditions
    };
  })
    .filter(t => t.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

function matchDemandsForTutor(tutorId) {
  const tutor = getTutorDetail(tutorId);
  if (!tutor) return [];

  const demands = getTutorDemandList({ status: 'open' });

  return demands.map(demand => {
    let matchScore = 0;
    const matchReasons = [];
    const unmetConditions = [];

    if ((tutor.subjects || []).includes(demand.subject)) {
      matchScore += 30;
      matchReasons.push('擅长科目匹配');
    } else {
      unmetConditions.push('科目不匹配');
    }

    if ((tutor.grades || []).includes(demand.grade)) {
      matchScore += 20;
      matchReasons.push('辅导年级匹配');
    } else {
      unmetConditions.push('辅导年级不匹配');
    }

    if (tutor.teachingMethod === 'both' || tutor.teachingMethod === demand.teachingMethod || demand.teachingMethod === 'both') {
      matchScore += 15;
      matchReasons.push('辅导方式匹配');
    } else {
      unmetConditions.push('辅导方式不匹配');
    }

    const tutorRate = tutor.hourlyRate || 0;
    const maxBudget = demand.maxBudget || demand.budget || 0;
    if (tutorRate <= maxBudget) {
      matchScore += 15;
      matchReasons.push('时薪在预算内');
    } else {
      unmetConditions.push('时薪超出预算');
    }

    const hasCommonDay = (tutor.availableDays || []).some(d =>
      (demand.preferredDays || []).includes(d)
    );
    const hasCommonTime = (tutor.availableTimeSlots || []).some(t =>
      (demand.preferredTimeSlots || []).includes(t)
    );
    if (hasCommonDay && hasCommonTime) {
      matchScore += 15;
      matchReasons.push('辅导时间匹配');
    }

    if (demand.urgent) {
      matchScore += 5;
      matchReasons.push('紧急需求');
    }

    let matchLevel = 'low';
    if (matchScore >= 65) {
      matchLevel = 'high';
    } else if (matchScore >= 40) {
      matchLevel = 'medium';
    }

    return {
      ...demand,
      matchScore,
      matchLevel,
      matchReasons,
      unmetConditions
    };
  })
    .filter(d => d.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

function getTutorAppointmentList(filters = {}) {
  initTutorData();
  let list = storage.getList(STORAGE_KEYS.TUTOR_APPOINTMENT_LIST);

  if (filters.tutorId) {
    list = list.filter(item => item.tutorId === filters.tutorId);
  }
  if (filters.studentId) {
    list = list.filter(item => item.studentId === filters.studentId);
  }
  if (filters.userId) {
    list = list.filter(item => item.tutorId === filters.userId || item.studentId === filters.userId);
  }
  if (filters.status) {
    list = list.filter(item => item.status === filters.status);
  }
  if (filters.statuses && Array.isArray(filters.statuses)) {
    list = list.filter(item => filters.statuses.includes(item.status));
  }
  if (filters.demandId) {
    list = list.filter(item => item.demandId === filters.demandId);
  }

  return list.sort((a, b) => b.createTime - a.createTime);
}

function getTutorAppointmentDetail(id) {
  initTutorData();
  const list = storage.getList(STORAGE_KEYS.TUTOR_APPOINTMENT_LIST);
  return list.find(item => item.id === id) || null;
}

function createTutorAppointment(data) {
  initTutorData();

  const appointment = {
    id: util.generateId(),
    isTrial: true,
    status: 'pending',
    tutorReviewed: false,
    studentReviewed: false,
    ...data,
    createTime: Date.now()
  };

  const success = storage.addToList(STORAGE_KEYS.TUTOR_APPOINTMENT_LIST, appointment);
  if (success && appointment.demandId) {
    updateTutorDemand(appointment.demandId, { status: 'matched', matchedTutorId: appointment.tutorId });
  }

  return success ? appointment : null;
}

function updateTutorAppointment(id, updates) {
  return storage.updateInList(STORAGE_KEYS.TUTOR_APPOINTMENT_LIST, id, updates);
}

function confirmTutorAppointment(id) {
  return updateTutorAppointment(id, { status: 'confirmed' });
}

function startTutorSession(id) {
  return updateTutorAppointment(id, { status: 'trial' });
}

function completeTutorAppointment(id) {
  const success = updateTutorAppointment(id, { status: 'completed' });
  if (success) {
    const appointment = getTutorAppointmentDetail(id);
    if (appointment) {
      const tutor = getTutorDetail(appointment.tutorId);
      if (tutor) {
        storage.updateInList(STORAGE_KEYS.TUTOR_LIST, appointment.tutorId, {
          sessionCount: (tutor.sessionCount || 0) + 1
        });
      }
    }
  }
  return success;
}

function cancelTutorAppointment(id, reason = '') {
  return updateTutorAppointment(id, { status: 'cancelled', cancelReason: reason });
}

function getTutorReviews(filters = {}) {
  initTutorData();
  let list = storage.getList(STORAGE_KEYS.TUTOR_REVIEW_LIST);

  if (filters.tutorId) {
    list = list.filter(item => item.tutorId === filters.tutorId && item.targetRole === 'tutor');
  }
  if (filters.targetRole) {
    list = list.filter(item => item.targetRole === filters.targetRole);
  }
  if (filters.appointmentId) {
    list = list.filter(item => item.appointmentId === filters.appointmentId);
  }
  if (filters.reviewerId) {
    list = list.filter(item => item.reviewerId === filters.reviewerId);
  }

  return list.sort((a, b) => b.createTime - a.createTime);
}

function addTutorReview(data) {
  initTutorData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const review = {
    id: util.generateId(),
    reviewerId: userInfo.id || 'anonymous',
    reviewerName: userInfo.nickName || '匿名用户',
    reviewerAvatar: userInfo.avatarUrl || '',
    tags: [],
    rating: 5,
    content: '',
    ...data,
    createTime: Date.now()
  };

  const success = storage.addToList(STORAGE_KEYS.TUTOR_REVIEW_LIST, review);

  if (success) {
    const appointment = getTutorAppointmentDetail(data.appointmentId);
    if (appointment) {
      const updates = {};
      if (data.reviewerRole === 'tutor') {
        updates.tutorReviewed = true;
      } else {
        updates.studentReviewed = true;
      }
      updateTutorAppointment(data.appointmentId, updates);
    }

    if (data.tutorId && data.targetRole === 'tutor') {
      const reviews = getTutorReviews({ tutorId: data.tutorId });
      const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
      const avgRating = Math.round(totalRating / reviews.length * 10) / 10;
      storage.updateInList(STORAGE_KEYS.TUTOR_LIST, data.tutorId, {
        rating: avgRating,
        reviewCount: reviews.length
      });
    }
  }

  return success ? review : null;
}

function hasReviewedAppointment(appointmentId, role) {
  const reviews = getTutorReviews({ appointmentId });
  return reviews.some(r => r.reviewerRole === role);
}

function getTutorCreditBinds(filters = {}) {
  initTutorData();
  let list = storage.getList(STORAGE_KEYS.TUTOR_CREDIT_BIND_LIST);

  if (filters.userId) {
    list = list.filter(item => item.userId === filters.userId);
  }
  if (filters.status) {
    list = list.filter(item => item.status === filters.status);
  }
  if (filters.type) {
    list = list.filter(item => item.type === filters.type);
  }

  return list.sort((a, b) => b.submitTime - a.submitTime);
}

function submitTutorCreditBind(data) {
  initTutorData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const bind = {
    id: util.generateId(),
    userId: userInfo.id || 'anonymous',
    status: 'pending',
    submitTime: Date.now(),
    reviewTime: null,
    ...data
  };

  const success = storage.addToList(STORAGE_KEYS.TUTOR_CREDIT_BIND_LIST, bind);
  if (success) {
    recalculateUserCreditScore(bind.userId);
  }
  return success ? bind : null;
}

function approveTutorCreditBind(id) {
  const success = storage.updateInList(STORAGE_KEYS.TUTOR_CREDIT_BIND_LIST, id, {
    status: 'approved',
    reviewTime: Date.now()
  });
  if (success) {
    const bind = getTutorCreditBinds({}).find(b => b.id === id);
    if (bind) {
      recalculateUserCreditScore(bind.userId);
    }
  }
  return success;
}

function rejectTutorCreditBind(id, reason = '') {
  return storage.updateInList(STORAGE_KEYS.TUTOR_CREDIT_BIND_LIST, id, {
    status: 'rejected',
    rejectReason: reason,
    reviewTime: Date.now()
  });
}

function recalculateUserCreditScore(userId) {
  const binds = getTutorCreditBinds({ userId, status: 'approved' });
  let score = 0;
  const typeScoreMap = {};
  constants.TUTOR_CREDIT_TYPES.forEach(t => {
    typeScoreMap[t.value] = t.score;
  });
  binds.forEach(b => {
    score += typeScoreMap[b.type] || 0;
  });

  const reviews = getTutorReviews({ tutorId: userId });
  if (reviews.length >= 10) {
    score += 10;
  } else if (reviews.length >= 5) {
    score += 5;
  }

  const appointments = getTutorAppointmentList({ tutorId: userId, statuses: ['completed'] });
  if (appointments.length >= 50) {
    score += 15;
  } else if (appointments.length >= 20) {
    score += 10;
  } else if (appointments.length >= 10) {
    score += 5;
  }

  score = Math.min(100, score);

  const list = storage.getList(STORAGE_KEYS.TUTOR_LIST);
  const index = list.findIndex(item => item.tutorId === userId);
  if (index > -1) {
    list[index].creditScore = score;
    storage.set(STORAGE_KEYS.TUTOR_LIST, list);
  }

  return score;
}

function getUserCreditScore(userId) {
  const binds = getTutorCreditBinds({ userId, status: 'approved' });
  let score = 0;
  const typeScoreMap = {};
  constants.TUTOR_CREDIT_TYPES.forEach(t => {
    typeScoreMap[t.value] = t.score;
  });
  binds.forEach(b => {
    score += typeScoreMap[b.type] || 0;
  });
  return Math.min(100, score);
}

Object.assign(module.exports, {
  initTutorData,
  getTutorList,
  getTutorDetail,
  publishTutorProfile,
  updateTutorProfile,
  updateTutorStatus,
  getMyTutorProfile,

  getTutorDemandList,
  getTutorDemandDetail,
  publishTutorDemand,
  updateTutorDemand,
  closeTutorDemand,
  getMyTutorDemands,

  matchTutorsForDemand,
  matchDemandsForTutor,

  getTutorAppointmentList,
  getTutorAppointmentDetail,
  createTutorAppointment,
  updateTutorAppointment,
  confirmTutorAppointment,
  startTutorSession,
  completeTutorAppointment,
  cancelTutorAppointment,

  getTutorReviews,
  addTutorReview,
  hasReviewedAppointment,

  getTutorCreditBinds,
  submitTutorCreditBind,
  approveTutorCreditBind,
  rejectTutorCreditBind,
  recalculateUserCreditScore,
  getUserCreditScore,

  getGroupBuyList,
  getGroupBuyDetail,
  publishGroupBuy,
  joinGroupBuy,
  leaveGroupBuy,
  updateGroupBuy,
  deleteGroupBuy,
  increaseGroupBuyViews,
  getMyGroupBuys,
  checkAndUpdateGroupBuyStatus,
  addGroupBuyNotification,
  getGroupBuyNotifications,

  initJobRecruitmentData,
  getJobList,
  getJobDetail,
  toggleJobFavorite,
  isJobFavorited,
  getFavoriteJobs,
  submitJobApplication,
  getMyJobApplications,
  getJobApplicationDetail,
  getReferralCodeList,
  getReferralCodeDetail,
  useReferralCode,
  getCareerTalkList,
  getCareerTalkDetail,
  registerCareerTalk,
  syncTalkToCalendar,
  getSyncedCalendarEvents,
  getResumeList,
  saveResume,
  deleteResume,

  initPsychologicalData,
  getPsychologicalCounselorList,
  getPsychologicalCounselorDetail,
  getPsychologicalAppointmentList,
  getPsychologicalAppointmentDetail,
  createPsychologicalAppointment,
  cancelPsychologicalAppointment,
  reschedulePsychologicalAppointment,
  getPsychologicalArticleList,
  getPsychologicalArticleDetail,
  increasePsychologicalArticleViews,
  getPsychologicalCrisisHotlines,
  callCrisisHotline,
  generateAnonymousUserId,
  getMaskedUserName,
  getCancellationRules,
  getAvailableTimeSlots
});

function initPsychologicalData() {
  if (psychologicalInitialized) return;
  const existingCounselors = storage.get(STORAGE_KEYS.PSYCHOLOGICAL_COUNSELOR_LIST);
  if (!existingCounselors || existingCounselors.length === 0) {
    storage.set(STORAGE_KEYS.PSYCHOLOGICAL_COUNSELOR_LIST, mockData.MOCK_PSYCHOLOGICAL_COUNSELORS);
  }
  const existingArticles = storage.get(STORAGE_KEYS.PSYCHOLOGICAL_ARTICLE_LIST);
  if (!existingArticles || existingArticles.length === 0) {
    storage.set(STORAGE_KEYS.PSYCHOLOGICAL_ARTICLE_LIST, mockData.MOCK_PSYCHOLOGICAL_ARTICLES);
  }
  const existingHotlines = storage.get(STORAGE_KEYS.PSYCHOLOGICAL_CRISIS_HOTLINES);
  if (!existingHotlines || existingHotlines.length === 0) {
    storage.set(STORAGE_KEYS.PSYCHOLOGICAL_CRISIS_HOTLINES, mockData.MOCK_PSYCHOLOGICAL_CRISIS_HOTLINES);
  }
  const existingAppointments = storage.get(STORAGE_KEYS.PSYCHOLOGICAL_APPOINTMENT_LIST);
  if (!existingAppointments) {
    storage.set(STORAGE_KEYS.PSYCHOLOGICAL_APPOINTMENT_LIST, []);
  }
  psychologicalInitialized = true;
}

function generateAnonymousUserId() {
  return 'ANON_' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function getMaskedUserName(realName) {
  if (!realName) return '匿名用户';
  if (realName.length <= 1) return realName + '*';
  return realName.charAt(0) + '*'.repeat(realName.length - 1);
}

function getCancellationRules() {
  return constants.PSYCHOLOGICAL_CANCELLATION_RULES;
}

function getPsychologicalCounselorList(filters = {}) {
  initPsychologicalData();
  let list = storage.getList(STORAGE_KEYS.PSYCHOLOGICAL_COUNSELOR_LIST);

  if (filters.specialty && filters.specialty !== 'all') {
    list = list.filter(item => (item.specialties || []).includes(filters.specialty));
  }

  if (filters.title && filters.title !== 'all') {
    list = list.filter(item => item.title === filters.title);
  }

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['name', 'introduction', 'education']);
  }

  if (filters.consultationMethod && filters.consultationMethod !== 'all') {
    list = list.filter(item => (item.consultationMethod || []).includes(filters.consultationMethod));
  }

  if (filters.sort === 'rating') {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (filters.sort === 'experience') {
    list.sort((a, b) => (b.yearsOfExperience || 0) - (a.yearsOfExperience || 0));
  } else if (filters.sort === 'sessions') {
    list.sort((a, b) => (b.sessionCount || 0) - (a.sessionCount || 0));
  }

  return list.map(counselor => {
    const titleInfo = constants.PSYCHOLOGICAL_COUNSELOR_TITLES.find(t => t.value === counselor.title) || {};
    const specialtyInfos = (counselor.specialties || []).map(s => constants.PSYCHOLOGICAL_COUNSELOR_SPECIALTY_MAP[s]).filter(Boolean);
    return {
      ...counselor,
      titleLabel: titleInfo.label || counselor.title,
      specialtyInfos
    };
  });
}

function getPsychologicalCounselorDetail(id) {
  initPsychologicalData();
  const list = storage.getList(STORAGE_KEYS.PSYCHOLOGICAL_COUNSELOR_LIST);
  const counselor = list.find(item => item.id === id);
  if (!counselor) return null;

  const titleInfo = constants.PSYCHOLOGICAL_COUNSELOR_TITLES.find(t => t.value === counselor.title) || {};
  const specialtyInfos = (counselor.specialties || []).map(s => constants.PSYCHOLOGICAL_COUNSELOR_SPECIALTY_MAP[s]).filter(Boolean);

  return {
    ...counselor,
    titleLabel: titleInfo.label || counselor.title,
    specialtyInfos
  };
}

function getAvailableTimeSlots(counselorId, date) {
  initPsychologicalData();
  const counselor = getPsychologicalCounselorDetail(counselorId);
  if (!counselor) return [];

  const dateObj = new Date(date);
  const dayOfWeek = String(dateObj.getDay() === 0 ? 7 : dateObj.getDay());

  if (!counselor.availableDays.includes(dayOfWeek)) {
    return [];
  }

  const allAppointments = storage.getList(STORAGE_KEYS.PSYCHOLOGICAL_APPOINTMENT_LIST);
  const bookedSlots = allAppointments.filter(apt =>
    apt.counselorId === counselorId &&
    apt.appointmentDate === date &&
    apt.status !== 'cancelled'
  ).map(apt => apt.timeSlot);

  return (counselor.availableTimeSlots || []).map(slotValue => {
    const slotInfo = constants.PSYCHOLOGICAL_TIME_SLOTS.find(s => s.value === slotValue);
    const isBooked = bookedSlots.includes(slotValue);
    return {
      value: slotValue,
      label: slotInfo ? slotInfo.label : slotValue,
      available: !isBooked
    };
  });
}

function createPsychologicalAppointment(appointmentData) {
  initPsychologicalData();
  const rules = constants.PSYCHOLOGICAL_CANCELLATION_RULES;

  const weekStart = new Date();
  weekStart.setHours(0, 0, 0, 0);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  const existingAppointments = storage.getList(STORAGE_KEYS.PSYCHOLOGICAL_APPOINTMENT_LIST);
  const userWeeklyAppointments = existingAppointments.filter(apt => {
    const aptDate = new Date(apt.appointmentDate);
    return apt.userId === appointmentData.userId &&
      aptDate >= weekStart && aptDate < weekEnd &&
      apt.status !== 'cancelled';
  });

  if (userWeeklyAppointments.length >= rules.maxAppointmentsPerWeek) {
    return { success: false, error: `每周最多预约${rules.maxAppointmentsPerWeek}次` };
  }

  const availableSlots = getAvailableTimeSlots(appointmentData.counselorId, appointmentData.appointmentDate);
  const targetSlot = availableSlots.find(s => s.value === appointmentData.timeSlot);
  if (!targetSlot || !targetSlot.available) {
    return { success: false, error: '该时段已被预约' };
  }

  const anonymousId = appointmentData.anonymousId || generateAnonymousUserId();

  const appointment = {
    id: 'psy_apt_' + Date.now(),
    ...appointmentData,
    anonymousId,
    status: 'pending',
    rescheduleCount: 0,
    reminderEnabled: appointmentData.reminderEnabled !== false,
    reminderMinutes: appointmentData.reminderMinutes || 30,
    createTime: Date.now(),
    updateTime: Date.now(),
    timeline: [
      { status: 'pending', time: Date.now(), remark: '预约已提交，等待确认' }
    ]
  };

  storage.addToList(STORAGE_KEYS.PSYCHOLOGICAL_APPOINTMENT_LIST, appointment);
  return { success: true, appointment };
}

function getPsychologicalAppointmentList(filters = {}) {
  initPsychologicalData();
  let list = storage.getList(STORAGE_KEYS.PSYCHOLOGICAL_APPOINTMENT_LIST);

  if (filters.userId) {
    list = list.filter(item => item.userId === filters.userId);
  }

  if (filters.counselorId) {
    list = list.filter(item => item.counselorId === filters.counselorId);
  }

  if (filters.status && filters.status !== 'all') {
    list = list.filter(item => item.status === filters.status);
  }

  list.sort((a, b) => {
    const dateTimeA = new Date(a.appointmentDate + ' ' + (a.timeSlot ? a.timeSlot.split('-')[0] : '00:00')).getTime();
    const dateTimeB = new Date(b.appointmentDate + ' ' + (b.timeSlot ? b.timeSlot.split('-')[0] : '00:00')).getTime();
    return filters.asc ? dateTimeA - dateTimeB : dateTimeB - dateTimeA;
  });

  return list.map(apt => {
    const counselor = getPsychologicalCounselorDetail(apt.counselorId);
    const statusInfo = constants.PSYCHOLOGICAL_APPOINTMENT_STATUS_MAP[apt.status] || {};
    return {
      ...apt,
      counselorName: counselor ? counselor.name : '未知咨询师',
      counselorAvatar: counselor ? counselor.avatar : '',
      counselorTitle: counselor ? counselor.titleLabel : '',
      statusLabel: statusInfo.label || apt.status,
      statusColor: statusInfo.color || '#6B7280',
      statusIcon: statusInfo.icon || '📋',
      displayName: getMaskedUserName(apt.userName || '用户')
    };
  });
}

function getPsychologicalAppointmentDetail(id) {
  initPsychologicalData();
  const list = storage.getList(STORAGE_KEYS.PSYCHOLOGICAL_APPOINTMENT_LIST);
  const appointment = list.find(item => item.id === id);
  if (!appointment) return null;

  const counselor = getPsychologicalCounselorDetail(appointment.counselorId);
  const statusInfo = constants.PSYCHOLOGICAL_APPOINTMENT_STATUS_MAP[appointment.status] || {};
  const timeSlotInfo = constants.PSYCHOLOGICAL_TIME_SLOTS.find(s => s.value === appointment.timeSlot);

  return {
    ...appointment,
    counselor,
    counselorName: counselor ? counselor.name : '未知咨询师',
    counselorAvatar: counselor ? counselor.avatar : '',
    counselorTitle: counselor ? counselor.titleLabel : '',
    counselorLocation: counselor ? counselor.location : '',
    statusLabel: statusInfo.label || appointment.status,
    statusColor: statusInfo.color || '#6B7280',
    statusIcon: statusInfo.icon || '📋',
    timeSlotLabel: timeSlotInfo ? timeSlotInfo.label : appointment.timeSlot,
    displayName: getMaskedUserName(appointment.userName || '用户')
  };
}

function cancelPsychologicalAppointment(id, reason = '') {
  initPsychologicalData();
  const list = storage.getList(STORAGE_KEYS.PSYCHOLOGICAL_APPOINTMENT_LIST);
  const index = list.findIndex(item => item.id === id);
  if (index === -1) return { success: false, error: '预约不存在' };

  const appointment = list[index];
  if (appointment.status === 'completed' || appointment.status === 'cancelled') {
    return { success: false, error: '该预约状态不可取消' };
  }

  const rules = constants.PSYCHOLOGICAL_CANCELLATION_RULES;
  const appointmentDateTime = new Date(appointment.appointmentDate + ' ' + (appointment.timeSlot ? appointment.timeSlot.split('-')[0] : '00:00')).getTime();
  const hoursUntilAppointment = (appointmentDateTime - Date.now()) / (1000 * 60 * 60);
  let penaltyNote = '';

  if (hoursUntilAppointment < rules.freeCancelHours) {
    penaltyNote = rules.lateCancelPenalty;
  }

  list[index].status = 'cancelled';
  list[index].cancelReason = reason;
  list[index].cancelTime = Date.now();
  list[index].penaltyNote = penaltyNote;
  list[index].updateTime = Date.now();
  list[index].timeline = [
    ...(list[index].timeline || []),
    { status: 'cancelled', time: Date.now(), remark: reason ? `已取消：${reason}` : '已取消预约' }
  ];

  storage.set(STORAGE_KEYS.PSYCHOLOGICAL_APPOINTMENT_LIST, list);
  return { success: true, penaltyNote, appointment: list[index] };
}

function reschedulePsychologicalAppointment(id, newDate, newTimeSlot) {
  initPsychologicalData();
  const list = storage.getList(STORAGE_KEYS.PSYCHOLOGICAL_APPOINTMENT_LIST);
  const index = list.findIndex(item => item.id === id);
  if (index === -1) return { success: false, error: '预约不存在' };

  const appointment = list[index];
  const rules = constants.PSYCHOLOGICAL_CANCELLATION_RULES;

  if (appointment.rescheduleCount >= rules.maxRescheduleTimes) {
    return { success: false, error: `最多只能改期${rules.maxRescheduleTimes}次` };
  }

  if (appointment.status === 'completed' || appointment.status === 'cancelled') {
    return { success: false, error: '该预约状态不可改期' };
  }

  const availableSlots = getAvailableTimeSlots(appointment.counselorId, newDate);
  const targetSlot = availableSlots.find(s => s.value === newTimeSlot);
  if (!targetSlot || !targetSlot.available) {
    return { success: false, error: '该时段已被预约' };
  }

  const oldDate = appointment.appointmentDate;
  const oldTimeSlot = appointment.timeSlot;

  list[index].appointmentDate = newDate;
  list[index].timeSlot = newTimeSlot;
  list[index].rescheduleCount = (appointment.rescheduleCount || 0) + 1;
  list[index].previousDate = oldDate;
  list[index].previousTimeSlot = oldTimeSlot;
  list[index].status = 'rescheduled';
  list[index].updateTime = Date.now();
  list[index].timeline = [
    ...(list[index].timeline || []),
    { status: 'rescheduled', time: Date.now(), remark: `改期：${oldDate} ${oldTimeSlot} → ${newDate} ${newTimeSlot}` }
  ];

  storage.set(STORAGE_KEYS.PSYCHOLOGICAL_APPOINTMENT_LIST, list);
  return { success: true, appointment: list[index] };
}

function getPsychologicalArticleList(filters = {}) {
  initPsychologicalData();
  let list = storage.getList(STORAGE_KEYS.PSYCHOLOGICAL_ARTICLE_LIST);

  if (filters.category && filters.category !== 'all') {
    list = list.filter(item => item.category === filters.category);
  }

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['title', 'summary', 'content']);
  }

  list.sort((a, b) => (b.createTime || 0) - (a.createTime || 0));

  return list.map(article => {
    const categoryInfo = constants.PSYCHOLOGICAL_ARTICLE_CATEGORIES.find(c => c.value === article.category) || {};
    return {
      ...article,
      categoryLabel: categoryInfo.label || article.category,
      categoryIcon: categoryInfo.icon || '📖',
      categoryColor: categoryInfo.color || '#6B7280'
    };
  });
}

function getPsychologicalArticleDetail(id) {
  initPsychologicalData();
  const list = storage.getList(STORAGE_KEYS.PSYCHOLOGICAL_ARTICLE_LIST);
  const article = list.find(item => item.id === id);
  if (!article) return null;

  const categoryInfo = constants.PSYCHOLOGICAL_ARTICLE_CATEGORIES.find(c => c.value === article.category) || {};
  return {
    ...article,
    categoryLabel: categoryInfo.label || article.category,
    categoryIcon: categoryInfo.icon || '📖',
    categoryColor: categoryInfo.color || '#6B7280'
  };
}

function increasePsychologicalArticleViews(id) {
  initPsychologicalData();
  const list = storage.getList(STORAGE_KEYS.PSYCHOLOGICAL_ARTICLE_LIST);
  const index = list.findIndex(item => item.id === id);
  if (index > -1) {
    list[index].views = (list[index].views || 0) + 1;
    storage.set(STORAGE_KEYS.PSYCHOLOGICAL_ARTICLE_LIST, list);
    return list[index].views;
  }
  return 0;
}

function getPsychologicalCrisisHotlines() {
  initPsychologicalData();
  return storage.getList(STORAGE_KEYS.PSYCHOLOGICAL_CRISIS_HOTLINES);
}

function callCrisisHotline(phone) {
  if (!phone) return false;
  try {
    wx.makePhoneCall({
      phoneNumber: phone,
      success: () => {},
      fail: (err) => {
        if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
          console.error('拨号失败:', err);
        }
      }
    });
    return true;
  } catch (e) {
    console.error('拨号异常:', e);
    return false;
  }
}

function initJobRecruitmentData() {
  if (jobRecruitmentInitialized) return;
  const existingJobs = storage.get(STORAGE_KEYS.JOB_LIST);
  if (!existingJobs || existingJobs.length === 0) {
    storage.set(STORAGE_KEYS.JOB_LIST, mockData.MOCK_JOB_LIST);
  }
  const existingReferrals = storage.get(STORAGE_KEYS.REFERRAL_CODE_LIST);
  if (!existingReferrals || existingReferrals.length === 0) {
    storage.set(STORAGE_KEYS.REFERRAL_CODE_LIST, mockData.MOCK_REFERRAL_CODE_LIST);
  }
  const existingTalks = storage.get(STORAGE_KEYS.CAREER_TALK_LIST);
  if (!existingTalks || existingTalks.length === 0) {
    storage.set(STORAGE_KEYS.CAREER_TALK_LIST, mockData.MOCK_CAREER_TALK_LIST);
  }
  const existingApplications = storage.get(STORAGE_KEYS.JOB_APPLICATIONS);
  if (!existingApplications || existingApplications.length === 0) {
    storage.set(STORAGE_KEYS.JOB_APPLICATIONS, mockData.MOCK_JOB_APPLICATIONS);
  }
  const existingResumes = storage.get(STORAGE_KEYS.RESUME_LIST);
  if (!existingResumes || existingResumes.length === 0) {
    storage.set(STORAGE_KEYS.RESUME_LIST, mockData.MOCK_RESUME_LIST);
  }
  const existingFavorites = storage.get(STORAGE_KEYS.JOB_FAVORITES);
  if (!existingFavorites) {
    storage.set(STORAGE_KEYS.JOB_FAVORITES, []);
  }
  jobRecruitmentInitialized = true;
}

function getJobList(filters = {}) {
  let list = storage.getList(STORAGE_KEYS.JOB_LIST);

  if (filters.type && filters.type !== 'all') {
    list = list.filter(item => item.type === filters.type);
  }
  if (filters.industry && filters.industry !== 'all') {
    list = list.filter(item => item.industry === filters.industry);
  }
  if (filters.grade && filters.grade !== 'all') {
    list = list.filter(item => item.gradeRequirement && item.gradeRequirement.includes(filters.grade));
  }
  if (filters.convertible && filters.convertible !== 'all') {
    const isConvertible = filters.convertible === 'yes';
    list = list.filter(item => item.convertible === isConvertible);
  }
  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['title', 'company', 'location', 'description']);
  }
  if (filters.sort) {
    const sortOption = constants.JOB_SORT_OPTIONS.find(s => s.value === filters.sort);
    if (sortOption) {
      list = sortList(list, sortOption.field, sortOption.order);
    }
  }

  return list;
}

function getJobDetail(id) {
  const list = storage.getList(STORAGE_KEYS.JOB_LIST);
  const job = list.find(item => item.id === id);
  if (job) {
    job.views = (job.views || 0) + 1;
    storage.updateInList(STORAGE_KEYS.JOB_LIST, id, { views: job.views });
  }
  return job || null;
}

function toggleJobFavorite(jobId) {
  const favorites = storage.getList(STORAGE_KEYS.JOB_FAVORITES);
  const index = favorites.findIndex(item => item.jobId === jobId);
  let isFavorited = false;

  if (index > -1) {
    favorites.splice(index, 1);
    isFavorited = false;
  } else {
    favorites.unshift({
      jobId,
      createTime: Date.now()
    });
    isFavorited = true;
  }

  storage.set(STORAGE_KEYS.JOB_FAVORITES, favorites);
  return isFavorited;
}

function isJobFavorited(jobId) {
  const favorites = storage.getList(STORAGE_KEYS.JOB_FAVORITES);
  return favorites.some(item => item.jobId === jobId);
}

function getFavoriteJobs() {
  const favorites = storage.getList(STORAGE_KEYS.JOB_FAVORITES);
  const jobs = storage.getList(STORAGE_KEYS.JOB_LIST);
  return favorites.map(fav => {
    const job = jobs.find(j => j.id === fav.jobId);
    return job ? { ...job, favoriteTime: fav.createTime } : null;
  }).filter(Boolean);
}

function submitJobApplication(applicationData) {
  const application = {
    id: 'app_' + Date.now(),
    ...applicationData,
    status: 'pending',
    applyTime: Date.now(),
    updateTime: Date.now(),
    timeline: [
      { status: 'pending', time: Date.now(), remark: '简历已投递' }
    ]
  };

  storage.addToList(STORAGE_KEYS.JOB_APPLICATIONS, application);

  const jobList = storage.getList(STORAGE_KEYS.JOB_LIST);
  const jobIndex = jobList.findIndex(j => j.id === applicationData.jobId);
  if (jobIndex > -1) {
    jobList[jobIndex].applyCount = (jobList[jobIndex].applyCount || 0) + 1;
    storage.set(STORAGE_KEYS.JOB_LIST, jobList);
  }

  return application;
}

function getMyJobApplications(filters = {}) {
  let list = storage.getList(STORAGE_KEYS.JOB_APPLICATIONS);

  if (filters.status && filters.status !== 'all') {
    list = list.filter(item => item.status === filters.status);
  }

  list.sort((a, b) => b.applyTime - a.applyTime);
  return list;
}

function getJobApplicationDetail(id) {
  const list = storage.getList(STORAGE_KEYS.JOB_APPLICATIONS);
  return list.find(item => item.id === id) || null;
}

function getReferralCodeList(filters = {}) {
  let list = storage.getList(STORAGE_KEYS.REFERRAL_CODE_LIST);

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['company', 'position', 'code', 'description']);
  }

  list = list.filter(item => {
    if (item.status === 'expired') return false;
    if (item.expireTime && item.expireTime < Date.now()) {
      storage.updateInList(STORAGE_KEYS.REFERRAL_CODE_LIST, item.id, { status: 'expired' });
      return false;
    }
    return true;
  });

  return list;
}

function getReferralCodeDetail(id) {
  const list = storage.getList(STORAGE_KEYS.REFERRAL_CODE_LIST);
  return list.find(item => item.id === id) || null;
}

function useReferralCode(id) {
  const list = storage.getList(STORAGE_KEYS.REFERRAL_CODE_LIST);
  const index = list.findIndex(item => item.id === id);
  if (index > -1) {
    list[index].usageCount = (list[index].usageCount || 0) + 1;
    storage.set(STORAGE_KEYS.REFERRAL_CODE_LIST, list);
    return true;
  }
  return false;
}

function getCareerTalkList(filters = {}) {
  let list = storage.getList(STORAGE_KEYS.CAREER_TALK_LIST);

  if (filters.type && filters.type !== 'all') {
    list = list.filter(item => item.type === filters.type);
  }
  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['title', 'company', 'description', 'location']);
  }

  list.sort((a, b) => {
    const dateA = new Date(a.date + ' ' + a.startTime).getTime();
    const dateB = new Date(b.date + ' ' + b.startTime).getTime();
    return dateA - dateB;
  });

  return list;
}

function getCareerTalkDetail(id) {
  const list = storage.getList(STORAGE_KEYS.CAREER_TALK_LIST);
  return list.find(item => item.id === id) || null;
}

function registerCareerTalk(id) {
  const list = storage.getList(STORAGE_KEYS.CAREER_TALK_LIST);
  const index = list.findIndex(item => item.id === id);
  if (index > -1 && (list[index].registerCount || 0) < (list[index].maxCount || Infinity)) {
    list[index].registerCount = (list[index].registerCount || 0) + 1;
    storage.set(STORAGE_KEYS.CAREER_TALK_LIST, list);
    return true;
  }
  return false;
}

function syncTalkToCalendar(id) {
  const list = storage.getList(STORAGE_KEYS.CAREER_TALK_LIST);
  const index = list.findIndex(item => item.id === id);
  if (index > -1) {
    list[index].syncToCalendar = true;
    storage.set(STORAGE_KEYS.CAREER_TALK_LIST, list);

    const syncList = storage.getList(STORAGE_KEYS.CALENDAR_SYNC_LIST);
    if (!syncList.some(item => item.eventId === id)) {
      syncList.unshift({
        eventId: id,
        eventType: 'career_talk',
        title: list[index].title,
        startTime: new Date(list[index].date + ' ' + list[index].startTime).getTime(),
        endTime: new Date(list[index].date + ' ' + list[index].endTime).getTime(),
        location: list[index].location,
        syncTime: Date.now(),
        status: 'synced'
      });
      storage.set(STORAGE_KEYS.CALENDAR_SYNC_LIST, syncList);
    }
    return true;
  }
  return false;
}

function getSyncedCalendarEvents() {
  return storage.getList(STORAGE_KEYS.CALENDAR_SYNC_LIST);
}

function getResumeList() {
  return storage.getList(STORAGE_KEYS.RESUME_LIST);
}

function saveResume(resumeData) {
  const resume = {
    id: 'resume_' + Date.now(),
    ...resumeData,
    uploadTime: Date.now()
  };
  storage.addToList(STORAGE_KEYS.RESUME_LIST, resume);
  return resume;
}

function deleteResume(id) {
  return storage.removeFromList(STORAGE_KEYS.RESUME_LIST, id);
}

let repairInitialized = false;

function initRepairData() {
  if (repairInitialized) return;
  const existingOrders = storage.get(STORAGE_KEYS.REPAIR_ORDER_LIST);
  if (!existingOrders) {
    storage.set(STORAGE_KEYS.REPAIR_ORDER_LIST, []);
  }
  const existingWorkers = storage.get(STORAGE_KEYS.REPAIR_WORKER_LIST);
  if (!existingWorkers || existingWorkers.length === 0) {
    const mockWorkers = [
      { id: 'worker_1', name: '张师傅', phone: '13800138001', specialty: ['water_electric', 'air_conditioner'], avatar: '', rating: 4.8, orderCount: 126 },
      { id: 'worker_2', name: '李师傅', phone: '13800138002', specialty: ['door_window', 'furniture'], avatar: '', rating: 4.6, orderCount: 98 },
      { id: 'worker_3', name: '王师傅', phone: '13800138003', specialty: ['network', 'water_electric'], avatar: '', rating: 4.9, orderCount: 156 }
    ];
    storage.set(STORAGE_KEYS.REPAIR_WORKER_LIST, mockWorkers);
  }
  repairInitialized = true;
}

function createRepairOrder(orderData) {
  initRepairData();
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};

  const order = {
    id: 'repair_' + Date.now(),
    orderNo: 'BX' + Date.now().toString().slice(-8),
    ...orderData,
    userId: userInfo.id || 'anonymous',
    userName: userInfo.nickName || '匿名用户',
    userPhone: userInfo.phone || '',
    userAvatar: userInfo.avatarUrl || '',
    status: 'pending',
    createTime: Date.now(),
    updateTime: Date.now(),
    timeline: [
      { status: 'pending', time: Date.now(), remark: '工单已提交，等待维修工接单' }
    ]
  };

  storage.addToList(STORAGE_KEYS.REPAIR_ORDER_LIST, order);
  return order;
}

function getRepairOrderList(filters = {}) {
  initRepairData();
  let list = storage.getList(STORAGE_KEYS.REPAIR_ORDER_LIST);

  if (filters.userId) {
    list = list.filter(item => item.userId === filters.userId);
  }

  if (filters.workerId) {
    list = list.filter(item => item.workerId === filters.workerId);
  }

  if (filters.status && filters.status !== 'all') {
    if (filters.status === 'processing') {
      list = list.filter(item => item.status === 'accepted' || item.status === 'in_progress');
    } else if (filters.status === 'urgent') {
      list = list.filter(item => item.isUrgent === true && (item.status === 'pending' || item.status === 'accepted'));
    } else {
      list = list.filter(item => item.status === filters.status);
    }
  }

  if (filters.type && filters.type !== 'all') {
    list = list.filter(item => item.type === filters.type);
  }

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['orderNo', 'dormitoryNo', 'description']);
  }

  list.sort((a, b) => {
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;
    return b.createTime - a.createTime;
  });

  return list.map(order => {
    const typeInfo = constants.REPAIR_TYPE_MAP[order.type] || {};
    const statusInfo = constants.REPAIR_ORDER_STATUS_MAP[order.status] || {};
    return {
      ...order,
      typeLabel: typeInfo.label || order.type,
      typeIcon: typeInfo.icon || '🔧',
      typeColor: typeInfo.color || '#666',
      typeGradient: typeInfo.gradient || '',
      statusLabel: statusInfo.label || order.status,
      statusColor: statusInfo.color || '#666',
      statusIcon: statusInfo.icon || '📋'
    };
  });
}

function getRepairOrderDetail(id) {
  initRepairData();
  const list = storage.getList(STORAGE_KEYS.REPAIR_ORDER_LIST);
  const order = list.find(item => item.id === id);
  if (!order) return null;

  const typeInfo = constants.REPAIR_TYPE_MAP[order.type] || {};
  const statusInfo = constants.REPAIR_ORDER_STATUS_MAP[order.status] || {};
  const urgentInfo = order.isUrgent ? (constants.REPAIR_URGENT_TYPES.find(u => u.value === order.urgentType) || {}) : {};

  let workerInfo = null;
  if (order.workerId) {
    const workers = storage.getList(STORAGE_KEYS.REPAIR_WORKER_LIST);
    workerInfo = workers.find(w => w.id === order.workerId) || null;
  }

  return {
    ...order,
    typeLabel: typeInfo.label || order.type,
    typeIcon: typeInfo.icon || '🔧',
    typeColor: typeInfo.color || '#666',
    typeGradient: typeInfo.gradient || '',
    statusLabel: statusInfo.label || order.status,
    statusColor: statusInfo.color || '#666',
    statusIcon: statusInfo.icon || '📋',
    urgentLabel: urgentInfo.label || '',
    urgentIcon: urgentInfo.icon || '',
    workerInfo
  };
}

function acceptRepairOrder(orderId, workerId) {
  initRepairData();
  const list = storage.getList(STORAGE_KEYS.REPAIR_ORDER_LIST);
  const index = list.findIndex(item => item.id === orderId);
  if (index === -1) return { success: false, error: '工单不存在' };
  if (list[index].status !== 'pending') return { success: false, error: '工单已被接单' };

  const workers = storage.getList(STORAGE_KEYS.REPAIR_WORKER_LIST);
  const worker = workers.find(w => w.id === workerId);

  list[index].status = 'accepted';
  list[index].workerId = workerId;
  list[index].workerName = worker ? worker.name : '维修工';
  list[index].workerPhone = worker ? worker.phone : '';
  list[index].acceptTime = Date.now();
  list[index].updateTime = Date.now();
  list[index].timeline = [
    ...(list[index].timeline || []),
    { status: 'accepted', time: Date.now(), remark: `${worker ? worker.name : '维修工'}已接单` }
  ];

  storage.set(STORAGE_KEYS.REPAIR_ORDER_LIST, list);
  return { success: true, order: list[index] };
}

function startRepairOrder(orderId) {
  initRepairData();
  const list = storage.getList(STORAGE_KEYS.REPAIR_ORDER_LIST);
  const index = list.findIndex(item => item.id === orderId);
  if (index === -1) return { success: false, error: '工单不存在' };
  if (list[index].status !== 'accepted') return { success: false, error: '当前状态不可开始维修' };

  list[index].status = 'in_progress';
  list[index].startTime = Date.now();
  list[index].updateTime = Date.now();
  list[index].timeline = [
    ...(list[index].timeline || []),
    { status: 'in_progress', time: Date.now(), remark: '已到达现场，开始维修' }
  ];

  storage.set(STORAGE_KEYS.REPAIR_ORDER_LIST, list);
  return { success: true, order: list[index] };
}

function completeRepairOrder(orderId, remark = '') {
  initRepairData();
  const list = storage.getList(STORAGE_KEYS.REPAIR_ORDER_LIST);
  const index = list.findIndex(item => item.id === orderId);
  if (index === -1) return { success: false, error: '工单不存在' };
  if (list[index].status !== 'in_progress') return { success: false, error: '当前状态不可完工' };

  list[index].status = 'completed';
  list[index].completeTime = Date.now();
  list[index].completeRemark = remark;
  list[index].updateTime = Date.now();
  list[index].timeline = [
    ...(list[index].timeline || []),
    { status: 'completed', time: Date.now(), remark: remark ? `维修完成：${remark}` : '维修完成，请确认' }
  ];

  storage.set(STORAGE_KEYS.REPAIR_ORDER_LIST, list);
  return { success: true, order: list[index] };
}

function rateRepairOrder(orderId, ratingData) {
  initRepairData();
  const list = storage.getList(STORAGE_KEYS.REPAIR_ORDER_LIST);
  const index = list.findIndex(item => item.id === orderId);
  if (index === -1) return { success: false, error: '工单不存在' };
  if (list[index].status !== 'completed') return { success: false, error: '当前状态不可评价' };

  list[index].status = 'rated';
  list[index].rating = ratingData.rating;
  list[index].ratingTags = ratingData.tags || [];
  list[index].ratingComment = ratingData.comment || '';
  list[index].ratingTime = Date.now();
  list[index].updateTime = Date.now();
  list[index].timeline = [
    ...(list[index].timeline || []),
    { status: 'rated', time: Date.now(), remark: '用户已确认并评价' }
  ];

  if (list[index].workerId) {
    const workers = storage.getList(STORAGE_KEYS.REPAIR_WORKER_LIST);
    const workerIndex = workers.findIndex(w => w.id === list[index].workerId);
    if (workerIndex > -1) {
      const oldRating = workers[workerIndex].rating || 5;
      const oldCount = workers[workerIndex].orderCount || 0;
      workers[workerIndex].rating = Number(((oldRating * oldCount + ratingData.rating) / (oldCount + 1)).toFixed(1));
      workers[workerIndex].orderCount = oldCount + 1;
      storage.set(STORAGE_KEYS.REPAIR_WORKER_LIST, workers);
    }
  }

  storage.set(STORAGE_KEYS.REPAIR_ORDER_LIST, list);
  return { success: true, order: list[index] };
}

function cancelRepairOrder(orderId, reason = '') {
  initRepairData();
  const list = storage.getList(STORAGE_KEYS.REPAIR_ORDER_LIST);
  const index = list.findIndex(item => item.id === orderId);
  if (index === -1) return { success: false, error: '工单不存在' };
  if (list[index].status === 'completed' || list[index].status === 'rated' || list[index].status === 'in_progress') {
    return { success: false, error: '当前状态不可取消' };
  }

  list[index].status = 'cancelled';
  list[index].cancelReason = reason;
  list[index].cancelTime = Date.now();
  list[index].updateTime = Date.now();
  list[index].timeline = [
    ...(list[index].timeline || []),
    { status: 'cancelled', time: Date.now(), remark: reason ? `工单已取消：${reason}` : '工单已取消' }
  ];

  storage.set(STORAGE_KEYS.REPAIR_ORDER_LIST, list);
  return { success: true, order: list[index] };
}

function getRepairWorkerList(specialty = '') {
  initRepairData();
  let list = storage.getList(STORAGE_KEYS.REPAIR_WORKER_LIST);
  if (specialty) {
    list = list.filter(w => (w.specialty || []).includes(specialty));
  }
  return list;
}

function getRepairOrderStats(userId = '', workerId = '') {
  const list = getRepairOrderList({});
  let filtered = list;
  if (userId) filtered = list.filter(o => o.userId === userId);
  if (workerId) filtered = list.filter(o => o.workerId === workerId);

  return {
    total: filtered.length,
    pending: filtered.filter(o => o.status === 'pending').length,
    processing: filtered.filter(o => o.status === 'accepted' || o.status === 'in_progress').length,
    completed: filtered.filter(o => o.status === 'rated' || o.status === 'completed').length,
    urgent: filtered.filter(o => o.isUrgent && (o.status === 'pending' || o.status === 'accepted')).length
  };
}

function getMyRepairOrders(userId, status = 'all') {
  return getRepairOrderList({ userId, status });
}

function getAdminRepairOrders(status = 'all', type = 'all') {
  return getRepairOrderList({ status, type });
}

// ==================== 校园班车 ====================

function initBusData() {
  if (busDataInitialized) return;
  const existingRoutes = storage.get(STORAGE_KEYS.BUS_ROUTE_LIST);
  const existingVehicles = storage.get(STORAGE_KEYS.BUS_VEHICLE_LIST);

  if (!existingRoutes || existingRoutes.length === 0) {
    const now = Date.now();
    const routes = mockData.MOCK_BUS_ROUTES.map((item, index) => ({
      id: 'mock_bus_route_' + index + '_' + now,
      ...item,
      createTime: now,
      updateTime: now
    }));
    storage.set(STORAGE_KEYS.BUS_ROUTE_LIST, routes);
  }

  if (!existingVehicles || existingVehicles.length === 0) {
    const routes = storage.getList(STORAGE_KEYS.BUS_ROUTE_LIST);
    const vehicles = mockData.MOCK_BUS_VEHICLES.map((item, index) => ({
      id: 'mock_bus_vehicle_' + index + '_' + Date.now(),
      ...item,
      routeId: routes[index % routes.length] ? routes[index % routes.length].id : item.routeId,
      lastUpdateTime: Date.now()
    }));
    storage.set(STORAGE_KEYS.BUS_VEHICLE_LIST, vehicles);
  }

  busDataInitialized = true;
}

function getBusRouteList(filters = {}) {
  initBusData();
  let list = storage.getList(STORAGE_KEYS.BUS_ROUTE_LIST);

  if (filters.type && filters.type !== 'all') {
    if (filters.type === 'favorite') {
      const favoriteIds = getFavoriteBusRouteIds();
      list = list.filter(item => favoriteIds.includes(item.id));
    } else {
      list = list.filter(item => item.type === filters.type);
    }
  }

  if (filters.keyword) {
    list = filterByKeyword(list, filters.keyword, ['name', 'description', 'stations.name']);
  }

  return list;
}

function getBusRouteDetail(id) {
  initBusData();
  const list = storage.getList(STORAGE_KEYS.BUS_ROUTE_LIST);
  return list.find(item => item.id === id) || null;
}

function getBusVehicles(routeId) {
  initBusData();
  let list = storage.getList(STORAGE_KEYS.BUS_VEHICLE_LIST);
  if (routeId) {
    list = list.filter(item => item.routeId === routeId);
  }
  return list;
}

function updateVehiclePosition() {
  initBusData();
  const vehicles = storage.getList(STORAGE_KEYS.BUS_VEHICLE_LIST);
  const routes = storage.getList(STORAGE_KEYS.BUS_ROUTE_LIST);

  const updatedVehicles = vehicles.map(vehicle => {
    const route = routes.find(r => r.id === vehicle.routeId);
    if (!route || !route.stations || vehicle.status !== 'running') {
      return { ...vehicle, lastUpdateTime: Date.now() };
    }

    const stationCount = route.stations.length;
    let nextStationIndex = vehicle.currentStationIndex + 1;

    if (nextStationIndex >= stationCount) {
      nextStationIndex = 0;
    }

    const moveChance = Math.random();
    if (moveChance > 0.6) {
      const currentStation = route.stations[vehicle.currentStationIndex];
      const nextStation = route.stations[nextStationIndex];

      const latDiff = (nextStation.latitude - currentStation.latitude) * 0.3;
      const lngDiff = (nextStation.longitude - currentStation.longitude) * 0.3;

      let newLat = vehicle.latitude + latDiff;
      let newLng = vehicle.longitude + lngDiff;

      const distToNext = Math.sqrt(
        Math.pow(nextStation.latitude - newLat, 2) +
        Math.pow(nextStation.longitude - newLng, 2)
      );

      let newStationIndex = vehicle.currentStationIndex;
      if (distToNext < 0.0005) {
        newStationIndex = nextStationIndex;
        newLat = nextStation.latitude;
        newLng = nextStation.longitude;
      }

      return {
        ...vehicle,
        currentStationIndex: newStationIndex,
        latitude: newLat,
        longitude: newLng,
        lastUpdateTime: Date.now()
      };
    }

    return { ...vehicle, lastUpdateTime: Date.now() };
  });

  storage.set(STORAGE_KEYS.BUS_VEHICLE_LIST, updatedVehicles);
  return updatedVehicles;
}

function calculateArrivalTime(routeId, stationIndex) {
  initBusData();
  const vehicles = getBusVehicles(routeId);
  const route = getBusRouteDetail(routeId);

  if (!route || !route.stations) return [];

  const stationCount = route.stations.length;
  const interval = route.interval || 10;

  return vehicles.map(vehicle => {
    if (vehicle.status !== 'running') {
      return {
        vehicleId: vehicle.id,
        plateNumber: vehicle.plateNumber,
        status: vehicle.status,
        arrivalMinutes: null
      };
    }

    let stationsAway = stationIndex - vehicle.currentStationIndex;
    if (stationsAway < 0) {
      stationsAway += stationCount;
    }

    const arrivalMinutes = Math.max(1, stationsAway * interval);

    return {
      vehicleId: vehicle.id,
      plateNumber: vehicle.plateNumber,
      status: vehicle.status,
      currentStation: route.stations[vehicle.currentStationIndex]?.name || '',
      currentStationIndex: vehicle.currentStationIndex,
      stationsAway,
      arrivalMinutes,
      arrivalText: arrivalMinutes <= 1 ? '即将到站' : arrivalMinutes + '分钟',
      latitude: vehicle.latitude,
      longitude: vehicle.longitude
    };
  }).sort((a, b) => (a.arrivalMinutes || 999) - (b.arrivalMinutes || 999));
}

function getFavoriteBusRouteIds() {
  return storage.get(STORAGE_KEYS.FAVORITE_BUS_ROUTES) || [];
}

function getFavoriteBusRoutes() {
  const ids = getFavoriteBusRouteIds();
  if (ids.length === 0) return [];

  const allRoutes = getBusRouteList();
  return allRoutes.filter(route => ids.includes(route.id));
}

function isFavoriteBusRoute(routeId) {
  const ids = getFavoriteBusRouteIds();
  return ids.includes(routeId);
}

function toggleFavoriteBusRoute(routeId) {
  const ids = getFavoriteBusRouteIds();
  const index = ids.indexOf(routeId);

  if (index > -1) {
    ids.splice(index, 1);
    storage.set(STORAGE_KEYS.FAVORITE_BUS_ROUTES, ids);
    return { favorited: false };
  } else {
    ids.push(routeId);
    storage.set(STORAGE_KEYS.FAVORITE_BUS_ROUTES, ids);
    return { favorited: true };
  }
}

function getArrivalReminders() {
  return storage.get(STORAGE_KEYS.BUS_ARRIVAL_REMINDERS) || [];
}

function setArrivalReminder(routeId, stationIndex, remindBeforeMinutes) {
  const reminders = getArrivalReminders();

  const existingIndex = reminders.findIndex(
    r => r.routeId === routeId && r.stationIndex === stationIndex
  );

  if (remindBeforeMinutes === 0) {
    if (existingIndex > -1) {
      reminders.splice(existingIndex, 1);
    }
    storage.set(STORAGE_KEYS.BUS_ARRIVAL_REMINDERS, reminders);
    return { enabled: false };
  }

  const reminder = {
    id: 'bus_reminder_' + Date.now(),
    routeId,
    stationIndex,
    remindBeforeMinutes,
    enabled: true,
    createTime: Date.now()
  };

  if (existingIndex > -1) {
    reminders[existingIndex] = { ...reminders[existingIndex], ...reminder };
  } else {
    reminders.push(reminder);
  }

  storage.set(STORAGE_KEYS.BUS_ARRIVAL_REMINDERS, reminders);
  return { enabled: true, reminder };
}

function getArrivalReminder(routeId, stationIndex) {
  const reminders = getArrivalReminders();
  return reminders.find(r => r.routeId === routeId && r.stationIndex === stationIndex) || null;
}

function checkAndTriggerReminders() {
  const reminders = getArrivalReminders().filter(r => r.enabled);
  const triggered = [];

  reminders.forEach(reminder => {
    const arrivalInfo = calculateArrivalTime(reminder.routeId, reminder.stationIndex);
    const nearest = arrivalInfo[0];

    if (nearest && nearest.arrivalMinutes && nearest.arrivalMinutes <= reminder.remindBeforeMinutes) {
      const route = getBusRouteDetail(reminder.routeId);
      const station = route?.stations?.[reminder.stationIndex];

      triggered.push({
        reminder,
        route,
        station,
        arrivalInfo: nearest
      });
    }
  });

  return triggered;
}

Object.assign(module.exports, {
  initRepairData,
  createRepairOrder,
  getRepairOrderList,
  getRepairOrderDetail,
  acceptRepairOrder,
  startRepairOrder,
  completeRepairOrder,
  rateRepairOrder,
  cancelRepairOrder,
  getRepairWorkerList,
  getRepairOrderStats,
  getMyRepairOrders,
  getAdminRepairOrders
});

Object.assign(module.exports, {
  initBusData,
  getBusRouteList,
  getBusRouteDetail,
  getBusVehicles,
  updateVehiclePosition,
  calculateArrivalTime,
  getFavoriteBusRouteIds,
  getFavoriteBusRoutes,
  isFavoriteBusRoute,
  toggleFavoriteBusRoute,
  getArrivalReminders,
  setArrivalReminder,
  getArrivalReminder,
  checkAndTriggerReminders
});

// ==================== 图书馆服务模块 ====================

function initLibraryBooks() {
  if (libraryBooksInitialized) return;
  const existing = storage.get(STORAGE_KEYS.LIBRARY_BOOK_LIST);
  if (!existing || existing.length === 0) {
    const books = mockData.MOCK_LIBRARY_BOOKS.map(item => ({
      id: item.id,
      ...item
    }));
    storage.set(STORAGE_KEYS.LIBRARY_BOOK_LIST, books);
  }
  libraryBooksInitialized = true;
}

function initLibraryBorrowRecords() {
  if (libraryBorrowInitialized) return;
  const existing = storage.get(STORAGE_KEYS.LIBRARY_BORROW_LIST);
  if (!existing || existing.length === 0) {
    const records = mockData.MOCK_LIBRARY_BORROW_RECORDS.map(item => ({
      id: item.id,
      ...item
    }));
    storage.set(STORAGE_KEYS.LIBRARY_BORROW_LIST, records);
  }
  libraryBorrowInitialized = true;
}

function initLibraryReadingRooms() {
  if (libraryRoomsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.LIBRARY_READING_ROOM_LIST);
  if (!existing || existing.length === 0) {
    const rooms = mockData.MOCK_LIBRARY_READING_ROOMS.map(item => ({
      id: item.id,
      ...item
    }));
    storage.set(STORAGE_KEYS.LIBRARY_READING_ROOM_LIST, rooms);
  }
  libraryRoomsInitialized = true;
}

function initLibrarySeats() {
  if (librarySeatsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.LIBRARY_SEAT_LIST);
  if (!existing || existing.length === 0) {
    const seats = mockData.MOCK_LIBRARY_SEATS.map(item => ({
      id: item.id,
      ...item
    }));
    storage.set(STORAGE_KEYS.LIBRARY_SEAT_LIST, seats);
  }
  librarySeatsInitialized = true;
}

function initLibrarySeatReservations() {
  if (librarySeatReservationsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.LIBRARY_SEAT_RESERVATION_LIST);
  if (!existing || existing.length === 0) {
    const reservations = mockData.MOCK_LIBRARY_SEAT_RESERVATIONS.map(item => ({
      id: item.id,
      ...item
    }));
    storage.set(STORAGE_KEYS.LIBRARY_SEAT_RESERVATION_LIST, reservations);
  }
  librarySeatReservationsInitialized = true;
}

function initLibraryRecommendations() {
  if (libraryRecommendationsInitialized) return;
  const existing = storage.get(STORAGE_KEYS.LIBRARY_RECOMMEND_LIST);
  if (!existing || existing.length === 0) {
    const recommendations = mockData.MOCK_LIBRARY_RECOMMENDATIONS.map(item => ({
      id: item.id,
      ...item
    }));
    storage.set(STORAGE_KEYS.LIBRARY_RECOMMEND_LIST, recommendations);
  }
  libraryRecommendationsInitialized = true;
}

function initAllLibraryData() {
  initLibraryBooks();
  initLibraryBorrowRecords();
  initLibraryReadingRooms();
  initLibrarySeats();
  initLibrarySeatReservations();
  initLibraryRecommendations();
}

// ---------- 馆藏检索 ----------

function getLibraryBookList(filters = {}) {
  initLibraryBooks();
  let list = storage.getList(STORAGE_KEYS.LIBRARY_BOOK_LIST);

  if (filters.category && filters.category !== 'all') {
    list = list.filter(item => item.category === filters.category);
  }

  if (filters.keyword) {
    const keyword = filters.keyword.trim().toLowerCase();
    list = list.filter(item =>
      item.title.toLowerCase().includes(keyword) ||
      (item.author && item.author.toLowerCase().includes(keyword)) ||
      (item.isbn && item.isbn.includes(keyword)) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(keyword)) ||
      (item.publisher && item.publisher.toLowerCase().includes(keyword))
    );
  }

  if (filters.sort === 'views') {
    list = list.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else if (filters.sort === 'available') {
    list = list.sort((a, b) => (b.availableCopies || 0) - (a.availableCopies || 0));
  }

  return list;
}

function getLibraryBookDetail(id) {
  initLibraryBooks();
  const list = storage.getList(STORAGE_KEYS.LIBRARY_BOOK_LIST);
  const book = list.find(item => item.id === id) || null;
  if (book) {
    book.statusInfo = book.availableCopies > 0
      ? constants.LIBRARY_BOOK_STATUS_MAP['available']
      : constants.LIBRARY_BOOK_STATUS_MAP['borrowed'];
  }
  return book;
}

function increaseLibraryBookViews(id) {
  initLibraryBooks();
  const list = storage.getList(STORAGE_KEYS.LIBRARY_BOOK_LIST);
  const index = list.findIndex(item => item.id === id);
  if (index > -1) {
    list[index].views = (list[index].views || 0) + 1;
    storage.set(STORAGE_KEYS.LIBRARY_BOOK_LIST, list);
  }
}

function getLibraryBookCategories() {
  return constants.LIBRARY_BOOK_CATEGORIES;
}

// ---------- 我的借阅 ----------

function getMyBorrowList(userId, filters = {}) {
  initLibraryBorrowRecords();
  let list = storage.getList(STORAGE_KEYS.LIBRARY_BORROW_LIST);
  list = list.filter(item => item.userId === userId);

  const now = Date.now();
  list = list.map(item => {
    const status = item.status;
    let finalStatus = status;
    if (!item.returnDate && now > (item.dueDate || 0) && status !== 'returned' && status !== 'overdue') {
      finalStatus = 'overdue';
    }
    const statusInfo = constants.LIBRARY_BORROW_STATUS_MAP[finalStatus] || {};
    const daysLeft = item.dueDate ? Math.ceil((item.dueDate - now) / 86400000) : 0;
    return {
      ...item,
      displayStatus: finalStatus,
      statusInfo,
      daysLeft,
      isOverdue: finalStatus === 'overdue'
    };
  });

  if (filters.tab === 'current') {
    list = list.filter(item => !item.returnDate || item.status === 'overdue');
  } else if (filters.tab === 'history') {
    list = list.filter(item => item.returnDate && item.status === 'returned');
  }

  list = list.sort((a, b) => (b.createTime || 0) - (a.createTime || 0));
  return list;
}

function getBorrowRecordDetail(id) {
  initLibraryBorrowRecords();
  const list = storage.getList(STORAGE_KEYS.LIBRARY_BORROW_LIST);
  const record = list.find(item => item.id === id) || null;
  if (record) {
    record.statusInfo = constants.LIBRARY_BORROW_STATUS_MAP[record.status] || {};
  }
  return record;
}

function renewBorrowRecord(id) {
  initLibraryBorrowRecords();
  const list = storage.getList(STORAGE_KEYS.LIBRARY_BORROW_LIST);
  const index = list.findIndex(item => item.id === id);
  if (index > -1) {
    const record = list[index];
    if (record.renewCount >= record.maxRenewCount) {
      return { success: false, message: '已达到最大续借次数' };
    }
    if (record.status === 'overdue') {
      return { success: false, message: '逾期图书不可续借' };
    }
    const newDueDate = (record.dueDate || Date.now()) + 30 * 86400000;
    list[index] = {
      ...record,
      dueDate: newDueDate,
      renewCount: (record.renewCount || 0) + 1,
      status: 'renewed',
      updateTime: Date.now()
    };
    storage.set(STORAGE_KEYS.LIBRARY_BORROW_LIST, list);
    return { success: true, record: list[index], newDueDate };
  }
  return { success: false, message: '借阅记录不存在' };
}

function getBorrowSummary(userId) {
  const allRecords = getMyBorrowList(userId);
  const current = allRecords.filter(item => !item.returnDate && item.displayStatus !== 'overdue');
  const overdue = allRecords.filter(item => item.displayStatus === 'overdue');
  const history = allRecords.filter(item => item.returnDate);
  const canRenew = current.filter(item =>
    (item.renewCount || 0) < (item.maxRenewCount || 2) && item.daysLeft <= 7
  );

  return {
    totalBorrowed: allRecords.length,
    currentCount: current.length,
    overdueCount: overdue.length,
    historyCount: history.length,
    canRenewCount: canRenew.length,
    overdueFeeTotal: overdue.reduce((sum, item) => sum + (item.overdueFee || 0), 0)
  };
}

// ---------- 座位预约 ----------

function getLibraryReadingRoomList(filters = {}) {
  initLibraryReadingRooms();
  initLibrarySeats();
  let list = storage.getList(STORAGE_KEYS.LIBRARY_READING_ROOM_LIST);

  if (filters.type && filters.type !== 'all') {
    list = list.filter(item => item.type === filters.type);
  }

  const allSeats = storage.getList(STORAGE_KEYS.LIBRARY_SEAT_LIST);
  list = list.map(room => {
    const roomSeats = allSeats.filter(s => s.roomId === room.id);
    const availableCount = roomSeats.filter(s => s.status === 'available').length;
    return {
      ...room,
      availableCount,
      totalCount: roomSeats.length,
      occupancyRate: roomSeats.length > 0
        ? Math.round(((roomSeats.length - availableCount) / roomSeats.length) * 100)
        : 0
    };
  });

  return list;
}

function getLibraryReadingRoomDetail(id) {
  initLibraryReadingRooms();
  const list = storage.getList(STORAGE_KEYS.LIBRARY_READING_ROOM_LIST);
  return list.find(item => item.id === id) || null;
}

function getLibrarySeatList(roomId, filters = {}) {
  initLibrarySeats();
  let list = storage.getList(STORAGE_KEYS.LIBRARY_SEAT_LIST);

  if (roomId) {
    list = list.filter(item => item.roomId === roomId);
  }

  if (filters.onlyAvailable) {
    list = list.filter(item => item.status === 'available');
  }

  if (filters.hasWindow) {
    list = list.filter(item => item.hasWindow);
  }

  if (filters.hasOutlet) {
    list = list.filter(item => item.hasOutlet);
  }

  return list;
}

function getLibrarySeatDetail(id) {
  initLibrarySeats();
  const list = storage.getList(STORAGE_KEYS.LIBRARY_SEAT_LIST);
  const seat = list.find(item => item.id === id) || null;
  if (seat) {
    seat.statusInfo = constants.LIBRARY_SEAT_STATUS_MAP[seat.status] || {};
  }
  return seat;
}

function getSeatRowsAndCols(roomId) {
  const seats = getLibrarySeatList(roomId);
  const rows = {};
  seats.forEach(seat => {
    if (!rows[seat.row]) rows[seat.row] = [];
    rows[seat.row].push(seat);
  });
  Object.keys(rows).forEach(row => {
    rows[row].sort((a, b) => a.col - b.col);
  });
  return rows;
}

function createSeatReservation(params) {
  initLibrarySeatReservations();
  const { userId, roomId, roomName, seatId, seatNumber, date, timeSlot, timeSlotLabel, startTime, endTime } = params;

  const list = storage.getList(STORAGE_KEYS.LIBRARY_SEAT_RESERVATION_LIST);

  const conflict = list.find(item =>
    item.userId === userId &&
    item.status !== 'cancelled' &&
    item.status !== 'completed' &&
    item.status !== 'timeout' &&
    item.date === date &&
    (
      (timeSlot === 'full_day') ||
      (item.timeSlot === 'full_day') ||
      (item.timeSlot === timeSlot)
    )
  );

  if (conflict) {
    return { success: false, message: '该时段已有预约，不能重复预约' };
  }

  const reservation = {
    id: 'lib_res_' + util.generateId(),
    userId,
    roomId,
    roomName,
    seatId,
    seatNumber,
    date,
    timeSlot,
    timeSlotLabel,
    startTime,
    endTime,
    checkInTime: null,
    checkOutTime: null,
    status: 'pending',
    createTime: Date.now()
  };

  list.unshift(reservation);
  storage.set(STORAGE_KEYS.LIBRARY_SEAT_RESERVATION_LIST, list);

  return { success: true, reservation };
}

function getMySeatReservations(userId, filters = {}) {
  initLibrarySeatReservations();
  let list = storage.getList(STORAGE_KEYS.LIBRARY_SEAT_RESERVATION_LIST);
  list = list.filter(item => item.userId === userId);

  const now = Date.now();

  list = list.map(item => {
    let status = item.status;
    if (status === 'pending' && now > (item.startTime || 0) + 15 * 60000 && !item.checkInTime) {
      status = 'timeout';
    }
    if ((status === 'checked_in' || status === 'using') && now > (item.endTime || 0)) {
      status = 'completed';
    }
    const statusInfo = constants.LIBRARY_SEAT_RESERVATION_STATUS_MAP[status] || {};
    return {
      ...item,
      displayStatus: status,
      statusInfo,
      canCheckIn: status === 'pending',
      canCheckOut: status === 'checked_in' || status === 'using',
      canCancel: status === 'pending' || (status === 'checked_in' && now < (item.endTime || 0))
    };
  });

  if (filters.tab === 'upcoming') {
    list = list.filter(item => item.displayStatus === 'pending');
  } else if (filters.tab === 'ongoing') {
    list = list.filter(item =>
      item.displayStatus === 'checked_in' || item.displayStatus === 'using'
    );
  } else if (filters.tab === 'history') {
    list = list.filter(item =>
      item.displayStatus === 'completed' || item.displayStatus === 'timeout' || item.displayStatus === 'cancelled'
    );
  }

  list = list.sort((a, b) => (b.createTime || 0) - (a.createTime || 0));
  return list;
}

function getSeatReservationDetail(id) {
  initLibrarySeatReservations();
  const list = storage.getList(STORAGE_KEYS.LIBRARY_SEAT_RESERVATION_LIST);
  const reservation = list.find(item => item.id === id) || null;
  if (reservation) {
    reservation.statusInfo = constants.LIBRARY_SEAT_RESERVATION_STATUS_MAP[reservation.status] || {};
  }
  return reservation;
}

function checkInSeatReservation(id) {
  initLibrarySeatReservations();
  const list = storage.getList(STORAGE_KEYS.LIBRARY_SEAT_RESERVATION_LIST);
  const index = list.findIndex(item => item.id === id);
  if (index > -1) {
    const item = list[index];
    if (item.status !== 'pending') {
      return { success: false, message: '当前状态不可签到' };
    }
    const now = Date.now();
    if (now < (item.startTime || 0) - 15 * 60000) {
      return { success: false, message: '签到时间未到，请提前15分钟内签到' };
    }
    list[index] = {
      ...item,
      status: 'checked_in',
      checkInTime: now,
      updateTime: now
    };
    storage.set(STORAGE_KEYS.LIBRARY_SEAT_RESERVATION_LIST, list);
    return { success: true, reservation: list[index] };
  }
  return { success: false, message: '预约记录不存在' };
}

function checkOutSeatReservation(id) {
  initLibrarySeatReservations();
  const list = storage.getList(STORAGE_KEYS.LIBRARY_SEAT_RESERVATION_LIST);
  const index = list.findIndex(item => item.id === id);
  if (index > -1) {
    const item = list[index];
    if (item.status !== 'checked_in' && item.status !== 'using') {
      return { success: false, message: '当前状态不可签退' };
    }
    const now = Date.now();
    list[index] = {
      ...item,
      status: 'completed',
      checkOutTime: now,
      updateTime: now
    };
    storage.set(STORAGE_KEYS.LIBRARY_SEAT_RESERVATION_LIST, list);
    return { success: true, reservation: list[index] };
  }
  return { success: false, message: '预约记录不存在' };
}

function cancelSeatReservation(id) {
  initLibrarySeatReservations();
  const list = storage.getList(STORAGE_KEYS.LIBRARY_SEAT_RESERVATION_LIST);
  const index = list.findIndex(item => item.id === id);
  if (index > -1) {
    const item = list[index];
    if (item.status !== 'pending' && item.status !== 'checked_in') {
      return { success: false, message: '当前状态不可取消' };
    }
    list[index] = {
      ...item,
      status: 'cancelled',
      updateTime: Date.now()
    };
    storage.set(STORAGE_KEYS.LIBRARY_SEAT_RESERVATION_LIST, list);
    return { success: true, reservation: list[index] };
  }
  return { success: false, message: '预约记录不存在' };
}

function checkTimeoutSeatReservations(userId) {
  initLibrarySeatReservations();
  const list = storage.getList(STORAGE_KEYS.LIBRARY_SEAT_RESERVATION_LIST);
  const now = Date.now();
  let timeoutCount = 0;

  list.forEach((item, index) => {
    if (item.userId === userId && item.status === 'pending' && !item.checkInTime) {
      if (now > (item.startTime || 0) + 15 * 60000) {
        list[index] = { ...item, status: 'timeout', updateTime: now };
        timeoutCount++;
      }
    }
  });

  if (timeoutCount > 0) {
    storage.set(STORAGE_KEYS.LIBRARY_SEAT_RESERVATION_LIST, list);
  }
  return timeoutCount;
}

// ---------- 荐购反馈 ----------

function submitLibraryRecommend(params) {
  initLibraryRecommendations();
  const { userId, bookTitle, bookAuthor, isbn, publisher, category, reason, contact } = params;

  if (!bookTitle || !bookTitle.trim()) {
    return { success: false, message: '请填写书名' };
  }
  if (!bookAuthor || !bookAuthor.trim()) {
    return { success: false, message: '请填写作者' };
  }
  if (!reason || !reason.trim()) {
    return { success: false, message: '请填写荐购理由' };
  }

  const list = storage.getList(STORAGE_KEYS.LIBRARY_RECOMMEND_LIST);
  const recommend = {
    id: 'lib_rec_' + util.generateId(),
    userId,
    bookTitle: bookTitle.trim(),
    bookAuthor: bookAuthor.trim(),
    isbn: (isbn || '').trim(),
    publisher: (publisher || '').trim(),
    category: category || 'other',
    reason: reason.trim(),
    contact: (contact || '').trim(),
    status: 'submitted',
    adminReply: '',
    createTime: Date.now(),
    updateTime: Date.now()
  };

  list.unshift(recommend);
  storage.set(STORAGE_KEYS.LIBRARY_RECOMMEND_LIST, list);
  return { success: true, recommend };
}

function getMyLibraryRecommends(userId) {
  initLibraryRecommendations();
  let list = storage.getList(STORAGE_KEYS.LIBRARY_RECOMMEND_LIST);
  list = list.filter(item => item.userId === userId);

  list = list.map(item => ({
    ...item,
    statusInfo: constants.LIBRARY_RECOMMEND_STATUS_MAP[item.status] || {}
  }));

  list = list.sort((a, b) => (b.createTime || 0) - (a.createTime || 0));
  return list;
}

// ---------- 到期提醒 ----------

function checkLibraryReminders(userId) {
  const reminders = [];
  const now = Date.now();
  const threeDaysLater = now + 3 * 86400000;
  const fifteenMinutesLater = now + 15 * 60000;

  const borrowRecords = getMyBorrowList(userId, { tab: 'current' });
  borrowRecords.forEach(record => {
    if (record.dueDate && record.dueDate <= threeDaysLater && record.dueDate > now) {
      const daysUntil = Math.ceil((record.dueDate - now) / 86400000);
      reminders.push({
        type: 'borrow_due',
        typeInfo: constants.LIBRARY_REMINDER_TYPE_MAP['borrow_due'],
        title: '借书即将到期',
        content: `《${record.bookTitle}》将于${daysUntil}天后到期（${util.formatTime(record.dueDate, 'MM-DD')}）`,
        relatedId: record.id,
        triggerTime: record.dueDate - 3 * 86400000,
        data: record
      });
    }
    if (record.isOverdue) {
      reminders.push({
        type: 'borrow_due',
        typeInfo: constants.LIBRARY_REMINDER_TYPE_MAP['borrow_due'],
        title: '借书已逾期',
        content: `《${record.bookTitle}》已逾期${record.daysLeft * -1}天，请尽快归还`,
        relatedId: record.id,
        triggerTime: record.dueDate,
        urgent: true,
        data: record
      });
    }
  });

  const seatReservations = getMySeatReservations(userId, { tab: 'upcoming' });
  seatReservations.forEach(res => {
    if (res.startTime && res.startTime <= fifteenMinutesLater && res.startTime > now) {
      const minutesUntil = Math.ceil((res.startTime - now) / 60000);
      reminders.push({
        type: 'seat_start',
        typeInfo: constants.LIBRARY_REMINDER_TYPE_MAP['seat_start'],
        title: '座位预约即将开始',
        content: `${res.roomName} ${res.seatNumber} ${res.timeSlotLabel} 将在${minutesUntil}分钟后开始，请及时签到`,
        relatedId: res.id,
        triggerTime: res.startTime - 15 * 60000,
        data: res
      });
    }
  });

  return reminders;
}

Object.assign(module.exports, {
  initAllLibraryData,
  initLibraryBooks,
  initLibraryBorrowRecords,
  initLibraryReadingRooms,
  initLibrarySeats,
  initLibrarySeatReservations,
  initLibraryRecommendations,

  getLibraryBookList,
  getLibraryBookDetail,
  increaseLibraryBookViews,
  getLibraryBookCategories,

  getMyBorrowList,
  getBorrowRecordDetail,
  renewBorrowRecord,
  getBorrowSummary,

  getLibraryReadingRoomList,
  getLibraryReadingRoomDetail,
  getLibrarySeatList,
  getLibrarySeatDetail,
  getSeatRowsAndCols,
  createSeatReservation,
  getMySeatReservations,
  getSeatReservationDetail,
  checkInSeatReservation,
  checkOutSeatReservation,
  cancelSeatReservation,
  checkTimeoutSeatReservations,

  submitLibraryRecommend,
  getMyLibraryRecommends,

  checkLibraryReminders
});
