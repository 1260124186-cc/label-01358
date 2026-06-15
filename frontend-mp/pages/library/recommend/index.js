const util = require('../../../utils/util');
const constants = require('../../../config/constants');
const dataService = require('../../../services/data');
const { mixPage } = require('../../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    darkMode: false,
    loading: true,
    submitting: false,
    userId: 'user_001',
    formData: {
      bookTitle: '',
      bookAuthor: '',
      isbn: '',
      publisher: '',
      category: '',
      reason: '',
      contact: ''
    },
    categories: [],
    categoryIndex: 0,
    categoryLabels: [],
    recommendList: [],
    reasonMaxLength: 500,
    reasonCount: 0
  },

  onLoad() {
    const currentUser = app.globalData.userInfo;
    const categories = constants.LIBRARY_BOOK_CATEGORIES.filter(c => c.value !== 'all');
    const categoryLabels = categories.map(c => `${c.icon} ${c.label}`);

    this.setData({
      userId: currentUser ? currentUser.id : 'user_001',
      darkMode: app.globalData.isDark || false,
      categories,
      categoryLabels,
      categoryIndex: categories.findIndex(c => c.value === 'other'),
      'formData.category': categories[categories.findIndex(c => c.value === 'other')]?.value || 'other'
    });

    this.loadRecommendList();
  },

  onShow() {
    if (!this.data.loading) {
      this.loadRecommendList();
    }
  },

  onPullDownRefresh() {
    this.loadRecommendList(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadRecommendList(callback) {
    this.setData({ loading: true });

    try {
      const list = dataService.getMyLibraryRecommends(this.data.userId);
      const processedList = list.map(item => ({
        ...item,
        categoryInfo: constants.LIBRARY_BOOK_CATEGORIES.find(c => c.value === item.category) || {},
        createTimeText: util.formatTime(item.createTime, 'YYYY-MM-DD HH:mm'),
        updateTimeText: item.updateTime ? util.formatTime(item.updateTime, 'YYYY-MM-DD HH:mm') : ''
      }));

      this.setData({
        recommendList: processedList,
        loading: false
      });

      if (callback) callback();
    } catch (error) {
      console.error('加载荐购记录失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
      if (callback) callback();
    }
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const value = e.detail.value;

    const updates = {
      [`formData.${field}`]: value
    };

    if (field === 'reason') {
      updates.reasonCount = value.length;
    }

    this.setData(updates);
  },

  onCategoryChange(e) {
    const index = parseInt(e.detail.value);
    const category = this.data.categories[index];
    this.setData({
      categoryIndex: index,
      'formData.category': category.value
    });
  },

  validateForm() {
    const { formData } = this.data;

    if (util.isEmpty(formData.bookTitle)) {
      util.showToast('请填写书名');
      return false;
    }

    if (util.isEmpty(formData.bookAuthor)) {
      util.showToast('请填写作者');
      return false;
    }

    if (util.isEmpty(formData.reason)) {
      util.showToast('请填写荐购理由');
      return false;
    }

    if (formData.reason.length < 10) {
      util.showToast('荐购理由不少于10个字');
      return false;
    }

    if (formData.contact && !/^1[3-9]\d{9}$/.test(formData.contact) && !formData.contact.includes('@')) {
      util.showToast('请填写有效的联系方式');
      return false;
    }

    return true;
  },

  async onSubmit() {
    if (this.data.submitting) return;

    if (!this.validateForm()) return;

    const confirm = await util.showConfirm(
      '确定提交荐购申请吗？提交后将进入审核流程。',
      '确认提交'
    );

    if (!confirm) return;

    try {
      this.setData({ submitting: true });
      util.showLoading('提交中...');

      const result = dataService.submitLibraryRecommend({
        userId: this.data.userId,
        ...this.data.formData
      });

      util.hideLoading();

      if (result.success) {
        await util.showSuccess('提交成功');
        this.resetForm();
        this.loadRecommendList();
      } else {
        util.showToast(result.message || '提交失败');
      }
    } catch (error) {
      console.error('提交荐购失败:', error);
      util.hideLoading();
      util.showToast('提交失败，请重试');
    } finally {
      this.setData({ submitting: false });
    }
  },

  resetForm() {
    this.setData({
      formData: {
        bookTitle: '',
        bookAuthor: '',
        isbn: '',
        publisher: '',
        category: this.data.categories[this.data.categoryIndex]?.value || 'other',
        reason: '',
        contact: ''
      },
      reasonCount: 0
    });
  }
});
