const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    referralList: [],
    searchKeyword: '',
    showPublishModal: false,
    publishForm: {
      company: '',
      position: '',
      code: '',
      description: '',
      expireDays: 30,
      contact: ''
    }
  },

  onLoad() {
    dataService.initJobRecruitmentData();
    this.loadData();
  },

  onShow() {
    dataService.initJobRecruitmentData();
    this.loadData();
  },

  loadData() {
    const filters = {
      keyword: this.data.searchKeyword
    };
    const list = dataService.getReferralCodeList(filters);

    const formattedList = list.map(item => {
      const statusItem = constants.REFERRAL_STATUS_MAP[item.status] || {};
      const daysLeft = item.expireTime ? Math.ceil((item.expireTime - Date.now()) / 86400000) : null;

      return {
        ...item,
        statusLabel: statusItem.label || '',
        statusColor: statusItem.color || '#6B7280',
        daysLeft,
        expireTimeText: item.expireTime ? util.formatTime(item.expireTime, 'YYYY-MM-DD') : '长期有效',
        publishTimeText: item.publishTime ? util.formatTime(item.publishTime, 'MM-DD') : '',
        companyInitial: item.company ? item.company.charAt(0) : 'N'
      };
    });

    this.setData({
      referralList: formattedList
    });
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearchConfirm() {
    this.loadData();
  },

  onClearSearch() {
    this.setData({ searchKeyword: '' });
    this.loadData();
  },

  onCopyCode(e) {
    const { code } = e.currentTarget.dataset;
    wx.setClipboardData({
      data: code,
      success: () => {
        wx.showToast({
          title: '内推码已复制',
          icon: 'success'
        });
      }
    });
  },

  onUseCode(e) {
    const { id, code } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '使用内推码',
      content: `确定使用内推码「${code}」吗？使用后可在投递时获得内推机会。`,
      success: (res) => {
        if (res.confirm) {
          dataService.useReferralCode(id);
          wx.setClipboardData({
            data: code,
            success: () => {
              wx.showToast({
                title: '内推码已复制',
                icon: 'success',
                duration: 2000
              });
            }
          });
        }
      }
    });
  },

  onShowPublish() {
    this.setData({ showPublishModal: true });
  },

  onClosePublish() {
    this.setData({ showPublishModal: false });
  },

  onPublishInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`publishForm.${field}`]: e.detail.value
    });
  },

  onExpireDaysSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ 'publishForm.expireDays': parseInt(value) });
  },

  validatePublishForm() {
    const { publishForm } = this.data;
    
    if (!publishForm.company.trim()) {
      wx.showToast({ title: '请输入公司名称', icon: 'none' });
      return false;
    }
    if (!publishForm.position.trim()) {
      wx.showToast({ title: '请输入职位名称', icon: 'none' });
      return false;
    }
    if (!publishForm.code.trim()) {
      wx.showToast({ title: '请输入内推码', icon: 'none' });
      return false;
    }
    
    return true;
  },

  onSubmitPublish() {
    if (!this.validatePublishForm()) return;

    const { publishForm } = this.data;
    const expireTime = publishForm.expireDays > 0 
      ? Date.now() + publishForm.expireDays * 86400000 
      : null;

    const storage = require('../../../utils/storage');
    const referralList = storage.getList(storage.STORAGE_KEYS.REFERRAL_CODE_LIST);
    const newCode = {
      id: 'ref_' + Date.now(),
      company: publishForm.company,
      position: publishForm.position,
      code: publishForm.code,
      description: publishForm.description,
      expireTime,
      contact: publishForm.contact,
      publisherId: 'user_current',
      publisherName: '我',
      publisherType: 'alumni',
      status: 'active',
      usageCount: 0,
      publishTime: Date.now()
    };

    referralList.unshift(newCode);
    storage.set(storage.STORAGE_KEYS.REFERRAL_CODE_LIST, referralList);

    wx.showToast({
      title: '发布成功',
      icon: 'success',
      duration: 2000
    });

    this.setData({
      showPublishModal: false,
      publishForm: {
        company: '',
        position: '',
        code: '',
        description: '',
        expireDays: 30,
        contact: ''
      }
    });

    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  }
});
