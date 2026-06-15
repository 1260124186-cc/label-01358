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
    venueTypes: constants.VENUE_TYPES,
    venues: [],
    filteredVenues: [],
    userId: ''
  },

  onLoad() {
    const currentUser = app.globalData.userInfo;
    this.setData({
      userId: currentUser ? currentUser.id : '',
      darkMode: app.globalData.darkMode || false
    });
    this.loadVenues();
  },

  onShow() {
    if (!this.data.loading) {
      this.loadVenues();
    }
  },

  onPullDownRefresh() {
    this.loadVenues();
    wx.stopPullDownRefresh();
  },

  loadVenues() {
    this.setData({ loading: true });

    try {
      const venues = dataService.getVenueList().map(venue => {
        const typeInfo = constants.VENUE_TYPES.find(t => t.value === venue.type) || {};
        return {
          ...venue,
          typeIcon: typeInfo.icon || '🏟️',
          typeLabel: typeInfo.label || '其他',
          openTimeText: (venue.openTimeSlots || []).length + '个时段'
        };
      });

      this.setData({
        venues,
        loading: false
      });

      this.filterVenues();
    } catch (error) {
      console.error('加载场馆列表失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  filterVenues() {
    const { venues, currentType, searchKeyword } = this.data;
    let filtered = [...venues];

    if (currentType !== 'all') {
      filtered = filtered.filter(venue => venue.type === currentType);
    }

    if (searchKeyword && searchKeyword.trim()) {
      const keyword = searchKeyword.trim().toLowerCase();
      filtered = filtered.filter(venue =>
        venue.name.toLowerCase().includes(keyword) ||
        venue.building.toLowerCase().includes(keyword) ||
        venue.description.toLowerCase().includes(keyword)
      );
    }

    this.setData({ filteredVenues: filtered });
  },

  onTypeTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentType: value }, () => {
      this.filterVenues();
    });
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value }, () => {
      this.filterVenues();
    });
  },

  onSearchClear() {
    this.setData({ searchKeyword: '' }, () => {
      this.filterVenues();
    });
  },

  onVenueTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/venue-reservation/detail?id=${id}`);
  },

  onMyAppointmentsTap() {
    if (!this.data.userId) {
      util.showToast('请先登录');
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/login/index' });
      }, 1500);
      return;
    }
    util.navigateTo('/pages/venue-reservation/my-appointments');
  }
});
