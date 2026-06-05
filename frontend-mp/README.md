# 校园生活服务微信小程序

## 项目简介

校园生活服务小程序，为校园师生提供失物招领、二手交易、校园风光展示、校园广播等便捷服务。

## 功能模块

### 1. 首页
- 校园公告轮播
- 功能分类导航（失物招领、二手市场、校园风光、校园广播）
- 校园动态列表（支持下拉刷新）

### 2. 失物招领
- 发布寻物启事/失物招领
- 列表筛选（类型、物品分类）
- 详情查看、收藏、联系发布者

### 3. 二手市场
- 发布二手商品
- 分类筛选、价格区间筛选
- 商品详情、收藏、联系卖家

### 4. 校园风光
- 图片轮播展示
- 缩略图快速切换
- 全屏预览

### 5. 校园广播
- 音频播放器（播放/暂停/进度控制）
- 节目列表
- 上一首/下一首切换

### 6. 个人中心
- 用户信息编辑（头像、昵称、性别、生日、地区）
- 我的收藏
- 浏览历史
- 清除缓存

## 技术特点

- 本地缓存存储（wx.setStorage）
- 文件系统存储（FileSystemManager）
- 组件化开发
- 模块化数据服务层

## 项目结构

```
frontend-mp/
├── app.js                    # 应用入口
├── app.json                  # 全局配置
├── app.wxss                  # 全局样式
├── pages/                    # 页面
│   ├── index/                # 首页
│   ├── lost-found/           # 失物招领列表
│   ├── lost-found-publish/   # 发布失物招领
│   ├── lost-found-detail/    # 失物招领详情
│   ├── market/               # 二手市场列表
│   ├── market-publish/       # 发布商品
│   ├── market-detail/        # 商品详情
│   ├── scenery/              # 校园风光
│   ├── broadcast/            # 校园广播
│   ├── profile/              # 个人中心
│   ├── profile-edit/         # 编辑资料
│   ├── favorites/            # 我的收藏
│   ├── history/              # 浏览历史
│   └── announcement-detail/  # 公告详情
├── components/               # 公共组件
│   ├── btn/                  # 按钮组件
│   ├── card/                 # 卡片组件
│   └── empty/                # 空状态组件
├── utils/                    # 工具函数
│   ├── storage.js            # 本地存储
│   ├── file.js               # 文件操作
│   └── util.js               # 通用工具
├── services/                 # 数据服务
│   └── data.js               # 数据操作
├── config/                   # 配置
│   └── index.js              # 常量配置
└── assets/                   # 静态资源
    ├── icons/                # 图标
    ├── images/               # 图片
    └── audio/                # 音频
```

## 使用说明

### 1. 导入项目
使用微信开发者工具导入 `frontend-mp` 目录

### 2. 添加资源文件
在 `assets` 目录下添加所需的图标、图片和音频资源：

#### TabBar 图标（81x81px，PNG格式）
- `icons/home.png` / `icons/home-active.png`
- `icons/lost.png` / `icons/lost-active.png`
- `icons/market.png` / `icons/market-active.png`
- `icons/profile.png` / `icons/profile-active.png`

#### 导航图标（56x56px，PNG格式）
- `icons/nav-lost.png`
- `icons/nav-market.png`
- `icons/nav-scenery.png`
- `icons/nav-broadcast.png`

#### 图片资源
- `images/default-avatar.png` - 默认头像
- `images/default-banner.png` - 默认轮播图
- `images/empty.png` - 空状态图
- `images/banner1-3.png` - 公告轮播图
- `images/news1-4.png` - 新闻图片
- `images/scenery1-6.png` - 校园风光
- `images/broadcast1-5.png` - 广播封面

#### 音频资源
- `audio/broadcast1-5.mp3` - 广播音频

### 3. 编译运行
点击微信开发者工具的"编译"按钮即可预览

## 设计规范

- 主色调：#2B5CE6（蓝色）
- 背景色：#F0F2F5（浅灰）
- 卡片圆角：24rpx
- 卡片阴影：0 4px 6px rgba(0,0,0,0.1)
- 按钮有 Hover 效果和 Loading 状态
- 操作反馈使用 Toast 提示
