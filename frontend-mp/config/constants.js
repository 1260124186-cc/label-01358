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
  { value: 'study', label: '学习资料' },
  { value: 'news', label: '校园动态' },
  { value: 'phonebook', label: '电话簿' }
];

const PHONEBOOK_TABS = [
  { value: 'all', label: '全部' },
  { value: 'department', label: '院系办公' },
  { value: 'logistics', label: '后勤服务' },
  { value: 'medical', label: '医疗服务' },
  { value: 'security', label: '保卫安全' },
  { value: 'express', label: '快递中心' }
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

const NOTIFICATION_TYPES = [
  { value: 'system', label: '系统公告', icon: '📢', color: '#FEF3C7', iconColor: '#F59E0B' },
  { value: 'interaction', label: '互动消息', icon: '💬', color: '#DBEAFE', iconColor: '#3B82F6' },
  { value: 'transaction', label: '交易提醒', icon: '🛒', color: '#D1FAE5', iconColor: '#10B981' },
  { value: 'activity', label: '活动提醒', icon: '🎉', color: '#FEE2E2', iconColor: '#EF4444' },
  { value: 'survey', label: '问卷邀请', icon: '📋', color: '#E9D5FF', iconColor: '#8B5CF6' }
];

const NOTIFICATION_SUB_TYPES = {
  system: [
    { value: 'announcement', label: '系统公告' },
    { value: 'maintenance', label: '维护通知' },
    { value: 'weather_alert', label: '天气预警' }
  ],
  interaction: [
    { value: 'comment', label: '评论' },
    { value: 'reply', label: '回复' },
    { value: 'like', label: '点赞' }
  ],
  transaction: [
    { value: 'favorite', label: '被收藏' },
    { value: 'contact', label: '有人联系' },
    { value: 'order', label: '订单提醒' }
  ],
  activity: [
    { value: 'start', label: '活动开始' },
    { value: 'reminder', label: '活动提醒' },
    { value: 'result', label: '活动结果' }
  ],
  survey: [
    { value: 'invite', label: '问卷邀请' },
    { value: 'reminder', label: '填写提醒' }
  ]
};

const STUDY_MATERIAL_CATEGORIES = [
  { value: 'course', label: '课程', color: '#4ECDC4', icon: '📚' },
  { value: 'postgraduate', label: '考研', color: '#FF6B6B', icon: '🎓' },
  { value: 'civil', label: '考公', color: '#45B7D1', icon: '🏛️' },
  { value: 'cet', label: '四六级', color: '#96CEB4', icon: '📝' },
  { value: 'competition', label: '竞赛', color: '#FFEAA7', icon: '🏆' }
];

const STUDY_REWARD_STATUS = [
  { value: 'open', label: '进行中', color: '#10B981' },
  { value: 'adopted', label: '已采纳', color: '#3B82F6' },
  { value: 'closed', label: '已关闭', color: '#6B7280' }
];

const SEMESTER_OPTIONS = [
  { value: '2025-2026-2', label: '2025-2026学年第二学期' },
  { value: '2025-2026-1', label: '2025-2026学年第一学期' },
  { value: '2024-2025-2', label: '2024-2025学年第二学期' },
  { value: '2024-2025-1', label: '2024-2025学年第一学期' },
  { value: '2023-2024-2', label: '2023-2024学年第二学期' },
  { value: '2023-2024-1', label: '2023-2024学年第一学期' }
];

const REWARD_POINTS_OPTIONS = [10, 20, 50, 100, 200, 500];

const FILE_TYPE_OPTIONS = [
  { value: 'image', label: '图片', icon: '🖼️' },
  { value: 'pdf', label: 'PDF', icon: '📄' },
  { value: 'doc', label: '文档', icon: '📝' },
  { value: 'other', label: '其他', icon: '📁' }
];

const STUDY_TABS = [
  { value: 'materials', label: '资料分享' },
  { value: 'rewards', label: '悬赏求助' }
];

const SHOP_CATEGORIES = [
  { value: 'all', label: '全部', icon: '🏪' },
  { value: 'print', label: '打印店', icon: '🖨️' },
  { value: 'milktea', label: '奶茶店', icon: '🧋' },
  { value: 'stationery', label: '文具店', icon: '✏️' },
  { value: 'barber', label: '理发店', icon: '💇' },
  { value: 'fruit', label: '水果店', icon: '🍎' },
  { value: 'coffee', label: '咖啡馆', icon: '☕' },
  { value: 'repair', label: '数码维修', icon: '📱' },
  { value: 'bookstore', label: '书店', icon: '📖' }
];

const SHOP_SORT_OPTIONS = [
  { value: 'default', label: '默认', field: 'rating', order: 'desc' },
  { value: 'rating', label: '评分最高', field: 'rating', order: 'desc' },
  { value: 'reviews', label: '评价最多', field: 'reviewCount', order: 'desc' }
];

const COUPON_TYPES = [
  { value: 'cash', label: '满减', icon: '💰' },
  { value: 'percent', label: '折扣', icon: '🏷️' },
  { value: 'gift', label: '赠品', icon: '🎁' }
];

const VOLUNTEER_STATUS = [
  { value: 'recruiting', label: '招募中', color: '#10B981' },
  { value: 'ongoing', label: '进行中', color: '#3B82F6' },
  { value: 'completed', label: '已结束', color: '#6B7280' },
  { value: 'cancelled', label: '已取消', color: '#EF4444' }
];

const VOLUNTEER_CATEGORIES = [
  { value: 'community', label: '社区服务', icon: '🏘️', color: '#10B981' },
  { value: 'education', label: '教育帮扶', icon: '📖', color: '#3B82F6' },
  { value: 'environment', label: '环保公益', icon: '🌿', color: '#22C55E' },
  { value: 'culture', label: '文化传播', icon: '🎭', color: '#8B5CF6' },
  { value: 'health', label: '健康医疗', icon: '🏥', color: '#EF4444' },
  { value: 'sports', label: '体育赛事', icon: '🏃', color: '#F59E0B' },
  { value: 'charity', label: '慈善募捐', icon: '💝', color: '#EC4899' },
  { value: 'other', label: '其他', icon: '📌', color: '#6B7280' }
];

const VOLUNTEER_TABS = [
  { value: 'all', label: '全部' },
  { value: 'recruiting', label: '招募中' },
  { value: 'ongoing', label: '进行中' },
  { value: 'completed', label: '已结束' }
];

const EXPRESS_PICKUP_POINTS = [
  { value: 'cainiao', label: '菜鸟驿站', icon: '📦' },
  { value: 'jd', label: '京东快递', icon: '🟧' },
  { value: 'sf', label: '顺丰速运', icon: '🟢' },
  { value: 'zt', label: '中通快递', icon: '🔵' },
  { value: 'yt', label: '圆通快递', icon: '🔴' },
  { value: 'sto', label: '申通快递', icon: '🟡' },
  { value: 'ems', label: 'EMS', icon: '📮' },
  { value: 'yunda', label: '韵达快递', icon: '🟣' },
  { value: 'other', label: '其他快递', icon: '📋' }
];

const ERRAND_ORDER_STATUS = [
  { value: 'pending', label: '待处理', color: '#F59E0B', icon: '⏳' },
  { value: 'processing', label: '处理中', color: '#3B82F6', icon: '🔄' },
  { value: 'completed', label: '已完成', color: '#10B981', icon: '✅' },
  { value: 'cancelled', label: '已取消', color: '#6B7280', icon: '❌' }
];

const PRINT_COLOR_OPTIONS = [
  { value: 'bw', label: '黑白', pricePerPage: 0.1 },
  { value: 'color', label: '彩色', pricePerPage: 0.5 }
];

const PRINT_SIDE_OPTIONS = [
  { value: 'single', label: '单面', priceMultiplier: 1 },
  { value: 'double', label: '双面', priceMultiplier: 0.85 }
];

const PRINT_PAPER_OPTIONS = [
  { value: 'a4', label: 'A4' },
  { value: 'a3', label: 'A3' }
];

const ERRAND_ORDER_TABS = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待处理' },
  { value: 'processing', label: '处理中' },
  { value: 'completed', label: '已完成' }
];

