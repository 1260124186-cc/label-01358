const dataService = require('../../../services/data');
const util = require('../../../utils/util');
const constants = require('../../../config/constants');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    checklists: [],
    filteredChecklists: [],
    statusFilter: 'all',
    statusOptions: [
      { value: 'all', label: '全部' },
      { value: 'pending', label: '待办理' },
      { value: 'processing', label: '办理中' },
      { value: 'completed', label: '已完成' }
    ],
    statusMap: constants.GRADUATION_STATUS_MAP,
    items: constants.GRADUATION_ITEMS,
    showSignModal: false,
    currentStudent: null,
    currentItem: null,
    adminName: '张管理员',
    departmentOptions: [
      { value: '图书馆', label: '图书馆' },
      { value: '后勤处', label: '后勤处' },
      { value: '财务处', label: '财务处' },
      { value: '保卫处', label: '保卫处' },
      { value: '教务处', label: '教务处' }
    ],
    selectedDepartment: '图书馆',
    selectedDeptIndex: 0
  },

  onLoad() {
    this.loadThemeState();
    this.loadChecklists();
  },

  onShow() {
    this.loadChecklists();
  },

  onPullDownRefresh() {
    this.loadChecklists();
    wx.stopPullDownRefresh();
  },

  loadThemeState() {
    const app = getApp();
    const { isDark } = app.globalData;
    this.setData({ darkMode: isDark || false });
  },

  loadChecklists() {
    try {
      util.showLoading('加载中...');
      const checklists = dataService.getAllGraduationChecklists();
      this.setData({ checklists });
      this.applyFilter();
      util.hideLoading();
    } catch (e) {
      console.error('[Admin Graduation] 加载清单失败:', e);
      util.hideLoading();
      util.showError('加载失败，请重试');
    }
  },

  onFilterTap(e) {
    const { status } = e.currentTarget.dataset;
    this.setData({ statusFilter: status });
    this.applyFilter();
  },

  applyFilter() {
    const { checklists, statusFilter } = this.data;
    
    if (statusFilter === 'all') {
      this.setData({ filteredChecklists: checklists });
      return;
    }

    const filtered = checklists.filter(cl => {
      if (statusFilter === 'pending') {
        return cl.items.some(i => i.status === 'pending');
      } else if (statusFilter === 'processing') {
        return cl.items.some(i => i.status === 'processing');
      } else if (statusFilter === 'completed') {
        return cl.completed;
      }
      return false;
    });

    this.setData({ filteredChecklists: filtered });
  },

  onStudentTap(e) {
    const { userid } = e.currentTarget.dataset;
    util.navigateTo(`/pages/graduation/index?userId=${userid}`);
  },

  onSignTap(e) {
    const { userid, itemid } = e.currentTarget.dataset;
    const { checklists, items } = this.data;
    
    const checklist = checklists.find(c => c.userId === userid);
    const item = checklist ? checklist.items.find(i => i.id === itemid) : null;
    const itemInfo = items.find(i => i.id === itemid);

    if (!checklist || !item || item.status !== 'processing') {
      util.showToast('该项目尚未开始办理');
      return;
    }

    if (item.adminSigned) {
      util.showToast('该项目已签字确认');
      return;
    }

    const deptIndex = this.data.departmentOptions.findIndex(d => d.value === (itemInfo ? itemInfo.department : '图书馆'));
    this.setData({
      showSignModal: true,
      currentStudent: checklist,
      currentItem: item,
      selectedDepartment: itemInfo ? itemInfo.department : '图书馆',
      selectedDeptIndex: deptIndex >= 0 ? deptIndex : 0
    });
  },

  onDepartmentChange(e) {
    const { value } = e.detail;
    const dept = this.data.departmentOptions[value];
    this.setData({ 
      selectedDepartment: dept.value,
      selectedDeptIndex: value
    });
  },

  onAdminNameInput(e) {
    this.setData({ adminName: e.detail.value });
  },

  onConfirmSign() {
    const { currentStudent, currentItem, adminName, selectedDepartment } = this.data;
    
    if (!adminName.trim()) {
      util.showToast('请输入管理员姓名');
      return;
    }

    try {
      util.showLoading('确认中...');
      const result = dataService.adminSignGraduationItem(
        currentStudent.userId,
        currentItem.id,
        adminName.trim(),
        selectedDepartment
      );
      util.hideLoading();

      if (result.success) {
        wx.vibrateShort({ type: 'medium' });
        util.showSuccess('签字确认成功');
        this.setData({ showSignModal: false });
        this.loadChecklists();
      } else {
        util.showError(result.message || '确认失败');
      }
    } catch (e) {
      console.error('[Admin Graduation] 签字确认失败:', e);
      util.hideLoading();
      util.showError('确认失败');
    }
  },

  onCloseModal() {
    this.setData({ showSignModal: false });
  },

  onShareAppMessage() {
    return {
      title: '毕业离校审核',
      path: '/pages/admin/graduation-verify/index'
    };
  }
});
