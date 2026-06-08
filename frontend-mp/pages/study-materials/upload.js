const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const fileUtil = require('../../utils/file');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    formData: {
      title: '',
      category: '',
      courseName: '',
      teacher: '',
      semester: '',
      fileType: 'image',
      description: '',
      images: [],
      files: []
    },
    formattedFiles: [],
    descriptionLength: 0,
    imageCount: 0,
    fileCount: 0,
    categories: constants.STUDY_MATERIAL_CATEGORIES,
    semesters: constants.SEMESTER_OPTIONS,
    fileTypes: constants.FILE_TYPE_OPTIONS,
    categoryIndex: -1,
    semesterIndex: -1,
    fileTypeIndex: 0,
    submitting: false,
    userPoints: 0,
    showCopyright: true
  },

  onLoad() {
    const points = dataService.getUserPoints();
    this.setData({ userPoints: points });
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    const updates = {
      [`formData.${field}`]: value
    };
    if (field === 'description') {
      updates.descriptionLength = value ? value.length : 0;
    }
    this.setData(updates);
  },

  formatFiles(files) {
    return files.map(file => ({
      ...file,
      sizeText: ((file.size || 0) / 1024).toFixed(1) + ' KB'
    }));
  },

  onCategoryChange(e) {
    const index = e.detail.value;
    const item = this.data.categories[index];
    this.setData({
      categoryIndex: index,
      'formData.category': item.value
    });
  },

  onSemesterChange(e) {
    const index = e.detail.value;
    const item = this.data.semesters[index];
    this.setData({
      semesterIndex: index,
      'formData.semester': item.value
    });
  },

  onFileTypeChange(e) {
    const index = e.detail.value;
    const item = this.data.fileTypes[index];
    this.setData({
      fileTypeIndex: index,
      'formData.fileType': item.value
    });
  },

  async onChooseImage() {
    try {
      const maxCount = 9 - this.data.formData.images.length;
      if (maxCount <= 0) {
        util.showToast('最多上传9张图片');
        return;
      }

      const tempFiles = await fileUtil.chooseImage(maxCount);
      if (tempFiles.length > 0) {
        const images = [...this.data.formData.images, ...tempFiles].slice(0, 9);
        this.setData({
          'formData.images': images,
          imageCount: images.length
        });
      }
    } catch (e) {
      util.showError('选择图片失败');
    }
  },

  async onChooseFile() {
    try {
      const maxCount = 5 - this.data.formData.files.length;
      if (maxCount <= 0) {
        util.showToast('最多上传5个文件');
        return;
      }

      const tempFiles = await fileUtil.chooseMessageFile(maxCount);
      if (tempFiles.length > 0) {
        const files = [...this.data.formData.files, ...tempFiles].slice(0, 5);
        this.setData({
          'formData.files': files,
          formattedFiles: this.formatFiles(files),
          fileCount: files.length
        });
      }
    } catch (e) {
      util.showError('选择文件失败');
    }
  },

  onDeleteImage(e) {
    const { index } = e.currentTarget.dataset;
    const images = [...this.data.formData.images];
    images.splice(index, 1);
    this.setData({
      'formData.images': images,
      imageCount: images.length
    });
  },

  onDeleteFile(e) {
    const { index } = e.currentTarget.dataset;
    const files = [...this.data.formData.files];
    files.splice(index, 1);
    this.setData({
      'formData.files': files,
      formattedFiles: this.formatFiles(files),
      fileCount: files.length
    });
  },

  hideCopyright() {
    this.setData({ showCopyright: false });
  },

  validateForm() {
    const { formData } = this.data;

    if (formData.images.length === 0 && formData.files.length === 0) {
      util.showToast('请至少上传一张图片或一个文件');
      return false;
    }

    if (!formData.title.trim()) {
      util.showToast('请输入资料标题');
      return false;
    }

    if (!formData.category) {
      util.showToast('请选择资料分类');
      return false;
    }

    if (!formData.description.trim()) {
      util.showToast('请输入资料描述');
      return false;
    }

    return true;
  },

  async onSubmit() {
    if (!this.validateForm()) return;

    this.setData({ submitting: true });
    util.showLoading('发布中...');

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const savedImages = [];
      for (const tempPath of this.data.formData.images) {
        try {
          const fileName = fileUtil.generateFileName('jpg');
          const savedPath = await fileUtil.copyTempFile(tempPath, fileName);
          savedImages.push(savedPath);
        } catch (e) {
          savedImages.push(tempPath);
        }
      }

      const savedFiles = [];
      for (const file of this.data.formData.files) {
        try {
          const ext = fileUtil.getFileExt(file.name);
          const fileName = fileUtil.generateFileName(ext);
          const savedPath = await fileUtil.copyTempFile(file.path, fileName);
          savedFiles.push({
            path: savedPath,
            name: file.name,
            size: file.size
          });
        } catch (e) {
          savedFiles.push(file);
        }
      }

      const data = {
        ...this.data.formData,
        images: savedImages,
        files: savedFiles
      };

      const result = dataService.publishStudyMaterial(data);

      if (result) {
        dataService.updateUserPoints(10);
        await util.showSuccess('发布成功，获得10积分');
        wx.navigateBack({
          delta: 1,
          fail: () => {
            util.navigateTo('/pages/study-materials/index');
          }
        });
      } else {
        util.showError('发布失败，请重试');
      }
    } catch (e) {
      util.showError('发布失败，请重试');
    } finally {
      this.setData({ submitting: false });
      util.hideLoading();
    }
  }
});
