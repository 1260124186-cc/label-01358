const app = getApp();
const dataService = require('../../services/data');
const constants = require('../../config/constants');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    categories: [],
    currentCategory: 'all',
    rewardList: [],
    myPoints: 0,
    myOrders: []
  },

  onLoad() {
    this.setData({
      categories: constants.LOW_CARBON_REWARD_CATEGORIES
    });
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const userId = (app.globalData.userInfo || {}).id || 'test_user';
    const points = dataService.getLowCarbonPoints(userId);
    const rewardList = dataService.getLowCarbonRewardList(this.data.currentCategory);
    const orders = dataService.getLowCarbonRedeemOrders(userId);

    const formattedList = rewardList.map(item => {
      const canRedeem = points.totalPoints >= item.points && item.stock > 0;
      const statusLabel = item.stock <= 0 ? '已兑完' : points.totalPoints < item.points ? '积分不足' : '可兑换';
      const categoryLabel = constants.getLabelByValue(constants.LOW_CARBON_REWARD_CATEGORIES, item.category);

      return {
        ...item,
        canRedeem,
        statusLabel,
        categoryLabel
      };
    });

    this.setData({
      myPoints: points.totalPoints,
      rewardList: formattedList,
      myOrders: orders.slice(0, 5)
    });
  },

  onCategoryTap(e) {
    const { category } = e.currentTarget.dataset;
    this.setData({ currentCategory: category });
    this.loadData();
  },

  onRedeem(e) {
    const { id } = e.currentTarget.dataset;
    const item = this.data.rewardList.find(r => r.id === id);
    if (!item || !item.canRedeem) return;

    wx.showModal({
      title: '确认兑换',
      content: `使用 ${item.points} 积分兑换「${item.title}」？`,
      success: (res) => {
        if (res.confirm) {
          const userId = (app.globalData.userInfo || {}).id || 'test_user';
          const result = dataService.redeemReward(userId, id);
          if (result.success) {
            wx.showToast({ title: '兑换成功！', icon: 'success' });
          } else {
            wx.showToast({ title: result.message, icon: 'none' });
          }
          this.loadData();
        }
      }
    });
  },

  onNavShop() {
    wx.switchTab({ url: '/pages/market/index' });
  }
});
