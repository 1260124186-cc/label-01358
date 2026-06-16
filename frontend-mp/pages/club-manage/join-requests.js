const dataService = require('../../services/data');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    clubId: '',
    status: 'pending',
    requestList: [],
    tabs: [
      { value: 'pending', label: '待审批' },
      { value: 'approved', label: '已通过' },
      { value: 'rejected', label: '已拒绝' }
    ]
  },

  onLoad(options) {
    this.setData({ clubId: options.clubId });
    if (options.status) {
      this.setData({ status: options.status });
    }
    this.loadData();
  },

  onShow() {
    if (this.data.clubId) {
      this.loadData();
    }
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ status: value });
    this.loadData();
  },

  loadData() {
    util.showLoading();
    const requests = dataService.getClubJoinRequests(this.data.clubId, this.data.status);
    const formattedList = requests.map(item => ({
      ...item,
      name: item.userName || item.name || '未知用户',
      createTimeText: util.formatTime(item.createTime, 'MM-DD HH:mm'),
      statusText: this.getStatusText(item.status),
      statusColor: this.getStatusColor(item.status),
      avatarInitial: (item.userName || item.name || 'U')[0]
    }));
    this.setData({ requestList: formattedList });
    util.hideLoading();
  },

  getStatusText(status) {
    const map = {
      pending: '待审批',
      approved: '已通过',
      rejected: '已拒绝'
    };
    return map[status] || status;
  },

  getStatusColor(status) {
    const map = {
      pending: '#F59E0B',
      approved: '#10B981',
      rejected: '#EF4444'
    };
    return map[status] || '#6B7280';
  },

  onApprove(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '通过申请',
      content: '确定通过该入社申请？',
      success: (res) => {
        if (res.confirm) {
          const result = dataService.approveJoinRequest(this.data.clubId, id);
          if (result.success) {
            util.showToast('已通过');
            this.loadData();
          } else {
            util.showToast(result.message || '操作失败');
          }
        }
      }
    });
  },

  onReject(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '拒绝申请',
      content: '确定拒绝该入社申请？',
      editable: true,
      placeholderText: '请输入拒绝原因（选填）',
      success: (res) => {
        if (res.confirm) {
          const reason = res.content || '';
          const result = dataService.rejectJoinRequest(this.data.clubId, id, reason);
          if (result.success) {
            util.showToast('已拒绝');
            this.loadData();
          } else {
            util.showToast(result.message || '操作失败');
          }
        }
      }
    });
  }
});