const RENTAL_LOCATION_TYPES = [
  { value: 'campus', label: '校内' },
  { value: 'off_campus', label: '校外' }
];

const RENTAL_HOUSE_TYPES = [
  { value: 'studio', label: '单间' },
  { value: 'one_bedroom', label: '一室一厅' },
  { value: 'two_bedroom', label: '两室一厅' },
  { value: 'three_bedroom', label: '三室一厅' },
  { value: 'four_bedroom', label: '四室及以上' }
];

const RENTAL_RENT_TYPES = [
  { value: 'entire', label: '整租' },
  { value: 'shared', label: '合租' }
];

const RENTAL_GENDER_REQUIREMENTS = [
  { value: 'no_limit', label: '不限' },
  { value: 'male_only', label: '仅限男生' },
  { value: 'female_only', label: '仅限女生' }
];

const RENTAL_PRICE_RANGES = [
  { value: '0-500', label: '500元以下', min: 0, max: 500 },
  { value: '500-1000', label: '500-1000元', min: 500, max: 1000 },
  { value: '1000-1500', label: '1000-1500元', min: 1000, max: 1500 },
  { value: '1500-2000', label: '1500-2000元', min: 1500, max: 2000 },
  { value: '2000-3000', label: '2000-3000元', min: 2000, max: 3000 },
  { value: '3000+', label: '3000元以上', min: 3000, max: Infinity }
];

