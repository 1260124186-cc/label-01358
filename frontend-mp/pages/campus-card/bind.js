const util = require('../../utils/util');
const storage = require('../../utils/storage');
const mockData = require('../../config/mock-data');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    cardNo: '',
    studentId: '',
    studentName: '',
    idCardNo: '',
    phone: '',
    loading: false,
    agreeTerms: false
  },

  onLoad() {
    const boundInfo = storage.get(storage.STORAGE_KEYS.CAMPUS_CARD_BIND_INFO);
    if (boundInfo) {
      this.setData({
        cardNo: boundInfo.cardNo || '',
        studentId: boundInfo.studentId || '',
        studentName: boundInfo.studentName || '',
        phone: boundInfo.phone || ''
      });
    }
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const value = e.detail.value;
    this.setData({ [field]: value });
  },

  onToggleTerms() {
    this.setData({ agreeTerms: !this.data.agreeTerms });
  },

  onSubmit() {
    const { cardNo, studentId, studentName, idCardNo, phone, agreeTerms } = this.data;

    if (!cardNo.trim()) {
      util.showToast('请输入校园卡号');
      return;
    }

    if (cardNo.trim().length < 8) {
      util.showToast('校园卡号格式不正确');
      return;
    }

    if (!studentId.trim()) {
      util.showToast('请输入学号');
      return;
    }

    if (!studentName.trim()) {
      util.showToast('请输入姓名');
      return;
    }

    if (!idCardNo.trim()) {
      util.showToast('请输入身份证号');
      return;
    }

    if (!/^\d{17}[\dXx]$/.test(idCardNo.trim())) {
      util.showToast('身份证号格式不正确');
      return;
    }

    if (!phone.trim()) {
      util.showToast('请输入手机号');
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
      util.showToast('手机号格式不正确');
      return;
    }

    if (!agreeTerms) {
      util.showToast('请先阅读并同意服务协议');
      return;
    }

    this.setData({ loading: true });

    setTimeout(() => {
      const bindInfo = {
        cardNo: cardNo.trim(),
        studentId: studentId.trim(),
        studentName: studentName.trim(),
        phone: phone.trim(),
        bindTime: Date.now(),
        balance: mockData.CAMPUS_CARD_INFO.balance
      };

      storage.set(storage.STORAGE_KEYS.CAMPUS_CARD_BIND_INFO, bindInfo);

      this.setData({ loading: false });
      util.showSuccess('绑定成功');

      setTimeout(() => {
        util.navigateBack();
      }, 1500);
    }, 1500);
  },

  onViewTerms() {
    util.showToast('服务协议开发中');
  },

  onScanCard() {
    wx.scanCode({
      onlyFromCamera: false,
      success: (res) => {
        if (res.result) {
          this.setData({ cardNo: res.result });
        }
      },
      fail: () => {
        util.showToast('扫码失败，请手动输入');
      }
    });
  }
});
