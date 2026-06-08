import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { CampusAlert as CampusAlertType } from '@/types/weather';

interface CampusAlertProps {
  data: CampusAlertType[];
  className?: string;
}

const CampusAlert: React.FC<CampusAlertProps> = ({ data, className }) => {
  const getAlertIcon = (type: string): string => {
    switch (type) {
      case 'rainstorm':
        return '⛈️';
      case 'heat':
        return '🌡️';
      default:
        return '📢';
    }
  };

  const getAlertBgClass = (level: string): string => {
    switch (level) {
      case 'danger':
        return styles.alertDanger;
      case 'warning':
        return styles.alertWarning;
      default:
        return styles.alertInfo;
    }
  };

  const handleViewDetail = (alert: CampusAlertType) => {
    console.log('[CampusAlert] 查看预警详情:', alert.id);
    if (alert.announcementId) {
      Taro.showToast({
        title: '查看关联公告',
        icon: 'none'
      });
    } else {
      Taro.showModal({
        title: alert.title,
        content: alert.content,
        showCancel: false,
        confirmText: '知道了'
      });
    }
  };

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View className={classnames(styles.card, className)}>
      <View className={styles.header}>
        <Text className={styles.headerIcon}>🚨</Text>
        <Text className={styles.headerTitle}>校园特殊提醒</Text>
        <View className={styles.badge}>
          <Text className={styles.badgeText}>{data.length}</Text>
        </View>
      </View>

      <View className={styles.alertList}>
        {data.map((alert) => (
          <View
            key={alert.id}
            className={classnames(styles.alertItem, getAlertBgClass(alert.level))}
            onClick={() => handleViewDetail(alert)}
          >
            <View className={styles.alertHeader}>
              <Text className={styles.alertIcon}>{getAlertIcon(alert.type)}</Text>
              <View className={styles.alertTitleWrap}>
                <Text className={styles.alertTitle}>{alert.title}</Text>
                <Text className={styles.alertTime}>{alert.publishTime}</Text>
              </View>
              <View className={styles.alertTag}>
                <Text className={styles.alertTagText}>
                  {alert.level === 'danger' ? '紧急' : alert.level === 'warning' ? '重要' : '通知'}
                </Text>
              </View>
            </View>

            <Text className={styles.alertContent}>
              {alert.content}
            </Text>

            {alert.announcementId && (
              <View className={styles.alertFooter}>
                <Text className={styles.linkText}>查看关联公告 →</Text>
              </View>
            )}

            <View className={styles.validUntil}>
              <Text className={styles.validText}>有效期至 {alert.validUntil}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default CampusAlert;
