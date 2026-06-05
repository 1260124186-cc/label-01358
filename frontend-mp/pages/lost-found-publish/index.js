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
    today: '',
    submitting: false
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

  onLocationChange(e) {
    const index = e.detail.value;
    const item = this.data.locations[index];
    this.setData({
      locationIndex: index,
      'formData.location': item.value,
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
