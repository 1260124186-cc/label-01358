const util = require('../../utils/util');
const dataService = require('../../services/data');
const { mixPage } = require('../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    loading: true,
    articleId: '',
    article: null,
    relatedArticles: [],
    crisisHotlines: [],
    primaryHotline: null,
    contentParagraphs: []
  },

  onLoad(options) {
    const { id } = options;
    this.setData({ articleId: id });
    this.loadCrisisHotlines();
    this.loadArticleDetail();
  },

  onShareAppMessage() {
    const article = this.data.article;
    return {
      title: article ? article.title : '心理科普文章',
      path: `/pages/psychological-counseling/article-detail?id=${this.data.articleId}`
    };
  },

  onShareTimeline() {
    const article = this.data.article;
    return {
      title: article ? article.title : '心理科普文章'
    };
  },

  parseContent(content) {
    if (!content) return [];
    const lines = content.split('\n');
    const paragraphs = [];
    let currentParagraph = null;

    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        if (currentParagraph) {
          paragraphs.push(currentParagraph);
          currentParagraph = null;
        }
        return;
      }

      if (trimmedLine.startsWith('## ')) {
        if (currentParagraph) {
          paragraphs.push(currentParagraph);
          currentParagraph = null;
        }
        paragraphs.push({
          type: 'h2',
          text: trimmedLine.substring(3)
        });
      } else if (trimmedLine.startsWith('### ')) {
        if (currentParagraph) {
          paragraphs.push(currentParagraph);
          currentParagraph = null;
        }
        paragraphs.push({
          type: 'h3',
          text: trimmedLine.substring(4)
        });
      } else if (trimmedLine.startsWith('- ')) {
        if (currentParagraph && currentParagraph.type !== 'list') {
          paragraphs.push(currentParagraph);
          currentParagraph = null;
        }
        if (!currentParagraph) {
          currentParagraph = { type: 'list', items: [] };
        }
        currentParagraph.items.push(trimmedLine.substring(2));
      } else {
        if (currentParagraph && currentParagraph.type !== 'text') {
          paragraphs.push(currentParagraph);
          currentParagraph = null;
        }
        if (!currentParagraph) {
          currentParagraph = { type: 'text', text: '' };
        }
        currentParagraph.text += (currentParagraph.text ? '\n' : '') + trimmedLine;
      }
    });

    if (currentParagraph) {
      paragraphs.push(currentParagraph);
    }

    return paragraphs;
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

  loadArticleDetail() {
    this.setData({ loading: true });

    try {
      const article = dataService.getPsychologicalArticleDetail(this.data.articleId);

      if (!article) {
        util.showToast('文章不存在');
        setTimeout(() => wx.navigateBack(), 1500);
        return;
      }

      dataService.increasePsychologicalArticleViews(this.data.articleId);
      article.views = (article.views || 0) + 1;
      article.publishTimeText = util.formatTime(article.createTime, 'YYYY-MM-DD');

      const contentParagraphs = this.parseContent(article.content);

      const relatedList = dataService.getPsychologicalArticleList({
        category: article.category
      }).filter(item => item.id !== article.id).slice(0, 3);

      wx.setNavigationBarTitle({
        title: article.title
      });

      this.setData({
        article,
        contentParagraphs,
        relatedArticles: relatedList,
        loading: false
      });
    } catch (error) {
      console.error('加载文章详情失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  onCallHotlineTap() {
    const hotline = this.data.primaryHotline;
    if (!hotline || !hotline.phone) {
      util.showToast('暂无热线电话');
      return;
    }
    dataService.callCrisisHotline(hotline.phone);
  },

  onRelatedArticleTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.redirectTo({
      url: `/pages/psychological-counseling/article-detail?id=${id}`
    });
  },

  onBackToList() {
    wx.navigateBack({
      fail: () => {
        wx.redirectTo({
          url: '/pages/psychological-counseling/index'
        });
      }
    });
  },

  onShareTap() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    util.showToast('请点击右上角分享');
  }
});
