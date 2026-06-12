const path = require('path');
const fs = require('fs');
const constants = require('../config/constants');
const mockData = require('../config/mock-data');

const PAGES_DIR = path.resolve(__dirname, '../pages/scenery');

describe('SCENERY_CATEGORIES 常量', () => {
  test('SCENERY_CATEGORIES 应为数组且非空', () => {
    expect(Array.isArray(constants.SCENERY_CATEGORIES)).toBe(true);
    expect(constants.SCENERY_CATEGORIES.length).toBeGreaterThan(0);
  });

  test('每个分类应包含必要字段 value/label/icon', () => {
    constants.SCENERY_CATEGORIES.forEach(cat => {
      expect(cat).toHaveProperty('value');
      expect(cat).toHaveProperty('label');
      expect(cat).toHaveProperty('icon');
      expect(typeof cat.value).toBe('string');
      expect(typeof cat.label).toBe('string');
      expect(typeof cat.icon).toBe('string');
      expect(cat.value.length).toBeGreaterThan(0);
      expect(cat.label.length).toBeGreaterThan(0);
    });
  });

  test('第一个分类应为 all（全部）', () => {
    expect(constants.SCENERY_CATEGORIES[0].value).toBe('all');
    expect(constants.SCENERY_CATEGORIES[0].label).toBe('全部');
  });

  test('分类 value 应全部为英文（ASCII字符）', () => {
    const asciiRegex = /^[a-z]+$/;
    constants.SCENERY_CATEGORIES.forEach(cat => {
      expect(asciiRegex.test(cat.value)).toBe(true);
    });
  });

  test('分类 value 应唯一，不可重复', () => {
    const values = constants.SCENERY_CATEGORIES.map(c => c.value);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  test('应包含核心分类：all/architecture/nature/activity/night', () => {
    const values = new Set(constants.SCENERY_CATEGORIES.map(c => c.value));
    expect(values.has('all')).toBe(true);
    expect(values.has('architecture')).toBe(true);
    expect(values.has('nature')).toBe(true);
    expect(values.has('activity')).toBe(true);
    expect(values.has('night')).toBe(true);
  });
});

describe('SCENERY_CATEGORY_MAP 映射', () => {
  test('SCENERY_CATEGORY_MAP 应被正确导出', () => {
    expect(constants.SCENERY_CATEGORY_MAP).toBeDefined();
    expect(typeof constants.SCENERY_CATEGORY_MAP).toBe('object');
  });

  test('SCENERY_CATEGORY_MAP 与 SCENERY_CATEGORIES 数量一致', () => {
    const mapKeys = Object.keys(constants.SCENERY_CATEGORY_MAP);
    expect(mapKeys.length).toBe(constants.SCENERY_CATEGORIES.length);
  });

  test('每个 value 都能正确映射到 label 和 icon', () => {
    constants.SCENERY_CATEGORIES.forEach(cat => {
      expect(constants.SCENERY_CATEGORY_MAP[cat.value]).toBeDefined();
      expect(constants.SCENERY_CATEGORY_MAP[cat.value].label).toBe(cat.label);
      expect(constants.SCENERY_CATEGORY_MAP[cat.value].icon).toBe(cat.icon);
    });
  });

  test('all 应映射为全部，architecture 映射为建筑', () => {
    expect(constants.SCENERY_CATEGORY_MAP['all'].label).toBe('全部');
    expect(constants.SCENERY_CATEGORY_MAP['architecture'].label).toBe('建筑');
    expect(constants.SCENERY_CATEGORY_MAP['nature'].label).toBe('自然');
    expect(constants.SCENERY_CATEGORY_MAP['activity'].label).toBe('活动');
    expect(constants.SCENERY_CATEGORY_MAP['night'].label).toBe('夜景');
  });
});

describe('SCENERY_SEASONS 常量', () => {
  test('SCENERY_SEASONS 应为数组且长度为4', () => {
    expect(Array.isArray(constants.SCENERY_SEASONS)).toBe(true);
    expect(constants.SCENERY_SEASONS.length).toBe(4);
  });

  test('每个季节应包含 value/label/icon/color 字段', () => {
    constants.SCENERY_SEASONS.forEach(s => {
      expect(s).toHaveProperty('value');
      expect(s).toHaveProperty('label');
      expect(s).toHaveProperty('icon');
      expect(s).toHaveProperty('color');
      expect(typeof s.color).toBe('string');
      expect(s.color.startsWith('#')).toBe(true);
    });
  });

  test('应包含春夏秋冬四个季节且顺序正确', () => {
    expect(constants.SCENERY_SEASONS[0].value).toBe('spring');
    expect(constants.SCENERY_SEASONS[0].label).toBe('春');
    expect(constants.SCENERY_SEASONS[1].value).toBe('summer');
    expect(constants.SCENERY_SEASONS[1].label).toBe('夏');
    expect(constants.SCENERY_SEASONS[2].value).toBe('autumn');
    expect(constants.SCENERY_SEASONS[2].label).toBe('秋');
    expect(constants.SCENERY_SEASONS[3].value).toBe('winter');
    expect(constants.SCENERY_SEASONS[3].label).toBe('冬');
  });

  test('季节 value 应唯一', () => {
    const values = constants.SCENERY_SEASONS.map(s => s.value);
    expect(new Set(values).size).toBe(values.length);
  });
});

describe('SCENERY_REVIEW_STATUS 审核状态常量', () => {
  test('SCENERY_REVIEW_STATUS 应为数组且非空', () => {
    expect(Array.isArray(constants.SCENERY_REVIEW_STATUS)).toBe(true);
    expect(constants.SCENERY_REVIEW_STATUS.length).toBeGreaterThan(0);
  });

  test('每个状态应包含 value/label/color 字段', () => {
    constants.SCENERY_REVIEW_STATUS.forEach(s => {
      expect(s).toHaveProperty('value');
      expect(s).toHaveProperty('label');
      expect(s).toHaveProperty('color');
      expect(s.color.startsWith('#')).toBe(true);
    });
  });

  test('应包含三种核心状态：pending/approved/rejected', () => {
    const values = new Set(constants.SCENERY_REVIEW_STATUS.map(s => s.value));
    expect(values.has('pending')).toBe(true);
    expect(values.has('approved')).toBe(true);
    expect(values.has('rejected')).toBe(true);
  });

  test('pending 应为橙色，approved 应为绿色，rejected 应为红色', () => {
    const statusMap = {};
    constants.SCENERY_REVIEW_STATUS.forEach(s => {
      statusMap[s.value] = s;
    });
    expect(statusMap['pending'].color.startsWith('#F')).toBe(true);
    expect(statusMap['approved'].color.startsWith('#1') || statusMap['approved'].color.startsWith('#10')).toBe(true);
    expect(statusMap['rejected'].color.startsWith('#E')).toBe(true);
  });
});

describe('SCENERY_LOCATIONS 地点常量', () => {
  test('SCENERY_LOCATIONS 应为数组且非空', () => {
    expect(Array.isArray(constants.SCENERY_LOCATIONS)).toBe(true);
    expect(constants.SCENERY_LOCATIONS.length).toBeGreaterThan(0);
  });

  test('每个地点应包含 value/label/latitude/longitude 字段', () => {
    constants.SCENERY_LOCATIONS.forEach(loc => {
      expect(loc).toHaveProperty('value');
      expect(loc).toHaveProperty('label');
      expect(loc).toHaveProperty('latitude');
      expect(loc).toHaveProperty('longitude');
      expect(typeof loc.latitude).toBe('number');
      expect(typeof loc.longitude).toBe('number');
    });
  });

  test('地点 value 应全部为英文', () => {
    const asciiRegex = /^[a-z_]+$/;
    constants.SCENERY_LOCATIONS.forEach(loc => {
      expect(asciiRegex.test(loc.value)).toBe(true);
    });
  });

  test('纬度应在合理范围 [-90, 90]，经度应在合理范围 [-180, 180]', () => {
    constants.SCENERY_LOCATIONS.forEach(loc => {
      expect(loc.latitude).toBeGreaterThanOrEqual(-90);
      expect(loc.latitude).toBeLessThanOrEqual(90);
      expect(loc.longitude).toBeGreaterThanOrEqual(-180);
      expect(loc.longitude).toBeLessThanOrEqual(180);
    });
  });
});

describe('SCENERY_SOLAR_TERMS 节气常量', () => {
  test('SCENERY_SOLAR_TERMS 应为数组且长度为24', () => {
    expect(Array.isArray(constants.SCENERY_SOLAR_TERMS)).toBe(true);
    expect(constants.SCENERY_SOLAR_TERMS.length).toBe(24);
  });

  test('每个节气应包含 value/label/season/icon 字段', () => {
    const validSeasons = new Set(['spring', 'summer', 'autumn', 'winter']);
    constants.SCENERY_SOLAR_TERMS.forEach(t => {
      expect(t).toHaveProperty('value');
      expect(t).toHaveProperty('label');
      expect(t).toHaveProperty('season');
      expect(t).toHaveProperty('icon');
      expect(validSeasons.has(t.season)).toBe(true);
    });
  });

  test('每个季节应各有6个节气', () => {
    const seasonCount = { spring: 0, summer: 0, autumn: 0, winter: 0 };
    constants.SCENERY_SOLAR_TERMS.forEach(t => {
      seasonCount[t.season]++;
    });
    expect(seasonCount.spring).toBe(6);
    expect(seasonCount.summer).toBe(6);
    expect(seasonCount.autumn).toBe(6);
    expect(seasonCount.winter).toBe(6);
  });

  test('节气 value 应唯一且为英文', () => {
    const asciiRegex = /^[a-z]+$/;
    const values = constants.SCENERY_SOLAR_TERMS.map(t => t.value);
    expect(new Set(values).size).toBe(values.length);
    values.forEach(v => expect(asciiRegex.test(v)).toBe(true));
  });
});

describe('Mock 数据 - SCENERY_LIST 风光列表', () => {
  const validCategoryValues = new Set(constants.SCENERY_CATEGORIES.map(c => c.value));
  const validSeasonValues = new Set(constants.SCENERY_SEASONS.map(s => s.value));
  const validLocationValues = new Set(constants.SCENERY_LOCATIONS.map(l => l.value));
  const validReviewStatusValues = new Set(constants.SCENERY_REVIEW_STATUS.map(s => s.value));

  test('SCENERY_LIST 应存在且为数组', () => {
    expect(Array.isArray(mockData.SCENERY_LIST)).toBe(true);
    expect(mockData.SCENERY_LIST.length).toBeGreaterThan(0);
  });

  test('每条风光数据应包含完整必填字段', () => {
    mockData.SCENERY_LIST.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('description');
      expect(item).toHaveProperty('image');
      expect(item).toHaveProperty('category');
      expect(item).toHaveProperty('season');
      expect(item).toHaveProperty('location');
      expect(item).toHaveProperty('reviewStatus');
      expect(item).toHaveProperty('likes');
      expect(item).toHaveProperty('commentCount');
      expect(item).toHaveProperty('views');
    });
  });

  test('category 应为 SCENERY_CATEGORIES 中定义的合法值', () => {
    mockData.SCENERY_LIST.forEach(item => {
      expect(validCategoryValues.has(item.category)).toBe(true);
    });
  });

  test('season 应为 SCENERY_SEASONS 中定义的合法值', () => {
    mockData.SCENERY_LIST.forEach(item => {
      expect(validSeasonValues.has(item.season)).toBe(true);
    });
  });

  test('location.value 应为 SCENERY_LOCATIONS 中定义的合法值', () => {
    mockData.SCENERY_LIST.forEach(item => {
      expect(item.location).toHaveProperty('value');
      expect(item.location).toHaveProperty('label');
      expect(validLocationValues.has(item.location.value)).toBe(true);
    });
  });

  test('reviewStatus 应为合法的审核状态', () => {
    mockData.SCENERY_LIST.forEach(item => {
      expect(validReviewStatusValues.has(item.reviewStatus)).toBe(true);
    });
  });

  test('likes/commentCount/views 应为非负整数', () => {
    mockData.SCENERY_LIST.forEach(item => {
      expect(Number.isInteger(item.likes)).toBe(true);
      expect(item.likes).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(item.commentCount)).toBe(true);
      expect(item.commentCount).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(item.views)).toBe(true);
      expect(item.views).toBeGreaterThanOrEqual(0);
    });
  });

  test('id 应唯一，不可重复', () => {
    const ids = mockData.SCENERY_LIST.map(i => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('应包含至少一条 approved 状态的风光照片', () => {
    const approved = mockData.SCENERY_LIST.filter(i => i.reviewStatus === 'approved');
    expect(approved.length).toBeGreaterThanOrEqual(1);
  });

  test('风光的 solarTerm 字段如存在应在 SCENERY_SOLAR_TERMS 中', () => {
    const validSolarTerms = new Set(constants.SCENERY_SOLAR_TERMS.map(t => t.value));
    mockData.SCENERY_LIST.forEach(item => {
      if (item.solarTerm) {
        expect(validSolarTerms.has(item.solarTerm)).toBe(true);
      }
    });
  });
});

describe('Mock 数据 - SCENERY_COLLECTIONS 主题合集', () => {
  test('SCENERY_COLLECTIONS 应为数组且非空', () => {
    expect(Array.isArray(mockData.SCENERY_COLLECTIONS)).toBe(true);
    expect(mockData.SCENERY_COLLECTIONS.length).toBeGreaterThan(0);
  });

  test('每个合集应包含完整必填字段', () => {
    mockData.SCENERY_COLLECTIONS.forEach(col => {
      expect(col).toHaveProperty('id');
      expect(col).toHaveProperty('title');
      expect(col).toHaveProperty('description');
      expect(col).toHaveProperty('cover');
      expect(col).toHaveProperty('icon');
      expect(col).toHaveProperty('itemCount');
      expect(col).toHaveProperty('views');
      expect(col).toHaveProperty('type');
    });
  });

  test('合集 id 应唯一', () => {
    const ids = mockData.SCENERY_COLLECTIONS.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('type 应为 season 或 solar_term 之一', () => {
    const validTypes = new Set(['season', 'solar_term']);
    mockData.SCENERY_COLLECTIONS.forEach(col => {
      expect(validTypes.has(col.type)).toBe(true);
    });
  });

  test('type=season 的合集应有 season 字段且合法', () => {
    const validSeasons = new Set(constants.SCENERY_SEASONS.map(s => s.value));
    mockData.SCENERY_COLLECTIONS.filter(c => c.type === 'season').forEach(col => {
      expect(col).toHaveProperty('season');
      expect(validSeasons.has(col.season)).toBe(true);
    });
  });

  test('type=solar_term 的合集应有 solarTerms 数组', () => {
    const validSolarTerms = new Set(constants.SCENERY_SOLAR_TERMS.map(t => t.value));
    mockData.SCENERY_COLLECTIONS.filter(c => c.type === 'solar_term').forEach(col => {
      expect(Array.isArray(col.solarTerms)).toBe(true);
      expect(col.solarTerms.length).toBeGreaterThan(0);
      col.solarTerms.forEach(t => {
        expect(validSolarTerms.has(t)).toBe(true);
      });
    });
  });

  test('itemCount 和 views 应为非负整数', () => {
    mockData.SCENERY_COLLECTIONS.forEach(col => {
      expect(Number.isInteger(col.itemCount)).toBe(true);
      expect(col.itemCount).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(col.views)).toBe(true);
      expect(col.views).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('WXML 语法检查（防止WXML不支持的语法）', () => {
  const wxmlContent = fs.readFileSync(path.join(PAGES_DIR, 'index.wxml'), 'utf8');

  test('WXML 中不应包含箭头函数语法 =>', () => {
    const arrowFunctionRegex = /=>/g;
    const matches = wxmlContent.match(arrowFunctionRegex);
    expect(matches).toBeNull();
  });

  test('WXML 中不应包含复杂的 findIndex 调用', () => {
    expect(wxmlContent.includes('findIndex')).toBe(false);
  });

  test('WXML 中应包含 {{activeCategoryLabel}} 数据绑定', () => {
    expect(wxmlContent.includes('{{activeCategoryLabel}}')).toBe(true);
  });

  test('WXML 中不应包含任何中文类名选择器', () => {
    const chineseClassRegex = /class="[^"]*[\u4e00-\u9fa5]+[^"]*"/g;
    const matches = wxmlContent.match(chineseClassRegex);
    expect(matches).toBeNull();
  });

  test('WXML wx:for 循环应正确使用 wx:key', () => {
    const forWithoutKeyRegex = /wx:for="{{[^}]+}}"[^>]*?(?<!wx:key=)/g;
    const wxForMatches = [...wxmlContent.matchAll(/wx:for="{{[^}]+}}"/g)];
    wxForMatches.forEach(match => {
      const snippetStart = match.index;
      const snippet = wxmlContent.substring(snippetStart, snippetStart + 200);
      expect(snippet.includes('wx:key')).toBe(true);
    });
  });

  test('WXML <view> 和 </view> 标签数量应匹配', () => {
    const openViews = (wxmlContent.match(/<view[\s>]/g) || []).length;
    const closeViews = (wxmlContent.match(/<\/view>/g) || []).length;
    expect(openViews).toBe(closeViews);
  });

  test('WXML <scroll-view> 和 </scroll-view> 标签数量应匹配', () => {
    const openScrolls = (wxmlContent.match(/<scroll-view[\s>]/g) || []).length;
    const closeScrolls = (wxmlContent.match(/<\/scroll-view>/g) || []).length;
    expect(openScrolls).toBe(closeScrolls);
  });

  test('WXML <text> 和 </text> 标签数量应匹配', () => {
    const openTexts = (wxmlContent.match(/<text[\s>]/g) || []).length;
    const closeTexts = (wxmlContent.match(/<\/text>/g) || []).length;
    expect(openTexts).toBe(closeTexts);
  });

  test('WXML <image> 标签应有 mode 属性', () => {
    const imageMatches = [...wxmlContent.matchAll(/<image[^>]*>/g)];
    imageMatches.forEach(match => {
      expect(match[0].includes('mode=')).toBe(true);
    });
  });

  test('WXML 绑定的事件应在 JS 中有对应的方法', () => {
    const jsContent = fs.readFileSync(path.join(PAGES_DIR, 'index.js'), 'utf8');
    const bindEventRegex = /bindtap="([^"]+)"/g;
    let eventMatch;
    while ((eventMatch = bindEventRegex.exec(wxmlContent)) !== null) {
      const methodName = eventMatch[1];
      const methodPattern = new RegExp(`${methodName}\\s*\\(`);
      expect(methodPattern.test(jsContent)).toBe(true);
    }
  });
});

describe('WXSS 类名合法性检查', () => {
  const wxssContent = fs.readFileSync(path.join(PAGES_DIR, 'index.wxss'), 'utf8');
  const chineseClassRegex = /\.[a-zA-Z0-9_-]*[\u4e00-\u9fa5]+[a-zA-Z0-9_-]*/g;

  test('index.wxss 不应包含任何中文类名选择器', () => {
    const matches = wxssContent.match(chineseClassRegex);
    expect(matches).toBeNull();
  });
});

describe('JS 代码质量检查', () => {
  const jsContent = fs.readFileSync(path.join(PAGES_DIR, 'index.js'), 'utf8');

  test('index.js 中应定义 getCategoryLabel 方法', () => {
    expect(jsContent.includes('getCategoryLabel')).toBe(true);
  });

  test('index.js 中应定义 activeCategoryLabel 数据字段', () => {
    expect(jsContent.includes('activeCategoryLabel')).toBe(true);
  });

  test('loadData 方法中应更新 activeCategoryLabel', () => {
    const loadDataMatch = jsContent.match(/loadData\s*\([\s\S]*?\},\s*\n/);
    if (loadDataMatch) {
      expect(loadDataMatch[0].includes('activeCategoryLabel')).toBe(true);
    }
  });

  test('onCategoryChange 方法中应更新 activeCategoryLabel', () => {
    const onCategoryChangeMatch = jsContent.match(/onCategoryChange\s*\([\s\S]*?\},\s*\n/);
    if (onCategoryChangeMatch) {
      expect(onCategoryChangeMatch[0].includes('activeCategoryLabel')).toBe(true);
    }
  });

  test('index.js 使用的 mixPage 应正确导入', () => {
    expect(jsContent.includes("mixPage")).toBe(true);
    expect(jsContent.includes("withTheme")).toBe(true);
  });

  test('index.js 不应有直接引用的 WXML 不支持语法', () => {
    expect(jsContent.includes('categories.findIndex')).toBe(false);
  });
});
