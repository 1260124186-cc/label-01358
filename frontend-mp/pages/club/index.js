const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    clubId: '',
    club: null,
    members: [],
    activityList: [],
    activityType: 'all',
    isMember: false,
    memberRole: '',
    isAdmin: false,
    isPresident: false,
    pendingRequestCount: 0
  },

  onLoad(options) {
    this.setData({ clubId: options.id });
    this.loadData();
  },

  onShow() {
    if (this.data.clubId) {
      this.loadData();
    }
  },

  loadData() {
    util.showLoading();
    const app = getApp();
    const userInfo = app.globalData.userInfo || {};
    const userId = userInfo.id || 'test_user';

    const club = dataService.getClubDetail(this.data.clubId);
    if (!club) {
      util.hideLoading();
      util.showToast('社团不存在');
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }

    const typeItem = constants.CLUB_TYPES.find(t => t.value === club.type) || {};
    const members = dataService.getClubMembers(this.data.clubId);
    const activities = dataService.getClubActivities(this.data.clubId, this.data.activityType);
    const formattedActivities = activities.map(item => {
      const categoryItem = constants.CLUB_ACTIVITY_CATEGORIES.find(c => c.value === item.category) || {};
      const statusValue = item.activityStatus || this.computeStatus(item);
      const statusItem = constants.CLUB_ACTIVITY_STATUS.find(s => s.value === statusValue) || {};
      return {
        ...item,
        categoryIcon: categoryItem.icon || '📌',
        categoryLabel: categoryItem.label || '其他',
        categoryColor: categoryItem.color || '#6B7280',
        statusLabel: statusItem.label || '',
        statusColor: statusItem.color || '#6B7280',
        activityTimeText: util.formatTime(item.activityTime, 'MM-DD HH:mm')
      };
    });

    const isMember = dataService.isClubMember(this.data.clubId, userId);
    let memberRole = '';
    if (isMember) {
      const m = members.find(mem => mem.userId === userId);
      memberRole = m ? m.role : 'member';
    }

    const isPresident = dataService.isClubPresident(this.data.clubId, userId);
    const isAdmin = dataService.isClubAdmin(this.data.clubId, userId);
    const pendingRequestCount = isAdmin ? dataService.getPendingJoinRequestCount(this.data.clubId) : 0;

    this.setData({
      club: {
        ...club,
        typeLabel: typeItem.label || '其他',
        typeIcon: typeItem.icon || '🏷',
        createdAtText: util.formatTime(club.createdAt, 'YYYY年MM月DD日')
      },
      members: members.map(m => ({
        ...m,
        roleLabel: this.getRoleLabel(m.role),
        avatarInitial: m.name ? m.name[0] : 'U'
      })),
      activityList: formattedActivities,
      isMember,
      memberRole,
      isPresident,
      isAdmin,
      pendingRequestCount
    });

    util.hideLoading();
  },

  computeStatus(item) {
    const now = Date.now();
    const startMs = new Date(item.activityTime).getTime();
    const endMs = new Date(item.endTime).getTime();
    if (now > endMs) return 'ended';
    if (now >= startMs) return 'ongoing';
    return 'upcoming';
  },

  getRoleLabel(role) {
    const map = {
      president: '社长',
      vicePresident: '副社长',
      director: '干事',
      member: '成员'
    };
    return map[role] || '成员';
  },

  getRoleSort(role) {
    const map = { president: 1, vicePresident: 2, director: 3, member: 4 };
    return map[role] || 9;
  },

  onActivityTypeTap(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({ activityType: type });
    this.loadData();
  },

  onJoinClub() {
    if (!util.checkLogin()) return;
    const app = getApp();
    const userInfo = app.globalData.userInfo || {};
    const memberData = {
      userId: userInfo.id || 'test_user',
      name: userInfo.nickname || '新成员',
      avatar: userInfo.avatar || '',
      role: 'member'
    };
    const result = dataService.joinClub(this.data.clubId, memberData);
    if (result.success) {
      util.showSuccess('加入成功');
      setTimeout(() => this.loadData(), 500);
    } else {
      util.showError(result.message || '加入失败');
    }
  },

  onLeaveClub() {
    if (!util.checkLogin()) return;
    if (this.data.memberRole === 'president') {
      util.showToast('社长不可退出，请先转让职位');
      return;
    }
    util.showModal('退出社团', '确认退出该社团吗？退出后将不再接收社团通知。').then(confirm => {
      if (!confirm) return;
      const app = getApp();
      const userInfo = app.globalData.userInfo || {};
      const result = dataService.leaveClub(this.data.clubId, userInfo.id || 'test_user');
      if (result.success) {
        util.showSuccess('已退出');
        setTimeout(() => this.loadData(), 500);
      } else {
        util.showError(result.message || '退出失败');
      }
    });
  },

  onNavToActivity(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo('/pages/club-activity/detail?id=' + id);
  },

  onPublishActivity() {
    if (!util.checkLogin()) return;
    if (!this.data.isMember) {
      util.showToast('请先加入社团');
      return;
    }
    util.navigateTo('/pages/club-activity/publish?clubId=' + this.data.clubId);
  },

  onManageClub() {
    if (!util.checkLogin()) return;
    if (!this.data.isAdmin) {
      util.showToast('您没有管理权限');
      return;
    }
    util.navigateTo('/pages/club-manage/index?id=' + this.data.clubId);
  },

  onShareAppMessage() {
    return {
      title: this.data.club ? this.data.club.name : '社团',
      path: '/pages/club/index?id=' + this.data.clubId
    };
  }
});
