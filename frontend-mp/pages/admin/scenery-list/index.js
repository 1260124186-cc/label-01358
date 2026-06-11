const adminService = require('../../../services/adminService');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    list: []
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const rawList = adminService.getSceneryList();
    const list = rawList.map((item, index) => ({
      ...item,
      order: index + 1,
      timeText: util.formatTime(item.createTime, 'YYYY-MM-DD')
    }));
    this.setData({ list });
  },

  onAdd() {
    util.navigateTo('/pages/admin/scenery-edit/index');
  },

  onEdit(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/admin/scenery-edit/index?id=${id}`);
  },

  async onDelete(e) {
    const { id } = e.currentTarget.dataset;
    const confirm = await util.showConfirm('确定要删除这张风光图片吗？');
    if (!confirm) return;

    adminService.deleteScenery(id);
    util.showSuccess('删除成功');
    this.loadData();
  },

  onMoveUp(e) {
    const { id } = e.currentTarget.dataset;
    const result = adminService.moveScenery(id, 'up');
    if (result) {
      util.showToast('已上移');
      this.loadData();
    } else {
      util.showToast('已经是第一张了');
    }
  },

  onMoveDown(e) {
    const { id } = e.currentTarget.dataset;
    const result = adminService.moveScenery(id, 'down');
    if (result) {
      util.showToast('已下移');
      this.loadData();
    } else {
      util.showToast('已经是最后一张了');
    }
  }
});
