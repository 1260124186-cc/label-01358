const app = getApp();
const util = require('../../utils/util');
const fileUtil = require('../../utils/file');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    formData: {
      avatarUrl: '',
      nickName: '',
      gender: undefined,
      birthday: '',
      region: [],
      signature: ''
    },
    genderOptions: ['未知', '男', '女'],
    genderIndex: 0,
    today: '',
    regionText: '',
    saving: false
  },

  onLoad() {
    const now = new Date();
    const today = util.formatTime(now, 'YYYY-MM-DD');
    this.setData({ today });

    this.loadUserInfo();
  },

  loadUserInfo() {
    const userInfo = app.globalData.userInfo || {};
    const region = userInfo.region || [];

    this.setData({
      formData: {
        avatarUrl: userInfo.avatarUrl || '',
        nickName: userInfo.nickName || '',
        gender: userInfo.gender,
        birthday: userInfo.birthday || '',
        region: region,
        signature: userInfo.signature || ''
      },
      genderIndex: userInfo.gender || 0,
      regionText: region.length > 0 ? region.join(' ') : ''
    });
  },

  async onChooseAvatar(e) {
    // 使用微信头像选择能力
    const { avatarUrl } = e.detail;
    if (avatarUrl) {
      this.setData({
        'formData.avatarUrl': avatarUrl
      });
    }
  },

  onNicknameBlur(e) {
    // 获取微信昵称
    const { value } = e.detail;
    if (value) {
      this.setData({
        'formData.nickName': value
      });
    }
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  onGenderChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      genderIndex: index,
      'formData.gender': index
    });
  },

  onBirthdayChange(e) {
    this.setData({
      'formData.birthday': e.detail.value
    });
  },

  onRegionChange(e) {
    const region = e.detail.value;
    this.setData({
      'formData.region': region,
      regionText: region.length > 0 ? region.join(' ') : ''
    });
  },

  async onSave() {
    const { formData } = this.data;

    if (!formData.nickName.trim()) {
      util.showToast('请输入昵称');
      return;
    }

    this.setData({ saving: true });

    try {
      // 保存头像到本地
      let avatarUrl = formData.avatarUrl;
      if (avatarUrl && avatarUrl.startsWith('wxfile://')) {
        try {
          const fileName = fileUtil.generateFileName('jpg');
          avatarUrl = await fileUtil.copyTempFile(avatarUrl, fileName);
        } catch (e) {
          // 保存失败使用原路径
        }
      }

      const userInfo = {
        ...formData,
        avatarUrl
      };

      app.updateUserInfo(userInfo);

      await util.showSuccess('保存成功');
      util.navigateBack();
    } catch (e) {
      util.showError('保存失败');
    } finally {
      this.setData({ saving: false });
    }
  }
});
