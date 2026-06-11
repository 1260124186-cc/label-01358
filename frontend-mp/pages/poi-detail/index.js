const dataService = require('../../services/data');
const util = require('../../utils/util');
const constants = require('../../config/constants');

Page({
  data: {
    poiId: '',
    poi: {},
    isFavorite: false,
    nearbyPOIs: [],
    darkMode: false
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.setData({ poiId: id });
      this.loadPOIDetail(id);
    }
    this.loadThemeState();
  },

  loadThemeState() {
    const app = getApp();
    const { isDark } = app.globalData;
    this.setData({ darkMode: isDark || false });
  },

  loadPOIDetail(id) {
    try {
      const poi = dataService.getPOIDetail(id);
      if (poi) {
        const categoryInfo = constants.POI_CATEGORY_MAP[poi.category] || {};
        const poiWithInfo = {
          ...poi,
          categoryLabel: categoryInfo.label || '其他',
          categoryIcon: categoryInfo.icon || '📍',
          categoryColor: categoryInfo.color || '#6B7280'
        };

        const isFavorite = dataService.isMapFavorite(id);
        const nearbyPOIs = this.getNearbyPOIs(poi);

        this.setData({
          poi: poiWithInfo,
          isFavorite,
          nearbyPOIs
        });
      } else {
        util.showToast('点位不存在');
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    } catch (e) {
      console.error('加载POI详情失败:', e);
      util.showToast('加载失败');
    }
  },

  getNearbyPOIs(currentPOI) {
    try {
      const allPOIs = dataService.getPOIList();
      const nearby = allPOIs
        .filter(p => p.id !== currentPOI.id)
        .map(p => {
          const distance = Math.sqrt(
            Math.pow(p.x - currentPOI.x, 2) + 
            Math.pow(p.y - currentPOI.y, 2)
          );
          const categoryInfo = constants.POI_CATEGORY_MAP[p.category] || {};
          return {
            ...p,
            distance,
            distanceText: distance < 0.1 ? '约50米' : 
                         distance < 0.2 ? '约100米' :
                         distance < 0.3 ? '约150米' : '约200米+',
            categoryIcon: categoryInfo.icon || '📍',
            categoryColor: categoryInfo.color || '#6B7280'
          };
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 6);
      
      return nearby;
    } catch (e) {
      return [];
    }
  },

  onToggleFavorite() {
    try {
      const result = dataService.toggleMapFavorite(this.data.poiId);
      this.setData({ isFavorite: result });
      util.showToast(result ? '已收藏' : '已取消收藏');
    } catch (e) {
      console.error('收藏失败:', e);
      util.showToast('操作失败');
    }
  },

  onViewOnMap() {
    util.navigateTo(`/pages/campus-map/index?poiId=${this.data.poiId}&action=focus`);
  },

  onNavigateHere() {
    util.navigateTo(`/pages/route-planner/index?endPOIId=${this.data.poiId}`);
  },

  onRouteFromHere() {
    util.navigateTo(`/pages/route-planner/index?startPOIId=${this.data.poiId}`);
  },

  onNearbyTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/poi-detail/index?id=${id}`);
  },

  onShareAppMessage() {
    const { poi } = this.data;
    return {
      title: `校园地图 - ${poi.name}`,
      path: `/pages/poi-detail/index?id=${poi.id}`
    };
  }
});
