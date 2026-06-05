const STORAGE_KEYS = {
  LOST_FOUND_LIST: 'lostFoundList',
  MARKET_LIST: 'marketList',
  FAVORITES: 'favorites',
  HISTORY: 'history',
  USER_INFO: 'userInfo',
  THEME_SETTINGS: 'theme_settings',
  SEARCH_HISTORY: 'searchHistory',
  SURVEY_LIST: 'surveyList',
  SURVEY_RESPONSES: 'surveyResponses'
};

const mockStorage = {
  _store: {},
  STORAGE_KEYS: STORAGE_KEYS,
  get: jest.fn((key) => mockStorage._store[key] || null),
  set: jest.fn((key, data) => {
    mockStorage._store[key] = data;
    return true;
  }),
  remove: jest.fn((key) => {
    delete mockStorage._store[key];
    return true;
  }),
  addToList: jest.fn((key, item) => {
    const list = mockStorage._store[key] || [];
    list.unshift(item);
    mockStorage._store[key] = list;
    return true;
  }),
  getList: jest.fn((key) => mockStorage._store[key] || []),
  removeFromList: jest.fn((key, id) => {
    const list = mockStorage._store[key] || [];
    mockStorage._store[key] = list.filter(item => item.id !== id);
    return true;
  }),
  updateInList: jest.fn((key, id, updates) => {
    const list = mockStorage._store[key] || [];
    const index = list.findIndex(item => item.id === id);
    if (index > -1) {
      list[index] = { ...list[index], ...updates };
      return true;
    }
    return false;
  })
};

jest.mock('../utils/storage', () => mockStorage);

const mockWx = {
  getSystemInfoSync: jest.fn(() => ({ theme: 'light', statusBarHeight: 20, pixelRatio: 2 })),
  getWindowInfo: jest.fn(() => ({ pixelRatio: 2 })),
  onThemeChange: jest.fn(),
  setTabBarStyle: jest.fn(),
  setNavigationBarColor: jest.fn(),
  setStorageSync: jest.fn(),
  getStorageSync: jest.fn(),
  removeStorageSync: jest.fn(),
  showToast: jest.fn(),
  showModal: jest.fn(),
  navigateTo: jest.fn(),
  navigateBack: jest.fn(),
  redirectTo: jest.fn(),
  switchTab: jest.fn(),
  stopPullDownRefresh: jest.fn(),
  createSelectorQuery: jest.fn()
};

global.wx = mockWx;

let mockAppGlobalData = {
  userInfo: { account: 'test_user', nickName: 'Test User' },
  themeMode: 'light',
  isDark: false
};

global.getApp = jest.fn(() => ({ globalData: mockAppGlobalData }));

const dataService = require('../services/data');
const storage = require('../utils/storage');
const util = require('../utils/util');

jest.mock('../utils/util', () => ({
  generateId: jest.fn(() => 'test-id-' + Date.now()),
  relativeTime: jest.fn((t) => '刚刚'),
  showToast: jest.fn(),
  showSuccess: jest.fn(),
  showError: jest.fn(),
  navigateTo: jest.fn(),
  checkLogin: jest.fn(() => true),
  formatPrice: jest.fn((p) => '¥' + p),
  isValidPhone: jest.fn(() => true)
}));

const storageKeys = require('../utils/storage').STORAGE_KEYS;

beforeEach(() => {
  mockStorage._store = {};
  mockAppGlobalData = {
    userInfo: { account: 'test_user', nickName: 'Test User' },
    themeMode: 'light',
    isDark: false
  };
  global.getApp = jest.fn(() => ({ globalData: mockAppGlobalData }));
  Object.keys(mockWx).forEach(key => {
    if (typeof mockWx[key] === 'function' && mockWx[key].mockClear) {
      mockWx[key].mockClear();
    }
  });
  jest.clearAllMocks();
});

