const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

function formatDateInput(timestamp) {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTimeInput(timestamp) {
  if (!timestamp) return '';
  const d = new Date(timestamp);
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function combineDateTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  return new Date(`${dateStr}T${timeStr}:00`).getTime();
}

mixPage({
  data: {
    darkMode: false,
    submitting: false,
    formData: {
      title: '',
      description: '',
      type: 'single',
      visibility: 'anonymous',
      eligibilityType: 'all',
      selectedColleges: [],
      selectedGrades: [],
      maxChoices: 1,
      showRealTimeResult: false,
      startDate: formatDateInput(Date.now()),
      startTime: '08:00',
      endDate: formatDateInput(Date.now() + 7 * 86400000),
      endTime: '20:00',
      candidates: [
        { name: '', description: '', avatar: '' },
        { name: '', description: '', avatar: '' }
      ]
    },
    votingTypes: constants.VOTING_TYPES,
    visibilityOptions: constants.VOTING_VISIBILITY,
    eligibilityTypes: constants.VOTING_ELIGIBILITY_TYPES,
    colleges: constants.COLLEGES,
    grades: constants.GRADES
  },

  onLoad() {},

  onTitleInput(e) {
    this.setData({ 'formData.title': e.detail.value });
  },

  onDescInput(e) {
    this.setData({ 'formData.description': e.detail.value });
  },

  onTypeChange(e) {
    const { value } = e.currentTarget.dataset;
    const updates = { 'formData.type': value };
    if (value === 'single') {
      updates['formData.maxChoices'] = 1;
    }
    this.setData(updates);
  },

  onVisibilityChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ 'formData.visibility': value });
  },

  onEligibilityTypeChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      'formData.eligibilityType': value,
      'formData.selectedColleges': [],
      'formData.selectedGrades': []
    });
  },

  onCollegeToggle(e) {
    const { value } = e.currentTarget.dataset;
    let selected = [...this.data.formData.selectedColleges];
    const idx = selected.indexOf(value);
    if (idx > -1) {
      selected.splice(idx, 1);
    } else {
      selected.push(value);
    }
    this.setData({ 'formData.selectedColleges': selected });
  },

  onGradeToggle(e) {
    const { value } = e.currentTarget.dataset;
    let selected = [...this.data.formData.selectedGrades];
    const idx = selected.indexOf(value);
    if (idx > -1) {
      selected.splice(idx, 1);
    } else {
      selected.push(value);
    }
    this.setData({ 'formData.selectedGrades': selected });
  },

  onMaxChoicesInput(e) {
    const val = parseInt(e.detail.value) || 1;
    this.setData({ 'formData.maxChoices': Math.max(1, val) });
  },

  onShowRealTimeToggle(e) {
    this.setData({ 'formData.showRealTimeResult': e.detail.value });
  },

  onStartDateChange(e) {
    this.setData({ 'formData.startDate': e.detail.value });
  },

  onStartTimeChange(e) {
    this.setData({ 'formData.startTime': e.detail.value });
  },

  onEndDateChange(e) {
    this.setData({ 'formData.endDate': e.detail.value });
  },

  onEndTimeChange(e) {
    this.setData({ 'formData.endTime': e.detail.value });
  },

  onCandidateNameInput(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ [`formData.candidates[${index}].name`]: e.detail.value });
  },

  onCandidateDescInput(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ [`formData.candidates[${index}].description`]: e.detail.value });
  },

  onAddCandidate() {
    const candidates = [...this.data.formData.candidates];
    if (candidates.length >= 20) {
      util.showToast('最多添加20位候选人');
      return;
    }
    candidates.push({ name: '', description: '', avatar: '' });
    this.setData({ 'formData.candidates': candidates });
  },

  onRemoveCandidate(e) {
    const { index } = e.currentTarget.dataset;
    const candidates = [...this.data.formData.candidates];
    if (candidates.length <= 2) {
      util.showToast('至少保留2位候选人');
      return;
    }
    candidates.splice(index, 1);
    this.setData({ 'formData.candidates': candidates });
  },

  validateForm() {
    const { formData } = this.data;

    if (!formData.title.trim()) {
      util.showToast('请输入投票标题');
      return false;
    }

    const startTime = combineDateTime(formData.startDate, formData.startTime);
    const endTime = combineDateTime(formData.endDate, formData.endTime);

    if (!startTime || !endTime) {
      util.showToast('请选择投票时间');
      return false;
    }

    if (endTime <= startTime) {
      util.showToast('结束时间必须晚于开始时间');
      return false;
    }

    if (formData.eligibilityType === 'college' && formData.selectedColleges.length === 0) {
      util.showToast('请选择至少一个学院');
      return false;
    }

    if (formData.eligibilityType === 'grade' && formData.selectedGrades.length === 0) {
      util.showToast('请选择至少一个年级');
      return false;
    }

    const candidates = formData.candidates;
    for (let i = 0; i < candidates.length; i++) {
      if (!candidates[i].name.trim()) {
        util.showToast(`请填写第${i + 1}位候选人名称`);
        return false;
      }
    }

    const names = candidates.map(c => c.name.trim());
    const uniqueNames = new Set(names);
    if (uniqueNames.size !== names.length) {
      util.showToast('候选人名称不能重复');
      return false;
    }

    if (formData.type === 'multiple' && formData.maxChoices > candidates.length) {
      util.showToast(`最多可选人数不能超过候选人数（${candidates.length}）`);
      return false;
    }

    return true;
  },

  async onSubmit() {
    if (!this.validateForm()) return;
    if (!util.checkLogin()) return;

    this.setData({ submitting: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const { formData } = this.data;
      const app = getApp();
      const userInfo = app.globalData.userInfo || {};

      const startTime = combineDateTime(formData.startDate, formData.startTime);
      const endTime = combineDateTime(formData.endDate, formData.endTime);

      let eligibility = { type: formData.eligibilityType };
      if (formData.eligibilityType === 'college') {
        eligibility.colleges = formData.selectedColleges;
      } else if (formData.eligibilityType === 'grade') {
        eligibility.grades = formData.selectedGrades;
      }

      const data = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        visibility: formData.visibility,
        eligibility,
        maxChoices: formData.maxChoices,
        showRealTimeResult: formData.showRealTimeResult,
        startTime,
        endTime,
        creator: userInfo.account || '',
        creatorName: userInfo.nickName || userInfo.name || '匿名发布者',
        candidates: formData.candidates.map(c => ({
          name: c.name.trim(),
          description: c.description.trim(),
          avatar: c.avatar || ''
        }))
      };

      const result = dataService.createVoting(data);

      if (result) {
        await util.showSuccess('创建成功');
        wx.redirectTo({
          url: `/pages/voting/detail/index?id=${result.id}`,
          fail: () => {
            wx.navigateBack({ delta: 1 });
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
  }
});
