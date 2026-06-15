const app = getApp();
const dataService = require('../../services/data');
const keywordService = require('../../services/keywordSubscriptionService');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    subscriptions: [],
    settings: {},
    stats: null,
    hotKeywords: [],
    showAddDialog: false,
    newKeyword: '',
    selectedModules: ['lost_found', 'market', 'forum'],
    allModules: constants.KEYWORD_SUBSCRIPTION_MODULES,
    moduleSelectedMap: {},
    showSettings: false,
    showTimePicker: false,
    timePickerType: 'start',
    dndStartTime: '22:00',
    dndEndTime: '08:00',
    pushAuthStatus: null,
    loading: false
  },

  onLoad() {
    this.loadThemeState();
    this.initModuleMap();
  },

  onShow() {
    this.loadThemeState();
    this.loadData();
  },

  loadThemeState() {
    const { isDark } = app.globalData;
    this.setData({ darkMode: isDark || false });
  },

  initModuleMap() {
    const moduleSelectedMap = {};
    this.data.selectedModules.forEach(m => { moduleSelectedMap[m] = true; });
    this.setData({ moduleSelectedMap });
  },

  async loadData() {
    this.setData({ loading: true });

    try {
      const subscriptions = dataService.getKeywordSubscriptions();
      const settings = dataService.getKeywordSubscriptionSettings();
      const stats = keywordService.getSubscriptionStats();
      const hotKeywords = keywordService.getHotKeywords(10);
      const authStatus = await keywordService.checkSubscriptionAuth('keyword_alert');

      const formattedSubscriptions = subscriptions.map(item => ({
        ...item,
        moduleLabels: item.modules.map(m => {
          const moduleInfo = constants.KEYWORD_SUBSCRIPTION_MODULES.find(mod => mod.value === m);
          return moduleInfo ? moduleInfo.label : m;
        }).join('、'),
        lastMatchText: item.lastMatchTime ? util.relativeTime(item.lastMatchTime) : '暂无匹配'
      }));

      this.setData({
        subscriptions: formattedSubscriptions,
        settings,
        stats,
        hotKeywords,
        pushAuthStatus: authStatus,
        dndStartTime: settings.dndStartTime,
        dndEndTime: settings.dndEndTime,
        loading: false
      });
    } catch (e) {
      console.error('加载数据失败:', e);
      this.setData({ loading: false });
      util.showError('加载失败');
    }
  },

  onShowAddDialog() {
    this.setData({
      showAddDialog: true,
      newKeyword: '',
      selectedModules: ['lost_found', 'market', 'forum']
    });
    this.initModuleMap();
  },

  onHideAddDialog() {
    this.setData({ showAddDialog: false });
  },

  onKeywordInput(e) {
    this.setData({ newKeyword: e.detail.value });
  },

  onToggleModule(e) {
    const { value } = e.currentTarget.dataset;
    let selectedModules = [...this.data.selectedModules];
    const index = selectedModules.indexOf(value);

    if (index > -1) {
      selectedModules.splice(index, 1);
    } else {
      selectedModules.push(value);
    }

    const moduleSelectedMap = {};
    selectedModules.forEach(m => { moduleSelectedMap[m] = true; });

    this.setData({ selectedModules, moduleSelectedMap });
  },

  onSelectAllModules() {
    const allValues = constants.KEYWORD_SUBSCRIPTION_MODULES.map(m => m.value);
    const moduleSelectedMap = {};
    allValues.forEach(m => { moduleSelectedMap[m] = true; });
    this.setData({ selectedModules: allValues, moduleSelectedMap });
  },

  async onAddKeyword() {
    const { newKeyword, selectedModules } = this.data;

    if (!newKeyword.trim()) {
      util.showToast('请输入关键词');
      return;
    }

    if (selectedModules.length === 0) {
      util.showToast('请至少选择一个模块');
      return;
    }

    const result = dataService.addKeywordSubscription(newKeyword.trim(), selectedModules);

    if (result.success) {
      util.showSuccess('订阅成功');
      this.setData({ showAddDialog: false });
      this.loadData();

      const authStatus = await keywordService.checkSubscriptionAuth('keyword_alert');
      if (authStatus.needAuth && !authStatus.rejected) {
        wx.showModal({
          title: '开启推送提醒',
          content: '是否开启微信订阅消息推送？当有关键词匹配时将第一时间通知您。',
          confirmText: '开启',
          success: async (res) => {
            if (res.confirm) {
              await keywordService.requestSubscribeMessage('keyword_alert');
              this.loadData();
            }
          }
        });
      }
    } else {
      util.showError(result.message);
    }
  },

  onQuickSubscribe(e) {
    const { keyword } = e.currentTarget.dataset;
    this.setData({ newKeyword: keyword });
    this.onAddKeyword();
  },

  onToggleSubscription(e) {
    const { id } = e.currentTarget.dataset;
    const success = dataService.toggleKeywordSubscription(id);
    if (success) {
      this.loadData();
    }
  },

  onDeleteSubscription(e) {
    const { id, keyword } = e.currentTarget.dataset;

    wx.showModal({
      title: '取消订阅',
      content: `确定要取消订阅关键词「${keyword}」吗？`,
      success: (res) => {
        if (res.confirm) {
          const success = dataService.deleteKeywordSubscription(id);
          if (success) {
            util.showSuccess('已取消订阅');
            this.loadData();
          } else {
            util.showError('取消失败');
          }
        }
      }
    });
  },

  onEditSubscription(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/keyword-subscription/edit?id=${id}`);
  },

  onShowSettings() {
    this.setData({ showSettings: true });
  },

  onHideSettings() {
    this.setData({ showSettings: false });
  },

  onToggleSetting(e) {
    const { type } = e.currentTarget.dataset;
    const { value } = e.detail;

    if (type === 'enabled') {
      dataService.updateKeywordSubscriptionSettings({ enabled: value });
    } else if (type === 'pushEnabled') {
      if (value) {
        this.requestPushAuth();
      } else {
        dataService.updateKeywordSubscriptionSettings({ pushEnabled: value });
      }
    } else if (type === 'dndEnabled') {
      dataService.updateKeywordSubscriptionSettings({ dndEnabled: value });
    }

    this.loadData();
  },

  async requestPushAuth() {
    const result = await keywordService.requestSubscribeMessage('keyword_alert');
    if (result.success) {
      dataService.updateKeywordSubscriptionSettings({ pushEnabled: true });
      util.showSuccess('已开启推送');
    } else if (result.rejected) {
      util.showToast('您已拒绝推送权限，可在微信设置中开启');
    } else if (result.needConfig) {
      util.showToast('推送模板未配置，请联系管理员');
    }
    this.loadData();
  },

  onShowTimePicker(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({
      showTimePicker: true,
      timePickerType: type
    });
  },

  onHideTimePicker() {
    this.setData({ showTimePicker: false });
  },

  onTimeChange(e) {
    const { value } = e.detail;
    const { timePickerType } = this.data;

    if (timePickerType === 'start') {
      this.setData({ dndStartTime: value });
      dataService.updateKeywordSubscriptionSettings({ dndStartTime: value });
    } else {
      this.setData({ dndEndTime: value });
      dataService.updateKeywordSubscriptionSettings({ dndEndTime: value });
    }

    this.loadData();
  },

  onMaxNotificationsChange(e) {
    const { value } = e.detail;
    const maxDailyNotifications = parseInt(value) || 20;
    dataService.updateKeywordSubscriptionSettings({ maxDailyNotifications });
    this.loadData();
  },

  onGoToNotifications() {
    util.navigateTo('/pages/notifications/index?type=keyword');
  },

  stopPropagation() {}
});
