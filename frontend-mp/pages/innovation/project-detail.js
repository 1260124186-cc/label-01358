const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    projectId: '',
    project: null,
    loading: true,
    isPublisher: false,
    isLiked: false,
    isCollected: false,
    showShareMenu: false,
    showRecruitModal: false,
    selectedRole: null,
    applicantName: '',
    applicantPhone: '',
    applicantIntroduction: ''
  },

  onLoad(options) {
    const { id } = options;
    this.setData({ projectId: id });
    this.loadProjectDetail();
  },

  onShow() {
    if (this.data.projectId) {
      this.loadProjectDetail();
    }
  },

  loadProjectDetail() {
    this.setData({ loading: true });
    dataService.increaseInnovationProjectViews(this.data.projectId);
    const project = dataService.getInnovationProjectDetail(this.data.projectId);
    if (project) {
      const processed = {
        ...project,
        fieldInfo: constants.INNOVATION_PROJECT_FIELDS.find(f => f.value === project.field),
        stageInfo: constants.INNOVATION_PROJECT_STAGES.find(s => s.value === project.stage),
        financingInfo: constants.INNOVATION_FINANCING_STAGES.find(f => f.value === project.financingStage),
        statusInfo: constants.INNOVATION_PROJECT_STATUS_MAP[project.status],
        team: (project.team || []).map(member => ({
          ...member,
          roleInfo: constants.INNOVATION_TEAM_ROLES.find(r => r.value === member.role)
        })),
        recruitingRoleInfos: (project.recruitingRoles || []).map(r => 
          constants.INNOVATION_TEAM_ROLES.find(role => role.value === r)
        ).filter(Boolean),
        formattedTime: util.formatDate(project.createTime),
        formattedUpdateTime: util.formatDate(project.updateTime)
      };
      this.setData({
        project: processed,
        isPublisher: project.publisherId === this.data.currentUserId,
        loading: false
      });
      wx.setNavigationBarTitle({
        title: project.title
      });
    } else {
      wx.showToast({
        title: '项目不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  onLikeTap() {
    const newLiked = !this.data.isLiked;
    this.setData({ isLiked: newLiked });
    if (newLiked) {
      wx.showToast({ title: '已点赞', icon: 'success' });
    }
  },

  onCollectTap() {
    const newCollected = !this.data.isCollected;
    this.setData({ isCollected: newCollected });
    wx.showToast({
      title: newCollected ? '已收藏' : '已取消收藏',
      icon: 'success'
    });
  },

  onShareTap() {
    this.setData({ showShareMenu: true });
  },

  onCloseShareMenu() {
    this.setData({ showShareMenu: false });
  },

  onShareAppMessage() {
    return {
      title: this.data.project.title,
      path: `/pages/innovation/project-detail?id=${this.data.projectId}`,
      imageUrl: this.data.project.images && this.data.project.images[0] ? this.data.project.images[0] : ''
    };
  },

  onEditTap() {
    wx.navigateTo({
      url: `/pages/innovation/project-publish?id=${this.data.projectId}`
    });
  },

  onDeleteTap() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个项目吗？此操作不可恢复。',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          dataService.deleteInnovationProject(this.data.projectId);
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 1000);
        }
      }
    });
  },

  onRecruitTap(e) {
    const { role } = e.currentTarget.dataset;
    this.setData({
      showRecruitModal: true,
      selectedRole: role,
      applicantName: '',
      applicantPhone: '',
      applicantIntroduction: ''
    });
  },

  onCloseRecruitModal() {
    this.setData({ showRecruitModal: false });
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [field]: e.detail.value
    });
  },

  onSubmitApplication() {
    const { applicantName, applicantPhone, applicantIntroduction, selectedRole } = this.data;
    if (!applicantName.trim()) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    if (!applicantPhone.trim()) {
      wx.showToast({ title: '请输入手机号', icon: 'none' });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(applicantPhone)) {
      wx.showToast({ title: '手机号格式不正确', icon: 'none' });
      return;
    }
    if (!applicantIntroduction.trim()) {
      wx.showToast({ title: '请输入自我介绍', icon: 'none' });
      return;
    }
    wx.showToast({
      title: '申请已提交',
      icon: 'success'
    });
    this.setData({ showRecruitModal: false });
  },

  onContactTap() {
    wx.showActionSheet({
      itemList: ['联系电话', '发送邮件'],
      success: (res) => {
        if (res.tapIndex === 0) {
          if (this.data.project.contactPhone) {
            wx.makePhoneCall({
              phoneNumber: this.data.project.contactPhone
            });
          }
        } else if (res.tapIndex === 1) {
          if (this.data.project.contactEmail) {
            wx.setClipboardData({
              data: this.data.project.contactEmail,
              success: () => {
                wx.showToast({ title: '邮箱已复制', icon: 'success' });
              }
            });
          }
        }
      }
    });
  },

  onImagePreview(e) {
    const { index } = e.currentTarget.dataset;
    const images = this.data.project.images || [];
    wx.previewImage({
      current: images[index],
      urls: images
    });
  },

  onImagePreview2(e) {
    const { src } = e.currentTarget.dataset;
    const images = this.data.project.images || [];
    wx.previewImage({
      current: src,
      urls: images
    });
  },

  stopPropagation() {}
});
