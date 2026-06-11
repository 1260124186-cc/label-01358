const app = getApp();
const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    list: [],
    currentTab: 'all',
    tabs: [
      { value: 'all', label: '全部' },
      { value: 'selling', label: '在售' },
      { value: 'reserved', label: '已预订' },
      { value: 'sold', label: '已售出' }
    ]
  },

  onLoad() {
    if (!util.checkLogin()) {
      return;
    }
    this.loadList();
  },

  onShow() {
    if (util.isLoggedIn()) {
      this.loadList();
    }
  },

  loadList() {
    const userInfo = app.globalData.userInfo || {};
    const { currentTab } = this.data;

    const list = dataService.getMyMarketList(userInfo.id, currentTab).map(item => ({
      ...item,
      timeText: util.relativeTime(item.createTime),
      priceText: util.formatPrice(item.price),
      categoryText: constants.getLabelByValue(constants.MARKET_CATEGORIES, item.category),
      statusText: constants.getLabelByValue(constants.MARKET_STATUS, item.status)
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
    util.navigateTo(`/pages/market-detail/index?id=${item.id}`);
  },

  onEdit(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo(`/pages/market-publish/index?mode=edit&id=${item.id}`);
  },

  async onMarkReserved(e) {
    const { item } = e.currentTarget.dataset;
    if (item.status === 'reserved') return;

    const confirm = await util.showConfirm('确定要将此商品标记为已预订吗？');
    if (!confirm) return;

    const success = dataService.updateMarketItem(item.id, { status: 'reserved' });
    if (success) {
      util.showSuccess('已标记为已预订');
      this.loadList();
    } else {
      util.showError('操作失败，请重试');
    }
  },

  async onMarkSold(e) {
    const { item } = e.currentTarget.dataset;
    if (item.status === 'sold') return;

    const confirm = await util.showConfirm('确定要将此商品标记为已售出吗？');
    if (!confirm) return;

    const success = dataService.updateMarketItem(item.id, { status: 'sold' });
    if (success) {
      util.showSuccess('已标记为已售出');
      this.loadList();
    } else {
      util.showError('操作失败，请重试');
    }
  },

  async onRelist(e) {
    const { item } = e.currentTarget.dataset;

    const confirm = await util.showConfirm('确定要将此商品重新上架吗？');
    if (!confirm) return;

    const success = dataService.updateMarketItem(item.id, { status: 'selling' });
    if (success) {
      util.showSuccess('已重新上架');
      this.loadList();
    } else {
      util.showError('操作失败，请重试');
    }
  },

  async onDelete(e) {
    const { item } = e.currentTarget.dataset;

    const confirm = await util.showConfirm('确定要删除此商品吗？删除后将同时清除相关的收藏和浏览记录。');
    if (!confirm) return;

    const success = dataService.deleteMarketItem(item.id);
    if (success) {
      util.showSuccess('删除成功');
      this.loadList();
    } else {
      util.showError('删除失败，请重试');
    }
  }
});
