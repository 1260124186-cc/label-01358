const mockData = require('../../config/mock-data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    detail: null,
    relatedNews: [],
    allImages: []
  },

  onLoad(options) {
    if (options.id) {
      this.loadDetail(options.id);
    }
  },

  loadDetail(id) {
    const detail = mockData.CAMPUS_NEWS.find(item => item.id === id);

    if (detail) {
      const categoryInfo = constants.NEWS_CATEGORY_MAP[detail.category];
      const allImages = detail.images || [detail.image];

      const relatedNews = mockData.CAMPUS_NEWS
        .filter(item => item.id !== id)
        .filter(item => item.category === detail.category)
        .sort((a, b) => b.createTime - a.createTime)
        .slice(0, 3)
        .map(item => ({
          ...item,
          timeText: util.relativeTime(item.createTime),
          image: item.image || '/assets/images/default-news.png',
          categoryInfo: constants.NEWS_CATEGORY_MAP[item.category]
        }));

      if (relatedNews.length < 3) {
        const otherNews = mockData.CAMPUS_NEWS
          .filter(item => item.id !== id && item.category !== detail.category)
          .sort((a, b) => b.createTime - a.createTime)
          .slice(0, 3 - relatedNews.length)
          .map(item => ({
            ...item,
            timeText: util.relativeTime(item.createTime),
            image: item.image || '/assets/images/default-news.png',
            categoryInfo: constants.NEWS_CATEGORY_MAP[item.category]
          }));
        relatedNews.push(...otherNews);
      }

      this.setData({
        detail: {
          ...detail,
          timeText: util.formatTime(detail.createTime, 'YYYY-MM-DD HH:mm'),
          relativeTimeText: util.relativeTime(detail.createTime),
          image: detail.image || '/assets/images/default-news.png',
          categoryInfo
        },
        relatedNews,
        allImages
      });

      wx.setNavigationBarTitle({
        title: detail.title.substring(0, 10) + (detail.title.length > 10 ? '...' : '')
      });
    }
  },

  onPreviewImage(e) {
    const { src } = e.currentTarget.dataset;
    const { allImages } = this.data;
    wx.previewImage({
      current: src,
      urls: allImages
    });
  },

  onRelatedNewsTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/news-detail/index?id=${id}`);
  },

  onShareAppMessage() {
    const { detail } = this.data;
    if (detail) {
      return {
        title: detail.title,
        path: `/pages/news-detail/index?id=${detail.id}`
      };
    }
    return {
      title: '校园动态',
      path: '/pages/news-list/index'
    };
  }
});
