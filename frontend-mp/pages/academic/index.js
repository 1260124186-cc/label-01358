const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');

const TABS = [
  { value: 'score', label: '成绩查询', icon: '📝' },
  { value: 'credit', label: '学分统计', icon: '📊' },
  { value: 'warning', label: '挂科预警', icon: '⚠️' },
  { value: 'analysis', label: '学业分析', icon: '📈' }
];

Page({
  data: {
    darkMode: false,
    currentTab: 'score',
    tabs: TABS,

    semesterOptions: constants.SEMESTER_OPTIONS,
    currentSemester: '2025-2026-1',
    semesterPickerIndex: 1,

    scoreList: [],
    scoreListWithLevel: [],
    averageScore: 0,

    creditStats: null,
    creditProgressPercent: 0,
    requiredProgressPercent: 0,
    electiveProgressPercent: 0,

    failedCourses: [],
    failedCoursesWithAdvice: [],

    analysisData: null
  },

  onLoad() {
    this.loadAllData();
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
    this.loadAllData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadAllData() {
    return new Promise((resolve) => {
      dataService.initExamScoreData();
      this.loadScoreData();
      this.loadCreditStats();
      this.loadFailedCourses();
      this.loadAnalysisData();
      resolve();
    });
  },

  loadScoreData() {
    const { currentSemester } = this.data;
    const scoreList = dataService.getExamScoreList({ semester: currentSemester });
    const scoreListWithLevel = scoreList.map(item => {
      const level = constants.getScoreLevel(item.score);
      const gpa = constants.getGPA(item.score);
      return {
        ...item,
        levelLabel: level.label,
        levelColor: level.color,
        gpa: gpa.toFixed(1),
        weightedGpa: (gpa * item.credit).toFixed(1)
      };
    });
    const averageScore = scoreListWithLevel.length > 0
      ? (scoreListWithLevel.reduce((s, i) => s + i.score, 0) / scoreListWithLevel.length).toFixed(1)
      : 0;
    this.setData({ scoreList, scoreListWithLevel, averageScore });
  },

  loadCreditStats() {
    const creditStats = dataService.calculateCreditStats();
    const totalRequiredTarget = 100;
    const totalElectiveTarget = 40;
    const creditProgressPercent = Math.min(100, Math.round(creditStats.earnedCredit / (totalRequiredTarget + totalElectiveTarget) * 100));
    const requiredProgressPercent = Math.min(100, Math.round(creditStats.requiredCredit / totalRequiredTarget * 100));
    const electiveProgressPercent = Math.min(100, Math.round(creditStats.electiveCredit / totalElectiveTarget * 100));
    this.setData({
      creditStats,
      creditProgressPercent,
      requiredProgressPercent,
      electiveProgressPercent
    });
  },

  loadFailedCourses() {
    const failedCourses = dataService.getFailedCourses();
    const failedCoursesWithAdvice = failedCourses.map(item => {
      let advice = '建议认真复习，参加补考或重修';
      if (item.courseName === '大学物理') {
        advice = '重点关注：建议立即申请重修，加强力学、电磁学等核心知识点的复习，可参加学习帮扶小组';
      } else if (item.score >= 55) {
        advice = '接近及格线，建议重点复习薄弱章节，争取补考通过';
      } else if (item.courseType === '必修') {
        advice = '必修课挂科将影响毕业，务必高度重视，建议申请重修并制定详细复习计划';
      }
      return {
        ...item,
        advice,
        isCritical: item.courseName === '大学物理'
      };
    });
    this.setData({ failedCourses, failedCoursesWithAdvice });
  },

  loadAnalysisData() {
    const allScores = dataService.getExamScoreList();
    if (allScores.length === 0) {
      this.setData({ analysisData: null });
      return;
    }

    const totalCourses = allScores.length;
    const passedCourses = allScores.filter(s => s.score >= 60);
    const excellentCourses = allScores.filter(s => s.score >= 90);
    const goodCourses = allScores.filter(s => s.score >= 80 && s.score < 90);

    const totalScore = allScores.reduce((sum, s) => sum + s.score, 0);
    const avgScore = Math.round(totalScore / totalCourses * 10) / 10;
    const passRate = Math.round(passedCourses.length / totalCourses * 100);
    const excellentRate = Math.round(excellentCourses.length / totalCourses * 100);
    const goodRate = Math.round(goodCourses.length / totalCourses * 100);

    const levelDistribution = [
      { label: '优秀', count: allScores.filter(s => s.score >= 90).length, color: '#10B981', percent: 0 },
      { label: '良好', count: allScores.filter(s => s.score >= 80 && s.score < 90).length, color: '#3B82F6', percent: 0 },
      { label: '中等', count: allScores.filter(s => s.score >= 70 && s.score < 80).length, color: '#8B5CF6', percent: 0 },
      { label: '及格', count: allScores.filter(s => s.score >= 60 && s.score < 70).length, color: '#FB923C', percent: 0 },
      { label: '不及格', count: allScores.filter(s => s.score < 60).length, color: '#DC2626', percent: 0 }
    ].map(item => ({
      ...item,
      percent: Math.round(item.count / totalCourses * 100)
    }));

    const semesterStats = {};
    allScores.forEach(s => {
      if (!semesterStats[s.semester]) {
        semesterStats[s.semester] = { total: 0, sum: 0, gpaSum: 0, creditSum: 0 };
      }
      semesterStats[s.semester].total++;
      semesterStats[s.semester].sum += s.score;
      semesterStats[s.semester].gpaSum += constants.getGPA(s.score) * s.credit;
      semesterStats[s.semester].creditSum += s.credit;
    });

    const semesterTrend = Object.keys(semesterStats).map(key => {
      const stat = semesterStats[key];
      return {
        semester: key,
        semesterLabel: constants.getLabelByValue(constants.SEMESTER_OPTIONS, key),
        avgScore: Math.round(stat.sum / stat.total * 10) / 10,
        gpa: stat.creditSum > 0 ? Math.round(stat.gpaSum / stat.creditSum * 100) / 100 : 0
      };
    }).sort((a, b) => a.semester.localeCompare(b.semester));

    const radarData = [
      { label: '学习能力', value: avgScore, max: 100 },
      { label: '通过率', value: passRate, max: 100 },
      { label: '优秀率', value: excellentRate, max: 100 },
      { label: 'GPA表现', value: Math.round(dataService.calculateGPA(allScores).gpa / 4 * 100), max: 100 },
      { label: '学分进度', value: Math.min(100, this.data.creditProgressPercent), max: 100 }
    ];

    this.setData({
      analysisData: {
        totalCourses,
        passedCount: passedCourses.length,
        excellentCount: excellentCourses.length,
        avgScore,
        passRate,
        excellentRate,
        goodRate,
        levelDistribution,
        semesterTrend,
        radarData,
        overallGpa: dataService.calculateGPA(allScores).gpa,
        learningStatus: passRate >= 90 ? '优秀' : passRate >= 80 ? '良好' : passRate >= 60 ? '一般' : '需努力',
        learningStatusClass: passRate >= 90 ? 'excellent' : passRate >= 80 ? 'good' : passRate >= 60 ? 'average' : 'needs-work'
      }
    });
  },

  onTabChange(e) {
    const tab = e.currentTarget.dataset.value;
    this.setData({ currentTab: tab });
  },

  onSemesterChange(e) {
    const index = e.detail.value;
    const semester = this.data.semesterOptions[index];
    this.setData({
      semesterPickerIndex: index,
      currentSemester: semester.value
    });
    this.loadScoreData();
    util.showToast(`已切换至${semester.label}`);
  }
});
