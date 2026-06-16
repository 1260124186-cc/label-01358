const dataService = require('../../services/data');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    clubId: '',
    club: null,
    pendingCount: 0,
    stats: {
      memberCount: 0,
      activityCount: 0,
      announcementCount: 0
    },
    modules: []
  },

  onLoad(options) {
    this.setData({ clubId: options.id });
    this.initModules();
    this.loadData();
  },

  onShow() {
    if (this.data.clubId) {
      this.loadData();
    }
  },

  initModules() {
    const modules = [
      {
        id: 'join-requests',
        name: '入社申请',
        desc: '审核新成员入社申请',
        icon: '📝',
        color: '#3B82F6',
        path: '/pages/club-manage/join-requests'
      },
      {
        id: 'members',
        name: '成员管理',
        desc: '管理社团成员及角色',
        icon: '👥',
        color: '#10B981',
        path: '/pages/club-manage/members'
      },
      {
        id: 'edit',
        name: '社团信息',
        desc: '编辑社团简介和封面',
        icon: '✏️',
        color: '#F59E0B',
        path: '/pages/club-manage/edit'
      },
      {
        id: 'activities',
        name: '活动管理',
        desc: '查看活动报名及签到',
        icon: '📅',
        color: '#8B5CF6',
        path: '/pages/club-manage/activities'
      },
      {
        id: 'announcement',
        name: '社团公告',
        desc: '发布社团通知公告',
        icon: '📢',
        color: '#EF4444',
        path: '/pages/club-manage/announcement'
      },
      {
        id: 'stats',
        name: '数据看板',
        desc: '社团运营数据统计',
        icon: '📊',
        color: '#06B6D4',
        path: '/pages/club-manage/stats'
      }
    ];
    this.setData({ modules });
  },

  loadData() {
    util.showLoading();
    const club = dataService.getClubDetail(this.data.clubId);
    if (!club) {
      util.hideLoading();
      util.showToast('社团不存在');
      setTimeout(() => wx.navigateBack(), 800);
      return;
    }

    const pendingCount = dataService.getPendingJoinRequestCount(this.data.clubId);
    const members = dataService.getClubMembers(this.data.clubId);
    const activities = dataService.getClubActivities(this.data.clubId);
    const announcements = dataService.getClubAnnouncements(this.data.clubId);

    const stats = {
      memberCount: members.length,
      activityCount: activities.length,
      announcementCount: announcements.length
    };

    const modules = this.data.modules.map(m => {
      if (m.id === 'join-requests') {
        return { ...m, badge: pendingCount > 0 ? pendingCount : 0 };
      }
      return m;
    });

    this.setData({
      club,
      pendingCount,
      stats,
      modules
    });
    util.hideLoading();
  },

  onModuleTap(e) {
    const { id } = e.currentTarget.dataset;
    const module = this.data.modules.find(m => m.id === id);
    if (module) {
      if (module.id === 'activities') {
        wx.navigateTo({
          url: `${module.path}?clubId=${this.data.clubId}`
        });
      } else {
        wx.navigateTo({
          url: `${module.path}?clubId=${this.data.clubId}`
        });
      }
    }
  },

  onBack() {
    wx.navigateBack();
  }
});
