const app = getApp();
const dataService = require('../../services/data');
const userService = require('../../services/userService');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const fileUtil = require('../../utils/file');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    id: '',
    detail: null,
    isFavorite: false,
    isOwner: false,
    currentImageIndex: 0,
    showStatusAction: false,
    showShareCard: false,
    statusOptions: [
      { value: 'selling', label: '在售', desc: '商品正在出售中' },
      { value: 'reserved', label: '已预订', desc: '商品已被预订，暂不出售' },
      { value: 'sold', label: '已售出', desc: '商品已成功售出' }
    ],
    comments: [],
    commentInput: '',
    isAdmin: false,
    currentUserId: '',
    markers: [],
    mapScale: 16
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id });
      this.loadDetail();
    }
  },

  onShow() {
    if (this.data.id) {
      this.loadDetail();
    }
  },

  loadDetail() {
    const detail = dataService.getMarketDetail(this.data.id);

    if (detail) {
      const discountText = this.calculateDiscount(detail.price, detail.originalPrice);
      const saveText = this.calculateSave(detail.price, detail.originalPrice);
      const hasLocation = detail.latitude !== undefined && detail.longitude !== undefined && detail.address;
      const formattedDetail = {
        ...detail,
        priceText: util.formatPrice(detail.price),
        originalPriceText: detail.originalPrice ? util.formatPrice(detail.originalPrice) : '',
        discountText,
        saveText,
        hasDiscount: !!discountText,
        viewsText: this.formatViews(detail.views),
        timeText: util.relativeTime(detail.createTime),
        categoryText: constants.getLabelByValue(constants.MARKET_CATEGORIES, detail.category),
        statusText: constants.getLabelByValue(constants.MARKET_STATUS, detail.status),
        hasLocation
      };

      let markers = [];
      if (hasLocation) {
        markers = [{
          id: 0,
          latitude: detail.latitude,
          longitude: detail.longitude,
          width: 36,
          height: 36,
          callout: {
            content: detail.address,
            color: '#333333',
            fontSize: 12,
            borderRadius: 6,
            bgColor: '#FFFFFF',
            padding: 6,
            display: 'ALWAYS',
            textAlign: 'center'
          }
        }];
      }
      this.setData({ markers });

      const userInfo = app.globalData.userInfo || {};
      const isOwner = userInfo.id && detail.userId === userInfo.id;

      this.setData({ detail: formattedDetail, isOwner });

      // 增加浏览量
      dataService.increaseMarketViews(this.data.id);

      // 添加到浏览历史
      dataService.addHistory(detail, 'market');

      // 检查收藏状态
      this.checkFavorite();

      // 加载用户信息
      this.loadUserInfo();

      // 加载评论
      this.loadComments();
    }
  },

  loadUserInfo() {
    const userInfo = app.globalData.userInfo || {};
    const currentUserId = userInfo.id || '';
    const isAdmin = userService.isCurrentUserAdmin();
    this.setData({ currentUserId, isAdmin });
  },

  loadComments() {
    const { id } = this.data;
    if (!id) return;

    const comments = dataService.getMarketComments(id);
    const formattedComments = comments.map(comment => ({
      ...comment,
      timeText: util.relativeTime(comment.createTime),
      canDelete: this.canDeleteComment(comment)
    }));

    this.setData({ comments: formattedComments });
  },

  canDeleteComment(comment) {
    const { currentUserId, isOwner, isAdmin } = this.data;
    if (!currentUserId) return false;
    if (comment.userId === currentUserId) return true;
    if (isOwner) return true;
    if (isAdmin) return true;
    return false;
  },

  onCommentInput(e) {
    this.setData({ commentInput: e.detail.value });
  },

  onSubmitComment() {
    if (!util.checkLogin()) {
      return;
    }

    const { id, commentInput, detail } = this.data;

    if (detail && detail.status === 'sold') {
      util.showToast('商品已售出，无法评论');
      return;
    }

    if (!commentInput || !commentInput.trim()) {
      util.showToast('请输入评论内容');
      return;
    }

    const result = dataService.addMarketComment(id, commentInput.trim());

    if (result.success) {
      this.setData({ commentInput: '' });
      this.loadComments();
      util.showSuccess('评论成功');
    } else {
      util.showError(result.message || '评论失败');
    }
  },

  onDeleteComment(e) {
    const { commentId } = e.currentTarget.dataset;
    const { id, comments } = this.data;

    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    if (!this.canDeleteComment(comment)) {
      util.showError('您没有权限删除此评论');
      return;
    }

    wx.showModal({
      title: '删除评论',
      content: '确定要删除这条评论吗？',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          const success = dataService.deleteMarketComment(id, commentId);
          if (success) {
            this.loadComments();
            util.showSuccess('已删除');
          } else {
            util.showError('删除失败');
          }
        }
      }
    });
  },

  calculateDiscount(price, originalPrice) {
    if (!originalPrice || originalPrice <= price || price <= 0) return '';
    const discount = Math.round((price / originalPrice) * 10);
    if (discount >= 10) return '';
    return discount + '折';
  },

  calculateSave(price, originalPrice) {
    if (!originalPrice || originalPrice <= price) return '';
    const save = originalPrice - price;
    return util.formatPrice(save);
  },

  formatViews(views) {
    if (!views || views < 1000) return views || 0;
    if (views < 10000) return (views / 1000).toFixed(1) + 'k';
    return (views / 10000).toFixed(1) + 'w';
  },

  checkFavorite() {
    const isFavorite = dataService.isFavorite(this.data.id, 'market');
    this.setData({ isFavorite });
  },

  onSwiperChange(e) {
    this.setData({
      currentImageIndex: e.detail.current
    });
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    const urls = this.data.detail.images;
    fileUtil.previewImage(urls, urls[index]);
  },

  onToggleFavorite() {
    // 检查登录状态
    if (!util.checkLogin()) {
      return;
    }

    const { id, isFavorite, detail } = this.data;

    if (isFavorite) {
      dataService.removeFavorite(id, 'market');
      this.setData({ isFavorite: false });
      util.showSuccess('已取消收藏');
    } else {
      dataService.addFavorite(detail, 'market');
      this.setData({ isFavorite: true });
      util.showSuccess('收藏成功');
    }
  },

  onCallPhone() {
    // 检查登录状态
    if (!util.checkLogin()) {
      return;
    }

    const { phone } = this.data.detail;
    wx.makePhoneCall({
      phoneNumber: phone,
      fail: () => {
        // 用户取消或失败
      }
    });
  },

  onNavigateToLocation() {
    const { detail } = this.data;
    if (!detail || !detail.hasLocation) {
      util.showToast('暂无位置信息');
      return;
    }

    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] === false) {
          wx.showModal({
            title: '需要定位权限',
            content: '导航功能需要获取您的位置信息，是否前往设置开启？',
            confirmText: '去设置',
            success: (modalRes) => {
              if (modalRes.confirm) {
                wx.openSetting();
              }
            }
          });
          return;
        }
        this.openLocation();
      },
      fail: () => {
        this.openLocation();
      }
    });
  },

  openLocation() {
    const { detail } = this.data;
    if (!detail) return;

    wx.openLocation({
      latitude: detail.latitude,
      longitude: detail.longitude,
      name: detail.title || '交易地点',
      address: detail.address,
      scale: 16,
      fail: (err) => {
        if (err.errMsg && err.errMsg.includes('auth deny')) {
          util.showToast('请授权后使用导航功能');
        }
      }
    });
  },

  onMapTap() {
    this.onNavigateToLocation();
  },

  onReport() {
    if (!util.checkLogin()) {
      return;
    }

    const { id } = this.data;
    util.navigateTo(`/pages/report/index?targetType=market&targetId=${id}`);
  },

  onEdit() {
    if (!util.checkLogin()) {
      return;
    }

    const { id } = this.data;
    util.navigateTo(`/pages/market-publish/index?mode=edit&id=${id}`);
  },

  onToggleStatusAction() {
    this.setData({ showStatusAction: !this.data.showStatusAction });
  },

  onChangeStatus(e) {
    const { status } = e.currentTarget.dataset;
    const { detail, id } = this.data;

    if (detail.status === status) {
      this.setData({ showStatusAction: false });
      return;
    }

    const statusLabel = constants.getLabelByValue(constants.MARKET_STATUS, status);

    wx.showModal({
      title: '确认修改状态',
      content: `确定要将商品状态修改为"${statusLabel}"吗？`,
      success: (res) => {
        if (res.confirm) {
          const success = dataService.updateMarketItem(id, { status });
          if (success) {
            util.showSuccess(`已修改为${statusLabel}`);
            this.setData({ showStatusAction: false });
            this.loadDetail();
          } else {
            util.showError('修改失败，请重试');
          }
        }
      }
    });
  },

  async onDelete() {
    if (!util.checkLogin()) {
      return;
    }

    const confirm = await util.showConfirm('确定要下架并删除此商品吗？删除后将同时清除相关的收藏和浏览记录。');
    if (!confirm) return;

    const success = dataService.deleteMarketItem(this.data.id);
    if (success) {
      util.showSuccess('已删除商品');
      setTimeout(() => {
        util.navigateBack();
      }, 1500);
    } else {
      util.showError('删除失败，请重试');
    }
  },

  onShare() {
    if (wx.showShareMenu) {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });
    }
    this.setData({ showShareCard: true });
  },

  onCloseShareCard() {
    this.setData({ showShareCard: false });
  },

  onSaveShareImage() {
    const { detail } = this.data;
    if (!detail || !detail.images || detail.images.length === 0) {
      util.showError('保存失败');
      return;
    }

    wx.showLoading({ title: '保存中...' });

    const imageUrl = detail.images[0];

    if (imageUrl.startsWith('http')) {
      wx.downloadFile({
        url: imageUrl,
        success: (res) => {
          if (res.statusCode === 200) {
            this.saveImageToAlbum(res.tempFilePath);
          } else {
            wx.hideLoading();
            util.showError('保存失败');
          }
        },
        fail: () => {
          wx.hideLoading();
          util.showError('保存失败');
        }
      });
    } else {
      this.saveImageToAlbum(imageUrl);
    }
  },

  saveImageToAlbum(filePath) {
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: () => {
        wx.hideLoading();
        util.showSuccess('已保存到相册');
      },
      fail: (err) => {
        wx.hideLoading();
        if (err.errMsg && err.errMsg.includes('auth deny')) {
          wx.showModal({
            title: '提示',
            content: '需要您授权保存图片到相册',
            confirmText: '去授权',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting();
              }
            }
          });
        } else {
          util.showError('保存失败');
        }
      }
    });
  },

  onShareAppMessage() {
    const { detail } = this.data;
    if (detail) {
      return {
        title: `【${detail.statusText}】${detail.title} - ¥${detail.priceText}`,
        path: `/pages/market-detail/index?id=${detail.id}`,
        imageUrl: detail.images && detail.images[0] ? detail.images[0] : ''
      };
    }
    return {
      title: '二手市场 - 校园闲置交易',
      path: '/pages/market/index'
    };
  },

  onShareTimeline() {
    const { detail } = this.data;
    if (detail) {
      return {
        title: `${detail.title} - ¥${detail.priceText}`,
        imageUrl: detail.images && detail.images[0] ? detail.images[0] : ''
      };
    }
    return {
      title: '二手市场 - 校园闲置交易'
    };
  }
});
