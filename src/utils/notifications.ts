import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// 配置通知行为
export const configureNotifications = async (): Promise<void> => {
  try {
    // 设置通知处理器 - 使用兼容 Expo Go 的方式
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true as any,
        shouldShowList: true as any,
      }),
    });

    // Android 需要配置通知渠道
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('timer-complete', {
        name: '计时完成',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF6B6B',
      });
    }
  } catch (error) {
    // Expo Go 可能不支持某些通知功能，静默处理
    console.warn('Notification configuration not fully supported in Expo Go');
  }
};

// 请求通知权限
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.warn('Permission request not supported in Expo Go');
    return false;
  }
};

// 检查通知权限状态
export const checkNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    return false;
  }
};

// 调度本地通知
export const scheduleTimerCompleteNotification = async (
  title: string,
  body: string,
  seconds: number
): Promise<void> => {
  try {
    // 先取消所有待处理的通知
    await Notifications.cancelAllScheduledNotificationsAsync();

    // 调度新通知 - 只有秒数大于0时才调度
    if (seconds > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds,
        },
      });
    }
  } catch (error) {
    // Expo Go 可能不支持调度通知，静默处理
    console.warn('Scheduled notifications not supported in Expo Go');
  }
};

// 取消所有待处理的通知
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.warn('Cancel notifications not supported in Expo Go');
  }
};

// 触发震动反馈
export const triggerHapticFeedback = async (type: 'success' | 'warning' | 'error' | 'light' = 'success'): Promise<void> => {
  try {
    switch (type) {
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
    }
  } catch (error) {
    console.error('Failed to trigger haptic feedback:', error);
  }
};

// 触发强烈震动（用于计时完成）
export const triggerStrongHaptic = async (): Promise<void> => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // 延迟再次震动以产生节奏感
    setTimeout(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 200);
    setTimeout(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }, 400);
  } catch (error) {
    console.error('Failed to trigger strong haptic:', error);
  }
};
