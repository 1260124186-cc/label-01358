const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const fileUtil = require('../../utils/file');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    mode: 'publish',
    editId: '',
    formData: {
      title: '',
      category: '',
      price: '',
      originalPrice: '',
      description: '',
      images: [],
      contact: '',
      phone: '',
      latitude: null,
      longitude: null,
      address: ''
    },
    categories: constants.MARKET_CATEGORIES,
    categoryIndex: -1,
    categoryText: '',
    submitting: false,
    marketLocations: constants.MARKET_LOCATIONS,
    showLocationPicker: false,
    locationTip: '',
    formattedLatitude: '',
    formattedLongitude: ''
  },

  onLoad(options) {
    if (options.mode === 'edit' && options.id) {
      this.setData({ mode: 'edit', editId: options.id });
      wx.setNavigationBarTitle({ title: '编辑二手商品' });
      this.loadEditData(options.id);
    }
  },

  loadEditData(id) {
    const item = dataService.getMarketDetail(id);
    if (!item) {
      util.showError('商品不存在');
      setTimeout(() => wx.navigateBack(), 1000);
      return;
    }

    const categoryIndex = this.data.categories.findIndex(c => c.value === item.category);
    const categoryText = categoryIndex > -1 ? this.data.categories[categoryIndex].label : '';

    this.setData({
      formData: {
        title: item.title || '',
        category: item.category || '',
        price: item.price !== undefined ? String(item.price) : '',
        originalPrice: item.originalPrice !== undefined ? String(item.originalPrice) : '',
        description: item.description || '',
        images: item.images || [],
        contact: item.contact || '',
        phone: item.phone || '',
        latitude: item.latitude !== undefined ? item.latitude : null,
        longitude: item.longitude !== undefined ? item.longitude : null,
        address: item.address || ''
      },
      categoryIndex,
      categoryText,
      formattedLatitude: item.latitude ? item.latitude.toFixed(4) : '',
      formattedLongitude: item.longitude ? item.longitude.toFixed(4) : ''
    });
  },

  onChooseLocation() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] === false) {
          this.showFallbackPicker();
          return;
        }
        wx.authorize({
          scope: 'scope.userLocation',
          success: () => {
            this.openChooseLocation();
          },
          fail: () => {
            this.showFallbackPicker();
          }
        });
      },
      fail: () => {
        this.showFallbackPicker();
      }
    });
  },

  updateFormattedCoords(latitude, longitude) {
    this.setData({
      formattedLatitude: latitude ? latitude.toFixed(4) : '',
      formattedLongitude: longitude ? longitude.toFixed(4) : ''
    });
  },

  openChooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          'formData.latitude': res.latitude,
          'formData.longitude': res.longitude,
          'formData.address': res.address || res.name,
          locationTip: ''
        });
        this.updateFormattedCoords(res.latitude, res.longitude);
      },
      fail: (err) => {
        if (err.errMsg && err.errMsg.includes('auth deny')) {
          this.showFallbackPicker();
        }
      }
    });
  },

  showFallbackPicker() {
    this.setData({
      showLocationPicker: true,
      locationTip: '您未授权定位，可选择常用地点'
    });
  },

  onHideLocationPicker() {
    this.setData({ showLocationPicker: false });
  },

  onLocationSelect(e) {
    const { value } = e.currentTarget.dataset;
    const location = this.data.marketLocations.find(l => l.value === value);
    if (location) {
      this.setData({
        'formData.latitude': location.latitude,
        'formData.longitude': location.longitude,
        'formData.address': location.label,
        showLocationPicker: false,
        locationTip: ''
      });
      this.updateFormattedCoords(location.latitude, location.longitude);
    }
  },

  onClearLocation() {
    this.setData({
      'formData.latitude': null,
      'formData.longitude': null,
      'formData.address': '',
      locationTip: '',
      formattedLatitude: '',
      formattedLongitude: ''
    });
  },

  stopPropagation() {
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  onCategoryChange(e) {
    const index = e.detail.value;
    const item = this.data.categories[index];
    this.setData({
      categoryIndex: index,
      'formData.category': item.value,
      categoryText: item.label
    });
  },

  async onChooseImage() {
    try {
      const tempFiles = await fileUtil.chooseImage(9 - this.data.formData.images.length);
      if (tempFiles.length > 0) {
        const images = [...this.data.formData.images, ...tempFiles];
        this.setData({
          'formData.images': images.slice(0, 9)
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

    if (formData.images.length === 0) {
      util.showToast('请至少上传一张图片');
      return false;
    }

    if (!formData.title.trim()) {
      util.showToast('请输入商品名称');
      return false;
    }

    if (!formData.category) {
      util.showToast('请选择商品分类');
      return false;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      util.showToast('请输入有效的商品价格');
      return false;
    }

    if (!formData.description.trim()) {
      util.showToast('请输入商品描述');
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
      await new Promise(resolve => setTimeout(resolve, 800));

      const savedImages = [];
      for (const tempPath of this.data.formData.images) {
        try {
          if (tempPath.startsWith('http') || tempPath.startsWith('wxfile') || tempPath.startsWith('/')) {
            savedImages.push(tempPath);
          } else {
            const fileName = fileUtil.generateFileName('jpg');
            const savedPath = await fileUtil.copyTempFile(tempPath, fileName);
            savedImages.push(savedPath);
          }
        } catch (e) {
          savedImages.push(tempPath);
        }
      }

      const data = {
        ...this.data.formData,
        images: savedImages,
        price: parseFloat(this.data.formData.price),
        originalPrice: this.data.formData.originalPrice ? parseFloat(this.data.formData.originalPrice) : null
      };

      let result;
      let successMessage;

      if (this.data.mode === 'edit') {
        result = dataService.updateMarketItem(this.data.editId, data);
        successMessage = '保存成功';
      } else {
        result = dataService.publishMarketItem(data);
        successMessage = '发布成功';
      }

      if (result) {
        await util.showSuccess(successMessage);
        wx.navigateBack({
          delta: 1,
          fail: () => {
            wx.switchTab({ url: '/pages/market/index' });
          }
        });
      } else {
        util.showError(this.data.mode === 'edit' ? '保存失败，请重试' : '发布失败，请重试');
      }
    } catch (e) {
      util.showError(this.data.mode === 'edit' ? '保存失败，请重试' : '发布失败，请重试');
    } finally {
      this.setData({ submitting: false });
    }
  }
});
