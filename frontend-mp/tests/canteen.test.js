const path = require('path');
const fs = require('fs');
const constants = require('../config/constants');
const mockData = require('../config/mock-data');

const PAGES_DIR = path.resolve(__dirname, '../pages/canteen');

describe('DISH_TAGS 常量', () => {
  test('DISH_TAGS 数组长度应符合预期', () => {
    expect(Array.isArray(constants.DISH_TAGS)).toBe(true);
    expect(constants.DISH_TAGS.length).toBeGreaterThanOrEqual(10);
  });

  test('每个标签应包含必要字段 value/label/color', () => {
    constants.DISH_TAGS.forEach(tag => {
      expect(tag).toHaveProperty('value');
      expect(tag).toHaveProperty('label');
      expect(tag).toHaveProperty('color');
      expect(typeof tag.value).toBe('string');
      expect(typeof tag.label).toBe('string');
      expect(typeof tag.color).toBe('string');
      expect(tag.value.length).toBeGreaterThan(0);
      expect(tag.label.length).toBeGreaterThan(0);
    });
  });

  test('标签 value 应全部为英文（ASCII字符）', () => {
    const asciiRegex = /^[a-z]+$/;
    constants.DISH_TAGS.forEach(tag => {
      expect(asciiRegex.test(tag.value)).toBe(true);
    });
  });

  test('标签 value 应唯一，不可重复', () => {
    const values = constants.DISH_TAGS.map(t => t.value);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  test('应包含核心标签：signature/recommend/new/spicy/healthy/popular/classic', () => {
    const values = new Set(constants.DISH_TAGS.map(t => t.value));
    expect(values.has('signature')).toBe(true);
    expect(values.has('recommend')).toBe(true);
    expect(values.has('new')).toBe(true);
    expect(values.has('spicy')).toBe(true);
    expect(values.has('healthy')).toBe(true);
    expect(values.has('popular')).toBe(true);
    expect(values.has('classic')).toBe(true);
  });
});

describe('DISH_TAG_MAP 映射', () => {
  test('DISH_TAG_MAP 应被正确导出', () => {
    expect(constants.DISH_TAG_MAP).toBeDefined();
    expect(typeof constants.DISH_TAG_MAP).toBe('object');
  });

  test('DISH_TAG_MAP 与 DISH_TAGS 数量一致', () => {
    const mapKeys = Object.keys(constants.DISH_TAG_MAP);
    expect(mapKeys.length).toBe(constants.DISH_TAGS.length);
  });

  test('每个 value 都能正确映射到 label 和 color', () => {
    constants.DISH_TAGS.forEach(tag => {
      expect(constants.DISH_TAG_MAP[tag.value]).toBeDefined();
      expect(constants.DISH_TAG_MAP[tag.value].label).toBe(tag.label);
      expect(constants.DISH_TAG_MAP[tag.value].color).toBe(tag.color);
    });
  });

  test('signature 应映射为招牌，recommend映射为推荐', () => {
    expect(constants.DISH_TAG_MAP['signature'].label).toBe('招牌');
    expect(constants.DISH_TAG_MAP['recommend'].label).toBe('推荐');
    expect(constants.DISH_TAG_MAP['new'].label).toBe('新品');
    expect(constants.DISH_TAG_MAP['spicy'].label).toBe('辣');
  });
});

describe('Mock 数据 - MOCK_DISHES 标签规范', () => {
  const validTagValues = new Set(constants.DISH_TAGS.map(t => t.value));

  test('MOCK_DISHES 应存在且为数组', () => {
    expect(Array.isArray(mockData.MOCK_DISHES)).toBe(true);
    expect(mockData.MOCK_DISHES.length).toBeGreaterThan(0);
  });

  test('所有菜品的 tags 字段中的值应为英文（在 DISH_TAGS 中存在）', () => {
    mockData.MOCK_DISHES.forEach(dish => {
      if (dish.tags && Array.isArray(dish.tags)) {
        dish.tags.forEach(tag => {
          expect(validTagValues.has(tag)).toBe(true);
        });
      }
    });
  });

  test('所有菜品的 tags 不得包含中文字符', () => {
    const chineseRegex = /[\u4e00-\u9fa5]/;
    mockData.MOCK_DISHES.forEach(dish => {
      if (dish.tags && Array.isArray(dish.tags)) {
        dish.tags.forEach(tag => {
          expect(chineseRegex.test(tag)).toBe(false);
        });
      }
    });
  });

  test('菜品必填字段应完整', () => {
    mockData.MOCK_DISHES.forEach(dish => {
      expect(dish).toHaveProperty('id');
      expect(dish).toHaveProperty('name');
      expect(dish).toHaveProperty('cover');
      expect(dish).toHaveProperty('price');
      expect(dish).toHaveProperty('canteenId');
      expect(dish).toHaveProperty('mealType');
    });
  });

  test('菜品 mealType 只应为 breakfast/lunch/dinner', () => {
    const validMealTypes = new Set(['breakfast', 'lunch', 'dinner']);
    mockData.MOCK_DISHES.forEach(dish => {
      expect(validMealTypes.has(dish.mealType)).toBe(true);
    });
  });

  test('今日推荐菜品应有 isRecommend=true', () => {
    const recommended = mockData.MOCK_DISHES.filter(d => d.isRecommend);
    expect(recommended.length).toBeGreaterThanOrEqual(3);
  });

  test('新品菜品应有 isNew=true', () => {
    const newDishes = mockData.MOCK_DISHES.filter(d => d.isNew);
    expect(newDishes.length).toBeGreaterThanOrEqual(3);
  });
});

describe('Mock 数据 - MOCK_CANTEENS 档口 featureTags', () => {
  const validTagValues = new Set(constants.DISH_TAGS.map(t => t.value));

  test('MOCK_CANTEENS 应为数组且非空', () => {
    expect(Array.isArray(mockData.MOCK_CANTEENS)).toBe(true);
    expect(mockData.MOCK_CANTEENS.length).toBeGreaterThan(0);
  });

  test('所有食堂的 stalls 应为数组', () => {
    mockData.MOCK_CANTEENS.forEach(canteen => {
      expect(Array.isArray(canteen.stalls)).toBe(true);
    });
  });

  test('所有档口的 featureTags 应为合法的英文标签', () => {
    mockData.MOCK_CANTEENS.forEach(canteen => {
      (canteen.stalls || []).forEach(stall => {
        if (stall.featureTags && Array.isArray(stall.featureTags)) {
          stall.featureTags.forEach(tag => {
            expect(validTagValues.has(tag)).toBe(true);
          });
        }
      });
    });
  });

  test('所有档口的 featureTags 不得包含中文', () => {
    const chineseRegex = /[\u4e00-\u9fa5]/;
    mockData.MOCK_CANTEENS.forEach(canteen => {
      (canteen.stalls || []).forEach(stall => {
        if (stall.featureTags && Array.isArray(stall.featureTags)) {
          stall.featureTags.forEach(tag => {
            expect(chineseRegex.test(tag)).toBe(false);
          });
        }
      });
    });
  });

  test('食堂 crowdLevel 应为 idle/moderate/crowded 三者之一', () => {
    const validLevels = new Set(['idle', 'moderate', 'crowded']);
    mockData.MOCK_CANTEENS.forEach(canteen => {
      expect(validLevels.has(canteen.crowdLevel)).toBe(true);
    });
  });
});

describe('WXSS 类名合法性检查（防止中文类名）', () => {
  const chineseRegex = /\.[a-zA-Z0-9_-]*[\u4e00-\u9fa5]+[a-zA-Z0-9_-]*/g;

  function readWxss(filename) {
    const filePath = path.join(PAGES_DIR, filename, `${filename}.wxss`);
    return fs.readFileSync(filePath, 'utf8');
  }

  test('dish-detail.wxss 不应包含任何中文类名选择器', () => {
    const content = readWxss('dish-detail');
    const matches = content.match(chineseRegex);
    expect(matches).toBeNull();
  });

  test('detail.wxss 不应包含任何中文类名选择器', () => {
    const content = readWxss('detail');
    const matches = content.match(chineseRegex);
    expect(matches).toBeNull();
  });

  test('index.wxss 不应包含任何中文类名选择器', () => {
    const content = readWxss('index');
    const matches = content.match(chineseRegex);
    expect(matches).toBeNull();
  });
});

describe('Mock 点评数据 ID 关联正确性', () => {
  test('MOCK_CANTEEN_REVIEWS 的 canteenId 应对应真实食堂', () => {
    const validCanteenIds = new Set(mockData.MOCK_CANTEENS.map(c => c.id));
    (mockData.MOCK_CANTEEN_REVIEWS || []).forEach(review => {
      expect(validCanteenIds.has(review.canteenId)).toBe(true);
    });
  });

  test('MOCK_DISH_REVIEWS 的 dishId 应对应真实菜品', () => {
    const validDishIds = new Set(mockData.MOCK_DISHES.map(d => d.id));
    (mockData.MOCK_DISH_REVIEWS || []).forEach(review => {
      expect(validDishIds.has(review.dishId)).toBe(true);
    });
  });

  test('MOCK_DISH_REVIEWS 的 recommend 字段应为布尔或 null', () => {
    (mockData.MOCK_DISH_REVIEWS || []).forEach(review => {
      const type = typeof review.recommend;
      expect(type === 'boolean' || type === 'object').toBe(true);
    });
  });

  test('菜品点评的 rating 应在 1-5 范围内', () => {
    (mockData.MOCK_DISH_REVIEWS || []).forEach(review => {
      expect(review.rating).toBeGreaterThanOrEqual(1);
      expect(review.rating).toBeLessThanOrEqual(5);
    });
  });
});

describe('CSS 类与实际标签的覆盖度', () => {
  test('dish-detail.wxss 应定义所有使用中的 tag-* 类', () => {
    const content = fs.readFileSync(path.join(PAGES_DIR, 'dish-detail/dish-detail.wxss'), 'utf8');
    const usedTags = new Set();
    mockData.MOCK_DISHES.forEach(d => (d.tags || []).forEach(t => usedTags.add(t)));
    mockData.MOCK_CANTEENS.forEach(c => (c.stalls || []).forEach(s => (s.featureTags || []).forEach(t => usedTags.add(t))));

    usedTags.forEach(tag => {
      expect(content.includes(`.tag-${tag} `) || content.includes(`.tag-${tag}{`) || content.includes(`.tag-${tag}\n`))
        .toBe(true);
    });
  });

  test('detail.wxss 应定义所有使用中的 .dish-tag.tag-* 类', () => {
    const content = fs.readFileSync(path.join(PAGES_DIR, 'detail/detail.wxss'), 'utf8');
    const usedTags = new Set();
    mockData.MOCK_DISHES.forEach(d => (d.tags || []).forEach(t => usedTags.add(t)));

    usedTags.forEach(tag => {
      const pattern = `.dish-tag.tag-${tag}`;
      expect(content.includes(pattern)).toBe(true);
    });
  });
});
