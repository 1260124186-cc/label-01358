const dataService = require('../../services/data');
const constants = require('../../config/constants');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    typeOptions: constants.ALUMNI_POST_TYPES,
    form: {
      type: '',
      title: '',
      content: '',
      images: []
    },
    showTypePicker: false,
    submitting: false
  },

  onLoad() {
    wx.setNavigationBarTitle({ title: '发布动态' });
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`form.${field}`]: e.detail.value
    });
  },

  onTypePickerTap() {
    this.setData({ showTypePicker: true });
  },

  onTypeSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      'form.type': value,
      showTypePicker: false
    });
  },

  onClosePicker() {
    this.setData({ showTypePicker: false });
  },

  onChooseImage() {
    const currentCount = this.data.form.images.length;
    const maxCount = 9 - currentCount;
    if (maxCount <= 0) {
      wx.showToast({ title: '最多上传9张图片', icon: 'none' });
      return;
    }
    wx.chooseImage({
      count: maxCount,
      success: (res) => {
        const newImages = [...this.data.form.images, ...res.tempFilePaths];
        this.setData({ 'form.images': newImages });
      }
    });
  },

  onRemoveImage(e) {
    const { index } = e.currentTarget.dataset;
    const newImages = [...this.data.form.images];
    newImages.splice(index, 1);
    this.setData({ 'form.images': newImages });
  },

  validateForm() {
    const { type, title, content } = this.data.form;

    if (!type) {
      wx.showToast({ title: '请选择动态类型', icon: 'none' });
      return false;
    }
    if (!title.trim()) {
      wx.showToast({ title: '请输入标题', icon: 'none' });
      return false;
    }
    if (title.length < 5) {
      wx.showToast({ title: '标题至少5个字符', icon: 'none' });
      return false;
    }
    if (!content.trim()) {
      wx.showToast({ title: '请输入内容', icon: 'none' });
      return false;
    }
    if (content.length < 10) {
      wx.showToast({ title: '内容至少10个字符', icon: 'none' });
      return false;
    }

    return true;
  },

  onSubmit() {
    if (this.data.submitting) return;

    if (!this.validateForm()) return;

    this.setData({ submitting: true });

    const postData = {
      ...this.data.form,
      title: this.data.form.title.trim(),
      content: this.data.form.content.trim(),
      userName: '我',
      userAvatar: 'https://picsum.photos/seed/currentuser/200/200',
      graduationYear: '',
      college: '',
      company: ''
    };

    const result = dataService.publishAlumniPost(postData);

    if (result) {
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } else {
      wx.showToast({
        title: '发布失败',
        icon: 'none'
      });
      this.setData({ submitting: false });
    }
  },

  stopPropagation() {}
});
