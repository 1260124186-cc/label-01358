const mockData = require('../../../config/mock-data');
const constants = require('../../../config/constants');
const util = require('../../../utils/util');
const { mixPage } = require('../../../utils/withTheme');

let pageOptions = {
  data: {
    darkMode: false,
    animal: null,
    form: {
      name: '',
      phone: '',
      wechat: '',
      age: '',
      occupation: '',
      address: '',
      housingType: 'rent',
      housingArea: '',
      hasExperience: false,
      hasOtherPets: false,
      otherPetsDesc: '',
      familyAgree: false,
      workTime: '',
      monthlyIncome: '',
      adoptionReason: '',
      agreeProtocol: false
    },
    housingTypes: [
      { value: 'rent', label: '租房' },
      { value: 'own', label: '自有住房' },
      { value: 'family', label: '与家人同住' },
      { value: 'dormitory', label: '宿舍' }
    ],
    submitting: false,
    showSuccess: false
  },

  onLoad(options) {
    const { animalId } = options;
    if (animalId) {
      const animalData = mockData.SHELTER_ANIMALS.find(a => a.id === animalId);
      if (animalData) {
        const animal = {
          id: animalData.id,
          name: animalData.name,
          avatar: animalData.avatar,
          breed: animalData.breed,
          typeLabel: constants.ANIMAL_TYPE_MAP[animalData.type]?.label || ''
        };
        this.setData({ animal });
      }
    }
  },

  onShow() {
    this.setData({ darkMode: util.isDarkMode() });
  },

  onInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`form.${field}`]: value
    });
  },

  onHousingTypeChange(e) {
    const { value } = e.currentTarget.dataset;
    this.setData({
      'form.housingType': value
    });
  },

  onSwitchChange(e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    this.setData({
      [`form.${field}`]: value
    });
  },

  onProtocolTap() {
    wx.showModal({
      title: '领养协议',
      content: '《流浪动物领养协议》\n\n1. 领养人需年满18周岁，具有完全民事行为能力。\n\n2. 领养人需有稳定的住所和经济来源，能够为领养动物提供良好的生活环境。\n\n3. 领养人需承诺不虐待、不遗弃领养的动物，定期为其进行体检、免疫和驱虫。\n\n4. 领养人需同意救助站工作人员定期或不定期回访，了解动物生活状况。\n\n5. 如因特殊原因无法继续饲养，需及时联系救助站，不得私自转送或遗弃。\n\n6. 领养时需缴纳押金500元，完成绝育后凭绝育证明全额退还。\n\n7. 领养人需同意救助站使用领养动物的照片、视频等用于公益宣传。\n\n8. 本协议最终解释权归救助站所有。',
      showCancel: false,
      confirmText: '我已阅读'
    });
  },

  validateForm() {
    const { form } = this.data;
    if (!form.name.trim()) {
      wx.showToast({ title: '请填写姓名', icon: 'none' });
      return false;
    }
    if (!form.phone.trim()) {
      wx.showToast({ title: '请填写手机号', icon: 'none' });
      return false;
    }
    if (!/^1[3-9]\d{9}$/.test(form.phone.trim())) {
      wx.showToast({ title: '请填写正确的手机号', icon: 'none' });
      return false;
    }
    if (!form.address.trim()) {
      wx.showToast({ title: '请填写详细地址', icon: 'none' });
      return false;
    }
    if (!form.housingArea.trim()) {
      wx.showToast({ title: '请填写住房面积', icon: 'none' });
      return false;
    }
    if (!form.familyAgree) {
      wx.showToast({ title: '请确保家人同意', icon: 'none' });
      return false;
    }
    if (!form.adoptionReason.trim()) {
      wx.showToast({ title: '请填写领养理由', icon: 'none' });
      return false;
    }
    if (!form.agreeProtocol) {
      wx.showToast({ title: '请同意领养协议', icon: 'none' });
      return false;
    }
    return true;
  },

  onSubmit() {
    if (!this.validateForm()) return;
    if (this.data.submitting) return;

    this.setData({ submitting: true });

    setTimeout(() => {
      this.setData({
        submitting: false,
        showSuccess: true
      });
    }, 1500);
  },

  onSuccessClose() {
    this.setData({ showSuccess: false });
    util.navigateBack();
  },

  onSelectAnimal() {
    util.navigateTo('/pages/animal-shelter/pets?select=1');
  },

  catchNoop() {}
};

mixPage(pageOptions);
