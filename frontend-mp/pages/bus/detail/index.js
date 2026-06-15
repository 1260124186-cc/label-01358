const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    routeId: '',
    route: null,
    loading: false,
    refreshing: false,
    scheduleTypes: constants.BUS_SCHEDULE_TYPES,
    currentScheduleType: 'weekday',
    stations: [],
    vehicles: [],
    isFavorite: false,
    showReminderPicker: false,
    reminderOptions: constants.BUS_REMINDER_OPTIONS,
    selectedStationIndex: -1,
    currentReminderMinutes: 0,
    updateTimer: null,
    lastUpdateTime: ''
  },

  onLoad(options) {
    const { id } = options;
    this.setData({ routeId: id });
    this.loadData();
    this.startPositionUpdate();
  },

  onShow() {
    this.loadData();
  },

  onUnload() {
    this.stopPositionUpdate();
  },

  onPullDownRefresh() {
    this.refreshData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadData() {
    this.setData({ loading: true });

    return new Promise((resolve) => {
      const route = dataService.getBusRouteDetail(this.data.routeId);
      if (!route) {
        this.setData({ loading: false });
        util.showToast('线路不存在');
        wx.navigateBack();
        return;
      }

      const typeInfo = constants.BUS_ROUTE_TYPES.find(t => t.value === route.type);
      const routeWithType = {
        ...route,
        typeText: typeInfo ? typeInfo.label : '',
        typeIcon: typeInfo ? typeInfo.icon : '',
        typeColor: typeInfo ? typeInfo.color : ''
      };

      const isFavorite = dataService.isFavoriteBusRoute(this.data.routeId);
      const vehicles = dataService.getBusVehicles(this.data.routeId).map(v => {
        const statusInfo = constants.BUS_VEHICLE_STATUS.find(s => s.value === v.status);
        return {
          ...v,
          statusText: statusInfo ? statusInfo.label : v.status
        };
      });

      const stations = this.formatStations(routeWithType, this.data.currentScheduleType);
      const lastUpdateTime = this.formatUpdateTime(Date.now());

      this.setData({
        route: routeWithType,
        isFavorite,
        vehicles,
        stations,
        loading: false,
        lastUpdateTime
      });

      resolve();
    });
  },

  refreshData() {
    this.setData({ refreshing: true });
    dataService.updateVehiclePosition();
    return this.loadData().then(() => {
      this.setData({ refreshing: false });
    });
  },

  formatStations(route, scheduleType) {
    if (!route || !route.stations) return [];

    const schedule = route.schedule ? route.schedule[scheduleType] : null;

    return route.stations.map((station, index) => {
      const arrivalInfo = dataService.calculateArrivalTime(route.id, index);
      const nearestVehicle = arrivalInfo[0];
      const reminder = dataService.getArrivalReminder(route.id, index);

      let scheduleTime = '';
      if (schedule && schedule[index]) {
        scheduleTime = schedule[index];
      }

      let arrivalText = '暂无车辆';
      let arrivalMinutes = null;
      let vehiclePlate = '';

      if (nearestVehicle && nearestVehicle.arrivalMinutes !== null) {
        arrivalText = nearestVehicle.arrivalText;
        arrivalMinutes = nearestVehicle.arrivalMinutes;
        vehiclePlate = nearestVehicle.plateNumber;
      }

      return {
        ...station,
        index,
        scheduleTime,
        arrivalText,
        arrivalMinutes,
        vehiclePlate,
        hasReminder: reminder ? reminder.enabled : false,
        reminderMinutes: reminder ? reminder.remindBeforeMinutes : 0,
        isFirst: index === 0,
        isLast: index === route.stations.length - 1
      };
    });
  },

  formatUpdateTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  },

  startPositionUpdate() {
    this.stopPositionUpdate();
    const timer = setInterval(() => {
      dataService.updateVehiclePosition();
      this.updateArrivalTimes();
    }, 5000);
    this.setData({ updateTimer: timer });
  },

  stopPositionUpdate() {
    if (this.data.updateTimer) {
      clearInterval(this.data.updateTimer);
      this.setData({ updateTimer: null });
    }
  },

  updateArrivalTimes() {
    const route = this.data.route;
    if (!route) return;

    const stations = this.formatStations(route, this.data.currentScheduleType);
    const vehicles = dataService.getBusVehicles(this.data.routeId).map(v => {
      const statusInfo = constants.BUS_VEHICLE_STATUS.find(s => s.value === v.status);
      return {
        ...v,
        statusText: statusInfo ? statusInfo.label : v.status
      };
    });
    const lastUpdateTime = this.formatUpdateTime(Date.now());

    this.setData({
      stations,
      vehicles,
      lastUpdateTime
    });

    this.checkReminders();
  },

  onScheduleTypeChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentScheduleType: value });
    this.updateArrivalTimes();
  },

  onToggleFavorite() {
    if (!util.checkLogin()) return;

    const result = dataService.toggleFavoriteBusRoute(this.data.routeId);
    this.setData({ isFavorite: result.favorited });

    if (result.favorited) {
      util.showSuccess('收藏成功');
    } else {
      util.showToast('已取消收藏');
    }
  },

  onSetReminder(e) {
    if (!util.checkLogin()) return;

    const { index } = e.currentTarget.dataset;
    const station = this.data.stations[index];

    this.setData({
      selectedStationIndex: index,
      currentReminderMinutes: station.reminderMinutes || 0,
      showReminderPicker: true
    });
  },

  onHideReminderPicker() {
    this.setData({ showReminderPicker: false });
  },

  onReminderSelect(e) {
    const { value } = e.currentTarget.dataset;
    const { selectedStationIndex } = this.data;

    if (selectedStationIndex < 0) return;

    const result = dataService.setArrivalReminder(
      this.data.routeId,
      selectedStationIndex,
      value
    );

    if (result.enabled) {
      util.showSuccess(`已设置到站前${value}分钟提醒`);
    } else {
      util.showToast('已取消提醒');
    }

    this.setData({
      showReminderPicker: false,
      currentReminderMinutes: value
    });

    this.updateArrivalTimes();
  },

  checkReminders() {
    const triggered = dataService.checkAndTriggerReminders();
    if (triggered.length > 0) {
      triggered.forEach(t => {
        if (t.reminder.routeId === this.data.routeId) {
          wx.vibrateShort({ type: 'medium' });
        }
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
