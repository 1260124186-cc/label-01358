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
      { value: 'active', label: '进行中' },
      { value: 'claim_pending', label: '审核中' },
      { value: 'resolved', label: '已完成' },
      { value: 'closed', label: '已关闭' }
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

    const statusLabelMap = {};
    constants.LOST_FOUND_STATUS.forEach(s => {
      statusLabelMap[s.value] = s.label;
    });

    const list = dataService.getMyLostFoundList(userInfo.id, currentTab).map(item => {
      const pendingApplications = dataService.getClaimApplicationsByLostFound(item.id, 'pending');
      return {
        ...item,
        timeText: util.relativeTime(item.createTime),
        itemTypeText: constants.getLabelByValue(constants.ITEM_TYPES, item.itemType),
        typeText: constants.getLabelByValue(constants.LOST_FOUND_TYPES, item.type),
        statusText: statusLabelMap[item.status] || item.status,
        pendingClaimCount: pendingApplications ? pendingApplications.length : 0
      };
    });

    this.setData({ list });
  },

  onTabChange(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({ currentTab: tab });
    this.loadList();
  },

  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo(`/pages/lost-found-detail/index?id=${item.id}`);
  },

  onEdit(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo(`/pages/lost-found-publish/index?mode=edit&id=${item.id}`);
  },

  async onToggleStatus(e) {
    const { item } = e.currentTarget.dataset;
    const newStatus = item.status === 'active' ? 'closed' : 'active';
    const actionText = newStatus === 'closed' ? '关闭' : '重新开启';

    const confirm = await util.showConfirm(`确定要${actionText}这条信息吗？`);
    if (!confirm) return;

    const success = dataService.updateLostFound(item.id, { status: newStatus });
    if (success) {
      util.showSuccess(`已${actionText}`);
      this.loadList();
    } else {
      util.showError('操作失败，请重试');
    }
  },

  async onDelete(e) {
    const { item } = e.currentTarget.dataset;

    const confirm = await util.showConfirm('确定要删除这条信息吗？删除后将同时清除相关的收藏和浏览记录。');
    if (!confirm) return;

    const success = dataService.deleteLostFound(item.id);
    if (success) {
      util.showSuccess('删除成功');
      this.loadList();
    } else {
      util.showError('删除失败，请重试');
    }
  },

  onManageClaims(e) {
    const { item } = e.currentTarget.dataset;
    util.navigateTo(`/pages/lost-found-claim-manage/index?lostFoundId=${item.id}`);
  }
});
