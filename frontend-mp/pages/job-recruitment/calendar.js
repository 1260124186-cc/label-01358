const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    currentView: 'list',
    currentDate: '',
    currentMonth: '',
    currentYear: 0,
    currentMonthIndex: 0,
    calendarDays: [],
    talkList: [],
    filteredTalkList: [],
    selectedDate: '',
    selectedType: 'all',
    types: [],
    searchKeyword: '',
    showDetailModal: false,
    selectedTalk: null,
    weekDays: ['日', '一', '二', '三', '四', '五', '六']
  },

  onLoad() {
    const now = new Date();
    this.setData({
      currentDate: util.formatTime(Date.now(), 'YYYY-MM-DD'),
      currentYear: now.getFullYear(),
      currentMonthIndex: now.getMonth(),
      types: [{ value: 'all', label: '全部' }, ...constants.CAREER_TALK_TYPES]
    });
    dataService.initJobRecruitmentData();
    this.generateCalendar();
    this.loadData();
  },

  onShow() {
    dataService.initJobRecruitmentData();
    this.loadData();
  },

  loadData() {
    const filters = {
      type: this.data.selectedType,
      keyword: this.data.searchKeyword
    };
    const list = dataService.getCareerTalkList(filters);

    const formattedList = list.map(item => {
      const typeItem = constants.CAREER_TALK_TYPES.find(t => t.value === item.type) || {};
      const startDateTime = new Date(item.date + ' ' + item.startTime);
      const endDateTime = new Date(item.date + ' ' + item.endTime);
      const isToday = item.date === this.data.currentDate;
      const isPast = endDateTime < new Date();
      const isRegistered = item.registered;
      const isSynced = item.syncToCalendar;
      const remaining = item.maxCount ? Math.max(0, item.maxCount - (item.registerCount || 0)) : Infinity;
      const isFull = remaining <= 0;

      return {
        ...item,
        typeLabel: typeItem.label || '',
        typeIcon: typeItem.icon || '',
        typeColor: typeItem.color || '#4F46E5',
        dateText: item.date,
        dateFullText: this.formatDateText(item.date),
        timeText: `${item.startTime} - ${item.endTime}`,
        isToday,
        isPast,
        isRegistered,
        isSynced,
        remaining,
        isFull,
        startTime: startDateTime.getTime(),
        endTime: endDateTime.getTime()
      };
    });

    const filteredList = this.data.selectedDate
      ? formattedList.filter(item => item.date === this.data.selectedDate)
      : formattedList;

    this.setData({
      talkList: formattedList,
      filteredTalkList: filteredList
    });

    this.markTalkOnCalendar();
  },

  formatDateText(dateStr) {
    const date = new Date(dateStr);
    const weekDay = this.data.weekDays[date.getDay()];
    return `${date.getMonth() + 1}月${date.getDate()}日 周${weekDay}`;
  },

  generateCalendar() {
    const year = this.data.currentYear;
    const month = this.data.currentMonthIndex;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const calendarDays = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      calendarDays.push({
        day,
        isCurrentMonth: false,
        date: this.formatDate(year, month - 1, day),
        hasTalk: false,
        isToday: false
      });
    }

    const today = new Date();
    const todayStr = this.data.currentDate;

    for (let day = 1; day <= totalDays; day++) {
      const dateStr = this.formatDate(year, month, day);
      calendarDays.push({
        day,
        isCurrentMonth: true,
        date: dateStr,
        hasTalk: false,
        isToday: dateStr === todayStr,
        isSelected: dateStr === this.data.selectedDate
      });
    }

    const remainingDays = 42 - calendarDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      calendarDays.push({
        day,
        isCurrentMonth: false,
        date: this.formatDate(year, month + 1, day),
        hasTalk: false,
        isToday: false
      });
    }

    this.setData({
      calendarDays,
      currentMonth: `${year}年${month + 1}月`
    });
  },

  formatDate(year, month, day) {
    if (month < 0) {
      year--;
      month = 11;
    } else if (month > 11) {
      year++;
      month = 0;
    }
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  },

  markTalkOnCalendar() {
    const talkDates = new Set(this.data.talkList.map(t => t.date));
    const calendarDays = this.data.calendarDays.map(day => ({
      ...day,
      hasTalk: talkDates.has(day.date),
      isSelected: day.date === this.data.selectedDate
    }));
    this.setData({ calendarDays });
  },

  onPrevMonth() {
    let { currentYear, currentMonthIndex } = this.data;
    currentMonthIndex--;
    if (currentMonthIndex < 0) {
      currentMonthIndex = 11;
      currentYear--;
    }
    this.setData({ currentYear, currentMonthIndex });
    this.generateCalendar();
    this.markTalkOnCalendar();
  },

  onNextMonth() {
    let { currentYear, currentMonthIndex } = this.data;
    currentMonthIndex++;
    if (currentMonthIndex > 11) {
      currentMonthIndex = 0;
      currentYear++;
    }
    this.setData({ currentYear, currentMonthIndex });
    this.generateCalendar();
    this.markTalkOnCalendar();
  },

  onDateTap(e) {
    const { date, isCurrentMonth } = e.currentTarget.dataset;
    if (!isCurrentMonth) return;

    this.setData({
      selectedDate: this.data.selectedDate === date ? '' : date
    });
    this.loadData();
  },

  onViewChange(e) {
    const { view } = e.currentTarget.dataset;
    this.setData({ currentView: view });
  },

  onTypeChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ selectedType: value });
    this.loadData();
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearchConfirm() {
    this.loadData();
  },

  onClearSearch() {
    this.setData({ searchKeyword: '' });
    this.loadData();
  },

  onTalkTap(e) {
    const { id } = e.currentTarget.dataset;
    const talk = this.data.talkList.find(t => t.id === id);
    if (talk) {
      this.setData({
        selectedTalk: talk,
        showDetailModal: true
      });
    }
  },

  onCloseDetail() {
    this.setData({ showDetailModal: false });
  },

  onRegister(e) {
    e.stopPropagation();
    const { id } = e.currentTarget.dataset;
    const talk = this.data.talkList.find(t => t.id === id);
    
    if (talk.isPast) {
      wx.showToast({ title: '宣讲会已结束', icon: 'none' });
      return;
    }
    if (talk.isFull) {
      wx.showToast({ title: '预约人数已满', icon: 'none' });
      return;
    }
    if (talk.isRegistered) {
      wx.showToast({ title: '已预约', icon: 'none' });
      return;
    }

    const success = dataService.registerCareerTalk(id);
    if (success) {
      wx.showToast({ title: '预约成功', icon: 'success' });
      this.loadData();
    } else {
      wx.showToast({ title: '预约失败', icon: 'none' });
    }
  },

  onSyncToCalendar(e) {
    e.stopPropagation();
    const { id } = e.currentTarget.dataset;
    const talk = this.data.talkList.find(t => t.id === id);
    
    if (!talk) return;

    wx.showModal({
      title: '同步到日历',
      content: `将「${talk.title}」同步到系统日历？`,
      success: (res) => {
        if (res.confirm) {
          const success = dataService.syncTalkToCalendar(id);
          if (success) {
            wx.addPhoneCalendar({
              title: talk.title,
              startTime: Math.floor(talk.startTime / 1000),
              endTime: Math.floor(talk.endTime / 1000),
              location: talk.location,
              description: talk.description,
              success: () => {
                wx.showToast({ title: '同步成功', icon: 'success' });
                this.loadData();
              },
              fail: () => {
                wx.showToast({ title: '已记录', icon: 'success' });
                this.loadData();
              }
            });
          }
        }
      }
    });
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  }
});
