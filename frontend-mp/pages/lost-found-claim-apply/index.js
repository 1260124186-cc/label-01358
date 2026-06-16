const dataService = require('../../services/data');
const constants = require('../../config/constants');
const util = require('../../utils/util');
const fileUtil = require('../../utils/file');
const { mixPage } = require('../../utils/withTheme');

mixPage({
  data: {
    darkMode: false,
    id: '',
    detail: null,
    statusInfo: null,
    formData: {
      claimDescription: '',
      featureProof: '',
      images: [],
      applicantPhone: ''
    },
    submitting: false
  },

  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id });
      this.loadDetail();
    } else {
      util.showToast('参数错误');
      setTimeout(() => wx.navigateBack(), 1000);
    }
  },

  loadDetail() {
    const detail = dataService.getLostFoundDetail(this.data.id);

    if (detail) {
      const statusInfo = constants.LOST_FOUND_STATUS_MAP[detail.status] || constants.LOST_FOUND_STATUS_MAP.active;

      const formattedDetail = {
        ...detail,
        timeText: util.relativeTime(detail.createTime),
        itemTypeText: constants.getLabelByValue(constants.ITEM_TYPES, detail.itemType),
        locationText: constants.getLabelByValue(constants.LOCATIONS, detail.location) || detail.location,
        typeText: detail.type === 'lost' ? '寻物启事' : '失物招领'
      };

      this.setData({
        detail: formattedDetail,
        statusInfo
      });
    } else {
      util.showToast('信息不存在');
      setTimeout(() => wx.navigateBack(), 1000);
    }
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  async onChooseImage() {
    try {
      const tempFiles = await fileUtil.chooseImage(3 - this.data.formData.images.length);
      if (tempFiles.length > 0) {
        const images = [...this.data.formData.images, ...tempFiles];
        const newImages = images.slice(0, 3);
        this.setData({
          'formData.images': newImages
        });
      }
    } catch (e) {
      util.showError('选择图片失败');
    }
  },

  onDeleteImage(e) {
    const { index } = e.currentTarget.dataset;
    const images = [...this.data.formData.images];
    images.splice(index, 1);
    this.setData({
      'formData.images': images
    });
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    const urls = this.data.formData.images;
    fileUtil.previewImage(urls, urls[index]);
  },

  validateForm() {
    const { formData } = this.data;

    if (!formData.claimDescription.trim()) {
      util.showToast('请填写认领说明');
      return false;
    }

    if (!formData.featureProof.trim()) {
      util.showToast('请填写特征证明');
      return false;
    }

    if (formData.applicantPhone && !util.isValidPhone(formData.applicantPhone)) {
      util.showToast('请输入正确的手机号');
      return false;
    }

    return true;
  },

  async onSubmit() {
    if (!util.checkLogin()) return;

    if (!this.validateForm()) return;

    this.setData({ submitting: true });

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const savedImages = [];
      for (const tempPath of this.data.formData.images) {
        try {
          if (tempPath.startsWith('http') || tempPath.startsWith('wxfile') || tempPath.startsWith('/')) {
            savedImages.push(tempPath);
          } else {
            const fileName = fileUtil.generateFileName('jpg');
            const savedPath = await fileUtil.copyTempFile(tempPath, fileName);
            savedImages.push(savedPath);
          }
        } catch (e) {
          savedImages.push(tempPath);
        }
      }

      const { detail, formData } = this.data;

      const application = dataService.createClaimApplication({
        lostFoundId: detail.id,
        lostFoundTitle: detail.title,
        lostFoundType: detail.type,
        applicantPhone: formData.applicantPhone,
        claimDescription: formData.claimDescription,
        featureProof: formData.featureProof,
        images: savedImages,
        publisherId: detail.userId
      });

      if (application) {
        await util.showSuccess('提交成功');
        wx.navigateBack({
          delta: 1,
          fail: () => {
            wx.switchTab({ url: '/pages/lost-found/index' });
          }
        });
      } else {
        util.showError('提交失败，请重试');
      }
    } catch (e) {
      util.showError('提交失败，请重试');
    } finally {
      this.setData({ submitting: false });
    }
  }
});
