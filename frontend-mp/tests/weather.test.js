const mockData = require('../config/mock-data');

const createMockUtil = () => ({
  navigateTo: jest.fn(),
  switchTab: jest.fn(),
  showToast: jest.fn(),
  relativeTime: jest.fn((time) => '1小时前'),
  checkLogin: jest.fn(() => true),
  generateId: jest.fn(() => 'test-id-' + Math.random().toString(36).substring(2, 11))
});

let mockUtil;

describe('WEATHER_DATA 数据结构', () => {
  test('应包含完整的天气数据结构', () => {
    expect(mockData.WEATHER_DATA).toBeDefined();
    expect(mockData.WEATHER_DATA.current).toBeDefined();
    expect(mockData.WEATHER_DATA.airQuality).toBeDefined();
    expect(mockData.WEATHER_DATA.uvIndex).toBeDefined();
    expect(mockData.WEATHER_DATA.forecast).toBeDefined();
    expect(mockData.WEATHER_DATA.campusAlerts).toBeDefined();
  });

  describe('current 今日天气数据', () => {
    const current = mockData.WEATHER_DATA.current;

    test('应包含温度相关字段', () => {
      expect(typeof current.temperature).toBe('number');
      expect(typeof current.temperatureMin).toBe('number');
      expect(typeof current.temperatureMax).toBe('number');
      expect(current.temperatureMin).toBeLessThanOrEqual(current.temperature);
      expect(current.temperatureMax).toBeGreaterThanOrEqual(current.temperature);
    });

    test('应包含天气状况字段', () => {
      expect(typeof current.weather).toBe('string');
      expect(current.weather.length).toBeGreaterThan(0);
      expect(typeof current.weatherIcon).toBe('string');
    });

    test('应包含湿度和风力字段', () => {
      expect(typeof current.humidity).toBe('number');
      expect(current.humidity).toBeGreaterThanOrEqual(0);
      expect(current.humidity).toBeLessThanOrEqual(100);
      expect(typeof current.windDirection).toBe('string');
      expect(typeof current.windScale).toBe('string');
    });

    test('应包含穿衣建议字段', () => {
      expect(typeof current.dressAdvice).toBe('string');
      expect(current.dressAdvice.length).toBeGreaterThan(0);
    });

    test('应包含更新时间字段', () => {
      expect(typeof current.updateTime).toBe('string');
    });
  });

  describe('airQuality 空气质量数据', () => {
    const airQuality = mockData.WEATHER_DATA.airQuality;

    test('应包含 AQI 指数和等级', () => {
      expect(typeof airQuality.aqi).toBe('number');
      expect(airQuality.aqi).toBeGreaterThanOrEqual(0);
      expect(typeof airQuality.aqiLevel).toBe('string');
      expect(['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染']).toContain(airQuality.aqiLevel);
    });

    test('应包含颜色字段', () => {
      expect(typeof airQuality.aqiColor).toBe('string');
      expect(airQuality.aqiColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    test('应包含各项污染物指标', () => {
      expect(typeof airQuality.pm25).toBe('number');
      expect(typeof airQuality.pm10).toBe('number');
      expect(typeof airQuality.so2).toBe('number');
      expect(typeof airQuality.no2).toBe('number');
      expect(typeof airQuality.co).toBe('number');
      expect(typeof airQuality.o3).toBe('number');
    });
  });

  describe('uvIndex 紫外线指数数据', () => {
    const uvIndex = mockData.WEATHER_DATA.uvIndex;

    test('应包含指数和等级', () => {
      expect(typeof uvIndex.index).toBe('number');
      expect(uvIndex.index).toBeGreaterThanOrEqual(0);
      expect(uvIndex.index).toBeLessThanOrEqual(11);
      expect(typeof uvIndex.level).toBe('string');
      expect(['低', '中等', '高', '很高', '极高']).toContain(uvIndex.level);
    });

    test('应包含防晒建议', () => {
      expect(typeof uvIndex.advice).toBe('string');
      expect(uvIndex.advice.length).toBeGreaterThan(0);
    });
  });

  describe('forecast 7天预报数据', () => {
    const forecast = mockData.WEATHER_DATA.forecast;

    test('应包含7天数据', () => {
      expect(Array.isArray(forecast)).toBe(true);
      expect(forecast.length).toBe(7);
    });

    test('每一天的数据结构应完整', () => {
      forecast.forEach((day, index) => {
        expect(typeof day.date).toBe('string');
        expect(typeof day.weekday).toBe('string');
        expect(typeof day.weatherDay).toBe('string');
        expect(typeof day.weatherNight).toBe('string');
        expect(typeof day.weatherIconDay).toBe('string');
        expect(typeof day.weatherIconNight).toBe('string');
        expect(typeof day.temperatureMin).toBe('number');
        expect(typeof day.temperatureMax).toBe('number');
        expect(day.temperatureMin).toBeLessThanOrEqual(day.temperatureMax);
        expect(typeof day.windDirection).toBe('string');
        expect(typeof day.windScale).toBe('string');
      });
    });

    test('第一天应标记为"今天"', () => {
      expect(forecast[0].weekday).toBe('今天');
    });

    test('第二天应标记为"明天"', () => {
      expect(forecast[1].weekday).toBe('明天');
    });
  });

  describe('campusAlerts 校园预警数据', () => {
    const alerts = mockData.WEATHER_DATA.campusAlerts;

    test('应为数组格式', () => {
      expect(Array.isArray(alerts)).toBe(true);
    });

    test('每条预警数据结构应完整', () => {
      alerts.forEach((alert) => {
        expect(typeof alert.id).toBe('string');
        expect(typeof alert.type).toBe('string');
        expect(['rainstorm', 'heat', 'other']).toContain(alert.type);
        expect(typeof alert.title).toBe('string');
        expect(alert.title.length).toBeGreaterThan(0);
        expect(typeof alert.content).toBe('string');
        expect(alert.content.length).toBeGreaterThan(0);
        expect(typeof alert.level).toBe('string');
        expect(['warning', 'danger', 'info']).toContain(alert.level);
        expect(typeof alert.publishTime).toBe('string');
        expect(typeof alert.validUntil).toBe('string');
      });
    });

    test('应包含暴雨预警和高温预警', () => {
      const hasRainstorm = alerts.some(a => a.type === 'rainstorm');
      const hasHeat = alerts.some(a => a.type === 'heat');
      expect(hasRainstorm).toBe(true);
      expect(hasHeat).toBe(true);
    });
  });
});

describe('首页天气入口功能', () => {
  beforeEach(() => {
    jest.resetModules();
    mockUtil = createMockUtil();
    jest.doMock('../utils/util', () => mockUtil);
    jest.doMock('../config/mock-data', () => mockData);
    global.Page.mockClear();
  });

  test('首页应包含天气导航项', () => {
    require('../pages/index/index');
    const pageConfig = global.Page.mock.calls[0][0];
    const navItems = pageConfig.data.navItems;
    const weatherNav = navItems.find(item => item.id === 'weather');
    expect(weatherNav).toBeDefined();
    expect(weatherNav.name).toBe('今日天气');
    expect(weatherNav.url).toBe('/pages/weather/index');
  });

  test('onWeatherTap 应跳转到天气页面', () => {
    require('../pages/index/index');
    const pageConfig = global.Page.mock.calls[0][0];

    const util = require('../utils/util');
    expect(util.navigateTo).toBe(mockUtil.navigateTo);

    pageConfig.onWeatherTap();
    expect(mockUtil.navigateTo).toHaveBeenCalledWith('/pages/weather/index');
  });

  test('点击天气导航项应跳转到天气页面', () => {
    require('../pages/index/index');
    const pageConfig = global.Page.mock.calls[0][0];
    const weatherNav = pageConfig.data.navItems.find(item => item.id === 'weather');
    pageConfig.onNavTap({ currentTarget: { dataset: { item: weatherNav } } });
    expect(mockUtil.navigateTo).toHaveBeenCalledWith('/pages/weather/index');
  });

  test('loadData 应加载天气数据', async () => {
    require('../pages/index/index');
    const pageConfig = global.Page.mock.calls[0][0];
    const instance = {
      data: { ...pageConfig.data },
      setData: jest.fn((updates) => {
        instance.data = { ...instance.data, ...updates };
      })
    };

    await pageConfig.loadData.call(instance);
    expect(instance.data.weatherData).toBeDefined();
    expect(instance.data.weatherData.current).toBeDefined();
    expect(instance.data.weatherData.current.dressAdvice).toBeDefined();
  });

  test('天气数据应包含穿衣建议', async () => {
    require('../pages/index/index');
    const pageConfig = global.Page.mock.calls[0][0];
    const instance = {
      data: { ...pageConfig.data },
      setData: jest.fn((updates) => {
        instance.data = { ...instance.data, ...updates };
      })
    };

    await pageConfig.loadData.call(instance);
    expect(instance.data.weatherData.current.dressAdvice.length).toBeGreaterThan(0);
    expect(typeof instance.data.weatherData.current.dressAdvice).toBe('string');
  });
});

describe('天气详情页面功能', () => {
  beforeEach(() => {
    jest.resetModules();
    mockUtil = createMockUtil();
    jest.doMock('../utils/util', () => mockUtil);
    jest.doMock('../config/mock-data', () => mockData);
    global.Page.mockClear();
    wx.showModal.mockClear();
    wx.stopPullDownRefresh.mockClear();
  });

  test('天气页面应正确初始化', () => {
    require('../pages/weather/index');
    const pageConfig = global.Page.mock.calls[0][0];
    expect(pageConfig.data.loading).toBe(true);
    expect(pageConfig.data.weatherData).toBeNull();
  });

  test('loadData 应加载完整天气数据', async () => {
    jest.useFakeTimers();
    require('../pages/weather/index');
    const pageConfig = global.Page.mock.calls[0][0];
    const instance = {
      data: { ...pageConfig.data },
      setData: jest.fn((updates) => {
        instance.data = { ...instance.data, ...updates };
      })
    };

    const promise = pageConfig.loadData.call(instance);
    jest.runAllTimers();
    await promise;

    expect(instance.data.loading).toBe(false);
    expect(instance.data.weatherData).toBeDefined();
    expect(instance.data.forecastMinTemp).toBeDefined();
    expect(instance.data.forecastMaxTemp).toBeDefined();
    expect(instance.data.forecastTempRange).toBeGreaterThan(0);
    jest.useRealTimers();
  });

  test('onPullDownRefresh 应刷新数据', async () => {
    jest.useFakeTimers();
    require('../pages/weather/index');
    const pageConfig = global.Page.mock.calls[0][0];
    const instance = {
      data: { ...pageConfig.data },
      setData: jest.fn((updates) => {
        instance.data = { ...instance.data, ...updates };
      }),
      loadData: pageConfig.loadData
    };

    const promise = pageConfig.onPullDownRefresh.call(instance);
    jest.runAllTimers();
    await promise;

    expect(wx.stopPullDownRefresh).toHaveBeenCalled();
    expect(instance.data.weatherData).toBeDefined();
    jest.useRealTimers();
  });

  test('onWeatherCardTap 应刷新数据并显示提示', async () => {
    jest.useFakeTimers();
    require('../pages/weather/index');
    const pageConfig = global.Page.mock.calls[0][0];
    const instance = {
      data: { ...pageConfig.data },
      setData: jest.fn((updates) => {
        instance.data = { ...instance.data, ...updates };
      }),
      loadData: pageConfig.loadData
    };

    pageConfig.onWeatherCardTap.call(instance);
    jest.runAllTimers();
    await Promise.resolve();

    expect(mockUtil.showToast).toHaveBeenCalledWith('刷新成功');
    jest.useRealTimers();
  });

  describe('预警点击处理', () => {
    let pageConfig;
    let instance;

    beforeEach(() => {
      require('../pages/weather/index');
      pageConfig = global.Page.mock.calls[0][0];
      instance = {
        data: { ...pageConfig.data },
        setData: jest.fn((updates) => {
          instance.data = { ...instance.data, ...updates };
        })
      };
    });

    test('点击有关联公告的预警应跳转到公告详情', () => {
      const alertWithAnnouncement = {
        id: 'test-1',
        type: 'rainstorm',
        title: '测试预警',
        content: '测试内容',
        level: 'danger',
        announcementId: '1',
        publishTime: '2026-06-08 08:00',
        validUntil: '2026-06-08 20:00'
      };

      pageConfig.onAlertTap.call(instance, {
        currentTarget: { dataset: { alert: alertWithAnnouncement } }
      });

      expect(mockUtil.navigateTo).toHaveBeenCalledWith('/pages/announcement-detail/index?id=1');
    });

    test('点击无关联公告的预警应显示弹窗', () => {
      const alertWithoutAnnouncement = {
        id: 'test-2',
        type: 'heat',
        title: '测试预警2',
        content: '测试内容2',
        level: 'warning',
        publishTime: '2026-06-08 08:00',
        validUntil: '2026-06-08 20:00'
      };

      pageConfig.onAlertTap.call(instance, {
        currentTarget: { dataset: { alert: alertWithoutAnnouncement } }
      });

      expect(wx.showModal).toHaveBeenCalledWith({
        title: '测试预警2',
        content: '测试内容2',
        showCancel: false,
        confirmText: '知道了'
      });
    });
  });

  describe('温度范围计算', () => {
    let pageConfig;
    let instance;

    beforeEach(async () => {
      jest.useFakeTimers();
      require('../pages/weather/index');
      pageConfig = global.Page.mock.calls[0][0];
      instance = {
        data: { ...pageConfig.data },
        setData: jest.fn((updates) => {
          instance.data = { ...instance.data, ...updates };
        })
      };
      const promise = pageConfig.loadData.call(instance);
      jest.runAllTimers();
      await promise;
      jest.useRealTimers();
    });

    test('forecastMinTemp 应为7天中的最低温度', () => {
      const minTemps = instance.data.weatherData.forecast.map(d => d.temperatureMin);
      const expectedMin = Math.min(...minTemps);
      expect(instance.data.forecastMinTemp).toBe(expectedMin);
    });

    test('forecastMaxTemp 应为7天中的最高温度', () => {
      const maxTemps = instance.data.weatherData.forecast.map(d => d.temperatureMax);
      const expectedMax = Math.max(...maxTemps);
      expect(instance.data.forecastMaxTemp).toBe(expectedMax);
    });

    test('forecastTempRange 应为最高温减最低温', () => {
      const expectedRange = instance.data.forecastMaxTemp - instance.data.forecastMinTemp;
      expect(instance.data.forecastTempRange).toBe(expectedRange || 1);
    });
  });
});

describe('天气数据完整性验证', () => {
  test('所有温度值应在合理范围内', () => {
    const { current, forecast } = mockData.WEATHER_DATA;
    const allTemps = [
      current.temperature,
      current.temperatureMin,
      current.temperatureMax,
      ...forecast.flatMap(d => [d.temperatureMin, d.temperatureMax])
    ];

    allTemps.forEach(temp => {
      expect(temp).toBeGreaterThanOrEqual(-20);
      expect(temp).toBeLessThanOrEqual(45);
    });
  });

  test('AQI 等级与颜色应匹配', () => {
    const { aqi, aqiLevel, aqiColor } = mockData.WEATHER_DATA.airQuality;

    if (aqi <= 50) {
      expect(aqiLevel).toBe('优');
      expect(aqiColor).toBe('#00E400');
    } else if (aqi <= 100) {
      expect(aqiLevel).toBe('良');
      expect(aqiColor).toBe('#00B42A');
    } else if (aqi <= 150) {
      expect(aqiLevel).toBe('轻度污染');
      expect(aqiColor).toBe('#FF7D00');
    } else if (aqi <= 200) {
      expect(aqiLevel).toBe('中度污染');
      expect(aqiColor).toBe('#F53F3F');
    } else if (aqi <= 300) {
      expect(aqiLevel).toBe('重度污染');
      expect(aqiColor).toBe('#981AE1');
    } else {
      expect(aqiLevel).toBe('严重污染');
      expect(aqiColor).toBe('#7E0023');
    }
  });

  test('紫外线指数与等级应匹配', () => {
    const { index, level } = mockData.WEATHER_DATA.uvIndex;

    if (index <= 2) {
      expect(level).toBe('低');
    } else if (index <= 5) {
      expect(level).toBe('中等');
    } else if (index <= 7) {
      expect(level).toBe('高');
    } else if (index <= 10) {
      expect(level).toBe('很高');
    } else {
      expect(level).toBe('极高');
    }
  });

  test('预警等级与样式应匹配', () => {
    const { campusAlerts } = mockData.WEATHER_DATA;

    campusAlerts.forEach(alert => {
      if (alert.type === 'rainstorm') {
        expect(alert.level).toBe('danger');
      } else if (alert.type === 'heat') {
        expect(alert.level).toBe('warning');
      }
    });
  });
});
