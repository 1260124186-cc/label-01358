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
    content: '近日，第十二届全国大学生创新创业大赛总决赛在上海落下帷幕。我校参赛团队凭借"智慧校园生活服务平台"项目从全国3000多支队伍中脱颖而出，荣获金奖。\n\n该项目由计算机学院、经济管理学院和艺术设计学院的5名同学共同完成，指导老师为张教授。项目整合了校园内的各类服务资源，包括失物招领、二手交易、校园风光、学习资料等功能模块，为师生提供一站式的校园生活服务。\n\n评审专家表示，该项目创新性强，实用价值高，充分体现了当代大学生的创新精神和实践能力。团队负责人表示，将继续完善平台功能，争取早日正式上线服务全校师生。',
    category: 'competition',
    images: [
      'https://picsum.photos/seed/news1-1/800/600',
      'https://picsum.photos/seed/news1-2/800/600',
      'https://picsum.photos/seed/news1-3/800/600'
    ],
    image: 'https://picsum.photos/seed/news1/400/300',
    views: 1256,
    createTime: Date.now() - 3600000
  },
  {
    id: '2',
    title: '校园樱花季即将到来，赏花攻略请收好',
    summary: '随着气温回暖，校园内的樱花即将进入盛花期。预计本周末将迎来最佳观赏期，届时学校将开放主要赏花区域。',
    content: '春风拂面，万物复苏。随着气温的逐渐回升，校园内的樱花树已经开始含苞待放。根据气象部门预测，本周末将迎来樱花的最佳观赏期。\n\n今年的樱花主要分布在樱花大道、图书馆东侧、湖心亭周边等区域。为了方便同学们赏花，学校将在樱花大道设置临时休息区和拍照打卡点。\n\n温馨提示：\n1. 最佳观赏时间：3月15日-3月25日，每天7:00-18:00\n2. 请文明赏花，不要攀折树枝、踩踏草坪\n3. 周末人流量较大，建议错峰出行\n4. 拍照时请注意安全，不要进入车道\n\n届时，学生会还将组织"樱花节"主题活动，包括摄影比赛、诗歌朗诵、手绘樱花等，欢迎同学们积极参与。',
    category: 'activity',
    images: [
      'https://picsum.photos/seed/news2-1/800/600',
      'https://picsum.photos/seed/news2-2/800/600'
    ],
    image: 'https://picsum.photos/seed/news2/400/300',
    views: 2348,
    createTime: Date.now() - 7200000
  },
  {
    id: '3',
    title: '新学期选课系统开放通知',
    summary: '2026年春季学期选课系统将于2月10日8:00开放，请同学们提前做好选课准备，合理规划课程安排。',
    content: '各位同学：\n\n2026年春季学期选课工作即将开始，现将有关事项通知如下：\n\n一、选课时间安排\n1. 预选阶段：2月10日8:00 - 2月12日24:00\n2. 正选阶段：2月15日8:00 - 2月17日24:00\n3. 补退选阶段：2月22日8:00 - 2月24日24:00\n\n二、注意事项\n1. 请提前登录教务系统查看个人培养计划，了解本学期应修课程\n2. 选课期间系统访问量较大，建议错峰操作\n3. 选课成功后请及时核对课表，避免漏选或错选\n4. 如有疑问，请联系所在学院教学秘书或教务处\n\n三、温馨提示\n1. 公共选修课名额有限，建议提前做好备选方案\n2. 体育课选课需考虑自身身体条件，量力而行\n3. 跨专业选课请提前咨询开课学院\n\n祝同学们选课顺利！',
    category: 'notice',
    images: [
      'https://picsum.photos/seed/news3-1/800/600'
    ],
    image: 'https://picsum.photos/seed/news3/400/300',
    views: 3567,
    createTime: Date.now() - 10800000
  },
  {
    id: '4',
    title: '校园招聘会将于下周举行',
    summary: '2026年春季校园招聘会将于2月20日在体育馆举行，届时将有超过200家企业参会，欢迎应届毕业生参加。',
    content: '为搭建毕业生与用人单位的双向选择平台，促进毕业生充分就业，学校定于2026年2月20日举办春季校园招聘会。\n\n一、招聘会信息\n时间：2026年2月20日（周四）9:00-16:00\n地点：学校体育馆\n参会企业：200+家，涵盖IT、金融、制造、教育、医疗等多个行业\n提供岗位：5000+个\n\n二、参会企业名录（部分）\n- 互联网科技类：字节跳动、阿里巴巴、腾讯、华为、小米\n- 金融类：中国银行、招商银行、中信证券、平安保险\n- 制造业：比亚迪、宁德时代、格力电器、美的集团\n- 教育类：新东方、学而思、中公教育、各类公办学校\n- 其他：各省市选调生、事业单位、国有企业\n\n三、注意事项\n1. 请携带个人简历（建议多打印几份）\n2. 着装得体，建议穿着正装\n3. 提前了解意向企业信息，准备好自我介绍\n4. 现场人流较大，注意保管好个人物品\n5. 可提前在就业指导中心网站预约企业面试\n\n四、配套服务\n1. 现场设有简历诊断处，邀请专业HR提供简历修改建议\n2. 设有面试指导区，提供模拟面试服务\n3. 设有政策咨询区，解答就业政策、落户等问题\n\n欢迎广大应届毕业生积极参与！',
    category: 'job',
    images: [
      'https://picsum.photos/seed/news4-1/800/600',
      'https://picsum.photos/seed/news4-2/800/600'
    ],
    image: 'https://picsum.photos/seed/news4/400/300',
    views: 4123,
    createTime: Date.now() - 14400000
  },
  {
    id: '5',
    title: '图书馆推出"深夜书房"服务，助力期末复习',
    summary: '为满足同学们期末复习的需求，图书馆自即日起推出"深夜书房"服务，开放时间延长至23:00。',
    content: '期末考试临近，为满足同学们的复习需求，图书馆自即日起推出"深夜书房"暖心服务。\n\n一、服务内容\n1. 延长开放时间：图书馆一、二、三层自习区开放时间延长至23:00\n2. 深夜补给：21:00-22:00在大厅提供免费热水、咖啡和小点心\n3. 学习支持：安排值班馆员和志愿者提供参考咨询服务\n4. 减压专区：在二层休闲区设置减压角，提供解压玩具、轻音乐等\n\n二、服务时间\n即日起至学期结束（1月20日）\n每天7:00-23:00\n\n三、温馨提示\n1. 请保持自习区安静，共同维护良好的学习环境\n2. 离开时请整理好个人物品，不要占座\n3. 注意劳逸结合，合理安排作息时间\n4. 深夜回宿舍请注意安全，建议结伴而行\n\n图书馆全体工作人员祝同学们复习顺利，考试取得好成绩！',
    category: 'notice',
    images: [
      'https://picsum.photos/seed/news5-1/800/600',
      'https://picsum.photos/seed/news5-2/800/600',
      'https://picsum.photos/seed/news5-3/800/600'
    ],
    image: 'https://picsum.photos/seed/news5/400/300',
    views: 2890,
    createTime: Date.now() - 18000000
  },
  {
    id: '6',
    title: '校足球队晋级全国大学生足球联赛决赛',
    summary: '在刚刚结束的半决赛中，我校足球队以2:1战胜对手，成功晋级全国大学生足球联赛决赛。',
    content: '捷报传来！在刚刚结束的2026年全国大学生足球联赛半决赛中，我校足球队以2:1的比分力克强敌，成功晋级决赛！\n\n本场比赛在主场进行，吸引了超过5000名球迷现场观战。上半场双方战成0:0平，易边再战，我校队员发挥出色，前锋李同学在第65分钟头球破门，随后中场王同学在第78分钟远射再下一城。对手在补时阶段扳回一球，但已无力回天。\n\n校足球队自联赛开赛以来，一路过关斩将，展现了顽强的拼搏精神和高超的技战术水平。决赛将于下周六在上海举行，对手是卫冕冠军北大队。\n\n学校将组织球迷团前往客场助威，有意前往的同学可在学生会体育部报名。让我们一起为校队加油！',
    category: 'competition',
    images: [
      'https://picsum.photos/seed/news6-1/800/600',
      'https://picsum.photos/seed/news6-2/800/600'
    ],
    image: 'https://picsum.photos/seed/news6/400/300',
    views: 5678,
    createTime: Date.now() - 21600000
  },
  {
    id: '7',
    title: '知名校友回校分享创业经验',
    summary: '我校2010届校友、某知名科技公司创始人张总将于本周五回校，与同学们分享创业经验。',
    content: '创新创业论坛第50期特邀嘉宾\n\n主题：从校园到职场，我的创业十年\n\n主讲人：张总\n- 我校2010届计算机学院校友\n- 某知名科技公司创始人兼CEO\n- 公司估值超过50亿，员工超过1000人\n- 获评"2025年度中国经济十大创新人物"\n\n时间：2026年3月15日（周五）19:00-21:00\n地点：学术报告厅\n\n分享内容：\n1. 大学生活与职业规划\n2. 创业路上的机遇与挑战\n3. 如何在AI时代把握机会\n4. 互动问答\n\n本次活动面向全校师生开放，无需报名，现场座位有限，请提前入场。活动后将有抽奖环节，奖品包括Kindle阅读器、机械键盘等。\n\n主办方：创新创业学院、校团委、计算机学院\n\n欢迎同学们踊跃参加！',
    category: 'lecture',
    images: [
      'https://picsum.photos/seed/news7-1/800/600'
    ],
    image: 'https://picsum.photos/seed/news7/400/300',
    views: 1890,
    createTime: Date.now() - 25200000
  },
  {
    id: '8',
    title: '校园一卡通新增电子支付功能',
    summary: '校园一卡通系统升级完成，现已支持微信、支付宝充值，消费记录可实时查询。',
    content: '为提升校园服务质量，方便同学们的校园生活，校园一卡通系统近日完成升级改造，新增多项便民功能。\n\n一、新增功能\n1. 多渠道充值：支持微信、支付宝、银行卡在线充值\n2. 实时查询：通过校园APP可实时查询消费记录、余额变动\n3. 消费提醒：设置日消费限额，超额时推送提醒通知\n4. 亲情付：支持家长代为充值，实时了解孩子消费情况\n5. 电子卡券：支持优惠券、活动补贴的发放和核销\n\n二、使用方法\n1. 打开校园生活APP，进入"一卡通"模块\n2. 绑定本人校园卡（已绑定的无需重复操作）\n3. 选择相应功能即可使用\n\n三、注意事项\n1. 原有的实体卡片刷卡消费功能不受影响\n2. 充值金额实时到账，如有延迟请联系一卡通中心\n3. 如遇系统故障，请拨打服务热线：400-123-4567\n\n一卡通服务中心地址：行政楼102室\n服务时间：工作日8:00-17:30\n\n此次升级是学校"智慧校园"建设的重要组成部分，后续还将推出更多便捷功能，敬请期待！',
    category: 'notice',
    images: [
      'https://picsum.photos/seed/news8-1/800/600',
      'https://picsum.photos/seed/news8-2/800/600'
    ],
    image: 'https://picsum.photos/seed/news8/400/300',
    views: 3456,
    createTime: Date.now() - 28800000
  },
  {
    id: '9',
    title: '学校荣获"全国文明校园"称号',
    summary: '在日前公布的第二届全国文明校园名单中，我校成功入选，成为本次评选中获此殊荣的少数高校之一。',
    content: '喜讯！在日前由中央文明委公布的第二届"全国文明校园"名单中，我校成功入选。这是我校精神文明建设工作取得的又一重要成果。\n\n"全国文明校园"评选是我国目前规格最高、影响力最大的校园精神文明建设评选活动，每三年评选一次。评选标准涵盖思想道德建设、领导班子建设、师德师风建设、校园文化建设、校园环境建设、活动阵地建设等多个方面。\n\n近年来，我校高度重视精神文明建设工作，坚持立德树人根本任务，积极培育和践行社会主义核心价值观，持续推进文明校园创建活动，形成了具有我校特色的文明创建品牌。\n\n学校将以此为契机，珍惜荣誉，再接再厉，不断深化文明校园创建工作，努力培养德智体美劳全面发展的社会主义建设者和接班人。\n\n感谢全体师生员工的共同努力！让我们携手共建更加文明、和谐、美丽的校园！',
    category: 'honor',
    images: [
      'https://picsum.photos/seed/news9-1/800/600',
      'https://picsum.photos/seed/news9-2/800/600',
      'https://picsum.photos/seed/news9-3/800/600'
    ],
    image: 'https://picsum.photos/seed/news9/400/300',
    views: 6789,
    createTime: Date.now() - 32400000
  },
  {
    id: '10',
    title: '2026年研究生招生复试分数线公布',
    summary: '我校2026年硕士研究生招生复试分数线已公布，复试工作将于3月下旬开始，请考生及时关注相关通知。',
    content: '各位考生：\n\n根据教育部有关文件精神，结合我校实际情况，经学校研究生招生工作领导小组研究决定，我校2026年硕士研究生招生复试分数线如下：\n\n一、学术学位类\n1. 哲学：总分320分，单科（满分=100）45分，单科（满分>100）68分\n2. 经济学：总分360分，单科（满分=100）52分，单科（满分>100）78分\n3. 法学：总分340分，单科（满分=100）46分，单科（满分>100）69分\n4. 教育学：总分351分，单科（满分=100）51分，单科（满分>100）153分\n5. 文学：总分367分，单科（满分=100）56分，单科（满分>100）84分\n6. 理学：总分300分，单科（满分=100）40分，单科（满分>100）60分\n7. 工学：总分310分，单科（满分=100）40分，单科（满分>100）60分\n8. 医学：总分309分，单科（满分=100）43分，单科（满分>100）129分\n9. 管理学：总分353分，单科（满分=100）51分，单科（满分>100）77分\n10. 艺术学：总分362分，单科（满分=100）40分，单科（满分>100）60分\n\n二、专业学位类\n（具体分数线详见学校研究生院官网）\n\n三、复试安排\n1. 复试时间：3月25日-4月5日（各学院具体时间另行通知）\n2. 复试方式：现场复试（部分专业可申请线上复试）\n3. 复试内容：专业知识、外语听说、综合素质\n\n四、注意事项\n1. 请上线考生及时登录学校研究生招生信息网，确认复试资格\n2. 提前准备好复试所需材料（身份证、准考证、成绩单、政审表等）\n3. 可提前联系意向导师，了解研究方向\n4. 交通、食宿等费用由考生自理\n5. 如有疑问，请拨打各学院招生咨询电话\n\n祝各位考生复试顺利！',
    category: 'notice',
    images: [
      'https://picsum.photos/seed/news10-1/800/600'
    ],
    image: 'https://picsum.photos/seed/news10/400/300',
    views: 8901,
    createTime: Date.now() - 36000000
  },
  {
    id: '11',
    title: '校园美食节即将开幕，吃货们准备好了吗？',
    summary: '一年一度的校园美食节将于下周六在食堂广场举行，届时将有全国各地的特色美食等你来品尝。',
    content: '吃货们的福音来啦！我校第十六届校园美食节将于下周六（3月22日）在一食堂广场隆重开幕，为期两天。\n\n本次美食节以"舌尖上的校园"为主题，汇集了来自全国各地的特色美食，包括：\n\n一、美食展区\n1. 中华名小吃区：北京炸酱面、西安肉夹馍、四川麻辣烫、广东肠粉、武汉热干面、兰州拉面等\n2. 异国风情区：日本寿司、韩国炸鸡、意大利面、泰国冬阴功汤、印度咖喱饭等\n3. 甜品烘焙区：法式马卡龙、提拉米苏、芝士蛋糕、泡芙、曲奇饼干等\n4. 校园特色区：各食堂招牌菜、黑暗料理挑战、学生创业摊位等\n\n二、互动活动\n1. 美食DIY：现场学习制作寿司、披萨、蛋糕等\n2. 大胃王比赛：限时吃汉堡、吃辣挑战\n3. 美食摄影大赛：用手机记录美食瞬间，赢取奖品\n4. 食材知识问答：答对可获得美食券\n\n三、时间地点\n时间：3月22日-23日，每天10:00-20:00\n地点：一食堂广场\n\n四、温馨提示\n1. 现场支持校园卡、微信、支付宝支付\n2. 建议错峰用餐，避免人流高峰\n3. 请按需取餐，践行光盘行动\n4. 如有食物过敏史，请提前咨询摊主\n5. 现场设有休息区和医疗点\n\n美食节期间，食堂正常营业。让我们一起开启舌尖上的美食之旅吧！',
    category: 'activity',
    images: [
      'https://picsum.photos/seed/news11-1/800/600',
      'https://picsum.photos/seed/news11-2/800/600',
      'https://picsum.photos/seed/news11-3/800/600'
    ],
    image: 'https://picsum.photos/seed/news11/400/300',
    views: 4567,
    createTime: Date.now() - 39600000
  },
  {
    id: '12',
    title: '教授团队在顶级期刊发表论文',
    summary: '我校材料科学与工程学院李教授团队在国际顶级期刊《Nature Materials》发表重要研究成果。',
    content: '重大科研突破！我校材料科学与工程学院李教授团队近日在国际顶级期刊《Nature Materials》（影响因子：47.656）发表题为"一种新型二维材料的可控合成及其在量子计算中的应用"的研究论文。\n\n该研究历时五年，团队成功合成了一种新型的二维过渡金属硫化物材料，并首次实现了其在室温下的量子比特操纵。这一突破为量子计算机的实用化迈出了重要一步。\n\n论文第一作者为我校博士研究生王同学，通讯作者为李教授。合作者包括清华大学、北京大学以及美国麻省理工学院的研究人员。\n\n李教授表示："这项研究成果是团队集体智慧的结晶，感谢所有成员的辛勤付出。我们将继续深耕这一领域，争取取得更多原创性成果。"\n\n近年来，我校高度重视科研工作，加大科研投入，培养了一批高水平的研究团队，在多个领域取得了重要突破。此次论文的发表，标志着我校在材料科学领域的研究水平已跻身国际前列。\n\n学校将对该团队给予表彰和奖励，并号召全校师生向他们学习。',
    category: 'research',
    images: [
      'https://picsum.photos/seed/news12-1/800/600',
      'https://picsum.photos/seed/news12-2/800/600'
    ],
    image: 'https://picsum.photos/seed/news12/400/300',
    views: 7890,
    createTime: Date.now() - 43200000
  }
];

const SCENERY_LIST = [
  {
    id: '1',
    title: '图书馆',
    description: '现代化的图书馆，藏书百万册，是学习的理想场所。日落时分，阳光透过落地窗洒在书架上，光影斑驳，美不胜收。',
    image: 'https://picsum.photos/seed/library/800/600',
    category: 'architecture',
    season: 'autumn',
    solarTerm: 'qiufen',
    location: { value: 'library', label: '图书馆', latitude: 39.9042, longitude: 116.4074 },
    likes: 128,
    liked: false,
    comments: [
      { id: 'c1', userId: 'u1', userName: '爱学习的小明', avatar: 'https://picsum.photos/seed/avatar1/100/100', content: '图书馆真的太美了，学习氛围超棒！', createTime: Date.now() - 86400000, likes: 12 },
      { id: 'c2', userId: 'u2', userName: '考研学姐', avatar: 'https://picsum.photos/seed/avatar2/100/100', content: '每天都在这里复习，已经上岸啦！', createTime: Date.now() - 172800000, likes: 25 }
    ],
    commentCount: 2,
    uploader: { id: 'u0', name: '校园摄影师', avatar: 'https://picsum.photos/seed/avatar0/100/100' },
    reviewStatus: 'approved',
    createTime: Date.now() - 259200000,
    views: 1520
  },
  {
    id: '2',
    title: '樱花大道',
    description: '每年春季，樱花盛开，美不胜收。微风拂过，花瓣如雨般飘落，置身其中仿佛进入了童话世界。',
    image: 'https://picsum.photos/seed/cherry/800/600',
    category: 'nature',
    season: 'spring',
    solarTerm: 'chunfen',
    location: { value: 'cherry_blossom', label: '樱花大道', latitude: 39.9050, longitude: 116.4080 },
    likes: 256,
    liked: true,
    comments: [
      { id: 'c1', userId: 'u3', userName: '樱花控', avatar: 'https://picsum.photos/seed/avatar3/100/100', content: '每年三月必来打卡！', createTime: Date.now() - 43200000, likes: 35 },
      { id: 'c2', userId: 'u4', userName: '摄影小白', avatar: 'https://picsum.photos/seed/avatar4/100/100', content: '请问今年樱花开了吗？', createTime: Date.now() - 21600000, likes: 5 },
      { id: 'c3', userId: 'u5', userName: '汉服爱好者', avatar: 'https://picsum.photos/seed/avatar5/100/100', content: '穿汉服来拍照超有感觉的！', createTime: Date.now() - 10800000, likes: 18 }
    ],
    commentCount: 3,
    uploader: { id: 'u1', name: '爱学习的小明', avatar: 'https://picsum.photos/seed/avatar1/100/100' },
    reviewStatus: 'approved',
    createTime: Date.now() - 518400000,
    views: 3280
  },
  {
    id: '3',
    title: '湖心亭',
    description: '校园中心湖畔的古典亭台，是休闲放松的好去处。夏日傍晚，坐在亭中乘凉，看湖面波光粼粼，听蝉鸣声声。',
    image: 'https://picsum.photos/seed/lake/800/600',
    category: 'nature',
    season: 'summer',
    solarTerm: 'xiazhi',
    location: { value: 'lake_pavilion', label: '湖心亭', latitude: 39.9035, longitude: 116.4065 },
    likes: 89,
    liked: false,
    comments: [
      { id: 'c1', userId: 'u6', userName: '湖畔诗人', avatar: 'https://picsum.photos/seed/avatar6/100/100', content: '在这里背诗太有意境了', createTime: Date.now() - 259200000, likes: 8 }
    ],
    commentCount: 1,
    uploader: { id: 'u2', name: '考研学姐', avatar: 'https://picsum.photos/seed/avatar2/100/100' },
    reviewStatus: 'approved',
    createTime: Date.now() - 777600000,
    views: 980
  },
  {
    id: '4',
    title: '体育馆',
    description: '设施完善的综合体育馆，可容纳万人。校运会的时候这里人声鼎沸，青春的汗水在这里挥洒。',
    image: 'https://picsum.photos/seed/gym/800/600',
    category: 'activity',
    season: 'autumn',
    solarTerm: 'liqiu',
    location: { value: 'gym', label: '体育馆', latitude: 39.9060, longitude: 116.4090 },
    likes: 167,
    liked: false,
    comments: [
      { id: 'c1', userId: 'u7', userName: '运动达人', avatar: 'https://picsum.photos/seed/avatar7/100/100', content: '去年校运会还在这里拿了冠军！', createTime: Date.now() - 129600000, likes: 22 },
      { id: 'c2', userId: 'u8', userName: '篮球少年', avatar: 'https://picsum.photos/seed/avatar8/100/100', content: '周末约球吗？', createTime: Date.now() - 64800000, likes: 15 }
    ],
    commentCount: 2,
    uploader: { id: 'u3', name: '樱花控', avatar: 'https://picsum.photos/seed/avatar3/100/100' },
    reviewStatus: 'approved',
    createTime: Date.now() - 388800000,
    views: 2150
  },
  {
    id: '5',
    title: '钟楼夜景',
    description: '校园标志性建筑，见证了学校的百年历史。夜幕降临，钟楼灯光亮起，在星空下格外庄严肃穆。',
    image: 'https://picsum.photos/seed/tower_night/800/600',
    category: 'night',
    season: 'winter',
    solarTerm: 'dongzhi',
    location: { value: 'clock_tower', label: '钟楼', latitude: 39.9048, longitude: 116.4055 },
    likes: 312,
    liked: true,
    comments: [
      { id: 'c1', userId: 'u9', userName: '夜景爱好者', avatar: 'https://picsum.photos/seed/avatar9/100/100', content: '这个角度绝了！请问是怎么拍的？', createTime: Date.now() - 5400000, likes: 45 },
      { id: 'c2', userId: 'u10', userName: '毕业生老周', avatar: 'https://picsum.photos/seed/avatar10/100/100', content: '毕业十年了，看到钟楼还是很感动', createTime: Date.now() - 10800000, likes: 68 },
      { id: 'c3', userId: 'u11', userName: '大一新生', avatar: 'https://picsum.photos/seed/avatar11/100/100', content: '第一次看到这么美的校园！', createTime: Date.now() - 3600000, likes: 28 }
    ],
    commentCount: 3,
    uploader: { id: 'u4', name: '摄影小白', avatar: 'https://picsum.photos/seed/avatar4/100/100' },
    reviewStatus: 'approved',
    createTime: Date.now() - 1036800000,
    views: 5680
  },
  {
    id: '6',
    title: '科技楼',
    description: '现代化的科研大楼，汇聚了众多实验室。夜晚灯火通明，那是科研人在追逐梦想。',
    image: 'https://picsum.photos/seed/tech/800/600',
    category: 'architecture',
    season: 'summer',
    solarTerm: 'dashu',
    location: { value: 'tech_building', label: '科技楼', latitude: 39.9055, longitude: 116.4060 },
    likes: 95,
    liked: false,
    comments: [
      { id: 'c1', userId: 'u12', userName: '科研狗', avatar: 'https://picsum.photos/seed/avatar12/100/100', content: '每天都在这里肝论文...', createTime: Date.now() - 172800000, likes: 30 }
    ],
    commentCount: 1,
    uploader: { id: 'u5', name: '汉服爱好者', avatar: 'https://picsum.photos/seed/avatar5/100/100' },
    reviewStatus: 'approved',
    createTime: Date.now() - 648000000,
    views: 1320
  },
  {
    id: '7',
    title: '春季运动会',
    description: '一年一度的春季运动会，同学们挥洒汗水，奋勇争先。开幕式的团体操表演太震撼了！',
    image: 'https://picsum.photos/seed/sports_day/800/600',
    category: 'activity',
    season: 'spring',
    solarTerm: 'qingming',
    location: { value: 'stadium', label: '操场', latitude: 39.9075, longitude: 116.4085 },
    likes: 234,
    liked: false,
    comments: [
      { id: 'c1', userId: 'u13', userName: '啦啦队长', avatar: 'https://picsum.photos/seed/avatar13/100/100', content: '我们学院的团体操拿了一等奖！', createTime: Date.now() - 259200000, likes: 52 },
      { id: 'c2', userId: 'u14', userName: '短跑健将', avatar: 'https://picsum.photos/seed/avatar14/100/100', content: '100米冠军在此！', createTime: Date.now() - 129600000, likes: 38 }
    ],
    commentCount: 2,
    uploader: { id: 'u6', name: '湖畔诗人', avatar: 'https://picsum.photos/seed/avatar6/100/100' },
    reviewStatus: 'approved',
    createTime: Date.now() - 432000000,
    views: 2890
  },
  {
    id: '8',
    title: '冬日初雪',
    description: '今年的第一场雪，整个校园银装素裹。湖心亭和古松相映成趣，宛如一幅水墨画。',
    image: 'https://picsum.photos/seed/snow/800/600',
    category: 'nature',
    season: 'winter',
    solarTerm: 'daxue',
    location: { value: 'lake_pavilion', label: '湖心亭', latitude: 39.9035, longitude: 116.4065 },
    likes: 456,
    liked: true,
    comments: [
      { id: 'c1', userId: 'u15', userName: '南方来的同学', avatar: 'https://picsum.photos/seed/avatar15/100/100', content: '第一次见到这么大的雪！太激动了', createTime: Date.now() - 86400000, likes: 78 },
      { id: 'c2', userId: 'u16', userName: '雪人艺术家', avatar: 'https://picsum.photos/seed/avatar16/100/100', content: '今天堆了个超大的雪人，在图书馆门口', createTime: Date.now() - 43200000, likes: 45 },
      { id: 'c3', userId: 'u17', userName: '摄影爱好者', avatar: 'https://picsum.photos/seed/avatar17/100/100', content: '雪景真的太美了，拍了好多照片', createTime: Date.now() - 21600000, likes: 32 }
    ],
    commentCount: 3,
    uploader: { id: 'u7', name: '运动达人', avatar: 'https://picsum.photos/seed/avatar7/100/100' },
    reviewStatus: 'approved',
    createTime: Date.now() - 129600000,
    views: 7820
  },
  {
    id: '9',
    title: '教学楼夜景',
    description: '深夜的教学楼，依旧灯火通明。自习室里是为梦想奋斗的身影，这就是青春最美的模样。',
    image: 'https://picsum.photos/seed/classroom_night/800/600',
    category: 'night',
    season: 'autumn',
    solarTerm: 'hanlu',
    location: { value: 'teaching_building', label: '教学楼', latitude: 39.9040, longitude: 116.4085 },
    likes: 278,
    liked: false,
    comments: [
      { id: 'c1', userId: 'u18', userName: '考研冲刺中', avatar: 'https://picsum.photos/seed/avatar18/100/100', content: '每天都学到闭馆，加油！', createTime: Date.now() - 5400000, likes: 56 },
      { id: 'c2', userId: 'u19', userName: '路灯下的猫', avatar: 'https://picsum.photos/seed/avatar19/100/100', content: '回宿舍路上看到这灯光，心里很暖', createTime: Date.now() - 7200000, likes: 42 }
    ],
    commentCount: 2,
    uploader: { id: 'u8', name: '篮球少年', avatar: 'https://picsum.photos/seed/avatar8/100/100' },
    reviewStatus: 'approved',
    createTime: Date.now() - 216000000,
    views: 3560
  },
  {
    id: '10',
    title: '食堂烟火',
    description: '午餐时间的食堂，香气四溢。糖醋排骨、红烧肉、麻辣烫...哪个是你的最爱？',
    image: 'https://picsum.photos/seed/canteen/800/600',
    category: 'activity',
    season: 'autumn',
    solarTerm: 'shuangjiang',
    location: { value: 'canteen', label: '食堂', latitude: 39.9065, longitude: 116.4075 },
    likes: 189,
    liked: false,
    comments: [
      { id: 'c1', userId: 'u20', userName: '吃货一号', avatar: 'https://picsum.photos/seed/avatar20/100/100', content: '二食堂的糖醋排骨yyds！', createTime: Date.now() - 14400000, likes: 63 },
      { id: 'c2', userId: 'u21', userName: '减脂进行时', avatar: 'https://picsum.photos/seed/avatar21/100/100', content: '推荐一食堂的轻食窗口，好吃不胖', createTime: Date.now() - 18000000, likes: 35 }
    ],
    commentCount: 2,
    uploader: { id: 'u9', name: '夜景爱好者', avatar: 'https://picsum.photos/seed/avatar9/100/100' },
    reviewStatus: 'approved',
    createTime: Date.now() - 302400000,
    views: 2450
  },
  {
    id: '11',
    title: '图书馆夜景',
    description: '星空下的图书馆，灯火辉煌。每一盏灯都照亮着一个梦想，每一扇窗都是一个故事。',
    image: 'https://picsum.photos/seed/library_night/800/600',
    category: 'night',
    season: 'summer',
    solarTerm: 'xiaoshu',
    location: { value: 'library', label: '图书馆', latitude: 39.9042, longitude: 116.4074 },
    likes: 345,
    liked: true,
    comments: [
      { id: 'c1', userId: 'u22', userName: '期末冲刺', avatar: 'https://picsum.photos/seed/avatar22/100/100', content: '考试周每天都待到闭馆...', createTime: Date.now() - 3600000, likes: 89 },
      { id: 'c2', userId: 'u23', userName: '考研上岸', avatar: 'https://picsum.photos/seed/avatar23/100/100', content: '就是在这里，我度过了最难忘的一年。现已上岸，感谢图书馆的陪伴！', createTime: Date.now() - 7200000, likes: 128 }
    ],
    commentCount: 2,
    uploader: { id: 'u10', name: '毕业生老周', avatar: 'https://picsum.photos/seed/avatar10/100/100' },
    reviewStatus: 'approved',
    createTime: Date.now() - 172800000,
    views: 6230
  },
  {
    id: '12',
    title: '春日宿舍区',
    description: '春天来了，宿舍楼下的玉兰花盛开。推开窗就能闻到花香，这是属于我们的青春记忆。',
    image: 'https://picsum.photos/seed/dorm_spring/800/600',
    category: 'nature',
    season: 'spring',
    solarTerm: 'guyu',
    location: { value: 'dormitory', label: '宿舍区', latitude: 39.9070, longitude: 116.4050 },
    likes: 210,
    liked: false,
    comments: [
      { id: 'c1', userId: 'u24', userName: '3号楼住户', avatar: 'https://picsum.photos/seed/avatar24/100/100', content: '我就在这栋楼！每天被花香叫醒太幸福了', createTime: Date.now() - 43200000, likes: 48 },
      { id: 'c2', userId: 'u25', userName: '毕业学姐', avatar: 'https://picsum.photos/seed/avatar25/100/100', content: '好怀念宿舍楼下的玉兰花，毕业两年了还时常想起', createTime: Date.now() - 86400000, likes: 56 }
    ],
    commentCount: 2,
    uploader: { id: 'u11', name: '大一新生', avatar: 'https://picsum.photos/seed/avatar11/100/100' },
    reviewStatus: 'approved',
    createTime: Date.now() - 540000000,
    views: 2780
  },
  {
    id: '13',
    title: '迎新晚会',
    description: '一年一度的迎新晚会，学长学姐们精心准备的节目太精彩了！欢迎新同学加入我们的大家庭。',
    image: 'https://picsum.photos/seed/welcome_party/800/600',
    category: 'activity',
    season: 'autumn',
    solarTerm: 'bailu',
    location: { value: 'gym', label: '体育馆', latitude: 39.9060, longitude: 116.4090 },
    likes: 156,
    liked: false,
    comments: [
      { id: 'c1', userId: 'u26', userName: '学生会主席', avatar: 'https://picsum.photos/seed/avatar26/100/100', content: '筹备了一个月，看到大家开心一切都值得！', createTime: Date.now() - 172800000, likes: 72 }
    ],
    commentCount: 1,
    uploader: { id: 'u12', name: '科研狗', avatar: 'https://picsum.photos/seed/avatar12/100/100' },
    reviewStatus: 'pending',
    createTime: Date.now() - 86400000,
    views: 890
  }
];

