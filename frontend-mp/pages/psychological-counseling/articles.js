const util = require('../../utils/util');
const constants = require('../../config/constants');
const dataService = require('../../services/data');
const { mixPage } = require('../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    loading: true,
    searchKeyword: '',
    currentCategory: 'all',
    categories: constants.PSYCHOLOGICAL_ARTICLE_CATEGORIES,
    articles: [],
    crisisHotlines: [],
    primaryHotline: null
  },

  onLoad() {
    this.loadCrisisHotlines();
    this.loadArticles();
  },

  onShow() {
    if (!this.data.loading) {
      this.loadArticles();
    }
  },

  onPullDownRefresh() {
    this.loadArticles();
    wx.stopPullDownRefresh();
  },

  loadCrisisHotlines() {
    try {
      const hotlines = dataService.getPsychologicalCrisisHotlines();
      const primary = hotlines.find(h => h.isPrimary) || hotlines[0] || null;
      this.setData({
        crisisHotlines: hotlines,
        primaryHotline: primary
      });
    } catch (error) {
      console.error('加载危机热线失败:', error);
    }
  },

  loadArticles() {
    this.setData({ loading: true });

    try {
      const filters = {
        category: this.data.currentCategory,
        keyword: this.data.searchKeyword
      };

      const rawArticles = dataService.getPsychologicalArticleList(filters);
      const articles = rawArticles.map(article => ({
        ...article,
        timeText: util.formatTime(article.createTime, 'YYYY-MM-DD')
      })).sort((a, b) => b.createTime - a.createTime);

      this.setData({
        articles,
        loading: false
      });
    } catch (error) {
      console.error('加载文章列表失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value }, () => {
      this.loadArticles();
    });
  },

  onSearchClear() {
    this.setData({ searchKeyword: '' }, () => {
      this.loadArticles();
    });
  },

  onCategoryTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentCategory: value }, () => {
      this.loadArticles();
    });
  },

  onArticleTap(e) {
    const { id } = e.currentTarget.dataset;
    dataService.increasePsychologicalArticleViews(id);
    util.navigateTo(`/pages/psychological-counseling/article-detail?id=${id}`);
  },

  onCallHotlineTap() {
    const hotline = this.data.primaryHotline;
    if (!hotline || !hotline.phone) {
      util.showToast('暂无热线电话');
      return;
    }
    dataService.callCrisisHotline(hotline.phone);
  }
});
