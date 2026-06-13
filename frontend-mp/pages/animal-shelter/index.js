const mockData = require('../../config/mock-data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

let pageOptions = {
  data: {
    darkMode: false,
    showSkeleton: true,
    stats: null,
    quickEntries: [],
    featuredAnimals: [],
    recentDonations: [],
    knowledgeList: [],
    currentKnowledgeIndex: 0
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.setData({ darkMode: util.isDarkMode() });
  },

  onRefresh() {
    this.loadData();
  },

  loadData() {
    this.setData({ showSkeleton: true });

    setTimeout(() => {
      const stats = mockData.SHELTER_STATS;
      const quickEntries = mockData.SHELTER_QUICK_ENTRIES;
      const featuredAnimals = mockData.SHELTER_ANIMALS
        .filter(a => a.status === 'available')
        .slice(0, 4)
        .map(item => this.formatAnimal(item));
      const recentDonations = mockData.SHELTER_DONATION_RECORDS
        .slice(0, 5)
        .map(item => ({
          ...item,
          timeText: util.relativeTime(item.createTime),
          amountText: item.amount ? `¥${item.amount}` : `¥${item.totalAmount}`
        }));
      const knowledgeList = mockData.SHELTER_KNOWLEDGE;

      this.setData({
        stats,
        quickEntries,
        featuredAnimals,
        recentDonations,
        knowledgeList,
        showSkeleton: false
      });

      wx.stopPullDownRefresh();
    }, 800);
  },

  formatAnimal(item) {
    const typeInfo = constants.ANIMAL_TYPE_MAP[item.type] || {};
    const healthInfo = constants.ANIMAL_HEALTH_MAP[item.healthStatus] || {};
    const personalityTags = item.personality.map(p => {
      const tag = constants.ANIMAL_PERSONALITY_TAGS.find(t => t.value === p);
      return tag ? { value: p, label: tag.label, color: tag.color } : { value: p, label: p, color: '#999' };
    });

    return {
      ...item,
      typeLabel: typeInfo.label || '',
      typeIcon: typeInfo.icon || '',
      typeColor: typeInfo.color || '',
      healthLabel: healthInfo.label || '',
      healthIcon: healthInfo.icon || '',
      healthColor: healthInfo.color || '',
      genderIcon: item.gender === 'male' ? '♂' : '♀',
      personalityTags,
      rescueText: util.relativeTime(item.rescueDate)
    };
  },

  onEntryTap(e) {
    const { path } = e.currentTarget.dataset;
    if (path) {
      util.navigateTo(path);
    }
  },

  onAnimalTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/animal-shelter/pet-detail?id=${id}`);
  },

  onViewAllAnimals() {
    util.navigateTo('/pages/animal-shelter/pets');
  },

  onKnowledgeChange(e) {
    const { current } = e.detail;
    this.setData({ currentKnowledgeIndex: current });
  },

  onKnowledgeTap(e) {
    const { id } = e.currentTarget.dataset;
    const knowledge = this.data.knowledgeList.find(k => k.id === id);
    if (knowledge) {
      wx.showModal({
        title: knowledge.title,
        content: knowledge.content,
        showCancel: false,
        confirmText: '知道了'
      });
    }
  },

  onDonateTap() {
    util.navigateTo('/pages/animal-shelter/donation');
  },

  onVolunteerTap() {
    util.navigateTo('/pages/animal-shelter/volunteer-signup');
  },

  onAdoptProcessTap() {
    wx.showModal({
      title: '领养流程',
      content: '1. 浏览待领养动物\n2. 选择心仪的动物\n3. 填写领养申请表\n4. 等待审核（1-3个工作日）\n5. 家访确认\n6. 签订领养协议\n7. 缴纳押金（绝育后退还）\n8. 带毛孩子回家！\n\n领养后我们会定期回访，确保毛孩子生活幸福。',
      showCancel: false,
      confirmText: '我知道了'
    });
  }
};

mixPage(pageOptions);
