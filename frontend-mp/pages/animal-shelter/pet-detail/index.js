const mockData = require('../../../config/mock-data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

let pageOptions = {
  data: {
    darkMode: false,
    showSkeleton: true,
    animal: null,
    currentImageIndex: 0,
    isLiked: false,
    showAdoptSheet: false,
    relatedAnimals: []
  },

  onLoad(options) {
    const { id } = options;
    this.animalId = id;
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
      const animalData = mockData.SHELTER_ANIMALS.find(a => a.id === this.animalId);
      if (!animalData) {
        wx.showToast({ title: '动物不存在', icon: 'none' });
        return;
      }

      const animal = this.formatAnimal(animalData);
      const relatedAnimals = mockData.SHELTER_ANIMALS
        .filter(a => a.id !== this.animalId && a.type === animalData.type && a.status === 'available')
        .slice(0, 3)
        .map(item => this.formatAnimal(item));

      this.setData({
        animal,
        relatedAnimals,
        showSkeleton: false
      });

      wx.stopPullDownRefresh();
    }, 600);
  },

  formatAnimal(item) {
    const typeInfo = constants.ANIMAL_TYPE_MAP[item.type] || {};
    const healthInfo = constants.ANIMAL_HEALTH_MAP[item.healthStatus] || {};
    const statusInfo = constants.ADOPTION_STATUS_MAP[item.status] || {};
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
      statusLabel: statusInfo.label || '',
      statusColor: statusInfo.color || '',
      genderIcon: item.gender === 'male' ? '♂' : '♀',
      genderLabel: item.gender === 'male' ? '男孩' : '女孩',
      sterilizedText: item.sterilized ? '已绝育' : '未绝育',
      vaccinatedText: item.vaccinated ? '已驱虫' : '未驱虫',
      personalityTags,
      rescueDateText: util.formatTime(item.rescueDate, 'YYYY-MM-DD'),
      rescueText: util.relativeTime(item.rescueDate)
    };
  },

  onImageChange(e) {
    const { current } = e.detail;
    this.setData({ currentImageIndex: current });
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    const urls = this.data.animal.images;
    wx.previewImage({
      current: urls[index],
      urls
    });
  },

  onLikeTap() {
    this.setData({ isLiked: !this.data.isLiked });
    wx.showToast({
      title: this.data.isLiked ? '已收藏' : '已取消收藏',
      icon: 'none'
    });
  },

  onShareTap() {
    wx.showShareMenu({
      withShareTicket: true
    });
    wx.showToast({ title: '已生成分享卡片', icon: 'none' });
  },

  onAdoptTap() {
    util.navigateTo(`/pages/animal-shelter/adopt-form?animalId=${this.animalId}`);
  },

  onAnimalTap(e) {
    const { id } = e.currentTarget.dataset;
    util.redirectTo(`/pages/animal-shelter/pet-detail?id=${id}`);
  },

  onShareAppMessage() {
    const { animal } = this.data;
    return {
      title: `${animal.name}正在找新家，快来看看吧！`,
      path: `/pages/animal-shelter/pet-detail?id=${this.animalId}`,
      imageUrl: animal.avatar
    };
  },

  catchNoop() {}
};

mixPage(pageOptions);
