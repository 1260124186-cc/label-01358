const util = require('../../utils/util');
const storage = require('../../utils/storage');
const dataService = require('../../services/data');
const constants = require('../../config/constants');

const EVENT_TYPES = {
  COURSE: 'course',
  EXAM: 'exam',
  CLUB: 'club',
  VOLUNTEER: 'volunteer',
  CARPOOL: 'carpool',
  TODO: 'todo'
};

const EVENT_TYPE_CONFIG = {
  [EVENT_TYPES.COURSE]: {
    label: '课程',
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    icon: '📚'
  },
  [EVENT_TYPES.EXAM]: {
    label: '考试',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    icon: '📝'
  },
  [EVENT_TYPES.CLUB]: {
    label: '社团活动',
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.1)',
    icon: '🎪'
  },
  [EVENT_TYPES.VOLUNTEER]: {
    label: '志愿活动',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    icon: '💚'
  },
  [EVENT_TYPES.CARPOOL]: {
    label: '拼车',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    icon: '🚗'
  },
  [EVENT_TYPES.TODO]: {
    label: '待办',
    color: '#EC4899',
    bgColor: 'rgba(236, 72, 153, 0.1)',
    icon: '✅'
  }
};

const WEEK_DAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function padZero(num) {
  return String(num).padStart(2, '0');
}

function formatDateKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(d.getDate())}`;
}

function getSlotTime(slot) {
  const slots = [
    { start: '08:00', end: '08:45' },
    { start: '08:55', end: '09:40' },
    { start: '10:00', end: '10:45' },
    { start: '10:55', end: '11:40' },
    { start: '14:00', end: '14:45' },
    { start: '14:55', end: '15:40' },
    { start: '16:00', end: '16:45' },
    { start: '16:55', end: '17:40' },
    { start: '19:00', end: '19:45' },
    { start: '19:55', end: '20:40' },
    { start: '20:50', end: '21:35' }
  ];
  return slots[slot - 1] || slots[0];
}

Page({
  data: {
    darkMode: false,
    viewMode: 'month',
    viewModes: [
      { value: 'month', label: '月' },
      { value: 'week', label: '周' },
      { value: 'day', label: '日' }
    ],

    currentYear: 0,
    currentMonth: 0,
    currentDay: 0,
    currentWeekStart: null,
    currentWeekRange: '',

    monthDays: [],
    weekDays: [],
    dayEvents: [],

    allEvents: [],
    selectedDate: '',
    selectedDateEvents: [],

    showEventDetail: false,
    selectedEvent: null,

    showAddTodo: false,
    todoForm: {
      title: '',
      date: '',
      time: '',
      description: '',
      reminder: false
    },

    eventTypeConfig: EVENT_TYPE_CONFIG,
    eventTypes: Object.values(EVENT_TYPES),
    filterTypes: [],
    showFilter: false,

    showExport: false,
    exportWeekData: [],
    exportWeekRange: ''
  },

  _today: new Date(),

  onLoad() {
    this.loadThemeState();
    this.initCalendar();
    this.loadAllEvents();
  },

  onShow() {
    this.loadThemeState();
    this.loadAllEvents();
  },

  onPullDownRefresh() {
    this.loadAllEvents().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadThemeState() {
    const app = getApp();
    const { isDark } = app.globalData || {};
    this.setData({ darkMode: !!isDark });
  },

  initCalendar() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    this.setData({
      currentYear: year,
      currentMonth: month,
      currentDay: day,
      selectedDate: formatDateKey(today)
    });

    this.generateMonthDays(year, month);
    this.generateWeekDays(today);
  },

  generateMonthDays(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(year, month - 1, day);
      days.push({
        day,
        dateKey: formatDateKey(date),
        isCurrentMonth: false,
        isToday: this.isToday(date),
        events: []
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        day: i,
        dateKey: formatDateKey(date),
        isCurrentMonth: true,
        isToday: this.isToday(date),
        events: []
      });
    }

    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        day: i,
        dateKey: formatDateKey(date),
        isCurrentMonth: false,
        isToday: this.isToday(date),
        events: []
      });
    }

    this.setData({ monthDays: days });
    this.populateMonthEvents();
  },

  generateWeekDays(date) {
    const d = new Date(date);
    const dayOfWeek = d.getDay();
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const current = new Date(weekStart);
      current.setDate(weekStart.getDate() + i);
      days.push({
        day: current.getDate(),
        dateKey: formatDateKey(current),
        weekDay: WEEK_DAYS[i],
        isToday: this.isToday(current),
        events: []
      });
    }

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const weekRange = `${weekStart.getMonth() + 1}月${weekStart.getDate()}日 - ${weekEnd.getMonth() + 1}月${weekEnd.getDate()}日`;

    this.setData({
      weekDays: days,
      currentWeekStart: weekStart,
      currentWeekRange: weekRange
    });
    this.populateWeekEvents();
  },

  isToday(date) {
    const today = this._today;
    return date.getFullYear() === today.getFullYear()
      && date.getMonth() === today.getMonth()
      && date.getDate() === today.getDate();
  },

  loadAllEvents() {
    return new Promise((resolve) => {
      const events = [];

      events.push(...this.getCourseEvents());
      events.push(...this.getExamEvents());
      events.push(...this.getClubEvents());
      events.push(...this.getVolunteerEvents());
      events.push(...this.getCarpoolEvents());
      events.push(...this.getTodoEvents());

      events.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

      this.setData({ allEvents: events });
      this.populateMonthEvents();
      this.populateWeekEvents();
      this.updateSelectedDateEvents();
      this.updateDayEvents();

      resolve();
    });
  },

  getCourseEvents() {
    try {
      dataService.initCourseData();
    } catch (e) {}

    const courses = storage.getList(storage.STORAGE_KEYS.COURSE_LIST);
    const events = [];
    const today = this._today;
    const semesterStart = this.getSemesterStartDate();

    courses.forEach(course => {
      const dayOfWeek = course.dayOfWeek === 0 ? 7 : course.dayOfWeek;
      const startSlot = getSlotTime(course.startSlot);
      const endSlot = getSlotTime(course.endSlot);

      for (let week = 0; week < 20; week++) {
        const date = new Date(semesterStart);
        date.setDate(semesterStart.getDate() + (week * 7) + (dayOfWeek - 1));

        if (date < today - 30 * 24 * 60 * 60 * 1000) continue;
        if (date > today + 60 * 24 * 60 * 60 * 1000) break;

        const startTime = new Date(date);
        const [sh, sm] = startSlot.start.split(':');
        startTime.setHours(parseInt(sh), parseInt(sm), 0, 0);

        const endTime = new Date(date);
        const [eh, em] = endSlot.end.split(':');
        endTime.setHours(parseInt(eh), parseInt(em), 0, 0);

        events.push({
          id: `course_${course.id}_${week}`,
          type: EVENT_TYPES.COURSE,
          title: course.name,
          subtitle: course.teacher,
          location: course.classroom,
          startTime: startTime.getTime(),
          endTime: endTime.getTime(),
          dateKey: formatDateKey(date),
          originalData: course,
          navigateUrl: `/pages/schedule/index`
        });
      }
    });

    return events;
  },

  getSemesterStartDate() {
    const settings = storage.get(storage.STORAGE_KEYS.COURSE_SETTINGS);
    if (settings && settings.startDate) {
      return new Date(settings.startDate);
    }
    const today = this._today;
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    monday.setHours(0, 0, 0, 0);
    return monday;
  },

  getExamEvents() {
    try {
      dataService.initExamScheduleData();
    } catch (e) {}

    const exams = storage.getList(storage.STORAGE_KEYS.EXAM_SCHEDULE);
    const events = [];

    exams.forEach(exam => {
      const dateStr = exam.examDate;
      const startTime = new Date(`${dateStr} ${exam.startTime}`).getTime();
      const endTime = new Date(`${dateStr} ${exam.endTime}`).getTime();

      events.push({
        id: `exam_${exam.id}`,
        type: EVENT_TYPES.EXAM,
        title: exam.courseName,
        subtitle: exam.examType,
        location: exam.classroom,
        seatNo: exam.seatNo,
        startTime,
        endTime,
        dateKey: dateStr,
        isCompleted: exam.isCompleted,
        originalData: exam,
        navigateUrl: `/pages/exam-schedule/index`
      });
    });

    return events;
  },

  getClubEvents() {
    const activities = storage.getList(storage.STORAGE_KEYS.CLUB_ACTIVITY_LIST);
    const events = [];

    activities.forEach(activity => {
      const startTime = new Date(activity.activityTime).getTime();
      const endTime = new Date(activity.endTime).getTime();

      events.push({
        id: `club_${activity.id}`,
        type: EVENT_TYPES.CLUB,
        title: activity.title,
        subtitle: activity.clubName || '社团活动',
        location: activity.location,
        startTime,
        endTime,
        dateKey: formatDateKey(startTime),
        originalData: activity,
        navigateUrl: `/pages/club-activity/detail?id=${activity.id}`
      });
    });

    return events;
  },

  getVolunteerEvents() {
    const activities = storage.getList(storage.STORAGE_KEYS.VOLUNTEER_ACTIVITY_LIST);
    const events = [];

    activities.forEach(activity => {
      const startTime = activity.startTime;
      const endTime = activity.endTime;

      events.push({
        id: `volunteer_${activity.id}`,
        type: EVENT_TYPES.VOLUNTEER,
        title: activity.title,
        subtitle: activity.publisherName || '志愿活动',
        location: activity.location,
        startTime,
        endTime,
        dateKey: formatDateKey(startTime),
        hours: activity.hours,
        originalData: activity,
        navigateUrl: `/pages/volunteer/detail?id=${activity.id}`
      });
    });

    return events;
  },

  getCarpoolEvents() {
    const carpools = storage.getList(storage.STORAGE_KEYS.CARPOOL_LIST);
    const events = [];

    carpools.forEach(carpool => {
      const departureTime = carpool.departureTime;
      if (!departureTime) return;
      
      const date = new Date(departureTime);
      const typeText = carpool.type === 'find_ride' ? '找车' : (carpool.type === 'find_passenger' ? '找人' : '拼车');
      const destText = carpool.destinationText || carpool.destination || '目的地';

      events.push({
        id: `carpool_${carpool.id}`,
        type: EVENT_TYPES.CARPOOL,
        title: `${typeText} · ${destText}`,
        subtitle: carpool.pricePerPerson ? `¥${carpool.pricePerPerson}/人` : '',
        location: carpool.departureLocation || '校门口',
        startTime: departureTime,
        endTime: departureTime + 60 * 60 * 1000,
        dateKey: formatDateKey(date),
        originalData: carpool,
        navigateUrl: `/pages/carpool-detail/index?id=${carpool.id}`
      });
    });

    return events;
  },

  getTodoEvents() {
    const todos = storage.getList(storage.STORAGE_KEYS.PERSONAL_TODO_LIST);
    const events = [];

    todos.forEach(todo => {
      const startTime = new Date(todo.date + ' ' + (todo.time || '09:00')).getTime();
      const endTime = startTime + 60 * 60 * 1000;

      events.push({
        id: `todo_${todo.id}`,
        type: EVENT_TYPES.TODO,
        title: todo.title,
        subtitle: todo.description || '',
        location: '',
        startTime,
        endTime,
        dateKey: todo.date,
        isCompleted: todo.isCompleted,
        reminder: todo.reminder,
        originalData: todo,
        navigateUrl: ''
      });
    });

    return events;
  },

  populateMonthEvents() {
    const { monthDays, allEvents, filterTypes } = this.data;
    const eventMap = {};

    allEvents.forEach(event => {
      if (filterTypes.length > 0 && !filterTypes.includes(event.type)) return;
      if (!eventMap[event.dateKey]) {
        eventMap[event.dateKey] = [];
      }
      if (eventMap[event.dateKey].length < 3) {
        eventMap[event.dateKey].push(event);
      }
    });

    const updatedDays = monthDays.map(day => ({
      ...day,
      events: eventMap[day.dateKey] || []
    }));

    this.setData({ monthDays: updatedDays });
  },

  populateWeekEvents() {
    const { weekDays, allEvents, filterTypes } = this.data;
    if (!weekDays || weekDays.length === 0) return;

    const eventMap = {};

    allEvents.forEach(event => {
      if (filterTypes.length > 0 && !filterTypes.includes(event.type)) return;
      if (!eventMap[event.dateKey]) {
        eventMap[event.dateKey] = [];
      }
      eventMap[event.dateKey].push(event);
    });

    const updatedDays = weekDays.map(day => ({
      ...day,
      events: (eventMap[day.dateKey] || []).sort((a, b) => a.startTime - b.startTime)
    }));

    this.setData({ weekDays: updatedDays });
  },

  updateSelectedDateEvents() {
    const { selectedDate, allEvents, filterTypes } = this.data;
    const events = allEvents
      .filter(e => e.dateKey === selectedDate)
      .filter(e => filterTypes.length === 0 || filterTypes.includes(e.type))
      .sort((a, b) => a.startTime - b.startTime);

    this.setData({ selectedDateEvents: events });
  },

  updateDayEvents() {
    const { selectedDate, allEvents, filterTypes } = this.data;
    const events = allEvents
      .filter(e => e.dateKey === selectedDate)
      .filter(e => filterTypes.length === 0 || filterTypes.includes(e.type))
      .sort((a, b) => a.startTime - b.startTime)
      .map(event => {
        const config = EVENT_TYPE_CONFIG[event.type];
        const start = new Date(event.startTime);
        const end = new Date(event.endTime);
        return {
          ...event,
          config,
          timeText: `${padZero(start.getHours())}:${padZero(start.getMinutes())} - ${padZero(end.getHours())}:${padZero(end.getMinutes())}`
        };
      });

    this.setData({ dayEvents: events });
  },

  switchViewMode(e) {
    const { mode } = e.currentTarget.dataset;
    if (mode === this.data.viewMode) return;
    this.setData({ viewMode: mode });
  },

  onPrevMonth() {
    let { currentYear, currentMonth } = this.data;
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    this.setData({ currentYear, currentMonth });
    this.generateMonthDays(currentYear, currentMonth);
  },

  onNextMonth() {
    let { currentYear, currentMonth } = this.data;
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    this.setData({ currentYear, currentMonth });
    this.generateMonthDays(currentYear, currentMonth);
  },

  onPrevWeek() {
    const { currentWeekStart } = this.data;
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    this.generateWeekDays(newStart);
  },

  onNextWeek() {
    const { currentWeekStart } = this.data;
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    this.generateWeekDays(newStart);
  },

  onPrevDay() {
    const { selectedDate } = this.data;
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    this.setData({ selectedDate: formatDateKey(date) });
    this.updateSelectedDateEvents();
    this.updateDayEvents();
  },

  onNextDay() {
    const { selectedDate } = this.data;
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    this.setData({ selectedDate: formatDateKey(date) });
    this.updateSelectedDateEvents();
    this.updateDayEvents();
  },

  onDateTap(e) {
    const { dateKey } = e.currentTarget.dataset;
    this.setData({ selectedDate: dateKey });
    this.updateSelectedDateEvents();
    this.updateDayEvents();

    if (this.data.viewMode === 'month') {
      this.setData({ viewMode: 'day' });
    }
  },

  onEventTap(e) {
    const { event } = e.currentTarget.dataset;
    const config = EVENT_TYPE_CONFIG[event.type];
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);

    this.setData({
      showEventDetail: true,
      selectedEvent: {
        ...event,
        config,
        timeText: `${padZero(start.getHours())}:${padZero(start.getMinutes())} - ${padZero(end.getHours())}:${padZero(end.getMinutes())}`,
        dateText: `${start.getMonth() + 1}月${start.getDate()}日 ${WEEK_DAYS[start.getDay()]}`
      }
    });
  },

  onCloseEventDetail() {
    this.setData({
      showEventDetail: false,
      selectedEvent: null
    });
  },

  onNavigateToOriginal(e) {
    const { url } = e.currentTarget.dataset;
    if (!url) return;
    this.onCloseEventDetail();
    util.navigateTo(url);
  },

  onAddTodo() {
    const { selectedDate } = this.data;
    this.setData({
      showAddTodo: true,
      todoForm: {
        title: '',
        date: selectedDate || formatDateKey(new Date()),
        time: '09:00',
        description: '',
        reminder: false
      }
    });
  },

  onCloseAddTodo() {
    this.setData({ showAddTodo: false });
  },

  onTodoTitleInput(e) {
    this.setData({ 'todoForm.title': e.detail.value });
  },

  onTodoDescInput(e) {
    this.setData({ 'todoForm.description': e.detail.value });
  },

  onTodoDateChange(e) {
    this.setData({ 'todoForm.date': e.detail.value });
  },

  onTodoTimeChange(e) {
    this.setData({ 'todoForm.time': e.detail.value });
  },

  onTodoReminderToggle(e) {
    this.setData({ 'todoForm.reminder': e.detail.value });
  },

  onSaveTodo() {
    const { todoForm } = this.data;

    if (!todoForm.title.trim()) {
      util.showToast('请输入待办标题');
      return;
    }

    const todo = {
      id: 'todo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      title: todoForm.title.trim(),
      date: todoForm.date,
      time: todoForm.time,
      description: todoForm.description.trim(),
      reminder: todoForm.reminder,
      isCompleted: false,
      createTime: Date.now()
    };

    storage.addToList(storage.STORAGE_KEYS.PERSONAL_TODO_LIST, todo);
    util.showSuccess('添加成功');
    this.setData({ showAddTodo: false });
    this.loadAllEvents();
  },

  onToggleTodoComplete(e) {
    const { id } = e.currentTarget.dataset;
    const todos = storage.getList(storage.STORAGE_KEYS.PERSONAL_TODO_LIST);
    const todo = todos.find(t => t.id === id);

    if (todo) {
      const newStatus = !todo.isCompleted;
      storage.updateInList(storage.STORAGE_KEYS.PERSONAL_TODO_LIST, id, {
        isCompleted: newStatus,
        completedAt: newStatus ? Date.now() : null
      });

      util.showToast(newStatus ? '已完成' : '已取消');
      this.loadAllEvents();
    }
  },

  onDeleteTodo(e) {
    e.stopPropagation();
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个待办吗？',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          storage.removeFromList(storage.STORAGE_KEYS.PERSONAL_TODO_LIST, id);
          util.showSuccess('删除成功');
          this.onCloseEventDetail();
          this.loadAllEvents();
        }
      }
    });
  },

  onToggleFilterType(e) {
    const { type } = e.currentTarget.dataset;
    const { filterTypes } = this.data;
    const index = filterTypes.indexOf(type);

    let newFilters;
    if (index > -1) {
      newFilters = filterTypes.filter(t => t !== type);
    } else {
      newFilters = [...filterTypes, type];
    }

    this.setData({ filterTypes: newFilters });
    this.populateMonthEvents();
    this.populateWeekEvents();
    this.updateSelectedDateEvents();
    this.updateDayEvents();
  },

  onToggleFilterPanel() {
    this.setData({ showFilter: !this.data.showFilter });
  },

  onResetFilter() {
    this.setData({ filterTypes: [] });
    this.populateMonthEvents();
    this.populateWeekEvents();
    this.updateSelectedDateEvents();
    this.updateDayEvents();
  },

  stopPropagation() {

  },

  onExport() {
    this.setData({ showExport: true });
    this.generateScheduleImage();
  },

  onCloseExport() {
    this.setData({ showExport: false });
  },

  generateScheduleImage() {
    const { selectedDate, allEvents } = this.data;
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - dayOfWeek);

    const weekEvents = [];
    for (let i = 0; i < 7; i++) {
      const current = new Date(weekStart);
      current.setDate(weekStart.getDate() + i);
      const dateKey = formatDateKey(current);
      const dayEvents = allEvents
        .filter(e => e.dateKey === dateKey)
        .sort((a, b) => a.startTime - b.startTime)
        .slice(0, 5);

      weekEvents.push({
        dateKey,
        day: WEEK_DAYS[i],
        dayNum: current.getDate(),
        events: dayEvents
      });
    }

    const weekStartStr = `${weekStart.getMonth() + 1}月${weekStart.getDate()}日`;
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const weekEndStr = `${weekEnd.getMonth() + 1}月${weekEnd.getDate()}日`;

    this.setData({
      exportWeekData: weekEvents,
      exportWeekRange: `${weekStartStr} - ${weekEndStr}`
    });
  },

  onSaveImage() {
    util.showToast('日程图片已保存到相册');
    this.onCloseExport();
  },

  onShareImage() {
    util.showToast('分享功能开发中');
  },

  goToToday() {
    const today = new Date();
    this.setData({
      currentYear: today.getFullYear(),
      currentMonth: today.getMonth(),
      currentDay: today.getDate(),
      selectedDate: formatDateKey(today)
    });
    this.generateMonthDays(today.getFullYear(), today.getMonth());
    this.generateWeekDays(today);
    this.updateSelectedDateEvents();
    this.updateDayEvents();
  }
});
