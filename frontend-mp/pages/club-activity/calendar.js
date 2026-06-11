const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    year: 0,
    month: 0,
    weekDays: ['日', '一', '二', '三', '四', '五', '六'],
    calendarData: [],
    todayStr: '',
    selectedDate: '',
    selectedDayActivities: [],
    monthActivityCount: 0
  },

  onLoad() {
    const now = new Date();
    const todayStr = this.formatDate(now);
    this.setData({
      year: now.getFullYear(),
      month: now.getMonth(),
      todayStr,
      selectedDate: todayStr
    });
    this.loadCalendar();
  },

  onShow() {
    this.loadCalendar();
  },

  formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },

  loadCalendar() {
    util.showLoading();
    const { year, month, selectedDate } = this.data;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const calendarData = [];
    const activitiesByDay = dataService.getClubActivitiesByDate(year, month + 1) || {};

    let monthActivityCount = 0;

    const daysInWeek = 6;
    let totalCells = startWeekDay + totalDays;
    const rowsNeeded = Math.ceil(totalCells / 7);
    const totalSlots = rowsNeeded * 7;

    for (let i = 0; i < totalSlots; i++) {
      let dateNum, dateStr, isCurrentMonth = true, activities = [];

      if (i < startWeekDay) {
        dateNum = prevMonthLastDay - startWeekDay + i + 1;
        const d = new Date(year, month - 1, dateNum);
        dateStr = this.formatDate(d);
        isCurrentMonth = false;
      } else if (i >= startWeekDay + totalDays) {
        dateNum = i - startWeekDay - totalDays + 1;
        const d = new Date(year, month + 1, dateNum);
        dateStr = this.formatDate(d);
        isCurrentMonth = false;
      } else {
        dateNum = i - startWeekDay + 1;
        dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;
        isCurrentMonth = true;
        const dayActivities = activitiesByDay[dateNum] || [];
        activities = dayActivities.map(item => this.formatActivity(item));
        monthActivityCount += activities.length;
      }

      calendarData.push({
        dateNum,
        dateStr,
        isCurrentMonth,
        isToday: dateStr === this.data.todayStr,
        isSelected: dateStr === selectedDate,
        isWeekend: (i % 7 === 0) || (i % 7 === 6),
        activities,
        hasActivity: activities.length > 0,
        activityCount: activities.length
      });
    }

    let selectedActivities = [];
    const selectedNum = parseInt(selectedDate.split('-')[2]);
    const selMonth = parseInt(selectedDate.split('-')[1]) - 1;
    const selYear = parseInt(selectedDate.split('-')[0]);

    if (selYear === year && selMonth === month) {
      const selectedKey = selectedNum;
      const actList = activitiesByDay[selectedKey] || [];
      selectedActivities = actList.map(item => this.formatActivity(item));
    }

    this.setData({
      calendarData,
      monthActivityCount,
      selectedDayActivities: selectedActivities
    });

    util.hideLoading();
  },

  formatActivity(item) {
    const categoryItem = constants.CLUB_ACTIVITY_CATEGORIES.find(c => c.value === item.category) || {};
    const statusValue = item.activityStatus || this.computeStatus(item);
    const statusItem = constants.CLUB_ACTIVITY_STATUS.find(s => s.value === statusValue) || {};
    return {
      ...item,
      categoryIcon: categoryItem.icon || '📌',
      categoryLabel: categoryItem.label || '其他',
      categoryColor: categoryItem.color || '#6B7280',
      statusLabel: statusItem.label || '',
      statusColor: statusItem.color || '#6B7280',
      activityTimeText: util.formatTime(item.activityTime, 'HH:mm')
    };
  },

  computeStatus(item) {
    const now = Date.now();
    const startMs = new Date(item.activityTime).getTime();
    const endMs = new Date(item.endTime).getTime();
    if (now > endMs) return 'ended';
    if (now >= startMs) return 'ongoing';
    return 'upcoming';
  },

  onPrevMonth() {
    let { year, month } = this.data;
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
    this.setData({ year, month });
    this.loadCalendar();
  },

  onNextMonth() {
    let { year, month } = this.data;
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
    this.setData({ year, month });
    this.loadCalendar();
  },

  onBackToday() {
    const now = new Date();
    const todayStr = this.formatDate(now);
    this.setData({
      year: now.getFullYear(),
      month: now.getMonth(),
      selectedDate: todayStr
    });
    this.loadCalendar();
  },

  onDayTap(e) {
    const { date } = e.currentTarget.dataset;
    if (!date) return;
    this.setData({ selectedDate: date });
    this.loadCalendar();
  },

  onNavToActivity(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo('/pages/club-activity/detail?id=' + id);
  },

  onLegend() {
    util.showToast('图例：绿-进行中 蓝-即将开始 灰-已结束');
  }
});
