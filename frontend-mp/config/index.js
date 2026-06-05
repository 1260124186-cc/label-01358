/**
 * 配置常量
 */

// 失物招领类型
const LOST_FOUND_TYPES = [
  { value: 'lost', label: '寻物启事' },
  { value: 'found', label: '失物招领' }
];

// 物品类型
const ITEM_TYPES = [
  { value: 'electronics', label: '电子产品' },
  { value: 'card', label: '证件卡类' },
  { value: 'book', label: '书籍文具' },
  { value: 'clothes', label: '衣物配饰' },
  { value: 'daily', label: '生活用品' },
  { value: 'other', label: '其他物品' }
];

// 丢失/拾取地点
const LOCATIONS = [
  { value: 'library', label: '图书馆' },
  { value: 'canteen', label: '食堂' },
  { value: 'classroom', label: '教学楼' },
  { value: 'dormitory', label: '宿舍区' },
  { value: 'playground', label: '操场' },
  { value: 'lab', label: '实验楼' },
  { value: 'office', label: '行政楼' },
  { value: 'other', label: '其他地点' }
];

// 二手商品分类
const MARKET_CATEGORIES = [
  { value: 'electronics', label: '数码电子' },
  { value: 'book', label: '图书教材' },
  { value: 'clothes', label: '服饰鞋包' },
  { value: 'sports', label: '运动户外' },
  { value: 'daily', label: '生活用品' },
  { value: 'beauty', label: '美妆护肤' },
  { value: 'food', label: '食品零食' },
  { value: 'other', label: '其他' }
];

// 价格区间
const PRICE_RANGES = [
  { value: '0-50', label: '50元以下', min: 0, max: 50 },
  { value: '50-100', label: '50-100元', min: 50, max: 100 },
  { value: '100-300', label: '100-300元', min: 100, max: 300 },
  { value: '300-500', label: '300-500元', min: 300, max: 500 },
  { value: '500+', label: '500元以上', min: 500, max: Infinity }
];

const SORT_OPTIONS = [
  { value: 'latest', label: '最新', field: 'createTime', order: 'desc' },
  { value: 'price_asc', label: '价格低到高', field: 'price', order: 'asc' },
  { value: 'price_desc', label: '价格高到低', field: 'price', order: 'desc' },
  { value: 'views', label: '浏览量', field: 'views', order: 'desc' }
];

const TIME_RANGES = [
  { value: '', label: '不限' },
  { value: '1d', label: '一天内' },
  { value: '3d', label: '三天内' },
  { value: '1w', label: '一周内' },
  { value: '1m', label: '一个月内' }
];

const SEARCH_TABS = [
  { value: 'all', label: '全部' },
  { value: 'lost', label: '失物招领' },
  { value: 'market', label: '二手市场' },
  { value: 'news', label: '校园动态' }
];

// 商品状态
const MARKET_STATUS = [
  { value: 'selling', label: '在售' },
  { value: 'reserved', label: '已预订' },
  { value: 'sold', label: '已售出' }
];

// 首页公告数据（模拟）
const ANNOUNCEMENTS = [
  {
    id: '1',
    title: '关于2026年春季学期开学注册的通知',
    content: '各位同学，2026年春季学期将于2月15日正式开学，请同学们按时返校注册。注册时间为2月15日-16日，地点在各学院办公室。请携带学生证、身份证等相关证件。',
    image: 'https://picsum.photos/seed/notice1/800/400',
    createTime: Date.now() - 86400000
  },
  {
    id: '2',
    title: '图书馆寒假期间开放时间调整通知',
    content: '寒假期间，图书馆开放时间调整为每天9:00-17:00，周末及法定节假日闭馆。请同学们合理安排借阅时间。',
    image: 'https://picsum.photos/seed/notice2/800/400',
    createTime: Date.now() - 172800000
  },
  {
    id: '3',
    title: '校园一卡通充值服务升级公告',
    content: '为提升服务质量，校园一卡通充值系统将于本周末进行升级维护。升级期间，线上充值服务暂停，请同学们提前做好充值准备。',
    image: 'https://picsum.photos/seed/notice3/800/400',
    createTime: Date.now() - 259200000
  }
];

