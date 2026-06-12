const constants = require('../config/constants');

const COLORS = [
  { value: 'red', label: '红色', keywords: ['红', '红色', '赤', '朱红', '橘红', '酒红', '玫红', '粉红'] },
  { value: 'orange', label: '橙色', keywords: ['橙', '橙色', '橘色', '橘黄', '橙黄'] },
  { value: 'yellow', label: '黄色', keywords: ['黄', '黄色', '金黄', '米黄', '奶黄', '柠檬黄'] },
  { value: 'green', label: '绿色', keywords: ['绿', '绿色', '青', '青色', '翠绿', '墨绿', '草绿', '军绿'] },
  { value: 'blue', label: '蓝色', keywords: ['蓝', '蓝色', '天蓝', '湖蓝', '深蓝', '藏蓝', '宝蓝'] },
  { value: 'purple', label: '紫色', keywords: ['紫', '紫色', '紫罗兰', '玫紫', '薰衣紫'] },
  { value: 'pink', label: '粉色', keywords: ['粉', '粉色', '桃红', '樱花粉'] },
  { value: 'black', label: '黑色', keywords: ['黑', '黑色', '深黑', '炭黑', '纯黑'] },
  { value: 'white', label: '白色', keywords: ['白', '白色', '纯白', '米白', '奶白', '银白'] },
  { value: 'gray', label: '灰色', keywords: ['灰', '灰色', '银灰', '深灰', '浅灰', '烟灰'] },
  { value: 'brown', label: '棕色', keywords: ['棕', '棕色', '褐色', '咖啡色', '驼色', '卡其'] },
  { value: 'gold', label: '金色', keywords: ['金', '金色', '黄金色', '香槟金'] },
  { value: 'silver', label: '银色', keywords: ['银', '银色', '银白', '金属银'] },
  { value: 'multicolor', label: '多彩', keywords: ['多彩', '花色', '印花', '图案', '渐变'] }
];

const BRANDS = [
  { value: 'apple', label: 'Apple', keywords: ['apple', '苹果', 'iphone', 'ipad', 'macbook', 'airpods'] },
  { value: 'huawei', label: '华为', keywords: ['华为', 'huawei', 'honor', '荣耀', 'mate', 'p系列', 'nova'] },
  { value: 'xiaomi', label: '小米', keywords: ['小米', 'xiaomi', 'mi', 'redmi', '红米'] },
  { value: 'oppo', label: 'OPPO', keywords: ['oppo', '欧珀', 'reno', 'find'] },
  { value: 'vivo', label: 'vivo', keywords: ['vivo', '维沃', 'x系列', 's系列'] },
  { value: 'samsung', label: '三星', keywords: ['三星', 'samsung', 'galaxy'] },
  { value: 'lenovo', label: '联想', keywords: ['联想', 'lenovo', 'thinkpad', '拯救者'] },
  { value: 'dell', label: '戴尔', keywords: ['戴尔', 'dell', 'xps', '灵越', '游匣'] },
  { value: 'hp', label: '惠普', keywords: ['惠普', 'hp', '暗影精灵', '战系列'] },
  { value: 'asus', label: '华硕', keywords: ['华硕', 'asus', 'rog', '天选', '无畏'] },
  { value: 'nike', label: 'Nike', keywords: ['nike', '耐克', ' swoosh', 'aj', 'air jordan'] },
  { value: 'adidas', label: 'Adidas', keywords: ['adidas', '阿迪达斯', '三叶草', '三条杠', 'yeezy'] },
  { value: 'uniqlo', label: '优衣库', keywords: ['优衣库', 'uniqlo'] },
  { value: 'zara', label: 'ZARA', keywords: ['zara', '飒拉'] },
  { value: 'starbucks', label: '星巴克', keywords: ['星巴克', 'starbucks'] },
  { value: 'muji', label: '无印良品', keywords: ['无印良品', 'muji'] },
  { value: 'pencil', label: '百乐', keywords: ['百乐', 'pilot', 'p500', 'juice'] },
  { value: 'pentel', label: '派通', keywords: ['派通', 'pentel'] },
  { value: 'm&g', label: '晨光', keywords: ['晨光', 'm&g', '孔庙祈福'] },
  { value: 'deli', label: '得力', keywords: ['得力', 'deli'] }
];

