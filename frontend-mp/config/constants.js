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

const ERRAND_TASK_TYPES = [
  { value: 'express', label: '取快递', icon: '📦', color: '#FF6B6B', gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)' },
  { value: 'purchase', label: '代买', icon: '🛒', color: '#4ECDC4', gradient: 'linear-gradient(135deg, #4ECDC4 0%, #6EE7DE 100%)' },
  { value: 'delivery', label: '代送', icon: '🚀', color: '#45B7D1', gradient: 'linear-gradient(135deg, #45B7D1 0%, #6DD5ED 100%)' },
  { value: 'queue', label: '代排队', icon: '🧍', color: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBC94E 100%)' },
  { value: 'other', label: '其他', icon: '📌', color: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }
];

const ERRAND_ORDER_STATUS = [
  { value: 'pending', label: '待接单', color: '#F59E0B', icon: '⏳' },
  { value: 'accepted', label: '已接单', color: '#3B82F6', icon: '🤝' },
  { value: 'in_progress', label: '进行中', color: '#8B5CF6', icon: '🔄' },
  { value: 'completed', label: '已完成', color: '#10B981', icon: '✅' },
  { value: 'cancelled', label: '已取消', color: '#6B7280', icon: '❌' },
  { value: 'timeout', label: '已超时', color: '#EF4444', icon: '⏰' }
];

const ERRAND_HALL_STATUS = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待接单' },
  { value: 'accepted', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
];

const ERRAND_BOUNTY_RANGES = [
  { value: '', label: '不限', min: 0, max: Infinity },
  { value: '0-3', label: '3元以下', min: 0, max: 3 },
  { value: '3-5', label: '3-5元', min: 3, max: 5 },
  { value: '5-10', label: '5-10元', min: 5, max: 10 },
  { value: '10-20', label: '10-20元', min: 10, max: 20 },
  { value: '20+', label: '20元以上', min: 20, max: Infinity }
];

const ERRAND_DISTANCE_RANGES = [
  { value: '', label: '不限', min: 0, max: Infinity },
  { value: '0-500', label: '500米内', min: 0, max: 500 },
  { value: '500-1000', label: '500米-1公里', min: 500, max: 1000 },
  { value: '1000-2000', label: '1-2公里', min: 1000, max: 2000 },
  { value: '2000+', label: '2公里以上', min: 2000, max: Infinity }
];

const ERRAND_SORT_OPTIONS = [
  { value: 'latest', label: '最新发布', field: 'createTime', order: 'desc' },
  { value: 'bounty_desc', label: '赏金高到低', field: 'bounty', order: 'desc' },
  { value: 'bounty_asc', label: '赏金低到高', field: 'bounty', order: 'asc' },
  { value: 'deadline', label: '即将截止', field: 'deadline', order: 'asc' }
];

const ERRAND_ORDER_TABS = [
  { value: 'published', label: '我发布的' },
  { value: 'accepted', label: '我接的' }
];

const ERRAND_PUBLISHED_TABS = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待接单' },
  { value: 'in_progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
];

const ERRAND_ACCEPTED_TABS = [
  { value: 'all', label: '全部' },
  { value: 'accepted', label: '已接单' },
  { value: 'in_progress', label: '进行中' },
  { value: 'completed', label: '已完成' }
];

const ERRAND_RATING_TAGS = [
  { value: 'fast', label: '速度快', icon: '⚡' },
  { value: 'polite', label: '态度好', icon: '😊' },
  { value: 'careful', label: '细心负责', icon: '💯' },
  { value: 'punctual', label: '准时送达', icon: '⏱️' },
  { value: 'communicate', label: '沟通顺畅', icon: '💬' }
];

