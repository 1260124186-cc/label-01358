const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');
const { mixinList, DEFAULT_PAGE_SIZE } = require('../../utils/listMixin');

let pageOptions = {
  data: {
    darkMode: false,
    tabs: constants.STUDY_REWARD_MY_TABS,
    currentTab: 'published',
    statusFilters: constants.STUDY_REWARD_STATUS_FILTER,
    currentStatus: '',
    currentStatusText: '全部状态',
    showStatusPicker: false,
    userPoints: 0,
    detailPagePath: '/pages/study-reward/detail'
  },

  onLoad() {
    if (!util.checkLogin()) {
      return;
    }
    this.loadUserPoints();
  },

  onShow() {
    if (util.isLoggedIn()) {
      this.loadUserPoints();
      if (this._listInitialized) {
        this.refreshList();
      }
    }
  },

  loadUserPoints() {
    const points = dataService.getUserPoints();
    this.setData({ userPoints: points });
  },

  onTabChange(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({ currentTab: tab });
    this._updateFilters();
  },

  onShowStatusPicker() {
    this.setData({ showStatusPicker: true });
  },

  onHideStatusPicker() {
    this.setData({ showStatusPicker: false });
  },

  onStatusSelect(e) {
    const { value } = e.currentTarget.dataset;
    const item = this.data.statusFilters.find(s => s.value === value);

    this.setData({
      currentStatus: value,
      currentStatusText: item ? item.label : '全部状态',
      showStatusPicker: false
    });

    this._updateFilters();
  },

  _updateFilters() {
    const filters = {};

    if (this.data.currentStatus) {
      filters.status = this.data.currentStatus;
    }

    this.setListFilters(filters);
  },

  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    this.goToDetail(`/pages/study-reward/detail?id=${item.id}`);
  },

  onPublish() {
    util.navigateTo('/pages/study-reward/publish');
  },

  stopPropagation() {}
};

pageOptions = mixinList(pageOptions, {
  listKey: 'myStudyReward',
  pageSize: DEFAULT_PAGE_SIZE,
  enableCache: false,
  cacheFirst: false,
  dataField: 'list',
  enablePullDownRefresh: true,
  enableReachBottom: true,
  autoLoad: true,
  skeleton: {
    enable: true,
    type: 'card',
    count: 4
  },
  empty: {
    text: '暂无相关悬赏',
    showAction: true,
    actionText: '去发布',
    onAction: function() {
      this.onPublish();
    }
  },
  loadMethod: function({ page, pageSize, filters }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = dataService.getMyStudyRewardsPaged(
          this.data.currentTab,
          { page, pageSize, filters }
        );
        resolve(result);
      }, 300);
    });
  },
  formatItem: function(item) {
    const categoryInfo = constants.STUDY_MATERIAL_CATEGORIES.find(c => c.value === item.category);
    const statusInfo = constants.STUDY_REWARD_STATUS_MAP[item.status] || {};
    const subjectInfo = constants.STUDY_REWARD_SUBJECTS.find(s => s.value === item.subject);
    const creditLevel = constants.STUDY_REWARD_CREDIT_LEVELS.find(
      level => item.publisherCredit >= level.min && item.publisherCredit <= level.max
    ) || constants.STUDY_REWARD_CREDIT_LEVELS[constants.STUDY_REWARD_CREDIT_LEVELS.length - 1];

    const app = getApp();
    const userInfo = app.globalData.userInfo || {};
    const userId = userInfo.id || 'anonymous';

    let myResponse = null;
    if (this.data.currentTab === 'answered' && item.responses) {
      myResponse = item.responses.find(r => r.responderId === userId);
    }

    return {
      ...item,
      categoryText: categoryInfo ? categoryInfo.label : item.category,
      categoryColor: categoryInfo ? categoryInfo.color : '#999',
      categoryIcon: categoryInfo ? categoryInfo.icon : '📚',
      statusText: statusInfo.label || item.status,
      statusColor: statusInfo.color || '#666',
      subjectText: subjectInfo ? subjectInfo.label : '',
      subjectIcon: subjectInfo ? subjectInfo.icon : '',
      timeText: util.relativeTime(item.createTime),
      creditLabel: creditLevel.label,
      creditColor: creditLevel.color,
      creditIcon: creditLevel.icon,
      responseCount: (item.responses || []).length,
      myResponseAdopted: myResponse ? myResponse.isAdopted : false,
      isAnswered: this.data.currentTab === 'answered'
    };
  }
});

mixPage(pageOptions);
