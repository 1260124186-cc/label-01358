const mockData = require('../../../config/mock-data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

let pageOptions = {
  data: {
    darkMode: false,
    showSkeleton: true,
    currentTab: 'all',
    tabs: [
      { value: 'all', label: '全部' },
      { value: 'video', label: '视频回访' },
      { value: 'home', label: '上门回访' },
      { value: 'phone', label: '电话回访' }
    ],
    records: [],
    filteredRecords: [],
    stats: {
      total: 0,
      completed: 0,
      pending: 0
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
      const records = mockData.SHELTER_VISIT_RECORDS
        .map(item => {
          const typeInfo = constants.VISIT_RECORD_TYPES.find(t => t.value === item.type) || {};
          const animal = mockData.SHELTER_ANIMALS.find(a => a.id === item.animalId) || {};
          const statusInfo = {
            pending: { label: '待回访', color: '#F59E0B' },
            completed: { label: '已完成', color: '#10B981' },
            cancelled: { label: '已取消', color: '#6B7280' }
          }[item.status] || {};

          return {
            ...item,
            typeLabel: typeInfo.label || '',
            typeIcon: typeInfo.icon || '',
            typeColor: typeInfo.color || '',
            animalName: animal.name || '',
            animalAvatar: animal.avatar || '',
            statusLabel: statusInfo.label || '',
            statusColor: statusInfo.color || '',
            dateText: util.formatTime(item.visitTime, 'YYYY-MM-DD'),
            timeText: util.formatTime(item.visitTime, 'HH:mm'),
            createText: util.relativeTime(item.createTime)
          };
        })
        .sort((a, b) => b.visitTime - a.visitTime);

      this.setData({
        records,
        showSkeleton: false
      });

      this.applyFilters();
      wx.stopPullDownRefresh();
    }, 600);
  },

  onTabTap(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
    this.applyFilters();
  },

  applyFilters() {
    let { records, currentTab } = this.data;
    let filtered = records;

    if (currentTab !== 'all') {
      filtered = records.filter(item => item.type === currentTab);
    }

    const stats = {
      total: filtered.length,
      completed: filtered.filter(r => r.status === 'completed').length,
      pending: filtered.filter(r => r.status === 'pending').length
    };

    this.setData({ filteredRecords: filtered, stats });
  },

  onRecordTap(e) {
    const { id } = e.currentTarget.dataset;
    const record = this.data.records.find(r => r.id === id);
    if (record) {
      this.setData({
        selectedRecord: record,
        showDetail: true
      });
    }
  },

  onDetailClose() {
    this.setData({ showDetail: false });
  },

  onCallVolunteer() {
    const { selectedRecord } = this.data;
    if (selectedRecord && selectedRecord.volunteerPhone) {
      wx.makePhoneCall({ phoneNumber: selectedRecord.volunteerPhone });
    }
  },

  onCallAdopter() {
    const { selectedRecord } = this.data;
    if (selectedRecord && selectedRecord.adopterPhone) {
      wx.makePhoneCall({ phoneNumber: selectedRecord.adopterPhone });
    }
  },

  onViewPhotos(e) {
    const { index } = e.currentTarget.dataset;
    const { selectedRecord } = this.data;
    if (selectedRecord && selectedRecord.photos) {
      wx.previewImage({
        current: selectedRecord.photos[index],
        urls: selectedRecord.photos
      });
    }
  },

  onWatchVideo() {
    wx.showToast({ title: '即将播放回访视频', icon: 'none' });
  },

  catchNoop() {}
};

mixPage(pageOptions);
