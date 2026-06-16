const dataService = require('../../services/data');
const matcherService = require('../../services/lostFoundMatcher');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');
const { mixinList, DEFAULT_PAGE_SIZE } = require('../../utils/listMixin');

let pageOptions = {
  data: {
    darkMode: false,
    currentType: '',
    currentItemType: '',
    currentItemTypeText: '',
    itemTypes: constants.ITEM_TYPES,
    showItemTypePicker: false,
    smartMatchStats: null
  },

  onLoad() {
    this._initFilters();
    this.loadSmartMatchStats();
  },

  onShow() {
    this.loadSmartMatchStats();
  },

  loadSmartMatchStats() {
    try {
      const result = matcherService.findLostFoundMatches({
        minScore: 30,
        limit: 10
      });
      this.setData({
        smartMatchStats: {
          total: result.total,
          excellent: result.statistics.excellent,
          high: result.statistics.high
        }
      });
    } catch (e) {
      // ignore
    }
  },

  _initFilters() {
    const filters = {};
    if (this.data.currentType) {
      filters.type = this.data.currentType;
    }
    if (this.data.currentItemType) {
      filters.itemType = this.data.currentItemType;
    }
    this.setListFilters(filters);
  },

  onRefresh() {
    this.refreshList();
    this.loadSmartMatchStats();
  },

  onLoadMore() {
    this.loadMore();
  },

  onTypeChange(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({ currentType: type });
    this._initFilters();
  },

  onShowItemTypePicker() {
    this.setData({ showItemTypePicker: true });
  },

  onHideItemTypePicker() {
    this.setData({ showItemTypePicker: false });
  },

  onItemTypeSelect(e) {
    const { value } = e.currentTarget.dataset;
    const item = this.data.itemTypes.find(i => i.value === value);

    this.setData({
      currentItemType: value,
      currentItemTypeText: item ? item.label : '',
      showItemTypePicker: false
    });

    this._initFilters();
  },

  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    this.goToDetail(`/pages/lost-found-detail/index?id=${item.id}`);
  },

  onPublish() {
    if (!util.checkLogin()) {
      return;
    }
    util.navigateTo('/pages/lost-found-publish/index');
  },

  goToMatchCenter() {
    util.navigateTo('/pages/lost-found-match/index');
  },

  stopPropagation() {
  }
};

pageOptions = mixinList(pageOptions, {
  listKey: 'lost_found',
  pageSize: DEFAULT_PAGE_SIZE,
  enableCache: true,
  cacheFirst: true,
  dataField: 'list',
  loadMethod: function({ page, pageSize, filters }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = dataService.getLostFoundListPaged({
          page,
          pageSize,
          filters
        });
        resolve(result);
      }, 500);
    });
  },
  formatItem: function(item) {
    const matchResult = matcherService.findMatchesForItem(item, {
      minScore: 40,
      limit: 3
    });

    const statusConfig = constants.LOST_FOUND_STATUS.find(s => s.value === item.status);
    const smartHints = [];
    if (matchResult.matches && matchResult.matches.length > 0) {
      const topMatch = matchResult.matches[0];
      if (topMatch.reasons) {
        topMatch.reasons.forEach(r => {
          if (r.type === 'itemType') smartHints.push('物品类型相同');
          if (r.type === 'location') smartHints.push('地点相近');
          if (r.type === 'date') smartHints.push('时间接近');
          if (r.type === 'keyword') smartHints.push('关键词匹配');
        });
      }
    }
    if (matchResult.total > 0 && smartHints.length === 0) {
      smartHints.push(`发现${matchResult.total}条相关信息`);
    }

    return {
      ...item,
      timeText: util.relativeTime(item.createTime),
      itemTypeText: constants.getLabelByValue(constants.ITEM_TYPES, item.itemType),
      locationText: constants.getLabelByValue(constants.LOCATIONS, item.location),
      statusText: statusConfig ? statusConfig.label : '',
      matchCount: matchResult.total,
      topMatch: matchResult.matches[0] || null,
      smartHints: smartHints.slice(0, 3)
    };
  }
});

mixPage(pageOptions);
