const util = require('../../utils/util');
const sosService = require('../../services/sosService');

const RELATIONSHIP_OPTIONS = [
  { value: 'parent', label: '父母' },
  { value: 'sibling', label: '兄弟姐妹' },
  { value: 'spouse', label: '配偶' },
  { value: 'child', label: '子女' },
  { value: 'relative', label: '亲戚' },
  { value: 'friend', label: '朋友' },
  { value: 'classmate', label: '同学' },
  { value: 'teacher', label: '老师' },
  { value: 'roommate', label: '室友' },
  { value: 'other', label: '其他' }
];

Page({
  data: {
    darkMode: false,
    contacts: [],
    securityContacts: [],
    showEdit: false,
    editingId: null,
    formData: {
      name: '',
      phone: '',
      relationship: '',
      isPrimary: false
    },
    relationshipOptions: RELATIONSHIP_OPTIONS,
    relationshipIndex: -1
  },

  onLoad() {
    this.loadPage();
  },

  onShow() {
    this.loadPage();
  },

  loadPage() {
    const app = getApp();
    const { isDark } = app.globalData;
    
    const contacts = sosService.getEmergencyContacts().map(c => ({
      ...c,
      relationship: this.getRelationshipLabel(c.relationship)
    }));
    
    const securityContacts = sosService.getCampusSecurityContacts();
    
    this.setData({
      darkMode: isDark || false,
      contacts,
      securityContacts
    });
  },

  getRelationshipLabel(value) {
    const option = RELATIONSHIP_OPTIONS.find(o => o.value === value);
    return option ? option.label : value;
  },

  onCall(e) {
    const { phone } = e.currentTarget.dataset;
    if (!phone) return;
    
    wx.makePhoneCall({
      phoneNumber: phone,
      fail: (err) => {
        if (err.errMsg && err.errMsg.indexOf('cancel') === -1) {
          util.showToast('拨号失败');
        }
      }
    });
  },

  onAdd() {
    this.setData({
      showEdit: true,
      editingId: null,
      formData: {
        name: '',
        phone: '',
        relationship: '',
        isPrimary: false
      },
      relationshipIndex: -1
    });
  },

  onEdit(e) {
    const { item } = e.currentTarget.dataset;
    const index = RELATIONSHIP_OPTIONS.findIndex(o => o.value === item.relationship);
    
    this.setData({
      showEdit: true,
      editingId: item.id,
      formData: {
        name: item.name,
        phone: item.phone,
        relationship: item.relationship,
        isPrimary: item.isPrimary
      },
      relationshipIndex: index >= 0 ? index : -1
    });
  },

  onDelete(e) {
    const { id } = e.currentTarget.dataset;
    
    util.showConfirm('确定要删除该联系人吗？', '删除确认').then(confirmed => {
      if (confirmed) {
        const success = sosService.removeEmergencyContact(id);
        if (success) {
          util.showSuccess('删除成功');
          this.loadPage();
        } else {
          util.showError('删除失败');
        }
      }
    });
  },

  onNameInput(e) {
    this.setData({
      'formData.name': e.detail.value
    });
  },

  onPhoneInput(e) {
    this.setData({
      'formData.phone': e.detail.value
    });
  },

  onRelationshipChange(e) {
    const index = e.detail.value;
    const option = RELATIONSHIP_OPTIONS[index];
    this.setData({
      relationshipIndex: index,
      'formData.relationship': option.value
    });
  },

  onPrimaryChange(e) {
    this.setData({
      'formData.isPrimary': e.detail.value
    });
  },

  onCancelEdit() {
    this.setData({ showEdit: false });
  },

  onSave() {
    const { formData, editingId } = this.data;
    
    if (util.isEmpty(formData.name)) {
      util.showToast('请输入姓名');
      return;
    }
    
    if (util.isEmpty(formData.phone)) {
      util.showToast('请输入手机号');
      return;
    }
    
    if (!util.isValidPhone(formData.phone)) {
      util.showToast('请输入正确的手机号');
      return;
    }
    
    if (util.isEmpty(formData.relationship)) {
      util.showToast('请选择关系');
      return;
    }
    
    let success;
    if (editingId) {
      success = sosService.updateEmergencyContact(editingId, formData);
    } else {
      success = sosService.addEmergencyContact(formData);
    }
    
    if (success) {
      util.showSuccess(editingId ? '修改成功' : '添加成功');
      this.setData({ showEdit: false });
      this.loadPage();
    } else {
      util.showError('保存失败');
    }
  },

  noop() {}
});
