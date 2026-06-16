const storage = require('../utils/storage');
const { STORAGE_KEYS } = storage;
const util = require('../utils/util');
const constants = require('../config/constants');

function getCurrentUserId() {
  const app = getApp();
  return app.globalData.userInfo ? app.globalData.userInfo.id : null;
}

function getUserPoints(userId) {
  const uid = userId || getCurrentUserId();
  if (!uid) return 0;
  const pointsMap = storage.get(STORAGE_KEYS.USER_POINTS) || {};
  return pointsMap[uid] || 0;
}

function updateUserPoints(userId, points) {
  const uid = userId || getCurrentUserId();
  if (!uid) return { success: false, message: '用户未登录' };
  const pointsMap = storage.get(STORAGE_KEYS.USER_POINTS) || {};
  pointsMap[uid] = points;
  storage.set(STORAGE_KEYS.USER_POINTS, pointsMap);
  return { success: true, points };
}

function addPoints(userId, points, type, description, relatedId = null) {
  const uid = userId || getCurrentUserId();
  if (!uid) return { success: false, message: '用户未登录' };
  if (points <= 0) return { success: false, message: '积分必须大于0' };
  const currentPoints = getUserPoints(uid);
  const newPoints = currentPoints + points;
  updateUserPoints(uid, newPoints);
  const transaction = createTransaction(uid, type, points, 'in', currentPoints, newPoints, description, relatedId);
  return { success: true, points: newPoints, transaction };
}

function deductPoints(userId, points, type, description, relatedId = null) {
  const uid = userId || getCurrentUserId();
  if (!uid) return { success: false, message: '用户未登录' };
  if (points <= 0) return { success: false, message: '积分必须大于0' };
  const currentPoints = getUserPoints(uid);
  if (currentPoints < points) {
    return { success: false, message: '积分不足' };
  }
  const newPoints = currentPoints - points;
  updateUserPoints(uid, newPoints);
  const transaction = createTransaction(uid, type, points, 'out', currentPoints, newPoints, description, relatedId);
  return { success: true, points: newPoints, transaction };
}

function createTransaction(userId, type, points, direction, balanceBefore, balanceAfter, description, relatedId) {
  const typeInfo = constants.POINT_TRANSACTION_TYPE_MAP[type] || {};
  const transaction = {
    id: util.generateId(),
    userId,
    type,
    typeLabel: typeInfo.label || type,
    typeIcon: typeInfo.icon || '📋',
    points,
    direction,
    balanceBefore,
    balanceAfter,
    description,
    relatedId,
    createTime: Date.now(),
    expireTime: calculateExpireTime(direction)
  };
  const transactions = storage.getList(STORAGE_KEYS.POINT_TRANSACTIONS);
  transactions.unshift(transaction);
  storage.set(STORAGE_KEYS.POINT_TRANSACTIONS, transactions);
  return transaction;
}

function calculateExpireTime(direction) {
  if (direction !== 'in') return null;
  const config = constants.POINTS_VALIDITY_CONFIG;
  if (!config.enabled) return null;
  return Date.now() + config.validityDays * 24 * 60 * 60 * 1000;
}

function getTransactionList(userId, filters = {}) {
  const uid = userId || getCurrentUserId();
  if (!uid) return [];
  const allTransactions = storage.getList(STORAGE_KEYS.POINT_TRANSACTIONS);
  let userTransactions = allTransactions.filter(t => t.userId === uid);
  if (filters.type) {
    userTransactions = userTransactions.filter(t => t.type === filters.type);
  }
  if (filters.direction) {
    userTransactions = userTransactions.filter(t => t.direction === filters.direction);
  }
  if (filters.startTime) {
    userTransactions = userTransactions.filter(t => t.createTime >= filters.startTime);
  }
  if (filters.endTime) {
    userTransactions = userTransactions.filter(t => t.createTime <= filters.endTime);
  }
  return userTransactions;
}

function getTransactionStats(userId) {
  const transactions = getTransactionList(userId);
  let totalEarn = 0;
  let totalSpend = 0;
  let totalRecords = transactions.length;
  transactions.forEach(t => {
    if (t.direction === 'in') {
      totalEarn += t.points;
    } else if (t.direction === 'out') {
      totalSpend += t.points;
    }
  });
  return { totalEarn, totalSpend, totalRecords, currentPoints: getUserPoints(userId) };
}

function getCompletedTasks(userId) {
  const uid = userId || getCurrentUserId();
  if (!uid) return [];
  const completedTasks = storage.get(STORAGE_KEYS.POINT_COMPLETED_TASKS) || {};
  return completedTasks[uid] || [];
}

