const dataService = require('../../services/data');
const matcherService = require('../../services/lostFoundMatcher');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const fileUtil = require('../../utils/file');
const { mixPage } = require('../../utils/withTheme');

function getMatchLevelInfo(level) {
  const levels = {
    excellent: { label: '极高度匹配', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
    high: { label: '高度匹配', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
    medium: { label: '中度匹配', color: '#6366F1', bgColor: 'rgba(99, 102, 241, 0.1)' },
    low: { label: '低度匹配', color: '#9CA3AF', bgColor: 'rgba(156, 163, 175, 0.1)' }
  };
  return levels[level] || levels.low;
}

mixPage({
  data: {
    darkMode: false,
    id: '',
    detail: null,
    isFavorite: false,
    locationPOI: null,
    isPublisher: false,
    statusInfo: null,
    maskedPhone: '',
    relatedMatches: [],
    hasRelatedMatches: false,
    myClaimApplication: null,
    pendingClaimCount: 0,
    verifiedApplication: null,
    needReviewPublisher: false,
    needReviewClaimant: false,
    currentUserCreditScore: null
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id });
      this.loadDetail();
    }
  },

  onShow() {
    if (this.data.id) {
      this.checkFavorite();
      this.checkIsPublisher();
    }
  },

  checkIsPublisher() {
    const app = getApp();
    const userInfo = app.globalData.userInfo;
    const { detail } = this.data;
    if (detail && userInfo) {
      this.setData({ isPublisher: detail.userId === userInfo.id });
    }
  },

  loadDetail() {
    const detail = dataService.getLostFoundDetail(this.data.id);

    if (detail) {
      const statusInfo = constants.LOST_FOUND_STATUS_MAP[detail.status] || constants.LOST_FOUND_STATUS_MAP.active;
      const isClosed = detail.status === 'claimed' || detail.status === 'returned' || detail.status === 'closed' || detail.status === 'resolved';

      const formattedDetail = {
        ...detail,
        timeText: util.relativeTime(detail.createTime),
        itemTypeText: constants.getLabelByValue(constants.ITEM_TYPES, detail.itemType),
        locationText: constants.getLabelByValue(constants.LOCATIONS, detail.location) || detail.location,
        isClosed
      };

      this.setData({
        detail: formattedDetail,
        statusInfo,
        maskedPhone: util.maskPhone(detail.phone)
      });

      this.checkIsPublisher();

      // 加载关联的 POI 信息
      this.loadLocationPOI(detail);

      // 加载相关匹配推荐
      this.loadRelatedMatches(detail);

      // 添加到浏览历史
      dataService.addHistory(detail, 'lostFound');

      // 检查收藏状态
      this.checkFavorite();

      // 加载认领相关数据
      this.loadClaimData();
    }
  },

  loadClaimData() {
    const app = getApp();
    const userInfo = app.globalData.userInfo;
    if (!userInfo) return;

    const { id, detail } = this.data;

    // 加载待审核的认领申请数量（发布者视角）
    const pendingApplications = dataService.getClaimApplicationsByLostFound(id, 'pending');
    this.setData({ pendingClaimCount: pendingApplications.length });

    // 加载当前用户的认领申请（认领人视角）
    const myApplications = dataService.getClaimApplicationsByApplicant(userInfo.id);
    const myAppForThis = myApplications.find(app => app.lostFoundId === id);
    if (myAppForThis) {
      const formattedApp = {
        ...myAppForThis,
        statusInfo: constants.CLAIM_APPLICATION_STATUS_MAP[myAppForThis.status],
        timeText: util.relativeTime(myAppForThis.createTime),
        reviewTimeText: myAppForThis.reviewTime ? util.relativeTime(myAppForThis.reviewTime) : ''
      };
      this.setData({ myClaimApplication: formattedApp });
    }

    // 加载已核验完成的申请（用于互评入口）
    const verifiedApps = dataService.getClaimApplicationsByLostFound(id, 'verified');
    if (verifiedApps.length > 0) {
      const verifiedApp = verifiedApps[0];
      const formattedVerified = {
        ...verifiedApp,
        statusInfo: constants.CLAIM_APPLICATION_STATUS_MAP[verifiedApp.status],
        verifiedTimeText: util.relativeTime(verifiedApp.verifiedTime)
      };
      this.setData({ verifiedApplication: formattedVerified });

      // 检查互评状态
      const publisherReviewed = dataService.hasUserReviewed(verifiedApp.id, detail.userId);
      const claimantReviewed = dataService.hasUserReviewed(verifiedApp.id, verifiedApp.applicantId);

      if (detail.userId === userInfo.id && !publisherReviewed) {
        this.setData({ needReviewPublisher: true });
      }
      if (verifiedApp.applicantId === userInfo.id && !claimantReviewed) {
        this.setData({ needReviewClaimant: true });
      }
    }

    // 加载当前用户信用分
    const creditScore = dataService.getUserCreditScore(userInfo.id);
    this.setData({ currentUserCreditScore: creditScore });
  },

  loadRelatedMatches(item) {
    try {
      const result = matcherService.findMatchesForItem(item, {
        minScore: 40,
        limit: 5
      });

      const formattedMatches = result.matches.map(match => {
        const levelInfo = getMatchLevelInfo(match.matchLevel);
        return {
          ...match,
          levelInfo,
          item: {
            ...match.item,
            timeText: util.relativeTime(match.item.createTime),
            itemTypeText: constants.getLabelByValue(constants.ITEM_TYPES, match.item.itemType),
            locationText: constants.getLabelByValue(constants.LOCATIONS, match.item.location)
          }
        };
      });

      this.setData({
        relatedMatches: formattedMatches,
        hasRelatedMatches: formattedMatches.length > 0
      });
    } catch (e) {
      // ignore
    }
  },

  loadLocationPOI(detail) {
    let locationPOI = null;

    // 优先根据 POI ID 查找
    if (detail.locationPOIId) {
      locationPOI = dataService.getPOIDetail(detail.locationPOIId);
    }

    // 如果没有 POI ID，尝试根据地点名称匹配
    if (!locationPOI && detail.location) {
      const allPOIs = dataService.getPOIList();
      locationPOI = allPOIs.find(poi =>
        poi.name === detail.location ||
        poi.name.includes(detail.location) ||
        detail.location.includes(poi.name)
      );
    }

    if (locationPOI) {
      const categoryInfo = constants.POI_CATEGORY_MAP[locationPOI.category] || {};
      locationPOI = {
        ...locationPOI,
        categoryLabel: categoryInfo.label || '其他',
        categoryIcon: categoryInfo.icon || '📍',
        categoryColor: categoryInfo.color || '#6B7280'
      };
    }

    this.setData({ locationPOI });
  },

  onLocateOnMap(e) {
    const { poiId, location } = e.currentTarget.dataset;

    if (poiId) {
      util.navigateTo(`/pages/campus-map/index?poiId=${poiId}&action=focus`);
    } else if (location) {
      // 尝试根据地点名称查找 POI
      const allPOIs = dataService.getPOIList();
      const matchedPOI = allPOIs.find(poi =>
        poi.name === location ||
        poi.name.includes(location) ||
        location.includes(poi.name)
      );

      if (matchedPOI) {
        util.navigateTo(`/pages/campus-map/index?poiId=${matchedPOI.id}&action=focus`);
      } else {
        util.showToast('未找到对应地点');
      }
    }
  },

  onViewPOIDetail(e) {
    const { poiId } = e.currentTarget.dataset;
    if (poiId) {
      util.navigateTo(`/pages/poi-detail/index?id=${poiId}`);
    }
  },

  checkFavorite() {
    const isFavorite = dataService.isFavorite(this.data.id, 'lostFound');
    this.setData({ isFavorite });
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    const urls = this.data.detail.images;
    fileUtil.previewImage(urls, urls[index]);
  },

  onToggleFavorite() {
    // 检查登录状态
    if (!util.checkLogin()) {
      return;
    }

    const { id, isFavorite, detail } = this.data;

    if (isFavorite) {
      dataService.removeFavorite(id, 'lostFound');
      this.setData({ isFavorite: false });
      util.showSuccess('已取消收藏');
    } else {
      dataService.addFavorite(detail, 'lostFound');
      this.setData({ isFavorite: true });
      util.showSuccess('收藏成功');
    }
  },

  onCallPhone() {
    // 检查登录状态
    if (!util.checkLogin()) {
      return;
    }

    const { phone } = this.data.detail;
    wx.makePhoneCall({
      phoneNumber: phone,
      fail: () => {
        // 用户取消或失败
      }
    });
  },

  onReport() {
    // 检查登录状态
    if (!util.checkLogin()) {
      return;
    }

    const { id } = this.data;
    util.navigateTo(`/pages/report/index?targetType=lostFound&targetId=${id}`);
  },

  onCloseLostFound() {
    if (!util.checkLogin()) {
      return;
    }

    const { detail, isPublisher } = this.data;
    if (!isPublisher) {
      util.showError('只有发布者才能关闭信息');
      return;
    }

    const typeText = detail.type === 'lost' ? '已找回' : '已认领';
    wx.showModal({
      title: '确认关闭',
      content: `确认标记为"${typeText}"并关闭此信息吗？关闭后他人将无法联系您。`,
      confirmText: '确认关闭',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          const newStatus = detail.type === 'lost' ? 'returned' : 'claimed';
          const success = dataService.updateLostFound(detail.id, {
            status: newStatus
          });

          if (success) {
            const statusInfo = constants.LOST_FOUND_STATUS_MAP[newStatus];
            this.setData({
              'detail.status': newStatus,
              'detail.isClosed': true,
              statusInfo
            });
            util.showSuccess(`已标记为${typeText}`);
          } else {
            util.showError('关闭失败，请重试');
          }
        }
      }
    });
  },

  onMatchItemTap(e) {
    const { item } = e.currentTarget.dataset;
    this.goToDetail(`/pages/lost-found-detail/index?id=${item.id}`);
  },

  onCompare(e) {
    const { match } = e.currentTarget.dataset;
    const { detail } = this.data;

    const lostId = detail.type === 'lost' ? detail.id : match.item.id;
    const foundId = detail.type === 'found' ? detail.id : match.item.id;

    util.navigateTo(`/pages/lost-found-compare/index?lostId=${lostId}&foundId=${foundId}`);
  },

  goToMatchCenter() {
    util.navigateTo('/pages/lost-found-match/index');
  },

  onApplyClaim() {
    if (!util.checkLogin()) {
      return;
    }
    const { id, isPublisher } = this.data;
    if (isPublisher) {
      util.showToast('不能认领自己发布的信息');
      return;
    }
    util.navigateTo(`/pages/lost-found-claim-apply/index?id=${id}`);
  },

  onManageClaims() {
    if (!util.checkLogin()) {
      return;
    }
    const { id } = this.data;
    util.navigateTo(`/pages/lost-found-claim-manage/index?id=${id}`);
  },

  onViewVerifyCode() {
    if (!util.checkLogin()) {
      return;
    }
    const { myClaimApplication } = this.data;
    if (myClaimApplication && (myClaimApplication.status === 'approved' || myClaimApplication.status === 'verified')) {
      util.navigateTo(`/pages/lost-found-verify-code/index?applicationId=${myClaimApplication.id}`);
    }
  },

  onViewMyApplication() {
    const { myClaimApplication } = this.data;
    if (myClaimApplication) {
      wx.showModal({
        title: '我的认领申请',
        content: `申请状态：${myClaimApplication.statusInfo.label}\n提交时间：${myClaimApplication.timeText}\n${myClaimApplication.reviewNote ? `审核备注：${myClaimApplication.reviewNote}` : ''}`,
        showCancel: myClaimApplication.status === 'approved',
        cancelText: '查看核验码',
        confirmText: '我知道了',
        success: (res) => {
          if (res.cancel && myClaimApplication.status === 'approved') {
            this.onViewVerifyCode();
          }
        }
      });
    }
  },

  onReviewClaimant() {
    if (!util.checkLogin()) {
      return;
    }
    const { verifiedApplication } = this.data;
    if (verifiedApplication) {
      util.navigateTo(`/pages/lost-found-claim-review/index?applicationId=${verifiedApplication.id}&role=publisher`);
    }
  },

  onReviewPublisher() {
    if (!util.checkLogin()) {
      return;
    }
    const { verifiedApplication } = this.data;
    if (verifiedApplication) {
      util.navigateTo(`/pages/lost-found-claim-review/index?applicationId=${verifiedApplication.id}&role=claimant`);
    }
  },

  onViewCreditScore() {
    util.navigateTo('/pages/credit-history/index');
  }
});
