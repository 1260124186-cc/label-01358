const util = require('../../utils/util.js');
const userService = require('../../services/userService.js');
const app = getApp();

Page({
  data: {
    darkMode: false,
    loading: false,
    submitting: false,
    targetType: '',
    targetId: '',
    targetInfo: null,
    reportTypes: [],
    selectedType: '',
    selectedRequiresProof: false,
    description: '',
    images: [],
    maxImages: 3,
    contactInfo: '',
    anonymous: false
  },

  onLoad(options) {
    const { targetType, targetId } = options;
    
    this.setData({
      darkMode: app.globalData.darkMode || false,
      targetType,
      targetId,
      reportTypes: userService.REPORT_TYPES
    });

    this.loadTargetInfo();
  },

  loadTargetInfo() {
    const { targetType, targetId } = this.data;
    let targetInfo = null;

    try {
      if (targetType === 'lostFound') {
        const lostFoundList = wx.getStorageSync('lostFoundList') || [];
        targetInfo = lostFoundList.find(item => item.id === targetId);
        if (targetInfo) {
          targetInfo = {
            type: '失物招领',
            title: targetInfo.title,
            author: targetInfo.authorName || '匿名用户'
          };
        }
      } else if (targetType === 'market') {
        const marketList = wx.getStorageSync('marketList') || [];
        targetInfo = marketList.find(item => item.id === targetId);
        if (targetInfo) {
          targetInfo = {
            type: '二手商品',
            title: targetInfo.title,
            author: targetInfo.sellerName || '匿名用户'
          };
        }
      } else if (targetType === 'forum') {
        const forumList = wx.getStorageSync('forumList') || [];
        const allPosts = [];
        forumList.forEach(category => {
          if (category.posts) {
            allPosts.push(...category.posts);
          }
        });
        targetInfo = allPosts.find(item => item.id === targetId);
        if (targetInfo) {
          targetInfo = {
            type: '论坛帖子',
            title: targetInfo.title,
            author: targetInfo.authorName || '匿名用户'
          };
        }
      } else if (targetType === 'comment') {
        targetInfo = {
          type: '评论',
          title: '用户评论',
          author: '匿名用户'
        };
      } else if (targetType === 'user') {
        const user = userService.getUserById(targetId);
        if (user) {
          targetInfo = {
            type: '用户',
            title: user.nickName,
            author: user.nickName
          };
        }
      }

      if (targetInfo) {
        this.setData({ targetInfo });
      } else {
        util.showToast('未找到举报对象');
        setTimeout(() => wx.navigateBack(), 1500);
      }
    } catch (error) {
      console.error('加载举报对象信息失败:', error);
      util.showToast('加载失败');
    }
  },

  onTypeSelect(e) {
    const { value } = e.currentTarget.dataset;
    const typeInfo = this.data.reportTypes.find(t => t.value === value);
    this.setData({ 
      selectedType: value,
      selectedRequiresProof: typeInfo ? typeInfo.requiresProof : false
    });
  },

  onDescriptionInput(e) {
    this.setData({ description: e.detail.value });
  },

  onContactInput(e) {
    this.setData({ contactInfo: e.detail.value });
  },

  onAnonymousChange(e) {
    this.setData({ anonymous: e.detail.value });
  },

  chooseImage() {
    const { images, maxImages } = this.data;
    const remaining = maxImages - images.length;
    
    if (remaining <= 0) {
      util.showToast(`最多只能上传${maxImages}张图片`);
      return;
    }

    wx.chooseMedia({
      count: remaining,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = res.tempFiles.map(file => file.tempFilePath);
        this.setData({
          images: [...images, ...newImages]
        });
      },
      fail: () => {
        util.showToast('选择图片失败');
      }
    });
  },

  removeImage(e) {
    const { index } = e.currentTarget.dataset;
    const { images } = this.data;
    images.splice(index, 1);
    this.setData({ images });
  },

  previewImage(e) {
    const { index } = e.currentTarget.dataset;
    const { images } = this.data;
    wx.previewImage({
      current: images[index],
      urls: images
    });
  },

  validateForm() {
    const { selectedType, description, selectedRequiresProof, images } = this.data;

    if (!selectedType) {
      util.showToast('请选择举报类型');
      return false;
    }

    if (!description || description.trim().length < 5) {
      util.showToast('请详细描述举报原因（至少5个字）');
      return false;
    }

    if (selectedRequiresProof && images.length === 0) {
      util.showToast('该类型需要上传证据图片');
      return false;
    }

    return true;
  },

  async onSubmit() {
    if (!this.validateForm()) return;

    const { 
      targetType, 
      targetId, 
      selectedType, 
      description, 
      images, 
      contactInfo,
      anonymous,
      targetInfo 
    } = this.data;

    const currentUser = app.globalData.userInfo;
    if (!currentUser) {
      util.showToast('请先登录');
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/login/index' });
      }, 1500);
      return;
    }

    this.setData({ submitting: true });

    try {
      const result = userService.submitReport({
        reporterId: currentUser.id,
        reporterName: anonymous ? '匿名用户' : currentUser.nickName,
        targetType,
        targetId,
        targetTitle: targetInfo ? targetInfo.title : '',
        reportType: selectedType,
        description: description.trim(),
        images,
        contactInfo: contactInfo.trim(),
        anonymous
      });

      if (result.success) {
        util.showSuccess('举报提交成功，我们会尽快处理');
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        util.showToast(result.message || '举报失败');
      }
    } catch (error) {
      console.error('提交举报失败:', error);
      util.showToast('举报失败，请稍后重试');
    } finally {
      this.setData({ submitting: false });
    }
  },

  onCancel() {
    wx.navigateBack();
  }
});
