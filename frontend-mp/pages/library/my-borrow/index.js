const util = require('../../../utils/util');
const constants = require('../../../config/constants');
const dataService = require('../../../services/data');
const { mixPage } = require('../../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    darkMode: false,
    loading: true,
    userId: 'user_001',
    activeTab: 'current',
    tabs: constants.LIBRARY_BORROW_TABS,
    summary: {
      currentCount: 0,
      overdueCount: 0,
      historyCount: 0,
      canRenewCount: 0
    },
    borrowList: [],
    maxRenewCount: 2
  },

  onLoad() {
    const currentUser = app.globalData.userInfo;
    this.setData({
      userId: currentUser ? currentUser.id : 'user_001',
      darkMode: app.globalData.isDark || false
    });
    this.loadData();
  },

  onShow() {
    if (!this.data.loading) {
      this.loadData();
    }
  },

  onPullDownRefresh() {
    this.loadData(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadData(callback) {
    this.setData({ loading: true });

    try {
      const { userId } = this.data;
      const summary = dataService.getBorrowSummary(userId);
      const borrowList = dataService.getMyBorrowList(userId, { tab: this.data.activeTab });

      const processedList = borrowList.map(item => ({
        ...item,
        borrowDateText: util.formatTime(item.borrowDate, 'YYYY-MM-DD'),
        dueDateText: util.formatTime(item.dueDate, 'YYYY-MM-DD'),
        returnDateText: item.returnDate ? util.formatTime(item.returnDate, 'YYYY-MM-DD') : '',
        daysLeftText: this.getDaysLeftText(item.daysLeft, item.displayStatus),
        overdueFeeText: item.overdueFee ? util.formatPrice(item.overdueFee) : '',
        canRenew: this.checkCanRenew(item)
      }));

      this.setData({
        summary,
        borrowList: processedList,
        loading: false
      });

      if (callback) callback();
    } catch (error) {
      console.error('加载借阅数据失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
      if (callback) callback();
    }
  },

  getDaysLeftText(daysLeft, status) {
    if (status === 'returned') return '已归还';
    if (status === 'overdue') {
      const overdueDays = Math.abs(daysLeft);
      return `已逾期${overdueDays}天`;
    }
    if (daysLeft < 0) {
      return `已逾期${Math.abs(daysLeft)}天`;
    }
    if (daysLeft === 0) return '今日到期';
    if (daysLeft <= 7) return `还剩${daysLeft}天`;
    return `还剩${daysLeft}天`;
  },

  checkCanRenew(item) {
    if (item.returnDate) return false;
    if (item.displayStatus === 'overdue') return false;
    if ((item.renewCount || 0) >= (item.maxRenewCount || this.data.maxRenewCount)) return false;
    return true;
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    if (value === this.data.activeTab) return;

    this.setData({ activeTab: value }, () => {
      this.loadData();
    });
  },

  async onRenewTap(e) {
    const { id, booktitle } = e.currentTarget.dataset;
    const record = this.data.borrowList.find(item => item.id === id);

    if (!record) {
      util.showToast('记录不存在');
      return;
    }

    if (!this.checkCanRenew(record)) {
      if (record.displayStatus === 'overdue') {
        util.showToast('逾期图书不可续借');
      } else if ((record.renewCount || 0) >= (record.maxRenewCount || this.data.maxRenewCount)) {
        util.showToast('已达到最大续借次数');
      }
      return;
    }

    const confirm = await util.showConfirm(
      `确定续借《${record.bookTitle}》吗？\n续借后将延期30天，最多可续借${record.maxRenewCount || this.data.maxRenewCount}次（已续借${record.renewCount || 0}次）`,
      '确认续借'
    );

    if (!confirm) return;

    try {
      util.showLoading('续借中...');
      const result = dataService.renewBorrowRecord(id);
      util.hideLoading();

      if (result.success) {
        await util.showSuccess('续借成功');
        this.loadData();
      } else {
        util.showToast(result.message || '续借失败');
      }
    } catch (error) {
      console.error('续借失败:', error);
      util.hideLoading();
      util.showToast('续借失败，请重试');
    }
  }
});
