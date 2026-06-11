const app = getApp();
const theme = require('../../utils/theme');
const fontsize = require('../../utils/fontsize');

Page({
  data: {
    darkMode: false,
    colorScheme: 'coral',
    fontSizeClass: 'font-size-standard',
    fontSize: 'standard',
    versions: [
      {
        version: 'v2.0.0',
        date: '2026-06-11',
        current: true,
        features: [
          '新增多主题色方案（蓝、绿、紫）',
          '新增字体大小调节功能',
          '新增开屏引导页',
          '新增意见反馈功能',
          '新增版本更新日志',
          '无障碍优化：屏幕阅读器支持',
          '全局消息通知中心优化'
        ]
      },
      {
        version: 'v1.5.0',
        date: '2026-04-20',
        current: false,
        features: [
          '新增跑腿服务模块',
          '新增房屋租售模块',
          '新增拼车出行模块',
          '新增食堂点餐模块',
          '新增论坛社区模块'
        ]
      },
      {
        version: 'v1.2.0',
        date: '2026-02-15',
        current: false,
        features: [
          '新增社团活动模块',
          '新增校园地图导航',
          '新增课程表功能',
          '新增AR导航体验'
        ]
      },
      {
        version: 'v1.0.0',
        date: '2025-12-01',
        current: false,
        features: [
          '失物招领功能上线',
          '二手市场功能上线',
          '校园资讯浏览',
          '个人中心上线',
          '消息通知系统'
        ]
      }
    ]
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
      darkMode: isDark || false,
      colorScheme: colorScheme || theme.getColorScheme() || 'coral'
    });
  },

  loadFontState() {
    const fontInit = fontsize.init();
    this.setData({
      fontSizeClass: fontInit.className,
      fontSize: fontInit.size
    });
  }
});
