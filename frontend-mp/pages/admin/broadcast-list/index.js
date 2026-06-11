const adminService = require('../../../services/adminService');
const constants = require('../../../config/constants');
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
    const rawList = adminService.getBroadcastPrograms();
    const list = rawList.map((item, index) => ({
      ...item,
      order: index + 1,
      timeText: util.formatTime(item.publishTime, 'YYYY-MM-DD'),
      statusInfo: constants.PUBLISH_STATUS_MAP[item.status] || { label: '未知', color: '#6B7280' },
      durationText: this.formatDuration(item.duration)
    }));
    this.setData({ list });
  },

  formatDuration(seconds) {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  },

  onAdd() {
    util.navigateTo('/pages/admin/broadcast-edit/index');
  },

  onEdit(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/admin/broadcast-edit/index?id=${id}`);
  },

  async onDelete(e) {
    const { id } = e.currentTarget.dataset;
    const confirm = await util.showConfirm('确定要删除这个节目吗？');
    if (!confirm) return;

    adminService.deleteBroadcastProgram(id);
    util.showSuccess('删除成功');
    this.loadData();
  },

  onMoveUp(e) {
    const { id } = e.currentTarget.dataset;
    const result = adminService.moveBroadcastProgram(id, 'up');
    if (result) {
      util.showToast('已上移');
      this.loadData();
    } else {
      util.showToast('已经是第一个了');
    }
  },

  onMoveDown(e) {
    const { id } = e.currentTarget.dataset;
    const result = adminService.moveBroadcastProgram(id, 'down');
    if (result) {
      util.showToast('已下移');
      this.loadData();
    } else {
      util.showToast('已经是最后一个了');
    }
  }
});
