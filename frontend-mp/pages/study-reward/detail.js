const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    id: '',
    detail: null,
    replyContent: '',
    showReplyInput: false,
    isPublisher: false,
    userPoints: 0
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id });
      this.loadDetail();
    }
  },

  onShow() {
    if (this.data.id) {
      this.loadDetail();
    }
    this.loadUserPoints();
  },

  loadUserPoints() {
    const points = dataService.getUserPoints();
    this.setData({ userPoints: points });
  },

  loadDetail() {
    util.showLoading();
    const detail = dataService.getStudyRewardDetail(this.data.id);

    if (detail) {
      const app = getApp();
      const userInfo = app.globalData.userInfo || {};
      const isPublisher = userInfo.id === detail.publisherId;

      const categoryInfo = constants.STUDY_MATERIAL_CATEGORIES.find(c => c.value === detail.category);
      const statusInfo = constants.STUDY_REWARD_STATUS.find(s => s.value === detail.status);

      const formattedResponses = (detail.responses || []).map(r => ({
        ...r,
        timeText: util.relativeTime(r.createTime)
      })).sort((a, b) => {
        if (a.isAdopted) return -1;
        if (b.isAdopted) return 1;
        return b.createTime - a.createTime;
      });

      const formattedDetail = {
        ...detail,
        categoryText: categoryInfo ? categoryInfo.label : detail.category,
        categoryColor: categoryInfo ? categoryInfo.color : '#999',
        categoryIcon: categoryInfo ? categoryInfo.icon : '📚',
        statusText: statusInfo ? statusInfo.label : detail.status,
        statusColor: statusInfo ? statusInfo.color : '#666',
        timeText: util.relativeTime(detail.createTime),
        semesterText: detail.semester ? constants.getLabelByValue(constants.SEMESTER_OPTIONS, detail.semester) : '',
        responses: formattedResponses,
        responseCount: formattedResponses.length
      };

      this.setData({
        detail: formattedDetail,
        isPublisher
      });

      dataService.increaseStudyRewardViews(this.data.id);
      dataService.addHistory(detail, 'study-reward');
    }

    util.hideLoading();
  },

  onReplyInputFocus() {
    if (!util.checkLogin()) {
      return;
    }
    this.setData({ showReplyInput: true });
  },

  onReplyInputBlur() {
    this.setData({ showReplyInput: false });
  },

  onReplyInputChange(e) {
    this.setData({ replyContent: e.detail.value });
  },

  async onSubmitReply() {
    if (!util.checkLogin()) {
      return;
    }

    const content = this.data.replyContent.trim();
    if (!content) {
      util.showToast('请输入回复内容');
      return;
    }

    util.showLoading('提交中...');

    try {
      const result = dataService.addRewardResponse(this.data.id, content);
      if (result) {
        await util.showSuccess('回复成功');
        this.setData({ replyContent: '', showReplyInput: false });
        this.loadDetail();
      } else {
        util.showError('回复失败，请重试');
      }
    } catch (e) {
      util.showError('回复失败，请重试');
    } finally {
      util.hideLoading();
    }
  },

  async onAdoptResponse(e) {
    if (!this.data.isPublisher) {
      util.showToast('只有发布者才能采纳');
      return;
    }

    const { responseId } = e.currentTarget.dataset;
    if (!responseId) return;

    const confirmed = await util.showConfirm('确定采纳此回复吗？采纳后将无法修改。');
    if (!confirmed) return;

    util.showLoading('处理中...');

    try {
      const success = dataService.adoptRewardResponse(this.data.id, responseId);
      if (success) {
        const response = (this.data.detail.responses || []).find(r => r.id === responseId);
        if (response) {
          dataService.grantRewardPoints(response.responderId, this.data.detail.rewardPoints);
        }
        await util.showSuccess(`采纳成功，${this.data.detail.rewardPoints} 积分已发放给 ${response ? response.responderName : '回复者'}`);
        this.loadDetail();
        this.loadUserPoints();
      } else {
        util.showError('操作失败，请重试');
      }
    } catch (e) {
      util.showError('操作失败，请重试');
    } finally {
      util.hideLoading();
    }
  },

  async onCloseReward() {
    if (!this.data.isPublisher) {
      util.showToast('只有发布者才能关闭');
      return;
    }

    const confirmed = await util.showConfirm('确定关闭此悬赏吗？关闭后将无法收到新回复。');
    if (!confirmed) return;

    util.showLoading('处理中...');

    try {
      const result = dataService.closeStudyReward(this.data.id);
      if (result && result.success) {
        if (result.refunded > 0) {
          await util.showSuccess(`已关闭悬赏，${result.refunded} 积分已退还`);
        } else {
          await util.showSuccess('已关闭悬赏');
        }
        this.loadDetail();
        this.loadUserPoints();
      } else {
        util.showError('操作失败，请重试');
      }
    } catch (e) {
      util.showError('操作失败，请重试');
    } finally {
      util.hideLoading();
    }
  },

  onShareAppMessage() {
    const { detail } = this.data;
    return {
      title: detail ? `【悬赏${detail.rewardPoints}积分】${detail.title}` : '悬赏求助',
      path: `/pages/study-reward/detail?id=${this.data.id}`
    };
  }
});
