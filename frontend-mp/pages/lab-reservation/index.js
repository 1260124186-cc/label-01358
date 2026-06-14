const util = require('../../utils/util');
const constants = require('../../config/constants');
const dataService = require('../../services/data');
const { mixPage } = require('../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    darkMode: false,
    loading: true,
    searchKeyword: '',
    currentType: 'all',
    labTypes: constants.LAB_TYPES,
    labs: [],
    filteredLabs: [],
    userId: ''
  },

  onLoad() {
    const currentUser = app.globalData.userInfo;
    this.setData({
      userId: currentUser ? currentUser.id : '',
      darkMode: app.globalData.darkMode || false
    });
    this.loadLabs();
  },

  onShow() {
    if (!this.data.loading) {
      this.loadLabs();
    }
  },

  onPullDownRefresh() {
    this.loadLabs();
    wx.stopPullDownRefresh();
  },

  loadLabs() {
    this.setData({ loading: true });

    try {
      const labs = dataService.getLabList().map(lab => {
        const typeInfo = constants.LAB_TYPES.find(t => t.value === lab.type) || {};
        const safetyLevelInfo = constants.LAB_SAFETY_LEVEL_MAP[lab.safetyLevel] || {};
        return {
          ...lab,
          typeIcon: typeInfo.icon || '🔬',
          typeLabel: typeInfo.label || '其他',
          safetyLevelLabel: safetyLevelInfo.label,
          safetyLevelColor: safetyLevelInfo.color,
          safetyLevelDesc: safetyLevelInfo.desc,
          openTimeText: (lab.openTimeSlots || []).length + '个时段'
        };
      });

      this.setData({
        labs,
        loading: false
      });

      this.filterLabs();
    } catch (error) {
      console.error('加载实验室列表失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  filterLabs() {
    const { labs, currentType, searchKeyword } = this.data;
    let filtered = [...labs];

    if (currentType !== 'all') {
      filtered = filtered.filter(lab => lab.type === currentType);
    }

    if (searchKeyword && searchKeyword.trim()) {
      const keyword = searchKeyword.trim().toLowerCase();
      filtered = filtered.filter(lab =>
        lab.name.toLowerCase().includes(keyword) ||
        lab.building.toLowerCase().includes(keyword) ||
        lab.description.toLowerCase().includes(keyword)
      );
    }

    this.setData({ filteredLabs: filtered });
  },

  onTypeTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentType: value }, () => {
      this.filterLabs();
    });
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value }, () => {
      this.filterLabs();
    });
  },

  onSearchClear() {
    this.setData({ searchKeyword: '' }, () => {
      this.filterLabs();
    });
  },

  onLabTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/lab-reservation/detail?id=${id}`);
  },

  onMyAppointmentsTap() {
    if (!this.data.userId) {
      util.showToast('请先登录');
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/login/index' });
      }, 1500);
      return;
    }
    util.navigateTo('/pages/lab-reservation/my-appointments');
  }
});
