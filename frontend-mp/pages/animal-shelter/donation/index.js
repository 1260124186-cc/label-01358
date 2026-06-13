const mockData = require('../../../config/mock-data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

let pageOptions = {
  data: {
    darkMode: false,
    showSkeleton: true,
    currentTab: 'money',
    donationItems: [],
    moneyItems: [],
    supplyItems: [],
    donationRecords: [],
    usageList: [],
    stats: null,
    amountInput: '',
    customAmount: 0,
    showDonateSheet: false,
    selectedItem: null,
    submitting: false,
    showSuccess: false
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.setData({ darkMode: util.isDarkMode() });
  },

  onRefresh() {
    this.loadData();
  },

  loadData() {
    this.setData({ showSkeleton: true });

    setTimeout(() => {
      const donationItems = mockData.SHELTER_DONATION_ITEMS;
      const moneyItems = donationItems.filter(item => item.type === 'money');
      const supplyItems = donationItems.filter(item => item.type === 'supplies');
      const donationRecords = mockData.SHELTER_DONATION_RECORDS
        .slice(0, 10)
        .map(item => ({
          ...item,
          timeText: util.relativeTime(item.createTime),
          amountText: item.amount ? `¥${item.amount}` : `¥${item.totalAmount}`
        }));
      const usageList = mockData.SHELTER_DONATION_USAGE
        .slice(0, 5)
        .map(item => ({
          ...item,
          amountText: `¥${item.amount}`,
          dateText: util.formatTime(item.date, 'YYYY-MM-DD')
        }));

      const totalAmount = donationRecords.reduce((sum, item) => sum + (item.amount || item.totalAmount || 0), 0);
      const stats = {
        totalDonors: 1256,
        totalAmount,
        thisMonthAmount: mockData.SHELTER_STATS.donationsThisMonth
      };

      this.setData({
        donationItems,
        moneyItems,
        supplyItems,
        donationRecords,
        usageList,
        stats,
        showSkeleton: false
      });

      wx.stopPullDownRefresh();
    }, 600);
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
  },

  onAmountTap(e) {
    const { amount } = e.currentTarget.dataset;
    this.setData({
      customAmount: amount,
      amountInput: amount.toString()
    });
  },

  onAmountInput(e) {
    const { value } = e.detail;
    const amount = parseFloat(value) || 0;
    this.setData({
      amountInput: value,
      customAmount: amount
    });
  },

  onDonateTap(e) {
    const { item } = e.currentTarget.dataset;
    this.setData({
      selectedItem: item,
      showDonateSheet: true,
      customAmount: item.amount || 0,
      amountInput: item.amount ? item.amount.toString() : ''
    });
  },

  onSupplyDonateTap(e) {
    const { item } = e.currentTarget.dataset;
    wx.showModal({
      title: '物资捐赠',
      content: `您选择捐赠：${item.name}\n\n请将物资寄送至以下地址：\n北京市朝阳区XX路XX号 流浪动物救助站\n收件人：志愿者 138XXXX1234\n\n或联系我们安排上门取件。`,
      confirmText: '联系我们',
      cancelText: '我知道了',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({ phoneNumber: '13800138000' });
        }
      }
    });
  },

  onSheetClose() {
    this.setData({ showDonateSheet: false });
  },

  onProtocolTap() {
    wx.showModal({
      title: '捐赠说明',
      content: '1. 所有捐款将100%用于流浪动物救助，包括医疗、粮食、用品等。\n\n2. 捐赠后可在"捐赠记录"中查看所有捐赠的使用明细。\n\n3. 如需开具捐赠收据，请联系我们并提供捐赠凭证。\n\n4. 物资捐赠后可获得爱心积分，可用于兑换周边产品。\n\n5. 感谢您的爱心，每一份捐助都将帮助到需要帮助的毛孩子！',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  validateDonation() {
    const { customAmount, currentTab } = this.data;
    if (currentTab === 'money') {
      if (customAmount <= 0) {
        wx.showToast({ title: '请输入捐赠金额', icon: 'none' });
        return false;
      }
      if (customAmount < 1) {
        wx.showToast({ title: '最低捐赠金额为1元', icon: 'none' });
        return false;
      }
    }
    return true;
  },

  onConfirmDonate() {
    if (!this.validateDonation()) return;
    if (this.data.submitting) return;

    this.setData({ submitting: true });

    setTimeout(() => {
      this.setData({
        submitting: false,
        showDonateSheet: false,
        showSuccess: true,
        customAmount: 0,
        amountInput: ''
      });
    }, 1500);
  },

  onSuccessClose() {
    this.setData({ showSuccess: false });
  },

  onCopyAddress() {
    const address = '北京市朝阳区XX路XX号 流浪动物救助站';
    wx.setClipboardData({
      data: address,
      success: () => {
        wx.showToast({ title: '地址已复制', icon: 'success' });
      }
    });
  },

  onCallPhone() {
    wx.makePhoneCall({ phoneNumber: '13800138000' });
  },

  catchNoop() {}
};

mixPage(pageOptions);
