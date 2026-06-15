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
    tabs: constants.BUS_TABS,
    currentTab: 'all',
    searchKeyword: '',
    runningVehiclesCount: 0,
    activeRemindersCount: 0
  },

  onLoad() {
    this.loadList();
  },

  onShow() {
    this.loadList();
    this.checkReminders();
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
        keyword: this.data.searchKeyword
      };

      const list = dataService.getBusRouteList(filters);
      const allVehicles = dataService.getBusVehicles();
      const runningVehicles = allVehicles.filter(v => v.status === 'running');
      const reminders = dataService.getArrivalReminders().filter(r => r.enabled);

      const formattedList = list.map(item => {
        const typeInfo = constants.BUS_ROUTE_TYPES.find(t => t.value === item.type);
        const vehicles = dataService.getBusVehicles(item.id);
        const runningCount = vehicles.filter(v => v.status === 'running').length;

        let firstStation = '';
        let lastStation = '';
        if (item.stations && item.stations.length > 0) {
          firstStation = item.stations[0].name;
          lastStation = item.stations[item.stations.length - 1].name;
        }

        let nextArrivalText = '暂无运营车辆';
        if (runningCount > 0 && item.stations && item.stations.length > 0) {
          const arrivalInfo = dataService.calculateArrivalTime(item.id, 0);
          const nearest = arrivalInfo[0];
          if (nearest && nearest.arrivalText) {
            nextArrivalText = '首站 ' + nearest.arrivalText;
          }
        }

        return {
          ...item,
          typeText: typeInfo ? typeInfo.label : '',
          typeIcon: typeInfo ? typeInfo.icon : '',
          typeColor: typeInfo ? typeInfo.color : '',
          typeDesc: typeInfo ? typeInfo.desc : '',
          firstStation,
          lastStation,
          stationCount: item.stations ? item.stations.length : 0,
          runningCount,
          nextArrivalText,
          isFavorite: dataService.isFavoriteBusRoute(item.id)
        };
      });

      this.setData({
        list: formattedList,
        loading: false,
        refreshing: false,
        runningVehiclesCount: runningVehicles.length,
        activeRemindersCount: reminders.length
      });

      resolve();
    });
  },

  onRefresh() {
    this.setData({ refreshing: true });
    dataService.updateVehiclePosition();
    this.loadList();
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
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
    util.navigateTo('/pages/bus/detail?id=' + item.id);
  },

  onToggleFavorite(e) {
    e.stopPropagation();
    if (!util.checkLogin()) return;

    const { item } = e.currentTarget.dataset;
    const result = dataService.toggleFavoriteBusRoute(item.id);

    if (result.favorited) {
      util.showSuccess('收藏成功');
    } else {
      util.showToast('已取消收藏');
    }

    this.loadList();
  },

  checkReminders() {
    const triggered = dataService.checkAndTriggerReminders();
    if (triggered.length > 0) {
      triggered.forEach(t => {
        wx.showModal({
          title: '到站提醒',
          content: `${t.route.name} 即将到达 ${t.station.name}，还有 ${t.arrivalInfo.arrivalText}`,
          showCancel: false,
          confirmText: '知道了'
        });
      });
    }
  },

  stopPropagation() {}
});
