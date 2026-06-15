const LOST_FOUND_TYPES = [
  { value: 'lost', label: '寻物启事' },
  { value: 'found', label: '失物招领' }
];

const LOST_FOUND_STATUS = [
  { value: 'active', label: '进行中', color: '#3B82F6' },
  { value: 'claimed', label: '已认领', color: '#10B981' },
  { value: 'returned', label: '已找回', color: '#10B981' },
  { value: 'closed', label: '已关闭', color: '#6B7280' }
];

const LOST_FOUND_STATUS_MAP = LOST_FOUND_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color };
  return acc;
}, {});

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

const MARKET_LOCATIONS = [
  { value: 'library', label: '图书馆', latitude: 39.9042, longitude: 116.4074 },
  { value: 'canteen', label: '食堂', latitude: 39.9065, longitude: 116.4075 },
  { value: 'teaching_building', label: '教学楼', latitude: 39.9040, longitude: 116.4085 },
  { value: 'dormitory', label: '宿舍区', latitude: 39.9070, longitude: 116.4050 },
  { value: 'stadium', label: '操场', latitude: 39.9075, longitude: 116.4085 },
  { value: 'lab', label: '实验楼', latitude: 39.9055, longitude: 116.4060 },
  { value: 'office', label: '行政楼', latitude: 39.9048, longitude: 116.4055 },
  { value: 'tech_building', label: '科技楼', latitude: 39.9055, longitude: 116.4060 },
  { value: 'main_gate', label: '校门口', latitude: 39.9030, longitude: 116.4060 },
  { value: 'other', label: '其他地点', latitude: 39.9042, longitude: 116.4074 }
];

const MARKET_DISTANCE_RANGES = [
  { value: '', label: '不限距离', min: 0, max: Infinity },
  { value: '0-500', label: '500米内', min: 0, max: 500 },
  { value: '500-1000', label: '500米-1公里', min: 500, max: 1000 },
  { value: '1000-2000', label: '1-2公里', min: 1000, max: 2000 },
  { value: '2000+', label: '2公里以上', min: 2000, max: Infinity }
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

const VOTING_STATUS = [
  { value: 'pending', label: '未开始', color: '#6B7280' },
  { value: 'active', label: '投票中', color: '#10B981' },
  { value: 'ended', label: '已结束', color: '#3B82F6' },
  { value: 'published', label: '已公示', color: '#8B5CF6' }
];

const VOTING_STATUS_MAP = VOTING_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color };
  return acc;
}, {});

const VOTING_TYPES = [
  { value: 'single', label: '单选投票' },
  { value: 'multiple', label: '多选投票' },
  { value: 'ranked', label: '排序投票' }
];

const VOTING_VISIBILITY = [
  { value: 'anonymous', label: '匿名投票' },
  { value: 'realname', label: '实名投票' }
];

const VOTING_ELIGIBILITY_TYPES = [
  { value: 'all', label: '全校学生' },
  { value: 'college', label: '指定学院' },
  { value: 'grade', label: '指定年级' },
  { value: 'major', label: '指定专业' },
  { value: 'custom', label: '自定义名单' }
];

const COLLEGES = [
  { value: 'computer', label: '计算机学院' },
  { value: 'economic', label: '经济管理学院' },
  { value: 'art', label: '艺术设计学院' },
  { value: 'mechanical', label: '机械工程学院' },
  { value: 'electronic', label: '电子信息学院' },
  { value: 'civil', label: '土木工程学院' },
  { value: 'chemical', label: '化学化工学院' },
  { value: 'foreign', label: '外国语学院' }
];

const GRADES = [
  { value: '2022', label: '2022级' },
  { value: '2023', label: '2023级' },
  { value: '2024', label: '2024级' },
  { value: '2025', label: '2025级' }
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

const EXPRESS_LOCKER_STATUS = [
  { value: 'pending', label: '待取件', color: '#F59E0B', icon: '📦' },
  { value: 'picked', label: '已取件', color: '#10B981', icon: '✅' },
  { value: 'expired', label: '已过期', color: '#EF4444', icon: '⏰' }
];

const EXPRESS_LOCKER_STATUS_MAP = EXPRESS_LOCKER_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color, icon: s.icon };
  return acc;
}, {});

const EXPRESS_LOCKER_TABS = [
  { value: 'pending', label: '待取件' },
  { value: 'picked', label: '已取件' },
  { value: 'all', label: '全部' }
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

const TAKEOUT_CATEGORIES = [
  { value: 'all', label: '全部', icon: '🍽️' },
  { value: 'chinese', label: '中式快餐', icon: '🥡' },
  { value: 'western', label: '西餐', icon: '🍔' },
  { value: 'japanese', label: '日韩料理', icon: '🍣' },
  { value: 'noodle', label: '粉面粥', icon: '🍜' },
  { value: 'rice', label: '盖饭/炒饭', icon: '🍚' },
  { value: 'snack', label: '小吃/炸鸡', icon: '🍟' },
  { value: 'drink', label: '奶茶/饮品', icon: '🧋' },
  { value: 'dessert', label: '甜点', icon: '🍰' },
  { value: 'bbq', label: '烧烤', icon: '🍢' },
  { value: 'hotpot', label: '火锅', icon: '🍲' },
  { value: 'vegetarian', label: '素食', icon: '🥗' },
  { value: 'fruit', label: '水果', icon: '🍎' }
];

const TAKEOUT_SORT_OPTIONS = [
  { value: 'comprehensive', label: '综合', field: 'sales', order: 'desc' },
  { value: 'sales', label: '销量', field: 'sales', order: 'desc' },
  { value: 'rating', label: '评分', field: 'rating', order: 'desc' },
  { value: 'delivery_time', label: '配送时间', field: 'deliveryTime', order: 'asc' },
  { value: 'distance', label: '距离', field: 'distance', order: 'asc' }
];

const TAKEOUT_DELIVERY_TYPES = [
  { value: 'merchant', label: '商家自配', icon: '🏪' },
  { value: 'third_party', label: '第三方配送', icon: '🛵' },
  { value: 'self_pickup', label: '到店自取', icon: '📦' }
];

const TAKEOUT_PROMOTION_TYPES = [
  { value: 'discount', label: '折扣', icon: '🏷️' },
  { value: 'full_reduction', label: '满减', icon: '💰' },
  { value: 'coupon', label: '优惠券', icon: '🎫' },
  { value: 'gift', label: '买赠', icon: '🎁' },
  { value: 'free_delivery', label: '免配送费', icon: '🚚' }
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

const COURSE_ASSISTANT_TABS = [
  { value: 'plan', label: '培养方案', icon: '📋' },
  { value: 'schedule', label: '模拟选课', icon: '📅' },
  { value: 'reviews', label: '课程评价', icon: '⭐' }
];

const COURSE_TYPES = [
  { value: 'required', label: '必修', color: '#EF4444' },
  { value: 'elective', label: '选修', color: '#3B82F6' },
  { value: 'general', label: '通识', color: '#10B981' },
  { value: 'major', label: '专业', color: '#F59E0B' },
  { value: 'practice', label: '实践', color: '#8B5CF6' }
];

const COURSE_TYPE_MAP = COURSE_TYPES.reduce((acc, t) => {
  acc[t.value] = { label: t.label, color: t.color };
  return acc;
}, {});

const COURSE_STATUS = [
  { value: 'pending', label: '待修', color: '#9CA3AF' },
  { value: 'studying', label: '在修', color: '#3B82F6' },
  { value: 'completed', label: '已修', color: '#10B981' },
  { value: 'failed', label: '挂科', color: '#EF4444' }
];

const COURSE_STATUS_MAP = COURSE_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color };
  return acc;
}, {});

const CONFLICT_TYPES = [
  { value: 'time', label: '时间冲突', severity: 'error', color: '#EF4444' },
  { value: 'credit', label: '学分超限', severity: 'warning', color: '#F59E0B' },
  { value: 'prerequisite', label: '先修未完成', severity: 'error', color: '#EF4444' },
  { value: 'completed', label: '已修课程', severity: 'info', color: '#10B981' }
];

const DEFAULT_MAX_CREDITS = 25;
const DEFAULT_MIN_CREDITS = 15;

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

const SCENERY_CATEGORIES = [
  { value: 'all', label: '全部', icon: '📷' },
  { value: 'architecture', label: '建筑', icon: '🏛️' },
  { value: 'nature', label: '自然', icon: '🌿' },
  { value: 'activity', label: '活动', icon: '🎉' },
  { value: 'night', label: '夜景', icon: '🌙' }
];

const SCENERY_CATEGORY_MAP = SCENERY_CATEGORIES.reduce((acc, c) => {
  acc[c.value] = { label: c.label, icon: c.icon };
  return acc;
}, {});

const SCENERY_SEASONS = [
  { value: 'spring', label: '春', icon: '🌸', color: '#FF9CA2' },
  { value: 'summer', label: '夏', icon: '☀️', color: '#FFD93D' },
  { value: 'autumn', label: '秋', icon: '🍂', color: '#FF8C42' },
  { value: 'winter', label: '冬', icon: '❄️', color: '#A8D8EA' }
];

const SCENERY_SOLAR_TERMS = [
  { value: 'lichun', label: '立春', season: 'spring', icon: '🌱' },
  { value: 'yushui', label: '雨水', season: 'spring', icon: '💧' },
  { value: 'jingzhe', label: '惊蛰', season: 'spring', icon: '🐛' },
  { value: 'chunfen', label: '春分', season: 'spring', icon: '🌷' },
  { value: 'qingming', label: '清明', season: 'spring', icon: '🌿' },
  { value: 'guyu', label: '谷雨', season: 'spring', icon: '🌾' },
  { value: 'lixia', label: '立夏', season: 'summer', icon: '🌻' },
  { value: 'xiaoman', label: '小满', season: 'summer', icon: '🌾' },
  { value: 'mangzhong', label: '芒种', season: 'summer', icon: '🌾' },
  { value: 'xiazhi', label: '夏至', season: 'summer', icon: '☀️' },
  { value: 'xiaoshu', label: '小暑', season: 'summer', icon: '🔥' },
  { value: 'dashu', label: '大暑', season: 'summer', icon: '🌡️' },
  { value: 'liqiu', label: '立秋', season: 'autumn', icon: '🍁' },
  { value: 'chushu', label: '处暑', season: 'autumn', icon: '🌤️' },
  { value: 'bailu', label: '白露', season: 'autumn', icon: '💦' },
  { value: 'qiufen', label: '秋分', season: 'autumn', icon: '🍂' },
  { value: 'hanlu', label: '寒露', season: 'autumn', icon: '🌨️' },
  { value: 'shuangjiang', label: '霜降', season: 'autumn', icon: '❄️' },
  { value: 'lidong', label: '立冬', season: 'winter', icon: '🧣' },
  { value: 'xiaoxue', label: '小雪', season: 'winter', icon: '🌨️' },
  { value: 'daxue', label: '大雪', season: 'winter', icon: '❄️' },
  { value: 'dongzhi', label: '冬至', season: 'winter', icon: '⛄' },
  { value: 'xiaohan', label: '小寒', season: 'winter', icon: '🥶' },
  { value: 'dahan', label: '大寒', season: 'winter', icon: '🧊' }
];