const SCENERY_COLLECTIONS = [
  {
    id: 'col1',
    title: '春日限定·樱花季',
    description: '三月春风拂面来，樱花满园次第开。',
    cover: 'https://picsum.photos/seed/cherry_collection/800/400',
    type: 'season',
    season: 'spring',
    solarTerms: ['chunfen', 'qingming'],
    itemCount: 24,
    views: 3580,
    color: '#FF9CA2',
    icon: '🌸'
  },
  {
    id: 'col2',
    title: '盛夏光年·绿意浓',
    description: '绿树阴浓夏日长，楼台倒影入池塘。',
    cover: 'https://picsum.photos/seed/summer_collection/800/400',
    type: 'season',
    season: 'summer',
    solarTerms: ['lixia', 'xiazhi', 'dashu'],
    itemCount: 18,
    views: 2340,
    color: '#7ED957',
    icon: '☀️'
  },
  {
    id: 'col3',
    title: '秋色满园·黄金季',
    description: '停车坐爱枫林晚，霜叶红于二月花。',
    cover: 'https://picsum.photos/seed/autumn_collection/800/400',
    type: 'season',
    season: 'autumn',
    solarTerms: ['liqiu', 'qiufen', 'shuangjiang'],
    itemCount: 32,
    views: 4120,
    color: '#FF8C42',
    icon: '🍂'
  },
  {
    id: 'col4',
    title: '银装素裹·冬日情',
    description: '忽如一夜春风来，千树万树梨花开。',
    cover: 'https://picsum.photos/seed/winter_collection/800/400',
    type: 'season',
    season: 'winter',
    solarTerms: ['lidong', 'daxue', 'dongzhi'],
    itemCount: 28,
    views: 5680,
    color: '#A8D8EA',
    icon: '❄️'
  },
  {
    id: 'col5',
    title: '立春·万物复苏',
    description: '春回大地，万物复苏，校园里的小生命们也开始活跃起来。',
    cover: 'https://picsum.photos/seed/lichun_collection/800/400',
    type: 'solar_term',
    season: 'spring',
    solarTerms: ['lichun'],
    itemCount: 12,
    views: 1890,
    color: '#A8E6CF',
    icon: '🌱'
  },
  {
    id: 'col6',
    title: '清明·踏青时节',
    description: '清明时节雨纷纷，路上行人欲断魂。校园春色正当时。',
    cover: 'https://picsum.photos/seed/qingming_collection/800/400',
    type: 'solar_term',
    season: 'spring',
    solarTerms: ['qingming'],
    itemCount: 15,
    views: 2150,
    color: '#95E1D3',
    icon: '🌿'
  },
  {
    id: 'col7',
    title: '夏至·蝉鸣悠扬',
    description: '夏至已至，蝉鸣悠扬，阳光正好，青春正盛。',
    cover: 'https://picsum.photos/seed/xiazhi_collection/800/400',
    type: 'solar_term',
    season: 'summer',
    solarTerms: ['xiazhi'],
    itemCount: 20,
    views: 2780,
    color: '#FFD93D',
    icon: '☀️'
  },
  {
    id: 'col8',
    title: '冬至·温暖相伴',
    description: '冬至大如年，人间小团圆。吃一碗热腾腾的饺子，温暖整个冬天。',
    cover: 'https://picsum.photos/seed/dongzhi_collection/800/400',
    type: 'solar_term',
    season: 'winter',
    solarTerms: ['dongzhi'],
    itemCount: 25,
    views: 3890,
    color: '#FFEAA7',
    icon: '⛄'
  },
  {
    id: 'col9',
    title: '校园夜色·光影故事',
    description: '夜幕降临，华灯初上，校园的夜晚有着别样的美丽。',
    cover: 'https://picsum.photos/seed/night_collection/800/400',
    type: 'theme',
    season: '',
    solarTerms: [],
    itemCount: 45,
    views: 6230,
    color: '#6C5CE7',
    icon: '🌙'
  },
  {
    id: 'col10',
    title: '毕业季·青春不散',
    description: '愿你出走半生，归来仍是少年。致我们终将逝去的青春。',
    cover: 'https://picsum.photos/seed/graduation_collection/800/400',
    type: 'theme',
    season: 'summer',
    solarTerms: ['mangzhong'],
    itemCount: 68,
    views: 8560,
    color: '#FD79A8',
    icon: '🎓'
  }
];

const SCENERY_USER_SUBMISSIONS = [
  {
    id: 'sub1',
    title: '自习室的清晨',
    description: '早上7点的自习室，已经有很多同学在晨读了。新的一天，从努力开始！',
    image: 'https://picsum.photos/seed/user_sub1/800/600',
    category: 'activity',
    location: { value: 'library', label: '图书馆', latitude: 39.9042, longitude: 116.4074 },
    season: 'autumn',
    reviewStatus: 'pending',
    uploader: { id: 'u27', name: '早起的鸟儿', avatar: 'https://picsum.photos/seed/avatar27/100/100' },
    createTime: Date.now() - 3600000
  },
  {
    id: 'sub2',
    title: '食堂的美食',
    description: '今天发现了一个新窗口，麻辣香锅太好吃了！推荐给大家～',
    image: 'https://picsum.photos/seed/user_sub2/800/600',
    category: 'activity',
    location: { value: 'canteen', label: '食堂', latitude: 39.9065, longitude: 116.4075 },
    season: 'autumn',
    reviewStatus: 'pending',
    uploader: { id: 'u28', name: '美食发现家', avatar: 'https://picsum.photos/seed/avatar28/100/100' },
    createTime: Date.now() - 7200000
  }
];

const BROADCAST_CATEGORIES = [
  { id: 'all', name: '全部', icon: '📻' },
  { id: 'news', name: '新闻', icon: '📰' },
  { id: 'music', name: '音乐', icon: '🎵' },
  { id: 'lecture', name: '讲座', icon: '🎓' }
];

const BROADCAST_LIST = [
  {
    id: '1',
    title: '校园早新闻',
    description: '校园新闻、时事热点一网打尽',
    category: 'news',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=1901371647.mp3',
    cover: 'https://picsum.photos/seed/radio-news1/400/400',
    duration: 245,
    durationText: '04:05',
    anchor: '校园之声',
    createTime: Date.now() - 3600000,
    lyrics: [
      { time: 0, text: '欢迎收听校园早新闻' },
      { time: 5, text: '今天是2026年6月11日，星期三' },
      { time: 10, text: '首先为您带来校园要闻' },
      { time: 15, text: '我校学子在全国大学生创新创业大赛中荣获金奖' },
      { time: 25, text: '第十二届全国大学生创新创业大赛总决赛近日落幕' },
      { time: 35, text: '我校参赛团队凭借"智慧校园生活服务平台"项目荣获金奖' },
      { time: 50, text: '接下来是校园活动资讯' },
      { time: 55, text: '校园樱花季即将到来' },
      { time: 60, text: '预计本周末将迎来最佳观赏期' },
      { time: 70, text: '届时学校将开放主要赏花区域' },
      { time: 80, text: '欢迎同学们前往观赏' },
      { time: 90, text: '下面是学术讲座预告' },
      { time: 95, text: '本周五下午两点，学术报告厅' },
      { time: 100, text: '将举办人工智能前沿技术讲座' },
      { time: 110, text: '邀请到了业内知名专家分享' },
      { time: 120, text: '感兴趣的同学请提前入场' },
      { time: 130, text: '接下来关注一下天气情况' },
      { time: 135, text: '今天多云转晴，气温22-30度' },
      { time: 145, text: '适合户外活动，但请注意防晒' },
      { time: 155, text: '最后为大家带来一则温馨提示' },
      { time: 160, text: '期末考试即将到来' },
      { time: 165, text: '请同学们合理安排复习时间' },
      { time: 175, text: '保持良好的作息和心态' },
      { time: 185, text: '祝大家都能取得好成绩' },
      { time: 195, text: '今天的校园早新闻就到这里' },
      { time: 200, text: '感谢您的收听' },
      { time: 205, text: '我们明天同一时间再见' }
    ]
  },
  {
    id: '2',
    title: '午间新闻速递',
    description: '午间半小时，知晓天下事',
    category: 'news',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=1407551413.mp3',
    cover: 'https://picsum.photos/seed/radio-news2/400/400',
    duration: 312,
    durationText: '05:12',
    anchor: '新闻组',
    createTime: Date.now() - 7200000,
    lyrics: [
      { time: 0, text: '午间新闻速递' },
      { time: 5, text: '各位听众中午好' },
      { time: 10, text: '欢迎收听午间新闻速递' },
      { time: 15, text: '首先关注国内新闻' },
      { time: 20, text: '教育部发布最新教育政策' },
      { time: 30, text: '提出要深化教育教学改革' },
      { time: 40, text: '全面提高人才培养质量' },
      { time: 50, text: '接下来是国际新闻' },
      { time: 55, text: '全球气候变化峰会召开' },
      { time: 65, text: '各国代表就减排目标达成共识' },
      { time: 75, text: '承诺将加快清洁能源转型' },
      { time: 85, text: '现在来看科技新闻' },
      { time: 90, text: '人工智能技术取得新突破' },
      { time: 100, text: '大语言模型能力持续提升' },
      { time: 110, text: '在多个领域展现出应用潜力' },
      { time: 120, text: '接下来是体育新闻' },
      { time: 125, text: 'NBA季后赛激战正酣' },
      { time: 135, text: '多场比赛精彩对决' },
      { time: 145, text: '球迷们大呼过瘾' },
      { time: 155, text: '下面是财经资讯' },
      { time: 160, text: '股市今日震荡上行' },
      { time: 170, text: '科技股表现亮眼' },
      { time: 180, text: '投资者信心逐步恢复' },
      { time: 190, text: '再来看一条文化新闻' },
      { time: 195, text: '非遗文化节即将举办' },
      { time: 205, text: '展示传统手工艺魅力' },
      { time: 215, text: '传承中华优秀传统文化' },
      { time: 225, text: '接下来关注校园动态' },
      { time: 230, text: '我校春季招聘会圆满落幕' },
      { time: 240, text: '两百余家企业参会' },
      { time: 250, text: '提供就业岗位数千个' },
      { time: 260, text: '毕业生积极投递简历' },
      { time: 270, text: '最后来看生活小贴士' },
      { time: 275, text: '夏季饮食要注意清淡' },
      { time: 285, text: '多吃水果蔬菜补充维生素' },
      { time: 295, text: '保持充足睡眠和适量运动' },
      { time: 305, text: '今天的午间新闻就到这里' },
      { time: 310, text: '感谢收听' }
    ]
  },
  {
    id: '3',
    title: '校园晨曲',
    description: '每日清晨，用音乐唤醒美好的一天',
    category: 'music',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=447925558.mp3',
    cover: 'https://picsum.photos/seed/radio-music1/400/400',
    duration: 276,
    durationText: '04:36',
    anchor: '音乐频道',
    createTime: Date.now() - 86400000,
    lyrics: [
      { time: 0, text: '♪ 纯音乐欣赏 ♪' },
      { time: 10, text: '欢迎来到校园晨曲' },
      { time: 20, text: '让美妙的音乐开启美好的一天' },
      { time: 30, text: '清晨的阳光洒进窗台' },
      { time: 40, text: '新的一天已经到来' },
      { time: 50, text: '让我们伴着音乐' },
      { time: 60, text: '迎接充满希望的一天' },
      { time: 80, text: '♪ 音乐欣赏中 ♪' },
      { time: 120, text: '这首曲子是不是很动听呢' },
      { time: 140, text: '希望能给你带来好心情' },
      { time: 160, text: '♪ 继续欣赏 ♪' },
      { time: 200, text: '音乐总是能触动人心' },
      { time: 220, text: '在这个美好的早晨' },
      { time: 240, text: '愿你充满活力和动力' },
      { time: 260, text: '今天的校园晨曲就要结束了' },
      { time: 270, text: '我们明天再见' }
    ]
  },
  {
    id: '4',
    title: '音乐时光',
    description: '精选好歌，陪你度过悠闲午后',
    category: 'music',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=1824020873.mp3',
    cover: 'https://picsum.photos/seed/radio-music2/400/400',
    duration: 234,
    durationText: '03:54',
    anchor: '音乐频道',
    createTime: Date.now() - 172800000,
    lyrics: [
      { time: 0, text: '♪ 午后音乐时光 ♪' },
      { time: 10, text: '各位听众下午好' },
      { time: 20, text: '欢迎来到音乐时光' },
      { time: 30, text: '在这个悠闲的午后' },
      { time: 40, text: '让我们一起享受音乐' },
      { time: 50, text: '♪ 音乐播放中 ♪' },
      { time: 80, text: '这首轻快的歌曲' },
      { time: 90, text: '有没有让你心情愉悦呢' },
      { time: 100, text: '♪ 继续聆听 ♪' },
      { time: 130, text: '音乐是心灵的港湾' },
      { time: 140, text: '在忙碌的学习生活中' },
      { time: 150, text: '别忘了给自己留点时间' },
      { time: 160, text: '享受音乐，享受生活' },
      { time: 180, text: '♪ 美妙旋律 ♪' },
      { time: 200, text: '今天的音乐时光' },
      { time: 210, text: '就要和大家说再见了' },
      { time: 220, text: '我们下期节目再会' }
    ]
  },
  {
    id: '5',
    title: '晚间轻音乐',
    description: '舒缓音乐，放松身心，伴你入眠',
    category: 'music',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=1397345903.mp3',
    cover: 'https://picsum.photos/seed/radio-music3/400/400',
    duration: 298,
    durationText: '04:58',
    anchor: '音乐频道',
    createTime: Date.now() - 259200000,
    lyrics: [
      { time: 0, text: '♪ 晚间轻音乐 ♪' },
      { time: 15, text: '亲爱的听众朋友们，晚上好' },
      { time: 25, text: '欢迎收听晚间轻音乐节目' },
      { time: 35, text: '忙碌了一天' },
      { time: 45, text: '是时候放松一下了' },
      { time: 55, text: '让舒缓的音乐' },
      { time: 65, text: '带走你所有的疲惫' },
      { time: 80, text: '♪ 悠扬旋律 ♪' },
      { time: 110, text: '闭上眼睛，深呼吸' },
      { time: 120, text: '让音乐流淌进心里' },
      { time: 130, text: '感受这份宁静与美好' },
      { time: 150, text: '♪ 轻柔乐章 ♪' },
      { time: 180, text: '夜色渐浓，星空璀璨' },
      { time: 190, text: '愿你有个好梦' },
      { time: 200, text: '明天又是新的开始' },
      { time: 220, text: '♪ 温柔旋律 ♪' },
      { time: 250, text: '今天的晚间轻音乐' },
      { time: 260, text: '就要和大家说晚安了' },
      { time: 270, text: '祝大家晚安，好梦' },
      { time: 285, text: '我们明晚同一时间' },
      { time: 295, text: '不见不散' }
    ]
  },
  {
    id: '6',
    title: '人工智能前沿讲座',
    description: '探索AI技术的最新发展与应用',
    category: 'lecture',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=526464145.mp3',
    cover: 'https://picsum.photos/seed/radio-lecture1/400/400',
    duration: 356,
    durationText: '05:56',
    anchor: '学术部',
    createTime: Date.now() - 432000000,
    lyrics: [
      { time: 0, text: '人工智能前沿技术讲座' },
      { time: 5, text: '各位同学，大家好' },
      { time: 10, text: '欢迎来到今天的讲座' },
      { time: 15, text: '今天我们要聊的主题是' },
      { time: 20, text: '人工智能的前沿发展与应用' },
      { time: 30, text: '首先，让我们来了解一下' },
      { time: 35, text: '什么是人工智能' },
      { time: 40, text: '人工智能简称AI' },
      { time: 45, text: '是计算机科学的一个分支' },
      { time: 50, text: '致力于研究和开发' },
      { time: 55, text: '能够模拟、延伸和扩展' },
      { time: 60, text: '人类智能的理论、方法和技术' },
      { time: 70, text: '接下来，我们来看看' },
      { time: 75, text: 'AI的发展历程' },
      { time: 80, text: '从上世纪50年代诞生至今' },
      { time: 85, text: 'AI经历了几次起起伏伏' },
      { time: 90, text: '近年来，随着深度学习的兴起' },
      { time: 95, text: 'AI迎来了新的发展高潮' },
      { time: 105, text: '现在，让我们来谈谈' },
      { time: 110, text: '大语言模型的发展' },
      { time: 115, text: '从GPT-3到GPT-4' },
      { time: 120, text: '再到各种开源模型' },
      { time: 125, text: '大语言模型的能力' },
      { time: 130, text: '正在以惊人的速度提升' },
      { time: 140, text: '它们不仅能理解和生成文本' },
      { time: 145, text: '还能进行推理、编程' },
      { time: 150, text: '甚至进行多模态理解' },
      { time: 160, text: '下面，我们来看看AI的应用' },
      { time: 165, text: '在教育领域' },
      { time: 170, text: 'AI可以个性化辅导学生' },
      { time: 175, text: '在医疗领域' },
      { time: 180, text: 'AI可以辅助诊断疾病' },
      { time: 185, text: '在交通领域' },
      { time: 190, text: '自动驾驶正在成为现实' },
      { time: 200, text: '当然，AI的发展' },
      { time: 205, text: '也带来了一些挑战' },
      { time: 210, text: '比如就业结构的变化' },
      { time: 215, text: '数据隐私和安全问题' },
      { time: 220, text: '以及伦理道德的考量' },
      { time: 230, text: '这就需要我们' },
      { time: 235, text: '在推动技术发展的同时' },
      { time: 240, text: '也要关注其社会影响' },
      { time: 245, text: '确保AI的发展' },
      { time: 250, text: '能够造福全人类' },
      { time: 260, text: '对于我们大学生来说' },
      { time: 265, text: '应该如何面对AI时代呢' },
      { time: 270, text: '首先，要积极学习AI知识' },
      { time: 275, text: '了解AI的基本原理和应用' },
      { time: 280, text: '其次，要培养创新思维' },
      { time: 285, text: '思考如何用AI解决实际问题' },
      { time: 290, text: '最后，要保持终身学习的态度' },
      { time: 295, text: '不断适应技术的变化' },
      { time: 305, text: '下面进入问答环节' },
      { time: 310, text: '有同学问：AI会取代人类吗？' },
      { time: 315, text: '我的回答是：不会完全取代' },
      { time: 320, text: '但会改变很多工作的方式' },
      { time: 325, text: '我们要学会与AI协作' },
      { time: 330, text: '而不是与AI竞争' },
      { time: 340, text: '由于时间关系' },
      { time: 345, text: '今天的讲座就到这里' },
      { time: 350, text: '感谢大家的聆听' },
      { time: 355, text: '我们下次再见' }
    ]
  },
  {
    id: '7',
    title: '英语学习讲座',
    description: '高效学习英语的方法与技巧',
    category: 'lecture',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=1407551413.mp3',
    cover: 'https://picsum.photos/seed/radio-lecture2/400/400',
    duration: 289,
    durationText: '04:49',
    anchor: '外语学院',
    createTime: Date.now() - 518400000,
    lyrics: [
      { time: 0, text: '英语学习方法讲座' },
      { time: 5, text: '同学们，大家好' },
      { time: 10, text: '今天我们来聊聊' },
      { time: 15, text: '如何高效地学习英语' },
      { time: 25, text: '首先，我想问问大家' },
      { time: 30, text: '你们觉得学英语最难的是什么？' },
      { time: 35, text: '是单词？语法？还是口语？' },
      { time: 45, text: '其实，英语学习' },
      { time: 50, text: '是一个循序渐进的过程' },
      { time: 55, text: '需要长期的积累和坚持' },
      { time: 65, text: '下面，我分享几个' },
      { time: 70, text: '实用的学习方法' },
      { time: 75, text: '第一个方法：沉浸式学习' },
      { time: 80, text: '尽量让自己处在英语环境中' },
      { time: 85, text: '比如听英文歌、看英文电影' },
      { time: 90, text: '用英语思考问题' },
      { time: 95, text: '培养语感很重要' },
      { time: 105, text: '第二个方法：大量输入' },
      { time: 110, text: '多读、多听' },
      { time: 115, text: '输入是输出的基础' },
      { time: 120, text: '只有积累到一定程度' },
      { time: 125, text: '才能顺畅地输出' },
      { time: 135, text: '第三个方法：主动输出' },
      { time: 140, text: '不要害怕犯错' },
      { time: 145, text: '大胆地说、大胆地写' },
      { time: 150, text: '犯错是学习的必经之路' },
      { time: 155, text: '每一次错误都是进步' },
      { time: 165, text: '第四个方法：利用碎片时间' },
      { time: 170, text: '排队、等车的时候' },
      { time: 175, text: '可以背几个单词' },
      { time: 180, text: '或者听一段英语音频' },
      { time: 185, text: '积少成多，效果显著' },
      { time: 195, text: '接下来，说说背单词' },
      { time: 200, text: '不要死记硬背' },
      { time: 205, text: '要在语境中记忆' },
      { time: 210, text: '通过阅读和听力' },
      { time: 215, text: '自然地掌握单词' },
      { time: 220, text: '这样记得更牢' },
      { time: 230, text: '然后是口语练习' },
      { time: 235, text: '可以找语伴练习' },
      { time: 240, text: '也可以自言自语' },
      { time: 245, text: '或者模仿原声跟读' },
      { time: 250, text: '关键是要开口说' },
      { time: 260, text: '最后，我想说的是' },
      { time: 265, text: '学习英语没有捷径' },
      { time: 270, text: '但有方法可循' },
      { time: 275, text: '找到适合自己的方法' },
      { time: 280, text: '坚持下去，就一定能进步' },
      { time: 285, text: '今天的分享就到这里' }
    ]
  },
  {
    id: '8',
    title: '考研经验分享会',
    description: '学长学姐的考研备考经验与心得',
    category: 'lecture',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=1824020873.mp3',
    cover: 'https://picsum.photos/seed/radio-lecture3/400/400',
    duration: 267,
    durationText: '04:27',
    anchor: '学习部',
    createTime: Date.now() - 604800000,
    lyrics: [
      { time: 0, text: '考研经验分享会' },
      { time: 5, text: '各位学弟学妹们，大家好' },
      { time: 10, text: '很高兴能有这个机会' },
      { time: 15, text: '和大家分享一下我的考研经验' },
      { time: 25, text: '首先，我想说说' },
      { time: 30, text: '为什么要考研' },
      { time: 35, text: '每个人的原因可能不同' },
      { time: 40, text: '有的是为了深造学术' },
      { time: 45, text: '有的是为了更好的就业' },
      { time: 50, text: '但无论是什么原因' },
      { time: 55, text: '明确的目标都很重要' },
      { time: 65, text: '接下来，说说备考规划' },
      { time: 70, text: '考研是一场持久战' },
      { time: 75, text: '合理的规划至关重要' },
      { time: 80, text: '我建议把备考分为三个阶段' },
      { time: 85, text: '基础阶段、强化阶段、冲刺阶段' },
      { time: 95, text: '基础阶段重在打基础' },
      { time: 100, text: '把教材过一遍' },
      { time: 105, text: '建立知识框架' },
      { time: 110, text: '这个阶段不要急于求成' },
      { time: 115, text: '稳扎稳打最重要' },
      { time: 125, text: '强化阶段重在深化理解' },
      { time: 130, text: '大量做题，总结方法' },
      { time: 135, text: '查漏补缺，攻克难点' },
      { time: 140, text: '这个阶段进步最快' },
      { time: 145, text: '但也最容易遇到瓶颈' },
      { time: 155, text: '冲刺阶段重在模拟演练' },
      { time: 160, text: '做真题，找手感' },
      { time: 165, text: '调整作息，保持状态' },
      { time: 170, text: '心态调整也很关键' },
      { time: 180, text: '下面，说说各科的复习方法' },
      { time: 185, text: '政治：不要开始太晚' },
      { time: 190, text: '但也不用太早' },
      { time: 195, text: '重在理解和记忆' },
      { time: 200, text: '英语：每天都要学' },
      { time: 205, text: '保持语感很重要' },
      { time: 210, text: '数学：多做题，多总结' },
      { time: 215, text: '专业课：研究真题' },
      { time: 220, text: '把握出题规律' },
      { time: 230, text: '最后，我想强调' },
      { time: 235, text: '心态和身体同样重要' },
      { time: 240, text: '保持良好的作息' },
      { time: 245, text: '适当运动，劳逸结合' },
      { time: 250, text: '相信自己，坚持到底' },
      { time: 255, text: '你一定可以的！' },
      { time: 260, text: '今天的分享就到这里' },
      { time: 265, text: '祝大家考研顺利！' }
    ]
  },
  {
    id: '9',
    title: '晚间故事汇',
    description: '温馨故事，伴你入眠',
    category: 'lecture',
    audioUrl: 'https://music.163.com/song/media/outer/url?id=1397345903.mp3',
    cover: 'https://picsum.photos/seed/radio-story/400/400',
    duration: 321,
    durationText: '05:21',
    anchor: '文艺部',
    createTime: Date.now() - 691200000,
    lyrics: [
      { time: 0, text: '晚间故事汇' },
      { time: 5, text: '亲爱的听众朋友们，晚上好' },
      { time: 10, text: '欢迎收听晚间故事汇' },
      { time: 15, text: '今天我要给大家讲一个' },
      { time: 20, text: '关于梦想与坚持的故事' },
      { time: 30, text: '从前，有一个年轻的画家' },
      { time: 35, text: '他住在一个小村庄里' },
      { time: 40, text: '从小就热爱绘画' },
      { time: 45, text: '他的梦想是成为一名' },
      { time: 50, text: '真正的艺术家' },
      { time: 55, text: '可是，村里的人都不理解他' },
      { time: 60, text: '觉得画画不能当饭吃' },
      { time: 65, text: '劝他找一份正经工作' },
      { time: 75, text: '年轻的画家没有放弃' },
      { time: 80, text: '他每天坚持画画' },
      { time: 85, text: '用画笔记录生活的美好' },
      { time: 90, text: '即使生活很清贫' },
      { time: 95, text: '他也从未想过放弃' },
      { time: 105, text: '有一天，城里举办画展' },
      { time: 110, text: '画家决定去参加' },
      { time: 115, text: '他带上自己最好的作品' },
      { time: 120, text: '踏上了进城的路' },
      { time: 130, text: '画展上，高手云集' },
      { time: 135, text: '画家的作品似乎并不起眼' },
      { time: 140, text: '很少有人驻足观看' },
      { time: 145, text: '画家有些失落' },
      { time: 150, text: '但他仍然相信自己的作品' },
      { time: 160, text: '就在画展快结束的时候' },
      { time: 165, text: '一位老先生来到画前' },
      { time: 170, text: '仔细端详了很久' },
      { time: 175, text: '然后问画家：' },
      { time: 180, text: '这幅画是你画的吗？' },
      { time: 185, text: '画家点点头' },
      { time: 190, text: '老先生说：' },
      { time: 195, text: '我从你的画里' },
      { time: 200, text: '看到了对生活的热爱' },
      { time: 205, text: '和对梦想的执着' },
      { time: 210, text: '很打动我' },
      { time: 220, text: '原来，这位老先生' },
      { time: 225, text: '是一位著名的艺术评论家' },
      { time: 230, text: '他在画展的总结会上' },
      { time: 235, text: '特别提到了画家的作品' },
      { time: 240, text: '给予了很高的评价' },
      { time: 250, text: '从那以后' },
      { time: 255, text: '画家的作品被更多人认识' },
      { time: 260, text: '他也逐渐实现了自己的梦想' },
      { time: 270, text: '故事讲到这里' },
      { time: 275, text: '不知道大家有什么感想呢' },
      { time: 280, text: '其实，我们每个人' },
      { time: 285, text: '都有自己的梦想' },
      { time: 290, text: '在追逐梦想的路上' },
      { time: 295, text: '可能会遇到困难和质疑' },
      { time: 300, text: '但只要我们坚持下去' },
      { time: 305, text: '就一定能看到希望' },
      { time: 310, text: '今天的故事就到这里' },
      { time: 315, text: '祝大家晚安，好梦' },
      { time: 320, text: '我们明晚再见' }
    ]
  }
];

