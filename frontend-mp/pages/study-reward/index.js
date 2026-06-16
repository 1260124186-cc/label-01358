const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');
const { mixinList, DEFAULT_PAGE_SIZE } = require('../../utils/listMixin');

let pageOptions = {
  data: {
    darkMode: false,
    subjects: constants.STUDY_REWARD_SUBJECTS,
    rewardRanges: constants.STUDY_REWARD_REWARD_RANGES,
    statusFilters: constants.STUDY_REWARD_STATUS_FILTER,
    timeRanges: constants.STUDY_REWARD_TIME_RANGES,
    sortOptions: constants.STUDY_REWARD_SORT_OPTIONS,
    currentSubject: '',
    currentSubjectText: '全部学科',
    currentRewardRange: '',
    currentRewardText: '不限赏金',
    minReward: undefined,
    maxReward: undefined,
    currentStatus: '',
    currentStatusText: '全部状态',
    currentTimeRange: '',
    currentSort: 'latest',
    currentSortText: '最新发布',
    showSubjectPicker: false,
    showRewardPicker: false,
    showStatusPicker: false,
    showTimePicker: false,
    showSortPicker: false,
    userPoints: 0,
    detailPagePath: '/pages/study-reward/detail'
  },

  onLoad() {
    this.loadUserPoints();
  },

  onShow() {
    this.loadUserPoints();
  },

  loadUserPoints() {
    const points = dataService.getUserPoints();
    this.setData({ userPoints: points });
  },

  _updateFilters() {
    const filters = {};

    if (this.data.currentSubject) {
      filters.subject = this.data.currentSubject;
    }

    if (this.data.currentStatus) {
      filters.status = this.data.currentStatus;
    }

    if (this.data.currentTimeRange) {
      filters.timeRange = this.data.currentTimeRange;
    }

    if (this.data.minReward !== undefined) {
      filters.minReward = this.data.minReward;
    }

    if (this.data.maxReward !== undefined && this.data.maxReward !== Infinity) {
      filters.maxReward = this.data.maxReward;
    }

    filters.sort = this.data.currentSort;

    this.setListFilters(filters);
  },

  onShowSubjectPicker() {
    this.setData({ showSubjectPicker: true });
  },

  onHideSubjectPicker() {
    this.setData({ showSubjectPicker: false });
  },

  onSubjectSelect(e) {
    const { value } = e.currentTarget.dataset;
    const item = this.data.subjects.find(s => s.value === value);

    this.setData({
      currentSubject: value,
      currentSubjectText: item ? item.label : '全部学科',
      showSubjectPicker: false
    });

    this._updateFilters();
  },

  onShowRewardPicker() {
    this.setData({ showRewardPicker: true });
  },

  onHideRewardPicker() {
    this.setData({ showRewardPicker: false });
  },

  onRewardSelect(e) {
    const { value, min, max } = e.currentTarget.dataset;
    const item = this.data.rewardRanges.find(r => r.value === value);

    this.setData({
      currentRewardRange: value,
      currentRewardText: item ? item.label : '不限赏金',
      minReward: min !== undefined ? min : undefined,
      maxReward: max !== undefined ? max : undefined,
      showRewardPicker: false
    });

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

  onShowTimePicker() {
    this.setData({ showTimePicker: true });
  },

  onHideTimePicker() {
    this.setData({ showTimePicker: false });
  },

  onTimeSelect(e) {
    const { value } = e.currentTarget.dataset;
    const item = this.data.timeRanges.find(t => t.value === value);

    this.setData({
      currentTimeRange: value,
      currentTimeText: item ? item.label : '不限时间',
      showTimePicker: false
    });

    this._updateFilters();
  },

  onShowSortPicker() {
    this.setData({ showSortPicker: true });
  },

  onHideSortPicker() {
    this.setData({ showSortPicker: false });
  },

  onSortSelect(e) {
    const { value } = e.currentTarget.dataset;
    const item = this.data.sortOptions.find(s => s.value === value);

    this.setData({
      currentSort: value,
      currentSortText: item ? item.label : '最新发布',
      showSortPicker: false
    });

    this._updateFilters();
  },

  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    this.goToDetail(`/pages/study-reward/detail?id=${item.id}`);
  },

  onPublish() {
    if (!util.checkLogin()) {
      return;
    }
    util.navigateTo('/pages/study-reward/publish');
  },

  onMyRewards() {
    if (!util.checkLogin()) {
      return;
    }
    util.navigateTo('/pages/my-study-reward/index');
  },

  stopPropagation() {}
};

pageOptions = mixinList(pageOptions, {
  listKey: 'studyReward',
  pageSize: DEFAULT_PAGE_SIZE,
  enableCache: true,
  cacheFirst: true,
  dataField: 'list',
  enablePullDownRefresh: true,
  enableReachBottom: true,
  autoLoad: true,
  skeleton: {
    enable: true,
    type: 'card',
    count: 6
  },
  empty: {
    text: '暂无悬赏信息',
    showAction: true,
    actionText: '发布悬赏',
    onAction: function() {
      this.onPublish();
    }
  },
  loadMethod: function({ page, pageSize, filters }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = dataService.getStudyRewardsListPaged({
          page,
          pageSize,
          filters
        });
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
      responseCount: (item.responses || []).length
    };
  }
});

mixPage(pageOptions);
