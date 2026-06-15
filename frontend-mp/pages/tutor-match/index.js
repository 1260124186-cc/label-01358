const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

const MATCH_LEVEL_CONFIG = {
  high: { label: '高匹配度', color: '#10B981' },
  medium: { label: '中匹配度', color: '#3B82F6' },
  low: { label: '低匹配度', color: '#F59E0B' }
};

mixPage({
  data: {
    darkMode: false,
    tabs: [
      { value: 'demand_to_tutor', label: '需求匹配导师' },
      { value: 'tutor_to_demand', label: '导师匹配需求' }
    ],
    currentTab: 'demand_to_tutor',
    demandId: '',
    tutorId: '',
    matchList: [],
    refreshing: false,
    subjectMap: {},
    gradeMap: {}
  },

  onLoad(options) {
    const subjectMap = {};
    constants.TUTOR_SUBJECTS.forEach(s => {
      subjectMap[s.value] = s;
    });
    const gradeMap = {};
    constants.TUTOR_GRADES.forEach(g => {
      gradeMap[g.value] = g;
    });

    let currentTab = 'demand_to_tutor';
    let demandId = '';
    let tutorId = '';

    if (options.demandId) {
      demandId = options.demandId;
      currentTab = 'demand_to_tutor';
    } else if (options.tutorId) {
      tutorId = options.tutorId;
      currentTab = 'tutor_to_demand';
    }

    this.setData({
      demandId,
      tutorId,
      currentTab,
      subjectMap,
      gradeMap
    });

    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const { currentTab, demandId, tutorId, subjectMap, gradeMap } = this.data;
    let rawList = [];

    if (currentTab === 'demand_to_tutor') {
      if (demandId) {
        rawList = dataService.matchTutorsForDemand(demandId);
      }
    } else {
      if (tutorId) {
        rawList = dataService.matchDemandsForTutor(tutorId);
      }
    }

    const formattedList = rawList.map(item => {
      const levelConfig = MATCH_LEVEL_CONFIG[item.matchLevel] || MATCH_LEVEL_CONFIG.low;
      const subject = subjectMap[item.subject] || {};
      const grade = gradeMap[item.grade] || {};
      const isTutor = currentTab === 'demand_to_tutor';

      return {
        ...item,
        matchLevelLabel: levelConfig.label,
        matchLevelColor: levelConfig.color,
        subjectLabel: subject.label || '',
        subjectIcon: subject.icon || '',
        gradeLabel: grade.label || '',
        isTutor,
        displayName: isTutor ? item.tutorName : item.studentName,
        displayAvatar: isTutor ? item.tutorAvatar : item.studentAvatar,
        rateText: isTutor ? `¥${item.hourlyRate || 0}/小时` : `预算: ¥${item.budget || item.maxBudget || 0}/小时`,
        ratingText: isTutor ? (item.rating || 0).toFixed(1) + '分' : '',
        sessionCount: isTutor ? item.sessionCount || 0 : '',
        introText: item.intro || item.description || '',
        college: item.college || '',
        targetGrade: item.targetGrade ? gradeMap[item.targetGrade]?.label || '' : ''
      };
    });

    this.setData({
      matchList: formattedList,
      refreshing: false
    });
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
    this.loadData();
  },

  onNavToDetail(e) {
    const { id, type } = e.currentTarget.dataset;
    if (type === 'tutor') {
      util.navigateTo('/pages/tutor/detail?id=' + id);
    } else {
      util.navigateTo('/pages/tutor-demand/detail?id=' + id);
    }
  },

  onStartAppointment(e) {
    const { id, type } = e.currentTarget.dataset;
    if (type === 'tutor') {
      util.navigateTo('/pages/tutor-appointment/create?tutorId=' + id);
    } else {
      util.navigateTo('/pages/tutor-appointment/create?demandId=' + id);
    }
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
