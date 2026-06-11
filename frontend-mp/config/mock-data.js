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

const SERVICE_GUIDE_DETAILS = {
  'student-card': {
    type: 'student-card',
    title: '如何办理学生证',
    icon: '🎫',
    summary: '学生证是学生身份的重要证件，可享受火车票优惠、景点门票优惠等。本文详细介绍学生证的新办、补办流程。',
    sections: [
      {
        title: '📋 办理条件',
        content: '1. 全日制在读学生均可申请办理学生证。\n2. 新生入学后由学校统一办理。\n3. 学生证遗失或损坏可申请补办。'
      },
      {
        title: '📝 新办流程',
        content: '1. 新生报到后，由辅导员统一收集个人信息和照片。\n2. 学校统一制作，约2周后发放。\n3. 领取时需本人签字确认。'
      },
      {
        title: '🔄 补办流程',
        content: '1. 学生证遗失后，先到学生处官网下载《学生证补办申请表》。\n2. 填写完整后由辅导员签字盖章。\n3. 携带申请表、身份证和1寸免冠照片1张到行政楼205室办理。\n4. 缴纳工本费20元。\n5. 3个工作日后凭取件凭证领取新证。'
      },
      {
        title: '⏰ 办理时间',
        content: '周一至周五 8:30-11:30，14:00-17:00\n（节假日及寒暑假除外）'
      },
      {
        title: '📍 办理地点',
        content: '行政楼205室 学生处综合服务窗口'
      },
      {
        title: '📞 咨询电话',
        content: '010-12345003'
      },
      {
        title: '⚠️ 注意事项',
        content: '1. 学生证仅限本人使用，不得转借他人。\n2. 学生证需每学期开学时到学院注册盖章。\n3. 火车票优惠卡每年需充磁一次。\n4. 毕业时需将学生证交回学校。'
      }
    ],
    relatedPhones: [
      { name: '学生处', phone: '010-12345003' },
      { name: '教务处', phone: '010-12345002' }
    ]
  },
  'campus-card': {
    type: 'campus-card',
    title: '校园卡使用指南',
    icon: '💳',
    summary: '校园卡是集身份识别、消费支付、门禁通行于一体的多功能卡。本文介绍校园卡的充值、挂失、补办等全流程使用指南。',
    sections: [
      {
        title: '💳 功能介绍',
        content: '1. **身份认证**：进出校门、宿舍、图书馆、考试身份验证。\n2. **消费支付**：食堂、超市、浴室、开水房、校车等。\n3. **门禁通行**：图书馆、实验室、宿舍门禁。\n4. **图书借阅**：图书馆借书还书凭证。\n5. **水电缴费**：宿舍水电费缴纳。'
      },
      {
        title: '💰 充值方式',
        content: '**方式一：线上充值**\n1. 关注"校园一卡通"微信公众号。\n2. 绑定校园卡号。\n3. 选择充值金额，使用微信支付。\n\n**方式二：自助机充值**\n1. 在食堂、图书馆的自助圈存机上操作。\n2. 插入银行卡，按提示操作。\n\n**方式三：现金充值**\n1. 到生活服务中心1楼充值窗口。\n2. 现金或银行卡均可。'
      },
      {
        title: '🔒 挂失方法',
        content: '**方法一：电话挂失**\n拨打24小时挂失热线：010-12345801\n\n**方法二：线上挂失**\n1. 登录校园卡公众号，选择"挂失"功能。\n\n**方法三：自助机挂失**\n在任意自助圈存机上选择"挂失"。\n\n⚠️ 挂失后24小时内的损失由本人承担。'
      },
      {
        title: '🔓 解挂方法',
        content: '1. 找到校园卡后，携带本人身份证到校园卡服务中心。\n2. 工作人员核验身份后办理解挂。\n3. 校园卡恢复正常使用。'
      },
      {
        title: '🔄 补办流程',
        content: '1. 确认校园卡已挂失。\n2. 携带本人身份证到生活服务中心1楼。\n3. 填写补办申请表。\n4. 缴纳工本费30元。\n5. 现场拍照制卡，立等可取。\n6. 旧卡余额自动转入新卡。'
      },
      {
        title: '⏰ 服务时间',
        content: '**人工窗口**：周一至周日 8:00-20:00\n**自助服务**：24小时全天候\n**电话服务**：24小时'
      },
      {
        title: '📍 服务地点',
        content: '生活服务中心1楼 校园卡服务中心'
      },
      {
        title: '📞 联系电话',
        content: '服务热线：010-12345801\n挂失热线：010-12345801'
      },
      {
        title: '⚠️ 注意事项',
        content: '1. 校园卡仅限本人使用，不得转借。\n2. 请妥善保管，避免弯曲、接触磁场。\n3. 余额不足时请及时充值。\n4. 离校时需到服务中心办理销户退款。'
      }
    ],
    relatedPhones: [
      { name: '校园卡服务中心', phone: '010-12345801' },
      { name: '后勤服务中心', phone: '010-12345401' }
    ]
  },
  'repair': {
    type: 'repair',
    title: '宿舍报修流程',
    icon: '🔨',
    summary: '宿舍内水电设施、家具设备等出现故障时，可通过线上或线下方式申请报修。本文介绍完整的报修流程和注意事项。',
    sections: [
      {
        title: '🔧 报修范围',
        content: '✅ **可报修项目**：\n• 水电设施：水龙头、灯具、插座、空调、热水器\n• 家具设备：床架、桌椅、衣柜、门窗\n• 网络故障：网络不通、网速慢\n• 其他：门锁损坏、下水道堵塞等\n\n❌ **不可自行处理**：\n• 人为损坏需照价赔偿\n• 私拉电线、违章电器不予维修'
      },
      {
        title: '📱 线上报修（推荐）',
        content: '1. 关注"校园后勤"微信公众号。\n2. 点击"我要报修"。\n3. 选择报修类型：水电、家具、网络等。\n4. 填写宿舍号、联系电话、故障描述。\n5. 上传故障照片（可选但建议）。\n6. 提交后获得报修单，等待维修人员联系。\n\n⏱️ 响应时间：\n• 紧急报修（水管爆裂、严重漏水等：30分钟内响应\n• 一般报修：24小时内响应'
      },
      {
        title: '📞 电话报修',
        content: '24小时报修热线：010-12345403\n\n报修时请说明：\n1. 所在楼栋、宿舍号\n2. 故障类型和详细情况\n3. 联系人及电话\n\n紧急情况请直接拨打此电话！'
      },
      {
        title: '🏢 线下报修',
        content: '1. 到本楼栋值班室填写报修单。\n2. 详细填写故障情况。\n3. 值班人员登记后安排维修。\n4. 维修人员上门前会电话联系。'
      },
      {
        title: '⏰ 维修时间',
        content: '**正常维修时间**：\n周一至周日 8:00-18:00\n\n**紧急维修**：24小时全天候\n（漏水、断电、门锁损坏等紧急情况'
      },
      {
        title: '📍 报修地点',
        content: '各宿舍楼值班室\n后勤楼201室 物业维修中心'
      },
      {
        title: '📞 联系电话',
        content: '24小时报修热线：010-12345403\n物业监督电话：010-12345405'
      },
      {
        title: '⚠️ 注意事项',
        content: '1. 报修后请保持电话畅通，维修人员会提前联系。\n2. 家中留人配合维修。\n3. 人为损坏需承担维修费用。\n4. 维修完成后请在报修单上签字确认。\n5. 对维修不满意可拨打监督电话投诉。'
      }
    ],
    relatedPhones: [
      { name: '水电维修', phone: '010-12345403' },
      { name: '物业报修', phone: '010-12345405' }
    ]
  },
  'library': {
    type: 'library',
    title: '图书馆借阅规则',
    icon: '📚',
    summary: '图书馆藏书百万册，本文详细介绍图书借阅、续借、预约、逾期等规则，帮助同学们更好地利用图书馆资源。',
    sections: [
      {
        title: '📖 借阅证件',
        content: '1. 凭本人校园卡借阅图书。\n2. 校园卡仅限本人使用，不得转借。\n3. 毕业生、进修生可申请临时借阅证。\n4. 校友可凭校友卡借阅。'
      },
      {
        title: '📚 借阅数量',
        content: '**本科生**：最多10册\n**研究生**：最多20册\n**教职工**：最多30册\n\n**借阅期限**：\n普通图书：60天\n期刊合订本：15天\n新书（最近一年）：30天'
      },
      {
        title: '🔄 续借规则',
        content: '**续借方式**：\n1. 图书馆官网"我的图书馆"续借\n2. 图书馆微信公众号续借\n3. 图书馆自助借还机续借\n4. 到总服务台人工续借\n\n**续借规则**：\n• 每本书可续借2次\n• 每次续借30天\n• 有预约的图书不能续借\n• 逾期图书不能续借'
      },
      {
        title: '📅 预约图书',
        content: '如需借阅已被借出的图书：\n1. 在图书馆官网检索图书。\n2. 点击"预约"按钮。\n3. 选择取书图书馆（主馆/分馆）。\n4. 图书到馆后会通过短信通知。\n5. 7天内到预约书架取书。\n6. 逾期不取自动取消预约。\n\n⚠️ 每人最多预约3册。'
      },
      {
        title: '⏰ 开馆时间',
        content: '**主馆**：\n周一至周日 7:00-22:30\n**阅览室**：\n周一至周日 8:00-22:30\n**借书处**：\n周一至周日 8:00-20:00\n\n节假日及寒暑假时间另行通知。'
      },
      {
        title: '💴 逾期罚款',
        content: '普通图书：0.10元/天/册\n期刊：0.20元/天/册\n\n逾期30天以上暂停借阅权限。\n\n遗失赔偿：\n• 购买相同版本图书赔偿\n• 或按图书原价3-5倍赔偿'
      },
      {
        title: '📍 图书馆分布',
        content: '**主馆**：图书馆主楼\n• 社会科学图书区（1-3楼\n• 自然科学图书区（4-5楼\n• 电子阅览室（6楼\n\n**分馆**：\n• 文史分馆（外语楼\n• 工程分馆（信息楼\n• 医学分馆（医学院'
      },
      {
        title: '📞 联系电话',
        content: '总服务台：010-12345600\n借阅咨询：010-12345601'
      },
      {
        title: '⚠️ 注意事项',
        content: '1. 请爱护图书，不得涂改、圈点、批注。\n2. 图书如有损坏、遗失照价赔偿。\n3. 进馆请保持安静，手机调至静音。\n4. 禁止在馆内进食、吸烟。\n5. 遵守图书馆各项规章制度。'
      }
    ],
    relatedPhones: [
      { name: '图书馆总服务台', phone: '010-12345600' },
      { name: '借阅咨询', phone: '010-12345601' }
    ]
  },
  'transcript': {
    type: 'transcript',
    title: '成绩单办理',
    icon: '📄',
    summary: '成绩单是学生学习成绩的官方证明。本文介绍中英文成绩单的办理流程、费用和注意事项。',
    sections: [
      {
        title: '📋 办理类型',
        content: '**中文成绩单**：\n• 在校证明、评优评先、奖学金申请\n• 国内考研、就业推荐\n\n**英文成绩单**：\n• 出国留学申请\n• 境外交流项目\n• 外企求职'
      },
      {
        title: '📝 办理流程',
        content: '**方式一：线上申请**\n1. 登录学校教务系统。\n2. 进入"成绩管理" - "成绩单申请"。\n3. 选择类型（中文/英文）。\n4. 填写份数和领取方式。\n5. 在线支付费用。\n6. 3个工作日后领取。\n\n**方式二：线下申请**\n1. 到教务处网站下载《成绩单申请表。\n2. 填写完整后由学院审核盖章。\n3. 到行政楼201室提交。\n4. 缴费。\n5. 5个工作日后领取。'
      },
      {
        title: '💴 收费标准',
        content: '**中文成绩单**：\n• 第1份：免费\n• 第2份起：10元/份\n\n**英文成绩单**：\n• 第1份：免费\n• 第2份起：30元/份\n\n**密封盖章**：免费\n\n**加急办理**：加收50元/份，1个工作日取件'
      },
      {
        title: '⏰ 办理时间',
        content: '周一至周五\n上午 8:30-11:30\n下午 14:00-17:00\n\n（节假日及寒暑假除外）'
      },
      {
        title: '📍 办理地点',
        content: '行政楼201室 教务处服务窗口'
      },
      {
        title: '📞 咨询电话',
        content: '010-12345002'
      },
      {
        title: '📮 领取方式',
        content: '**自取**：凭本人身份证或校园卡领取。\n\n**代领**：代领人身份证+委托书。\n\n**邮寄**：\n• 申请时填写邮寄地址\n• 邮费到付\n• 顺丰快递，一般2-3天到达'
      },
      {
        title: '⚠️ 注意事项',
        content: '1. 成绩单需加盖教务处公章方为有效。\n2. 英文成绩单需与中文成绩单内容一致。\n3. 请核对成绩单信息准确无误。\n4. 如有错误请及时反馈更正。\n5. 成绩单原件请妥善保管。'
      }
    ],
    relatedPhones: [
      { name: '教务处', phone: '010-12345002' }
    ]
  },
  'career': {
    type: 'career',
    title: '就业创业服务',
    icon: '💼',
    summary: '学校为学生提供全方位的就业指导、校园招聘、创业扶持等服务。本文介绍各类就业创业服务内容和申请流程。',
    sections: [
      {
        title: '🎯 就业指导服务',
        content: '**职业规划咨询**：\n• 一对一职业咨询预约\n• 职业测评与解读\n• 职业规划课程\n\n**求职技巧培训**：\n• 简历制作 workshop\n• 面试技巧培训\n• 模拟面试\n• 求职礼仪培训\n\n**就业心理辅导**：\n• 求职压力疏导\n• 职业适应指导'
      },
      {
        title: '🏢 校园招聘会',
        content: '**大型招聘会**：\n• 春季招聘会（每年3-4月\n• 秋季招聘会（每年10-11月\n• 行业专场招聘会\n• 企业专场宣讲会\n\n招聘会信息获取渠道：\n1. 就业信息网\n2. 就业指导中心公众号\n3. 各学院通知\n4. 校园电子屏'
      },
      {
        title: '💼 就业信息发布',
        content: '**就业信息网**：job.xxx.edu.cn\n• 校园招聘信息\n• 实习信息\n• 公务员招考信息\n• 选调生信息\n• 事业单位招聘'
      },
      {
        title: '🚀 创业扶持政策',
        content: '**创业培训**：\n• SYB创业培训\n• 创业实训营\n• 创业沙龙\n\n**资金支持**：\n• 创业种子基金\n• 创业竞赛奖金\n• 小额担保贷款\n\n**场地支持**：\n• 大学生创业园\n• 免费办公场地\n• 创业孵化器'
      },
      {
        title: '📝 就业手续办理',
        content: '**就业协议书**：\n1. 毕业生领取三方协议。\n2. 与用人单位签订协议。\n3. 学院审核盖章。\n4. 就业指导中心鉴证。\n\n**报到证**：\n• 毕业时学校统一办理。\n• 凭报到证到单位报到。'
      },
      {
        title: '⏰ 服务时间',
        content: '**就业指导中心**：\n周一至周五 8:30-11:30，14:00-17:00\n\n**招聘会**：\n具体时间另行通知'
      },
      {
        title: '📍 服务地点',
        content: '大学生活动中心2楼 就业指导中心\n大学生创业园：生活服务中心3楼'
      },
      {
        title: '📞 联系电话',
        content: '就业咨询：010-12345901\n创业咨询：010-12345902\n招聘会咨询：010-12345903'
      },
      {
        title: '⚠️ 注意事项',
        content: '1. 及时关注就业信息，把握求职机会。\n2. 签约前充分了解用人单位情况。\n3. 遵守就业协议，诚信就业。\n4. 创业前做好市场调研和风险评估。\n5. 遇到问题及时咨询就业指导中心。'
      }
    ],
    relatedPhones: [
      { name: '就业咨询', phone: '010-12345901' },
      { name: '创业咨询', phone: '010-12345902' }
    ]
  }
};

