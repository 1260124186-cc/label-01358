const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    topicList: [],
    hotPosts: [],
    searchKeyword: '',
    refreshing: false
  },

  onLoad() {
    this.loadTopics();
    this.loadHotPosts();
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadTopics();
    this.loadHotPosts();
    this.setData({ refreshing: false });
  },

  loadTopics() {
    const topicStats = dataService.getForumTopicStats();
    const list = constants.FORUM_TOPIC_LIST.map(t => ({
      ...t,
      postCount: topicStats[t.value] || 0
    }));
    this.setData({ topicList: list });
  },

  loadHotPosts() {
    const list = dataService.getForumPostList({ sort: 'hot' });
    const hotPosts = list.slice(0, 5).map(item => ({
      ...item,
      timeText: util.relativeTime(item.createTime),
      typeInfo: constants.FORUM_POST_TYPES.find(t => t.value === item.type) || {}
    }));
    this.setData({ hotPosts });
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearch() {
    const keyword = this.data.searchKeyword.trim();
    if (!keyword) return;
    const list = dataService.getForumPostList({ keyword });
    const results = list.slice(0, 20).map(item => ({
      ...item,
      timeText: util.relativeTime(item.createTime),
      typeInfo: constants.FORUM_POST_TYPES.find(t => t.value === item.type) || {}
    }));
    this.setData({ hotPosts: results });
  },

  onTopicTap(e) {
    const { value } = e.currentTarget.dataset;
    util.navigateTo(`/pages/forum/index?topic=${value}`);
  },

  onPostTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/forum/detail?id=${id}`);
  }
});
