const app = getApp();
const fontsizeUtil = require('../../utils/fontsize');

Page({
  data: {
    darkMode: false,
    colorScheme: 'coral',
    fontSizeClass: 'font-size-standard',
    fontSize: 'standard',
    content: '',
    contactInfo: '',
    imageList: [],
    maxImages: 4,
    submitting: false,
    feedbackTypes: [
      { value: 'bug', label: 'Bug反馈' },
      { value: 'suggestion', label: '功能建议' },
      { value: 'complaint', label: '投诉' },
      { value: 'other', label: '其他' }
    ],
    selectedType: 'suggestion'
  },

  onLoad() {
    this.loadThemeState();
    this.loadFontState();
  },

  onShow() {
    this.loadThemeState();
    this.loadFontState();
  },

  loadThemeState() {
    const { isDark, colorScheme } = app.globalData;
    this.setData({
      darkMode: !!isDark,
      colorScheme: colorScheme || 'coral'
    });
  },

  loadFontState() {
    const fontInit = fontsizeUtil.init();
    this.setData({
      fontSizeClass: fontInit.className,
      fontSize: fontInit.size
    });
  },

  onTypeSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ selectedType: value });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  onContactInput(e) {
    this.setData({ contactInfo: e.detail.value });
  },

  onChooseImage() {
    const remaining = this.data.maxImages - this.data.imageList.length;
    if (remaining <= 0) return;

    wx.chooseMedia({
      count: remaining,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFiles.map(file => file.tempFilePath);
        this.setData({
          imageList: [...this.data.imageList, ...newImages].slice(0, this.data.maxImages)
        });
      }
    });
  },

  onDeleteImage(e) {
    const { index } = e.currentTarget.dataset;
    const imageList = [...this.data.imageList];
    imageList.splice(index, 1);
    this.setData({ imageList });
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    wx.previewImage({
      current: this.data.imageList[index],
      urls: this.data.imageList
    });
  },

  onSubmit() {
    if (!this.data.content.trim()) {
      wx.showToast({ title: '请输入反馈内容', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    setTimeout(() => {
      this.setData({ submitting: false });
      wx.showToast({ title: '提交成功，感谢反馈', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack({
          fail: () => {
            wx.switchTab({ url: '/pages/index/index' });
          }
        });
      }, 1200);
    }, 1000);
  }
});