const MOCK_STUDY_MATERIALS = [
  {
    title: '高等数学期末复习笔记',
    category: 'course',
    courseName: '高等数学',
    teacher: '张教授',
    semester: '2025-2026-1',
    description: '整理了整学期的重点笔记，包含例题解析和公式总结，适合期末复习使用',
    fileType: 'image',
    images: ['https://picsum.photos/seed/math1/800/1000'],
    files: [],
    uploaderName: '学霸小明',
    downloads: 156,
    favorites: 89
  },
  {
    title: '考研英语历年真题解析',
    category: 'postgraduate',
    description: '2018-2025年考研英语一真题及详细解析，包含阅读、翻译、作文答题技巧',
    fileType: 'pdf',
    images: ['https://picsum.photos/seed/english1/800/600'],
    files: [],
    uploaderName: '考研上岸学姐',
    downloads: 423,
    favorites: 256
  },
  {
    title: '考公行测解题技巧',
    category: 'civil',
    description: '行测五大模块解题技巧汇总，言语理解、判断推理、数量关系、资料分析、常识判断',
    fileType: 'doc',
    images: ['https://picsum.photos/seed/gov1/800/600'],
    files: [],
    uploaderName: '公考达人',
    downloads: 312,
    favorites: 178
  },
  {
    title: '四六级核心词汇手册',
    category: 'cet',
    description: '四六级高频核心词汇，按考试频率排序，附带例句和记忆方法',
    fileType: 'pdf',
    images: ['https://picsum.photos/seed/cet1/800/600'],
    files: [],
    uploaderName: '英语小王子',
    downloads: 567,
    favorites: 321
  },
  {
    title: '数学建模竞赛获奖论文',
    category: 'competition',
    description: '2024年全国大学生数学建模竞赛一等奖论文，包含完整解题思路和代码',
    fileType: 'pdf',
    images: ['https://picsum.photos/seed/model1/800/600'],
    files: [],
    uploaderName: '建模大神',
    downloads: 234,
    favorites: 145
  },
  {
    title: '数据结构期末试卷',
    category: 'course',
    courseName: '数据结构',
    teacher: '李教授',
    semester: '2024-2025-2',
    description: '去年数据结构期末试卷及参考答案，包含选择题、简答题和编程题',
    fileType: 'image',
    images: ['https://picsum.photos/seed/ds1/800/1000', 'https://picsum.photos/seed/ds2/800/1000'],
    files: [],
    uploaderName: '计科学长',
    downloads: 289,
    favorites: 167
  }
];

