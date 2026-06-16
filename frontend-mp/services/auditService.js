const storage = require('../utils/storage');
const { STORAGE_KEYS } = storage;
const util = require('../utils/util');
const userService = require('./userService');
const dataService = require('./data');
const constants = require('../config/constants');

function getPendingSceneryPublish() {
  const sceneryList = storage.getList('sceneryList') || [];
  return sceneryList
    .filter(item => item.reviewStatus === 'pending')
    .map(item => ({
      id: item.id,
      type: 'scenery_publish',
      typeName: '风光投稿',
      applicant: item.uploader ? item.uploader.name : '匿名用户',
      applicantId: item.uploader ? item.uploader.id : '',
      summary: (item.title || '') + (item.description ? ' - ' + item.description : ''),
      image: item.image || '',
      time: item.createTime || Date.now(),
      status: 'pending',
      rawData: item
    }));
}

function getPendingForumReports() {
  const reports = storage.getList(STORAGE_KEYS.FORUM_REPORTS);
  const postList = storage.getList(STORAGE_KEYS.FORUM_POST_LIST);

  return reports
    .filter(r => r.status === 'pending')
    .map(r => {
      const post = postList.find(p => p.id === r.postId);
      return {
        id: r.id,
        type: 'report_forum',
        typeName: '论坛举报',
        applicant: r.reporterId === 'anonymous' ? '匿名用户' : getUserName(r.reporterId),
        applicantId: r.reporterId,
        summary: post ? post.title : '帖子已删除',
        time: r.createTime || Date.now(),
        status: 'pending',
        reason: r.reason || '',
        targetId: r.postId,
        rawData: r
      };
    });
}

function getPendingAgentReports() {
  const reports = storage.getList(STORAGE_KEYS.RENTAL_AGENT_REPORTS);
  const rentalList = storage.getList(STORAGE_KEYS.RENTAL_LIST);

  return reports
    .filter(r => !r.auditStatus || r.auditStatus === 'pending')
    .map(r => {
      const house = rentalList.find(h => h.id === r.houseId);
      return {
        id: r.id,
        type: 'report_agent',
        typeName: '中介举报',
        applicant: getUserName(r.reporterId),
        applicantId: r.reporterId,
        summary: house ? house.title : '房源已删除',
        time: r.createTime || Date.now(),
        status: r.auditStatus || 'pending',
        reason: r.reason || '',
        targetId: r.houseId,
        rawData: r
      };
    });
}

function getPendingRealNameVerify() {
  const verifyData = storage.get(STORAGE_KEYS.USER_REAL_NAME_VERIFY) || {};
  const results = [];

  Object.keys(verifyData).forEach(userId => {
    const v = verifyData[userId];
    if (v.status === 'pending') {
      results.push({
        id: 'verify_' + userId,
        type: 'real_name_verify',
        typeName: '实名认证',
        applicant: v.realName || '未知',
        applicantId: userId,
        summary: `${v.realName || ''} | ${v.studentId || ''} | ${v.department || ''}`,
        time: v.submitTime || Date.now(),
        status: 'pending',
        rawData: v
      });
    }
  });

  return results.sort((a, b) => b.time - a.time);
}

function getPendingUserReports() {
  const reports = storage.getList(STORAGE_KEYS.REPORTS);

  return reports
    .filter(r => r.status === 'pending')
    .map(r => ({
      id: r.id,
      type: 'report_user',
      typeName: '用户举报',
      applicant: r.reporterName || '匿名用户',
      applicantId: r.reporterId,
      summary: r.description || r.targetTitle || '',
      time: r.createTime || Date.now(),
      status: 'pending',
      reason: r.reportType || '',
      targetId: r.targetId,
      targetType: r.targetType,
      rawData: r
    }));
}

function getUserName(userId) {
  if (!userId || userId === 'anonymous') return '匿名用户';
  const user = userService.getUserById(userId);
  return user ? (user.nickName || user.account || '未知用户') : '未知用户';
}

