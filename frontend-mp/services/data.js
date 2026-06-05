/**
 * 数据服务层
 */

const storage = require('../utils/storage');
const util = require('../utils/util');
const { STORAGE_KEYS } = storage;

// ==================== 失物招领 ====================

/**
 * 获取失物招领列表
 */
function getLostFoundList(filters = {}) {
  let list = storage.getList(STORAGE_KEYS.LOST_FOUND_LIST);
  
  // 按类型筛选
  if (filters.type) {
    list = list.filter(item => item.type === filters.type);
  }
  
  // 按物品类型筛选
  if (filters.itemType) {
    list = list.filter(item => item.itemType === filters.itemType);
  }
  
  // 按关键词搜索
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    list = list.filter(item => 
      item.title.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
    );
  }
  
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
  
  // 按分类筛选
  if (filters.category) {
    list = list.filter(item => item.category === filters.category);
  }
  
  // 按价格区间筛选
  if (filters.minPrice !== undefined) {
    list = list.filter(item => item.price >= filters.minPrice);
  }
  if (filters.maxPrice !== undefined) {
    list = list.filter(item => item.price <= filters.maxPrice);
  }
  
  // 按关键词搜索
  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    list = list.filter(item => 
      item.title.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword)
    );
  }
  
  // 按状态筛选
  if (filters.status) {
    list = list.filter(item => item.status === filters.status);
  }
  
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

module.exports = {
  // 失物招领
  getLostFoundList,
  getLostFoundDetail,
  publishLostFound,
  updateLostFound,
  deleteLostFound,
  
  // 二手市场
  getMarketList,
  getMarketDetail,
  publishMarketItem,
  updateMarketItem,
  deleteMarketItem,
  increaseMarketViews,
  
  // 收藏
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  clearFavorites,
  
  // 历史
  getHistory,
  addHistory,
  clearHistory,
  removeHistory
};