// 校园动态数据（模拟）
const CAMPUS_NEWS = [
  {
    id: '1',
    title: '我校学子在全国大学生创新创业大赛中荣获金奖',
    summary: '近日，第十二届全国大学生创新创业大赛总决赛落幕，我校参赛团队凭借"智慧校园生活服务平台"项目荣获金奖。',
    image: 'https://picsum.photos/seed/news1/400/300',
    createTime: Date.now() - 3600000
  },
  {
    id: '2',
    title: '校园樱花季即将到来，赏花攻略请收好',
    summary: '随着气温回暖，校园内的樱花即将进入盛花期。预计本周末将迎来最佳观赏期，届时学校将开放主要赏花区域。',
    image: 'https://picsum.photos/seed/news2/400/300',
    createTime: Date.now() - 7200000
  },
  {
    id: '3',
    title: '新学期选课系统开放通知',
    summary: '2026年春季学期选课系统将于2月10日8:00开放，请同学们提前做好选课准备，合理规划课程安排。',
    image: 'https://picsum.photos/seed/news3/400/300',
    createTime: Date.now() - 10800000
  },
  {
    id: '4',
    title: '校园招聘会将于下周举行',
    summary: '2026年春季校园招聘会将于2月20日在体育馆举行，届时将有超过200家企业参会，欢迎应届毕业生参加。',
    image: 'https://picsum.photos/seed/news4/400/300',
    createTime: Date.now() - 14400000
  }
];

// 校园风光数据（模拟）
// 注意：wx.previewImage 只支持网络图片，本地图片无法预览
const SCENERY_LIST = [
  {
    id: '1',
    title: '图书馆',
    description: '现代化的图书馆，藏书百万册，是学习的理想场所',
    image: 'https://picsum.photos/seed/library/800/600'
  },
  {
    id: '2',
    title: '樱花大道',
    description: '每年春季，樱花盛开，美不胜收',
    image: 'https://picsum.photos/seed/cherry/800/600'
  },
  {
    id: '3',
    title: '湖心亭',
    description: '校园中心湖畔的古典亭台，是休闲放松的好去处',
    image: 'https://picsum.photos/seed/lake/800/600'
  },
  {
    id: '4',
    title: '体育馆',
    description: '设施完善的综合体育馆，可容纳万人',
    image: 'https://picsum.photos/seed/gym/800/600'
  },
  {
    id: '5',
    title: '钟楼',
    description: '校园标志性建筑，见证了学校的百年历史',
    image: 'https://picsum.photos/seed/tower/800/600'
  },
  {
    id: '6',
    title: '科技楼',
    description: '现代化的科研大楼，汇聚了众多实验室',
    image: 'https://picsum.photos/seed/tech/800/600'
  }
];

// 校园广播数据
// 使用网易云音乐外链
const BROADCAST_LIST = [
  {
    id: '1',
    title: '校园晨曲',
    description: '每日清晨，用音乐唤醒美好的一天',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=447925558.mp3',
    cover: 'https://picsum.photos/seed/radio1/400/400'
  },
  {
    id: '2',
    title: '午间新闻',
    description: '校园新闻、时事热点一网打尽',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=1901371647.mp3',
    cover: 'https://picsum.photos/seed/radio2/400/400'
  },
  {
    id: '3',
    title: '音乐时光',
    description: '精选好歌，陪你度过悠闲午后',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=1824020873.mp3',
    cover: 'https://picsum.photos/seed/radio3/400/400'
  },
  {
    id: '4',
    title: '英语角',
    description: '每日英语学习，提升口语能力',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=526464145.mp3',
    cover: 'https://picsum.photos/seed/radio4/400/400'
  },
  {
    id: '5',
    title: '晚间故事',
    description: '温馨故事，伴你入眠',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=1397345903.mp3',
    cover: 'https://picsum.photos/seed/radio5/400/400'
  }
];

// 获取标签文本
function getLabelByValue(list, value) {
  const item = list.find(i => i.value === value);
  return item ? item.label : value;
}

module.exports = {
  LOST_FOUND_TYPES,
  ITEM_TYPES,
  LOCATIONS,
  MARKET_CATEGORIES,
  PRICE_RANGES,
  SORT_OPTIONS,
  TIME_RANGES,
  SEARCH_TABS,
  MARKET_STATUS,
  ANNOUNCEMENTS,
  CAMPUS_NEWS,
  SCENERY_LIST,
  BROADCAST_LIST,
  getLabelByValue
};
