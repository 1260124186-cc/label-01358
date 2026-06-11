const app = getApp();
const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    userId: '',
    avatar: '',
    name: '',
    creditScore: 0,
    levelInfo: null,
    completionRate: 0,
    goodRate: 0,
    totalAccepted: 0,
    totalCompleted: 0,
    creditLevels: [],
    violations: [],
    recentOrders: [],
    loading: true
  },

  onLoad() {
    const userInfo = app.globalData.userInfo || {};
    const userId = userInfo.id || 'test_user';
    this.setData({ userId });
    this.loadData();
  },

  onShow() {},

  loadData() {
    const { userId } = this.data;
    const detail = dataService.getRunnerCreditDetail(userId);

    if (!detail) {
      this.setData({ loading: false });
      return;
    }

    const levelInfo = constants.ERRAND_CREDIT_LEVELS.find(
      l => detail.creditScore >= l.min && detail.creditScore <= l.max
    ) || constants.ERRAND_CREDIT_LEVELS[constants.ERRAND_CREDIT_LEVELS.length - 1];

    const creditLevels = constants.ERRAND_CREDIT_LEVELS.map(l => ({
      ...l,
      isCurrent: detail.creditScore >= l.min && detail.creditScore <= l.max
    }));

    const violations = (detail.violations || []).map(v => {
      const typeInfo = constants.ERRAND_VIOLATION_TYPES.find(t => t.value === v.type) || {};
      return {
        ...v,
        icon: typeInfo.icon || '⚠️',
        timeText: util.relativeTime(v.time)
      };
    });

    const allOrders = dataService.getMyAcceptedOrders(userId);
    const completedOrders = allOrders
      .filter(o => o.status === 'completed')
      .slice(0, 5);

    const recentOrders = completedOrders.map(o => {
      const typeInfo = constants.ERRAND_TASK_TYPES.find(t => t.value === o.type) || {};
      return {
        id: o.id,
        typeIcon: typeInfo.icon || '📋',
        typeText: typeInfo.label || o.type,
        title: o.title || o.purchaseItem || o.deliveryItem || o.otherDesc || '跑腿订单',
        timeText: util.formatTime(o.createTime, 'MM-DD HH:mm'),
        rating: o.publisherRating || null,
        ratingScore: o.publisherRating ? o.publisherRating.score : 0,
        bounty: o.bounty
      };
    });

    this.setData({
      avatar: detail.avatar || '',
      name: detail.name || '张同学',
      creditScore: detail.creditScore || 0,
      levelInfo,
      completionRate: detail.completionRate || 0,
      goodRate: detail.goodRate || 0,
      totalAccepted: detail.totalAccepted || 0,
      totalCompleted: detail.totalCompleted || 0,
      creditLevels,
      violations,
      recentOrders,
      loading: false
    });
  },

  onOrderTap(e) {
    const id = e.currentTarget.dataset.id;
    if (id) {
      util.navigateTo('/pages/errand/order-detail/index?id=' + id);
    }
  }
});
