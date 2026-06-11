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
      locationType: 'campus',
      houseType: '',
      rentType: 'entire',
      rent: '',
      deposit: '',
      area: '',
      floor: '',
      orientation: '',
      distance: '',
      genderRequirement: 'no_limit',
      facilities: [],
      images: [],
      leaseTerm: '',
      description: '',
      address: '',
      latitude: 39.9042,
      longitude: 116.4074,
      surrounding: '',
      contactName: '',
      contactPhone: '',
      publisherType: 'personal'
    },
    locationTypes: constants.RENTAL_LOCATION_TYPES,
    houseTypes: constants.RENTAL_HOUSE_TYPES,
    rentTypes: constants.RENTAL_RENT_TYPES,
    genderRequirements: constants.RENTAL_GENDER_REQUIREMENTS,
    leaseTerms: constants.RENTAL_LEASE_TERMS,
    facilities: constants.RENTAL_FACILITIES,
    publisherTypes: constants.RENTAL_PUBLISHER_TYPES,
    houseTypeIndex: -1,
    leaseTermIndex: -1,
    submitting: false,
    facilitiesSelectedMap: {}
  },

  onLoad() {
    const app = getApp();
    const userInfo = app.globalData.userInfo || {};
    if (userInfo.nickName) {
      this.setData({
        'formData.contactName': userInfo.nickName
      });
    }
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`formData.${field}`]: value
    });
  },

  onLocationTypeChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      'formData.locationType': value
    });
  },

  onHouseTypeChange(e) {
    const index = e.detail.value;
    const item = this.data.houseTypes[index];
    this.setData({
      houseTypeIndex: index,
      'formData.houseType': item.value
    });
  },

  onRentTypeChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      'formData.rentType': value
    });
  },

  onGenderChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      'formData.genderRequirement': value
    });
  },

  onLeaseTermChange(e) {
    const index = e.detail.value;
    const item = this.data.leaseTerms[index];
    this.setData({
      leaseTermIndex: index,
      'formData.leaseTerm': item.value
    });
  },

  onPublisherTypeChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      'formData.publisherType': value
    });
  },

  onFacilityToggle(e) {
    const { value } = e.currentTarget.dataset;
    const facilities = [...this.data.formData.facilities];
    const index = facilities.indexOf(value);

    if (index > -1) {
      facilities.splice(index, 1);
    } else {
      facilities.push(value);
    }

    const facilitiesSelectedMap = {};
    facilities.forEach(f => { facilitiesSelectedMap[f] = true; });

    this.setData({
      'formData.facilities': facilities,
      facilitiesSelectedMap
    });
  },

  async onChooseImage() {
    try {
      const tempFiles = await fileUtil.chooseImage(9 - this.data.formData.images.length);
      if (tempFiles.length > 0) {
        const images = [...this.data.formData.images, ...tempFiles];
        this.setData({
          'formData.images': images.slice(0, 9)
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

  async onChooseLocation() {
    try {
      const res = await new Promise((resolve, reject) => {
        wx.chooseLocation({
          success: resolve,
          fail: reject
        });
      });

      this.setData({
        'formData.address': res.address,
        'formData.latitude': res.latitude,
        'formData.longitude': res.longitude
      });
    } catch (e) {
      util.showToast('请在设置中开启定位权限');
    }
  },

  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    const urls = this.data.formData.images;
    fileUtil.previewImage(urls, urls[index]);
  },

  onSurroundingInput(e) {
    this.setData({
      'formData.surrounding': e.detail.value
    });
  },

  validateForm() {
    const { formData } = this.data;

    if (formData.images.length === 0) {
      util.showToast('请至少上传一张图片');
      return false;
    }

    if (!formData.title.trim()) {
      util.showToast('请输入房源标题');
      return false;
    }

    if (!formData.houseType) {
      util.showToast('请选择户型');
      return false;
    }

    if (!formData.rent || parseFloat(formData.rent) <= 0) {
      util.showToast('请输入有效的月租金');
      return false;
    }

    if (!formData.deposit || parseFloat(formData.deposit) < 0) {
      util.showToast('请输入有效的押金金额');
      return false;
    }

    if (!formData.area || parseFloat(formData.area) <= 0) {
      util.showToast('请输入有效的房屋面积');
      return false;
    }

    if (!formData.distance || parseFloat(formData.distance) < 0) {
      util.showToast('请输入距离学校的距离');
      return false;
    }

    if (!formData.address.trim()) {
      util.showToast('请选择或输入详细地址');
      return false;
    }

    if (!formData.leaseTerm) {
      util.showToast('请选择租期');
      return false;
    }

    if (!formData.description.trim()) {
      util.showToast('请输入房源描述');
      return false;
    }

    if (!formData.contactName.trim()) {
      util.showToast('请输入联系人姓名');
      return false;
    }

    if (!formData.contactPhone.trim()) {
      util.showToast('请输入联系电话');
      return false;
    }

    if (!util.isValidPhone(formData.contactPhone)) {
      util.showToast('请输入正确的手机号');
      return false;
    }

    return true;
  },

  async onSubmit() {
    if (!this.validateForm()) return;

    this.setData({ submitting: true });

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

      const surroundingArr = this.data.formData.surrounding
        ? this.data.formData.surrounding.split(/[,，\n]/).map(s => s.trim()).filter(s => s)
        : [];

      const data = {
        ...this.data.formData,
        images: savedImages,
        rent: parseFloat(this.data.formData.rent),
        deposit: parseFloat(this.data.formData.deposit),
        area: parseFloat(this.data.formData.area),
        distance: parseFloat(this.data.formData.distance),
        surrounding: surroundingArr,
        floor: this.data.formData.floor || '',
        orientation: this.data.formData.orientation || ''
      };

      const result = dataService.publishRentalHouse(data);

      if (result) {
        await util.showSuccess('发布成功');
        wx.navigateBack({
          delta: 1,
          fail: () => {
            wx.switchTab({ url: '/pages/rental/index' });
          }
        });
      } else {
        util.showError('发布失败，请重试');
      }
    } catch (e) {
      util.showError('发布失败，请重试');
    } finally {
      this.setData({ submitting: false });
    }
  }
});
