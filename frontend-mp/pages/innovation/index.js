const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    activeTab: 'projects',
    projectTab: 'all',
    mainTabs: constants.INNOVATION_MAIN_TABS,
    projectTabs: constants.INNOVATION_PROJECT_TABS,
    fieldOptions: constants.INNOVATION_PROJECT_FIELDS,
    mentorTitleOptions: constants.INNOVATION_MENTOR_TITLES,
    policyTypeOptions: constants.INNOVATION_POLICY_TYPES,
    incubatorTypeOptions: constants.INNOVATION_INCUBATOR_TYPES,
    projects: [],
    filteredProjects: [],
    mentors: [],
    filteredMentors: [],
    roadshows: [],
    filteredRoadshows: [],
    policies: [],
    filteredPolicies: [],
    incubators: [],
    filteredIncubators: [],
    selectedField: '',
    selectedMentorTitle: '',
    selectedPolicyType: '',
    selectedIncubatorType: '',
    searchKeyword: '',
    showFieldFilter: false,
    showMentorFilter: false,
    showPolicyFilter: false,
    showIncubatorFilter: false,
    loading: true,
    currentUserId: 'user_1'
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    if (!this.data.loading) {
      this.loadProjects();
      this.loadRoadshows();
    }
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData() {
    this.setData({ loading: true });
    dataService.initAllInnovationData();
    this.loadProjects();
    this.loadMentors();
    this.loadRoadshows();
    this.loadPolicies();
    this.loadIncubators();
    setTimeout(() => {
      this.setData({ loading: false });
    }, 500);
  },

  loadProjects() {
    const filters = {
      keyword: this.data.searchKeyword,
      tab: this.data.projectTab,
      field: this.data.selectedField
    };
    const projects = dataService.getInnovationProjectList(filters).map(item => ({
      ...item,
      fieldInfo: constants.INNOVATION_PROJECT_FIELDS.find(f => f.value === item.field),
      stageInfo: constants.INNOVATION_PROJECT_STAGES.find(s => s.value === item.stage),
      financingInfo: constants.INNOVATION_FINANCING_STAGES.find(f => f.value === item.financingStage),
      statusInfo: constants.INNOVATION_PROJECT_STATUS_MAP[item.status],
      recruitingRoleInfos: (item.recruitingRoles || []).map(r => 
        constants.INNOVATION_TEAM_ROLES.find(role => role.value === r)
      ).filter(Boolean),
      formattedTime: util.formatDate(item.createTime)
    }));
    this.setData({ 
      projects,
      filteredProjects: projects
    });
  },

  loadMentors() {
    const filters = {
      keyword: this.data.searchKeyword,
      title: this.data.selectedMentorTitle
    };
    const mentors = dataService.getInnovationMentorList(filters).map(item => ({
      ...item,
      titleInfo: constants.INNOVATION_MENTOR_TITLES.find(t => t.value === item.title),
      researchAreasText: (item.researchAreas || []).join('、')
    }));
    this.setData({ 
      mentors,
      filteredMentors: mentors
    });
  },

  loadRoadshows() {
    const filters = {
      keyword: this.data.searchKeyword
    };
    const roadshows = dataService.getInnovationRoadshowList(filters).map(item => ({
      ...item,
      statusInfo: constants.INNOVATION_ROADSHOW_STATUS.find(s => s.value === item.status),
      progress: Math.min(100, Math.round((item.registeredCount / item.maxParticipants) * 100)),
      formattedDate: util.formatDate(new Date(item.date).getTime(), 'MM月dd日')
    }));
    this.setData({ 
      roadshows,
      filteredRoadshows: roadshows
    });
  },

  loadPolicies() {
    const filters = {
      keyword: this.data.searchKeyword,
      type: this.data.selectedPolicyType
    };
    const policies = dataService.getInnovationPolicyList(filters).map(item => ({
      ...item,
      typeInfo: constants.INNOVATION_POLICY_TYPES.find(t => t.value === item.type),
      formattedDate: item.publishDate
    }));
    this.setData({ 
      policies,
      filteredPolicies: policies
    });
  },

  loadIncubators() {
    const filters = {
      keyword: this.data.searchKeyword,
      type: this.data.selectedIncubatorType
    };
    const incubators = dataService.getInnovationIncubatorList(filters).map(item => ({
      ...item,
      typeInfo: constants.INNOVATION_INCUBATOR_TYPES.find(t => t.value === item.type)
    }));
    this.setData({ 
      incubators,
      filteredIncubators: incubators
    });
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ activeTab: value });
  },

  onProjectTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ projectTab: value }, () => {
      this.loadProjects();
    });
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value }, () => {
      this.applyFilters();
    });
  },

  applyFilters() {
    switch (this.data.activeTab) {
      case 'projects':
        this.loadProjects();
        break;
      case 'mentors':
        this.loadMentors();
        break;
      case 'roadshows':
        this.loadRoadshows();
        break;
      case 'policies':
        this.loadPolicies();
        this.loadIncubators();
        break;
    }
  },

  onFieldFilterTap() {
    this.setData({ showFieldFilter: true });
  },

  onFieldSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ 
      selectedField: value,
      showFieldFilter: false 
    }, () => {
      this.loadProjects();
    });
  },

  onClearFieldFilter() {
    this.setData({ 
      selectedField: '',
      showFieldFilter: false 
    }, () => {
      this.loadProjects();
    });
  },

  onMentorFilterTap() {
    this.setData({ showMentorFilter: true });
  },

  onMentorTitleSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ 
      selectedMentorTitle: value,
      showMentorFilter: false 
    }, () => {
      this.loadMentors();
    });
  },

  onClearMentorFilter() {
    this.setData({ 
      selectedMentorTitle: '',
      showMentorFilter: false 
    }, () => {
      this.loadMentors();
    });
  },

  onPolicyFilterTap() {
    this.setData({ showPolicyFilter: true });
  },

  onPolicyTypeSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ 
      selectedPolicyType: value,
      showPolicyFilter: false 
    }, () => {
      this.loadPolicies();
    });
  },

  onClearPolicyFilter() {
    this.setData({ 
      selectedPolicyType: '',
      showPolicyFilter: false 
    }, () => {
      this.loadPolicies();
    });
  },

  onIncubatorFilterTap() {
    this.setData({ showIncubatorFilter: true });
  },

  onIncubatorTypeSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ 
      selectedIncubatorType: value,
      showIncubatorFilter: false 
    }, () => {
      this.loadIncubators();
    });
  },

  onClearIncubatorFilter() {
    this.setData({ 
      selectedIncubatorType: '',
      showIncubatorFilter: false 
    }, () => {
      this.loadIncubators();
    });
  },

  onCloseFilter() {
    this.setData({
      showFieldFilter: false,
      showMentorFilter: false,
      showPolicyFilter: false,
      showIncubatorFilter: false
    });
  },

  onProjectTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/innovation/project-detail?id=${id}`
    });
  },

  onPublishTap() {
    wx.navigateTo({
      url: '/pages/innovation/project-publish'
    });
  },

  onMentorTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/innovation/mentor-detail?id=${id}`
    });
  },

  onRoadshowTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/innovation/roadshow-detail?id=${id}`
    });
  },

  onPolicyTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/innovation/policy-detail?id=${id}`
    });
  },

  onIncubatorTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/innovation/incubator-detail?id=${id}`
    });
  },

  onViewMentorsTap() {
    wx.navigateTo({
      url: '/pages/innovation/mentor-list'
    });
  },

  onViewRoadshowsTap() {
    wx.navigateTo({
      url: '/pages/innovation/roadshow-list'
    });
  },

  onViewPoliciesTap() {
    wx.navigateTo({
      url: '/pages/innovation/policy-list'
    });
  },

  onViewIncubatorsTap() {
    wx.navigateTo({
      url: '/pages/innovation/incubator-list'
    });
  },

  stopPropagation() {}
});