const MOCK_LOST_FOUND = [
  {
    type: 'lost',
    title: '黑色钱包丢失',
    description: '昨天在图书馆三楼自习室丢失黑色钱包一个，内有身份证、校园卡和部分现金。望好心人拾到后联系，万分感谢！',
    itemType: 'card',
    location: 'library',
    date: '2026-06-10',
    contact: '李明',
    phone: '13800138001',
    userName: '李明同学',
    userAvatar: '',
    images: ['https://picsum.photos/seed/wallet/600/600'],
    reward: '500元酬金',
    status: 'active',
    aiTags: {
      colors: [{ value: 'black', label: '黑色', confidence: 0.95 }],
      brands: [],
      category: { value: 'wallet', label: '钱包', confidence: 0.88 }
    }
  },
  {
    type: 'found',
    title: '捡到黑色钱包',
    description: '在图书馆二楼卫生间门口捡到一个黑色钱包，内有证件和现金若干。请失主携带有效证件前来认领。',
    itemType: 'card',
    location: 'library',
    date: '2026-06-10',
    contact: '刘同学',
    phone: '13800138010',
    userName: '拾金不昧小刘',
    userAvatar: '',
    images: ['https://picsum.photos/seed/wallet2/600/600'],
    status: 'active',
    aiTags: {
      colors: [{ value: 'black', label: '黑色', confidence: 0.92 }],
      brands: [],
      category: { value: 'wallet', label: '钱包', confidence: 0.85 }
    }
  },
  {
    type: 'found',
    title: '捡到一串钥匙',
    description: '在食堂门口捡到一串钥匙，上面有一个小熊挂件。失主请联系我认领。',
    itemType: 'other',
    location: 'canteen',
    date: '2026-06-09',
    contact: '王芳',
    phone: '13800138002',
    userName: '热心小王',
    userAvatar: '',
    images: ['https://picsum.photos/seed/keys/600/600'],
    status: 'claimed',
    aiTags: {
      colors: [{ value: 'silver', label: '银色', confidence: 0.8 }],
      brands: [],
      category: { value: 'keys', label: '钥匙', confidence: 0.9 }
    }
  },
  {
    type: 'lost',
    title: '寻找银色笔记本电脑',
    description: '在教学楼A栋302教室丢失银色MacBook Pro一台，电脑上有蓝色贴纸。资料非常重要，恳请归还！',
    itemType: 'electronics',
    location: 'classroom',
    date: '2026-06-08',
    contact: '张华',
    phone: '13800138003',
    userName: '着急的小张',
    userAvatar: '',
    images: ['https://picsum.photos/seed/laptop/600/600'],
    reward: '1000元酬金',
    status: 'returned',
    aiTags: {
      colors: [{ value: 'silver', label: '银色', confidence: 0.9 }, { value: 'blue', label: '蓝色', confidence: 0.6 }],
      brands: [{ value: 'apple', label: 'Apple', confidence: 0.95 }],
      category: { value: 'laptop', label: '笔记本电脑', confidence: 0.92 }
    }
  },
  {
    type: 'found',
    title: '捡到一台银色苹果笔记本电脑',
    description: '在教学楼B栋自习室捡到一台银色MacBook Pro，电脑外壳有轻微划痕。请失主描述电脑特征后认领。',
    itemType: 'electronics',
    location: 'classroom',
    date: '2026-06-08',
    contact: '赵同学',
    phone: '13800138011',
    userName: '好学小赵',
    userAvatar: '',
    images: ['https://picsum.photos/seed/laptop2/600/600'],
    status: 'active',
    aiTags: {
      colors: [{ value: 'silver', label: '银色', confidence: 0.88 }],
      brands: [{ value: 'apple', label: 'Apple', confidence: 0.92 }],
      category: { value: 'laptop', label: '笔记本电脑', confidence: 0.9 }
    }
  },
  {
    type: 'lost',
    title: '丢失黑色iPhone手机',
    description: '在操场跑步时丢失黑色iPhone 14 Pro一部，手机壳是蓝色的。手机内有重要照片和资料，求好心人归还，必有重谢！',
    itemType: 'electronics',
    location: 'playground',
    date: '2026-06-11',
    contact: '陈同学',
    phone: '13800138004',
    userName: '丢手机的小陈',
    userAvatar: '',
    images: ['https://picsum.photos/seed/iphone/600/600'],
    reward: '800元酬金',
    status: 'active',
    aiTags: {
      colors: [{ value: 'black', label: '黑色', confidence: 0.95 }, { value: 'blue', label: '蓝色', confidence: 0.7 }],
      brands: [{ value: 'apple', label: 'Apple', confidence: 0.9 }],
      category: { value: 'phone', label: '手机', confidence: 0.93 }
    }
  },
  {
    type: 'found',
    title: '捡到一部黑色手机',
    description: '在操场看台上捡到一部黑色手机，好像是iPhone。手机已经没电了，充好电后等待失主联系。',
    itemType: 'electronics',
    location: 'playground',
    date: '2026-06-11',
    contact: '孙同学',
    phone: '13800138012',
    userName: '运动达人小孙',
    userAvatar: '',
    images: ['https://picsum.photos/seed/phone2/600/600'],
    status: 'active',
    aiTags: {
      colors: [{ value: 'black', label: '黑色', confidence: 0.88 }],
      brands: [{ value: 'apple', label: 'Apple', confidence: 0.75 }],
      category: { value: 'phone', label: '手机', confidence: 0.9 }
    }
  },
  {
    type: 'lost',
    title: '寻找蓝色水壶',
    description: '昨天在体育馆丢失一个蓝色Nike运动水壶，壶身有白色logo。用了很久有感情了，希望能找回！',
    itemType: 'daily',
    location: 'gym',
    date: '2026-06-09',
    contact: '周同学',
    phone: '13800138005',
    userName: '爱运动的小周',
    userAvatar: '',
    images: ['https://picsum.photos/seed/bottle/600/600'],
    reward: '100元酬金',
    status: 'active',
    aiTags: {
      colors: [{ value: 'blue', label: '蓝色', confidence: 0.92 }, { value: 'white', label: '白色', confidence: 0.7 }],
      brands: [{ value: 'nike', label: 'Nike', confidence: 0.85 }],
      category: { value: 'bottle', label: '水壶', confidence: 0.88 }
    }
  },
  {
    type: 'found',
    title: '捡到蓝色运动水壶',
    description: '在体育馆更衣室捡到一个蓝色运动水壶，上面有Nike的标志。看起来挺新的，希望失主快点来认领。',
    itemType: 'daily',
    location: 'gym',
    date: '2026-06-09',
    contact: '吴同学',
    phone: '13800138013',
    userName: '健身小吴',
    userAvatar: '',
    images: ['https://picsum.photos/seed/bottle2/600/600'],
    status: 'active',
    aiTags: {
      colors: [{ value: 'blue', label: '蓝色', confidence: 0.9 }],
      brands: [{ value: 'nike', label: 'Nike', confidence: 0.88 }],
      category: { value: 'bottle', label: '水壶', confidence: 0.85 }
    }
  },
  {
    type: 'lost',
    title: '丢失棕色双肩包',
    description: '在图书馆一楼大厅丢失棕色Adidas双肩包一个，包内有课本、笔记本和一副耳机。对我很重要，求好心人归还！',
    itemType: 'bag',
    location: 'library',
    date: '2026-06-07',
    contact: '郑同学',
    phone: '13800138006',
    userName: '考研党小郑',
    userAvatar: '',
    images: ['https://picsum.photos/seed/backpack/600/600'],
    reward: '300元酬金',
    status: 'active',
    aiTags: {
      colors: [{ value: 'brown', label: '棕色', confidence: 0.9 }],
      brands: [{ value: 'adidas', label: 'Adidas', confidence: 0.85 }],
      category: { value: 'backpack', label: '双肩包', confidence: 0.92 }
    }
  },
  {
    type: 'found',
    title: '捡到棕色双肩包',
    description: '在图书馆角落发现一个棕色双肩包，看样子是阿迪达斯的。已经交给图书馆服务台了，失主可以去认领。',
    itemType: 'bag',
    location: 'library',
    date: '2026-06-07',
    contact: '冯同学',
    phone: '13800138014',
    userName: '爱学习的小冯',
    userAvatar: '',
    images: ['https://picsum.photos/seed/backpack2/600/600'],
    status: 'active',
    aiTags: {
      colors: [{ value: 'brown', label: '棕色', confidence: 0.87 }],
      brands: [{ value: 'adidas', label: 'Adidas', confidence: 0.8 }],
      category: { value: 'backpack', label: '双肩包', confidence: 0.9 }
    }
  },
  {
    type: 'lost',
    title: '寻找红色雨伞',
    description: '今天下雨在食堂丢失一把红色长柄雨伞，伞面上有白色小花图案。是妈妈送我的礼物，非常重要！',
    itemType: 'daily',
    location: 'canteen',
    date: '2026-06-12',
    contact: '许同学',
    phone: '13800138007',
    userName: '念旧的小许',
    userAvatar: '',
    images: ['https://picsum.photos/seed/umbrella/600/600'],
    reward: '50元酬金',
    status: 'active',
    aiTags: {
      colors: [{ value: 'red', label: '红色', confidence: 0.95 }, { value: 'white', label: '白色', confidence: 0.65 }],
      brands: [],
      category: { value: 'umbrella', label: '雨伞', confidence: 0.9 }
    }
  },
  {
    type: 'found',
    title: '捡到一把红色雨伞',
    description: '在食堂门口捡到一把红色长柄伞，看起来挺好看的。下雨天丢伞的人肯定很着急，赶快来认领吧！',
    itemType: 'daily',
    location: 'canteen',
    date: '2026-06-12',
    contact: '蒋同学',
    phone: '13800138015',
    userName: '热心小蒋',
    userAvatar: '',
    images: ['https://picsum.photos/seed/umbrella2/600/600'],
    status: 'active',
    aiTags: {
      colors: [{ value: 'red', label: '红色', confidence: 0.92 }],
      brands: [],
      category: { value: 'umbrella', label: '雨伞', confidence: 0.88 }
    }
  },
  {
    type: 'lost',
    title: '丢失白色无线耳机',
    description: '在教学楼走廊丢失一副白色AirPods Pro，充电盒上有贴纸。刚买不久，非常心疼，求好心人归还！',
    itemType: 'electronics',
    location: 'classroom',
    date: '2026-06-06',
    contact: '蔡同学',
    phone: '13800138008',
    userName: '音乐爱好者小蔡',
    userAvatar: '',
    images: ['https://picsum.photos/seed/airpods/600/600'],
    reward: '400元酬金',
    status: 'active',
    aiTags: {
      colors: [{ value: 'white', label: '白色', confidence: 0.93 }],
      brands: [{ value: 'apple', label: 'Apple', confidence: 0.88 }],
      category: { value: 'earphones', label: '耳机', confidence: 0.9 }
    }
  },
  {
    type: 'found',
    title: '捡到白色耳机',
    description: '在教学楼卫生间洗手台捡到一副白色无线耳机，看起来像是AirPods。已经妥善保管，失主请联系。',
    itemType: 'electronics',
    location: 'classroom',
    date: '2026-06-06',
    contact: '贾同学',
    phone: '13800138016',
    userName: '细心的小贾',
    userAvatar: '',
    images: ['https://picsum.photos/seed/earphones2/600/600'],
    status: 'active',
    aiTags: {
      colors: [{ value: 'white', label: '白色', confidence: 0.9 }],
      brands: [{ value: 'apple', label: 'Apple', confidence: 0.78 }],
      category: { value: 'earphones', label: '耳机', confidence: 0.87 }
    }
  },
  {
    type: 'lost',
    title: '寻找绿色校园卡',
    description: '昨天在宿舍区丢失绿色校园卡一张，卡号2023xxxx。补办很麻烦，希望捡到的同学能还给我，谢谢！',
    itemType: 'card',
    location: 'dormitory',
    date: '2026-06-10',
    contact: '丁同学',
    phone: '13800138009',
    userName: '马大哈小丁',
    userAvatar: '',
    images: ['https://picsum.photos/seed/card/600/600'],
    reward: '20元酬金',
    status: 'active',
    aiTags: {
      colors: [{ value: 'green', label: '绿色', confidence: 0.95 }],
      brands: [],
      category: { value: 'card', label: '卡片证件', confidence: 0.92 }
    }
  },
  {
    type: 'found',
    title: '捡到一张校园卡',
    description: '在宿舍区楼下捡到一张校园卡，看起来是绿色的。已经交到宿管阿姨那里了，失主可以去认领。',
    itemType: 'card',
    location: 'dormitory',
    date: '2026-06-10',
    contact: '魏同学',
    phone: '13800138017',
    userName: '好邻居小魏',
    userAvatar: '',
    images: ['https://picsum.photos/seed/card2/600/600'],
    status: 'active',
    aiTags: {
      colors: [{ value: 'green', label: '绿色', confidence: 0.9 }],
      brands: [],
      category: { value: 'card', label: '卡片证件', confidence: 0.88 }
    }
  },
  {
    type: 'lost',
    title: '丢失黑色眼镜',
    description: '在实验楼丢失一副黑色框眼镜，品牌是雷朋。度数很高，没有眼镜生活不能自理，求归还！',
    itemType: 'other',
    location: 'laboratory',
    date: '2026-06-05',
    contact: '薛同学',
    phone: '13800138018',
    userName: '高度近视小薛',
    userAvatar: '',
    images: ['https://picsum.photos/seed/glasses/600/600'],
    reward: '200元酬金',
    status: 'active',
    aiTags: {
      colors: [{ value: 'black', label: '黑色', confidence: 0.92 }],
      brands: [{ value: 'rayban', label: 'Ray-Ban', confidence: 0.8 }],
      category: { value: 'glasses', label: '眼镜', confidence: 0.9 }
    }
  },
  {
    type: 'found',
    title: '捡到一副黑框眼镜',
    description: '在实验楼教室捡到一副黑色边框的眼镜，看起来挺贵的。已经放在实验室管理处了。',
    itemType: 'other',
    location: 'laboratory',
    date: '2026-06-05',
    contact: '叶同学',
    phone: '13800138019',
    userName: '实验达人小叶',
    userAvatar: '',
    images: ['https://picsum.photos/seed/glasses2/600/600'],
    status: 'active',
    aiTags: {
      colors: [{ value: 'black', label: '黑色', confidence: 0.88 }],
      brands: [],
      category: { value: 'glasses', label: '眼镜', confidence: 0.85 }
    }
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
    typeText: '取快递',
    pickupPoint: 'cainiao',
    pickupPointText: '菜鸟驿站',
    pickupCode: '5-8-1234',
    bounty: 3,
    deadline: Date.now() + 2 * 3600000,
    pickupLocation: '菜鸟驿站（南门）',
    deliveryLocation: '梅苑3栋 512室',
    contactPhone: '13800138001',
    remark: '稍大件，请小心轻放',
    status: 'pending',
    userId: 'test_user',
    userName: '小明',
    userAvatar: '',
    escrowStatus: 'frozen',
    distance: 800
  },
  {
    type: 'express',
    typeText: '取快递',
    pickupPoint: 'sf',
    pickupPointText: '顺丰速运',
    pickupCode: 'SF2026061001',
    bounty: 5,
    deadline: Date.now() + 3600000,
    pickupLocation: '顺丰速运（北门）',
    deliveryLocation: '兰苑2栋 308室',
    contactPhone: '13900139002',
    remark: '',
    status: 'accepted',
    userId: 'other_user_1',
    userName: '小红',
    userAvatar: '',
    runnerId: 'test_user',
    runnerName: '张同学',
    runnerAvatar: '',
    acceptedTime: Date.now() - 1800000,
    escrowStatus: 'frozen',
    distance: 600
  },
  {
    type: 'purchase',
    typeText: '代买',
    purchaseCategory: 'drink',
    purchaseCategoryText: '奶茶饮品',
    purchaseItem: '一杯珍珠奶茶（少糖少冰）+一杯柠檬水',
    bounty: 8,
    deadline: Date.now() + 3600000,
    pickupLocation: '一点点（大学城店）',
    deliveryLocation: '竹苑1栋 201室',
    contactPhone: '13700137004',
    remark: '请确认是少糖少冰',
    status: 'in_progress',
    userId: 'other_user_2',
    userName: '小李',
    userAvatar: '',
    runnerId: 'test_user',
    runnerName: '张同学',
    runnerAvatar: '',
    acceptedTime: Date.now() - 2400000,
    startedTime: Date.now() - 1200000,
    escrowStatus: 'frozen',
    distance: 400
  },
  {
    type: 'delivery',
    typeText: '代送',
    deliveryItem: '一本《高等数学》教材',
    bounty: 4,
    deadline: Date.now() + 3 * 3600000,
    pickupLocation: '梅苑3栋 512室',
    deliveryLocation: '图书馆二楼自习区',
    contactPhone: '13800138001',
    remark: '教材借给同学，请放图书馆前台',
    status: 'completed',
    userId: 'test_user',
    userName: '小明',
    userAvatar: '',
    runnerId: 'other_user_1',
    runnerName: '小红',
    runnerAvatar: '',
    acceptedTime: Date.now() - 86400000 * 2,
    startedTime: Date.now() - 86400000 * 2 + 1800000,
    completedTime: Date.now() - 86400000 * 2 + 3600000,
    escrowStatus: 'released',
    publisherRating: { score: 5, tags: ['fast', 'polite'], comment: '非常快，态度好' },
    runnerRating: { score: 5, tags: ['communicate'], comment: '交代得很清楚' },
    distance: 500
  },
  {
    type: 'queue',
    typeText: '代排队',
    queueLocation: '第二食堂（麻辣香锅窗口）',
    queuePurpose: '买麻辣香锅',
    bounty: 6,
    deadline: Date.now() + 1800000,
    pickupLocation: '第二食堂门口',
    deliveryLocation: '梅苑3栋楼下',
    contactPhone: '13500135006',
    remark: '两份，一份微辣一份中辣，到楼下打电话',
    status: 'pending',
    userId: 'other_user_3',
    userName: '小芳',
    userAvatar: '',
    escrowStatus: 'frozen',
    distance: 300
  },
  {
    type: 'other',
    typeText: '其他',
    otherDesc: '帮忙到教务处取一份成绩单',
    bounty: 10,
    deadline: Date.now() + 4 * 3600000,
    pickupLocation: '行政楼 教务处201',
    deliveryLocation: '梅苑3栋 512室',
    contactPhone: '13800138001',
    remark: '已和老师沟通过，报我名字即可领取',
    status: 'pending',
    userId: 'test_user',
    userName: '小明',
    userAvatar: '',
    escrowStatus: 'frozen',
    distance: 1200
  },
  {
    type: 'express',
    typeText: '取快递',
    pickupPoint: 'jd',
    pickupPointText: '京东快递',
    pickupCode: 'JD2026060988',
    bounty: 2,
    deadline: Date.now() + 3600000,
    pickupLocation: '京东快递（东门）',
    deliveryLocation: '竹苑1栋 201室',
    contactPhone: '13600136005',
    remark: '小件',
    status: 'completed',
    userId: 'test_user',
    userName: '小明',
    userAvatar: '',
    runnerId: 'other_user_2',
    runnerName: '小李',
    runnerAvatar: '',
    acceptedTime: Date.now() - 86400000 * 3,
    startedTime: Date.now() - 86400000 * 3 + 600000,
    completedTime: Date.now() - 86400000 * 3 + 2400000,
    escrowStatus: 'released',
    publisherRating: { score: 4, tags: ['punctual'], comment: '还行' },
    runnerRating: { score: 5, tags: ['polite', 'communicate'], comment: '发布者说明很清楚' },
    distance: 900
  },
  {
    type: 'purchase',
    typeText: '代买',
    purchaseCategory: 'food',
    purchaseCategoryText: '餐饮美食',
    purchaseItem: '黄焖鸡米饭（大份，加蛋）',
    bounty: 5,
    deadline: Date.now() - 3600000,
    pickupLocation: '第一食堂 黄焖鸡窗口',
    deliveryLocation: '兰苑2栋 308室',
    contactPhone: '13900139002',
    remark: '大份加蛋，多放辣椒',
    status: 'timeout',
    userId: 'other_user_1',
    userName: '小红',
    userAvatar: '',
    escrowStatus: 'refunded',
    distance: 350
  },
  {
    type: 'delivery',
    typeText: '代送',
    deliveryItem: '一个保温杯',
    bounty: 3,
    deadline: Date.now() + 5 * 3600000,
    pickupLocation: '兰苑2栋 308室',
    deliveryLocation: '教学楼B栋302',
    contactPhone: '13900139002',
    remark: '杯子里有热水，注意别洒了',
    status: 'accepted',
    userId: 'other_user_1',
    userName: '小红',
    userAvatar: '',
    runnerId: 'test_user',
    runnerName: '张同学',
    runnerAvatar: '',
    acceptedTime: Date.now() - 600000,
    escrowStatus: 'frozen',
    distance: 700
  },
  {
    type: 'purchase',
    typeText: '代买',
    purchaseCategory: 'fruit',
    purchaseCategoryText: '水果生鲜',
    purchaseItem: '2斤草莓 + 1斤车厘子',
    bounty: 5,
    deadline: Date.now() + 2 * 3600000,
    pickupLocation: '校门口水果店',
    deliveryLocation: '竹苑1栋 201室',
    contactPhone: '13600136005',
    remark: '挑新鲜一点的',
    status: 'pending',
    userId: 'other_user_4',
    userName: '小华',
    userAvatar: '',
    escrowStatus: 'frozen',
    distance: 1500
  },
  {
    type: 'queue',
    typeText: '代排队',
    queueLocation: '图书馆（占座）',
    queuePurpose: '占一个自习座位',
    bounty: 8,
    deadline: Date.now() + 7200000,
    pickupLocation: '图书馆三楼自习区',
    deliveryLocation: '图书馆三楼自习区',
    contactPhone: '13700137004',
    remark: '帮忙占个靠窗的位置，8点到',
    status: 'pending',
    userId: 'other_user_5',
    userName: '小丽',
    userAvatar: '',
    escrowStatus: 'frozen',
    distance: 1000
  },
  {
    type: 'cancelled',
    typeText: '取快递',
    pickupPoint: 'yt',
    pickupPointText: '圆通快递',
    pickupCode: 'YT2026060501',
    bounty: 3,
    deadline: Date.now() - 2 * 3600000,
    pickupLocation: '圆通快递（西门）',
    deliveryLocation: '梅苑3栋 512室',
    contactPhone: '13800138001',
    remark: '',
    status: 'cancelled',
    userId: 'test_user',
    userName: '小明',
    userAvatar: '',
    escrowStatus: 'refunded',
    cancelReason: '不需要了',
    distance: 600
  }
];

const MOCK_ERRAND_RUNNERS = [
  {
    id: 'test_user',
    name: '张同学',
    avatar: '',
    creditScore: 92,
    totalOrders: 45,
    completedOrders: 42,
    goodRate: 95,
    violationCount: 0,
    level: 'good'
  },
  {
    id: 'other_user_1',
    name: '小红',
    avatar: '',
    creditScore: 88,
    totalOrders: 32,
    completedOrders: 30,
    goodRate: 93,
    violationCount: 0,
    level: 'good'
  },
  {
    id: 'other_user_2',
    name: '小李',
    avatar: '',
    creditScore: 75,
    totalOrders: 20,
    completedOrders: 16,
    goodRate: 80,
    violationCount: 2,
    level: 'normal'
  },
  {
    id: 'other_user_3',
    name: '小芳',
    avatar: '',
    creditScore: 98,
    totalOrders: 56,
    completedOrders: 55,
    goodRate: 98,
    violationCount: 0,
    level: 'excellent'
  }
];