function createTestSurvey(overrides = {}) {
  return {
    id: 'test-survey-1',
    title: '测试问卷',
    description: '这是一个测试问卷',
    creator: 'test_user',
    creatorName: 'Test User',
    status: 'active',
    responseCount: 0,
    questions: [
      {
        id: 'q1',
        type: 'single',
        title: '你喜欢什么颜色？',
        options: ['红色', '蓝色', '绿色']
      },
      {
        id: 'q2',
        type: 'multiple',
        title: '你喜欢的运动？',
        options: ['篮球', '足球', '游泳']
      },
      {
        id: 'q3',
        type: 'fill',
        title: '请输入你的建议'
      }
    ],
    createTime: Date.now(),
    updateTime: Date.now(),
    ...overrides
  };
}

function createTestResponse(surveyId, userId) {
  return {
    id: 'test-response-1',
    surveyId,
    userId,
    answers: [
      { questionId: 'q1', value: '红色' },
      { questionId: 'q2', value: ['篮球', '游泳'] },
      { questionId: 'q3', value: '这是一个很好的问卷' }
    ],
    createTime: Date.now()
  };
}

describe('问卷模块 - getSurveyList', () => {
  test('无问卷时应返回空数组', () => {
    const result = dataService.getSurveyList();
    expect(result).toEqual([]);
  });

  test('应返回所有问卷', () => {
    const survey1 = createTestSurvey({ id: 's1', title: '问卷1' });
    const survey2 = createTestSurvey({ id: 's2', title: '问卷2' });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey1, survey2];

    const result = dataService.getSurveyList();
    expect(result.length).toBe(2);
    expect(result[0].id).toBe('s1');
    expect(result[1].id).toBe('s2');
  });

  test('按状态筛选时应返回对应状态问卷', () => {
    const activeSurvey = createTestSurvey({ id: 's1', status: 'active' });
    const closedSurvey = createTestSurvey({ id: 's2', status: 'closed' });
    mockStorage._store[storageKeys.SURVEY_LIST] = [activeSurvey, closedSurvey];

    const activeResult = dataService.getSurveyList({ status: 'active' });
    expect(activeResult.length).toBe(1);
    expect(activeResult[0].status).toBe('active');

    const closedResult = dataService.getSurveyList({ status: 'closed' });
    expect(closedResult.length).toBe(1);
    expect(closedResult[0].status).toBe('closed');
  });

  test('按关键词搜索应匹配标题或描述', () => {
    const survey1 = createTestSurvey({ id: 's1', title: '食堂满意度调查' });
    const survey2 = createTestSurvey({ id: 's2', title: '图书馆', description: '满意度调查' });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey1, survey2];

    const result = dataService.getSurveyList({ keyword: '满意度' });
    expect(result.length).toBe(2);
  });

  test('搜索关键词不区分大小写', () => {
    const survey1 = createTestSurvey({ id: 's1', title: 'Campus Survey' });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey1];

    const result = dataService.getSurveyList({ keyword: 'campus' });
    expect(result.length).toBe(1);
  });
});

describe('问卷模块 - getSurveyDetail', () => {
  test('问卷不存在时应返回 null', () => {
    const result = dataService.getSurveyDetail('nonexistent');
    expect(result).toBeNull();
  });

  test('问卷存在时应返回完整问卷信息', () => {
    const survey = createTestSurvey();
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];

    const result = dataService.getSurveyDetail('test-survey-1');
    expect(result).toEqual(survey);
    expect(result.questions.length).toBe(3);
  });
});

describe('问卷模块 - createSurvey', () => {
  test('应创建新问卷并保存到存储', () => {
    const surveyData = {
      title: '新问卷',
      description: '描述',
      creator: 'test_user',
      creatorName: 'Test User',
      questions: [
        {
          id: 'q1',
          type: 'single',
          title: '问题1',
          options: ['选项1', '选项2']
        }
      ]
    };

    const result = dataService.createSurvey(surveyData);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.title).toBe('新问卷');
    expect(result.status).toBe('active');
    expect(result.responseCount).toBe(0);
    expect(result.creator).toBe('test_user');
    expect(mockStorage.addToList).toHaveBeenCalledWith(
      storageKeys.SURVEY_LIST,
      expect.objectContaining({
        title: '新问卷',
        status: 'active'
      })
    );
  });

  test('创建问卷时应自动设置创建时间', () => {
    const beforeTime = Date.now();
    const result = dataService.createSurvey({
      title: '时间测试',
      questions: []
    });
    const afterTime = Date.now();

    expect(result.createTime).toBeGreaterThanOrEqual(beforeTime);
    expect(result.createTime).toBeLessThanOrEqual(afterTime);
    expect(result.updateTime).toBe(result.createTime);
  });
});

