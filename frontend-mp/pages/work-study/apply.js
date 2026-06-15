const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

const WEEKDAYS = [
  { value: 'monday', label: '周一' },
  { value: 'tuesday', label: '周二' },
  { value: 'wednesday', label: '周三' },
  { value: 'thursday', label: '周四' },
  { value: 'friday', label: '周五' },
  { value: 'saturday', label: '周六' },
  { value: 'sunday', label: '周日' }
];

mixPage({
  data: {
    darkMode: false,
    jobId: '',
    job: null,
    deptLabel: '',
    deptIcon: '',
    name: '',
    phone: '',
    studentId: '',
    major: '',
    resume: '',
    availableDays: [],
    weekdays: WEEKDAYS,
    availableTime: 'morning',
    availableTimeOptions: [
      { value: 'morning', label: '上午 (8:00-12:00)' },
      { value: 'afternoon', label: '下午 (14:00-18:00)' },
      { value: 'evening', label: '晚上 (19:00-21:30)' },
      { value: 'anytime', label: '全天可支配' }
    ],
    weekHours: '',
    weekHoursOptions: ['5小时以内', '5-10小时', '10-15小时', '15-20小时', '20小时以上'],
    weekHoursIndex: 1,
    submitting: false
  },

  onLoad(options) {
    if (options.jobId) {
      this.setData({ jobId: options.jobId });
      dataService.initWorkStudyData();
      this.loadJob();
      this.loadUserProfile();
    }
  },

  loadJob() {
    const job = dataService.getWorkStudyJobDetail(this.data.jobId);
    if (!job) {
      util.showToast('岗位不存在');
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }
    const deptItem = constants.WORK_STUDY_DEPARTMENTS.find(d => d.value === job.department) || {};
    this.setData({
      job,
      deptLabel: deptItem.label || job.departmentName || '',
      deptIcon: deptItem.icon || '📌'
    });
  },

  loadUserProfile() {
    this.setData({
      name: '张三',
      phone: '13800138000',
      studentId: '2023001',
      major: '计算机科学与技术'
    });
  },

  onNameInput(e) {
    this.setData({ name: e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onStudentIdInput(e) {
    this.setData({ studentId: e.detail.value });
  },

  onMajorInput(e) {
    this.setData({ major: e.detail.value });
  },

  onResumeInput(e) {
    this.setData({ resume: e.detail.value });
  },

  onDayToggle(e) {
    const { value } = e.currentTarget.dataset;
    const days = [...this.data.availableDays];
    const index = days.indexOf(value);
    if (index > -1) {
      days.splice(index, 1);
    } else {
      days.push(value);
    }
    this.setData({ availableDays: days });
  },

  onTimeChange(e) {
    this.setData({ availableTime: e.currentTarget.dataset.value });
  },

  onWeekHoursChange(e) {
    this.setData({
      weekHoursIndex: Number(e.detail.value),
      weekHours: this.data.weekHoursOptions[Number(e.detail.value)]
    });
  },

  onSelectAllDays() {
    if (this.data.availableDays.length === 7) {
      this.setData({ availableDays: [] });
    } else {
      this.setData({ availableDays: WEEKDAYS.map(d => d.value) });
    }
  },

  validate() {
    const { name, phone, studentId, major, resume, availableDays } = this.data;
    if (!name.trim()) return '请输入姓名';
    if (!phone.trim()) return '请输入联系电话';
    if (!/^1[3-9]\d{9}$/.test(phone)) return '请输入正确的手机号码';
    if (!studentId.trim()) return '请输入学号';
    if (!major.trim()) return '请输入专业';
    if (!resume.trim()) return '请填写个人简历';
    if (resume.trim().length < 10) return '个人简历至少10个字';
    if (availableDays.length === 0) return '请选择可工作的日期';
    return null;
  },

  onSubmit() {
    if (this.data.submitting) return;

    const error = this.validate();
    if (error) {
      util.showToast(error);
      return;
    }

    this.setData({ submitting: true });

    const selectedDayLabels = WEEKDAYS
      .filter(d => this.data.availableDays.includes(d.value))
      .map(d => d.label)
      .join('、');

    const timeLabel = this.data.availableTimeOptions.find(t => t.value === this.data.availableTime)?.label || '';

    const application = dataService.createWorkStudyApplication({
      jobId: this.data.jobId,
      jobTitle: this.data.job.title,
      department: this.data.job.department,
      departmentName: this.data.deptLabel,
      hourlyWage: this.data.job.hourlyWage,
      userId: 'test_user',
      userName: this.data.name.trim(),
      userPhone: this.data.phone.trim(),
      studentId: this.data.studentId.trim(),
      major: this.data.major.trim(),
      resume: this.data.resume.trim(),
      availableDays: this.data.availableDays,
      availableDaysText: selectedDayLabels,
      availableTime: this.data.availableTime,
      availableTimeText: timeLabel,
      weekHours: this.data.weekHoursOptions[this.data.weekHoursIndex]
    });

    setTimeout(() => {
      this.setData({ submitting: false });
      util.showToast('申请提交成功', 'success');
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/work-study/my-applications'
        });
      }, 1500);
    }, 800);
  }
});
