const util = require('../../utils/util');
const constants = require('../../config/constants');
const sosService = require('../../services/sosService');

const CATEGORY_COLORS = {
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
    article: null,
    articleContent: [],
    loading: true,
    articleId: ''
  },

  onLoad(options) {
    const { id } = options;
    this.setData({ articleId: id });
    this.loadPage();
  },

  onShow() {
    if (this.data.articleId) {
      this.loadPage();
    }
  },

  loadPage() {
    const app = getApp();
    const { isDark } = app.globalData;
    
    const article = sosService.getSafetyArticleById(this.data.articleId);
    
    if (article) {
      const category = constants.SAFETY_CATEGORIES.find(c => c.value === article.category);
      const colors = CATEGORY_COLORS[article.category] || { bg: '#F3F4F6', color: '#6B7280' };
      
      const articleWithMeta = {
        ...article,
        categoryLabel: category ? category.label : '其他',
        categoryBg: colors.bg,
        categoryColor: colors.color,
        timeText: util.formatTime(article.createTime)
      };
      
      const articleContent = this.parseContent(article.content);
      
      this.setData({
        darkMode: isDark || false,
        article: articleWithMeta,
        articleContent,
        loading: false
      });
      
      wx.setNavigationBarTitle({
        title: article.title
      });
    } else {
      this.setData({
        darkMode: isDark || false,
        loading: false
      });
    }
  },

  parseContent(content) {
    if (!content) return [];
    
    const lines = content.split('\n');
    const result = [];
    let currentList = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        if (currentList) {
          result.push(currentList);
          currentList = null;
        }
        continue;
      }
      
      const listMatch = line.match(/^(\d+)[\.、]\s*(.+)/);
      if (listMatch) {
        if (!currentList) {
          currentList = { type: 'list', items: [] };
        }
        currentList.items.push(line);
        continue;
      }
      
      const bulletMatch = line.match(/^[•\-]\s*(.+)/);
      if (bulletMatch) {
        if (!currentList) {
          currentList = { type: 'list', items: [] };
        }
        currentList.items.push(bulletMatch[1]);
        continue;
      }
      
      if (currentList) {
        result.push(currentList);
        currentList = null;
      }
      
      if (/^[一二三四五六七八九十]+[、\.]/.test(line) || /^[A-Z][\.)]/.test(line)) {
        result.push({ type: 'title', text: line });
      } else {
        result.push({ type: 'text', text: line });
      }
    }
    
    if (currentList) {
      result.push(currentList);
    }
    
    return result;
  },

  onSOS() {
    util.navigateTo('/pages/index/index');
  },

  onShare() {
    util.showToast('分享功能开发中');
  },

  onShareAppMessage() {
    const { article } = this.data;
    return {
      title: article ? article.title : '安全科普',
      path: `/pages/safety-education-detail/index?id=${this.data.articleId}`
    };
  }
});
