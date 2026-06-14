const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');

Page({
  data: {
    darkMode: false,
    tabs: constants.COURSE_ASSISTANT_TABS,
    activeTab: 'plan',

    weekDays: constants.WEEK_DAYS,
    timeSlots: constants.COURSE_TIME_SLOTS,
    courseColors: constants.COURSE_COLORS,
    courseTypes: constants.COURSE_TYPES,
    courseStatuses: constants.COURSE_STATUS,
    semesterOptions: [],
    categoryOptions: [],

    settings: null,
    currentSemester: '3',
    currentPlanId: 'plan_cs_2024',
    maxCredits: constants.DEFAULT_MAX_CREDITS,
    minCredits: constants.DEFAULT_MIN_CREDITS,

    planDetail: null,
    planProgress: null,
    planCourses: [],
    filteredPlanCourses: [],
    categoryFilter: 'all',
    statusFilter: 'all',
    searchKeyword: '',
    showSearch: false,

    selectedCourses: [],
    selectedCredits: 0,
    weekCourses: {},

    showCourseModal: false,
    selectedPlanCourse: null,
    selectedClassIndex: 0,
    conflictCheckResult: null,

    showReviewModal: false,
    reviewCourse: null,
    courseReviews: [],
    reviewStats: null,
    forumPosts: [],

    showStatusPicker: false,
    statusPickerCourse: null,

    draggingCourse: null,
    dragStartX: 0,
    dragStartY: 0,
    dragCurrentX: 0,
    dragCurrentY: 0,
    isDragging: false
  },

  onLoad() {
    dataService.initCourseAssistantData();
    const settings = dataService.getCourseAssistantSettings();
    const semesterOptions = dataService.getSemesterOptions();
    const categoryOptions = dataService.getCategoryOptions();
    this.setData({
      settings,
      currentSemester: settings.currentSemester,
      currentPlanId: settings.currentPlanId,
      maxCredits: settings.maxCredits,
      minCredits: settings.minCredits,
      semesterOptions,
      categoryOptions
    });
    this.loadAllData();
  },

  onShow() {
    this.loadThemeState();
    if (this.data.activeTab === 'schedule') {
      this.loadSelectedCourses();
    } else if (this.data.activeTab === 'plan') {
      this.loadPlanCourses();
    }
  },

  loadThemeState() {
    const app = getApp();
    const { isDark } = app.globalData;
    this.setData({ darkMode: isDark || false });
  },

  loadAllData() {
    this.loadPlanDetail();
    this.loadPlanProgress();
    this.loadPlanCourses();
    this.loadSelectedCourses();
  },

  loadPlanDetail() {
    const planDetail = dataService.getTrainingPlanDetail(this.data.currentPlanId);
    this.setData({ planDetail });
  },

  loadPlanProgress() {
    const planProgress = dataService.calculateTrainingPlanProgress(this.data.currentPlanId);
    this.setData({ planProgress });
  },

  loadPlanCourses() {
    const filters = {
      planId: this.data.currentPlanId,
      type: this.data.categoryFilter !== 'all' ? this.data.categoryFilter : null,
      status: this.data.statusFilter !== 'all' ? this.data.statusFilter : null,
      keyword: this.data.searchKeyword
    };
    const planCourses = dataService.getTrainingPlanCourses(filters);
    const formattedCourses = planCourses.map(course => {
      const typeInfo = constants.COURSE_TYPE_MAP[course.type] || {};
      const statusInfo = constants.COURSE_STATUS_MAP[course.status] || {};
      return {
        ...course,
        typeLabel: typeInfo.label,
        typeColor: typeInfo.color,
        statusLabel: statusInfo.label,
        statusColor: statusInfo.color
      };
    });
    this.setData({
      planCourses,
      filteredPlanCourses: formattedCourses
    });
  },

  loadSelectedCourses() {
    const selectedCourses = dataService.getSelectedCoursesBySemester(this.data.currentSemester);
    const selectedCredits = dataService.calculateSelectedCredits(this.data.currentSemester);
    const weekCourses = dataService.getSelectedCoursesByWeek(this.data.currentSemester);
    this.setData({
      selectedCourses,
      selectedCredits,
      weekCourses: this.processWeekCourses(weekCourses)
    });
  },

  processWeekCourses(weekCourses) {
    const result = {};
    for (let day = 1; day <= 7; day++) {
      result[day] = [];
      const courses = weekCourses[day] || [];
      const slotMap = {};
      courses.forEach(course => {
        const color = constants.COURSE_COLORS[course.colorIndex % constants.COURSE_COLORS.length];
        const slotSpan = course.selectedClass.endSlot - course.selectedClass.startSlot + 1;
        const slotLabel = course.selectedClass.startSlot === course.selectedClass.endSlot
          ? `第${course.selectedClass.startSlot}节`
          : `第${course.selectedClass.startSlot}-${course.selectedClass.endSlot}节`;
        for (let s = course.selectedClass.startSlot; s <= course.selectedClass.endSlot; s++) {
          slotMap[s] = course.id;
        }
        result[day].push({
          ...course,
          color,
          slotSpan,
          slotLabel,
          topIndex: course.selectedClass.startSlot - 1
        });
      });
      result[day].slotMap = slotMap;
    }
    return result;
  },

  onTabChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ activeTab: value });
    if (value === 'plan') {
      this.loadPlanCourses();
    } else if (value === 'schedule') {
      this.loadSelectedCourses();
    }
  },

  onSemesterChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ currentSemester: value });
    dataService.updateCourseAssistantSettings({ currentSemester: value });
    this.loadSelectedCourses();
  },

  onCategoryFilterChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ categoryFilter: value });
    this.loadPlanCourses();
  },

  onStatusFilterChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ statusFilter: value });
    this.loadPlanCourses();
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
    this.loadPlanCourses();
  },

  onToggleSearch() {
    this.setData({
      showSearch: !this.data.showSearch,
      searchKeyword: ''
    });
    if (!this.data.showSearch) {
      this.loadPlanCourses();
    }
  },

  onPlanCourseTap(e) {
    const { course } = e.currentTarget.dataset;
    const planCourse = dataService.getTrainingPlanCourseDetail(course.id);
    if (this.data.activeTab === 'plan') {
      this.setData({
        statusPickerCourse: planCourse,
        showStatusPicker: true
      });
    } else if (this.data.activeTab === 'schedule' && planCourse.status !== 'completed') {
      this.openCourseSelectModal(planCourse);
    }
  },

  openCourseSelectModal(planCourse) {
    const selectedCourses = dataService.getSelectedCoursesBySemester(this.data.currentSemester);
    const planCourses = dataService.getTrainingPlanCourses({ planId: this.data.currentPlanId });
    const selectedClass = planCourse.availableClasses && planCourse.availableClasses.length > 0
      ? planCourse.availableClasses[0]
      : null;

    const conflictResult = dataService.checkAllConflicts(
      planCourses,
      selectedCourses,
      planCourse,
      selectedClass,
      this.data.currentSemester,
      this.data.maxCredits
    );

    this.setData({
      selectedPlanCourse: planCourse,
      selectedClassIndex: 0,
      conflictCheckResult: conflictResult,
      showCourseModal: true
    });
  },

  onClassSelect(e) {
    const { index } = e.currentTarget.dataset;
    const planCourse = this.data.selectedPlanCourse;
    const selectedClass = planCourse.availableClasses[index];
    const selectedCourses = dataService.getSelectedCoursesBySemester(this.data.currentSemester);
    const planCourses = dataService.getTrainingPlanCourses({ planId: this.data.currentPlanId });

    const conflictResult = dataService.checkAllConflicts(
      planCourses,
      selectedCourses,
      planCourse,
      selectedClass,
      this.data.currentSemester,
      this.data.maxCredits
    );

    this.setData({
      selectedClassIndex: index,
      conflictCheckResult: conflictResult
    });
  },

  onConfirmSelect() {
    const { selectedPlanCourse, selectedClassIndex, conflictCheckResult } = this.data;
    if (!selectedPlanCourse) return;

    if (conflictCheckResult.hasError) {
      util.showToast('存在严重冲突，无法选择');
      return;
    }

    const selectedClass = selectedPlanCourse.availableClasses[selectedClassIndex];
    const success = dataService.addSelectedCourse(
      selectedPlanCourse,
      selectedClass,
      this.data.currentSemester
    );

    if (success) {
      util.showSuccess('选课成功');
      this.onCloseCourseModal();
      this.loadSelectedCourses();
    } else {
      util.showToast('选课失败');
    }
  },

  onRemoveSelectedCourse(e) {
    const { id } = e.currentTarget.dataset;
    util.showConfirm('确定要移除这门课程吗？', '移除确认').then(confirm => {
      if (confirm) {
        const success = dataService.removeSelectedCourse(id);
        if (success) {
          util.showSuccess('已移除');
          this.loadSelectedCourses();
        }
      }
    });
  },

  onClearSelected() {
    util.showConfirm('确定要清空当前学期的所有选课吗？', '清空确认').then(confirm => {
      if (confirm) {
        dataService.clearSelectedCourses(this.data.currentSemester);
        util.showSuccess('已清空');
        this.loadSelectedCourses();
      }
    });
  },

  onSyncToSchedule() {
    util.showConfirm('将当前选课同步到课程表？', '同步确认').then(confirm => {
      if (confirm) {
        dataService.syncSelectedToSchedule(this.data.currentSemester);
        util.showSuccess('同步成功');
      }
    });
  },

  onCloseCourseModal() {
    this.setData({
      showCourseModal: false,
      selectedPlanCourse: null,
      conflictCheckResult: null
    });
  },

  onStatusSelect(e) {
    const { status } = e.currentTarget.dataset;
    const course = this.data.statusPickerCourse;
    if (!course) return;

    const statusMap = {
      pending: '待修',
      studying: '在修',
      completed: '已修',
      failed: '挂科'
    };

    if (status === 'completed' || status === 'failed') {
      wx.showModal({
        title: '输入成绩',
        editable: true,
        placeholderText: '请输入0-100的分数',
        success: (res) => {
          if (res.confirm) {
            const score = parseInt(res.content);
            if (!isNaN(score) && score >= 0 && score <= 100) {
              dataService.updateTrainingPlanCourseStatus(course.id, status, score);
              util.showSuccess(`已标记为${statusMap[status]}`);
              this.onCloseStatusPicker();
              this.loadPlanCourses();
              this.loadPlanProgress();
            } else {
              util.showToast('请输入有效分数');
            }
          }
        }
      });
    } else {
      dataService.updateTrainingPlanCourseStatus(course.id, status);
      util.showSuccess(`已标记为${statusMap[status]}`);
      this.onCloseStatusPicker();
      this.loadPlanCourses();
      this.loadPlanProgress();
    }
  },

  onCloseStatusPicker() {
    this.setData({
      showStatusPicker: false,
      statusPickerCourse: null
    });
  },

  onViewReviews(e) {
    const { course } = e.currentTarget.dataset;
    const reviews = dataService.getCourseReviews({ courseCode: course.courseCode });
    const stats = dataService.getCourseReviewStats(course.courseCode);
    const forumPosts = dataService.getForumCoursePosts(course.name);

    const formattedReviews = reviews.map(review => ({
      ...review,
      timeText: util.relativeTime(review.createTime),
      difficultyLabel: this.getDifficultyLabel(review.difficulty),
      workloadLabel: this.getWorkloadLabel(review.workload)
    }));

    this.setData({
      reviewCourse: course,
      courseReviews: formattedReviews,
      reviewStats: stats,
      forumPosts,
      showReviewModal: true
    });
  },

  getDifficultyLabel(difficulty) {
    const map = {
      very_easy: '非常简单',
      easy: '简单',
      medium: '适中',
      hard: '困难',
      very_hard: '非常困难'
    };
    return map[difficulty] || difficulty;
  },

  getWorkloadLabel(workload) {
    const map = {
      very_light: '非常轻松',
      light: '轻松',
      medium: '适中',
      heavy: '繁重',
      very_heavy: '非常繁重'
    };
    return map[workload] || workload;
  },

  onCloseReviewModal() {
    this.setData({
      showReviewModal: false,
      reviewCourse: null,
      courseReviews: [],
      reviewStats: null,
      forumPosts: []
    });
  },

  onLikeReview(e) {
    const { id } = e.currentTarget.dataset;
    dataService.likeCourseReview(id);
    const reviews = this.data.courseReviews.map(r =>
      r.id === id ? { ...r, likes: r.likes + 1 } : r
    );
    this.setData({ courseReviews: reviews });
  },

  onForumPostTap(e) {
    const { id } = e.currentTarget.dataset;
    util.navigateTo(`/pages/forum/detail/index?id=${id}`);
  },

  onCourseTap(e) {
    const { course } = e.currentTarget.dataset;
    wx.showModal({
      title: course.name,
      content: `${course.teacher}\n${course.classroom}\n${course.slotLabel}\n${course.weeks}`,
      showCancel: false
    });
  },

  onImportPlan() {
    wx.showActionSheet({
      itemList: ['从剪贴板导入', '选择文件导入', '使用示例数据'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.getClipboardData({
            success: (res) => {
              try {
                const courses = JSON.parse(res.data);
                if (Array.isArray(courses)) {
                  const imported = dataService.importTrainingPlanCourses(courses, this.data.currentPlanId);
                  util.showSuccess(`成功导入${imported.length}门课程`);
                  this.loadPlanCourses();
                } else {
                  util.showToast('数据格式错误');
                }
              } catch (e) {
                util.showToast('解析失败');
              }
            }
          });
        } else if (res.tapIndex === 2) {
          util.showSuccess('已加载示例数据');
          this.loadPlanCourses();
        }
      }
    });
  },

  onCourseTouchStart(e) {
    const { course } = e.currentTarget.dataset;
    if (course.status === 'completed') {
      util.showToast('已修课程不可选择');
      return;
    }
    const touch = e.touches[0];
    this.setData({
      draggingCourse: course,
      dragStartX: touch.clientX,
      dragStartY: touch.clientY,
      dragCurrentX: touch.clientX,
      dragCurrentY: touch.clientY,
      isDragging: true
    });
  },

  onCourseTouchMove(e) {
    if (!this.data.isDragging) return;
    const touch = e.touches[0];
    this.setData({
      dragCurrentX: touch.clientX,
      dragCurrentY: touch.clientY
    });
  },

  onCourseTouchEnd(e) {
    if (!this.data.isDragging) return;

    const { draggingCourse, dragCurrentX, dragCurrentY } = this.data;
    const query = wx.createSelectorQuery();

    query.select('.schedule-grid').boundingClientRect((rect) => {
      if (rect && dragCurrentX >= rect.left && dragCurrentX <= rect.right &&
          dragCurrentY >= rect.top && dragCurrentY <= rect.bottom) {
        this.openCourseSelectModal(draggingCourse);
      }
    }).exec();

    this.setData({
      draggingCourse: null,
      isDragging: false
    });
  },

  preventDefault() {}
});
