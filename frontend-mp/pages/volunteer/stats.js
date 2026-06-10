const app = getApp();
const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');

Page({
  data: {
    darkMode: false,
    userId: '',
    semesterIndex: 0,
    semesterOptions: [],
    semesterValues: [],
    currentSemester: '',
    totalHours: 0,
    semesterHours: 0,
    activityCount: 0,
    categoryBreakdown: [],
    maxCategoryHours: 1,
    records: [],
    loading: true
  },

  onLoad() {
    const userInfo = app.globalData.userInfo || {};
    const userId = userInfo.id || 'test_user';
    const semesterOptions = constants.SEMESTER_OPTIONS.map(s => s.label);
    const semesterValues = constants.SEMESTER_OPTIONS.map(s => s.value);
    const currentSemester = dataService.getCurrentSemester();
    const semesterIndex = semesterValues.indexOf(currentSemester);

    this.setData({
      userId,
      semesterOptions,
      semesterValues,
      currentSemester,
      semesterIndex: semesterIndex >= 0 ? semesterIndex : 0
    });

    this.loadData();
  },

  onShow() {
    const isDark = app.globalData.isDark;
    if (this.data.darkMode !== isDark) {
      this.setData({ darkMode: !!isDark });
    }
  },

  loadData() {
    const { userId, semesterValues, semesterIndex } = this.data;
    const semester = semesterValues[semesterIndex];

    const allHours = dataService.getUserVolunteerHours(userId);
    const semesterHours = dataService.getUserVolunteerHours(userId, semester);
    const categoryData = dataService.getVolunteerHoursByCategory(userId);

    const categoryBreakdown = categoryData.map(item => {
      const cat = constants.VOLUNTEER_CATEGORIES.find(c => c.value === item.category) || {};
      return {
        category: item.category,
        label: cat.label || item.category,
        icon: cat.icon || '📌',
        color: cat.color || '#6B7280',
        hours: item.hours,
        count: item.count
      };
    });

    const maxCategoryHours = Math.max(1, ...categoryBreakdown.map(c => c.hours));

    const records = semesterHours.records.map(r => {
      const cat = constants.VOLUNTEER_CATEGORIES.find(c => c.value === r.category) || {};
      return {
        ...r,
        categoryLabel: cat.label || r.category,
        categoryIcon: cat.icon || '📌',
        categoryColor: cat.color || '#6B7280',
        dateText: util.formatTime(r.createTime, 'MM-DD')
      };
    });

    this.setData({
      totalHours: allHours.totalHours,
      semesterHours: semesterHours.totalHours,
      activityCount: allHours.activityCount,
      categoryBreakdown,
      maxCategoryHours,
      records,
      loading: false
    });
  },

  onSemesterChange(e) {
    this.setData({
      semesterIndex: e.detail.value
    });
    this.loadData();
  },

  onNavigateCertificate() {
    util.navigateTo('/pages/volunteer/certificate');
  },

  onNavigateLeaderboard() {
    util.navigateTo('/pages/volunteer/leaderboard');
  }
});
