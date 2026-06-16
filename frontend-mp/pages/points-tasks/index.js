const util = require('../../utils/util.js');
const pointsService = require('../../services/pointsService.js');
const constants = require('../../config/constants.js');
const app = getApp();

Page({
  data: {
    darkMode: false,
    loading: false,
    currentPoints: 0,
    signinStats: {
      consecutiveDays: 0,
      totalDays: 0,
      todaySigned: false
    },
    signinAnimation: false,
    earnedPoints: 0,
    dailyTasks: [],
    onceTasks: [],
    repeatableTasks: [],
    achievementTasks: [],
    weekDays: [],
    showSigninSuccess: false,
    signinSuccessPoints: 0
  },

  onLoad(options) {
    this.setData({
      darkMode: app.globalData.darkMode || false
    });
    if (!util.checkLogin(false)) {
      util.showToast('请先登录');
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/login/index' });
      }, 1500);
      return;
    }
    this.loadData();
  },

  onShow() {
    if (util.isLoggedIn()) {
      this.loadData();
    }
  },

  onPullDownRefresh() {
    this.loadData(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadData(callback) {
    this.setData({ loading: true });
    try {
      const currentPoints = pointsService.getUserPoints();
      const signinStats = pointsService.getSigninStats();
      const weekDays = this.generateWeekDays();
      
      const tasks = this.loadTasks();

      this.setData({
        currentPoints,
        signinStats,
        weekDays,
        ...tasks,
        loading: false
      });
      if (callback) callback();
    } catch (error) {
      console.error('加载积分任务失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
      if (callback) callback();
    }
  },

  generateWeekDays() {
    const weekDays = [];
    const today = new Date();
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
    const completedTasks = pointsService.getCompletedTasks();
    const signinTasks = completedTasks.filter(t => t.type === 'daily_signin');
    const signinDays = new Set();
    signinTasks.forEach(task => {
      const date = new Date(task.completeTime).toDateString();
      signinDays.add(date);
    });

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toDateString();
      const isToday = i === 0;
      const isSigned = signinDays.has(dateStr);
      weekDays.push({
        day: dayNames[date.getDay()],
        date: date.getDate(),
        isToday,
        isSigned,
        dateStr
      });
    }
    return weekDays;
  },

  loadTasks() {
    const allTasks = constants.POINT_TASK_TYPES;
    const dailyTasks = [];
    const onceTasks = [];
    const repeatableTasks = [];
    const achievementTasks = [];

    allTasks.forEach(task => {
      const eligibility = pointsService.checkTaskEligibility(null, task.value);
      const progressValue = this.getTaskProgress(task, eligibility);
      const taskWithStatus = {
        ...task,
        ...eligibility,
        statusText: this.getTaskStatusText(task.type, eligibility),
        buttonText: this.getTaskButtonText(task.type, eligibility),
        buttonDisabled: !eligibility.eligible,
        progressValue: progressValue,
        showProgress: this.shouldShowProgress(task.type, eligibility)
      };

      if (task.type === 'daily') {
        dailyTasks.push(taskWithStatus);
      } else if (task.type === 'once') {
        onceTasks.push(taskWithStatus);
      } else if (task.type === 'repeatable') {
        repeatableTasks.push(taskWithStatus);
      } else if (task.type === 'achievement') {
        achievementTasks.push(taskWithStatus);
      }
    });

    return { dailyTasks, onceTasks, repeatableTasks, achievementTasks };
  },

  getTaskStatusText(type, eligibility) {
    if (type === 'daily') {
      return eligibility.signed ? '今日已签到' : '待完成';
    }
    if (type === 'once') {
      return eligibility.completed ? '已完成' : '待完成';
    }
    if (type === 'repeatable') {
      if (eligibility.todayCount !== undefined) {
        return `今日 ${eligibility.todayCount}/${eligibility.maxDaily}`;
      }
      return '可完成';
    }
    if (type === 'achievement') {
      if (eligibility.consecutiveDays !== undefined) {
        return `${eligibility.consecutiveDays}/${eligibility.targetDays}天`;
      }
      return eligibility.eligible ? '可领取' : '未达成';
    }
    return '待完成';
  },

  getTaskButtonText(type, eligibility) {
    if (type === 'daily') {
      return eligibility.signed ? '已签到' : '立即签到';
    }
    if (type === 'once') {
      return eligibility.completed ? '已完成' : '去完成';
    }
    if (type === 'repeatable') {
      if (!eligibility.eligible) {
        return '今日已达上限';
      }
      return '去参与';
    }
    if (type === 'achievement') {
      return eligibility.eligible ? '立即领取' : '去签到';
    }
    return '去完成';
  },

  shouldShowProgress(type, eligibility) {
    if (type === 'repeatable' && eligibility.todayCount !== undefined) {
      return true;
    }
    if (type === 'achievement' && eligibility.consecutiveDays !== undefined) {
      return true;
    }
    return false;
  },

  getTaskProgress(task, eligibility) {
    if (task.type === 'repeatable' && eligibility.todayCount !== undefined) {
      return eligibility.todayCount / eligibility.maxDaily * 100;
    }
    if (task.type === 'achievement' && eligibility.consecutiveDays !== undefined) {
      return Math.min(100, eligibility.consecutiveDays / eligibility.targetDays * 100);
    }
    return 0;
  },

  async doSignin() {
    if (this.data.signinStats.todaySigned) {
      util.showToast('今日已签到');
      return;
    }

    try {
      const result = pointsService.markTaskCompleted(null, 'daily_signin');
      if (!result.success) {
        util.showToast(result.message || '签到失败');
        return;
      }

      const signinStats = pointsService.getSigninStats();
      const weekDays = this.generateWeekDays();
      const tasks = this.loadTasks();
      
      this.setData({
        signinAnimation: true,
        signinSuccessPoints: result.task.points,
        showSigninSuccess: true,
        currentPoints: result.pointsResult.points,
        signinStats,
        weekDays,
        ...tasks
      });

      util.showSuccess(`签到成功 +${result.task.points}积分`);

      setTimeout(() => {
        this.setData({
          signinAnimation: false,
          showSigninSuccess: false
        });
        this.checkAchievements(signinStats.consecutiveDays);
      }, 2000);
    } catch (error) {
      console.error('签到失败:', error);
      util.showToast('签到失败');
    }
  },

  checkAchievements(consecutiveDays) {
    if (consecutiveDays === 7) {
      const eligibility = pointsService.checkTaskEligibility(null, 'continue_7');
      if (eligibility.eligible) {
        wx.showModal({
          title: '🎉 恭喜达成',
          content: '连续签到7天，可领取100积分奖励！',
          confirmText: '立即领取',
          cancelText: '稍后再说',
          success: (res) => {
            if (res.confirm) {
              this.claimAchievement('continue_7');
            }
          }
        });
      }
    }
    if (consecutiveDays === 30) {
      const eligibility = pointsService.checkTaskEligibility(null, 'continue_30');
      if (eligibility.eligible) {
        wx.showModal({
          title: '🏆 太棒了',
          content: `连续签到30天，可领取500积分奖励！`,
          confirmText: '立即领取',
          cancelText: '稍后再说',
          success: (res) => {
            if (res.confirm) {
              this.claimAchievement('continue_30');
            }
          }
        });
      }
    }
  },

  claimAchievement(taskType) {
    try {
      const result = pointsService.markTaskCompleted(null, taskType);
      if (!result.success) {
        util.showToast(result.message || '领取失败');
        return;
      }
      const currentPoints = pointsService.getUserPoints();
      const tasks = this.loadTasks();
      this.setData({
        currentPoints,
        ...tasks
      });
      util.showSuccess(`领取成功 +${result.task.points}积分`);
    } catch (error) {
      console.error('领取奖励失败:', error);
      util.showToast('领取失败');
    }
  },

  doTask(e) {
    const task = e.currentTarget.dataset.task;
    if (!task) return;

    if (task.type === 'achievement') {
      if (task.eligible) {
        this.claimAchievement(task.value);
      } else {
        util.showToast('还未达成条件');
      }
      return;
    }

    if (task.moduleUrl) {
      wx.navigateTo({ url: task.moduleUrl });
    } else {
      util.showToast('功能开发中');
    }
  },

  goHistory() {
    wx.navigateTo({ url: '/pages/points-history/index' });
  },

  goMall() {
    wx.navigateTo({ url: '/pages/points-mall/index' });
  },

  goRules() {
    wx.navigateTo({ url: '/pages/points-rules/index' });
  },

  goBack() {
    wx.navigateBack();
  }
});
