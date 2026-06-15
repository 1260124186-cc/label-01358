const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    tabs: [],
    currentTab: 'all',
    applicationList: [],
    stats: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    }
  },

  onLoad() {
    dataService.initWorkStudyData();
    this.setData({ tabs: constants.WORK_STUDY_MY_APPLICATION_TABS });
    this.loadData();
  },

  onShow() {
    dataService.initWorkStudyData();
    this.loadData();
  },

  loadData() {
    const allList = dataService.getWorkStudyApplicationList({ userId: 'test_user' });

    const stats = {
      total: allList.length,
      pending: allList.filter(a => a.status === 'pending').length,
      approved: allList.filter(a => a.status === 'approved').length,
      rejected: allList.filter(a => a.status === 'rejected').length
    };

    let list = allList;
    if (this.data.currentTab !== 'all') {
      list = allList.filter(a => a.status === this.data.currentTab);
    }

    const formattedList = list.map(item => {
      const statusItem = constants.WORK_STUDY_APPLICATION_STATUS_MAP[item.status] || {};
      const deptItem = constants.WORK_STUDY_DEPARTMENTS.find(d => d.value === item.department) || {};
      return {
        ...item,
        statusLabel: statusItem.label || '',
        statusColor: statusItem.color || '#6B7280',
        statusIcon: statusItem.icon || '',
        deptIcon: deptItem.icon || '📌',
        deptLabel: deptItem.label || item.departmentName || '',
        applyTimeText: util.formatTime(item.applyTime, 'YYYY-MM-DD HH:mm'),
        reviewTimeText: item.reviewTime ? util.formatTime(item.reviewTime, 'YYYY-MM-DD HH:mm') : ''
      };
    });

    this.setData({
      applicationList: formattedList,
      stats
    });
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
    this.loadData();
  },

  onNavToJob(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo('/pages/work-study/detail?id=' + id);
  },

  onRecordHours(e) {
    const { applicationid, jobid, jobtitle, hourlywage } = e.currentTarget.dataset;
    util.showToast('工时记录功能详见「工时记录」页面');
  },

  onViewSalary(e) {
    util.navigateTo('/pages/work-study/salary');
  }
});
