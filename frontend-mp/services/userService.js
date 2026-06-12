/**
 * 用户服务层
 * 处理用户注册、登录、信息管理、信用评分、实名认证等功能
 */

const storage = require('../utils/storage');
const { STORAGE_KEYS } = storage;
const security = require('../utils/security');
const util = require('../utils/util');
const constants = require('../config/constants');

/**
 * 默认信用评分
 */
const DEFAULT_CREDIT_SCORE = 80;

/**
 * 信用评分等级
 */
const CREDIT_LEVELS = [
  { min: 90, max: 100, level: 'S', label: '极好', color: '#FFD700' },
  { min: 80, max: 89, level: 'A', label: '优秀', color: '#4CAF50' },
  { min: 70, max: 79, level: 'B', label: '良好', color: '#2196F3' },
  { min: 60, max: 69, level: 'C', label: '一般', color: '#FF9800' },
  { min: 0, max: 59, level: 'D', label: '较差', color: '#F44336' }
];

/**
 * 举报类型
 */
const REPORT_TYPES = [
  { value: 'spam', label: '垃圾信息', icon: '📧', description: '广告、刷屏、无意义内容', requiresProof: false },
  { value: 'fraud', label: '欺诈行为', icon: '💰', description: '虚假信息、诈骗、冒充他人', requiresProof: true },
  { value: 'inappropriate', label: '不当内容', icon: '⚠️', description: '色情、暴力、辱骂等不良信息', requiresProof: false },
  { value: 'copyright', label: '版权侵权', icon: '©️', description: '盗用他人作品、侵犯知识产权', requiresProof: true },
  { value: 'other', label: '其他问题', icon: '📋', description: '其他违反平台规则的行为', requiresProof: false }
];

/**
 * 举报状态
 */
const REPORT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
};

/**
 * 获取所有用户列表
 */
function getUserList() {
  return storage.getList(STORAGE_KEYS.USERS);
}

/**
 * 根据账号获取用户
 * @param {string} account - 用户账号
 */
function getUserByAccount(account) {
  const users = getUserList();
  return users.find(u => u.account === account) || null;
}

/**
 * 根据用户ID获取用户
 * @param {string} userId - 用户ID
 */
function getUserById(userId) {
  const users = getUserList();
  return users.find(u => u.id === userId) || null;
}

/**
 * 注册新用户
 * @param {Object} userData - 用户数据
 */
function registerUser(userData) {
  const { account, password, nickName } = userData;

  const existingUser = getUserByAccount(account);
  if (existingUser) {
    return { success: false, message: '账号已存在' };
  }

  const passwordCheck = security.validatePasswordStrength(password);
  if (!passwordCheck.valid) {
    return { success: false, message: passwordCheck.message };
  }

  const hashedPassword = security.hashPassword(password);

  const newUser = {
    id: util.generateId(),
    account,
    nickName: nickName || account,
    passwordHash: hashedPassword.hash,
    passwordSalt: hashedPassword.salt,
    passwordIterations: hashedPassword.iterations,
    avatarUrl: userData.avatarUrl || '',
    gender: userData.gender || 0,
    birthday: userData.birthday || '',
    region: userData.region || [],
    signature: userData.signature || '',
    realNameVerified: false,
    realNameInfo: null,
    creditScore: DEFAULT_CREDIT_SCORE,
    creditLevel: getCreditLevel(DEFAULT_CREDIT_SCORE),
    createTime: Date.now(),
    updateTime: Date.now(),
    lastLoginTime: Date.now(),
    status: 'active',
    publishCount: 0,
    dealCount: 0
  };

  const users = getUserList();
  users.push(newUser);
  storage.set(STORAGE_KEYS.USERS, users);

  const userInfo = sanitizeUserInfo(newUser);
  logUserBehavior(newUser.id, 'register', { account });

  return { success: true, user: userInfo, message: '注册成功' };
}

/**
 * 用户登录
 * @param {string} account - 账号
 * @param {string} password - 密码
 */
