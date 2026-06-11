const app = getApp();
const util = require('../../utils/util');
const userService = require('../../services/userService');
const security = require('../../utils/security');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    isLogin: true,
    showPassword: false,
    showConfirmPassword: false,
    submitting: false,
    passwordStrength: 0,
    passwordStrengthText: '',
    passwordStrengthColor: '',
    formData: {
      account: '',
      password: '',
      confirmPassword: ''
    }
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });

    if (field === 'password') {
      this.updatePasswordStrength(value);
    }
  },

  updatePasswordStrength(password) {
    const strength = security.getPasswordStrength(password);
    let strengthText = '';
    let strengthColor = '';

    if (strength === 0) {
      strengthText = '';
      strengthColor = '';
    } else if (strength < 30) {
      strengthText = '弱';
      strengthColor = '#F44336';
    } else if (strength < 60) {
      strengthText = '中';
      strengthColor = '#FF9800';
    } else if (strength < 80) {
      strengthText = '强';
      strengthColor = '#4CAF50';
    } else {
      strengthText = '极强';
      strengthColor = '#2196F3';
    }

    this.setData({
      passwordStrength: strength,
      passwordStrengthText,
      passwordStrengthColor: strengthColor
    });
  },

  togglePassword() {
    this.setData({
      showPassword: !this.data.showPassword
    });
  },

  toggleConfirmPassword() {
    this.setData({
      showConfirmPassword: !this.data.showConfirmPassword
    });
  },

  toggleMode() {
    this.setData({
      isLogin: !this.data.isLogin,
      formData: {
        account: '',
        password: '',
        confirmPassword: ''
      },
      passwordStrength: 0,
      passwordStrengthText: '',
      passwordStrengthColor: ''
    });
  },

  validateForm() {
    const { isLogin, formData } = this.data;

    if (!formData.account.trim()) {
      util.showToast('请输入账号');
      return false;
    }

    if (!formData.password) {
      util.showToast('请输入密码');
      return false;
    }

    const passwordCheck = security.validatePasswordStrength(formData.password);
    if (!passwordCheck.valid) {
      util.showToast(passwordCheck.message);
      return false;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      util.showToast('两次密码不一致');
      return false;
    }

    return true;
  },

  async onSubmit() {
    if (!this.validateForm()) return;

    this.setData({ submitting: true });

    try {
      const { isLogin, formData } = this.data;

      if (isLogin) {
        const result = userService.loginUser(formData.account, formData.password);

        if (result.success) {
          app.updateUserInfo(result.user);
          await util.showSuccess(result.message);
          util.navigateBack();
        } else {
          util.showError(result.message);
        }
      } else {
        const result = userService.registerUser({
          account: formData.account,
          password: formData.password,
          nickName: formData.account
        });

        if (result.success) {
          app.updateUserInfo(result.user);
          await util.showSuccess(result.message);
          util.navigateBack();
        } else {
          util.showError(result.message);
        }
      }
    } catch (e) {
      console.error('登录注册失败:', e);
      util.showError('操作失败');
    } finally {
      this.setData({ submitting: false });
    }
  }
});
