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
    tabs: constants.CARPOOL_TABS,
    currentTab: 'all',
    destinations: constants.CARPOOL_DESTINATIONS,
    currentDestination: '',
    priceRanges: constants.CARPOOL_PRICE_RANGES,
    currentPriceRange: '',
    currentPriceText: '',
    minPrice: undefined,
    maxPrice: undefined,
    sortOptions: constants.CARPOOL_SORT_OPTIONS,
    currentSort: 'latest',
    showPricePicker: false,
    showSortPicker: false,
    showDatePicker: false,
    filterDate: '',
    searchKeyword: ''
  },

  onLoad() {
    this.loadList();
  },

  onShow() {
    this.loadList();
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
        type: this.data.currentTab,
        destination: this.data.currentDestination,
        minPrice: this.data.minPrice,
        maxPrice: this.data.maxPrice,
        sort: this.data.currentSort,
        keyword: this.data.searchKeyword,
        date: this.data.filterDate
      };

      const list = dataService.getCarpoolList(filters);

      const formattedList = list.map(item => {
        const typeInfo = constants.CARPOOL_TYPES.find(t => t.value === item.type);
        const statusInfo = constants.CARPOOL_STATUS.find(s => s.value === item.status);
        const destInfo = constants.CARPOOL_DESTINATIONS.find(d => d.value === item.destination);

        const departureDate = new Date(item.departureTime);
        const month = (departureDate.getMonth() + 1).toString().padStart(2, '0');
        const day = departureDate.getDate().toString().padStart(2, '0');
        const hours = departureDate.getHours().toString().padStart(2, '0');
        const minutes = departureDate.getMinutes().toString().padStart(2, '0');

        const now = Date.now();
        let departureLabel = '';
        if (item.departureTime - now < 3600000 && item.departureTime > now) {
          departureLabel = '即将出发';
        } else if (item.departureTime - now < 86400000 && item.departureTime > now) {
          departureLabel = '今天 ' + hours + ':' + minutes;
        } else if (item.departureTime - now < 172800000 && item.departureTime > now) {
          departureLabel = '明天 ' + hours + ':' + minutes;
        } else {
          departureLabel = month + '/' + day + ' ' + hours + ':' + minutes;
        }

        return {
          ...item,
          typeText: typeInfo ? typeInfo.label : '',
          typeIcon: typeInfo ? typeInfo.icon : '',
          typeColor: typeInfo ? typeInfo.color : '',
          statusText: statusInfo ? statusInfo.label : '',
          statusColor: statusInfo ? statusInfo.color : '',
          destinationText: item.destinationText || (destInfo ? destInfo.label : item.destination),
          priceText: util.formatPrice(item.pricePerPerson),
          departureLabel,
          remainingSeatsText: item.remainingSeats + '个座位',
          timeText: util.relativeTime(item.createTime),
          isFavorite: dataService.isFavorite(item.id, 'carpool')
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

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadList();
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
    this.loadList();
  },

  onDestinationChange(e) {
    const { value } = e.currentTarget.dataset;
    const newDest = this.data.currentDestination === value ? '' : value;
    this.setData({ currentDestination: newDest });
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
      minPrice: min !== undefined ? min : undefined,
      maxPrice: max !== undefined ? max : undefined,
      showPricePicker: false
    });

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
    this.setData({
      currentSort: value,
      showSortPicker: false
    });
    this.loadList();
  },

  onShowDatePicker() {
    this.setData({ showDatePicker: true });
  },

  onHideDatePicker() {
    this.setData({ showDatePicker: false });
  },

  onDateChange(e) {
    this.setData({
      filterDate: e.detail.value,
      showDatePicker: false
    });
    this.loadList();
  },

  onClearDate() {
    this.setData({
      filterDate: '',
      showDatePicker: false
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
    util.navigateTo('/pages/carpool-detail/index?id=' + item.id);
  },

  onToggleFavorite(e) {
    e.stopPropagation();
    if (!util.checkLogin()) return;

    const { item } = e.currentTarget.dataset;

    if (item.isFavorite) {
      dataService.removeFavorite(item.id, 'carpool');
      util.showToast('已取消收藏');
    } else {
      dataService.addFavorite(item, 'carpool');
      util.showSuccess('收藏成功');
    }

    this.loadList();
  },

  onPublish() {
    if (!util.checkLogin()) return;
    util.navigateTo('/pages/carpool-publish/index');
  },

  stopPropagation() {}
});