function getAuditItemsByType(type) {
  switch (type) {
    case 'scenery_publish':
      return getPendingSceneryPublish();
    case 'report_forum':
      return getPendingForumReports();
    case 'report_agent':
      return getPendingAgentReports();
    case 'real_name_verify':
      return getPendingRealNameVerify();
    case 'report_user':
      return getPendingUserReports();
    default:
      return [];
  }
}

function getAllPendingItems() {
  const types = constants.AUDIT_TYPE_TABS.map(t => t.value);
  let allItems = [];
  types.forEach(type => {
    allItems = allItems.concat(getAuditItemsByType(type));
  });
  return allItems.sort((a, b) => b.time - a.time);
}

function getAuditStats() {
  const types = constants.AUDIT_TYPE_TABS.map(t => t.value);
  const stats = {};
  let totalPending = 0;

  types.forEach(type => {
    const items = getAuditItemsByType(type);
    const pendingCount = items.filter(i => i.status === 'pending').length;
    stats[type] = {
      total: items.length,
      pending: pendingCount
    };
    totalPending += pendingCount;
  });

  return { stats, totalPending };
}

function approveItem(id, type, operatorId) {
  const operator = operatorId ? getUserName(operatorId) : '管理员';

  switch (type) {
    case 'scenery_publish': {
      const sceneryList = storage.getList('sceneryList') || [];
      const idx = sceneryList.findIndex(s => s.id === id);
      if (idx > -1) {
        sceneryList[idx].reviewStatus = 'approved';
        sceneryList[idx].updateTime = Date.now();
        storage.set('sceneryList', sceneryList);
      }
      break;
    }
    case 'report_forum': {
      const reports = storage.getList(STORAGE_KEYS.FORUM_REPORTS);
      const rIdx = reports.findIndex(r => r.id === id);
      if (rIdx > -1) {
        reports[rIdx].status = 'resolved';
        reports[rIdx].handleResult = 'approved';
        reports[rIdx].handler = operator;
        reports[rIdx].handleTime = Date.now();
        storage.set(STORAGE_KEYS.FORUM_REPORTS, reports);
      }
      break;
    }
    case 'report_agent': {
      const agentReports = storage.getList(STORAGE_KEYS.RENTAL_AGENT_REPORTS);
      const aIdx = agentReports.findIndex(r => r.id === id);
      if (aIdx > -1) {
        agentReports[aIdx].auditStatus = 'approved';
        agentReports[aIdx].handler = operator;
        agentReports[aIdx].handleTime = Date.now();
        storage.set(STORAGE_KEYS.RENTAL_AGENT_REPORTS, agentReports);
      }
      break;
    }
    case 'real_name_verify': {
      const userId = id.replace('verify_', '');
      const verifyData = storage.get(STORAGE_KEYS.USER_REAL_NAME_VERIFY) || {};
      if (verifyData[userId]) {
        verifyData[userId].status = 'approved';
        verifyData[userId].reviewTime = Date.now();
        verifyData[userId].reviewRemark = '';
        storage.set(STORAGE_KEYS.USER_REAL_NAME_VERIFY, verifyData);

        const users = userService.getUserList();
        const uIdx = users.findIndex(u => u.id === userId);
        if (uIdx > -1) {
          users[uIdx].realNameVerified = true;
          users[uIdx].realNameInfo = {
            ...users[uIdx].realNameInfo,
            status: 'approved'
          };
          users[uIdx].updateTime = Date.now();
          storage.set(STORAGE_KEYS.USERS, users);
        }
      }
      break;
    }
    case 'report_user': {
      storage.updateInList(STORAGE_KEYS.REPORTS, id, {
        status: 'resolved',
        handleResult: 'approved',
        handler: operator,
        handleTime: Date.now()
      });
      break;
    }
  }

  addAuditLog(id, type, 'approved', operator, '');
  return { success: true, message: '审核通过' };
}

