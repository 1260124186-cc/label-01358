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
  SERVICE_GUIDE_DETAILS
};
