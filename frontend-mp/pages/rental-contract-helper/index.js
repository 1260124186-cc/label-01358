const dataService = require('../../services/data');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    checklist: [],
    progress: { total: 0, checked: 0, percentage: 0 },
    expandedCategories: {},
    showNoteModal: false,
    currentCategoryIndex: -1,
    currentItemIndex: -1,
    currentNote: ''
  },

  onLoad() {
    this.loadChecklist();
  },

  onShow() {
    this.loadChecklist();
  },

  loadChecklist() {
    if (!util.checkLogin()) return;

    const app = getApp();
    const userInfo = app.globalData.userInfo || {};
    const userId = userInfo.id || 'anonymous';

    const checklist = dataService.getContractChecklist(userId);
    const progress = dataService.getContractCheckProgress(userId);

    const expandedCategories = {};
    checklist.forEach((_, index) => {
      expandedCategories[index] = true;
    });

    this.setData({ checklist, progress, expandedCategories });
  },

  onToggleCategory(e) {
    const { index } = e.currentTarget.dataset;
    const expandedCategories = { ...this.data.expandedCategories };
    expandedCategories[index] = !expandedCategories[index];
    this.setData({ expandedCategories });
  },

  onToggleItem(e) {
    if (!util.checkLogin()) return;

    const { categoryIndex, itemIndex } = e.currentTarget.dataset;
    const app = getApp();
    const userInfo = app.globalData.userInfo || {};
    const userId = userInfo.id || 'anonymous';

    const checklist = dataService.toggleContractCheckItem(userId, categoryIndex, itemIndex);
    const progress = dataService.getContractCheckProgress(userId);

    this.setData({ checklist, progress });
  },

  onShowNoteModal(e) {
    const { categoryIndex, itemIndex } = e.currentTarget.dataset;
    const item = this.data.checklist[categoryIndex].items[itemIndex];

    this.setData({
      showNoteModal: true,
      currentCategoryIndex: categoryIndex,
      currentItemIndex: itemIndex,
      currentNote: item.note || ''
    });
  },

  onHideNoteModal() {
    this.setData({ showNoteModal: false });
  },

  onNoteInput(e) {
    this.setData({ currentNote: e.detail.value });
  },

  onSaveNote() {
    if (!util.checkLogin()) return;

    const app = getApp();
    const userInfo = app.globalData.userInfo || {};
    const userId = userInfo.id || 'anonymous';

    const checklist = dataService.updateContractCheckNote(
      userId,
      this.data.currentCategoryIndex,
      this.data.currentItemIndex,
      this.data.currentNote
    );

    this.setData({ checklist, showNoteModal: false });
    util.showSuccess('备注已保存');
  },

  onReset() {
    wx.showModal({
      title: '重置清单',
      content: '确定要重置所有勾选状态吗？',
      confirmText: '确定重置',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          const app = getApp();
          const userInfo = app.globalData.userInfo || {};
          const userId = userInfo.id || 'anonymous';

          const checklist = dataService.resetContractChecklist(userId);
          const progress = dataService.getContractCheckProgress(userId);

          this.setData({ checklist, progress });
          util.showSuccess('已重置');
        }
      }
    });
  },

  stopPropagation() {}
});
