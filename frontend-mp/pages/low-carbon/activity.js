const app = getApp();
const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    activityTypes: [],
    currentType: '',
    activityList: [],
    refreshing: false
  },

  onLoad() {
    this.setData({
      activityTypes: [{ value: '', label: '全部', icon: '🌿' }, ...constants.LOW_CARBON_ACTIVITY_TYPES]
    });
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const filters = {};
    if (this.data.currentType) filters.type = this.data.currentType;

    const list = dataService.getLowCarbonActivityList(filters);
    const userId = (app.globalData.userInfo || {}).id || 'test_user';
    const regList = storage_getRegistrations(userId);

    const formattedList = list.map(item => {
      const typeInfo = constants.LOW_CARBON_ACTIVITY_TYPE_MAP[item.type] || {};
      const statusInfo = constants.LOW_CARBON_ACTIVITY_STATUS_MAP[item.status] || {};
      const registrationCount = (item.registrations || []).length;
      const isRegistered = regList.includes(item.id);
      const isFull = registrationCount >= (item.maxParticipants || 0);

      return {
        ...item,
        typeIcon: typeInfo.icon || '🌿',
        typeLabel: typeInfo.label || item.type,
        typeColor: typeInfo.color || '#6B7280',
        statusLabel: statusInfo.label || '',
        statusColor: statusInfo.color || '#6B7280',
        timeText: util.formatTime(item.startTime, 'MM-DD HH:mm'),
        registrationCount,
        isFull,
        isRegistered,
        canRegister: item.status === 'registering' && !isFull && !isRegistered
      };
    });

    this.setData({ activityList: formattedList, refreshing: false });
  },

  onTypeTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentType: this.data.currentType === value ? '' : value });
    this.loadData();
  },

  onRegister(e) {
    const { id } = e.currentTarget.dataset;
    const userId = (app.globalData.userInfo || {}).id || 'test_user';
    const result = dataService.registerForEcoActivity(userId, id);
    wx.showToast({ title: result.message, icon: result.success ? 'success' : 'none' });
    if (result.success) this.loadData();
  },

  onCancel(e) {
    const { id } = e.currentTarget.dataset;
    const userId = (app.globalData.userInfo || {}).id || 'test_user';
    const result = dataService.cancelEcoActivityRegistration(userId, id);
    wx.showToast({ title: result.message, icon: result.success ? 'success' : 'none' });
    if (result.success) this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadData();
  }
});

function storage_getRegistrations(userId) {
  const storage = require('../../utils/storage');
  const regList = storage.get(storage.STORAGE_KEYS.LOW_CARBON_ACTIVITY_REGISTRATION) || {};
  return regList[userId] || [];
}