describe('问卷模块 - updateSurvey', () => {
  test('应更新问卷信息', () => {
    const survey = createTestSurvey();
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];

    const result = dataService.updateSurvey('test-survey-1', {
      title: '更新后的标题',
      description: '更新后的描述'
    });

    expect(result).toBe(true);
    expect(mockStorage.updateInList).toHaveBeenCalledWith(
      storageKeys.SURVEY_LIST,
      'test-survey-1',
      expect.objectContaining({
        title: '更新后的标题',
        description: '更新后的描述',
        updateTime: expect.any(Number)
      })
    );
  });

  test('问卷不存在时应返回 false', () => {
    const result = dataService.updateSurvey('nonexistent', { title: '测试' });
    expect(result).toBe(false);
  });
});

describe('问卷模块 - deleteSurvey', () => {
  test('应删除问卷及其所有回答', () => {
    const survey = createTestSurvey({ id: 's1' });
    const response1 = createTestResponse('s1', 'u1');
    const response2 = createTestResponse('s2', 'u1');
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];
    mockStorage._store[storageKeys.SURVEY_RESPONSES] = [response1, response2];

    const result = dataService.deleteSurvey('s1');

    expect(result).toBe(true);
    expect(mockStorage.removeFromList).toHaveBeenCalledWith(
      storageKeys.SURVEY_LIST,
      's1'
    );
    const remainingResponses = mockStorage._store[storageKeys.SURVEY_RESPONSES];
    expect(remainingResponses.length).toBe(1);
    expect(remainingResponses[0].surveyId).toBe('s2');
  });
});

describe('问卷模块 - closeSurvey', () => {
  test('应将问卷状态设置为 closed', () => {
    const survey = createTestSurvey({ id: 's1', status: 'active' });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];

    const result = dataService.closeSurvey('s1');

    expect(result).toBe(true);
    expect(mockStorage.updateInList).toHaveBeenCalledWith(
      storageKeys.SURVEY_LIST,
      's1',
      expect.objectContaining({
        status: 'closed',
        updateTime: expect.any(Number)
      })
    );
  });
});

describe('问卷模块 - 每人限填一次', () => {
  test('hasUserResponded 未回答时应返回 false', () => {
    const result = dataService.hasUserResponded('s1', 'u1');
    expect(result).toBe(false);
  });

  test('hasUserResponded 已回答时应返回 true', () => {
    const response = createTestResponse('s1', 'u1');
    mockStorage._store[storageKeys.SURVEY_RESPONSES] = [response];

    const result = dataService.hasUserResponded('s1', 'u1');
    expect(result).toBe(true);
  });

  test('同一用户对不同问卷回答不冲突', () => {
    const response1 = createTestResponse('s1', 'u1');
    const response2 = createTestResponse('s2', 'u2');
    mockStorage._store[storageKeys.SURVEY_RESPONSES] = [response1, response2];

    expect(dataService.hasUserResponded('s1', 'u1')).toBe(true);
    expect(dataService.hasUserResponded('s1', 'u2')).toBe(false);
    expect(dataService.hasUserResponded('s2', 'u1')).toBe(false);
    expect(dataService.hasUserResponded('s2', 'u2')).toBe(true);
  });
});

