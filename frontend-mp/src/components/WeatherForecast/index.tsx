import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { ForecastDay } from '@/types/weather';

interface WeatherForecastProps {
  data: ForecastDay[];
  className?: string;
}

const WeatherForecast: React.FC<WeatherForecastProps> = ({ data, className }) => {
  const minTemp = Math.min(...data.map(d => d.temperatureMin));
  const maxTemp = Math.max(...data.map(d => d.temperatureMax));
  const tempRange = maxTemp - minTemp || 1;

  return (
    <View className={classnames(styles.card, className)}>
      <View className={styles.header}>
        <Text className={styles.headerIcon}>📅</Text>
        <Text className={styles.headerTitle}>未来7天预报</Text>
      </View>

      <ScrollView
        className={styles.forecastScroll}
        scrollX
        enhanced
        showScrollbar={false}
      >
        <View className={styles.forecastList}>
          {data.map((day, index) => (
            <View key={index} className={styles.forecastItem}>
              <Text className={styles.weekday}>{day.weekday}</Text>
              <Text className={styles.date}>{day.date}</Text>

              <View className={styles.weatherIcons}>
                <View className={styles.weatherIconWrap}>
                  <Text className={styles.weatherIcon}>{day.weatherIconDay}</Text>
                  <Text className={styles.weatherLabel}>{day.weatherDay}</Text>
                </View>
                <Text className={styles.arrow}>↓</Text>
                <View className={styles.weatherIconWrap}>
                  <Text className={styles.weatherIcon}>{day.weatherIconNight}</Text>
                  <Text className={styles.weatherLabel}>{day.weatherNight}</Text>
                </View>
              </View>

              <View className={styles.tempBarContainer}>
                <Text className={styles.tempMax}>{day.temperatureMax}°</Text>
                <View className={styles.tempBar}>
                  <View
                    className={styles.tempBarFill}
                    style={{
                      left: `${((day.temperatureMin - minTemp) / tempRange) * 100}%`,
                      width: `${((day.temperatureMax - day.temperatureMin) / tempRange) * 100}%`
                    }}
                  />
                </View>
                <Text className={styles.tempMin}>{day.temperatureMin}°</Text>
              </View>

              <View className={styles.windInfo}>
                <Text className={styles.windIcon}>🌬️</Text>
                <Text className={styles.windText}>{day.windDirection} {day.windScale}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default WeatherForecast;