function loginUser(account, password) {
  const user = getUserByAccount(account);
  
  if (!user) {
    return { success: false, message: '账号或密码错误' };
  }

  if (user.status === 'banned') {
    return { success: false, message: '账号已被封禁，请联系管理员' };
  }

  const isValid = security.verifyPassword(
    password,
    user.passwordHash,
    user.passwordSalt,
    user.passwordIterations
  );

  if (!isValid) {
    logUserBehavior(user.id, 'login_failed', { account, reason: 'wrong_password' });
    return { success: false, message: '账号或密码错误' };
  }

  const users = getUserList();
  const userIndex = users.findIndex(u => u.id === user.id);
  if (userIndex > -1) {
    users[userIndex].lastLoginTime = Date.now();
    users[userIndex].updateTime = Date.now();
    storage.set(STORAGE_KEYS.USERS, users);
  }

  const userInfo = sanitizeUserInfo(users[userIndex] || user);
  logUserBehavior(user.id, 'login', { account });

  return { success: true, user: userInfo, message: '登录成功' };
}

/**
 * 更新用户信息
 * @param {string} userId - 用户ID
 * @param {Object} updates - 更新的数据
 */
function updateUserInfo(userId, updates) {
  const users = getUserList();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return { success: false, message: '用户不存在' };
  }

  const sensitiveFields = ['passwordHash', 'passwordSalt', 'passwordIterations', 'account', 'id'];
  const filteredUpdates = Object.keys(updates).reduce((acc, key) => {
    if (!sensitiveFields.includes(key)) {
      acc[key] = updates[key];
    }
    return acc;
  }, {});

  users[userIndex] = {
    ...users[userIndex],
    ...filteredUpdates,
    updateTime: Date.now()
  };

  storage.set(STORAGE_KEYS.USERS, users);

  const updatedUser = sanitizeUserInfo(users[userIndex]);
  logUserBehavior(userId, 'update_profile', Object.keys(filteredUpdates));

  return { success: true, user: updatedUser, message: '更新成功' };
}

/**
 * 修改密码
 * @param {string} userId - 用户ID
 * @param {string} oldPassword - 旧密码
 * @param {string} newPassword - 新密码
 */
function changePassword(userId, oldPassword, newPassword) {
  const users = getUserList();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return { success: false, message: '用户不存在' };
  }

  const user = users[userIndex];

  const isOldValid = security.verifyPassword(
    oldPassword,
    user.passwordHash,
    user.passwordSalt,
    user.passwordIterations
  );

  if (!isOldValid) {
    return { success: false, message: '原密码错误' };
  }

  const passwordCheck = security.validatePasswordStrength(newPassword);
  if (!passwordCheck.valid) {
    return { success: false, message: passwordCheck.message };
  }

  const hashedPassword = security.hashPassword(newPassword);

  users[userIndex] = {
    ...user,
    passwordHash: hashedPassword.hash,
    passwordSalt: hashedPassword.salt,
    passwordIterations: hashedPassword.iterations,
    updateTime: Date.now()
  };

  storage.set(STORAGE_KEYS.USERS, users);
  logUserBehavior(userId, 'change_password', {});

  return { success: true, message: '密码修改成功' };
}

/**
 * 提交实名认证
 * @param {string} userId - 用户ID
 * @param {Object} realNameInfo - 实名认证信息
 */
function submitRealNameVerify(userId, realNameInfo) {
  const { realName, studentId, department } = realNameInfo;

  if (!realName || !realName.trim()) {
    return { success: false, message: '请输入真实姓名' };
  }

  if (!studentId || !studentId.trim()) {
    return { success: false, message: '请输入学号' };
  }

  const existingVerify = storage.get(STORAGE_KEYS.USER_REAL_NAME_VERIFY) || {};
  
  existingVerify[userId] = {
    userId,
    realName: realName.trim(),
    studentId: studentId.trim(),
    department: department ? department.trim() : '',
    status: 'pending',
    submitTime: Date.now(),
    reviewTime: null,
    reviewRemark: ''
  };

  storage.set(STORAGE_KEYS.USER_REAL_NAME_VERIFY, existingVerify);

  const users = getUserList();
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex > -1) {
    users[userIndex].realNameVerified = false;
    users[userIndex].realNameInfo = {
      realName: realName.trim(),
      studentId: studentId.trim(),
      department: department ? department.trim() : '',
      status: 'pending'
    };
    users[userIndex].updateTime = Date.now();
    storage.set(STORAGE_KEYS.USERS, users);
  }

  logUserBehavior(userId, 'submit_real_name_verify', { studentId });

  return { success: true, message: '实名认证已提交，等待审核' };
}