describe('问卷模块 - submitSurveyResponse', () => {
  test('首次回答应成功提交', () => {
    const survey = createTestSurvey({ id: 's1', responseCount: 0 });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];

    const answers = [
      { questionId: 'q1', value: '红色' },
      { questionId: 'q2', value: ['篮球'] },
      { questionId: 'q3', value: '很好' }
    ];

    const result = dataService.submitSurveyResponse('s1', 'u1', answers);

    expect(result).not.toBe(false);
    expect(result.id).toBeDefined();
    expect(result.surveyId).toBe('s1');
    expect(result.userId).toBe('u1');
    expect(mockStorage.addToList).toHaveBeenCalledWith(
      storageKeys.SURVEY_RESPONSES,
      expect.objectContaining({
        surveyId: 's1',
        userId: 'u1',
        answers: answers
      })
    );
  });

  test('提交后应更新问卷的 responseCount', () => {
    const survey = createTestSurvey({ id: 's1', responseCount: 0 });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];

    const answers = [
      { questionId: 'q1', value: '红色' },
      { questionId: 'q2', value: ['篮球'] },
      { questionId: 'q3', value: '很好' }
    ];

    dataService.submitSurveyResponse('s1', 'u1', answers);

    expect(mockStorage.updateInList).toHaveBeenCalledWith(
      storageKeys.SURVEY_LIST,
      's1',
      expect.objectContaining({
        responseCount: 1
      })
    );
  });

  test('重复提交应返回 false', () => {
    const survey = createTestSurvey({ id: 's1', responseCount: 1 });
    const existingResponse = createTestResponse('s1', 'u1');
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];
    mockStorage._store[storageKeys.SURVEY_RESPONSES] = [existingResponse];

    const answers = [
      { questionId: 'q1', value: '蓝色' }
    ];

    const result = dataService.submitSurveyResponse('s1', 'u1', answers);

    expect(result).toBe(false);
    expect(mockStorage.addToList).not.toHaveBeenCalledWith(
      storageKeys.SURVEY_RESPONSES,
      expect.anything()
    );
  });

  test('提交时应自动设置创建时间', () => {
    const survey = createTestSurvey({ id: 's1' });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];

    const beforeTime = Date.now();
    const result = dataService.submitSurveyResponse('s1', 'u1', []);
    const afterTime = Date.now();

    expect(result.createTime).toBeGreaterThanOrEqual(beforeTime);
    expect(result.createTime).toBeLessThanOrEqual(afterTime);
  });
});

describe('问卷模块 - getSurveyResponses', () => {
  test('无回答时应返回空数组', () => {
    const result = dataService.getSurveyResponses('s1');
    expect(result).toEqual([]);
  });

  test('应返回指定问卷的所有回答', () => {
    const response1 = createTestResponse('s1', 'u1');
    const response2 = createTestResponse('s1', 'u2');
    const response3 = createTestResponse('s2', 'u1');
    mockStorage._store[storageKeys.SURVEY_RESPONSES] = [response1, response2, response3];

    const result = dataService.getSurveyResponses('s1');
    expect(result.length).toBe(2);
    expect(result.every(r => r.surveyId === 's1')).toBe(true);
  });
});

