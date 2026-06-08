import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { AirQuality, UVIndex } from '@/types/weather';

interface EnvironmentCardProps {
  airQuality: AirQuality;
  uvIndex: UVIndex;
  className?: string;
}

const EnvironmentCard: React.FC<EnvironmentCardProps> = ({ airQuality, uvIndex, className }) => {
  return (
    <View className={classnames(styles.card, className)}>
      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionIcon}>🌬️</Text>
          <Text className={styles.sectionTitle}>空气质量</Text>
        </View>

        <View className={styles.aqiDisplay}>
          <View className={styles.aqiCircle} style={{ borderColor: airQuality.aqiColor }}>
            <Text className={styles.aqiValue} style={{ color: airQuality.aqiColor }}>
              {airQuality.aqi}
            </Text>
            <Text className={styles.aqiLabel} style={{ color: airQuality.aqiColor }}>
              {airQuality.aqiLevel}
            </Text>
          </View>

          <View className={styles.aqiDetails}>
            <View className={styles.aqiDetailItem}>
              <Text className={styles.aqiDetailLabel}>PM2.5</Text>
              <Text className={styles.aqiDetailValue}>{airQuality.pm25}</Text>
            </View>
            <View className={styles.aqiDetailItem}>
              <Text className={styles.aqiDetailLabel}>PM10</Text>
              <Text className={styles.aqiDetailValue}>{airQuality.pm10}</Text>
            </View>
            <View className={styles.aqiDetailItem}>
              <Text className={styles.aqiDetailLabel}>O₃</Text>
              <Text className={styles.aqiDetailValue}>{airQuality.o3}</Text>
            </View>
            <View className={styles.aqiDetailItem}>
              <Text className={styles.aqiDetailLabel}>NO₂</Text>
              <Text className={styles.aqiDetailValue}>{airQuality.no2}</Text>
            </View>
          </View>
        </View>
      </View>

      <View className={styles.divider} />

      <View className={styles.section}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionIcon}>☀️</Text>
          <Text className={styles.sectionTitle}>紫外线指数</Text>
        </View>

        <View className={styles.uvDisplay}>
          <View className={styles.uvBarContainer}>
            <View className={styles.uvBar}>
              <View className={styles.uvBarFillLow} />
              <View className={styles.uvBarFillMedium} />
              <View className={styles.uvBarFillHigh} style={{ opacity: uvIndex.index >= 6 ? 1 : 0.3 }} />
              <View className={styles.uvBarFillVeryHigh} style={{ opacity: uvIndex.index >= 8 ? 1 : 0.3 }} />
              <View className={styles.uvBarFillExtreme} style={{ opacity: uvIndex.index >= 10 ? 1 : 0.3 }} />
            </View>
            <View className={styles.uvIndicator} style={{ left: `${(uvIndex.index / 11) * 100}%` }} />
          </View>

          <View className={styles.uvInfo}>
            <View className={styles.uvLevel}>
              <Text className={styles.uvValue}>{uvIndex.index}</Text>
              <Text className={styles.uvLevelText}>{uvIndex.level}</Text>
            </View>
            <Text className={styles.uvAdvice}>{uvIndex.advice}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EnvironmentCard;
