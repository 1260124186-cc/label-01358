export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/publish/index',
    'pages/mine/index',
    'pages/detail/index',
    'pages/share/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#14b8a6',
    navigationBarTitleText: '拼车出行',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#86909c',
    selectedColor: '#14b8a6',
    backgroundColor: '#ffffff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '拼车大厅'
      },
      {
        pagePath: 'pages/publish/index',
        text: '发布行程'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的行程'
      }
    ]
  }
})
