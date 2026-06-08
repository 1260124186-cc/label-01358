const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    formData: {
      title: '',
      category: '',
      courseName: '',
      teacher: '',
      semester: '',
      description: '',
      rewardPoints: 50
    },
    categories: constants.STUDY_MATERIAL_CATEGORIES,
    semesters: constants.SEMESTER_OPTIONS,
    pointsOptions: constants.REWARD_POINTS_OPTIONS,
    categoryIndex: -1,
    semesterIndex: -1,
    pointsIndex: 2,
    submitting: false,
    userPoints: 0
  },

  onLoad() {
    const points = dataService.getUserPoints();
    this.setData({ userPoints: points });
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  onCategoryChange(e) {
    const index = e.detail.value;
    const item = this.data.categories[index];
    this.setData({
      categoryIndex: index,
      'formData.category': item.value
    });
  },

  onSemesterChange(e) {
    const index = e.detail.value;
    const item = this.data.semesters[index];
    this.setData({
      semesterIndex: index,
      'formData.semester': item.value
    });
  },

  onPointsChange(e) {
    const index = e.detail.value;
    const points = this.data.pointsOptions[index];
    this.setData({
      pointsIndex: index,
      'formData.rewardPoints': points
    });
  },

  onPointsQuickSelect(e) {
    const { points } = e.currentTarget.dataset;
    const index = this.data.pointsOptions.indexOf(points);
    if (index >= 0) {
      this.setData({
        pointsIndex: index,
        'formData.rewardPoints': points
      });
    }
  },

  validateForm() {
    const { formData, userPoints } = this.data;

    if (!formData.title.trim()) {
      util.showToast('请输入悬赏标题');
      return false;
    }

    if (!formData.category) {
      util.showToast('请选择资料分类');
      return false;
    }

    if (!formData.description.trim()) {
      util.showToast('请输入需求描述');
      return false;
    }

    if (formData.rewardPoints <= 0) {
      util.showToast('请设置悬赏积分');
      return false;
    }

    if (formData.rewardPoints > userPoints) {
      util.showToast(`积分不足，当前积分：${userPoints}`);
      return false;
    }

    return true;
  },

  async onSubmit() {
    if (!this.validateForm()) return;

    this.setData({ submitting: true });
    util.showLoading('发布中...');

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const data = {
        ...this.data.formData
      };

      const result = dataService.publishStudyReward(data);

      if (result) {
        dataService.updateUserPoints(this.data.formData.rewardPoints * -1);
        await util.showSuccess(`发布成功，已冻结 ${this.data.formData.rewardPoints} 积分`);
        wx.navigateBack({
          delta: 1,
          fail: () => {
            util.navigateTo('/pages/study-materials/index?tab=rewards');
          }
        });
      } else {
        util.showError('发布失败，请重试');
      }
    } catch (e) {
      util.showError('发布失败，请重试');
    } finally {
      this.setData({ submitting: false });
      util.hideLoading();
    }
  }
});
