const dataService = require('../../services/data');
const config = require('../../config/index');
const util = require('../../utils/util');

Page({
  data: {
    list: [],
    loading: false,
    refreshing: false,
    currentType: '',
    currentItemType: '',
    currentItemTypeText: '',
    itemTypes: config.ITEM_TYPES,
    showItemTypePicker: false
  },

  onLoad() {
    this.loadList();
  },

  onShow() {
    this.loadList();
  },

  onPullDownRefresh() {
    this.loadList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadList() {
    this.setData({ loading: true });

    return new Promise((resolve) => {
      const filters = {};
      
      if (this.data.currentType) {
        filters.type = this.data.currentType;
      }
      
      if (this.data.currentItemType) {
        filters.itemType = this.data.currentItemType;
      }

      const list = dataService.getLostFoundList(filters);
      
      const formattedList = list.map(item => ({
        ...item,
        timeText: util.relativeTime(item.createTime),
        itemTypeText: config.getLabelByValue(config.ITEM_TYPES, item.itemType),
        locationText: config.getLabelByValue(config.LOCATIONS, item.location)
      }));

      this.setData({
        list: formattedList,
        loading: false,
        refreshing: false
      });

      resolve();
    });
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadList();
  },

  onLoadMore() {
    // 本地存储暂不需要分页
  },

  onTypeChange(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({ currentType: type });
    this.loadList();
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
    
    this.loadList();
  },

  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo(`/pages/lost-found-detail/index?id=${item.id}`);
  },

  onPublish() {
    // 检查登录状态
    if (!util.checkLogin()) {
      return;
    }
    util.navigateTo('/pages/lost-found-publish/index');
  },

  stopPropagation() {
    // 阻止事件冒泡
  }
});
