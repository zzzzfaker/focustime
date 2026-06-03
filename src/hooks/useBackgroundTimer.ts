import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useTimerStore } from '../store/useTimerStore';
import { saveTimerState, clearTimerState } from '../utils/storage';

/**
 * 后台计时器 Hook
 * 处理应用进入后台时的计时逻辑
 */
export const useBackgroundTimer = () => {
  const { isRunning, startTime, remainingSeconds, initialSeconds, mode } =
    useTimerStore();
  const appStateRef = useRef(AppState.currentState);
  const backgroundTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (
      nextAppState: AppStateStatus
    ) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // 从后台回到前台
        handleResume();
      } else if (
        nextAppState.match(/inactive|background/) &&
        appStateRef.current === 'active'
      ) {
        // 进入后台
        handleBackground();
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isRunning, startTime, remainingSeconds, initialSeconds, mode]);

  const handleBackground = () => {
    if (isRunning && startTime) {
      const now = Date.now();
      backgroundTimeRef.current = now;

      // 计算已经过去的时间
      const elapsed = Math.floor((now - startTime) / 1000);
      const newRemaining = Math.max(0, initialSeconds - elapsed);

      // 保存状态到本地存储
      saveTimerState({
        mode,
        remainingSeconds: newRemaining,
        startTime: null,
        pausedAt: now,
      });
    }
  };

  const handleResume = () => {
    if (backgroundTimeRef.current) {
      const now = Date.now();
      const backgroundElapsed = Math.floor(
        (now - backgroundTimeRef.current) / 1000
      );

      // 这里可以通知 timer store 更新状态
      // 实际逻辑在 useTimerStore 的 handleAppStateChange 中处理

      backgroundTimeRef.current = null;
    }

    // 清除保存的状态
    clearTimerState();
  };
};

/**
 * 格式化时间显示 Hook
 * 将秒数转换为 MM:SS 格式
 */
export const useTimeFormat = () => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return { formatTime };
};
