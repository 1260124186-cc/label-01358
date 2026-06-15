const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    mainTabs: [],
    currentMainTab: 'tutor',
    subjects: [],
    currentSubject: '',
    grades: [],
    currentGrade: '',
    teachingMethods: [],
    currentTeachingMethod: '',
    tutorList: [],
    demandList: [],
    refreshing: false
  },

  onLoad() {
    this.setData({
      mainTabs: constants.TUTOR_MAIN_TABS,
      subjects: constants.TUTOR_SUBJECTS,
      grades: constants.TUTOR_GRADES,
      teachingMethods: constants.TUTOR_TEACHING_METHODS
    });
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const filters = {};

    if (this.data.currentSubject) {
      filters.subject = this.data.currentSubject;
    }

    if (this.data.currentGrade) {
      filters.grade = this.data.currentGrade;
    }

    if (this.data.currentTeachingMethod) {
      filters.teachingMethod = this.data.currentTeachingMethod;
    }

    const tutors = dataService.getTutorList(filters);
    const demands = dataService.getTutorDemandList(filters);

    const formattedTutors = tutors.map(item => {
      const subjectItems = (item.subjects || []).map(s => {
        const subject = constants.TUTOR_SUBJECTS.find(c => c.value === s) || {};
        return subject.label || s;
      }).slice(0, 3);
      const statusItem = constants.TUTOR_STATUS_MAP[item.status] || {};

      return {
        ...item,
        subjectsText: subjectItems.join(' · '),
        statusLabel: statusItem.label || '',
        statusColor: statusItem.color || '#6B7280',
        hourlyRateText: '¥' + (item.hourlyRate || 0) + '/小时',
        ratingText: (item.rating || 0).toFixed(1),
        creditScoreText: '信用' + (item.creditScore || 0) + '分'
      };
    });

    const formattedDemands = demands.map(item => {
      const subjectItem = constants.TUTOR_SUBJECTS.find(s => s.value === item.subject) || {};
      const gradeItem = constants.TUTOR_GRADES.find(g => g.value === item.grade) || {};
      const methodItem = constants.TUTOR_TEACHING_METHODS.find(m => m.value === item.teachingMethod) || {};
      const statusItem = constants.TUTOR_DEMAND_STATUS_MAP[item.status] || {};

      const daysText = (item.preferredDays || []).map(d => {
        const day = constants.TUTOR_WEEKDAYS.find(w => w.value === d) || {};
        return day.label || d;
      }).join('、');

      const slotsText = (item.preferredTimeSlots || []).map(s => {
        const slot = constants.TUTOR_TIME_SLOTS.find(t => t.value === s) || {};
        return slot.label || s;
      }).join('、');

      const timeParts = [];
      if (daysText) timeParts.push(daysText);
      if (slotsText) timeParts.push(slotsText);

      return {
        ...item,
        subjectIcon: subjectItem.icon || '📚',
        subjectLabel: subjectItem.label || item.subject,
        gradeLabel: gradeItem.label || item.grade,
        methodIcon: methodItem.icon || '📖',
        methodLabel: methodItem.label || item.teachingMethod,
        statusLabel: statusItem.label || '',
        statusColor: statusItem.color || '#6B7280',
        budgetText: '¥' + (item.budget || 0) + '-' + (item.maxBudget || item.budget || 0) + '/小时',
        timeText: timeParts.join(' ') || '时间灵活',
        targetGradeText: item.targetGrade || gradeItem.label || ''
      };
    });

    this.setData({
      tutorList: formattedTutors,
      demandList: formattedDemands,
      refreshing: false
    });
  },

  onMainTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentMainTab: value });
  },

  onSubjectTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentSubject: this.data.currentSubject === value ? '' : value });
    this.loadData();
  },

  onGradeTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentGrade: this.data.currentGrade === value ? '' : value });
    this.loadData();
  },

  onMethodTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTeachingMethod: this.data.currentTeachingMethod === value ? '' : value });
    this.loadData();
  },

  onNavToTutorDetail(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo('/pages/tutor/detail?id=' + id);
  },

  onNavToDemandDetail(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo('/pages/tutor-demand/detail?id=' + id);
  },

  onMyAppointments() {
    util.navigateTo('/pages/tutor-appointment/index');
  },

  onCreditBind() {
    util.navigateTo('/pages/tutor-credit/index');
  },

  onPublishTutor() {
    util.navigateTo('/pages/tutor/publish');
  },

  onPublishDemand() {
    util.navigateTo('/pages/tutor-demand/publish');
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  }
});
