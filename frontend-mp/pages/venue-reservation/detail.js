const util = require('../../utils/util');
const constants = require('../../config/constants');
const dataService = require('../../services/data');
const { mixPage } = require('../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    darkMode: false,
    loading: true,
    submitting: false,
    venueId: '',
    venue: null,
    userId: '',
    canBook: false,
    canBookReason: '',
    isStudent: true,
    
    calendarData: [],
    currentMonth: '',
    currentYear: 0,
    currentMonthNum: 0,
    selectedDate: '',
    weekDays: ['日', '一', '二', '三', '四', '五', '六'],
    
    timeSlots: [],
    selectedSlots: [],
    
    formData: {
      appointmentDate: '',
      timeSlots: [],
      participantCount: 1,
      purpose: '',
      contactPhone: ''
    },
    
    participantOptions: [],
    participantIndex: 0,
    minDate: '',
    totalPrice: 0,
    unitPrice: 0
  },

  onLoad(options) {
    const { id } = options;
    const currentUser = app.globalData.userInfo;
    const today = new Date();
    const minDate = util.formatDate(today.getTime());

    this.setData({
      venueId: id,
      userId: currentUser ? currentUser.id : '',
      darkMode: app.globalData.darkMode || false,
      minDate,
      isStudent: currentUser ? currentUser.isStudent !== false : true
    });

    this.loadVenueDetail();
    this.initCalendar();
  },

  onShow() {
    if (this.data.venueId && !this.data.loading) {
      this.loadVenueDetail();
    }
  },

  loadVenueDetail() {
    this.setData({ loading: true });

    try {
      const venue = dataService.getVenueDetail(this.data.venueId);

      if (!venue) {
        util.showToast('场馆不存在');
        setTimeout(() => wx.navigateBack(), 1500);
        return;
      }

      const timeSlots = (venue.openTimeSlots || []).map(slot => {
        const slotInfo = constants.VENUE_TIME_SLOTS.find(s => s.value === slot);
        return slotInfo || { value: slot, label: slot };
      });

      const participantOptions = [];
      for (let i = 1; i <= Math.min(venue.capacity, 20); i++) {
        participantOptions.push(i);
      }

      const bookCheck = dataService.canBookVenue(this.data.userId, venue);

      wx.setNavigationBarTitle({
        title: venue.name
      });

      const unitPrice = this.data.isStudent ? venue.studentPrice : venue.normalPrice;

      this.setData({
        venue,
        timeSlots,
        participantOptions,
        canBook: bookCheck.canBook,
        canBookReason: bookCheck.reason,
        loading: false,
        unitPrice
      });

      if (this.data.selectedDate) {
        this.loadTimeSlotCapacities();
      }
    } catch (error) {
      console.error('加载场馆详情失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
    }
  },

  initCalendar() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    this.generateCalendar(year, month);
  },

  generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const today = new Date();
    const todayStr = util.formatDate(today.getTime());
    
    const calendarData = [];
    let week = [];
    
    for (let i = 0; i < startWeekday; i++) {
      week.push({ day: '', isEmpty: true });
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isPast = dateStr < todayStr;
      const isToday = dateStr === todayStr;
      const isSelected = dateStr === this.data.selectedDate;
      
      week.push({
        day,
        date: dateStr,
        isPast,
        isToday,
        isSelected,
        isEmpty: false
      });
      
      if (week.length === 7) {
        calendarData.push(week);
        week = [];
      }
    }
    
    if (week.length > 0) {
      while (week.length < 7) {
        week.push({ day: '', isEmpty: true });
      }
      calendarData.push(week);
    }
    
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    
    this.setData({
      calendarData,
      currentMonth: `${year}年${monthNames[month]}`,
      currentYear: year,
      currentMonthNum: month
    });
  },

  prevMonth() {
    let year = this.data.currentYear;
    let month = this.data.currentMonthNum;
    
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
    
    const today = new Date();
    const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const targetMonth = new Date(year, month, 1);
    
    if (targetMonth < minMonth) {
      util.showToast('不能选择过去的月份');
      return;
    }
    
    this.generateCalendar(year, month);
  },

  nextMonth() {
    let year = this.data.currentYear;
    let month = this.data.currentMonthNum;
    
    month++;
    if (month > 11) {
      month = 0;
      year++;
    }
    
    this.generateCalendar(year, month);
  },

  onDateTap(e) {
    const { date } = e.currentTarget.dataset;
    if (!date) return;
    
    const today = new Date();
    const todayStr = util.formatDate(today.getTime());
    
    if (date < todayStr) {
      util.showToast('不能选择过去的日期');
      return;
    }
    
    this.setData({
      selectedDate: date,
      'formData.appointmentDate': date,
      selectedSlots: [],
      'formData.timeSlots': [],
      totalPrice: 0
    }, () => {
      this.generateCalendar(this.data.currentYear, this.data.currentMonthNum);
      this.loadTimeSlotCapacities();
    });
  },

  loadTimeSlotCapacities() {
    const { venueId, selectedDate, timeSlots } = this.data;
    if (!selectedDate || !venueId) return;

    const slotsWithCapacity = timeSlots.map(slot => {
      const capacity = dataService.getVenueTimeSlotCapacity(
        venueId,
        selectedDate,
        slot.value
      );
      return {
        ...slot,
        capacity: capacity.capacity,
        used: capacity.used,
        available: capacity.available,
        isAvailable: capacity.available > 0
      };
    });

    this.setData({ timeSlots: slotsWithCapacity });
  },

  onTimeSlotTap(e) {
    const { value } = e.currentTarget.dataset;
    const slot = this.data.timeSlots.find(s => s.value === value);
    
    if (!slot || !slot.isAvailable) {
      util.showToast('该时段已约满');
      return;
    }

    let selectedSlots = [...this.data.selectedSlots];
    const index = selectedSlots.indexOf(value);
    
    if (index > -1) {
      selectedSlots.splice(index, 1);
    } else {
      selectedSlots.push(value);
    }
    
    selectedSlots.sort((a, b) => {
      const slotA = constants.VENUE_TIME_SLOTS.find(s => s.value === a);
      const slotB = constants.VENUE_TIME_SLOTS.find(s => s.value === b);
      return (slotA?.startMinute || 0) - (slotB?.startMinute || 0);
    });

    const totalPrice = selectedSlots.length * this.data.unitPrice;

    this.setData({
      selectedSlots,
      'formData.timeSlots': selectedSlots,
      totalPrice
    });
  },

  onParticipantChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({
      participantIndex: index,
      'formData.participantCount': this.data.participantOptions[index]
    });
  },

  onPurposeInput(e) {
    this.setData({ 'formData.purpose': e.detail.value });
  },

  onContactPhoneInput(e) {
    this.setData({ 'formData.contactPhone': e.detail.value });
  },

  togglePriceType() {
    if (!this.data.venue) return;
    
    const isStudent = !this.data.isStudent;
    const unitPrice = isStudent ? this.data.venue.studentPrice : this.data.venue.normalPrice;
    const totalPrice = this.data.selectedSlots.length * unitPrice;
    
    this.setData({
      isStudent,
      unitPrice,
      totalPrice
    });
  },

  validateForm() {
    const { formData, venue, selectedSlots } = this.data;

    if (!formData.appointmentDate) {
      util.showToast('请选择预约日期');
      return false;
    }

    if (selectedSlots.length === 0) {
      util.showToast('请选择预约时段');
      return false;
    }

    if (formData.participantCount > venue.capacity) {
      util.showToast(`预约人数不能超过容量${venue.capacity}人`);
      return false;
    }

    if (!formData.purpose.trim()) {
      util.showToast('请填写使用目的');
      return false;
    }

    if (!formData.contactPhone.trim()) {
      util.showToast('请填写联系电话');
      return false;
    }

    const phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(formData.contactPhone.trim())) {
      util.showToast('请输入正确的手机号');
      return false;
    }

    return true;
  },

  onSubmit() {
    if (!this.data.userId) {
      util.showToast('请先登录');
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/login/index' });
      }, 1500);
      return;
    }

    if (!this.data.canBook) {
      util.showToast(this.data.canBookReason || '不可预约');
      return;
    }

    if (!this.validateForm()) return;

    this.setData({ submitting: true });

    try {
      const appointment = dataService.createVenueAppointment({
        userId: this.data.userId,
        venueId: this.data.venueId,
        appointmentDate: this.data.formData.appointmentDate,
        timeSlots: this.data.selectedSlots,
        slotCount: this.data.selectedSlots.length,
        participantCount: this.data.formData.participantCount,
        purpose: this.data.formData.purpose.trim(),
        contactPhone: this.data.formData.contactPhone.trim(),
        isStudent: this.data.isStudent
      });

      if (appointment) {
        if (this.data.venue.needApproval) {
          util.showSuccess('预约提交成功，等待审批');
        } else {
          util.showSuccess('预约成功');
        }
        setTimeout(() => {
          wx.redirectTo({ url: '/pages/venue-reservation/my-appointments' });
        }, 1500);
      } else {
        util.showToast('提交失败，请稍后重试');
      }
    } catch (error) {
      console.error('提交预约失败:', error);
      util.showToast('提交失败，请稍后重试');
    } finally {
      this.setData({ submitting: false });
    }
  },

  goBack() {
    wx.navigateBack();
  }
});
