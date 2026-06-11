const util = require('../../utils/util');
const dataService = require('../../services/data');
const storage = require('../../utils/storage');

const WEEKDAY_MAP = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function padZero(num) {
  return String(num).padStart(2, '0');
}

function parseBuildingAndRoom(classroom) {
  if (!classroom) return { building: '', room: '' };
  const match = classroom.match(/^(.+栋)(\S+)$/);
  if (match) {
    return { building: match[1], room: match[2] };
  }
  return { building: classroom, room: '' };
}

function getWeekdayText(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + ' 00:00:00');
  if (isNaN(date.getTime())) return '';
  return WEEKDAY_MAP[date.getDay()];
}

function calculateCountdown(examTime, now) {
  const diff = examTime - now;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds, isExpired: false };
}

function formatCardCountdown(cd) {
  if (cd.isExpired) return '即将开始';
  if (cd.days > 0) return `还有${cd.days}天`;
  if (cd.hours > 0) return `还有${cd.hours}小时`;
  if (cd.minutes > 0) return `还有${cd.minutes}分`;
  return '马上开始';
}

Page({
  data: {
    loading: true,
    darkMode: false,
    activeTab: 'upcoming',
    upcomingList: [],
    completedList: [],
    firstExam: null,
    mainCountdown: {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  },

  _timer: null,
  _baseDate: new Date('2026-06-11 08:00:00'),

  onLoad() {
    this.loadThemeState();
    this.initExamData();
    this.loadExamData();
    this.startCountdownTimer();
  },

  onShow() {
    this.loadThemeState();
  },

  onUnload() {
    this.stopCountdownTimer();
  },

  onPullDownRefresh() {
    this.loadExamData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadThemeState() {
    const app = getApp();
    const { isDark } = app.globalData || {};
    this.setData({ darkMode: !!isDark });
  },

  initExamData() {
    dataService.initExamScheduleData();
    const storageKey = storage.STORAGE_KEYS.EXAM_SCHEDULE;
    const list = storage.getList(storageKey);
    const now = this._baseDate.getTime();
    let changed = false;

    const updatedList = list.map(exam => {
      const examTime = new Date(exam.examDate + ' ' + exam.startTime).getTime();
      if (exam.isCompleted && examTime > now) {
        changed = true;
        return { ...exam, isCompleted: false, completedAt: undefined };
      }
      return exam;
    });

    if (changed) {
      storage.set(storageKey, updatedList);
    }
  },

  loadExamData() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = this._baseDate.getTime();
        const allList = dataService.getExamScheduleList();
        const countdowns = dataService.getExamCountdown();

        const examMap = {};
        countdowns.forEach(cd => {
          examMap[cd.id] = cd;
        });

        const upcomingRaw = dataService.getExamScheduleList({ isCompleted: false });
        const completedRaw = dataService.getExamScheduleList({ isCompleted: true });

        const upcomingList = upcomingRaw.map(exam => {
          const examTime = new Date(exam.examDate + ' ' + exam.startTime).getTime();
          const cd = calculateCountdown(examTime, now);
          const { building, room } = parseBuildingAndRoom(exam.classroom);
          const urgent = !cd.isExpired && cd.days <= 3;

          return {
            ...exam,
            weekdayText: getWeekdayText(exam.examDate),
            buildingText: building,
            roomText: room,
            countdownText: formatCardCountdown(cd),
            urgent
          };
        });

        const completedList = completedRaw.map(exam => {
          const { building, room } = parseBuildingAndRoom(exam.classroom);
          return {
            ...exam,
            weekdayText: getWeekdayText(exam.examDate),
            buildingText: building,
            roomText: room
          };
        });

        let firstExam = null;
        if (upcomingList.length > 0) {
          upcomingList.sort((a, b) => {
            const timeA = new Date(a.examDate + ' ' + a.startTime).getTime();
            const timeB = new Date(b.examDate + ' ' + b.startTime).getTime();
            return timeA - timeB;
          });
          firstExam = upcomingList[0];
        }

        this.setData({
          upcomingList,
          completedList,
          firstExam,
          loading: false
        });

        this.updateMainCountdown();
        resolve();
      }, 300);
    });
  },

  startCountdownTimer() {
    this.stopCountdownTimer();
    this._timer = setInterval(() => {
      this._baseDate = new Date(this._baseDate.getTime() + 1000);
      this.updateAllCountdowns();
    }, 1000);
  },

  stopCountdownTimer() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  },

  updateAllCountdowns() {
    const now = this._baseDate.getTime();
    const { upcomingList } = this.data;

    const updatedList = upcomingList.map(exam => {
      const examTime = new Date(exam.examDate + ' ' + exam.startTime).getTime();
      const cd = calculateCountdown(examTime, now);
      const urgent = !cd.isExpired && cd.days <= 3;
      return {
        ...exam,
        countdownText: formatCardCountdown(cd),
        urgent
      };
    });

    this.setData({ upcomingList: updatedList });
    this.updateMainCountdown();
  },

  updateMainCountdown() {
    const { firstExam } = this.data;
    if (!firstExam) return;

    const now = this._baseDate.getTime();
    const examTime = new Date(firstExam.examDate + ' ' + firstExam.startTime).getTime();
    const cd = calculateCountdown(examTime, now);

    this.setData({
      mainCountdown: {
        days: padZero(cd.days),
        hours: padZero(cd.hours),
        minutes: padZero(cd.minutes),
        seconds: padZero(cd.seconds)
      }
    });
  },

  switchTab(e) {
    const { tab } = e.currentTarget.dataset;
    if (!tab || tab === this.data.activeTab) return;
    this.setData({ activeTab: tab });
  },

  async onExamCardTap(e) {
    const { exam } = e.currentTarget.dataset;
    if (!exam || exam.isCompleted) return;

    const content = `确认将「${exam.courseName}」标记为已完成吗？`;
    const confirmed = await util.showConfirm(content, '标记已完成');
    if (!confirmed) return;

    const success = dataService.markExamCompleted(exam.id);
    if (success) {
      await util.showSuccess('标记成功');
      this.loadExamData();
    } else {
      util.showToast('操作失败，请重试');
    }
  }
});
