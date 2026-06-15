const util = require('../../../utils/util');
const constants = require('../../../config/constants');
const dataService = require('../../../services/data');
const { mixPage } = require('../../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    darkMode: false,
    loading: true,
    searchKeyword: '',
    currentCategory: 'all',
    currentSort: 'default',
    categories: [],
    books: [],
    filteredBooks: []
  },

  onLoad() {
    this.setData({
      darkMode: app.globalData.isDark || false
    });
    this.loadCategories();
    this.loadBooks();
  },

  onShow() {
    if (!this.data.loading) {
      this.loadBooks();
    }
  },

  onPullDownRefresh() {
    this.loadBooks();
    wx.stopPullDownRefresh();
  },

  loadCategories() {
    const categories = dataService.getLibraryBookCategories();
    this.setData({ categories });
  },

  loadBooks() {
    this.setData({ loading: true });

    try {
      const books = dataService.getLibraryBookList({
        category: this.data.currentCategory,
        keyword: this.data.searchKeyword,
        sort: this.data.currentSort
      }).map(book => {
        const categoryInfo = constants.LIBRARY_BOOK_CATEGORIES.find(c => c.value === book.category) || {};
        const statusInfo = book.availableCopies > 0
          ? constants.LIBRARY_BOOK_STATUS_MAP['available']
          : constants.LIBRARY_BOOK_STATUS_MAP['borrowed'];
        return {
          ...book,
          categoryIcon: categoryInfo.icon || '📚',
          categoryLabel: categoryInfo.label || '其他',
          statusLabel: statusInfo.label,
          statusColor: statusInfo.color
        };
      });

      this.setData({
        books,
        filteredBooks: books,
        loading: false
      });
    } catch (error) {
      console.error('加载图书列表失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  filterBooks() {
    const { books, currentCategory, searchKeyword, currentSort } = this.data;

    const filtered = dataService.getLibraryBookList({
      category: currentCategory,
      keyword: searchKeyword,
      sort: currentSort
    }).map(book => {
      const categoryInfo = constants.LIBRARY_BOOK_CATEGORIES.find(c => c.value === book.category) || {};
      const statusInfo = book.availableCopies > 0
        ? constants.LIBRARY_BOOK_STATUS_MAP['available']
        : constants.LIBRARY_BOOK_STATUS_MAP['borrowed'];
      return {
        ...book,
        categoryIcon: categoryInfo.icon || '📚',
        categoryLabel: categoryInfo.label || '其他',
        statusLabel: statusInfo.label,
        statusColor: statusInfo.color
      };
    });

    this.setData({ filteredBooks: filtered });
  },

  onCategoryTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentCategory: value }, () => {
      this.filterBooks();
    });
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value }, () => {
      this.filterBooks();
    });
  },

  onSearchClear() {
    this.setData({ searchKeyword: '' }, () => {
      this.filterBooks();
    });
  },

  onSearchConfirm() {
    this.filterBooks();
  },

  onBookTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/library/book-detail/index?id=${id}`);
  }
});
