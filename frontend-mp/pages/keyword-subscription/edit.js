const app = getApp();
const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    subscription: null,
    keyword: '',
    selectedModules: [],
    allModules: constants.KEYWORD_SUBSCRIPTION_MODULES,
    moduleSelectedMap: {},
    enabled: true,
    loading: false,
    submitting: false
  },

  onLoad(options) {
    this.loadThemeState();
    if (options.id) {
      this.loadSubscription(options.id);
    }
  },

  loadThemeState() {
    const { isDark } = app.globalData;
    this.setData({ darkMode: isDark || false });
  },

  loadSubscription(id) {
    this.setData({ loading: true });
    const subscription = dataService.getKeywordSubscriptionById(id);

    if (!subscription) {
      util.showError('订阅不存在');
      setTimeout(() => wx.navigateBack(), 1000);
      return;
    }

    const moduleSelectedMap = {};
    subscription.modules.forEach(m => { moduleSelectedMap[m] = true; });

    this.setData({
      subscription,
      keyword: subscription.keyword,
      selectedModules: subscription.modules,
      enabled: subscription.enabled,
      moduleSelectedMap,
      loading: false
    });
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value });
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

  onToggleEnabled(e) {
    this.setData({ enabled: e.detail.value });
  },

  async onSave() {
    const { subscription, keyword, selectedModules, enabled } = this.data;

    if (!keyword.trim()) {
      util.showToast('请输入关键词');
      return;
    }

    if (selectedModules.length === 0) {
      util.showToast('请至少选择一个模块');
      return;
    }

    if (!subscription) {
      util.showError('数据错误');
      return;
    }

    this.setData({ submitting: true });

    try {
      const existingList = dataService.getKeywordSubscriptions();
      const duplicate = existingList.find(item => 
        item.id !== subscription.id && 
        item.keyword.toLowerCase() === keyword.trim().toLowerCase()
      );

      if (duplicate) {
        util.showError('该关键词已存在');
        this.setData({ submitting: false });
        return;
      }

      const success = dataService.updateKeywordSubscription(subscription.id, {
        keyword: keyword.trim(),
        modules: selectedModules,
        enabled
      });

      if (success) {
        util.showSuccess('保存成功');
        setTimeout(() => wx.navigateBack(), 500);
      } else {
        util.showError('保存失败');
      }
    } catch (e) {
      console.error('保存失败:', e);
      util.showError('保存失败');
    } finally {
      this.setData({ submitting: false });
    }
  },

  onDelete() {
    const { subscription } = this.data;
    if (!subscription) return;

    wx.showModal({
      title: '取消订阅',
      content: `确定要取消订阅关键词「${subscription.keyword}」吗？`,
      success: (res) => {
        if (res.confirm) {
          const success = dataService.deleteKeywordSubscription(subscription.id);
          if (success) {
            util.showSuccess('已取消订阅');
            setTimeout(() => wx.navigateBack(), 500);
          } else {
            util.showError('操作失败');
          }
        }
      }
    });
  },

  stopPropagation() {}
});