/**
 * 检查用户是否为管理员
 * @param {string} userId - 用户ID
 * @returns {boolean}
 */
function isAdmin(userId) {
  if (!userId) return false;
  const user = getUserById(userId);
  if (!user) return false;
  if (user.isAdmin) return true;
  if (user.account === 'admin') return true;
  return false;
}

/**
 * 检查当前登录用户是否为管理员
 * @returns {boolean}
 */
function isCurrentUserAdmin() {
  const app = getApp();
  const userInfo = app.globalData.userInfo || {};
  return isAdmin(userInfo.id);
}

/**
 * 获取用户实名认证状态
 * @param {string} userId - 用户ID
 */
function getRealNameVerifyStatus(userId) {
  const verifyData = storage.get(STORAGE_KEYS.USER_REAL_NAME_VERIFY) || {};
  return verifyData[userId] || null;
}

/**
 * 获取信用评分等级
 * @param {number} score - 信用分数
 */
function getCreditLevel(score) {
  const level = CREDIT_LEVELS.find(l => score >= l.min && score <= l.max);
  return level || CREDIT_LEVELS[CREDIT_LEVELS.length - 1];
}

/**
 * 更新用户信用评分
 * @param {string} userId - 用户ID
 * @param {number} change - 分数变化（正数加分，负数扣分）
 * @param {string} reason - 变更原因
 */
function updateCreditScore(userId, change, reason) {
  const users = getUserList();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return { success: false, message: '用户不存在' };
  }

  const user = users[userIndex];
  const oldScore = user.creditScore || DEFAULT_CREDIT_SCORE;
  const newScore = Math.max(0, Math.min(100, oldScore + change));

  users[userIndex] = {
    ...user,
    creditScore: newScore,
    creditLevel: getCreditLevel(newScore),
    updateTime: Date.now()
  };

  storage.set(STORAGE_KEYS.USERS, users);

  const creditScores = storage.get(STORAGE_KEYS.USER_CREDIT_SCORES) || [];
  creditScores.unshift({
    id: util.generateId(),
    userId,
    oldScore,
    newScore,
    change,
    reason,
    createTime: Date.now()
  });
  storage.set(STORAGE_KEYS.USER_CREDIT_SCORES, creditScores.slice(0, 100));

  logUserBehavior(userId, 'credit_score_change', { oldScore, newScore, change, reason });

  return { success: true, oldScore, newScore, message: '信用评分已更新' };
}

/**
 * 获取用户信用评分记录
 * @param {string} userId - 用户ID
 */
function getCreditScoreHistory(userId) {
  const creditScores = storage.get(STORAGE_KEYS.USER_CREDIT_SCORES) || [];
  return creditScores
    .filter(r => r.userId === userId)
    .sort((a, b) => b.createTime - a.createTime);
}

/**
 * 提交举报
 * @param {Object} reportData - 举报数据
 */
function submitReport(reportData) {
  const app = getApp();
  const currentUser = app.globalData.userInfo || {};
  
  const { 
    reporterId: paramReporterId, 
    reporterName: paramReporterName,
    targetType, 
    targetId, 
    targetTitle,
    targetUserId, 
    reportType, 
    description, 
    images,
    contactInfo,
    anonymous
  } = reportData;

  const reporterId = paramReporterId || currentUser.id || 'anonymous';
  const reporterName = anonymous ? '匿名用户' : (paramReporterName || currentUser.nickName || '匿名用户');

  if (!targetType || !targetId) {
    return { success: false, message: '缺少举报目标信息' };
  }

  if (!reportType) {
    return { success: false, message: '请选择举报类型' };
  }

  if (!description || !description.trim()) {
    return { success: false, message: '请填写举报说明' };
  }

  const reports = storage.getList(STORAGE_KEYS.REPORTS);

  const existingReport = reports.find(
    r => r.targetType === targetType && 
         r.targetId === targetId && 
         r.reporterId === reporterId
  );

  if (existingReport) {
    return { success: false, message: '您已举报过该内容' };
  }

  const report = {
    id: util.generateId(),
    reporterId,
    reporterName,
    targetType,
    targetId,
    targetTitle: targetTitle || '',
    targetUserId: targetUserId || '',
    reportType,
    description: description.trim(),
    images: images || [],
    contactInfo: contactInfo || '',
    anonymous: anonymous || false,
    status: REPORT_STATUS.PENDING,
    createTime: Date.now(),
    updateTime: Date.now(),
    handleResult: '',
    handler: ''
  };

  reports.unshift(report);
  storage.set(STORAGE_KEYS.REPORTS, reports);

  logUserBehavior(reporterId, 'submit_report', { targetType, targetId, reportType });

  return { success: true, report, message: '举报已提交，我们会尽快处理' };
}

