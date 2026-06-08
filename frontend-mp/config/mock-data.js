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

const MOCK_LOST_FOUND = [
  {
    type: 'lost',
    title: '黑色钱包丢失',
    description: '昨天在图书馆三楼自习室丢失黑色钱包一个，内有身份证、校园卡和部分现金。望好心人拾到后联系，万分感谢！',
    itemType: 'card',
    location: 'library',
    contact: '13800138001',
    images: ['https://picsum.photos/seed/wallet/600/600'],
    reward: '500元酬金'
  },
  {
    type: 'found',
    title: '捡到一串钥匙',
    description: '在食堂门口捡到一串钥匙，上面有一个小熊挂件。失主请联系我认领。',
    itemType: 'other',
    location: 'canteen',
    contact: '13800138002',
    images: ['https://picsum.photos/seed/keys/600/600']
  },
  {
    type: 'lost',
    title: '寻找银色笔记本电脑',
    description: '在教学楼A栋302教室丢失银色MacBook Pro一台，电脑上有蓝色贴纸。资料非常重要，恳请归还！',
    itemType: 'electronics',
    location: 'classroom',
    contact: '13800138003',
    images: ['https://picsum.photos/seed/laptop/600/600'],
    reward: '1000元酬金'
  }
];

const MOCK_MARKET_ITEMS = [
  {
    title: 'iPhone 13 Pro 256G',
    description: '自用iPhone 13 Pro，256G远峰蓝色，九成新，无磕碰，电池健康度92%。配件齐全，包装盒都在。',
    category: 'electronics',
    price: 4500,
    images: ['https://picsum.photos/seed/iphone/600/600'],
    contact: '13800138004'
  },
  {
    title: '高等数学教材 第七版',
    description: '同济大学高等数学教材上下册，九成新，有少量笔记。考研复习必备。',
    category: 'book',
    price: 35,
    images: ['https://picsum.photos/seed/mathbook/600/600'],
    contact: '13800138005'
  },
  {
    title: '小米空气净化器2S',
    description: '毕业出小米空气净化器2S，使用两年，功能正常，滤芯刚换过。适合宿舍使用。',
    category: 'daily',
    price: 300,
    images: ['https://picsum.photos/seed/purifier/600/600'],
    contact: '13800138006'
  }
];

const MOCK_SURVEYS = [
  {
    title: '校园生活服务满意度调研',
    description: '为了提升校园生活服务质量，诚邀您参与本次调研。您的意见对我们非常重要！',
    questions: [
      {
        id: 'q1',
        type: 'single',
        title: '您对校园整体服务满意度如何？',
        options: ['非常满意', '满意', '一般', '不满意', '非常不满意']
      },
      {
        id: 'q2',
        type: 'multiple',
        title: '您最常使用哪些校园服务？（可多选）',
        options: ['失物招领', '二手市场', '校园广播', '问卷调研', '其他']
      },
      {
        id: 'q3',
        type: 'fill',
        title: '您对校园服务有什么建议或意见？'
      }
    ]
  },
  {
    title: '校园餐饮服务质量调研',
    description: '了解同学们对学校食堂的满意度，以便改进餐饮服务质量。',
    questions: [
      {
        id: 'q1',
        type: 'single',
        title: '您对食堂饭菜口味如何评价？',
        options: ['非常好', '好', '一般', '差', '非常差']
      },
      {
        id: 'q2',
        type: 'single',
        title: '您认为食堂饭菜价格如何？',
        options: ['很便宜', '比较便宜', '适中', '偏贵', '很贵']
      },
      {
        id: 'q3',
        type: 'fill',
        title: '您希望食堂增加哪些菜品？'
      }
    ]
  }
];

