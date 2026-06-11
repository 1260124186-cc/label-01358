const util = require('../../utils/util.js');
const userService = require('../../services/userService.js');
const app = getApp();

Page({
  data: {
    darkMode: false,
    loading: false,
    submitting: false,
    userId: '',
    verifyStatus: null,
    formData: {
      realName: '',
      studentId: '',
      department: '',
      className: ''
    },
    departmentList: [
      '计算机学院', '电子信息学院', '机械工程学院', '材料科学与工程学院',
      '化学化工学院', '生命科学学院', '数学与统计学院', '物理学院',
      '外国语学院', '法学院', '经济管理学院', '人文学院',
      '艺术设计学院', '马克思主义学院', '体育学院', '继续教育学院'
    ],
    departmentIndex: -1,
    agreeTerms: false
  },

  onLoad() {
    const currentUser = app.globalData.userInfo;
    
    this.setData({
      darkMode: app.globalData.darkMode || false,
      userId: currentUser ? currentUser.id : ''
    });

    if (!currentUser) {
      util.showToast('请先登录');
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/login/index' });
      }, 1500);
      return;
    }

    this.loadVerifyStatus();
  },

  loadVerifyStatus() {
    this.setData({ loading: true });

    try {
      const status = userService.getRealNameVerifyStatus(this.data.userId);
      
      if (status) {
        const departmentIndex = this.data.departmentList.indexOf(status.department || '');
        this.setData({
          verifyStatus: status,
          formData: {
            realName: status.realName || '',
            studentId: status.studentId || '',
            department: status.department || '',
            className: status.className || ''
          },
          departmentIndex: departmentIndex >= 0 ? departmentIndex : -1
        });
      }
    } catch (error) {
      console.error('加载认证状态失败:', error);
      util.showToast('加载失败');
    } finally {
      this.setData({ loading: false });
    }
  },

  onNameInput(e) {
    this.setData({ 'formData.realName': e.detail.value });
  },

  onStudentIdInput(e) {
    this.setData({ 'formData.studentId': e.detail.value });
  },

  onDepartmentChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      departmentIndex: index,
      'formData.department': this.data.departmentList[index]
    });
  },

  onClassInput(e) {
    this.setData({ 'formData.className': e.detail.value });
  },

  onAgreeChange(e) {
    this.setData({ agreeTerms: e.detail.value });
  },

  validateForm() {
    const { formData, agreeTerms } = this.data;

    if (!formData.realName.trim()) {
      util.showToast('请输入真实姓名');
      return false;
    }

    if (formData.realName.trim().length < 2) {
      util.showToast('请输入正确的姓名');
      return false;
    }

    if (!formData.studentId.trim()) {
      util.showToast('请输入学号');
      return false;
    }

    if (!/^\d{8,12}$/.test(formData.studentId.trim())) {
      util.showToast('学号格式不正确');
      return false;
    }

    if (!formData.department) {
      util.showToast('请选择院系');
      return false;
    }

    if (!agreeTerms) {
      util.showToast('请同意信息使用协议');
      return false;
    }

    return true;
  },

  async onSubmit() {
    if (!this.validateForm()) return;

    this.setData({ submitting: true });

    try {
      const result = userService.submitRealNameVerify(this.data.userId, {
        ...this.data.formData,
        realName: this.data.formData.realName.trim(),
        studentId: this.data.formData.studentId.trim(),
        className: this.data.formData.className.trim()
      });

      if (result.success) {
        util.showSuccess('认证申请已提交，请等待审核');
        app.updateUserInfo(result.user);
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
      } else {
        util.showToast(result.message || '提交失败');
      }
    } catch (error) {
      console.error('提交认证失败:', error);
      util.showToast('提交失败，请稍后重试');
    } finally {
      this.setData({ submitting: false });
    }
  },

  viewTerms() {
    wx.showModal({
      title: '信息使用协议',
      content: '1. 您提供的个人信息仅用于身份验证，不会对外公开\n2. 我们将严格保护您的个人隐私\n3. 如发现信息造假，将取消认证资格并影响信用评分\n4. 您可以随时申请撤销认证',
      showCancel: false,
      confirmText: '我知道了'
    });
  }
});