const ITEM_CATEGORY_KEYWORDS = {
  electronics: ['手机', '电脑', '笔记本', '平板', 'ipad', '耳机', 'airpods', '充电器', '数据线', '充电宝', '移动电源', '鼠标', '键盘', 'u盘', '硬盘', '相机', '手表', '智能手表', '手环', '计算器', '翻译机', '游戏机', 'switch', 'ps5'],
  card: ['身份证', '学生卡', '校园卡', '饭卡', '水卡', '公交卡', '银行卡', '信用卡', '会员卡', '驾照', '护照', '学生证', '工作证', '门禁卡'],
  book: ['课本', '教材', '笔记本', '作业本', '练习册', '试卷', '资料', '书籍', '图书', '杂志', '报纸', '词典', '字典', '参考书'],
  clothes: ['衣服', '外套', '大衣', '羽绒服', '卫衣', '毛衣', '衬衫', 't恤', '裤子', '牛仔裤', '裙子', '连衣裙', '帽子', '围巾', '手套', '袜子', '鞋子', '运动鞋', '拖鞋', '眼镜', '墨镜', '钱包', '书包', '背包', '手提包', '雨伞', '钥匙扣'],
  daily: ['水杯', '保温杯', '饭盒', '餐具', '牙刷', '牙膏', '毛巾', '沐浴露', '洗发水', '洗面奶', '护肤品', '化妆品', '钥匙', '锁', '剪刀', '胶水', '胶带', '订书机', '回形针', '便利贴', '文件夹', '文件袋', '垃圾袋', '纸巾', '卫生纸', '洗衣粉', '洗衣液'],
  other: []
};

function extractColors(text) {
  if (!text) return [];
  const lowerText = text.toLowerCase();
  const colors = [];
  
  COLORS.forEach(color => {
    const found = color.keywords.some(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );
    if (found) {
      colors.push({
        value: color.value,
        label: color.label,
        confidence: Math.min(0.95, 0.6 + Math.random() * 0.35)
      });
    }
  });
  
  if (colors.length === 0) {
    const randomColors = COLORS.sort(() => Math.random() - 0.5).slice(0, 2);
    randomColors.forEach(color => {
      colors.push({
        value: color.value,
        label: color.label,
        confidence: 0.5 + Math.random() * 0.3
      });
    });
  }
  
  return colors.sort((a, b) => b.confidence - a.confidence);
}

function extractBrands(text) {
  if (!text) return [];
  const lowerText = text.toLowerCase();
  const brands = [];
  
  BRANDS.forEach(brand => {
    const found = brand.keywords.some(keyword => 
      lowerText.includes(keyword.toLowerCase())
    );
    if (found) {
      brands.push({
        value: brand.value,
        label: brand.label,
        confidence: Math.min(0.98, 0.7 + Math.random() * 0.28)
      });
    }
  });
  
  if (brands.length === 0 && Math.random() > 0.5) {
    const randomBrand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
    brands.push({
      value: randomBrand.value,
      label: randomBrand.label,
      confidence: 0.4 + Math.random() * 0.3
    });
  }
  
  return brands.sort((a, b) => b.confidence - a.confidence);
}

function extractItemCategory(text) {
  if (!text) return null;
  const lowerText = text.toLowerCase();
  
  let bestMatch = null;
  let maxCount = 0;
  
  Object.entries(ITEM_CATEGORY_KEYWORDS).forEach(([category, keywords]) => {
    const count = keywords.filter(keyword => 
      lowerText.includes(keyword.toLowerCase())
    ).length;
    if (count > maxCount) {
      maxCount = count;
      bestMatch = category;
    }
  });
  
  if (bestMatch) {
    const itemType = constants.ITEM_TYPES.find(t => t.value === bestMatch);
    return {
      value: bestMatch,
      label: itemType ? itemType.label : bestMatch,
      confidence: Math.min(0.95, 0.5 + maxCount * 0.15)
    };
  }
  
  return null;
}

function analyzeImageMock(imagePath, existingText = '') {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockTexts = [
        '红色苹果iPhone 15手机，黑色壳',
        '蓝色华为MatePad平板电脑，带笔',
        '白色耐克运动鞋，42码',
        '黑色联想ThinkPad笔记本电脑',
        '银色小米充电宝，20000mAh',
        '棕色皮质钱包，内有身份证',
        '灰色阿迪达斯双肩背包',
        '金色学生卡，带有校园照片',
        '粉色膳魔师保温杯',
        '黑色金士顿U盘，64GB'
      ];
      
      const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
      const combinedText = existingText + ' ' + randomText;
      
      const colors = extractColors(combinedText);
      const brands = extractBrands(combinedText);
      const category = extractItemCategory(combinedText);
      
      resolve({
        success: true,
        imagePath,
        tags: {
          colors,
          brands,
          category
        },
        rawText: randomText,
        confidence: 0.75 + Math.random() * 0.2,
        processingTime: 500 + Math.random() * 1000
      });
    }, 800 + Math.random() * 1200);
  });
}

