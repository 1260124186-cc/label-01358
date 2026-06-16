const dataService = require('../../services/data');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    clubId: '',
    members: [],
    roleOptions: [
      { value: 'member', label: '普通成员' },
      { value: 'director', label: '干事' },
      { value: 'vicePresident', label: '副社长' }
    ]
  },

  onLoad(options) {
    this.setData({ clubId: options.clubId });
    this.loadData();
  },

  onShow() {
    if (this.data.clubId) {
      this.loadData();
    }
  },

  loadData() {
    util.showLoading();
    const members = dataService.getClubMembers(this.data.clubId);
    const formattedMembers = members.map(item => ({
      ...item,
      roleLabel: this.getRoleLabel(item.role),
      roleColor: this.getRoleColor(item.role),
      avatarInitial: item.name ? item.name[0] : 'U',
      joinTimeText: item.joinTime ? util.formatTime(item.joinTime, 'YYYY-MM-DD') : '未知'
    }));
    
    formattedMembers.sort((a, b) => {
      const roleOrder = { president: 0, vicePresident: 1, director: 2, member: 3 };
      return (roleOrder[a.role] || 3) - (roleOrder[b.role] || 3);
    });

    this.setData({ members: formattedMembers });
    util.hideLoading();
  },

  getRoleLabel(role) {
    const map = {
      president: '社长',
      vicePresident: '副社长',
      director: '干事',
      member: '普通成员'
    };
    return map[role] || '成员';
  },

  getRoleColor(role) {
    const map = {
      president: '#EF4444',
      vicePresident: '#F59E0B',
      director: '#3B82F6',
      member: '#6B7280'
    };
    return map[role] || '#6B7280';
  },

  onChangeRole(e) {
    const { userid, currentrole } = e.currentTarget.dataset;
    const member = this.data.members.find(m => m.userId === userid);
    if (!member) return;

    if (member.role === 'president') {
      util.showToast('社长角色不可修改');
      return;
    }

    wx.showActionSheet({
      itemList: this.data.roleOptions.map(r => r.label),
      success: (res) => {
        const newRole = this.data.roleOptions[res.tapIndex].value;
        if (newRole === currentrole) return;
        
        const result = dataService.updateMemberRole(this.data.clubId, userid, newRole);
        if (result.success) {
          util.showToast('角色已更新');
          this.loadData();
        } else {
          util.showToast(result.message || '操作失败');
        }
      }
    });
  },

  onRemove(e) {
    const { userid, name } = e.currentTarget.dataset;
    const member = this.data.members.find(m => m.userId === userid);
    if (!member) return;

    if (member.role === 'president') {
      util.showToast('社长不可移除');
      return;
    }

    wx.showModal({
      title: '移除成员',
      content: `确定将 ${name} 移出社团？`,
      success: (res) => {
        if (res.confirm) {
          const result = dataService.removeClubMember(this.data.clubId, userid);
          if (result.success) {
            util.showToast('已移除');
            this.loadData();
          } else {
            util.showToast(result.message || '操作失败');
          }
        }
      }
    });
  },

  onMemberTap(e) {
    const { userid } = e.currentTarget.dataset;
    const member = this.data.members.find(m => m.userId === userid);
    if (member && member.role === 'president') {
      util.showToast('社长信息不可操作');
      return;
    }
  }
});