function markTaskCompleted(userId, taskType, extra = {}) {
  const uid = userId || getCurrentUserId();
  if (!uid) return { success: false, message: '用户未登录' };
  const taskInfo = constants.POINT_TASK_TYPE_MAP[taskType];
  if (!taskInfo) return { success: false, message: '任务不存在' };
  const completedTasks = getCompletedTasks(uid);
  if (taskInfo.type === 'once') {
    if (completedTasks.some(t => t.type === taskType)) {
      return { success: false, message: '该任务只能完成一次' };
    }
  }
  if (taskInfo.maxDaily) {
    const today = new Date().toDateString();
    const todayCount = completedTasks.filter(
      t => t.type === taskType && new Date(t.completeTime).toDateString() === today
    ).length;
    if (todayCount >= taskInfo.maxDaily) {
      return { success: false, message: `今日已达上限${taskInfo.maxDaily}次` };
    }
  }
  const completedTask = {
    id: util.generateId(),
    type: taskType,
    completeTime: Date.now(),
    points: taskInfo.points,
    ...extra
  };
  const allCompletedTasks = storage.get(STORAGE_KEYS.POINT_COMPLETED_TASKS) || {};
  if (!allCompletedTasks[uid]) allCompletedTasks[uid] = [];
  allCompletedTasks[uid].unshift(completedTask);
  storage.set(STORAGE_KEYS.POINT_COMPLETED_TASKS, allCompletedTasks);
  const result = addPoints(uid, taskInfo.points, `task_${taskType}`, taskInfo.description);
  return { success: true, task: completedTask, pointsResult: result };
}

function checkTaskEligibility(userId, taskType) {
  const uid = userId || getCurrentUserId();
  if (!uid) return { eligible: false, message: '用户未登录' };
  const taskInfo = constants.POINT_TASK_TYPE_MAP[taskType];
  if (!taskInfo) return { eligible: false, message: '任务不存在' };
  const completedTasks = getCompletedTasks(uid);
  if (taskInfo.type === 'once') {
    if (completedTasks.some(t => t.type === taskType)) {
      return { eligible: false, message: '该任务已完成', completed: true };
    }
  }
  if (taskInfo.maxDaily) {
    const today = new Date().toDateString();
    const todayCount = completedTasks.filter(
      t => t.type === taskType && new Date(t.completeTime).toDateString() === today
    ).length;
    if (todayCount >= taskInfo.maxDaily) {
      return { eligible: false, message: `今日已达上限${taskInfo.maxDaily}次`, todayCount, maxDaily: taskInfo.maxDaily };
    }
    return { eligible: true, todayCount, maxDaily: taskInfo.maxDaily };
  }
  if (taskInfo.type === 'daily') {
    const today = new Date().toDateString();
    const todaySigned = completedTasks.some(
      t => t.type === taskType && new Date(t.completeTime).toDateString() === today
    );
    if (todaySigned) {
      return { eligible: false, message: '今日已签到', signed: true };
    }
  }
  if (taskInfo.type === 'achievement') {
    const result = checkAchievementEligibility(uid, taskType);
    return result;
  }
  return { eligible: true };
}

function checkAchievementEligibility(userId, taskType) {
  const uid = userId || getCurrentUserId();
  const completedTasks = getCompletedTasks(uid);
  if (taskType === 'continue_7') {
    const signinTasks = completedTasks.filter(t => t.type === 'daily_signin').sort((a, b) => b.completeTime - a.completeTime);
    const consecutiveDays = getConsecutiveDays(signinTasks);
    return { eligible: consecutiveDays >= 7, consecutiveDays, targetDays: 7 };
  }
  if (taskType === 'continue_30') {
    const signinTasks = completedTasks.filter(t => t.type === 'daily_signin').sort((a, b) => b.completeTime - a.completeTime);
    const consecutiveDays = getConsecutiveDays(signinTasks);
    return { eligible: consecutiveDays >= 30, consecutiveDays, targetDays: 30 };
  }
  return { eligible: false };
}

function getConsecutiveDays(signinTasks) {
  if (signinTasks.length === 0) return 0;
  const days = new Set();
  signinTasks.forEach(task => {
    const date = new Date(task.completeTime).toDateString();
    days.add(date);
  });
  const sortedDays = Array.from(days).sort((a, b) => new Date(b) - new Date(a));
  let consecutive = 0;
  const today = new Date().toDateString();
  let checkDate = new Date(today);
  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toDateString();
    if (sortedDays.includes(dateStr)) {
      consecutive++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  return consecutive;
}

function getSigninStats(userId) {
  const uid = userId || getCurrentUserId();
  if (!uid) return { consecutiveDays: 0, totalDays: 0, todaySigned: false };
  const completedTasks = getCompletedTasks(uid);
  const signinTasks = completedTasks.filter(t => t.type === 'daily_signin');
  const days = new Set();
  signinTasks.forEach(task => {
    const date = new Date(task.completeTime).toDateString();
    days.add(date);
  });
  const today = new Date().toDateString();
  const todaySigned = days.has(today);
  const consecutiveDays = getConsecutiveDays(signinTasks);
  return { consecutiveDays, totalDays: days.size, todaySigned };
}

function getMallProducts(category = 'all') {
  const products = storage.getList(STORAGE_KEYS.POINT_MALL_PRODUCTS);
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
}

function getProductById(productId) {
  const products = storage.getList(STORAGE_KEYS.POINT_MALL_PRODUCTS);
  return products.find(p => p.id === productId) || null;
}

function exchangeProduct(userId, productId, quantity = 1) {
  const uid = userId || getCurrentUserId();
  if (!uid) return { success: false, message: '用户未登录' };
  const product = getProductById(productId);
  if (!product) return { success: false, message: '商品不存在' };
  if (product.status !== 'available' && product.status !== 'limited') {
    return { success: false, message: '商品不可兑换' };
  }
  if (product.stock !== null && product.stock < quantity) {
    return { success: false, message: '库存不足' };
  }
  const totalPoints = product.price * quantity;
  const currentPoints = getUserPoints(uid);
  if (currentPoints < totalPoints) {
    return { success: false, message: '积分不足' };
  }
  const deductResult = deductPoints(uid, totalPoints, 'exchange', `兑换${product.name}x${quantity}`, product.id);
  if (!deductResult.success) {
    return deductResult;
  }
  if (product.stock !== null) {
    const products = storage.getList(STORAGE_KEYS.POINT_MALL_PRODUCTS);
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex > -1) {
      products[productIndex].stock -= quantity;
      if (products[productIndex].stock <= 0) {
        products[productIndex].status = 'sold_out';
      }
      storage.set(STORAGE_KEYS.POINT_MALL_PRODUCTS, products);
    }
  }
  const order = createOrder(uid, product, quantity, totalPoints);
  return { success: true, order, points: deductResult.points };
}