/**
 * 获取举报列表
 * @param {string} userId - 用户ID（可选，不传则获取所有）
 */
function getReportList(userId = null) {
  const reports = storage.getList(STORAGE_KEYS.REPORTS);
  
  if (userId) {
    return reports
      .filter(r => r.reporterId === userId)
      .sort((a, b) => b.createTime - a.createTime);
  }
  
  return reports.sort((a, b) => b.createTime - a.createTime);
}

/**
 * 添加到黑名单
 * @param {string} userId - 当前用户ID
 * @param {string} blockedUserId - 被拉黑用户ID
 * @param {string} blockedUserName - 被拉黑用户名
 * @param {string} reason - 拉黑原因
 */
function addToBlacklist(userId, blockedUserId, blockedUserName, reason = '') {
  if (userId === blockedUserId) {
    return { success: false, message: '不能将自己加入黑名单' };
  }

  const blacklist = storage.get(STORAGE_KEYS.BLACKLIST) || {};
  const userBlacklist = blacklist[userId] || [];

  const existing = userBlacklist.find(b => b.blockedUserId === blockedUserId);
  if (existing) {
    return { success: false, message: '该用户已在黑名单中' };
  }

  userBlacklist.unshift({
    blockedUserId,
    blockedUserName,
    reason,
    createTime: Date.now()
  });

  blacklist[userId] = userBlacklist;
  storage.set(STORAGE_KEYS.BLACKLIST, blacklist);

  logUserBehavior(userId, 'add_blacklist', { blockedUserId, blockedUserName });

  return { success: true, message: '已加入黑名单' };
}

/**
 * 从黑名单移除
 * @param {string} userId - 当前用户ID
 * @param {string} blockedUserId - 被拉黑用户ID
 */
function removeFromBlacklist(userId, blockedUserId) {
  const blacklist = storage.get(STORAGE_KEYS.BLACKLIST) || {};
  const userBlacklist = blacklist[userId] || [];

  const newBlacklist = userBlacklist.filter(b => b.blockedUserId !== blockedUserId);
  
  if (newBlacklist.length === userBlacklist.length) {
    return { success: false, message: '该用户不在黑名单中' };
  }

  blacklist[userId] = newBlacklist;
  storage.set(STORAGE_KEYS.BLACKLIST, blacklist);

  logUserBehavior(userId, 'remove_blacklist', { blockedUserId });

  return { success: true, message: '已从黑名单移除' };
}

/**
 * 获取用户黑名单
 * @param {string} userId - 用户ID
 */
function getBlacklist(userId) {
  const blacklist = storage.get(STORAGE_KEYS.BLACKLIST) || {};
  return blacklist[userId] || [];
}

/**
 * 检查用户是否在黑名单中
 * @param {string} userId - 当前用户ID
 * @param {string} targetUserId - 目标用户ID
 */
function isInBlacklist(userId, targetUserId) {
  const userBlacklist = getBlacklist(userId);
  return userBlacklist.some(b => b.blockedUserId === targetUserId);
}

/**
 * 获取用户发布的内容
 * @param {string} userId - 用户ID
 * @param {string} type - 类型：lostFound, market, forum, scenery
 */
function getUserPublications(userId, type = 'all') {
  const dataService = require('./data');
  const result = {
    lostFound: [],
    market: [],
    forum: [],
    scenery: []
  };

  if (type === 'all' || type === 'lostFound') {
    const lostFoundList = dataService.getLostFoundList();
    result.lostFound = lostFoundList.filter(item => item.userId === userId);
  }

  if (type === 'all' || type === 'market') {
    const marketList = dataService.getMarketList();
    result.market = marketList.filter(item => item.userId === userId);
  }

  if (type === 'all' || type === 'forum') {
    const forumPosts = storage.getList(STORAGE_KEYS.FORUM_POST_LIST);
    result.forum = forumPosts.filter(item => item.userId === userId);
  }

  if (type === 'all' || type === 'scenery') {
    const sceneryList = storage.getList('sceneryList') || [];
    result.scenery = sceneryList.filter(item => 
      item.uploader && item.uploader.id === userId
    );
  }

  return result;
}

