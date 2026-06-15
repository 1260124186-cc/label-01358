const mockData = require('../../config/mock-data');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    keyword: '',
    rechargePoints: [],
    filteredPoints: [],
    selectedPoint: null,
    showDetail: false,
    filterType: 'all',
    filterOptions: [
      { value: 'all', label: '全部', icon: '📍' },
      { value: 'service', label: '服务中心', icon: '🏢' },
      { value: 'cash', label: '现金充值', icon: '💵' },
      { value: 'self', label: '自助充值', icon: '💳' }
    ],
    markers: [],
    latitude: 39.9042,
    longitude: 116.4070
  },

  onLoad() {
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadData() {
    return new Promise((resolve) => {
      const rechargePoints = mockData.CAMPUS_CARD_RECHARGE_POINTS.map(p => ({
        ...p,
        type: this.getPointType(p),
        typeLabel: this.getTypeLabel(this.getPointType(p))
      }));

      const markers = rechargePoints.map((p, index) => ({
        id: index,
        latitude: p.latitude,
        longitude: p.longitude,
        title: p.name,
        iconPath: '',
        width: 36,
        height: 36,
        callout: {
          content: p.name,
          color: '#ffffff',
          fontSize: 12,
          borderRadius: 4,
          padding: 6,
          display: 'BYCLICK',
          bgColor: '#FF6B6B'
        }
      }));

      this.setData({
        rechargePoints,
        filteredPoints: rechargePoints,
        markers
      });

      resolve();
    });
  },

  getPointType(point) {
    if (point.services && point.services.includes('办卡')) {
      return 'service';
    } else if (point.services && point.services.includes('现金充值')) {
      return 'cash';
    }
    return 'self';
  },

  getTypeLabel(type) {
    const map = {
      service: '服务中心',
      cash: '现金充值点',
      self: '自助充值机'
    };
    return map[type] || '充值点';
  },

  onInputChange(e) {
    const keyword = e.detail.value;
    this.setData({ keyword });
    this.filterPoints();
  },

  onFilterChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ filterType: value });
    this.filterPoints();
  },

  filterPoints() {
    const { keyword, filterType, rechargePoints } = this.data;
    let filtered = rechargePoints;

    if (filterType !== 'all') {
      filtered = filtered.filter(p => p.type === filterType);
    }

    if (keyword.trim()) {
      const kw = keyword.trim().toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(kw) ||
        p.address.toLowerCase().includes(kw) ||
        p.description.toLowerCase().includes(kw)
      );
    }

    this.setData({ filteredPoints: filtered });
  },

  onPointTap(e) {
    const { point } = e.currentTarget.dataset;
    this.setData({
      selectedPoint: point,
      showDetail: true,
      latitude: point.latitude,
      longitude: point.longitude
    });
  },

  onCloseDetail() {
    this.setData({
      showDetail: false,
      selectedPoint: null
    });
  },

  onCallPhone(e) {
    const { phone } = e.currentTarget.dataset;
    if (!phone) {
      util.showToast('暂无联系电话');
      return;
    }
    wx.makePhoneCall({
      phoneNumber: phone,
      fail: () => {
        util.showToast('拨号失败');
      }
    });
  },

  onNavigate(e) {
    const { point } = e.currentTarget.dataset;
    if (!point) return;

    wx.openLocation({
      latitude: point.latitude,
      longitude: point.longitude,
      name: point.name,
      address: point.address,
      scale: 17,
      fail: () => {
        util.showToast('打开地图失败');
      }
    });
  },

  onMarkertap(e) {
    const { markerId } = e.detail;
    const point = this.data.rechargePoints[markerId];
    if (point) {
      this.setData({
        selectedPoint: point,
        showDetail: true
      });
    }
  }
});
