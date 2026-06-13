const i18n = require('../../utils/i18n');
const util = require('../../utils/util');
const constants = require('../../config/constants');

const GUIDE_DATA = {
  visa: {
    zh: {
      title: '签证与居留许可',
      icon: '🛂',
      color: '#3B82F6',
      steps: [
        { title: '收到录取通知书', desc: '学校将发送正式录取通知书和JW202/JW201表' },
        { title: '申请X1签证', desc: '携带护照、录取通知书、JW202表等材料到中国驻外使领馆申请' },
        { title: '入境中国', desc: '持X1签证入境，注意签证有效期' },
        { title: '办理临时住宿登记', desc: '入住后24小时内到当地派出所办理' },
        { title: '体检验证', desc: '到出入境检验检疫局进行体检或验证' },
        { title: '申请居留许可', desc: '入境30日内到公安局出入境管理处申请' }
      ],
      documents: [
        '有效护照原件及复印件',
        '录取通知书原件',
        'JW202/JW201表原件',
        '外国人体格检查表',
        '临时住宿登记表',
        '近期2寸免冠照片',
        '学校介绍信'
      ],
      tips: [
        'X1签证有效期通常为30天，请务必在此期间办理居留许可',
        '居留许可有效期一般与学习期限一致',
        '护照和居留许可请妥善保管，遗失需及时挂失补办',
        '住址变更需重新办理临时住宿登记'
      ],
      contact: '国际交流处：010-11223344'
    },
    en: {
      title: 'Visa & Residence Permit',
      icon: '🛂',
      color: '#3B82F6',
      steps: [
        { title: 'Receive Admission Letter', desc: 'University will send official admission letter and JW202/JW201 form' },
        { title: 'Apply for X1 Visa', desc: 'Apply at Chinese embassy/consulate with passport, admission letter, JW202 form' },
        { title: 'Enter China', desc: 'Enter China with X1 visa, check validity period' },
        { title: 'Register Temporary Residence', desc: 'Register at local police station within 24 hours' },
        { title: 'Medical Examination', desc: 'Complete health check at Entry-Exit Inspection Bureau' },
        { title: 'Apply for Residence Permit', desc: 'Apply at Exit-Entry Administration within 30 days' }
      ],
      documents: [
        'Valid passport and copy',
        'Original admission letter',
        'Original JW202/JW201 form',
        'Physical examination report',
        'Temporary residence registration form',
        'Recent 2-inch photos',
        'University introduction letter'
      ],
      tips: [
        'X1 visa is usually valid for 30 days, apply for residence permit within this period',
        'Residence permit validity matches study duration',
        'Keep passport and residence permit safe, report loss immediately',
        'Re-register temporary residence when changing address'
      ],
      contact: 'International Office: 010-11223344'
    }
  },
  medical: {
    zh: {
      title: '医疗保险',
      icon: '🏥',
      color: '#EF4444',
      steps: [
        { title: '了解保险方案', desc: '学校提供统一的国际学生医疗保险计划' },
        { title: '缴纳保险费', desc: '每学年需缴纳保险费用，随学费一起缴纳' },
        { title: '获取保险卡', desc: '保险生效后可领取或下载电子保险凭证' },
        { title: '就医时出示', desc: '就诊时出示保险卡和护照' },
        { title: '理赔申请', desc: '垫付费用后按流程申请理赔' }
      ],
      documents: [
        '护照原件及复印件',
        '学生证或在读证明',
        '保险卡/电子凭证',
        '诊断证明（中文）',
        '医疗费用收据原件',
        '病历资料'
      ],
      tips: [
        '校医院为首选就医地点，费用较低且流程便捷',
        '急诊可直接前往就近医院，但请保留好所有单据',
        '购买药品时请确认是否在保险报销范围内',
        '就医时可要求医生开具中英文诊断证明'
      ],
      contact: '校医院：010-87654321'
    },
    en: {
      title: 'Medical Insurance',
      icon: '🏥',
      color: '#EF4444',
      steps: [
        { title: 'Understand Insurance Plan', desc: 'University provides unified medical insurance for international students' },
        { title: 'Pay Insurance Premium', desc: 'Pay annually with tuition fees' },
        { title: 'Get Insurance Card', desc: 'Receive or download e-insurance certificate after effective date' },
        { title: 'Present When Seeking Care', desc: 'Show insurance card and passport during visits' },
        { title: 'File Claim', desc: 'Apply for reimbursement after paying upfront' }
      ],
      documents: [
        'Passport and copy',
        'Student ID or enrollment certificate',
        'Insurance card/e-certificate',
        'Medical certificate (in Chinese)',
        'Original medical receipts',
        'Medical records'
      ],
      tips: [
        'Campus hospital is preferred for lower costs and easier process',
        'For emergencies, go to nearest hospital and keep all receipts',
        'Check if medicine is covered before purchasing',
        'Request bilingual medical certificates when possible'
      ],
      contact: 'Campus Hospital: 010-87654321'
    }
  },
  bank: {
    zh: {
      title: '银行开户',
      icon: '🏦',
      color: '#10B981',
      steps: [
        { title: '选择银行', desc: '推荐选择校园内或附近的中国银行、工商银行、建设银行等' },
        { title: '准备材料', desc: '携带护照、学生证、学校证明等材料' },
        { title: '前往网点', desc: '到银行网点填写开户申请表' },
        { title: '设置密码', desc: '设置6位数字交易密码' },
        { title: '领取银行卡', desc: '当场领取借记卡，部分银行支持手机银行即时开通' },
        { title: '激活服务', desc: '开通手机银行、网上银行等服务' }
      ],
      documents: [
        '护照原件及复印件',
        '学生证或在读证明',
        '学校开具的银行开户介绍信',
        '临时住宿登记表',
        '手机号码（用于接收验证码）'
      ],
      tips: [
        '建议选择校园内设有网点的银行，方便办理业务',
        '部分银行需要提前预约，可先电话咨询',
        '跨境汇款请使用SWIFT CODE，注意手续费',
        '保管好银行卡和密码，不要泄露给他人'
      ],
      contact: '校内中国银行：010-55667788'
    },
    en: {
      title: 'Bank Account Opening',
      icon: '🏦',
      color: '#10B981',
      steps: [
        { title: 'Choose a Bank', desc: 'BOC, ICBC, CCB near campus are recommended' },
        { title: 'Prepare Documents', desc: 'Bring passport, student ID, university letter' },
        { title: 'Visit Bank Branch', desc: 'Fill out account opening application form' },
        { title: 'Set Password', desc: 'Set up 6-digit PIN code' },
        { title: 'Get Bank Card', desc: 'Receive debit card, some banks support instant mobile banking' },
        { title: 'Activate Services', desc: 'Enable mobile banking and online banking' }
      ],
      documents: [
        'Original passport and copy',
        'Student ID or enrollment certificate',
        'University bank letter',
        'Temporary residence registration form',
        'Phone number (for verification codes)'
      ],
      tips: [
        'Choose banks with on-campus branches for convenience',
        'Some banks require appointments, call ahead to check',
        'Use SWIFT CODE for international transfers, note fees',
        'Keep card and PIN secure, never share with others'
      ],
      contact: 'On-campus BOC: 010-55667788'
    }
  },
  sim: {
    zh: {
      title: 'SIM卡办理',
      icon: '📱',
      color: '#8B5CF6',
      steps: [
        { title: '选择运营商', desc: '中国移动、中国联通、中国电信三大运营商' },
        { title: '选择套餐', desc: '根据通话、流量需求选择合适的套餐' },
        { title: '前往营业厅', desc: '携带护照到运营商营业厅办理' },
        { title: '实名认证', desc: '进行人脸识别和身份核验' },
        { title: '选择号码', desc: '从可用号码中选择喜欢的号码' },
        { title: '激活使用', desc: '插入SIM卡，充值后即可使用' }
      ],
      documents: [
        '护照原件',
        '第二身份证件（学生证/居留许可）',
        '现场人脸识别照片'
      ],
      tips: [
        '校园内通常有运营商营业厅或代理点，办理更方便',
        '建议选择包含校园流量的学生套餐，性价比更高',
        '实名认证后号码不可随意转让他人',
        '携号转网服务已开放，可随时更换运营商'
      ],
      contact: '校内移动营业厅：10086'
    },
    en: {
      title: 'SIM Card Application',
      icon: '📱',
      color: '#8B5CF6',
      steps: [
        { title: 'Choose Carrier', desc: 'China Mobile, China Unicom, China Telecom' },
        { title: 'Select Plan', desc: 'Choose suitable plan based on call/data needs' },
        { title: 'Visit Carrier Store', desc: 'Bring passport to carrier service center' },
        { title: 'Real-Name Verification', desc: 'Complete face recognition and ID check' },
        { title: 'Pick Phone Number', desc: 'Select from available numbers' },
        { title: 'Activate & Use', desc: 'Insert SIM card, top up and start using' }
      ],
      documents: [
        'Original passport',
        'Second ID (Student ID / Residence Permit)',
        'On-site face recognition photo'
      ],
      tips: [
        'On-campus carrier stores make process easier',
        'Student plans with campus data offer better value',
        'Numbers cannot be transferred after real-name registration',
        'Number portability available to switch carriers anytime'
      ],
      contact: 'On-campus China Mobile: 10086'
    }
  }
};

