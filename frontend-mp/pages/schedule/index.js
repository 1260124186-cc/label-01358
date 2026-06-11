const constants = require('../../config/constants');
const dataService = require('../../services/data');
const util = require('../../utils/util');

Page({
  data: {
    scheduleTabs: constants.SCHEDULE_TABS,
    scheduleViewTabs: constants.SCHEDULE_VIEW_TABS,
    weekDays: constants.WEEK_DAYS,
    timeSlots: constants.COURSE_TIME_SLOTS,
    courseColors: constants.COURSE_COLORS,

    activeScheduleTab: 'schedule',
    activeViewTab: 'week',
    currentWeek: 1,
    currentDay: 1,
    maxWeek: 20,

    weekCourses: {},
    dayCourses: [],
    courseSettings: null,

    showCourseModal: false,
    selectedCourse: null,
    selectedCourseColor: null,
    selectedCourseSlots: '',
    selectedCourseDay: ''
  },

  onLoad() {
    this.initData();
  },

  onShow() {
    this.loadCourses();
  },

  initData() {
    dataService.initCourseData();
    const settings = dataService.getCourseSettings();
    const today = new Date().getDay();
    const dayOfWeek = today === 0 ? 7 : today;
    this.setData({
      courseSettings: settings,
      currentWeek: settings.currentWeek || 1,
      currentDay: dayOfWeek
    });
    this.loadCourses();
    dataService.scheduleClassReminders();
  },

  loadCourses() {
    const weekCourses = dataService.getCoursesByWeek();
    const dayCourses = dataService.getCoursesByDay(this.data.currentDay);
    const processedWeekCourses = this.processWeekCourses(weekCourses);
    const processedDayCourses = this.processDayCourses(dayCourses);
    this.setData({
      weekCourses: processedWeekCourses,
      dayCourses: processedDayCourses
    });
  },

  processWeekCourses(weekCourses) {
    const result = {};
    for (let day = 1; day <= 7; day++) {
      result[day] = [];
      const courses = weekCourses[day] || [];
      const slotMap = {};
      courses.forEach(course => {
        const color = constants.COURSE_COLORS[course.colorIndex % constants.COURSE_COLORS.length];
        const slotSpan = course.endSlot - course.startSlot + 1;
        const slotLabel = course.startSlot === course.endSlot
          ? `第${course.startSlot}节`
          : `第${course.startSlot}-${course.endSlot}节`;
        for (let s = course.startSlot; s <= course.endSlot; s++) {
          slotMap[s] = course.id;
        }
        result[day].push({
          ...course,
          color,
          slotSpan,
          slotLabel,
          topIndex: course.startSlot - 1
        });
      });
      result[day].slotMap = slotMap;
    }
    return result;
  },

  processDayCourses(courses) {
    return courses.map(course => {
      const color = constants.COURSE_COLORS[course.colorIndex % constants.COURSE_COLORS.length];
      const startSlot = constants.getSlotTime(course.startSlot);
      const endSlot = constants.getSlotTime(course.endSlot);
      const slotLabel = course.startSlot === course.endSlot
        ? `第${course.startSlot}节`
        : `第${course.startSlot}-${course.endSlot}节`;
      const timeLabel = startSlot && endSlot
        ? `${startSlot.start}-${endSlot.end}`
        : '';
      const dayLabel = constants.WEEK_DAYS.find(d => d.value === course.dayOfWeek);
      return {
        ...course,
        color,
        slotLabel,
        timeLabel,
        dayLabel: dayLabel ? dayLabel.label : ''
      };
    }).sort((a, b) => a.startSlot - b.startSlot);
  },

  onScheduleTabTap(e) {
    const { value } = e.currentTarget.dataset;
    if (value === 'schedule') {
      this.setData({ activeScheduleTab: value });
    } else if (value === 'academic') {
      util.navigateTo('/pages/academic/index');
    } else if (value === 'classroom') {
      util.navigateTo('/pages/classroom-query/index');
    } else if (value === 'exam') {
      util.navigateTo('/pages/exam-schedule/index');
    }
  },

  onViewTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ activeViewTab: value });
  },

  onPrevWeek() {
    const newWeek = Math.max(1, this.data.currentWeek - 1);
    this.setData({ currentWeek: newWeek });
  },

  onNextWeek() {
    const newWeek = Math.min(this.data.maxWeek, this.data.currentWeek + 1);
    this.setData({ currentWeek: newWeek });
  },

  onWeekSelect() {
    const weeks = [];
    for (let i = 1; i <= this.data.maxWeek; i++) {
      weeks.push(`第${i}周`);
    }
    wx.showActionSheet({
      itemList: weeks,
      success: (res) => {
        this.setData({ currentWeek: res.tapIndex + 1 });
      }
    });
  },

  onDayTap(e) {
    const { day } = e.currentTarget.dataset;
    this.setData({
      currentDay: day,
      activeViewTab: 'day'
    });
    this.loadCourses();
  },

  onCourseTap(e) {
    const { course } = e.currentTarget.dataset;
    const color = constants.COURSE_COLORS[course.colorIndex % constants.COURSE_COLORS.length];
    const slotLabel = course.startSlot === course.endSlot
      ? `第${course.startSlot}节`
      : `第${course.startSlot}-${course.endSlot}节`;
    const dayLabel = constants.WEEK_DAYS.find(d => d.value === course.dayOfWeek);
    const startSlot = constants.getSlotTime(course.startSlot);
    const endSlot = constants.getSlotTime(course.endSlot);
    const timeLabel = startSlot && endSlot
      ? `${startSlot.start}-${endSlot.end}`
      : '';
    this.setData({
      showCourseModal: true,
      selectedCourse: course,
      selectedCourseColor: color,
      selectedCourseSlots: slotLabel,
      selectedCourseTime: timeLabel,
      selectedCourseDay: dayLabel ? dayLabel.label : ''
    });
  },

  onCloseModal() {
    this.setData({
      showCourseModal: false,
      selectedCourse: null
    });
  },

  onEditCourse() {
    const course = this.data.selectedCourse;
    if (!course) return;
    this.onCloseModal();
    util.navigateTo(`/pages/schedule-edit/index?mode=edit&id=${course.id}`);
  },

  onDeleteCourse() {
    const course = this.data.selectedCourse;
    if (!course) return;
    util.showConfirm(`确定要删除课程"${course.name}"吗？`, '删除确认').then(confirm => {
      if (confirm) {
        const success = dataService.deleteCourse(course.id);
        if (success) {
          util.showSuccess('删除成功');
          this.onCloseModal();
          this.loadCourses();
        } else {
          util.showToast('删除失败');
        }
      }
    });
  },

  onAddCourse() {
    util.navigateTo('/pages/schedule-edit/index?mode=add');
  },

  onImportCourse() {
    util.navigateTo('/pages/schedule-edit/index?mode=import');
  },

  preventDefault() {}
});