async function recognizeImage(imagePath, existingData = {}) {
  const existingText = [
    existingData.title || '',
    existingData.description || '',
    existingData.itemType ? constants.getLabelByValue(constants.ITEM_TYPES, existingData.itemType) : ''
  ].join(' ');
  
  return await analyzeImageMock(imagePath, existingText);
}

async function recognizeMultipleImages(imagePaths, existingData = {}) {
  const results = [];
  for (const path of imagePaths) {
    try {
      const result = await recognizeImage(path, existingData);
      results.push(result);
    } catch (e) {
      results.push({
        success: false,
        imagePath: path,
        error: e.message
      });
    }
  }
  return mergeRecognitionResults(results);
}

function mergeRecognitionResults(results) {
  const successfulResults = results.filter(r => r.success);
  
  if (successfulResults.length === 0) {
    return {
      success: false,
      merged: false,
      message: '所有图片识别失败'
    };
  }
  
  const allColors = {};
  const allBrands = {};
  let categoryVotes = {};
  
  successfulResults.forEach(result => {
    result.tags.colors.forEach(color => {
      if (!allColors[color.value]) {
        allColors[color.value] = { ...color, count: 0 };
      }
      allColors[color.value].count++;
      allColors[color.value].confidence = Math.max(allColors[color.value].confidence, color.confidence);
    });
    
    result.tags.brands.forEach(brand => {
      if (!allBrands[brand.value]) {
        allBrands[brand.value] = { ...brand, count: 0 };
      }
      allBrands[brand.value].count++;
      allBrands[brand.value].confidence = Math.max(allBrands[brand.value].confidence, brand.confidence);
    });
    
    if (result.tags.category) {
      if (!categoryVotes[result.tags.category.value]) {
        categoryVotes[result.tags.category.value] = { ...result.tags.category, count: 0 };
      }
      categoryVotes[result.tags.category.value].count++;
      categoryVotes[result.tags.category.value].confidence = Math.max(
        categoryVotes[result.tags.category.value].confidence,
        result.tags.category.confidence
      );
    }
  });
  
  const mergedColors = Object.values(allColors)
    .map(c => ({
      ...c,
      confidence: Math.min(0.98, c.confidence * (0.7 + c.count * 0.15))
    }))
    .sort((a, b) => b.count * b.confidence - a.count * a.confidence);
  
  const mergedBrands = Object.values(allBrands)
    .map(b => ({
      ...b,
      confidence: Math.min(0.98, b.confidence * (0.7 + b.count * 0.15))
    }))
    .sort((a, b) => b.count * b.confidence - a.count * a.confidence);
  
  const mergedCategory = Object.values(categoryVotes).length > 0
    ? Object.values(categoryVotes)
        .map(c => ({
          ...c,
          confidence: Math.min(0.98, c.confidence * (0.7 + c.count * 0.15))
        }))
        .sort((a, b) => b.count * b.confidence - a.count * a.confidence)[0]
    : null;
  
  const avgConfidence = successfulResults.reduce((sum, r) => sum + r.confidence, 0) / successfulResults.length;
  
  return {
    success: true,
    merged: true,
    resultCount: successfulResults.length,
    tags: {
      colors: mergedColors,
      brands: mergedBrands,
      category: mergedCategory
    },
    confidence: avgConfidence,
    individualResults: results
  };
}

function getTagLabel(type, value) {
  switch (type) {
    case 'color':
      const color = COLORS.find(c => c.value === value);
      return color ? color.label : value;
    case 'brand':
      const brand = BRANDS.find(b => b.value === value);
      return brand ? brand.label : value;
    case 'category':
      const cat = constants.ITEM_TYPES.find(c => c.value === value);
      return cat ? cat.label : value;
    default:
      return value;
  }
}

module.exports = {
  COLORS,
  BRANDS,
  recognizeImage,
  recognizeMultipleImages,
  mergeRecognitionResults,
  extractColors,
  extractBrands,
  extractItemCategory,
  getTagLabel
};
