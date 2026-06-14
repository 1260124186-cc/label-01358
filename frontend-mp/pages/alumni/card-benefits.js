const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    darkMode: false,
    loading: true,
    userId: '',
    alumniInfo: null,
    cardNumber: '',
    validDate: '',
    categories: constants.ALUMNI_CARD_BENEFIT_CATEGORIES,
    activeCategory: 'all',
    allBenefits: [],
    filteredBenefits: [],
    expandedBenefitId: ''
  },

  onLoad() {
    const currentUser = app.globalData.userInfo;
    this.setData({
      userId: currentUser ? currentUser.id : ''
    });
    this.loadData();
  },

  onShow() {
    if (!this.data.loading) {
      this.loadData();
    }
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData() {
    this.setData({ loading: true });
    dataService.initAllAlumniData();
    this.loadAlumniInfo();
    this.loadBenefits();
    setTimeout(() => {
      this.setData({ loading: false });
    }, 500);
  },

  loadAlumniInfo() {
    const verifyInfo = dataService.getAlumniVerifyInfo(this.data.userId);
    let alumniInfo = null;
    let cardNumber = '';
    let validDate = '';

    if (verifyInfo && verifyInfo.status === 'approved') {
      alumniInfo = verifyInfo;
      cardNumber = this.generateCardNumber(verifyInfo.studentId || this.data.userId);
      validDate = this.calculateValidDate();
    }

    this.setData({
      alumniInfo,
      cardNumber,
      validDate
    });
  },

  generateCardNumber(studentId) {
    const prefix = 'XYK';
    const year = new Date().getFullYear();
    const id = studentId || '000000';
    return `${prefix}${year}${id.slice(-6)}`;
  },

  calculateValidDate() {
    const now = new Date();
    const year = now.getFullYear() + 5;
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  loadBenefits() {
    const benefits = dataService.getAlumniCardBenefits().map(item => ({
      ...item,
      categoryInfo: constants.ALUMNI_CARD_BENEFIT_CATEGORIES.find(c => c.value === item.category)
    }));

    this.setData({
      allBenefits: benefits,
      filteredBenefits: benefits
    }, () => {
      this.filterBenefits();
    });
  },

  onCategoryTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      activeCategory: value
    }, () => {
      this.filterBenefits();
    });
  },

  filterBenefits() {
    const { activeCategory, allBenefits } = this.data;
    let filteredBenefits = allBenefits;

    if (activeCategory !== 'all') {
      filteredBenefits = allBenefits.filter(b => b.category === activeCategory);
    }

    this.setData({ filteredBenefits });
  },

  onBenefitTap(e) {
    const { id } = e.currentTarget.dataset;
    const currentExpanded = this.data.expandedBenefitId;
    this.setData({
      expandedBenefitId: currentExpanded === id ? '' : id
    });
  },

  stopPropagation() {}
});
