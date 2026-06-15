const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    jobId: '',
    job: null,
    hasApplied: false,
    deptIcon: '',
    deptLabel: '',
    statusLabel: '',
    statusColor: '',
    statusIcon: '',
    isFull: false,
    remaining: 0,
    canApply: false,
    recruitProgress: 0,
    requirementsList: []
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ jobId: options.id });
      dataService.initWorkStudyData();
      this.loadData();
    }
  },

  onShow() {
    if (this.data.jobId) {
      this.loadData();
    }
  },

  loadData() {
    const job = dataService.getWorkStudyJobDetail(this.data.jobId);
    if (!job) {
      util.showToast('岗位不存在');
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    dataService.increaseWorkStudyJobViews(this.data.jobId);

    const deptItem = constants.WORK_STUDY_DEPARTMENTS.find(d => d.value === job.department) || {};
    const statusItem = constants.WORK_STUDY_JOB_STATUS_MAP[job.status] || {};
    const isFull = (job.currentCount || 0) >= (job.recruitCount || 0);
    const remaining = Math.max(0, (job.recruitCount || 0) - (job.currentCount || 0));
    const progress = job.recruitCount ? Math.min(100, Math.round((job.currentCount || 0) / job.recruitCount * 100)) : 0;

    const requirementsList = job.requirements
      ? job.requirements.split(/[；;。.]/).filter(r => r.trim())
      : [];

    this.setData({
      job,
      hasApplied: dataService.hasAppliedForJob(this.data.jobId),
      deptIcon: deptItem.icon || '📌',
      deptLabel: deptItem.label || job.departmentName || '',
      statusLabel: statusItem.label || '',
      statusColor: statusItem.color || '#6B7280',
      statusIcon: statusItem.icon || '',
      isFull,
      remaining,
      canApply: job.status === 'recruiting' && !isFull,
      recruitProgress: progress,
      requirementsList
    });
  },

  onApply() {
    if (!this.data.canApply) {
      if (this.data.isFull) {
        util.showToast('该岗位已招满');
      } else {
        util.showToast('该岗位已结束招聘');
      }
      return;
    }
    if (this.data.hasApplied) {
      util.showToast('您已申请过该岗位');
      return;
    }
    util.navigateTo('/pages/work-study/apply?jobId=' + this.data.jobId);
  }
});
