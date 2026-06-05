App({
  globalData: {
    userInfo: null,
    systemInfo: null,
    statusBarHeight: 0,
    navBarHeight: 44
  },

  onLaunch() {
    this.initSystemInfo();
    this.loadUserInfo();
    this.initTestAccount();
  },

  // 初始化测试账号
  initTestAccount() {
    try {
      const users = wx.getStorageSync('users') || [];
      const testAccountExists = users.some(u => u.account === 'test');
      if (!testAccountExists) {
        users.push({
          nickName: 'test',
          account: 'test',
          password: '123456',
          avatarUrl: '',
          createTime: Date.now()
        });
        wx.setStorageSync('users', users);
      }
    } catch (e) {
      console.error('初始化测试账号失败:', e);
    }
  },

  initSystemInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      this.globalData.systemInfo = systemInfo;
      this.globalData.statusBarHeight = systemInfo.statusBarHeight || 20;
    } catch (e) {
      console.error('获取系统信息失败:', e);
    }
  },

  loadUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.globalData.userInfo = userInfo;
      }
    } catch (e) {
      console.error('读取用户信息失败:', e);
    }
  },

  updateUserInfo(userInfo) {
    this.globalData.userInfo = userInfo;
    try {
      wx.setStorageSync('userInfo', userInfo);
    } catch (e) {
      console.error('保存用户信息失败:', e);
    }
  },

  clearUserInfo() {
    this.globalData.userInfo = null;
    try {
      wx.removeStorageSync('userInfo');
    } catch (e) {
      console.error('清除用户信息失败:', e);
    }
  }
});
