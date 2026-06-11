const dataService = require('../../services/data');
const util = require('../../utils/util');
const constants = require('../../config/constants');

Page({
  data: {
    registrationFlow: [],
    keyPoints: [],
    requiredMaterials: [
      { icon: '🆔', name: '录取通知书', checked: true },
      { icon: '📄', name: '身份证原件及复印件', checked: false },
      { icon: '📷', name: '一寸/二寸免冠照片', checked: false },
      { icon: '🏦', name: '银行卡（缴费使用）', checked: false },
      { icon: '📝', name: '团/党组织关系材料', checked: false },
      { icon: '💉', name: '体检报告/疫苗接种证明', checked: false },
      { icon: '🛏️', name: '生活用品（可选）', checked: false }
    ],
    currentStep: 0,
    nextStepTitle: '',
    darkMode: false
  },

  onLoad() {
    this.loadRegistrationFlow();
    this.loadKeyPoints();
    this.updateNextStepTitle();
    this.loadThemeState();
  },

  loadThemeState() {
    const app = getApp();
    const { isDark } = app.globalData;
    this.setData({ darkMode: isDark || false });
  },

  loadRegistrationFlow() {
    try {
      const flow = dataService.getFreshmanRegistrationFlow();
      this.setData({ registrationFlow: flow });
    } catch (e) {
      console.error('加载报到流程失败:', e);
    }
  },

  loadKeyPoints() {
    try {
      const highlightPOIs = dataService.getHighlightPOIs();
      const keyPoints = highlightPOIs.map(poi => {
        const categoryInfo = constants.POI_CATEGORY_MAP[poi.category] || {};
        return {
          id: poi.id,
          name: poi.name,
          categoryLabel: categoryInfo.label || '其他',
          categoryIcon: categoryInfo.icon || '📍',
          categoryColor: categoryInfo.color || '#6B7280'
        };
      });
      this.setData({ keyPoints });
    } catch (e) {
      console.error('加载关键点位失败:', e);
    }
  },

  updateNextStepTitle() {
    const { currentStep, registrationFlow } = this.data;
    if (currentStep < registrationFlow.length - 1) {
      this.setData({ 
        nextStepTitle: registrationFlow[currentStep + 1].title 
      });
    } else {
      this.setData({ nextStepTitle: '完成报到' });
    }
  },

  onStepTap(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ currentStep: index });
    this.updateNextStepTitle();
  },

  onViewPOI(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/campus-map/index?poiId=${id}&action=focus&highlight=true`);
  },

  onKeyPointTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/poi-detail/index?id=${id}`);
  },

  onViewMap() {
    const flow = this.data.registrationFlow;
    const startPOI = flow[0] && flow[0].poiId;
    const endPOI = flow[flow.length - 1] && flow[flow.length - 1].poiId;
    
    if (startPOI && endPOI) {
      util.navigateTo(`/pages/route-planner/index?startPOIId=${startPOI}&endPOIId=${endPOI}`);
    } else {
      util.navigateTo('/pages/campus-map/index?highlight=true');
    }
  },

  onNextStep() {
    const { currentStep, registrationFlow } = this.data;
    
    if (currentStep < registrationFlow.length - 1) {
      const nextStep = currentStep + 1;
      this.setData({ currentStep: nextStep });
      this.updateNextStepTitle();
      
      wx.vibrateShort({ type: 'light' });
      util.showToast(`开始：${registrationFlow[nextStep].title}`);
    } else {
      util.showModal({
        title: '🎉 恭喜完成报到！',
        content: '欢迎加入我们的大家庭！点击确定查看校园导览地图，开始你的校园生活吧~',
        confirmText: '查看地图',
        cancelText: '稍后再说',
        success: (res) => {
          if (res.confirm) {
            util.navigateTo('/pages/campus-map/index?highlight=true');
          }
        }
      });
    }
  },

  onCallContact(e) {
    const { phone } = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: phone,
      fail: () => {
        util.showToast('拨号失败，请手动拨打');
      }
    });
  },

  onShareAppMessage() {
    return {
      title: '新生报到指南 - 欢迎新同学！',
      path: '/pages/freshman-guide/index'
    };
  }
});
