const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    list: [],
    loading: false,
    refreshing: false,
    currentTab: 'all',
    tabs: [
      { value: 'all', label: '全部' },
      { value: 'active', label: '进行中' },
      { value: 'closed', label: '已结束' }
    ]
  },

  onLoad() {
    this.loadList();
  },

  onShow() {
    this.loadList();
  },

  onPullDownRefresh() {
    this.loadList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  loadList() {
    this.setData({ loading: true });

    return new Promise((resolve) => {
      const filters = {};
      if (this.data.currentTab !== 'all') {
        filters.status = this.data.currentTab;
      }

      const list = dataService.getSurveyList(filters);
      const app = getApp();
      const userId = app.globalData.userInfo ? app.globalData.userInfo.account : '';

      const formattedList = list.map(item => {
        const hasResponded = userId ? dataService.hasUserResponded(item.id, userId) : false;
        const questionCount = (item.questions || []).length;
        return {
          ...item,
          timeText: util.relativeTime(item.createTime),
          statusText: constants.getLabelByValue(constants.SURVEY_STATUS, item.status),
          questionCount,
          hasResponded,
          isOwner: item.creator === userId
        };
      });

      this.setData({
        list: formattedList,
        loading: false,
        refreshing: false
      });

      resolve();
    });
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentTab: value });
    this.loadList();
  },

  onRefresh() {
    this.setData({ refreshing: true });
    this.loadList();
  },

  onItemTap(e) {
    const { item } = e.currentTarget.dataset;
    if (item.status === 'closed') {
      util.navigateTo(`/pages/survey-result/index?id=${item.id}`);
      return;
    }
    const app = getApp();
    const userId = app.globalData.userInfo ? app.globalData.userInfo.account : '';
    if (item.hasResponded || dataService.hasUserResponded(item.id, userId)) {
      util.navigateTo(`/pages/survey-result/index?id=${item.id}`);
    } else {
      util.navigateTo(`/pages/survey-fill/index?id=${item.id}`);
    }
  },

  onViewResult(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/survey-result/index?id=${id}`);
  },

  onCreate() {
    if (!util.checkLogin()) return;
    util.navigateTo('/pages/survey-create/index');
  },

  onCloseSurvey(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认结束',
      content: '结束后将无法再接收新的回答，确定要结束吗？',
      confirmColor: '#FF6B6B',
      success: (res) => {
        if (res.confirm) {
          dataService.closeSurvey(id);
          util.showSuccess('已结束');
          this.loadList();
        }
      }
    });
  },

  onDeleteSurvey(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复，确定要删除吗？',
      confirmColor: '#FF6B6B',
      success: (res) => {
        if (res.confirm) {
          dataService.deleteSurvey(id);
          util.showSuccess('已删除');
          this.loadList();
        }
      }
    });
  }
});