function rejectItem(id, type, reason, operatorId) {
  const operator = operatorId ? getUserName(operatorId) : '管理员';

  switch (type) {
    case 'scenery_publish': {
      const sceneryList = storage.getList('sceneryList') || [];
      const idx = sceneryList.findIndex(s => s.id === id);
      if (idx > -1) {
        sceneryList[idx].reviewStatus = 'rejected';
        sceneryList[idx].rejectReason = reason;
        sceneryList[idx].updateTime = Date.now();
        storage.set('sceneryList', sceneryList);
      }
      break;
    }
    case 'report_forum': {
      const reports = storage.getList(STORAGE_KEYS.FORUM_REPORTS);
      const rIdx = reports.findIndex(r => r.id === id);
      if (rIdx > -1) {
        reports[rIdx].status = 'rejected';
        reports[rIdx].handleResult = 'rejected';
        reports[rIdx].handler = operator;
        reports[rIdx].handleTime = Date.now();
        reports[rIdx].rejectReason = reason;
        storage.set(STORAGE_KEYS.FORUM_REPORTS, reports);
      }
      break;
    }
    case 'report_agent': {
      const agentReports = storage.getList(STORAGE_KEYS.RENTAL_AGENT_REPORTS);
      const aIdx = agentReports.findIndex(r => r.id === id);
      if (aIdx > -1) {
        agentReports[aIdx].auditStatus = 'rejected';
        agentReports[aIdx].handler = operator;
        agentReports[aIdx].handleTime = Date.now();
        agentReports[aIdx].rejectReason = reason;
        storage.set(STORAGE_KEYS.RENTAL_AGENT_REPORTS, agentReports);
      }
      break;
    }
    case 'real_name_verify': {
      const userId = id.replace('verify_', '');
      const verifyData = storage.get(STORAGE_KEYS.USER_REAL_NAME_VERIFY) || {};
      if (verifyData[userId]) {
        verifyData[userId].status = 'rejected';
        verifyData[userId].reviewTime = Date.now();
        verifyData[userId].reviewRemark = reason;
        storage.set(STORAGE_KEYS.USER_REAL_NAME_VERIFY, verifyData);

        const users = userService.getUserList();
        const uIdx = users.findIndex(u => u.id === userId);
        if (uIdx > -1) {
          users[uIdx].realNameInfo = {
            ...users[uIdx].realNameInfo,
            status: 'rejected'
          };
          users[uIdx].updateTime = Date.now();
          storage.set(STORAGE_KEYS.USERS, users);
        }
      }
      break;
    }
    case 'report_user': {
      storage.updateInList(STORAGE_KEYS.REPORTS, id, {
        status: 'rejected',
        handleResult: 'rejected',
        handler: operator,
        handleTime: Date.now(),
        rejectReason: reason
      });
      break;
    }
  }

  addAuditLog(id, type, 'rejected', operator, reason);
  return { success: true, message: '已驳回，已通知申请人' };
}

