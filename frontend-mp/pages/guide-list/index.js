const dataService = require('../../services/data');
const storage = require('../../utils/storage');
const util = require('../../utils/util');
const markdown = require('../../utils/markdown');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    categories: [],
    currentCategory: 'all',
    guideList: [],
    displayList: [],
    searchKeyword: '',
    isSearching: false,
    searchResults: [],
    showDetail: false,
    currentGuide: null,
    currentGuideHtml: '',
    isFavorited: false,
    favoriteIds: [],
    showFavoritesOnly: false
  },

  onLoad() {
    this.initData();
  },

  onShow() {
    this.refreshFavorites();
  },

  initData() {
    var categories = dataService.getGuideCategories();
    categories = [{ key: 'all', name: '全部', icon: '📋', color: '#FF6B6B' }].concat(categories);
    var guideList = dataService.getGuideList('all');
    var favoriteIds = dataService.getGuideFavorites();

    this.setData({
      categories: categories,
      guideList: guideList,
      displayList: guideList,
      favoriteIds: favoriteIds
    });
  },

  refreshFavorites() {
    var favoriteIds = dataService.getGuideFavorites();
    this.setData({ favoriteIds: favoriteIds });

    if (this.data.showDetail && this.data.currentGuide) {
      var isFav = favoriteIds.indexOf(this.data.currentGuide.id) > -1;
      this.setData({ isFavorited: isFav });
    }

    if (this.data.showFavoritesOnly) {
      this.filterByFavorites();
    }
  },

  onCategoryTap(e) {
    var key = e.currentTarget.dataset.key;
    this.setData({
      currentCategory: key,
      showFavoritesOnly: false
    });
    this.filterGuides();
  },

  filterGuides() {
    var category = this.data.currentCategory;
    var list = dataService.getGuideList(category);
    this.setData({ displayList: list });
  },

  onSearchFocus() {
    this.setData({ isSearching: true });
  },

  onSearchBlur() {
    if (!this.data.searchKeyword) {
      this.setData({ isSearching: false, searchResults: [] });
    }
  },

  onSearchInput(e) {
    var keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });

    if (!keyword || !keyword.trim()) {
      this.setData({ searchResults: [] });
      return;
    }

    var results = dataService.searchGuides(keyword);
    this.setData({ searchResults: results });
  },

  onSearchClear() {
    this.setData({ searchKeyword: '', searchResults: [], isSearching: false });
  },

  onSearchResultTap(e) {
    var id = e.currentTarget.dataset.id;
    this.openGuideDetail(id);
  },

  onGuideTap(e) {
    var id = e.currentTarget.dataset.id;
    this.openGuideDetail(id);
  },

  openGuideDetail(guideId) {
    var guide = dataService.getGuideDetail(guideId);
    if (!guide) {
      util.showToast('未找到该指南');
      return;
    }

    var html = markdown.parseMarkdown(guide.content);
    var favoriteIds = dataService.getGuideFavorites();
    var isFav = favoriteIds.indexOf(guideId) > -1;

    this.setData({
      showDetail: true,
      currentGuide: guide,
      currentGuideHtml: html,
      isFavorited: isFav,
      isSearching: false,
      searchKeyword: '',
      searchResults: []
    });
  },

  onCloseDetail() {
    this.setData({
      showDetail: false,
      currentGuide: null,
      currentGuideHtml: ''
    });
  },

  onToggleFavorite() {
    var guide = this.data.currentGuide;
    if (!guide) return;

    if (this.data.isFavorited) {
      dataService.removeGuideFavorite(guide.id);
      util.showToast('已取消收藏');
    } else {
      dataService.addGuideFavorite(guide.id);
      util.showToast('收藏成功');
    }

    var favoriteIds = dataService.getGuideFavorites();
    var isFav = favoriteIds.indexOf(guide.id) > -1;
    this.setData({
      isFavorited: isFav,
      favoriteIds: favoriteIds
    });
  },

  onToggleFavoriteFromList(e) {
    var id = e.currentTarget.dataset.id;
    var favoriteIds = this.data.favoriteIds;
    var isFav = favoriteIds.indexOf(id) > -1;

    if (isFav) {
      dataService.removeGuideFavorite(id);
      util.showToast('已取消收藏');
    } else {
      dataService.addGuideFavorite(id);
      util.showToast('收藏成功');
    }

    favoriteIds = dataService.getGuideFavorites();
    this.setData({ favoriteIds: favoriteIds });

    if (this.data.showFavoritesOnly) {
      this.filterByFavorites();
    }
  },

  onShowFavorites() {
    var showFav = !this.data.showFavoritesOnly;
    this.setData({ showFavoritesOnly: showFav });

    if (showFav) {
      this.setData({ currentCategory: 'all' });
      this.filterByFavorites();
    } else {
      this.filterGuides();
    }
  },

  filterByFavorites() {
    var favoriteIds = this.data.favoriteIds;
    var allGuides = this.data.guideList;
    var filtered = allGuides.filter(function(g) {
      return favoriteIds.indexOf(g.id) > -1;
    });
    this.setData({ displayList: filtered });
  },

  onCallPhone(e) {
    var phone = e.currentTarget.dataset.phone;
    if (!phone) {
      util.showToast('电话号码无效');
      return;
    }
    dataService.makePhoneCall(phone).catch(function(err) {
      if (err && err.errMsg && !err.errMsg.includes('cancel')) {
        util.showToast('拨号失败，请重试');
      }
    });
  },

  onCopyLocation(e) {
    var location = e.currentTarget.dataset.location;
    if (!location) return;
    wx.setClipboardData({
      data: location,
      success: function() {
        util.showToast('已复制到剪贴板');
      }
    });
  }
});