Page({
  data: {
    lang: 'zh',
    darkMode: false,
    currentCategory: 'visa',
    categoryTabs: [],
    currentData: null
  },

  onLoad(options) {
    const category = options.category || 'visa';
    this.initPage(category);
  },

  onShow() {
    this.initPage(this.data.currentCategory);
  },

  initPage(category) {
    const lang = i18n.getLanguage();
    const app = getApp();
    const { isDark } = app.globalData;

    const categoryTabs = constants.INTL_GUIDE_CATEGORIES.map(item => ({
      value: item.value,
      label: lang === 'zh' ? item.label : item.labelEn,
      icon: item.icon,
      color: item.color
    }));

    const currentData = this.getGuideData(category, lang);

    this.setData({
      lang,
      darkMode: isDark || false,
      currentCategory: category,
      categoryTabs,
      currentData
    });

    wx.setNavigationBarTitle({
      title: lang === 'zh' ? '生活指南' : 'Living Guide'
    });
  },

  getGuideData(category, lang) {
    const data = GUIDE_DATA[category];
    if (!data) return null;
    return data[lang] || data.zh;
  },

  onCategoryTap(e) {
    const { value } = e.currentTarget.dataset;
    const lang = this.data.lang;
    const currentData = this.getGuideData(value, lang);
    this.setData({
      currentCategory: value,
      currentData
    });
  },

  onCallContact(e) {
    const { phone } = e.currentTarget.dataset;
    wx.makePhoneCall({
      phoneNumber: phone,
      fail: () => {
        util.showToast(this.data.lang === 'zh' ? '拨号失败，请手动拨打' : 'Call failed, please dial manually');
      }
    });
  },

  onSwitchLanguage() {
    const newLang = i18n.toggleLanguage();
    util.showToast(newLang === 'zh' ? '已切换到中文' : 'Switched to English');
    this.initPage(this.data.currentCategory);
  }
});
