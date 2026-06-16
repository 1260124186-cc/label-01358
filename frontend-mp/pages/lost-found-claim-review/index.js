const app = getApp();
const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    applicationId: '',
    role: '',
    application: null,
    lostFound: null,
    targetUser: {},
    targetRoleLabel: '',
    reviewTags: [],
    rating: 5,
    selectedTags: [],
    content: '',
    submitting: false
  },

  onLoad(options) {
    const applicationId = options.applicationId || '';
    const role = options.role || 'publisher';

    const reviewTags = constants.CLAIM_REVIEW_TAGS || [];

    let application = null;
    let lostFound = null;
    let targetUser = {};
    let targetRoleLabel = '';

    if (applicationId) {
      application = dataService.getClaimApplicationDetail(applicationId);
      if (application) {
        lostFound = dataService.getLostFoundDetail(application.lostFoundId);

        if (role === 'publisher') {
          targetRoleLabel = '认领者';
          targetUser = {
            id: application.applicantId,
            name: application.applicantName || '同学',
            avatar: application.applicantAvatar || ''
          };
        } else {
          targetRoleLabel = '发布者';
          targetUser = {
            id: lostFound ? lostFound.userId : '',
            name: lostFound ? (lostFound.userName || '同学') : '同学',
            avatar: lostFound ? (lostFound.userAvatar || '') : ''
          };
        }
      }
    }

    this.setData({
      applicationId,
      role,
      application,
      lostFound,
      targetUser,
      targetRoleLabel,
      reviewTags
    });
  },

  onRatingTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ rating: Number(value) });
  },

  onTagTap(e) {
    const { value } = e.currentTarget.dataset;
    const selected = this.data.selectedTags.slice();
    const idx = selected.indexOf(value);
    if (idx > -1) {
      selected.splice(idx, 1);
    } else {
      selected.push(value);
    }
    this.setData({ selectedTags: selected });
  },

  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },

  async onSubmit() {
    if (this.data.submitting) return;

    const { applicationId, role, application, lostFound, targetUser, rating, selectedTags, content } = this.data;

    if (!applicationId || !application) {
      util.showError('认领信息不存在');
      return;
    }

    if (rating <= 0) {
      util.showToast('请选择评分');
      return;
    }

    const reviewData = {
      applicationId,
      lostFoundId: application.lostFoundId,
      targetUserId: targetUser.id,
      rating,
      tags: selectedTags,
      comment: content,
      role
    };

    this.setData({ submitting: true });
    util.showLoading('提交中...');

    try {
      const result = dataService.createClaimReview(reviewData);
      util.hideLoading();

      if (result) {
        let creditTip = '';
        if (rating <= 2) {
          creditTip = `，对方信用分 ${constants.CLAIM_CREDIT_CONFIG.NEGATIVE_REVIEW} 分`;
        }

        await util.showSuccess('评价完成' + creditTip);
        setTimeout(() => {
          util.navigateBack();
        }, 1500);
      } else {
        util.showError('提交失败，请重试');
      }
    } catch (e) {
      util.hideLoading();
      util.showError('提交失败，请重试');
    } finally {
      this.setData({ submitting: false });
    }
  }
});
