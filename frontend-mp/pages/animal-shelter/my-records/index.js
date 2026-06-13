const mockData = require('../../../config/mock-data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

let pageOptions = {
  data: {
    darkMode: false,
    showSkeleton: true,
    currentTab: 'applications',
    applications: [],
    adoptedPets: [],
    stats: {
      totalApplications: 0,
      approved: 0,
      adopted: 0,
      visitRecords: 0
    },
    selectedRecord: null,
    showDetail: false
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
      const applications = mockData.SHELTER_ADOPTION_APPLICATIONS
        .map(item => {
          const animal = mockData.SHELTER_ANIMALS.find(a => a.id === item.animalId);
          const statusInfo = constants.ADOPTION_APPLICATION_STATUS_MAP[item.status];
          return {
            ...item,
            animalName: animal?.name || '',
            animalAvatar: animal?.avatar || '',
            animalType: animal?.type || '',
            typeIcon: constants.ANIMAL_TYPE_MAP[animal?.type]?.icon || '🐾',
            typeColor: constants.ANIMAL_TYPE_MAP[animal?.type]?.color || '#666',
            statusLabel: statusInfo?.label || '',
            statusColor: statusInfo?.color || '#666',
            statusIcon: statusInfo?.icon || '📋',
            createTimeText: util.formatTime(item.createTime, 'MM月DD日 HH:mm'),
            updateTimeText: util.relativeTime(item.updateTime)
          };
        })
        .sort((a, b) => b.createTime - a.createTime);

      const adoptedPets = applications
        .filter(a => a.status === 'completed')
        .map(item => {
          const animal = mockData.SHELTER_ANIMALS.find(a => a.id === item.animalId);
          const visitRecords = mockData.SHELTER_VISIT_RECORDS.filter(r => r.applicationId === item.id);
          return {
            ...item,
            animalName: animal?.name || '',
            animalAvatar: animal?.avatar || '',
            animalType: animal?.type || '',
            breed: animal?.breed || '',
            gender: animal?.gender || '',
            ageText: animal?.ageText || '',
            typeIcon: constants.ANIMAL_TYPE_MAP[animal?.type]?.icon || '🐾',
            typeColor: constants.ANIMAL_TYPE_MAP[animal?.type]?.color || '#666',
            adoptDateText: util.formatTime(item.updateTime, 'YYYY年MM月DD日'),
            visitCount: visitRecords.length,
            lastVisitTime: visitRecords.length > 0 
              ? util.relativeTime(visitRecords[visitRecords.length - 1].visitTime)
              : '暂无回访'
          };
        });

      const stats = {
        totalApplications: applications.length,
        approved: applications.filter(a => a.status === 'approved' || a.status === 'completed').length,
        adopted: adoptedPets.length,
        visitRecords: mockData.SHELTER_VISIT_RECORDS.filter(r => r.applicantName === '张三').length
      };

      this.setData({
        applications,
        adoptedPets,
        stats,
        showSkeleton: false
      });

      wx.stopPullDownRefresh();
    }, 600);
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
  },

  onApplicationTap(e) {
    const { id } = e.currentTarget.dataset;
    const application = this.data.applications.find(a => a.id === id);
    if (application) {
      this.setData({
        selectedRecord: application,
        showDetail: true
      });
    }
  },

  onAdoptedPetTap(e) {
    const { id } = e.currentTarget.dataset;
    const pet = this.data.adoptedPets.find(p => p.id === id);
    if (pet) {
      wx.showActionSheet({
        itemList: ['查看详情', '查看回访记录', '添加回访记录'],
        success: (res) => {
          if (res.tapIndex === 0) {
            util.navigateTo(`/pages/animal-shelter/pet-detail?id=${pet.animalId}`);
          } else if (res.tapIndex === 1) {
            util.navigateTo('/pages/animal-shelter/visit-records');
          } else if (res.tapIndex === 2) {
            wx.showToast({ title: '功能开发中', icon: 'none' });
          }
        }
      });
    }
  },

  onCloseDetail() {
    this.setData({ showDetail: false, selectedRecord: null });
  },

  onContactShelter() {
    wx.makePhoneCall({ phoneNumber: '13800138000' });
  },

  onViewAnimal() {
    if (this.data.selectedRecord) {
      util.navigateTo(`/pages/animal-shelter/pet-detail?id=${this.data.selectedRecord.animalId}`);
    }
  },

  onSubmitAgain() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  catchNoop() {}
};

mixPage(pageOptions);
