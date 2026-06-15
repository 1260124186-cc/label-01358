const util = require('../../../utils/util');
const constants = require('../../../config/constants');
const dataService = require('../../../services/data');
const { mixPage } = require('../../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    darkMode: false,
    loading: true,
    bookId: '',
    book: null,
    isFavorited: false,
    showFullDesc: false,
    userId: ''
  },

  onLoad(options) {
    const { id } = options;
    const currentUser = app.globalData.userInfo;

    this.setData({
      bookId: id,
      userId: currentUser ? currentUser.id : '',
      darkMode: app.globalData.isDark || false
    });

    this.loadBookDetail();
  },

  onShow() {
    if (this.data.bookId && !this.data.loading) {
      this.checkFavoriteStatus();
    }
  },

  loadBookDetail() {
    this.setData({ loading: true });

    try {
      const book = dataService.getLibraryBookDetail(this.data.bookId);

      if (!book) {
        util.showToast('图书不存在');
        setTimeout(() => wx.navigateBack(), 1500);
        return;
      }

      dataService.increaseLibraryBookViews(this.data.bookId);

      wx.setNavigationBarTitle({
        title: book.title
      });

      const categoryInfo = constants.LIBRARY_BOOK_CATEGORIES.find(c => c.value === book.category) || {};

      this.setData({
        book: {
          ...book,
          categoryIcon: categoryInfo.icon || '📚',
          categoryLabel: categoryInfo.label || '其他'
        },
        loading: false
      }, () => {
        this.checkFavoriteStatus();
      });

      dataService.addHistory(book, 'libraryBook');
    } catch (error) {
      console.error('加载图书详情失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  checkFavoriteStatus() {
    const isFav = dataService.isFavorite(this.data.bookId, 'libraryBook');
    this.setData({ isFavorited: isFav });
  },

  onToggleDesc() {
    this.setData({ showFullDesc: !this.data.showFullDesc });
  },

  onToggleFavorite() {
    if (!this.data.userId) {
      util.showToast('请先登录');
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/login/index' });
      }, 1500);
      return;
    }

    const { book, isFavorited } = this.data;

    if (isFavorited) {
      const success = dataService.removeFavorite(book.id, 'libraryBook');
      if (success) {
        this.setData({ isFavorited: false });
        util.showToast('已取消收藏');
      }
    } else {
      const success = dataService.addFavorite(book, 'libraryBook');
      if (success) {
        this.setData({ isFavorited: true });
        util.showToast('收藏成功');
      } else {
        util.showToast('已收藏过了');
      }
    }
  },

  onBorrow() {
    if (!this.data.userId) {
      util.showToast('请先登录');
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/login/index' });
      }, 1500);
      return;
    }

    if (this.data.book && this.data.book.availableCopies <= 0) {
      util.showToast('该书暂无馆藏可借');
      return;
    }

    wx.showModal({
      title: '借阅确认',
      content: `确认借阅《${this.data.book.title}》？\n请前往图书馆服务台办理借阅手续。`,
      confirmText: '确认借阅',
      success: (res) => {
        if (res.confirm) {
          util.showSuccess('借阅申请已提交');
        }
      }
    });
  },

  goBack() {
    wx.navigateBack();
  }
});
