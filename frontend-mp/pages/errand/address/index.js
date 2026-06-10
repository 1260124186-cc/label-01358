const dataService = require('../../../services/data');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    addresses: [],
    selectMode: false,
    editingId: '',
    showForm: false,
    formData: {
      name: '',
      phone: '',
      building: '',
      room: '',
      isDefault: false
    }
  },

  onLoad(options) {
    if (options.select === '1') {
      this.setData({ selectMode: true });
    }
    this.loadAddresses();
  },

  onShow() {
    this.loadAddresses();
  },

  loadAddresses() {
    const addresses = dataService.getAddressList();
    this.setData({ addresses });
  },

  onAddAddress() {
    this.setData({
      showForm: true,
      editingId: '',
      formData: {
        name: '',
        phone: '',
        building: '',
        room: '',
        isDefault: this.data.addresses.length === 0
      }
    });
  },

  onEditAddress(e) {
    const { item } = e.currentTarget.dataset;
    this.setData({
      showForm: true,
      editingId: item.id,
      formData: {
        name: item.name,
        phone: item.phone,
        building: item.building,
        room: item.room,
        isDefault: item.isDefault
      }
    });
  },

  onSelectAddress(e) {
    if (!this.data.selectMode) return;
    const { item } = e.currentTarget.dataset;
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (prevPage && prevPage.setData) {
      const address = item.building + ' ' + item.room;
      if (prevPage.onSelectAddressResult) {
        prevPage.onSelectAddressResult(address, item.phone);
      }
    }
    wx.navigateBack();
  },

  onDeleteAddress(e) {
    const { id } = e.currentTarget.dataset;
    util.showConfirm('确定要删除该地址吗？').then(confirmed => {
      if (confirmed) {
        dataService.deleteAddress(id);
        util.showSuccess('已删除');
        this.loadAddresses();
      }
    });
  },

  onSetDefault(e) {
    const { id } = e.currentTarget.dataset;
    dataService.updateAddress(id, { isDefault: true });
    this.loadAddresses();
  },

  onFormInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      ['formData.' + field]: e.detail.value
    });
  },

  onDefaultSwitch() {
    this.setData({
      'formData.isDefault': !this.data.formData.isDefault
    });
  },

  onFormSubmit() {
    const { formData, editingId } = this.data;

    if (!formData.name.trim()) {
      util.showToast('请输入姓名');
      return;
    }
    if (!formData.phone.trim()) {
      util.showToast('请输入手机号');
      return;
    }
    if (!formData.building.trim()) {
      util.showToast('请输入楼栋');
      return;
    }
    if (!formData.room.trim()) {
      util.showToast('请输入房间号');
      return;
    }

    const data = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      building: formData.building.trim(),
      room: formData.room.trim(),
      isDefault: formData.isDefault
    };

    if (editingId) {
      dataService.updateAddress(editingId, data);
      util.showSuccess('已更新');
    } else {
      dataService.addAddress(data);
      util.showSuccess('已添加');
    }

    this.setData({ showForm: false, editingId: '' });
    this.loadAddresses();
  },

  onFormCancel() {
    this.setData({ showForm: false, editingId: '' });
  }
});
