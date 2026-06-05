jest.useFakeTimers();

const mockDataService = {
  createSurvey: jest.fn()
};

const mockConfig = {
  SURVEY_QUESTION_TYPES: [
    { value: 'single', label: '单选题' },
    { value: 'multiple', label: '多选题' },
    { value: 'fill', label: '填空题' }
  ]
};

const mockUtil = {
  showToast: jest.fn(),
  showSuccess: jest.fn(() => Promise.resolve()),
  showError: jest.fn()
};

let pageConfig;
let pageInstance;

const mockMixPage = jest.fn((config) => {
  pageConfig = config;
  return config;
});

jest.mock('../services/data', () => mockDataService);
jest.mock('../config/index', () => mockConfig);
jest.mock('../utils/util', () => mockUtil);
jest.mock('../utils/withTheme', () => ({
  mixPage: mockMixPage
}));

require('../pages/survey-create/index');

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

describe('survey-create 页面', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    pageInstance = createPageInstance();
    wx.navigateBack.mockReset();
    wx.navigateTo.mockReset();
  });

  describe('初始化数据', () => {
    test('应包含正确的初始数据', () => {
      expect(pageConfig.data.darkMode).toBe(false);
      expect(pageConfig.data.formData.title).toBe('');
      expect(pageConfig.data.formData.description).toBe('');
      expect(pageConfig.data.formData.questions).toEqual([]);
      expect(pageConfig.data.questionTypes).toEqual(mockConfig.SURVEY_QUESTION_TYPES);
      expect(pageConfig.data.submitting).toBe(false);
      expect(pageConfig.data.showTypePicker).toBe(false);
    });

    test('onLoad 时应添加一道单选题', () => {
      pageInstance.onLoad();

      expect(pageInstance.data.formData.questions.length).toBe(1);
      expect(pageInstance.data.formData.questions[0].type).toBe('single');
      expect(pageInstance.data.formData.questions[0].title).toBe('');
      expect(pageInstance.data.formData.questions[0].options).toEqual(['选项1', '选项2']);
    });
  });

  describe('基本信息输入', () => {
    test('onTitleInput 应更新问卷标题', () => {
      pageInstance.onTitleInput({ detail: { value: '测试问卷标题' } });
      expect(pageInstance.setData).toHaveBeenCalledWith({ 'formData.title': '测试问卷标题' });
    });

    test('onDescInput 应更新问卷描述', () => {
      pageInstance.onDescInput({ detail: { value: '这是问卷描述' } });
      expect(pageInstance.setData).toHaveBeenCalledWith({ 'formData.description': '这是问卷描述' });
    });
  });

  describe('addQuestion', () => {
    test('应正确添加单选题', () => {
      pageInstance.addQuestion('single');

      expect(pageInstance.data.formData.questions.length).toBe(1);
      const q = pageInstance.data.formData.questions[0];
      expect(q.type).toBe('single');
      expect(q.title).toBe('');
      expect(q.options).toEqual(['选项1', '选项2']);
      expect(q.id).toBeDefined();
    });

    test('应正确添加多选题', () => {
      pageInstance.addQuestion('multiple');

      const q = pageInstance.data.formData.questions[0];
      expect(q.type).toBe('multiple');
      expect(q.options).toEqual(['选项1', '选项2']);
    });

    test('应正确添加填空题', () => {
      pageInstance.addQuestion('fill');

      const q = pageInstance.data.formData.questions[0];
      expect(q.type).toBe('fill');
      expect(q.options).toEqual([]);
    });

    test('每题应有唯一 id', () => {
      pageInstance.addQuestion('single');
      pageInstance.addQuestion('single');

      expect(pageInstance.data.formData.questions[0].id).not.toBe(
        pageInstance.data.formData.questions[1].id
      );
    });

    test('应保留已有题目', () => {
      pageInstance.addQuestion('single');
      pageInstance.addQuestion('multiple');

      expect(pageInstance.data.formData.questions.length).toBe(2);
      expect(pageInstance.data.formData.questions[0].type).toBe('single');
      expect(pageInstance.data.formData.questions[1].type).toBe('multiple');
    });
  });

  describe('类型选择器', () => {
    test('onAddQuestion 应显示类型选择器', () => {
      pageInstance.onAddQuestion();
      expect(pageInstance.setData).toHaveBeenCalledWith({ showTypePicker: true });
    });

    test('onTypeSelect 应添加对应类型题目并隐藏选择器', () => {
      const addSpy = jest.spyOn(pageInstance, 'addQuestion');

      pageInstance.onTypeSelect({
        currentTarget: { dataset: { type: 'multiple' } }
      });

      expect(addSpy).toHaveBeenCalledWith('multiple');
      expect(pageInstance.setData).toHaveBeenCalledWith({ showTypePicker: false });
    });

    test('onHideTypePicker 应隐藏类型选择器', () => {
      pageInstance.onHideTypePicker();
      expect(pageInstance.setData).toHaveBeenCalledWith({ showTypePicker: false });
    });

    test('stopPropagation 应存在且不报错', () => {
      expect(() => pageInstance.stopPropagation()).not.toThrow();
    });
  });

  describe('题目标题输入', () => {
    beforeEach(() => {
      pageInstance.addQuestion('single');
    });

    test('onQuestionTitleInput 应更新指定题目标题', () => {
      pageInstance.onQuestionTitleInput({
        currentTarget: { dataset: { index: 0 } },
        detail: { value: '这是第一题' }
      });

      expect(pageInstance.setData).toHaveBeenCalledWith({
        'formData.questions[0].title': '这是第一题'
      });
    });
  });

  describe('删除题目', () => {
    test('只有一道题时不应删除', () => {
      pageInstance.addQuestion('single');

      pageInstance.onDeleteQuestion({
        currentTarget: { dataset: { index: 0 } }
      });

      expect(mockUtil.showToast).toHaveBeenCalledWith('至少保留一道题目');
      expect(pageInstance.data.formData.questions.length).toBe(1);
    });

    test('有多道题时应删除指定题目', () => {
      pageInstance.addQuestion('single');
      pageInstance.addQuestion('multiple');
      pageInstance.addQuestion('fill');

      pageInstance.onDeleteQuestion({
        currentTarget: { dataset: { index: 1 } }
      });

      expect(pageInstance.data.formData.questions.length).toBe(2);
      expect(pageInstance.data.formData.questions[0].type).toBe('single');
      expect(pageInstance.data.formData.questions[1].type).toBe('fill');
    });
  });

  describe('题目排序', () => {
    beforeEach(() => {
      pageInstance.addQuestion('single');
      pageInstance.addQuestion('multiple');
      pageInstance.addQuestion('fill');
    });

    test('onMoveUp 第一题时不应移动', () => {
      pageInstance.onMoveUp({ currentTarget: { dataset: { index: 0 } } });

      expect(pageInstance.data.formData.questions[0].type).toBe('single');
      expect(pageInstance.data.formData.questions[1].type).toBe('multiple');
    });

    test('onMoveUp 应将题目上移', () => {
      pageInstance.onMoveUp({ currentTarget: { dataset: { index: 1 } } });

      expect(pageInstance.data.formData.questions[0].type).toBe('multiple');
      expect(pageInstance.data.formData.questions[1].type).toBe('single');
    });

    test('onMoveDown 最后一题时不应移动', () => {
      pageInstance.onMoveDown({ currentTarget: { dataset: { index: 2 } } });

      expect(pageInstance.data.formData.questions[1].type).toBe('multiple');
      expect(pageInstance.data.formData.questions[2].type).toBe('fill');
    });

    test('onMoveDown 应将题目下移', () => {
      pageInstance.onMoveDown({ currentTarget: { dataset: { index: 0 } } });

      expect(pageInstance.data.formData.questions[0].type).toBe('multiple');
      expect(pageInstance.data.formData.questions[1].type).toBe('single');
    });
  });

  describe('选项管理', () => {
    beforeEach(() => {
      pageInstance.addQuestion('single');
    });

    test('onAddOption 应添加新选项', () => {
      pageInstance.onAddOption({
        currentTarget: { dataset: { index: 0 } }
      });

      expect(pageInstance.data.formData.questions[0].options).toEqual(['选项1', '选项2', '选项3']);
    });

    test('onAddOption 应按序号命名', () => {
      pageInstance.onAddOption({ currentTarget: { dataset: { index: 0 } } });
      pageInstance.onAddOption({ currentTarget: { dataset: { index: 0 } } });

      expect(pageInstance.data.formData.questions[0].options).toEqual([
        '选项1', '选项2', '选项3', '选项4'
      ]);
    });

    test('onOptionInput 应更新指定选项', () => {
      pageInstance.onOptionInput({
        currentTarget: { dataset: { qIndex: 0, oIndex: 0 } },
        detail: { value: '更新后的选项' }
      });

      expect(pageInstance.setData).toHaveBeenCalledWith({
        'formData.questions[0].options[0]': '更新后的选项'
      });
    });

    test('onDeleteOption 只有两个选项时不应删除', () => {
      pageInstance.onDeleteOption({
        currentTarget: { dataset: { qIndex: 0, oIndex: 0 } }
      });

      expect(mockUtil.showToast).toHaveBeenCalledWith('至少保留两个选项');
      expect(pageInstance.data.formData.questions[0].options.length).toBe(2);
    });

    test('onDeleteOption 多于两个选项时应删除', () => {
      pageInstance.onAddOption({ currentTarget: { dataset: { index: 0 } } });

      pageInstance.onDeleteOption({
        currentTarget: { dataset: { qIndex: 0, oIndex: 0 } }
      });

      expect(pageInstance.data.formData.questions[0].options).toEqual(['选项2', '选项3']);
    });

    test('onDeleteOption 应保留其他选项', () => {
      pageInstance.onAddOption({ currentTarget: { dataset: { index: 0 } } });
      pageInstance.onAddOption({ currentTarget: { dataset: { index: 0 } } });

      pageInstance.onDeleteOption({
        currentTarget: { dataset: { qIndex: 0, oIndex: 2 } }
      });

      expect(pageInstance.data.formData.questions[0].options).toEqual(['选项1', '选项2', '选项4']);
    });
  });

  describe('validateForm', () => {
    beforeEach(() => {
      pageInstance.data.formData.title = '测试问卷';
      pageInstance.data.formData.questions = [
        {
          id: 'q1',
          type: 'single',
          title: '单选题',
          options: ['A', 'B']
        },
        {
          id: 'q2',
          type: 'multiple',
          title: '多选题',
          options: ['X', 'Y']
        },
        {
          id: 'q3',
          type: 'fill',
          title: '填空题'
        }
      ];
    });

    test('问卷标题为空时应返回 false', () => {
      pageInstance.data.formData.title = '';
      expect(pageInstance.validateForm()).toBe(false);
      expect(mockUtil.showToast).toHaveBeenCalledWith('请输入问卷标题');
    });

    test('问卷标题只有空格时应返回 false', () => {
      pageInstance.data.formData.title = '   ';
      expect(pageInstance.validateForm()).toBe(false);
      expect(mockUtil.showToast).toHaveBeenCalledWith('请输入问卷标题');
    });

    test('题目标题空时应返回 false', () => {
      pageInstance.data.formData.questions[0].title = '';
      expect(pageInstance.validateForm()).toBe(false);
      expect(mockUtil.showToast).toHaveBeenCalledWith('请填写第1题的标题');
    });

    test('题目标题只有空格时应返回 false', () => {
      pageInstance.data.formData.questions[0].title = '   ';
      expect(pageInstance.validateForm()).toBe(false);
      expect(mockUtil.showToast).toHaveBeenCalledWith('请填写第1题的标题');
    });

    test('单选/多选题选项少于2个时应返回 false', () => {
      pageInstance.data.formData.questions[0].options = ['A'];
      expect(pageInstance.validateForm()).toBe(false);
      expect(mockUtil.showToast).toHaveBeenCalledWith('第1题至少需要两个选项');
    });

    test('单选/多选题有空白选项时应返回 false', () => {
      pageInstance.data.formData.questions[0].options = ['A', ''];
      expect(pageInstance.validateForm()).toBe(false);
      expect(mockUtil.showToast).toHaveBeenCalledWith('第1题的选项不能为空');
    });

    test('单选/多选题有空格选项时应返回 false', () => {
      pageInstance.data.formData.questions[0].options = ['A', '   '];
      expect(pageInstance.validateForm()).toBe(false);
      expect(mockUtil.showToast).toHaveBeenCalledWith('第1题的选项不能为空');
    });

    test('所有字段有效时应返回 true', () => {
      expect(pageInstance.validateForm()).toBe(true);
      expect(mockUtil.showToast).not.toHaveBeenCalled();
    });

    test('填空题选项为空数组时应通过验证', () => {
      pageInstance.data.formData.questions[2].options = [];
      expect(pageInstance.validateForm()).toBe(true);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      pageInstance.data.formData = {
        title: '测试问卷',
        description: '问卷描述',
        questions: [
          {
            id: 'q1',
            type: 'single',
            title: '单选题',
            options: ['A', 'B']
          }
        ]
      };
      pageInstance.data.submitting = false;
      mockDataService.createSurvey.mockReturnValue(true);

      const mockApp = {
        globalData: {
          userInfo: {
            account: 'test_account',
            nickName: '测试用户'
          }
        }
      };
      global.getApp = jest.fn(() => mockApp);
    });

    test('验证未通过时应返回', async () => {
      pageInstance.data.formData.title = '';
      await pageInstance.onSubmit();
      expect(mockDataService.createSurvey).not.toHaveBeenCalled();
    });

    test('提交前应设置 submitting 为 true', async () => {
      const submitPromise = pageInstance.onSubmit();
      jest.runAllTimers();
      await submitPromise;

      expect(pageInstance.setData).toHaveBeenCalledWith({ submitting: true });
    });

    test('提交数据应包含用户信息', async () => {
      const submitPromise = pageInstance.onSubmit();
      jest.runAllTimers();
      await submitPromise;

      expect(mockDataService.createSurvey).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '测试问卷',
          description: '问卷描述',
          creator: 'test_account',
          creatorName: '测试用户'
        })
      );
    });

    test('提交成功后应返回上一页', async () => {
      const submitPromise = pageInstance.onSubmit();
      jest.runAllTimers();
      await submitPromise;

      expect(mockUtil.showSuccess).toHaveBeenCalledWith('创建成功');
      expect(wx.navigateBack).toHaveBeenCalledWith(
        expect.objectContaining({ delta: 1 })
      );
    });

    test('navigateBack 失败时应跳转到列表页', async () => {
      wx.navigateBack.mockImplementation(({ fail }) => {
        fail && fail();
      });

      const submitPromise = pageInstance.onSubmit();
      jest.runAllTimers();
      await submitPromise;

      expect(wx.navigateTo).toHaveBeenCalledWith({
        url: '/pages/survey-list/index'
      });
    });

    test('提交失败时应显示错误', async () => {
      mockDataService.createSurvey.mockReturnValue(false);

      const submitPromise = pageInstance.onSubmit();
      jest.runAllTimers();
      await submitPromise;

      expect(mockUtil.showError).toHaveBeenCalledWith('创建失败');
      expect(wx.navigateBack).not.toHaveBeenCalled();
    });

    test('异常时应显示错误并重置 submitting', async () => {
      mockDataService.createSurvey.mockImplementation(() => {
        throw new Error('network error');
      });

      const submitPromise = pageInstance.onSubmit();
      jest.runAllTimers();
      await submitPromise;

      expect(mockUtil.showError).toHaveBeenCalledWith('创建失败');
      expect(pageInstance.setData).toHaveBeenLastCalledWith({ submitting: false });
    });

    test('无论成功失败都应重置 submitting', async () => {
      mockDataService.createSurvey.mockReturnValue(false);

      const submitPromise = pageInstance.onSubmit();
      jest.runAllTimers();
      await submitPromise;

      const setDataCalls = pageInstance.setData.mock.calls;
      expect(setDataCalls[0]).toEqual([{ submitting: true }]);
      expect(setDataCalls[setDataCalls.length - 1]).toEqual([{ submitting: false }]);
    });

    test('无用户信息时应使用空字符串', async () => {
      global.getApp = jest.fn(() => ({
        globalData: { userInfo: null }
      }));

      const submitPromise = pageInstance.onSubmit();
      jest.runAllTimers();
      await submitPromise;

      expect(mockDataService.createSurvey).toHaveBeenCalledWith(
        expect.objectContaining({
          creator: '',
          creatorName: ''
        })
      );
    });
  });
});