const SCENERY_REVIEW_STATUS = [
  { value: 'pending', label: '审核中', color: '#F59E0B' },
  { value: 'approved', label: '已通过', color: '#10B981' },
  { value: 'rejected', label: '已拒绝', color: '#EF4444' }
];

const SCENERY_LOCATIONS = [
  { value: 'library', label: '图书馆', latitude: 39.9042, longitude: 116.4074 },
  { value: 'cherry_blossom', label: '樱花大道', latitude: 39.9050, longitude: 116.4080 },
  { value: 'lake_pavilion', label: '湖心亭', latitude: 39.9035, longitude: 116.4065 },
  { value: 'gym', label: '体育馆', latitude: 39.9060, longitude: 116.4090 },
  { value: 'clock_tower', label: '钟楼', latitude: 39.9048, longitude: 116.4055 },
  { value: 'tech_building', label: '科技楼', latitude: 39.9055, longitude: 116.4060 },
  { value: 'teaching_building', label: '教学楼', latitude: 39.9040, longitude: 116.4085 },
  { value: 'canteen', label: '食堂', latitude: 39.9065, longitude: 116.4075 },
  { value: 'dormitory', label: '宿舍区', latitude: 39.9070, longitude: 116.4050 },
  { value: 'stadium', label: '操场', latitude: 39.9075, longitude: 116.4085 },
  { value: 'other', label: '其他地点', latitude: 39.9042, longitude: 116.4074 }
];

const NEWS_CATEGORIES = [
  { value: 'all', label: '全部', icon: '📰' },
  { value: 'notice', label: '通知公告', icon: '📢' },
  { value: 'activity', label: '校园活动', icon: '🎉' },
  { value: 'competition', label: '竞赛获奖', icon: '🏆' },
  { value: 'job', label: '就业招聘', icon: '💼' },
  { value: 'lecture', label: '学术讲座', icon: '🎓' },
  { value: 'research', label: '科研成果', icon: '🔬' },
  { value: 'honor', label: '荣誉表彰', icon: '🏅' }
];

const NEWS_CATEGORY_MAP = NEWS_CATEGORIES.reduce((acc, c) => {
  acc[c.value] = { label: c.label, icon: c.icon };
  return acc;
}, {});

const NEWS_SORT_OPTIONS = [
  { value: 'latest', label: '最新发布', field: 'createTime', order: 'desc' },
  { value: 'views', label: '最多浏览', field: 'views', order: 'desc' }
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

const PUBLISH_STATUS = [
  { value: 'draft', label: '草稿', color: '#6B7280' },
  { value: 'published', label: '已发布', color: '#10B981' },
  { value: 'offline', label: '已下线', color: '#EF4444' }
];

const PUBLISH_STATUS_MAP = PUBLISH_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color };
  return acc;
}, {});

const GRADUATION_STATUS = [
  { value: 'pending', label: '未办', color: '#9CA3AF', icon: '⏳' },
  { value: 'processing', label: '办理中', color: '#3B82F6', icon: '🔄' },
  { value: 'completed', label: '已完成', color: '#10B981', icon: '✅' }
];

const GRADUATION_STATUS_MAP = GRADUATION_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color, icon: s.icon };
  return acc;
}, {});

const GRADUATION_ITEMS = [
  {
    id: 'library',
    name: '图书还清',
    icon: '📚',
    color: '#4ECDC4',
    department: '图书馆',
    location: '图书馆一楼服务台',
    guideUrl: '/pages/guide-detail/index?type=library-return',
    description: '归还所有借阅图书，结清逾期费用'
  },
  {
    id: 'dormitory',
    name: '宿舍验收',
    icon: '🏠',
    color: '#8B5CF6',
    department: '后勤处',
    location: '各宿舍楼值班室',
    guideUrl: '/pages/guide-detail/index?type=dorm-checkout',
    description: '检查宿舍设施，退还钥匙，结清水电费'
  },
  {
    id: 'tuition',
    name: '学费结清',
    icon: '💰',
    color: '#F59E0B',
    department: '财务处',
    location: '行政楼二楼财务大厅',
    guideUrl: '/pages/guide-detail/index?type=tuition-clear',
    description: '结清所有学费、住宿费等费用'
  },
  {
    id: 'household',
    name: '户口迁移',
    icon: '📋',
    color: '#EF4444',
    department: '保卫处',
    location: '行政楼一楼户籍室',
    guideUrl: '/pages/guide-detail/index?type=household-move',
    description: '办理户口迁移手续，领取户口迁移证'
  },
  {
    id: 'certificate',
    name: '证书领取',
    icon: '🎓',
    color: '#FF6B6B',
    department: '教务处',
    location: '各学院办公室',
    guideUrl: '/pages/guide-detail/index?type=certificate-receive',
    description: '领取毕业证、学位证、报到证等'
  }
];

const ADMIN_MODULES = [
  { id: 'announcement', name: '公告管理', icon: '📢', color: '#FF6B6B', desc: '管理校园公告通知' },
  { id: 'news', name: '校园动态', icon: '📰', color: '#4ECDC4', desc: '管理校园新闻动态' },
  { id: 'broadcast', name: '广播节目', icon: '🎙️', color: '#F59E0B', desc: '管理校园广播节目' },
  { id: 'scenery', name: '风光管理', icon: '🏞️', color: '#8B5CF6', desc: '管理校园风光图片' },
  { id: 'graduation', name: '离校审核', icon: '🎓', color: '#10B981', desc: '审核学生离校申请' },
  { id: 'voting', name: '投票管理', icon: '🗳️', color: '#667EEA', desc: '管理校园投票选举' }
];

const TICKET_REFUND_RULES = [
  { value: 'no_refund', label: '不可退票', desc: '购票后不支持退票', hours: 0, rate: 0 },
  { value: 'before_24h', label: '活动前24小时可退', desc: '活动开始前24小时前可全额退票', hours: 24, rate: 100 },
  { value: 'before_48h', label: '活动前48小时可退', desc: '活动开始前48小时前可全额退票', hours: 48, rate: 100 },
  { value: 'before_24h_partial', label: '24h前全额/内半价', desc: '24小时前全额退，24小时内退50%', hours: 24, rate: 50 },
  { value: 'flexible', label: '随时可退(扣手续费)', desc: '随时可退，扣10%手续费', hours: 0, rate: 90 }
];

const TICKET_ORDER_STATUS = [
  { value: 'pending', label: '待支付', color: '#F59E0B', icon: '⏳' },
  { value: 'paid', label: '已支付', color: '#3B82F6', icon: '✅' },
  { value: 'refund_pending', label: '退票审核中', color: '#8B5CF6', icon: '🔄' },
  { value: 'refunded', label: '已退票', color: '#6B7280', icon: '↩️' },
  { value: 'refund_rejected', label: '退票被拒', color: '#EF4444', icon: '❌' },
  { value: 'checked_in', label: '已验票', color: '#10B981', icon: '🎫' },
  { value: 'cancelled', label: '已取消', color: '#9CA3AF', icon: '✕' }
];

const TICKET_ORDER_STATUS_MAP = TICKET_ORDER_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color, icon: s.icon };
  return acc;
}, {});

const TICKET_ORDER_TABS = [
  { value: 'all', label: '全部' },
  { value: 'paid', label: '待使用' },
  { value: 'checked_in', label: '已验票' },
  { value: 'refunded', label: '已退票' }
];

const TICKET_PAY_METHODS = [
  { value: 'balance', label: '余额支付', icon: '💰' },
  { value: 'wechat', label: '微信支付', icon: '💚' }
];

const CLUB_ACTIVITY_TABS_EXTENDED = [
  { value: 'all', label: '全部活动' },
  { value: 'ongoing', label: '进行中' },
  { value: 'upcoming', label: '即将开始' },
  { value: 'ended', label: '已结束' },
  { value: 'my', label: '我报名的' },
  { value: 'my_tickets', label: '我的票务' }
];

// ==================== 创新创业项目工坊 ====================

const INNOVATION_PROJECT_FIELDS = [
  { value: 'ai', label: '人工智能', color: '#6366F1', icon: '🤖' },
  { value: 'internet', label: '互联网', color: '#3B82F6', icon: '🌐' },
  { value: 'hardware', label: '智能硬件', color: '#10B981', icon: '⚡' },
  { value: 'biomedical', label: '生物医药', color: '#EC4899', icon: '🧬' },
  { value: 'new_energy', label: '新能源', color: '#F59E0B', icon: '🔋' },
  { value: 'cultural_creative', label: '文化创意', color: '#8B5CF6', icon: '🎨' },
  { value: 'education', label: '教育培训', color: '#14B8A6', icon: '📚' },
  { value: 'fintech', label: '金融科技', color: '#22C55E', icon: '💳' },
  { value: 'agriculture', label: '现代农业', color: '#84CC16', icon: '🌱' },
  { value: 'other', label: '其他', color: '#6B7280', icon: '📌' }
];

const INNOVATION_PROJECT_STAGES = [
  { value: 'idea', label: '创意阶段', color: '#6B7280', icon: '💡' },
  { value: 'mvp', label: 'MVP阶段', color: '#3B82F6', icon: '🔨' },
  { value: 'early', label: '早期成长', color: '#10B981', icon: '🌱' },
  { value: 'growth', label: '快速增长', color: '#F59E0B', icon: '🚀' },
  { value: 'mature', label: '成熟稳定', color: '#8B5CF6', icon: '🏢' }
];

const INNOVATION_FINANCING_STAGES = [
  { value: 'none', label: '暂不需要', color: '#6B7280' },
  { value: 'angel', label: '天使轮', color: '#3B82F6' },
  { value: 'pre_a', label: 'Pre-A轮', color: '#10B981' },
  { value: 'a_round', label: 'A轮', color: '#F59E0B' },
  { value: 'b_round', label: 'B轮', color: '#8B5CF6' },
  { value: 'c_round', label: 'C轮及以上', color: '#EC4899' }
];

