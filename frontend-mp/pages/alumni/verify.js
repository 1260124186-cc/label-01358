const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    darkMode: false,
    loading: true,
    submitting: false,
    userId: '',
    verifyInfo: null,
    verifyStatusInfo: null,
    formData: {
      name: '',
      studentId: '',
      graduationYear: '',
      college: '',
      workUnit: '',
      position: '',
      industry: '',
      bio: ''
    },
    graduationYearOptions: constants.ALUMNI_GRADUATION_YEARS,
    graduationYearIndex: -1,
    collegeOptions: constants.ALUMNI_COLLEGES,
    collegeIndex: -1,
    industryOptions: constants.ALUMNI_INDUSTRIES,
    industryIndex: -1
  },

  onLoad() {
    const currentUser = app.globalData.userInfo;
    this.setData({
      userId: currentUser ? currentUser.id : ''
    });
    this.loadVerifyInfo();
  },

  onShow() {
    if (!this.data.loading) {
      this.loadVerifyInfo();
    }
  },

  loadVerifyInfo() {
    this.setData({ loading: true });
    try {
      const verifyInfo = dataService.getAlumniVerifyInfo(this.data.userId);
      if (verifyInfo) {
        const statusInfo = constants.ALUMNI_VERIFY_STATUS_MAP[verifyInfo.status] || null;
        const graduationYearIndex = this.data.graduationYearOptions.indexOf(verifyInfo.graduationYear || '');
        const collegeIndex = this.data.collegeOptions.findIndex(c => c.value === verifyInfo.college);
        const industryIndex = this.data.industryOptions.findIndex(i => i.value === verifyInfo.industry);

        this.setData({
          verifyInfo,
          verifyStatusInfo: statusInfo,
          formData: {
            name: verifyInfo.name || '',
            studentId: verifyInfo.studentId || '',
            graduationYear: verifyInfo.graduationYear || '',
            college: verifyInfo.college || '',
            workUnit: verifyInfo.workUnit || '',
            position: verifyInfo.position || '',
            industry: verifyInfo.industry || '',
            bio: verifyInfo.bio || ''
          },
          graduationYearIndex: graduationYearIndex >= 0 ? graduationYearIndex : -1,
          collegeIndex: collegeIndex >= 0 ? collegeIndex : -1,
          industryIndex: industryIndex >= 0 ? industryIndex : -1
        });
      } else {
        this.setData({
          verifyInfo: null,
          verifyStatusInfo: null
        });
      }
    } catch (error) {
      console.error('加载认证信息失败:', error);
      util.showToast('加载失败');
    } finally {
      this.setData({ loading: false });
    }
  },

  onNameInput(e) {
    this.setData({ 'formData.name': e.detail.value });
  },

  onStudentIdInput(e) {
    this.setData({ 'formData.studentId': e.detail.value });
  },

  onGraduationYearChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      graduationYearIndex: index,
      'formData.graduationYear': this.data.graduationYearOptions[index]
    });
  },

  onCollegeChange(e) {
    const index = parseInt(e.detail.value);
    const college = this.data.collegeOptions[index];
    this.setData({
      collegeIndex: index,
      'formData.college': college ? college.value : ''
    });
  },

  onWorkUnitInput(e) {
    this.setData({ 'formData.workUnit': e.detail.value });
  },

  onPositionInput(e) {
    this.setData({ 'formData.position': e.detail.value });
  },

  onIndustryChange(e) {
    const index = parseInt(e.detail.value);
    const industry = this.data.industryOptions[index];
    this.setData({
      industryIndex: index,
      'formData.industry': industry ? industry.value : ''
    });
  },

  onBioInput(e) {
    this.setData({ 'formData.bio': e.detail.value });
  },

  validateForm() {
    const { formData } = this.data;

    if (!formData.name.trim()) {
      util.showToast('请输入姓名');
      return false;
    }

    if (formData.name.trim().length < 2) {
      util.showToast('请输入正确的姓名');
      return false;
    }

    if (!formData.studentId.trim()) {
      util.showToast('请输入学号');
      return false;
    }

    if (!formData.graduationYear) {
      util.showToast('请选择毕业年份');
      return false;
    }

    if (!formData.college) {
      util.showToast('请选择学院');
      return false;
    }

    if (!formData.workUnit.trim()) {
      util.showToast('请输入工作单位');
      return false;
    }

    if (!formData.position.trim()) {
      util.showToast('请输入职位');
      return false;
    }

    if (!formData.industry) {
      util.showToast('请选择行业');
      return false;
    }

    return true;
  },

  async onSubmit() {
    if (!this.validateForm()) return;

    this.setData({ submitting: true });

    try {
      const result = dataService.submitAlumniVerify(this.data.userId, {
        ...this.data.formData,
        name: this.data.formData.name.trim(),
        studentId: this.data.formData.studentId.trim(),
        workUnit: this.data.formData.workUnit.trim(),
        position: this.data.formData.position.trim(),
        bio: this.data.formData.bio.trim()
      });

      if (result) {
        util.showSuccess('认证申请已提交，请等待审核');
        this.loadVerifyInfo();
      } else {
        util.showToast('提交失败，请稍后重试');
      }
    } catch (error) {
      console.error('提交认证失败:', error);
      util.showToast('提交失败，请稍后重试');
    } finally {
      this.setData({ submitting: false });
    }
  }
});
