const dataService = require('../../services/data');
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
    showItemTypePicker: false
  },

  onLoad() {
    this._initFilters();
  },

  onShow() {
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
    return {
      ...item,
      timeText: util.relativeTime(item.createTime),
      itemTypeText: constants.getLabelByValue(constants.ITEM_TYPES, item.itemType),
      locationText: constants.getLabelByValue(constants.LOCATIONS, item.location)
    };
  }
});

mixPage(pageOptions);
