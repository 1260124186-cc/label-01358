jest.useFakeTimers();

const mockDataService = {
  getSurveyDetail: jest.fn(),
  hasUserResponded: jest.fn(),
  submitSurveyResponse: jest.fn()
};

const mockUtil = {
  showToast: jest.fn(),
  showSuccess: jest.fn(() => Promise.resolve()),
  showError: jest.fn(),
  checkLogin: jest.fn(() => true),
  navigateTo: jest.fn()
};

let pageConfig;
let pageInstance;

const mockMixPage = jest.fn((config) => {
  pageConfig = config;
  return config;
});

jest.mock('../services/data', () => mockDataService);
jest.mock('../utils/util', () => mockUtil);
jest.mock('../utils/withTheme', () => ({
  mixPage: mockMixPage
}));

require('../pages/survey-fill/index');

function parsePath(path) {
  const result = [];
  let current = '';
  let i = 0;

  while (i < path.length) {
    if (path[i] === '.') {
      if (current) {
        result.push(current);
        current = '';
      }
      i++;
    } else if (path[i] === '[') {
      if (current) {
        result.push(current);
        current = '';
      }
      i++;
      while (i < path.length && path[i] !== ']') {
        current += path[i];
        i++;
      }
      if (current.match(/^\d+$/)) {
        result.push(parseInt(current, 10));
      } else {
        result.push(current);
      }
      current = '';
      i++;
    } else {
      current += path[i];
      i++;
    }
  }

  if (current) {
    result.push(current);
  }

  return result;
}

function setDataByPath(obj, path, value) {
  const keys = parsePath(path);
  const lastKey = keys.pop();
  let current = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1] !== undefined ? keys[i + 1] : lastKey;

    if (typeof nextKey === 'number' && !Array.isArray(current[key])) {
      current[key] = [];
    } else if (typeof nextKey === 'string' && (!current[key] || typeof current[key] !== 'object')) {
      current[key] = {};
    }

    current = current[key];
  }

  current[lastKey] = value;
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function createPageInstance(initialData = {}) {
  const instance = {
    data: deepClone({ ...pageConfig.data, ...initialData }),
    setData: jest.fn(function(updates) {
      Object.keys(updates).forEach(key => {
        if (key.includes('.') || key.includes('[')) {
          setDataByPath(this.data, key, updates[key]);
        } else {
          this.data[key] = updates[key];
        }
      });
    })
  };

  Object.keys(pageConfig).forEach(key => {
    if (typeof pageConfig[key] === 'function') {
      instance[key] = pageConfig[key].bind(instance);
    }
  });

  return instance;
}