const INNOVATION_TEAM_ROLES = [
  { value: 'product', label: '产品经理', color: '#3B82F6', icon: '📋' },
  { value: 'frontend', label: '前端开发', color: '#10B981', icon: '💻' },
  { value: 'backend', label: '后端开发', color: '#8B5CF6', icon: '🖥️' },
  { value: 'mobile', label: '移动端开发', color: '#F59E0B', icon: '📱' },
  { value: 'ui_ux', label: 'UI/UX设计', color: '#EC4899', icon: '🎨' },
  { value: 'algorithm', label: '算法工程师', color: '#14B8A6', icon: '🧮' },
  { value: 'marketing', label: '市场营销', color: '#22C55E', icon: '📣' },
  { value: 'operation', label: '运营推广', color: '#F97316', icon: '📊' },
  { value: 'finance', label: '财务法务', color: '#6366F1', icon: '📑' },
  { value: 'hr', label: '人力资源', color: '#EC4899', icon: '👥' },
  { value: 'other', label: '其他角色', color: '#6B7280', icon: '📌' }
];

const INNOVATION_MENTOR_TITLES = [
  { value: 'professor', label: '教授/研究员', color: '#6366F1' },
  { value: 'entrepreneur', label: '创业导师', color: '#F59E0B' },
  { value: 'investor', label: '投资人', color: '#10B981' },
  { value: 'industry_expert', label: '行业专家', color: '#3B82F6' },
  { value: 'lawyer', label: '法律顾问', color: '#8B5CF6' },
  { value: 'accountant', label: '财务顾问', color: '#EC4899' }
];

const INNOVATION_ROADSHOW_STATUS = [
  { value: 'upcoming', label: '即将开始', color: '#3B82F6' },
  { value: 'registering', label: '报名中', color: '#10B981' },
  { value: 'ongoing', label: '进行中', color: '#F59E0B' },
  { value: 'ended', label: '已结束', color: '#6B7280' }
];

const INNOVATION_POLICY_TYPES = [
  { value: 'grant', label: '补贴政策', icon: '💰', color: '#10B981' },
  { value: 'tax', label: '税收优惠', icon: '📑', color: '#3B82F6' },
  { value: 'incubator', label: '孵化支持', icon: '🏢', color: '#8B5CF6' },
  { value: 'talent', label: '人才政策', icon: '👥', color: '#F59E0B' },
  { value: 'financing', label: '融资服务', icon: '💳', color: '#EC4899' },
  { value: 'other', label: '其他政策', icon: '📌', color: '#6B7280' }
];

const INNOVATION_INCUBATOR_TYPES = [
  { value: 'university', label: '大学科技园', icon: '🎓', color: '#3B82F6' },
  { value: 'government', label: '政府孵化器', icon: '🏛️', color: '#10B981' },
  { value: 'private', label: '民营孵化器', icon: '🏢', color: '#8B5CF6' },
  { value: 'accelerator', label: '加速器', icon: '🚀', color: '#F59E0B' }
];

const INNOVATION_PROJECT_TABS = [
  { value: 'all', label: '全部' },
  { value: 'recruiting', label: '招募中' },
  { value: 'financing', label: '融资中' }
];

const INNOVATION_MAIN_TABS = [
  { value: 'projects', label: '项目展示', icon: '🚀' },
  { value: 'mentors', label: '导师预约', icon: '👨‍🏫' },
  { value: 'roadshows', label: '路演活动', icon: '📢' },
  { value: 'policies', label: '政策服务', icon: '📋' }
];

const INNOVATION_APPOINTMENT_TIME_SLOTS = [
  { value: '09:00-10:00', label: '09:00 - 10:00' },
  { value: '10:00-11:00', label: '10:00 - 11:00' },
  { value: '14:00-15:00', label: '14:00 - 15:00' },
  { value: '15:00-16:00', label: '15:00 - 16:00' },
  { value: '16:00-17:00', label: '16:00 - 17:00' },
  { value: '19:00-20:00', label: '19:00 - 20:00' },
  { value: '20:00-21:00', label: '20:00 - 21:00' }
];

const INNOVATION_PROJECT_STATUS = [
  { value: 'active', label: '进行中', color: '#10B981' },
  { value: 'paused', label: '已暂停', color: '#F59E0B' },
  { value: 'closed', label: '已关闭', color: '#6B7280' }
];

const INNOVATION_PROJECT_STATUS_MAP = INNOVATION_PROJECT_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color };
  return acc;
}, {});

// ==================== 流浪动物救助站 ====================

const ANIMAL_TYPES = [
  { value: 'dog', label: '狗狗', icon: '🐕', color: '#FF8C42' },
  { value: 'cat', label: '猫咪', icon: '🐱', color: '#9B59B6' },
  { value: 'rabbit', label: '兔子', icon: '🐰', color: '#F39C12' },
  { value: 'bird', label: '鸟类', icon: '🐦', color: '#3498DB' },
  { value: 'other', label: '其他', icon: '🐾', color: '#1ABC9C' }
];

const ANIMAL_TYPE_MAP = ANIMAL_TYPES.reduce((acc, t) => {
  acc[t.value] = { label: t.label, icon: t.icon, color: t.color };
  return acc;
}, {});

const ANIMAL_GENDERS = [
  { value: 'male', label: '公', icon: '♂' },
  { value: 'female', label: '母', icon: '♀' }
];

const ANIMAL_HEALTH_STATUS = [
  { value: 'excellent', label: '非常健康', color: '#10B981', icon: '💚' },
  { value: 'good', label: '健康', color: '#22C55E', icon: '✅' },
  { value: 'recovering', label: '康复中', color: '#F59E0B', icon: '💊' },
  { value: 'special', label: '特殊照顾', color: '#EF4444', icon: '🏥' }
];

const ANIMAL_HEALTH_MAP = ANIMAL_HEALTH_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color, icon: s.icon };
  return acc;
}, {});

const ANIMAL_PERSONALITY_TAGS = [
  { value: 'friendly', label: '亲人', color: '#FF6B6B' },
  { value: 'active', label: '活泼', color: '#FFE66D' },
  { value: 'quiet', label: '安静', color: '#4ECDC4' },
  { value: 'shy', label: '胆小', color: '#95E1D3' },
  { value: 'playful', label: '爱玩', color: '#FF8E8E' },
  { value: 'independent', label: '独立', color: '#A8D8EA' },
  { value: 'gentle', label: '温顺', color: '#FDCB6E' },
  { value: 'curious', label: '好奇', color: '#74B9FF' },
  { value: 'protective', label: '护主', color: '#E17055' },
  { value: 'social', label: '合群', color: '#55EFC4' }
];

const ANIMAL_AGE_RANGES = [
  { value: 'baby', label: '幼年(0-1岁)', min: 0, max: 1 },
  { value: 'young', label: '青年(1-3岁)', min: 1, max: 3 },
  { value: 'adult', label: '成年(3-7岁)', min: 3, max: 7 },
  { value: 'senior', label: '老年(7岁+)', min: 7, max: 30 }
];

const ADOPTION_STATUS = [
  { value: 'available', label: '待领养', color: '#10B981' },
  { value: 'pending', label: '申请中', color: '#F59E0B' },
  { value: 'reserved', label: '已预定', color: '#3B82F6' },
  { value: 'adopted', label: '已领养', color: '#6B7280' }
];

const ADOPTION_STATUS_MAP = ADOPTION_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color };
  return acc;
}, {});

const ADOPTION_APPLICATION_STATUS = [
  { value: 'pending', label: '待审核', color: '#F59E0B', icon: '⏳' },
  { value: 'reviewing', label: '审核中', color: '#3B82F6', icon: '🔍' },
  { value: 'interview', label: '待家访', color: '#8B5CF6', icon: '🏠' },
  { value: 'approved', label: '已通过', color: '#10B981', icon: '✅' },
  { value: 'rejected', label: '已拒绝', color: '#EF4444', icon: '❌' },
  { value: 'completed', label: '已完成', color: '#10B981', icon: '🎉' }
];

const ADOPTION_APPLICATION_STATUS_MAP = ADOPTION_APPLICATION_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color, icon: s.icon };
  return acc;
}, {});

const VISIT_RECORD_TYPES = [
  { value: 'first', label: '首次家访', color: '#3B82F6' },
  { value: 'weekly', label: '周回访', color: '#10B981' },
  { value: 'monthly', label: '月回访', color: '#8B5CF6' },
  { value: 'quarterly', label: '季回访', color: '#F59E0B' },
  { value: 'special', label: '专项回访', color: '#EC4899' }
];

const DONATION_TYPES = [
  { value: 'money', label: '资金捐赠', icon: '💰', color: '#10B981' },
  { value: 'food', label: '粮食物资', icon: '🥣', color: '#F59E0B' },
  { value: 'medical', label: '医疗物资', icon: '💊', color: '#EF4444' },
  { value: 'daily', label: '生活用品', icon: '🧻', color: '#3B82F6' },
  { value: 'other', label: '其他物资', icon: '📦', color: '#8B5CF6' }
];

const VOLUNTEER_ROLES = [
  { value: 'feeding', label: '喂养照顾', icon: '🍖', color: '#FF6B6B' },
  { value: 'cleaning', label: '清洁打扫', icon: '🧹', color: '#4ECDC4' },
  { value: 'medical', label: '医疗协助', icon: '🏥', color: '#EF4444' },
  { value: 'walking', label: '遛狗陪玩', icon: '🎾', color: '#FFE66D' },
  { value: 'photography', label: '摄影宣传', icon: '📸', color: '#8B5CF6' },
  { value: 'adoption', label: '领养对接', icon: '🤝', color: '#3B82F6' },
  { value: 'transport', label: '运输接送', icon: '🚗', color: '#F59E0B' },
  { value: 'other', label: '其他', icon: '👐', color: '#6B7280' }
];

const SHELTER_MAIN_TABS = [
  { value: 'pets', label: '待领养', icon: '🐾' },
  { value: 'donation', label: '捐赠', icon: '💝' },
  { value: 'volunteer', label: '志愿者', icon: '🙋' },
  { value: 'my', label: '我的', icon: '👤' }
];

const SHELTER_FILTER_TABS = [
  { value: 'all', label: '全部' },
  { value: 'dog', label: '狗狗' },
  { value: 'cat', label: '猫咪' },
  { value: 'rabbit', label: '兔子' },
  { value: 'bird', label: '鸟类' },
  { value: 'other', label: '其他' }
];

// ==================== 低碳校园 / 绿色打卡 ====================

const LOW_CARBON_CHECKIN_TYPES = [
  { value: 'walk_to_school', label: '步行上学', icon: '🚶', points: 5, carbon: 0.5, desc: '步行或骑行上学，减少碳排放' },
  { value: 'empty_plate', label: '光盘行动', icon: '🍽️', points: 3, carbon: 0.3, desc: '吃完餐盘里的所有食物' },
  { value: 'paperless', label: '无纸化办公', icon: '📱', points: 4, carbon: 0.4, desc: '使用电子文档，减少纸张消耗' },
  { value: 'public_transport', label: '公共交通', icon: '🚌', points: 6, carbon: 0.8, desc: '乘坐公共交通工具出行' }
];

