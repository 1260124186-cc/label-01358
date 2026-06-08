import { fetchWeatherData, mockWeatherData } from '@/data/weather';
import type { WeatherData } from '@/types/weather';

export class WeatherService {
  private static cache: WeatherData | null = null;
  private static lastFetchTime: number = 0;
  private static readonly CACHE_DURATION = 5 * 60 * 1000;

  static async getWeatherData(forceRefresh: boolean = false): Promise<WeatherData> {
    const now = Date.now();

    if (!forceRefresh && this.cache && now - this.lastFetchTime < this.CACHE_DURATION) {
      console.log('[WeatherService] 使用缓存数据');
      return this.cache;
    }

    try {
      const data = await fetchWeatherData();
      this.cache = data;
      this.lastFetchTime = now;
      return data;
    } catch (error) {
      console.error('[WeatherService] 获取天气数据失败，使用本地mock数据:', error);
      return mockWeatherData;
    }
  }

  static clearCache(): void {
    this.cache = null;
    this.lastFetchTime = 0;
    console.log('[WeatherService] 缓存已清除');
  }
}

export default WeatherService;