const MOCK_ERRAND_VIOLATIONS = [
  {
    userId: 'other_user_2',
    type: 'cancel_frequently',
    typeText: '频繁取消',
    orderId: 'mock_errand_v1',
    time: Date.now() - 7 * 86400000,
    desc: '7天内取消订单3次'
  },
  {
    userId: 'other_user_2',
    type: 'timeout',
    typeText: '超时未完成',
    orderId: 'mock_errand_v2',
    time: Date.now() - 14 * 86400000,
    desc: '接单后超时未完成任务'
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

const MOCK_POI_LIST = [
  {
    name: '第一教学楼',
    category: 'classroom',
    description: '主教学楼，共6层，包含多媒体教室、实验室等。主要用于公共基础课程教学。',
    address: '校园东区',
    latitude: 39.908823,
    longitude: 116.397470,
    x: 25,
    y: 35,
    buildingNumber: '教1',
    floors: 6,
    openTime: '7:00-22:00',
    facilities: ['电梯', 'WiFi', '饮水机', '自习室'],
    contact: '010-12345101',
    images: ['https://picsum.photos/seed/class1/600/400'],
    rating: 4.5,
    isHighlight: false
  },
  {
    name: '第二教学楼',
    category: 'classroom',
    description: '理工科教学楼，配备现代化教学设备，主要用于理工科专业课程。',
    address: '校园中区',
    latitude: 39.909123,
    longitude: 116.396870,
    x: 45,
    y: 40,
    buildingNumber: '教2',
    floors: 8,
    openTime: '7:00-22:00',
    facilities: ['电梯', 'WiFi', '实验室', '机房'],
    contact: '010-12345102',
    images: ['https://picsum.photos/seed/class2/600/400'],
    rating: 4.6,
    isHighlight: false
  },
  {
    name: '第三教学楼',
    category: 'classroom',
    description: '文科教学楼，包含阶梯教室、研讨室等，主要用于文科专业课程。',
    address: '校园西区',
    latitude: 39.908523,
    longitude: 116.396270,
    x: 65,
    y: 38,
    buildingNumber: '教3',
    floors: 5,
    openTime: '7:00-22:00',
    facilities: ['电梯', 'WiFi', '研讨室', '阶梯教室'],
    contact: '010-12345103',
    images: ['https://picsum.photos/seed/class3/600/400'],
    rating: 4.3,
    isHighlight: false
  },
  {
    name: '第一食堂',
    category: 'canteen',
    description: '大众食堂，菜品丰富，价格实惠。提供早餐、午餐、晚餐，有各地风味小吃。',
    address: '生活区1号',
    latitude: 39.907823,
    longitude: 116.397170,
    x: 30,
    y: 60,
    buildingNumber: '食1',
    floors: 2,
    openTime: '6:30-21:00',
    facilities: ['空调', 'WiFi', '充电宝', '洗手台'],
    contact: '010-12345201',
    images: ['https://picsum.photos/seed/canteen1/600/400'],
    rating: 4.4,
    isHighlight: false
  },
  {
    name: '第二食堂',
    category: 'canteen',
    description: '特色食堂，提供各地特色美食，清真窗口、麻辣香锅、汉堡炸鸡等。',
    address: '生活区2号',
    latitude: 39.907523,
    longitude: 116.396570,
    x: 50,
    y: 62,
    buildingNumber: '食2',
    floors: 3,
    openTime: '6:30-22:00',
    facilities: ['空调', 'WiFi', '清真窗口', '水吧'],
    contact: '010-12345202',
    images: ['https://picsum.photos/seed/canteen2/600/400'],
    rating: 4.7,
    isHighlight: false
  },
  {
    name: '梅苑宿舍',
    category: 'dormitory',
    description: '本科生女生宿舍，4人间，上床下桌，独立卫浴。24小时热水供应。',
    address: '生活区梅苑',
    latitude: 39.907223,
    longitude: 116.397870,
    x: 20,
    y: 70,
    buildingNumber: '梅1',
    floors: 12,
    openTime: '24小时',
    facilities: ['空调', 'WiFi', '洗衣机', '饮水机', '自习室'],
    contact: '010-12345301',
    images: ['https://picsum.photos/seed/dorm1/600/400'],
    rating: 4.2,
    isHighlight: false
  },
  {
    name: '兰苑宿舍',
    category: 'dormitory',
    description: '本科生男生宿舍，4人间，上床下桌，公共卫浴。每层配有公共浴室。',
    address: '生活区兰苑',
    latitude: 39.907023,
    longitude: 116.396970,
    x: 40,
    y: 72,
    buildingNumber: '兰1',
    floors: 12,
    openTime: '24小时',
    facilities: ['空调', 'WiFi', '洗衣机', '饮水机', '健身房'],
    contact: '010-12345302',
    images: ['https://picsum.photos/seed/dorm2/600/400'],
    rating: 4.0,
    isHighlight: false
  },
  {
    name: '竹苑宿舍',
    category: 'dormitory',
    description: '研究生宿舍，2人间，独立卫浴，环境安静。适合学习和休息。',
    address: '生活区竹苑',
    latitude: 39.906823,
    longitude: 116.396070,
    x: 60,
    y: 70,
    buildingNumber: '竹1',
    floors: 15,
    openTime: '24小时',
    facilities: ['空调', 'WiFi', '洗衣机', '饮水机', '独立卫浴'],
    contact: '010-12345303',
    images: ['https://picsum.photos/seed/dorm3/600/400'],
    rating: 4.8,
    isHighlight: false
  },
  {
    name: '图书馆',
    category: 'library',
    description: '现代化图书馆，藏书300万册，电子资源丰富。配备自习室、研讨室、电子阅览室。',
    address: '校园中心区',
    latitude: 39.909000,
    longitude: 116.397200,
    x: 35,
    y: 25,
    buildingNumber: '图书馆',
    floors: 10,
    openTime: '7:00-22:30',
    facilities: ['电梯', 'WiFi', '自习室', '研讨室', '电子阅览室', '咖啡吧'],
    contact: '010-12345600',
    images: ['https://picsum.photos/seed/library_map/600/400'],
    rating: 4.9,
    isHighlight: false
  },
  {
    name: '菜鸟驿站',
    category: 'express',
    description: '综合快递服务点，支持各大快递公司的寄取件服务。提供智能快递柜。',
    address: '生活服务中心1层',
    latitude: 39.907600,
    longitude: 116.397500,
    x: 35,
    y: 55,
    buildingNumber: '服务中心',
    floors: 1,
    openTime: '8:00-21:00',
    facilities: ['智能柜', '扫码取件', '寄件服务', '打包服务'],
    contact: '010-12345701',
    images: ['https://picsum.photos/seed/express1/600/400'],
    rating: 4.1,
    isHighlight: false
  },
  {
    name: '京东快递点',
    category: 'express',
    description: '京东专属快递服务点，提供京东物流的配送和寄件服务。',
    address: '生活服务中心2层',
    latitude: 39.907700,
    longitude: 116.397300,
    x: 38,
    y: 54,
    buildingNumber: '服务中心',
    floors: 1,
    openTime: '9:00-20:00',
    facilities: ['京东配送', '货到付款', '退换货服务'],
    contact: '010-12345702',
    images: ['https://picsum.photos/seed/express2/600/400'],
    rating: 4.3,
    isHighlight: false
  },
  {
    name: '学子打印社',
    category: 'print',
    description: '校园内最大的打印店，提供打印、复印、扫描、装订等服务。学生享8折优惠。',
    address: '商业街12号',
    latitude: 39.908200,
    longitude: 116.398000,
    x: 15,
    y: 50,
    buildingNumber: '商业街',
    floors: 1,
    openTime: '8:00-22:00',
    facilities: ['彩色打印', '装订服务', '扫描', '照片打印', '学生证优惠'],
    contact: '010-12345801',
    images: ['https://picsum.photos/seed/print1/600/400'],
    rating: 4.5,
    isHighlight: false
  },
  {
    name: '快印通打印店',
    category: 'print',
    description: '24小时自助打印服务，支持手机扫码打印，方便快捷。',
    address: '第一教学楼1层',
    latitude: 39.908900,
    longitude: 116.397600,
    x: 27,
    y: 37,
    buildingNumber: '教1',
    floors: 1,
    openTime: '24小时',
    facilities: ['自助打印', '扫码支付', '彩色打印', 'U盘打印'],
    contact: '010-12345802',
    images: ['https://picsum.photos/seed/print2/600/400'],
    rating: 4.6,
    isHighlight: false
  },
  {
    name: '校医务室',
    category: 'medical',
    description: '校园综合医疗服务中心，提供常见病诊疗、健康体检、疫苗接种等服务。',
    address: '校园北区',
    latitude: 39.910000,
    longitude: 116.397000,
    x: 45,
    y: 15,
    buildingNumber: '医务楼',
    floors: 4,
    openTime: '24小时急诊, 8:00-17:30门诊',
    facilities: ['急诊', '门诊', '药房', '输液室', '化验室', '救护车'],
    contact: '010-12345900',
    images: ['https://picsum.photos/seed/medical/600/400'],
    rating: 4.2,
    isHighlight: false
  },
  {
    name: '体育馆',
    category: 'other',
    description: '综合性体育馆，包含篮球场、羽毛球场、乒乓球馆、健身房、游泳馆等。',
    address: '校园南区',
    latitude: 39.906500,
    longitude: 116.397800,
    x: 30,
    y: 80,
    buildingNumber: '体育馆',
    floors: 3,
    openTime: '6:00-22:00',
    facilities: ['篮球场', '羽毛球场', '乒乓球', '健身房', '游泳馆', '更衣室'],
    contact: '010-12345950',
    images: ['https://picsum.photos/seed/gym/600/400'],
    rating: 4.7,
    isHighlight: false
  },
  {
    name: '行政楼',
    category: 'other',
    description: '学校行政管理中心，各职能部门办公地点。包括教务处、财务处、学生处等。',
    address: '校园北区',
    latitude: 39.909800,
    longitude: 116.396500,
    x: 55,
    y: 18,
    buildingNumber: '行政楼',
    floors: 8,
    openTime: '8:30-17:30',
    facilities: ['电梯', 'WiFi', '会议室', '接待室'],
    contact: '010-12345000',
    images: ['https://picsum.photos/seed/admin/600/400'],
    rating: 4.0,
    isHighlight: false
  },
  {
    name: '大学生活动中心',
    category: 'other',
    description: '学生社团活动主要场所，包含多功能厅、社团办公室、活动室等。',
    address: '校园中区',
    latitude: 39.908600,
    longitude: 116.397500,
    x: 30,
    y: 45,
    buildingNumber: '活动中心',
    floors: 5,
    openTime: '8:00-22:00',
    facilities: ['多功能厅', '社团办公室', '活动室', '舞台', '音响设备'],
    contact: '010-12345010',
    images: ['https://picsum.photos/seed/activity/600/400'],
    rating: 4.5,
    isHighlight: false
  },
  {
    name: '南门（正门）',
    category: 'other',
    description: '学校正门，新生报到、访客登记的主要入口。设有安保岗亭和接待处。',
    address: '校园南侧',
    latitude: 39.906000,
    longitude: 116.397200,
    x: 40,
    y: 85,
    buildingNumber: '南门',
    floors: 1,
    openTime: '24小时',
    facilities: ['安保岗亭', '接待处', '无障碍通道'],
    contact: '010-12345020',
    images: ['https://picsum.photos/seed/gate/600/400'],
    rating: 4.3,
    isHighlight: true
  },
  {
    name: '新生报到处',
    category: 'other',
    description: '新生入学报到注册的指定地点。报到期间开放，提供一站式服务。',
    address: '体育馆1层',
    latitude: 39.906600,
    longitude: 116.398000,
    x: 32,
    y: 78,
    buildingNumber: '体育馆',
    floors: 1,
    openTime: '报到期间 8:00-18:00',
    facilities: ['注册区', '缴费区', '咨询台', '休息区', '饮水处'],
    contact: '010-12345030',
    images: ['https://picsum.photos/seed/register/600/400'],
    rating: 4.8,
    isHighlight: true
  }
];

const MOCK_ROUTES = [
  {
    id: 'route1',
    name: '南门到图书馆',
    startPoint: { name: '南门', x: 40, y: 85 },
    endPoint: { name: '图书馆', x: 35, y: 25 },
    distance: 850,
    duration: 12,
    path: [
      { x: 40, y: 85 },
      { x: 40, y: 75 },
      { x: 35, y: 65 },
      { x: 35, y: 55 },
      { x: 35, y: 45 },
      { x: 35, y: 35 },
      { x: 35, y: 25 }
    ],
    instructions: [
      { step: 1, text: '从南门进入校园', direction: '直行', distance: 100 },
      { step: 2, text: '沿中央大道向北直行', direction: '直行', distance: 400 },
      { step: 3, text: '经过第一食堂后继续前行', direction: '直行', distance: 200 },
      { step: 4, text: '在图书馆前路口右转', direction: '右转', distance: 50 },
      { step: 5, text: '到达图书馆正门', direction: '到达', distance: 0 }
    ]
  },
  {
    id: 'route2',
    name: '梅苑宿舍到第一教学楼',
    startPoint: { name: '梅苑宿舍', x: 20, y: 70 },
    endPoint: { name: '第一教学楼', x: 25, y: 35 },
    distance: 650,
    duration: 9,
    path: [
      { x: 20, y: 70 },
      { x: 25, y: 65 },
      { x: 25, y: 55 },
      { x: 25, y: 45 },
      { x: 25, y: 35 }
    ],
    instructions: [
      { step: 1, text: '从梅苑宿舍出发', direction: '出发', distance: 0 },
      { step: 2, text: '向东走到主路', direction: '右转', distance: 80 },
      { step: 3, text: '沿主路向北直行', direction: '直行', distance: 450 },
      { step: 4, text: '到达第一教学楼', direction: '到达', distance: 0 }
    ]
  },
  {
    id: 'route3',
    name: '图书馆到第二食堂',
    startPoint: { name: '图书馆', x: 35, y: 25 },
    endPoint: { name: '第二食堂', x: 50, y: 62 },
    distance: 720,
    duration: 10,
    path: [
      { x: 35, y: 25 },
      { x: 45, y: 30 },
      { x: 45, y: 40 },
      { x: 45, y: 50 },
      { x: 48, y: 58 },
      { x: 50, y: 62 }
    ],
    instructions: [
      { step: 1, text: '从图书馆出发', direction: '出发', distance: 0 },
      { step: 2, text: '向东走到第二教学楼', direction: '左转', distance: 120 },
      { step: 3, text: '沿道路向南直行', direction: '直行', distance: 400 },
      { step: 4, text: '在路口左转向东', direction: '左转', distance: 100 },
      { step: 5, text: '到达第二食堂', direction: '到达', distance: 0 }
    ]
  },
  {
    id: 'route4',
    name: '新生报到路线',
    startPoint: { name: '南门', x: 40, y: 85 },
    endPoint: { name: '新生报到处', x: 32, y: 78 },
    distance: 300,
    duration: 5,
    path: [
      { x: 40, y: 85 },
      { x: 40, y: 82 },
      { x: 35, y: 80 },
      { x: 32, y: 78 }
    ],
    instructions: [
      { step: 1, text: '从南门进入校园', direction: '直行', distance: 50 },
      { step: 2, text: '跟随迎新指示牌向西', direction: '左转', distance: 150 },
      { step: 3, text: '到达体育馆新生报到处', direction: '到达', distance: 0 }
    ]
  }
];

const ORIENTATION_GUIDE = [
  { poiName: '图书馆', direction: 'portrait', angle: 0, distance: 200, description: '正前方200米是图书馆，共10层的现代化建筑' },
  { poiName: '第一教学楼', direction: 'right_front', angle: 45, distance: 350, description: '右前方350米是第一教学楼' },
  { poiName: '第二食堂', direction: 'right', angle: 90, distance: 500, description: '右侧500米是第二食堂' },
  { poiName: '梅苑宿舍', direction: 'right_back', angle: 135, distance: 600, description: '右后方600米是梅苑女生宿舍' },
  { poiName: '体育馆', direction: 'back', angle: 180, distance: 700, description: '正后方700米是体育馆' },
  { poiName: '兰苑宿舍', direction: 'left_back', angle: 225, distance: 650, description: '左后方650米是兰苑男生宿舍' },
  { poiName: '菜鸟驿站', direction: 'left', angle: 270, distance: 400, description: '左侧400米是菜鸟驿站' },
  { poiName: '医务室', direction: 'left_front', angle: 315, distance: 450, description: '左前方450米是校医务室' }
];

const FRESHMAN_REGISTRATION_FLOW = [
  {
    step: 1,
    title: '抵达学校',
    description: '按照录取通知书上的报到日期抵达学校。学校在火车站、汽车站设有迎新接待站，有校车接送。',
    icon: '🚗',
    keyPoint: '南门（正门）',
    poiName: '南门（正门）',
    tips: ['提前查好交通路线', '保存好迎新工作人员联系方式', '贵重物品随身携带'],
    isKeyPoint: true
  },
  {
    step: 2,
    title: '身份验证',
    description: '到体育馆新生报到处进行身份验证，提交录取通知书、身份证、准考证等材料。',
    icon: '📋',
    keyPoint: '新生报到处',
    poiName: '新生报到处',
    tips: ['提前准备好所有材料的原件和复印件', '按照学院指引到对应窗口办理', '保存好所有回执单'],
    isKeyPoint: true
  },
  {
    step: 3,
    title: '缴纳费用',
    description: '办理学费、住宿费缴纳手续。可以选择线上支付或现场刷卡。已完成助学贷款的同学走绿色通道。',
    icon: '💳',
    keyPoint: '新生报到处',
    poiName: '新生报到处',
    tips: ['保存好缴费凭证', '申请助学贷款的同学提前准备好材料', '了解退费政策'],
    isKeyPoint: false
  },
  {
    step: 4,
    title: '领取物资',
    description: '领取校园卡、宿舍钥匙、军训服装、新生手册等物资。校园卡需要充值后才能使用。',
    icon: '🎁',
    keyPoint: '大学生活动中心',
    poiName: '大学生活动中心',
    tips: ['检查物资是否齐全', '校园卡立即充值', '仔细阅读新生手册'],
    isKeyPoint: true
  },
  {
    step: 5,
    title: '入住宿舍',
    description: '根据分配的宿舍号到对应宿舍楼办理入住。宿管阿姨会登记信息并发放门禁卡。',
    icon: '🏠',
    keyPoint: '各苑宿舍区',
    poiName: '梅苑宿舍',
    tips: ['检查宿舍设施是否完好', '熟悉宿舍管理制度', '认识新室友'],
    isKeyPoint: true
  },
  {
    step: 6,
    title: '开学典礼',
    description: '参加新生开学典礼，聆听校长讲话、师长寄语、学长学姐分享，开启大学生活新篇章。',
    icon: '🎓',
    keyPoint: '体育馆',
    poiName: '体育馆',
    tips: ['提前15分钟入场', '着装整齐', '可以拍照留念'],
    isKeyPoint: true
  }
];

const _firstExports = {
  ANNOUNCEMENTS,
  CAMPUS_NEWS,
  SCENERY_LIST,
  SCENERY_COLLECTIONS,
  SCENERY_USER_SUBMISSIONS,
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
  MOCK_ERRAND_RUNNERS,
  MOCK_ERRAND_VIOLATIONS,
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
  MOCK_FORUM_POSTS,
  MOCK_POI_LIST,
  MOCK_ROUTES,
  ORIENTATION_GUIDE,
  FRESHMAN_REGISTRATION_FLOW
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

const MOCK_COURSES = [
  {
    id: 'course_1',
    name: '高等数学',
    teacher: '张建国教授',
    classroom: 'A栋301',
    dayOfWeek: 1,
    startSlot: 1,
    endSlot: 2,
    colorIndex: 0,
    weeks: '1-16周',
    credit: 4,
    semester: '2025-2026-2'
  },
  {
    id: 'course_2',
    name: '大学英语',
    teacher: '李明华老师',
    classroom: 'B栋205',
    dayOfWeek: 1,
    startSlot: 3,
    endSlot: 4,
    colorIndex: 1,
    weeks: '1-16周',
    credit: 3,
    semester: '2025-2026-2'
  },
  {
    id: 'course_3',
    name: '数据结构',
    teacher: '王志强教授',
    classroom: 'E栋402',
    dayOfWeek: 1,
    startSlot: 5,
    endSlot: 6,
    colorIndex: 2,
    weeks: '1-14周',
    credit: 4,
    semester: '2025-2026-2'
  },
  {
    id: 'course_4',
    name: '线性代数',
    teacher: '陈美玲教授',
    classroom: 'A栋203',
    dayOfWeek: 2,
    startSlot: 1,
    endSlot: 2,
    colorIndex: 3,
    weeks: '1-16周',
    credit: 3,
    semester: '2025-2026-2'
  },
  {
    id: 'course_5',
    name: '毛泽东思想概论',
    teacher: '刘永红老师',
    classroom: 'C栋101',
    dayOfWeek: 2,
    startSlot: 3,
    endSlot: 4,
    colorIndex: 4,
    weeks: '1-16周',
    credit: 3,
    semester: '2025-2026-2'
  },
  {
    id: 'course_6',
    name: '计算机组成原理',
    teacher: '赵文博教授',
    classroom: 'E栋301',
    dayOfWeek: 2,
    startSlot: 7,
    endSlot: 8,
    colorIndex: 5,
    weeks: '1-14周',
    credit: 3,
    semester: '2025-2026-2'
  },
  {
    id: 'course_7',
    name: '程序设计基础',
    teacher: '王晓燕老师',
    classroom: 'E栋501',
    dayOfWeek: 3,
    startSlot: 1,
    endSlot: 2,
    colorIndex: 6,
    weeks: '1-16周',
    credit: 4,
    semester: '2025-2026-2'
  },
  {
    id: 'course_8',
    name: '大学物理',
    teacher: '孙立伟教授',
    classroom: 'D栋201',
    dayOfWeek: 3,
    startSlot: 3,
    endSlot: 4,
    colorIndex: 0,
    weeks: '1-14周',
    credit: 4,
    semester: '2025-2026-2'
  },
  {
    id: 'course_9',
    name: '概率论与数理统计',
    teacher: '黄丽华教授',
    classroom: 'A栋401',
    dayOfWeek: 3,
    startSlot: 5,
    endSlot: 6,
    colorIndex: 1,
    weeks: '1-16周',
    credit: 3,
    semester: '2025-2026-2'
  },
  {
    id: 'course_10',
    name: '体育',
    teacher: '周大强老师',
    classroom: '体育馆',
    dayOfWeek: 4,
    startSlot: 3,
    endSlot: 4,
    colorIndex: 7,
    weeks: '1-16周',
    credit: 2,
    semester: '2025-2026-2'
  },
  {
    id: 'course_11',
    name: '操作系统',
    teacher: '李伟东教授',
    classroom: 'E栋401',
    dayOfWeek: 4,
    startSlot: 5,
    endSlot: 6,
    colorIndex: 2,
    weeks: '1-14周',
    credit: 4,
    semester: '2025-2026-2'
  },
  {
    id: 'course_12',
    name: '离散数学',
    teacher: '吴雅琴教授',
    classroom: 'B栋303',
    dayOfWeek: 5,
    startSlot: 1,
    endSlot: 2,
    colorIndex: 3,
    weeks: '1-14周',
    credit: 3,
    semester: '2025-2026-2'
  },
  {
    id: 'course_13',
    name: '计算机网络',
    teacher: '郑海涛教授',
    classroom: 'E栋403',
    dayOfWeek: 5,
    startSlot: 5,
    endSlot: 6,
    colorIndex: 4,
    weeks: '1-16周',
    credit: 4,
    semester: '2025-2026-2'
  },
  {
    id: 'course_14',
    name: '数据库原理',
    teacher: '林丽娜老师',
    classroom: 'E栋305',
    dayOfWeek: 5,
    startSlot: 9,
    endSlot: 10,
    colorIndex: 5,
    weeks: '1-12周',
    credit: 3,
    semester: '2025-2026-2'
  }
];

const MOCK_EXAM_SCORES = [
  {
    id: 'score_1',
    courseName: '高等数学',
    semester: '2025-2026-1',
    score: 88,
    credit: 4,
    courseType: '必修',
    examType: '正常考试'
  },
  {
    id: 'score_2',
    courseName: '大学英语',
    semester: '2025-2026-1',
    score: 82,
    credit: 3,
    courseType: '必修',
    examType: '正常考试'
  },
  {
    id: 'score_3',
    courseName: '数据结构',
    semester: '2025-2026-1',
    score: 76,
    credit: 4,
    courseType: '必修',
    examType: '正常考试'
  },
  {
    id: 'score_4',
    courseName: '线性代数',
    semester: '2025-2026-1',
    score: 92,
    credit: 3,
    courseType: '必修',
    examType: '正常考试'
  },
  {
    id: 'score_5',
    courseName: '程序设计基础',
    semester: '2025-2026-1',
    score: 85,
    credit: 4,
    courseType: '必修',
    examType: '正常考试'
  },
  {
    id: 'score_6',
    courseName: '大学物理',
    semester: '2025-2026-1',
    score: 58,
    credit: 4,
    courseType: '必修',
    examType: '正常考试'
  },
  {
    id: 'score_7',
    courseName: '毛泽东思想概论',
    semester: '2025-2026-1',
    score: 79,
    credit: 3,
    courseType: '必修',
    examType: '正常考试'
  },
  {
    id: 'score_8',
    courseName: '体育',
    semester: '2025-2026-1',
    score: 86,
    credit: 2,
    courseType: '必修',
    examType: '正常考试'
  },
  {
    id: 'score_9',
    courseName: '离散数学',
    semester: '2024-2025-2',
    score: 73,
    credit: 3,
    courseType: '必修',
    examType: '正常考试'
  },
  {
    id: 'score_10',
    courseName: '概率论与数理统计',
    semester: '2024-2025-2',
    score: 81,
    credit: 3,
    courseType: '必修',
    examType: '正常考试'
  },
  {
    id: 'score_11',
    courseName: '计算机组成原理',
    semester: '2024-2025-2',
    score: 67,
    credit: 3,
    courseType: '必修',
    examType: '正常考试'
  },
  {
    id: 'score_12',
    courseName: '大学英语(二)',
    semester: '2024-2025-2',
    score: 84,
    credit: 3,
    courseType: '必修',
    examType: '正常考试'
  },
  {
    id: 'score_13',
    courseName: '创新创业基础',
    semester: '2024-2025-2',
    score: 90,
    credit: 2,
    courseType: '选修',
    examType: '考查课'
  },
  {
    id: 'score_14',
    courseName: '心理健康教育',
    semester: '2024-2025-2',
    score: 88,
    credit: 2,
    courseType: '选修',
    examType: '考查课'
  }
];

const MOCK_EXAM_SCHEDULE = [
  {
    id: 'exam_1',
    courseName: '高等数学',
    examDate: '2026-07-01',
    startTime: '09:00',
    endTime: '11:00',
    classroom: 'A栋301',
    seatNo: '08',
    examType: '期末考',
    isCompleted: false
  },
  {
    id: 'exam_2',
    courseName: '大学英语',
    examDate: '2026-07-03',
    startTime: '09:00',
    endTime: '11:00',
    classroom: 'B栋205',
    seatNo: '15',
    examType: '期末考',
    isCompleted: false
  },
  {
    id: 'exam_3',
    courseName: '数据结构',
    examDate: '2026-07-05',
    startTime: '14:00',
    endTime: '16:00',
    classroom: 'E栋402',
    seatNo: '22',
    examType: '期末考',
    isCompleted: false
  },
  {
    id: 'exam_4',
    courseName: '线性代数',
    examDate: '2026-07-07',
    startTime: '09:00',
    endTime: '11:00',
    classroom: 'A栋203',
    seatNo: '05',
    examType: '期末考',
    isCompleted: false
  },
  {
    id: 'exam_5',
    courseName: '毛泽东思想概论',
    examDate: '2026-07-09',
    startTime: '09:00',
    endTime: '11:00',
    classroom: 'C栋101',
    seatNo: '31',
    examType: '期末考',
    isCompleted: false
  },
  {
    id: 'exam_6',
    courseName: '计算机组成原理',
    examDate: '2026-06-28',
    startTime: '19:00',
    endTime: '21:00',
    classroom: 'E栋301',
    seatNo: '12',
    examType: '期末考',
    isCompleted: true
  },
  {
    id: 'exam_7',
    courseName: '大学物理',
    examDate: '2026-06-25',
    startTime: '14:00',
    endTime: '16:00',
    classroom: 'D栋201',
    seatNo: '18',
    examType: '期末考',
    isCompleted: true
  }
];

const MOCK_CLASSROOMS = [
  { id: 'cr_A_101', building: 'A', room: '101', capacity: 60, type: '普通教室', hasProjector: true, hasAc: true },
  { id: 'cr_A_102', building: 'A', room: '102', capacity: 60, type: '普通教室', hasProjector: true, hasAc: true },
  { id: 'cr_A_201', building: 'A', room: '201', capacity: 80, type: '普通教室', hasProjector: true, hasAc: true },
  { id: 'cr_A_203', building: 'A', room: '203', capacity: 60, type: '普通教室', hasProjector: true, hasAc: true },
  { id: 'cr_A_301', building: 'A', room: '301', capacity: 120, type: '阶梯教室', hasProjector: true, hasAc: true },
  { id: 'cr_A_401', building: 'A', room: '401', capacity: 80, type: '普通教室', hasProjector: true, hasAc: true },
  { id: 'cr_B_101', building: 'B', room: '101', capacity: 45, type: '普通教室', hasProjector: true, hasAc: true },
  { id: 'cr_B_205', building: 'B', room: '205', capacity: 50, type: '普通教室', hasProjector: true, hasAc: true },
  { id: 'cr_B_303', building: 'B', room: '303', capacity: 60, type: '普通教室', hasProjector: true, hasAc: false },
  { id: 'cr_C_101', building: 'C', room: '101', capacity: 200, type: '大阶梯教室', hasProjector: true, hasAc: true },
  { id: 'cr_C_201', building: 'C', room: '201', capacity: 80, type: '普通教室', hasProjector: true, hasAc: true },
  { id: 'cr_C_301', building: 'C', room: '301', capacity: 100, type: '阶梯教室', hasProjector: true, hasAc: true },
  { id: 'cr_D_201', building: 'D', room: '201', capacity: 80, type: '物理实验室', hasProjector: true, hasAc: true },
  { id: 'cr_D_301', building: 'D', room: '301', capacity: 60, type: '化学实验室', hasProjector: true, hasAc: true },
  { id: 'cr_E_301', building: 'E', room: '301', capacity: 60, type: '计算机实验室', hasProjector: true, hasAc: true },
  { id: 'cr_E_305', building: 'E', room: '305', capacity: 40, type: '计算机实验室', hasProjector: true, hasAc: true },
  { id: 'cr_E_401', building: 'E', room: '401', capacity: 60, type: '计算机实验室', hasProjector: true, hasAc: true },
  { id: 'cr_E_402', building: 'E', room: '402', capacity: 60, type: '计算机实验室', hasProjector: true, hasAc: true },
  { id: 'cr_E_403', building: 'E', room: '403', capacity: 60, type: '计算机实验室', hasProjector: true, hasAc: true },
  { id: 'cr_E_501', building: 'E', room: '501', capacity: 40, type: '研讨室', hasProjector: true, hasAc: true }
];

const MOCK_COURSE_SETTINGS = {
  semesterStartDate: '2026-02-16',
  currentWeek: 17,
  totalWeeks: 20,
  reminderMinutes: 10,
  enableReminder: true
};

const MOCK_INNOVATION_PROJECTS = [
  {
    title: '智慧校园生活服务平台',
    description: '整合校园内各类服务资源，为师生提供一站式的校园生活服务，包括失物招领、二手交易、校园风光、学习资料等功能模块。',
    field: 'internet',
    stage: 'early',
    financingStage: 'a_round',
    financingAmount: '500万',
    team: [
      { name: '张明', role: 'frontend', avatar: '', major: '计算机科学与技术', grade: '大三' },
      { name: '李华', role: 'backend', avatar: '', major: '软件工程', grade: '大三' },
      { name: '王芳', role: 'ui_ux', avatar: '', major: '数字媒体艺术', grade: '大二' }
    ],
    recruitingRoles: ['product', 'marketing', 'operation'],
    highlights: ['已获得省级创新创业大赛金奖', '累计用户5000+', '与3家企业达成合作意向'],
    images: ['https://picsum.photos/seed/innoproj1/800/500', 'https://picsum.photos/seed/innoproj1-2/800/500'],
    contact: '张明',
    phone: '13800138001',
    wechat: 'zhangming_tech',
    email: 'zhangming@campus.edu.cn',
    bpUrl: '',
    status: 'active',
    views: 1256,
    likes: 89
  },
  {
    title: 'AI 智能辅导机器人',
    description: '基于大语言模型的智能教育辅导机器人，能够为学生提供个性化的学习辅导、作业答疑、知识讲解等服务。',
    field: 'ai',
    stage: 'mvp',
    financingStage: 'angel',
    financingAmount: '200万',
    team: [
      { name: '刘伟', role: 'algorithm', avatar: '', major: '人工智能', grade: '研二' },
      { name: '陈静', role: 'product', avatar: '', major: '教育技术学', grade: '研一' }
    ],
    recruitingRoles: ['frontend', 'backend', 'operation'],
    highlights: ['已完成MVP开发', '与2所中学达成试点合作', '获得学校创业基金支持'],
    images: ['https://picsum.photos/seed/innoproj2/800/500'],
    contact: '刘伟',
    phone: '13800138002',
    wechat: 'liuwei_ai',
    email: 'liuwei@campus.edu.cn',
    bpUrl: '',
    status: 'active',
    views: 987,
    likes: 67
  },
  {
    title: '环保智能垃圾分类箱',
    description: '基于物联网和人工智能技术的智能垃圾分类设备，能够自动识别垃圾类型并进行分类投放，同时提供积分奖励机制。',
    field: 'hardware',
    stage: 'idea',
    financingStage: 'pre_a',
    financingAmount: '300万',
    team: [
      { name: '赵强', role: 'backend', avatar: '', major: '物联网工程', grade: '大四' },
      { name: '孙丽', role: 'marketing', avatar: '', major: '市场营销', grade: '大三' }
    ],
    recruitingRoles: ['hardware', 'algorithm', 'finance'],
    highlights: ['已申请3项发明专利', '获得环保部门关注', '原型机测试效果良好'],
    images: ['https://picsum.photos/seed/innoproj3/800/500'],
    contact: '赵强',
    phone: '13800138003',
    wechat: 'zhaoqiang_iot',
    email: 'zhaoqiang@campus.edu.cn',
    bpUrl: '',
    status: 'active',
    views: 756,
    likes: 45
  },
  {
    title: '基于合成生物学的新型药物研发',
    description: '利用合成生物学技术，开发新型的抗癌药物和抗生素，通过改造微生物来生产高效、低成本的药物分子。',
    field: 'biomedical',
    stage: 'early',
    financingStage: 'a_round',
    financingAmount: '800万',
    team: [
      { name: '周涛', role: 'other', avatar: '', major: '生物工程', grade: '博二' },
      { name: '吴敏', role: 'finance', avatar: '', major: '金融学', grade: '研二' }
    ],
    recruitingRoles: ['backend', 'ui_ux', 'hr'],
    highlights: ['已发表SCI论文2篇', '与附属医院达成合作', '初步实验数据优异'],
    images: ['https://picsum.photos/seed/innoproj4/800/500'],
    contact: '周涛',
    phone: '13800138004',
    wechat: 'zhoutao_bio',
    email: 'zhoutao@campus.edu.cn',
    bpUrl: '',
    status: 'active',
    views: 1123,
    likes: 78
  },
  {
    title: '非遗文化数字传承平台',
    description: '运用VR/AR、数字孪生等技术，对非物质文化遗产进行数字化保护和传播，打造沉浸式的文化体验平台。',
    field: 'cultural_creative',
    stage: 'mvp',
    financingStage: 'none',
    financingAmount: '',
    team: [
      { name: '郑雪', role: 'ui_ux', avatar: '', major: '数字媒体艺术', grade: '研三' },
      { name: '王磊', role: 'mobile', avatar: '', major: '计算机科学与技术', grade: '大四' }
    ],
    recruitingRoles: ['product', 'marketing', 'operation'],
    highlights: ['与3个非遗传承人签约', '获得文化部门立项支持', 'VR内容制作50+小时'],
    images: ['https://picsum.photos/seed/innoproj5/800/500'],
    contact: '郑雪',
    phone: '13800138005',
    wechat: 'zhengxue_vr',
    email: 'zhengxue@campus.edu.cn',
    bpUrl: '',
    status: 'active',
    views: 834,
    likes: 92
  }
];

const MOCK_INNOVATION_MENTORS = [
  {
    name: '张建国',
    title: 'professor',
    department: '计算机科学与技术学院',
    researchAreas: ['人工智能', '机器学习', '计算机视觉'],
    achievements: '国家级教学名师，主持国家自然科学基金重点项目3项，发表SCI论文100余篇，指导学生获得"互联网+"创新创业大赛金奖5项。',
    mentoringCount: 12,
    successProjects: 8,
    availableSlots: 3,
    appointmentCount: 45,
    rating: 4.9,
    reviews: [
      { userName: '李明', rating: 5, content: '张教授专业知识渊博，对项目的技术路线给出了非常宝贵的建议。', createTime: Date.now() - 86400000 * 10 },
      { userName: '王芳', rating: 5, content: '非常耐心细致，帮助我们梳理了商业模式，非常感谢！', createTime: Date.now() - 86400000 * 25 }
    ],
    availableDates: ['2026-06-14', '2026-06-15', '2026-06-17', '2026-06-18', '2026-06-19'],
    avatar: 'https://picsum.photos/seed/mentor1/200/200'
  },
  {
    name: '李梅',
    title: 'entrepreneur',
    department: '创业学院',
    researchAreas: ['商业模式设计', '创业融资', '团队管理'],
    achievements: '连续创业者，创办3家公司，其中1家成功退出。国家级创业导师，累计指导创业项目200+，帮助项目获得融资超过5亿元。',
    mentoringCount: 25,
    successProjects: 15,
    availableSlots: 5,
    appointmentCount: 78,
    rating: 4.8,
    reviews: [
      { userName: '张华', rating: 5, content: '李老师对商业模式的理解非常深刻，一针见血地指出了我们的问题。', createTime: Date.now() - 86400000 * 5 }
    ],
    availableDates: ['2026-06-14', '2026-06-16', '2026-06-18', '2026-06-20'],
    avatar: 'https://picsum.photos/seed/mentor2/200/200'
  },
  {
    name: '王强',
    title: 'investor',
    department: '校友创业投资基金',
    researchAreas: ['风险投资', '项目估值', '股权设计'],
    achievements: '知名风险投资人，曾任职于红杉资本、IDG等顶级投资机构。主导投资项目30+，其中5家成功上市，管理基金规模超过50亿元。',
    mentoringCount: 18,
    successProjects: 12,
    availableSlots: 2,
    appointmentCount: 36,
    rating: 4.9,
    reviews: [
      { userName: '刘伟', rating: 5, content: '王总从投资人的角度给了我们很多专业建议，帮助我们更好地准备融资。', createTime: Date.now() - 86400000 * 15 }
    ],
    availableDates: ['2026-06-15', '2026-06-19'],
    avatar: 'https://picsum.photos/seed/mentor3/200/200'
  },
  {
    name: '陈晓',
    title: 'industry_expert',
    department: '人工智能研究院',
    researchAreas: ['大语言模型', '自然语言处理', '智能客服'],
    achievements: '前字节跳动高级架构师，主导开发多个千万级用户的AI产品。拥有15年人工智能领域从业经验，对AI技术落地有深刻理解。',
    mentoringCount: 8,
    successProjects: 6,
    availableSlots: 4,
    appointmentCount: 28,
    rating: 4.7,
    reviews: [
      { userName: '赵强', rating: 5, content: '陈老师的技术指导非常实用，帮助我们解决了很多技术难题。', createTime: Date.now() - 86400000 * 8 }
    ],
    availableDates: ['2026-06-14', '2026-06-17', '2026-06-20'],
    avatar: 'https://picsum.photos/seed/mentor4/200/200'
  },
  {
    name: '刘芳',
    title: 'lawyer',
    department: '法律顾问室',
    researchAreas: ['公司法', '知识产权', '创业法律风险'],
    achievements: '资深律师，执业20年，专注于创业公司法律服务。曾为100+创业公司提供法律顾问服务，处理过大量股权纠纷、知识产权案件。',
    mentoringCount: 15,
    successProjects: 10,
    availableSlots: 6,
    appointmentCount: 52,
    rating: 4.8,
    reviews: [
      { userName: '孙丽', rating: 5, content: '刘律师帮助我们规避了很多法律风险，非常专业。', createTime: Date.now() - 86400000 * 12 }
    ],
    availableDates: ['2026-06-15', '2026-06-16', '2026-06-18', '2026-06-19'],
    avatar: 'https://picsum.photos/seed/mentor5/200/200'
  }
];

const MOCK_INNOVATION_ROADSHOWS = [
  {
    title: '2026年夏季创业项目路演会',
    subtitle: 'AI与数字经济专场',
    description: '本次路演会聚焦人工智能与数字经济领域，邀请知名投资人、行业专家担任评委，为优秀创业项目提供展示和融资对接的平台。',
    date: '2026-06-25',
    startTime: '14:00',
    endTime: '18:00',
    location: '大学生活动中心报告厅',
    organizer: '创新创业学院',
    maxParticipants: 200,
    registeredCount: 156,
    status: 'registering',
    judges: [
      { name: '张建国', title: '教授' },
      { name: '王强', title: '投资人' },
      { name: '李梅', title: '创业导师' }
    ],
    projects: [
      { title: 'AI智能辅导机器人', team: '智能教育团队', stage: 'MVP阶段' },
      { title: '智慧校园生活服务平台', team: '校园科技团队', stage: '早期成长' },
      { title: '环保智能垃圾分类箱', team: '绿色科技团队', stage: '创意阶段' }
    ],
    agenda: [
      { time: '14:00-14:30', content: '签到入场' },
      { time: '14:30-14:45', content: '开场致辞' },
      { time: '14:45-16:45', content: '项目路演（每个项目15分钟）' },
      { time: '16:45-17:15', content: '评委点评' },
      { time: '17:15-18:00', content: '自由交流对接' }
    ],
    highlights: ['邀请知名投资人现场点评', '优秀项目可获得创业基金支持', '提供免费一对一融资咨询'],
    coverImage: 'https://picsum.photos/seed/roadshow1/800/400',
    views: 2345,
    createTime: Date.now() - 86400000 * 5
  },
  {
    title: '生物医药创业沙龙',
    subtitle: '合成生物学与创新药物',
    description: '邀请生物医药领域的专家、企业家、投资人共同探讨合成生物学在创新药物研发中的应用前景。',
    date: '2026-06-30',
    startTime: '19:00',
    endTime: '21:00',
    location: '生命科学学院学术报告厅',
    organizer: '生命科学学院、创新创业学院',
    maxParticipants: 100,
    registeredCount: 78,
    status: 'registering',
    judges: [
      { name: '周涛', title: '研究员' },
      { name: '王强', title: '投资人' }
    ],
    projects: [],
    agenda: [
      { time: '19:00-19:30', content: '主题分享：合成生物学的产业应用' },
      { time: '19:30-20:15', content: '圆桌对话：生物医药创业的机遇与挑战' },
      { time: '20:15-21:00', content: '项目展示与交流' }
    ],
    highlights: ['行业大咖深度分享', '精准对接产业资源', '生物医药创业政策解读'],
    coverImage: 'https://picsum.photos/seed/roadshow2/800/400',
    views: 1567,
    createTime: Date.now() - 86400000 * 3
  },
  {
    title: '文化创意产业路演',
    subtitle: '科技赋能传统文化',
    description: '聚焦文化创意与科技融合的创业项目，展示VR/AR、数字孪生等技术在文化传承中的创新应用。',
    date: '2026-07-05',
    startTime: '14:00',
    endTime: '17:30',
    location: '艺术学院展厅',
    organizer: '艺术学院、创新创业学院',
    maxParticipants: 150,
    registeredCount: 98,
    status: 'upcoming',
    judges: [
      { name: '李梅', title: '创业导师' },
      { name: '陈晓', title: '行业专家' }
    ],
    projects: [],
    agenda: [],
    highlights: ['非遗传承人现场互动', '文创产品展示体验', '投资机构一对一'],
    coverImage: 'https://picsum.photos/seed/roadshow3/800/400',
    views: 1234,
    createTime: Date.now() - 86400000 * 2
  },
  {
    title: '新能源与绿色科技路演会',
    subtitle: '双碳目标下的创业机遇',
    description: '聚焦新能源、节能环保、绿色制造等领域的创新创业项目，推动科技成果转化和产业落地。',
    date: '2026-07-10',
    startTime: '09:00',
    endTime: '12:00',
    location: '能源与动力工程学院报告厅',
    organizer: '能源与动力工程学院、创新创业学院',
    maxParticipants: 180,
    registeredCount: 67,
    status: 'upcoming',
    judges: [],
    projects: [],
    agenda: [],
    highlights: ['新能源政策解读', '行业龙头企业对接', '绿色技术成果展示'],
    coverImage: 'https://picsum.photos/seed/roadshow4/800/400',
    views: 987,
    createTime: Date.now() - 86400000
  }
];

const MOCK_INNOVATION_POLICIES = [
  {
    title: '大学生创新创业训练计划项目申报通知',
    type: 'grant',
    source: '教育部',
    summary: '国家级大学生创新创业训练计划项目开始申报，最高资助5万元，支持本科生开展创新创业实践。',
    content: '一、申报类别\n1. 创新训练项目：支持本科生团队开展创新性研究\n2. 创业训练项目：支持本科生团队开展模拟创业实践\n3. 创业实践项目：支持本科生团队开展真实创业实践\n\n二、资助标准\n- 国家级重点项目：50000元/项\n- 国家级一般项目：20000元/项\n- 省级项目：10000元/项\n- 校级项目：5000元/项\n\n三、申报条件\n1. 全日制在读本科生，品学兼优\n2. 具有创新意识和创业精神\n3. 有明确的项目计划和指导教师\n\n四、申报流程\n1. 6月20日前：项目团队提交申报材料\n2. 6月25日前：学院初审\n3. 6月30日前：学校评审\n4. 7月5日前：上报省教育厅',
    publishDate: '2026-06-10',
    deadline: '2026-06-20',
    tags: ['大创项目', '本科生', '资金支持'],
    views: 2345,
    isFavorite: false
  },
  {
    title: '关于落实创业担保贷款政策的通知',
    type: 'financing',
    source: '人力资源和社会保障部',
    summary: '高校毕业生创业可申请最高30万元的创业担保贷款，财政给予全额贴息。',
    content: '一、贷款对象\n1. 毕业5年内的高校毕业生\n2. 持有《就业创业证》\n3. 无不良信用记录\n\n二、贷款额度\n- 个人创业：最高30万元\n- 合伙创业：最高100万元\n- 小微企业：最高300万元\n\n三、贷款期限\n最长3年，财政给予全额贴息\n\n四、申请材料\n1. 创业担保贷款申请表\n2. 身份证、毕业证\n3. 《就业创业证》\n4. 营业执照\n5. 经营场所证明\n\n五、办理流程\n1. 向当地人社部门申请\n2. 担保机构审核\n3. 银行审批放款',
    publishDate: '2026-06-08',
    deadline: '长期有效',
    tags: ['创业贷款', '财政贴息', '高校毕业生'],
    views: 3456,
    isFavorite: false
  },
  {
    title: '科技型中小企业税收优惠政策指引',
    type: 'tax',
    source: '国家税务总局',
    summary: '科技型中小企业可享受研发费用加计扣除100%、高新技术企业所得税减免等税收优惠。',
    content: '一、研发费用加计扣除\n- 未形成无形资产计入当期损益的，在按规定据实扣除的基础上，再按照实际发生额的100%在税前加计扣除\n- 形成无形资产的，按照无形资产成本的200%在税前摊销\n\n二、高新技术企业优惠\n- 减按15%税率征收企业所得税\n- 职工教育经费支出，不超过工资薪金总额8%的部分，准予在计算应纳税所得额时扣除\n\n三、技术转让所得减免\n- 一个纳税年度内，技术转让所得不超过500万元的部分，免征企业所得税\n- 超过500万元的部分，减半征收企业所得税\n\n四、享受条件\n1. 在中国境内（不包括港、澳、台地区）注册的居民企业\n2. 职工总数不超过500人、年销售收入不超过2亿元、资产总额不超过2亿元\n3. 企业提供的产品和服务不属于国家规定的禁止、限制和淘汰类',
    publishDate: '2026-06-05',
    deadline: '长期有效',
    tags: ['税收优惠', '研发费用', '高新企业'],
    views: 2890,
    isFavorite: false
  },
  {
    title: '大学科技园入驻申请指南',
    type: 'incubator',
    source: 'XX大学国家大学科技园',
    summary: '欢迎师生创业项目入驻大学科技园，享受免费办公场地、创业辅导、投融资对接等全方位服务。',
    content: '一、园区介绍\nXX大学国家大学科技园是科技部、教育部认定的国家级大学科技园，占地200亩，建筑面积15万平方米，在孵企业200+。\n\n二、入驻条件\n1. 项目创始人或核心团队为我校师生或校友\n2. 项目符合国家产业政策，具有创新性和市场前景\n3. 拥有自主知识产权或核心技术\n4. 无违法违规记录\n\n三、优惠政策\n1. 免租金入驻2年，第3年起享受50%租金优惠\n2. 提供免费工商注册、财务代理、法律咨询等服务\n3. 优先申报政府各类科技项目\n4. 享受创投基金优先投资权\n5. 对接校友企业资源和产业资源\n\n四、申请材料\n1. 入驻申请表\n2. 商业计划书\n3. 团队成员身份证明\n4. 知识产权证明（如有）\n\n五、申请流程\n1. 在线提交申请材料\n2. 项目初审\n3. 现场答辩\n4. 审批通过后签订入驻协议',
    publishDate: '2026-06-01',
    deadline: '长期有效',
    tags: ['大学科技园', '免租金', '孵化服务'],
    views: 4123,
    isFavorite: false
  },
  {
    title: '青年人才引进计划实施办法',
    type: 'talent',
    source: 'XX市人力资源和社会保障局',
    summary: '来我市创业就业的青年人才可享受最高50万元的购房补贴、每月2000元的生活补贴。',
    content: '一、补贴对象\n1. 年龄35周岁以下\n2. 具有本科及以上学历\n3. 毕业5年内来我市创业或就业\n4. 首次在我市缴纳社保\n\n二、补贴标准\n1. 生活补贴\n   - 博士研究生：3000元/月，补贴3年\n   - 硕士研究生：2000元/月，补贴3年\n   - 本科生：1000元/月，补贴2年\n2. 购房补贴\n   - 博士研究生：50万元\n   - 硕士研究生：30万元\n   - 本科生：15万元\n3. 创业补贴\n   - 一次性创业补贴：10000元\n   - 创业带动就业补贴：每人3000元\n\n三、申请流程\n1. 登录"人才服务网"注册账号\n2. 填写申请信息并上传证明材料\n3. 人社部门审核\n4. 补贴按月发放至个人银行账户',
    publishDate: '2026-05-28',
    deadline: '2026-12-31',
    tags: ['人才补贴', '购房补贴', '青年人才'],
    views: 5678,
    isFavorite: false
  }
];

const MOCK_INNOVATION_INCUBATORS = [
  {
    name: 'XX大学国家大学科技园',
    type: 'university',
    level: '国家级',
    address: 'XX市XX区XX路100号',
    description: '科技部、教育部认定的国家级大学科技园，专注于孵化高校师生创业项目，提供全方位的创业孵化服务。',
    area: '150000㎡',
    capacity: 200,
    inCubatedCount: 156,
    graduatedCount: 89,
    successCases: ['智慧校园科技', 'AI教育机器人', '绿色环保科技'],
    services: [
      { name: '办公场地', desc: '免费独立办公室，配备家具、网络、空调' },
      { name: '工商注册', desc: '免费工商注册、变更、注销服务' },
      { name: '财务代理', desc: '专业会计团队提供记账、报税服务' },
      { name: '法律咨询', desc: '合作律师事务所提供免费法律咨询' },
      { name: '创业辅导', desc: '一对一创业导师辅导' },
      { name: '融资对接', desc: '对接创投机构、银行等金融机构' },
      { name: '政策申报', desc: '协助申报各类政府项目和补贴' },
      { name: '市场推广', desc: '提供品牌宣传、市场对接服务' }
    ],
    policies: [
      '免租金入驻2年，第3年起50%租金优惠',
      '优先推荐申报政府科技项目',
      '设立5000万元种子基金，优先投资入驻项目',
      '享受高新区各项人才政策和产业政策'
    ],
    contactName: '王经理',
    contactPhone: '010-12345678',
    contactEmail: 'incubator@campus.edu.cn',
    applyUrl: '',
    images: ['https://picsum.photos/seed/incubator1/800/500', 'https://picsum.photos/seed/incubator1-2/800/500'],
    rating: 4.9,
    reviews: 156,
    views: 5678,
    distance: '1.2km'
  },
  {
    name: 'XX市创业孵化基地',
    type: 'government',
    level: '省级',
    address: 'XX市XX区创业大道200号',
    description: '由市人力资源和社会保障局设立的公益性创业孵化基地，重点扶持高校毕业生、退役军人等群体创业。',
    area: '80000㎡',
    capacity: 120,
    inCubatedCount: 98,
    graduatedCount: 67,
    successCases: ['电商平台', '家政服务', '教育培训'],
    services: [
      { name: '办公场地', desc: '联合办公区、独立办公室可选' },
      { name: '创业培训', desc: '免费SIYB创业培训' },
      { name: '融资服务', desc: '协助申请创业担保贷款' },
      { name: '社保补贴', desc: '3年社会保险补贴' },
      { name: '岗位补贴', desc: '带动就业岗位补贴' }
    ],
    policies: [
      '3年免租金入驻',
      '享受社保补贴、岗位补贴',
      '优先申请30万元创业担保贷款（全额贴息）',
      '一次性创业补贴10000元'
    ],
    contactName: '李主任',
    contactPhone: '010-87654321',
    contactEmail: 'cyjd@xx.gov.cn',
    applyUrl: '',
    images: ['https://picsum.photos/seed/incubator2/800/500'],
    rating: 4.7,
    reviews: 89,
    views: 4321,
    distance: '2.5km'
  },
  {
    name: 'XX科创加速器',
    type: 'accelerator',
    level: '市级',
    address: 'XX市高新区科创路88号',
    description: '专注于硬科技领域的专业加速器，提供为期6个月的加速营，帮助项目快速成长和获得融资。',
    area: '30000㎡',
    capacity: 50,
    inCubatedCount: 42,
    graduatedCount: 78,
    successCases: ['半导体芯片', '智能硬件', '生物医药'],
    services: [
      { name: '加速营', desc: '6个月集中加速，每周一次创业培训' },
      { name: '技术支持', desc: '对接实验室、检测中心' },
      { name: '产业对接', desc: '对接行业龙头企业' },
      { name: 'Demo Day', desc: '每季举办项目路演对接会' }
    ],
    policies: [
      '择优投资，单项目投资50-200万元',
      '6个月免费入驻加速营',
      '免费参加各类培训和对接活动',
      '产业资源深度对接'
    ],
    contactName: '张总监',
    contactPhone: '010-11112222',
    contactEmail: 'startup@tech.com',
    applyUrl: '',
    images: ['https://picsum.photos/seed/incubator3/800/500'],
    rating: 4.8,
    reviews: 123,
    views: 3890,
    distance: '3.8km'
  }
];

// ==================== 流浪动物救助站 ====================

const SHELTER_ANIMALS = [
  {
    id: 'a1',
    name: '小黄',
    type: 'dog',
    breed: '中华田园犬',
    gender: 'male',
    age: 2,
    ageText: '2岁',
    weight: '12kg',
    sterilized: true,
    vaccinated: true,
    healthStatus: 'excellent',
    personality: ['friendly', 'active', 'playful'],
    description: '小黄是一只非常活泼可爱的狗狗，特别喜欢和人亲近。他是在校园附近被发现的流浪狗，经过救助站的照顾后，现在已经完全康复，非常期待能找到一个温暖的家。小黄很聪明，已经学会了坐下、握手等基本指令，非常适合有爱心的家庭领养。',
    story: '小黄是在去年冬天被志愿者发现的，当时他瘦弱不堪，还患有皮肤病。经过救助站三个月的悉心照料，现在的小黄毛发顺滑，身体健壮。他特别喜欢在草地上奔跑，和其他狗狗玩耍。',
    images: [
      'https://picsum.photos/id/237/800/600',
      'https://picsum.photos/id/718/800/600',
      'https://picsum.photos/id/1025/800/600',
      'https://picsum.photos/id/1062/800/600'
    ],
    avatar: 'https://picsum.photos/id/237/300/300',
    status: 'available',
    rescueDate: Date.now() - 86400000 * 90,
    rescueLocation: '校园东门附近',
    views: 1256,
    likes: 89,
    createTime: Date.now() - 86400000 * 90
  },
  {
    id: 'a2',
    name: '咪咪',
    type: 'cat',
    breed: '橘猫',
    gender: 'female',
    age: 1,
    ageText: '1岁',
    weight: '4kg',
    sterilized: true,
    vaccinated: true,
    healthStatus: 'good',
    personality: ['gentle', 'quiet', 'independent'],
    description: '咪咪是一只温柔安静的橘猫，喜欢晒太阳和打盹。她性格独立，但也会在你回家时主动蹭蹭你。咪咪很爱干净，已经学会了正确使用猫砂盆，是一只非常好养的猫咪。',
    story: '咪咪是在图书馆后面的灌木丛中被发现的，当时她还带着两只刚出生的小猫。现在小猫们都已经被领养，咪咪也恢复了健康，正在等待属于她的家。',
    images: [
      'https://picsum.photos/id/659/800/600',
      'https://picsum.photos/id/1069/800/600',
      'https://picsum.photos/id/1074/800/600'
    ],
    avatar: 'https://picsum.photos/id/659/300/300',
    status: 'available',
    rescueDate: Date.now() - 86400000 * 60,
    rescueLocation: '图书馆后身',
    views: 2341,
    likes: 156,
    createTime: Date.now() - 86400000 * 60
  },
  {
    id: 'a3',
    name: '旺财',
    type: 'dog',
    breed: '金毛寻回犬',
    gender: 'male',
    age: 4,
    ageText: '4岁',
    weight: '30kg',
    sterilized: true,
    vaccinated: true,
    healthStatus: 'good',
    personality: ['friendly', 'gentle', 'social'],
    description: '旺财是一只温顺的大金毛，特别喜欢和小朋友玩耍。他非常聪明，已经掌握了很多技能，包括坐下、趴下、握手、接飞盘等。旺财需要较大的活动空间，适合有院子或者经常能带他出去运动的家庭。',
    story: '旺财的主人因为工作调动无法继续照顾他，所以送到了救助站。他从小就是家庭的一员，非常适应家庭生活，也很习惯和人类相处。',
    images: [
      'https://picsum.photos/id/718/800/600',
      'https://picsum.photos/id/1025/800/600',
      'https://picsum.photos/id/237/800/600'
    ],
    avatar: 'https://picsum.photos/id/718/300/300',
    status: 'available',
    rescueDate: Date.now() - 86400000 * 30,
    rescueLocation: '主人送养',
    views: 3456,
    likes: 267,
    createTime: Date.now() - 86400000 * 30
  },
  {
    id: 'a4',
    name: '雪球',
    type: 'rabbit',
    breed: '荷兰垂耳兔',
    gender: 'female',
    age: 0.5,
    ageText: '6个月',
    weight: '1.5kg',
    sterilized: false,
    vaccinated: true,
    healthStatus: 'excellent',
    personality: ['shy', 'quiet', 'curious'],
    description: '雪球是一只可爱的垂耳兔，毛发雪白柔软。她比较胆小，需要有耐心的主人慢慢培养感情。雪球已经学会了在固定地点上厕所，非常爱干净。',
    story: '雪球是在校园宿舍区被发现的，可能是被毕业生遗弃的宠物。现在她在救助站生活得很好，每天都要吃很多新鲜的蔬菜和草料。',
    images: [
      'https://picsum.photos/id/783/800/600',
      'https://picsum.photos/id/1025/800/600'
    ],
    avatar: 'https://picsum.photos/id/783/300/300',
    status: 'available',
    rescueDate: Date.now() - 86400000 * 20,
    rescueLocation: '宿舍区',
    views: 876,
    likes: 56,
    createTime: Date.now() - 86400000 * 20
  },
  {
    id: 'a5',
    name: '小黑',
    type: 'cat',
    breed: '黑猫',
    gender: 'male',
    age: 3,
    ageText: '3岁',
    weight: '5kg',
    sterilized: true,
    vaccinated: true,
    healthStatus: 'recovering',
    personality: ['independent', 'quiet', 'gentle'],
    description: '小黑是一只神秘优雅的黑猫，虽然外表看起来高冷，但其实内心很渴望被爱。他之前因为车祸受过伤，现在正在康复中，腿部还有一点小残疾，但不影响正常生活。小黑需要一个有耐心、能包容他小缺点的家。',
    story: '小黑是在一次车祸中被志愿者救起的，当时他腿部骨折，情况危急。经过手术和长时间的康复，现在已经基本恢复了。虽然走路还有一点跛，但他依然是一只可爱的猫咪。',
    images: [
      'https://picsum.photos/id/1069/800/600',
      'https://picsum.photos/id/659/800/600'
    ],
    avatar: 'https://picsum.photos/id/1069/300/300',
    status: 'available',
    rescueDate: Date.now() - 86400000 * 120,
    rescueLocation: '校门口马路边',
    views: 1890,
    likes: 234,
    createTime: Date.now() - 86400000 * 120
  },
  {
    id: 'a6',
    name: '豆豆',
    type: 'dog',
    breed: '柯基',
    gender: 'male',
    age: 1.5,
    ageText: '1岁半',
    weight: '10kg',
    sterilized: true,
    vaccinated: true,
    healthStatus: 'excellent',
    personality: ['active', 'playful', 'curious'],
    description: '豆豆是一只精力充沛的小柯基，短腿大屁股超级可爱。他特别喜欢玩球，每次出门都开心得不得了。豆豆已经学会了基本指令，训练潜力很大。',
    story: '豆豆是因为原主人对狗毛过敏而被送养的。他非常健康活泼，是家庭的开心果。',
    images: [
      'https://picsum.photos/id/1025/800/600',
      'https://picsum.photos/id/237/800/600',
      'https://picsum.photos/id/718/800/600'
    ],
    avatar: 'https://picsum.photos/id/1025/300/300',
    status: 'pending',
    rescueDate: Date.now() - 86400000 * 15,
    rescueLocation: '主人送养',
    views: 4567,
    likes: 378,
    createTime: Date.now() - 86400000 * 15
  },
  {
    id: 'a7',
    name: '小蓝',
    type: 'bird',
    breed: '虎皮鹦鹉',
    gender: 'male',
    age: 2,
    ageText: '2岁',
    weight: '0.03kg',
    sterilized: false,
    vaccinated: true,
    healthStatus: 'excellent',
    personality: ['active', 'social', 'curious'],
    description: '小蓝是一只聪明的虎皮鹦鹉，会说几句简单的话，比如"你好"、"再见"。他喜欢站在人的肩膀上，特别喜欢被挠头。小蓝已经学会了在固定地点进食和休息，很容易照顾。',
    story: '小蓝是在树林里被发现的，可能是从家里飞出来的宠物鸟。救助站等了很久都没有人来认领，所以现在开放领养。',
    images: [
      'https://picsum.photos/id/1025/800/600'
    ],
    avatar: 'https://picsum.photos/id/1025/300/300',
    status: 'available',
    rescueDate: Date.now() - 86400000 * 45,
    rescueLocation: '学校小树林',
    views: 654,
    likes: 43,
    createTime: Date.now() - 86400000 * 45
  },
  {
    id: 'a8',
    name: '花花',
    type: 'cat',
    breed: '三花猫',
    gender: 'female',
    age: 5,
    ageText: '5岁',
    weight: '4.5kg',
    sterilized: true,
    vaccinated: true,
    healthStatus: 'good',
    personality: ['independent', 'gentle', 'quiet'],
    description: '花花是一只成熟稳重的三花猫，性格温和，不挑食，很好照顾。她喜欢安静的环境，适合作为陪伴宠物。花花已经习惯了室内生活，会正确使用猫砂盆。',
    story: '花花是一只流浪猫妈妈，先后生下了三窝小猫，现在所有小猫都已经被领养，花花也终于可以安心地寻找属于自己的家了。',
    images: [
      'https://picsum.photos/id/1074/800/600',
      'https://picsum.photos/id/659/800/600'
    ],
    avatar: 'https://picsum.photos/id/1074/300/300',
    status: 'available',
    rescueDate: Date.now() - 86400000 * 180,
    rescueLocation: '家属区',
    views: 1234,
    likes: 98,
    createTime: Date.now() - 86400000 * 180
  },
  {
    id: 'a9',
    name: '大白',
    type: 'dog',
    breed: '萨摩耶',
    gender: 'male',
    age: 3,
    ageText: '3岁',
    weight: '28kg',
    sterilized: true,
    vaccinated: true,
    healthStatus: 'special',
    personality: ['friendly', 'gentle', 'active'],
    description: '大白是一只微笑天使萨摩耶，永远带着灿烂的笑容。他需要特殊照顾，因为患有轻微的皮肤病，需要定期药浴和护理。但这并不影响他的好心情，大白每天都开开心心的。',
    story: '大白是在宠物医院门口被遗弃的，当时他的皮肤病很严重。经过救助站半年多的治疗，现在已经好了很多，只需要定期护理就能维持健康。',
    images: [
      'https://picsum.photos/id/1062/800/600',
      'https://picsum.photos/id/718/800/600'
    ],
    avatar: 'https://picsum.photos/id/1062/300/300',
    status: 'available',
    rescueDate: Date.now() - 86400000 * 200,
    rescueLocation: '宠物医院门口',
    views: 2678,
    likes: 312,
    createTime: Date.now() - 86400000 * 200
  },
  {
    id: 'a10',
    name: '小橘',
    type: 'cat',
    breed: '橘猫',
    gender: 'male',
    age: 0.8,
    ageText: '8个月',
    weight: '3.5kg',
    sterilized: false,
    vaccinated: true,
    healthStatus: 'excellent',
    personality: ['active', 'playful', 'friendly'],
    description: '小橘是一只超级活泼的小奶猫，对一切都充满好奇。他特别喜欢玩逗猫棒，每次都能玩很久。小橘正是最可爱的年纪，希望能找到一个能陪伴他长大的家庭。',
    story: '小橘和他的兄弟姐妹一起在垃圾桶旁边被发现的，当时他们才刚出生几天。在志愿者的悉心照料下，小橘健康成长，现在已经可以独立生活了。',
    images: [
      'https://picsum.photos/id/659/800/600',
      'https://picsum.photos/id/1074/800/600'
    ],
    avatar: 'https://picsum.photos/id/659/300/300',
    status: 'reserved',
    rescueDate: Date.now() - 86400000 * 50,
    rescueLocation: '食堂附近垃圾桶',
    views: 3210,
    likes: 245,
    createTime: Date.now() - 86400000 * 50
  },
  {
    id: 'a11',
    name: '灰灰',
    type: 'rabbit',
    breed: '道奇兔',
    gender: 'male',
    age: 1,
    ageText: '1岁',
    weight: '2kg',
    sterilized: true,
    vaccinated: true,
    healthStatus: 'good',
    personality: ['curious', 'active', 'friendly'],
    description: '灰灰是一只活泼好动的道奇兔，标志性的黑白配色非常可爱。他特别喜欢跳来跳去，需要一定的活动空间。灰灰已经学会了上厕所，非常聪明。',
    story: '灰灰是在校园里被发现的流浪兔，可能是被遗弃的宠物。现在他在救助站生活得很好，每天都要出来跑几圈。',
    images: [
      'https://picsum.photos/id/783/800/600'
    ],
    avatar: 'https://picsum.photos/id/783/300/300',
    status: 'available',
    rescueDate: Date.now() - 86400000 * 35,
    rescueLocation: '操场边上',
    views: 567,
    likes: 38,
    createTime: Date.now() - 86400000 * 35
  },
  {
    id: 'a12',
    name: '阿黄',
    type: 'dog',
    breed: '柴犬',
    gender: 'male',
    age: 5,
    ageText: '5岁',
    weight: '15kg',
    sterilized: true,
    vaccinated: true,
    healthStatus: 'good',
    personality: ['independent', 'protective', 'gentle'],
    description: '阿黄是一只忠诚的柴犬，对主人非常忠心。他性格独立，不粘人，但会默默守护在你身边。阿黄已经习惯了家庭生活，会自己定点上厕所。',
    story: '阿黄是因为原主人搬家无法带走而被送养的。他已经陪伴了原主人5年，非常有感情，希望能找到一个同样爱他的新家庭。',
    images: [
      'https://picsum.photos/id/237/800/600',
      'https://picsum.photos/id/718/800/600'
    ],
    avatar: 'https://picsum.photos/id/237/300/300',
    status: 'adopted',
    rescueDate: Date.now() - 86400000 * 25,
    rescueLocation: '主人送养',
    views: 2890,
    likes: 198,
    createTime: Date.now() - 86400000 * 25
  }
];

const SHELTER_STATS = {
  totalAnimals: 48,
  availableAnimals: 28,
  adoptedThisMonth: 12,
  totalAdopted: 156,
  volunteers: 35,
  donationsThisMonth: 8950,
  successRate: 89
};

const SHELTER_ADOPTION_APPLICATIONS = [
  {
    id: 'app1',
    animalId: 'a6',
    animalName: '豆豆',
    animalAvatar: 'https://picsum.photos/id/1025/300/300',
    applicantName: '张同学',
    applicantPhone: '138****8888',
    applicantAvatar: 'https://picsum.photos/seed/avatar1/100/100',
    applicantId: 'u1',
    housingType: 'rental',
    housingDesc: '租的一居室，有阳台',
    experience: '有过养猫经验',
    familyMembers: 2,
    hasOtherPets: false,
    otherPetsDesc: '',
    workStatus: '在校学生，课余时间充足',
    monthlyBudget: 500,
    agreement: true,
    status: 'reviewing',
    createTime: Date.now() - 86400000 * 2,
    reviewTime: Date.now() - 86400000 * 1,
    reviewer: '李志愿者',
    reviewComment: '资料齐全，正在安排家访时间'
  },
  {
    id: 'app2',
    animalId: 'a10',
    animalName: '小橘',
    animalAvatar: 'https://picsum.photos/id/659/300/300',
    applicantName: '王同学',
    applicantPhone: '139****9999',
    applicantAvatar: 'https://picsum.photos/seed/avatar2/100/100',
    applicantId: 'u2',
    housingType: 'family',
    housingDesc: '家里自有住房，120平米',
    experience: '养过两只猫，现在还有一只',
    familyMembers: 4,
    hasOtherPets: true,
    otherPetsDesc: '有一只4岁的英短，已绝育',
    workStatus: '已毕业工作，朝九晚五',
    monthlyBudget: 1000,
    agreement: true,
    status: 'approved',
    createTime: Date.now() - 86400000 * 7,
    reviewTime: Date.now() - 86400000 * 5,
    reviewer: '王站长',
    reviewComment: '条件很好，已通过审核，等待签订领养协议'
  },
  {
    id: 'app3',
    animalId: 'a1',
    animalName: '小黄',
    animalAvatar: 'https://picsum.photos/id/237/300/300',
    applicantName: '李同学',
    applicantPhone: '137****7777',
    applicantAvatar: 'https://picsum.photos/seed/avatar3/100/100',
    applicantId: 'u3',
    housingType: 'dormitory',
    housingDesc: '学生宿舍，4人间',
    experience: '没有养宠经验',
    familyMembers: 1,
    hasOtherPets: false,
    otherPetsDesc: '',
    workStatus: '在校学生',
    monthlyBudget: 300,
    agreement: true,
    status: 'rejected',
    createTime: Date.now() - 86400000 * 5,
    reviewTime: Date.now() - 86400000 * 3,
    reviewer: '李志愿者',
    reviewComment: '宿舍不允许养宠物，不符合领养条件'
  }
];

const SHELTER_VISIT_RECORDS = [
  {
    id: 'v1',
    applicationId: 'app2',
    animalId: 'a10',
    animalName: '小橘',
    adopterName: '王同学',
    adopterPhone: '139****9999',
    visitType: 'first',
    visitDate: Date.now() - 86400000 * 14,
    visitor: '李志愿者',
    healthStatus: 'excellent',
    weight: '3.8kg',
    dietStatus: 'good',
    environmentStatus: 'good',
    notes: '小橘适应得很好，和家里的原住民相处融洽。新主人非常细心，准备了所有必需品。',
    photos: [
      'https://picsum.photos/id/659/800/600',
      'https://picsum.photos/id/1074/800/600'
    ],
    createTime: Date.now() - 86400000 * 14
  },
  {
    id: 'v2',
    applicationId: 'app2',
    animalId: 'a10',
    animalName: '小橘',
    adopterName: '王同学',
    adopterPhone: '139****9999',
    visitType: 'weekly',
    visitDate: Date.now() - 86400000 * 7,
    visitor: '张志愿者',
    healthStatus: 'excellent',
    weight: '4.0kg',
    dietStatus: 'good',
    environmentStatus: 'good',
    notes: '小橘长胖了一点，非常活泼。已经完全适应了新环境，每天都会主动和主人玩耍。',
    photos: [
      'https://picsum.photos/id/659/800/600'
    ],
    createTime: Date.now() - 86400000 * 7
  },
  {
    id: 'v3',
    applicationId: 'app4',
    animalId: 'a12',
    animalName: '阿黄',
    adopterName: '陈女士',
    adopterPhone: '136****6666',
    visitType: 'first',
    visitDate: Date.now() - 86400000 * 10,
    visitor: '王站长',
    healthStatus: 'good',
    weight: '14.5kg',
    dietStatus: 'good',
    environmentStatus: 'excellent',
    notes: '阿黄在新家生活得很好，家里有一个小院子供他活动。陈女士每天都会带他出去散步两次。',
    photos: [
      'https://picsum.photos/id/237/800/600'
    ],
    createTime: Date.now() - 86400000 * 10
  }
];

const SHELTER_DONATION_ITEMS = [
  {
    id: 'd1',
    type: 'money',
    title: '爱心捐款',
    description: '您的每一分捐款都将用于流浪动物的医疗、食品和日常护理。我们承诺所有捐款都将公开透明，定期公示使用情况。',
    icon: '💰',
    color: '#10B981',
    amounts: [10, 50, 100, 200, 500, 1000],
    paymentMethods: [
      { id: 'wechat', name: '微信支付', icon: '💚' },
      { id: 'alipay', name: '支付宝', icon: '💙' }
    ]
  },
  {
    id: 'd2',
    type: 'food',
    title: '粮食物资',
    description: '救助站每天需要消耗大量的猫粮狗粮。您可以捐赠以下物资，支持我们的救助工作。',
    icon: '🥣',
    color: '#F59E0B',
    items: [
      { name: '猫粮（成猫）', unit: '袋', price: 120, quantity: 0 },
      { name: '猫粮（幼猫）', unit: '袋', price: 150, quantity: 0 },
      { name: '狗粮（成犬）', unit: '袋', price: 180, quantity: 0 },
      { name: '狗粮（幼犬）', unit: '袋', price: 200, quantity: 0 },
      { name: '猫罐头', unit: '箱', price: 240, quantity: 0 },
      { name: '狗罐头', unit: '箱', price: 300, quantity: 0 },
      { name: '营养膏', unit: '支', price: 80, quantity: 0 }
    ]
  },
  {
    id: 'd3',
    type: 'medical',
    title: '医疗物资',
    description: '医疗物资是救助站最急需的物资之一，很多流浪动物都需要治疗。',
    icon: '💊',
    color: '#EF4444',
    items: [
      { name: '宠物驱虫药', unit: '盒', price: 60, quantity: 0 },
      { name: '宠物感冒药', unit: '盒', price: 45, quantity: 0 },
      { name: '皮肤药膏', unit: '支', price: 55, quantity: 0 },
      { name: '碘伏/酒精', unit: '瓶', price: 15, quantity: 0 },
      { name: '医用纱布', unit: '包', price: 25, quantity: 0 },
      { name: '宠物体温计', unit: '支', price: 35, quantity: 0 }
    ]
  },
  {
    id: 'd4',
    type: 'daily',
    title: '生活用品',
    description: '日常消耗品也是救助站的刚需，您的捐赠能让毛孩子们生活得更舒适。',
    icon: '🧻',
    color: '#3B82F6',
    items: [
      { name: '宠物尿垫', unit: '包', price: 40, quantity: 0 },
      { name: '猫砂', unit: '袋', price: 35, quantity: 0 },
      { name: '宠物毛巾', unit: '条', price: 25, quantity: 0 },
      { name: '宠物食盆', unit: '个', price: 30, quantity: 0 },
      { name: '宠物窝', unit: '个', price: 80, quantity: 0 },
      { name: '牵引绳', unit: '根', price: 45, quantity: 0 },
      { name: '指甲剪', unit: '个', price: 20, quantity: 0 }
    ]
  }
];

const SHELTER_DONATION_RECORDS = [
  {
    id: 'dr1',
    type: 'money',
    amount: 100,
    donorName: '爱心人士',
    message: '希望毛孩子们都能找到家',
    createTime: Date.now() - 3600000
  },
  {
    id: 'dr2',
    type: 'food',
    items: [{ name: '猫粮（成猫）', quantity: 2 }],
    totalAmount: 240,
    donorName: '张同学',
    message: '小小心意，希望能帮到它们',
    createTime: Date.now() - 7200000
  },
  {
    id: 'dr3',
    type: 'money',
    amount: 500,
    donorName: '匿名',
    message: '',
    createTime: Date.now() - 86400000
  },
  {
    id: 'dr4',
    type: 'medical',
    items: [{ name: '宠物驱虫药', quantity: 5 }],
    totalAmount: 300,
    donorName: '王女士',
    message: '之前领养了咪咪，现在来感谢救助站',
    createTime: Date.now() - 86400000 * 2
  },
  {
    id: 'dr5',
    type: 'money',
    amount: 50,
    donorName: '李同学',
    message: '加油！',
    createTime: Date.now() - 86400000 * 3
  }
];

const SHELTER_VOLUNTEER_ACTIVITIES = [
  {
    id: 'va1',
    title: '周末清洁日',
    description: '每周六上午组织志愿者到救助站进行清洁工作，包括打扫犬舍猫舍、消毒、整理物资等。',
    date: Date.now() + 86400000 * 3,
    dateText: '本周六 09:00-12:00',
    location: '流浪动物救助站',
    locationAddress: '学校西门外200米',
    maxParticipants: 15,
    currentParticipants: 8,
    roles: ['cleaning', 'feeding'],
    requirements: '无特殊要求，有爱心、能吃苦耐劳即可',
    organizer: '救助站',
    contactName: '李站长',
    contactPhone: '138****8888',
    status: 'recruiting',
    images: ['https://picsum.photos/seed/vol1/800/400'],
    views: 456,
    createTime: Date.now() - 86400000 * 2
  },
  {
    id: 'va2',
    title: '遛狗陪玩活动',
    description: '救助站的狗狗们每天都需要充足的运动。欢迎爱狗人士报名，带狗狗们出去散步玩耍。',
    date: Date.now() + 86400000 * 5,
    dateText: '下周一 16:00-18:00',
    location: '流浪动物救助站 + 附近公园',
    locationAddress: '学校西门外200米',
    maxParticipants: 10,
    currentParticipants: 5,
    roles: ['walking'],
    requirements: '需要有一定的养狗经验，能控制住狗狗',
    organizer: '救助站',
    contactName: '王志愿者',
    contactPhone: '139****9999',
    status: 'recruiting',
    images: ['https://picsum.photos/seed/vol2/800/400'],
    views: 321,
    createTime: Date.now() - 86400000 * 1
  },
  {
    id: 'va3',
    title: '流浪动物摄影日',
    description: '好的照片能帮助流浪动物更快找到家。欢迎有摄影基础的同学为毛孩子们拍摄美照。',
    date: Date.now() + 86400000 * 7,
    dateText: '下周三 14:00-17:00',
    location: '流浪动物救助站',
    locationAddress: '学校西门外200米',
    maxParticipants: 5,
    currentParticipants: 2,
    roles: ['photography'],
    requirements: '需要自带相机，有动物摄影经验优先',
    organizer: '救助站',
    contactName: '张志愿者',
    contactPhone: '137****7777',
    status: 'recruiting',
    images: ['https://picsum.photos/seed/vol3/800/400'],
    views: 289,
    createTime: Date.now() - 86400000 * 1
  },
  {
    id: 'va4',
    title: '领养日活动',
    description: '每月一次的大型领养日活动，需要大量志愿者协助场地布置、接待咨询、动物护理等工作。',
    date: Date.now() + 86400000 * 14,
    dateText: '6月27日 10:00-18:00',
    location: '校园广场',
    locationAddress: '学校中心广场',
    maxParticipants: 30,
    currentParticipants: 12,
    roles: ['adoption', 'feeding', 'cleaning', 'transport'],
    requirements: '需要全天参与，有经验者优先',
    organizer: '救助站 + 校学生会',
    contactName: '李站长',
    contactPhone: '138****8888',
    status: 'recruiting',
    images: ['https://picsum.photos/seed/vol4/800/400'],
    views: 678,
    createTime: Date.now() - 86400000 * 5
  }
];

const SHELTER_VOLUNTEER_SIGNUPS = [
  {
    id: 'vs1',
    activityId: 'va1',
    activityTitle: '周末清洁日',
    volunteerName: '张同学',
    volunteerPhone: '138****8888',
    volunteerAvatar: 'https://picsum.photos/seed/avatar1/100/100',
    role: 'cleaning',
    experience: '参加过2次志愿者活动',
    note: '有清洁经验，自带手套',
    status: 'approved',
    createTime: Date.now() - 86400000 * 1
  },
  {
    id: 'vs2',
    activityId: 'va1',
    activityTitle: '周末清洁日',
    volunteerName: '李同学',
    volunteerPhone: '139****9999',
    volunteerAvatar: 'https://picsum.photos/seed/avatar2/100/100',
    role: 'feeding',
    experience: '养过猫，有照顾宠物经验',
    note: '',
    status: 'pending',
    createTime: Date.now() - 3600000
  }
];

const SHELTER_DONATION_USAGE = [
  {
    id: 'du1',
    date: '2026年5月',
    totalIncome: 23450,
    totalExpense: 18900,
    categories: [
      { name: '医疗支出', amount: 8500, percentage: 45 },
      { name: '粮食采购', amount: 5670, percentage: 30 },
      { name: '物资采购', amount: 2835, percentage: 15 },
      { name: '场地维护', amount: 1895, percentage: 10 }
    ],
    details: [
      { item: '小黑的骨折手术', amount: 5000, date: '5月10日' },
      { item: '采购猫粮20袋', amount: 2400, date: '5月15日' },
      { item: '采购狗粮15袋', amount: 2700, date: '5月15日' },
      { item: '疫苗接种', amount: 2200, date: '5月20日' },
      { item: '消毒用品采购', amount: 850, date: '5月8日' },
      { item: '水电费用', amount: 1200, date: '5月25日' }
    ]
  }
];

const SHELTER_QUICK_ENTRIES = [
  { id: 'pets', title: '待领养', icon: '🐾', color: '#10B981', path: '/pages/animal-shelter/pets' },
  { id: 'adopt', title: '领养流程', icon: '📝', color: '#3B82F6', path: '/pages/animal-shelter/adopt-form' },
  { id: 'donation', title: '爱心捐赠', icon: '💝', color: '#EC4899', path: '/pages/animal-shelter/donation' },
  { id: 'volunteer', title: '志愿者', icon: '🙋', color: '#8B5CF6', path: '/pages/animal-shelter/volunteer-signup' },
  { id: 'records', title: '回访记录', icon: '📋', color: '#F59E0B', path: '/pages/animal-shelter/visit-records' },
  { id: 'my', title: '我的记录', icon: '👤', color: '#14B8A6', path: '/pages/animal-shelter/my-records' }
];

const SHELTER_KNOWLEDGE = [
  {
    id: 'k1',
    title: '领养前的准备工作',
    content: '在决定领养宠物之前，请仔细考虑以下几点：\n1. 你是否有足够的时间和精力照顾它？\n2. 你的居住环境是否允许养宠物？\n3. 你是否有足够的经济能力承担宠物的日常开销和医疗费用？\n4. 你是否了解宠物的习性和需要？\n5. 你的家人是否都支持养宠物？\n\n请记住，领养是一份十几年的承诺，不是一时的冲动。',
    icon: '📋',
    views: 1234
  },
  {
    id: 'k2',
    title: '新宠到家注意事项',
    content: '新宠物到家第一周非常重要：\n1. 给它足够的空间和时间适应新环境\n2. 不要急于互动，让它主动接近你\n3. 保持之前的饮食习惯，不要突然换粮\n4. 准备好必要的用品：食盆、水盆、窝、猫砂盆/狗厕所\n5. 7-10天后如果一切正常，可以带去医院做体检和驱虫\n6. 不要立即洗澡，至少等一周后再洗\n7. 注意观察它的饮食、排便和精神状态',
    icon: '🏠',
    views: 876
  },
  {
    id: 'k3',
    title: '宠物基础医疗知识',
    content: '宠物健康小常识：\n1. 定期接种疫苗：猫三联/狗四联、狂犬疫苗\n2. 定期驱虫：体外驱虫每月一次，体内驱虫每3个月一次\n3. 适龄绝育：6-8个月是最佳绝育时间\n4. 观察异常：食欲下降、精神萎靡、呕吐腹泻超过24小时请及时就医\n5. 适龄体检：7岁以下每年体检一次，7岁以上每半年一次\n6. 合理喂养：选择正规品牌的宠物粮，不要喂人的食物',
    icon: '🏥',
    views: 956
  }
];

const MOCK_LOW_CARBON_ACTIVITIES = [
  {
    title: '校园植树节',
    type: 'tree_planting',
    description: '一起在校园种下绿色希望，为地球增添一抹绿色',
    location: '校园后山绿化区',
    startTime: Date.now() + 3 * 86400000,
    endTime: Date.now() + 3 * 86400000 + 3 * 3600000,
    maxParticipants: 50,
    points: 20,
    carbon: 5.0,
    organizer: '校学生会环保部',
    contact: '张同学 138****1234'
  },
  {
    title: '世界环境日校园清洁行动',
    type: 'cleanup',
    description: '响应世界环境日号召，一起清洁校园环境，捡拾垃圾并分类处理',
    location: '校园中心广场',
    startTime: Date.now() + 5 * 86400000,
    endTime: Date.now() + 5 * 86400000 + 2 * 3600000,
    maxParticipants: 80,
    points: 15,
    carbon: 3.0,
    organizer: '环保志愿者协会',
    contact: '李同学 139****5678'
  },
  {
    title: '环保知识讲座：低碳生活从我做起',
    type: 'lecture',
    description: '邀请环境学院教授分享低碳生活理念与实践方法，了解日常生活中的减碳小技巧',
    location: '学术报告厅A201',
    startTime: Date.now() + 7 * 86400000,
    endTime: Date.now() + 7 * 86400000 + 2 * 3600000,
    maxParticipants: 200,
    points: 10,
    carbon: 1.0,
    organizer: '环境学院学生会',
    contact: '王同学 137****9012'
  },
  {
    title: '垃圾分类挑战赛',
    type: 'competition',
    description: '分组进行垃圾分类知识竞赛与实操比拼，赢取环保积分奖励',
    location: '学生活动中心',
    startTime: Date.now() + 10 * 86400000,
    endTime: Date.now() + 10 * 86400000 + 3 * 3600000,
    maxParticipants: 60,
    points: 25,
    carbon: 2.0,
    organizer: '后勤管理处',
    contact: '赵同学 136****3456'
  },
  {
    title: '废旧物品回收创意DIY',
    type: 'recycling',
    description: '将废旧物品变废为宝，发挥创意制作实用小物件，体验循环利用的乐趣',
    location: '创客空间',
    startTime: Date.now() + 14 * 86400000,
    endTime: Date.now() + 14 * 86400000 + 4 * 3600000,
    maxParticipants: 30,
    points: 15,
    carbon: 2.5,
    organizer: '创意手工社',
    contact: '陈同学 135****7890'
  }
];

const MOCK_LOW_CARBON_REWARDS = [
  {
    title: '食堂满减券',
    category: 'coupon',
    description: '校园食堂消费满15元减3元',
    points: 30,
    stock: 100,
    totalStock: 100,
    image: '',
    validityDays: 30
  },
  {
    title: '奶茶优惠券',
    category: 'coupon',
    description: '校内奶茶店任意饮品立减5元',
    points: 50,
    stock: 50,
    totalStock: 50,
    image: '',
    validityDays: 15
  },
  {
    title: '环保帆布袋',
    category: 'gift',
    description: '定制环保帆布袋，印有校园低碳标语',
    points: 200,
    stock: 20,
    totalStock: 20,
    image: '',
    validityDays: 0
  },
  {
    title: '迷你绿植盆栽',
    category: 'gift',
    description: '一盆迷你多肉植物，点缀你的书桌',
    points: 150,
    stock: 30,
    totalStock: 30,
    image: '',
    validityDays: 0
  },
  {
    title: '低碳达人头衔',
    category: 'virtual',
    description: '获得专属低碳达人头衔，展示在你的个人主页',
    points: 100,
    stock: 999,
    totalStock: 999,
    image: '',
    validityDays: 90
  },
  {
    title: '自习室预约优先权',
    category: 'service',
    description: '享受7天自习室预约优先权',
    points: 80,
    stock: 200,
    totalStock: 200,
    image: '',
    validityDays: 7
  },
  {
    title: '打印优惠券',
    category: 'coupon',
    description: '校内打印店免费打印20张',
    points: 40,
    stock: 80,
    totalStock: 80,
    image: '',
    validityDays: 30
  },
  {
    title: '运动手环',
    category: 'gift',
    description: '简约运动手环，记录你的低碳出行步数',
    points: 500,
    stock: 10,
    totalStock: 10,
    image: '',
    validityDays: 0
  }
];

const MOCK_LOW_CARBON_LEADERBOARD = [
  { userId: 'user_lc_1', userName: '林小绿', totalPoints: 860, totalCarbon: 72.5, checkinDays: 45, walkCount: 30, emptyPlateCount: 40, paperlessCount: 25, transportCount: 20 },
  { userId: 'user_lc_2', userName: '王环保', totalPoints: 720, totalCarbon: 58.3, checkinDays: 38, walkCount: 25, emptyPlateCount: 35, paperlessCount: 20, transportCount: 18 },
  { userId: 'user_lc_3', userName: '张低碳', totalPoints: 650, totalCarbon: 51.0, checkinDays: 35, walkCount: 20, emptyPlateCount: 30, paperlessCount: 28, transportCount: 15 },
  { userId: 'user_lc_4', userName: '李步行', totalPoints: 580, totalCarbon: 45.8, checkinDays: 30, walkCount: 28, emptyPlateCount: 20, paperlessCount: 15, transportCount: 12 },
  { userId: 'user_lc_5', userName: '陈绿意', totalPoints: 520, totalCarbon: 40.2, checkinDays: 28, walkCount: 18, emptyPlateCount: 25, paperlessCount: 22, transportCount: 10 },
  { userId: 'user_lc_6', userName: '赵环保', totalPoints: 460, totalCarbon: 36.5, checkinDays: 25, walkCount: 15, emptyPlateCount: 22, paperlessCount: 18, transportCount: 8 },
  { userId: 'user_lc_7', userName: '刘绿色', totalPoints: 390, totalCarbon: 30.8, checkinDays: 22, walkCount: 12, emptyPlateCount: 18, paperlessCount: 14, transportCount: 7 },
  { userId: 'user_lc_8', userName: '黄减碳', totalPoints: 320, totalCarbon: 25.1, checkinDays: 18, walkCount: 10, emptyPlateCount: 15, paperlessCount: 10, transportCount: 5 },
  { userId: 'user_lc_9', userName: '周生态', totalPoints: 250, totalCarbon: 19.6, checkinDays: 15, walkCount: 8, emptyPlateCount: 12, paperlessCount: 8, transportCount: 4 },
  { userId: 'user_lc_10', userName: '吴清风', totalPoints: 180, totalCarbon: 14.2, checkinDays: 10, walkCount: 5, emptyPlateCount: 8, paperlessCount: 6, transportCount: 3 }
];

const MOCK_ALUMNI_MENTORS = [
  {
    id: 'mentor_1',
    name: '张明远',
    avatar: 'https://picsum.photos/seed/alumni1/200/200',
    title: 'ceo',
    graduationYear: '2008',
    college: 'cs',
    company: '星辰科技有限公司',
    position: '创始人兼CEO',
    industry: 'internet',
    city: '北京',
    bio: '连续创业者，曾在多家知名互联网公司担任高管。2015年创办星辰科技，专注于人工智能领域，公司估值超10亿。',
    expertise: ['创业指导', '产品规划', '融资策略', '团队管理'],
    availableSlots: 5,
    rating: 4.9,
    reviewCount: 128,
    successCases: 15,
    appointmentFee: 299,
    yearsOfExperience: 15
  },
  {
    id: 'mentor_2',
    name: '李雅琪',
    avatar: 'https://picsum.photos/seed/alumni2/200/200',
    title: 'director',
    graduationYear: '2010',
    college: 'business',
    company: '华信资本',
    position: '投资总监',
    industry: 'finance',
    city: '上海',
    bio: '资深投资人，专注于TMT领域早期投资。曾主导投资多个成功项目，管理基金规模超20亿。',
    expertise: ['融资指导', '商业计划书', '估值谈判', '资源对接'],
    availableSlots: 8,
    rating: 4.8,
    reviewCount: 96,
    successCases: 23,
    appointmentFee: 399,
    yearsOfExperience: 12
  },
  {
    id: 'mentor_3',
    name: '王浩然',
    avatar: 'https://picsum.photos/seed/alumni3/200/200',
    title: 'senior_engineer',
    graduationYear: '2015',
    college: 'ee',
    company: '字节跳动',
    position: '高级算法工程师',
    industry: 'internet',
    city: '北京',
    bio: '算法专家，专注于大语言模型和推荐系统方向。曾在多个顶级会议发表论文。',
    expertise: ['算法面试', '技术成长', '职业规划', '论文指导'],
    availableSlots: 10,
    rating: 4.9,
    reviewCount: 156,
    successCases: 45,
    appointmentFee: 199,
    yearsOfExperience: 8
  },
  {
    id: 'mentor_4',
    name: '陈思雨',
    avatar: 'https://picsum.photos/seed/alumni4/200/200',
    title: 'professor',
    graduationYear: '2005',
    college: 'science',
    company: '清华大学',
    position: '教授/博导',
    industry: 'education',
    city: '北京',
    bio: '博士生导师，国家杰出青年基金获得者。研究方向为量子计算与量子信息。',
    expertise: ['考研考博', '学术研究', '论文写作', '科研方法'],
    availableSlots: 3,
    rating: 5.0,
    reviewCount: 68,
    successCases: 30,
    appointmentFee: 499,
    yearsOfExperience: 18
  },
  {
    id: 'mentor_5',
    name: '刘建国',
    avatar: 'https://picsum.photos/seed/alumni5/200/200',
    title: 'manager',
    graduationYear: '2012',
    college: 'me',
    company: '比亚迪',
    position: '产品经理',
    industry: 'manufacturing',
    city: '深圳',
    bio: '资深产品经理，曾主导多款爆款产品的设计与研发。擅长从0到1的产品构建。',
    expertise: ['产品设计', '需求分析', '项目管理', '求职指导'],
    availableSlots: 12,
    rating: 4.7,
    reviewCount: 89,
    successCases: 28,
    appointmentFee: 159,
    yearsOfExperience: 10
  },
  {
    id: 'mentor_6',
    name: '赵晓琳',
    avatar: 'https://picsum.photos/seed/alumni6/200/200',
    title: 'investor',
    graduationYear: '2006',
    college: 'finance',
    company: '红杉资本',
    position: '合伙人',
    industry: 'finance',
    city: '北京',
    bio: '知名投资人，专注于消费和科技领域。投资案例包括多家上市公司。',
    expertise: ['创业融资', '商业模式', '战略规划', '上市辅导'],
    availableSlots: 2,
    rating: 4.9,
    reviewCount: 42,
    successCases: 50,
    appointmentFee: 999,
    yearsOfExperience: 17
  },
  {
    id: 'mentor_7',
    name: '孙文博',
    avatar: 'https://picsum.photos/seed/alumni7/200/200',
    title: 'lawyer',
    graduationYear: '2009',
    college: 'law',
    company: '金杜律师事务所',
    position: '高级合伙人',
    industry: 'consulting',
    city: '北京',
    bio: '知名律师，专注于知识产权和企业法务领域。曾代理多起重大案件。',
    expertise: ['知识产权', '公司法务', '合同审查', '创业法律'],
    availableSlots: 6,
    rating: 4.8,
    reviewCount: 75,
    successCases: 80,
    appointmentFee: 599,
    yearsOfExperience: 14
  },
  {
    id: 'mentor_8',
    name: '周慧敏',
    avatar: 'https://picsum.photos/seed/alumni8/200/200',
    title: 'doctor',
    graduationYear: '2007',
    college: 'medicine',
    company: '协和医院',
    position: '主任医师',
    industry: 'medical',
    city: '北京',
    bio: '医学博士，主任医师，硕士生导师。擅长心血管疾病的诊断与治疗。',
    expertise: ['医学考研', '临床技能', '职业规划', '医学研究'],
    availableSlots: 4,
    rating: 4.9,
    reviewCount: 56,
    successCases: 35,
    appointmentFee: 699,
    yearsOfExperience: 16
  }
];

const MOCK_ALUMNI_POSTS = [
  {
    id: 'post_1',
    type: 'share',
    userId: 'user_alumni_1',
    userName: '张明远',
    userAvatar: 'https://picsum.photos/seed/alumni1/200/200',
    graduationYear: '2008',
    college: 'cs',
    company: '星辰科技',
    title: '从校园到创业，我的十年成长之路',
    content: '毕业十年，从一个懵懂的毕业生到创办自己的公司，想和学弟学妹们分享一些经验和教训。\n\n1. 保持学习的热情，技术更新很快，要持续学习\n2. 多与人交流，人脉很重要\n3. 敢于尝试，年轻就是资本\n4. 保持健康，身体是革命的本钱\n\n欢迎大家提问，我会尽量回答～',
    images: [],
    likes: 328,
    liked: false,
    comments: 56,
    views: 2456,
    createTime: Date.now() - 86400000
  },
  {
    id: 'post_2',
    type: 'job',
    userId: 'user_alumni_2',
    userName: '李雅琪',
    userAvatar: 'https://picsum.photos/seed/alumni2/200/200',
    graduationYear: '2010',
    college: 'business',
    company: '华信资本',
    title: '【内推】华信资本招聘投资经理',
    content: '我们团队在招投资经理，有兴趣的学弟学妹可以联系我。\n\n岗位要求：\n- 本科及以上学历，金融/经济相关专业优先\n- 2年以上投资或咨询经验\n- 良好的沟通能力和分析能力\n- 对TMT领域有一定了解\n\n工作地点：上海陆家嘴\n薪资：面议，有竞争力\n\n简历请发送到我的邮箱，标题注明「校友内推-姓名」',
    images: [],
    likes: 156,
    liked: false,
    comments: 32,
    views: 1890,
    createTime: Date.now() - 172800000
  },
  {
    id: 'post_3',
    type: 'activity',
    userId: 'user_alumni_3',
    userName: '校友活动部',
    userAvatar: 'https://picsum.photos/seed/alumni_org/200/200',
    graduationYear: '',
    college: '',
    company: '校友会',
    title: '【活动预告】2026校友返校日即将举行',
    content: '亲爱的校友们：\n\n一年一度的校友返校日即将举行！欢迎各位校友回家看看～\n\n📅 时间：2026年10月15日（周六）\n📍 地点：学校本部\n\n活动内容：\n1. 校长见面会\n2. 各学院座谈会\n3. 校友招聘会\n4. 校园美食节\n5. 校庆晚会\n\n报名方式：在本小程序「返校预约」页面预约\n\n期待与大家相聚！',
    images: [
      'https://picsum.photos/seed/alumni_event1/800/600'
    ],
    likes: 567,
    liked: true,
    comments: 89,
    views: 4567,
    createTime: Date.now() - 259200000
  },
  {
    id: 'post_4',
    type: 'help',
    userId: 'user_alumni_4',
    userName: '迷茫的学弟',
    userAvatar: 'https://picsum.photos/seed/student1/200/200',
    graduationYear: '2023',
    college: 'cs',
    company: '待业中',
    title: '学长学姐们，计算机专业的就业方向有哪些？',
    content: '马上大四了，对未来就业方向很迷茫。想问问各位学长学姐，计算机专业除了做开发，还有哪些发展方向？\n\n目前考虑的方向有：\n1. 前端开发\n2. 后端开发\n3. 算法\n4. 产品经理\n5. 测试开发\n\n想了解一下各个方向的发展前景、薪资水平、工作强度等。\n\n先谢谢各位学长学姐了！',
    images: [],
    likes: 89,
    liked: false,
    comments: 67,
    views: 1234,
    createTime: Date.now() - 345600000
  },
  {
    id: 'post_5',
    type: 'life',
    userId: 'user_alumni_5',
    userName: '王浩然',
    userAvatar: 'https://picsum.photos/seed/alumni3/200/200',
    graduationYear: '2015',
    college: 'ee',
    company: '字节跳动',
    title: '回学校参加校招，感觉学弟学妹们都好厉害',
    content: '今天回学校参加校招宣讲，作为校友代表分享一些工作经验。\n\n看到台下一张张年轻的面孔，想起了当年的自己。\n\n感慨时间过得真快，毕业都快10年了。但感觉母校还是那么亲切，食堂的味道都没变～\n\n欢迎对算法感兴趣的同学投递我们团队！',
    images: [
      'https://picsum.photos/seed/alumni_campus1/800/600',
      'https://picsum.photos/seed/alumni_campus2/800/600'
    ],
    likes: 234,
    liked: false,
    comments: 45,
    views: 1678,
    createTime: Date.now() - 432000000
  },
  {
    id: 'post_6',
    type: 'share',
    userId: 'user_alumni_6',
    userName: '陈思雨',
    userAvatar: 'https://picsum.photos/seed/alumni4/200/200',
    graduationYear: '2005',
    college: 'science',
    company: '清华大学',
    title: '给想读博的同学一些建议',
    content: '最近收到很多学弟学妹的私信，问读博的事情。在这里统一回答一下。\n\n首先，问自己几个问题：\n1. 你真的喜欢做研究吗？\n2. 你能承受孤独和压力吗？\n3. 你对未来的职业规划是什么？\n\n如果答案都是肯定的，那欢迎加入科研的行列。\n\n读博期间最重要的几件事：\n1. 找到一个好导师（这真的很重要！）\n2. 尽早确定研究方向\n3. 多读论文，多做实验\n4. 保持健康的作息\n\n有问题可以在评论区问我～',
    images: [],
    likes: 412,
    liked: false,
    comments: 78,
    views: 3245,
    createTime: Date.now() - 518400000
  }
];

const MOCK_ALUMNI_CARD_BENEFITS = [
  {
    id: 'benefit_1',
    category: 'education',
    title: '继续教育优惠',
    subtitle: '学历提升 & 职业培训',
    description: '校友报考本校在职研究生、MBA、EMBA等项目，可享受学费减免优惠。同时，各类职业培训课程也有专属折扣。',
    icon: '📚',
    color: '#3B82F6',
    details: [
      '在职研究生学费减免20%',
      'MBA/EMBA专项奖学金',
      '职业培训课程8折优惠',
      '终身学习平台免费会员'
    ]
  },
  {
    id: 'benefit_2',
    category: 'library',
    title: '图书馆资源',
    subtitle: '海量资源 & 安静空间',
    description: '校友凭校友卡可进入图书馆阅览，免费访问部分电子资源数据库，享受馆内阅览服务。',
    icon: '📖',
    color: '#10B981',
    details: [
      '图书馆阅览权限',
      '部分数据库访问权限',
      '校友借阅证办理（押金制）',
      '自习室预约服务'
    ]
  },
  {
    id: 'benefit_3',
    category: 'sports',
    title: '体育健身',
    subtitle: '运动设施 & 健身课程',
    description: '校友可使用校内体育场馆，包括体育馆、游泳池、健身房等，享受优惠价格。',
    icon: '🏃',
    color: '#F59E0B',
    details: [
      '体育馆5折优惠',
      '游泳池7折优惠',
      '健身房年卡8折',
      '各类运动课程优惠'
    ]
  },
  {
    id: 'benefit_4',
    category: 'dining',
    title: '餐饮服务',
    subtitle: '校园美食 & 优惠价格',
    description: '校友可在校内各食堂用餐，享受与在校学生同价的美味餐饮。',
    icon: '🍜',
    color: '#EF4444',
    details: [
      '各食堂通用',
      '学生同价',
      '美食节专属活动',
      '校友餐厅优先预订'
    ]
  },
  {
    id: 'benefit_5',
    category: 'medical',
    title: '医疗服务',
    subtitle: '校医院 & 健康管理',
    description: '校友可在校医院就诊，享受基本医疗服务，同时提供健康体检优惠套餐。',
    icon: '🏥',
    color: '#8B5CF6',
    details: [
      '校医院就诊服务',
      '健康体检7折优惠',
      '健康讲座免费参与',
      '心理咨询服务'
    ]
  },
  {
    id: 'benefit_6',
    category: 'culture',
    title: '文化活动',
    subtitle: '艺术演出 & 校园活动',
    description: '校友可优先参与各类校园文化活动，包括校庆晚会、艺术节、学术讲座等。',
    icon: '🎭',
    color: '#EC4899',
    details: [
      '校庆活动优先参与',
      '艺术演出门票优惠',
      '学术讲座免费',
      '校友专属活动'
    ]
  },
  {
    id: 'benefit_7',
    category: 'travel',
    title: '出行优惠',
    subtitle: '交通住宿 & 校友协议',
    description: '与多家航空公司、酒店集团合作，为校友提供专属出行优惠。',
    icon: '✈️',
    color: '#14B8A6',
    details: [
      '合作航空公司机票折扣',
      '协议酒店优惠价格',
      '租车服务9折',
      '校友之家免费入住（部分城市）'
    ]
  },
  {
    id: 'benefit_8',
    category: 'shopping',
    title: '购物优惠',
    subtitle: '品牌折扣 & 专属福利',
    description: '与众多品牌合作，为校友提供专属购物折扣和会员福利。',
    icon: '🛍️',
    color: '#6366F1',
    details: [
      '合作品牌专属折扣',
      '校庆纪念品优惠',
      '校友商城积分双倍',
      '新品优先体验'
    ]
  }
];

const MOCK_ALUMNI_PROFILES = [
  {
    id: 'profile_1',
    userId: 'user_alumni_1',
    name: '张明远',
    avatar: 'https://picsum.photos/seed/alumni1/200/200',
    graduationYear: '2008',
    college: 'cs',
    major: '计算机科学与技术',
    industry: 'internet',
    company: '星辰科技有限公司',
    position: '创始人兼CEO',
    city: '北京',
    verified: true,
    verifyStatus: 'approved',
    bio: '连续创业者，专注人工智能领域',
    wechat: 'zhangmingyuan888',
    email: 'zhangmy@startech.com',
    companyWebsite: 'www.startech.com',
    willingToHelp: true,
    expertise: ['创业', 'AI', '产品', '融资'],
    connections: 256
  },
  {
    id: 'profile_2',
    userId: 'user_alumni_2',
    name: '李雅琪',
    avatar: 'https://picsum.photos/seed/alumni2/200/200',
    graduationYear: '2010',
    college: 'business',
    major: '金融学',
    industry: 'finance',
    company: '华信资本',
    position: '投资总监',
    city: '上海',
    verified: true,
    verifyStatus: 'approved',
    bio: '专注TMT领域早期投资',
    wechat: 'liyaqi_invest',
    email: 'liyq@huaxincapital.com',
    willingToHelp: true,
    expertise: ['投资', '融资', '商业分析'],
    connections: 189
  },
  {
    id: 'profile_3',
    userId: 'user_alumni_3',
    name: '王浩然',
    avatar: 'https://picsum.photos/seed/alumni3/200/200',
    graduationYear: '2015',
    college: 'ee',
    major: '电子信息工程',
    industry: 'internet',
    company: '字节跳动',
    position: '高级算法工程师',
    city: '北京',
    verified: true,
    verifyStatus: 'approved',
    bio: '算法工程师，热爱技术分享',
    wechat: 'wanghaoran_algo',
    email: 'wanghr@bytedance.com',
    willingToHelp: true,
    expertise: ['算法', '机器学习', '职业规划'],
    connections: 312
  }
];

const MOCK_TAKEOUT_MERCHANTS = [
  {
    id: 'tm1',
    name: '学府黄焖鸡米饭',
    cover: 'https://picsum.photos/seed/takeout1/800/400',
    category: 'chinese',
    rating: 4.7,
    reviewCount: 1286,
    sales: 5632,
    minOrderPrice: 20,
    deliveryFee: 3,
    freeDeliveryOver: 30,
    deliveryTime: 25,
    distance: 0.5,
    deliveryType: 'merchant',
    businessHours: {
      breakfast: '07:00-10:00',
      lunch: '10:30-14:00',
      dinner: '16:30-21:30'
    },
    location: '南门美食街23号',
    tags: ['品牌商家', '品质保障', '新用户立减'],
    promotions: [
      { type: 'full_reduction', title: '满20减3', desc: '满20元减3元，满35减6，满50减10' },
      { type: 'discount', title: '限时8折', desc: '今日招牌菜限时8折' },
      { type: 'free_delivery', title: '免配送费', desc: '满30元免配送费' }
    ],
    todayDiscounts: [
      { name: '黄焖鸡米饭', originalPrice: 22, discountPrice: 18, limit: 50 },
      { name: '黄焖排骨饭', originalPrice: 26, discountPrice: 21, limit: 30 },
      { name: '酸辣土豆丝', originalPrice: 12, discountPrice: 8, limit: 100 }
    ],
    isOpen: true
  },
  {
    id: 'tm2',
    name: '快乐汉堡炸鸡',
    cover: 'https://picsum.photos/seed/takeout2/800/400',
    category: 'western',
    rating: 4.5,
    reviewCount: 2341,
    sales: 8921,
    minOrderPrice: 25,
    deliveryFee: 5,
    freeDeliveryOver: 40,
    deliveryTime: 30,
    distance: 0.8,
    deliveryType: 'third_party',
    businessHours: {
      breakfast: '--:--',
      lunch: '10:00-14:30',
      dinner: '15:00-22:30'
    },
    location: '东门商业街8号',
    tags: ['人气爆款', '配送准时'],
    promotions: [
      { type: 'full_reduction', title: '满30减5', desc: '满30元减5元，满50减10，满80减18' },
      { type: 'gift', title: '买一送一', desc: '买汉堡送可乐' },
      { type: 'coupon', title: '新人专享', desc: '新用户15元无门槛券' }
    ],
    todayDiscounts: [
      { name: '香辣鸡腿堡套餐', originalPrice: 35, discountPrice: 25, limit: 80 },
      { name: '全家桶', originalPrice: 88, discountPrice: 68, limit: 20 },
      { name: '薯条(大)', originalPrice: 15, discountPrice: 9.9, limit: 150 }
    ],
    isOpen: true
  },
  {
    id: 'tm3',
    name: '樱花寿司日料',
    cover: 'https://picsum.photos/seed/takeout3/800/400',
    category: 'japanese',
    rating: 4.8,
    reviewCount: 892,
    sales: 3245,
    minOrderPrice: 30,
    deliveryFee: 4,
    freeDeliveryOver: 50,
    deliveryTime: 35,
    distance: 1.2,
    deliveryType: 'merchant',
    businessHours: {
      breakfast: '--:--',
      lunch: '11:00-14:00',
      dinner: '17:00-21:00'
    },
    location: '校园北路15号',
    tags: ['正宗日料', '新鲜食材', '好评如潮'],
    promotions: [
      { type: 'full_reduction', title: '满50减8', desc: '满50元减8元，满80减15，满120减25' },
      { type: 'discount', title: '寿司7折', desc: '全场寿司类7折' }
    ],
    todayDiscounts: [
      { name: '三文鱼寿司拼盘', originalPrice: 68, discountPrice: 48, limit: 25 },
      { name: '鳗鱼饭', originalPrice: 42, discountPrice: 32, limit: 40 },
      { name: '味增汤', originalPrice: 8, discountPrice: 1, limit: 200 }
    ],
    isOpen: true
  },
  {
    id: 'tm4',
    name: '老陕面馆',
    cover: 'https://picsum.photos/seed/takeout4/800/400',
    category: 'noodle',
    rating: 4.6,
    reviewCount: 1876,
    sales: 6543,
    minOrderPrice: 15,
    deliveryFee: 2,
    freeDeliveryOver: 25,
    deliveryTime: 20,
    distance: 0.3,
    deliveryType: 'merchant',
    businessHours: {
      breakfast: '06:30-09:30',
      lunch: '10:00-14:30',
      dinner: '16:30-21:00'
    },
    location: '西门小吃街5号',
    tags: ['十年老店', '量大实惠', '地道口味'],
    promotions: [
      { type: 'full_reduction', title: '满15减2', desc: '满15元减2元，满25减4，满35减6' },
      { type: 'free_delivery', title: '免配送费', desc: '满25元免配送费' }
    ],
    todayDiscounts: [
      { name: '油泼面', originalPrice: 16, discountPrice: 12, limit: 60 },
      { name: '肉夹馍', originalPrice: 10, discountPrice: 6, limit: 100 },
      { name: '羊肉泡馍', originalPrice: 28, discountPrice: 22, limit: 35 }
    ],
    isOpen: true
  },
  {
    id: 'tm5',
    name: '港式烧腊饭',
    cover: 'https://picsum.photos/seed/takeout5/800/400',
    category: 'rice',
    rating: 4.4,
    reviewCount: 1123,
    sales: 4567,
    minOrderPrice: 18,
    deliveryFee: 3,
    freeDeliveryOver: 35,
    deliveryTime: 28,
    distance: 0.9,
    deliveryType: 'third_party',
    businessHours: {
      breakfast: '--:--',
      lunch: '10:30-14:00',
      dinner: '16:30-20:30'
    },
    location: '南门美食街15号',
    tags: ['正宗港式', '现做现卖'],
    promotions: [
      { type: 'full_reduction', title: '满25减4', desc: '满25元减4元，满40减8，满60减15' }
    ],
    todayDiscounts: [
      { name: '叉烧饭', originalPrice: 22, discountPrice: 17, limit: 50 },
      { name: '烧鸭饭', originalPrice: 25, discountPrice: 19, limit: 45 },
      { name: '双拼饭', originalPrice: 30, discountPrice: 24, limit: 30 }
    ],
    isOpen: true
  },
  {
    id: 'tm6',
    name: '蜜雪奶茶铺',
    cover: 'https://picsum.photos/seed/takeout6/800/400',
    category: 'drink',
    rating: 4.9,
    reviewCount: 3456,
    sales: 12345,
    minOrderPrice: 10,
    deliveryFee: 2,
    freeDeliveryOver: 20,
    deliveryTime: 15,
    distance: 0.4,
    deliveryType: 'merchant',
    businessHours: {
      breakfast: '08:00-10:00',
      lunch: '10:00-14:00',
      dinner: '14:00-22:00'
    },
    location: '南门学生超市旁',
    tags: ['网红饮品', '第二杯半价', '销量冠军'],
    promotions: [
      { type: 'discount', title: '第二杯半价', desc: '全场饮品第二杯半价' },
      { type: 'full_reduction', title: '满20减3', desc: '满20元减3元，满35减6' },
      { type: 'free_delivery', title: '免配送费', desc: '满20元免配送费' }
    ],
    todayDiscounts: [
      { name: '珍珠奶茶(大)', originalPrice: 12, discountPrice: 8, limit: 200 },
      { name: '杨枝甘露', originalPrice: 18, discountPrice: 12, limit: 80 },
      { name: '柠檬水', originalPrice: 8, discountPrice: 3.9, limit: 300 }
    ],
    isOpen: true
  },
  {
    id: 'tm7',
    name: '烤百味烧烤',
    cover: 'https://picsum.photos/seed/takeout7/800/400',
    category: 'bbq',
    rating: 4.7,
    reviewCount: 987,
    sales: 2876,
    minOrderPrice: 30,
    deliveryFee: 5,
    freeDeliveryOver: 60,
    deliveryTime: 40,
    distance: 1.5,
    deliveryType: 'third_party',
    businessHours: {
      breakfast: '--:--',
      lunch: '--:--',
      dinner: '17:00-01:00'
    },
    location: '东门夜市56号',
    tags: ['深夜食堂', '烟火气', '人气爆棚'],
    promotions: [
      { type: 'full_reduction', title: '满50减10', desc: '满50元减10元，满100减25，满150减40' },
      { type: 'gift', title: '送饮料', desc: '满60送可乐2罐' }
    ],
    todayDiscounts: [
      { name: '烤羊肉串(10串)', originalPrice: 30, discountPrice: 22, limit: 60 },
      { name: '烤鸡翅', originalPrice: 8, discountPrice: 5, limit: 150 },
      { name: '烤韭菜', originalPrice: 6, discountPrice: 3, limit: 200 }
    ],
    isOpen: true
  },
  {
    id: 'tm8',
    name: '小四川麻辣烫',
    cover: 'https://picsum.photos/seed/takeout8/800/400',
    category: 'hotpot',
    rating: 4.6,
    reviewCount: 1543,
    sales: 5432,
    minOrderPrice: 20,
    deliveryFee: 3,
    freeDeliveryOver: 35,
    deliveryTime: 32,
    distance: 0.7,
    deliveryType: 'merchant',
    businessHours: {
      breakfast: '--:--',
      lunch: '10:30-14:00',
      dinner: '16:30-22:00'
    },
    location: '西门美食街12号',
    tags: ['地道川味', '麻辣鲜香', '可自选辣度'],
    promotions: [
      { type: 'full_reduction', title: '满30减5', desc: '满30元减5元，满50减10，满80减18' },
      { type: 'discount', title: '素菜8折', desc: '今日素菜类8折' }
    ],
    todayDiscounts: [
      { name: '单人麻辣烫套餐', originalPrice: 28, discountPrice: 20, limit: 80 },
      { name: '肥牛卷', originalPrice: 15, discountPrice: 10, limit: 60 },
      { name: '金针菇', originalPrice: 6, discountPrice: 4, limit: 150 }
    ],
    isOpen: true
  },
  {
    id: 'tm9',
    name: '轻食沙拉工坊',
    cover: 'https://picsum.photos/seed/takeout9/800/400',
    category: 'vegetarian',
    rating: 4.5,
    reviewCount: 654,
    sales: 1876,
    minOrderPrice: 25,
    deliveryFee: 3,
    freeDeliveryOver: 40,
    deliveryTime: 25,
    distance: 1.0,
    deliveryType: 'merchant',
    businessHours: {
      breakfast: '07:30-10:00',
      lunch: '10:30-14:00',
      dinner: '16:30-20:30'
    },
    location: '北区生活广场18号',
    tags: ['健康低卡', '减脂必备', '新鲜蔬菜'],
    promotions: [
      { type: 'full_reduction', title: '满35减5', desc: '满35元减5元，满60减10' },
      { type: 'coupon', title: '新人立减', desc: '新用户立减8元' }
    ],
    todayDiscounts: [
      { name: '鸡胸肉沙拉', originalPrice: 32, discountPrice: 25, limit: 50 },
      { name: '牛油果三明治', originalPrice: 28, discountPrice: 22, limit: 40 },
      { name: '混合蔬菜盒', originalPrice: 18, discountPrice: 12, limit: 60 }
    ],
    isOpen: true
  },
  {
    id: 'tm10',
    name: '鲜果时光',
    cover: 'https://picsum.photos/seed/takeout10/800/400',
    category: 'fruit',
    rating: 4.7,
    reviewCount: 432,
    sales: 1234,
    minOrderPrice: 15,
    deliveryFee: 2,
    freeDeliveryOver: 25,
    deliveryTime: 20,
    distance: 0.6,
    deliveryType: 'merchant',
    businessHours: {
      breakfast: '08:00-10:00',
      lunch: '10:00-14:00',
      dinner: '14:00-21:30'
    },
    location: '中心食堂旁',
    tags: ['新鲜直达', '切盒配送', '应季水果'],
    promotions: [
      { type: 'full_reduction', title: '满20减3', desc: '满20元减3元，满35减6' },
      { type: 'discount', title: '第二份半价', desc: '鲜切水果第二份半价' }
    ],
    todayDiscounts: [
      { name: '西瓜切盒(大)', originalPrice: 18, discountPrice: 12, limit: 80 },
      { name: '草莓(一斤)', originalPrice: 22, discountPrice: 16, limit: 40 },
      { name: '混合果切', originalPrice: 25, discountPrice: 18, limit: 60 }
    ],
    isOpen: true
  },
  {
    id: 'tm11',
    name: '甜蜜烘焙坊',
    cover: 'https://picsum.photos/seed/takeout11/800/400',
    category: 'dessert',
    rating: 4.8,
    reviewCount: 567,
    sales: 1567,
    minOrderPrice: 20,
    deliveryFee: 3,
    freeDeliveryOver: 35,
    deliveryTime: 22,
    distance: 0.8,
    deliveryType: 'merchant',
    businessHours: {
      breakfast: '08:00-10:30',
      lunch: '10:30-14:00',
      dinner: '14:00-21:00'
    },
    location: '艺术楼旁',
    tags: ['手工现做', '生日蛋糕', '下午茶首选'],
    promotions: [
      { type: 'full_reduction', title: '满30减5', desc: '满30元减5元，满50减10' },
      { type: 'gift', title: '送小蛋糕', desc: '满50送纸杯蛋糕2个' }
    ],
    todayDiscounts: [
      { name: '提拉米苏', originalPrice: 28, discountPrice: 22, limit: 30 },
      { name: '芒果班戟(2个)', originalPrice: 22, discountPrice: 16, limit: 50 },
      { name: '生日蛋糕(6寸)', originalPrice: 128, discountPrice: 98, limit: 10 }
    ],
    isOpen: true
  },
  {
    id: 'tm12',
    name: '正新鸡排',
    cover: 'https://picsum.photos/seed/takeout12/800/400',
    category: 'snack',
    rating: 4.4,
    reviewCount: 2345,
    sales: 7654,
    minOrderPrice: 15,
    deliveryFee: 2,
    freeDeliveryOver: 25,
    deliveryTime: 18,
    distance: 0.5,
    deliveryType: 'merchant',
    businessHours: {
      breakfast: '--:--',
      lunch: '10:00-14:30',
      dinner: '14:30-22:00'
    },
    location: '南门小吃街1号',
    tags: ['国民小吃', '酥脆可口', '送饮料'],
    promotions: [
      { type: 'full_reduction', title: '满20减3', desc: '满20元减3元，满35减6' },
      { type: 'gift', title: '送酸梅汤', desc: '买鸡排送酸梅汤' }
    ],
    todayDiscounts: [
      { name: '招牌大鸡排', originalPrice: 18, discountPrice: 12, limit: 100 },
      { name: '炸鸡腿(2个)', originalPrice: 16, discountPrice: 11, limit: 80 },
      { name: '甘梅地瓜条', originalPrice: 10, discountPrice: 6, limit: 120 }
    ],
    isOpen: true
  }
];

const MOCK_TAKEOUT_PROMOTIONS_BANNER = [
  {
    id: 'pb1',
    title: '新人专享',
    subtitle: '新用户最高立减20元',
    icon: '🎁',
    bgColor: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
    link: ''
  },
  {
    id: 'pb2',
    title: '限时特惠',
    subtitle: '今日爆款菜低至5折',
    icon: '🔥',
    bgColor: 'linear-gradient(135deg, #FA8C16 0%, #FFA940 100%)',
    link: ''
  },
  {
    id: 'pb3',
    title: '免配送费',
    subtitle: '精选商家满额免配送',
    icon: '🚚',
    bgColor: 'linear-gradient(135deg, #52C41A 0%, #95DE64 100%)',
    link: ''
  },
  {
    id: 'pb4',
    title: '下午茶',
    subtitle: '奶茶甜品第二杯半价',
    icon: '🧋',
    bgColor: 'linear-gradient(135deg, #722ED1 0%, #9254DE 100%)',
    link: ''
  }
];

const MOCK_TRAINING_PLANS = [
  {
    id: 'plan_cs_2024',
    name: '计算机科学与技术专业培养方案（2024版）',
    major: '计算机科学与技术',
    grade: '2024',
    totalCredits: 140,
    requiredCredits: 100,
    electiveCredits: 40,
    description: '本专业培养具有良好的科学素养，系统地掌握计算机科学与技术的基本理论、基本知识和基本技能与方法的高级专门科学技术人才。'
  }
];

const MOCK_TRAINING_PLAN_COURSES = [
  {
    id: 'tp_course_1',
    planId: 'plan_cs_2024',
    courseCode: 'CS1001',
    name: '高等数学',
    type: 'required',
    credit: 5,
    semester: '1',
    category: '公共基础课',
    status: 'completed',
    score: 85,
    prerequisites: [],
    description: '微积分、线性代数等数学基础',
    availableClasses: [
      { id: 'class_1_1', teacher: '张建国教授', classroom: 'A栋301', dayOfWeek: 1, startSlot: 1, endSlot: 2, weeks: '1-16周' },
      { id: 'class_1_2', teacher: '李明副教授', classroom: 'B栋201', dayOfWeek: 3, startSlot: 3, endSlot: 4, weeks: '1-16周' }
    ]
  },
  {
    id: 'tp_course_2',
    planId: 'plan_cs_2024',
    courseCode: 'CS1002',
    name: '大学英语',
    type: 'required',
    credit: 3,
    semester: '1',
    category: '公共基础课',
    status: 'completed',
    score: 88,
    prerequisites: [],
    description: '英语听说读写综合能力培养',
    availableClasses: [
      { id: 'class_2_1', teacher: '王芳教授', classroom: 'C栋101', dayOfWeek: 2, startSlot: 1, endSlot: 2, weeks: '1-16周' },
      { id: 'class_2_2', teacher: '赵丽讲师', classroom: 'C栋102', dayOfWeek: 4, startSlot: 5, endSlot: 6, weeks: '1-16周' }
    ]
  },
  {
    id: 'tp_course_3',
    planId: 'plan_cs_2024',
    courseCode: 'CS1003',
    name: '程序设计基础',
    type: 'required',
    credit: 4,
    semester: '1',
    category: '专业基础课',
    status: 'completed',
    score: 92,
    prerequisites: [],
    description: 'C语言程序设计入门',
    availableClasses: [
      { id: 'class_3_1', teacher: '陈强教授', classroom: 'E栋301', dayOfWeek: 2, startSlot: 3, endSlot: 4, weeks: '1-16周' },
      { id: 'class_3_2', teacher: '刘洋副教授', classroom: 'E栋302', dayOfWeek: 5, startSlot: 1, endSlot: 2, weeks: '1-16周' }
    ]
  },
  {
    id: 'tp_course_4',
    planId: 'plan_cs_2024',
    courseCode: 'CS1004',
    name: '思想道德与法治',
    type: 'required',
    credit: 3,
    semester: '1',
    category: '公共基础课',
    status: 'completed',
    score: 82,
    prerequisites: [],
    description: '思想政治教育课程',
    availableClasses: [
      { id: 'class_4_1', teacher: '周明教授', classroom: 'D栋101', dayOfWeek: 1, startSlot: 5, endSlot: 6, weeks: '1-8周' }
    ]
  },
  {
    id: 'tp_course_5',
    planId: 'plan_cs_2024',
    courseCode: 'CS2001',
    name: '离散数学',
    type: 'required',
    credit: 4,
    semester: '2',
    category: '专业基础课',
    status: 'completed',
    score: 78,
    prerequisites: ['CS1001'],
    description: '集合论、图论、数理逻辑',
    availableClasses: [
      { id: 'class_5_1', teacher: '吴涛教授', classroom: 'A栋201', dayOfWeek: 1, startSlot: 3, endSlot: 4, weeks: '1-16周' },
      { id: 'class_5_2', teacher: '郑华副教授', classroom: 'A栋202', dayOfWeek: 4, startSlot: 1, endSlot: 2, weeks: '1-16周' }
    ]
  },
  {
    id: 'tp_course_6',
    planId: 'plan_cs_2024',
    courseCode: 'CS2002',
    name: '数据结构',
    type: 'required',
    credit: 5,
    semester: '2',
    category: '专业基础课',
    status: 'completed',
    score: 85,
    prerequisites: ['CS1003'],
    description: '线性表、树、图等数据结构',
    availableClasses: [
      { id: 'class_6_1', teacher: '孙伟教授', classroom: 'E栋401', dayOfWeek: 2, startSlot: 5, endSlot: 6, weeks: '1-16周' },
      { id: 'class_6_2', teacher: '马明副教授', classroom: 'E栋402', dayOfWeek: 3, startSlot: 1, endSlot: 2, weeks: '1-16周' }
    ]
  },
  {
    id: 'tp_course_7',
    planId: 'plan_cs_2024',
    courseCode: 'CS2003',
    name: '大学物理',
    type: 'required',
    credit: 4,
    semester: '2',
    category: '公共基础课',
    status: 'failed',
    score: 55,
    prerequisites: ['CS1001'],
    description: '力学、电磁学、光学',
    availableClasses: [
      { id: 'class_7_1', teacher: '黄强教授', classroom: 'B栋301', dayOfWeek: 3, startSlot: 5, endSlot: 6, weeks: '1-16周' },
      { id: 'class_7_2', teacher: '杨光副教授', classroom: 'B栋302', dayOfWeek: 5, startSlot: 3, endSlot: 4, weeks: '1-16周' }
    ]
  },
  {
    id: 'tp_course_8',
    planId: 'plan_cs_2024',
    courseCode: 'CS3001',
    name: '计算机组成原理',
    type: 'required',
    credit: 4,
    semester: '3',
    category: '专业课',
    status: 'pending',
    score: null,
    prerequisites: ['CS2002'],
    description: '计算机硬件系统组成',
    availableClasses: [
      { id: 'class_8_1', teacher: '胡军教授', classroom: 'E栋501', dayOfWeek: 1, startSlot: 3, endSlot: 4, weeks: '1-16周' },
      { id: 'class_8_2', teacher: '林平副教授', classroom: 'E栋502', dayOfWeek: 4, startSlot: 3, endSlot: 4, weeks: '1-16周' }
    ]
  },
  {
    id: 'tp_course_9',
    planId: 'plan_cs_2024',
    courseCode: 'CS3002',
    name: '操作系统',
    type: 'required',
    credit: 4,
    semester: '3',
    category: '专业课',
    status: 'pending',
    score: null,
    prerequisites: ['CS2002'],
    description: '进程管理、内存管理、文件系统',
    availableClasses: [
      { id: 'class_9_1', teacher: '何峰教授', classroom: 'E栋503', dayOfWeek: 2, startSlot: 1, endSlot: 2, weeks: '1-16周' },
      { id: 'class_9_2', teacher: '罗强副教授', classroom: 'E栋504', dayOfWeek: 5, startSlot: 1, endSlot: 2, weeks: '1-16周' }
    ]
  },
  {
    id: 'tp_course_10',
    planId: 'plan_cs_2024',
    courseCode: 'CS3003',
    name: '计算机网络',
    type: 'required',
    credit: 4,
    semester: '3',
    category: '专业课',
    status: 'pending',
    score: null,
    prerequisites: ['CS2002'],
    description: 'TCP/IP协议栈、网络编程',
    availableClasses: [
      { id: 'class_10_1', teacher: '郭伟教授', classroom: 'E栋601', dayOfWeek: 3, startSlot: 3, endSlot: 4, weeks: '1-16周' },
      { id: 'class_10_2', teacher: '梁杰副教授', classroom: 'E栋602', dayOfWeek: 4, startSlot: 5, endSlot: 6, weeks: '1-16周' }
    ]
  },
  {
    id: 'tp_course_11',
    planId: 'plan_cs_2024',
    courseCode: 'CS3004',
    name: '数据库系统原理',
    type: 'required',
    credit: 4,
    semester: '4',
    category: '专业课',
    status: 'pending',
    score: null,
    prerequisites: ['CS2002'],
    description: '关系型数据库、SQL、数据库设计',
    availableClasses: [
      { id: 'class_11_1', teacher: '宋涛教授', classroom: 'E栋603', dayOfWeek: 1, startSlot: 5, endSlot: 6, weeks: '1-16周' },
      { id: 'class_11_2', teacher: '唐亮副教授', classroom: 'E栋604', dayOfWeek: 3, startSlot: 1, endSlot: 2, weeks: '1-16周' }
    ]
  },
  {
    id: 'tp_course_12',
    planId: 'plan_cs_2024',
    courseCode: 'CS4001',
    name: '软件工程',
    type: 'required',
    credit: 4,
    semester: '4',
    category: '专业课',
    status: 'pending',
    score: null,
    prerequisites: ['CS3004'],
    description: '软件需求分析、设计、测试',
    availableClasses: [
      { id: 'class_12_1', teacher: '韩梅教授', classroom: 'E栋701', dayOfWeek: 2, startSlot: 3, endSlot: 4, weeks: '1-16周' }
    ]
  },
  {
    id: 'tp_course_13',
    planId: 'plan_cs_2024',
    courseCode: 'CS4002',
    name: '机器学习',
    type: 'elective',
    credit: 3,
    semester: '4',
    category: '专业选修课',
    status: 'pending',
    score: null,
    prerequisites: ['CS2001', 'CS1001'],
    description: '监督学习、无监督学习、神经网络',
    availableClasses: [
      { id: 'class_13_1', teacher: '董明教授', classroom: 'E栋702', dayOfWeek: 4, startSlot: 1, endSlot: 2, weeks: '1-16周' }
    ]
  },
  {
    id: 'tp_course_14',
    planId: 'plan_cs_2024',
    courseCode: 'CS4003',
    name: 'Web前端开发',
    type: 'elective',
    credit: 3,
    semester: '4',
    category: '专业选修课',
    status: 'pending',
    score: null,
    prerequisites: ['CS1003'],
    description: 'HTML/CSS/JavaScript、React/Vue框架',
    availableClasses: [
      { id: 'class_14_1', teacher: '于洋副教授', classroom: 'E栋703', dayOfWeek: 5, startSlot: 5, endSlot: 6, weeks: '1-16周' }
    ]
  },
  {
    id: 'tp_course_15',
    planId: 'plan_cs_2024',
    courseCode: 'CS5001',
    name: '毕业设计',
    type: 'required',
    credit: 12,
    semester: '8',
    category: '实践环节',
    status: 'pending',
    score: null,
    prerequisites: ['CS4001'],
    description: '综合运用所学知识完成项目',
    availableClasses: []
  },
  {
    id: 'tp_course_16',
    planId: 'plan_cs_2024',
    courseCode: 'GS1001',
    name: '音乐鉴赏',
    type: 'general',
    credit: 2,
    semester: '1',
    category: '通识选修课',
    status: 'completed',
    score: 90,
    prerequisites: [],
    description: '音乐基础知识与名曲欣赏',
    availableClasses: [
      { id: 'class_16_1', teacher: '张雅琴讲师', classroom: 'F栋101', dayOfWeek: 6, startSlot: 1, endSlot: 2, weeks: '1-8周' }
    ]
  },
  {
    id: 'tp_course_17',
    planId: 'plan_cs_2024',
    courseCode: 'GS1002',
    name: '美术鉴赏',
    type: 'general',
    credit: 2,
    semester: '2',
    category: '通识选修课',
    status: 'pending',
    score: null,
    prerequisites: [],
    description: '中外美术史与作品赏析',
    availableClasses: [
      { id: 'class_17_1', teacher: '李思远讲师', classroom: 'F栋102', dayOfWeek: 6, startSlot: 3, endSlot: 4, weeks: '1-8周' }
    ]
  },
  {
    id: 'tp_course_18',
    planId: 'plan_cs_2024',
    courseCode: 'CS3005',
    name: 'Python程序设计',
    type: 'elective',
    credit: 2,
    semester: '3',
    category: '专业选修课',
    status: 'pending',
    score: null,
    prerequisites: ['CS1003'],
    description: 'Python语言基础与数据分析应用',
    availableClasses: [
      { id: 'class_18_1', teacher: '冯晓副教授', classroom: 'E栋403', dayOfWeek: 4, startSlot: 7, endSlot: 8, weeks: '9-16周' }
    ]
  },
  {
    id: 'tp_course_19',
    planId: 'plan_cs_2024',
    courseCode: 'CS3006',
    name: 'Linux操作系统',
    type: 'elective',
    credit: 2,
    semester: '3',
    category: '专业选修课',
    status: 'pending',
    score: null,
    prerequisites: ['CS3002'],
    description: 'Linux系统管理与Shell脚本',
    availableClasses: [
      { id: 'class_19_1', teacher: '曹振教授', classroom: 'E栋404', dayOfWeek: 2, startSlot: 7, endSlot: 8, weeks: '9-16周' }
    ]
  },
  {
    id: 'tp_course_20',
    planId: 'plan_cs_2024',
    courseCode: 'GS1003',
    name: '创新创业基础',
    type: 'general',
    credit: 2,
    semester: '3',
    category: '通识选修课',
    status: 'pending',
    score: null,
    prerequisites: [],
    description: '创新思维培养与创业基础',
    availableClasses: [
      { id: 'class_20_1', teacher: '田甜讲师', classroom: 'F栋201', dayOfWeek: 5, startSlot: 7, endSlot: 8, weeks: '1-8周' }
    ]
  }
];

const MOCK_COURSE_REVIEWS = [
  {
    id: 'review_1',
    courseCode: 'CS1001',
    courseName: '高等数学',
    userId: 'user_001',
    userName: '张同学',
    rating: 4,
    difficulty: 'hard',
    workload: 'heavy',
    content: '张建国教授讲课非常清晰，但是作业量很大，每次都要花很长时间完成。建议上课认真听讲，课后及时复习，不然很容易跟不上。',
    createTime: Date.now() - 86400000 * 30,
    likes: 45
  },
  {
    id: 'review_2',
    courseCode: 'CS1001',
    courseName: '高等数学',
    userId: 'user_002',
    userName: '李同学',
    rating: 5,
    difficulty: 'medium',
    workload: 'medium',
    content: '李明副教授的课比较适合基础一般的同学，讲得比较慢，会照顾到大多数人。考试题目都是课后习题变形，认真复习的话80分以上没问题。',
    createTime: Date.now() - 86400000 * 20,
    likes: 32
  },
  {
    id: 'review_3',
    courseCode: 'CS2002',
    courseName: '数据结构',
    userId: 'user_003',
    userName: '王同学',
    rating: 5,
    difficulty: 'hard',
    workload: 'heavy',
    content: '孙伟教授的课干货满满，虽然难但是能学到真东西。建议提前预习，不然上课容易听不懂。实验课一定要自己动手写代码，不要抄作业。',
    createTime: Date.now() - 86400000 * 15,
    likes: 78
  },
  {
    id: 'review_4',
    courseCode: 'CS2002',
    courseName: '数据结构',
    userId: 'user_004',
    userName: '赵同学',
    rating: 3,
    difficulty: 'very_hard',
    workload: 'very_heavy',
    content: '这门课真的很难，马明副教授讲课太快了，我全程懵。期末考试挂了一半人，建议选孙伟教授的班。',
    createTime: Date.now() - 86400000 * 10,
    likes: 56
  },
  {
    id: 'review_5',
    courseCode: 'CS3002',
    courseName: '操作系统',
    userId: 'user_005',
    userName: '刘同学',
    rating: 4,
    difficulty: 'hard',
    workload: 'heavy',
    content: '何峰教授很有水平，讲得深入浅出。实验是写mini操作系统，虽然难但是做完很有成就感。这门课建议多花时间理解概念。',
    createTime: Date.now() - 86400000 * 5,
    likes: 41
  },
  {
    id: 'review_6',
    courseCode: 'CS3003',
    courseName: '计算机网络',
    userId: 'user_006',
    userName: '陈同学',
    rating: 5,
    difficulty: 'medium',
    workload: 'medium',
    content: '郭伟教授讲课很有趣，会结合很多实际案例。期末考试考的都是上课讲过的重点，平时认真听课的话不用太担心。',
    createTime: Date.now() - 86400000 * 3,
    likes: 35
  },
  {
    id: 'review_7',
    courseCode: 'CS1003',
    courseName: '程序设计基础',
    userId: 'user_007',
    userName: '杨同学',
    rating: 5,
    difficulty: 'easy',
    workload: 'light',
    content: '陈强教授对新手很友好，从最基础的语法讲起。零基础的同学也不用担心，跟着进度走就能学好。',
    createTime: Date.now() - 86400000 * 25,
    likes: 62
  },
  {
    id: 'review_8',
    courseCode: 'CS4002',
    courseName: '机器学习',
    userId: 'user_008',
    userName: '黄同学',
    rating: 4,
    difficulty: 'very_hard',
    workload: 'very_heavy',
    content: '董明教授要求很严，数学基础不好的话会很吃力。需要有扎实的线性代数和概率论基础。作业都是实现算法，花时间但是很有收获。',
    createTime: Date.now() - 86400000 * 8,
    likes: 89
  },
  {
    id: 'review_9',
    courseCode: 'GS1001',
    courseName: '音乐鉴赏',
    userId: 'user_009',
    userName: '周同学',
    rating: 5,
    difficulty: 'very_easy',
    workload: 'very_light',
    content: '超级水的课，老师人很好，几乎不点名。期末交一篇小论文就行，轻轻松松90+。想刷学分的强烈推荐！',
    createTime: Date.now() - 86400000 * 40,
    likes: 120
  },
  {
    id: 'review_10',
    courseCode: 'CS2003',
    courseName: '大学物理',
    userId: 'user_010',
    userName: '吴同学',
    rating: 2,
    difficulty: 'very_hard',
    workload: 'very_heavy',
    content: '黄强教授的课真的听不懂，考试也很难。我们班挂了快一半了。建议能不选就不选，或者选其他老师的班。',
    createTime: Date.now() - 86400000 * 12,
    likes: 67
  }
];

module.exports = {
  ..._firstExports,
  MOCK_CLUBS,
  MOCK_CLUB_MEMBERS,
  MOCK_CLUB_ACTIVITIES,
  MOCK_COURSES,
  MOCK_EXAM_SCORES,
  MOCK_EXAM_SCHEDULE,
  MOCK_CLASSROOMS,
  MOCK_COURSE_SETTINGS,
  MOCK_INNOVATION_PROJECTS,
  MOCK_INNOVATION_MENTORS,
  MOCK_INNOVATION_ROADSHOWS,
  MOCK_INNOVATION_POLICIES,
  MOCK_INNOVATION_INCUBATORS,
  SHELTER_ANIMALS,
  SHELTER_STATS,
  SHELTER_ADOPTION_APPLICATIONS,
  SHELTER_VISIT_RECORDS,
  SHELTER_DONATION_ITEMS,
  SHELTER_DONATION_RECORDS,
  SHELTER_VOLUNTEER_ACTIVITIES,
  SHELTER_VOLUNTEER_SIGNUPS,
  SHELTER_DONATION_USAGE,
  SHELTER_QUICK_ENTRIES,
  SHELTER_KNOWLEDGE,
  MOCK_LOW_CARBON_ACTIVITIES,
  MOCK_LOW_CARBON_REWARDS,
  MOCK_LOW_CARBON_LEADERBOARD,
  MOCK_ALUMNI_MENTORS,
  MOCK_ALUMNI_POSTS,
  MOCK_ALUMNI_CARD_BENEFITS,
  MOCK_ALUMNI_PROFILES,
  MOCK_TAKEOUT_MERCHANTS,
  MOCK_TAKEOUT_PROMOTIONS_BANNER,
  MOCK_TRAINING_PLANS,
  MOCK_TRAINING_PLAN_COURSES,
  MOCK_COURSE_REVIEWS
};

const MOCK_SCHOLARSHIP_POLICIES = [
  {
    id: 'sch_001',
    name: '国家奖学金',
    category: 'national',
    categoryName: '国家级',
    level: 'undergraduate',
    levelName: '本科生',
    amount: 8000,
    amountText: '8000元/年',
    applyStartDate: '2026-09-01',
    applyEndDate: '2026-09-15',
    quota: '全院5名',
    eligibility: [
      '热爱社会主义祖国，拥护中国共产党的领导',
      '遵守宪法和法律，遵守学校规章制度',
      '诚实守信，道德品质优良',
      '在校期间学习成绩优异，学年GPA不低于3.8',
      '学年综合测评成绩排名专业前5%',
      '社会实践、创新能力、综合素质等方面特别突出'
    ],
    benefits: [
      '一次性奖励8000元',
      '颁发国家级荣誉证书',
      '记入学生档案',
      '优先推荐保研资格'
    ],
    description: '国家奖学金由中央政府出资设立，用于奖励高校全日制本专科学生中特别优秀的学生，是当前高等学校学生能够获得的荣誉等级最高的国家级奖学金。',
    sponsor: '教育部',
    contactName: '李老师',
    contactPhone: '010-12345101',
    createTime: Date.now() - 86400000 * 30,
    views: 1528,
    status: 'active'
  },
  {
    id: 'sch_002',
    name: '国家励志奖学金',
    category: 'national',
    categoryName: '国家级',
    level: 'undergraduate',
    levelName: '本科生',
    amount: 5000,
    amountText: '5000元/年',
    applyStartDate: '2026-09-10',
    applyEndDate: '2026-09-25',
    quota: '全院15名',
    eligibility: [
      '热爱社会主义祖国，拥护中国共产党的领导',
      '遵守宪法和法律，遵守学校规章制度',
      '诚实守信，道德品质优良',
      '家庭经济困难，生活俭朴',
      '在校期间学习成绩优秀，学年GPA不低于3.2',
      '学年综合测评成绩排名专业前20%'
    ],
    benefits: [
      '一次性奖励5000元',
      '颁发国家级荣誉证书',
      '记入学生档案'
    ],
    description: '国家励志奖学金由中央政府出资设立，用于奖励资助高校全日制本专科学生中品学兼优的家庭经济困难学生。',
    sponsor: '教育部',
    contactName: '王老师',
    contactPhone: '010-12345102',
    createTime: Date.now() - 86400000 * 25,
    views: 2345,
    status: 'active'
  },
  {
    id: 'sch_003',
    name: '校长奖学金',
    category: 'school',
    categoryName: '校级',
    level: 'undergraduate',
    levelName: '本科生',
    amount: 10000,
    amountText: '10000元/年',
    applyStartDate: '2026-10-01',
    applyEndDate: '2026-10-15',
    quota: '全校10名',
    eligibility: [
      '热爱社会主义祖国，拥护中国共产党的领导',
      '遵守宪法和法律，遵守学校规章制度',
      '诚实守信，道德品质优良',
      '在校期间学习成绩特别优异，学年GPA不低于3.9',
      '学年综合测评成绩排名专业前2%',
      '在学术研究、科技创新、社会实践等方面有突出表现'
    ],
    benefits: [
      '一次性奖励10000元',
      '颁发校长奖学金荣誉证书',
      '记入学生档案',
      '直接获得保研面试资格',
      '优先推荐国际交流项目'
    ],
    description: '校长奖学金是学校设立的最高等级奖学金，旨在表彰德智体美劳全面发展、综合素质特别优秀的学生。',
    sponsor: '学校',
    contactName: '张老师',
    contactPhone: '010-12345103',
    createTime: Date.now() - 86400000 * 20,
    views: 3120,
    status: 'active'
  },
  {
    id: 'sch_004',
    name: '一等奖学金',
    category: 'school',
    categoryName: '校级',
    level: 'undergraduate',
    levelName: '本科生',
    amount: 3000,
    amountText: '3000元/年',
    applyStartDate: '2026-09-20',
    applyEndDate: '2026-10-05',
    quota: '专业前5%',
    eligibility: [
      '遵守学校各项规章制度，无违纪行为',
      '诚实守信，道德品质优良',
      '学年GPA不低于3.5',
      '学年综合测评成绩排名专业前5%',
      '体育成绩达标'
    ],
    benefits: [
      '一次性奖励3000元',
      '颁发校级荣誉证书',
      '记入学生档案'
    ],
    description: '一等奖学金用于奖励学习成绩优秀、综合素质突出的学生。',
    sponsor: '学校',
    contactName: '刘老师',
    contactPhone: '010-12345104',
    createTime: Date.now() - 86400000 * 15,
    views: 4567,
    status: 'active'
  },
  {
    id: 'sch_005',
    name: '二等奖学金',
    category: 'school',
    categoryName: '校级',
    level: 'undergraduate',
    levelName: '本科生',
    amount: 2000,
    amountText: '2000元/年',
    applyStartDate: '2026-09-20',
    applyEndDate: '2026-10-05',
    quota: '专业前15%',
    eligibility: [
      '遵守学校各项规章制度，无违纪行为',
      '诚实守信，道德品质优良',
      '学年GPA不低于3.2',
      '学年综合测评成绩排名专业前15%',
      '体育成绩达标'
    ],
    benefits: [
      '一次性奖励2000元',
      '颁发校级荣誉证书',
      '记入学生档案'
    ],
    description: '二等奖学金用于奖励学习成绩良好、综合素质较好的学生。',
    sponsor: '学校',
    contactName: '刘老师',
    contactPhone: '010-12345104',
    createTime: Date.now() - 86400000 * 15,
    views: 5234,
    status: 'active'
  },
  {
    id: 'sch_006',
    name: '三等奖学金',
    category: 'school',
    categoryName: '校级',
    level: 'undergraduate',
    levelName: '本科生',
    amount: 1000,
    amountText: '1000元/年',
    applyStartDate: '2026-09-20',
    applyEndDate: '2026-10-05',
    quota: '专业前30%',
    eligibility: [
      '遵守学校各项规章制度，无违纪行为',
      '诚实守信，道德品质优良',
      '学年GPA不低于2.8',
      '学年综合测评成绩排名专业前30%',
      '体育成绩达标'
    ],
    benefits: [
      '一次性奖励1000元',
      '颁发校级荣誉证书',
      '记入学生档案'
    ],
    description: '三等奖学金用于奖励学习成绩较好、有进步的学生。',
    sponsor: '学校',
    contactName: '刘老师',
    contactPhone: '010-12345104',
    createTime: Date.now() - 86400000 * 15,
    views: 6123,
    status: 'active'
  },
  {
    id: 'sch_007',
    name: '腾讯企业奖学金',
    category: 'enterprise',
    categoryName: '企业赞助',
    level: 'undergraduate',
    levelName: '本科生',
    amount: 6000,
    amountText: '6000元/年',
    applyStartDate: '2026-10-10',
    applyEndDate: '2026-10-25',
    quota: '计算机学院3名',
    eligibility: [
      '遵守学校各项规章制度，无违纪行为',
      '计算机学院在读学生',
      '学年GPA不低于3.5',
      '在计算机相关领域有突出表现或科研成果',
      '有志于从事互联网相关工作'
    ],
    benefits: [
      '一次性奖励6000元',
      '颁发企业荣誉证书',
      '腾讯实习绿色通道',
      '一对一企业导师指导'
    ],
    description: '腾讯企业奖学金由腾讯公司赞助设立，旨在奖励计算机相关专业品学兼优的学生，鼓励学生投身互联网事业。',
    sponsor: '腾讯科技',
    contactName: '陈老师',
    contactPhone: '010-12345105',
    createTime: Date.now() - 86400000 * 10,
    views: 2890,
    status: 'active'
  },
  {
    id: 'sch_008',
    name: '创新创业奖学金',
    category: 'special',
    categoryName: '专项奖学金',
    level: 'undergraduate',
    levelName: '本科生',
    amount: 5000,
    amountText: '5000元/项',
    applyStartDate: '2026-11-01',
    applyEndDate: '2026-11-15',
    quota: '不限，择优评定',
    eligibility: [
      '遵守学校各项规章制度，无违纪行为',
      '在学术研究、科技创新、创业实践等方面取得突出成果',
      '满足以下条件之一：\n• 获得省部级及以上学科竞赛奖励\n• 获得发明专利授权\n• 发表高水平学术论文\n• 创业项目获得融资或入驻孵化园'
    ],
    benefits: [
      '一次性奖励5000元',
      '颁发创新创业荣誉证书',
      '优先推荐参加创新创业培训'
    ],
    description: '创新创业奖学金旨在鼓励学生积极参与学术研究和创新创业活动，培养创新精神和实践能力。',
    sponsor: '创新创业学院',
    contactName: '周老师',
    contactPhone: '010-12345106',
    createTime: Date.now() - 86400000 * 5,
    views: 1876,
    status: 'active'
  },
  {
    id: 'sch_009',
    name: '社会工作奖学金',
    category: 'special',
    categoryName: '专项奖学金',
    level: 'undergraduate',
    levelName: '本科生',
    amount: 1500,
    amountText: '1500元/年',
    applyStartDate: '2026-10-15',
    applyEndDate: '2026-10-30',
    quota: '全院10名',
    eligibility: [
      '遵守学校各项规章制度，无违纪行为',
      '学年GPA不低于2.5',
      '担任学生干部满1年以上',
      '工作认真负责，在服务同学、组织活动等方面表现突出',
      '获得校级及以上优秀学生干部等荣誉称号优先'
    ],
    benefits: [
      '一次性奖励1500元',
      '颁发社会工作荣誉证书'
    ],
    description: '社会工作奖学金旨在奖励在学生工作和社会服务中表现突出的学生干部。',
    sponsor: '学生处',
    contactName: '吴老师',
    contactPhone: '010-12345107',
    createTime: Date.now() - 86400000 * 8,
    views: 1654,
    status: 'active'
  },
  {
    id: 'sch_010',
    name: '研究生国家奖学金',
    category: 'national',
    categoryName: '国家级',
    level: 'postgraduate',
    levelName: '研究生',
    amount: 20000,
    amountText: '20000元/年',
    applyStartDate: '2026-09-05',
    applyEndDate: '2026-09-20',
    quota: '全院3名',
    eligibility: [
      '热爱社会主义祖国，拥护中国共产党的领导',
      '遵守宪法和法律，遵守学校规章制度',
      '诚实守信，道德品质优良',
      '学习成绩优异，科研能力显著，发展潜力突出',
      '至少发表1篇SCI/EI论文或获得发明专利授权',
      '综合测评成绩位列专业前10%'
    ],
    benefits: [
      '一次性奖励20000元',
      '颁发国家级荣誉证书',
      '记入学生档案'
    ],
    description: '研究生国家奖学金由中央政府出资设立，用于奖励普通高等学校中表现优异的全日制研究生。',
    sponsor: '教育部',
    contactName: '赵老师',
    contactPhone: '010-12345108',
    createTime: Date.now() - 86400000 * 18,
    views: 987,
    status: 'active'
  }
];

const MOCK_SCHOLARSHIP_USER_PROFILE = {
  userId: 'test_user',
  studentId: '2023001234',
  name: '张三',
  college: '计算机学院',
  major: '软件工程',
  grade: '2023级',
  gpa: 3.65,
  gpaRank: 8,
  majorTotal: 120,
  gpaRankPercent: 6.7,
  comprehensiveScore: 88.5,
  comprehensiveRank: 12,
  comprehensiveRankPercent: 10,
  hasDisciplinaryAction: false,
  familyEconomicStatus: 'normal',
  volunteerHours: 48,
  clubPositions: [
    { name: '计算机学院学生会', position: '学习部部长', tenure: '2024-2025' }
  ],
  awards: [
    { name: '2025年大学生数学建模竞赛二等奖', level: 'provincial', date: '2025-09' },
    { name: '校级优秀学生干部', level: 'school', date: '2025-12' },
    { name: '二等奖学金', level: 'school', date: '2025-10' }
  ],
  researchExperience: [
    { title: '基于深度学习的图像识别研究', role: '核心成员', date: '2025-03至今' }
  ],
  updateTime: Date.now()
};

const MOCK_SCHOLARSHIP_APPLICATIONS = [
  {
    id: 'app_001',
    scholarshipId: 'sch_005',
    scholarshipName: '二等奖学金',
    userId: 'test_user',
    applyTime: Date.now() - 86400000 * 10,
    status: 'approved',
    currentStep: 4,
    totalSteps: 5,
    steps: [
      { name: '提交申请', status: 'completed', time: Date.now() - 86400000 * 10, remark: '申请已提交' },
      { name: '班级初审', status: 'completed', time: Date.now() - 86400000 * 8, remark: '班长审核通过' },
      { name: '学院审核', status: 'completed', time: Date.now() - 86400000 * 5, remark: '学院辅导员审核通过' },
      { name: '学校评审', status: 'completed', time: Date.now() - 86400000 * 2, remark: '学校奖学金评审委员会审核通过' },
      { name: '奖学金发放', status: 'pending', time: null, remark: '预计10个工作日内发放' }
    ],
    amount: 2000,
    materials: [
      { name: '成绩单', status: 'uploaded' },
      { name: '获奖证书', status: 'uploaded' },
      { name: '申请表', status: 'uploaded' }
    ],
    remark: '申请材料齐全，符合条件'
  },
  {
    id: 'app_002',
    scholarshipId: 'sch_009',
    scholarshipName: '社会工作奖学金',
    userId: 'test_user',
    applyTime: Date.now() - 86400000 * 3,
    status: 'reviewing',
    currentStep: 2,
    totalSteps: 5,
    steps: [
      { name: '提交申请', status: 'completed', time: Date.now() - 86400000 * 3, remark: '申请已提交' },
      { name: '班级初审', status: 'completed', time: Date.now() - 86400000 * 2, remark: '班长审核通过' },
      { name: '学院审核', status: 'in_progress', time: null, remark: '学院辅导员正在审核中' },
      { name: '学校评审', status: 'pending', time: null, remark: '' },
      { name: '奖学金发放', status: 'pending', time: null, remark: '' }
    ],
    amount: 1500,
    materials: [
      { name: '成绩单', status: 'uploaded' },
      { name: '学生干部证明', status: 'uploaded' },
      { name: '获奖证书', status: 'uploaded' },
      { name: '申请表', status: 'uploaded' }
    ],
    remark: '材料审核中，请耐心等待'
  }
];

const MOCK_SCHOLARSHIP_MATERIALS = [
  {
    id: 'mat_001',
    name: '成绩单',
    description: '需加盖教务处公章的成绩单原件扫描件',
    format: 'PDF/JPG',
    maxSize: '10MB',
    required: true,
    templateUrl: '',
    notes: '成绩单需包含所有已修课程成绩，绩点信息'
  },
  {
    id: 'mat_002',
    name: '获奖证书',
    description: '各类获奖证书、荣誉证书扫描件',
    format: 'PDF/JPG',
    maxSize: '20MB',
    required: true,
    templateUrl: '',
    notes: '可上传多个证书，按重要性排序'
  },
  {
    id: 'mat_003',
    name: '奖学金申请表',
    description: '填写完整并签字的奖学金申请表',
    format: 'PDF',
    maxSize: '5MB',
    required: true,
    templateUrl: '/download/scholarship_application_form.pdf',
    notes: '需本人签字，学院盖章后方可提交'
  },
  {
    id: 'mat_004',
    name: '家庭经济困难证明',
    description: '家庭经济困难学生需提供相关证明',
    format: 'PDF/JPG',
    maxSize: '10MB',
    required: false,
    templateUrl: '',
    notes: '仅申请国家励志助学金等专项奖学金需要'
  },
  {
    id: 'mat_005',
    name: '学生干部证明',
    description: '申请社会工作奖学金需提供学生干部任职证明',
    format: 'PDF/JPG',
    maxSize: '5MB',
    required: false,
    templateUrl: '',
    notes: '需加盖学院公章或指导老师签字'
  },
  {
    id: 'mat_006',
    name: '科研成果证明',
    description: '申请创新创业奖学金需提供论文、专利等成果证明',
    format: 'PDF/JPG',
    maxSize: '30MB',
    required: false,
    templateUrl: '',
    notes: '包括论文录用通知、专利证书、竞赛获奖证书等'
  },
  {
    id: 'mat_007',
    name: '社会实践证明',
    description: '志愿服务、社会实践活动证明材料',
    format: 'PDF/JPG',
    maxSize: '10MB',
    required: false,
    templateUrl: '',
    notes: '可提供志愿服务时长证明、社会实践报告等'
  },
  {
    id: 'mat_008',
    name: '个人陈述',
    description: '个人学习情况、获奖情况、未来规划等陈述',
    format: 'DOC/PDF',
    maxSize: '5MB',
    required: false,
    templateUrl: '',
    notes: '字数500-1000字，建议附带个人照片'
  }
];

const MOCK_SCHOLARSHIP_PUBLIC_LIST = [
  {
    id: 'pub_001',
    scholarshipId: 'sch_001',
    scholarshipName: '国家奖学金',
    year: '2025-2026',
    publishTime: Date.now() - 86400000 * 60,
    status: 'published',
    totalCount: 5,
    college: '计算机学院',
    list: [
      { studentId: '2022****01', name: '*明', major: '计算机科学与技术', grade: '2022级', gpa: 3.95, rank: 1, amount: 8000 },
      { studentId: '2022****08', name: '*华', major: '软件工程', grade: '2022级', gpa: 3.92, rank: 2, amount: 8000 },
      { studentId: '2022****15', name: '*强', major: '人工智能', grade: '2022级', gpa: 3.89, rank: 3, amount: 8000 },
      { studentId: '2023****03', name: '*敏', major: '计算机科学与技术', grade: '2023级', gpa: 3.88, rank: 1, amount: 8000 },
      { studentId: '2023****12', name: '*涛', major: '软件工程', grade: '2023级', gpa: 3.85, rank: 2, amount: 8000 }
    ]
  },
  {
    id: 'pub_002',
    scholarshipId: 'sch_003',
    scholarshipName: '校长奖学金',
    year: '2025-2026',
    publishTime: Date.now() - 86400000 * 50,
    status: 'published',
    totalCount: 3,
    college: '计算机学院',
    list: [
      { studentId: '2022****01', name: '*明', major: '计算机科学与技术', grade: '2022级', gpa: 3.95, rank: 1, amount: 10000 },
      { studentId: '2022****20', name: '*丽', major: '网络空间安全', grade: '2022级', gpa: 3.93, rank: 1, amount: 10000 },
      { studentId: '2021****05', name: '*伟', major: '软件工程', grade: '2021级', gpa: 3.91, rank: 1, amount: 10000 }
    ]
  },
  {
    id: 'pub_003',
    scholarshipId: 'sch_002',
    scholarshipName: '国家励志奖学金',
    year: '2025-2026',
    publishTime: Date.now() - 86400000 * 45,
    status: 'published',
    totalCount: 15,
    college: '计算机学院',
    list: [
      { studentId: '2022****35', name: '*军', major: '计算机科学与技术', grade: '2022级', gpa: 3.45, rank: 12, amount: 5000 },
      { studentId: '2022****42', name: '*芳', major: '软件工程', grade: '2022级', gpa: 3.38, rank: 18, amount: 5000 },
      { studentId: '2023****28', name: '*龙', major: '人工智能', grade: '2023级', gpa: 3.42, rank: 15, amount: 5000 },
      { studentId: '2023****35', name: '*凤', major: '计算机科学与技术', grade: '2023级', gpa: 3.35, rank: 20, amount: 5000 },
      { studentId: '2024****15', name: '*飞', major: '软件工程', grade: '2024级', gpa: 3.30, rank: 25, amount: 5000 }
    ]
  },
  {
    id: 'pub_004',
    scholarshipId: 'sch_004',
    scholarshipName: '一等奖学金',
    year: '2025-2026',
    publishTime: Date.now() - 86400000 * 40,
    status: 'published',
    totalCount: 8,
    college: '计算机学院',
    list: [
      { studentId: '2022****05', name: '*宇', major: '计算机科学与技术', grade: '2022级', gpa: 3.72, rank: 3, amount: 3000 },
      { studentId: '2022****10', name: '*洁', major: '软件工程', grade: '2022级', gpa: 3.68, rank: 5, amount: 3000 },
      { studentId: '2023****05', name: '*浩', major: '人工智能', grade: '2023级', gpa: 3.70, rank: 3, amount: 3000 },
      { studentId: '2023****10', name: '*莹', major: '网络空间安全', grade: '2023级', gpa: 3.65, rank: 4, amount: 3000 }
    ]
  },
  {
    id: 'pub_005',
    scholarshipId: 'sch_005',
    scholarshipName: '二等奖学金',
    year: '2025-2026',
    publishTime: Date.now() - 86400000 * 35,
    status: 'published',
    totalCount: 20,
    college: '计算机学院',
    list: [
      { studentId: '2022****18', name: '*阳', major: '计算机科学与技术', grade: '2022级', gpa: 3.48, rank: 10, amount: 2000 },
      { studentId: '2022****25', name: '*欣', major: '软件工程', grade: '2022级', gpa: 3.42, rank: 15, amount: 2000 },
      { studentId: '2023****12', name: '张*', major: '软件工程', grade: '2023级', gpa: 3.65, rank: 8, amount: 2000 },
      { studentId: '2023****18', name: '*磊', major: '人工智能', grade: '2023级', gpa: 3.38, rank: 18, amount: 2000 },
      { studentId: '2024****08', name: '*娜', major: '计算机科学与技术', grade: '2024级', gpa: 3.35, rank: 12, amount: 2000 }
    ]
  }
];

const _scholarshipExports = {
  MOCK_SCHOLARSHIP_POLICIES,
  MOCK_SCHOLARSHIP_APPLICATIONS,
  MOCK_SCHOLARSHIP_MATERIALS,
  MOCK_SCHOLARSHIP_PUBLIC_LIST,
  MOCK_SCHOLARSHIP_USER_PROFILE
};

Object.assign(module.exports, _scholarshipExports);

const MOCK_WORK_STUDY_JOBS = [
  {
    id: 'wsj_001',
    title: '图书馆图书整理员',
    department: 'library',
    departmentName: '图书馆',
    workContent: '负责图书馆图书分类、上架、整理，协助读者查找图书，维护阅览区秩序。',
    hourlyWage: 20,
    timeRequirement: '每周至少工作2天，每次3-4小时，可灵活安排',
    recruitCount: 5,
    currentCount: 3,
    requirements: '工作认真负责，有耐心，熟悉图书分类优先',
    contact: '李老师 010-12345678',
    location: '图书馆二楼服务台',
    status: 'recruiting',
    views: 156
  },
  {
    id: 'wsj_002',
    title: '行政办公室助理',
    department: 'administration',
    departmentName: '行政办公室',
    workContent: '负责文件整理、数据录入、会议准备等日常行政事务，协助老师完成相关工作。',
    hourlyWage: 25,
    timeRequirement: '工作日下午2:00-5:00，每周至少3天',
    recruitCount: 2,
    currentCount: 2,
    requirements: '熟练使用Office办公软件，细心认真，沟通能力强',
    contact: '王老师 010-87654321',
    location: '行政楼301室',
    status: 'closed',
    views: 234
  },
  {
    id: 'wsj_003',
    title: '食堂餐台服务员',
    department: 'canteen',
    departmentName: '食堂后勤',
    workContent: '负责食堂餐台清洁、餐具回收、维持就餐秩序，高峰期协助打餐。',
    hourlyWage: 18,
    timeRequirement: '早餐7:00-8:30，午餐11:30-13:00，晚餐17:30-19:00，任选时段',
    recruitCount: 8,
    currentCount: 4,
    requirements: '吃苦耐劳，服务意识强，卫生习惯良好',
    contact: '张主管 010-11112222',
    location: '第一食堂办公室',
    status: 'recruiting',
    views: 189
  },
  {
    id: 'wsj_004',
    title: '实验室设备维护助理',
    department: 'lab',
    departmentName: '实验中心',
    workContent: '协助实验员进行设备日常维护、仪器校准、实验室清洁卫生，准备实验耗材。',
    hourlyWage: 28,
    timeRequirement: '每周一、三、五下午14:00-17:00',
    recruitCount: 3,
    currentCount: 1,
    requirements: '理工科专业，有实验室经验优先，动手能力强',
    contact: '赵老师 010-33334444',
    location: '实验楼B栋205',
    status: 'recruiting',
    views: 145
  },
  {
    id: 'wsj_005',
    title: '学生处活动助理',
    department: 'student_affairs',
    departmentName: '学生处',
    workContent: '协助策划和组织校园活动，负责活动宣传、现场布置、摄影记录等工作。',
    hourlyWage: 22,
    timeRequirement: '根据活动安排，每周约10-15小时',
    recruitCount: 4,
    currentCount: 2,
    requirements: '有活动组织经验，文案或摄影能力突出者优先',
    contact: '刘老师 010-55556666',
    location: '学生活动中心201',
    status: 'recruiting',
    views: 267
  },
  {
    id: 'wsj_006',
    title: '信息中心技术支持',
    department: 'it_center',
    departmentName: '信息中心',
    workContent: '负责校园网络故障排查、多媒体设备维护、协助处理师生IT相关问题。',
    hourlyWage: 30,
    timeRequirement: '轮班制，每班2小时，每周至少3班',
    recruitCount: 4,
    currentCount: 3,
    requirements: '计算机相关专业，熟悉网络和计算机硬件，有IT支持经验优先',
    contact: '陈工 010-77778888',
    location: '信息楼一楼服务大厅',
    status: 'recruiting',
    views: 312
  },
  {
    id: 'wsj_007',
    title: '体育部器材管理员',
    department: 'sports',
    departmentName: '体育部',
    workContent: '负责体育器材的借出归还登记、器材维护保养、场地卫生清洁等。',
    hourlyWage: 19,
    timeRequirement: '每天下午16:00-19:00，周末上午9:00-12:00',
    recruitCount: 3,
    currentCount: 3,
    requirements: '热爱体育运动，工作认真负责，有较强服务意识',
    contact: '孙老师 010-99990000',
    location: '体育馆器材室',
    status: 'closed',
    views: 98
  },
  {
    id: 'wsj_008',
    title: '宿舍楼层值班员',
    department: 'dormitory',
    departmentName: '宿管中心',
    workContent: '协助宿管进行楼层值班、访客登记、晚归检查、公共区域巡查等。',
    hourlyWage: 17,
    timeRequirement: '每晚22:00-24:00，每周至少3晚',
    recruitCount: 6,
    currentCount: 2,
    requirements: '责任心强，有较强的沟通能力和应变能力',
    contact: '周阿姨 010-12121212',
    location: '各宿舍楼值班室',
    status: 'recruiting',
    views: 178
  }
];

const MOCK_WORK_STUDY_APPLICATIONS = [
  {
    id: 'wsa_001',
    jobId: 'wsj_001',
    jobTitle: '图书馆图书整理员',
    department: 'library',
    departmentName: '图书馆',
    userId: 'test_user',
    userName: '张三',
    studentId: '2024001001',
    phone: '13800138000',
    resume: '本人性格认真细致，有良好的服务意识。曾在高中担任图书馆志愿者，熟悉图书分类方法。课余时间充裕，能够保证工作时间。',
    availableTime: '周一至周五下午14:00-18:00，周末全天可安排',
    status: 'approved',
    applyTime: Date.now() - 86400000 * 7,
    reviewTime: Date.now() - 86400000 * 5,
    reviewRemark: '欢迎加入图书馆工作团队！请于下周一到图书馆二楼服务台找李老师报到。'
  },
  {
    id: 'wsa_002',
    jobId: 'wsj_006',
    jobTitle: '信息中心技术支持',
    department: 'it_center',
    departmentName: '信息中心',
    userId: 'test_user',
    userName: '张三',
    studentId: '2024001001',
    phone: '13800138000',
    resume: '计算机科学与技术专业大二学生，熟悉计算机硬件和网络维护。曾担任班级IT委员，帮助同学解决各类电脑问题。',
    availableTime: '周二、周四下午16:00-20:00，周六全天',
    status: 'pending',
    applyTime: Date.now() - 86400000 * 2,
    reviewTime: null,
    reviewRemark: ''
  },
  {
    id: 'wsa_003',
    jobId: 'wsj_003',
    jobTitle: '食堂餐台服务员',
    department: 'canteen',
    departmentName: '食堂后勤',
    userId: 'test_user',
    userName: '张三',
    studentId: '2024001001',
    phone: '13800138000',
    resume: '能吃苦耐劳，有团队合作精神。之前有餐饮服务兼职经验，熟悉服务流程。',
    availableTime: '午餐11:30-13:00，晚餐17:30-19:00，可长期稳定工作',
    status: 'rejected',
    applyTime: Date.now() - 86400000 * 10,
    reviewTime: Date.now() - 86400000 * 8,
    reviewRemark: '感谢您的申请！本岗位招聘已满，建议关注其他勤工助学岗位。'
  }
];

const MOCK_WORK_STUDY_HOURS_RECORDS = [
  {
    id: 'wsh_001',
    applicationId: 'wsa_001',
    jobId: 'wsj_001',
    jobTitle: '图书馆图书整理员',
    userId: 'test_user',
    userName: '张三',
    date: '2026-06-10',
    startTime: '14:00',
    endTime: '17:00',
    hours: 3,
    workDescription: '图书分类上架，整理阅览区图书，协助读者检索',
    status: 'confirmed',
    submitTime: Date.now() - 86400000 * 5,
    confirmTime: Date.now() - 86400000 * 4
  },
  {
    id: 'wsh_002',
    applicationId: 'wsa_001',
    jobId: 'wsj_001',
    jobTitle: '图书馆图书整理员',
    userId: 'test_user',
    userName: '张三',
    date: '2026-06-12',
    startTime: '14:30',
    endTime: '17:30',
    hours: 3,
    workDescription: '整理新书区，协助办理借阅手续，维护秩序',
    status: 'confirmed',
    submitTime: Date.now() - 86400000 * 3,
    confirmTime: Date.now() - 86400000 * 2
  },
  {
    id: 'wsh_003',
    applicationId: 'wsa_001',
    jobId: 'wsj_001',
    jobTitle: '图书馆图书整理员',
    userId: 'test_user',
    userName: '张三',
    date: '2026-06-14',
    startTime: '09:00',
    endTime: '12:00',
    hours: 3,
    workDescription: '整理过期期刊，打扫图书区卫生',
    status: 'pending',
    submitTime: Date.now() - 86400000 * 1,
    confirmTime: null
  }
];

const MOCK_WORK_STUDY_SALARIES = [
  {
    id: 'wss_001',
    userId: 'test_user',
    userName: '张三',
    month: '2026-05',
    totalHours: 32,
    hourlyWage: 20,
    totalAmount: 640,
    detail: [
      { jobTitle: '图书馆图书整理员', hours: 32, amount: 640 }
    ],
    status: 'paid',
    settleTime: Date.now() - 86400000 * 15,
    payTime: Date.now() - 86400000 * 10
  },
  {
    id: 'wss_002',
    userId: 'test_user',
    userName: '张三',
    month: '2026-06',
    totalHours: 6,
    hourlyWage: 20,
    totalAmount: 120,
    detail: [
      { jobTitle: '图书馆图书整理员', hours: 6, amount: 120 }
    ],
    status: 'settled',
    settleTime: Date.now() - 86400000 * 2,
    payTime: null
  }
];

const _workStudyExports = {
  MOCK_WORK_STUDY_JOBS,
  MOCK_WORK_STUDY_APPLICATIONS,
  MOCK_WORK_STUDY_HOURS_RECORDS,
  MOCK_WORK_STUDY_SALARIES
};

const CAMPUS_CARD_INFO = {
  cardNo: '20260101001',
  studentName: '张三',
  studentId: '20260101',
  department: '计算机科学与技术学院',
  major: '软件工程',
  balance: 328.50,
  cardStatus: 'normal',
  bindTime: Date.now() - 86400000 * 180,
  lastRechargeTime: Date.now() - 86400000 * 2,
  lastRechargeAmount: 100.00
};

const CAMPUS_CARD_TRANSACTIONS = [
  {
    id: 't001',
    type: 'consume',
    category: 'canteen',
    categoryName: '食堂',
    merchant: '第一食堂一楼 3号窗口',
    amount: 12.50,
    balanceAfter: 328.50,
    createTime: Date.now() - 3600000 * 2
  },
  {
    id: 't002',
    type: 'consume',
    category: 'supermarket',
    categoryName: '超市',
    merchant: '校园超市（中心店）',
    amount: 23.80,
    balanceAfter: 341.00,
    createTime: Date.now() - 3600000 * 5
  },
  {
    id: 't003',
    type: 'consume',
    category: 'bathroom',
    categoryName: '浴室',
    merchant: '3号学生浴室',
    amount: 4.50,
    balanceAfter: 364.80,
    createTime: Date.now() - 86400000
  },
  {
    id: 't004',
    type: 'recharge',
    category: 'recharge',
    categoryName: '充值',
    merchant: '微信充值',
    amount: 100.00,
    balanceAfter: 369.30,
    createTime: Date.now() - 86400000 * 2
  },
  {
    id: 't005',
    type: 'consume',
    category: 'canteen',
    categoryName: '食堂',
    merchant: '第二食堂二楼 特色窗口',
    amount: 15.00,
    balanceAfter: 269.30,
    createTime: Date.now() - 86400000 * 2 - 3600000 * 3
  },
  {
    id: 't006',
    type: 'consume',
    category: 'canteen',
    categoryName: '食堂',
    merchant: '第一食堂三楼 清真窗口',
    amount: 10.00,
    balanceAfter: 284.30,
    createTime: Date.now() - 86400000 * 3
  },
  {
    id: 't007',
    type: 'consume',
    category: 'supermarket',
    categoryName: '超市',
    merchant: '图书馆便利店',
    amount: 8.50,
    balanceAfter: 294.30,
    createTime: Date.now() - 86400000 * 3 - 3600000 * 4
  },
  {
    id: 't008',
    type: 'consume',
    category: 'bathroom',
    categoryName: '浴室',
    merchant: '3号学生浴室',
    amount: 3.20,
    balanceAfter: 302.80,
    createTime: Date.now() - 86400000 * 4
  },
  {
    id: 't009',
    type: 'consume',
    category: 'canteen',
    categoryName: '食堂',
    merchant: '第一食堂一楼 早餐窗口',
    amount: 6.00,
    balanceAfter: 306.00,
    createTime: Date.now() - 86400000 * 4 - 3600000 * 6
  },
  {
    id: 't010',
    type: 'consume',
    category: 'canteen',
    categoryName: '食堂',
    merchant: '第三食堂一楼 2号窗口',
    amount: 13.50,
    balanceAfter: 312.00,
    createTime: Date.now() - 86400000 * 5
  },
  {
    id: 't011',
    type: 'consume',
    category: 'supermarket',
    categoryName: '超市',
    merchant: '校园超市（东区店）',
    amount: 45.00,
    balanceAfter: 325.50,
    createTime: Date.now() - 86400000 * 6
  },
  {
    id: 't012',
    type: 'recharge',
    category: 'recharge',
    categoryName: '充值',
    merchant: '支付宝充值',
    amount: 200.00,
    balanceAfter: 370.50,
    createTime: Date.now() - 86400000 * 7
  },
  {
    id: 't013',
    type: 'consume',
    category: 'canteen',
    categoryName: '食堂',
    merchant: '第二食堂一楼 5号窗口',
    amount: 11.00,
    balanceAfter: 170.50,
    createTime: Date.now() - 86400000 * 8
  },
  {
    id: 't014',
    type: 'consume',
    category: 'bathroom',
    categoryName: '浴室',
    merchant: '3号学生浴室',
    amount: 5.00,
    balanceAfter: 181.50,
    createTime: Date.now() - 86400000 * 9
  },
  {
    id: 't015',
    type: 'consume',
    category: 'canteen',
    categoryName: '食堂',
    merchant: '第一食堂二楼 川菜窗口',
    amount: 14.00,
    balanceAfter: 186.50,
    createTime: Date.now() - 86400000 * 10
  },
  {
    id: 't016',
    type: 'consume',
    category: 'supermarket',
    categoryName: '超市',
    merchant: '宿舍区便利店',
    amount: 18.50,
    balanceAfter: 200.50,
    createTime: Date.now() - 86400000 * 11
  },
  {
    id: 't017',
    type: 'consume',
    category: 'canteen',
    categoryName: '食堂',
    merchant: '第一食堂一楼 8号窗口',
    amount: 9.50,
    balanceAfter: 219.00,
    createTime: Date.now() - 86400000 * 12
  },
  {
    id: 't018',
    type: 'consume',
    category: 'canteen',
    categoryName: '食堂',
    merchant: '第三食堂二楼 面食窗口',
    amount: 12.00,
    balanceAfter: 228.50,
    createTime: Date.now() - 86400000 * 13
  },
  {
    id: 't019',
    type: 'consume',
    category: 'bathroom',
    categoryName: '浴室',
    merchant: '3号学生浴室',
    amount: 3.80,
    balanceAfter: 240.50,
    createTime: Date.now() - 86400000 * 14
  },
  {
    id: 't020',
    type: 'recharge',
    category: 'recharge',
    categoryName: '充值',
    merchant: '充值点充值',
    amount: 300.00,
    balanceAfter: 244.30,
    createTime: Date.now() - 86400000 * 15
  }
];

const CAMPUS_CARD_RECHARGE_POINTS = [
  {
    id: 'rp001',
    name: '行政楼一卡通服务中心',
    address: '行政楼102室',
    workTime: '工作日 08:00-17:30',
    phone: '010-12345678',
    latitude: 39.9042,
    longitude: 116.4070,
    description: '可办理办卡、补卡、充值、挂失等业务',
    services: ['办卡', '补卡', '充值', '挂失', '解冻']
  },
  {
    id: 'rp002',
    name: '第一食堂充值点',
    address: '第一食堂入口处',
    workTime: '每日 06:30-20:00',
    phone: '010-12345679',
    latitude: 39.9065,
    longitude: 116.4075,
    description: '提供现金充值服务',
    services: ['现金充值']
  },
  {
    id: 'rp003',
    name: '第二食堂充值点',
    address: '第二食堂入口处',
    workTime: '每日 06:30-20:00',
    phone: '010-12345680',
    latitude: 39.9055,
    longitude: 116.4080,
    description: '提供现金充值服务',
    services: ['现金充值']
  },
  {
    id: 'rp004',
    name: '图书馆自助充值机',
    address: '图书馆一层大厅',
    workTime: '每日 07:00-22:00',
    phone: '010-12345681',
    latitude: 39.9042,
    longitude: 116.4074,
    description: '支持微信、支付宝自助充值',
    services: ['微信充值', '支付宝充值']
  },
  {
    id: 'rp005',
    name: '东区宿舍自助充值机',
    address: '东区5号楼一层大厅',
    workTime: '24小时',
    phone: '010-12345682',
    latitude: 39.9070,
    longitude: 116.4050,
    description: '支持微信、支付宝自助充值',
    services: ['微信充值', '支付宝充值']
  },
  {
    id: 'rp006',
    name: '西区宿舍自助充值机',
    address: '西区3号楼一层大厅',
    workTime: '24小时',
    phone: '010-12345683',
    latitude: 39.9030,
    longitude: 116.4060,
    description: '支持微信、支付宝自助充值',
    services: ['微信充值', '支付宝充值']
  }
];

const LOGISTICS_DEPARTMENT_PHONE = '010-12345670';

const _campusCardExports = {
  CAMPUS_CARD_INFO,
  CAMPUS_CARD_TRANSACTIONS,
  CAMPUS_CARD_RECHARGE_POINTS,
  LOGISTICS_DEPARTMENT_PHONE
};

Object.assign(module.exports, _workStudyExports, _campusCardExports);