const LOW_CARBON_CHECKIN_MAP = LOW_CARBON_CHECKIN_TYPES.reduce((acc, t) => {
  acc[t.value] = { label: t.label, icon: t.icon, points: t.points, carbon: t.carbon, desc: t.desc };
  return acc;
}, {});

const LOW_CARBON_ACHIEVEMENTS = [
  { value: 'first_checkin', label: '绿色初心', icon: '🌱', desc: '完成首次打卡', condition: 1, type: 'checkin_count', reward: 10 },
  { value: 'week_3', label: '坚持3天', icon: '🌿', desc: '累计打卡3天', condition: 3, type: 'checkin_days', reward: 20 },
  { value: 'week_7', label: '坚持一周', icon: '🌳', desc: '累计打卡7天', condition: 7, type: 'checkin_days', reward: 50 },
  { value: 'month_15', label: '半月达人', icon: '🏆', desc: '累计打卡15天', condition: 15, type: 'checkin_days', reward: 100 },
  { value: 'month_30', label: '月度先锋', icon: '🥇', desc: '累计打卡30天', condition: 30, type: 'checkin_days', reward: 200 },
  { value: 'points_100', label: '积分百户', icon: '💯', desc: '累计碳积分达到100', condition: 100, type: 'total_points', reward: 30 },
  { value: 'points_500', label: '积分千长', icon: '🎖️', desc: '累计碳积分达到500', condition: 500, type: 'total_points', reward: 80 },
  { value: 'walker_10', label: '步行能手', icon: '👟', desc: '步行上学打卡10次', condition: 10, type: 'walk_to_school', reward: 30 },
  { value: 'saver_20', label: '光盘卫士', icon: '🥢', desc: '光盘行动打卡20次', condition: 20, type: 'empty_plate', reward: 50 }
];

const LOW_CARBON_REWARD_STATUS = [
  { value: 'available', label: '可兑换', color: '#10B981' },
  { value: 'limited', label: '限量抢兑', color: '#F59E0B' },
  { value: 'redeemed', label: '已兑换', color: '#6B7280' },
  { value: 'insufficient', label: '积分不足', color: '#EF4444' }
];

const LOW_CARBON_REWARD_CATEGORIES = [
  { value: 'all', label: '全部', icon: '🎁' },
  { value: 'coupon', label: '优惠券', icon: '🏷️' },
  { value: 'gift', label: '实体礼品', icon: '🎀' },
  { value: 'virtual', label: '虚拟道具', icon: '✨' },
  { value: 'service', label: '服务权益', icon: '⚡' }
];

const LOW_CARBON_ACTIVITY_TYPES = [
  { value: 'tree_planting', label: '植树活动', icon: '🌲', color: '#22C55E' },
  { value: 'cleanup', label: '校园清洁', icon: '🧹', color: '#3B82F6' },
  { value: 'lecture', label: '环保讲座', icon: '🎤', color: '#8B5CF6' },
  { value: 'recycling', label: '垃圾分类', icon: '♻️', color: '#14B8A6' },
  { value: 'competition', label: '环保竞赛', icon: '🏅', color: '#F59E0B' },
  { value: 'other', label: '其他活动', icon: '🌿', color: '#6B7280' }
];

const LOW_CARBON_ACTIVITY_TYPE_MAP = LOW_CARBON_ACTIVITY_TYPES.reduce((acc, t) => {
  acc[t.value] = { label: t.label, icon: t.icon, color: t.color };
  return acc;
}, {});

const LOW_CARBON_ACTIVITY_STATUS = [
  { value: 'registering', label: '报名中', color: '#10B981' },
  { value: 'full', label: '名额已满', color: '#F59E0B' },
  { value: 'ongoing', label: '进行中', color: '#3B82F6' },
  { value: 'ended', label: '已结束', color: '#6B7280' }
];

const LOW_CARBON_ACTIVITY_STATUS_MAP = LOW_CARBON_ACTIVITY_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color };
  return acc;
}, {});

const LOW_CARBON_LEADERBOARD_TABS = [
  { value: 'week', label: '本周榜' },
  { value: 'month', label: '本月榜' },
  { value: 'total', label: '总榜' }
];

const LOW_CARBON_TIPS = [
  '随手关灯，节约每一度电',
  '双面打印，减少纸张浪费',
  '自带水杯，拒绝一次性塑料',
  '尽量爬楼，少乘电梯更健康',
  '旧物循环利用，传递环保理念'
];

const INTL_GUIDE_CATEGORIES = [
  {
    value: 'visa',
    label: '签证居留',
    labelEn: 'Visa & Residence',
    icon: '🛂',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)'
  },
  {
    value: 'medical',
    label: '医疗保险',
    labelEn: 'Medical Insurance',
    icon: '🏥',
    color: '#EF4444',
    gradient: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)'
  },
  {
    value: 'bank',
    label: '银行开户',
    labelEn: 'Bank Account',
    icon: '🏦',
    color: '#10B981',
    gradient: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)'
  },
  {
    value: 'sim',
    label: 'SIM卡办理',
    labelEn: 'SIM Card',
    icon: '📱',
    color: '#8B5CF6',
    gradient: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)'
  }
];

const INTL_BUDDY_MAJORS = [
  '计算机科学', '软件工程', '电子工程', '机械工程', '土木工程',
  '工商管理', '经济学', '金融学', '国际关系', '新闻传播',
  '中国语言文学', '英语', '日语', '艺术设计', '数学', '物理学', '化学', '生物学', '医学', '法学'
];

const INTL_BUDDY_GRADES = [
  { value: 'freshman', label: '大一', labelEn: 'Freshman' },
  { value: 'sophomore', label: '大二', labelEn: 'Sophomore' },
  { value: 'junior', label: '大三', labelEn: 'Junior' },
  { value: 'senior', label: '大四', labelEn: 'Senior' },
  { value: 'master', label: '硕士', labelEn: 'Master' },
  { value: 'phd', label: '博士', labelEn: 'PhD' }
];

const INTL_BUDDY_HOBBIES = [
  { value: 'sports', label: '运动健身', labelEn: 'Sports & Fitness', icon: '🏃' },
  { value: 'music', label: '音乐', labelEn: 'Music', icon: '🎵' },
  { value: 'movie', label: '电影', labelEn: 'Movies', icon: '🎬' },
  { value: 'reading', label: '阅读', labelEn: 'Reading', icon: '📚' },
  { value: 'travel', label: '旅行', labelEn: 'Travel', icon: '✈️' },
  { value: 'food', label: '美食', labelEn: 'Food', icon: '🍜' },
  { value: 'photography', label: '摄影', labelEn: 'Photography', icon: '📷' },
  { value: 'gaming', label: '游戏', labelEn: 'Gaming', icon: '🎮' },
  { value: 'art', label: '艺术绘画', labelEn: 'Art & Drawing', icon: '🎨' },
  { value: 'dance', label: '舞蹈', labelEn: 'Dancing', icon: '💃' },
  { value: 'cooking', label: '烹饪', labelEn: 'Cooking', icon: '🍳' },
  { value: 'language', label: '语言学习', labelEn: 'Language Learning', icon: '🌍' }
];

const INTL_BUDDY_LANGUAGES = [
  { value: 'zh', label: '中文', labelEn: 'Chinese', level: '母语' },
  { value: 'en', label: '英语', labelEn: 'English', level: 'Fluent' },
  { value: 'ja', label: '日语', labelEn: 'Japanese', level: 'Intermediate' },
  { value: 'ko', label: '韩语', labelEn: 'Korean', level: 'Intermediate' },
  { value: 'fr', label: '法语', labelEn: 'French', level: 'Basic' },
  { value: 'de', label: '德语', labelEn: 'German', level: 'Basic' },
  { value: 'es', label: '西班牙语', labelEn: 'Spanish', level: 'Basic' }
];

const INTL_EVENT_CATEGORIES = [
  { value: 'festival', label: '传统节日', labelEn: 'Traditional Festival', icon: '🏮', color: '#EF4444' },
  { value: 'workshop', label: '文化工坊', labelEn: 'Cultural Workshop', icon: '🎨', color: '#8B5CF6' },
  { value: 'tour', label: '城市游览', labelEn: 'City Tour', icon: '🗺️', color: '#3B82F6' },
  { value: 'social', label: '社交聚会', labelEn: 'Social Gathering', icon: '🎉', color: '#F59E0B' },
  { value: 'sports', label: '体育活动', labelEn: 'Sports Event', icon: '⚽', color: '#10B981' },
  { value: 'academic', label: '学术交流', labelEn: 'Academic Exchange', icon: '🎓', color: '#6366F1' }
];

const INTL_EVENT_STATUS = [
  { value: 'registering', label: '报名中', labelEn: 'Registering', color: '#10B981' },
  { value: 'full', label: '已满员', labelEn: 'Full', color: '#F59E0B' },
  { value: 'ongoing', label: '进行中', labelEn: 'Ongoing', color: '#3B82F6' },
  { value: 'ended', label: '已结束', labelEn: 'Ended', color: '#6B7280' }
];

const INTL_EMERGENCY_CONTACTS = [
  {
    id: 'english_hotline',
    name: '英语紧急热线',
    nameEn: 'English Emergency Line',
    phone: '400-888-9999',
    desc: '全天候英语服务，处理各类紧急事务',
    descEn: '24/7 English service for all emergencies',
    icon: '📞',
    color: '#EF4444',
    priority: 1
  },
  {
    id: 'campus_police',
    name: '校园安保',
    nameEn: 'Campus Security',
    phone: '010-12345678',
    desc: '校园内安全问题、遗失物品等',
    descEn: 'Campus safety, lost items, etc.',
    icon: '👮',
    color: '#3B82F6',
    priority: 2
  },
  {
    id: 'hospital',
    name: '校医院急诊',
    nameEn: 'Hospital Emergency',
    phone: '010-87654321',
    desc: '24小时急诊医疗服务',
    descEn: '24-hour emergency medical service',
    icon: '🏥',
    color: '#10B981',
    priority: 2
  },
  {
    id: 'mental_health',
    name: '心理咨询热线',
    nameEn: 'Mental Health Hotline',
    phone: '400-161-9995',
    desc: '专业心理咨询师在线援助',
    descEn: 'Professional counselor online support',
    icon: '💚',
    color: '#8B5CF6',
    priority: 3
  },
  {
    id: 'international_office',
    name: '国际交流处',
    nameEn: 'International Office',
    phone: '010-11223344',
    desc: '签证、居留、学籍相关事务',
    descEn: 'Visa, residence, academic affairs',
    icon: '🌍',
    color: '#F59E0B',
    priority: 3
  }
];

