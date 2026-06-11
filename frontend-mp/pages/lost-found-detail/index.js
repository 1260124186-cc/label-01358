const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const fileUtil = require('../../utils/file');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    id: '',
    detail: null,
    isFavorite: false,
    locationPOI: null
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id });
      this.loadDetail();
    }
  },

  onShow() {
    if (this.data.id) {
      this.checkFavorite();
    }
  },

  loadDetail() {
    const detail = dataService.getLostFoundDetail(this.data.id);

    if (detail) {
      const formattedDetail = {
        ...detail,
        timeText: util.relativeTime(detail.createTime),
        itemTypeText: constants.getLabelByValue(constants.ITEM_TYPES, detail.itemType),
        locationText: constants.getLabelByValue(constants.LOCATIONS, detail.location) || detail.location
      };

      this.setData({ detail: formattedDetail });

      // 加载关联的 POI 信息
      this.loadLocationPOI(detail);

      // 添加到浏览历史
      dataService.addHistory(detail, 'lostFound');

      // 检查收藏状态
      this.checkFavorite();
    }
  },

  loadLocationPOI(detail) {
    let locationPOI = null;

    // 优先根据 POI ID 查找
    if (detail.locationPOIId) {
      locationPOI = dataService.getPOIDetail(detail.locationPOIId);
    }

    // 如果没有 POI ID，尝试根据地点名称匹配
    if (!locationPOI && detail.location) {
      const allPOIs = dataService.getPOIList();
      locationPOI = allPOIs.find(poi =>
        poi.name === detail.location ||
        poi.name.includes(detail.location) ||
        detail.location.includes(poi.name)
      );
    }

    if (locationPOI) {
      const categoryInfo = constants.POI_CATEGORY_MAP[locationPOI.category] || {};
      locationPOI = {
        ...locationPOI,
        categoryLabel: categoryInfo.label || '其他',
        categoryIcon: categoryInfo.icon || '📍',
        categoryColor: categoryInfo.color || '#6B7280'
      };
    }

    this.setData({ locationPOI });
  },

  onLocateOnMap(e) {
    const { poiId, location } = e.currentTarget.dataset;

    if (poiId) {
      util.navigateTo(`/pages/campus-map/index?poiId=${poiId}&action=focus`);
    } else if (location) {
      // 尝试根据地点名称查找 POI
      const allPOIs = dataService.getPOIList();
      const matchedPOI = allPOIs.find(poi =>
        poi.name === location ||
        poi.name.includes(location) ||
        location.includes(poi.name)
      );

      if (matchedPOI) {
        util.navigateTo(`/pages/campus-map/index?poiId=${matchedPOI.id}&action=focus`);
      } else {
        util.showToast('未找到对应地点');
      }
    }
  },

  onViewPOIDetail(e) {
    const { poiId } = e.currentTarget.dataset;
    if (poiId) {
      util.navigateTo(`/pages/poi-detail/index?id=${poiId}`);
    }
  },

  checkFavorite() {
    const isFavorite = dataService.isFavorite(this.data.id, 'lostFound');
    this.setData({ isFavorite });
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    const urls = this.data.detail.images;
    fileUtil.previewImage(urls, urls[index]);
  },

  onToggleFavorite() {
    // 检查登录状态
    if (!util.checkLogin()) {
      return;
    }

    const { id, isFavorite, detail } = this.data;

    if (isFavorite) {
      dataService.removeFavorite(id, 'lostFound');
      this.setData({ isFavorite: false });
      util.showSuccess('已取消收藏');
    } else {
      dataService.addFavorite(detail, 'lostFound');
      this.setData({ isFavorite: true });
      util.showSuccess('收藏成功');
    }
  },

  onCallPhone() {
    // 检查登录状态
    if (!util.checkLogin()) {
      return;
    }

    const { phone } = this.data.detail;
    wx.makePhoneCall({
      phoneNumber: phone,
      fail: () => {
        // 用户取消或失败
      }
    });
  }
});
