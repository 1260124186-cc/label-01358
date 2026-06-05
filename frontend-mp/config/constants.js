const LOST_FOUND_TYPES = [
  { value: 'lost', label: '寻物启事' },
  { value: 'found', label: '失物招领' }
];

const ITEM_TYPES = [
  { value: 'electronics', label: '电子产品' },
  { value: 'card', label: '证件卡类' },
  { value: 'book', label: '书籍文具' },
  { value: 'clothes', label: '衣物配饰' },
  { value: 'daily', label: '生活用品' },
  { value: 'other', label: '其他物品' }
];

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

const MARKET_STATUS = [
  { value: 'selling', label: '在售' },
  { value: 'reserved', label: '已预订' },
  { value: 'sold', label: '已售出' }
];

const SURVEY_QUESTION_TYPES = [
  { value: 'single', label: '单选题' },
  { value: 'multiple', label: '多选题' },
  { value: 'fill', label: '填空题' }
];

const SURVEY_STATUS = [
  { value: 'active', label: '进行中' },
  { value: 'closed', label: '已结束' }
];

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
  SURVEY_QUESTION_TYPES,
  SURVEY_STATUS,
  getLabelByValue
};
