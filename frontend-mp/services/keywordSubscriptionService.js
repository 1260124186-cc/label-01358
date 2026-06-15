const dataService = require('./data');
const constants = require('../config/constants');
const util = require('../utils/util');
const storage = require('../utils/storage');

const SUBSCRIPTION_TEMPLATE_IDS = constants.KEYWORD_SUBSCRIPTION_TEMPLATE_IDS;

async function requestSubscribeMessage(templateType = 'keyword_alert') {
  const templateId = SUBSCRIPTION_TEMPLATE_IDS[templateType];
  if (!templateId || templateId.startsWith('YOUR_')) {
    console.warn('订阅消息模板ID未配置，请在 constants.js 中配置 KEYWORD_SUBSCRIPTION_TEMPLATE_IDS');
    return { success: false, needConfig: true };
  }

  return new Promise((resolve) => {
    wx.requestSubscribeMessage({
      tmplIds: [templateId],
      success: (res) => {
        const status = res[templateId];
        if (status === 'accept') {
          resolve({ success: true, accepted: true });
        } else if (status === 'reject') {
          resolve({ success: false, rejected: true });
        } else {
          resolve({ success: false, status });
        }
      },
      fail: (err) => {
        console.error('订阅消息请求失败:', err);
        resolve({ success: false, error: err });
      }
    });
  });
}

async function checkSubscriptionAuth(templateType = 'keyword_alert') {
  const templateId = SUBSCRIPTION_TEMPLATE_IDS[templateType];
  if (!templateId || templateId.startsWith('YOUR_')) {
    return { configured: false };
  }

  return new Promise((resolve) => {
    wx.getSetting({
      withSubscriptions: true,
      success: (res) => {
        const subscriptions = res.subscriptionsSetting || {};
        const itemSettings = subscriptions.itemSettings || {};
        const status = itemSettings[templateId];
        
        resolve({
          configured: true,
          status: status,
          accepted: status === 'accept',
          rejected: status === 'reject',
          needAuth: status !== 'accept'
        });
      },
      fail: () => {
        resolve({ configured: true, status: 'unknown', needAuth: true });
      }
    });
  });
}

async function sendSubscriptionNotification(notification, templateType = 'keyword_alert') {
  const settings = dataService.getKeywordSubscriptionSettings();
  if (!settings.pushEnabled) {
    return { success: false, reason: 'push_disabled' };
  }

  if (dataService.isInDNDPeriod()) {
    return { success: false, reason: 'dnd_period' };
  }

  const authStatus = await checkSubscriptionAuth(templateType);
  if (!authStatus.accepted) {
    return { success: false, reason: 'not_authorized' };
  }

  console.log('发送订阅消息通知:', notification);
  return { success: true, sent: true };
}

function processNewContent(content, title, moduleType, contentId) {
  const notifications = dataService.checkAndCreateKeywordNotification(
    content,
    title,
    moduleType,
    contentId
  );

  notifications.forEach(notification => {
    sendSubscriptionNotification(notification, 'keyword_alert');
  });

  return notifications;
}

function processLostFoundMatch(lostItem, foundItem, matchResult) {
  if (matchResult.score < 60) {
    return [];
  }

  const notifications = [];
  const app = getApp();
  const currentUserId = app.globalData.userInfo?.id || 'test_user';

  if (lostItem.userId === currentUserId) {
    const notification = dataService.createNotification({
      type: 'keyword',
      subType: 'lost_found_match',
      title: '📢 找到可能匹配的招领信息',
      content: `您发布的寻物启事「${lostItem.title.substring(0, 20)}...」有新的匹配结果，匹配度 ${matchResult.score}%`,
      data: {
        moduleType: 'lost_found',
        matchId: matchResult.foundItemId,
        lostItemId: lostItem.id,
        foundItemId: foundItem.id,
        matchScore: matchResult.score,
        matchLevel: matchResult.matchLevel
      }
    });

    if (notification) {
      notifications.push(notification);
      sendSubscriptionNotification(notification, 'lost_found_match');
    }
  }

  if (foundItem.userId === currentUserId) {
    const notification = dataService.createNotification({
      type: 'keyword',
      subType: 'lost_found_match',
      title: '📢 有人在寻找您捡到的物品',
      content: `您发布的招领信息「${foundItem.title.substring(0, 20)}...」有新的匹配寻物启事，匹配度 ${matchResult.score}%`,
      data: {
        moduleType: 'lost_found',
        matchId: matchResult.lostItemId,
        lostItemId: lostItem.id,
        foundItemId: foundItem.id,
        matchScore: matchResult.score,
        matchLevel: matchResult.matchLevel
      }
    });

    if (notification) {
      notifications.push(notification);
      sendSubscriptionNotification(notification, 'lost_found_match');
    }
  }

  return notifications;
}

