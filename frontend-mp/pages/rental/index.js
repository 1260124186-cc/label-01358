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
    tabs: constants.RENTAL_TABS,
    currentTab: 'all',
    locationTypes: constants.RENTAL_LOCATION_TYPES,
    currentLocation: '',
    priceRanges: constants.RENTAL_PRICE_RANGES,
    currentPriceRange: '',
    currentPriceText: '',
    minRent: undefined,
    maxRent: undefined,
    distanceRanges: constants.RENTAL_DISTANCE_RANGES,
    currentDistanceRange: '',
    currentDistanceText: '',
    minDistance: undefined,
    maxDistance: undefined,
    genderRequirements: constants.RENTAL_GENDER_REQUIREMENTS,
    currentGender: 'no_limit',
    sortOptions: constants.RENTAL_SORT_OPTIONS,
    currentSort: 'latest',
    showFilterModal: false,
    showPricePicker: false,
    showDistancePicker: false,
    showSortPicker: false,
    showPublishTypeFilter: false,
    publishTypes: constants.RENTAL_PUBLISHER_TYPES,
    currentPublisherType: '',
    compareList: [],
    showCompareBar: false,
    searchKeyword: ''
  },

  onLoad() {
    this.loadList();
    this.loadCompareList();
  },

  onShow() {
    this.loadList();
    this.loadCompareList();
  },

  onPullDownRefresh() {
    this.loadList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadList() {
    this.setData({ loading: true });

    return new Promise((resolve) => {
      const filters = {
        rentType: this.data.currentTab,
        locationType: this.data.currentLocation,
        genderRequirement: this.data.currentGender,
        publisherType: this.data.currentPublisherType,
        minRent: this.data.minRent,
        maxRent: this.data.maxRent,
        minDistance: this.data.minDistance,
        maxDistance: this.data.maxDistance,
        sort: this.data.currentSort,
        keyword: this.data.searchKeyword
      };

      const list = dataService.getRentalList(filters);

      const formattedList = list.map(item => {
        const publisherTypeInfo = constants.RENTAL_PUBLISHER_TYPES.find(t => t.value === item.publisherType);
        const facilityLabels = (item.facilities || []).map(f => {
          const facility = constants.RENTAL_FACILITIES.find(fa => fa.value === f);
          return facility ? facility.label : f;
        });
        return {
          ...item,
          rentText: util.formatPrice(item.rent),
          depositText: util.formatPrice(item.deposit),
          locationTypeText: constants.getLabelByValue(constants.RENTAL_LOCATION_TYPES, item.locationType),
          houseTypeText: constants.getLabelByValue(constants.RENTAL_HOUSE_TYPES, item.houseType),
          rentTypeText: constants.getLabelByValue(constants.RENTAL_RENT_TYPES, item.rentType),
          genderText: constants.getLabelByValue(constants.RENTAL_GENDER_REQUIREMENTS, item.genderRequirement),
          leaseTermText: constants.getLabelByValue(constants.RENTAL_LEASE_TERMS, item.leaseTerm),
          statusText: constants.getLabelByValue(constants.RENTAL_STATUS, item.status),
          publisherTypeText: publisherTypeInfo ? publisherTypeInfo.label : '',
          publisherTypeColor: publisherTypeInfo ? publisherTypeInfo.color : '',
          distanceText: item.distance < 1000 ? item.distance + '米' : (item.distance / 1000).toFixed(1) + '公里',
          timeText: util.relativeTime(item.createTime),
          isInCompare: dataService.isInCompareList(item.id),
          isFavorite: dataService.isFavorite(item.id, 'rental'),
          facilityLabels
        };
      });

      this.setData({
        list: formattedList,
        loading: false,
        refreshing: false
      });

      resolve();
    });
  },

  loadCompareList() {
    const compareList = dataService.getCompareList();
    this.setData({
      compareList,
      showCompareBar: compareList.length > 0
    });
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadList();
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
    this.loadList();
  },

  onLocationChange(e) {
    const { location } = e.currentTarget.dataset;
    const newLocation = this.data.currentLocation === location ? '' : location;
    this.setData({ currentLocation: newLocation });
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
      currentPriceText: item ? item.label : '价格',
      minRent: min !== undefined ? min : undefined,
      maxRent: max !== undefined ? max : undefined,
      showPricePicker: false
    });

    this.loadList();
  },

  onShowDistancePicker() {
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
      currentDistanceText: item ? item.label : '距离',
      minDistance: min !== undefined ? min : undefined,
      maxDistance: max !== undefined ? max : undefined,
      showDistancePicker: false
    });

    this.loadList();
  },

  onGenderChange(e) {
    const { gender } = e.currentTarget.dataset;
    this.setData({ currentGender: gender });
    this.loadList();
  },

  onShowSortPicker() {
    this.setData({ showSortPicker: true });
  },

  onHideSortPicker() {
    this.setData({ showSortPicker: false });
  },

  onSortSelect(e) {
    const { value } = e.currentTarget.dataset;
    const item = this.data.sortOptions.find(i => i.value === value);
    this.setData({
      currentSort: value,
      showSortPicker: false
    });
    this.loadList();
  },

  onShowPublishTypeFilter() {
    this.setData({ showPublishTypeFilter: true });
  },

  onHidePublishTypeFilter() {
    this.setData({ showPublishTypeFilter: false });
  },

  onPublishTypeSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      currentPublisherType: value,
      showPublishTypeFilter: false
    });
    this.loadList();
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearchConfirm() {
    this.loadList();
  },

  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo(`/pages/rental-detail/index?id=${item.id}`);
  },

  onToggleCompare(e) {
    e.stopPropagation();
    const { item } = e.currentTarget.dataset;

    if (item.isInCompare) {
      dataService.removeFromCompare(item.id);
      util.showToast('已移出对比');
    } else {
      const result = dataService.addToCompare(item);
      if (!result.success) {
        util.showToast(result.message);
        return;
      }
      util.showSuccess('已加入对比');
    }

    this.loadList();
    this.loadCompareList();
  },

  onToggleFavorite(e) {
    e.stopPropagation();
    if (!util.checkLogin()) return;

    const { item } = e.currentTarget.dataset;

    if (item.isFavorite) {
      dataService.removeFavorite(item.id, 'rental');
      util.showToast('已取消收藏');
    } else {
      dataService.addFavorite(item, 'rental');
      util.showSuccess('收藏成功');
    }

    this.loadList();
  },

  onGoCompare() {
    if (this.data.compareList.length < 2) {
      util.showToast('请至少选择2套房源进行对比');
      return;
    }
    util.navigateTo('/pages/rental-compare/index');
  },

  onClearCompare() {
    dataService.clearCompareList();
    this.loadList();
    this.loadCompareList();
    util.showToast('已清空对比列表');
  },

  onPublish() {
    if (!util.checkLogin()) return;
    util.navigateTo('/pages/rental-publish/index');
  },

  stopPropagation() {}
});