function createOrder(userId, product, quantity, totalPoints) {
  const order = {
    id: util.generateId(),
    userId,
    productId: product.id,
    productName: product.name,
    productImage: product.image,
    quantity,
    price: product.price,
    totalPoints,
    status: 'completed',
    couponCode: product.type === 'coupon' ? generateCouponCode() : null,
    effectiveDays: product.effectiveDays || null,
    expireTime: product.effectiveDays ? Date.now() + product.effectiveDays * 24 * 60 * 60 * 1000 : null,
    createTime: Date.now()
  };
  const orders = storage.getList(STORAGE_KEYS.POINT_MALL_ORDERS);
  orders.unshift(order);
  storage.set(STORAGE_KEYS.POINT_MALL_ORDERS, orders);
  return order;
}

function generateCouponCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
    if (i === 3 || i === 7) code += '-';
  }
  return code;
}

function getUserOrders(userId, status) {
  const uid = userId || getCurrentUserId();
  if (!uid) return [];
  const allOrders = storage.getList(STORAGE_KEYS.POINT_MALL_ORDERS);
  let userOrders = allOrders.filter(o => o.userId === uid);
  if (status) {
    userOrders = userOrders.filter(o => o.status === status);
  }
  return userOrders;
}

function checkAndClearExpiredPoints(userId) {
  const uid = userId || getCurrentUserId();
  if (!uid) return { cleared: 0 };
  const config = constants.POINTS_VALIDITY_CONFIG;
  if (!config.enabled) return { cleared: 0 };
  const transactions = getTransactionList(uid, { direction: 'in' });
  const now = Date.now();
  let expiredPoints = 0;
  transactions.forEach(t => {
    if (t.expireTime && t.expireTime <= now && !t.expired) {
      expiredPoints += t.points;
      t.expired = true;
    }
  });
  if (expiredPoints > 0) {
    const allTransactions = storage.getList(STORAGE_KEYS.POINT_TRANSACTIONS);
    transactions.forEach(t => {
      const index = allTransactions.findIndex(at => at.id === t.id);
      if (index > -1) {
        allTransactions[index].expired = true;
      }
    });
    storage.set(STORAGE_KEYS.POINT_TRANSACTIONS, allTransactions);
    const currentPoints = getUserPoints(uid);
    const newPoints = Math.max(0, currentPoints - expiredPoints);
    updateUserPoints(uid, newPoints);
    createTransaction(uid, 'expired', expiredPoints, 'out', currentPoints, newPoints, '积分过期自动清零');
  }
  return { cleared: expiredPoints };
}

function getExpiringPoints(userId) {
  const uid = userId || getCurrentUserId();
  if (!uid) return { count: 0, soonestExpire: null };
  const config = constants.POINTS_VALIDITY_CONFIG;
  if (!config.enabled) return { count: 0, soonestExpire: null };
  const transactions = getTransactionList(uid, { direction: 'in' });
  const now = Date.now();
  const notifyThreshold = config.notifyBeforeDays * 24 * 60 * 60 * 1000;
  let expiringCount = 0;
  let soonestExpire = null;
  transactions.forEach(t => {
    if (t.expireTime && t.expireTime > now && !t.expired) {
      if (t.expireTime - now <= notifyThreshold) {
        expiringCount += t.points;
        if (!soonestExpire || t.expireTime < soonestExpire) {
          soonestExpire = t.expireTime;
        }
      }
    }
  });
  return { count: expiringCount, soonestExpire };
}

module.exports = {
  getCurrentUserId,
  getUserPoints,
  updateUserPoints,
  addPoints,
  deductPoints,
  getTransactionList,
  getTransactionStats,
  getCompletedTasks,
  markTaskCompleted,
  checkTaskEligibility,
  getSigninStats,
  getMallProducts,
  getProductById,
  exchangeProduct,
  getUserOrders,
  checkAndClearExpiredPoints,
  getExpiringPoints
};
