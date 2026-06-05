const app = getApp();
const util = require('../../utils/util');
const storage = require('../../utils/storage');

Page({
  data: {
    isLogin: true,
    showPassword: false,
    submitting: false,
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
  },

  togglePassword() {
    this.setData({
      showPassword: !this.data.showPassword
    });
  },

  toggleMode() {
    this.setData({
      isLogin: !this.data.isLogin,
      formData: {
        account: '',
        password: '',
        confirmPassword: ''
      }
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

    if (formData.password.length < 6) {
      util.showToast('密码至少6位');
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
      await new Promise(resolve => setTimeout(resolve, 800));

      const { isLogin, formData } = this.data;

      if (isLogin) {
        // 登录逻辑
        const users = storage.get('users') || [];
        const user = users.find(u => u.account === formData.account && u.password === formData.password);

        if (user) {
          const userInfo = {
            nickName: user.nickName,
            account: user.account,
            avatarUrl: user.avatarUrl || ''
          };
          app.updateUserInfo(userInfo);
          await util.showSuccess('登录成功');
          util.navigateBack();
        } else {
          util.showError('账号或密码错误');
        }
      } else {
        // 注册逻辑
        const users = storage.get('users') || [];
        const exists = users.find(u => u.account === formData.account);

        if (exists) {
          util.showError('账号已存在');
          return;
        }

        const newUser = {
          nickName: formData.account,
          account: formData.account,
          password: formData.password,
          avatarUrl: '',
          createTime: Date.now()
        };

        users.push(newUser);
        storage.set('users', users);

        // 注册成功后自动登录
        const userInfo = {
          nickName: newUser.nickName,
          account: newUser.account,
          avatarUrl: ''
        };
        app.updateUserInfo(userInfo);

        await util.showSuccess('注册成功');
        util.navigateBack();
      }
    } catch (e) {
      util.showError('操作失败');
    } finally {
      this.setData({ submitting: false });
    }
  }
});
