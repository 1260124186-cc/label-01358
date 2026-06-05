const storage = require('../utils/storage');

beforeEach(() => {
  try {
    Object.values(storage.STORAGE_KEYS).forEach(key => {
      wx.removeStorageSync(key);
    });
  } catch (e) {}
});

describe('STORAGE_KEYS 常量', () => {
  test('应包含问卷相关存储键', () => {
    expect(storage.STORAGE_KEYS.SURVEY_LIST).toBe('surveyList');
    expect(storage.STORAGE_KEYS.SURVEY_RESPONSES).toBe('surveyResponses');
  });

  test('所有存储键值应唯一', () => {
    const values = Object.values(storage.STORAGE_KEYS);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  test('所有存储键应为字符串', () => {
    Object.values(storage.STORAGE_KEYS).forEach(value => {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    });
  });
});

describe('storage 存储操作', () => {
  test('get 无数据时应返回 null', () => {
    const result = storage.get('nonexistent_key');
    expect(result).toBeNull();
  });

  test('set 和 get 应能正确存取数据', () => {
    const testData = { id: 'test', title: '测试' };
    storage.set(storage.STORAGE_KEYS.SURVEY_LIST, testData);
    const result = storage.get(storage.STORAGE_KEYS.SURVEY_LIST);
    expect(result).toEqual(testData);
  });

  test('addToList 应将数据添加到列表开头', () => {
    const item1 = { id: '1', title: '第一个' };
    const item2 = { id: '2', title: '第二个' };

    storage.addToList(storage.STORAGE_KEYS.SURVEY_LIST, item1);
    storage.addToList(storage.STORAGE_KEYS.SURVEY_LIST, item2);

    const result = storage.getList(storage.STORAGE_KEYS.SURVEY_LIST);
    expect(result.length).toBe(2);
    expect(result[0].id).toBe('2');
    expect(result[1].id).toBe('1');
  });

  test('getList 无数据时应返回空数组', () => {
    const result = storage.getList(storage.STORAGE_KEYS.SURVEY_RESPONSES);
    expect(result).toEqual([]);
  });

  test('removeFromList 应删除指定 id 的数据', () => {
    const item1 = { id: '1', title: '第一个' };
    const item2 = { id: '2', title: '第二个' };

    storage.addToList(storage.STORAGE_KEYS.SURVEY_LIST, item1);
    storage.addToList(storage.STORAGE_KEYS.SURVEY_LIST, item2);

    storage.removeFromList(storage.STORAGE_KEYS.SURVEY_LIST, '1');

    const result = storage.getList(storage.STORAGE_KEYS.SURVEY_LIST);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });

  test('updateInList 应更新指定 id 的数据', () => {
    const item = { id: '1', title: '原始标题', status: 'active' };
    storage.addToList(storage.STORAGE_KEYS.SURVEY_LIST, item);

    const result = storage.updateInList(storage.STORAGE_KEYS.SURVEY_LIST, '1', {
      title: '更新后的标题',
      status: 'closed'
    });

    expect(result).toBe(true);
    const updated = storage.getList(storage.STORAGE_KEYS.SURVEY_LIST)[0];
    expect(updated.title).toBe('更新后的标题');
    expect(updated.status).toBe('closed');
  });

  test('updateInList 数据不存在时应返回 false', () => {
    const result = storage.updateInList(storage.STORAGE_KEYS.SURVEY_LIST, 'nonexistent', { title: '测试' });
    expect(result).toBe(false);
  });

  test('remove 应删除指定键的所有数据', () => {
    storage.set(storage.STORAGE_KEYS.SURVEY_LIST, [{ id: '1' }]);
    storage.remove(storage.STORAGE_KEYS.SURVEY_LIST);
    const result = storage.get(storage.STORAGE_KEYS.SURVEY_LIST);
    expect(result).toBeNull();
  });

  test('addToList 返回值应为 true', () => {
    const result = storage.addToList(storage.STORAGE_KEYS.SURVEY_LIST, { id: '1' });
    expect(result).toBe(true);
  });

  test('set 返回值应为 true', () => {
    const result = storage.set(storage.STORAGE_KEYS.SURVEY_LIST, []);
    expect(result).toBe(true);
  });
});

describe('storage 异常处理', () => {
  let originalGetStorageSync;
  let originalSetStorageSync;
  let originalRemoveStorageSync;

  beforeEach(() => {
    originalGetStorageSync = wx.getStorageSync;
    originalSetStorageSync = wx.setStorageSync;
    originalRemoveStorageSync = wx.removeStorageSync;
  });

  afterEach(() => {
    wx.getStorageSync = originalGetStorageSync;
    wx.setStorageSync = originalSetStorageSync;
    wx.removeStorageSync = originalRemoveStorageSync;
  });

  test('wx.getStorageSync 异常时 get 应返回 null', () => {
    wx.getStorageSync = jest.fn(() => { throw new Error('storage error'); });
    const result = storage.get('any_key');
    expect(result).toBeNull();
  });

  test('wx.setStorageSync 异常时 set 应返回 false', () => {
    wx.setStorageSync = jest.fn(() => { throw new Error('storage error'); });
    const result = storage.set('any_key', {});
    expect(result).toBe(false);
  });

  test('wx.getStorageSync 异常时 getList 应返回空数组', () => {
    wx.getStorageSync = jest.fn(() => { throw new Error('storage error'); });
    const result = storage.getList('any_key');
    expect(result).toEqual([]);
  });

  test('wx.setStorageSync 异常时 addToList 应返回 false', () => {
    wx.setStorageSync = jest.fn(() => { throw new Error('storage error'); });
    const result = storage.addToList('any_key', {});
    expect(result).toBe(false);
  });

  test('wx.setStorageSync 异常时 removeFromList 应返回 false', () => {
    wx.setStorageSync = jest.fn(() => { throw new Error('storage error'); });
    const result = storage.removeFromList('any_key', 'id');
    expect(result).toBe(false);
  });

  test('wx.setStorageSync 异常时 updateInList 应返回 false', () => {
    wx.setStorageSync = jest.fn(() => { throw new Error('storage error'); });
    const result = storage.updateInList('any_key', 'id', {});
    expect(result).toBe(false);
  });
});
