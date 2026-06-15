const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    tabs: [
      { value: 'all', label: '全部' },
      { value: 'pending', label: '待确认' },
      { value: 'confirmed', label: '已确认' },
      { value: 'rejected', label: '已驳回' }
    ],
    currentTab: 'all',
    approvedJobs: [],
    currentMonth: '',
    monthOptions: [],
    monthIndex: 0,
    hoursList: [],
    monthlySummary: {
      totalHours: 0,
      totalSalary: 0,
      confirmedHours: 0,
      confirmedSalary: 0
    },
    showAddModal: false,
    addForm: {
      applicationId: '',
      applicationIndex: 0,
      date: '',
      startTime: '09:00',
      endTime: '12:00',
      hours: 3,
      description: ''
    },
    submitting: false
  },

  onLoad() {
    dataService.initWorkStudyData();
    this.initMonthOptions();
    this.loadApprovedJobs();
    this.loadData();
  },

  onShow() {
    this.loadApprovedJobs();
    this.loadData();
  },

  initMonthOptions() {
    const now = new Date();
    const options = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
      options.push(monthStr);
    }
    const today = new Date();
    const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
    const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

    this.setData({
      monthOptions: options,
      currentMonth: currentMonth,
      'addForm.date': todayStr
    });
  },

  loadApprovedJobs() {
    const approved = dataService.getApprovedApplications();
    this.setData({ approvedJobs: approved });
    if (approved.length > 0 && !this.data.addForm.applicationId) {
      this.setData({
        'addForm.applicationId': approved[0].id,
        'addForm.applicationIndex': 0
      });
    }
  },

  loadData() {
    const month = this.data.monthOptions[this.data.monthIndex];
    const filters = {
      userId: 'test_user',
      month: month
    };
    if (this.data.currentTab !== 'all') {
      filters.status = this.data.currentTab;
    }

    const list = dataService.getWorkStudyHoursRecords(filters);
    const allMonthList = dataService.getWorkStudyHoursRecords({ userId: 'test_user', month: month });

    let totalHours = 0;
    let totalSalary = 0;
    let confirmedHours = 0;
    let confirmedSalary = 0;

    allMonthList.forEach(record => {
      const job = this.data.approvedJobs.find(j => j.id === record.applicationId);
      const wage = job?.hourlyWage || record.hourlyWage || 20;
      const h = record.hours || 0;
      totalHours += h;
      totalSalary += h * wage;
      if (record.status === 'confirmed') {
        confirmedHours += h;
        confirmedSalary += h * wage;
      }
    });

    const formattedList = list.map(item => {
      const statusItem = constants.WORK_STUDY_HOURS_STATUS_MAP[item.status] || {};
      const job = this.data.approvedJobs.find(j => j.id === item.applicationId);
      return {
        ...item,
        jobTitle: item.jobTitle || job?.jobTitle || '未知岗位',
        hourlyWage: item.hourlyWage || job?.hourlyWage || 20,
        statusLabel: statusItem.label || '',
        statusColor: statusItem.color || '#6B7280',
        statusIcon: statusItem.icon || '',
        totalSalary: Math.round((item.hours || 0) * (item.hourlyWage || job?.hourlyWage || 20) * 100) / 100,
        submitTimeText: item.submitTime ? util.formatTime(item.submitTime, 'MM-DD HH:mm') : ''
      };
    });

    this.setData({
      hoursList: formattedList,
      currentMonth: month,
      monthlySummary: {
        totalHours: totalHours.toFixed(1),
        totalSalary: totalSalary.toFixed(2),
        confirmedHours: confirmedHours.toFixed(1),
        confirmedSalary: confirmedSalary.toFixed(2)
      }
    });
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
    this.loadData();
  },

  onMonthChange(e) {
    this.setData({ monthIndex: Number(e.detail.value) });
    this.loadData();
  },

  onOpenAddModal() {
    if (this.data.approvedJobs.length === 0) {
      util.showToast('暂无可记录工时的岗位');
      return;
    }
    this.setData({ showAddModal: true });
  },

  onCloseAddModal() {
    this.setData({ showAddModal: false });
  },

  onJobChange(e) {
    const index = Number(e.detail.value);
    this.setData({
      'addForm.applicationIndex': index,
      'addForm.applicationId': this.data.approvedJobs[index].id
    });
  },

  onDateChange(e) {
    this.setData({ 'addForm.date': e.detail.value });
  },

  onStartTimeChange(e) {
    const startTime = e.detail.value;
    const endTime = this.data.addForm.endTime;
    this.setData({ 'addForm.startTime': startTime });
    this.calculateHours(startTime, endTime);
  },

  onEndTimeChange(e) {
    const endTime = e.detail.value;
    const startTime = this.data.addForm.startTime;
    this.setData({ 'addForm.endTime': endTime });
    this.calculateHours(startTime, endTime);
  },

  calculateHours(startTime, endTime) {
    if (!startTime || !endTime) return;
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;
    let diff = (endMinutes - startMinutes) / 60;
    if (diff <= 0) diff = 0;
    diff = Math.round(diff * 2) / 2;
    this.setData({ 'addForm.hours': diff });
  },

  onDescInput(e) {
    this.setData({ 'addForm.description': e.detail.value });
  },

  onHoursInput(e) {
    this.setData({ 'addForm.hours': Number(e.detail.value) || 0 });
  },

  onSubmitHours() {
    if (this.data.submitting) return;

    const form = this.data.addForm;
    if (!form.applicationId) {
      util.showToast('请选择岗位');
      return;
    }
    if (!form.date) {
      util.showToast('请选择日期');
      return;
    }
    if (!form.hours || form.hours <= 0) {
      util.showToast('请填写正确的工时');
      return;
    }
    if (form.hours > 12) {
      util.showToast('单日工时不能超过12小时');
      return;
    }

    this.setData({ submitting: true });
    const job = this.data.approvedJobs.find(j => j.id === form.applicationId);

    dataService.createWorkStudyHoursRecord({
      userId: 'test_user',
      applicationId: form.applicationId,
      jobId: job?.jobId,
      jobTitle: job?.jobTitle,
      hourlyWage: job?.hourlyWage,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      hours: form.hours,
      description: form.description.trim()
    });

    setTimeout(() => {
      this.setData({
        submitting: false,
        showAddModal: false,
        'addForm.description': ''
      });
      util.showToast('提交成功', 'success');
      this.loadData();
    }, 600);
  }
});
