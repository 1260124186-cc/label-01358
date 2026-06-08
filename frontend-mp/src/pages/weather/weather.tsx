import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { usePullDownRefresh } from '@tarojs/taro';
import styles from './weather.module.scss';
import WeatherCard from '@/components/WeatherCard';
import EnvironmentCard from '@/components/EnvironmentCard';
import WeatherForecast from '@/components/WeatherForecast';
import CampusAlert from '@/components/CampusAlert';
import WeatherService from '@/services/weather';
import type { WeatherData } from '@/types/weather';

const WeatherPage: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadWeatherData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      console.log('[WeatherPage] 开始加载天气数据...');
      const data = await WeatherService.getWeatherData(forceRefresh);
      setWeatherData(data);
      console.log('[WeatherPage] 天气数据加载完成');
    } catch (error) {
      console.error('[WeatherPage] 加载天气数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

  usePullDownRefresh(() => {
    loadWeatherData(true);
  });

  if (!weatherData) {
    return (
      <View className={styles.container}>
        <View className={styles.loading}>
          <Text className={styles.loadingText}>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.container}>
      <ScrollView
        className={styles.scrollView}
        scrollY
        enhanced
        showScrollbar={false}
      >
        <View className={styles.content}>
          <View className={styles.pageHeader}>
            <Text className={styles.pageTitle}>校园天气</Text>
            <Text className={styles.pageSubtitle}>实时天气 · 环境指数 · 校园提醒</Text>
          </View>

          <WeatherCard
            data={weatherData.current}
            className={styles.sectionSpacing}
          />

          <EnvironmentCard
            airQuality={weatherData.airQuality}
            uvIndex={weatherData.uvIndex}
            className={styles.sectionSpacing}
          />

          <WeatherForecast
            data={weatherData.forecast}
            className={styles.sectionSpacing}
          />

          <CampusAlert
            data={weatherData.campusAlerts}
            className={styles.sectionSpacing}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default WeatherPage;
