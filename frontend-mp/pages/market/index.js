const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    list: [],
    loading: false,
    refreshing: false,
    categories: constants.MARKET_CATEGORIES,
    priceRanges: constants.PRICE_RANGES,
    distanceRanges: constants.MARKET_DISTANCE_RANGES,
    currentCategory: '',
    currentPriceRange: '',
    currentPriceText: '',
    minPrice: undefined,
    maxPrice: undefined,
    showPricePicker: false,
    showDistancePicker: false,
    currentDistanceRange: '',
    currentDistanceText: '',
    minDistance: undefined,
    maxDistance: undefined,
    userLatitude: null,
    userLongitude: null,
    locationAuthorized: false,
    locationTip: ''
  },

  onLoad() {
    this.checkLocationAuth();
    this.loadList();
  },

  onShow() {
    this.loadList();
  },

  checkLocationAuth() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] === true) {
          this.setData({ locationAuthorized: true });
          this.getUserLocation();
        } else if (res.authSetting['scope.userLocation'] === false) {
          this.setData({
            locationAuthorized: false,
            locationTip: '未授权定位，无法使用附近筛选'
          });
        }
      }
    });
  },

  getUserLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.setData({
          userLatitude: res.latitude,
          userLongitude: res.longitude,
          locationAuthorized: true,
          locationTip: ''
        });
      },
      fail: () => {
        this.setData({
          locationAuthorized: false,
          locationTip: '获取位置失败'
        });
      }
    });
  },

  requestLocationAuth() {
    wx.authorize({
      scope: 'scope.userLocation',
      success: () => {
        this.setData({ locationAuthorized: true });
        this.getUserLocation();
      },
      fail: () => {
        wx.showModal({
          title: '需要定位权限',
          content: '附近筛选功能需要获取您的位置信息，是否前往设置开启？',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting();
            }
          }
        });
      }
    });
  },

  onPullDownRefresh() {
    this.loadList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadList() {
    this.setData({ loading: true });

    return new Promise((resolve) => {
      const filters = {};

      if (this.data.currentCategory) {
        filters.category = this.data.currentCategory;
      }

      if (this.data.minPrice !== undefined) {
        filters.minPrice = this.data.minPrice;
      }

      if (this.data.maxPrice !== undefined && this.data.maxPrice !== Infinity) {
        filters.maxPrice = this.data.maxPrice;
      }

      if (this.data.userLatitude && this.data.userLongitude) {
        filters.userLatitude = this.data.userLatitude;
        filters.userLongitude = this.data.userLongitude;

        if (this.data.minDistance !== undefined) {
          filters.minDistance = this.data.minDistance;
        }
        if (this.data.maxDistance !== undefined && this.data.maxDistance !== Infinity) {
          filters.maxDistance = this.data.maxDistance;
        }
      }

      const list = dataService.getMarketList(filters);

      const formattedList = list.map(item => {
        const formatted = {
          ...item,
          priceText: util.formatPrice(item.price),
          statusText: constants.getLabelByValue(constants.MARKET_STATUS, item.status)
        };

        if (item._distance !== undefined && item._distance !== Infinity) {
          formatted.distanceText = this.formatDistance(item._distance);
          formatted.hasDistance = true;
        } else {
          formatted.hasDistance = false;
        }

        return formatted;
      });

      this.setData({
        list: formattedList,
        loading: false,
        refreshing: false
      });

      resolve();
    });
  },

  formatDistance(meters) {
    if (meters < 1000) {
      return Math.round(meters) + 'm';
    } else {
      return (meters / 1000).toFixed(1) + 'km';
    }
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadList();
  },

  onCategoryChange(e) {
    const { category } = e.currentTarget.dataset;
    this.setData({ currentCategory: category });
    this.loadList();
  },

  onShowPricePicker() {
    this.setData({ showPricePicker: true });
  },

  onHidePricePicker() {
    this.setData({ showPricePicker: false });
  },

  onPriceSelect(e) {
    const { value, min, max } = e.currentTarget.dataset;
    const item = this.data.priceRanges.find(i => i.value === value);

    this.setData({
      currentPriceRange: value,
      currentPriceText: item ? item.label : '',
      minPrice: min !== undefined ? min : undefined,
      maxPrice: max !== undefined ? max : undefined,
      showPricePicker: false
    });

    this.loadList();
  },

  onShowDistancePicker() {
    if (!this.data.locationAuthorized) {
      this.requestLocationAuth();
      return;
    }
    if (!this.data.userLatitude || !this.data.userLongitude) {
      this.getUserLocation();
    }
    this.setData({ showDistancePicker: true });
  },

  onHideDistancePicker() {
    this.setData({ showDistancePicker: false });
  },

  onDistanceSelect(e) {
    const { value, min, max } = e.currentTarget.dataset;
    const item = this.data.distanceRanges.find(i => i.value === value);

    this.setData({
      currentDistanceRange: value,
      currentDistanceText: item && value ? item.label : '',
      minDistance: min !== undefined ? min : undefined,
      maxDistance: max !== undefined ? max : undefined,
      showDistancePicker: false
    });

    this.loadList();
  },

  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo(`/pages/market-detail/index?id=${item.id}`);
  },

  onPublish() {
    // 检查登录状态
    if (!util.checkLogin()) {
      return;
    }
    util.navigateTo('/pages/market-publish/index');
  },

  stopPropagation() {
    // 阻止事件冒泡
  },

  onStudyEntry() {
    util.navigateTo('/pages/study-materials/index');
  }
});