const ERRAND_CREDIT_LEVELS = [
  { min: 95, max: 100, label: '优秀', color: '#10B981', icon: '🌟' },
  { min: 85, max: 94, label: '良好', color: '#3B82F6', icon: '👍' },
  { min: 70, max: 84, label: '一般', color: '#F59E0B', icon: '👌' },
  { min: 50, max: 69, label: '较差', color: '#EF4444', icon: '⚠️' },
  { min: 0, max: 49, label: '极差', color: '#DC2626', icon: '🚫' }
];

const ERRAND_VIOLATION_TYPES = [
  { value: 'cancel_frequently', label: '频繁取消', icon: '❌' },
  { value: 'timeout', label: '超时未完成', icon: '⏰' },
  { value: 'sensitive_word', label: '违规内容', icon: '🚫' },
  { value: 'false_info', label: '虚假信息', icon: '⛔' },
  { value: 'dispute', label: '交易纠纷', icon: '⚖️' }
];

const ERRAND_ESCROW_STATUS = [
  { value: 'frozen', label: '已冻结', color: '#F59E0B', icon: '🔒' },
  { value: 'released', label: '已释放', color: '#10B981', icon: '🔓' },
  { value: 'refunded', label: '已退款', color: '#3B82F6', icon: '💰' }
];

const ERRAND_TIMEOUT_MINUTES = 30;

