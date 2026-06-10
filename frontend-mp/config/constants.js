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
  getLabelByValue
};
