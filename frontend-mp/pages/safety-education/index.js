const util = require('../../utils/util');
const constants = require('../../config/constants');
const sosService = require('../../services/sosService');

const CATEGORY_COLORS = {
  all: { bg: '#F3F4F6', color: '#6B7280' },
  campus: { bg: '#DBEAFE', color: '#3B82F6' },
  traffic: { bg: '#D1FAE5', color: '#10B981' },
  fire: { bg: '#FEE2E2', color: '#EF4444' },
  anti_fraud: { bg: '#EDE9FE', color: '#8B5CF6' },
  mental: { bg: '#D1FAE5', color: '#10B981' },
  emergency: { bg: '#FEF3C7', color: '#F59E0B' }
};

Page({
  data: {
    darkMode: false,
    categories: constants.SAFETY_CATEGORIES,
    currentCategory: 'all',
    articles: []
  },

  onLoad() {
    this.loadPage();
  },

  onShow() {
    this.loadPage();
  },

  loadPage() {
    const app = getApp();
    const { isDark } = app.globalData;
    
    this.setData({
      darkMode: isDark || false
    });
    
    this.loadArticles();
  },

  loadArticles() {
    const { currentCategory } = this.data;
    const articles = sosService.getSafetyArticles(currentCategory).map(article => {
      const category = constants.SAFETY_CATEGORIES.find(c => c.value === article.category);
      const colors = CATEGORY_COLORS[article.category] || CATEGORY_COLORS.all;
      
      return {
        ...article,
        categoryLabel: category ? category.label : '其他',
        categoryBg: colors.bg,
        categoryColor: colors.color,
        timeText: util.formatTime(article.createTime)
      };
    }).sort((a, b) => b.createTime - a.createTime);
    
    this.setData({ articles });
  },

  onCategoryTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentCategory: value }, () => {
      this.loadArticles();
    });
  },

  onArticleTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/safety-education-detail/index?id=${id}`);
  }
});
