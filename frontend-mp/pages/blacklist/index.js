const util = require('../../utils/util.js');
const userService = require('../../services/userService.js');
const app = getApp();

Page({
  data: {
    darkMode: false,
    loading: false,
    blacklist: [],
    showConfirm: false,
    confirmData: null
  },

  onLoad() {
    this.setData({
      darkMode: app.globalData.darkMode || false
    });
    this.loadBlacklist();
  },

  onShow() {
    this.loadBlacklist();
  },

  loadBlacklist() {
    this.setData({ loading: true });

    try {
      const currentUser = app.globalData.userInfo;
      if (!currentUser) {
        util.showToast('请先登录');
        setTimeout(() => {
          wx.navigateTo({ url: '/pages/login/index' });
        }, 1500);
        return;
      }

      const blacklist = userService.getBlacklist(currentUser.id);
      const formattedList = blacklist.map(item => {
        const user = userService.getUserById(item.blockedUserId);
        return {
          ...item,
          user: user ? userService.sanitizeUserInfo(user) : null,
          timeText: util.relativeTime(item.createTime)
        };
      }).filter(item => item.user !== null);

      this.setData({ 
        blacklist: formattedList,
        loading: false 
      });
    } catch (error) {
      console.error('加载黑名单失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  onUserTap(e) {
    const { userId } = e.currentTarget.dataset;
    util.navigateTo(`/pages/user-profile/index?userId=${userId}`);
  },

  onRemoveTap(e) {
    const { userId, nickName } = e.currentTarget.dataset;
    this.setData({
      showConfirm: true,
      confirmData: {
        userId,
        nickName,
        message: `确定要将「${nickName}」从黑名单中移出吗？`
      }
    });
  },

  onConfirmRemove() {
    const { confirmData } = this.data;
    if (!confirmData) return;

    try {
      const currentUser = app.globalData.userInfo;
      const result = userService.removeFromBlacklist(currentUser.id, confirmData.userId);

      if (result.success) {
        util.showSuccess('已移出黑名单');
        this.loadBlacklist();
      } else {
        util.showToast(result.message || '操作失败');
      }
    } catch (error) {
      console.error('移出黑名单失败:', error);
      util.showToast('操作失败');
    } finally {
      this.setData({ showConfirm: false, confirmData: null });
    }
  },

  onCancelRemove() {
    this.setData({ showConfirm: false, confirmData: null });
  },

  goBack() {
    wx.navigateBack();
  }
});
