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
  SERVICE_GUIDES,
  SERVICE_GUIDE_DETAILS
};
