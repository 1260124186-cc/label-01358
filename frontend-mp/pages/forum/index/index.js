const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    list: [],
    loading: false,
    refreshing: false,
    currentTab: 'recommend',
    currentType: '',
    currentTopic: '',
    currentTopicInfo: null,
    feedTabs: constants.FORUM_FEED_TABS,
    postTypes: constants.FORUM_POST_TYPES,
    showTypePicker: false
  },

  onLoad(options) {
    if (options && options.topic) {
      const topicInfo = constants.FORUM_TOPIC_LIST.find(t => t.value === options.topic);
      this.setData({ currentTopic: options.topic, currentTopicInfo: topicInfo || null });
      if (topicInfo) {
        wx.setNavigationBarTitle({ title: '#' + topicInfo.label });
      }
    }
    this.loadList();
  },

  onShow() {
    this.loadList();
  },

  onPullDownRefresh() {
    this.loadList().then(() => { wx.stopPullDownRefresh(); });
  },

  loadList() {
    this.setData({ loading: true });
    return new Promise((resolve) => {
      const filters = { sort: this.data.currentTab };
      if (this.data.currentType) { filters.type = this.data.currentType; }
      if (this.data.currentTopic) { filters.topic = this.data.currentTopic; }
      const list = dataService.getForumPostList(filters);
      const formattedList = list.map(item => ({
        ...item,
        timeText: util.relativeTime(item.createTime),
        typeInfo: constants.FORUM_POST_TYPES.find(t => t.value === item.type) || {},
        topicLabels: (item.topics || []).map(t => {
          const found = constants.FORUM_TOPIC_LIST.find(tp => tp.value === t);
          return found ? found.label : t;
        }),
        contentPreview: (item.content || '').substring(0, 80)
      }));
      this.setData({ list: formattedList, loading: false, refreshing: false });
      resolve();
    });
  },

  onRefresh() { this.setData({ refreshing: true }); this.loadList(); },
  onLoadMore() {},

  onTabChange(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({ currentTab: tab });
    this.loadList();
  },

  onTypeChange(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({ currentType: type === this.data.currentType ? '' : type });
    this.loadList();
  },

  onShowTypePicker() { this.setData({ showTypePicker: true }); },
  onHideTypePicker() { this.setData({ showTypePicker: false }); },

  onTypeSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentType: value, showTypePicker: false });
    this.loadList();
  },

  onItemTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/forum/detail?id=${id}`);
  },

  onPublish() {
    if (!util.checkLogin()) return;
    util.navigateTo('/pages/forum/publish');
  },

  onTopicSquare() {
    util.navigateTo('/pages/forum/topics');
  },

  onClearTopic() {
    this.setData({ currentTopic: '', currentTopicInfo: null });
    wx.setNavigationBarTitle({ title: '校园论坛' });
    this.loadList();
  },

  stopPropagation() {}
});