describe('survey-fill 页面', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    pageInstance = createPageInstance();

    mockUtil.showToast.mockResolvedValue();
    wx.navigateBack.mockReset();
    wx.redirectTo.mockReset();
  });

  describe('初始化数据', () => {
    test('应包含正确的初始数据', () => {
      expect(pageConfig.data.darkMode).toBe(false);
      expect(pageConfig.data.surveyId).toBe('');
      expect(pageConfig.data.survey).toBeNull();
      expect(pageConfig.data.answers).toEqual({});
      expect(pageConfig.data.submitting).toBe(false);
      expect(pageConfig.data.alreadyResponded).toBe(false);
      expect(pageConfig.data.questionOptionsWithState).toEqual({});
    });
  });

  describe('computeOptionStates', () => {
    const mockSurvey = {
      id: 'survey123',
      title: '测试问卷',
      status: 'active',
      responseCount: 0,
      questions: [
        { id: 'q1', type: 'single', title: '单选题', options: ['A', 'B'] },
        { id: 'q2', type: 'multiple', title: '多选题', options: ['X', 'Y', 'Z'] },
        { id: 'q3', type: 'fill', title: '填空题' }
      ]
    };

    test('无问卷时不应报错', () => {
      pageInstance.data.survey = null;
      expect(() => pageInstance.computeOptionStates()).not.toThrow();
      expect(pageInstance.data.questionOptionsWithState).toEqual({});
    });

    test('无 questions 时不应报错', () => {
      pageInstance.data.survey = { ...mockSurvey, questions: undefined };
      expect(() => pageInstance.computeOptionStates()).not.toThrow();
      expect(pageInstance.data.questionOptionsWithState).toEqual({});
    });

    test('多选题无 options 时不应报错', () => {
      pageInstance.data.survey = {
        ...mockSurvey,
        questions: [{ id: 'q2', type: 'multiple', title: '多选题' }]
      };
      expect(() => pageInstance.computeOptionStates()).not.toThrow();
    });

    test('应正确计算未选择时的选项状态', () => {
      pageInstance.data.survey = mockSurvey;
      pageInstance.data.answers = { q2: [] };

      pageInstance.computeOptionStates();

      expect(pageInstance.setData).toHaveBeenCalledWith({
        questionOptionsWithState: {
          q2: [
            { label: 'X', selected: false },
            { label: 'Y', selected: false },
            { label: 'Z', selected: false }
          ]
        }
      });
    });

    test('应正确计算部分选择时的选项状态', () => {
      pageInstance.data.survey = mockSurvey;
      pageInstance.data.answers = { q2: ['X', 'Z'] };

      pageInstance.computeOptionStates();

      expect(pageInstance.setData).toHaveBeenCalledWith({
        questionOptionsWithState: {
          q2: [
            { label: 'X', selected: true },
            { label: 'Y', selected: false },
            { label: 'Z', selected: true }
          ]
        }
      });
    });

    test('应正确计算全部选择时的选项状态', () => {
      pageInstance.data.survey = mockSurvey;
      pageInstance.data.answers = { q2: ['X', 'Y', 'Z'] };

      pageInstance.computeOptionStates();

      expect(pageInstance.setData).toHaveBeenCalledWith({
        questionOptionsWithState: {
          q2: [
            { label: 'X', selected: true },
            { label: 'Y', selected: true },
            { label: 'Z', selected: true }
          ]
        }
      });
    });

    test('多选题 answers 未定义时应视为未选择', () => {
      pageInstance.data.survey = mockSurvey;
      pageInstance.data.answers = {};

      pageInstance.computeOptionStates();

      expect(pageInstance.setData).toHaveBeenCalledWith({
        questionOptionsWithState: {
          q2: [
            { label: 'X', selected: false },
            { label: 'Y', selected: false },
            { label: 'Z', selected: false }
          ]
        }
      });
    });

    test('单选题和填空题不应生成选项状态', () => {
      pageInstance.data.survey = mockSurvey;
      pageInstance.data.answers = { q1: 'A', q2: ['X'], q3: '回答' };

      pageInstance.computeOptionStates();

      const states = pageInstance.setData.mock.calls[0][0].questionOptionsWithState;
      expect(Object.keys(states)).toEqual(['q2']);
      expect(states.q1).toBeUndefined();
      expect(states.q3).toBeUndefined();
    });
  });

  describe('onLoad', () => {
    test('无 id 参数时应显示错误并返回', () => {
      pageInstance.onLoad({});
      expect(mockUtil.showToast).toHaveBeenCalledWith('参数错误');
      jest.runAllTimers();
      expect(wx.navigateBack).toHaveBeenCalled();
    });

    test('用户已回答时应设置 alreadyResponded 为 true', () => {
      mockDataService.hasUserResponded.mockReturnValue(true);
      mockDataService.getSurveyDetail.mockReturnValue(null);

      pageInstance.onLoad({ id: 'survey123' });

      expect(pageInstance.data.alreadyResponded).toBe(true);
      expect(pageInstance.data.surveyId).toBe('survey123');
      expect(mockDataService.getSurveyDetail).toHaveBeenCalledWith('survey123');
    });

    test('用户未回答时应正常加载问卷', () => {
      mockDataService.hasUserResponded.mockReturnValue(false);
      mockDataService.getSurveyDetail.mockReturnValue(null);

      pageInstance.onLoad({ id: 'survey123' });

      expect(pageInstance.data.alreadyResponded).toBe(false);
      expect(pageInstance.data.surveyId).toBe('survey123');
    });
  });

  describe('loadSurvey', () => {
    const mockSurvey = {
      id: 'survey123',
      title: '测试问卷',
      description: '这是一个测试问卷',
      status: 'active',
      responseCount: 5,
      questions: [
        { id: 'q1', type: 'single', title: '单选题', options: ['A', 'B', 'C'] },
        { id: 'q2', type: 'multiple', title: '多选题', options: ['X', 'Y', 'Z'] },
        { id: 'q3', type: 'fill', title: '填空题' }
      ]
    };

    test('问卷不存在时应显示错误并返回', () => {
      mockDataService.getSurveyDetail.mockReturnValue(null);

      pageInstance.loadSurvey('invalid-id');

      expect(mockUtil.showToast).toHaveBeenCalledWith('问卷不存在');
      jest.runAllTimers();
      expect(wx.navigateBack).toHaveBeenCalled();
    });

    test('问卷已结束时应跳转结果页', () => {
      mockDataService.getSurveyDetail.mockReturnValue({ ...mockSurvey, status: 'closed' });

      pageInstance.loadSurvey('survey123');

      expect(mockUtil.showToast).toHaveBeenCalledWith('该问卷已结束');
      jest.runAllTimers();
      expect(wx.redirectTo).toHaveBeenCalledWith({
        url: '/pages/survey-result/index?id=survey123'
      });
    });

    test('应正确初始化 answers 数据结构', () => {
      mockDataService.getSurveyDetail.mockReturnValue(mockSurvey);

      pageInstance.loadSurvey('survey123');

      expect(pageInstance.setData).toHaveBeenCalled();
      expect(pageInstance.data.survey).toEqual(mockSurvey);
      expect(pageInstance.data.answers.q1).toBe('');
      expect(pageInstance.data.answers.q2).toEqual([]);
      expect(pageInstance.data.answers.q3).toBe('');
    });

    test('loadSurvey 应调用 computeOptionStates', () => {
      mockDataService.getSurveyDetail.mockReturnValue(mockSurvey);
      const computeSpy = jest.spyOn(pageInstance, 'computeOptionStates');

      pageInstance.loadSurvey('survey123');

      expect(computeSpy).toHaveBeenCalled();
    });

    test('loadSurvey 应设置 questionOptionsWithState', () => {
      mockDataService.getSurveyDetail.mockReturnValue(mockSurvey);

      pageInstance.loadSurvey('survey123');

      const setDataCalls = pageInstance.setData.mock.calls;
      const lastCall = setDataCalls[setDataCalls.length - 1][0];
      expect(lastCall.questionOptionsWithState).toBeDefined();
      expect(lastCall.questionOptionsWithState.q2).toBeDefined();
      expect(lastCall.questionOptionsWithState.q2.length).toBe(3);
    });

    test('无 questions 时不应报错', () => {
      mockDataService.getSurveyDetail.mockReturnValue({ ...mockSurvey, questions: undefined });

      expect(() => pageInstance.loadSurvey('survey123')).not.toThrow();
      expect(pageInstance.data.answers).toEqual({});
    });
  });

  describe('onSingleSelect', () => {
    beforeEach(() => {
      pageInstance.data.surveyId = 'survey123';
      pageInstance.data.answers = { q1: '' };
    });

    test('已回答时不应更新数据', () => {
      pageInstance.data.alreadyResponded = true;

      pageInstance.onSingleSelect({
        currentTarget: { dataset: { qId: 'q1', value: 'A' } }
      });

      expect(pageInstance.setData).not.toHaveBeenCalled();
      expect(pageInstance.data.answers.q1).toBe('');
    });

    test('未回答时应更新答案', () => {
      pageInstance.data.alreadyResponded = false;

      pageInstance.onSingleSelect({
        currentTarget: { dataset: { qId: 'q1', value: 'A' } }
      });

      expect(pageInstance.setData).toHaveBeenCalledWith({ 'answers.q1': 'A' });
    });
  });

  describe('onMultipleSelect', () => {
    beforeEach(() => {
      pageInstance.data.surveyId = 'survey123';
      pageInstance.data.answers = { q2: [] };
    });

    test('已回答时不应更新数据', () => {
      pageInstance.data.alreadyResponded = true;

      pageInstance.onMultipleSelect({
        currentTarget: { dataset: { qId: 'q2', value: 'X' } }
      });

      expect(pageInstance.setData).not.toHaveBeenCalled();
      expect(pageInstance.data.answers.q2).toEqual([]);
    });

    test('未选择时应添加选项', () => {
      pageInstance.data.alreadyResponded = false;
      const computeSpy = jest.spyOn(pageInstance, 'computeOptionStates');

      pageInstance.onMultipleSelect({
        currentTarget: { dataset: { qId: 'q2', value: 'X' } }
      });

      expect(pageInstance.setData).toHaveBeenCalledWith({ 'answers.q2': ['X'] });
      expect(computeSpy).toHaveBeenCalled();
    });

    test('已选择时应取消选项', () => {
      pageInstance.data.alreadyResponded = false;
      pageInstance.data.answers.q2 = ['X', 'Y'];
      const computeSpy = jest.spyOn(pageInstance, 'computeOptionStates');

      pageInstance.onMultipleSelect({
        currentTarget: { dataset: { qId: 'q2', value: 'X' } }
      });

      expect(pageInstance.setData).toHaveBeenCalledWith({ 'answers.q2': ['Y'] });
      expect(computeSpy).toHaveBeenCalled();
    });

    test('answers 未定义时应创建数组', () => {
      pageInstance.data.alreadyResponded = false;
      pageInstance.data.answers = {};
      const computeSpy = jest.spyOn(pageInstance, 'computeOptionStates');

      pageInstance.onMultipleSelect({
        currentTarget: { dataset: { qId: 'q2', value: 'X' } }
      });

      expect(pageInstance.setData).toHaveBeenCalledWith({ 'answers.q2': ['X'] });
      expect(computeSpy).toHaveBeenCalled();
    });
  });

  describe('onFillInput', () => {
    beforeEach(() => {
      pageInstance.data.surveyId = 'survey123';
      pageInstance.data.answers = { q3: '' };
    });

    test('已回答时不应更新数据', () => {
      pageInstance.data.alreadyResponded = true;

      pageInstance.onFillInput({
        currentTarget: { dataset: { qId: 'q3' } },
        detail: { value: '测试回答' }
      });

      expect(pageInstance.setData).not.toHaveBeenCalled();
      expect(pageInstance.data.answers.q3).toBe('');
    });

    test('未回答时应更新答案', () => {
      pageInstance.data.alreadyResponded = false;

      pageInstance.onFillInput({
        currentTarget: { dataset: { qId: 'q3' } },
        detail: { value: '测试回答' }
      });

      expect(pageInstance.setData).toHaveBeenCalledWith({ 'answers.q3': '测试回答' });
    });
  });

  describe('validateAnswers', () => {
    const mockSurvey = {
      id: 'survey123',
      title: '测试问卷',
      status: 'active',
      responseCount: 0,
      questions: [
        { id: 'q1', type: 'single', title: '单选题', options: ['A', 'B'] },
        { id: 'q2', type: 'multiple', title: '多选题', options: ['X', 'Y'] },
        { id: 'q3', type: 'fill', title: '填空题' }
      ]
    };

    beforeEach(() => {
      pageInstance.data.survey = mockSurvey;
    });

    test('无问卷时应返回 false', () => {
      pageInstance.data.survey = null;
      expect(pageInstance.validateAnswers()).toBe(false);
    });

    test('单选题未回答时应返回 false', () => {
      pageInstance.data.answers = {
        q1: '',
        q2: ['X'],
        q3: '回答'
      };

      const result = pageInstance.validateAnswers();
      expect(result).toBe(false);
      expect(mockUtil.showToast).toHaveBeenCalledWith('请完成第1题');
    });

    test('多选题未选择时应返回 false', () => {
      pageInstance.data.answers = {
        q1: 'A',
        q2: [],
        q3: '回答'
      };

      const result = pageInstance.validateAnswers();
      expect(result).toBe(false);
      expect(mockUtil.showToast).toHaveBeenCalledWith('请完成第2题');
    });

    test('填空题未填写时应返回 false', () => {
      pageInstance.data.answers = {
        q1: 'A',
        q2: ['X'],
        q3: ''
      };

      const result = pageInstance.validateAnswers();
      expect(result).toBe(false);
      expect(mockUtil.showToast).toHaveBeenCalledWith('请完成第3题');
    });

    test('填空题只有空格时应返回 false', () => {
      pageInstance.data.answers = {
        q1: 'A',
        q2: ['X'],
        q3: '   '
      };

      const result = pageInstance.validateAnswers();
      expect(result).toBe(false);
      expect(mockUtil.showToast).toHaveBeenCalledWith('请完成第3题');
    });

    test('所有问题都回答时应返回 true', () => {
      pageInstance.data.answers = {
        q1: 'A',
        q2: ['X', 'Y'],
        q3: '这是我的回答'
      };

      const result = pageInstance.validateAnswers();
      expect(result).toBe(true);
      expect(mockUtil.showToast).not.toHaveBeenCalled();
    });

    test('多选题答案未定义时应返回 false', () => {
      pageInstance.data.answers = {
        q1: 'A',
        q3: '回答'
      };

      const result = pageInstance.validateAnswers();
      expect(result).toBe(false);
    });
  });

  describe('onSubmit', () => {
    const mockSurvey = {
      id: 'survey123',
      title: '测试问卷',
      status: 'active',
      responseCount: 0,
      questions: [
        { id: 'q1', type: 'single', title: '单选题', options: ['A', 'B'] },
        { id: 'q2', type: 'multiple', title: '多选题', options: ['X', 'Y'] },
        { id: 'q3', type: 'fill', title: '填空题' }
      ]
    };

    beforeEach(() => {
      pageInstance.data.surveyId = 'survey123';
      pageInstance.data.survey = mockSurvey;
      pageInstance.data.alreadyResponded = false;
      pageInstance.data.submitting = false;
      pageInstance.data.answers = {
        q1: 'A',
        q2: ['X'],
        q3: '回答'
      };
      mockUtil.checkLogin.mockReturnValue(true);
      mockDataService.hasUserResponded.mockReturnValue(false);
      mockDataService.submitSurveyResponse.mockReturnValue(true);
      wx.redirectTo.mockReset();
    });

    test('已回答时应提示并返回', async () => {
      pageInstance.data.alreadyResponded = true;

      await pageInstance.onSubmit();

      expect(mockUtil.showToast).toHaveBeenCalledWith('您已填写过此问卷');
      expect(mockUtil.checkLogin).not.toHaveBeenCalled();
    });

    test('未登录时应返回', async () => {
      mockUtil.checkLogin.mockReturnValue(false);

      await pageInstance.onSubmit();

      expect(mockDataService.submitSurveyResponse).not.toHaveBeenCalled();
    });

    test('验证未通过时应返回', async () => {
      pageInstance.data.answers = {};

      await pageInstance.onSubmit();

      expect(mockDataService.submitSurveyResponse).not.toHaveBeenCalled();
    });

    test('提交前应设置 submitting 为 true', async () => {
      const submitPromise = pageInstance.onSubmit();
      jest.runAllTimers();
      await submitPromise;

      expect(pageInstance.setData).toHaveBeenCalledWith({ submitting: true });
    });

    test('提交时再次检查已回答状态', async () => {
      mockDataService.hasUserResponded.mockReturnValue(true);

      const submitPromise = pageInstance.onSubmit();
      jest.runAllTimers();
      await submitPromise;

      expect(mockUtil.showToast).toHaveBeenCalledWith('您已填写过此问卷');
      expect(pageInstance.data.alreadyResponded).toBe(true);
      expect(mockDataService.submitSurveyResponse).not.toHaveBeenCalled();
    });

    test('提交成功后应跳转结果页', async () => {
      const submitPromise = pageInstance.onSubmit();
      jest.runAllTimers();
      await submitPromise;

      expect(mockDataService.submitSurveyResponse).toHaveBeenCalledWith(
        'survey123',
        'test',
        [
          { questionId: 'q1', value: 'A' },
          { questionId: 'q2', value: ['X'] },
          { questionId: 'q3', value: '回答' }
        ]
      );
      expect(mockUtil.showSuccess).toHaveBeenCalledWith('提交成功');
      expect(wx.redirectTo).toHaveBeenCalledWith({
        url: '/pages/survey-result/index?id=survey123'
      });
    });

    test('提交失败时应显示错误', async () => {
      mockDataService.submitSurveyResponse.mockReturnValue(false);

      const submitPromise = pageInstance.onSubmit();
      jest.runAllTimers();
      await submitPromise;

      expect(mockUtil.showError).toHaveBeenCalledWith('提交失败');
      expect(wx.redirectTo).not.toHaveBeenCalled();
    });

    test('异常时应显示错误并重置 submitting', async () => {
      mockDataService.submitSurveyResponse.mockImplementation(() => {
        throw new Error('network error');
      });

      const submitPromise = pageInstance.onSubmit();
      jest.runAllTimers();
      await submitPromise;

      expect(mockUtil.showError).toHaveBeenCalledWith('提交失败');
      expect(pageInstance.setData).toHaveBeenLastCalledWith({ submitting: false });
    });

    test('无论成功失败都应重置 submitting', async () => {
      mockDataService.submitSurveyResponse.mockReturnValue(false);

      const submitPromise = pageInstance.onSubmit();
      jest.runAllTimers();
      await submitPromise;

      const setDataCalls = pageInstance.setData.mock.calls;
      expect(setDataCalls[0]).toEqual([{ submitting: true }]);
      expect(setDataCalls[setDataCalls.length - 1]).toEqual([{ submitting: false }]);
    });
  });

  describe('onViewResult', () => {
    test('应跳转到结果页', () => {
      pageInstance.data.surveyId = 'survey123';

      pageInstance.onViewResult();

      expect(mockUtil.navigateTo).toHaveBeenCalledWith('/pages/survey-result/index?id=survey123');
    });
  });

  describe('已回答状态交互保护', () => {
    test('onSingleSelect 在 alreadyResponded 时应直接返回', () => {
      pageInstance.data.alreadyResponded = true;
      const setDataSpy = jest.spyOn(pageInstance, 'setData');

      pageInstance.onSingleSelect({
        currentTarget: { dataset: { qId: 'q1', value: 'A' } }
      });

      expect(setDataSpy).not.toHaveBeenCalled();
    });

    test('onMultipleSelect 在 alreadyResponded 时应直接返回', () => {
      pageInstance.data.alreadyResponded = true;
      const setDataSpy = jest.spyOn(pageInstance, 'setData');

      pageInstance.onMultipleSelect({
        currentTarget: { dataset: { qId: 'q2', value: 'X' } }
      });

      expect(setDataSpy).not.toHaveBeenCalled();
    });

    test('onFillInput 在 alreadyResponded 时应直接返回', () => {
      pageInstance.data.alreadyResponded = true;
      const setDataSpy = jest.spyOn(pageInstance, 'setData');

      pageInstance.onFillInput({
        currentTarget: { dataset: { qId: 'q3' } },
        detail: { value: 'test' }
      });

      expect(setDataSpy).not.toHaveBeenCalled();
    });
  });
});