const ALUMNI_MAIN_TABS = [
  { value: 'feed', label: '校友动态', icon: '📢' },
  { value: 'mentors', label: '导师计划', icon: '👨‍🏫' },
  { value: 'industry', label: '行业分布', icon: '📊' },
  { value: 'services', label: '校友服务', icon: '🎫' }
];

const ALUMNI_VERIFY_STATUS = [
  { value: 'pending', label: '审核中', color: '#F59E0B', icon: '⏳' },
  { value: 'approved', label: '已认证', color: '#10B981', icon: '✅' },
  { value: 'rejected', label: '未通过', color: '#EF4444', icon: '❌' },
  { value: 'unverified', label: '未认证', color: '#6B7280', icon: '📝' }
];

const ALUMNI_VERIFY_STATUS_MAP = ALUMNI_VERIFY_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color, icon: s.icon };
  return acc;
}, {});

const ALUMNI_COLLEGES = [
  { value: 'cs', label: '计算机学院' },
  { value: 'ee', label: '电子信息学院' },
  { value: 'me', label: '机械工程学院' },
  { value: 'ce', label: '土木工程学院' },
  { value: 'business', label: '经济管理学院' },
  { value: 'law', label: '法学院' },
  { value: 'medicine', label: '医学院' },
  { value: 'art', label: '艺术设计学院' },
  { value: 'foreign', label: '外国语学院' },
  { value: 'science', label: '理学院' },
  { value: 'humanities', label: '人文学院' },
  { value: 'education', label: '教育学院' }
];

const ALUMNI_GRADUATION_YEARS = (() => {
  const years = [];
  const currentYear = new Date().getFullYear();
  for (let i = 0; i < 40; i++) {
    const year = currentYear - i;
    years.push({ value: String(year), label: `${year}届` });
  }
  return years;
})();

const ALUMNI_INDUSTRIES = [
  { value: 'internet', label: '互联网/IT', color: '#3B82F6', icon: '💻' },
  { value: 'finance', label: '金融/投资', color: '#10B981', icon: '💰' },
  { value: 'education', label: '教育/培训', color: '#F59E0B', icon: '📚' },
  { value: 'medical', label: '医疗/健康', color: '#EF4444', icon: '🏥' },
  { value: 'manufacturing', label: '制造业', color: '#8B5CF6', icon: '🏭' },
  { value: 'consulting', label: '咨询/服务', color: '#EC4899', icon: '💼' },
  { value: 'media', label: '传媒/广告', color: '#14B8A6', icon: '📺' },
  { value: 'government', label: '政府/事业单位', color: '#6366F1', icon: '🏛️' },
  { value: 'real_estate', label: '房地产/建筑', color: '#F97316', icon: '🏢' },
  { value: 'retail', label: '零售/电商', color: '#22C55E', icon: '🛒' },
  { value: 'other', label: '其他行业', color: '#6B7280', icon: '📌' }
];

const ALUMNI_INDUSTRY_MAP = ALUMNI_INDUSTRIES.reduce((acc, i) => {
  acc[i.value] = { label: i.label, color: i.color, icon: i.icon };
  return acc;
}, {});

const ALUMNI_MENTOR_TITLES = [
  { value: 'ceo', label: '企业CEO/创始人', color: '#6366F1' },
  { value: 'director', label: '总监/高管', color: '#3B82F6' },
  { value: 'manager', label: '部门经理', color: '#10B981' },
  { value: 'senior_engineer', label: '资深工程师', color: '#F59E0B' },
  { value: 'professor', label: '教授/研究员', color: '#8B5CF6' },
  { value: 'investor', label: '投资人', color: '#EC4899' },
  { value: 'lawyer', label: '律师', color: '#14B8A6' },
  { value: 'doctor', label: '医生', color: '#EF4444' }
];

const ALUMNI_POST_TYPES = [
  { value: 'share', label: '经验分享', icon: '💡', color: '#3B82F6' },
  { value: 'job', label: '招聘内推', icon: '💼', color: '#10B981' },
  { value: 'activity', label: '校友活动', icon: '🎉', color: '#F59E0B' },
  { value: 'help', label: '求助提问', icon: '❓', color: '#8B5CF6' },
  { value: 'life', label: '生活日常', icon: '🌈', color: '#EC4899' }
];

const ALUMNI_POST_TYPE_MAP = ALUMNI_POST_TYPES.reduce((acc, t) => {
  acc[t.value] = { label: t.label, icon: t.icon, color: t.color };
  return acc;
}, {});

const ALUMNI_VISIT_TYPES = [
  { value: 'personal', label: '个人返校', icon: '👤', color: '#3B82F6' },
  { value: 'class_reunion', label: '班级聚会', icon: '👥', color: '#10B981' },
  { value: 'business', label: '商务交流', icon: '🤝', color: '#F59E0B' },
  { value: 'lecture', label: '讲座分享', icon: '🎤', color: '#8B5CF6' },
  { value: 'other', label: '其他事由', icon: '📌', color: '#6B7280' }
];

const ALUMNI_VISIT_STATUS = [
  { value: 'pending', label: '待审核', color: '#F59E0B', icon: '⏳' },
  { value: 'approved', label: '已通过', color: '#10B981', icon: '✅' },
  { value: 'rejected', label: '已拒绝', color: '#EF4444', icon: '❌' },
  { value: 'completed', label: '已完成', color: '#6B7280', icon: '🎉' }
];

const ALUMNI_VISIT_STATUS_MAP = ALUMNI_VISIT_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color, icon: s.icon };
  return acc;
}, {});

const ALUMNI_APPOINTMENT_STATUS = [
  { value: 'pending', label: '待确认', color: '#F59E0B', icon: '⏳' },
  { value: 'confirmed', label: '已确认', color: '#10B981', icon: '✅' },
  { value: 'rejected', label: '已拒绝', color: '#EF4444', icon: '❌' },
  { value: 'completed', label: '已完成', color: '#6B7280', icon: '🎉' },
  { value: 'cancelled', label: '已取消', color: '#9CA3AF', icon: '✕' }
];

const ALUMNI_APPOINTMENT_STATUS_MAP = ALUMNI_APPOINTMENT_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color, icon: s.icon };
  return acc;
}, {});

const ALUMNI_APPOINTMENT_TIME_SLOTS = [
  { value: '09:00-10:00', label: '09:00 - 10:00' },
  { value: '10:00-11:00', label: '10:00 - 11:00' },
  { value: '14:00-15:00', label: '14:00 - 15:00' },
  { value: '15:00-16:00', label: '15:00 - 16:00' },
  { value: '16:00-17:00', label: '16:00 - 17:00' },
  { value: '19:00-20:00', label: '19:00 - 20:00' },
  { value: '20:00-21:00', label: '20:00 - 21:00' }
];

const ALUMNI_CARD_BENEFIT_CATEGORIES = [
  { value: 'education', label: '学习教育', icon: '📚', color: '#3B82F6' },
  { value: 'library', label: '图书资源', icon: '📖', color: '#10B981' },
  { value: 'sports', label: '体育健身', icon: '🏃', color: '#F59E0B' },
  { value: 'dining', label: '餐饮服务', icon: '🍜', color: '#EF4444' },
  { value: 'medical', label: '医疗服务', icon: '🏥', color: '#8B5CF6' },
  { value: 'culture', label: '文化活动', icon: '🎭', color: '#EC4899' },
  { value: 'travel', label: '出行优惠', icon: '✈️', color: '#14B8A6' },
  { value: 'shopping', label: '购物优惠', icon: '🛍️', color: '#6366F1' }
];

const SOS_TRIGGER_DURATION = 3000;

const SOS_STATUS = {
  PENDING: 'pending',
  SENT: 'sent',
  CANCELLED: 'cancelled'
};

const SOS_STATUS_MAP = {
  pending: { label: '待发送', color: '#F59E0B' },
  sent: { label: '已发送', color: '#10B981' },
  cancelled: { label: '已取消', color: '#6B7280' }
};

const SAFETY_CATEGORIES = [
  { value: 'all', label: '全部', icon: '📚' },
  { value: 'campus', label: '校园安全', icon: '🏫' },
  { value: 'traffic', label: '交通安全', icon: '🚗' },
  { value: 'fire', label: '消防安全', icon: '🔥' },
  { value: 'anti_fraud', label: '防诈骗', icon: '🕵️' },
  { value: 'mental', label: '心理健康', icon: '💚' },
  { value: 'emergency', label: '应急处理', icon: '🚨' }
];

const CAMPUS_SECURITY_CONTACTS = [
  { id: 'security_office', name: '保卫处', phone: '010-12345678', description: '24小时值班', icon: '👮' },
  { id: 'campus_police', name: '校园警务站', phone: '010-87654321', description: '工作日8:00-22:00', icon: '🚓' },
  { id: 'medical_center', name: '校医务室', phone: '010-11112222', description: '24小时急诊', icon: '🏥' },
  { id: 'psychology_center', name: '心理咨询中心', phone: '010-33334444', description: '工作日9:00-17:00', icon: '💚' },
  { id: 'student_affairs', name: '学生处', phone: '010-55556666', description: '工作日8:30-17:30', icon: '👨‍🏫' }
];

const LAB_TYPES = [
  { value: 'all', label: '全部', icon: '🔬' },
  { value: 'chemistry', label: '化学实验室', icon: '🧪' },
  { value: 'physics', label: '物理实验室', icon: '⚡' },
  { value: 'biology', label: '生物实验室', icon: '🧬' },
  { value: 'computer', label: '计算机实验室', icon: '💻' },
  { value: 'electronic', label: '电子实验室', icon: '🔌' },
  { value: 'mechanical', label: '机械实验室', icon: '⚙️' }
];

const LAB_SAFETY_LEVELS = [
  { value: 'level1', label: '一级', color: '#52C41A', desc: '普通安全' },
  { value: 'level2', label: '二级', color: '#FAAD14', desc: '低风险' },
  { value: 'level3', label: '三级', color: '#FA8C16', desc: '中风险' },
  { value: 'level4', label: '四级', color: '#F5222D', desc: '高风险' }
];

const LAB_SAFETY_LEVEL_MAP = LAB_SAFETY_LEVELS.reduce((acc, l) => {
  acc[l.value] = { label: l.label, color: l.color, desc: l.desc };
  return acc;
}, {});

const LAB_APPOINTMENT_STATUS = [
  { value: 'pending', label: '待审批', color: '#FAAD14', icon: '⏳' },
  { value: 'approved', label: '已通过', color: '#52C41A', icon: '✅' },
  { value: 'rejected', label: '已拒绝', color: '#F5222D', icon: '❌' },
  { value: 'checked_in', label: '使用中', color: '#1890FF', icon: '🔓' },
  { value: 'checked_out', label: '已完成', color: '#52C41A', icon: '🔒' },
  { value: 'cancelled', label: '已取消', color: '#8C8C8C', icon: '✖️' },
  { value: 'violation', label: '已违规', color: '#F5222D', icon: '⚠️' }
];

