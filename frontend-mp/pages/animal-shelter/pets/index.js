const mockData = require('../../../config/mock-data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

let pageOptions = {
  data: {
    darkMode: false,
    showSkeleton: true,
    animals: [],
    filteredAnimals: [],
    filterTabs: [],
    currentTab: 'all',
    typeFilter: 'all',
    healthFilter: 'all',
    genderFilter: 'all',
    showFilterModal: false,
    pageSize: 10,
    currentPage: 1,
    hasMore: true,
    keyword: '',
    ANIMAL_HEALTH_STATUS: constants.ANIMAL_HEALTH_STATUS
  },

  onLoad() {
    this.initFilters();
    this.loadData();
  },

  onShow() {
    this.setData({ darkMode: util.isDarkMode() });
  },

  onRefresh() {
    this.setData({ currentPage: 1, hasMore: true });
    this.loadData();
  },

  initFilters() {
    const filterTabs = [
      { value: 'all', label: '全部' },
      ...constants.ANIMAL_TYPES.map(t => ({ value: t.value, label: t.label, icon: t.icon }))
    ];
    this.setData({ filterTabs });
  },

  loadData() {
    this.setData({ showSkeleton: true });

    setTimeout(() => {
      const animals = mockData.SHELTER_ANIMALS
        .map(item => this.formatAnimal(item))
        .sort((a, b) => b.createTime - a.createTime);

      this.setData({
        animals,
        showSkeleton: false
      });

      this.applyFilters();
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
      personalityTags,
      rescueText: util.relativeTime(item.rescueDate)
    };
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      currentTab: value,
      typeFilter: value,
      currentPage: 1,
      hasMore: true
    });
    this.applyFilters();
  },

  onSearchInput(e) {
    const { value } = e.detail;
    this.setData({ keyword: value });
  },

  onSearchConfirm() {
    this.setData({ currentPage: 1, hasMore: true });
    this.applyFilters();
  },

  onFilterTap() {
    this.setData({ showFilterModal: true });
  },

  onFilterClose() {
    this.setData({ showFilterModal: false });
  },

  onFilterReset() {
    this.setData({
      typeFilter: 'all',
      healthFilter: 'all',
      genderFilter: 'all',
      currentTab: 'all',
      currentPage: 1,
      hasMore: true
    });
    this.applyFilters();
  },

  onFilterConfirm() {
    this.setData({
      showFilterModal: false,
      currentPage: 1,
      hasMore: true
    });
    this.applyFilters();
  },

  onHealthFilterTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ healthFilter: value });
  },

  onGenderFilterTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ genderFilter: value });
  },

  applyFilters() {
    let { animals, typeFilter, healthFilter, genderFilter, keyword, currentPage, pageSize } = this.data;

    let filtered = animals.filter(animal => {
      if (typeFilter !== 'all' && animal.type !== typeFilter) return false;
      if (healthFilter !== 'all' && animal.healthStatus !== healthFilter) return false;
      if (genderFilter !== 'all' && animal.gender !== genderFilter) return false;

      if (keyword) {
        const keywordLower = keyword.toLowerCase();
        const matchName = animal.name.toLowerCase().includes(keywordLower);
        const matchBreed = animal.breed.toLowerCase().includes(keywordLower);
        const matchDesc = animal.description.toLowerCase().includes(keywordLower);
        if (!matchName && !matchBreed && !matchDesc) return false;
      }

      return true;
    });

    const start = 0;
    const end = currentPage * pageSize;
    const pageData = filtered.slice(start, end);
    const hasMore = end < filtered.length;

    this.setData({
      filteredAnimals: pageData,
      hasMore,
      totalCount: filtered.length
    });
  },

  onReachBottom() {
    if (this.data.hasMore) {
      this.setData({ currentPage: this.data.currentPage + 1 });
      this.applyFilters();
    }
  },

  onAnimalTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/animal-shelter/pet-detail?id=${id}`);
  },

  onAdoptTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/animal-shelter/adopt-form?animalId=${id}`);
  },

  catchNoop() {}
};

mixPage(pageOptions);