function processLostFoundItemPublish(item) {
  if (item.type === 'lost') {
    const matcherService = require('./lostFoundMatcher');
    const matchResult = matcherService.findMatchesForItem(item, {
      minScore: 60,
      limit: 5
    });

    const notifications = [];
    matchResult.matches.forEach(match => {
      const matchedItem = match.item;
      if (matchedItem.type === 'found') {
        const result = processLostFoundMatch(item, matchedItem, match);
        notifications.push(...result);
      }
    });

    return notifications;
  } else if (item.type === 'found') {
    const matcherService = require('./lostFoundMatcher');
    const matchResult = matcherService.findMatchesForItem(item, {
      minScore: 60,
      limit: 5
    });

    const notifications = [];
    matchResult.matches.forEach(match => {
      const matchedItem = match.item;
      if (matchedItem.type === 'lost') {
        const result = processLostFoundMatch(matchedItem, item, match);
        notifications.push(...result);
      }
    });

    return notifications;
  }

  return [];
}

function getHotKeywords(limit = 10) {
  const allItems = [
    ...dataService.getLostFoundList(),
    ...dataService.getMarketList(),
    ...dataService.getForumPostList()
  ];

  const keywordCount = {};

  allItems.forEach(item => {
    const title = item.title || '';
    const description = item.description || item.content || '';
    const text = `${title} ${description}`.toLowerCase();

    const commonKeywords = [
      'airpods', '手机', '钱包', '钥匙', '身份证', '校园卡',
      '笔记本', '书包', '伞', '眼镜', '手表', '充电器',
      '高等数学', '英语', '考研', '考公', '四级', '六级',
      '西区', '东区', '南区', '北区', '宿舍', '教学楼',
      '图书馆', '食堂', '超市', '打印', '快递'
    ];

    commonKeywords.forEach(keyword => {
      if (text.includes(keyword)) {
        keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
      }
    });
  });

  const sorted = Object.entries(keywordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([keyword, count]) => ({ keyword, count }));

  return sorted;
}

function getSubscriptionStats() {
  const subscriptions = dataService.getKeywordSubscriptions();
  const settings = dataService.getKeywordSubscriptionSettings();
  const notificationLog = storage.getList(storage.STORAGE_KEYS.KEYWORD_NOTIFICATION_LOG);

  const today = new Date().toDateString();
  const todayNotifications = notificationLog.filter(l => 
    new Date(l.createTime).toDateString() === today
  );

  const moduleStats = {
    lost_found: 0,
    market: 0,
    forum: 0
  };

  notificationLog.forEach(log => {
    if (moduleStats[log.moduleType] !== undefined) {
      moduleStats[log.moduleType]++;
    }
  });

  return {
    totalSubscriptions: subscriptions.length,
    enabledSubscriptions: subscriptions.filter(s => s.enabled).length,
    totalMatches: subscriptions.reduce((sum, s) => sum + (s.matchCount || 0), 0),
    todayNotifications: todayNotifications.length,
    moduleStats,
    settings
  };
}

module.exports = {
  requestSubscribeMessage,
  checkSubscriptionAuth,
  sendSubscriptionNotification,
  processNewContent,
  processLostFoundMatch,
  processLostFoundItemPublish,
  getHotKeywords,
  getSubscriptionStats
};