/**
 * 获取用户统计信息
 * @param {string} userId - 用户ID
 */
function getUserStats(userId) {
  const publications = getUserPublications(userId);
  
  const lostFoundCount = publications.lostFound.length;
  const marketCount = publications.market.length;
  const forumCount = publications.forum.length;
  const sceneryCount = publications.scenery.length;
  const totalPublications = lostFoundCount + marketCount + forumCount + sceneryCount;

  const completedMarket = publications.market.filter(item => item.status === 'sold').length;
  const completedLostFound = publications.lostFound.filter(item => item.status === 'resolved').length;
  const completedDeals = completedMarket + completedLostFound;

  return {
    totalPublications,
    lostFoundCount,
    marketCount,
    forumCount,
    sceneryCount,
    completedDeals,
    successRate: totalPublications > 0 
      ? Math.round((completedDeals / totalPublications) * 100) 
      : 0
  };
}

/**
 * 清理用户敏感信息，返回安全的用户信息
 * @param {Object} user - 用户对象
 */
function sanitizeUserInfo(user) {
  if (!user) return null;
  
  return {
    id: user.id,
    account: user.account,
    nickName: user.nickName,
    avatarUrl: user.avatarUrl,
    gender: user.gender,
    birthday: user.birthday,
    region: user.region,
    signature: user.signature,
    realNameVerified: user.realNameVerified,
    realNameInfo: user.realNameInfo ? {
      department: user.realNameInfo.department,
      status: user.realNameInfo.status
    } : null,
    creditScore: user.creditScore,
    creditLevel: user.creditLevel,
    createTime: user.createTime,
    lastLoginTime: user.lastLoginTime,
    status: user.status,
    publishCount: user.publishCount,
    dealCount: user.dealCount,
    isAdmin: user.isAdmin || false
  };
}

/**
 * 记录用户行为日志
 * @param {string} userId - 用户ID
 * @param {string} action - 行为类型
 * @param {Object} data - 相关数据
 */
function logUserBehavior(userId, action, data = {}) {
  const logs = storage.getList(STORAGE_KEYS.USER_BEHAVIOR_LOG);
  
  logs.unshift({
    id: util.generateId(),
    userId,
    action,
    data,
    createTime: Date.now()
  });

  storage.set(STORAGE_KEYS.USER_BEHAVIOR_LOG, logs.slice(0, 500));
}

/**
 * 初始化测试用户（兼容旧数据）
 */
function initLegacyUsers() {
  const users = getUserList();
  const hasLegacyFormat = users.some(u => u.password && !u.passwordHash);
  
  if (hasLegacyFormat) {
    const updatedUsers = users.map(user => {
      if (user.password && !user.passwordHash) {
        const hashed = security.hashPassword(user.password);
        return {
          ...user,
          passwordHash: hashed.hash,
          passwordSalt: hashed.salt,
          passwordIterations: hashed.iterations,
          creditScore: user.creditScore || DEFAULT_CREDIT_SCORE,
          creditLevel: getCreditLevel(user.creditScore || DEFAULT_CREDIT_SCORE),
          realNameVerified: user.realNameVerified || false,
          realNameInfo: user.realNameInfo || null,
          publishCount: user.publishCount || 0,
          dealCount: user.dealCount || 0,
          status: user.status || 'active'
        };
      }
      return user;
    });
    
    storage.set(STORAGE_KEYS.USERS, updatedUsers);
  }
}

module.exports = {
  DEFAULT_CREDIT_SCORE,
  CREDIT_LEVELS,
  REPORT_TYPES,
  REPORT_STATUS,
  getUserList,
  getUserByAccount,
  getUserById,
  registerUser,
  loginUser,
  updateUserInfo,
  changePassword,
  submitRealNameVerify,
  getRealNameVerifyStatus,
  getCreditLevel,
  updateCreditScore,
  getCreditScoreHistory,
  submitReport,
  getReportList,
  addToBlacklist,
  removeFromBlacklist,
  getBlacklist,
  isInBlacklist,
  getUserPublications,
  getUserStats,
  sanitizeUserInfo,
  logUserBehavior,
  initLegacyUsers,
  isAdmin,
  isCurrentUserAdmin
};