const MOCK_STUDY_REWARDS = [
  {
    title: '求数据结构期末试卷',
    category: 'course',
    courseName: '数据结构',
    teacher: '李教授',
    semester: '2024-2025-2',
    description: '求去年数据结构期末试卷，最好有答案，马上要考试了，万分感谢！',
    rewardPoints: 50,
    publisherName: '着急的小周',
    status: 'open',
    views: 128,
    responses: [
      {
        id: 'r1',
        responderName: '热心学长',
        content: '我有去年的试卷，已经私发给你了，查收一下',
        isAdopted: false,
        createTime: Date.now() - 86400000
      }
    ]
  },
  {
    title: '求考研政治肖四肖八',
    category: 'postgraduate',
    description: '求2026考研政治肖四肖八电子版，感激不尽！可有偿',
    rewardPoints: 100,
    publisherName: '考研er',
    status: 'open',
    views: 256,
    responses: []
  },
  {
    title: '求四级作文模板',
    category: 'cet',
    description: '马上要考四级了，求高分作文模板，最好是万能句型',
    rewardPoints: 30,
    publisherName: '英语渣渣',
    status: 'adopted',
    views: 89,
    responses: [
      {
        id: 'r1',
        responderName: '英语达人',
        content: '给你分享我整理的模板，包含图表作文、议论文、应用文等多种类型，已发你链接',
        isAdopted: true,
        createTime: Date.now() - 172800000
      },
      {
        id: 'r2',
        responderName: '过儿',
        content: '我也有一份，可以参考一下',
        isAdopted: false,
        createTime: Date.now() - 150000000
      }
    ],
    adoptedResponseId: 'r1'
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

const MOCK_CAMPUS_SHOPS = [
  {
    name: '校印打印店',
    category: 'print',
    description: '专业文印服务，论文装订、证件照拍摄，学生首选',
    cover: 'https://picsum.photos/seed/printshop/800/400',
    images: ['https://picsum.photos/seed/printshop1/800/600', 'https://picsum.photos/seed/printshop2/800/600'],
    phone: '010-12346101',
    address: '生活服务中心1楼106室',
    businessHours: '8:00-21:00',
    location: '生活服务中心',
    rating: 4.5,
    reviewCount: 128,
    studentDiscount: true,
    discount: '凭学生证打印0.1元/张（A4黑白）',
    services: [
      { name: 'A4黑白打印', price: '0.15元/张', studentPrice: '0.10元/张' },
      { name: 'A4彩色打印', price: '1.00元/张', studentPrice: '0.80元/张' },
      { name: '论文装订', price: '15元/本', studentPrice: '12元/本' },
      { name: '证件照拍摄', price: '25元/版', studentPrice: '20元/版' },
      { name: '复印', price: '0.20元/张', studentPrice: '0.15元/张' },
      { name: '扫描', price: '2.00元/页', studentPrice: '1.50元/页' }
    ],
    coupons: [
      { id: 'cp1', title: '新用户满10减3', condition: '满10元', discount: 3, validUntil: '2026-08-31', type: 'cash' },
      { id: 'cp2', title: '论文装订8折', condition: '装订5本以上', discount: 0.8, validUntil: '2026-07-31', type: 'percent' }
    ]
  },
  {
    name: '茶语奶茶店',
    category: 'milktea',
    description: '精选鲜茶鲜奶，校园里的小确幸，每日新鲜制作',
    cover: 'https://picsum.photos/seed/milkteashop/800/400',
    images: ['https://picsum.photos/seed/milktea1/800/600', 'https://picsum.photos/seed/milktea2/800/600'],
    phone: '010-12346102',
    address: '生活服务中心2楼201室',
    businessHours: '9:00-22:00',
    location: '生活服务中心',
    rating: 4.7,
    reviewCount: 356,
    studentDiscount: true,
    discount: '学生卡消费9折优惠',
    services: [
      { name: '珍珠奶茶', price: '12元', studentPrice: '10.8元' },
      { name: '杨枝甘露', price: '16元', studentPrice: '14.4元' },
      { name: '多肉葡萄', price: '18元', studentPrice: '16.2元' },
      { name: '柠檬养乐多', price: '14元', studentPrice: '12.6元' },
      { name: '抹茶拿铁', price: '15元', studentPrice: '13.5元' },
      { name: '鲜果茶（大杯）', price: '16元', studentPrice: '14.4元' }
    ],
    coupons: [
      { id: 'cp3', title: '第二杯半价', condition: '任意饮品', discount: 0.5, validUntil: '2026-07-15', type: 'percent' },
      { id: 'cp4', title: '满30减5', condition: '满30元', discount: 5, validUntil: '2026-08-31', type: 'cash' }
    ]
  },
  {
    name: '学海文具店',
    category: 'stationery',
    description: '学习用品一应俱全，考试必备文具专区，价格实惠',
    cover: 'https://picsum.photos/seed/stationeryshop/800/400',
    images: ['https://picsum.photos/seed/stationery1/800/600', 'https://picsum.photos/seed/stationery2/800/600'],
    phone: '010-12346103',
    address: '生活服务中心1楼108室',
    businessHours: '8:30-20:30',
    location: '生活服务中心',
    rating: 4.3,
    reviewCount: 89,
    studentDiscount: true,
    discount: '学生购买全场95折',
    services: [
      { name: '签字笔（3支装）', price: '6元', studentPrice: '5.7元' },
      { name: '笔记本（A5）', price: '8元', studentPrice: '7.6元' },
      { name: '考试文具套装', price: '25元', studentPrice: '22元' },
      { name: '荧光笔（6色）', price: '12元', studentPrice: '11.4元' },
      { name: '计算器（考试专用）', price: '45元', studentPrice: '40元' },
      { name: '文件夹（5个装）', price: '15元', studentPrice: '13.5元' }
    ],
    coupons: [
      { id: 'cp5', title: '满50减8', condition: '满50元', discount: 8, validUntil: '2026-09-30', type: 'cash' }
    ]
  },
  {
    name: '匠心理发店',
    category: 'barber',
    description: '专注学生发型设计，剪染烫一站式服务，预约免等待',
    cover: 'https://picsum.photos/seed/barbershop/800/400',
    images: ['https://picsum.photos/seed/barber1/800/600', 'https://picsum.photos/seed/barber2/800/600'],
    phone: '010-12346104',
    address: '生活服务中心3楼301室',
    businessHours: '9:00-21:00',
    location: '生活服务中心',
    rating: 4.6,
    reviewCount: 215,
    studentDiscount: true,
    discount: '凭学生证洗剪吹20元起',
    services: [
      { name: '洗剪吹（男）', price: '30元', studentPrice: '20元' },
      { name: '洗剪吹（女）', price: '50元', studentPrice: '38元' },
      { name: '染发', price: '128元起', studentPrice: '98元起' },
      { name: '烫发', price: '168元起', studentPrice: '128元起' },
      { name: '护理', price: '68元', studentPrice: '48元' },
      { name: '刘海修剪', price: '10元', studentPrice: '8元' }
    ],
    coupons: [
      { id: 'cp6', title: '新客洗剪吹15元', condition: '首次到店', discount: 15, validUntil: '2026-07-31', type: 'cash' },
      { id: 'cp7', title: '染烫8折', condition: '染烫同时消费', discount: 0.8, validUntil: '2026-08-31', type: 'percent' }
    ]
  },
  {
    name: '水果鲜生',
    category: 'fruit',
    description: '每日新鲜水果直供，果切拼盘现做，健康生活从水果开始',
    cover: 'https://picsum.photos/seed/fruitshop/800/400',
    images: ['https://picsum.photos/seed/fruit1/800/600', 'https://picsum.photos/seed/fruit2/800/600'],
    phone: '010-12346105',
    address: '生活服务中心1楼110室',
    businessHours: '7:30-22:00',
    location: '生活服务中心',
    rating: 4.4,
    reviewCount: 167,
    studentDiscount: true,
    discount: '学生卡消费9.5折',
    services: [
      { name: '应季水果（斤）', price: '8元起', studentPrice: '7.5元起' },
      { name: '水果拼盘（小）', price: '15元', studentPrice: '14元' },
      { name: '水果拼盘（大）', price: '25元', studentPrice: '23元' },
      { name: '鲜榨果汁', price: '12元', studentPrice: '10元' },
      { name: '酸奶水果捞', price: '18元', studentPrice: '16元' },
      { name: '果切外卖盒', price: '20元', studentPrice: '18元' }
    ],
    coupons: [
      { id: 'cp8', title: '满25减5', condition: '满25元', discount: 5, validUntil: '2026-08-31', type: 'cash' }
    ]
  },
  {
    name: '书香咖啡',
    category: 'coffee',
    description: '安静学习空间，精品手冲咖啡，期末复习好去处',
    cover: 'https://picsum.photos/seed/coffeeshop/800/400',
    images: ['https://picsum.photos/seed/coffee1/800/600', 'https://picsum.photos/seed/coffee2/800/600'],
    phone: '010-12346106',
    address: '图书馆1楼西侧',
    businessHours: '8:00-22:30',
    location: '图书馆',
    rating: 4.8,
    reviewCount: 289,
    studentDiscount: true,
    discount: '学生证全场9折',
    services: [
      { name: '美式咖啡', price: '15元', studentPrice: '13.5元' },
      { name: '拿铁', price: '20元', studentPrice: '18元' },
      { name: '卡布奇诺', price: '22元', studentPrice: '19.8元' },
      { name: '手冲单品', price: '28元', studentPrice: '25元' },
      { name: '抹茶拿铁', price: '22元', studentPrice: '19.8元' },
      { name: '蛋糕切片', price: '18元', studentPrice: '16元' }
    ],
    coupons: [
      { id: 'cp9', title: '买咖啡送蛋糕', condition: '任意咖啡', discount: 18, validUntil: '2026-07-31', type: 'gift' },
      { id: 'cp10', title: '满40减8', condition: '满40元', discount: 8, validUntil: '2026-08-31', type: 'cash' }
    ]
  },
  {
    name: '快修数码',
    category: 'repair',
    description: '手机电脑专业维修，贴膜换屏，数据恢复，立等可取',
    cover: 'https://picsum.photos/seed/repairshop/800/400',
    images: ['https://picsum.photos/seed/repair1/800/600', 'https://picsum.photos/seed/repair2/800/600'],
    phone: '010-12346107',
    address: '生活服务中心1楼112室',
    businessHours: '9:00-20:00',
    location: '生活服务中心',
    rating: 4.2,
    reviewCount: 96,
    studentDiscount: true,
    discount: '学生维修9折',
    services: [
      { name: '手机贴膜', price: '15元起', studentPrice: '10元起' },
      { name: '屏幕更换', price: '150元起', studentPrice: '130元起' },
      { name: '电池更换', price: '80元起', studentPrice: '68元起' },
      { name: '电脑清灰', price: '50元', studentPrice: '40元' },
      { name: '系统重装', price: '60元', studentPrice: '50元' },
      { name: '数据恢复', price: '100元起', studentPrice: '80元起' }
    ],
    coupons: [
      { id: 'cp11', title: '贴膜免费体验', condition: '首次到店', discount: 15, validUntil: '2026-07-31', type: 'cash' }
    ]
  },
  {
    name: '悦读书吧',
    category: 'bookstore',
    description: '教辅教材、课外读物、文创产品，读书人的精神家园',
    cover: 'https://picsum.photos/seed/bookshop/800/400',
    images: ['https://picsum.photos/seed/bookshop1/800/600', 'https://picsum.photos/seed/bookshop2/800/600'],
    phone: '010-12346108',
    address: '生活服务中心2楼205室',
    businessHours: '8:30-21:00',
    location: '生活服务中心',
    rating: 4.5,
    reviewCount: 134,
    studentDiscount: true,
    discount: '教材8折，课外书9折',
    services: [
      { name: '教材书籍', price: '按定价', studentPrice: '8折' },
      { name: '课外读物', price: '按定价', studentPrice: '9折' },
      { name: '教辅资料', price: '按定价', studentPrice: '85折' },
      { name: '文具礼品', price: '按标价', studentPrice: '9折' },
      { name: '旧书回收', price: '3折收购', studentPrice: '' },
      { name: '书籍代订', price: '按定价', studentPrice: '85折' }
    ],
    coupons: [
      { id: 'cp12', title: '满100减15', condition: '满100元', discount: 15, validUntil: '2026-09-30', type: 'cash' }
    ]
  }
];

const MOCK_SHOP_REVIEWS = [
  {
    shopIndex: 0,
    reviews: [
      { userName: '论文党', avatar: '', rating: 5, content: '论文装订特别专业，速度快价格也便宜，学生优惠很实惠！', images: [], createTime: Date.now() - 86400000 },
      { userName: '小王同学', avatar: '', rating: 4, content: '打印质量不错，就是期末的时候人很多，建议错峰。', images: [], createTime: Date.now() - 172800000 },
      { userName: '大四学姐', avatar: '', rating: 5, content: '证件照拍得很好看，比外面的照相馆便宜多了。', images: [], createTime: Date.now() - 259200000 }
    ]
  },
  {
    shopIndex: 1,
    reviews: [
      { userName: '奶茶控', avatar: '', rating: 5, content: '杨枝甘露超好喝！用的真材实料，学生折扣也很划算。', images: [], createTime: Date.now() - 86400000 },
      { userName: '考研er', avatar: '', rating: 4, content: '每天复习必点一杯，第二杯半价太良心了。', images: [], createTime: Date.now() - 345600000 },
      { userName: '柠檬精', avatar: '', rating: 5, content: '柠檬养乐多酸酸甜甜的，夏天喝特别解暑！', images: [], createTime: Date.now() - 432000000 }
    ]
  },
  {
    shopIndex: 2,
    reviews: [
      { userName: '文具控', avatar: '', rating: 4, content: '文具种类很全，考试套装买起来特别方便。', images: [], createTime: Date.now() - 86400000 },
      { userName: '小学妹', avatar: '', rating: 5, content: '荧光笔颜色很正，笔记本质量也好，学生折很香。', images: [], createTime: Date.now() - 259200000 }
    ]
  },
  {
    shopIndex: 3,
    reviews: [
      { userName: '帅气小哥哥', avatar: '', rating: 5, content: '20块钱洗剪吹还要什么自行车！发型师很专业。', images: [], createTime: Date.now() - 86400000 },
      { userName: '长发公主', avatar: '', rating: 4, content: '染发颜色很自然，价格比外面便宜不少，推荐！', images: [], createTime: Date.now() - 432000000 },
      { userName: '考研党', avatar: '', rating: 5, content: '期末考前来剪个头发精神多了，预约不用等。', images: [], createTime: Date.now() - 518400000 }
    ]
  },
  {
    shopIndex: 4,
    reviews: [
      { userName: '水果达人', avatar: '', rating: 4, content: '水果很新鲜，果切拼盘种类丰富，比食堂的水果好。', images: [], createTime: Date.now() - 86400000 },
      { userName: '养生少女', avatar: '', rating: 5, content: '酸奶水果捞是我的最爱，每天一份不重样！', images: [], createTime: Date.now() - 345600000 }
    ]
  },
  {
    shopIndex: 5,
    reviews: [
      { userName: '咖啡爱好者', avatar: '', rating: 5, content: '手冲做得非常专业，环境安静适合学习，图书馆里的宝藏店！', images: [], createTime: Date.now() - 86400000 },
      { userName: '期末战士', avatar: '', rating: 5, content: '复习周常驻这里，一杯拿铁坐一下午，太舒服了。', images: [], createTime: Date.now() - 172800000 },
      { userName: '甜食控', avatar: '', rating: 4, content: '蛋糕很好吃，就是品种再多点就好了。', images: [], createTime: Date.now() - 432000000 }
    ]
  },
  {
    shopIndex: 6,
    reviews: [
      { userName: '手残党', avatar: '', rating: 4, content: '手机贴膜贴得很好，没有气泡，学生价10块钱真香。', images: [], createTime: Date.now() - 86400000 },
      { userName: '电脑小白', avatar: '', rating: 5, content: '电脑清灰后散热好了很多，师傅很耐心。', images: [], createTime: Date.now() - 259200000 }
    ]
  },
  {
    shopIndex: 7,
    reviews: [
      { userName: '书虫', avatar: '', rating: 5, content: '教材8折真的省了不少钱，还可以帮忙订书很方便。', images: [], createTime: Date.now() - 86400000 },
      { userName: '文艺青年', avatar: '', rating: 4, content: '文创产品很精致，送人特别合适，就是种类可以再多点。', images: [], createTime: Date.now() - 345600000 },
      { userName: '书迷', avatar: '', rating: 5, content: '旧书回收很环保，换了好多书看，支持！', images: [], createTime: Date.now() - 518400000 }
    ]
  }
];

const MOCK_VOLUNTEER_ACTIVITIES = [
  {
    title: '校园开放日志愿者',
    category: 'community',
    description: '协助校园开放日的导览、咨询、秩序维护等工作，向来访家长和考生展示校园风采',
    startTime: Date.now() + 3 * 86400000,
    endTime: Date.now() + 3 * 86400000 + 8 * 3600000,
    location: '学校正门集合',
    requiredCount: 30,
    hours: 8,
    contactName: '张老师',
    contactPhone: '010-12345001',
    publisherId: 'admin',
    publisherName: '校团委',
    status: 'recruiting',
    views: 256,
    registrations: [
      { userId: 'test_user', userName: '志愿者小明', status: 'registered', registerTime: Date.now() - 86400000 },
      { userId: 'user_2', userName: '热心同学', status: 'checked_in', registerTime: Date.now() - 172800000 },
      { userId: 'user_3', userName: '小红', status: 'registered', registerTime: Date.now() - 100000000 }
    ]
  },
  {
    title: '社区义教助学活动',
    category: 'education',
    description: '前往周边社区为留守儿童提供课业辅导和兴趣课程，传递知识与温暖',
    startTime: Date.now() + 7 * 86400000,
    endTime: Date.now() + 7 * 86400000 + 4 * 3600000,
    location: '阳光社区服务中心',
    requiredCount: 15,
    hours: 4,
    contactName: '李老师',
    contactPhone: '010-12345002',
    publisherId: 'admin',
    publisherName: '校青协',
    status: 'recruiting',
    views: 189,
    registrations: [
      { userId: 'test_user', userName: '志愿者小明', status: 'checked_in', registerTime: Date.now() - 259200000 }
    ]
  },
  {
    title: '植树节环保行动',
    category: 'environment',
    description: '参与校园及周边绿化带的植树造林活动，为美丽家园添一份绿',
    startTime: Date.now() - 5 * 86400000,
    endTime: Date.now() - 5 * 86400000 + 6 * 3600000,
    location: '校园东门绿化带',
    requiredCount: 50,
    hours: 6,
    contactName: '王老师',
    contactPhone: '010-12345003',
    publisherId: 'admin',
    publisherName: '校环保协会',
    status: 'completed',
    views: 432,
    registrations: [
      { userId: 'test_user', userName: '志愿者小明', status: 'completed', registerTime: Date.now() - 10 * 86400000, checkinTime: Date.now() - 5 * 86400000, checkoutTime: Date.now() - 5 * 86400000 + 6 * 3600000 },
      { userId: 'user_2', userName: '热心同学', status: 'completed', registerTime: Date.now() - 9 * 86400000, checkinTime: Date.now() - 5 * 86400000, checkoutTime: Date.now() - 5 * 86400000 + 6 * 3600000 },
      { userId: 'user_3', userName: '小红', status: 'completed', registerTime: Date.now() - 9 * 86400000, checkinTime: Date.now() - 5 * 86400000, checkoutTime: Date.now() - 5 * 86400000 + 5 * 3600000 }
    ]
  },
  {
    title: '校运会志愿服务',
    category: 'sports',
    description: '协助校运会的裁判、计分、器材管理、医疗保障等工作',
    startTime: Date.now() - 15 * 86400000,
    endTime: Date.now() - 13 * 86400000,
    location: '校体育场',
    requiredCount: 80,
    hours: 16,
    contactName: '赵老师',
    contactPhone: '010-12345004',
    publisherId: 'admin',
    publisherName: '体育部',
    status: 'completed',
    views: 678,
    registrations: [
      { userId: 'test_user', userName: '志愿者小明', status: 'completed', registerTime: Date.now() - 20 * 86400000, checkinTime: Date.now() - 15 * 86400000, checkoutTime: Date.now() - 13 * 86400000 },
      { userId: 'user_4', userName: '运动达人', status: 'completed', registerTime: Date.now() - 19 * 86400000, checkinTime: Date.now() - 15 * 86400000, checkoutTime: Date.now() - 13 * 86400000 }
    ]
  },
  {
    title: '文化遗产日讲解员',
    category: 'culture',
    description: '在校园博物馆担任讲解员，向参观者介绍校史和文物展品',
    startTime: Date.now() + 10 * 86400000,
    endTime: Date.now() + 10 * 86400000 + 5 * 3600000,
    location: '校史馆',
    requiredCount: 10,
    hours: 5,
    contactName: '陈老师',
    contactPhone: '010-12345005',
    publisherId: 'admin',
    publisherName: '校史馆',
    status: 'recruiting',
    views: 145,
    registrations: []
  },
  {
    title: '冬季无偿献血活动',
    category: 'health',
    description: '协助市中心血站开展校园无偿献血活动，负责登记、引导、后勤保障等工作',
    startTime: Date.now() + 5 * 86400000,
    endTime: Date.now() + 5 * 86400000 + 6 * 3600000,
    location: '学生活动中心',
    requiredCount: 20,
    hours: 6,
    contactName: '刘老师',
    contactPhone: '010-12345006',
    publisherId: 'admin',
    publisherName: '校红十字会',
    status: 'recruiting',
    views: 312,
    registrations: [
      { userId: 'user_5', userName: '爱心同学', status: 'registered', registerTime: Date.now() - 86400000 }
    ]
  },
  {
    title: '爱心义卖助学活动',
    category: 'charity',
    description: '参与校园爱心义卖活动，义卖所得善款将全部用于资助贫困学生',
    startTime: Date.now() - 30 * 86400000,
    endTime: Date.now() - 30 * 86400000 + 8 * 3600000,
    location: '食堂广场',
    requiredCount: 25,
    hours: 8,
    contactName: '孙老师',
    contactPhone: '010-12345007',
    publisherId: 'admin',
    publisherName: '校学生会',
    status: 'completed',
    views: 523,
    registrations: [
      { userId: 'test_user', userName: '志愿者小明', status: 'completed', registerTime: Date.now() - 35 * 86400000, checkinTime: Date.now() - 30 * 86400000, checkoutTime: Date.now() - 30 * 86400000 + 8 * 3600000 }
    ]
  },
  {
    title: '迎新志愿服务',
    category: 'other',
    description: '协助新生报到、搬运行李、指引路线等，让新同学感受到家的温暖',
    startTime: Date.now() + 30 * 86400000,
    endTime: Date.now() + 32 * 86400000,
    location: '学校各入口',
    requiredCount: 100,
    hours: 12,
    contactName: '周老师',
    contactPhone: '010-12345008',
    publisherId: 'admin',
    publisherName: '校团委',
    status: 'recruiting',
    views: 89,
    registrations: []
  }
];

const MOCK_VOLUNTEER_HOURS_RECORDS = [
  { userId: 'test_user', activityId: '', activityTitle: '校园开放日志愿者', hours: 8, category: 'community', semester: '2025-2026-2', createTime: Date.now() - 90 * 86400000 },
  { userId: 'test_user', activityId: '', activityTitle: '植树节环保行动', hours: 6, category: 'environment', semester: '2025-2026-2', createTime: Date.now() - 5 * 86400000 },
  { userId: 'test_user', activityId: '', activityTitle: '校运会志愿服务', hours: 16, category: 'sports', semester: '2025-2026-2', createTime: Date.now() - 15 * 86400000 },
  { userId: 'test_user', activityId: '', activityTitle: '爱心义卖助学活动', hours: 8, category: 'charity', semester: '2025-2026-2', createTime: Date.now() - 30 * 86400000 },
  { userId: 'test_user', activityId: '', activityTitle: '社区义教助学活动', hours: 4, category: 'education', semester: '2025-2026-1', createTime: Date.now() - 120 * 86400000 },
  { userId: 'test_user', activityId: '', activityTitle: '迎新志愿服务', hours: 12, category: 'other', semester: '2025-2026-1', createTime: Date.now() - 150 * 86400000 }
];

const MOCK_ERRAND_ORDERS = [
  {
    type: 'express',
    pickupPoint: 'cainiao',
    pickupPointText: '菜鸟驿站',
    pickupCode: '5-8-1234',
    bounty: 3,
    deliveryAddress: '梅苑3栋 512室',
    contactPhone: '13800138001',
    remark: '稍大件，请小心轻放',
    status: 'pending',
    userId: 'test_user',
    userName: '小明'
  },
  {
    type: 'express',
    pickupPoint: 'sf',
    pickupPointText: '顺丰速运',
    pickupCode: 'SF2026061001',
    bounty: 5,
    deliveryAddress: '兰苑2栋 308室',
    contactPhone: '13900139002',
    remark: '',
    status: 'processing',
    userId: 'test_user',
    userName: '小红'
  },
  {
    type: 'print',
    fileName: '高等数学期末复习笔记.pdf',
    filePages: 30,
    colorType: 'bw',
    colorTypeText: '黑白',
    sideType: 'double',
    sideTypeText: '双面',
    paperSize: 'a4',
    copies: 2,
    totalPrice: 5.1,
    pickupTime: '今天 18:00-19:00',
    contactPhone: '13800138003',
    remark: '请装订',
    status: 'completed',
    userId: 'test_user',
    userName: '小刚'
  },
  {
    type: 'print',
    fileName: '毕业论文初稿.docx',
    filePages: 45,
    colorType: 'color',
    colorTypeText: '彩色',
    sideType: 'single',
    sideTypeText: '单面',
    paperSize: 'a4',
    copies: 1,
    totalPrice: 22.5,
    pickupTime: '明天 10:00-12:00',
    contactPhone: '13700137004',
    remark: '彩印封面，内页黑白即可',
    status: 'processing',
    userId: 'other_user',
    userName: '小李'
  },
  {
    type: 'express',
    pickupPoint: 'jd',
    pickupPointText: '京东快递',
    pickupCode: 'JD2026060988',
    bounty: 2,
    deliveryAddress: '竹苑1栋 201室',
    contactPhone: '13600136005',
    remark: '小件',
    status: 'completed',
    userId: 'test_user',
    userName: '小华'
  },
  {
    type: 'print',
    fileName: '思政课PPT打印.pdf',
    filePages: 12,
    colorType: 'color',
    colorTypeText: '彩色',
    sideType: 'single',
    sideTypeText: '单面',
    paperSize: 'a4',
    copies: 1,
    totalPrice: 6,
    pickupTime: '今天 16:00-17:00',
    contactPhone: '13500135006',
    remark: '',
    status: 'pending',
    userId: 'other_user',
    userName: '小芳'
  }
];

const MOCK_ERRAND_ADDRESSES = [
  {
    name: '张同学',
    phone: '13800138001',
    building: '梅苑3栋',
    room: '512室',
    area: '梅苑',
    isDefault: true
  },
  {
    name: '张同学',
    phone: '13800138001',
    building: '兰苑2栋',
    room: '308室',
    area: '兰苑',
    isDefault: false
  },
  {
    name: '李同学',
    phone: '13900139002',
    building: '竹苑1栋',
    room: '201室',
    area: '竹苑',
    isDefault: false
  }
];

const MOCK_RENTAL_HOUSES = [
  {
    title: '校内梅苑3栋 精致单间出租',
    locationType: 'campus',
    houseType: 'studio',
    rentType: 'entire',
    rent: 1200,
    deposit: 1200,
    area: 25,
    floor: '3/6',
    orientation: '南',
    distance: 200,
    genderRequirement: 'no_limit',
    facilities: ['wifi', 'air_conditioner', 'water_heater', 'furniture', 'washing_machine'],
    images: ['https://picsum.photos/seed/rental1/800/600', 'https://picsum.photos/seed/rental1a/800/600'],
    leaseTerm: '1_year',
    description: '校内梅苑3栋，精致单间，朝南采光好，家具家电齐全，拎包入住。环境安静，适合考研同学。',
    address: '梅苑3栋 512室',
    latitude: 39.9042,
    longitude: 116.4074,
    surrounding: ['图书馆500米', '食堂300米', '超市200米', '校医院800米'],
    contactName: '王同学',
    contactPhone: '13800138011',
    publisherType: 'personal',
    publisherId: 'user_001',
    publisherName: '王同学',
    publisherAvatar: '',
    status: 'available'
  },
  {
    title: '校外东门 两室一厅合租 限女生',
    locationType: 'off_campus',
    houseType: 'two_bedroom',
    rentType: 'shared',
    rent: 800,
    deposit: 800,
    area: 18,
    floor: '5/12',
    orientation: '东',
    distance: 800,
    genderRequirement: 'female_only',
    facilities: ['wifi', 'air_conditioner', 'washing_machine', 'refrigerator', 'water_heater', 'kitchen', 'balcony', 'elevator'],
    images: ['https://picsum.photos/seed/rental2/800/600', 'https://picsum.photos/seed/rental2a/800/600'],
    leaseTerm: '6_months',
    description: '东门小区，两室一厅，现出租次卧。室友是本校女生，作息规律，爱干净。希望找一位同样爱干净、作息规律的女生合租。',
    address: '东门阳光花园5栋 1502室',
    latitude: 39.9055,
    longitude: 116.4090,
    surrounding: ['地铁站500米', '商场800米', '超市300米', '小吃街200米'],
    contactName: '李同学',
    contactPhone: '13800138012',
    publisherType: 'personal',
    publisherId: 'user_002',
    publisherName: '李同学',
    publisherAvatar: '',
    status: 'available'
  },
  {
    title: '校内兰苑 一室一厅整租',
    locationType: 'campus',
    houseType: 'one_bedroom',
    rentType: 'entire',
    rent: 2500,
    deposit: 2500,
    area: 45,
    floor: '2/6',
    orientation: '南北通透',
    distance: 400,
    genderRequirement: 'no_limit',
    facilities: ['wifi', 'air_conditioner', 'heater', 'washing_machine', 'refrigerator', 'water_heater', 'kitchen', 'balcony', 'furniture', 'tv'],
    images: ['https://picsum.photos/seed/rental3/800/600', 'https://picsum.photos/seed/rental3a/800/600'],
    leaseTerm: '1_year',
    description: '校内兰苑教师公寓，一室一厅，南北通透，采光极佳。装修精良，家电齐全，适合情侣或单身人士租住。',
    address: '兰苑2栋 201室',
    latitude: 39.9038,
    longitude: 116.4068,
    surrounding: ['教学楼300米', '食堂400米', '图书馆600米', '体育馆500米'],
    contactName: '张老师',
    contactPhone: '13800138013',
    publisherType: 'personal',
    publisherId: 'user_003',
    publisherName: '张老师',
    publisherAvatar: '',
    status: 'available'
  },
  {
    title: '校外南门 三室一厅 主卧出租',
    locationType: 'off_campus',
    houseType: 'three_bedroom',
    rentType: 'shared',
    rent: 1000,
    deposit: 1000,
    area: 22,
    floor: '8/18',
    orientation: '南',
    distance: 1200,
    genderRequirement: 'male_only',
    facilities: ['wifi', 'air_conditioner', 'washing_machine', 'refrigerator', 'water_heater', 'kitchen', 'elevator', 'parking', 'furniture'],
    images: ['https://picsum.photos/seed/rental4/800/600', 'https://picsum.photos/seed/rental4a/800/600'],
    leaseTerm: '3_months',
    description: '南门附近小区，三室一厅，主卧朝南带独立卫浴。室友都是本校男生，人好相处，平时安静不吵闹。',
    address: '南门幸福里8栋 803室',
    latitude: 39.9028,
    longitude: 116.4085,
    surrounding: ['公交站200米', '超市300米', '健身房500米', '小吃街100米'],
    contactName: '陈同学',
    contactPhone: '13800138014',
    publisherType: 'personal',
    publisherId: 'user_004',
    publisherName: '陈同学',
    publisherAvatar: '',
    status: 'available'
  },
  {
    title: '校外西门 单间出租 近地铁',
    locationType: 'off_campus',
    houseType: 'studio',
    rentType: 'entire',
    rent: 1500,
    deposit: 1500,
    area: 20,
    floor: '6/12',
    orientation: '东南',
    distance: 1500,
    genderRequirement: 'no_limit',
    facilities: ['wifi', 'air_conditioner', 'water_heater', 'furniture', 'elevator', 'washing_machine'],
    images: ['https://picsum.photos/seed/rental5/800/600', 'https://picsum.photos/seed/rental5a/800/600'],
    leaseTerm: 'negotiable',
    description: '西门附近，独立卫浴单间，近地铁站，交通便利。公寓管理规范，24小时保安，安全可靠。',
    address: '西门青年公寓6栋 605室',
    latitude: 39.9050,
    longitude: 116.4050,
    surrounding: ['地铁站300米', '公交站200米', '商场1000米', '医院800米'],
    contactName: '刘经理',
    contactPhone: '13800138015',
    publisherType: 'agent',
    publisherId: 'agent_001',
    publisherName: '刘经理',
    publisherAvatar: '',
    status: 'available'
  },
  {
    title: '校内竹苑 合租单间 限男生',
    locationType: 'campus',
    houseType: 'two_bedroom',
    rentType: 'shared',
    rent: 600,
    deposit: 600,
    area: 15,
    floor: '4/6',
    orientation: '北',
    distance: 300,
    genderRequirement: 'male_only',
    facilities: ['wifi', 'air_conditioner', 'water_heater', 'furniture', 'washing_machine'],
    images: ['https://picsum.photos/seed/rental6/800/600', 'https://picsum.photos/seed/rental6a/800/600'],
    leaseTerm: '1_year',
    description: '校内竹苑，两室一厅合租，次卧朝北。室友是本校男生，性格开朗，喜欢运动，希望找志同道合的室友。',
    address: '竹苑1栋 402室',
    latitude: 39.9045,
    longitude: 116.4070,
    surrounding: ['食堂200米', '操场300米', '超市150米', '教学楼500米'],
    contactName: '赵同学',
    contactPhone: '13800138016',
    publisherType: 'personal',
    publisherId: 'user_005',
    publisherName: '赵同学',
    publisherAvatar: '',
    status: 'available'
  }
];

const MOCK_CARPOOLS = [
  {
    type: 'car_seeking',
    departure: '学校北门',
    destination: 'station',
    destinationText: '火车站',
    departureTime: Date.now() + 3600000 * 3,
    totalSeats: 4,
    currentMembers: 2,
    pricePerPerson: 25,
    costSharing: 'AA分摊',
    remark: '后天上午出发，走高速，预计1.5小时到达。行李箱可以放后备箱，请提前10分钟到北门集合。',
    contactName: '王同学',
    contactPhone: '13800138020',
    wechatId: 'wx_wang2026',
    verified: true,
    publisherId: 'user_010',
    publisherName: '王同学',
    publisherAvatar: '',
    status: 'recruiting',
    members: [
      { userId: 'user_010', userName: '王同学', confirmed: true, phone: '13800138020' },
      { userId: 'user_011', userName: '李同学', confirmed: true, phone: '13800138021' }
    ]
  },
  {
    type: 'person_seeking',
    departure: '市中心万达广场',
    destination: 'scenic',
    destinationText: '景区',
    departureTime: Date.now() + 86400000,
    totalSeats: 1,
    currentMembers: 1,
    pricePerPerson: 30,
    costSharing: 'AA分摊',
    remark: '周末想去景区玩，求拼车同行。可以帮忙开车（有驾照3年），也可以分摊油费。',
    contactName: '张同学',
    contactPhone: '13800138022',
    wechatId: 'wx_zhang2026',
    verified: true,
    publisherId: 'user_012',
    publisherName: '张同学',
    publisherAvatar: '',
    status: 'recruiting',
    members: [
      { userId: 'user_012', userName: '张同学', confirmed: true, phone: '13800138022' }
    ]
  },
  {
    type: 'charter',
    departure: '学校南门',
    destination: 'airport',
    destinationText: '机场',
    departureTime: Date.now() + 172800000,
    totalSeats: 6,
    currentMembers: 3,
    pricePerPerson: 50,
    costSharing: '包车均摊',
    remark: '包了一辆7座商务车去机场，还有4个空位，费用6人均摊。可以放行李，准时出发不等人。',
    contactName: '陈同学',
    contactPhone: '13800138023',
    wechatId: 'wx_chen2026',
    verified: false,
    publisherId: 'user_013',
    publisherName: '陈同学',
    publisherAvatar: '',
    status: 'recruiting',
    members: [
      { userId: 'user_013', userName: '陈同学', confirmed: true, phone: '13800138023' },
      { userId: 'user_014', userName: '刘同学', confirmed: true, phone: '13800138024' },
      { userId: 'user_015', userName: '赵同学', confirmed: true, phone: '13800138025' }
    ]
  },
  {
    type: 'car_seeking',
    departure: '学校东门',
    destination: 'home',
    destinationText: '回家',
    departureTime: Date.now() + 259200000,
    totalSeats: 5,
    currentMembers: 4,
    pricePerPerson: 80,
    costSharing: 'AA分摊',
    remark: '端午节回家，自驾车还有1个空位。走高速约2.5小时，可在中途服务区休息。',
    contactName: '周同学',
    contactPhone: '13800138026',
    wechatId: 'wx_zhou2026',
    verified: true,
    publisherId: 'user_016',
    publisherName: '周同学',
    publisherAvatar: '',
    status: 'recruiting',
    members: [
      { userId: 'user_016', userName: '周同学', confirmed: true, phone: '13800138026' },
      { userId: 'user_017', userName: '吴同学', confirmed: true, phone: '13800138027' },
      { userId: 'user_018', userName: '郑同学', confirmed: true, phone: '13800138028' },
      { userId: 'user_019', userName: '孙同学', confirmed: true, phone: '13800138029' }
    ]
  },
  {
    type: 'person_seeking',
    departure: '学校西门',
    destination: 'downtown',
    destinationText: '市中心',
    departureTime: Date.now() + 43200000,
    totalSeats: 1,
    currentMembers: 1,
    pricePerPerson: 15,
    costSharing: 'AA分摊',
    remark: '下午去市中心逛街，求拼车，可分摊油费和停车费。大概晚上8点左右回学校。',
    contactName: '林同学',
    contactPhone: '13800138030',
    wechatId: '',
    verified: false,
    publisherId: 'user_020',
    publisherName: '林同学',
    publisherAvatar: '',
    status: 'recruiting',
    members: [
      { userId: 'user_020', userName: '林同学', confirmed: true, phone: '13800138030' }
    ]
  },
  {
    type: 'car_seeking',
    departure: '学校北门',
    destination: 'scenic',
    destinationText: '景区',
    departureTime: Date.now() - 86400000,
    totalSeats: 4,
    currentMembers: 4,
    pricePerPerson: 35,
    costSharing: 'AA分摊',
    remark: '周末景区一日游，已满员。感谢各位同行！',
    contactName: '何同学',
    contactPhone: '13800138031',
    wechatId: 'wx_he2026',
    verified: true,
    publisherId: 'user_021',
    publisherName: '何同学',
    publisherAvatar: '',
    status: 'full',
    members: [
      { userId: 'user_021', userName: '何同学', confirmed: true, phone: '13800138031' },
      { userId: 'user_022', userName: '马同学', confirmed: true, phone: '13800138032' },
      { userId: 'user_023', userName: '杨同学', confirmed: true, phone: '13800138033' },
      { userId: 'user_024', userName: '黄同学', confirmed: true, phone: '13800138034' }
    ]
  }
];

const CROWD_LEVELS = [
  { value: 'idle', label: '空闲', color: '#52C41A', icon: '😊', desc: '无需排队，随到随吃' },
  { value: 'moderate', label: '适中', color: '#FAAD14', icon: '🙂', desc: '稍有排队，等待5分钟' },
  { value: 'crowded', label: '拥挤', color: '#FF4D4F', icon: '😰', desc: '排队严重，等待15分钟+' }
];

const BREAKFAST_DISHES = [
  { id: 'breakfast1', name: '肉包子', price: 2.5, image: 'https://picsum.photos/seed/baozi/400/400', description: '猪肉大葱馅，皮薄馅大', tag: '招牌', calories: 220 },
  { id: 'breakfast2', name: '豆浆油条', price: 4, image: 'https://picsum.photos/seed/doujiang/400/400', description: '现磨豆浆配酥脆油条', tag: '经典', calories: 350 },
  { id: 'breakfast3', name: '茶叶蛋', price: 1.5, image: 'https://picsum.photos/seed/egg/400/400', description: '五香茶叶蛋，入味十足', tag: '', calories: 80 },
  { id: 'breakfast4', name: '小米粥', price: 2, image: 'https://picsum.photos/seed/millet/400/400', description: '养胃小米粥，配小菜', tag: '', calories: 120 },
  { id: 'breakfast5', name: '煎饼果子', price: 6, image: 'https://picsum.photos/seed/jianbing/400/400', description: '天津风味，薄脆酥脆', tag: '推荐', calories: 450 },
  { id: 'breakfast6', name: '三明治', price: 8, image: 'https://picsum.photos/seed/sandwich/400/400', description: '鸡蛋火腿三明治，营养均衡', tag: '新品', calories: 380 }
];

const LUNCH_DISHES = [
  { id: 'lunch1', name: '红烧肉盖浇饭', price: 15, image: 'https://picsum.photos/seed/hongshao/400/400', description: '肥而不腻，入口即化', tag: '招牌', calories: 650 },
  { id: 'lunch2', name: '宫保鸡丁', price: 12, image: 'https://picsum.photos/seed/gongbao/400/400', description: '经典川菜，酸甜微辣', tag: '推荐', calories: 480 },
  { id: 'lunch3', name: '麻婆豆腐', price: 8, image: 'https://picsum.photos/seed/mapo/400/400', description: '麻辣鲜香，下饭神器', tag: '', calories: 320 },
  { id: 'lunch4', name: '兰州拉面', price: 14, image: 'https://picsum.photos/seed/lamian/400/400', description: '清汤牛肉，面劲道', tag: '经典', calories: 520 },
  { id: 'lunch5', name: '黄焖鸡米饭', price: 16, image: 'https://picsum.photos/seed/huangmen/400/400', description: '鸡肉嫩滑，汤汁浓郁', tag: '新品', calories: 580 },
  { id: 'lunch6', name: '水煮鱼', price: 22, image: 'https://picsum.photos/seed/shuizhu/400/400', description: '麻辣鲜香，鱼肉嫩滑', tag: '推荐', calories: 720 },
  { id: 'lunch7', name: '番茄炒蛋盖饭', price: 10, image: 'https://picsum.photos/seed/tomato/400/400', description: '家常美味，营养均衡', tag: '', calories: 420 },
  { id: 'lunch8', name: '新疆大盘鸡', price: 25, image: 'https://picsum.photos/seed/dapanji/400/400', description: '鸡肉配土豆，皮带面绝配', tag: '招牌', calories: 850 }
];

const DINNER_DISHES = [
  { id: 'dinner1', name: '白切鸡饭', price: 18, image: 'https://picsum.photos/seed/baiqie/400/400', description: '皮爽肉滑，配姜葱酱', tag: '招牌', calories: 520 },
  { id: 'dinner2', name: '石锅拌饭', price: 16, image: 'https://picsum.photos/seed/stone/400/400', description: '韩式风味，锅巴香脆', tag: '推荐', calories: 580 },
  { id: 'dinner3', name: '照烧鸡饭', price: 17, image: 'https://picsum.photos/seed/zhaoshao/400/400', description: '日式照烧酱汁，鸡肉嫩滑', tag: '新品', calories: 540 },
  { id: 'dinner4', name: '地三鲜', price: 10, image: 'https://picsum.photos/seed/disanxian/400/400', description: '茄子土豆青椒，东北名菜', tag: '', calories: 380 },
  { id: 'dinner5', name: '豚骨拉面', price: 18, image: 'https://picsum.photos/seed/tonkotsu/400/400', description: '浓郁汤底，叉烧软糯', tag: '推荐', calories: 620 },
  { id: 'dinner6', name: '部队火锅套餐', price: 28, image: 'https://picsum.photos/seed/budae/400/400', description: '火腿午餐肉，配方便面', tag: '新品', calories: 780 },
  { id: 'dinner7', name: '葱爆羊肉盖饭', price: 19, image: 'https://picsum.photos/seed/congbao/400/400', description: '羊肉鲜嫩，葱香浓郁', tag: '', calories: 650 },
  { id: 'dinner8', name: '小火锅（单人）', price: 25, image: 'https://picsum.photos/seed/hotpot/400/400', description: '一人一锅，多种锅底可选', tag: '招牌', calories: 700 }
];

const ALL_DISHES = [...BREAKFAST_DISHES, ...LUNCH_DISHES, ...DINNER_DISHES];

const TODAY_RECOMMENDS = [
  { ...LUNCH_DISHES[0], recommendReason: '本周销量冠军，日销200+份', canteenId: 'canteen1', canteenName: '第一食堂' },
  { ...DINNER_DISHES[1], recommendReason: '韩式风味，同学推荐TOP1', canteenId: 'canteen5', canteenName: '网红餐厅' },
  { ...LUNCH_DISHES[7], recommendReason: '新疆风味，分量超足', canteenId: 'canteen3', canteenName: '清真食堂' }
];

const NEW_DISHES = [
  { ...DINNER_DISHES[5], newTag: '上新第1天', canteenId: 'canteen5', canteenName: '网红餐厅' },
  { ...LUNCH_DISHES[4], newTag: '上新第3天', canteenId: 'canteen2', canteenName: '第二食堂' },
  { ...BREAKFAST_DISHES[5], newTag: '上新第5天', canteenId: 'canteen4', canteenName: '教工食堂' },
  { ...DINNER_DISHES[2], newTag: '上新第7天', canteenId: 'canteen5', canteenName: '网红餐厅' }
];

const CANTEEN_DISH_MAP = {
  canteen1: { breakfast: [BREAKFAST_DISHES[0], BREAKFAST_DISHES[1], BREAKFAST_DISHES[2], BREAKFAST_DISHES[3]], lunch: [LUNCH_DISHES[0], LUNCH_DISHES[1], LUNCH_DISHES[2], LUNCH_DISHES[6]], dinner: [DINNER_DISHES[3], LUNCH_DISHES[3], LUNCH_DISHES[6], DINNER_DISHES[6]] },
  canteen2: { breakfast: [BREAKFAST_DISHES[0], BREAKFAST_DISHES[4], BREAKFAST_DISHES[5], BREAKFAST_DISHES[2]], lunch: [LUNCH_DISHES[1], LUNCH_DISHES[2], LUNCH_DISHES[4], LUNCH_DISHES[5]], dinner: [DINNER_DISHES[0], DINNER_DISHES[3], DINNER_DISHES[6], LUNCH_DISHES[7]] },
  canteen3: { breakfast: [BREAKFAST_DISHES[1], BREAKFAST_DISHES[2], BREAKFAST_DISHES[3]], lunch: [LUNCH_DISHES[3], LUNCH_DISHES[7], DINNER_DISHES[6]], dinner: [DINNER_DISHES[6], LUNCH_DISHES[7], DINNER_DISHES[3]] },
  canteen4: { breakfast: [BREAKFAST_DISHES[5], BREAKFAST_DISHES[0], BREAKFAST_DISHES[1]], lunch: [LUNCH_DISHES[0], LUNCH_DISHES[1], DINNER_DISHES[0], DINNER_DISHES[2]], dinner: [DINNER_DISHES[0], DINNER_DISHES[2], LUNCH_DISHES[1]] },
  canteen5: { breakfast: [BREAKFAST_DISHES[5], BREAKFAST_DISHES[4]], lunch: [DINNER_DISHES[1], DINNER_DISHES[2], DINNER_DISHES[4], LUNCH_DISHES[4]], dinner: [DINNER_DISHES[1], DINNER_DISHES[2], DINNER_DISHES[4], DINNER_DISHES[5], DINNER_DISHES[7]] }
};

const MOCK_CANTEEN_REVIEWS = [
  { id: 'cr1', canteenId: 'c1', userId: 'u1', userName: '吃货小明', avatar: 'https://picsum.photos/seed/avatar1/100/100', rating: 5, content: '第一食堂的红烧肉真的绝了！肥而不腻，每次来必点，价格也很实惠。', recommendTags: ['红烧肉', '价格实惠'], avoidTags: [], images: [], createTime: Date.now() - 3600000 },
  { id: 'cr2', canteenId: 'c1', userId: 'u2', userName: '减肥中的小红', avatar: 'https://picsum.photos/seed/avatar2/100/100', rating: 4, content: '饭菜价格便宜，就是高峰期人太多了，建议错峰就餐。', recommendTags: ['价格实惠'], avoidTags: ['高峰期拥挤'], images: [], createTime: Date.now() - 7200000 },
  { id: 'cr3', canteenId: 'c3', userId: 'u3', userName: '四川来的小李', avatar: 'https://picsum.photos/seed/avatar3/100/100', rating: 5, content: '川菜窗口太正宗了！麻婆豆腐和水煮鱼就是家乡的味道，强烈推荐！', recommendTags: ['川菜正宗', '麻辣香锅'], avoidTags: [], images: [], createTime: Date.now() - 86400000 },
  { id: 'cr4', canteenId: 'c5', userId: 'u4', userName: '打卡达人', avatar: 'https://picsum.photos/seed/avatar4/100/100', rating: 5, content: '韩餐窗口超棒，石锅拌饭一定要试试！锅巴香脆，辣酱超好吃。', recommendTags: ['石锅拌饭', '网红店'], avoidTags: [], images: [], createTime: Date.now() - 172800000 }
];

const MOCK_DISH_REVIEWS = [
  { id: 'dr1', dishId: 'd1', userId: 'u1', userName: '红烧肉爱好者', avatar: 'https://picsum.photos/seed/avatar1/100/100', rating: 5, content: '这份红烧肉真的太好吃了！肥瘦相间，酱汁浓郁，配米饭我可以吃两碗！', recommend: true, images: [], likes: 36, createTime: Date.now() - 1800000 },
  { id: 'dr2', dishId: 'd1', userId: 'u2', userName: '美食评论家', avatar: 'https://picsum.photos/seed/avatar2/100/100', rating: 4, content: '味道不错，就是有时候有点偏咸，希望师傅注意控制盐量。', recommend: true, images: [], likes: 12, createTime: Date.now() - 3600000 },
  { id: 'dr3', dishId: 'd3', userId: 'u3', userName: '日式料理爱好者', avatar: 'https://picsum.photos/seed/avatar3/100/100', rating: 5, content: '照烧鸡排外焦里嫩，酱汁浓郁香甜，一口下去超满足！', recommend: true, images: [], likes: 45, createTime: Date.now() - 86400000 },
  { id: 'dr4', dishId: 'd4', userId: 'u4', userName: '爱辣星人', avatar: 'https://picsum.photos/seed/avatar4/100/100', rating: 5, content: '麻辣香锅自选食材超棒，麻辣鲜香，就是对不能吃辣的要小心选辣度。', recommend: true, images: [], likes: 28, createTime: Date.now() - 172800000 },
  { id: 'dr5', dishId: 'd4', userId: 'u5', userName: '怕辣的同学', avatar: 'https://picsum.photos/seed/avatar5/100/100', rating: 2, content: '不小心点了超辣，完全吃不下去，对不能吃辣的同学非常不友好，避雷！', recommend: false, images: [], likes: 5, createTime: Date.now() - 259200000 },
  { id: 'dr6', dishId: 'd12', userId: 'u6', userName: '韩剧迷', avatar: 'https://picsum.photos/seed/avatar6/100/100', rating: 5, content: '看剧的时候就馋这口石锅拌饭，锅巴太香了！配的辣酱超好吃，强推！', recommend: true, images: [], likes: 52, createTime: Date.now() - 345600000 }
];

const MOCK_CANTEENS = [
  {
    id: 'c1',
    name: '第一食堂',
    cover: 'https://picsum.photos/seed/canteen1/800/400',
    images: ['https://picsum.photos/seed/canteen1a/800/600', 'https://picsum.photos/seed/canteen1b/800/600'],
    rating: 4.6,
    reviewCount: 1286,
    location: '东区教学楼旁',
    crowdLevel: 'idle',
    crowdDesc: '当前用餐人数较少，无需排队',
    businessHours: { breakfast: '06:30-09:00', lunch: '11:00-13:30', dinner: '17:00-19:30' },
    floors: 2,
    description: '大众菜系为主，价格实惠，适合日常用餐',
    tags: ['家常菜', '便宜实惠', '品种多'],
    isFavorite: false,
    views: 5623,
    phone: '010-12345404',
    stalls: [
      { id: 'stall1-1', name: '家常菜窗口', floor: 1, specialty: ['红烧肉盖饭', '宫保鸡丁'], featureTags: ['signature', 'popular'] },
      { id: 'stall1-2', name: '面食窗口', floor: 1, specialty: ['兰州拉面', '刀削面'], featureTags: ['classic'] },
      { id: 'stall1-3', name: '快餐窗口', floor: 2, specialty: ['盖浇饭', '咖喱饭'], featureTags: ['quick'] },
      { id: 'stall1-4', name: '粥品窗口', floor: 2, specialty: ['皮蛋瘦肉粥', '手工豆沙包'], featureTags: ['new'] }
    ]
  },
  {
    id: 'c2',
    name: '第二食堂（清真）',
    cover: 'https://picsum.photos/seed/canteen2/800/400',
    images: ['https://picsum.photos/seed/canteen2a/800/600', 'https://picsum.photos/seed/canteen2b/800/600'],
    rating: 4.3,
    reviewCount: 892,
    location: '西区宿舍楼附近',
    crowdLevel: 'moderate',
    crowdDesc: '用餐人数适中，稍等片刻即可',
    businessHours: { breakfast: '06:30-09:30', lunch: '11:00-14:00', dinner: '17:00-20:00' },
    floors: 1,
    description: '清真风味，牛羊肉为主，特色西北面食',
    tags: ['清真', '西北风味', '面食'],
    isFavorite: true,
    views: 3421,
    phone: '010-12345412',
    stalls: [
      { id: 'stall2-1', name: '兰州拉面', floor: 1, specialty: ['牛肉拉面', '羊肉泡馍'], featureTags: ['signature', 'classic'] },
      { id: 'stall2-2', name: '新疆风味', floor: 1, specialty: ['大盘鸡', '手抓饭'], featureTags: ['popular'] },
      { id: 'stall2-3', name: '清真炒菜', floor: 1, specialty: ['葱爆羊肉', '番茄牛腩面'], featureTags: ['recommend'] }
    ]
  },
  {
    id: 'c3',
    name: '美食广场',
    cover: 'https://picsum.photos/seed/canteen3/800/400',
    images: ['https://picsum.photos/seed/canteen3a/800/600', 'https://picsum.photos/seed/canteen3b/800/600'],
    rating: 4.8,
    reviewCount: 2567,
    location: '学生活动中心B1层',
    crowdLevel: 'crowded',
    crowdDesc: '用餐高峰，建议错峰前往',
    businessHours: { breakfast: '07:00-09:30', lunch: '11:00-14:00', dinner: '17:00-21:00' },
    floors: 1,
    description: '品种丰富，各地风味小吃，环境整洁',
    tags: ['各地美食', '网红店', '环境好'],
    isFavorite: false,
    views: 8921,
    phone: '010-12345413',
    stalls: [
      { id: 'stall3-1', name: '川菜窗口', floor: 1, specialty: ['麻辣香锅', '水煮鱼'], featureTags: ['signature', 'spicy'] },
      { id: 'stall3-2', name: '日韩料理', floor: 1, specialty: ['日式咖喱猪排饭', '照烧鸡排饭'], featureTags: ['new', 'recommend'] },
      { id: 'stall3-3', name: '东南亚风味', floor: 1, specialty: ['泰式冬阴功汤粉'], featureTags: ['new', 'exotic'] },
      { id: 'stall3-4', name: '东北菜窗口', floor: 1, specialty: ['锅包肉', '地三鲜'], featureTags: ['popular'] },
      { id: 'stall3-5', name: '自助餐窗口', floor: 1, specialty: ['自助午餐', '自助晚餐'], featureTags: ['affordable'] }
    ]
  },
  {
    id: 'c4',
    name: '教工食堂',
    cover: 'https://picsum.photos/seed/canteen4/800/400',
    images: ['https://picsum.photos/seed/canteen4a/800/600', 'https://picsum.photos/seed/canteen4b/800/600'],
    rating: 4.5,
    reviewCount: 634,
    location: '行政楼后侧',
    crowdLevel: 'idle',
    crowdDesc: '人数较少，安静舒适',
    businessHours: { breakfast: '06:30-08:30', lunch: '11:30-13:00', dinner: '17:30-19:00' },
    floors: 2,
    description: '菜品精致，环境优雅，学生也可就餐',
    tags: ['精致小炒', '环境清幽', '学生可用'],
    isFavorite: false,
    views: 2134,
    phone: '010-12345414',
    stalls: [
      { id: 'stall4-1', name: '精品炒菜', floor: 1, specialty: ['松鼠鳜鱼', '龙井虾仁'], featureTags: ['signature'] },
      { id: 'stall4-2', name: '营养套餐', floor: 1, specialty: ['商务套餐', '营养餐'], featureTags: ['healthy'] },
      { id: 'stall4-3', name: '定制窗口', floor: 2, specialty: ['芝士焗意大利面', '定制菜品'], featureTags: ['new', 'custom'] }
    ]
  },
  {
    id: 'c5',
    name: '北区食堂',
    cover: 'https://picsum.photos/seed/canteen5/800/400',
    images: ['https://picsum.photos/seed/canteen5a/800/600', 'https://picsum.photos/seed/canteen5b/800/600'],
    rating: 4.2,
    reviewCount: 756,
    location: '北门公寓区',
    crowdLevel: 'moderate',
    crowdDesc: '人不多不少，正合适',
    businessHours: { breakfast: '06:30-09:00', lunch: '11:00-13:30', dinner: '17:00-19:30' },
    floors: 2,
    description: '川湘菜为主，量大实惠，辣度可选',
    tags: ['川湘菜', '量大实惠', '辣度可选'],
    isFavorite: false,
    views: 2890,
    phone: '010-12345415',
    stalls: [
      { id: 'stall5-1', name: '川湘菜窗口', floor: 1, specialty: ['麻辣香锅', '宫保鸡丁'], featureTags: ['signature', 'spicy'] },
      { id: 'stall5-2', name: '轻食沙拉', floor: 2, specialty: ['凯撒沙拉', '藜麦碗'], featureTags: ['healthy', 'new'] },
      { id: 'stall5-3', name: '韩餐窗口', floor: 2, specialty: ['石锅拌饭', '部队火锅'], featureTags: ['popular'] },
      { id: 'stall5-4', name: '网红饮品', floor: 2, specialty: ['芝士奶盖', '水果茶'], featureTags: ['new', 'drink'] }
    ]
  }
];

const MOCK_DISHES = [
  { id: 'd1', name: '红烧肉盖饭', cover: 'https://picsum.photos/seed/dish1/400/300', price: 12.0, originalPrice: 15.0, canteenId: 'c1', canteenName: '第一食堂', recommendReason: '肥而不腻，入口即化，今日主厨推荐', tags: ['signature', 'recommend'], mealType: 'lunch', sales: 328, rating: 4.7, isNew: false, isRecommend: true, description: '精选五花肉，慢炖2小时，酱汁浓郁配米饭', calories: 680 },
  { id: 'd2', name: '番茄牛腩面', cover: 'https://picsum.photos/seed/dish2/400/300', price: 14.5, originalPrice: null, canteenId: 'c2', canteenName: '第二食堂（清真）', recommendReason: '牛腩软烂入味，番茄汤底浓郁', tags: ['recommend'], mealType: 'lunch', sales: 256, rating: 4.6, isNew: false, isRecommend: true, description: '新鲜番茄慢炖牛腩，汤鲜面筋道', calories: 580 },
  { id: 'd3', name: '照烧鸡排饭', cover: 'https://picsum.photos/seed/dish3/400/300', price: 16.0, originalPrice: 18.0, canteenId: 'c3', canteenName: '美食广场', recommendReason: '外焦里嫩，照烧酱汁浓郁香甜', tags: ['signature', 'recommend'], mealType: 'dinner', sales: 412, rating: 4.8, isNew: false, isRecommend: true, description: '日式照烧酱汁腌制鸡排，外焦里嫩', calories: 620 },
  { id: 'd4', name: '麻辣香锅', cover: 'https://picsum.photos/seed/dish4/400/300', price: 18.0, originalPrice: null, canteenId: 'c5', canteenName: '北区食堂', recommendReason: '自选食材，麻辣鲜香，下饭神器', tags: ['spicy', 'recommend'], mealType: 'dinner', sales: 189, rating: 4.5, isNew: false, isRecommend: true, description: '20+种食材自选，麻辣鲜香', calories: 720 },
  { id: 'd5', name: '日式咖喱猪排饭', cover: 'https://picsum.photos/seed/dish5/400/300', price: 19.8, originalPrice: 22.0, canteenId: 'c3', canteenName: '美食广场', recommendReason: null, tags: ['new'], mealType: 'lunch', sales: 67, rating: 4.4, isNew: true, isRecommend: false, description: '酥脆猪排配浓郁日式咖喱', calories: 750 },
  { id: 'd6', name: '芝士焗意大利面', cover: 'https://picsum.photos/seed/dish6/400/300', price: 22.0, originalPrice: null, canteenId: 'c4', canteenName: '教工食堂', recommendReason: null, tags: ['new'], mealType: 'dinner', sales: 43, rating: 4.6, isNew: true, isRecommend: false, description: '马苏里拉芝士焗意面，拉丝香浓', calories: 680 },
  { id: 'd7', name: '泰式冬阴功汤粉', cover: 'https://picsum.photos/seed/dish7/400/300', price: 17.5, originalPrice: null, canteenId: 'c3', canteenName: '美食广场', recommendReason: null, tags: ['new', 'spicy'], mealType: 'lunch', sales: 52, rating: 4.3, isNew: true, isRecommend: false, description: '酸辣鲜香冬阴功汤底配越南米粉', calories: 420 },
  { id: 'd8', name: '手工豆沙包（3个）', cover: 'https://picsum.photos/seed/dish8/400/300', price: 6.0, originalPrice: null, canteenId: 'c1', canteenName: '第一食堂', recommendReason: null, tags: ['new'], mealType: 'breakfast', sales: 89, rating: 4.7, isNew: true, isRecommend: false, description: '手工制作红豆沙包，甜而不腻', calories: 360 },
  { id: 'd9', name: '宫保鸡丁', cover: 'https://picsum.photos/seed/dish9/400/300', price: 10.0, originalPrice: null, canteenId: 'c1', canteenName: '第一食堂', recommendReason: null, tags: ['spicy'], mealType: 'lunch', sales: 234, rating: 4.5, isNew: false, isRecommend: false, description: '经典川菜，酸甜微辣，鸡丁嫩滑', calories: 480 },
  { id: 'd10', name: '兰州拉面', cover: 'https://picsum.photos/seed/dish10/400/300', price: 11.0, originalPrice: null, canteenId: 'c2', canteenName: '第二食堂（清真）', recommendReason: null, tags: ['signature'], mealType: 'lunch', sales: 312, rating: 4.6, isNew: false, isRecommend: false, description: '一清二白三红四绿五黄，正宗兰州拉面', calories: 520 },
  { id: 'd11', name: '皮蛋瘦肉粥', cover: 'https://picsum.photos/seed/zhou/400/300', price: 5.0, originalPrice: null, canteenId: 'c1', canteenName: '第一食堂', recommendReason: '暖胃早餐首选，配油条一绝', tags: ['recommend'], mealType: 'breakfast', sales: 198, rating: 4.5, isNew: false, isRecommend: true, description: '传统粤式皮蛋瘦肉粥，鲜香暖胃', calories: 280 },
  { id: 'd12', name: '石锅拌饭', cover: 'https://picsum.photos/seed/bibimbap/400/300', price: 15.0, originalPrice: null, canteenId: 'c5', canteenName: '北区食堂', recommendReason: '锅巴香脆，配辣酱超好吃', tags: ['popular', 'recommend'], mealType: 'dinner', sales: 176, rating: 4.7, isNew: false, isRecommend: true, description: '时令蔬菜配辣酱，石锅烤出锅巴', calories: 580 },
  { id: 'd13', name: '肉包子', cover: 'https://picsum.photos/seed/baozi/400/300', price: 2.5, originalPrice: null, canteenId: 'c1', canteenName: '第一食堂', recommendReason: null, tags: ['signature'], mealType: 'breakfast', sales: 456, rating: 4.4, isNew: false, isRecommend: false, description: '猪肉大葱馅，皮薄馅大', calories: 220 },
  { id: 'd14', name: '豆浆油条', cover: 'https://picsum.photos/seed/doujiang/400/300', price: 4.0, originalPrice: null, canteenId: 'c1', canteenName: '第一食堂', recommendReason: null, tags: ['classic'], mealType: 'breakfast', sales: 521, rating: 4.6, isNew: false, isRecommend: false, description: '现磨豆浆配酥脆油条，经典中式早餐', calories: 350 },
  { id: 'd15', name: '煎饼果子', cover: 'https://picsum.photos/seed/jianbing/400/300', price: 6.0, originalPrice: null, canteenId: 'c3', canteenName: '美食广场', recommendReason: null, tags: ['recommend'], mealType: 'breakfast', sales: 234, rating: 4.8, isNew: false, isRecommend: false, description: '天津风味，薄脆酥脆，酱料十足', calories: 450 },
  { id: 'd16', name: '凯撒沙拉', cover: 'https://picsum.photos/seed/salad/400/300', price: 14.0, originalPrice: null, canteenId: 'c5', canteenName: '北区食堂', recommendReason: null, tags: ['healthy', 'new'], mealType: 'lunch', sales: 78, rating: 4.2, isNew: true, isRecommend: false, description: '新鲜生菜配鸡胸肉，低脂健康', calories: 280 },
  { id: 'd17', name: '部队火锅套餐', cover: 'https://picsum.photos/seed/budae/400/300', price: 28.0, originalPrice: null, canteenId: 'c5', canteenName: '北区食堂', recommendReason: null, tags: ['popular'], mealType: 'dinner', sales: 124, rating: 4.6, isNew: false, isRecommend: false, description: '火腿午餐肉年糕方便面，一锅端', calories: 780 }
];

const MOCK_FORUM_POSTS = [
  {
    type: 'qa',
    title: '考研数学二用什么资料比较好？',
    content: '各位学长学姐，考研数学二复习用什么资料比较好？目前看了张宇的基础30讲，感觉还行但想多参考一些，求推荐！',
    images: [],
    topics: ['postgraduate', 'exam'],
    isAnonymous: false,
    authorName: '学数学的鱼',
    authorAvatar: '',
    likes: 42,
    commentCount: 18,
    favorites: 15,
    views: 356,
    hotScore: 75,
    comments: [
      { id: 'c1', content: '推荐李永乐的复习全书，体系很清晰', authorName: '研一学姐', authorAvatar: '', isAnonymous: false, likes: 8, createTime: Date.now() - 7200000 },
      { id: 'c2', content: '汤家凤的1800题也很不错，题量够', authorName: '上岸选手', authorAvatar: '', isAnonymous: false, likes: 5, createTime: Date.now() - 3600000 }
    ]
  },
  {
    type: 'rant',
    title: '三食堂的菜越来越难吃了',
    content: '今天去三食堂打饭，红烧肉全是肥肉，青菜也不新鲜。之前还好好的，这学期换了厨师吗？大家有没有同感？',
    images: ['https://picsum.photos/seed/food1/400/300'],
    topics: ['canteen'],
    isAnonymous: true,
    authorName: '匿名用户',
    authorAvatar: '',
    likes: 89,
    commentCount: 34,
    favorites: 5,
    views: 723,
    hotScore: 156,
    comments: [
      { id: 'c3', content: '确实！上周的红烧排骨全是骨头', authorName: '干饭人', authorAvatar: '', isAnonymous: false, likes: 12, createTime: Date.now() - 5400000 }
    ]
  },
  {
    type: 'experience',
    title: '四级610分经验分享｜阅读满分攻略',
    content: '本人四级610分，阅读满分248.5。分享一下阅读的做题方法：1.先看题目再看文章，带着问题找答案 2.关键词定位法非常有效 3.平时多读外刊培养语感 4.考前一个月每天做2-3篇阅读保持手感。希望能帮到大家！',
    images: ['https://picsum.photos/seed/cet1/400/300', 'https://picsum.photos/seed/cet2/400/300'],
    topics: ['exam', 'postgraduate'],
    isAnonymous: false,
    authorName: '英语小达人',
    authorAvatar: '',
    likes: 156,
    commentCount: 45,
    favorites: 98,
    views: 1230,
    hotScore: 299,
    comments: [
      { id: 'c4', content: '太详细了！收藏了', authorName: '四级困难户', authorAvatar: '', isAnonymous: false, likes: 3, createTime: Date.now() - 7200000 },
      { id: 'c5', content: '请问外刊推荐看哪些？', authorName: '迷茫的鱼', authorAvatar: '', isAnonymous: false, likes: 2, createTime: Date.now() - 3600000 }
    ]
  },
  {
    type: 'lost_help',
    title: '在图书馆丢失一个黑色双肩包',
    content: '昨天下午在图书馆三楼自习室丢失一个黑色双肩包，内有笔记本电脑和课本。电脑桌面上有写着姓名的便利贴。如有捡到请联系我，万分感谢！',
    images: [],
    topics: [],
    isAnonymous: false,
    authorName: '焦急的人',
    authorAvatar: '',
    likes: 12,
    commentCount: 3,
    favorites: 8,
    views: 245,
    hotScore: 23,
    comments: [
      { id: 'c6', content: '你可以去图书馆失物招领处看看', authorName: '热心同学', authorAvatar: '', isAnonymous: false, likes: 1, createTime: Date.now() - 1800000 }
    ]
  },
  {
    type: 'trade',
    title: '出iPad Air 5 64G WiFi版',
    content: '毕业出iPad Air 5，64G WiFi版，2024年9月购入，有Apple Care+到2026年9月。屏幕贴膜无划痕，一直戴套使用。配原装妙控键盘和Apple Pencil二代。整套4500出，单出iPad 3000。可面交验货。',
    images: ['https://picsum.photos/seed/ipad1/400/300', 'https://picsum.photos/seed/ipad2/400/300'],
    topics: [],
    isAnonymous: false,
    authorName: '毕业老学长',
    authorAvatar: '',
    likes: 23,
    commentCount: 8,
    favorites: 34,
    views: 567,
    hotScore: 65,
    comments: [
      { id: 'c7', content: '单出Pencil吗？', authorName: '画画的人', authorAvatar: '', isAnonymous: false, likes: 0, createTime: Date.now() - 900000 }
    ]
  },
  {
    type: 'qa',
    title: '选课系统一直卡怎么办？',
    content: '选课系统一直转圈进不去，大家有什么办法吗？我想要的课都快被抢完了！',
    images: [],
    topics: ['course_selection'],
    isAnonymous: true,
    authorName: '匿名用户',
    authorAvatar: '',
    likes: 67,
    commentCount: 22,
    favorites: 12,
    views: 890,
    hotScore: 101,
    comments: [
      { id: 'c8', content: '用电脑端试试，手机端比较卡', authorName: '选课达人', authorAvatar: '', isAnonymous: false, likes: 5, createTime: Date.now() - 2400000 },
      { id: 'c9', content: '凌晨1点再试，人少', authorName: '夜猫子', authorAvatar: '', isAnonymous: false, likes: 9, createTime: Date.now() - 1800000 }
    ]
  },
  {
    type: 'experience',
    title: '求职面经分享｜字节跳动产品经理校招',
    content: '分享一下字节产品经理校招的全流程：1.笔试-行测+产品分析题 2.群面-6人小组讨论产品设计 3.专业一面-产品sense考察 4.专业二面-项目深挖 5.HR面。重点是要有自己的产品思考框架，建议大家多关注行业动态。',
    images: [],
    topics: ['job'],
    isAnonymous: false,
    authorName: '产品小白',
    authorAvatar: '',
    likes: 198,
    commentCount: 56,
    favorites: 145,
    views: 2340,
    hotScore: 399,
    comments: [
      { id: 'c10', content: '请问群面有什么技巧吗？', authorName: '即将秋招', authorAvatar: '', isAnonymous: false, likes: 4, createTime: Date.now() - 3600000 }
    ]
  },
  {
    type: 'rant',
    title: '宿舍热水器又坏了，三天没洗热水澡',
    content: '南三宿舍热水器又坏了，已经三天了！报修也没人来修，这日子没法过了。冬天洗冷水澡真的要命！有没有同样遭遇的兄弟姐妹？',
    images: [],
    topics: ['dorm'],
    isAnonymous: true,
    authorName: '匿名用户',
    authorAvatar: '',
    likes: 134,
    commentCount: 41,
    favorites: 3,
    views: 956,
    hotScore: 178,
    comments: [
      { id: 'c11', content: '南四也是！报修三天了没反应', authorName: '同命相连', authorAvatar: '', isAnonymous: true, likes: 15, createTime: Date.now() - 7200000 },
      { id: 'c12', content: '可以打后勤投诉电话催一下', authorName: '过来人', authorAvatar: '', isAnonymous: false, likes: 8, createTime: Date.now() - 5400000 }
    ]
  },
  {
    type: 'experience',
    title: '社团纳新避坑指南！这些社团千万别加',
    content: '大一新生看过来！作为过来人分享一些选社团的经验：1.别加太多，1-2个就够 2.先了解社团活动频率，太频繁会占学习时间 3.某些社团只是挂名，实际没活动 4.面试型社团要看清要求 5.兴趣类社团优先于功利性社团。欢迎大家补充！',
    images: [],
    topics: ['club'],
    isAnonymous: false,
    authorName: '大三老油条',
    authorAvatar: '',
    likes: 223,
    commentCount: 67,
    favorites: 112,
    views: 1890,
    hotScore: 402,
    comments: [
      { id: 'c13', content: '说得太对了！我大一加了4个社团忙到飞起', authorName: '过来人二号', authorAvatar: '', isAnonymous: false, likes: 11, createTime: Date.now() - 4800000 }
    ]
  },
  {
    type: 'qa',
    title: '学校附近哪家健身房性价比最高？',
    content: '想在学校附近办健身卡，求推荐性价比高的健身房。主要想练力量和跑步，最好有游泳池。预算200/月以内。',
    images: [],
    topics: ['sports'],
    isAnonymous: false,
    authorName: '想变壮',
    authorAvatar: '',
    likes: 31,
    commentCount: 14,
    favorites: 9,
    views: 423,
    hotScore: 54,
    comments: [
      { id: 'c14', content: '推荐乐刻，月卡150，器械齐全', authorName: '健身老哥', authorAvatar: '', isAnonymous: false, likes: 3, createTime: Date.now() - 3000000 }
    ]
  },
  {
    type: 'experience',
    title: '周末出游推荐｜学校2小时内的5个宝藏景点',
    content: '给大家推荐几个适合周末去的景点：1.青城山-爬山吸氧好去处 2.都江堰-水利奇观 3.黄龙溪古镇-美食天堂 4.西岭雪山-冬天滑雪 5.三圣花乡-春天赏花。交通都很方便，高铁或大巴都能到。',
    images: ['https://picsum.photos/seed/travel1/400/300', 'https://picsum.photos/seed/travel2/400/300', 'https://picsum.photos/seed/travel3/400/300'],
    topics: ['travel'],
    isAnonymous: false,
    authorName: '旅行青蛙',
    authorAvatar: '',
    likes: 178,
    commentCount: 38,
    favorites: 203,
    views: 1567,
    hotScore: 319,
    comments: []
  },
  {
    type: 'rant',
    title: '打游戏被室友嫌弃怎么办？',
    content: '我晚上十点后打游戏，声音已经开得很小了，但室友还是嫌吵。可是隔壁宿舍打游戏开外放都没人说啊，是我的问题吗？求大家支招。',
    images: [],
    topics: ['game', 'dorm'],
    isAnonymous: true,
    authorName: '匿名用户',
    authorAvatar: '',
    likes: 56,
    commentCount: 29,
    favorites: 2,
    views: 678,
    hotScore: 87,
    comments: [
      { id: 'c15', content: '买个好耳机吧，十点后确实该安静了', authorName: '和事佬', authorAvatar: '', isAnonymous: false, likes: 18, createTime: Date.now() - 6000000 },
      { id: 'c16', content: '换个机械键盘静音红轴试试', authorName: '外设党', authorAvatar: '', isAnonymous: false, likes: 7, createTime: Date.now() - 4200000 }
    ]
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
  MOCK_STUDY_MATERIALS,
  MOCK_STUDY_REWARDS,
  MOCK_CAMPUS_SHOPS,
  MOCK_SHOP_REVIEWS,
  NOTIFICATION_TEMPLATES,
  MOCK_VOLUNTEER_ACTIVITIES,
  MOCK_VOLUNTEER_HOURS_RECORDS,
  MOCK_ERRAND_ORDERS,
  MOCK_ERRAND_ADDRESSES,
  MOCK_RENTAL_HOUSES,
  MOCK_CARPOOLS,
  WEATHER_DATA,
  EMERGENCY_PHONES,
  PHONEBOOK_CATEGORIES,
  SERVICE_GUIDES,
  SERVICE_GUIDE_DETAILS,
  MOCK_CANTEENS,
  MOCK_DISHES,
  CROWD_LEVELS,
  TODAY_RECOMMENDS,
  NEW_DISHES,
  CANTEEN_DISH_MAP,
  MOCK_CANTEEN_REVIEWS,
  MOCK_DISH_REVIEWS,
  MOCK_FORUM_POSTS
};

const MOCK_CLUBS = [
  {
    id: 'club_001',
    name: '计算机协会',
    type: 'academic',
    slogan: '探索科技，创新未来',
    description: '计算机协会致力于推广计算机技术，定期举办技术讲座、编程比赛、黑客马拉松等活动，为同学们提供技术交流和实践的平台。我们欢迎所有对计算机技术感兴趣的同学加入！',
    logo: 'https://picsum.photos/seed/club1/200/200',
    cover: 'https://picsum.photos/seed/club1cover/800/400',
    memberCount: 328,
    activityCount: 56,
    presidentName: '李明',
    presidentAvatar: '',
    contactPhone: '13800138010',
    contactWechat: 'cs_club_2026',
    location: '信息楼305室',
    foundedDate: '2010-09-01',
    tags: ['编程', 'AI', '算法', '开源']
  },
  {
    id: 'club_002',
    name: '篮球俱乐部',
    type: 'sports',
    slogan: '无兄弟，不篮球',
    description: '篮球俱乐部是我校最受欢迎的体育社团之一，每周组织训练赛，每月举办校内联赛，每年春季承办校级篮球邀请赛。无论你是大神还是新手，这里都有你的位置！',
    logo: 'https://picsum.photos/seed/club2/200/200',
    cover: 'https://picsum.photos/seed/club2cover/800/400',
    memberCount: 186,
    activityCount: 92,
    presidentName: '王强',
    presidentAvatar: '',
    contactPhone: '13800138011',
    contactWechat: 'basketball_xd',
    location: '体育馆201室',
    foundedDate: '2008-05-15',
    tags: ['篮球', '运动', '比赛', '健身']
  },
  {
    id: 'club_003',
    name: '话剧社',
    type: 'arts',
    slogan: '演绎青春，绽放光彩',
    description: '话剧社是一个充满艺术气息的社团，我们每年排演2-3部大戏，从经典话剧到原创剧本应有尽有。社团定期举办表演培训、剧本朗读会、话剧观赏等活动。',
    logo: 'https://picsum.photos/seed/club3/200/200',
    cover: 'https://picsum.photos/seed/club3cover/800/400',
    memberCount: 152,
    activityCount: 38,
    presidentName: '张雨薇',
    presidentAvatar: '',
    contactPhone: '13800138012',
    contactWechat: 'drama_club',
    location: '大学生活动中心4楼',
    foundedDate: '2012-03-20',
    tags: ['话剧', '表演', '导演', '编剧']
  },
  {
    id: 'club_004',
    name: '志愿者协会',
    type: 'social',
    slogan: '奉献友爱，互助进步',
    description: '志愿者协会常年组织各类公益志愿活动，包括敬老院探访、留守儿童支教、环保宣传、大型赛事志愿服务等。加入我们，用行动温暖世界！',
    logo: 'https://picsum.photos/seed/club4/200/200',
    cover: 'https://picsum.photos/seed/club4cover/800/400',
    memberCount: 520,
    activityCount: 128,
    presidentName: '刘思琪',
    presidentAvatar: '',
    contactPhone: '13800138013',
    contactWechat: 'volunteer_love',
    location: '行政楼B201',
    foundedDate: '2006-09-01',
    tags: ['志愿', '公益', '环保', '支教']
  },
  {
    id: 'club_005',
    name: '文学社',
    type: 'literary',
    slogan: '以文会友，以笔抒情',
    description: '文学社汇聚了校园内所有热爱文学创作的同学，我们出版校园文学刊物《青衿》，举办读书分享会、写作工坊、诗歌朗诵会等活动。',
    logo: 'https://picsum.photos/seed/club5/200/200',
    cover: 'https://picsum.photos/seed/club5cover/800/400',
    memberCount: 98,
    activityCount: 42,
    presidentName: '陈雅文',
    presidentAvatar: '',
    contactPhone: '13800138014',
    contactWechat: 'literature_club',
    location: '图书馆3楼会议室',
    foundedDate: '2015-04-10',
    tags: ['文学', '写作', '阅读', '诗歌']
  },
  {
    id: 'club_006',
    name: '舞蹈协会',
    type: 'arts',
    slogan: '舞动青春，释放活力',
    description: '舞蹈协会涵盖街舞、民族舞、现代舞、拉丁舞等多种舞种，每周开设免费课程，每年举办专场晚会。零基础也可以加入哦！',
    logo: 'https://picsum.photos/seed/club6/200/200',
    cover: 'https://picsum.photos/seed/club6cover/800/400',
    memberCount: 245,
    activityCount: 78,
    presidentName: '林小舞',
    presidentAvatar: '',
    contactPhone: '13800138015',
    contactWechat: 'dance_union',
    location: '大学生活动中心3楼舞蹈室',
    foundedDate: '2011-10-01',
    tags: ['舞蹈', '街舞', '爵士', '表演']
  }
];

const MOCK_CLUB_MEMBERS = {
  club_001: [
    { id: 'm1', userId: 'user_001', name: '李明', role: 'president', avatar: '', joinTime: Date.now() - 720 * 86400000 },
    { id: 'm2', userId: 'user_002', name: '张华', role: 'vice_president', avatar: '', joinTime: Date.now() - 600 * 86400000 },
    { id: 'm3', userId: 'user_003', name: '王磊', role: 'officer', avatar: '', joinTime: Date.now() - 480 * 86400000 },
    { id: 'm4', userId: 'user_004', name: '赵雪', role: 'member', avatar: '', joinTime: Date.now() - 360 * 86400000 },
    { id: 'm5', userId: 'user_005', name: '孙浩', role: 'member', avatar: '', joinTime: Date.now() - 240 * 86400000 },
    { id: 'm6', userId: 'user_006', name: '周婷', role: 'member', avatar: '', joinTime: Date.now() - 180 * 86400000 },
    { id: 'm7', userId: 'user_007', name: '吴刚', role: 'member', avatar: '', joinTime: Date.now() - 120 * 86400000 },
    { id: 'm8', userId: 'user_008', name: '郑悦', role: 'member', avatar: '', joinTime: Date.now() - 60 * 86400000 }
  ],
  club_002: [
    { id: 'm9', userId: 'user_009', name: '王强', role: 'president', avatar: '', joinTime: Date.now() - 700 * 86400000 },
    { id: 'm10', userId: 'user_010', name: '马超', role: 'vice_president', avatar: '', joinTime: Date.now() - 500 * 86400000 },
    { id: 'm11', userId: 'user_011', name: '朱杰', role: 'member', avatar: '', joinTime: Date.now() - 300 * 86400000 },
    { id: 'm12', userId: 'user_012', name: '徐健', role: 'member', avatar: '', joinTime: Date.now() - 200 * 86400000 }
  ],
  club_003: [
    { id: 'm13', userId: 'user_013', name: '张雨薇', role: 'president', avatar: '', joinTime: Date.now() - 650 * 86400000 },
    { id: 'm14', userId: 'user_014', name: '何娜', role: 'officer', avatar: '', joinTime: Date.now() - 400 * 86400000 },
    { id: 'm15', userId: 'user_015', name: '宋佳', role: 'member', avatar: '', joinTime: Date.now() - 250 * 86400000 }
  ]
};

function createDateString(daysOffset, hour = 14, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, minute, 0, 0);
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const h = d.getHours().toString().padStart(2, '0');
  const min = d.getMinutes().toString().padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${min}`;
}

const MOCK_CLUB_ACTIVITIES = [
  {
    id: 'act_001',
    clubId: 'club_001',
    clubName: '计算机协会',
    title: 'AI大模型技术分享会',
    category: 'academic',
    cover: 'https://picsum.photos/seed/act1/800/450',
    description: '本次分享会邀请了业界资深算法工程师，深入探讨GPT系列大模型的技术原理、Fine-tuning实战、以及大模型在校园场景中的创新应用。现场将有Demo展示和问答互动环节。\n\n议程安排：\n14:00-14:10 开场致辞\n14:10-15:00 大模型技术原理与演进\n15:00-15:50 微调实战与部署\n15:50-16:10 茶歇交流\n16:10-17:00 圆桌讨论与Q&A',
    activityTime: createDateString(3, 14, 0),
    endTime: createDateString(3, 17, 0),
    location: '信息楼报告厅',
    capacity: 200,
    deadline: createDateString(2, 18, 0),
    fee: 0,
    tags: ['AI', '技术', '讲座'],
    images: ['https://picsum.photos/seed/act1_1/800/600', 'https://picsum.photos/seed/act1_2/800/600'],
    organizerName: '李明',
    organizerPhone: '13800138010',
    checkInCode: 'CLUB-ACT-001-QR'
  },
  {
    id: 'act_002',
    clubId: 'club_002',
    clubName: '篮球俱乐部',
    title: '春季3V3篮球联赛',
    category: 'sports',
    cover: 'https://picsum.photos/seed/act2/800/450',
    description: '一年一度的春季3V3篮球赛火热开赛！面向全校同学开放报名，设有本科生组、研究生组，冠军队伍将获得奖杯和丰厚奖品。\n\n比赛规则：\n• 每场比赛10分钟不停表\n• 三分线内算1分，三分线外算2分\n• 先到15分或时间结束时得分高者获胜\n• 详细赛程见后续通知',
    activityTime: createDateString(5, 9, 0),
    endTime: createDateString(6, 18, 0),
    location: '校篮球场（西区）',
    capacity: 128,
    deadline: createDateString(3, 20, 0),
    fee: 50,
    tags: ['篮球', '比赛', '3V3'],
    images: ['https://picsum.photos/seed/act2_1/800/600'],
    organizerName: '王强',
    organizerPhone: '13800138011',
    checkInCode: 'CLUB-ACT-002-QR'
  },
  {
    id: 'act_003',
    clubId: 'club_003',
    clubName: '话剧社',
    title: '年度大戏《暗恋桃花源》公演',
    category: 'arts',
    cover: 'https://picsum.photos/seed/act3/800/450',
    description: '话剧社年度巨献！经典话剧《暗恋桃花源》，历时3个月精心排演。两个看似不相关的剧组，因为剧场预约冲突被迫同台排演，上演了一出悲喜交加的好戏。\n\n演出时长：约150分钟（含15分钟中场休息）\n注意事项：\n• 请提前30分钟到场入座\n• 演出期间请关闭手机铃声\n• 禁止拍摄和录音',
    activityTime: createDateString(8, 19, 0),
    endTime: createDateString(8, 21, 30),
    location: '学校大礼堂',
    capacity: 800,
    deadline: createDateString(7, 23, 59),
    fee: 0,
    tags: ['话剧', '演出', '艺术'],
    images: ['https://picsum.photos/seed/act3_1/800/600', 'https://picsum.photos/seed/act3_2/800/600', 'https://picsum.photos/seed/act3_3/800/600'],
    organizerName: '张雨薇',
    organizerPhone: '13800138012',
    checkInCode: 'CLUB-ACT-003-QR'
  },
  {
    id: 'act_004',
    clubId: 'club_004',
    clubName: '志愿者协会',
    title: '关爱留守儿童周末支教活动',
    category: 'charity',
    cover: 'https://picsum.photos/seed/act4/800/450',
    description: '前往周边希望小学，为留守儿童带去有趣的课程和温暖的陪伴。本次支教内容包括：趣味英语、美术手工、音乐律动、课外阅读辅导。\n\n集合时间：周六早上7:30\n集合地点：学校北门\n交通：大巴统一接送\n午餐：提供简单午餐\n需要准备：可带文具、书籍等礼物（可选）',
    activityTime: createDateString(4, 8, 0),
    endTime: createDateString(4, 16, 0),
    location: '阳光希望小学',
    capacity: 30,
    deadline: createDateString(2, 18, 0),
    fee: 0,
    tags: ['支教', '公益', '志愿'],
    images: ['https://picsum.photos/seed/act4_1/800/600'],
    organizerName: '刘思琪',
    organizerPhone: '13800138013',
    checkInCode: 'CLUB-ACT-004-QR'
  },
  {
    id: 'act_005',
    clubId: 'club_001',
    clubName: '计算机协会',
    title: '24小时黑客马拉松',
    category: 'competition',
    cover: 'https://picsum.photos/seed/act5/800/450',
    description: '挑战极限，24小时创造奇迹！黑客马拉松是一场集创意、技术、合作为一体的编程挑战赛。参赛者需在24小时内完成一个从想法到原型的产品开发。\n\n奖项设置：\n🏆 一等奖（1支）：3000元奖金+实习机会\n🥈 二等奖（2支）：1500元奖金\n🥉 三等奖（3支）：800元奖金\n⭐ 最佳创意奖：500元奖金\n\n报名要求：2-4人组队，跨专业组队优先',
    activityTime: createDateString(12, 9, 0),
    endTime: createDateString(13, 9, 0),
    location: '大学生活动中心创客空间',
    capacity: 100,
    deadline: createDateString(9, 23, 59),
    fee: 0,
    tags: ['编程', '比赛', '黑客松'],
    images: ['https://picsum.photos/seed/act5_1/800/600', 'https://picsum.photos/seed/act5_2/800/600'],
    organizerName: '李明',
    organizerPhone: '13800138010',
    checkInCode: 'CLUB-ACT-005-QR'
  },
  {
    id: 'act_006',
    clubId: 'club_005',
    clubName: '文学社',
    title: '春日诗会暨诗歌创作大赛颁奖',
    category: 'arts',
    cover: 'https://picsum.photos/seed/act6/800/450',
    description: '春风送暖，诗兴盎然。文学社诚邀各位诗歌爱好者，在最美的季节相遇，以诗会友。\n\n活动流程：\n1. 诗歌朗诵环节（自由报名）\n2. 春日诗歌创作大赛颁奖\n3. 嘉宾分享：诗歌创作的灵感来源\n4. 自由交流\n\n本次活动提供精美茶点，欢迎携带自己创作的诗歌作品前来交流。',
    activityTime: createDateString(6, 14, 30),
    endTime: createDateString(6, 17, 0),
    location: '湖畔咖啡厅',
    capacity: 50,
    deadline: createDateString(5, 18, 0),
    fee: 20,
    tags: ['诗歌', '文学', '分享'],
    images: ['https://picsum.photos/seed/act6_1/800/600'],
    organizerName: '陈雅文',
    organizerPhone: '13800138014',
    checkInCode: 'CLUB-ACT-006-QR'
  },
  {
    id: 'act_007',
    clubId: 'club_006',
    clubName: '舞蹈协会',
    title: '校园舞蹈大赛',
    category: 'competition',
    cover: 'https://picsum.photos/seed/act7/800/450',
    description: '一年一度的校园舞蹈盛宴！无论你擅长街舞、民族舞、现代舞还是拉丁舞，都可以在这个舞台展现自己。\n\n比赛组别：\n• 单人组（男/女）\n• 团体组（3人以上）\n\n评分标准：\n- 技术技巧 40%\n- 艺术表现 30%\n- 创意编排 20%\n- 舞台形象 10%\n\n所有参赛者均可获得精美纪念礼品！',
    activityTime: createDateString(15, 18, 0),
    endTime: createDateString(15, 22, 0),
    location: '学校大礼堂',
    capacity: 100,
    deadline: createDateString(10, 18, 0),
    fee: 30,
    tags: ['舞蹈', '比赛', '舞台'],
    images: ['https://picsum.photos/seed/act7_1/800/600', 'https://picsum.photos/seed/act7_2/800/600'],
    organizerName: '林小舞',
    organizerPhone: '13800138015',
    checkInCode: 'CLUB-ACT-007-QR'
  },
  {
    id: 'act_008',
    clubId: 'club_002',
    clubName: '篮球俱乐部',
    title: '篮球技巧训练营（零基础班）',
    category: 'training',
    cover: 'https://picsum.photos/seed/act8/800/450',
    description: '想打篮球但不会？零基础训练营火热开启！\n\n培训内容：\n• 运球基础（高低运球、变向、胯下）\n• 投篮姿势与发力技巧\n• 传球方式与视野训练\n• 简单攻防战术入门\n• 身体素质提升\n\n教练团队由校篮球队主力队员组成，每班限20人，名额有限先到先得！',
    activityTime: createDateString(-1, 16, 0),
    endTime: createDateString(-1, 18, 0),
    location: '室内篮球训练馆',
    capacity: 20,
    deadline: createDateString(-2, 20, 0),
    fee: 0,
    tags: ['篮球', '培训', '零基础'],
    images: ['https://picsum.photos/seed/act8_1/800/600'],
    organizerName: '王强',
    organizerPhone: '13800138011',
    checkInCode: 'CLUB-ACT-008-QR'
  },
  {
    id: 'act_009',
    clubId: 'club_004',
    clubName: '志愿者协会',
    title: '校园环保周·共享单车整理',
    category: 'charity',
    cover: 'https://picsum.photos/seed/act9/800/450',
    description: '共享单车乱停乱放影响校园美观？一起来动手，让校园更整洁！\n\n活动内容：\n1. 南门、北门共享单车集中整理\n2. 违规停放单车搬运\n3. 环保宣传单向师生派发\n4. 活动总结合影\n\n提供志愿服装、手套、饮用水，可记录志愿时长。',
    activityTime: createDateString(-5, 14, 0),
    endTime: createDateString(-5, 17, 0),
    location: '学校南门集合',
    capacity: 50,
    deadline: createDateString(-6, 20, 0),
    fee: 0,
    tags: ['环保', '志愿', '公益'],
    images: ['https://picsum.photos/seed/act9_1/800/600'],
    organizerName: '刘思琪',
    organizerPhone: '13800138013',
    checkInCode: 'CLUB-ACT-009-QR'
  }
];

if (module.exports) {
  module.exports.MOCK_CLUBS = MOCK_CLUBS;
  module.exports.MOCK_CLUB_MEMBERS = MOCK_CLUB_MEMBERS;
  module.exports.MOCK_CLUB_ACTIVITIES = MOCK_CLUB_ACTIVITIES;
}
