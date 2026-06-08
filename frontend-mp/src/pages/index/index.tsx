import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import WeatherService from '@/services/weather';
import type { WeatherCurrent } from '@/types/weather';

const Index: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherCurrent | null>(null);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    try {
      const data = await WeatherService.getWeatherData();
      setWeatherData(data.current);
    } catch (error) {
      console.error('[Index] 加载天气数据失败:', error);
    }
  };

  const handleGoWeather = () => {
    console.log('[Index] 跳转到天气详情页');
    Taro.navigateTo({
      url: '/pages/weather/weather'
    });
  };

  return (
    <View className={styles.container}>
      <View className={styles.card}>
        <Text className={styles.logo}>🎉</Text>
        <Text className={styles.welcome}>欢迎使用 PAI 小程序</Text>
        <Text className={styles.desc}>基于 PAI 跨端技术构建的现代化小程序模板</Text>
      </View>

      <View className={styles.weatherEntry} onClick={handleGoWeather}>
        <View className={styles.weatherEntryLeft}>
          <Text className={styles.weatherEntryIcon}>🌤️</Text>
          <View className={styles.weatherEntryInfo}>
            <Text className={styles.weatherEntryTitle}>今日天气</Text>
            <Text className={styles.weatherEntrySubtitle}>
              {weatherData ? `${weatherData.weather} ${weatherData.temperature}°C` : '加载中...'}
            </Text>
          </View>
        </View>
        <View className={styles.weatherEntryRight}>
          {weatherData && (
            <>
              <Text className={styles.weatherEntryTemp}>{weatherData.temperature}°</Text>
              <Text className={styles.weatherEntryTempRange}>
                {weatherData.temperatureMin}° / {weatherData.temperatureMax}°
              </Text>
            </>
          )}
          <Text className={styles.weatherEntryArrow}>→</Text>
        </View>
      </View>
    </View>
  );
};

export default Index;
