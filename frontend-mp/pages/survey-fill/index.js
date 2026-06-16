const dataService = require('../../services/data');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    surveyId: '',
    survey: null,
    answers: {},
    submitting: false,
    alreadyResponded: false,
    questionOptionsWithState: {},
    visibleQuestions: [],
    canFill: true,
    fillReason: '',
    questionTypeLabels: {
      single: '单选',
      multiple: '多选',
      fill: '填空',
      nps: 'NPS',
      likert: '量表',
      date: '日期'
    }
  },

  onLoad(options) {
    if (!options.id) {
      util.showToast('参数错误');
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const app = getApp();
    const userId = app.globalData.userInfo ? app.globalData.userInfo.account : '';

    if (dataService.hasUserResponded(options.id, userId)) {
      this.setData({ alreadyResponded: true, surveyId: options.id });
      this.loadSurvey(options.id);
      return;
    }

    this.setData({ surveyId: options.id });
    this.loadSurvey(options.id);
  },

  loadSurvey(id) {
    const survey = dataService.getSurveyDetail(id);
    if (!survey) {
      util.showToast('问卷不存在');
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    const fillCheck = dataService.canFillSurvey(survey);
    if (!fillCheck.canFill && !this.data.alreadyResponded) {
      this.setData({ canFill: false, fillReason: fillCheck.reason });
      if (survey.settings && survey.settings.publicResults) {
        setTimeout(() => {
          wx.redirectTo({ url: `/pages/survey-result/index?id=${id}` });
        }, 2000);
      }
      return;
    }

    const answers = {};
    (survey.questions || []).forEach(q => {
      if (q.type === 'multiple') {
        answers[q.id] = [];
      } else if (q.type === 'nps') {
        answers[q.id] = '';
      } else if (q.type === 'likert') {
        answers[q.id] = '';
      } else {
        answers[q.id] = '';
      }
    });

    this.setData({ survey, answers });
    this.updateVisibleQuestions();
    this.computeOptionStates();
  },

  updateVisibleQuestions() {
    const { survey, answers } = this.data;
    if (!survey) return;
    const visible = dataService.getVisibleQuestions(survey, answers);
    this.setData({ visibleQuestions: visible });
  },

  computeOptionStates() {
    const { survey, answers } = this.data;
    if (!survey || !survey.questions) return;

    const states = {};
    survey.questions.forEach(q => {
      if (q.type === 'multiple' && q.options) {
        const selected = answers[q.id] || [];
        states[q.id] = q.options.map(opt => ({
          label: opt,
          selected: selected.indexOf(opt) > -1
        }));
      }
    });

    this.setData({ questionOptionsWithState: states });
  },

  onSingleSelect(e) {
    if (this.data.alreadyResponded) return;
    const { qId, value } = e.currentTarget.dataset;
    this.setData({ [`answers.${qId}`]: value });
    this.updateVisibleQuestions();
  },

  onMultipleSelect(e) {
    if (this.data.alreadyResponded) return;
    const { qId, value } = e.currentTarget.dataset;
    const current = this.data.answers[qId] || [];
    const index = current.indexOf(value);

    let newValues;
    if (index > -1) {
      newValues = [...current];
      newValues.splice(index, 1);
    } else {
      newValues = [...current, value];
    }

    this.setData({ [`answers.${qId}`]: newValues });
    this.computeOptionStates();
    this.updateVisibleQuestions();
  },

  onFillInput(e) {
    if (this.data.alreadyResponded) return;
    const { qId } = e.currentTarget.dataset;
    this.setData({ [`answers.${qId}`]: e.detail.value });
  },

  onNpsSelect(e) {
    if (this.data.alreadyResponded) return;
    const { qId, value } = e.currentTarget.dataset;
    this.setData({ [`answers.${qId}`]: String(value) });
    this.updateVisibleQuestions();
  },

  onLikertSelect(e) {
    if (this.data.alreadyResponded) return;
    const { qId, value } = e.currentTarget.dataset;
    this.setData({ [`answers.${qId}`]: String(value) });
    this.updateVisibleQuestions();
  },

  onDateChange(e) {
    if (this.data.alreadyResponded) return;
    const { qId } = e.currentTarget.dataset;
    this.setData({ [`answers.${qId}`]: e.detail.value });
  },

  onTimeChange(e) {
    if (this.data.alreadyResponded) return;
    const { qId } = e.currentTarget.dataset;
    const currentDate = this.data.answers[qId] || '';
    const time = e.detail.value;
    this.setData({ [`answers.${qId}`]: currentDate ? currentDate + ' ' + time : time });
  },

  validateAnswers() {
    const { visibleQuestions, answers } = this.data;
    if (!visibleQuestions) return false;

    for (const q of visibleQuestions) {
      const answer = answers[q.id];
      if (q.type === 'single') {
        if (!answer) {
          util.showToast(`请完成所有题目`);
          return false;
        }
      } else if (q.type === 'multiple') {
        if (!answer || answer.length === 0) {
          util.showToast(`请完成所有题目`);
          return false;
        }
      } else if (q.type === 'fill') {
        if (!answer || !answer.trim()) {
          util.showToast(`请完成所有题目`);
          return false;
        }
      } else if (q.type === 'nps') {
        if (!answer && answer !== '0') {
          util.showToast(`请完成所有题目`);
          return false;
        }
      } else if (q.type === 'likert') {
        if (!answer) {
          util.showToast(`请完成所有题目`);
          return false;
        }
      } else if (q.type === 'date') {
        if (!answer) {
          util.showToast(`请完成所有题目`);
          return false;
        }
      }
    }

    return true;
  },

  async onSubmit() {
    if (this.data.alreadyResponded) {
      util.showToast('您已填写过此问卷');
      return;
    }

    if (!util.checkLogin()) return;

    if (!this.validateAnswers()) return;

    this.setData({ submitting: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const app = getApp();
      const userId = app.globalData.userInfo.account;

      if (dataService.hasUserResponded(this.data.surveyId, userId)) {
        util.showToast('您已填写过此问卷');
        this.setData({ alreadyResponded: true });
        return;
      }

      const answerList = this.data.visibleQuestions.map(q => ({
        questionId: q.id,
        value: this.data.answers[q.id]
      }));

      const result = dataService.submitSurveyResponse(this.data.surveyId, userId, answerList);

      if (result) {
        await util.showSuccess('提交成功');
        wx.redirectTo({
          url: `/pages/survey-result/index?id=${this.data.surveyId}`
        });
      } else {
        util.showError('提交失败');
      }
    } catch (e) {
      util.showError('提交失败');
    } finally {
      this.setData({ submitting: false });
    }
  },

  onViewResult() {
    util.navigateTo(`/pages/survey-result/index?id=${this.data.surveyId}`);
  },

  onShareAppMessage() {
    const { survey, surveyId } = this.data;
    if (survey && survey.status !== 'closed') {
      return {
        title: `【问卷】${survey.title}`,
        path: `/pages/survey-fill/index?id=${surveyId}`,
        imageUrl: ''
      };
    }
    return {
      title: '校园问卷调研',
      path: '/pages/survey-list/index'
    };
  },

  onShareTimeline() {
    const { survey } = this.data;
    if (survey && survey.status !== 'closed') {
      return {
        title: `【问卷】${survey.title}`,
        imageUrl: ''
      };
    }
    return {
      title: '校园问卷调研'
    };
  }
});
