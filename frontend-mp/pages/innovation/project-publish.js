const dataService = require('../../services/data');
const constants = require('../../config/constants');
const fileUtil = require('../../utils/file');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    isEdit: false,
    editId: '',
    fieldOptions: constants.INNOVATION_PROJECT_FIELDS,
    stageOptions: constants.INNOVATION_PROJECT_STAGES,
    financingOptions: constants.INNOVATION_FINANCING_STAGES,
    roleOptions: constants.INNOVATION_TEAM_ROLES,
    form: {
      title: '',
      description: '',
      field: '',
      stage: 'idea',
      financingStage: 'none',
      financingAmount: '',
      financingPurpose: '',
      equityProportion: '',
      detailedDescription: '',
      highlights: [],
      team: [],
      recruitingRoles: [],
      recruitmentIntro: '',
      contactPerson: '',
      contactPhone: '',
      contactEmail: '',
      wechatId: '',
      images: []
    },
    showFieldPicker: false,
    showStagePicker: false,
    showFinancingPicker: false,
    showRolePicker: false,
    showRecruitingPicker: false,
    showAddTeamModal: false,
    teamForm: {
      name: '',
      role: '',
      major: '',
      grade: '',
      skills: ''
    },
    highlightInput: '',
    submitting: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ 
        isEdit: true, 
        editId: options.id 
      });
      wx.setNavigationBarTitle({ title: '编辑项目' });
      this.loadEditData(options.id);
    }
  },

  loadEditData(id) {
    const project = dataService.getInnovationProjectDetail(id);
    if (project) {
      this.setData({
        form: {
          title: project.title || '',
          description: project.description || '',
          field: project.field || '',
          stage: project.stage || 'idea',
          financingStage: project.financingStage || 'none',
          financingAmount: project.financingAmount || '',
          financingPurpose: project.financingPurpose || '',
          equityProportion: project.equityProportion || '',
          detailedDescription: project.detailedDescription || '',
          highlights: project.highlights || [],
          team: project.team || [],
          recruitingRoles: project.recruitingRoles || [],
          recruitmentIntro: project.recruitmentIntro || '',
          contactPerson: project.contactPerson || '',
          contactPhone: project.contactPhone || '',
          contactEmail: project.contactEmail || '',
          wechatId: project.wechatId || '',
          images: project.images || []
        }
      });
    }
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`form.${field}`]: e.detail.value
    });
  },

  onTeamInputChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`teamForm.${field}`]: e.detail.value
    });
  },

  onHighlightInput(e) {
    this.setData({ highlightInput: e.detail.value });
  },

  onFieldPickerTap() {
    this.setData({ showFieldPicker: true });
  },

  onFieldSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ 
      'form.field': value,
      showFieldPicker: false 
    });
  },

  onStagePickerTap() {
    this.setData({ showStagePicker: true });
  },

  onStageSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ 
      'form.stage': value,
      showStagePicker: false 
    });
  },

  onFinancingPickerTap() {
    this.setData({ showFinancingPicker: true });
  },

  onFinancingSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ 
      'form.financingStage': value,
      showFinancingPicker: false 
    });
  },

  onRolePickerTap() {
    this.setData({ showRolePicker: true });
  },

  onRoleSelect(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({ 
      'teamForm.role': value,
      showRolePicker: false 
    });
  },

  onRecruitingPickerTap() {
    this.setData({ showRecruitingPicker: true });
  },

  onRecruitingToggle(e) {
    const { value } = e.currentTarget.dataset;
    const currentRoles = [...this.data.form.recruitingRoles];
    const index = currentRoles.indexOf(value);
    if (index > -1) {
      currentRoles.splice(index, 1);
    } else {
      currentRoles.push(value);
    }
    this.setData({ 'form.recruitingRoles': currentRoles });
  },

  onCloseRecruitingPicker() {
    this.setData({ showRecruitingPicker: false });
  },

  onClosePicker() {
    this.setData({
      showFieldPicker: false,
      showStagePicker: false,
      showFinancingPicker: false,
      showRolePicker: false,
      showRecruitingPicker: false
    });
  },

  onChooseImage() {
    const currentCount = this.data.form.images.length;
    const maxCount = 9 - currentCount;
    if (maxCount <= 0) {
      wx.showToast({ title: '最多上传9张图片', icon: 'none' });
      return;
    }
    fileUtil.chooseImage({
      count: maxCount,
      success: (res) => {
        const newImages = [...this.data.form.images, ...res.tempFilePaths];
        this.setData({ 'form.images': newImages });
      }
    });
  },

  onRemoveImage(e) {
    const { index } = e.currentTarget.dataset;
    const newImages = [...this.data.form.images];
    newImages.splice(index, 1);
    this.setData({ 'form.images': newImages });
  },

  onAddHighlight() {
    const value = this.data.highlightInput.trim();
    if (!value) return;
    if (this.data.form.highlights.length >= 5) {
      wx.showToast({ title: '最多添加5个亮点', icon: 'none' });
      return;
    }
    const newHighlights = [...this.data.form.highlights, value];
    this.setData({
      'form.highlights': newHighlights,
      highlightInput: ''
    });
  },

  onRemoveHighlight(e) {
    const { index } = e.currentTarget.dataset;
    const newHighlights = [...this.data.form.highlights];
    newHighlights.splice(index, 1);
    this.setData({ 'form.highlights': newHighlights });
  },

  onAddTeamTap() {
    this.setData({
      showAddTeamModal: true,
      teamForm: {
        name: '',
        role: '',
        major: '',
        grade: '',
        skills: ''
      }
    });
  },

  onCloseAddTeamModal() {
    this.setData({ showAddTeamModal: false });
  },

  onConfirmAddTeam() {
    const { name, role, major, grade } = this.data.teamForm;
    if (!name.trim()) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    if (!role) {
      wx.showToast({ title: '请选择角色', icon: 'none' });
      return;
    }
    if (!major.trim()) {
      wx.showToast({ title: '请输入专业', icon: 'none' });
      return;
    }
    if (!grade.trim()) {
      wx.showToast({ title: '请输入年级', icon: 'none' });
      return;
    }
    
    const newTeam = [...this.data.form.team, {
      id: 'team_' + Date.now(),
      name: name.trim(),
      role,
      major: major.trim(),
      grade: grade.trim(),
      skills: this.data.teamForm.skills.trim(),
      avatar: 'https://picsum.photos/100/100?random=' + Date.now()
    }];
    this.setData({
      'form.team': newTeam,
      showAddTeamModal: false
    });
  },

  onRemoveTeam(e) {
    const { index } = e.currentTarget.dataset;
    const newTeam = [...this.data.form.team];
    newTeam.splice(index, 1);
    this.setData({ 'form.team': newTeam });
  },

  validateForm() {
    const { title, description, field, contactPerson, contactPhone } = this.data.form;
    
    if (!title.trim()) {
      wx.showToast({ title: '请输入项目名称', icon: 'none' });
      return false;
    }
    if (title.length < 5) {
      wx.showToast({ title: '项目名称至少5个字符', icon: 'none' });
      return false;
    }
    if (!description.trim()) {
      wx.showToast({ title: '请输入项目简介', icon: 'none' });
      return false;
    }
    if (description.length < 20) {
      wx.showToast({ title: '项目简介至少20个字符', icon: 'none' });
      return false;
    }
    if (!field) {
      wx.showToast({ title: '请选择项目领域', icon: 'none' });
      return false;
    }
    if (this.data.form.team.length === 0) {
      wx.showToast({ title: '请至少添加1位团队成员', icon: 'none' });
      return false;
    }
    if (!contactPerson.trim()) {
      wx.showToast({ title: '请输入联系人姓名', icon: 'none' });
      return false;
    }
    if (!contactPhone.trim()) {
      wx.showToast({ title: '请输入联系电话', icon: 'none' });
      return false;
    }
    if (!/^1[3-9]\d{9}$/.test(contactPhone)) {
      wx.showToast({ title: '手机号格式不正确', icon: 'none' });
      return false;
    }
    
    return true;
  },

  onSubmit() {
    if (this.data.submitting) return;
    
    if (!this.validateForm()) return;
    
    this.setData({ submitting: true });
    
    const projectData = {
      ...this.data.form,
      title: this.data.form.title.trim(),
      description: this.data.form.description.trim(),
      status: 'reviewing'
    };
    
    let result;
    if (this.data.isEdit) {
      result = dataService.updateInnovationProject(this.data.editId, projectData);
    } else {
      result = dataService.publishInnovationProject(projectData);
    }
    
    if (result) {
      wx.showToast({
        title: this.data.isEdit ? '更新成功' : '发布成功',
        icon: 'success'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } else {
      wx.showToast({
        title: this.data.isEdit ? '更新失败' : '发布失败',
        icon: 'none'
      });
      this.setData({ submitting: false });
    }
  },

  stopPropagation() {}
});
