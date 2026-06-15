const util = require('../../../utils/util');
const constants = require('../../../config/constants');
const dataService = require('../../../services/data');
const { mixPage } = require('../../../utils/withTheme');
const app = getApp();

mixPage({
  data: {
    darkMode: false,
    loading: true,
    userId: 'user_001',
    activeType: 'all',
    roomTypes: constants.LIBRARY_READING_ROOM_TYPES,
    timeSlots: constants.LIBRARY_SEAT_TIME_SLOTS,
    seatStatusList: constants.LIBRARY_SEAT_STATUS,
    roomList: [],
    selectedRoom: null,
    selectedDate: '',
    dateOptions: [],
    activeTimeSlot: '',
    seatRows: {},
    seatRowKeys: [],
    selectedSeat: null,
    showSeatModal: false
  },

  onLoad() {
    const currentUser = app.globalData.userInfo;
    this.setData({
      userId: currentUser ? currentUser.id : 'user_001',
      darkMode: app.globalData.isDark || false
    });
    this.initDateOptions();
    this.loadRoomList();
  },

  onShow() {
    if (!this.data.loading) {
      this.loadRoomList();
    }
  },

  onPullDownRefresh() {
    this.loadRoomList(() => {
      wx.stopPullDownRefresh();
    });
  },

  initDateOptions() {
    const options = [];
    const today = new Date();
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today.getTime() + i * 86400000);
      const month = d.getMonth() + 1;
      const day = d.getDate();
      const dateStr = `${d.getFullYear()}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      let label = `${month}/${day}`;
      if (i === 0) label = '今天';
      else if (i === 1) label = '明天';
      else label += ` ${weekDays[d.getDay()]}`;
      options.push({ value: dateStr, label });
    }
    this.setData({
      dateOptions: options,
      selectedDate: options[0].value,
      activeTimeSlot: constants.LIBRARY_SEAT_TIME_SLOTS[0].value
    });
  },

  loadRoomList(callback) {
    this.setData({ loading: true });
    try {
      const roomList = dataService.getLibraryReadingRoomList({ type: this.data.activeType });
      this.setData({
        roomList,
        loading: false
      });
      if (callback) callback();
    } catch (error) {
      console.error('加载阅览室列表失败:', error);
      util.showToast('加载失败');
      this.setData({ loading: false });
      if (callback) callback();
    }
  },

  onTypeChange(e) {
    const { value } = e.currentTarget.dataset;
    if (value === this.data.activeType) return;
    this.setData({ activeType: value }, () => {
      this.loadRoomList();
    });
  },

  onRoomTap(e) {
    const { id } = e.currentTarget.dataset;
    const room = this.data.roomList.find(r => r.id === id);
    if (!room) return;
    this.setData({
      selectedRoom: room,
      selectedSeat: null,
      showSeatModal: true
    }, () => {
      this.loadSeatMap();
    });
  },

  onCloseSeatModal() {
    this.setData({
      showSeatModal: false,
      selectedRoom: null,
      selectedSeat: null
    });
  },

  onDateChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ selectedDate: value, selectedSeat: null }, () => {
      this.loadSeatMap();
    });
  },

  onTimeSlotChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ activeTimeSlot: value, selectedSeat: null }, () => {
      this.loadSeatMap();
    });
  },

  loadSeatMap() {
    if (!this.data.selectedRoom) return;
    try {
      const seatRows = dataService.getSeatRowsAndCols(this.data.selectedRoom.id);
      const seatRowKeys = Object.keys(seatRows).sort((a, b) => Number(a) - Number(b));
      this.setData({ seatRows, seatRowKeys });
    } catch (error) {
      console.error('加载座位图失败:', error);
      util.showToast('加载座位图失败');
    }
  },

  onSeatTap(e) {
    const { id } = e.currentTarget.dataset;
    const rowKeys = this.data.seatRowKeys;
    let seat = null;
    for (const key of rowKeys) {
      const found = this.data.seatRows[key].find(s => s.id === id);
      if (found) { seat = found; break; }
    }
    if (!seat) return;
    if (seat.status !== 'available') {
      const statusInfo = constants.LIBRARY_SEAT_STATUS_MAP[seat.status] || {};
      util.showToast(`该座位${statusInfo.label || '不可预约'}`);
      return;
    }
    this.setData({ selectedSeat: seat });
  },

  async onConfirmReservation() {
    const { selectedSeat, selectedRoom, selectedDate, activeTimeSlot, userId } = this.data;
    if (!selectedSeat) {
      util.showToast('请选择座位');
      return;
    }
    const timeSlotInfo = constants.LIBRARY_SEAT_TIME_SLOTS.find(s => s.value === activeTimeSlot);
    if (!timeSlotInfo) return;

    const dateStr = selectedDate;
    const startDateTime = new Date(`${dateStr}T${timeSlotInfo.start}:00`).getTime();
    const endDateTime = new Date(`${dateStr}T${timeSlotInfo.end}:00`).getTime();

    const confirm = await util.showConfirm(
      `确认预约 ${selectedRoom.name} ${selectedSeat.seatNumber}号座位？\n日期：${dateStr}\n时段：${timeSlotInfo.label}\n\n温馨提示：请在预约开始后15分钟内完成签到，否则将自动释放`,
      '确认预约'
    );
    if (!confirm) return;

    try {
      util.showLoading('预约中...');
      const result = dataService.createSeatReservation({
        userId,
        roomId: selectedRoom.id,
        roomName: selectedRoom.name,
        seatId: selectedSeat.id,
        seatNumber: selectedSeat.seatNumber,
        date: dateStr,
        timeSlot: activeTimeSlot,
        timeSlotLabel: timeSlotInfo.label,
        startTime: startDateTime,
        endTime: endDateTime
      });
      util.hideLoading();

      if (result.success) {
        await util.showSuccess('预约成功');
        this.onCloseSeatModal();
        this.loadRoomList();
      } else {
        util.showToast(result.message || '预约失败');
      }
    } catch (error) {
      console.error('预约失败:', error);
      util.hideLoading();
      util.showToast('预约失败，请重试');
    }
  },

  goToMySeats() {
    util.navigateTo('/pages/library/my-seats/index');
  },

  getSeatClass(status) {
    const map = {
      available: 'seat-available',
      occupied: 'seat-occupied',
      reserved: 'seat-reserved',
      suspended: 'seat-suspended'
    };
    return map[status] || 'seat-suspended';
  }
});
