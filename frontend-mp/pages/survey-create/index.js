const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    formData: {
      title: '',
      description: '',
      questions: [],
      logicRules: [],
      settings: {
        deadline: '',
        maxResponses: 0,
        publicResults: false,
        anonymousDisplay: false
      }
    },
    questionTypes: constants.SURVEY_QUESTION_TYPES,
    submitting: false,
    showTypePicker: false,
    showSettings: false,
    showLogicEditor: false,
    editingLogicIndex: -1,
    logicForm: {
      sourceQuestionId: '',
      operator: 'eq',
      value: '',
      action: 'show',
      targetQuestionId: ''
    },
    deadlineDisplay: '',
    questionTypeLabels: {
      single: '单选',
      multiple: '多选',
      fill: '填空',
      nps: 'NPS',
      likert: '量表',
      date: '日期'
    }
  },

  onLoad() {
    this.addQuestion('single');
  },

  onTitleInput(e) {
    this.setData({ 'formData.title': e.detail.value });
  },

  onDescInput(e) {
    this.setData({ 'formData.description': e.detail.value });
  },

  addQuestion(type) {
    const questions = [...this.data.formData.questions];
    const id = 'q_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const question = {
      id,
      type,
      title: '',
      options: (type === 'single' || type === 'multiple') ? ['选项1', '选项2'] : [],
      logicRules: []
    };
    questions.push(question);
    this.setData({ 'formData.questions': questions });
  },

  onAddQuestion() {
    this.setData({ showTypePicker: true });
  },

  onTypeSelect(e) {
    const { type } = e.currentTarget.dataset;
    this.addQuestion(type);
    this.setData({ showTypePicker: false });
  },

  onHideTypePicker() {
    this.setData({ showTypePicker: false });
  },

  onQuestionTitleInput(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ [`formData.questions[${index}].title`]: e.detail.value });
  },

  onDeleteQuestion(e) {
    const { index } = e.currentTarget.dataset;
    if (this.data.formData.questions.length <= 1) {
      util.showToast('至少保留一道题目');
      return;
    }
    const questions = [...this.data.formData.questions];
    const removedId = questions[index].id;
    questions.splice(index, 1);

    const logicRules = this.data.formData.logicRules.filter(
      r => r.sourceQuestionId !== removedId && r.targetQuestionId !== removedId
    );

    this.setData({ 'formData.questions': questions, 'formData.logicRules': logicRules });
  },

  onMoveUp(e) {
    const { index } = e.currentTarget.dataset;
    if (index <= 0) return;
    const questions = [...this.data.formData.questions];
    [questions[index - 1], questions[index]] = [questions[index], questions[index - 1]];
    this.setData({ 'formData.questions': questions });
  },

  onMoveDown(e) {
    const { index } = e.currentTarget.dataset;
    const questions = [...this.data.formData.questions];
    if (index >= questions.length - 1) return;
    [questions[index], questions[index + 1]] = [questions[index + 1], questions[index]];
    this.setData({ 'formData.questions': questions });
  },

  onAddOption(e) {
    const { index } = e.currentTarget.dataset;
    const questions = [...this.data.formData.questions];
    const options = [...questions[index].options];
    options.push('选项' + (options.length + 1));
    questions[index].options = options;
    this.setData({ 'formData.questions': questions });
  },

  onOptionInput(e) {
    const { qIndex, oIndex } = e.currentTarget.dataset;
    this.setData({ [`formData.questions[${qIndex}].options[${oIndex}]`]: e.detail.value });
  },

  onDeleteOption(e) {
    const { qIndex, oIndex } = e.currentTarget.dataset;
    const questions = [...this.data.formData.questions];
    const options = [...questions[qIndex].options];
    if (options.length <= 2) {
      util.showToast('至少保留两个选项');
      return;
    }
    options.splice(oIndex, 1);
    questions[qIndex].options = options;
    this.setData({ 'formData.questions': questions });
  },

  onToggleSettings() {
    this.setData({ showSettings: !this.data.showSettings });
  },

  onDeadlineChange(e) {
    const deadline = new Date(e.detail.value).getTime();
    const display = e.detail.value;
    this.setData({
      'formData.settings.deadline': deadline,
      deadlineDisplay: display
    });
  },

  onMaxResponsesInput(e) {
    const val = parseInt(e.detail.value) || 0;
    this.setData({ 'formData.settings.maxResponses': val });
  },

  onPublicResultsChange(e) {
    this.setData({ 'formData.settings.publicResults': e.detail.value });
  },

  onAnonymousDisplayChange(e) {
    this.setData({ 'formData.settings.anonymousDisplay': e.detail.value });
  },

  onToggleLogicEditor() {
    this.setData({ showLogicEditor: !this.data.showLogicEditor });
  },

  onAddLogicRule() {
    const { logicForm, formData } = this.data;
    if (!logicForm.sourceQuestionId || !logicForm.targetQuestionId || !logicForm.value) {
      util.showToast('请完善逻辑规则');
      return;
    }
    if (logicForm.sourceQuestionId === logicForm.targetQuestionId) {
      util.showToast('源题目和目标题目不能相同');
      return;
    }

    const rules = [...formData.logicRules, {
      id: 'logic_' + Date.now(),
      ...logicForm
    }];

    this.setData({
      'formData.logicRules': rules,
      logicForm: {
        sourceQuestionId: '',
        operator: 'eq',
        value: '',
        action: 'show',
        targetQuestionId: ''
      }
    });
  },

  onDeleteLogicRule(e) {
    const { index } = e.currentTarget.dataset;
    const rules = [...this.data.formData.logicRules];
    rules.splice(index, 1);
    this.setData({ 'formData.logicRules': rules });
  },

  onLogicFieldChange(e) {
    const { field } = e.currentTarget.dataset;
    const value = e.detail.value;
    this.setData({ [`logicForm.${field}`]: value });
  },

  validateForm() {
    const { formData } = this.data;

    if (!formData.title.trim()) {
      util.showToast('请输入问卷标题');
      return false;
    }

    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.title.trim()) {
        util.showToast(`请填写第${i + 1}题的标题`);
        return false;
      }
      if ((q.type === 'single' || q.type === 'multiple') && (!q.options || q.options.length < 2)) {
        util.showToast(`第${i + 1}题至少需要两个选项`);
        return false;
      }
      if (q.type === 'single' || q.type === 'multiple') {
        const hasEmpty = q.options.some(opt => !opt.trim());
        if (hasEmpty) {
          util.showToast(`第${i + 1}题的选项不能为空`);
          return false;
        }
      }
    }

    if (formData.settings.deadline && formData.settings.deadline <= Date.now()) {
      util.showToast('截止时间必须晚于当前时间');
      return false;
    }

    return true;
  },

  async onSubmit() {
    if (!this.validateForm()) return;

    this.setData({ submitting: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const app = getApp();
      const data = {
        ...this.data.formData,
        creator: app.globalData.userInfo ? app.globalData.userInfo.account : '',
        creatorName: app.globalData.userInfo ? app.globalData.userInfo.nickName : ''
      };

      const result = dataService.createSurvey(data);

      if (result) {
        await util.showSuccess('创建成功');
        wx.navigateBack({
          delta: 1,
          fail: () => {
            wx.navigateTo({ url: '/pages/survey-list/index' });
          }
        });
      } else {
        util.showError('创建失败');
      }
    } catch (e) {
      util.showError('创建失败');
    } finally {
      this.setData({ submitting: false });
    }
  },

  stopPropagation() {}
});
