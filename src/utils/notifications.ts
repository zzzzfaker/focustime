import * as Haptics from 'expo-haptics';

// 注意：本地通知功能在 Expo Go 中不可用
// 如需通知功能，请使用 Development Build 或独立构建

// 空函数 - 保持 API 兼容性
export const configureNotifications = async (): Promise<void> => {
  // 不执行任何操作
};

export const requestNotificationPermissions = async (): Promise<boolean> => {
  // 不执行任何操作，返回 false
  return false;
};

export const checkNotificationPermissions = async (): Promise<boolean> => {
  return false;
};

export const scheduleTimerCompleteNotification = async (
  _title: string,
  _body: string,
  _seconds: number
): Promise<void> => {
  // 不执行任何操作（Expo Go 不支持通知）
};

export const cancelAllNotifications = async (): Promise<void> => {
  // 不执行任何操作
};

// ============ 震动功能（在 Expo Go 中正常工作）============

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
    // 静默处理
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
    // 静默处理
  }
};
