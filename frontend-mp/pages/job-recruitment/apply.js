const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    jobId: '',
    job: null,
    applyMethod: 'form',
    resumeList: [],
    selectedResumeId: '',
    formData: {
      name: '',
      phone: '',
      email: '',
      gender: '',
      grade: '',
      major: '',
      school: '',
      selfIntroduction: '',
      expectedSalary: '',
      availableTime: ''
    },
    genders: [
      { value: 'male', label: '男' },
      { value: 'female', label: '女' }
    ],
    grades: [],
    submitting: false,
    agreementChecked: true
  },

  onLoad(options) {
    const { id } = options;
    this.setData({ 
      jobId: id,
      grades: constants.JOB_GRADE_REQUIREMENTS
    });
    dataService.initJobRecruitmentData();
    this.loadData();
  },

  loadData() {
    const job = dataService.getJobDetail(this.data.jobId);
    const resumeList = dataService.getResumeList();

    this.setData({
      job,
      resumeList
    });
  },

  onMethodChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ applyMethod: value });
  },

  onSelectResume(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({ selectedResumeId: id });
  },

  onUploadResume() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['pdf', 'doc', 'docx'],
      success: (res) => {
        const file = res.tempFiles[0];
        wx.showLoading({ title: '上传中...' });
        
        setTimeout(() => {
          wx.hideLoading();
          const resume = dataService.saveResume({
            fileName: file.name,
            filePath: file.path,
            fileSize: file.size,
            fileType: file.name.split('.').pop().toLowerCase()
          });
          
          wx.showToast({ title: '上传成功', icon: 'success' });
          this.loadData();
          this.setData({ selectedResumeId: resume.id });
        }, 1500);
      }
    });
  },

  onDeleteResume(e) {
    e.stopPropagation();
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这份简历吗？',
      success: (res) => {
        if (res.confirm) {
          dataService.deleteResume(id);
          wx.showToast({ title: '已删除', icon: 'success' });
          this.loadData();
          if (this.data.selectedResumeId === id) {
            this.setData({ selectedResumeId: '' });
          }
        }
      }
    });
  },

  onFormInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`formData.${field}`]: e.detail.value
    });
  },

  onGenderSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ 'formData.gender': value });
  },

  onGradeSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ 'formData.grade': value });
  },

  onAgreementToggle() {
    this.setData({ agreementChecked: !this.data.agreementChecked });
  },

  validateForm() {
    const { formData } = this.data;
    
    if (!formData.name.trim()) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return false;
    }
    if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return false;
    }
    if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(formData.email)) {
      wx.showToast({ title: '请输入正确的邮箱', icon: 'none' });
      return false;
    }
    if (!formData.gender) {
      wx.showToast({ title: '请选择性别', icon: 'none' });
      return false;
    }
    if (!formData.grade) {
      wx.showToast({ title: '请选择年级', icon: 'none' });
      return false;
    }
    if (!formData.school.trim()) {
      wx.showToast({ title: '请输入学校', icon: 'none' });
      return false;
    }
    if (!formData.major.trim()) {
      wx.showToast({ title: '请输入专业', icon: 'none' });
      return false;
    }
    if (!formData.selfIntroduction.trim()) {
      wx.showToast({ title: '请输入自我介绍', icon: 'none' });
      return false;
    }
    
    return true;
  },

  onSubmit() {
    if (this.data.submitting) return;

    if (!this.data.agreementChecked) {
      wx.showToast({ title: '请先同意求职协议', icon: 'none' });
      return;
    }

    let applicationData = {
      jobId: this.data.jobId,
      jobTitle: this.data.job.title,
      company: this.data.job.company,
      applyMethod: this.data.applyMethod
    };

    if (this.data.applyMethod === 'resume') {
      if (!this.data.selectedResumeId) {
        wx.showToast({ title: '请选择或上传简历', icon: 'none' });
        return;
      }
      applicationData.resumeId = this.data.selectedResumeId;
      
      const resume = this.data.resumeList.find(r => r.id === this.data.selectedResumeId);
      if (resume) {
        applicationData.resumeInfo = {
          fileName: resume.fileName,
          filePath: resume.filePath
        };
      }
    } else {
      if (!this.validateForm()) return;
      applicationData.formData = { ...this.data.formData };
    }

    wx.showModal({
      title: '确认投递',
      content: `确定要投递「${this.data.job.title}」职位吗？`,
      success: (res) => {
        if (res.confirm) {
          this.setData({ submitting: true });
          
          setTimeout(() => {
            dataService.submitJobApplication(applicationData);
            this.setData({ submitting: false });
            
            wx.showToast({
              title: '投递成功',
              icon: 'success',
              duration: 2000
            });
            
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/job-recruitment/my-applications'
              });
            }, 2000);
          }, 1500);
        }
      }
    });
  }
});
