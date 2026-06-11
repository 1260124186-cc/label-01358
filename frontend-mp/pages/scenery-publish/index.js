const constants = require('../../config/constants');
const util = require('../../utils/util');
const fileUtil = require('../../utils/file');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    imagePath: '',
    title: '',
    description: '',
    categories: [],
    selectedCategory: '',
    categoryIndex: 0,
    locations: [],
    selectedLocation: '',
    locationIndex: 0,
    seasons: [],
    selectedSeason: '',
    seasonIndex: 0,
    customLocation: '',
    showLocationPicker: false,
    showCategoryPicker: false,
    showSeasonPicker: false,
    submitting: false
  },

  onLoad() {
    const categories = constants.SCENERY_CATEGORIES.filter(c => c.value !== 'all');
    const locations = constants.SCENERY_LOCATIONS;
    const seasons = constants.SCENERY_SEASONS;
    
    this.setData({
      categories,
      locations,
      seasons,
      selectedCategory: categories[0] ? categories[0].value : '',
      selectedLocation: locations[0] ? locations[0].value : '',
      selectedSeason: seasons[0] ? seasons[0].value : ''
    });
  },

  onChooseImage() {
    fileUtil.chooseImage(1, ['compressed'], ['album', 'camera']).then(paths => {
      if (paths && paths.length > 0) {
        this.setData({
          imagePath: paths[0]
        });
      }
    }).catch(err => {
      console.error('选择图片失败:', err);
      util.showError('选择图片失败');
    });
  },

  onPreviewImage() {
    if (this.data.imagePath) {
      fileUtil.previewImage([this.data.imagePath]);
    }
  },

  onRemoveImage() {
    util.showConfirm('确定要删除这张图片吗？').then(confirm => {
      if (confirm) {
        this.setData({ imagePath: '' });
      }
    });
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  onDescInput(e) {
    this.setData({ description: e.detail.value });
  },

  onCategoryTap() {
    this.setData({ showCategoryPicker: true });
  },

  onCategorySelect(e) {
    const { value, index } = e.currentTarget.dataset;
    this.setData({
      selectedCategory: value,
      categoryIndex: index,
      showCategoryPicker: false
    });
  },

  onCloseCategoryPicker() {
    this.setData({ showCategoryPicker: false });
  },

  onLocationTap() {
    this.setData({ showLocationPicker: true });
  },

  onLocationSelect(e) {
    const { value, index } = e.currentTarget.dataset;
    this.setData({
      selectedLocation: value,
      locationIndex: index,
      customLocation: value === 'other' ? this.data.customLocation : '',
      showLocationPicker: false
    });
  },

  onCloseLocationPicker() {
    this.setData({ showLocationPicker: false });
  },

  onCustomLocationInput(e) {
    this.setData({ customLocation: e.detail.value });
  },

  onSeasonTap() {
    this.setData({ showSeasonPicker: true });
  },

  onSeasonSelect(e) {
    const { value, index } = e.currentTarget.dataset;
    this.setData({
      selectedSeason: value,
      seasonIndex: index,
      showSeasonPicker: false
    });
  },

  onCloseSeasonPicker() {
    this.setData({ showSeasonPicker: false });
  },

  preventBubble() {},

  onSubmit() {
    if (!util.checkLogin()) return;

    const { imagePath, title, description, selectedCategory, selectedLocation, customLocation, selectedSeason } = this.data;

    if (!imagePath) {
      util.showToast('请上传照片');
      return;
    }

    if (!title.trim()) {
      util.showToast('请输入标题');
      return;
    }

    if (!description.trim()) {
      util.showToast('请输入描述');
      return;
    }

    if (selectedLocation === 'other' && !customLocation.trim()) {
      util.showToast('请输入具体地点');
      return;
    }

    this.setData({ submitting: true });
    util.showLoading('提交中...');

    setTimeout(() => {
      util.hideLoading();
      this.setData({ submitting: false });
      
      util.showSuccess('提交成功，等待审核');
      
      setTimeout(() => {
        util.navigateBack();
      }, 1500);
    }, 1500);
  }
});