describe('问卷模块 - getSurveyStatistics', () => {
  test('问卷不存在时应返回 null', () => {
    const result = dataService.getSurveyStatistics('nonexistent');
    expect(result).toBeNull();
  });

  test('无回答时应返回统计数据', () => {
    const survey = createTestSurvey({ id: 's1' });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];

    const result = dataService.getSurveyStatistics('s1');

    expect(result).not.toBeNull();
    expect(result.totalResponses).toBe(0);
    expect(result.survey.id).toBe('s1');
    expect(result.questionStats.length).toBe(3);
  });

  test('单选题统计应正确计算各选项票数', () => {
    const survey = createTestSurvey({ id: 's1' });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];

    const responses = [
      { ...createTestResponse('s1', 'u1'), answers: [{ questionId: 'q1', value: '红色' }] },
      { ...createTestResponse('s1', 'u2'), answers: [{ questionId: 'q1', value: '红色' }] },
      { ...createTestResponse('s1', 'u3'), answers: [{ questionId: 'q1', value: '蓝色' }] }
    ];
    mockStorage._store[storageKeys.SURVEY_RESPONSES] = responses;

    const result = dataService.getSurveyStatistics('s1');
    const singleStat = result.questionStats.find(s => s.id === 'q1');

    expect(singleStat.totalCount).toBe(3);
    expect(singleStat.options[0].count).toBe(2);
    expect(singleStat.options[0].percentage).toBe(67);
    expect(singleStat.options[1].count).toBe(1);
    expect(singleStat.options[1].percentage).toBe(33);
    expect(singleStat.options[2].count).toBe(0);
    expect(singleStat.options[2].percentage).toBe(0);
  });

  test('多选题统计应正确计算各选项选择次数', () => {
    const survey = createTestSurvey({ id: 's1' });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];

    const responses = [
      { ...createTestResponse('s1', 'u1'), answers: [{ questionId: 'q2', value: ['篮球', '足球'] }] },
      { ...createTestResponse('s1', 'u2'), answers: [{ questionId: 'q2', value: ['篮球', '游泳'] }] },
      { ...createTestResponse('s1', 'u3'), answers: [{ questionId: 'q2', value: ['篮球'] }] }
    ];
    mockStorage._store[storageKeys.SURVEY_RESPONSES] = responses;

    const result = dataService.getSurveyStatistics('s1');
    const multiStat = result.questionStats.find(s => s.id === 'q2');

    expect(multiStat.totalCount).toBe(3);
    expect(multiStat.options[0].count).toBe(3);
    expect(multiStat.options[1].count).toBe(1);
    expect(multiStat.options[2].count).toBe(1);
  });

  test('多选题百分比应基于总选择次数', () => {
    const survey = createTestSurvey({ id: 's1' });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];

    const responses = [
      { ...createTestResponse('s1', 'u1'), answers: [{ questionId: 'q2', value: ['篮球'] }] },
      { ...createTestResponse('s1', 'u2'), answers: [{ questionId: 'q2', value: ['足球'] }] }
    ];
    mockStorage._store[storageKeys.SURVEY_RESPONSES] = responses;

    const result = dataService.getSurveyStatistics('s1');
    const multiStat = result.questionStats.find(s => s.id === 'q2');

    expect(multiStat.options[0].percentage).toBe(50);
    expect(multiStat.options[1].percentage).toBe(50);
    expect(multiStat.options[2].percentage).toBe(0);
  });

  test('填空题统计应收集所有回答文本', () => {
    const survey = createTestSurvey({ id: 's1' });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];

    const responses = [
      { ...createTestResponse('s1', 'u1'), answers: [{ questionId: 'q3', value: '建议1' }] },
      { ...createTestResponse('s1', 'u2'), answers: [{ questionId: 'q3', value: '建议2' }] },
      { ...createTestResponse('s1', 'u3'), answers: [{ questionId: 'q3', value: '' }] }
    ];
    mockStorage._store[storageKeys.SURVEY_RESPONSES] = responses;

    const result = dataService.getSurveyStatistics('s1');
    const fillStat = result.questionStats.find(s => s.id === 'q3');

    expect(fillStat.fillAnswers).toEqual(['建议1', '建议2']);
  });

  test('百分比应四舍五入为整数', () => {
    const survey = createTestSurvey({ id: 's1' });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];

    const responses = [
      { ...createTestResponse('s1', 'u1'), answers: [{ questionId: 'q1', value: '红色' }] },
      { ...createTestResponse('s1', 'u2'), answers: [{ questionId: 'q1', value: '红色' }] },
      { ...createTestResponse('s1', 'u3'), answers: [{ questionId: 'q1', value: '红色' }] },
      { ...createTestResponse('s1', 'u4'), answers: [{ questionId: 'q1', value: '蓝色' }] },
      { ...createTestResponse('s1', 'u5'), answers: [{ questionId: 'q1', value: '蓝色' }] },
      { ...createTestResponse('s1', 'u6'), answers: [{ questionId: 'q1', value: '绿色' }] },
      { ...createTestResponse('s1', 'u7'), answers: [{ questionId: 'q1', value: '红色' }] }
    ];
    mockStorage._store[storageKeys.SURVEY_RESPONSES] = responses;

    const result = dataService.getSurveyStatistics('s1');
    const singleStat = result.questionStats.find(s => s.id === 'q1');

    expect(singleStat.options[0].percentage).toBe(57);
    expect(singleStat.options[1].percentage).toBe(29);
    expect(singleStat.options[2].percentage).toBe(14);
  });

  test('百分比总和应为 100', () => {
    const survey = createTestSurvey({ id: 's1' });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];

    const responses = [
      { ...createTestResponse('s1', 'u1'), answers: [{ questionId: 'q1', value: '红色' }] },
      { ...createTestResponse('s1', 'u2'), answers: [{ questionId: 'q1', value: '蓝色' }] },
      { ...createTestResponse('s1', 'u3'), answers: [{ questionId: 'q1', value: '绿色' }] }
    ];
    mockStorage._store[storageKeys.SURVEY_RESPONSES] = responses;

    const result = dataService.getSurveyStatistics('s1');
    const singleStat = result.questionStats.find(s => s.id === 'q1');

    const totalPercentage = singleStat.options.reduce((sum, opt) => sum + opt.percentage, 0);
    expect(totalPercentage).toBe(100);
  });
});

