const campusService = require('../../services/campusService');

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false
    },
    title: {
      type: String,
      value: '选择校区'
    },
    showClose: {
      type: Boolean,
      value: true
    },
    required: {
      type: Boolean,
      value: false
    }
  },

  data: {
    campusList: [],
    currentCampusId: null,
    selectedCampusId: null
  },

  observers: {
    'visible': function(val) {
      if (val) {
        this.loadCampusData();
      }
    }
  },

  methods: {
    loadCampusData() {
      const campusList = campusService.getCampusList();
      const currentCampusId = campusService.getCurrentCampusId();
      this.setData({
        campusList,
        currentCampusId,
        selectedCampusId: currentCampusId
      });
    },

    onSelectCampus(e) {
      const { campusId } = e.currentTarget.dataset;
      this.setData({ selectedCampusId: campusId });
    },

    onConfirm() {
      const { selectedCampusId, required } = this.data;
      if (!selectedCampusId) {
        wx.showToast({ title: '请选择校区', icon: 'none' });
        return;
      }

      this.triggerEvent('confirm', { campusId: selectedCampusId });

      if (!required) {
        this.handleClose();
      }
    },

    onClose() {
      if (this.data.required && !this.data.selectedCampusId) {
        wx.showToast({ title: '请先选择校区', icon: 'none' });
        return;
      }
      this.handleClose();
    },

    handleClose() {
      this.setData({ visible: false });
      this.triggerEvent('close');
    },

    onMask() {
      if (this.data.showClose) {
        this.onClose();
      }
    },

    preventTouchMove() {}
  }
});
