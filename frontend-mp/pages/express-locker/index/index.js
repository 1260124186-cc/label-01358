const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    tabs: constants.EXPRESS_LOCKER_TABS,
    currentTab: 'pending',
    list: [],
    loading: false,
    expiringCount: 0
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadData() {
    this.setData({ loading: true });
    return new Promise((resolve) => {
      const list = dataService.getExpressLockerList(this.data.currentTab);
      const expiringCount = dataService.getExpiringSoonCount();
      this.setData({
        list,
        expiringCount,
        loading: false
      });
      resolve();
    });
  },

  onTabChange(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({ currentTab: tab });
    this.loadData();
  },

  onAddTap() {
    util.navigateTo('/pages/express-locker/edit/index');
  },

  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    if (item.currentStatus === 'pending') {
      wx.showActionSheet({
        itemList: ['查看详情', '标记已取件', '编辑', '删除'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this._showDetail(item);
          } else if (res.tapIndex === 1) {
            this._markAsPicked(item.id);
          } else if (res.tapIndex === 2) {
            util.navigateTo('/pages/express-locker/edit/index?id=' + item.id);
          } else if (res.tapIndex === 3) {
            this._deleteItem(item.id);
          }
        }
      });
    } else {
      wx.showActionSheet({
        itemList: ['查看详情', '删除'],
        success: (res) => {
          if (res.tapIndex === 0) {
            this._showDetail(item);
          } else if (res.tapIndex === 1) {
            this._deleteItem(item.id);
          }
        }
      });
    }
  },

  onMarkPickedTap(e) {
    const { id } = e.currentTarget.dataset;
    this._markAsPicked(id);
  },

  _showDetail(item) {
    let content = `快递公司：${item.expressName}\n`;
    content += `柜机位置：${item.lockerLocation || '-'}\n`;
    content += `取件码：${item.pickupCode}\n`;
    if (item.deadline) {
      content += `截止时间：${item.deadlineText}\n`;
    }
    if (item.remark) {
      content += `\n备注：${item.remark}`;
    }
    wx.showModal({
      title: '取件详情',
      content,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  _markAsPicked(id) {
    util.showConfirm('确定要标记为已取件吗？').then((confirmed) => {
      if (confirmed) {
        const result = dataService.markAsPicked(id);
        if (result) {
          util.showSuccess('已标记');
          this.loadData();
        } else {
          util.showError('操作失败');
        }
      }
    });
  },

  _deleteItem(id) {
    util.showConfirm('确定要删除这条取件记录吗？').then((confirmed) => {
      if (confirmed) {
        const result = dataService.deleteExpressLockerCode(id);
        if (result) {
          util.showSuccess('已删除');
          this.loadData();
        } else {
          util.showError('删除失败');
        }
      }
    });
  },

  onCopyCode(e) {
    const { code } = e.currentTarget.dataset;
    wx.setClipboardData({
      data: code,
      success: () => {
        util.showToast('取件码已复制');
      }
    });
  }
});
