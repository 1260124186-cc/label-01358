const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    compareList: [],
    facilityMap: {},
    allFacilities: constants.RENTAL_FACILITIES,
    compareFields: [
      { key: 'rentText', label: '月租金', type: 'price' },
      { key: 'depositText', label: '押金', type: 'text' },
      { key: 'houseTypeText', label: '户型', type: 'text' },
      { key: 'area', label: '面积(㎡)', type: 'number' },
      { key: 'distanceText', label: '距离学校', type: 'text' },
      { key: 'rentTypeText', label: '出租方式', type: 'text' },
      { key: 'locationTypeText', label: '位置类型', type: 'text' },
      { key: 'genderText', label: '性别要求', type: 'text' },
      { key: 'leaseTermText', label: '租期', type: 'text' },
      { key: 'publisherTypeText', label: '发布身份', type: 'text' },
      { key: 'publisherTypeColor', label: '身份颜色', type: 'color', hidden: true },
      { key: 'floor', label: '楼层', type: 'text' },
      { key: 'orientation', label: '朝向', type: 'text' },
      { key: 'address', label: '详细地址', type: 'text' }
    ]
  },

  onLoad() {
    this.loadCompareList();
  },

  onShow() {
    this.loadCompareList();
  },

  loadCompareList() {
    const list = dataService.getCompareList();

    const facilityMap = {};
    this.data.allFacilities.forEach(f => {
      facilityMap[f.value] = f;
    });

    const formattedList = list.map(item => {
      const publisherTypeInfo = constants.RENTAL_PUBLISHER_TYPES.find(t => t.value === item.publisherType);
      const facilityObj = {};
      (item.facilities || []).forEach(f => {
        facilityObj[f] = true;
      });
      return {
        ...item,
        rentText: util.formatPrice(item.rent),
        depositText: util.formatPrice(item.deposit),
        locationTypeText: constants.getLabelByValue(constants.RENTAL_LOCATION_TYPES, item.locationType),
        houseTypeText: constants.getLabelByValue(constants.RENTAL_HOUSE_TYPES, item.houseType),
        rentTypeText: constants.getLabelByValue(constants.RENTAL_RENT_TYPES, item.rentType),
        genderText: constants.getLabelByValue(constants.RENTAL_GENDER_REQUIREMENTS, item.genderRequirement),
        leaseTermText: constants.getLabelByValue(constants.RENTAL_LEASE_TYPES, item.leaseTerm),
        publisherTypeText: publisherTypeInfo ? publisherTypeInfo.label : '',
        publisherTypeColor: publisherTypeInfo ? publisherTypeInfo.color : '',
        distanceText: item.distance < 1000 ? item.distance + '米' : (item.distance / 1000).toFixed(1) + '公里',
        facilityObj
      };
    });

    const visibleFields = this.data.compareFields.filter(f => !f.hidden);

    formattedList.forEach(house => {
      house.bestClassMap = {};
      house.fieldValues = {};
      visibleFields.forEach(field => {
        const rawVal = house[field.key];
        house.fieldValues[field.key] = (rawVal === undefined || rawVal === null || rawVal === '') ? '-' : rawVal;
        house.bestClassMap[field.key] = this._calcBest(field, house, formattedList);
      });
    });

    this.setData({
      compareList: formattedList,
      facilityMap,
      visibleFields
    });
  },

  _calcBest(field, house, list) {
    if (field.type !== 'number' && field.type !== 'price') return '';
    if (list.length < 2) return '';

    const rawKey = field.key.replace('Text', '');
    const values = list.map(h => {
      const val = h[rawKey];
      return typeof val === 'number' ? val : (parseFloat(val) || 0);
    });

    const currentRaw = house[rawKey];
    const current = typeof currentRaw === 'number' ? currentRaw : (parseFloat(currentRaw) || 0);

    if (field.key === 'rentText' || field.key === 'depositText') {
      return current === Math.min(...values) ? 'best' : '';
    }
    if (field.key === 'area') {
      return current === Math.max(...values) ? 'best' : '';
    }
    return '';
  },

  onRemoveCompare(e) {
    const { id } = e.currentTarget.dataset;
    dataService.removeFromCompare(id);
    this.loadCompareList();
    util.showToast('已移出对比');
  },

  onClearCompare() {
    if (this.data.compareList.length === 0) return;

    wx.showModal({
      title: '清空对比',
      content: '确定要清空所有对比房源吗？',
      success: (res) => {
        if (res.confirm) {
          dataService.clearCompareList();
          this.loadCompareList();
          util.showToast('已清空');
        }
      }
    });
  },

  onViewDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/rental-detail/index?id=${id}`
    });
  },

  onPreviewImage(e) {
    const { index, houseIndex } = e.currentTarget.dataset;
    const house = this.data.compareList[houseIndex];
    if (house && house.images && house.images.length > 0) {
      const fileUtil = require('../../utils/file');
      fileUtil.previewImage(house.images, house.images[index]);
    }
  },

  getFieldValue(house, field) {
    if (field.hidden) return '';
    const value = house[field.key];
    if (value === undefined || value === null || value === '') {
      return '-';
    }
    return value;
  },

  getBestClass(field, house, list) {
    if (field.type !== 'number' && field.type !== 'price') return '';
    if (list.length < 2) return '';

    const values = list.map(h => {
      const val = h[field.key.replace('Text', '')];
      return typeof val === 'number' ? val : parseFloat(val) || 0;
    });

    const currentVal = house[field.key.replace('Text', '')];
    const current = typeof currentVal === 'number' ? currentVal : parseFloat(currentVal) || 0;

    if (field.key === 'rentText' || field.key === 'depositText') {
      return current === Math.min(...values) ? 'best' : '';
    }

    if (field.key === 'area') {
      return current === Math.max(...values) ? 'best' : '';
    }

    return '';
  },

  onShareAppMessage() {
    return {
      title: '房源对比',
      path: '/pages/rental-compare/index'
    };
  },

  stopPropagation() {}
});
