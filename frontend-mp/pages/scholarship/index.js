const dataService = require('../../services/data');
const util = require('../../utils/util');

const TABS = [
  { value: 'policy', label: '政策库', icon: '📚' },
  { value: 'match', label: '个人匹配', icon: '🎯' },
  { value: 'progress', label: '申请进度', icon: '📊' },
  { value: 'material', label: '材料清单', icon: '📋' },
  { value: 'public', label: '公示名单', icon: '📜' }
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: 'national', label: '国家级' },
  { value: 'school', label: '校级' },
  { value: 'enterprise', label: '企业赞助' },
  { value: 'special', label: '专项' }
];

const SORT_OPTIONS = [
  { value: 'default', label: '默认排序' },
  { value: 'amount', label: '金额从高到低' },
  { value: 'deadline', label: '截止时间最近' }
];

const YEAR_OPTIONS = [
  { value: 'all', label: '全部学年' },
  { value: '2025-2026', label: '2025-2026学年' },
  { value: '2024-2025', label: '2024-2025学年' }
];

Page({
  data: {
    darkMode: false,
    currentTab: 'policy',
    tabs: TABS,

    categoryOptions: CATEGORY_OPTIONS,
    currentCategory: 'all',
    sortOptions: SORT_OPTIONS,
    currentSort: 'default',
    currentSortLabel: '默认排序',
    yearOptions: YEAR_OPTIONS,
    currentYear: 'all',
    searchKeyword: '',

    policyList: [],
    policyListFiltered: [],

    userProfile: null,
    matchedList: [],

    applicationList: [],
    applicationStats: {
      total: 0,
      approved: 0,
      reviewing: 0
    },

    materialList: [],

    publicList: [],

    selectedPolicyId: '',
    showMaterialModal: false,
    modalMaterials: []
  },

  onLoad() {
    this.loadAllData();
  },

  onShow() {
    this.loadThemeState();
  },

  loadThemeState() {
    const app = getApp();
    const { isDark } = app.globalData;
    this.setData({ darkMode: isDark || false });
  },

  onPullDownRefresh() {
    this.loadAllData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadAllData() {
    return new Promise((resolve) => {
      dataService.initScholarshipData();
      this.loadPolicyData();
      this.loadUserProfile();
      this.loadMatchedList();
      this.loadApplicationList();
      this.loadMaterialList();
      this.loadPublicList();
      resolve();
    });
  },

  loadPolicyData() {
    const policyList = dataService.getScholarshipPolicyList();
    this.setData({ policyList });
    this.applyFilters();
  },

  applyFilters() {
    const { currentCategory, currentSort, searchKeyword, policyList } = this.data;
    let filtered = [...policyList];

    if (currentCategory !== 'all') {
      filtered = filtered.filter(item => item.category === currentCategory);
    }

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.sponsor.toLowerCase().includes(keyword)
      );
    }

    if (currentSort === 'amount') {
      filtered.sort((a, b) => b.amount - a.amount);
    } else if (currentSort === 'deadline') {
      filtered.sort((a, b) => {
        const aDate = new Date(a.applyEndDate);
        const bDate = new Date(b.applyEndDate);
        return aDate - bDate;
      });
    }

    const filteredWithTags = filtered.map(item => this.formatPolicyItem(item));

    const sortOption = SORT_OPTIONS.find(s => s.value === currentSort);

    this.setData({
      policyListFiltered: filteredWithTags,
      currentSortLabel: sortOption ? sortOption.label : '默认排序'
    });
  },

  formatPolicyItem(item) {
    const eligibilityList = item.eligibility || [];
    const previewEligibility = eligibilityList.slice(0, 2);
    const hasMoreEligibility = eligibilityList.length > 2;
    const eligibilityMoreCount = eligibilityList.length;

    return {
      ...item,
      daysLeft: this.calculateDaysLeft(item.applyEndDate),
      categoryColor: this.getCategoryColor(item.category),
      previewEligibility,
      hasMoreEligibility,
      eligibilityMoreCount
    };
  },

  calculateDaysLeft(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { text: '已截止', urgent: true, expired: true };
    if (diffDays === 0) return { text: '今天截止', urgent: true, expired: false };
    if (diffDays <= 7) return { text: `剩余${diffDays}天`, urgent: true, expired: false };
    return { text: `剩余${diffDays}天`, urgent: false, expired: false };
  },

  getCategoryColor(category) {
    const colors = {
      national: { bg: '#FEF2F2', text: '#DC2626', label: '国家级' },
      school: { bg: '#EFF6FF', text: '#2563EB', label: '校级' },
      enterprise: { bg: '#FEF3C7', text: '#D97706', label: '企业赞助' },
      special: { bg: '#F0FDF4', text: '#059669', label: '专项' }
    };
    return colors[category] || colors.school;
  },

  loadUserProfile() {
    const userProfile = dataService.getScholarshipUserProfile();
    if (userProfile) {
      userProfile.gpaPercent = Math.round((userProfile.gpa / 4) * 100);
      userProfile.rankPercentClass = userProfile.gpaRankPercent <= 10 ? 'excellent' :
        userProfile.gpaRankPercent <= 25 ? 'good' : 'average';
      userProfile.awardsCount = (userProfile.awards || []).length;
      userProfile.clubCount = (userProfile.clubPositions || []).length;
      userProfile.researchCount = (userProfile.researchExperience || []).length;
    }
    this.setData({ userProfile });
  },

  loadMatchedList() {
    const matchedList = dataService.getMatchedScholarships();
    const matchedWithUI = matchedList.map(item => {
      const formatted = this.formatPolicyItem(item);
      return {
        ...formatted,
        matchLevelText: item.matchLevel === 'high' ? '高度匹配' :
          item.matchLevel === 'medium' ? '较为匹配' : '一般匹配',
        matchLevelColor: item.matchLevel === 'high' ? '#10B981' :
          item.matchLevel === 'medium' ? '#3B82F6' : '#8B5CF6',
        matchProgressPercent: Math.min(100, item.matchScore),
        matchReasonsPreview: (item.matchReasons || []).slice(0, 3)
      };
    });
    this.setData({ matchedList: matchedWithUI });
  },

  loadApplicationList() {
    const list = dataService.getScholarshipApplicationList();
    const listWithUI = list.map(item => ({
      ...item,
      statusText: this.getApplicationStatusText(item.status),
      statusColor: this.getApplicationStatusColor(item.status),
      progressPercent: Math.round((item.currentStep / item.totalSteps) * 100),
      applyTimeText: util.formatDate(item.applyTime),
      completedSteps: item.steps.slice(0, item.currentStep),
      pendingSteps: item.steps.slice(item.currentStep),
      hasRemark: !!item.remark
    }));

    const approved = listWithUI.filter(a => a.status === 'approved').length;
    const reviewing = listWithUI.filter(a => a.status === 'reviewing' || a.status === 'pending').length;

    this.setData({
      applicationList: listWithUI,
      applicationStats: {
        total: listWithUI.length,
        approved,
        reviewing
      }
    });
  },

  getApplicationStatusText(status) {
    const texts = {
      pending: '待审核',
      reviewing: '审核中',
      approved: '已通过',
      rejected: '已拒绝',
      completed: '已完成'
    };
    return texts[status] || '未知状态';
  },

  getApplicationStatusColor(status) {
    const colors = {
      pending: '#F59E0B',
      reviewing: '#3B82F6',
      approved: '#10B981',
      rejected: '#EF4444',
      completed: '#8B5CF6'
    };
    return colors[status] || '#6B7280';
  },

  loadMaterialList() {
    const materialList = dataService.getScholarshipMaterialList();
    const materialWithUI = materialList.map(item => this.formatMaterialItem(item));
    this.setData({ materialList: materialWithUI });
  },

  formatMaterialItem(item) {
    return {
      ...item,
      requiredText: item.required ? '必填' : '选填',
      requiredColor: item.required ? '#EF4444' : '#6B7280'
    };
  },

  loadPublicList() {
    let filters = {};
    if (this.data.currentYear !== 'all') {
      filters.year = this.data.currentYear;
    }
    const list = dataService.getScholarshipPublicList(filters);
    const listWithUI = list.map(item => {
      const winnerList = item.list || [];
      return {
        ...item,
        publishTimeText: util.formatDate(item.publishTime),
        totalAmount: winnerList.reduce((sum, i) => sum + i.amount, 0),
        studentCount: winnerList.length,
        previewWinners: winnerList.slice(0, 4),
        moreWinnersCount: Math.max(0, winnerList.length - 4),
        hasMoreWinners: winnerList.length > 4
      };
    });
    this.setData({ publicList: listWithUI });
  },

  onTabChange(e) {
    const tab = e.currentTarget.dataset.value;
    this.setData({ currentTab: tab });
    if (tab === 'match') {
      this.loadMatchedList();
    } else if (tab === 'progress') {
      this.loadApplicationList();
    }
  },

  onCategoryChange(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({ currentCategory: value });
    this.applyFilters();
  },

  onSortChange(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({ currentSort: value });
    this.applyFilters();
  },

  onYearChange(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({ currentYear: value });
    this.loadPublicList();
  },

  onSearchInput(e) {
    const value = e.detail.value;
    this.setData({ searchKeyword: value });
    this.applyFilters();
  },

  onPolicyClick(e) {
    const id = e.currentTarget.dataset.id;
    const policy = this.data.policyList.find(item => item.id === id);
    if (policy) {
      const content = `
${policy.name}

💰 金额：${policy.amountText}
📅 申请时间：${policy.applyStartDate} 至 ${policy.applyEndDate}
👥 名额：${policy.quota}
🏫 级别：${policy.categoryName}
🎓 适用：${policy.levelName}
📝 赞助：${policy.sponsor}

---
📋 申请条件：
${policy.eligibility.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}

---
🎁 奖励内容：
${policy.benefits.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}

---
ℹ️ 说明：
${policy.description}

---
📞 联系方式：
${policy.contactName}：${policy.contactPhone}`;
      wx.showModal({
        title: policy.name,
        content,
        showCancel: false,
        confirmText: '知道了'
      });
    }
  },

  onApplyClick(e) {
    e.stopPropagation();
    const id = e.currentTarget.dataset.id;
    const policy = this.data.policyList.find(item => item.id === id);
    if (!policy) return;

    const existingApp = this.data.applicationList.find(a => a.scholarshipId === id && a.status !== 'rejected');
    if (existingApp) {
      wx.showToast({ title: '您已申请过该奖学金', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '确认申请',
      content: `确定要申请「${policy.name}」吗？\n申请金额：${policy.amountText}`,
      success: (res) => {
        if (res.confirm) {
          const materials = dataService.getScholarshipMaterialList(id);
          const application = dataService.createScholarshipApplication({
            scholarshipId: policy.id,
            scholarshipName: policy.name,
            amount: policy.amount,
            materials: materials.filter(m => m.required).map(m => ({
              name: m.name,
              status: 'pending'
            }))
          });
          if (application) {
            util.showToast('申请提交成功！');
            this.loadApplicationList();
          } else {
            util.showToast('申请提交失败', 'error');
          }
        }
      }
    });
  },

  onMatchApplyClick(e) {
    const id = e.currentTarget.dataset.id;
    const policy = this.data.policyList.find(item => item.id === id);
    if (!policy) return;

    const existingApp = this.data.applicationList.find(a => a.scholarshipId === id && a.status !== 'rejected');
    if (existingApp) {
      wx.showToast({ title: '您已申请过该奖学金', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '确认申请',
      content: `确定要申请「${policy.name}」吗？\n申请金额：${policy.amountText}`,
      success: (res) => {
        if (res.confirm) {
          const materials = dataService.getScholarshipMaterialList(id);
          const application = dataService.createScholarshipApplication({
            scholarshipId: policy.id,
            scholarshipName: policy.name,
            amount: policy.amount,
            materials: materials.filter(m => m.required).map(m => ({
              name: m.name,
              status: 'pending'
            }))
          });
          if (application) {
            util.showToast('申请提交成功！');
            this.loadApplicationList();
          } else {
            util.showToast('申请提交失败', 'error');
          }
        }
      }
    });
  },

  onViewMaterials(e) {
    e.stopPropagation();
    const id = e.currentTarget.dataset.id;
    const rawMaterials = dataService.getScholarshipMaterialList(id);
    const modalMaterials = rawMaterials.map(item => this.formatMaterialItem(item));
    this.setData({
      showMaterialModal: true,
      modalMaterials,
      selectedPolicyId: id
    });
  },

  closeMaterialModal() {
    this.setData({ showMaterialModal: false });
  },

  onMaterialClick(e) {
    const id = e.currentTarget.dataset.id;
    const material = this.data.materialList.find(m => m.id === id) ||
      this.data.modalMaterials.find(m => m.id === id);
    if (material) {
      wx.showModal({
        title: material.name,
        content: `说明：${material.description}\n\n格式：${material.format}\n大小：${material.maxSize}\n\n备注：${material.notes}`,
        showCancel: false
      });
    }
  },

  onApplicationClick(e) {
    const id = e.currentTarget.dataset.id;
    const app = this.data.applicationList.find(item => item.id === id);
    if (!app) return;

    const stepsText = app.steps.map((step, idx) => {
      const statusIcon = step.status === 'completed' ? '✅' : step.status === 'in_progress' ? '⏳' : '⬜';
      const timeText = step.time ? `(${util.formatDate(step.time)})` : '';
      return `${statusIcon} ${idx + 1}. ${step.name} ${timeText}\n   ${step.remark || ''}`;
    }).join('\n\n');

    const content = `
申请进度详情

📄 ${app.scholarshipName}
💰 申请金额：${app.amount}元
📅 申请时间：${app.applyTimeText}
📊 当前状态：${app.statusText}
📍 当前进度：第${app.currentStep}步 / 共${app.totalSteps}步

---
📋 进度明细：
${stepsText}

---
📝 备注：${app.remark || '无'}
`;
    wx.showModal({
      title: '申请进度',
      content,
      showCancel: false
    });
  },

  onPublicClick(e) {
    const id = e.currentTarget.dataset.id;
    const pub = this.data.publicList.find(item => item.id === id);
    if (!pub) return;

    const listText = pub.list.map((item, idx) =>
      `${idx + 1}. ${item.name} | ${item.studentId} | ${item.major} ${item.grade} | GPA:${item.gpa} | 排名:${item.rank} | ${item.amount}元`
    ).join('\n');

    const content = `
${pub.scholarshipName} 获奖名单

📅 学年：${pub.year}
🏢 学院：${pub.college}
👥 获奖人数：${pub.totalCount}人
💰 总金额：${pub.totalAmount}元
📅 公示时间：${pub.publishTimeText}

---
📋 获奖名单（已脱敏）：
${listText}
`;
    wx.showModal({
      title: '获奖名单公示',
      content,
      showCancel: false,
      confirmText: '知道了'
    });
  }
});
