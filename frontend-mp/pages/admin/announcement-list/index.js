const adminService = require('../../../services/adminService');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    list: [],
    statusMap: constants.PUBLISH_STATUS_MAP
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  loadData() {
    const rawList = adminService.getAnnouncements();
    const list = rawList.map(item => ({
      ...item,
      timeText: util.formatTime(item.publishTime, 'YYYY-MM-DD HH:mm'),
      statusInfo: constants.PUBLISH_STATUS_MAP[item.status] || { label: '未知', color: '#6B7280' }
    }));
    this.setData({ list });
  },

  onAdd() {
    util.navigateTo('/pages/admin/announcement-edit/index');
  },

  onEdit(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/admin/announcement-edit/index?id=${id}`);
  },

  async onDelete(e) {
    const { id } = e.currentTarget.dataset;
    const confirm = await util.showConfirm('确定要删除这条公告吗？');
    if (!confirm) return;

    adminService.deleteAnnouncement(id);
    util.showSuccess('删除成功');
    this.loadData();
  },

  async onToggleTop(e) {
    const { id } = e.currentTarget.dataset;
    adminService.toggleAnnouncementTop(id);
    util.showToast('操作成功');
    this.loadData();
  }
});
