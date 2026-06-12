const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const fileUtil = require('../../utils/file');
const aiService = require('../../services/aiImageRecognition');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    mode: 'publish',
    editId: '',
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
    poiSearchKeyword: '',
    enableAIRecognition: true,
    aiRecognizing: false,
    aiRecognitionResult: null,
    aiTags: {
      colors: [],
      brands: [],
      category: null
    },
    showAIPanel: false,
    aiRecognitionProgress: 0
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

  onLoad(options) {
    const now = new Date();
    const today = util.formatTime(now, 'YYYY-MM-DD');
    this.setData({ today });

    if (options.mode === 'edit' && options.id) {
      this.setData({ mode: 'edit', editId: options.id });
      wx.setNavigationBarTitle({ title: '编辑失物招领' });
      this.loadEditData(options.id);
    }
  },

  loadEditData(id) {
    const item = dataService.getLostFoundDetail(id);
    if (!item) {
      util.showError('信息不存在');
      setTimeout(() => wx.navigateBack(), 1000);
      return;
    }

    const itemTypeIndex = this.data.itemTypes.findIndex(t => t.value === item.itemType);
    const locationIndex = this.data.locations.findIndex(l => l.value === item.location);
    const itemTypeText = itemTypeIndex > -1 ? this.data.itemTypes[itemTypeIndex].label : '';
    const locationText = locationIndex > -1 ? this.data.locations[locationIndex].label : (item.location || '');

    this.setData({
      formData: {
        type: item.type || 'lost',
        title: item.title || '',
        itemType: item.itemType || '',
        location: item.location || '',
        locationPOIId: item.locationPOIId || '',
        date: item.date || '',
        description: item.description || '',
        images: item.images || [],
        contact: item.contact || '',
        phone: item.phone || ''
      },
      aiTags: item.aiTags || { colors: [], brands: [], category: null },
      itemTypeIndex,
      locationIndex,
      itemTypeText,
      locationText
    });
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
        const newImages = images.slice(0, 3);
        this.setData({
          'formData.images': newImages
        });

        if (this.data.enableAIRecognition && newImages.length > 0) {
          this.startAIRecognition(newImages);
        }
      }
    } catch (e) {
      util.showError('选择图片失败');
    }
  },

  onToggleAIRecognition() {
    this.setData({
      enableAIRecognition: !this.data.enableAIRecognition
    });

    if (this.data.enableAIRecognition && this.data.formData.images.length > 0 && !this.data.aiTags.colors.length) {
      this.startAIRecognition(this.data.formData.images);
    }
  },

  onToggleAIPanel() {
    this.setData({
      showAIPanel: !this.data.showAIPanel
    });
  },

  async startAIRecognition(images) {
    if (!images || images.length === 0) {
      util.showToast('请先上传图片');
      return;
    }

    this.setData({
      aiRecognizing: true,
      aiRecognitionProgress: 0,
      aiRecognitionResult: null
    });

    try {
      const progressInterval = setInterval(() => {
        this.setData({
          aiRecognitionProgress: Math.min(90, this.data.aiRecognitionProgress + 10)
        });
      }, 200);

      const result = await aiService.recognizeMultipleImages(images, this.data.formData);

      clearInterval(progressInterval);
      this.setData({
        aiRecognitionProgress: 100
      });

      if (result.success) {
        const newTags = {
          colors: result.tags.colors || [],
          brands: result.tags.brands || [],
          category: result.tags.category || null
        };

        let updates = {
          aiRecognizing: false,
          aiRecognitionResult: result,
          aiTags: newTags,
          showAIPanel: true
        };

        if (newTags.category && !this.data.formData.itemType) {
          const itemTypeIndex = this.data.itemTypes.findIndex(t => t.value === newTags.category.value);
          if (itemTypeIndex > -1) {
            updates['formData.itemType'] = newTags.category.value;
            updates.itemTypeIndex = itemTypeIndex;
            updates.itemTypeText = newTags.category.label;
          }
        }

        this.setData(updates);
        util.showSuccess('AI识别完成');
      } else {
        this.setData({
          aiRecognizing: false
        });
        util.showError(result.message || 'AI识别失败');
      }
    } catch (e) {
      this.setData({
        aiRecognizing: false
      });
      util.showError('AI识别失败，请重试');
    }
  },

  onReRecognize() {
    if (this.data.formData.images.length > 0) {
      this.startAIRecognition(this.data.formData.images);
    }
  },

  onApplyTag(e) {
    const { type, value, label } = e.currentTarget.dataset;

    if (type === 'category' && value) {
      const itemTypeIndex = this.data.itemTypes.findIndex(t => t.value === value);
      if (itemTypeIndex > -1) {
        this.setData({
          'formData.itemType': value,
          itemTypeIndex,
          itemTypeText: label
        });
        util.showToast(`已应用物品类型：${label}`);
      }
    } else if (type === 'color' || type === 'brand') {
      const currentDesc = this.data.formData.description || '';
      const tagText = label;
      if (!currentDesc.includes(tagText)) {
        const newDesc = currentDesc ? `${currentDesc} ${tagText}` : tagText;
        this.setData({
          'formData.description': newDesc
        });
        util.showToast(`已添加到描述：${label}`);
      } else {
        util.showToast('标签已在描述中');
      }
    }
  },

  onClearAITags() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有AI识别标签吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            aiTags: { colors: [], brands: [], category: null },
            aiRecognitionResult: null
          });
          util.showToast('已清除标签');
        }
      }
    });
  },

  onDeleteImage(e) {
    const { index } = e.currentTarget.dataset;
    const images = [...this.data.formData.images];
    images.splice(index, 1);
    this.setData({
      'formData.images': images
    });

    if (images.length > 0 && this.data.enableAIRecognition) {
      this.startAIRecognition(images);
    } else if (images.length === 0) {
      this.setData({
        aiTags: { colors: [], brands: [], category: null },
        aiRecognitionResult: null
      });
    }
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
        aiTags: this.data.aiTags
      };

      let result;
      let successMessage;

      if (this.data.mode === 'edit') {
        result = dataService.updateLostFound(this.data.editId, data);
        successMessage = '保存成功';
      } else {
        result = dataService.publishLostFound(data);
        successMessage = '发布成功';
      }

      if (result) {
        await util.showSuccess(successMessage);
        wx.navigateBack({
          delta: 1,
          fail: () => {
            wx.switchTab({ url: '/pages/lost-found/index' });
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
