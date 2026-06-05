const dataService = require('../../services/data');
const util = require('../../utils/util');

Page({
  data: {
    list: []
  },

  onLoad() {
    this.loadList();
  },

  onShow() {
    this.loadList();
  },

  loadList() {
    const list = dataService.getHistory().map(item => ({
      ...item,
      timeText: util.relativeTime(item.viewTime)
    }));
    
    this.setData({ list });
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
    
    dataService.removeHistory(item.id, item.type);
    this.loadList();
    util.showSuccess('已删除');
  },

  async onClearAll() {
    const confirm = await util.showConfirm('确定要清空所有浏览记录吗？');
    
    if (confirm) {
      dataService.clearHistory();
      this.loadList();
      util.showSuccess('已清空');
    }
  }
});
