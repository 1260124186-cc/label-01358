const constants = require('../../config/constants');
const dataService = require('../../services/data');
const util = require('../../utils/util');

const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    mode: 'add',
    courseId: '',
    activeTab: 'manual',
    weekDays: constants.WEEK_DAYS,
    weekDayIndex: 0,
    courseTimeSlots: constants.COURSE_TIME_SLOTS,
    startSlotIndex: 0,
    endSlotIndex: 0,
    courseColors: constants.COURSE_COLORS,
    colorIndex: 0,
    formData: {
      name: '',
      teacher: '',
      classroom: '',
      dayOfWeek: 1,
      startSlot: 1,
      endSlot: 2,
      weeks: '1-16周',
      credit: 2,
      semester: '',
      colorIndex: 0
    },
    pasteText: '',
    pasteExample: '高等数学,张教授,A栋301,1,1-2,1-16周,4\n线性代数,李老师,B栋201,2,3-4,1-16周,3\n大学英语,王老师,C栋101,3,5-6,1-16周,2',
    saving: false
  },

  onLoad(options) {
    const { mode, id } = options;
    this.setData({
      mode: mode || 'add',
      courseId: id || ''
    });

    if (this.data.mode === 'import') {
      this.setData({ activeTab: 'paste' });
    }

    if (this.data.mode === 'edit' && id) {
      this.loadCourseDetail(id);
    }

    const currentSemester = dataService.getCurrentSemester();
    this.setData({
      'formData.semester': currentSemester
    });
  },

  loadCourseDetail(id) {
    const detail = dataService.getCourseDetail(id);
    if (detail) {
      const weekDayIndex = constants.WEEK_DAYS.findIndex(d => d.value === detail.dayOfWeek);
      const startSlotIndex = constants.COURSE_TIME_SLOTS.findIndex(s => s.slot === detail.startSlot);
      const endSlotIndex = constants.COURSE_TIME_SLOTS.findIndex(s => s.slot === detail.endSlot);
      this.setData({
        formData: {
          name: detail.name || '',
          teacher: detail.teacher || '',
          classroom: detail.classroom || '',
          dayOfWeek: detail.dayOfWeek || 1,
          startSlot: detail.startSlot || 1,
          endSlot: detail.endSlot || 2,
          weeks: detail.weeks || '1-16周',
          credit: detail.credit || 2,
          semester: detail.semester || dataService.getCurrentSemester(),
          colorIndex: detail.colorIndex || 0
        },
        weekDayIndex: weekDayIndex > -1 ? weekDayIndex : 0,
        startSlotIndex: startSlotIndex > -1 ? startSlotIndex : 0,
        endSlotIndex: endSlotIndex > -1 ? endSlotIndex : 0,
        colorIndex: detail.colorIndex || 0
      });
    }
  },

  onTabChange(e) {
    const { tab } = e.currentTarget.dataset;
    this.setData({ activeTab: tab });
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  onWeekDayChange(e) {
    const index = parseInt(e.detail.value);
    const day = constants.WEEK_DAYS[index];
    this.setData({
      weekDayIndex: index,
      'formData.dayOfWeek': day.value
    });
  },

  onStartSlotChange(e) {
    const index = parseInt(e.detail.value);
    const slot = constants.COURSE_TIME_SLOTS[index];
    let endSlotIndex = this.data.endSlotIndex;
    if (endSlotIndex < index) {
      endSlotIndex = index;
    }
    this.setData({
      startSlotIndex: index,
      endSlotIndex: endSlotIndex,
      'formData.startSlot': slot.slot,
      'formData.endSlot': constants.COURSE_TIME_SLOTS[endSlotIndex].slot
    });
  },

  onEndSlotChange(e) {
    const index = parseInt(e.detail.value);
    const slot = constants.COURSE_TIME_SLOTS[index];
    let startSlotIndex = this.data.startSlotIndex;
    if (startSlotIndex > index) {
      startSlotIndex = index;
    }
    this.setData({
      startSlotIndex: startSlotIndex,
      endSlotIndex: index,
      'formData.startSlot': constants.COURSE_TIME_SLOTS[startSlotIndex].slot,
      'formData.endSlot': slot.slot
    });
  },

  onColorSelect(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({
      colorIndex: index,
      'formData.colorIndex': index
    });
  },

  onWeeksInput(e) {
    this.setData({
      'formData.weeks': e.detail.value
    });
  },

  onCreditChange(e) {
    this.setData({
      'formData.credit': parseFloat(e.detail.value) || 0
    });
  },

  async onSave() {
    const { formData, mode, courseId } = this.data;

    if (!formData.name.trim()) {
      util.showToast('请输入课程名');
      return;
    }
    if (!formData.teacher.trim()) {
      util.showToast('请输入教师姓名');
      return;
    }
    if (!formData.classroom.trim()) {
      util.showToast('请输入教室');
      return;
    }
    if (!formData.weeks.trim()) {
      util.showToast('请输入周次');
      return;
    }

    this.setData({ saving: true });

    try {
      if (mode === 'edit') {
        dataService.updateCourse(courseId, formData);
      } else {
        dataService.addCourse(formData);
      }
      await util.showSuccess(mode === 'edit' ? '更新成功' : '保存成功');
      util.navigateBack();
    } catch (e) {
      util.showError('操作失败');
    } finally {
      this.setData({ saving: false });
    }
  },

  onPasteInput(e) {
    this.setData({
      pasteText: e.detail.value
    });
  },

  async onParseImport() {
    const { pasteText } = this.data;
    if (!pasteText.trim()) {
      util.showToast('请粘贴课程文本');
      return;
    }

    this.setData({ saving: true });

    try {
      const imported = dataService.importCourses(pasteText);
      if (imported.length > 0) {
        await util.showSuccess(`成功导入${imported.length}门课程`);
        util.navigateBack();
      } else {
        util.showError('未解析到有效课程');
      }
    } catch (e) {
      util.showError('导入失败');
    } finally {
      this.setData({ saving: false });
    }
  },

  onScanImport() {
    const self = this;
    wx.scanCode({
      success: (res) => {
        self.setData({ saving: true });
        setTimeout(() => {
          const demoCourses = [
            '高等数学,张教授,A栋301,1,1-2,1-16周,4',
            '线性代数,李老师,B栋201,2,3-4,1-16周,3',
            '大学英语,王老师,C栋101,3,5-6,1-16周,2'
          ].join('\n');
          const imported = dataService.importCourses(demoCourses);
          self.setData({ saving: false });
          if (imported.length > 0) {
            util.showSuccess(`成功导入${imported.length}门课程`).then(() => {
              util.navigateBack();
            });
          }
        }, 800);
      },
      fail: () => {
        self.setData({ saving: true });
        setTimeout(() => {
          const demoCourses = [
            '高等数学,张教授,A栋301,1,1-2,1-16周,4',
            '线性代数,李老师,B栋201,2,3-4,1-16周,3',
            '大学英语,王老师,C栋101,3,5-6,1-16周,2'
          ].join('\n');
          const imported = dataService.importCourses(demoCourses);
          self.setData({ saving: false });
          if (imported.length > 0) {
            util.showSuccess(`成功导入${imported.length}门课程`).then(() => {
              util.navigateBack();
            });
          }
        }, 800);
      }
    });
  }
});
