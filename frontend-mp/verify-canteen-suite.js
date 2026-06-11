const path = require('path');
const fs = require('fs');
const constants = require('./config/constants');
const mockData = require('./config/mock-data');
const PAGES_DIR = path.resolve(__dirname, './pages/canteen');

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✅ ${name}`);
  } catch (err) {
    failed++;
    failures.push({ name, error: err.message });
    console.log(`  ❌ ${name}\n     → ${err.message}`);
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    },
    toBeDefined() {
      if (actual === undefined) throw new Error(`Expected value to be defined, got undefined`);
    },
    toBeGreaterThanOrEqual(n) {
      if (!(actual >= n)) throw new Error(`Expected ${actual} >= ${n}`);
    },
    toBeLessThanOrEqual(n) {
      if (!(actual <= n)) throw new Error(`Expected ${actual} <= ${n}`);
    },
    toBeNull() {
      if (actual !== null) throw new Error(`Expected null, got ${JSON.stringify(actual)}`);
    },
    toBeTrue() {
      if (actual !== true) throw new Error(`Expected true, got ${JSON.stringify(actual)}`);
    },
    toHaveProperty(p) {
      if (!(actual && Object.prototype.hasOwnProperty.call(actual, p)))
        throw new Error(`Expected object to have property "${p}"`);
    },
    toContain(pattern) {
      if (typeof actual !== 'string' || !actual.includes(pattern))
        throw new Error(`Expected string to contain "${pattern}"`);
    },
    toBeTruthy() {
      if (!actual) throw new Error(`Expected truthy value, got ${JSON.stringify(actual)}`);
    },
    toBeFalsy() {
      if (actual) throw new Error(`Expected falsy value, got ${JSON.stringify(actual)}`);
    }
  };
}

function readWxss(filename) {
  return fs.readFileSync(path.join(PAGES_DIR, `${filename}.wxss`), 'utf8');
}

console.log('\n========================================');
console.log('食堂模块测试套件 (canteen.test suite)');
console.log('========================================\n');

console.log('\n📦 DISH_TAGS 常量');
test('DISH_TAGS 数组长度>=10', () => {
  expect(Array.isArray(constants.DISH_TAGS)).toBeTrue();
  expect(constants.DISH_TAGS.length).toBeGreaterThanOrEqual(10);
});
test('每个标签含 value/label/color 字段', () => {
  constants.DISH_TAGS.forEach(tag => {
    expect(tag).toHaveProperty('value');
    expect(tag).toHaveProperty('label');
    expect(tag).toHaveProperty('color');
    expect(typeof tag.value).toBe('string');
    expect(tag.value.length).toBeGreaterThanOrEqual(1);
  });
});
test('标签 value 全是小写英文（ASCII）', () => {
  const asciiRegex = /^[a-z]+$/;
  constants.DISH_TAGS.forEach(tag => {
    if (!asciiRegex.test(tag.value)) throw new Error(`Tag value "${tag.value}" contains non-ASCII chars`);
  });
});
test('标签 value 唯一不重复', () => {
  const values = constants.DISH_TAGS.map(t => t.value);
  const unique = new Set(values);
  expect(unique.size).toBe(values.length);
});
test('包含核心标签 signature/recommend/new/spicy/healthy/popular/classic', () => {
  const s = new Set(constants.DISH_TAGS.map(t => t.value));
  ['signature', 'recommend', 'new', 'spicy', 'healthy', 'popular', 'classic'].forEach(v => {
    expect(s.has(v)).toBeTrue();
  });
});

console.log('\n🗺️  DISH_TAG_MAP 映射');
test('DISH_TAG_MAP 已导出为对象', () => {
  expect(typeof constants.DISH_TAG_MAP).toBe('object');
  expect(constants.DISH_TAG_MAP).toBeDefined();
});
test('DISH_TAG_MAP 条目数与 DISH_TAGS 一致', () => {
  expect(Object.keys(constants.DISH_TAG_MAP).length).toBe(constants.DISH_TAGS.length);
});
test('每个 DISH_TAG 的 value 能正确映射到对应 label/color', () => {
  constants.DISH_TAGS.forEach(tag => {
    if (!constants.DISH_TAG_MAP[tag.value]) throw new Error(`Missing key "${tag.value}" in DISH_TAG_MAP`);
    expect(constants.DISH_TAG_MAP[tag.value].label).toBe(tag.label);
    expect(constants.DISH_TAG_MAP[tag.value].color).toBe(tag.color);
  });
});
test('signature→招牌, recommend→推荐, new→新品, spicy→辣', () => {
  expect(constants.DISH_TAG_MAP['signature'].label).toBe('招牌');
  expect(constants.DISH_TAG_MAP['recommend'].label).toBe('推荐');
  expect(constants.DISH_TAG_MAP['new'].label).toBe('新品');
  expect(constants.DISH_TAG_MAP['spicy'].label).toBe('辣');
});

console.log('\n🍽️  Mock 菜品 MOCK_DISHES 标签');
const validTags = new Set(constants.DISH_TAGS.map(t => t.value));
test('MOCK_DISHES 非空数组', () => {
  expect(Array.isArray(mockData.MOCK_DISHES)).toBeTrue();
  expect(mockData.MOCK_DISHES.length).toBeGreaterThanOrEqual(10);
});
test('所有菜品 tags 的值在 DISH_TAGS 白名单中', () => {
  mockData.MOCK_DISHES.forEach(d => {
    (d.tags || []).forEach(t => {
      if (!validTags.has(t)) throw new Error(`Dish "${d.name}" (id=${d.id}) has invalid tag value "${t}" (not in DISH_TAGS)`);
    });
  });
});
test('所有菜品 tags 不含中文字符（防止 WXSS 错误）', () => {
  const cnRe = /[\u4e00-\u9fa5]/;
  mockData.MOCK_DISHES.forEach(d => {
    (d.tags || []).forEach(t => {
      if (cnRe.test(t)) throw new Error(`Dish "${d.name}" (id=${d.id}) tag "${t}" contains Chinese characters!`);
    });
  });
});
test('菜品必填字段完整 id/name/cover/price/canteenId/mealType', () => {
  mockData.MOCK_DISHES.forEach(d => {
    ['id', 'name', 'cover', 'price', 'canteenId', 'mealType'].forEach(f => {
      if (!Object.prototype.hasOwnProperty.call(d, f))
        throw new Error(`Dish id="${d.id}" missing required field "${f}"`);
    });
  });
});
test('菜品 mealType 仅 breakfast/lunch/dinner', () => {
  const s = new Set(['breakfast', 'lunch', 'dinner']);
  mockData.MOCK_DISHES.forEach(d => {
    expect(s.has(d.mealType)).toBeTrue();
  });
});
test('至少 3 个今日推荐 (isRecommend=true)', () => {
  expect(mockData.MOCK_DISHES.filter(d => d.isRecommend).length).toBeGreaterThanOrEqual(3);
});
test('至少 3 个新品上架 (isNew=true)', () => {
  expect(mockData.MOCK_DISHES.filter(d => d.isNew).length).toBeGreaterThanOrEqual(3);
});

console.log('\n🏪  Mock 食堂 MOCK_CANTEENS 档口标签');
test('MOCK_CANTEENS 非空数组', () => {
  expect(Array.isArray(mockData.MOCK_CANTEENS)).toBeTrue();
  expect(mockData.MOCK_CANTEENS.length).toBeGreaterThanOrEqual(3);
});
test('每个食堂 stalls 字段为数组', () => {
  mockData.MOCK_CANTEENS.forEach(c => {
    expect(Array.isArray(c.stalls)).toBeTrue();
  });
});
test('所有 stalls 的 featureTags 在白名单中', () => {
  mockData.MOCK_CANTEENS.forEach(c => {
    (c.stalls || []).forEach(s => {
      (s.featureTags || []).forEach(t => {
        if (!validTags.has(t)) throw new Error(`Canteen "${c.name}" Stall "${s.name}" invalid tag "${t}"`);
      });
    });
  });
});
test('所有 stalls featureTags 不含中文', () => {
  const cnRe = /[\u4e00-\u9fa5]/;
  mockData.MOCK_CANTEENS.forEach(c => {
    (c.stalls || []).forEach(s => {
      (s.featureTags || []).forEach(t => {
        if (cnRe.test(t)) throw new Error(`Canteen "${c.name}" Stall "${s.name}" tag "${t}" contains Chinese!`);
      });
    });
  });
});
test('食堂 crowdLevel 仅 idle/moderate/crowded', () => {
  const s = new Set(['idle', 'moderate', 'crowded']);
  mockData.MOCK_CANTEENS.forEach(c => {
    expect(s.has(c.crowdLevel)).toBeTrue();
  });
});

console.log('\n🎨  WXSS 类名合法性检查');
const cnClassRe = /\.[a-zA-Z0-9_-]*[\u4e00-\u9fa5]+[a-zA-Z0-9_-]*/g;
test('dish-detail.wxss 无中文类名选择器', () => {
  const content = readWxss('dish-detail');
  const matches = content.match(cnClassRe);
  if (matches) throw new Error(`Found Chinese class names: ${matches.join(', ')}`);
  expect(matches).toBeNull();
});
test('detail.wxss 无中文类名选择器', () => {
  const content = readWxss('detail');
  const matches = content.match(cnClassRe);
  if (matches) throw new Error(`Found Chinese class names: ${matches.join(', ')}`);
  expect(matches).toBeNull();
});
test('index.wxss 无中文类名选择器', () => {
  const content = readWxss('index');
  const matches = content.match(cnClassRe);
  if (matches) throw new Error(`Found Chinese class names: ${matches.join(', ')}`);
  expect(matches).toBeNull();
});

console.log('\n🔗  Mock 点评数据 ID 关联');
const canteenIdSet = new Set(mockData.MOCK_CANTEENS.map(c => c.id));
const dishIdSet = new Set(mockData.MOCK_DISHES.map(d => d.id));
test('MOCK_CANTEEN_REVIEWS.canteenId 全部指向真实食堂', () => {
  (mockData.MOCK_CANTEEN_REVIEWS || []).forEach(r => {
    expect(canteenIdSet.has(r.canteenId)).toBeTrue();
  });
});
test('MOCK_DISH_REVIEWS.dishId 全部指向真实菜品', () => {
  (mockData.MOCK_DISH_REVIEWS || []).forEach(r => {
    expect(dishIdSet.has(r.dishId)).toBeTrue();
  });
});
test('菜品点评 recommend 为布尔或 null', () => {
  (mockData.MOCK_DISH_REVIEWS || []).forEach(r => {
    const ty = typeof r.recommend;
    if (!(ty === 'boolean' || (ty === 'object' && r.recommend === null))) {
      throw new Error(`Review ${r.id} recommend="${r.recommend}" should be boolean/null`);
    }
  });
});
test('菜品点评 rating 在 1-5 范围内', () => {
  (mockData.MOCK_DISH_REVIEWS || []).forEach(r => {
    expect(r.rating).toBeGreaterThanOrEqual(1);
    expect(r.rating).toBeLessThanOrEqual(5);
  });
});

console.log('\n🧩  CSS 类与标签覆盖度检查');
test('dish-detail.wxss 定义了所有使用中的 .tag-* 类', () => {
  const content = readWxss('dish-detail');
  const used = new Set();
  mockData.MOCK_DISHES.forEach(d => (d.tags || []).forEach(t => used.add(t)));
  mockData.MOCK_CANTEENS.forEach(c => (c.stalls || []).forEach(s => (s.featureTags || []).forEach(t => used.add(t))));
  used.forEach(tag => {
    const p1 = `.tag-${tag} `;
    const p2 = `.tag-${tag}{`;
    const p3 = `.tag-${tag}\n`;
    if (!(content.includes(p1) || content.includes(p2) || content.includes(p3))) {
      throw new Error(`Missing .tag-${tag} class in dish-detail.wxss`);
    }
  });
});
test('detail.wxss 定义了所有使用中的 .dish-tag.tag-* 类', () => {
  const content = readWxss('detail');
  const used = new Set();
  mockData.MOCK_DISHES.forEach(d => (d.tags || []).forEach(t => used.add(t)));
  used.forEach(tag => {
    const pattern = `.dish-tag.tag-${tag}`;
    if (!content.includes(pattern)) {
      throw new Error(`Missing "${pattern}" class in detail.wxss`);
    }
  });
});

console.log('\n⚙️  JS 文件语法检查 (node -c)');
const jsFiles = [
  'services/data.js',
  'pages/canteen/index.js',
  'pages/canteen/detail.js',
  'pages/canteen/dish-detail.js',
  'config/constants.js',
  'config/mock-data.js'
];
const { execSync } = require('child_process');
jsFiles.forEach(f => {
  test(`JS 语法检查: ${f}`, () => {
    try {
      execSync(`node -c "${path.resolve(__dirname, f)}"`);
    } catch (e) {
      throw new Error(e.stderr ? e.stderr.toString().trim() : e.message);
    }
  });
});

console.log('\n========================================');
console.log('📊 测试结果汇总');
console.log('========================================');
console.log(`   通过: ${passed}`);
console.log(`   失败: ${failed}`);
console.log(`   总计: ${passed + failed}`);
if (failures.length > 0) {
  console.log('\n❌ 失败详情:');
  failures.forEach((f, i) => {
    console.log(`   ${i + 1}. ${f.name}`);
    console.log(`      → ${f.error}`);
  });
}
console.log('========================================\n');
process.exit(failed > 0 ? 1 : 0);
