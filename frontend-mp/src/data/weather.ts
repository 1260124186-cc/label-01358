import type { WeatherData, ForecastDay, CampusAlert } from '@/types/weather';

const weekdayMap = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function getDateString(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}/${day}`;
}

function getWeekday(daysFromNow: number): string {
  if (daysFromNow === 0) return '今天';
  if (daysFromNow === 1) return '明天';
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return weekdayMap[date.getDay()];
}

const weatherIcons = {
  sunny: '☀️',
  cloudy: '⛅',
  overcast: '☁️',
  rain: '🌧️',
  thunderstorm: '⛈️',
  snow: '❄️',
  fog: '🌫️',
  wind: '💨'
};

const forecastData: ForecastDay[] = [
  {
    date: getDateString(0),
    weekday: getWeekday(0),
    weatherDay: '多云',
    weatherNight: '阴',
    weatherIconDay: weatherIcons.cloudy,
    weatherIconNight: weatherIcons.overcast,
    temperatureMin: 22,
    temperatureMax: 30,
    windDirection: '东南风',
    windScale: '3级'
  },
  {
    date: getDateString(1),
    weekday: getWeekday(1),
    weatherDay: '晴',
    weatherNight: '多云',
    weatherIconDay: weatherIcons.sunny,
    weatherIconNight: weatherIcons.cloudy,
    temperatureMin: 23,
    temperatureMax: 32,
    windDirection: '南风',
    windScale: '2级'
  },
  {
    date: getDateString(2),
    weekday: getWeekday(2),
    weatherDay: '雷阵雨',
    weatherNight: '小雨',
    weatherIconDay: weatherIcons.thunderstorm,
    weatherIconNight: weatherIcons.rain,
    temperatureMin: 21,
    temperatureMax: 28,
    windDirection: '西南风',
    windScale: '4级'
  },
  {
    date: getDateString(3),
    weekday: getWeekday(3),
    weatherDay: '中雨',
    weatherNight: '大雨',
    weatherIconDay: weatherIcons.rain,
    weatherIconNight: weatherIcons.rain,
    temperatureMin: 19,
    temperatureMax: 24,
    windDirection: '西风',
    windScale: '5级'
  },
  {
    date: getDateString(4),
    weekday: getWeekday(4),
    weatherDay: '阴',
    weatherNight: '多云',
    weatherIconDay: weatherIcons.overcast,
    weatherIconNight: weatherIcons.cloudy,
    temperatureMin: 20,
    temperatureMax: 26,
    windDirection: '西北风',
    windScale: '3级'
  },
  {
    date: getDateString(5),
    weekday: getWeekday(5),
    weatherDay: '晴',
    weatherNight: '晴',
    weatherIconDay: weatherIcons.sunny,
    weatherIconNight: weatherIcons.sunny,
    temperatureMin: 22,
    temperatureMax: 31,
    windDirection: '东北风',
    windScale: '2级'
  },
  {
    date: getDateString(6),
    weekday: getWeekday(6),
    weatherDay: '多云',
    weatherNight: '晴',
    weatherIconDay: weatherIcons.cloudy,
    weatherIconNight: weatherIcons.sunny,
    temperatureMin: 24,
    temperatureMax: 33,
    windDirection: '东风',
    windScale: '2级'
  }
];

const campusAlerts: CampusAlert[] = [
  {
    id: 'alert-001',
    type: 'rainstorm',
    title: '暴雨红色预警信号',
    content: '预计未来3小时内我市将出现100毫米以上强降雨，请全体师生注意安全，减少外出。根据《学校极端天气应急预案》，今日下午停课，请同学们留在宿舍，注意关好门窗。',
    level: 'danger',
    announcementId: 'ann-001',
    publishTime: '2026-06-08 08:30',
    validUntil: '2026-06-08 20:00'
  },
  {
    id: 'alert-002',
    type: 'heat',
    title: '高温橙色预警信号',
    content: '预计本周三至周五最高气温将达到35℃以上，请广大师生做好防暑降温措施。户外活动请避开正午时段，及时补充水分，谨防中暑。食堂将延长供应清凉饮品。',
    level: 'warning',
    announcementId: 'ann-002',
    publishTime: '2026-06-08 07:00',
    validUntil: '2026-06-12 18:00'
  }
];

export const mockWeatherData: WeatherData = {
  current: {
    temperature: 28,
    temperatureMin: 22,
    temperatureMax: 30,
    weather: '多云',
    weatherIcon: weatherIcons.cloudy,
    humidity: 75,
    windDirection: '东南风',
    windScale: '3级',
    dressAdvice: '天气较热，建议穿着轻薄透气的夏季服装，如T恤、短裤或薄长裙。出门请带好雨具，午后可能有雷阵雨。',
    updateTime: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  },
  airQuality: {
    aqi: 78,
    aqiLevel: '良',
    aqiColor: '#00B42A',
    pm25: 45,
    pm10: 68,
    so2: 12,
    no2: 38,
    co: 0.8,
    o3: 95
  },
  uvIndex: {
    index: 6,
    level: '高',
    advice: '紫外线强度较高，外出需做好防晒措施。建议涂抹SPF30+防晒霜，佩戴遮阳帽和太阳镜，尽量避开10:00-16:00时段的强紫外线照射。'
  },
  forecast: forecastData,
  campusAlerts: campusAlerts
};

export async function fetchWeatherData(): Promise<WeatherData> {
  console.log('[WeatherService] 正在获取天气数据...');
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('[WeatherService] 天气数据获取成功');
      resolve(mockWeatherData);
    }, 500);
  });
}
