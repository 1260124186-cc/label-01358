const adminService = require('../../../services/adminService');
const util = require('../../../utils/util');
const fileUtil = require('../../../utils/file');
const { mixPage } = require('../../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    id: '',
    isEdit: false,
    title: '',
    description: '',
    image: '',
    submitting: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id, isEdit: true });
      this.loadDetail(options.id);
      wx.setNavigationBarTitle({ title: '编辑风光' });
    } else {
      wx.setNavigationBarTitle({ title: '新增风光' });
    }
  },

  loadDetail(id) {
    const detail = adminService.getSceneryById(id);
    if (detail) {
      this.setData({
        title: detail.title,
        description: detail.description,
        image: detail.image
      });
    }
  },

  onTitleInput(e) {
    this.setData({ title: e.detail.value });
  },

  onDescInput(e) {
    this.setData({ description: e.detail.value });
  },

  onChooseImage() {
    fileUtil.chooseImage(1, ['compressed'], ['album', 'camera']).then(paths => {
      if (paths && paths.length > 0) {
        this.setData({ image: paths[0] });
      }
    }).catch(err => {
      console.error('选择图片失败:', err);
      util.showError('选择图片失败');
    });
  },

  onPreviewImage() {
    if (this.data.image) {
      fileUtil.previewImage([this.data.image]);
    }
  },

  onRemoveImage() {
    util.showConfirm('确定要删除这张图片吗？').then(confirm => {
      if (confirm) {
        this.setData({ image: '' });
      }
    });
  },

  async onSubmit() {
    const { id, isEdit, title, description, image, submitting } = this.data;

    if (submitting) return;

    if (!title.trim()) {
      util.showToast('请输入标题');
      return;
    }

    if (!image) {
      util.showToast('请上传图片');
      return;
    }

    this.setData({ submitting: true });
    util.showLoading('保存中...');

    const data = {
      title: title.trim(),
      description: description.trim(),
      image
    };

    setTimeout(() => {
      if (isEdit) {
        adminService.updateScenery(id, data);
      } else {
        adminService.createScenery(data);
      }

      util.hideLoading();
      this.setData({ submitting: false });
      util.showSuccess(isEdit ? '修改成功' : '创建成功');

      setTimeout(() => {
        util.navigateBack();
      }, 1200);
    }, 500);
  }
});
