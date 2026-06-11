const { mixPage } = require('../../utils/withTheme');
const fontsize = require('../../utils/fontsize');

const ONBOARDING_KEY = 'onboarding_shown';

const STEPS = [
  {
    title: '失物招领',
    description: '丢失物品不用慌，一键发布寻物启事，快速找回你的宝贝',
    icon: '🔍',
    color: 'coral'
  },
  {
    title: '二手市场',
    description: '闲置物品轻松转卖，学长学姐的好物等你来淘',
    icon: '🛒',
    color: 'blue'
  },
  {
    title: '校园资讯',
    description: '校园动态、活动通知一手掌握，精彩不再错过',
    icon: '📰',
    color: 'green'
  },
  {
    title: '个人中心',
    description: '管理个人信息、收藏记录，打造你的专属校园空间',
    icon: '👤',
    color: 'purple'
  }
];

mixPage({
  data: {
    currentStep: 0,
    steps: STEPS,
    darkMode: false,
    colorScheme: 'coral',
    fontSizeClass: 'font-size-standard',
    fontSize: 'standard'
  },

  onLoad() {
    if (wx.getStorageSync(ONBOARDING_KEY)) {
      wx.redirectTo({ url: '/pages/index/index' });
      return;
    }
    this.loadThemeState();
    this.loadFontState();
  },

  onShow() {
    this._syncTheme();
    const app = getApp();
    if (app && app.globalData) {
      const cs = app.globalData.colorScheme;
      if (cs && cs !== this.data.colorScheme) {
        this.setData({ colorScheme: cs });
      }
    }
  },

  onStepChange(e) {
    const currentStep = e.detail.current;
    this.setData({ currentStep });
  },

  onDotTap(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentStep: index });
  },

  onSkip() {
    wx.setStorageSync(ONBOARDING_KEY, true);
    wx.switchTab({ url: '/pages/index/index' });
  },

  onNext() {
    const { currentStep, steps } = this.data;
    if (currentStep < steps.length - 1) {
      this.setData({ currentStep: currentStep + 1 });
    } else {
      this.onFinish();
    }
  },

  onFinish() {
    wx.setStorageSync(ONBOARDING_KEY, true);
    wx.switchTab({ url: '/pages/index/index' });
  },

  loadThemeState() {
    const app = getApp();
    if (app && app.globalData) {
      this.setData({
        darkMode: !!app.globalData.isDark,
        colorScheme: app.globalData.colorScheme || 'coral'
      });
    }
  },

  loadFontState() {
    const fontState = fontsize.init();
    this.setData({
      fontSizeClass: fontState.className,
      fontSize: fontState.size
    });
  }
});