const LAB_APPOINTMENT_STATUS_MAP = LAB_APPOINTMENT_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color, icon: s.icon };
  return acc;
}, {});

const LAB_TIME_SLOTS = [
  { value: '08:00-10:00', label: '08:00 - 10:00' },
  { value: '10:00-12:00', label: '10:00 - 12:00' },
  { value: '14:00-16:00', label: '14:00 - 16:00' },
  { value: '16:00-18:00', label: '16:00 - 18:00' },
  { value: '19:00-21:00', label: '19:00 - 21:00' }
];

const LAB_MY_APPOINTMENT_TABS = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待审批' },
  { value: 'approved', label: '已通过' },
  { value: 'using', label: '使用中' },
  { value: 'completed', label: '已完成' }
];

const LAB_ADMIN_TABS = [
  { value: 'pending', label: '待审批' },
  { value: 'approved', label: '已通过' },
  { value: 'rejected', label: '已拒绝' }
];

const LAB_VIOLATION_TYPES = [
  { value: 'late_return', label: '超时未归还', score: -5, icon: '⏰' },
  { value: 'no_show', label: '预约未使用', score: -3, icon: '🚫' },
  { value: 'damage', label: '设备损坏', score: -10, icon: '💔' },
  { value: 'rule_violation', label: '违规操作', score: -8, icon: '⚠️' }
];

const VENUE_TYPES = [
  { value: 'all', label: '全部', icon: '🏟️' },
  { value: 'stadium', label: '体育馆场地', icon: '🏀' },
  { value: 'badminton', label: '羽毛球馆', icon: '🏸' },
  { value: 'meeting_room', label: '会议室', icon: '🏢' },
  { value: 'study_room', label: '自习室包间', icon: '📚' }
];

const VENUE_APPOINTMENT_STATUS = [
  { value: 'pending', label: '待审批', color: '#FAAD14', icon: '⏳' },
  { value: 'approved', label: '已通过', color: '#52C41A', icon: '✅' },
  { value: 'rejected', label: '已拒绝', color: '#F5222D', icon: '❌' },
  { value: 'checked_in', label: '使用中', color: '#1890FF', icon: '🔓' },
  { value: 'checked_out', label: '已完成', color: '#52C41A', icon: '🔒' },
  { value: 'cancelled', label: '已取消', color: '#8C8C8C', icon: '✖️' },
  { value: 'violation', label: '已违约', color: '#F5222D', icon: '⚠️' }
];

const VENUE_APPOINTMENT_STATUS_MAP = VENUE_APPOINTMENT_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color, icon: s.icon };
  return acc;
}, {});

const VENUE_TIME_SLOTS = [
  { value: '08:00-09:00', label: '08:00 - 09:00', startMinute: 480, endMinute: 540 },
  { value: '09:00-10:00', label: '09:00 - 10:00', startMinute: 540, endMinute: 600 },
  { value: '10:00-11:00', label: '10:00 - 11:00', startMinute: 600, endMinute: 660 },
  { value: '11:00-12:00', label: '11:00 - 12:00', startMinute: 660, endMinute: 720 },
  { value: '14:00-15:00', label: '14:00 - 15:00', startMinute: 840, endMinute: 900 },
  { value: '15:00-16:00', label: '15:00 - 16:00', startMinute: 900, endMinute: 960 },
  { value: '16:00-17:00', label: '16:00 - 17:00', startMinute: 960, endMinute: 1020 },
  { value: '17:00-18:00', label: '17:00 - 18:00', startMinute: 1020, endMinute: 1080 },
  { value: '19:00-20:00', label: '19:00 - 20:00', startMinute: 1140, endMinute: 1200 },
  { value: '20:00-21:00', label: '20:00 - 21:00', startMinute: 1200, endMinute: 1260 },
  { value: '21:00-22:00', label: '21:00 - 22:00', startMinute: 1260, endMinute: 1320 }
];

const VENUE_MY_APPOINTMENT_TABS = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待审批' },
  { value: 'approved', label: '待使用' },
  { value: 'using', label: '使用中' },
  { value: 'completed', label: '已完成' }
];

const VENUE_ADMIN_TABS = [
  { value: 'pending', label: '待审批' },
  { value: 'approved', label: '已通过' },
  { value: 'rejected', label: '已拒绝' }
];

const VENUE_VIOLATION_TYPES = [
  { value: 'late_checkout', label: '超时签退', score: -3, icon: '⏰', fee: 10 },
  { value: 'no_show', label: '预约未使用', score: -5, icon: '🚫', fee: 0 },
  { value: 'damage', label: '设施损坏', score: -10, icon: '💔', fee: 50 },
  { value: 'rule_violation', label: '违规使用', score: -8, icon: '⚠️', fee: 20 }
];

const VENUE_VIOLATION_TYPES_MAP = VENUE_VIOLATION_TYPES.reduce((acc, v) => {
  acc[v.value] = { label: v.label, score: v.score, icon: v.icon, fee: v.fee };
  return acc;
}, {});

const MOCK_VENUES = [
  {
    id: 'venue_001',
    name: '体育馆篮球场地A',
    type: 'stadium',
    building: '体育馆',
    room: '篮球场A区',
    capacity: 10,
    needApproval: false,
    normalPrice: 50,
    studentPrice: 30,
    unit: '小时',
    openTimeSlots: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '19:00-20:00', '20:00-21:00', '21:00-22:00'],
    description: '标准室内篮球场地，木质地板，配有篮球架和计分牌',
    facilities: ['篮球架', '计分牌', '木地板', '休息长椅', '饮水机'],
    manager: '李老师',
    managerPhone: '010-12345678',
    cover: 'https://picsum.photos/seed/venue_basketball/800/400',
    rules: '1. 请穿着运动鞋入场\n2. 严禁在场地内饮食\n3. 请勿携带尖锐物品\n4. 使用后请整理场地',
    images: [
      'https://picsum.photos/seed/venue_bball1/800/600',
      'https://picsum.photos/seed/venue_bball2/800/600'
    ]
  },
  {
    id: 'venue_002',
    name: '体育馆羽毛球馆1号场',
    type: 'badminton',
    building: '体育馆',
    room: '羽毛球馆1号',
    capacity: 4,
    needApproval: false,
    normalPrice: 40,
    studentPrice: 25,
    unit: '小时',
    openTimeSlots: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '19:00-20:00', '20:00-21:00', '21:00-22:00'],
    description: '专业羽毛球场地，PVC塑胶地板，配有标准羽毛球网',
    facilities: ['羽毛球网', 'PVC地板', '休息椅', '置物架', '空调'],
    manager: '张老师',
    managerPhone: '010-12345679',
    cover: 'https://picsum.photos/seed/venue_badminton/800/400',
    rules: '1. 请穿着羽毛球鞋入场\n2. 严禁在场地内饮食\n3. 请勿携带黑色鞋底鞋子入场\n4. 保持场地整洁',
    images: [
      'https://picsum.photos/seed/venue_badm1/800/600',
      'https://picsum.photos/seed/venue_badm2/800/600'
    ]
  },
  {
    id: 'venue_003',
    name: '学术报告厅',
    type: 'meeting_room',
    building: '行政楼',
    room: '三楼学术报告厅',
    capacity: 200,
    needApproval: true,
    normalPrice: 200,
    studentPrice: 100,
    unit: '小时',
    openTimeSlots: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'],
    description: '大型学术报告厅，配备专业音响设备和投影设备，适合举办讲座、会议等活动',
    facilities: ['投影仪', '音响系统', '麦克风', '空调', '座椅', '讲台'],
    manager: '王老师',
    managerPhone: '010-12345680',
    cover: 'https://picsum.photos/seed/venue_meeting/800/400',
    rules: '1. 需提前3天申请预约\n2. 需有指导老师签字同意\n3. 使用后请恢复场地原状\n4. 严禁擅自挪动设备',
    images: [
      'https://picsum.photos/seed/venue_meet1/800/600',
      'https://picsum.photos/seed/venue_meet2/800/600'
    ]
  },
  {
    id: 'venue_004',
    name: '小型会议室A',
    type: 'meeting_room',
    building: '行政楼',
    room: '二楼小会议室A',
    capacity: 15,
    needApproval: true,
    normalPrice: 50,
    studentPrice: 30,
    unit: '小时',
    openTimeSlots: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00'],
    description: '小型会议室，适合小组讨论、社团会议等',
    facilities: ['会议桌', '座椅', '白板', '投影仪', '空调', '饮水机'],
    manager: '刘老师',
    managerPhone: '010-12345681',
    cover: 'https://picsum.photos/seed/venue_meeting_s/800/400',
    rules: '1. 需提前1天申请预约\n2. 使用后请整理桌椅\n3. 关闭电器设备\n4. 保持环境卫生',
    images: [
      'https://picsum.photos/seed/venue_ms1/800/600',
      'https://picsum.photos/seed/venue_ms2/800/600'
    ]
  },
  {
    id: 'venue_005',
    name: '图书馆自习包间101',
    type: 'study_room',
    building: '图书馆',
    room: '三楼自习包间101',
    capacity: 6,
    needApproval: false,
    normalPrice: 15,
    studentPrice: 10,
    unit: '小时',
    openTimeSlots: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '19:00-20:00', '20:00-21:00', '21:00-22:00'],
    description: '独立自习包间，安静舒适，适合小组学习讨论',
    facilities: ['大书桌', '座椅', '台灯', '插座', '空调', '白板'],
    manager: '陈老师',
    managerPhone: '010-12345682',
    cover: 'https://picsum.photos/seed/venue_study/800/400',
    rules: '1. 保持安静，避免影响他人\n2. 请勿大声讨论\n3. 离开时请关灯\n4. 严禁占座',
    images: [
      'https://picsum.photos/seed/venue_study1/800/600',
      'https://picsum.photos/seed/venue_study2/800/600'
    ]
  },
  {
    id: 'venue_006',
    name: '图书馆自习包间102',
    type: 'study_room',
    building: '图书馆',
    room: '三楼自习包间102',
    capacity: 4,
    needApproval: false,
    normalPrice: 12,
    studentPrice: 8,
    unit: '小时',
    openTimeSlots: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '19:00-20:00', '20:00-21:00', '21:00-22:00'],
    description: '小型自习包间，适合2-4人学习讨论',
    facilities: ['书桌', '座椅', '台灯', '插座', '空调'],
    manager: '陈老师',
    managerPhone: '010-12345682',
    cover: 'https://picsum.photos/seed/venue_study_s/800/400',
    rules: '1. 保持安静，避免影响他人\n2. 请勿大声讨论\n3. 离开时请关灯\n4. 严禁占座',
    images: [
      'https://picsum.photos/seed/venue_ss1/800/600'
    ]
  },
  {
    id: 'venue_007',
    name: '体育馆羽毛球馆2号场',
    type: 'badminton',
    building: '体育馆',
    room: '羽毛球馆2号',
    capacity: 4,
    needApproval: false,
    normalPrice: 40,
    studentPrice: 25,
    unit: '小时',
    openTimeSlots: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '19:00-20:00', '20:00-21:00', '21:00-22:00'],
    description: '专业羽毛球场地，PVC塑胶地板，配有标准羽毛球网',
    facilities: ['羽毛球网', 'PVC地板', '休息椅', '置物架', '空调'],
    manager: '张老师',
    managerPhone: '010-12345679',
    cover: 'https://picsum.photos/seed/venue_badminton2/800/400',
    rules: '1. 请穿着羽毛球鞋入场\n2. 严禁在场地内饮食\n3. 请勿携带黑色鞋底鞋子入场\n4. 保持场地整洁',
    images: [
      'https://picsum.photos/seed/venue_badm3/800/600'
    ]
  },
  {
    id: 'venue_008',
    name: '体育馆篮球场地B',
    type: 'stadium',
    building: '体育馆',
    room: '篮球场B区',
    capacity: 10,
    needApproval: false,
    normalPrice: 50,
    studentPrice: 30,
    unit: '小时',
    openTimeSlots: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '19:00-20:00', '20:00-21:00', '21:00-22:00'],
    description: '标准室内篮球场地，木质地板，配有篮球架和计分牌',
    facilities: ['篮球架', '计分牌', '木地板', '休息长椅', '饮水机'],
    manager: '李老师',
    managerPhone: '010-12345678',
    cover: 'https://picsum.photos/seed/venue_basketball2/800/400',
    rules: '1. 请穿着运动鞋入场\n2. 严禁在场地内饮食\n3. 请勿携带尖锐物品\n4. 使用后请整理场地',
    images: [
      'https://picsum.photos/seed/venue_bball3/800/600'
    ]
  }
];