function banItem(id, type, reason, operatorId) {
  const operator = operatorId ? getUserName(operatorId) : '管理员';

  let targetUserId = '';

  switch (type) {
    case 'scenery_publish': {
      const sceneryList = storage.getList('sceneryList') || [];
      const idx = sceneryList.findIndex(s => s.id === id);
      if (idx > -1) {
        sceneryList[idx].reviewStatus = 'rejected';
        sceneryList[idx].rejectReason = reason || '内容违规，已封禁';
        sceneryList[idx].updateTime = Date.now();
        targetUserId = sceneryList[idx].uploader ? sceneryList[idx].uploader.id : '';
        storage.set('sceneryList', sceneryList);
      }
      break;
    }
    case 'report_forum': {
      const reports = storage.getList(STORAGE_KEYS.FORUM_REPORTS);
      const rIdx = reports.findIndex(r => r.id === id);
      if (rIdx > -1) {
        reports[rIdx].status = 'resolved';
        reports[rIdx].handleResult = 'banned';
        reports[rIdx].handler = operator;
        reports[rIdx].handleTime = Date.now();
        storage.set(STORAGE_KEYS.FORUM_REPORTS, reports);

        const postList = storage.getList(STORAGE_KEYS.FORUM_POST_LIST);
        const postIdx = postList.findIndex(p => p.id === reports[rIdx].postId);
        if (postIdx > -1) {
          targetUserId = postList[postIdx].userId;
          dataService.banForumUser(targetUserId, 7);
        }
      }
      break;
    }
    case 'report_agent': {
      const agentReports = storage.getList(STORAGE_KEYS.RENTAL_AGENT_REPORTS);
      const aIdx = agentReports.findIndex(r => r.id === id);
      if (aIdx > -1) {
        agentReports[aIdx].auditStatus = 'banned';
        agentReports[aIdx].handler = operator;
        agentReports[aIdx].handleTime = Date.now();
        agentReports[aIdx].rejectReason = reason;
        targetUserId = agentReports[aIdx].reporterId;
        storage.set(STORAGE_KEYS.RENTAL_AGENT_REPORTS, agentReports);
      }
      break;
    }
    case 'real_name_verify': {
      const userId = id.replace('verify_', '');
      targetUserId = userId;
      const verifyData = storage.get(STORAGE_KEYS.USER_REAL_NAME_VERIFY) || {};
      if (verifyData[userId]) {
        verifyData[userId].status = 'rejected';
        verifyData[userId].reviewTime = Date.now();
        verifyData[userId].reviewRemark = reason || '信息不合规，已封禁';
        storage.set(STORAGE_KEYS.USER_REAL_NAME_VERIFY, verifyData);
      }
      break;
    }
    case 'report_user': {
      const reports = storage.getList(STORAGE_KEYS.REPORTS);
      const rItem = reports.find(r => r.id === id);
      if (rItem) {
        targetUserId = rItem.targetUserId || rItem.reporterId;
        storage.updateInList(STORAGE_KEYS.REPORTS, id, {
          status: 'resolved',
          handleResult: 'banned',
          handler: operator,
          handleTime: Date.now()
        });
      }
      break;
    }
  }

  if (targetUserId) {
    const users = userService.getUserList();
    const uIdx = users.findIndex(u => u.id === targetUserId);
    if (uIdx > -1) {
      users[uIdx].status = 'banned';
      users[uIdx].updateTime = Date.now();
      storage.set(STORAGE_KEYS.USERS, users);
    }
  }

  addAuditLog(id, type, 'banned', operator, reason);
  return { success: true, message: '已封禁' };
}

function addAuditLog(targetId, type, result, operator, reason) {
  const logs = storage.getList(STORAGE_KEYS.AUDIT_LOGS);
  logs.unshift({
    id: util.generateId(),
    targetId,
    type,
    result,
    operator,
    reason: reason || '',
    createTime: Date.now()
  });
  storage.set(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 500));
}

function getAuditLogs(type, targetId) {
  const logs = storage.getList(STORAGE_KEYS.AUDIT_LOGS);
  return logs.filter(log => {
    if (type && log.type !== type) return false;
    if (targetId && log.targetId !== targetId) return false;
    return true;
  }).sort((a, b) => b.createTime - a.createTime);
}

function getSensitiveWords() {
  const customWords = storage.get(STORAGE_KEYS.SENSITIVE_WORDS_CONFIG);
  if (customWords && Array.isArray(customWords)) {
    return customWords;
  }
  return constants.SENSITIVE_WORDS || [];
}

function addSensitiveWord(word) {
  if (!word || !word.trim()) return { success: false, message: '请输入敏感词' };
  const words = getSensitiveWords();
  if (words.includes(word.trim())) return { success: false, message: '该敏感词已存在' };
  words.push(word.trim());
  storage.set(STORAGE_KEYS.SENSITIVE_WORDS_CONFIG, words);
  return { success: true, message: '添加成功' };
}

function removeSensitiveWord(word) {
  const words = getSensitiveWords();
  const newWords = words.filter(w => w !== word);
  if (newWords.length === words.length) return { success: false, message: '敏感词不存在' };
  storage.set(STORAGE_KEYS.SENSITIVE_WORDS_CONFIG, newWords);
  return { success: true, message: '删除成功' };
}

function checkSensitiveContent(content) {
  const words = getSensitiveWords();
  const hits = [];
  words.forEach(word => {
    if (content && content.includes(word)) {
      hits.push(word);
    }
  });
  return hits;
}

module.exports = {
  getAuditItemsByType,
  getAllPendingItems,
  getAuditStats,
  approveItem,
  rejectItem,
  banItem,
  getAuditLogs,
  getSensitiveWords,
  addSensitiveWord,
  removeSensitiveWord,
  checkSensitiveContent
};
