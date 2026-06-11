const dataService = require('../../services/data');
const util = require('../../utils/util');
const constants = require('../../config/constants');

const DIRECTIONS = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];

Page({
  data: {
    cameraAuthorized: true,
    currentDirection: '南',
    deviceAngle: 180,
    arPOIs: [],
    nearbyPOIs: [],
    targetPOI: null,
    guideArrowAngle: 0,
    panelExpanded: true
  },

  onLoad(options) {
    const { targetId } = options;
    this.loadOrientationData();
    
    if (targetId) {
      const targetPOI = this.findPOIById(targetId);
      if (targetPOI) {
        this.setData({ targetPOI });
        this.updateGuideArrow();
      }
    }

    this.startDirectionSimulation();
  },

  onUnload() {
    if (this.directionTimer) {
      clearInterval(this.directionTimer);
    }
  },

  loadOrientationData() {
    try {
      const orientationGuide = dataService.getOrientationGuide();
      const allPOIs = dataService.getPOIList();

      const arPOIs = orientationGuide.map((guide, index) => {
        const poi = allPOIs.find(p => p.id === guide.poiId);
        if (!poi) return null;

        const categoryInfo = constants.POI_CATEGORY_MAP[poi.category] || {};
        return {
          id: poi.id,
          name: poi.name,
          categoryIcon: categoryInfo.icon || '📍',
          categoryColor: categoryInfo.color || '#6B7280',
          direction: guide.direction,
          distance: guide.distance,
          angle: guide.angle,
          visible: true,
          position: this.calculateARPosition(guide.angle, guide.distance)
        };
      }).filter(Boolean);

      const nearbyPOIs = arPOIs.map(poi => ({ ...poi }));

      this.setData({ arPOIs, nearbyPOIs });
    } catch (e) {
      console.error('加载AR导览数据失败:', e);
    }
  },

  findPOIById(id) {
    const { arPOIs } = this.data;
    return arPOIs.find(p => p.id === id);
  },

  calculateARPosition(angle, distance) {
    const normalizedAngle = ((angle % 360) + 360) % 360;
    const distanceFactor = Math.min(parseFloat(distance) / 500, 1);

    const xOffset = Math.sin(normalizedAngle * Math.PI / 180) * (50 * distanceFactor);
    const yOffset = Math.cos(normalizedAngle * Math.PI / 180) * (30 * distanceFactor);

    return {
      x: 50 + xOffset,
      y: 40 - yOffset
    };
  },

  startDirectionSimulation() {
    this.directionTimer = setInterval(() => {
      const { deviceAngle } = this.data;
      const newAngle = (deviceAngle + Math.random() * 4 - 2 + 360) % 360;
      const directionIndex = Math.round(newAngle / 45) % 8;

      const arPOIs = this.data.arPOIs.map(poi => {
        const relativeAngle = poi.angle - newAngle;
        const visible = Math.abs(relativeAngle) < 60 || Math.abs(relativeAngle) > 300;
        return {
          ...poi,
          visible,
          position: this.calculateARPosition(relativeAngle, poi.distance)
        };
      });

      this.setData({
        deviceAngle: Math.round(newAngle),
        currentDirection: DIRECTIONS[directionIndex],
        arPOIs
      });

      this.updateGuideArrow();
    }, 1000);
  },

  updateGuideArrow() {
    const { targetPOI, deviceAngle } = this.data;
    if (!targetPOI) return;

    const relativeAngle = targetPOI.angle - deviceAngle;
    this.setData({ guideArrowAngle: relativeAngle });
  },

  onPOITap(e) {
    const { id } = e.currentTarget.dataset;
    const targetPOI = this.findPOIById(id);
    if (targetPOI) {
      this.setData({ targetPOI });
      this.updateGuideArrow();
      wx.vibrateShort({ type: 'light' });
    }
  },

  onSelectTarget(e) {
    const { id } = e.currentTarget.dataset;
    const targetPOI = this.findPOIById(id);
    if (targetPOI) {
      this.setData({ targetPOI });
      this.updateGuideArrow();
      util.showToast(`已选择：${targetPOI.name}`);
    }
  },

  onTogglePanel() {
    this.setData({ panelExpanded: !this.data.panelExpanded });
  },

  onRotateLeft() {
    const { deviceAngle } = this.data;
    const newAngle = (deviceAngle - 15 + 360) % 360;
    this.rotateTo(newAngle);
  },

  onRotateRight() {
    const { deviceAngle } = this.data;
    const newAngle = (deviceAngle + 15) % 360;
    this.rotateTo(newAngle);
  },

  onResetDirection() {
    this.rotateTo(180);
    util.showToast('方向已校准');
    wx.vibrateShort({ type: 'medium' });
  },

  rotateTo(angle) {
    const directionIndex = Math.round(angle / 45) % 8;
    const arPOIs = this.data.arPOIs.map(poi => {
      const relativeAngle = poi.angle - angle;
      const visible = Math.abs(relativeAngle) < 60 || Math.abs(relativeAngle) > 300;
      return {
        ...poi,
        visible,
        position: this.calculateARPosition(relativeAngle, poi.distance)
      };
    });

    this.setData({
      deviceAngle: angle,
      currentDirection: DIRECTIONS[directionIndex],
      arPOIs
    });

    this.updateGuideArrow();
  },

  onExitAR() {
    wx.navigateBack();
  },

  onAuthorize() {
    util.showToast('模拟授权成功');
    this.setData({ cameraAuthorized: true });
  },

  onShareAppMessage() {
    const { targetPOI } = this.data;
    return {
      title: targetPOI ? `AR导览 - ${targetPOI.name}` : 'AR校园导览',
      path: targetPOI 
        ? `/pages/ar-navigation/index?targetId=${targetPOI.id}`
        : '/pages/ar-navigation/index'
    };
  }
});
