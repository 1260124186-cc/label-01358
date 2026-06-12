const dataService = require('../../services/data');
const matcherService = require('../../services/lostFoundMatcher');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    lostId: '',
    foundId: '',
    lostItem: null,
    foundItem: null,
    matchResult: null,
    comparison: null,
    loading: true,
    lostImageIndex: 0,
    foundImageIndex: 0
  },

  onLoad(options) {
    if (options.lostId && options.foundId) {
      this.setData({
        lostId: options.lostId,
        foundId: options.foundId
      });
      this.loadComparison();
    }
  },

  onShow() {
    if (this.data.lostId && this.data.foundId) {
      this.loadComparison();
    }
  },

  async loadComparison() {
    this.setData({ loading: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const lostItem = dataService.getLostFoundDetail(this.data.lostId);
      const foundItem = dataService.getLostFoundDetail(this.data.foundId);

      if (!lostItem || !foundItem) {
        util.showError('物品信息不存在');
        this.setData({ loading: false });
        return;
      }

      const matchResult = matcherService.calculateMatchScore(lostItem, foundItem);
      const comparison = matcherService.generateMatchComparison(lostItem, foundItem, matchResult);

      const formattedLost = {
        ...lostItem,
        timeText: util.relativeTime(lostItem.createTime),
        itemTypeText: constants.getLabelByValue(constants.ITEM_TYPES, lostItem.itemType),
        locationText: constants.getLabelByValue(constants.LOCATIONS, lostItem.location) || lostItem.location,
        colorTags: (lostItem.aiTags?.colors || []).map(c => ({
          ...c,
          confidenceText: Math.round(c.confidence * 100) + '%'
        })),
        brandTags: (lostItem.aiTags?.brands || []).map(b => ({
          ...b,
          confidenceText: Math.round(b.confidence * 100) + '%'
        })),
        categoryTag: lostItem.aiTags?.category ? {
          ...lostItem.aiTags.category,
          confidenceText: Math.round(lostItem.aiTags.category.confidence * 100) + '%'
        } : null
      };

      const formattedFound = {
        ...foundItem,
        timeText: util.relativeTime(foundItem.createTime),
        itemTypeText: constants.getLabelByValue(constants.ITEM_TYPES, foundItem.itemType),
        locationText: constants.getLabelByValue(constants.LOCATIONS, foundItem.location) || foundItem.location,
        colorTags: (foundItem.aiTags?.colors || []).map(c => ({
          ...c,
          confidenceText: Math.round(c.confidence * 100) + '%'
        })),
        brandTags: (foundItem.aiTags?.brands || []).map(b => ({
          ...b,
          confidenceText: Math.round(b.confidence * 100) + '%'
        })),
        categoryTag: foundItem.aiTags?.category ? {
          ...foundItem.aiTags.category,
          confidenceText: Math.round(foundItem.aiTags.category.confidence * 100) + '%'
        } : null
      };

      const scorePercentage = matchResult.score;
      const scoreDetails = Object.entries(matchResult.details).map(([key, value]) => ({
        key,
        label: this.getFieldLabel(key),
        score: Math.round(value.score * 100),
        weight: Math.round(value.weight * 100),
        percentage: Math.round((value.score / value.weight) * 100)
      }));

      this.setData({
        lostItem: formattedLost,
        foundItem: formattedFound,
        matchResult: {
          ...matchResult,
          levelInfo: matcherService.getMatchLevelInfo(matchResult.matchLevel),
          scorePercentage,
          scoreDetails
        },
        comparison,
        loading: false
      });
    } catch (e) {
      util.showError('加载对比数据失败');
      this.setData({ loading: false });
    }
  },

  getFieldLabel(key) {
    const labels = {
      type: '类型匹配',
      itemType: '物品类型',
      colors: '颜色特征',
      brands: '品牌特征',
      location: '地点匹配',
      date: '日期接近'
    };
    return labels[key] || key;
  },

  onPreviewLostImage(e) {
    const { index } = e.currentTarget.dataset;
    const urls = this.data.lostItem.images || [];
    if (urls.length > 0) {
      const fileUtil = require('../../utils/file');
      fileUtil.previewImage(urls, urls[index]);
    }
  },

  onPreviewFoundImage(e) {
    const { index } = e.currentTarget.dataset;
    const urls = this.data.foundItem.images || [];
    if (urls.length > 0) {
      const fileUtil = require('../../utils/file');
      fileUtil.previewImage(urls, urls[index]);
    }
  },

  onChangeLostImage(e) {
    const { current } = e.detail;
    this.setData({ lostImageIndex: current });
  },

  onChangeFoundImage(e) {
    const { current } = e.detail;
    this.setData({ foundImageIndex: current });
  },

  onCallLostOwner() {
    if (!util.checkLogin()) {
      return;
    }
    const { lostItem } = this.data;
    if (lostItem && lostItem.phone) {
      wx.makePhoneCall({
        phoneNumber: lostItem.phone,
        fail: () => {}
      });
    }
  },

  onCallFoundOwner() {
    if (!util.checkLogin()) {
      return;
    }
    const { foundItem } = this.data;
    if (foundItem && foundItem.phone) {
      wx.makePhoneCall({
        phoneNumber: foundItem.phone,
        fail: () => {}
      });
    }
  },

  onViewLostDetail() {
    const { lostId } = this.data;
    util.navigateTo(`/pages/lost-found-detail/index?id=${lostId}`);
  },

  onViewFoundDetail() {
    const { foundId } = this.data;
    util.navigateTo(`/pages/lost-found-detail/index?id=${foundId}`);
  },

  onBackToMatch() {
    util.navigateTo('/pages/lost-found-match/index');
  },

  onShareAppMessage() {
    const { matchResult, lostItem, foundItem } = this.data;
    if (matchResult && lostItem && foundItem) {
      return {
        title: `【匹配度${matchResult.score}分】${lostItem.title} vs ${foundItem.title}`,
        path: `/pages/lost-found-compare/index?lostId=${lostItem.id}&foundId=${foundItem.id}`,
        imageUrl: lostItem.images && lostItem.images[0] ? lostItem.images[0] : ''
      };
    }
    return {
      title: '失物招领对比',
      path: '/pages/lost-found-match/index'
    };
  }
});
