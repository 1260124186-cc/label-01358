const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const fileUtil = require('../../utils/file');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    formData: {
      type: 'lost',
      title: '',
      itemType: '',
      location: '',
      locationPOIId: '',
      date: '',
      description: '',
      images: [],
      contact: '',
      phone: ''
    },
    itemTypes: constants.ITEM_TYPES,
    locations: constants.LOCATIONS,
    itemTypeIndex: -1,
    locationIndex: -1,
    itemTypeText: '',
    locationText: '',
    selectedPOI: null,
    today: '',
    submitting: false,
    showPOIPicker: false,
    poiList: [],
    poiSearchKeyword: ''
  },

  onShow() {
    const app = getApp();
    const { selectedPOI } = app.globalData;
    if (selectedPOI) {
      const categoryInfo = constants.POI_CATEGORY_MAP[selectedPOI.category] || {};
      const poiWithInfo = {
        ...selectedPOI,
        categoryLabel: categoryInfo.label || '其他',
        categoryIcon: categoryInfo.icon || '📍',
        categoryColor: categoryInfo.color || '#6B7280'
      };
      this.setData({
        selectedPOI: poiWithInfo,
        'formData.location': selectedPOI.name,
        'formData.locationPOIId': selectedPOI.id,
        locationText: selectedPOI.name
      });
      app.globalData.selectedPOI = null;
    }
  },

  onLoad() {
    const now = new Date();
    const today = util.formatTime(now, 'YYYY-MM-DD');
    this.setData({ today });
  },

  onTypeSelect(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({
      'formData.type': type
    });
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  onItemTypeChange(e) {
    const index = e.detail.value;
    const item = this.data.itemTypes[index];
    this.setData({
      itemTypeIndex: index,
      'formData.itemType': item.value,
      itemTypeText: item.label
    });
  },

  onSelectLocation() {
    this.setData({
      showPOIPicker: true,
      poiSearchKeyword: '',
      poiList: this.getPOIListWithInfo()
    });
  },

  onOpenMapPicker() {
    util.navigateTo('/pages/campus-map/index?action=selectPOI');
  },

  getPOIListWithInfo() {
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

  onPOISearchInput(e) {
    const keyword = e.detail.value;
    const allPOIs = this.getPOIListWithInfo();
    const filtered = keyword
      ? allPOIs.filter(p =>
          p.name.includes(keyword) ||
          p.categoryLabel.includes(keyword) ||
          (p.address && p.address.includes(keyword))
        )
      : allPOIs;

    this.setData({
      poiSearchKeyword: keyword,
      poiList: filtered
    });
  },

  onPOIPickerSelect(e) {
    const { poi } = e.currentTarget.dataset;
    this.setData({
      selectedPOI: poi,
      'formData.location': poi.name,
      'formData.locationPOIId': poi.id,
      locationText: poi.name,
      showPOIPicker: false
    });
    util.showToast(`已选择：${poi.name}`);
  },

  onClosePOIPicker() {
    this.setData({ showPOIPicker: false });
  },

  onViewPOIOnMap() {
    const { selectedPOI } = this.data;
    if (selectedPOI) {
      util.navigateTo(`/pages/campus-map/index?poiId=${selectedPOI.id}&action=focus`);
    }
  },

  onLocationChange(e) {
    const index = e.detail.value;
    const item = this.data.locations[index];
    this.setData({
      locationIndex: index,
      'formData.location': item.value,
      'formData.locationPOIId': '',
      selectedPOI: null,
      locationText: item.label
    });
  },

  onDateChange(e) {
    this.setData({
      'formData.date': e.detail.value
    });
  },

  async onChooseImage() {
    try {
      const tempFiles = await fileUtil.chooseImage(3 - this.data.formData.images.length);
      if (tempFiles.length > 0) {
        const images = [...this.data.formData.images, ...tempFiles];
        this.setData({
          'formData.images': images.slice(0, 3)
        });
      }
    } catch (e) {
      util.showError('选择图片失败');
    }
  },

  onDeleteImage(e) {
    const { index } = e.currentTarget.dataset;
    const images = [...this.data.formData.images];
    images.splice(index, 1);
    this.setData({
      'formData.images': images
    });
  },

  validateForm() {
    const { formData } = this.data;

    if (!formData.title.trim()) {
      util.showToast('请输入标题');
      return false;
    }

    if (!formData.itemType) {
      util.showToast('请选择物品类型');
      return false;
    }

    if (!formData.location) {
      util.showToast('请选择地点');
      return false;
    }

    if (!formData.date) {
      util.showToast('请选择日期');
      return false;
    }

    if (!formData.description.trim()) {
      util.showToast('请输入详细描述');
      return false;
    }

    if (!formData.contact.trim()) {
      util.showToast('请输入联系人');
      return false;
    }

    if (!formData.phone.trim()) {
      util.showToast('请输入联系电话');
      return false;
    }

    if (!util.isValidPhone(formData.phone)) {
      util.showToast('请输入正确的手机号');
      return false;
    }

    return true;
  },

  async onSubmit() {
    if (!this.validateForm()) return;

    this.setData({ submitting: true });

    try {
      // 模拟网络请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));

      // 保存图片到本地
      const savedImages = [];
      for (const tempPath of this.data.formData.images) {
        try {
          const fileName = fileUtil.generateFileName('jpg');
          const savedPath = await fileUtil.copyTempFile(tempPath, fileName);
          savedImages.push(savedPath);
        } catch (e) {
          savedImages.push(tempPath);
        }
      }

      const data = {
        ...this.data.formData,
        images: savedImages
      };

      const result = dataService.publishLostFound(data);

      if (result) {
        await util.showSuccess('发布成功');
        // 跳转到失物招领列表页
        wx.navigateBack({
          delta: 1,
          fail: () => {
            wx.switchTab({ url: '/pages/lost-found/index' });
          }
        });
      } else {
        util.showError('发布失败，请重试');
      }
    } catch (e) {
      util.showError('发布失败，请重试');
    } finally {
      this.setData({ submitting: false });
    }
  }
});
