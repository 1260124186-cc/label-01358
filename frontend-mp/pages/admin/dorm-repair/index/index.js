const util = require('../../../../utils/util');
const constants = require('../../../../config/constants');
const dataService = require('../../../../services/data');
const userService = require('../../../../services/userService');
const { mixPage } = require('../../../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    darkMode: false,
    loading: true,
    currentTab: 'all',
    tabs: constants.REPAIR_ADMIN_TABS,
    stats: {
      total: 0,
      pending: 0,
      accepted: 0,
      in_progress: 0,
      completed: 0,
      rated: 0,
      urgent: 0
    },
    orders: [],
    filteredOrders: [],
    isAdmin: false,
    adminId: '',
    workerId: ''
  },

  onLoad() {
    const currentUser = app.globalData.userInfo;
    const adminId = currentUser ? currentUser.id : '';
    const isAdmin = userService.isAdmin(adminId);
    const workerList = dataService.getRepairWorkerList();
    const workerMatch = workerList.find(w => w.phone === (currentUser?.phone || '') || w.name === (currentUser?.nickName || ''));
    const workerId = workerMatch ? workerMatch.id : '';

    this.setData({
      adminId,
      isAdmin,
      workerId,
      darkMode: app.globalData.darkMode || false
    });

    if (!isAdmin && !workerId) {
      util.showToast('无管理员或维修工权限');
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }

    this.loadData();
  },

  onShow() {
    if ((this.data.isAdmin || this.data.workerId) && !this.data.loading) {
      this.loadData();
    }
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData() {
    this.loadStats();
    this.loadOrders();
  },

  loadStats() {
    try {
      const rawStats = dataService.getRepairOrderStats('', this.data.workerId);
      const allOrders = dataService.getAdminRepairOrders('all', 'all');
      const accepted = allOrders.filter(o => o.status === 'accepted').length;
      const inProgress = allOrders.filter(o => o.status === 'in_progress').length;
      const completed = allOrders.filter(o => o.status === 'completed').length;
      const rated = allOrders.filter(o => o.status === 'rated').length;

      this.setData({
        stats: {
          total: rawStats.total || 0,
          pending: rawStats.pending || 0,
          accepted,
          in_progress: inProgress,
          completed,
          rated,
          urgent: rawStats.urgent || 0
        }
      });
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
  },

  loadOrders() {
    this.setData({ loading: true });

    try {
      const { currentTab, workerId } = this.data;
      let statusParam = currentTab;
      let typeParam = 'all';

      if (currentTab === 'urgent') {
        statusParam = 'urgent';
      }

      let orders = dataService.getAdminRepairOrders(statusParam, typeParam);

      if (workerId) {
        orders = orders.filter(o => {
          if (currentTab === 'pending' || currentTab === 'urgent') {
            return !o.workerId || o.workerId === workerId;
          }
          return o.workerId === workerId;
        });
      }

      orders = orders.map(order => ({
        ...order,
        createTimeText: util.formatTime(order.createTime),
        acceptTimeText: order.acceptTime ? util.formatTime(order.acceptTime) : '',
        urgentTypeLabel: order.isUrgent
          ? (constants.REPAIR_URGENT_TYPES.find(u => u.value === order.urgentType)?.label || '紧急')
          : '',
        canAccept: order.status === 'pending' && !!workerId,
        canStart: order.status === 'accepted' && order.workerId === workerId,
        canComplete: order.status === 'in_progress' && order.workerId === workerId
      }));

      this.setData({
        orders,
        loading: false
      });

      this.filterOrders();
    } catch (error) {
      console.error('加载工单列表失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  filterOrders() {
    const { orders } = this.data;
    this.setData({ filteredOrders: orders });
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value }, () => {
      this.loadOrders();
    });
  },

  onStatTap(e) {
    const { type } = e.currentTarget.dataset;
    const tabMap = {
      total: 'all',
      pending: 'pending',
      accepted: 'accepted',
      in_progress: 'in_progress',
      completed: 'completed',
      rated: 'rated',
      urgent: 'urgent'
    };
    const targetTab = tabMap[type] || 'all';
    this.setData({ currentTab: targetTab }, () => {
      this.loadOrders();
    });
  },

  onAccept(e) {
    const { id } = e.currentTarget.dataset;
    const { workerId } = this.data;

    if (!workerId) {
      util.showToast('未绑定维修工账号');
      return;
    }

    wx.showModal({
      title: '确认接单',
      content: '确认接手此维修工单？',
      confirmText: '确认接单',
      success: (res) => {
        if (res.confirm) {
          this.doAccept(id, workerId);
        }
      }
    });
  },

  doAccept(orderId, workerId) {
    try {
      const result = dataService.acceptRepairOrder(orderId, workerId);

      if (result.success) {
        util.showSuccess('接单成功');
        this.loadData();
      } else {
        util.showToast(result.error || '接单失败');
      }
    } catch (error) {
      console.error('接单失败:', error);
      util.showToast('接单失败');
    }
  },

  onStart(e) {
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '开始维修',
      content: '确认已到达现场并开始维修？',
      confirmText: '开始维修',
      success: (res) => {
        if (res.confirm) {
          this.doStart(id);
        }
      }
    });
  },

  doStart(orderId) {
    try {
      const result = dataService.startRepairOrder(orderId);

      if (result.success) {
        util.showSuccess('已开始维修');
        this.loadData();
      } else {
        util.showToast(result.error || '操作失败');
      }
    } catch (error) {
      console.error('开始维修失败:', error);
      util.showToast('操作失败');
    }
  },

  onComplete(e) {
    const { id } = e.currentTarget.dataset;

    wx.showModal({
      title: '完成维修',
      content: '确认维修已完成？',
      confirmText: '确认完成',
      success: (res) => {
        if (res.confirm) {
          this.doComplete(id);
        }
      }
    });
  },

  doComplete(orderId) {
    try {
      const result = dataService.completeRepairOrder(orderId, '');

      if (result.success) {
        util.showSuccess('维修完成');
        this.loadData();
      } else {
        util.showToast(result.error || '操作失败');
      }
    } catch (error) {
      console.error('完成维修失败:', error);
      util.showToast('操作失败');
    }
  },

  onOrderTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/dorm-repair/detail/index?id=${id}&admin=1`
    });
  },

  goBack() {
    wx.navigateBack();
  },

  stopPropagation() {}
});
