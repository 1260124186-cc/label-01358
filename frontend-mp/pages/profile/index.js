const app = getApp();
const dataService = require('../../services/data');
const util = require('../../utils/util');

Page({
  data: {
    userInfo: {},
    favoritesCount: 0,
    historyCount: 0
  },

  onLoad() {
    this.loadUserInfo();
  },

  onShow() {
    this.loadUserInfo();
    this.loadCounts();
  },

  loadUserInfo() {
    const userInfo = app.globalData.userInfo || {};
    this.setData({ userInfo });
  },

  loadCounts() {
    const favorites = dataService.getFavorites();
    const history = dataService.getHistory();
    
    this.setData({
      favoritesCount: favorites.length,
      historyCount: history.length
    });
  },

  onEditProfile() {
    // 未登录跳转登录页，已登录跳转编辑页
    if (!this.data.userInfo.nickName) {
      util.navigateTo('/pages/login/index');
    } else {
      util.navigateTo('/pages/profile-edit/index');
    }
  },

  onMenuTap(e) {
    const { type } = e.currentTarget.dataset;
    
    // 这些功能需要登录
    if (['favorites', 'history', 'myLostFound', 'myMarket'].includes(type)) {
      if (!util.checkLogin()) {
        return;
      }
    }
    
    switch (type) {
      case 'favorites':
        util.navigateTo('/pages/favorites/index');
        break;
      case 'history':
        util.navigateTo('/pages/history/index');
        break;
      case 'myLostFound':
        util.showToast('功能开发中');
        break;
      case 'myMarket':
        util.showToast('功能开发中');
        break;
    }
  },

  async onClearCache() {
    const confirm = await util.showConfirm('确定要清除所有缓存数据吗？这将清除您的浏览历史。');
    
    if (confirm) {
      dataService.clearHistory();
      this.loadCounts();
      util.showSuccess('清除成功');
    }
  },

  onAbout() {
    wx.showModal({
      title: '关于我们',
      content: '校园生活服务小程序 v1.0.0\n\n为校园师生提供便捷的失物招领、二手交易、校园资讯等服务。',
      showCancel: false,
      confirmColor: '#FF6B6B'
    });
  },

  async onLogout() {
    const confirm = await util.showConfirm('确定要退出登录吗？');
    
    if (confirm) {
      // 清除用户信息
      app.globalData.userInfo = {};
      wx.removeStorageSync('userInfo');
      
      // 清除收藏和浏览历史
      dataService.clearFavorites();
      dataService.clearHistory();
      
      this.setData({ 
        userInfo: {},
        favoritesCount: 0,
        historyCount: 0
      });
      util.showSuccess('已退出登录');
    }
  }
});
