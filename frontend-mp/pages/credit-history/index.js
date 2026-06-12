const util = require('../../utils/util.js');
const userService = require('../../services/userService.js');
const app = getApp();

Page({
  data: {
    darkMode: false,
    loading: false,
    userId: '',
    userInfo: null,
    creditHistory: [],
    creditStats: null
  },

  onLoad(options) {
    const userId = options.userId || (app.globalData.userInfo ? app.globalData.userInfo.id : '');
    
    this.setData({
      darkMode: app.globalData.darkMode || false,
      userId
    });

    if (!userId) {
      util.showToast('请先登录');
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/login/index' });
      }, 1500);
      return;
    }

    this.loadData();
  },

  onShow() {
    if (this.data.userId) {
      this.loadData();
    }
  },

  loadData() {
    this.setData({ loading: true });

    try {
      const user = userService.getUserById(this.data.userId);
      if (!user) {
        util.showToast('用户不存在');
        setTimeout(() => wx.navigateBack(), 1500);
        return;
      }

      const history = userService.getCreditScoreHistory(this.data.userId);
      const formattedHistory = history.map(item => ({
        ...item,
        timeText: util.relativeTime(item.createTime),
        dateText: util.formatDate(item.createTime),
        changeClass: item.change > 0 ? 'positive' : item.change < 0 ? 'negative' : 'neutral',
        changeText: item.change > 0 ? `+${item.change}` : item.change.toString(),
        typeIcon: this.getChangeTypeIcon(item.type),
        typeLabel: this.getChangeTypeLabel(item.type)
      }));

      const stats = this.calculateStats(history);

      this.setData({
        userInfo: userService.sanitizeUserInfo(user),
        creditHistory: formattedHistory,
        creditStats: stats,
        loading: false
      });
    } catch (error) {
      console.error('加载信用历史失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  calculateStats(history) {
    let totalPositive = 0;
    let totalNegative = 0;
    let maxScore = 0;
    let minScore = 100;

    history.forEach(item => {
      if (item.change > 0) {
        totalPositive += item.change;
      } else if (item.change < 0) {
        totalNegative += Math.abs(item.change);
      }
      if (item.scoreAfter > maxScore) {
        maxScore = item.scoreAfter;
      }
      if (item.scoreAfter < minScore) {
        minScore = item.scoreAfter;
      }
    });

    return {
      totalPositive,
      totalNegative,
      maxScore,
      minScore,
      totalRecords: history.length
    };
  },

  getChangeTypeIcon(type) {
    const icons = {
      'publish': '📝',
      'complete': '✅',
      'cancel': '❌',
      'report': '🚫',
      'verify': '🎓',
      'violation': '⚠️',
      'trade': '🤝',
      'other': '📋'
    };
    return icons[type] || '📋';
  },

  getChangeTypeLabel(type) {
    const labels = {
      'publish': '发布内容',
      'complete': '完成交易',
      'cancel': '取消交易',
      'report': '处理举报',
      'verify': '实名认证',
      'violation': '违规处罚',
      'trade': '交易评价',
      'other': '其他调整'
    };
    return labels[type] || '信用调整';
  },

  goBack() {
    wx.navigateBack();
  },

  viewRules() {
    wx.showModal({
      title: '信用评分规则',
      content: 
        '【加分规则】\n' +
        '• 完成实名认证：+10分\n' +
        '• 发布内容并通过审核：+2分/条\n' +
        '• 完成交易并获得好评：+5分/次\n' +
        '• 举报违规内容并核实：+3分/次\n' +
        '• 连续30天无违规：+5分\n\n' +
        '【扣分规则】\n' +
        '• 发布违规内容：-10分/次\n' +
        '• 恶意举报：-5分/次\n' +
        '• 失约取消交易：-8分/次\n' +
        '• 被举报并核实：-15分/次\n' +
        '• 欺诈行为：-50分并封号\n\n' +
        '【信用等级】\n' +
        '• S级：95-100分，信誉极好\n' +
        '• A级：85-94分，信誉优秀\n' +
        '• B级：70-84分，信誉良好\n' +
        '• C级：60-69分，信誉一般\n' +
        '• D级：0-59分，信誉较差',
      showCancel: false,
      confirmText: '我知道了'
    });
  }
});
