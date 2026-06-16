const app = getApp();
const dataService = require('../../services/data');
const userService = require('../../services/userService');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const fileUtil = require('../../utils/file');
const { mixPage } = require('../../utils/withTheme');
const { mixinDetail } = require('../../utils/detailMixin');

let pageOptions = {
  data: {
    darkMode: false,
    id: '',
    detail: null,
    currentImageIndex: 0,
    showStatusAction: false,
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
    mapScale: 16,
    showOfferModal: false,
    offerPrice: '',
    offerMessage: '',
    offers: [],
    canViewOffers: false,
    myOffer: null,
    showCounterModal: false,
    counterOfferId: '',
    counterPrice: '',
    counterMessage: '',
    activeOfferCount: 0
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

      const activeOfferCount = dataService.getItemActiveOfferCount(this.data.id);
      const isNegotiating = detail.status === 'selling' && activeOfferCount > 0;

      let displayStatus = detail.status;
      let displayStatusText = constants.getLabelByValue(constants.MARKET_STATUS, detail.status);
      if (isNegotiating) {
        displayStatus = 'negotiating';
        displayStatusText = '议价中';
      }

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
        statusText: displayStatusText,
        displayStatus,
        isNegotiating,
        activeOfferCount,
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

      this.checkOwner(detail.userId);

      this.setData({ detail: formattedDetail });

      dataService.increaseMarketViews(this.data.id);

      dataService.addHistory(detail, 'market');

      this.loadUserInfo();

      this.loadComments();

      this.loadOffers();
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
            util.showError('删除失败，请重试');
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

  loadOffers() {
    const { id, currentUserId, detail } = this.data;
    if (!id || !detail) return;

    const isOwner = detail.userId === currentUserId;
    const canViewOffers = isOwner || currentUserId;

    if (!canViewOffers) {
      this.setData({ offers: [], canViewOffers: false, myOffer: null, activeOfferCount: 0 });
      return;
    }

    let offers = dataService.getMarketOffersByItem(id);
    const activeOfferCount = offers.filter(o => o.status === 'pending' || o.status === 'countered').length;

    if (!isOwner) {
      offers = offers.filter(o => o.userId === currentUserId);
    }

    const formattedOffers = offers.map(offer => {
      const statusInfo = constants.MARKET_OFFER_STATUS_MAP[offer.status] || {};
      const timeLeft = this.calculateOfferTimeLeft(offer);
      const history = (offer.history || []).map(h => ({
        ...h,
        timeText: util.relativeTime(h.time),
        priceText: h.price ? util.formatPrice(h.price) : ''
      }));

      return {
        ...offer,
        priceText: util.formatPrice(offer.price),
        itemPriceText: util.formatPrice(offer.itemPrice),
        statusText: statusInfo.label || offer.status,
        statusColor: statusInfo.color || '#666',
        statusIcon: statusInfo.icon || '',
        timeText: util.relativeTime(offer.createTime),
        updateTimeText: util.relativeTime(offer.updateTime),
        timeLeftText: timeLeft.text,
        timeLeftColor: timeLeft.color,
        hasTimeLeft: timeLeft.hasTimeLeft,
        isMyOffer: offer.userId === currentUserId,
        isSeller: isOwner,
        canAccept: isOwner && (offer.status === 'pending' || offer.status === 'countered'),
        canReject: isOwner && (offer.status === 'pending' || offer.status === 'countered'),
        canCounter: isOwner && (offer.status === 'pending' || offer.status === 'countered'),
        canCancel: offer.userId === currentUserId && (offer.status === 'pending' || offer.status === 'countered'),
        history: history.reverse()
      };
    });

    let myOffer = null;
    if (!isOwner && currentUserId) {
      const myOffers = formattedOffers.filter(o => o.userId === currentUserId);
      myOffer = myOffers.length > 0 ? myOffers[0] : null;
    }

    this.setData({
      offers: formattedOffers,
      canViewOffers: true,
      myOffer,
      activeOfferCount
    });
  },

  calculateOfferTimeLeft(offer) {
    if (offer.status !== 'pending' && offer.status !== 'countered') {
      return { text: '', color: '', hasTimeLeft: false };
    }

    const now = Date.now();
    const updateTime = offer.updateTime || offer.createTime;
    const timeoutMs = constants.MARKET_OFFER_TIMEOUT_HOURS * 60 * 60 * 1000;
    const expireTime = updateTime + timeoutMs;
    const timeLeft = expireTime - now;

    if (timeLeft <= 0) {
      return { text: '已超时', color: '#6B7280', hasTimeLeft: false };
    }

    const hours = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));

    let text = '';
    let color = '#10B981';

    if (hours > 0) {
      text = `剩余 ${hours} 小时 ${minutes} 分钟`;
    } else {
      text = `剩余 ${minutes} 分钟`;
      color = '#EF4444';
    }

    if (hours < 6) {
      color = '#F59E0B';
    }

    return { text, color, hasTimeLeft: true };
  },

  onShowOfferModal() {
    if (!util.checkLogin()) {
      return;
    }

    const { detail, isOwner } = this.data;

    if (!detail || detail.status !== 'selling') {
      util.showToast('商品不在出售中，无法议价');
      return;
    }

    if (isOwner) {
      util.showToast('不能对自己的商品出价');
      return;
    }

    this.setData({
      showOfferModal: true,
      offerPrice: '',
      offerMessage: ''
    });
  },

  onHideOfferModal() {
    this.setData({ showOfferModal: false });
  },

  onOfferPriceInput(e) {
    this.setData({ offerPrice: e.detail.value });
  },

  onOfferMessageInput(e) {
    this.setData({ offerMessage: e.detail.value });
  },

  onSubmitOffer() {
    const { id, offerPrice, offerMessage } = this.data;

    if (!offerPrice || isNaN(Number(offerPrice)) || Number(offerPrice) <= 0) {
      util.showToast('请输入有效的出价金额');
      return;
    }

    const result = dataService.createMarketOffer(id, {
      price: Number(offerPrice),
      message: offerMessage.trim()
    });

    if (result.success) {
      util.showSuccess('出价成功');
      this.setData({ showOfferModal: false });
      this.loadDetail();
    } else {
      util.showError(result.message || '出价失败');
    }
  },

  onAcceptOffer(e) {
    const { offerId } = e.currentTarget.dataset;

    wx.showModal({
      title: '确认接受出价',
      content: '接受出价后，商品将自动标记为已预订，其他买家的出价将被取消。确定接受此出价吗？',
      success: (res) => {
        if (res.confirm) {
          const result = dataService.acceptMarketOffer(offerId);
          if (result.success) {
            util.showSuccess('已接受出价');
            this.loadDetail();
          } else {
            util.showError(result.message || '操作失败');
          }
        }
      }
    });
  },

  onRejectOffer(e) {
    const { offerId } = e.currentTarget.dataset;

    wx.showModal({
      title: '拒绝出价',
      content: '确定要拒绝此出价吗？',
      success: (res) => {
        if (res.confirm) {
          const result = dataService.rejectMarketOffer(offerId);
          if (result.success) {
            util.showSuccess('已拒绝');
            this.loadDetail();
          } else {
            util.showError(result.message || '操作失败');
          }
        }
      }
    });
  },

  onShowCounterModal(e) {
    const { offerId, currentPrice } = e.currentTarget.dataset;
    this.setData({
      showCounterModal: true,
      counterOfferId: offerId,
      counterPrice: currentPrice || '',
      counterMessage: ''
    });
  },

  onHideCounterModal() {
    this.setData({ showCounterModal: false });
  },

  onCounterPriceInput(e) {
    this.setData({ counterPrice: e.detail.value });
  },

  onCounterMessageInput(e) {
    this.setData({ counterMessage: e.detail.value });
  },

  onSubmitCounter() {
    const { counterOfferId, counterPrice, counterMessage } = this.data;

    if (!counterPrice || isNaN(Number(counterPrice)) || Number(counterPrice) <= 0) {
      util.showToast('请输入有效的还价金额');
      return;
    }

    const result = dataService.counterMarketOffer(
      counterOfferId,
      Number(counterPrice),
      counterMessage.trim()
    );

    if (result.success) {
      util.showSuccess('已发送还价');
      this.setData({ showCounterModal: false });
      this.loadDetail();
    } else {
      util.showError(result.message || '操作失败');
    }
  },

  onCancelOffer(e) {
    const { offerId } = e.currentTarget.dataset;

    wx.showModal({
      title: '取消出价',
      content: '确定要取消此出价吗？',
      success: (res) => {
        if (res.confirm) {
          const result = dataService.cancelMarketOffer(offerId);
          if (result.success) {
            util.showSuccess('已取消出价');
            this.loadDetail();
          } else {
            util.showError(result.message || '操作失败');
          }
        }
      }
    });
  },

  stopPropagation() {
  },

  getShareTitle() {
    const { detail } = this.data;
    if (detail) {
      return `【${detail.statusText}】${detail.title} - ¥${detail.priceText}`;
    }
    return '二手市场 - 校园闲置交易';
  },

  getShareImage() {
    const { detail } = this.data;
    if (detail && detail.images && detail.images[0]) {
      return detail.images[0];
    }
    return '';
  },

  getSharePath() {
    const { detail } = this.data;
    if (detail) {
      return `/pages/market-detail/index?id=${detail.id}`;
    }
    return '/pages/market/index';
  }
};

pageOptions = mixinDetail(pageOptions, {
  type: 'market',
  enableFavorite: true,
  enableShare: true,
  enableReport: true,
  enableContact: true,
  contactField: 'phone',
  contactNameField: 'contact'
});

mixPage(pageOptions);
