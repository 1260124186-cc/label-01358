const dataService = require('../../services/data');
const util = require('../../utils/util');
const constants = require('../../config/constants');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    checklist: null,
    certificate: null,
    showCertificate: false,
    completedCount: 0,
    totalCount: 0,
    statusMap: constants.GRADUATION_STATUS_MAP
  },

  onLoad() {
    this.loadThemeState();
  },

  onShow() {
    this.loadChecklist();
    this.loadCertificate();
  },

  loadThemeState() {
    const app = getApp();
    const { isDark } = app.globalData;
    this.setData({ darkMode: isDark || false });
  },

  loadChecklist() {
    try {
      util.showLoading('加载中...');
      const checklist = dataService.getGraduationChecklist();
      const completedCount = checklist.items.filter(i => i.status === 'completed').length;
      const totalCount = checklist.items.length;
      this.setData({ 
        checklist,
        completedCount,
        totalCount
      });
      util.hideLoading();
    } catch (e) {
      console.error('[Graduation] 加载离校清单失败:', e);
      util.hideLoading();
      util.showError('加载失败，请重试');
    }
  },

  loadCertificate() {
    try {
      const certificate = dataService.getGraduationCertificate();
      this.setData({ certificate });
    } catch (e) {
      console.error('[Graduation] 加载电子离校单失败:', e);
    }
  },

  onItemTap(e) {
    const { id } = e.currentTarget.dataset;
    const { checklist } = this.data;
    
    if (!checklist) return;
    
    const item = checklist.items.find(i => i.id === id);
    if (!item) return;

    if (item.status === 'pending') {
      util.showConfirm(`确认开始办理【${item.name}】吗？`, '开始办理').then(confirmed => {
        if (confirmed) {
          this.updateItemStatus(id, 'processing');
        }
      });
    } else if (item.status === 'processing') {
      util.showToast('请前往办理地点，由管理员签字确认');
    }
  },

  onViewGuide(e) {
    const { url } = e.currentTarget.dataset;
    if (url) {
      util.navigateTo(url);
    }
  },

  onViewLocation(e) {
    const { location } = e.currentTarget.dataset;
    if (location) {
      util.showToast(location);
    }
  },

  updateItemStatus(itemId, status) {
    try {
      const success = dataService.updateGraduationItemStatus(itemId, status);
      if (success) {
        this.loadChecklist();
        wx.vibrateShort({ type: 'light' });
        util.showSuccess(status === 'processing' ? '已开始办理' : '状态已更新');
      } else {
        util.showError('更新失败，请重试');
      }
    } catch (e) {
      console.error('[Graduation] 更新状态失败:', e);
      util.showError('更新失败');
    }
  },

  onGenerateCertificate() {
    const { checklist } = this.data;
    if (!checklist || !checklist.completed) {
      util.showToast('请先完成所有离校手续');
      return;
    }

    util.showConfirm('确认生成电子离校单吗？生成后将不可修改。', '生成离校单').then(confirmed => {
      if (!confirmed) return;

      try {
        util.showLoading('生成中...');
        const result = dataService.generateGraduationCertificate();
        util.hideLoading();

        if (result.success) {
          wx.vibrateShort({ type: 'medium' });
          this.setData({ 
            certificate: result.certificate,
            showCertificate: true 
          });
          util.showSuccess('电子离校单已生成');
          this.loadChecklist();
        } else {
          util.showError(result.message || '生成失败');
        }
      } catch (e) {
        console.error('[Graduation] 生成离校单失败:', e);
        util.hideLoading();
        util.showError('生成失败');
      }
    });
  },

  onViewCertificate() {
    const { certificate } = this.data;
    if (certificate) {
      this.setData({ showCertificate: true });
    }
  },

  onCloseCertificate() {
    this.setData({ showCertificate: false });
  },

  onSaveCertificate() {
    const { certificate } = this.data;
    if (!certificate) return;
    
    util.showToast('电子离校单已保存');
  },

  onShareAppMessage() {
    return {
      title: '毕业离校一站式服务',
      path: '/pages/graduation/index'
    };
  }
});
