const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    tabs: [
      { value: 'all', label: '全部' },
      { value: 'pending', label: '待结算' },
      { value: 'settled', label: '已结算' },
      { value: 'paid', label: '已发放' }
    ],
    currentTab: 'all',
    salaryList: [],
    totalSummary: {
      totalAmount: 0,
      paidAmount: 0,
      pendingAmount: 0
    }
  },

  onLoad() {
    dataService.initWorkStudyData();
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const allList = dataService.getWorkStudySalaryList({ userId: 'test_user' });

    const totalSummary = {
      totalAmount: allList.reduce((sum, s) => sum + (s.amount || 0), 0).toFixed(2),
      paidAmount: allList.filter(s => s.status === 'paid').reduce((sum, s) => sum + (s.amount || 0), 0).toFixed(2),
      pendingAmount: allList.filter(s => s.status !== 'paid').reduce((sum, s) => sum + (s.amount || 0), 0).toFixed(2)
    };

    let list = allList;
    if (this.data.currentTab !== 'all') {
      list = allList.filter(s => s.status === this.data.currentTab);
    }

    const formattedList = list.map(item => {
      const statusItem = constants.WORK_STUDY_SALARY_STATUS_MAP[item.status] || {};
      return {
        ...item,
        statusLabel: statusItem.label || '',
        statusColor: statusItem.color || '#6B7280',
        statusIcon: statusItem.icon || '',
        amountText: item.amount ? item.amount.toFixed(2) : '0.00',
        settleTimeText: item.settleTime ? util.formatTime(item.settleTime, 'YYYY-MM-DD HH:mm') : '',
        payTimeText: item.payTime ? util.formatTime(item.payTime, 'YYYY-MM-DD HH:mm') : ''
      };
    });

    this.setData({
      salaryList: formattedList,
      totalSummary
    });
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
    this.loadData();
  },

  onViewDetail(e) {
    const { month } = e.currentTarget.dataset;
    util.showToast('工资明细演示版');
  },

  onPay(e) {
    util.showToast('发放功能仅演示', 'none');
  }
});
