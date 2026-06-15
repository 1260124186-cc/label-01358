const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    currentTab: 'all',
    applicationList: [],
    filteredList: [],
    tabs: [],
    showDetailModal: false,
    selectedApplication: null,
    stats: {
      total: 0,
      pending: 0,
      reviewing: 0,
      interview: 0,
      offer: 0,
      rejected: 0
    }
  },

  onLoad() {
    dataService.initJobRecruitmentData();
    this.setData({
      tabs: constants.JOB_APPLICATION_STATUS_TABS
    });
    this.loadData();
  },

  onShow() {
    dataService.initJobRecruitmentData();
    this.loadData();
  },

  loadData() {
    const filters = {
      status: this.data.currentTab
    };
    const list = dataService.getMyJobApplications(filters);

    const formattedList = list.map(item => {
      const statusItem = constants.JOB_APPLICATION_STATUS_MAP[item.status] || {};
      const timeline = this.formatTimeline(item.timeline);

      return {
        ...item,
        statusLabel: statusItem.label || '',
        statusColor: statusItem.color || '#6B7280',
        statusIcon: statusItem.icon || '',
        applyTimeText: util.formatTime(item.applyTime, 'YYYY-MM-DD HH:mm'),
        applyDateText: util.formatTime(item.applyTime, 'MM-DD'),
        updateTimeText: item.updateTime ? util.formatTime(item.updateTime, 'YYYY-MM-DD HH:mm') : '',
        timeline,
        latestTimeline: timeline.length > 0 ? timeline[timeline.length - 1] : null
      };
    });

    const stats = this.calculateStats(formattedList);

    this.setData({
      applicationList: formattedList,
      filteredList: formattedList,
      stats
    });
  },

  formatTimeline(timeline) {
    if (!timeline || timeline.length === 0) return [];

    return timeline.map((item, index) => {
      const statusItem = constants.JOB_APPLICATION_STATUS_MAP[item.status] || {};
      return {
        ...item,
        statusLabel: statusItem.label || item.status,
        statusColor: statusItem.color || '#6B7280',
        timeText: util.formatTime(item.time, 'MM-DD HH:mm'),
        isFirst: index === 0,
        isLast: index === timeline.length - 1
      };
    }).reverse();
  },

  calculateStats(list) {
    const stats = {
      total: list.length,
      pending: 0,
      reviewing: 0,
      interview: 0,
      offer: 0,
      rejected: 0
    };

    list.forEach(item => {
      if (stats.hasOwnProperty(item.status)) {
        stats[item.status]++;
      }
    });

    return stats;
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });

    if (value === 'all') {
      this.setData({ filteredList: this.data.applicationList });
    } else {
      const filtered = this.data.applicationList.filter(item => item.status === value);
      this.setData({ filteredList: filtered });
    }
  },

  onApplicationTap(e) {
    const { id } = e.currentTarget.dataset;
    const application = this.data.applicationList.find(a => a.id === id);
    if (application) {
      this.setData({
        selectedApplication: application,
        showDetailModal: true
      });
    }
  },

  onCloseDetail() {
    this.setData({ showDetailModal: false });
  },

  onNavToJobDetail(e) {
    const { jobId } = e.currentTarget.dataset;
    if (jobId) {
      util.navigateTo('/pages/job-recruitment/detail?id=' + jobId);
    }
  },

  onContactHR(e) {
    e.stopPropagation();
    wx.showModal({
      title: '联系HR',
      content: '是否拨打HR电话？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '功能开发中',
            icon: 'none'
          });
        }
      }
    });
  },

  onWithdrawApplication(e) {
    e.stopPropagation();
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认撤销',
      content: '确定要撤销这次投递吗？撤销后无法恢复。',
      success: (res) => {
        if (res.confirm) {
          const storage = require('../../../utils/storage');
          const list = storage.getList(storage.STORAGE_KEYS.JOB_APPLICATIONS);
          const index = list.findIndex(item => item.id === id);
          if (index > -1) {
            list.splice(index, 1);
            storage.set(storage.STORAGE_KEYS.JOB_APPLICATIONS, list);
            
            wx.showToast({
              title: '已撤销',
              icon: 'success'
            });
            
            this.loadData();
          }
        }
      }
    });
  },

  onShareApplication(e) {
    e.stopPropagation();
    const application = this.data.selectedApplication;
    if (application) {
      wx.setClipboardData({
        data: `${application.jobTitle} - ${application.company}`,
        success: () => {
          wx.showToast({
            title: '已复制职位信息',
            icon: 'success'
          });
        }
      });
    }
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  }
});
