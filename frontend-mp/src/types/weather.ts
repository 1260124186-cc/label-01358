export interface WeatherCurrent {
  temperature: number;
  temperatureMin: number;
  temperatureMax: number;
  weather: string;
  weatherIcon: string;
  humidity: number;
  windDirection: string;
  windScale: string;
  dressAdvice: string;
  updateTime: string;
}

export interface AirQuality {
  aqi: number;
  aqiLevel: string;
  aqiColor: string;
  pm25: number;
  pm10: number;
  so2: number;
  no2: number;
  co: number;
  o3: number;
}

export interface UVIndex {
  index: number;
  level: string;
  advice: string;
}

export interface ForecastDay {
  date: string;
  weekday: string;
  weatherDay: string;
  weatherNight: string;
  weatherIconDay: string;
  weatherIconNight: string;
  temperatureMin: number;
  temperatureMax: number;
  windDirection: string;
  windScale: string;
}

export interface CampusAlert {
  id: string;
  type: 'rainstorm' | 'heat' | 'other';
  title: string;
  content: string;
  level: 'warning' | 'danger' | 'info';
  announcementId?: string;
  publishTime: string;
  validUntil: string;
}

export interface WeatherData {
  current: WeatherCurrent;
  airQuality: AirQuality;
  uvIndex: UVIndex;
  forecast: ForecastDay[];
  campusAlerts: CampusAlert[];
}
