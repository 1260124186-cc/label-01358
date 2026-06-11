const app = getApp();
const util = require('../../utils/util');
const userService = require('../../services/userService');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    userId: '',
    isCurrentUser: false,
    userInfo: null,
    userStats: null,
    publications: {
      lostFound: [],
      market: [],
      forum: [],
      scenery: []
    },
    activeTab: 'all',
    tabs: [
      { value: 'all', label: '全部' },
      { value: 'lostFound', label: '失物招领' },
      { value: 'market', label: '二手市场' },
      { value: 'forum', label: '论坛' },
      { value: 'scenery', label: '校园风景' }
    ],
    loading: false,
    isBlacklisted: false,
    showActionSheet: false,
    actionSheetItems: [
      { label: '举报用户', value: 'report' },
      { label: '加入黑名单', value: 'blacklist' }
    ]
  },

  onLoad(options) {
    const { userId } = options;
    const currentUser = app.globalData.userInfo || {};
    const isCurrentUser = !userId || userId === currentUser.id;

    this.setData({
      userId: userId || currentUser.id || '',
      isCurrentUser
    });

    this.loadUserData();
  },

  onShow() {
    if (this.data.userId) {
      this.loadUserData();
    }
  },

  loadUserData() {
    const { userId, isCurrentUser } = this.data;
    const currentUser = app.globalData.userInfo || {};

    this.setData({ loading: true });

    try {
      let userInfo;
      if (isCurrentUser) {
        userInfo = currentUser;
      } else {
        userInfo = userService.getUserById(userId);
        if (userInfo) {
          userInfo = userService.sanitizeUserInfo(userInfo);
        }
      }

      if (!userInfo) {
        util.showError('用户不存在');
        this.setData({ loading: false });
        return;
      }

      const userStats = userService.getUserStats(userId || currentUser.id);
      const publications = userService.getUserPublications(userId || currentUser.id);

      // 预处理时间格式
      const formattedPublications = {
        lostFound: publications.lostFound.map(item => ({
          ...item,
          timeText: util.relativeTime(item.createTime)
        })),
        market: publications.market.map(item => ({
          ...item,
          timeText: util.relativeTime(item.createTime)
        })),
        forum: publications.forum.map(item => ({
          ...item,
          timeText: util.relativeTime(item.createTime)
        })),
        scenery: publications.scenery.map(item => ({
          ...item,
          timeText: util.relativeTime(item.createTime)
        }))
      };

      const isBlacklisted = userService.isInBlacklist(currentUser.id || '', userId);

      this.setData({
        userInfo,
        userStats,
        publications: formattedPublications,
        isBlacklisted,
        loading: false
      });

      if (!isCurrentUser && userInfo.id !== currentUser.id) {
        const actionSheetItems = [
          { label: '举报用户', value: 'report' },
          { label: isBlacklisted ? '移出黑名单' : '加入黑名单', value: 'blacklist' }
        ];
        this.setData({ actionSheetItems });
      }
    } catch (e) {
      console.error('加载用户数据失败:', e);
      util.showError('加载失败');
      this.setData({ loading: false });
    }
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ activeTab: value });
  },

  onAvatarTap() {
    if (this.data.isCurrentUser) {
      util.navigateTo('/pages/profile-edit/index');
    }
  },

  onMoreTap() {
    if (!this.data.isCurrentUser) {
      this.setData({ showActionSheet: true });
    }
  },

  onActionSelect(e) {
    const { value } = e.detail;
    const { userInfo, isBlacklisted } = this.data;
    const currentUser = app.globalData.userInfo || {};

    if (value === 'report') {
      util.navigateTo(`/pages/report/index?targetType=user&targetId=${userInfo.id}&targetUserId=${userInfo.id}`);
    } else if (value === 'blacklist') {
      if (isBlacklisted) {
        const result = userService.removeFromBlacklist(currentUser.id, userInfo.id);
        if (result.success) {
          util.showSuccess(result.message);
          this.setData({ isBlacklisted: false });
        } else {
          util.showError(result.message);
        }
      } else {
        const result = userService.addToBlacklist(currentUser.id, userInfo.id, userInfo.nickName);
        if (result.success) {
          util.showSuccess(result.message);
          this.setData({ isBlacklisted: true });
        } else {
          util.showError(result.message);
        }
      }
    }

    this.setData({ showActionSheet: false });
  },

  onActionClose() {
    this.setData({ showActionSheet: false });
  },

  onItemTap(e) {
    const { type, id } = e.currentTarget.dataset;
    let url = '';

    switch (type) {
      case 'lostFound':
        url = `/pages/lost-found-detail/index?id=${id}`;
        break;
      case 'market':
        url = `/pages/market-detail/index?id=${id}`;
        break;
      case 'forum':
        url = `/pages/forum/detail/index?id=${id}`;
        break;
      case 'scenery':
        url = `/pages/scenery-detail/index?id=${id}`;
        break;
    }

    if (url) {
      util.navigateTo(url);
    }
  },

  onEditProfile() {
    util.navigateTo('/pages/profile-edit/index');
  },

  onVerifyIdentity() {
    util.navigateTo('/pages/real-name-verify/index');
  },

  onCreditDetail() {
    const { userId } = this.data;
    util.navigateTo(`/pages/credit-history/index?userId=${userId}`);
  },

  getRelativeTime(time) {
    return util.relativeTime(time);
  }
});
