const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    keyword: '',
    currentTab: 'all',
    tabs: constants.PHONEBOOK_TABS,
    emergencyPhones: [],
    phonebookCategories: [],
    serviceGuides: [],
    allPhoneItems: [],
    filteredList: [],
    showSearchResults: false,
    refreshing: false
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadThemeState();
  },

  loadThemeState() {
    const app = getApp();
    const { isDark } = app.globalData;
    this.setData({ darkMode: isDark || false });
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadData() {
    return new Promise((resolve) => {
      const emergencyPhones = dataService.getEmergencyPhones();
      const phonebookCategories = dataService.getPhonebookCategories();
      const allPhoneItems = dataService.getPhonebookAllItems();
      const serviceGuides = dataService.getServiceGuides();

      const filteredList = this.getFilteredList('all', allPhoneItems);

      this.setData({
        emergencyPhones,
        phonebookCategories,
        allPhoneItems,
        serviceGuides,
        filteredList,
        refreshing: false
      });

      resolve();
    });
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadData();
  },

  getFilteredList(tab, allItems) {
    if (tab === 'all') {
      return allItems;
    }
    return dataService.getPhonebookItemsByCategory(tab);
  },

  onInputChange(e) {
    const keyword = e.detail.value;
    this.setData({ keyword });

    if (keyword.trim()) {
      this.performSearch(keyword.trim());
    } else {
      const filteredList = this.getFilteredList(this.data.currentTab, this.data.allPhoneItems);
      this.setData({
        filteredList,
        showSearchResults: false
      });
    }
  },

  onClearInput() {
    this.setData({
      keyword: '',
      showSearchResults: false
    });
    const filteredList = this.getFilteredList(this.data.currentTab, this.data.allPhoneItems);
    this.setData({ filteredList });
  },

  onSearch() {
    const keyword = this.data.keyword.trim();
    if (!keyword) {
      util.showToast('请输入搜索关键词');
      return;
    }
    this.performSearch(keyword);
  },

  performSearch(keyword) {
    const results = dataService.searchPhonebook(keyword);
    this.setData({
      filteredList: results,
      showSearchResults: true
    });
  },

  onTabChange(e) {
    const tab = e.currentTarget.dataset.value;
    const filteredList = this.getFilteredList(tab, this.data.allPhoneItems);
    this.setData({
      currentTab: tab,
      filteredList,
      showSearchResults: false,
      keyword: ''
    });
  },

  onEmergencyCall(e) {
    const { phone } = e.currentTarget.dataset;
    this.makeCall(phone);
  },

  onCallPhone(e) {
    const { phone } = e.currentTarget.dataset;
    this.makeCall(phone);
  },

  makeCall(phoneNumber) {
    if (!phoneNumber) {
      util.showToast('电话号码无效');
      return;
    }

    dataService.makePhoneCall(phoneNumber).catch((err) => {
      if (err && err.errMsg && !err.errMsg.includes('cancel')) {
        util.showToast('拨号失败，请重试');
      }
    });
  },

  onGuideTap(e) {
    const { item } = e.currentTarget.dataset;
    if (item && item.url) {
      wx.navigateTo({
        url: item.url,
        fail: () => {
          util.showToast('页面跳转失败');
        }
      });
    } else {
      util.showToast('页面不存在');
    }
  },

  onMoreGuide() {
    util.showToast('更多指南开发中');
  }
});
