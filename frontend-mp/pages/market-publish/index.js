const dataService = require('../../services/data');
const config = require('../../config/index');
const util = require('../../utils/util');
const fileUtil = require('../../utils/file');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    formData: {
      title: '',
      category: '',
      price: '',
      originalPrice: '',
      description: '',
      images: [],
      contact: '',
      phone: ''
    },
    categories: config.MARKET_CATEGORIES,
    categoryIndex: -1,
    categoryText: '',
    submitting: false
  },

  onLoad() {
    // 页面初始化
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
      // 模拟网络请求延迟
      await new Promise(resolve => setTimeout(resolve, 800));

      // 保存图片到本地文件系统
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
        images: savedImages,
        price: parseFloat(this.data.formData.price),
        originalPrice: this.data.formData.originalPrice ? parseFloat(this.data.formData.originalPrice) : null
      };

      const result = dataService.publishMarketItem(data);

      if (result) {
        await util.showSuccess('发布成功');
        // 跳转到二手市场列表页
        wx.navigateBack({
          delta: 1,
          fail: () => {
            wx.switchTab({ url: '/pages/market/index' });
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
