const dataService = require('../../services/data');
const util = require('../../utils/util');

Page({
  data: {
    list: [],
    currentTab: 'all'
  },

  onLoad() {
    this.loadList();
  },

  onShow() {
    this.loadList();
  },

  loadList() {
    const { currentTab } = this.data;
    const type = currentTab === 'all' ? '' : currentTab;
    
    const list = dataService.getFavorites(type).map(item => ({
      ...item,
      timeText: util.relativeTime(item.createTime)
    }));
    
    this.setData({ list });
  },

  onTabChange(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({ currentTab: tab });
    this.loadList();
  },

  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    
    if (item.type === 'lostFound') {
      util.navigateTo(`/pages/lost-found-detail/index?id=${item.id}`);
    } else if (item.type === 'market') {
      util.navigateTo(`/pages/market-detail/index?id=${item.id}`);
    }
  },

  async onRemove(e) {
    const { item } = e.currentTarget.dataset;
    
    const confirm = await util.showConfirm('确定要取消收藏吗？');
    
    if (confirm) {
      dataService.removeFavorite(item.id, item.type);
      this.loadList();
      util.showSuccess('已取消收藏');
    }
  }
});
