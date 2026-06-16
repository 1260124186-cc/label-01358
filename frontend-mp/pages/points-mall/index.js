const util = require('../../utils/util.js');
const pointsService = require('../../services/pointsService.js');
const constants = require('../../config/constants.js');
const app = getApp();

Page({
  data: {
    darkMode: false,
    loading: false,
    currentPoints: 0,
    expiringPoints: null,
    activeCategory: 'all',
    categories: [],
    products: [],
    filteredProducts: [],
    showExchangeModal: false,
    selectedProduct: null,
    exchangeQuantity: 1,
    showOrdersTab: false,
    userOrders: [],
    showDetailModal: false
  },

  onLoad(options) {
    this.setData({
      darkMode: app.globalData.darkMode || false
    });
    if (!util.checkLogin(false)) {
      util.showToast('请先登录');
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/login/index' });
      }, 1500);
      return;
    }
    this.initCategories();
    this.loadData();
  },

  onShow() {
    if (util.isLoggedIn()) {
      this.loadData();
    }
  },

  onPullDownRefresh() {
    this.loadData(() => {
      wx.stopPullDownRefresh();
    });
  },

  initCategories() {
    const categories = [
      { value: 'all', label: '全部', icon: '🎁' },
      ...constants.POINT_MALL_CATEGORIES
    ];
    this.setData({ categories });
  },

  loadData(callback) {
    this.setData({ loading: true });
    try {
      const currentPoints = pointsService.getUserPoints();
      const expiringPoints = pointsService.getExpiringPoints();
      const products = pointsService.getMallProducts();
      const userOrders = pointsService.getUserOrders();
      const filteredProducts = this.filterProducts('all', products);

      this.setData({
        currentPoints,
        expiringPoints,
        products,
        filteredProducts,
        userOrders,
        loading: false
      });
      if (callback) callback();
    } catch (error) {
      console.error('加载积分商城失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
      if (callback) callback();
    }
  },

  filterProducts(category, products) {
    const productList = products || this.data.products;
    if (category === 'all') {
      return productList;
    }
    return productList.filter(p => p.category === category);
  },

  switchCategory(e) {
    const category = e.currentTarget.dataset.category;
    const filteredProducts = this.filterProducts(category);
    this.setData({
      activeCategory: category,
      filteredProducts
    });
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      showOrdersTab: tab === 'orders'
    });
    if (tab === 'orders') {
      const userOrders = pointsService.getUserOrders();
      this.setData({ userOrders });
    }
  },

  openExchangeModal(e) {
    const product = e.currentTarget.dataset.product;
    if (!product) return;
    
    if (product.stock !== undefined && product.stock <= 0) {
      util.showToast('已兑换完毕');
      return;
    }

    this.setData({
      selectedProduct: product,
      exchangeQuantity: 1,
      showExchangeModal: true
    });
  },

  closeExchangeModal() {
    this.setData({
      showExchangeModal: false,
      selectedProduct: null
    });
  },

  changeQuantity(e) {
    const type = e.currentTarget.dataset.type;
    const product = this.data.selectedProduct;
    let quantity = this.data.exchangeQuantity;

    if (type === 'minus') {
      quantity = Math.max(1, quantity - 1);
    } else if (type === 'plus') {
      if (product.maxPerUser) {
        quantity = Math.min(product.maxPerUser, quantity + 1);
      } else {
        quantity = quantity + 1;
      }
    }

    this.setData({ exchangeQuantity: quantity });
  },

  confirmExchange() {
    const product = this.data.selectedProduct;
    const quantity = this.data.exchangeQuantity;
    
    if (!product) return;

    const totalPoints = product.price * quantity;
    
    if (this.data.currentPoints < totalPoints) {
      util.showToast('积分不足');
      return;
    }

    wx.showModal({
      title: '确认兑换',
      content: `确定使用 ${totalPoints} 积分兑换 ${product.name} x${quantity} 吗？`,
      confirmText: '确认兑换',
      cancelText: '再想想',
      success: (res) => {
        if (res.confirm) {
          this.doExchange(product, quantity, totalPoints);
        }
      }
    });
  },

  doExchange(product, quantity, totalPoints) {
    try {
      const result = pointsService.exchangeProduct(null, product.id, quantity);
      
      if (!result.success) {
        util.showToast(result.message || '兑换失败');
        return;
      }

      this.closeExchangeModal();
      
      wx.showModal({
        title: '🎉 兑换成功',
        content: this.getExchangeSuccessContent(result, product),
        showCancel: false,
        confirmText: '知道了'
      });

      this.loadData();
    } catch (error) {
      console.error('兑换失败:', error);
      util.showToast('兑换失败');
    }
  },

  getExchangeSuccessContent(result, product) {
    if (product.type === 'coupon' && result.order && result.order.couponCode) {
      return `恭喜兑换成功！\n\n优惠券码：${result.order.couponCode}\n有效期：${util.formatDate(new Date(result.order.expireTime))}\n\n请在【我的】-【优惠券】中查看使用`;
    }
    if (product.type === 'top_publish') {
      return `恭喜兑换成功！\n\n置顶服务已激活，发布信息时可直接使用置顶功能\n有效期：${util.formatDate(new Date(result.order.expireTime))}`;
    }
    if (product.type === 'reward_bonus') {
      return `恭喜兑换成功！\n\n悬赏加成券已到账，发布悬赏时可使用\n加成比例：+${product.bonusPercentage}%\n有效期：${util.formatDate(new Date(result.order.expireTime))}`;
    }
    return `恭喜兑换成功！\n请在【我的订单】中查看详情`;
  },

  showOrderDetail(e) {
    const order = e.currentTarget.dataset.order;
    if (!order) return;

    let content = `订单号：${order.id}\n`;
    content += `商品：${order.productName}\n`;
    content += `数量：${order.quantity}\n`;
    content += `消耗积分：${order.totalPoints}\n`;
    content += `兑换时间：${util.formatDateTime(new Date(order.createTime))}\n`;
    content += `状态：${this.getOrderStatusText(order.status)}\n`;
    
    if (order.couponCode) {
      content += `\n优惠券码：${order.couponCode}`;
    }
    if (order.expireTime) {
      content += `\n有效期至：${util.formatDate(new Date(order.expireTime))}`;
    }

    wx.showModal({
      title: '订单详情',
      content,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  getOrderStatusText(status) {
    const statusMap = {
      'pending': '待使用',
      'used': '已使用',
      'expired': '已过期',
      'refunded': '已退款'
    };
    return statusMap[status] || status;
  },

  goHistory() {
    wx.navigateTo({ url: '/pages/points-history/index' });
  },

  goTasks() {
    wx.navigateTo({ url: '/pages/points-tasks/index' });
  },

  goRules() {
    wx.navigateTo({ url: '/pages/points-rules/index' });
  },

  useCoupon(e) {
    const order = e.currentTarget.dataset.order;
    if (!order || order.status !== 'pending') return;

    if (order.type === 'coupon') {
      wx.setClipboardData({
        data: order.couponCode,
        success: () => {
          util.showSuccess('券码已复制');
        }
      });
    } else if (order.type === 'top_publish' || order.type === 'reward_bonus') {
      util.showToast('请在发布相关内容时使用');
    }
  }
});
