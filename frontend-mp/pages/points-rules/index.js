const util = require('../../utils/util.js');
const constants = require('../../config/constants.js');
const pointsService = require('../../services/pointsService.js');
const app = getApp();

Page({
  data: {
    darkMode: false,
    currentPoints: 0,
    validityConfig: null,
    earnRules: [],
    spendRules: [],
    expireRules: [],
    activeTab: 'earn',
    tabs: [
      { value: 'earn', label: '获取规则' },
      { value: 'spend', label: '消耗规则' },
      { value: 'expire', label: '过期规则' }
    ],
    currentContent: []
  },

  onLoad(options) {
    this.setData({
      darkMode: app.globalData.darkMode || false
    });
    this.loadData();
  },

  onShow() {
    if (util.isLoggedIn()) {
      const currentPoints = pointsService.getUserPoints();
      this.setData({ currentPoints });
    }
  },

  loadData() {
    try {
      const currentPoints = util.isLoggedIn() ? pointsService.getUserPoints() : 0;
      const validityConfig = constants.POINTS_VALIDITY_CONFIG;
      const earnRules = this.formatRules(constants.POINTS_RULES_CONFIG.earn, 'earn');
      const spendRules = this.formatRules(constants.POINTS_RULES_CONFIG.spend, 'spend');
      const expireRules = this.formatRules(constants.POINTS_RULES_CONFIG.expire, 'expire');

      this.setData({
        currentPoints,
        validityConfig,
        earnRules,
        spendRules,
        expireRules,
        currentContent: earnRules
      });
    } catch (error) {
      console.error('加载积分规则失败:', error);
    }
  },

  formatRules(rules, type) {
    return rules.map(rule => {
      let icon = '📋';
      let color = '#666666';
      
      if (type === 'earn') {
        color = '#10B981';
        const iconMap = {
          'reward_earn': '🎁',
          'signin': '📅',
          'first_lost': '🔍',
          'real_name': '✅',
          'survey': '📝',
          'volunteer': '🤝',
          'secondhand_sell': '💰',
          'admin_grant': '🎊',
          'continue_7': '🏅',
          'continue_30': '🏆'
        };
        icon = iconMap[rule.type] || '✨';
      } else if (type === 'spend') {
        color = '#EF4444';
        const iconMap = {
          'exchange': '🛒',
          'top_publish': '📌',
          'reward_bonus': '⚡',
          'reward_publish': '🎗️',
          'fine': '⚠️'
        };
        icon = iconMap[rule.type] || '💸';
      } else if (type === 'expire') {
        color = '#F59E0B';
        icon = '⏰';
      }

      return {
        ...rule,
        icon,
        color,
        pointsText: rule.points ? `+${rule.points}` : (rule.pointsRange ? rule.pointsRange : ''),
        limitText: this.getLimitText(rule)
      };
    });
  },

  getLimitText(rule) {
    if (rule.maxDaily) {
      return `每日限${rule.maxDaily}次`;
    }
    if (rule.maxTotal) {
      return `限${rule.maxTotal}次`;
    }
    if (rule.type === 'continue_7') {
      return '连续签到7天可领';
    }
    if (rule.type === 'continue_30') {
      return '连续签到30天可领';
    }
    return '';
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    let content = [];
    if (tab === 'earn') {
      content = this.data.earnRules;
    } else if (tab === 'spend') {
      content = this.data.spendRules;
    } else if (tab === 'expire') {
      content = this.data.expireRules;
    }
    this.setData({
      activeTab: tab,
      currentContent: content
    });
  },

  goHistory() {
    util.checkLoginAndGo('/pages/points-history/index');
  },

  goTasks() {
    util.checkLoginAndGo('/pages/points-tasks/index');
  },

  goMall() {
    util.checkLoginAndGo('/pages/points-mall/index');
  }
});