const WORK_STUDY_JOB_STATUS = [
  { value: 'recruiting', label: '招聘中', color: '#10B981', icon: '💼' },
  { value: 'closed', label: '已结束', color: '#6B7280', icon: '📦' }
];

const WORK_STUDY_JOB_STATUS_MAP = WORK_STUDY_JOB_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color, icon: s.icon };
  return acc;
}, {});

const WORK_STUDY_APPLICATION_STATUS = [
  { value: 'pending', label: '待审核', color: '#F59E0B', icon: '⏳' },
  { value: 'approved', label: '已录用', color: '#10B981', icon: '✅' },
  { value: 'rejected', label: '已拒绝', color: '#EF4444', icon: '❌' }
];

const WORK_STUDY_APPLICATION_STATUS_MAP = WORK_STUDY_APPLICATION_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color, icon: s.icon };
  return acc;
}, {});

const WORK_STUDY_DEPARTMENTS = [
  { value: 'library', label: '图书馆', icon: '📚' },
  { value: 'administration', label: '行政办公室', icon: '🏢' },
  { value: 'canteen', label: '食堂后勤', icon: '🍜' },
  { value: 'lab', label: '实验中心', icon: '🔬' },
  { value: 'student_affairs', label: '学生处', icon: '👨‍🏫' },
  { value: 'it_center', label: '信息中心', icon: '💻' },
  { value: 'sports', label: '体育部', icon: '⚽' },
  { value: 'dormitory', label: '宿管中心', icon: '🏠' },
  { value: 'other', label: '其他部门', icon: '📌' }
];

const WORK_STUDY_JOB_TABS = [
  { value: 'all', label: '全部' },
  { value: 'recruiting', label: '招聘中' },
  { value: 'closed', label: '已结束' }
];

const WORK_STUDY_MY_APPLICATION_TABS = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待审核' },
  { value: 'approved', label: '已录用' },
  { value: 'rejected', label: '已拒绝' }
];

const WORK_STUDY_HOURS_STATUS = [
  { value: 'pending', label: '待确认', color: '#F59E0B' },
  { value: 'confirmed', label: '已确认', color: '#10B981' },
  { value: 'rejected', label: '已驳回', color: '#EF4444' }
];

const WORK_STUDY_HOURS_STATUS_MAP = WORK_STUDY_HOURS_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color };
  return acc;
}, {});

const WORK_STUDY_SALARY_STATUS = [
  { value: 'pending', label: '待结算', color: '#F59E0B' },
  { value: 'settled', label: '已结算', color: '#10B981' },
  { value: 'paid', label: '已发放', color: '#3B82F6' }
];

const WORK_STUDY_SALARY_STATUS_MAP = WORK_STUDY_SALARY_STATUS.reduce((acc, s) => {
  acc[s.value] = { label: s.label, color: s.color };
  return acc;
}, {});

const MOCK_LABS = [
  {
    id: 'lab_001',
    name: '化学实验中心A室',
    type: 'chemistry',
    building: '实验楼A栋',
    room: 'A301',
    capacity: 30,
    safetyLevel: 'level2',
    openTimeSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'],
    description: '配备基础化学实验设备，可进行常规化学实验',
    facilities: ['通风橱', '实验台', '天平', '显微镜', '离心机'],
    manager: '王老师',
    managerPhone: '010-12345678',
    cover: '/assets/images/default-scenery.png',
    rules: '1. 必须穿实验服、戴护目镜\n2. 严禁饮食、吸烟\n3. 实验后清理台面\n4. 废弃物按分类处理'
  },
  {
    id: 'lab_002',
    name: '物理光学实验室',
    type: 'physics',
    building: '实验楼B栋',
    room: 'B205',
    capacity: 20,
    safetyLevel: 'level1',
    openTimeSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '19:00-21:00'],
    description: '光学实验平台，配备激光、光谱仪等设备',
    facilities: ['激光器', '光谱仪', '光学平台', '示波器', '信号发生器'],
    manager: '李老师',
    managerPhone: '010-87654321',
    cover: '/assets/images/default-scenery.png',
    rules: '1. 禁止直视激光光束\n2. 保持光学镜片清洁\n3. 设备使用后归位\n4. 关闭电源后离开'
  },
  {
    id: 'lab_003',
    name: '分子生物学实验室',
    type: 'biology',
    building: '生命科学楼',
    room: 'C402',
    capacity: 15,
    safetyLevel: 'level3',
    openTimeSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'],
    description: '微生物和分子生物学实验，需通过生物安全培训',
    facilities: ['PCR仪', '超净工作台', '培养箱', '凝胶电泳系统', '移液器'],
    manager: '张老师',
    managerPhone: '010-11112222',
    cover: '/assets/images/default-scenery.png',
    rules: '1. 必须通过生物安全培训\n2. 严格无菌操作\n3. 实验废物高压灭菌\n4. 实验后消毒洗手'
  },
  {
    id: 'lab_004',
    name: '计算机网络实验室',
    type: 'computer',
    building: '信息楼',
    room: 'E501',
    capacity: 40,
    safetyLevel: 'level1',
    openTimeSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '19:00-21:00'],
    description: '网络技术实验平台，可进行网络搭建和安全实验',
    facilities: ['交换机', '路由器', '服务器', '网络测试仪', '工作站'],
    manager: '赵老师',
    managerPhone: '010-33334444',
    cover: '/assets/images/default-scenery.png',
    rules: '1. 禁止访问非法网站\n2. 不得擅自拆卸设备\n3. 注意数据备份\n4. 下机关闭电源'
  },
  {
    id: 'lab_005',
    name: '电子电路实验室',
    type: 'electronic',
    building: '实验楼D栋',
    room: 'D308',
    capacity: 25,
    safetyLevel: 'level2',
    openTimeSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'],
    description: '模拟/数字电路实验，配备各类电子测试仪器',
    facilities: ['示波器', '信号发生器', '直流电源', '万用表', '面包板'],
    manager: '陈老师',
    managerPhone: '010-55556666',
    cover: '/assets/images/default-scenery.png',
    rules: '1. 注意用电安全\n2. 先接线后通电\n3. 先断电后拆线\n4. 仪器使用后归位'
  },
  {
    id: 'lab_006',
    name: '机械加工实验室',
    type: 'mechanical',
    building: '工程训练中心',
    room: 'F102',
    capacity: 20,
    safetyLevel: 'level3',
    openTimeSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'],
    description: '金工实习和机械加工实验，配备各类机床设备',
    facilities: ['车床', '铣床', '钻床', '磨床', '钳工台'],
    manager: '刘老师',
    managerPhone: '010-77778888',
    cover: '/assets/images/default-scenery.png',
    rules: '1. 必须穿戴防护用品\n2. 严禁戴手套操作机床\n3. 女生必须戴安全帽\n4. 严格遵守操作规程'
  }
];

