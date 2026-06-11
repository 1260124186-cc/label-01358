const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

function getCurrentWeekDay() {
  const day = new Date().getDay();
  return day === 0 ? 7 : day;
}

function getCurrentTimeSlot() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const currentMinutes = hours * 60 + minutes;

  const slots = constants.COURSE_TIME_SLOTS;
  for (let i = 0; i < slots.length; i++) {
    const [sh, sm] = slots[i].start.split(':').map(Number);
    const [eh, em] = slots[i].end.split(':').map(Number);
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;
    if (currentMinutes <= endMinutes) {
      return Math.max(1, i + 1);
    }
  }
  return 1;
}

function buildWeekDayOptions() {
  const todayValue = getCurrentWeekDay();
  const weekDays = constants.WEEK_DAYS.map(w => ({ ...w }));
  const todayIdx = weekDays.findIndex(w => w.value === todayValue);
  if (todayIdx > -1) {
    weekDays[todayIdx] = { ...weekDays[todayIdx], label: '今天' };
  }
  return weekDays;
}

mixPage({
  data: {
    darkMode: false,
    buildings: constants.CLASSROOM_BUILDINGS,
    weekDays: [],
    timeSlots: constants.COURSE_TIME_SLOTS,

    buildingValue: 'all',
    buildingIndex: 0,

    weekDayValue: 1,
    weekDayIndex: 0,

    startSlot: 1,
    endSlot: 10,

    classroomList: [],
    expandedId: '',
    expandedSchedule: [],
    hasQueried: false,
    loading: false,
    refreshing: false
  },

  onLoad() {
    const weekDays = buildWeekDayOptions();
    const todayValue = getCurrentWeekDay();
    const weekDayIndex = weekDays.findIndex(w => w.value === todayValue);
    const currentSlot = getCurrentTimeSlot();

    this.setData({
      weekDays,
      weekDayValue: todayValue,
      weekDayIndex: weekDayIndex > -1 ? weekDayIndex : 0,
      startSlot: currentSlot,
      endSlot: 10
    });

    this.doQuery();
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
    this.setData({ refreshing: true });
    this.doQuery().then(() => {
      wx.stopPullDownRefresh();
      this.setData({ refreshing: false });
    });
  },

  onBuildingChange(e) {
    const index = Number(e.detail.value);
    const item = this.data.buildings[index];
    this.setData({
      buildingIndex: index,
      buildingValue: item.value
    });
  },

  onWeekDayChange(e) {
    const index = Number(e.detail.value);
    const item = this.data.weekDays[index];
    this.setData({
      weekDayIndex: index,
      weekDayValue: item.value
    });
  },

  onStartSlotChange(e) {
    const startSlot = Number(e.currentTarget.dataset.slot);
    let { endSlot } = this.data;
    if (startSlot > endSlot) endSlot = startSlot;
    this.setData({ startSlot, endSlot });
  },

  onEndSlotChange(e) {
    const endSlot = Number(e.currentTarget.dataset.slot);
    let { startSlot } = this.data;
    if (endSlot < startSlot) startSlot = endSlot;
    this.setData({ startSlot, endSlot });
  },

  onQueryTap() {
    const { startSlot, endSlot } = this.data;
    if (startSlot > endSlot) {
      util.showToast('开始节次不能大于结束节次');
      return;
    }
    this.doQuery();
  },

  doQuery() {
    return new Promise((resolve) => {
      this.setData({ loading: true, expandedId: '', expandedSchedule: [] });

      setTimeout(() => {
        const { buildingValue, weekDayValue, startSlot, endSlot } = this.data;
        const list = dataService.getAvailableClassrooms({
          building: buildingValue,
          dayOfWeek: weekDayValue,
          startSlot,
          endSlot
        });

        this.setData({
          classroomList: list,
          hasQueried: true,
          loading: false
        });

        resolve();
      }, 300);
    });
  },

  onToggleExpand(e) {
    const { id } = e.currentTarget.dataset;
    if (this.data.expandedId === id) {
      this.setData({ expandedId: '', expandedSchedule: [] });
      return;
    }

    const rawSchedule = dataService.getClassroomSchedule(id);
    const daySchedule = rawSchedule[this.data.weekDayValue] || {};

    const expandedSchedule = constants.COURSE_TIME_SLOTS.map(slot => {
      const info = daySchedule[slot.slot];
      return {
        slot: slot.slot,
        label: slot.label,
        start: slot.start,
        end: slot.end,
        occupied: !!info,
        courseName: info ? info.courseName : '',
        teacher: info ? info.teacher : '',
        weeks: info ? info.weeks : ''
      };
    });

    this.setData({ expandedId: id, expandedSchedule });
  }
});
