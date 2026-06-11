const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    searchKeyword: '',
    showSearchFocus: false,
    searchHistory: [],
    searchResults: [],
    hotPOIs: [],
    categories: constants.POI_CATEGORIES,
    currentCategory: 'all',
    mapType: 'handdrawn',
    showLabels: true,
    showFreshmanGuide: false,
    showFreshmanPanel: false,
    poiList: [],
    filteredPOIs: [],
    selectedPOI: null,
    isFavorited: false,
    currentRoute: null,
    routeLines: [],
    highlightPOIs: [],
    freshmanFlow: [],
    mapScale: 1,
    mapOffsetX: 0,
    mapOffsetY: 0,
    touchStartX: 0,
    touchStartY: 0,
    lastTouchX: 0,
    lastTouchY: 0,
    selectMode: false,
    selectModeTitle: ''
  },

  onLoad(options) {
    this.loadData();

    if (options.action === 'selectPOI') {
      this.setData({
        selectMode: true,
        selectModeTitle: options.title || '选择地点'
      });
    }

    if (options.poiId) {
      setTimeout(() => {
        this.focusOnPOI(options.poiId);
      }, 500);
    }

    if (options.highlight) {
      this.setData({ showFreshmanGuide: true, showFreshmanPanel: true });
    }

    if (options.startId && options.endId) {
      setTimeout(() => {
        this.showRoute(options.startId, options.endId);
      }, 500);
    }

    const settings = dataService.getMapSettings();
    this.setData({
      mapType: settings.mapType,
      showLabels: settings.showLabels
    });
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
    return new Promise((resolve) => {
      const poiList = dataService.getPOIList();
      const hotPOIs = poiList.slice(0, 8);
      const highlightPOIs = dataService.getHighlightPOIs();
      const freshmanFlow = dataService.getFreshmanRegistrationFlow();
      const searchHistory = dataService.getMapSearchHistory();

      this.setData({
        poiList,
        hotPOIs,
        highlightPOIs,
        freshmanFlow,
        searchHistory,
        filteredPOIs: poiList
      });

      this.filterPOIs();
      resolve();
    });
  },

  filterPOIs() {
    let list = this.data.poiList;

    if (this.data.currentCategory !== 'all') {
      list = list.filter(item => item.category === this.data.currentCategory);
    }

    if (this.data.searchKeyword) {
      const keyword = this.data.searchKeyword.toLowerCase();
      list = list.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.address.toLowerCase().includes(keyword)
      );
    }

    this.setData({ filteredPOIs: list });
  },

  getCategoryIcon(category) {
    const cat = constants.POI_CATEGORY_MAP[category];
    return cat ? cat.icon : '📍';
  },

  getCategoryColor(category) {
    const cat = constants.POI_CATEGORY_MAP[category];
    return cat ? cat.color : '#6B7280';
  },

  onSearchInput(e) {
    const value = e.detail.value;
    this.setData({ searchKeyword: value });
    this.performSearch(value);
  },

  onSearchConfirm() {
    const keyword = this.data.searchKeyword.trim();
    if (keyword) {
      dataService.addMapSearchHistory(keyword);
      this.setData({
        searchHistory: dataService.getMapSearchHistory()
      });
    }
  },

  onSearchFocus() {
    this.setData({ showSearchFocus: true });
  },

  onSearchBlur() {
    this.setData({ showSearchFocus: false });
  },

  onClearSearch() {
    this.setData({ searchKeyword: '', searchResults: [] });
    this.filterPOIs();
  },

  performSearch(keyword) {
    if (!keyword || !keyword.trim()) {
      this.setData({ searchResults: [] });
      return;
    }

    const results = dataService.searchPOI(keyword);
    this.setData({ searchResults: results.slice(0, 10) });
  },

  onCancelSelect() {
    util.navigateBack();
  },

  onHistoryTap(e) {
    const { keyword } = e.currentTarget.dataset;
    this.setData({ searchKeyword: keyword, showSearchFocus: false });
    this.performSearch(keyword);
    this.filterPOIs();
  },

  onClearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          dataService.clearMapSearchHistory();
          this.setData({ searchHistory: [] });
        }
      }
    });
  },

  onSearchResultTap(e) {
    const { poi } = e.currentTarget.dataset;
    this.setData({
      showSearchFocus: false,
      searchKeyword: poi.name
    });
    dataService.addMapSearchHistory(poi.name);
    if (this.data.selectMode) {
      this.confirmSelectPOI(poi);
    } else {
      this.selectPOI(poi);
    }
  },

  onHotPOITap(e) {
    const { poi } = e.currentTarget.dataset;
    this.setData({ showSearchFocus: false });
    if (this.data.selectMode) {
      this.confirmSelectPOI(poi);
    } else {
      this.selectPOI(poi);
    }
  },

  onCategoryChange(e) {
    const { category } = e.currentTarget.dataset;
    this.setData({ currentCategory: category });
    this.filterPOIs();
  },

  onMapTypeChange(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({ mapType: type });
    dataService.updateMapSettings({ mapType: type });
  },

  onPOITap(e) {
    const { poi } = e.currentTarget.dataset;
    if (this.data.selectMode) {
      this.confirmSelectPOI(poi);
    } else {
      this.selectPOI(poi);
    }
  },

  confirmSelectPOI(poi) {
    const app = getApp();
    app.globalData.selectedPOI = poi;
    util.showToast(`已选择：${poi.name}`);
    setTimeout(() => {
      util.navigateBack();
    }, 500);
  },

  selectPOI(poi) {
    const isFavorited = dataService.isMapFavorite(poi.id);
    this.setData({
      selectedPOI: poi,
      isFavorited,
      currentRoute: null
    });
  },

  focusOnPOI(poiId) {
    const poi = dataService.getPOIDetail(poiId);
    if (poi) {
      this.selectPOI(poi);
      wx.showToast({
        title: `已定位到${poi.name}`,
        icon: 'success'
      });
    }
  },

  onViewDetail() {
    if (this.data.selectedPOI) {
      util.navigateTo(`/pages/poi-detail/index?id=${this.data.selectedPOI.id}`);
    }
  },

  onNavigateTo() {
    if (this.data.selectedPOI) {
      util.navigateTo(`/pages/route-planner/index?endId=${this.data.selectedPOI.id}`);
    }
  },

  onToggleFavorite() {
    if (this.data.selectedPOI) {
      const result = dataService.toggleMapFavorite(this.data.selectedPOI.id);
      this.setData({ isFavorited: result.favorited });
      util.showToast(result.favorited ? '已收藏' : '已取消收藏');
    }
  },

  onLocate() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        util.showToast('已定位到当前位置');
      },
      fail: () => {
        util.showToast('定位失败，请检查权限');
      }
    });
  },

  onToggleLabels() {
    const newShowLabels = !this.data.showLabels;
    this.setData({ showLabels: newShowLabels });
    dataService.updateMapSettings({ showLabels: newShowLabels });
  },

  onZoomIn() {
    const newScale = Math.min(2, this.data.mapScale + 0.2);
    this.setData({ mapScale: newScale });
  },

  onZoomOut() {
    const newScale = Math.max(0.5, this.data.mapScale - 0.2);
    this.setData({ mapScale: newScale });
  },

  onMapTouchStart(e) {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      this.setData({
        touchStartX: touch.clientX,
        touchStartY: touch.clientY,
        lastTouchX: touch.clientX,
        lastTouchY: touch.clientY
      });
    }
  },

  onMapTouchMove(e) {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - this.data.lastTouchX;
      const deltaY = touch.clientY - this.data.lastTouchY;

      this.setData({
        mapOffsetX: this.data.mapOffsetX + deltaX,
        mapOffsetY: this.data.mapOffsetY + deltaY,
        lastTouchX: touch.clientX,
        lastTouchY: touch.clientY
      });
    }
  },

  onMapTouchEnd() {
  },

  onRoutePlanner() {
    util.navigateTo('/pages/route-planner/index');
  },

  onFreshmanGuide() {
    this.setData({
      showFreshmanGuide: true,
      showFreshmanPanel: true
    });
  },

  onARNavigation() {
    util.navigateTo('/pages/ar-navigation/index');
  },

  onMyFavorites() {
    const favorites = dataService.getMapFavorites();
    if (favorites.length === 0) {
      util.showToast('暂无收藏');
      return;
    }

    wx.showActionSheet({
      itemList: favorites.map(f => `${this.getCategoryIcon(f.poi.category)} ${f.name}`),
      success: (res) => {
        const selected = favorites[res.tapIndex];
        this.selectPOI(selected.poi);
      }
    });
  },

  onCloseFreshmanPanel() {
    this.setData({
      showFreshmanPanel: false,
      showFreshmanGuide: false
    });
  },

  onFlowStepTap(e) {
    const { item } = e.currentTarget.dataset;
    if (item.poiId) {
      const poi = dataService.getPOIDetail(item.poiId);
      if (poi) {
        this.selectPOI(poi);
      }
    }
  },

  showRoute(startId, endId) {
    const route = dataService.findRoute(startId, endId);
    if (route) {
      const routeLines = this.calculateRouteLines(route.path);
      this.setData({
        currentRoute: route,
        routeLines,
        selectedPOI: null
      });
    }
  },

  calculateRouteLines(path) {
    if (!path || path.length < 2) return [];

    const lines = [];
    const mapWidth = 350;
    const mapHeight = 500;

    for (let i = 0; i < path.length - 1; i++) {
      const p1 = path[i];
      const p2 = path[i + 1];

      const x1 = (p1.x / 100) * mapWidth;
      const y1 = (p1.y / 100) * mapHeight;
      const x2 = (p2.x / 100) * mapWidth;
      const y2 = (p2.y / 100) * mapHeight;

      const dx = x2 - x1;
      const dy = y2 - y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      lines.push({
        id: `line_${i}`,
        x1: p1.x,
        y1: p1.y,
        length,
        angle
      });
    }

    return lines;
  },

  onCloseRoute() {
    this.setData({
      currentRoute: null,
      routeLines: []
    });
  },

  onStartNavigation() {
    if (this.data.currentRoute) {
      wx.vibrateShort({ type: 'medium' });
      util.showToast('开始导航');
    }
  }
});