const SAFETY_ARTICLES = [
  {
    id: 'safety_001',
    title: '校园防诈骗指南',
    category: 'anti_fraud',
    summary: '了解常见诈骗手段，保护个人财产安全',
    content: '一、常见诈骗类型\n1. 网络贷款诈骗：以低息、无抵押为诱饵，骗取保证金、验证金\n2. 刷单返利诈骗：以小额返利为诱饵，逐步诱导大额投入\n3. 冒充公检法：以涉嫌犯罪为由，要求转账到"安全账户"\n4. 校园贷诈骗：针对学生的高利贷，暴力催收\n\n二、防范措施\n1. 不轻易透露个人信息，特别是银行卡、验证码\n2. 不点击陌生链接，不下载非官方APP\n3. 遇到可疑情况，第一时间向学校保卫处或家长报告\n4. 树立正确消费观，不盲目攀比借贷',
    cover: '/assets/images/default-news.png',
    views: 1256,
    createTime: Date.now() - 7 * 86400000
  },
  {
    id: 'safety_002',
    title: '宿舍消防安全须知',
    category: 'fire',
    summary: '遵守宿舍用电规定，杜绝火灾隐患',
    content: '一、禁止行为\n1. 严禁使用大功率电器（电炉、电热棒、电磁炉等）\n2. 严禁私拉乱接电线\n3. 严禁在宿舍内吸烟、点蜡烛\n4. 严禁占用、堵塞消防通道\n\n二、注意事项\n1. 人走关灯、拔插头，不超负荷用电\n2. 手机、充电宝等不要长时间充电\n3. 熟悉宿舍楼层消防通道和灭火器位置\n4. 发现火情及时拨打119和保卫处电话',
    cover: '/assets/images/default-news.png',
    views: 892,
    createTime: Date.now() - 14 * 86400000
  },
  {
    id: 'safety_003',
    title: '夜间出行安全提示',
    category: 'campus',
    summary: '提高安全意识，避免夜间单独出行',
    content: '一、出行建议\n1. 尽量避免夜间单独外出，尤其是偏僻路段\n2. 夜间出行选择照明好、行人多的路线\n3. 不搭乘陌生车辆，不接受陌生人的接送\n4. 随身携带手机，保持电量充足\n\n二、应急处理\n1. 感觉有人尾随时，立即向人多的地方移动\n2. 遇到危险大声呼救，及时报警\n3. 可随身携带防狼喷雾等防身用品\n4. 保存学校保卫处紧急电话',
    cover: '/assets/images/default-news.png',
    views: 2034,
    createTime: Date.now() - 3 * 86400000
  },
  {
    id: 'safety_004',
    title: '大学生心理健康维护',
    category: 'mental',
    summary: '关注心理健康，学会自我调节',
    content: '一、常见心理问题\n1. 适应问题：新环境、新人际关系的适应\n2. 学业压力：考试焦虑、专业困惑\n3. 情绪问题：抑郁、焦虑情绪\n4. 人际关系：宿舍矛盾、恋爱问题\n\n二、自我调节方法\n1. 规律作息，适度运动\n2. 学会倾诉，与朋友家人沟通\n3. 培养兴趣爱好，丰富课余生活\n4. 正确认识自己，接纳不完美\n\n三、寻求帮助\n学校心理咨询中心提供免费咨询服务，预约电话：010-33334444',
    cover: '/assets/images/default-news.png',
    views: 1567,
    createTime: Date.now() - 10 * 86400000
  },
  {
    id: 'safety_005',
    title: '交通事故应急处理',
    category: 'traffic',
    summary: '遇到交通事故如何正确应对',
    content: '一、事故处理步骤\n1. 立即停车，保护现场\n2. 检查伤亡情况，拨打120急救\n3. 拨打122报警，通知保险公司\n4. 记录事故信息（车牌、联系方式）\n\n二、注意事项\n1. 不要轻易私了，尤其是有人受伤时\n2. 不移动现场物品，除非为了救人\n3. 配合交警调查，如实陈述\n4. 收集证据，拍照留存\n\n三、行人安全\n1. 走人行横道，遵守交通信号\n2. 不低头看手机过马路\n3. 夜间穿亮色衣物\n4. 不翻越护栏',
    cover: '/assets/images/default-news.png',
    views: 756,
    createTime: Date.now() - 20 * 86400000
  },
  {
    id: 'safety_006',
    title: '突发公共事件应对',
    category: 'emergency',
    summary: '遇到突发情况如何自救互救',
    content: '一、地震应对\n1. 室内：躲在坚固家具下，护住头部\n2. 室外：远离建筑物、电线杆\n3. 不乘坐电梯，不走楼道\n\n二、暴雨洪涝\n1. 关闭门窗，防止雨水进屋\n2. 不涉水行走，远离积水区域\n3. 断电关气，防止触电\n\n三、踩踏事件\n1. 保持冷静，不拥挤\n2. 抓住稳固物体，防止摔倒\n3. 被挤倒时设法靠墙，身体蜷缩成球状\n\n四、紧急电话\n- 报警：110\n- 火警：119\n- 急救：120\n- 保卫处：010-12345678',
    cover: '/assets/images/default-news.png',
    views: 3241,
    createTime: Date.now() - 1 * 86400000
  }
];

module.exports = {
  PUBLISH_STATUS,
  PUBLISH_STATUS_MAP,
  ADMIN_MODULES,
  LOST_FOUND_TYPES,
  LOST_FOUND_STATUS,
  LOST_FOUND_STATUS_MAP,
  ITEM_TYPES,
  LOCATIONS,
  MARKET_CATEGORIES,
  PRICE_RANGES,
  MARKET_LOCATIONS,
  MARKET_DISTANCE_RANGES,
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
  EXPRESS_LOCKER_STATUS,
  EXPRESS_LOCKER_STATUS_MAP,
  EXPRESS_LOCKER_TABS,
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
  COURSE_ASSISTANT_TABS,
  COURSE_TYPES,
  COURSE_TYPE_MAP,
  COURSE_STATUS,
  COURSE_STATUS_MAP,
  CONFLICT_TYPES,
  DEFAULT_MAX_CREDITS,
  DEFAULT_MIN_CREDITS,
  SCORE_LEVELS,
  CLASSROOM_BUILDINGS,
  REMINDER_MINUTES_OPTIONS,
  IMPORT_METHODS,
  SCENERY_CATEGORIES,
  SCENERY_CATEGORY_MAP,
  SCENERY_SEASONS,
  SCENERY_SOLAR_TERMS,
  SCENERY_REVIEW_STATUS,
  SCENERY_LOCATIONS,
  NEWS_CATEGORIES,
  NEWS_CATEGORY_MAP,
  NEWS_SORT_OPTIONS,
  getScoreLevel,
  getGPA,
  getSlotTime,
  getLabelByValue,
  TICKET_REFUND_RULES,
  TICKET_ORDER_STATUS,
  TICKET_ORDER_STATUS_MAP,
  TICKET_ORDER_TABS,
  TICKET_PAY_METHODS,
  CLUB_ACTIVITY_TABS_EXTENDED,
  INNOVATION_PROJECT_FIELDS,
  INNOVATION_PROJECT_STAGES,
  INNOVATION_FINANCING_STAGES,
  INNOVATION_TEAM_ROLES,
  INNOVATION_MENTOR_TITLES,
  INNOVATION_ROADSHOW_STATUS,
  INNOVATION_POLICY_TYPES,
  INNOVATION_INCUBATOR_TYPES,
  INNOVATION_PROJECT_TABS,
  INNOVATION_MAIN_TABS,
  INNOVATION_APPOINTMENT_TIME_SLOTS,
  INNOVATION_PROJECT_STATUS,
  INNOVATION_PROJECT_STATUS_MAP,
  ANIMAL_TYPES,
  ANIMAL_TYPE_MAP,
  ANIMAL_GENDERS,
  ANIMAL_HEALTH_STATUS,
  ANIMAL_HEALTH_MAP,
  ANIMAL_PERSONALITY_TAGS,
  ANIMAL_AGE_RANGES,
  ADOPTION_STATUS,
  ADOPTION_STATUS_MAP,
  ADOPTION_APPLICATION_STATUS,
  ADOPTION_APPLICATION_STATUS_MAP,
  VISIT_RECORD_TYPES,
  DONATION_TYPES,
  VOLUNTEER_ROLES,
  SHELTER_MAIN_TABS,
  SHELTER_FILTER_TABS,
  LOW_CARBON_CHECKIN_TYPES,
  LOW_CARBON_CHECKIN_MAP,
  LOW_CARBON_ACHIEVEMENTS,
  LOW_CARBON_REWARD_STATUS,
  LOW_CARBON_REWARD_CATEGORIES,
  LOW_CARBON_ACTIVITY_TYPES,
  LOW_CARBON_ACTIVITY_TYPE_MAP,
  LOW_CARBON_ACTIVITY_STATUS,
  LOW_CARBON_ACTIVITY_STATUS_MAP,
  LOW_CARBON_LEADERBOARD_TABS,
  LOW_CARBON_TIPS,
  INTL_GUIDE_CATEGORIES,
  INTL_BUDDY_MAJORS,
  INTL_BUDDY_GRADES,
  INTL_BUDDY_HOBBIES,
  INTL_BUDDY_LANGUAGES,
  INTL_EVENT_CATEGORIES,
  INTL_EVENT_STATUS,
  INTL_EMERGENCY_CONTACTS,
  ALUMNI_MAIN_TABS,
  ALUMNI_VERIFY_STATUS,
  ALUMNI_VERIFY_STATUS_MAP,
  ALUMNI_COLLEGES,
  ALUMNI_GRADUATION_YEARS,
  ALUMNI_INDUSTRIES,
  ALUMNI_INDUSTRY_MAP,
  ALUMNI_MENTOR_TITLES,
  ALUMNI_POST_TYPES,
  ALUMNI_POST_TYPE_MAP,
  ALUMNI_VISIT_TYPES,
  ALUMNI_VISIT_STATUS,
  ALUMNI_VISIT_STATUS_MAP,
  ALUMNI_APPOINTMENT_STATUS,
  ALUMNI_APPOINTMENT_STATUS_MAP,
  ALUMNI_APPOINTMENT_TIME_SLOTS,
  ALUMNI_CARD_BENEFIT_CATEGORIES,
  TAKEOUT_CATEGORIES,
  TAKEOUT_SORT_OPTIONS,
  TAKEOUT_DELIVERY_TYPES,
  TAKEOUT_PROMOTION_TYPES,
  GRADUATION_STATUS,
  GRADUATION_STATUS_MAP,
  GRADUATION_ITEMS,
  SOS_TRIGGER_DURATION,
  SOS_STATUS,
  SOS_STATUS_MAP,
  SAFETY_CATEGORIES,
  CAMPUS_SECURITY_CONTACTS,
  SAFETY_ARTICLES,
  LAB_TYPES,
  LAB_SAFETY_LEVELS,
  LAB_SAFETY_LEVEL_MAP,
  LAB_APPOINTMENT_STATUS,
  LAB_APPOINTMENT_STATUS_MAP,
  LAB_TIME_SLOTS,
  LAB_MY_APPOINTMENT_TABS,
  LAB_ADMIN_TABS,
  LAB_VIOLATION_TYPES,
  MOCK_LABS,

  VENUE_TYPES,
  VENUE_APPOINTMENT_STATUS,
  VENUE_APPOINTMENT_STATUS_MAP,
  VENUE_TIME_SLOTS,
  VENUE_MY_APPOINTMENT_TABS,
  VENUE_ADMIN_TABS,
  VENUE_VIOLATION_TYPES,
  VENUE_VIOLATION_TYPES_MAP,
  MOCK_VENUES,

  WORK_STUDY_JOB_STATUS,
  WORK_STUDY_JOB_STATUS_MAP,
  WORK_STUDY_APPLICATION_STATUS,
  WORK_STUDY_APPLICATION_STATUS_MAP,
  WORK_STUDY_DEPARTMENTS,
  WORK_STUDY_JOB_TABS,
  WORK_STUDY_MY_APPLICATION_TABS,
  WORK_STUDY_HOURS_STATUS,
  WORK_STUDY_HOURS_STATUS_MAP,
  WORK_STUDY_SALARY_STATUS,
  WORK_STUDY_SALARY_STATUS_MAP,

  VOTING_STATUS,
  VOTING_STATUS_MAP,
  VOTING_TYPES,
  VOTING_VISIBILITY,
  VOTING_ELIGIBILITY_TYPES,
  COLLEGES,
  GRADES
};
