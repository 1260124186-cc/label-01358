const dataService = require('../../../services/data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    votingId: '',
    voting: null,
    statusInfo: {},
    loading: true,
    selectedCandidates: [],
    submitting: false,
    hasVoted: false,
    userRecord: null,
    eligibilityInfo: null,
    startTimeText: '',
    endTimeText: '',
    countDownText: '',
    countDownTimer: null,
    isOwner: false
  },

  onLoad(options) {
    this.setData({ votingId: options.id || '' });
    this.loadDetail();
  },

  onUnload() {
    if (this.data.countDownTimer) {
      clearInterval(this.data.countDownTimer);
    }
  },

  onPullDownRefresh() {
    this.loadDetail().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadDetail() {
    const { votingId } = this.data;
    if (!votingId) {
      util.showError('参数错误');
      return Promise.resolve();
    }

    this.setData({ loading: true });

    return new Promise((resolve) => {
      const voting = dataService.getVotingDetail(votingId);
      const app = getApp();
      const userInfo = app.globalData.userInfo || null;
      const userId = userInfo ? userInfo.account : '';

      if (!voting) {
        this.setData({ loading: false, voting: null });
        util.showError('投票不存在');
        resolve();
        return;
      }

      const hasVoted = userId ? dataService.hasUserVoted(votingId, userId) : false;
      const rawUserRecord = hasVoted ? dataService.getUserVotingRecord(votingId, userId) : null;
      const userRecord = rawUserRecord ? { ...rawUserRecord, createTimeText: util.formatTime(rawUserRecord.createTime) } : null;
      const eligibilityInfo = userId ? dataService.checkVotingEligibility(voting, userInfo) : { eligible: false, reason: '请先登录' };
      const statusInfo = constants.VOTING_STATUS_MAP[voting.status] || {};

      const startTimeText = util.formatTime(voting.startTime);
      const endTimeText = util.formatTime(voting.endTime);

      this.setData({
        voting,
        statusInfo,
        hasVoted,
        userRecord,
        eligibilityInfo,
        startTimeText,
        endTimeText,
        isOwner: voting.creator === userId,
        loading: false
      });

      this.startCountDown();
      resolve();
    });
  },

  startCountDown() {
    if (this.data.countDownTimer) {
      clearInterval(this.data.countDownTimer);
    }
    this.updateCountDown();
    const timer = setInterval(() => {
      this.updateCountDown();
    }, 1000);
    this.setData({ countDownTimer: timer });
  },

  updateCountDown() {
    const { voting } = this.data;
    if (!voting) return;

    const now = Date.now();
    let text = '';

    if (voting.status === 'pending' && voting.startTime) {
      const diff = voting.startTime - now;
      if (diff > 0) {
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        if (days > 0) text = `距开始 ${days}天${hours}时${minutes}分`;
        else if (hours > 0) text = `距开始 ${hours}时${minutes}分${seconds}秒`;
        else text = `距开始 ${minutes}分${seconds}秒`;
      } else {
        this.loadDetail();
      }
    } else if (voting.status === 'active' && voting.endTime) {
      const diff = voting.endTime - now;
      if (diff > 0) {
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        if (days > 0) text = `距结束 ${days}天${hours}时${minutes}分`;
        else if (hours > 0) text = `距结束 ${hours}时${minutes}分${seconds}秒`;
        else text = `距结束 ${minutes}分${seconds}秒`;
      } else {
        this.loadDetail();
      }
    }

    this.setData({ countDownText: text });
  },

  onCandidateTap(e) {
    const { id } = e.currentTarget.dataset;
    const { voting, selectedCandidates } = this.data;

    if (this.data.hasVoted || voting.status !== 'active') return;
    if (!this.data.eligibilityInfo || !this.data.eligibilityInfo.eligible) return;

    let newSelected = [...selectedCandidates];
    const idx = newSelected.indexOf(id);

    if (voting.type === 'single') {
      newSelected = idx > -1 ? [] : [id];
    } else {
      if (idx > -1) {
        newSelected.splice(idx, 1);
      } else {
        const maxChoices = voting.maxChoices || (voting.candidates || []).length;
        if (newSelected.length >= maxChoices) {
          util.showToast(`最多选择 ${maxChoices} 位`);
          return;
        }
        newSelected.push(id);
      }
    }

    this.setData({ selectedCandidates: newSelected });
  },

  async onSubmitVote() {
    if (!util.checkLogin()) return;
    if (this.data.selectedCandidates.length === 0) {
      util.showToast('请选择候选人');
      return;
    }

    wx.showModal({
      title: '确认投票',
      content: `您已选择 ${this.data.selectedCandidates.length} 位候选人，投票后不可修改，确认提交？`,
      confirmColor: '#FF6B6B',
      success: (res) => {
        if (res.confirm) {
          this.doSubmitVote();
        }
      }
    });
  },

  async doSubmitVote() {
    this.setData({ submitting: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const app = getApp();
      const userInfo = app.globalData.userInfo || {};
      const userId = userInfo.account || '';
      const userName = userInfo.nickName || userInfo.name || userId;

      const result = dataService.submitVote(
        this.data.votingId,
        userId,
        userName,
        this.data.selectedCandidates
      );

      if (result.success) {
        await util.showSuccess('投票成功');
        this.loadDetail();
      } else {
        util.showError(result.message || '投票失败');
      }
    } catch (e) {
      util.showError('投票失败');
    } finally {
      this.setData({ submitting: false });
    }
  },

  onViewResult() {
    util.navigateTo(`/pages/voting/result/index?id=${this.data.votingId}`);
  },

  onPublishResult() {
    wx.showModal({
      title: '公示结果',
      content: '公示后所有人均可查看详细投票结果，确认公示？',
      confirmColor: '#8B5CF6',
      success: (res) => {
        if (res.confirm) {
          const result = dataService.publishVotingResult(this.data.votingId);
          if (result) {
            util.showSuccess('已公示');
            this.loadDetail();
          } else {
            util.showError('操作失败');
          }
        }
      }
    });
  }
});
