const dataService = require('../../services/data');
const util = require('../../utils/util');
const constants = require('../../config/constants');

Page({
  data: {
    startPOI: null,
    endPOI: null,
    travelMode: 'walk',
    route: null,
    routeLines: [],
    showStartPicker: false,
    showEndPicker: false,
    searchKeyword: '',
    filteredPOIs: [],
    quickRoutes: [],
    darkMode: false
  },

  onLoad(options) {
    const { startPOIId, endPOIId } = options;
    
    if (startPOIId) {
      const startPOI = this.getPOIWithInfo(startPOIId);
      this.setData({ startPOI });
    }
    if (endPOIId) {
      const endPOI = this.getPOIWithInfo(endPOIId);
      this.setData({ endPOI });
    }

    this.loadQuickRoutes();
    this.loadThemeState();
  },

  loadThemeState() {
    const app = getApp();
    const { isDark } = app.globalData;
    this.setData({ darkMode: isDark || false });
  },

  getPOIWithInfo(id) {
    const poi = dataService.getPOIDetail(id);
    if (poi) {
      const categoryInfo = constants.POI_CATEGORY_MAP[poi.category] || {};
      return {
        ...poi,
        categoryLabel: categoryInfo.label || '其他',
        categoryIcon: categoryInfo.icon || '📍',
        categoryColor: categoryInfo.color || '#6B7280'
      };
    }
    return null;
  },

  loadQuickRoutes() {
    try {
      const routes = dataService.getRoutes();
      const quickRoutes = routes.slice(0, 4).map(r => ({
        id: r.id,
        startName: r.startName,
        endName: r.endName,
        distance: r.distance,
        duration: r.duration,
        startPOIId: r.startPOIId,
        endPOIId: r.endPOIId
      }));
      this.setData({ quickRoutes });
    } catch (e) {
      console.error('加载常用路线失败:', e);
    }
  },

  onSelectStart() {
    this.setData({ 
      showStartPicker: true, 
      showEndPicker: false,
      searchKeyword: '',
      filteredPOIs: this.getAllPOIsWithInfo().map(p => ({
        ...p,
        isSelected: this.data.startPOI && this.data.startPOI.id === p.id
      }))
    });
  },

  onSelectEnd() {
    this.setData({ 
      showEndPicker: true, 
      showStartPicker: false,
      searchKeyword: '',
      filteredPOIs: this.getAllPOIsWithInfo().map(p => ({
        ...p,
        isSelected: this.data.endPOI && this.data.endPOI.id === p.id
      }))
    });
  },

  onClosePicker() {
    this.setData({ 
      showStartPicker: false, 
      showEndPicker: false,
      searchKeyword: ''
    });
  },

  onSearchInput(e) {
    const keyword = e.detail.value;
    const allPOIs = this.getAllPOIsWithInfo().map(p => ({
      ...p,
      isSelected: this.data.showStartPicker
        ? (this.data.startPOI && this.data.startPOI.id === p.id)
        : (this.data.endPOI && this.data.endPOI.id === p.id)
    }));
    const filtered = keyword 
      ? allPOIs.filter(p => 
          p.name.includes(keyword) || 
          p.categoryLabel.includes(keyword) ||
          (p.address && p.address.includes(keyword))
        )
      : allPOIs;
    
    this.setData({ 
      searchKeyword: keyword,
      filteredPOIs: filtered
    });
  },

  getAllPOIsWithInfo() {
    try {
      const allPOIs = dataService.getPOIList();
      return allPOIs.map(poi => {
        const categoryInfo = constants.POI_CATEGORY_MAP[poi.category] || {};
        return {
          ...poi,
          categoryLabel: categoryInfo.label || '其他',
          categoryIcon: categoryInfo.icon || '📍',
          categoryColor: categoryInfo.color || '#6B7280'
        };
      });
    } catch (e) {
      return [];
    }
  },

  onPOISelect(e) {
    const { poi } = e.currentTarget.dataset;
    const { showStartPicker } = this.data;

    if (showStartPicker) {
      this.setData({ 
        startPOI: poi,
        showStartPicker: false,
        route: null
      });
    } else {
      this.setData({ 
        endPOI: poi,
        showEndPicker: false,
        route: null
      });
    }
  },

  isSelectedPOI(poi) {
    const { startPOI, endPOI, showStartPicker } = this.data;
    if (showStartPicker) {
      return startPOI && startPOI.id === poi.id;
    }
    return endPOI && endPOI.id === poi.id;
  },

  onSwapPoints() {
    const { startPOI, endPOI } = this.data;
    this.setData({ 
      startPOI: endPOI,
      endPOI: startPOI,
      route: null
    });
  },

  onTravelModeChange(e) {
    const { mode } = e.currentTarget.dataset;
    this.setData({ 
      travelMode: mode,
      route: null
    });
  },

  onSearchRoute() {
    const { startPOI, endPOI, travelMode } = this.data;

    if (!startPOI) {
      util.showToast('请选择起点');
      return;
    }
    if (!endPOI) {
      util.showToast('请选择终点');
      return;
    }
    if (startPOI.id === endPOI.id) {
      util.showToast('起点和终点不能相同');
      return;
    }

    try {
      const route = dataService.findRoute(startPOI.id, endPOI.id);
      if (route) {
        const adjustedRoute = this.adjustRouteByMode(route, travelMode);
        const routeLines = this.calculateRouteLines(adjustedRoute.path);
        
        this.setData({ 
          route: adjustedRoute,
          routeLines
        });

        wx.pageScrollTo({ scrollTop: 0, duration: 300 });
      } else {
        util.showToast('未找到可行路线');
      }
    } catch (e) {
      console.error('规划路线失败:', e);
      util.showToast('路线规划失败');
    }
  },

  adjustRouteByMode(route, mode) {
    const modeMultiplier = {
      walk: 1,
      bike: 0.6,
      bus: 0.4
    };
    const multiplier = modeMultiplier[mode] || 1;
    
    const distanceValue = parseFloat(route.distance);
    const durationValue = parseFloat(route.duration);
    
    return {
      ...route,
      distance: (distanceValue * multiplier).toFixed(1) + '公里',
      duration: Math.round(durationValue * multiplier) + '分钟',
      mode,
      calories: mode === 'walk' ? Math.round(distanceValue * 60) : 
                mode === 'bike' ? Math.round(distanceValue * 40) : '5'
    };
  },

  calculateRouteLines(path) {
    if (!path || path.length < 2) return [];
    
    const lines = [];
    for (let i = 0; i < path.length - 1; i++) {
      const start = path[i];
      const end = path[i + 1];
      
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const width = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * 180 / Math.PI;
      
      lines.push({
        left: start.x,
        top: start.y,
        width: width,
        angle: angle
      });
    }
    
    return lines;
  },

  onQuickRouteTap(e) {
    const { route } = e.currentTarget.dataset;
    const startPOI = this.getPOIWithInfo(route.startPOIId);
    const endPOI = this.getPOIWithInfo(route.endPOIId);
    
    this.setData({ startPOI, endPOI }, () => {
      this.onSearchRoute();
    });
  },

  onViewOnMap() {
    const { startPOI, endPOI } = this.data;
    util.navigateTo(`/pages/campus-map/index?startPOIId=${startPOI.id}&endPOIId=${endPOI.id}&action=route`);
  },

  onStartNavigation() {
    util.showToast('模拟导航已启动');
    wx.vibrateShort({ type: 'light' });
  },

  onShareAppMessage() {
    const { startPOI, endPOI, route } = this.data;
    return {
      title: `路线规划 - ${startPOI ? startPOI.name : ''}到${endPOI ? endPOI.name : ''}`,
      path: `/pages/route-planner/index?startPOIId=${startPOI ? startPOI.id : ''}&endPOIId=${endPOI ? endPOI.id : ''}`
    };
  }
});
