const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const fileUtil = require('../../utils/file');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    houseId: '',
    house: null,
    loading: true,
    currentImageIndex: 0,
    showReportModal: false,
    reportReason: '',
    reportReasons: ['虚假房源', '中介冒充个人', '价格欺诈', '图片与实际不符', '其他'],
    reportReasonIndex: -1,
    isFavorite: false,
    isInCompare: false,
    reportCount: 0,
    showAppointmentModal: false,
    appointmentDate: '',
    appointmentTimeSlot: '',
    appointmentMessage: '',
    appointmentPhone: '',
    timeSlots: constants.RENTAL_VIEWING_TIME_SLOTS,
    timeSlotIndex: -1,
    dateList: [],
    dateIndex: 0,
    hasPendingAppointment: false,
    isPublisher: false
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.setData({ houseId: id });
      this.initDateList();
      this.loadDetail();
    } else {
      util.showError('房源不存在');
      wx.navigateBack();
    }
  },

  initDateList() {
    const dateList = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const weekDay = weekDays[date.getDay()];
      const dateStr = `${date.getFullYear()}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dateList.push({
        value: dateStr,
        label: i === 0 ? '今天' : (i === 1 ? '明天' : `${month}/${day}`),
        subLabel: weekDay
      });
    }
    this.setData({
      dateList,
      appointmentDate: dateList[0].value
    });
  },

  loadDetail() {
    this.setData({ loading: true });

    try {
      const house = dataService.getRentalDetail(this.data.houseId);
      if (!house) {
        util.showError('房源不存在');
        wx.navigateBack();
        return;
      }

      const app = getApp();
      const userInfo = app.globalData.userInfo || {};
      const isPublisher = house.publisherId === userInfo.id;
      const hasPendingAppointment = dataService.hasPendingAppointment(this.data.houseId, userInfo.id || 'anonymous');

      const publisherTypeInfo = constants.RENTAL_PUBLISHER_TYPES.find(t => t.value === house.publisherType);
      const facilityLabels = (house.facilities || []).map(f => {
        const facility = constants.RENTAL_FACILITIES.find(fa => fa.value === f);
        return facility ? { label: facility.label, icon: facility.icon } : { label: f, icon: '' };
      });

      const reportCount = dataService.getAgentReports().filter(r => r.houseId === this.data.houseId).length;

      const formattedHouse = {
        ...house,
        rentText: util.formatPrice(house.rent),
        depositText: util.formatPrice(house.deposit),
        locationTypeText: constants.getLabelByValue(constants.RENTAL_LOCATION_TYPES, house.locationType),
        houseTypeText: constants.getLabelByValue(constants.RENTAL_HOUSE_TYPES, house.houseType),
        rentTypeText: constants.getLabelByValue(constants.RENTAL_RENT_TYPES, house.rentType),
        genderText: constants.getLabelByValue(constants.RENTAL_GENDER_REQUIREMENTS, house.genderRequirement),
        leaseTermText: constants.getLabelByValue(constants.RENTAL_LEASE_TERMS, house.leaseTerm),
        statusText: constants.getLabelByValue(constants.RENTAL_STATUS, house.status),
        publisherTypeText: publisherTypeInfo ? publisherTypeInfo.label : '',
        publisherTypeColor: publisherTypeInfo ? publisherTypeInfo.color : '',
        distanceText: house.distance < 1000 ? house.distance + '米' : (house.distance / 1000).toFixed(1) + '公里',
        timeText: util.relativeTime(house.createTime),
        facilityLabels
      };

      this.setData({
        house: formattedHouse,
        isFavorite: dataService.isFavorite(this.data.houseId, 'rental'),
        isInCompare: dataService.isInCompareList(this.data.houseId),
        reportCount,
        isPublisher,
        hasPendingAppointment,
        loading: false
      });
    } catch (e) {
      util.showError('加载失败');
      this.setData({ loading: false });
    }
  },

  onImageSwiperChange(e) {
    this.setData({
      currentImageIndex: e.detail.current
    });
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    const urls = this.data.house.images;
    fileUtil.previewImage(urls, urls[index]);
  },

  onToggleFavorite() {
    if (!this.data.house) return;

    const result = dataService.toggleFavorite(this.data.houseId, 'rental', {
      id: this.data.house.id,
      title: this.data.house.title,
      cover: this.data.house.images[0] || '',
      price: this.data.house.rent,
      type: 'rental'
    });

    this.setData({
      isFavorite: result.isFavorite
    });

    util.showToast(result.isFavorite ? '已收藏' : '已取消收藏');
  },

  onToggleCompare() {
    if (!this.data.house) return;

    if (this.data.isInCompare) {
      dataService.removeFromCompare(this.data.houseId);
      this.setData({ isInCompare: false });
      util.showToast('已移出对比');
    } else {
      const result = dataService.addToCompare({
        id: this.data.house.id,
        title: this.data.house.title,
        images: this.data.house.images,
        rent: this.data.house.rent,
        area: this.data.house.area,
        houseType: this.data.house.houseType,
        locationType: this.data.house.locationType,
        rentType: this.data.house.rentType,
        facilities: this.data.house.facilities,
        distance: this.data.house.distance,
        deposit: this.data.house.deposit,
        genderRequirement: this.data.house.genderRequirement,
        leaseTerm: this.data.house.leaseTerm,
        publisherType: this.data.house.publisherType
      });

      if (result.success) {
        this.setData({ isInCompare: true });
        util.showToast('已加入对比');
      } else {
        util.showToast(result.message || '添加失败');
      }
    }
  },

  onCallPhone() {
    if (!this.data.house || !this.data.house.contactPhone) return;

    wx.makePhoneCall({
      phoneNumber: this.data.house.contactPhone,
      fail: () => {
        util.showToast('拨号失败');
      }
    });
  },

  onCopyWechat() {
    if (!this.data.house || !this.data.house.contactPhone) return;

    wx.setClipboardData({
      data: this.data.house.contactPhone,
      success: () => {
        util.showToast('手机号已复制');
      }
    });
  },

  onShowReportModal() {
    this.setData({
      showReportModal: true,
      reportReason: '',
      reportReasonIndex: -1
    });
  },

  onHideReportModal() {
    this.setData({ showReportModal: false });
  },

  onReportReasonChange(e) {
    const index = e.detail.value;
    this.setData({
      reportReasonIndex: index,
      reportReason: this.data.reportReasons[index]
    });
  },

  onReportInput(e) {
    this.setData({ reportReason: e.detail.value });
  },

  onSubmitReport() {
    if (this.data.reportReasonIndex === -1 && !this.data.reportReason.trim()) {
      util.showToast('请选择或填写举报理由');
      return;
    }

    try {
      const result = dataService.reportAgent(this.data.houseId, this.data.reportReason);

      if (result.publisherTypeChanged) {
        util.showSuccess('举报成功，该房源已被标记为中介');
        this.loadDetail();
      } else {
        util.showSuccess('举报成功，我们会尽快核实');
      }

      this.setData({ showReportModal: false });
    } catch (e) {
      util.showError('举报失败，请重试');
    }
  },

  onOpenLocation() {
    if (!this.data.house) return;

    wx.openLocation({
      latitude: this.data.house.latitude,
      longitude: this.data.house.longitude,
      name: this.data.house.title,
      address: this.data.house.address,
      scale: 16,
      fail: () => {
        util.showToast('打开地图失败');
      }
    });
  },

  onShareAppMessage() {
    if (!this.data.house) return {};

    return {
      title: this.data.house.title,
      path: `/pages/rental-detail/index?id=${this.data.houseId}`,
      imageUrl: this.data.house.images[0] || ''
    };
  },

  onShowAppointmentModal() {
    if (!util.checkLogin()) return;

    if (this.data.hasPendingAppointment) {
      util.showToast('您已有待处理的看房预约');
      return;
    }

    this.setData({
      showAppointmentModal: true,
      appointmentMessage: '',
      appointmentPhone: '',
      timeSlotIndex: -1
    });
  },

  onHideAppointmentModal() {
    this.setData({ showAppointmentModal: false });
  },

  onDateSelect(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({
      dateIndex: index,
      appointmentDate: this.data.dateList[index].value
    });
  },

  onTimeSlotSelect(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({
      timeSlotIndex: index,
      appointmentTimeSlot: this.data.timeSlots[index].value
    });
  },

  onAppointmentPhoneInput(e) {
    this.setData({ appointmentPhone: e.detail.value });
  },

  onAppointmentMessageInput(e) {
    this.setData({ appointmentMessage: e.detail.value });
  },

  onSubmitAppointment() {
    if (!this.data.appointmentDate) {
      util.showToast('请选择看房日期');
      return;
    }
    if (this.data.timeSlotIndex === -1) {
      util.showToast('请选择看房时间');
      return;
    }
    if (!this.data.appointmentPhone.trim()) {
      util.showToast('请填写联系电话');
      return;
    }

    const result = dataService.createViewingAppointment({
      houseId: this.data.houseId,
      date: this.data.appointmentDate,
      timeSlot: this.data.appointmentTimeSlot,
      message: this.data.appointmentMessage,
      userPhone: this.data.appointmentPhone
    });

    if (result.success) {
      util.showSuccess('预约提交成功');
      this.setData({
        showAppointmentModal: false,
        hasPendingAppointment: true
      });
    } else {
      util.showError(result.message || '预约失败');
    }
  },

  onGoToContractHelper() {
    util.navigateTo('/pages/rental-contract-helper/index');
  },

  onGoToManage() {
    util.navigateTo('/pages/rental-appointment-manage/index');
  },

  stopPropagation() {}
});
