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
    alreadyResponded: false
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

    if (survey.status === 'closed') {
      util.showToast('该问卷已结束');
      setTimeout(() => {
        wx.redirectTo({ url: `/pages/survey-result/index?id=${id}` });
      }, 1500);
      return;
    }

    const answers = {};
    (survey.questions || []).forEach(q => {
      if (q.type === 'multiple') {
        answers[q.id] = [];
      } else {
        answers[q.id] = '';
      }
    });

    this.setData({ survey, answers });
  },

  onSingleSelect(e) {
    const { qId, value } = e.currentTarget.dataset;
    this.setData({ [`answers.${qId}`]: value });
  },

  onMultipleSelect(e) {
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
  },

  onFillInput(e) {
    const { qId } = e.currentTarget.dataset;
    this.setData({ [`answers.${qId}`]: e.detail.value });
  },

  validateAnswers() {
    const { survey, answers } = this.data;
    if (!survey) return false;

    for (const q of survey.questions) {
      const answer = answers[q.id];
      if (q.type === 'single') {
        if (!answer) {
          util.showToast(`请完成第${survey.questions.indexOf(q) + 1}题`);
          return false;
        }
      } else if (q.type === 'multiple') {
        if (!answer || answer.length === 0) {
          util.showToast(`请完成第${survey.questions.indexOf(q) + 1}题`);
          return false;
        }
      } else if (q.type === 'fill') {
        if (!answer || !answer.trim()) {
          util.showToast(`请完成第${survey.questions.indexOf(q) + 1}题`);
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

      const answerList = this.data.survey.questions.map(q => ({
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
  }
});