const RENTAL_DISTANCE_RANGES = [
  { value: '0-500', label: '500米内', min: 0, max: 500 },
  { value: '500-1000', label: '500-1000米', min: 500, max: 1000 },
  { value: '1000-2000', label: '1-2公里', min: 1000, max: 2000 },
  { value: '2000+', label: '2公里以上', min: 2000, max: Infinity }
];

const RENTAL_FACILITIES = [
  { value: 'wifi', label: 'WiFi', icon: '📶' },
  { value: 'air_conditioner', label: '空调', icon: '❄️' },
  { value: 'heater', label: '暖气', icon: '🔥' },
  { value: 'washing_machine', label: '洗衣机', icon: '🧺' },
  { value: 'refrigerator', label: '冰箱', icon: '🧊' },
  { value: 'water_heater', label: '热水器', icon: '🚿' },
  { value: 'kitchen', label: '厨房', icon: '🍳' },
  { value: 'balcony', label: '阳台', icon: '🌿' },
  { value: 'elevator', label: '电梯', icon: '🛗' },
  { value: 'parking', label: '停车位', icon: '🅿️' },
  { value: 'furniture', label: '家具', icon: '🛋️' },
  { value: 'tv', label: '电视', icon: '📺' }
];

const RENTAL_LEASE_TERMS = [
  { value: '1_month', label: '1个月' },
  { value: '3_months', label: '3个月' },
  { value: '6_months', label: '6个月' },
  { value: '1_year', label: '1年' },
  { value: 'long_term', label: '长期' },
  { value: 'negotiable', label: '面议' }
];

const RENTAL_PUBLISHER_TYPES = [
  { value: 'personal', label: '个人', color: '#10B981' },
  { value: 'agent', label: '中介', color: '#EF4444' }
];

const RENTAL_STATUS = [
  { value: 'available', label: '在租' },
  { value: 'reserved', label: '已预订' },
  { value: 'rented', label: '已出租' }
];

const RENTAL_TABS = [
  { value: 'all', label: '全部' },
  { value: 'entire', label: '整租' },
  { value: 'shared', label: '合租' }
];

const RENTAL_SORT_OPTIONS = [
  { value: 'latest', label: '最新发布', field: 'createTime', order: 'desc' },
  { value: 'price_asc', label: '价格低到高', field: 'rent', order: 'asc' },
  { value: 'price_desc', label: '价格高到低', field: 'rent', order: 'desc' },
  { value: 'distance', label: '距离最近', field: 'distance', order: 'asc' },
  { value: 'views', label: '浏览量', field: 'views', order: 'desc' }
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
  PHONEBOOK_TABS,
  MARKET_STATUS,
  SURVEY_QUESTION_TYPES,
  SURVEY_STATUS,
  NOTIFICATION_TYPES,
  NOTIFICATION_SUB_TYPES,
  STUDY_MATERIAL_CATEGORIES,
  STUDY_REWARD_STATUS,
  SEMESTER_OPTIONS,
  REWARD_POINTS_OPTIONS,
  FILE_TYPE_OPTIONS,
  STUDY_TABS,
  SHOP_CATEGORIES,
  SHOP_SORT_OPTIONS,
  COUPON_TYPES,
  VOLUNTEER_STATUS,
  VOLUNTEER_CATEGORIES,
  VOLUNTEER_TABS,
  EXPRESS_PICKUP_POINTS,
  ERRAND_ORDER_STATUS,
  PRINT_COLOR_OPTIONS,
  PRINT_SIDE_OPTIONS,
  PRINT_PAPER_OPTIONS,
  ERRAND_ORDER_TABS,
  RENTAL_LOCATION_TYPES,
  RENTAL_HOUSE_TYPES,
  RENTAL_RENT_TYPES,
  RENTAL_GENDER_REQUIREMENTS,
  RENTAL_PRICE_RANGES,
  RENTAL_DISTANCE_RANGES,
  RENTAL_FACILITIES,
  RENTAL_LEASE_TERMS,
  RENTAL_PUBLISHER_TYPES,
  RENTAL_STATUS,
  RENTAL_TABS,
  RENTAL_SORT_OPTIONS,
  getLabelByValue
};
