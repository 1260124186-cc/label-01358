const dataService = require('../../services/data');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    clubId: '',
    club: null,
    activities: [],
    status: 'all',
    statusTabs: [
      { value: 'all', label: '全部' },
      { value: 'upcoming', label: '未开始' },
      { value: 'ongoing', label: '进行中' },
      { value: 'ended', label: '已结束' }
    ]
  },

  onLoad(options) {
    this.setData({ clubId: options.clubId });
    this.loadData();
  },

  onShow() {
    if (this.data.clubId) {
      this.loadData();
    }
  },

  onStatusTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ status: value });
    this.loadData();
  },

  loadData() {
    util.showLoading();
    const club = dataService.getClubDetail(this.data.clubId);
    let activities = dataService.getClubActivities(this.data.clubId);

    if (this.data.status !== 'all') {
      activities = activities.filter(a => {
        const status = this.getActivityStatus(a);
        return status === this.data.status;
      });
    }

    const formattedActivities = activities.map(item => {
      const registrationCount = (item.registrations || []).length;
      const checkinCount = (item.registrations || []).filter(r => r.checkedIn).length;
      const status = this.getActivityStatus(item);
      const statusInfo = this.getStatusInfo(status);
      const participationRate = registrationCount > 0
        ? Math.round(checkinCount / registrationCount * 100)
        : 0;

      return {
        ...item,
        registrationCount,
        checkinCount,
        participationRate,
        activityTimeText: util.formatTime(item.activityTime, 'MM-DD HH:mm'),
        statusText: statusInfo.text,
        statusColor: statusInfo.color
      };
    });

    this.setData({
      club,
      activities: formattedActivities
    });
    util.hideLoading();
  },

  getActivityStatus(activity) {
    const now = Date.now();
    const startTime = new Date(activity.activityTime).getTime();
    const endTime = new Date(activity.endTime).getTime();

    if (activity.status === 'cancelled') return 'cancelled';
    if (now > endTime) return 'ended';
    if (now >= startTime && now <= endTime) return 'ongoing';
    return 'upcoming';
  },

  getStatusInfo(status) {
    const map = {
      upcoming: { text: '未开始', color: '#3B82F6' },
      ongoing: { text: '进行中', color: '#10B981' },
      ended: { text: '已结束', color: '#6B7280' },
      cancelled: { text: '已取消', color: '#EF4444' }
    };
    return map[status] || { text: status, color: '#6B7280' };
  },

  onActivityTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/club-activity/manage?activityId=${id}`
    });
  },

  onPublish() {
    wx.navigateTo({
      url: `/pages/club-activity/publish?clubId=${this.data.clubId}`
    });
  },

  onBack() {
    wx.navigateBack();
  }
});
