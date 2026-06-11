/**
 * 工具函数
 */

/**
 * 生成唯一ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

/**
 * 格式化时间
 */
function formatTime(date, format = 'YYYY-MM-DD HH:mm') {
  if (!date) return '';
  
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 相对时间
 */
function relativeTime(date) {
  if (!date) return '';
  
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  
  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return Math.floor(diff / minute) + '分钟前';
  } else if (diff < day) {
    return Math.floor(diff / hour) + '小时前';
  } else if (diff < week) {
    return Math.floor(diff / day) + '天前';
  } else if (diff < month) {
    return Math.floor(diff / week) + '周前';
  } else {
    return formatTime(d, 'MM-DD');
  }
}

/**
 * 显示成功提示
 */
function showSuccess(title, duration = 1500) {
  return new Promise((resolve) => {
    wx.showToast({
      title,
      icon: 'success',
      duration,
      complete: () => setTimeout(resolve, duration)
    });
  });
}

/**
 * 显示错误提示
 */
function showError(title, duration = 2000) {
  return new Promise((resolve) => {
    wx.showToast({
      title,
      icon: 'error',
      duration,
      complete: () => setTimeout(resolve, duration)
    });
  });
}

/**
 * 显示普通提示
 */
function showToast(title, duration = 1500) {
  return new Promise((resolve) => {
    wx.showToast({
      title,
      icon: 'none',
      duration,
      complete: () => setTimeout(resolve, duration)
    });
  });
}

/**
 * 显示加载中
 */
function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true
  });
}

/**
 * 隐藏加载中
 */
function hideLoading() {
  wx.hideLoading();
}

/**
 * 显示确认对话框
 */
function showConfirm(content, title = '提示') {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      confirmColor: '#FF6B6B',
      success: (res) => resolve(res.confirm)
    });
  });
}

/**
 * 显示确认对话框（别名）
 */
function showModal(content, title = '确认') {
  return showConfirm(content, title);
}

/**
 * 页面跳转
 */
function navigateTo(url) {
  return new Promise((resolve, reject) => {
    wx.navigateTo({
      url,
      success: resolve,
      fail: reject
    });
  });
}

/**
 * 页面返回
 */
function navigateBack(delta = 1) {
  return new Promise((resolve, reject) => {
    wx.navigateBack({
      delta,
      success: resolve,
      fail: reject
    });
  });
}

/**
 * 切换Tab
 */
function switchTab(url) {
  return new Promise((resolve, reject) => {
    wx.switchTab({
      url,
      success: resolve,
      fail: reject
    });
  });
}

/**
 * 防抖
 */
function debounce(fn, delay = 300) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 节流
 */
function throttle(fn, delay = 300) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 价格格式化
 */
function formatPrice(price) {
  if (price === undefined || price === null) return '0.00';
  return Number(price).toFixed(2);
}

/**
 * 校验手机号
 */
function isValidPhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone);
}

/**
 * 校验非空
 */
function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * 检查是否已登录
 */
function isLoggedIn() {
  const app = getApp();
  return !!(app.globalData.userInfo && app.globalData.userInfo.nickName);
}

/**
 * 检查登录状态，未登录则跳转登录页
 * @param {boolean} redirect - 是否自动跳转登录页，默认 true
 * @returns {boolean} - 是否已登录
 */
function checkLogin(redirect = true) {
  if (isLoggedIn()) {
    return true;
  }
  
  if (redirect) {
    showToast('请先登录');
    setTimeout(() => {
      navigateTo('/pages/login/index');
    }, 1000);
  }
  
  return false;
}

module.exports = {
  generateId,
  formatTime,
  relativeTime,
  showSuccess,
  showError,
  showToast,
  showLoading,
  hideLoading,
  showConfirm,
  showModal,
  navigateTo,
  navigateBack,
  switchTab,
  debounce,
  throttle,
  formatPrice,
  isValidPhone,
  isEmpty,
  isLoggedIn,
  checkLogin
};
