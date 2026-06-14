const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    totalCount: 0,
    distribution: [],
    selectedIndustry: '',
    selectedIndustryInfo: null,
    alumniList: [],
    collegeOptions: constants.ALUMNI_COLLEGES,
    yearOptions: constants.ALUMNI_GRADUATION_YEARS,
    industryOptions: constants.ALUMNI_INDUSTRIES,
    selectedCollege: '',
    selectedYear: '',
    showCollegeFilter: false,
    showYearFilter: false,
    showIndustryFilter: false,
    loading: true,
    showList: false
  },

  onLoad(options) {
    const selectedIndustry = options.industry || '';
    this.setData({ selectedIndustry }, () => {
      this.loadData();
    });
  },

  onShow() {
    if (!this.data.loading) {
      this.loadDistribution();
      this.loadAlumniList();
    }
  },

  onPullDownRefresh() {
    this.loadData();
    wx.stopPullDownRefresh();
  },

  loadData() {
    this.setData({ loading: true });
    dataService.initAllAlumniData();
    this.loadDistribution();
    this.loadAlumniList();
    setTimeout(() => {
      this.setData({ loading: false });
    }, 500);
  },

  loadDistribution() {
    const result = dataService.getAlumniIndustryDistribution();
    const distribution = result.distribution.map(item => {
      const industryInfo = constants.ALUMNI_INDUSTRY_MAP[item.value];
      return {
        ...item,
        icon: industryInfo ? industryInfo.icon : '',
        color: item.color || (industryInfo ? industryInfo.color : '#6B7280')
      };
    });
    this.setData({
      totalCount: result.total,
      distribution
    });
  },

  loadAlumniList() {
    const filters = {};
    if (this.data.selectedIndustry) {
      filters.industry = this.data.selectedIndustry;
    }
    if (this.data.selectedCollege) {
      filters.college = this.data.selectedCollege;
    }
    if (this.data.selectedYear) {
      filters.graduationYear = this.data.selectedYear;
    }

    const list = dataService.getAlumniProfileList(filters).map(item => ({
      ...item,
      industryInfo: constants.ALUMNI_INDUSTRY_MAP[item.industry],
      collegeInfo: constants.ALUMNI_COLLEGES.find(c => c.value === item.college)
    }));

    const selectedIndustryInfo = this.data.selectedIndustry
      ? constants.ALUMNI_INDUSTRY_MAP[this.data.selectedIndustry]
      : null;

    this.setData({
      alumniList: list,
      selectedIndustryInfo,
      showList: this.data.selectedIndustry !== ''
    });
  },

  onIndustryTap(e) {
    const { value } = e.currentTarget.dataset;
    const newIndustry = this.data.selectedIndustry === value ? '' : value;
    this.setData({
      selectedIndustry: newIndustry,
      selectedCollege: '',
      selectedYear: ''
    }, () => {
      this.loadAlumniList();
    });
  },

  onBackToList() {
    this.setData({
      selectedIndustry: '',
      showList: false,
      selectedCollege: '',
      selectedYear: ''
    });
  },

  onCollegeFilterTap() {
    this.setData({ showCollegeFilter: true });
  },

  onCollegeSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      selectedCollege: value,
      showCollegeFilter: false
    }, () => {
      this.loadAlumniList();
    });
  },

  onClearCollegeFilter() {
    this.setData({
      selectedCollege: '',
      showCollegeFilter: false
    }, () => {
      this.loadAlumniList();
    });
  },

  onYearFilterTap() {
    this.setData({ showYearFilter: true });
  },

  onYearSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      selectedYear: value,
      showYearFilter: false
    }, () => {
      this.loadAlumniList();
    });
  },

  onClearYearFilter() {
    this.setData({
      selectedYear: '',
      showYearFilter: false
    }, () => {
      this.loadAlumniList();
    });
  },

  onIndustryFilterTap() {
    this.setData({ showIndustryFilter: true });
  },

  onIndustryFilterSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      selectedIndustry: value,
      showIndustryFilter: false
    }, () => {
      this.loadAlumniList();
    });
  },

  onClearIndustryFilter() {
    this.setData({
      selectedIndustry: '',
      showIndustryFilter: false
    }, () => {
      this.loadAlumniList();
    });
  },

  onCloseFilter() {
    this.setData({
      showCollegeFilter: false,
      showYearFilter: false,
      showIndustryFilter: false
    });
  },

  onAlumniTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/alumni/profile-detail?id=${id}`
    });
  },

  stopPropagation() {}
});
