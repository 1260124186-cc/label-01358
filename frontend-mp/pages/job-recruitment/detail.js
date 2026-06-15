const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    jobId: '',
    job: null,
    isFavorited: false,
    isExpired: false,
    formattedContent: {}
  },

  onLoad(options) {
    const { id } = options;
    this.setData({ jobId: id });
    dataService.initJobRecruitmentData();
    this.loadData();
  },

  onShow() {
    if (this.data.jobId) {
      this.loadData();
    }
  },

  loadData() {
    const job = dataService.getJobDetail(this.data.jobId);
    if (!job) {
      wx.showToast({
        title: '职位不存在',
        icon: 'none'
      });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const typeItem = constants.JOB_TYPES.find(t => t.value === job.type) || {};
    const industryItem = constants.JOB_INDUSTRIES.find(i => i.value === job.industry) || {};
    const cityItem = constants.JOB_CITIES.find(c => c.value === job.location) || {};
    const statusItem = constants.JOB_STATUS_MAP[job.status] || {};
    const isExpired = job.deadline && job.deadline < Date.now();
    const daysLeft = job.deadline ? Math.ceil((job.deadline - Date.now()) / 86400000) : null;

    const gradeLabels = (job.gradeRequirement || []).map(g => {
      const grade = constants.JOB_GRADE_REQUIREMENTS.find(gr => gr.value === g);
      return grade ? grade.label : g;
    });

    const formattedContent = {
      typeLabel: typeItem.label || '',
      typeIcon: typeItem.icon || '',
      industryLabel: industryItem.label || '',
      cityLabel: cityItem.label || job.location,
      statusLabel: statusItem.label || '',
      statusColor: statusItem.color || '#6B7280',
      deadlineText: job.deadline ? util.formatTime(job.deadline, 'YYYY-MM-DD') : '长期有效',
      deadlineFullText: job.deadline ? util.formatTime(job.deadline, 'YYYY年MM月DD日 HH:mm') : '长期有效',
      daysLeft,
      isExpired,
      salaryText: job.salaryMin && job.salaryMax 
        ? `¥${job.salaryMin}-${job.salaryMax}${job.salaryUnit || '/月'}`
        : '面议',
      gradeLabels,
      publishTimeText: util.formatTime(job.publishTime, 'YYYY-MM-DD'),
      updateTimeText: util.formatTime(job.updateTime, 'YYYY-MM-DD HH:mm')
    };

    this.setData({
      job,
      formattedContent,
      isFavorited: dataService.isJobFavorited(this.data.jobId),
      isExpired
    });
  },

  onToggleFavorite() {
    const isFavorited = dataService.toggleJobFavorite(this.data.jobId);
    this.setData({ isFavorited });
    wx.showToast({
      title: isFavorited ? '已收藏' : '已取消收藏',
      icon: 'success',
      duration: 1500
    });
  },

  onApply() {
    if (this.data.isExpired) {
      wx.showToast({
        title: '该职位已截止',
        icon: 'none'
      });
      return;
    }
    util.navigateTo('/pages/job-recruitment/apply?id=' + this.data.jobId);
  },

  onShareAppMessage() {
    const { job, formattedContent } = this.data;
    return {
      title: `${job.company} - ${job.title}`,
      path: '/pages/job-recruitment/detail?id=' + this.data.jobId,
      desc: `${formattedContent.salaryText} | ${formattedContent.cityLabel}`
    };
  },

  onShareTimeline() {
    const { job, formattedContent } = this.data;
    return {
      title: `${job.company} ${job.title} - ${formattedContent.salaryText}`,
      query: 'id=' + this.data.jobId
    };
  },

  onCopyCompany() {
    wx.setClipboardData({
      data: this.data.job.company,
      success: () => {
        wx.showToast({ title: '已复制公司名', icon: 'success' });
      }
    });
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  }
});
