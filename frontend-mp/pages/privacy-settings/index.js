const app = getApp();
const util = require('../../utils/util');
const storage = require('../../utils/storage');
const { STORAGE_KEYS } = storage;
const userService = require('../../services/userService');
const dataService = require('../../services/data');

const DEFAULT_PRIVACY_SETTINGS = {
  phoneDisplayMode: 'masked',
  showRealNameBadge: true,
  allowPrivateMessage: true,
  defaultContactStrategy: 'account',
  customContactPhone: ''
};

const PHONE_DISPLAY_OPTIONS = [
  { value: 'hidden', label: '完全隐藏', desc: '所有人都看不到手机号' },
  { value: 'masked', label: '脱敏展示', desc: '仅显示前3后4位，如 138****5678' },
  { value: 'loggedIn', label: '仅登录用户可见', desc: '登录用户可查看完整手机号' }
];

const CONTACT_STRATEGY_OPTIONS = [
  { value: 'account', label: '使用账号绑定手机', desc: '发布内容时默认使用绑定手机号' },
  { value: 'custom', label: '自定义联系方式', desc: '发布内容时使用自定义手机号' }
];

Page({
  data: {
    darkMode: false,
    privacySettings: { ...DEFAULT_PRIVACY_SETTINGS },
    phoneDisplayOptions: PHONE_DISPLAY_OPTIONS,
    contactStrategyOptions: CONTACT_STRATEGY_OPTIONS,
    showPhonePicker: false,
    showContactPicker: false,
    showDeleteConfirm: false,
    deleteStep: 1,
    deleteConfirmText: '',
    exportLoading: false,
    userPhone: '',
    blacklistCount: 0
  },

  onLoad() {
    this.loadThemeState();
    this.loadPrivacySettings();
    this.loadUserInfo();
    this.loadBlacklistCount();
  },

  onShow() {
    this.loadThemeState();
    this.loadBlacklistCount();
  },

  loadThemeState() {
    const { isDark } = app.globalData;
    this.setData({
      darkMode: isDark || false
    });
  },

  loadPrivacySettings() {
    const saved = storage.get(STORAGE_KEYS.PRIVACY_SETTINGS);
    const settings = saved ? { ...DEFAULT_PRIVACY_SETTINGS, ...saved } : { ...DEFAULT_PRIVACY_SETTINGS };
    this.setData({ privacySettings: settings });
  },

  savePrivacySettings(updates) {
    const current = this.data.privacySettings;
    const updated = { ...current, ...updates };
    storage.set(STORAGE_KEYS.PRIVACY_SETTINGS, updated);
    this.setData({ privacySettings: updated });
    return updated;
  },

  loadUserInfo() {
    const userInfo = app.globalData.userInfo || {};
    const phone = userInfo.phone || userInfo.account || '';
    this.setData({ userPhone: phone });
  },

  loadBlacklistCount() {
    const currentUser = app.globalData.userInfo;
    if (currentUser && currentUser.id) {
      const blacklist = userService.getBlacklist(currentUser.id);
      this.setData({ blacklistCount: blacklist.length });
    }
  },

  onPhoneDisplayTap() {
    this.setData({ showPhonePicker: true });
  },

  onPhoneOptionSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.savePrivacySettings({ phoneDisplayMode: value });
    this.setData({ showPhonePicker: false });
    util.showToast('设置已保存');
  },

  onClosePhonePicker() {
    this.setData({ showPhonePicker: false });
  },

  onRealNameBadgeChange(e) {
    const value = e.detail.value;
    this.savePrivacySettings({ showRealNameBadge: value });
    util.showToast(value ? '已展示认证标识' : '已隐藏认证标识');
  },

  onPrivateMessageChange(e) {
    const value = e.detail.value;
    this.savePrivacySettings({ allowPrivateMessage: value });
    util.showToast(value ? '已允许私信' : '已关闭私信');
  },

  onContactStrategyTap() {
    this.setData({ showContactPicker: true });
  },

  onContactOptionSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.savePrivacySettings({ defaultContactStrategy: value });
    this.setData({ showContactPicker: false });
    util.showToast('设置已保存');
  },

  onCloseContactPicker() {
    this.setData({ showContactPicker: false });
  },

  onCustomPhoneInput(e) {
    const value = e.detail.value;
    this.setData({
      'privacySettings.customContactPhone': value
    });
  },

  onCustomPhoneBlur() {
    const { customContactPhone } = this.data.privacySettings;
    if (customContactPhone && !/^1[3-9]\d{9}$/.test(customContactPhone)) {
      util.showToast('请输入正确的手机号');
      return;
    }
    this.savePrivacySettings({ customContactPhone });
    util.showToast('设置已保存');
  },

  async onExportData(e) {
    const { type } = e.currentTarget.dataset;

    if (!util.checkLogin()) {
      return;
    }

    const typeLabels = {
      publications: '我的发布',
      favorites: '我的收藏',
      points: '积分流水',
      all: '全部数据'
    };

    this.setData({ exportLoading: true });

    try {
      const currentUser = app.globalData.userInfo;
      let exportData = {
        exportTime: new Date().toISOString(),
        userId: currentUser.id,
        dataType: type
      };

      if (type === 'publications' || type === 'all') {
        const publications = userService.getUserPublications(currentUser.id);
        exportData.publications = publications;
      }

      if (type === 'favorites' || type === 'all') {
        const favorites = dataService.getFavorites();
        exportData.favorites = favorites;
      }

      if (type === 'points' || type === 'all') {
        const pointTransactions = storage.getList(STORAGE_KEYS.POINT_TRANSACTIONS);
        const userPoints = pointTransactions.filter(t => t.userId === currentUser.id);
        exportData.pointTransactions = userPoints;
        exportData.userPoints = storage.get(STORAGE_KEYS.USER_POINTS) || 0;
      }

      const jsonStr = JSON.stringify(exportData, null, 2);
      const filePath = `${wx.env.USER_DATA_PATH}/privacy-export-${type}-${Date.now()}.json`;

      const fs = wx.getFileSystemManager();
      fs.writeFileSync(filePath, jsonStr, 'utf8');

      wx.showModal({
        title: '导出成功',
        content: `数据已导出，文件大小：${(jsonStr.length / 1024).toFixed(2)} KB\n\n您可以在"我的-文件"中查看`,
        showCancel: false,
        confirmText: '好的',
        confirmColor: '#FF6B6B'
      });

      userService.logUserBehavior(currentUser.id, 'export_data', { type });
    } catch (error) {
      console.error('导出数据失败:', error);
      util.showToast('导出失败，请重试');
    } finally {
      this.setData({ exportLoading: false });
    }
  },

  onDeleteAccountTap() {
    if (!util.checkLogin()) {
      return;
    }
    this.setData({
      showDeleteConfirm: true,
      deleteStep: 1,
      deleteConfirmText: ''
    });
  },

  onCloseDeleteConfirm() {
    this.setData({
      showDeleteConfirm: false,
      deleteStep: 1,
      deleteConfirmText: ''
    });
  },

  onDeleteStep1Next() {
    this.setData({ deleteStep: 2 });
  },

  onDeleteStep2Next() {
    this.setData({ deleteStep: 3 });
  },

  onDeleteConfirmInput(e) {
    this.setData({ deleteConfirmText: e.detail.value });
  },

  async onConfirmDelete() {
    const { deleteConfirmText } = this.data;

    if (deleteConfirmText !== '注销账号') {
      util.showToast('请输入"注销账号"确认');
      return;
    }

    const confirm = await util.showConfirm(
      '此操作将永久清除您的所有个人数据，且无法恢复。确定继续吗？',
      '最终确认'
    );

    if (!confirm) return;

    try {
      const currentUser = app.globalData.userInfo;
      const userId = currentUser.id;

      const deletedAccounts = storage.get(STORAGE_KEYS.USER_DELETED_ACCOUNT) || [];
      deletedAccounts.push({
        userId,
        account: currentUser.account,
        deleteTime: Date.now(),
        anonymizedStats: this.getAnonymizedStats(userId)
      });
      storage.set(STORAGE_KEYS.USER_DELETED_ACCOUNT, deletedAccounts);

      this.clearUserData(userId);

      app.globalData.userInfo = {};
      storage.remove(STORAGE_KEYS.USER_INFO);

      this.setData({
        showDeleteConfirm: false,
        deleteStep: 1,
        deleteConfirmText: ''
      });

      util.showSuccess('账号已注销');

      setTimeout(() => {
        wx.reLaunch({ url: '/pages/index/index' });
      }, 1500);
    } catch (error) {
      console.error('注销账号失败:', error);
      util.showToast('注销失败，请重试');
    }
  },

  getAnonymizedStats(userId) {
    const publications = userService.getUserPublications(userId);
    const totalPublications = Object.values(publications).flat().length;
    const favorites = dataService.getFavorites();

    return {
      totalPublications,
      favoritesCount: favorites.length,
      registerDate: app.globalData.userInfo.createTime || null,
      deleteDate: Date.now()
    };
  },

  clearUserData(userId) {
    const users = storage.getList(STORAGE_KEYS.USERS);
    const filteredUsers = users.filter(u => u.id !== userId);
    storage.set(STORAGE_KEYS.USERS, filteredUsers);

    const realNameVerify = storage.get(STORAGE_KEYS.USER_REAL_NAME_VERIFY) || {};
    delete realNameVerify[userId];
    storage.set(STORAGE_KEYS.USER_REAL_NAME_VERIFY, realNameVerify);

    const blacklist = storage.get(STORAGE_KEYS.BLACKLIST) || {};
    delete blacklist[userId];
    storage.set(STORAGE_KEYS.BLACKLIST, blacklist);

    Object.keys(blacklist).forEach(uid => {
      blacklist[uid] = blacklist[uid].filter(b => b.blockedUserId !== userId);
    });
    storage.set(STORAGE_KEYS.BLACKLIST, blacklist);

    dataService.clearFavorites();
    dataService.clearHistory();

    const pointTransactions = storage.getList(STORAGE_KEYS.POINT_TRANSACTIONS);
    const filteredPoints = pointTransactions.filter(t => t.userId !== userId);
    storage.set(STORAGE_KEYS.POINT_TRANSACTIONS, filteredPoints);

    storage.remove(STORAGE_KEYS.PRIVACY_SETTINGS);
  },

  onBlacklistTap() {
    if (!util.checkLogin()) {
      return;
    }
    util.navigateTo('/pages/blacklist/index');
  },

  onBack() {
    wx.navigateBack();
  }
});