describe('问卷模块 - 边界情况', () => {
  test('统计空选项不应报错', () => {
    const survey = createTestSurvey({
      id: 's1',
      questions: [{ id: 'q1', type: 'single', title: '测试', options: [] }]
    });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];

    expect(() => dataService.getSurveyStatistics('s1')).not.toThrow();
  });

  test('统计未定义选项的回答应跳过', () => {
    const survey = createTestSurvey({
      id: 's1',
      questions: [{ id: 'q1', type: 'single', title: '测试', options: ['选项1'] }]
    });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];

    const responses = [
      { ...createTestResponse('s1', 'u1'), answers: [{ questionId: 'q1', value: '不存在的选项' }] }
    ];
    mockStorage._store[storageKeys.SURVEY_RESPONSES] = responses;

    const result = dataService.getSurveyStatistics('s1');
    const stat = result.questionStats[0];

    expect(stat.options[0].count).toBe(0);
    expect(stat.totalCount).toBe(1);
  });

  test('空值回答不应计入填空题统计', () => {
    const survey = createTestSurvey({ id: 's1' });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];

    const responses = [
      { ...createTestResponse('s1', 'u1'), answers: [{ questionId: 'q3', value: '' }] },
      { ...createTestResponse('s1', 'u2'), answers: [{ questionId: 'q3', value: null }] },
      { ...createTestResponse('s1', 'u3'), answers: [{ questionId: 'q3', value: undefined }] },
      { ...createTestResponse('s1', 'u4'), answers: [{ questionId: 'q3', value: '有效回答' }] }
    ];
    mockStorage._store[storageKeys.SURVEY_RESPONSES] = responses;

    const result = dataService.getSurveyStatistics('s1');
    const fillStat = result.questionStats.find(s => s.id === 'q3');

    expect(fillStat.fillAnswers).toEqual(['有效回答']);
  });

  test('未定义问题的回答不应影响统计', () => {
    const survey = createTestSurvey({
      id: 's1',
      questions: [{ id: 'q1', type: 'single', title: '测试', options: ['A', 'B'] }]
    });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];

    const responses = [
      {
        ...createTestResponse('s1', 'u1'),
        answers: [
          { questionId: 'q1', value: 'A' },
          { questionId: 'q99', value: '未定义问题' }
        ]
      }
    ];
    mockStorage._store[storageKeys.SURVEY_RESPONSES] = responses;

    expect(() => dataService.getSurveyStatistics('s1')).not.toThrow();
  });
});

describe('问卷模块 - 并发提交', () => {
  test('同一用户并发提交应只有第一个成功', () => {
    const survey = createTestSurvey({ id: 's1', responseCount: 0 });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];

    const answers = [{ questionId: 'q1', value: '红色' }];

    const result1 = dataService.submitSurveyResponse('s1', 'u1', answers);
    const result2 = dataService.submitSurveyResponse('s1', 'u1', answers);

    expect(result1).not.toBe(false);
    expect(result2).toBe(false);
    expect(mockStorage.addToList).toHaveBeenCalledTimes(1);
  });

  test('不同用户并发提交应都成功', () => {
    const survey = createTestSurvey({ id: 's1', responseCount: 0 });
    mockStorage._store[storageKeys.SURVEY_LIST] = [survey];

    const answers = [{ questionId: 'q1', value: '红色' }];

    const result1 = dataService.submitSurveyResponse('s1', 'u1', answers);
    const result2 = dataService.submitSurveyResponse('s1', 'u2', answers);
    const result3 = dataService.submitSurveyResponse('s1', 'u3', answers);

    expect(result1).not.toBe(false);
    expect(result2).not.toBe(false);
    expect(result3).not.toBe(false);
    expect(mockStorage.addToList).toHaveBeenCalledTimes(3);
  });
});
