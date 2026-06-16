const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    applicationId: '',
    verifyCode: '',
    verifyCodeDigits: [],
    expireAt: 0,
    remainingTimeText: '',
    isExpired: false,
    application: null,
    lostFound: null,
    isPublisher: false,
    isVerified: false,
    statusInfo: null,
    itemTypeText: '',
    locationText: '',
    typeText: '',
    maskedPhone: ''
  },

  onLoad(options) {
    if (options.applicationId) {
      this.setData({ applicationId: options.applicationId });
      this.loadData();
    } else {
      util.showError('参数错误');
    }
  },

  onUnload() {
    this.stopCountdown();
  },

  loadData() {
    const { applicationId } = this.data;
    const application = dataService.getClaimApplicationDetail(applicationId);

    if (!application) {
      util.showError('核验信息不存在');
      return;
    }

    const app = getApp();
    const userInfo = app.globalData.userInfo || {};
    const isPublisher = this.checkIsPublisher(application, userInfo);

    if (application.status === 'verified') {
      this.setData({ isVerified: true });
    }

    const lostFound = dataService.getLostFoundDetail(application.lostFoundId);
    const statusInfo = constants.CLAIM_APPLICATION_STATUS_MAP[application.status] || constants.CLAIM_APPLICATION_STATUS_MAP.pending;
    const itemTypeText = constants.getLabelByValue(constants.ITEM_TYPES, lostFound?.itemType) || '';
    const locationText = constants.getLabelByValue(constants.LOCATIONS, lostFound?.location) || lostFound?.location || '';
    const typeText = application.lostFoundType === 'lost' ? '寻物启事' : '失物招领';
    const maskedPhone = lostFound?.phone ? util.maskPhone(lostFound.phone) : '';

    this.setData({
      application,
      lostFound,
      isPublisher,
      statusInfo,
      itemTypeText,
      locationText,
      typeText,
      maskedPhone
    });

    this.loadVerifyCode();
  },

  checkIsPublisher(application, userInfo) {
    if (!application || !userInfo) return false;
    const lostFound = dataService.getLostFoundDetail(application.lostFoundId);
    if (!lostFound) return false;
    return lostFound.userId === userInfo.id;
  },

  loadVerifyCode() {
    const { applicationId } = this.data;
    const verifyData = dataService.getVerifyCodeByApplication(applicationId);

    if (!verifyData) {
      util.showError('核验码获取失败');
      return;
    }

    const { code, expireAt } = verifyData;
    const verifyCodeDigits = code.split('');

    this.setData({
      verifyCode: code,
      verifyCodeDigits,
      expireAt,
      isExpired: false
    });

    this.startCountdown();
  },

  startCountdown() {
    this.stopCountdown();
    this.updateCountdown();
    this._countdownTimer = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  },

  stopCountdown() {
    if (this._countdownTimer) {
      clearInterval(this._countdownTimer);
      this._countdownTimer = null;
    }
  },

  updateCountdown() {
    const { expireAt } = this.data;
    const now = Date.now();
    const remaining = expireAt - now;

    if (remaining <= 0) {
      this.stopCountdown();
      this.setData({
        remainingTimeText: '已过期',
        isExpired: true
      });
      return;
    }

    const totalSeconds = Math.floor(remaining / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const remainingTimeText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    this.setData({ remainingTimeText });
  },

  onRegenerateCode() {
    if (!util.checkLogin()) return;

    wx.showModal({
      title: '重新生成核验码',
      content: '确认重新生成核验码吗？新的核验码将重新计时15分钟。',
      confirmText: '确认生成',
      confirmColor: '#FF6B6B',
      success: (res) => {
        if (res.confirm) {
          const { applicationId } = this.data;
          const application = dataService.getClaimApplicationDetail(applicationId);
          if (application) {
            dataService.reviewClaimApplication(applicationId, 'approve', '');
          }
          this.loadVerifyCode();
          util.showSuccess('核验码已重新生成');
        }
      }
    });
  },

  onCompleteVerification() {
    if (!util.checkLogin()) return;

    const { applicationId, isPublisher, application } = this.data;

    if (!isPublisher) {
      util.showError('只有发布者才能确认核验');
      return;
    }

    wx.showModal({
      title: '确认核验完成',
      content: `请确认已与认领人完成物品交接，核验码「${this.data.verifyCode}」核对无误。此操作不可撤销。`,
      confirmText: '确认完成',
      confirmColor: '#10B981',
      success: (res) => {
        if (res.confirm) {
          const result = dataService.completeClaimVerification(applicationId);
          if (result) {
            this.setData({
              isVerified: true,
              'application.status': 'verified',
              statusInfo: constants.CLAIM_APPLICATION_STATUS_MAP.verified
            });
            this.stopCountdown();
            util.showSuccess('核验完成');
            setTimeout(() => {
              util.navigateBack();
            }, 1500);
          } else {
            util.showError('核验失败，请重试');
          }
        }
      }
    });
  },

  onCopyCode() {
    const { verifyCode } = this.data;
    wx.setClipboardData({
      data: verifyCode,
      success: () => {
        util.showSuccess('核验码已复制');
      }
    });
  }
});
