import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { WeatherCurrent } from '@/types/weather';

interface WeatherCardProps {
  data: WeatherCurrent;
  className?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, className }) => {
  const handleRefresh = () => {
    Taro.showToast({ title: '刷新成功', icon: 'success' });
  };

  return (
    <View className={classnames(styles.card, className)} onClick={handleRefresh}>
      <View className={styles.header}>
        <View className={styles.location}>
          <Text className={styles.locationIcon}>📍</Text>
          <Text className={styles.locationText}>校园</Text>
        </View>
        <Text className={styles.updateTime}>更新于 {data.updateTime}</Text>
      </View>

      <View className={styles.main}>
        <View className={styles.leftSection}>
          <Text className={styles.weatherIcon}>{data.weatherIcon}</Text>
          <View className={styles.temperatureWrap}>
            <Text className={styles.temperature}>{data.temperature}</Text>
            <Text className={styles.temperatureUnit}>°C</Text>
          </View>
        </View>

        <View className={styles.rightSection}>
          <Text className={styles.weatherText}>{data.weather}</Text>
          <Text className={styles.temperatureRange}>
            {data.temperatureMin}° / {data.temperatureMax}°
          </Text>
          <View className={styles.weatherInfo}>
            <View className={styles.infoItem}>
              <Text className={styles.infoIcon}>💧</Text>
              <Text className={styles.infoText}>{data.humidity}%</Text>
            </View>
            <View className={styles.infoItem}>
              <Text className={styles.infoIcon}>🌬️</Text>
              <Text className={styles.infoText}>{data.windDirection} {data.windScale}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.dressAdvice}>
        <View className={styles.dressHeader}>
          <Text className={styles.dressIcon}>👕</Text>
          <Text className={styles.dressTitle}>穿衣建议</Text>
        </View>
        <Text className={styles.dressText}>{data.dressAdvice}</Text>
      </View>
    </View>
  );
};

export default WeatherCard;
