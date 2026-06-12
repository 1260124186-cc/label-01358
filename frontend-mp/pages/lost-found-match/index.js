const dataService = require('../../services/data');
const matcherService = require('../../services/lostFoundMatcher');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    activeTab: 'all',
    allMatches: [],
    excellentMatches: [],
    highMatches: [],
    mediumMatches: [],
    lowMatches: [],
    loading: true,
    statistics: null,
    minScore: 30,
    sortBy: 'score',
    showFilter: false,
    selectedMatch: null,
    currentMatches: [],
    total: 0,
    matchesWithLevel: []
  },

  onLoad() {
    this.loadMatches();
  },

  onShow() {
    this.loadMatches();
  },

  onPullDownRefresh() {
    this.loadMatches(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadMatches(callback) {
    this.setData({ loading: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const result = matcherService.findLostFoundMatches({
        minScore: this.data.minScore,
        limit: 50
      });

      const matchesWithLevel = result.matches.map(match => ({
        ...match,
        levelInfo: matcherService.getMatchLevelInfo(match.matchLevel)
      }));

      const excellentWithLevel = result.grouped.excellent.map(match => ({
        ...match,
        levelInfo: matcherService.getMatchLevelInfo(match.matchLevel)
      }));

      const highWithLevel = result.grouped.high.map(match => ({
        ...match,
        levelInfo: matcherService.getMatchLevelInfo(match.matchLevel)
      }));

      const mediumWithLevel = result.grouped.medium.map(match => ({
        ...match,
        levelInfo: matcherService.getMatchLevelInfo(match.matchLevel)
      }));

      const lowWithLevel = result.grouped.low.map(match => ({
        ...match,
        levelInfo: matcherService.getMatchLevelInfo(match.matchLevel)
      }));

      this.setData({
        allMatches: matchesWithLevel,
        excellentMatches: excellentWithLevel,
        highMatches: highWithLevel,
        mediumMatches: mediumWithLevel,
        lowMatches: lowWithLevel,
        statistics: result.statistics,
        total: result.total,
        loading: false
      });

      this.updateCurrentMatches();
    } catch (e) {
      util.showError('加载匹配数据失败');
      this.setData({ loading: false });
    }

    if (callback) callback();
  },

  updateCurrentMatches() {
    const { activeTab, allMatches, excellentMatches, highMatches, mediumMatches, lowMatches } = this.data;
    let currentMatches = [];
    switch (activeTab) {
      case 'excellent':
        currentMatches = excellentMatches;
        break;
      case 'high':
        currentMatches = highMatches;
        break;
      case 'medium':
        currentMatches = mediumMatches;
        break;
      case 'low':
        currentMatches = lowMatches;
        break;
      default:
        currentMatches = allMatches;
    }
    this.setData({ currentMatches });
  },

  onTabChange(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({ activeTab: tab });
    this.updateCurrentMatches();
  },

  onSortChange(e) {
    const { sort } = e.currentTarget.dataset;
    this.setData({ sortBy: sort });
    this.sortMatches();
  },

  sortMatches() {
    const { sortBy, allMatches } = this.data;
    let sorted = [...allMatches];

    if (sortBy === 'score') {
      sorted.sort((a, b) => b.score - a.score);
    } else if (sortBy === 'date') {
      sorted.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortBy === 'type') {
      const levelOrder = { excellent: 0, high: 1, medium: 2, low: 3 };
      sorted.sort((a, b) => levelOrder[a.matchLevel] - levelOrder[b.matchLevel]);
    }

    this.setData({ allMatches: sorted });
    this.updateCurrentMatches();
  },

  onFilterScore(e) {
    const { score } = e.currentTarget.dataset;
    this.setData({ minScore: parseInt(score), showFilter: false });
    this.loadMatches();
  },

  onToggleFilter() {
    this.setData({ showFilter: !this.data.showFilter });
  },

  onViewMatchDetail(e) {
    const { match } = e.currentTarget.dataset;
    if (match && match.lostItem && match.foundItem) {
      util.navigateTo(`/pages/lost-found-compare/index?lostId=${match.lostItem.id}&foundId=${match.foundItem.id}`);
    }
  },

  onViewLostItem(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/lost-found-detail/index?id=${id}`);
  },

  onViewFoundItem(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/lost-found-detail/index?id=${id}`);
  },

  onCompareItems(e) {
    const { lostId, foundId } = e.currentTarget.dataset;
    util.navigateTo(`/pages/lost-found-compare/index?lostId=${lostId}&foundId=${foundId}`);
  },

  onContactLostOwner(e) {
    const { match } = e.currentTarget.dataset;
    if (match && match.lostItem && match.lostItem.phone) {
      wx.makePhoneCall({
        phoneNumber: match.lostItem.phone,
        fail: () => {}
      });
    }
  },

  onContactFoundOwner(e) {
    const { match } = e.currentTarget.dataset;
    if (match && match.foundItem && match.foundItem.phone) {
      wx.makePhoneCall({
        phoneNumber: match.foundItem.phone,
        fail: () => {}
      });
    }
  },

  onRefresh() {
    this.loadMatches();
  },

  goToPublish() {
    if (!util.checkLogin()) {
      return;
    }
    util.navigateTo('/pages/lost-found-publish/index');
  },

  goToLostFound() {
    wx.switchTab({ url: '/pages/lost-found/index' });
  }
});