const ERRAND_PURCHASE_CATEGORIES = [
  { value: 'food', label: '餐饮美食', icon: '🍜' },
  { value: 'drink', label: '奶茶饮品', icon: '🧋' },
  { value: 'fruit', label: '水果生鲜', icon: '🍎' },
  { value: 'medicine', label: '药品', icon: '💊' },
  { value: 'stationery', label: '文具用品', icon: '✏️' },
  { value: 'daily', label: '生活用品', icon: '🛍️' },
  { value: 'other', label: '其他', icon: '📋' }
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

const CARPOOL_TYPES = [
  { value: 'car_seeking', label: '车找人', icon: '🚗', color: '#3B82F6' },
  { value: 'person_seeking', label: '人找车', icon: '🙋', color: '#10B981' },
  { value: 'charter', label: '包车', icon: '🚐', color: '#8B5CF6' }
];

const CARPOOL_STATUS = [
  { value: 'recruiting', label: '招募中', color: '#10B981' },
  { value: 'full', label: '已满', color: '#F59E0B' },
  { value: 'departed', label: '已出发', color: '#3B82F6' },
  { value: 'ended', label: '已结束', color: '#6B7280' }
];

const CARPOOL_TABS = [
  { value: 'all', label: '全部' },
  { value: 'car_seeking', label: '车找人' },
  { value: 'person_seeking', label: '人找车' },
  { value: 'charter', label: '包车' }
];

const CARPOOL_DESTINATIONS = [
  { value: 'station', label: '火车站' },
  { value: 'airport', label: '机场' },
  { value: 'downtown', label: '市中心' },
  { value: 'scenic', label: '景区' },
  { value: 'home', label: '回家' },
  { value: 'other', label: '其他' }
];

const CARPOOL_PRICE_RANGES = [
  { value: '0-30', label: '30元以下', min: 0, max: 30 },
  { value: '30-50', label: '30-50元', min: 30, max: 50 },
  { value: '50-100', label: '50-100元', min: 50, max: 100 },
  { value: '100-200', label: '100-200元', min: 100, max: 200 },
  { value: '200+', label: '200元以上', min: 200, max: Infinity }
];

const CARPOOL_SORT_OPTIONS = [
  { value: 'latest', label: '最新发布', field: 'createTime', order: 'desc' },
  { value: 'departure_asc', label: '出发时间近', field: 'departureTime', order: 'asc' },
  { value: 'price_asc', label: '价格低到高', field: 'pricePerPerson', order: 'asc' },
  { value: 'price_desc', label: '价格高到低', field: 'pricePerPerson', order: 'desc' },
  { value: 'seats', label: '剩余座位多', field: 'remainingSeats', order: 'desc' }
];

const CANTEEN_CROWD_LEVELS = [
  { value: 'idle', label: '空闲', color: '#52C41A', desc: '用餐人数较少，无需排队' },
  { value: 'moderate', label: '适中', color: '#FAAD14', desc: '用餐人数适中，稍等片刻' },
  { value: 'crowded', label: '拥挤', color: '#FF4D4F', desc: '用餐人数较多，建议错峰' }
];

const CANTEEN_TIME_SEGMENTS = [
  { value: 'breakfast', label: '早餐', icon: '🌅' },
  { value: 'lunch', label: '午餐', icon: '☀️' },
  { value: 'dinner', label: '晚餐', icon: '🌙' }
];

const DISH_TAGS = [
  { value: 'signature', label: '招牌', color: '#FF6B6B' },
  { value: 'recommend', label: '推荐', color: '#52C41A' },
  { value: 'new', label: '新品', color: '#1890FF' },
  { value: 'hot', label: '热销', color: '#FF4D4F' },
  { value: 'spicy', label: '辣', color: '#FF7A45' },
  { value: 'sweet', label: '甜', color: '#EB2F96' },
  { value: 'vegetarian', label: '素食', color: '#73D13D' },
  { value: 'healthy', label: '健康', color: '#13C2C2' },
  { value: 'popular', label: '网红', color: '#722ED1' },
  { value: 'classic', label: '经典', color: '#8C8C8C' },
  { value: 'exotic', label: '异域', color: '#FA8C16' },
  { value: 'custom', label: '定制', color: '#2F54EB' },
  { value: 'drink', label: '饮品', color: '#40A9FF' },
  { value: 'quick', label: '快捷', color: '#08979C' },
  { value: 'affordable', label: '划算', color: '#D48806' }
];

const DISH_TAG_MAP = DISH_TAGS.reduce((acc, t) => {
  acc[t.value] = { label: t.label, color: t.color };
  return acc;
}, {});

const RENTAL_SORT_OPTIONS = [
  { value: 'latest', label: '最新发布', field: 'createTime', order: 'desc' },
  { value: 'price_asc', label: '价格低到高', field: 'rent', order: 'asc' },
  { value: 'price_desc', label: '价格高到低', field: 'rent', order: 'desc' },
  { value: 'distance', label: '距离最近', field: 'distance', order: 'asc' },
  { value: 'views', label: '浏览量', field: 'views', order: 'desc' }
];

const FORUM_POST_TYPES = [
  { value: 'qa', label: '问答', icon: '❓', color: '#3B82F6' },
  { value: 'rant', label: '吐槽', icon: '😤', color: '#EF4444' },
  { value: 'experience', label: '经验分享', icon: '💡', color: '#F59E0B' },
  { value: 'lost_help', label: '失物求助', icon: '🔍', color: '#8B5CF6' },
  { value: 'trade', label: '交易讨论', icon: '💰', color: '#10B981' }
];

const FORUM_FEED_TABS = [
  { value: 'recommend', label: '推荐' },
  { value: 'latest', label: '最新' },
  { value: 'hot', label: '热门' }
];

const FORUM_TOPIC_LIST = [
  { value: 'postgraduate', label: '考研', icon: '🎓', postCount: 0, color: '#FF6B6B' },
  { value: 'course_selection', label: '选课', icon: '📚', postCount: 0, color: '#4ECDC4' },
  { value: 'canteen', label: '食堂', icon: '🍜', postCount: 0, color: '#F59E0B' },
  { value: 'dorm', label: '宿舍', icon: '🏠', postCount: 0, color: '#8B5CF6' },
  { value: 'job', label: '求职', icon: '💼', postCount: 0, color: '#3B82F6' },
  { value: 'love', label: '恋爱', icon: '💕', postCount: 0, color: '#EC4899' },
  { value: 'exam', label: '考试', icon: '📝', postCount: 0, color: '#EF4444' },
  { value: 'club', label: '社团', icon: '🎭', postCount: 0, color: '#14B8A6' },
  { value: 'sports', label: '运动', icon: '🏃', postCount: 0, color: '#22C55E' },
  { value: 'game', label: '游戏', icon: '🎮', postCount: 0, color: '#6366F1' },
  { value: 'travel', label: '出行', icon: '✈️', postCount: 0, color: '#0EA5E9' },
  { value: 'emotion', label: '心情', icon: '🌈', postCount: 0, color: '#F472B6' }
];

const FORUM_REPORT_REASONS = [
  { value: 'spam', label: '垃圾广告' },
  { value: 'abuse', label: '辱骂攻击' },
  { value: 'porn', label: '色情低俗' },
  { value: 'fraud', label: '欺诈信息' },
  { value: 'privacy', label: '隐私泄露' },
  { value: 'other', label: '其他原因' }
];

const SENSITIVE_WORDS = [
  '违禁品', '代考', '替考', '作弊器', '假证',
  '刷单', '传销', '赌博', '高利贷',
  '约炮', '裸聊'
];

const FORUM_SORT_OPTIONS = [
  { value: 'recommend', label: '推荐', field: 'hotScore', order: 'desc' },
  { value: 'latest', label: '最新', field: 'createTime', order: 'desc' },
  { value: 'hot', label: '热门', field: 'hotScore', order: 'desc' }
];

const CLUB_ACTIVITY_STATUS = [
  { value: 'upcoming', label: '即将开始', color: '#3B82F6' },
  { value: 'ongoing', label: '进行中', color: '#10B981' },
  { value: 'ended', label: '已结束', color: '#6B7280' },
  { value: 'cancelled', label: '已取消', color: '#EF4444' }
];

const CLUB_ACTIVITY_CATEGORIES = [
  { value: 'academic', label: '学术讲座', icon: '📚', color: '#3B82F6' },
  { value: 'sports', label: '体育赛事', icon: '⚽', color: '#10B981' },
  { value: 'arts', label: '文艺表演', icon: '🎭', color: '#8B5CF6' },
  { value: 'social', label: '社交聚会', icon: '🎉', color: '#F59E0B' },
  { value: 'charity', label: '公益志愿', icon: '❤️', color: '#EC4899' },
  { value: 'competition', label: '竞赛比赛', icon: '🏆', color: '#14B8A6' },
  { value: 'training', label: '培训拓展', icon: '🎯', color: '#6366F1' },
  { value: 'other', label: '其他活动', icon: '📌', color: '#6B7280' }
];

const CLUB_ACTIVITY_TABS = [
  { value: 'ongoing', label: '进行中' },
  { value: 'upcoming', label: '即将开始' },
  { value: 'ended', label: '已结束' },
  { value: 'my', label: '我报名的' }
];

const CLUB_TYPES = [
  { value: 'academic', label: '学术科技类', icon: '🔬', color: '#3B82F6' },
  { value: 'sports', label: '体育运动类', icon: '🏃', color: '#10B981' },
  { value: 'arts', label: '文化艺术类', icon: '🎨', color: '#8B5CF6' },
  { value: 'social', label: '公益实践类', icon: '🤝', color: '#F59E0B' },
  { value: 'literary', label: '文学创作类', icon: '📖', color: '#EC4899' },
  { value: 'other', label: '其他社团', icon: '🏷️', color: '#6B7280' }
];

const MAP_TYPES = [
  { value: 'handdrawn', label: '手绘地图', icon: '🗺️' },
  { value: 'satellite', label: '卫星地图', icon: '🛰️' }
];

const POI_CATEGORIES = [
  { value: 'all', label: '全部', icon: '📍', color: '#6B7280' },
  { value: 'classroom', label: '教学楼', icon: '🏫', color: '#3B82F6' },
  { value: 'canteen', label: '食堂', icon: '🍜', color: '#F59E0B' },
  { value: 'dormitory', label: '宿舍', icon: '🏠', color: '#8B5CF6' },
  { value: 'library', label: '图书馆', icon: '📚', color: '#10B981' },
  { value: 'express', label: '快递点', icon: '📦', color: '#EC4899' },
  { value: 'print', label: '打印店', icon: '🖨️', color: '#14B8A6' },
  { value: 'medical', label: '医务室', icon: '🏥', color: '#EF4444' },
  { value: 'other', label: '其他', icon: '📌', color: '#6B7280' }
];

const POI_CATEGORY_MAP = POI_CATEGORIES.reduce((acc, c) => {
  acc[c.value] = { label: c.label, icon: c.icon, color: c.color };
  return acc;
}, {});

const ORIENTATION_TYPES = [
  { value: 'portrait', label: '正对', angle: 0 },
  { value: 'right_front', label: '右前方', angle: 45 },
  { value: 'right', label: '右侧', angle: 90 },
  { value: 'right_back', label: '右后方', angle: 135 },
  { value: 'back', label: '正后方', angle: 180 },
  { value: 'left_back', label: '左后方', angle: 225 },
  { value: 'left', label: '左侧', angle: 270 },
  { value: 'left_front', label: '左前方', angle: 315 }
];

const COURSE_TIME_SLOTS = [
  { slot: 1, label: '第1节', start: '08:00', end: '08:45' },
  { slot: 2, label: '第2节', start: '08:55', end: '09:40' },
  { slot: 3, label: '第3节', start: '10:00', end: '10:45' },
  { slot: 4, label: '第4节', start: '10:55', end: '11:40' },
  { slot: 5, label: '第5节', start: '14:00', end: '14:45' },
  { slot: 6, label: '第6节', start: '14:55', end: '15:40' },
  { slot: 7, label: '第7节', start: '16:00', end: '16:45' },
  { slot: 8, label: '第8节', start: '16:55', end: '17:40' },
  { slot: 9, label: '第9节', start: '19:00', end: '19:45' },
  { slot: 10, label: '第10节', start: '19:55', end: '20:40' }
];

const WEEK_DAYS = [
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
  { value: 7, label: '周日' }
];

const COURSE_COLORS = [
  { bg: '#FFE8E8', border: '#FF6B6B', text: '#E53935' },
  { bg: '#E8F4FF', border: '#4ECDC4', text: '#00897B' },
  { bg: '#FFF3E0', border: '#FFA726', text: '#EF6C00' },
  { bg: '#EDE7F6', border: '#9575CD', text: '#5E35B1' },
  { bg: '#E0F7FA', border: '#4DD0E1', text: '#00ACC1' },
  { bg: '#FCE4EC', border: '#F06292', text: '#C2185B' },
  { bg: '#E8F5E9', border: '#81C784', text: '#388E3C' },
  { bg: '#FFF8E1', border: '#FFD54F', text: '#F57F17' }
];

const SCHEDULE_VIEW_TABS = [
  { value: 'week', label: '周视图' },
  { value: 'day', label: '日视图' }
];

const SCHEDULE_TABS = [
  { value: 'schedule', label: '课程表', icon: '📅' },
  { value: 'academic', label: '教务查询', icon: '📊' },
  { value: 'classroom', label: '空教室', icon: '🏫' },
  { value: 'exam', label: '考试安排', icon: '📝' }
];

const SCORE_LEVELS = [
  { min: 90, max: 100, label: '优秀', color: '#10B981', gpa: 4.0 },
  { min: 85, max: 89, label: '良好', color: '#3B82F6', gpa: 3.7 },
  { min: 80, max: 84, label: '良好', color: '#6366F1', gpa: 3.3 },
  { min: 75, max: 79, label: '中等', color: '#8B5CF6', gpa: 3.0 },
  { min: 70, max: 74, label: '中等', color: '#F59E0B', gpa: 2.7 },
  { min: 65, max: 69, label: '及格', color: '#FB923C', gpa: 2.3 },
  { min: 60, max: 64, label: '及格', color: '#EF4444', gpa: 2.0 },
  { min: 0, max: 59, label: '不及格', color: '#DC2626', gpa: 0 }
];

const CLASSROOM_BUILDINGS = [
  { value: 'all', label: '全部教学楼' },
  { value: 'A', label: 'A栋教学楼' },
  { value: 'B', label: 'B栋教学楼' },
  { value: 'C', label: 'C栋教学楼' },
  { value: 'D', label: 'D栋实验楼' },
  { value: 'E', label: 'E栋信息楼' }
];

const REMINDER_MINUTES_OPTIONS = [
  { value: 0, label: '不提醒' },
  { value: 5, label: '课前5分钟' },
  { value: 10, label: '课前10分钟' },
  { value: 15, label: '课前15分钟' },
  { value: 30, label: '课前30分钟' },
  { value: 60, label: '课前1小时' }
];

const IMPORT_METHODS = [
  { value: 'paste', label: '粘贴文本', icon: '📋' },
  { value: 'scan', label: '扫码导入', icon: '📷' }
];

function getScoreLevel(score) {
  return SCORE_LEVELS.find(l => score >= l.min && score <= l.max) || SCORE_LEVELS[SCORE_LEVELS.length - 1];
}

function getGPA(score) {
  return getScoreLevel(score).gpa;
}

function getSlotTime(slot) {
  return COURSE_TIME_SLOTS.find(s => s.slot === slot) || null;
}

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
  ERRAND_TASK_TYPES,
  ERRAND_ORDER_STATUS,
  ERRAND_HALL_STATUS,
  ERRAND_BOUNTY_RANGES,
  ERRAND_DISTANCE_RANGES,
  ERRAND_SORT_OPTIONS,
  ERRAND_ORDER_TABS,
  ERRAND_PUBLISHED_TABS,
  ERRAND_ACCEPTED_TABS,
  ERRAND_RATING_TAGS,
  ERRAND_CREDIT_LEVELS,
  ERRAND_VIOLATION_TYPES,
  ERRAND_ESCROW_STATUS,
  ERRAND_TIMEOUT_MINUTES,
  ERRAND_PURCHASE_CATEGORIES,
  PRINT_COLOR_OPTIONS,
  PRINT_SIDE_OPTIONS,
  PRINT_PAPER_OPTIONS,
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
  CARPOOL_TYPES,
  CARPOOL_STATUS,
  CARPOOL_TABS,
  CARPOOL_DESTINATIONS,
  CARPOOL_PRICE_RANGES,
  CARPOOL_SORT_OPTIONS,
  CANTEEN_CROWD_LEVELS,
  CANTEEN_TIME_SEGMENTS,
  DISH_TAGS,
  DISH_TAG_MAP,
  FORUM_POST_TYPES,
  FORUM_FEED_TABS,
  FORUM_TOPIC_LIST,
  FORUM_REPORT_REASONS,
  SENSITIVE_WORDS,
  FORUM_SORT_OPTIONS,
  CLUB_ACTIVITY_STATUS,
  CLUB_ACTIVITY_CATEGORIES,
  CLUB_ACTIVITY_TABS,
  CLUB_TYPES,
  MAP_TYPES,
  POI_CATEGORIES,
  POI_CATEGORY_MAP,
  ORIENTATION_TYPES,
  COURSE_TIME_SLOTS,
  WEEK_DAYS,
  COURSE_COLORS,
  SCHEDULE_VIEW_TABS,
  SCHEDULE_TABS,
  SCORE_LEVELS,
  CLASSROOM_BUILDINGS,
  REMINDER_MINUTES_OPTIONS,
  IMPORT_METHODS,
  getScoreLevel,
  getGPA,
  getSlotTime,
  getLabelByValue
};