const WEEKDAY_MAP = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function getDateString(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}/${day}`;
}

function getWeekday(daysFromNow) {
  if (daysFromNow === 0) return '今天';
  if (daysFromNow === 1) return '明天';
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return WEEKDAY_MAP[date.getDay()];
}

const WEATHER_DATA = {
  current: {
    temperature: 28,
    temperatureMin: 22,
    temperatureMax: 30,
    weather: '多云',
    weatherIcon: '⛅',
    humidity: 75,
    windDirection: '东南风',
    windScale: '3级',
    dressAdvice: '天气较热，建议穿着轻薄透气的夏季服装，如T恤、短裤或薄长裙。出门请带好雨具，午后可能有雷阵雨。',
    updateTime: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  },
  airQuality: {
    aqi: 78,
    aqiLevel: '良',
    aqiColor: '#00B42A',
    pm25: 45,
    pm10: 68,
    so2: 12,
    no2: 38,
    co: 0.8,
    o3: 95
  },
  uvIndex: {
    index: 6,
    level: '高',
    advice: '紫外线强度较高，外出需做好防晒措施。建议涂抹SPF30+防晒霜，佩戴遮阳帽和太阳镜，尽量避开10:00-16:00时段的强紫外线照射。'
  },
  forecast: [
    {
      date: getDateString(0),
      weekday: getWeekday(0),
      weatherDay: '多云',
      weatherNight: '阴',
      weatherIconDay: '⛅',
      weatherIconNight: '☁️',
      temperatureMin: 22,
      temperatureMax: 30,
      windDirection: '东南风',
      windScale: '3级'
    },
    {
      date: getDateString(1),
      weekday: getWeekday(1),
      weatherDay: '晴',
      weatherNight: '多云',
      weatherIconDay: '☀️',
      weatherIconNight: '⛅',
      temperatureMin: 23,
      temperatureMax: 32,
      windDirection: '南风',
      windScale: '2级'
    },
    {
      date: getDateString(2),
      weekday: getWeekday(2),
      weatherDay: '雷阵雨',
      weatherNight: '小雨',
      weatherIconDay: '⛈️',
      weatherIconNight: '🌧️',
      temperatureMin: 21,
      temperatureMax: 28,
      windDirection: '西南风',
      windScale: '4级'
    },
    {
      date: getDateString(3),
      weekday: getWeekday(3),
      weatherDay: '中雨',
      weatherNight: '大雨',
      weatherIconDay: '🌧️',
      weatherIconNight: '🌧️',
      temperatureMin: 19,
      temperatureMax: 24,
      windDirection: '西风',
      windScale: '5级'
    },
    {
      date: getDateString(4),
      weekday: getWeekday(4),
      weatherDay: '阴',
      weatherNight: '多云',
      weatherIconDay: '☁️',
      weatherIconNight: '⛅',
      temperatureMin: 20,
      temperatureMax: 26,
      windDirection: '西北风',
      windScale: '3级'
    },
    {
      date: getDateString(5),
      weekday: getWeekday(5),
      weatherDay: '晴',
      weatherNight: '晴',
      weatherIconDay: '☀️',
      weatherIconNight: '☀️',
      temperatureMin: 22,
      temperatureMax: 31,
      windDirection: '东北风',
      windScale: '2级'
    },
    {
      date: getDateString(6),
      weekday: getWeekday(6),
      weatherDay: '多云',
      weatherNight: '晴',
      weatherIconDay: '⛅',
      weatherIconNight: '☀️',
      temperatureMin: 24,
      temperatureMax: 33,
      windDirection: '东风',
      windScale: '2级'
    }
  ],
  campusAlerts: [
    {
      id: 'alert-001',
      type: 'rainstorm',
      title: '暴雨红色预警信号',
      content: '预计未来3小时内我市将出现100毫米以上强降雨，请全体师生注意安全，减少外出。根据《学校极端天气应急预案》，今日下午停课，请同学们留在宿舍，注意关好门窗。',
      level: 'danger',
      announcementId: '1',
      publishTime: '2026-06-08 08:30',
      validUntil: '2026-06-08 20:00'
    },
    {
      id: 'alert-002',
      type: 'heat',
      title: '高温橙色预警信号',
      content: '预计本周三至周五最高气温将达到35℃以上，请广大师生做好防暑降温措施。户外活动请避开正午时段，及时补充水分，谨防中暑。食堂将延长供应清凉饮品。',
      level: 'warning',
      announcementId: '2',
      publishTime: '2026-06-08 07:00',
      validUntil: '2026-06-12 18:00'
    }
  ]
};

const EMERGENCY_PHONES = [
  {
    id: 'e1',
    name: '校园报警',
    phone: '110',
    icon: '🚔',
    description: '24小时校园报警电话',
    isEmergency: true
  },
  {
    id: 'e2',
    name: '火警',
    phone: '119',
    icon: '🚒',
    description: '火警报警电话',
    isEmergency: true
  },
  {
    id: 'e3',
    name: '校医院急诊',
    phone: '010-12345678',
    icon: '🏥',
    description: '24小时急诊服务',
    isEmergency: true
  }
];

const PHONEBOOK_CATEGORIES = [
  {
    id: 'c1',
    name: '院系办公室',
    icon: '🏛️',
    color: '#E3F2FD',
    iconColor: '#1976D2',
    items: [
      {
        id: 'd1',
        name: '校长办公室',
        phone: '010-12345001',
        address: '行政楼301室',
        workTime: '周一至周五 8:00-17:00'
      },
      {
        id: 'd2',
        name: '教务处',
        phone: '010-12345002',
        address: '行政楼201室',
        workTime: '周一至周五 8:00-17:00'
      },
      {
        id: 'd3',
        name: '学生处',
        phone: '010-12345003',
        address: '行政楼205室',
        workTime: '周一至周五 8:00-17:00'
      },
      {
        id: 'd4',
        name: '研究生院',
        phone: '010-12345004',
        address: '行政楼401室',
        workTime: '周一至周五 8:00-17:00'
      },
      {
        id: 'd5',
        name: '计算机学院',
        phone: '010-12345101',
        address: '信息楼101室',
        workTime: '周一至周五 8:00-17:00'
      },
      {
        id: 'd6',
        name: '电子工程学院',
        phone: '010-12345102',
        address: '信息楼201室',
        workTime: '周一至周五 8:00-17:00'
      },
      {
        id: 'd7',
        name: '经济管理学院',
        phone: '010-12345201',
        address: '经管楼301室',
        workTime: '周一至周五 8:00-17:00'
      },
      {
        id: 'd8',
        name: '外国语学院',
        phone: '010-12345301',
        address: '外语楼101室',
        workTime: '周一至周五 8:00-17:00'
      }
    ]
  },
  {
    id: 'c2',
    name: '后勤服务',
    icon: '🔧',
    color: '#FFF3E0',
    iconColor: '#F57C00',
    items: [
      {
        id: 'l1',
        name: '后勤服务中心',
        phone: '010-12345401',
        address: '后勤楼101室',
        workTime: '周一至周五 8:00-17:00'
      },
      {
        id: 'l2',
        name: '宿舍管理中心',
        phone: '010-12345402',
        address: '1号宿舍楼101室',
        workTime: '24小时值班'
      },
      {
        id: 'l3',
        name: '水电维修',
        phone: '010-12345403',
        address: '后勤楼201室',
        workTime: '24小时值班'
      },
      {
        id: 'l4',
        name: '食堂服务热线',
        phone: '010-12345404',
        address: '第一食堂办公室',
        workTime: '6:30-20:00'
      },
      {
        id: 'l5',
        name: '物业报修',
        phone: '010-12345405',
        address: '后勤楼105室',
        workTime: '8:00-20:00'
      },
      {
        id: 'l6',
        name: '校园绿化',
        phone: '010-12345406',
        address: '后勤楼301室',
        workTime: '周一至周五 8:00-17:00'
      }
    ]
  },
  {
    id: 'c3',
    name: '医疗服务',
    icon: '💊',
    color: '#E8F5E9',
    iconColor: '#388E3C',
    items: [
      {
        id: 'm1',
        name: '校医院',
        phone: '010-12345678',
        address: '校园东南角校医院',
        workTime: '门诊: 8:00-17:00, 急诊: 24小时'
      },
      {
        id: 'm2',
        name: '校医院药房',
        phone: '010-12345679',
        address: '校医院1楼',
        workTime: '8:00-18:00'
      },
      {
        id: 'm3',
        name: '心理咨询中心',
        phone: '010-12345680',
        address: '大学生活动中心3楼',
        workTime: '周一至周五 8:00-17:00'
      },
      {
        id: 'm4',
        name: '医保办公室',
        phone: '010-12345681',
        address: '校医院2楼',
        workTime: '周一至周五 8:00-17:00'
      },
      {
        id: 'm5',
        name: '体检中心',
        phone: '010-12345682',
        address: '校医院3楼',
        workTime: '周一至周五 8:00-11:30'
      }
    ]
  },
  {
    id: 'c4',
    name: '保卫安全',
    icon: '🛡️',
    color: '#FFEBEE',
    iconColor: '#D32F2F',
    items: [
      {
        id: 's1',
        name: '保卫处',
        phone: '010-12345701',
        address: '北门保卫处大楼',
        workTime: '24小时值班'
      },
      {
        id: 's2',
        name: '校园巡逻',
        phone: '010-12345702',
        address: '保卫处1楼',
        workTime: '24小时'
      },
      {
        id: 's3',
        name: '户籍管理',
        phone: '010-12345703',
        address: '保卫处2楼',
        workTime: '周一至周五 8:00-17:00'
      },
      {
        id: 's4',
        name: '交通管理',
        phone: '010-12345704',
        address: '保卫处1楼',
        workTime: '周一至周五 8:00-17:00'
      },
      {
        id: 's5',
        name: '消防管理',
        phone: '010-12345705',
        address: '保卫处1楼',
        workTime: '24小时'
      }
    ]
  },
  {
    id: 'c5',
    name: '快递中心',
    icon: '📦',
    color: '#F3E5F5',
    iconColor: '#7B1FA2',
    items: [
      {
        id: 'ex1',
        name: '校园快递中心',
        phone: '010-12345801',
        address: '生活服务中心1楼',
        workTime: '8:00-20:00'
      },
      {
        id: 'ex2',
        name: '顺丰快递点',
        phone: '010-12345802',
        address: '生活服务中心101室',
        workTime: '9:00-19:00'
      },
      {
        id: 'ex3',
        name: '京东快递点',
        phone: '010-12345803',
        address: '生活服务中心102室',
        workTime: '9:00-19:00'
      },
      {
        id: 'ex4',
        name: '菜鸟驿站',
        phone: '010-12345804',
        address: '生活服务中心103室',
        workTime: '8:30-21:00'
      },
      {
        id: 'ex5',
        name: '邮政服务',
        phone: '010-12345805',
        address: '生活服务中心105室',
        workTime: '周一至周六 8:30-17:00'
      }
    ]
  }
];

const SERVICE_GUIDES = [
  {
    id: 'g1',
    title: '如何办理学生证',
    icon: '🎫',
    url: '/pages/guide-detail/index?type=student-card',
    description: '学生证办理、补办流程说明'
  },
  {
    id: 'g2',
    title: '校园卡使用指南',
    icon: '💳',
    url: '/pages/guide-detail/index?type=campus-card',
    description: '充值、挂失、补办全攻略'
  },
  {
    id: 'g3',
    title: '宿舍报修流程',
    icon: '🔨',
    url: '/pages/guide-detail/index?type=repair',
    description: '水电设施报修指引'
  },
  {
    id: 'g4',
    title: '图书馆借阅规则',
    icon: '📚',
    url: '/pages/guide-detail/index?type=library',
    description: '借书、续借、预约详解'
  },
  {
    id: 'g5',
    title: '成绩单办理',
    icon: '📄',
    url: '/pages/guide-detail/index?type=transcript',
    description: '中英文成绩单申请流程'
  },
  {
    id: 'g6',
    title: '就业创业服务',
    icon: '💼',
    url: '/pages/guide-detail/index?type=career',
    description: '招聘会、创业扶持政策'
  }
];

const NOTIFICATION_TEMPLATES = [
  {
    type: 'system',
    subType: 'announcement',
    title: '系统公告',
    content: '关于2026年春季学期开学注册的通知，请同学们按时返校注册。',
    extra: {
      announcementId: '1',
      preview: '注册时间：2月15日-16日'
    },
    timeOffset: 3600000
  },
  {
    type: 'system',
    subType: 'maintenance',
    title: '系统维护通知',
    content: '校园一卡通充值系统将于本周末进行升级维护，升级期间线上充值服务暂停。',
    extra: {
      preview: '维护时间：周六 00:00-06:00'
    },
    timeOffset: 7200000
  },
  {
    type: 'interaction',
    subType: 'comment',
    title: '新的评论',
    content: '用户「小明同学」评论了你的失物招领：「请问这个钱包我好像见过」',
    extra: {
      lostFoundIndex: 0,
      preview: '请问这个钱包我好像见过...'
    },
    timeOffset: 1800000
  },
  {
    type: 'interaction',
    subType: 'reply',
    title: '收到回复',
    content: '你发布的二手商品「iPhone 13 Pro」收到了新的回复：「请问能便宜点吗？」',
    extra: {
      marketIndex: 0,
      preview: '请问能便宜点吗？'
    },
    timeOffset: 5400000
  },
  {
    type: 'transaction',
    subType: 'favorite',
    title: '有人收藏了你的商品',
    content: '你的二手商品「高等数学教材」被3位用户收藏了，快去看看吧！',
    extra: {
      marketIndex: 1,
      preview: '高等数学教材'
    },
    timeOffset: 10800000
  },
  {
    type: 'transaction',
    subType: 'contact',
    title: '有人想联系你',
    content: '用户「学姐」对你发布的失物招领很感兴趣，想要联系你。',
    extra: {
      lostFoundIndex: 1,
      preview: '我可能捡到了你的钥匙'
    },
    timeOffset: 14400000
  },
  {
    type: 'activity',
    subType: 'reminder',
    title: '活动提醒',
    content: '你报名的「校园樱花节摄影大赛」明天就要开始了，记得准时参加！',
    extra: {
      url: '/pages/broadcast/index',
      preview: '活动时间：3月15日 14:00'
    },
    timeOffset: 86400000
  },
  {
    type: 'activity',
    subType: 'start',
    title: '活动开始',
    content: '「2026春季校园招聘会」今天正式开始，超过200家企业参会，快来看看吧！',
    extra: {
      url: '/pages/index/index',
      preview: '招聘会地点：体育馆'
    },
    timeOffset: 172800000
  },
  {
    type: 'survey',
    subType: 'invite',
    title: '问卷邀请',
    content: '诚邀您参与「校园生活服务满意度调研」，完成问卷可获得积分奖励。',
    extra: {
      surveyIndex: 0,
      preview: '预计耗时：3分钟'
    },
    timeOffset: 259200000
  },
  {
    type: 'survey',
    subType: 'reminder',
    title: '问卷填写提醒',
    content: '你还有未完成的问卷「校园餐饮服务质量调研」，请在3天内完成。',
    extra: {
      surveyIndex: 1,
      preview: '截止日期：3月20日'
    },
    timeOffset: 345600000
  }
];

module.exports = {
  ANNOUNCEMENTS,
  CAMPUS_NEWS,
  SCENERY_LIST,
  BROADCAST_LIST,
  MOCK_LOST_FOUND,
  MOCK_MARKET_ITEMS,
  MOCK_SURVEYS,
  NOTIFICATION_TEMPLATES,
  WEATHER_DATA,
  EMERGENCY_PHONES,
  PHONEBOOK_CATEGORIES,
  SERVICE_GUIDES
};
