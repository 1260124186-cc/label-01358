const mockData = require('../../config/mock-data');
const util = require('../../utils/util');
const storage = require('../../utils/storage');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    isBound: false,
    cardInfo: null,
    recentTransactions: [],
    quickActions: [
      { id: 'recharge', name: '充值', icon: '💰', bgColor: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)' },
      { id: 'transactions', name: '消费流水', icon: '📋', bgColor: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)' },
      { id: 'analysis', name: '消费分析', icon: '📊', bgColor: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)' },
      { id: 'rechargeMap', name: '充值点', icon: '📍', bgColor: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' },
      { id: 'reportLoss', name: '挂失', icon: '🔒', bgColor: 'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)' },
      { id: 'unbind', name: '解绑', icon: '❌', bgColor: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)' }
    ]
  },

  onLoad() {
    this.loadCardInfo();
  },

  onShow() {
    this.loadCardInfo();
  },

  onPullDownRefresh() {
    this.loadCardInfo().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadCardInfo() {
    return new Promise((resolve) => {
      const boundInfo = storage.get(storage.STORAGE_KEYS.CAMPUS_CARD_BIND_INFO);
      const isBound = !!boundInfo;
      const cardInfo = isBound ? { ...mockData.CAMPUS_CARD_INFO, ...boundInfo } : null;

      const allTransactions = mockData.CAMPUS_CARD_TRANSACTIONS;
      const recentTransactions = allTransactions
        .filter(t => t.type === 'consume')
        .slice(0, 5)
        .map(t => ({
          ...t,
          amountText: t.type === 'recharge' ? `+${t.amount.toFixed(2)}` : `-${t.amount.toFixed(2)}`,
          timeText: util.relativeTime(t.createTime)
        }));

      this.setData({
        isBound,
        cardInfo,
        recentTransactions
      });

      resolve();
    });
  },

  onBindCard() {
    util.navigateTo('/pages/campus-card/bind');
  },

  onQuickAction(e) {
    const { id } = e.currentTarget.dataset;

    if (!this.data.isBound && id !== 'recharge') {
      util.showToast('请先绑定校园卡');
      setTimeout(() => {
        util.navigateTo('/pages/campus-card/bind');
      }, 1000);
      return;
    }

    switch (id) {
      case 'recharge':
        this.showRechargeOptions();
        break;
      case 'transactions':
        util.navigateTo('/pages/campus-card/transactions');
        break;
      case 'analysis':
        util.navigateTo('/pages/campus-card/analysis');
        break;
      case 'rechargeMap':
        util.navigateTo('/pages/campus-card/recharge-map');
        break;
      case 'reportLoss':
        this.handleReportLoss();
        break;
      case 'unbind':
        this.handleUnbind();
        break;
    }
  },

  showRechargeOptions() {
    wx.showActionSheet({
      itemList: ['微信充值', '支付宝充值', '前往充值点'],
      success: (res) => {
        if (res.tapIndex === 0 || res.tapIndex === 1) {
          this.showRechargeAmount(res.tapIndex === 0 ? '微信' : '支付宝');
        } else if (res.tapIndex === 2) {
          util.navigateTo('/pages/campus-card/recharge-map');
        }
      }
    });
  },

  showRechargeAmount(channel) {
    wx.showActionSheet({
      itemList: ['充值 50 元', '充值 100 元', '充值 200 元', '充值 500 元'],
      success: (res) => {
        const amounts = [50, 100, 200, 500];
        const amount = amounts[res.tapIndex];
        util.showSuccess(`${channel}充值 ${amount} 元成功`);
      }
    });
  },

  handleReportLoss() {
    wx.showModal({
      title: '校园卡挂失',
      content: '挂失后卡片将无法使用，请确认是否挂失？挂失成功后请拨打后勤电话办理补卡。',
      confirmText: '确认挂失',
      confirmColor: '#FF6B6B',
      success: (res) => {
        if (res.confirm) {
          this.callLogisticsPhone();
        }
      }
    });
  },

  callLogisticsPhone() {
    wx.makePhoneCall({
      phoneNumber: mockData.LOGISTICS_DEPARTMENT_PHONE,
      fail: () => {
        util.showToast('拨号失败，请手动拨打：' + mockData.LOGISTICS_DEPARTMENT_PHONE);
      }
    });
  },

  handleUnbind() {
    wx.showModal({
      title: '解绑校园卡',
      content: '确认要解绑当前校园卡吗？解绑后消费记录将不会删除。',
      confirmText: '确认解绑',
      confirmColor: '#FF6B6B',
      success: (res) => {
        if (res.confirm) {
          storage.remove(storage.STORAGE_KEYS.CAMPUS_CARD_BIND_INFO);
          this.loadCardInfo();
          util.showSuccess('已解绑');
        }
      }
    });
  },

  onViewAllTransactions() {
    util.navigateTo('/pages/campus-card/transactions');
  },

  onCallService() {
    this.callLogisticsPhone();
  }
});
