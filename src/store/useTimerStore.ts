import { create } from 'zustand';
import { TimerMode, TimerState as BaseTimerState } from '../types';
import { saveTimerState, clearTimerState } from '../utils/storage';
import { scheduleTimerCompleteNotification, cancelAllNotifications, triggerStrongHaptic } from '../utils/notifications';
import { useSettingStore } from './useSettingStore';

interface TimerState extends BaseTimerState {
  // 初始时长（秒）
  initialSeconds: number;
  // 当前选中的任务ID
  currentTaskId: string | null;

  // Actions
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  setMode: (mode: TimerMode) => void;
  setRemainingSeconds: (seconds: number) => void;
  handleAppStateChange: (nextAppState: string) => void;
  setCurrentTaskId: (taskId: string | null) => void;
  completePomodoro: () => void;
  updateDurations: () => void;
}

// 获取当前模式的时长（从设置中读取）
function getDurationForMode(mode: TimerMode): number {
  const settings = useSettingStore.getState();
  switch (mode) {
    case 'focus':
      return settings.focusDuration * 60;
    case 'shortBreak':
      return settings.shortBreakDuration * 60;
    case 'longBreak':
      return settings.longBreakDuration * 60;
  }
}

export const useTimerStore = create<TimerState>((set, get) => ({
  // 初始状态
  mode: 'focus',
  remainingSeconds: getDurationForMode('focus'),
  initialSeconds: getDurationForMode('focus'),
  isRunning: false,
  startTime: null,
  pausedAt: null,
  pomodoroCount: 0,
  currentTaskId: null,

  // 开始计时
  start: () => {
    const { mode, remainingSeconds } = get();
    const now = Date.now();

    set({
      isRunning: true,
      startTime: now,
      pausedAt: null,
    });

    // 保存状态到本地存储（用于后台恢复）
    saveTimerState({
      mode,
      remainingSeconds,
      startTime: now,
      pausedAt: null,
    });

    // 调度通知
    scheduleTimerCompleteNotification(
      getNotificationTitle(mode),
      getNotificationBody(mode),
      remainingSeconds
    );
  },

  // 暂停计时
  pause: () => {
    const { remainingSeconds } = get();
    const now = Date.now();

    set({
      isRunning: false,
      startTime: null,
      pausedAt: now,
      // remainingSeconds 已经被 tick 更新，直接使用当前值
    });

    // 取消通知
    cancelAllNotifications();

    // 保存暂停状态
    saveTimerState({
      mode: get().mode,
      remainingSeconds,
      startTime: null,
      pausedAt: now,
    });
  },

  // 重置计时器
  reset: () => {
    const { mode, initialSeconds } = get();
    set({
      remainingSeconds: initialSeconds,
      isRunning: false,
      startTime: null,
      pausedAt: null,
    });

    cancelAllNotifications();
    clearTimerState();
  },

  // 每秒更新（timer tick）
  tick: () => {
    const { isRunning, remainingSeconds } = get();

    if (!isRunning) return;

    // 每秒递减剩余时间
    const newRemaining = Math.max(0, remainingSeconds - 1);

    set({ remainingSeconds: newRemaining });

    // 计时结束
    if (newRemaining <= 0) {
      get().completePomodoro();
    }
  },

  // 设置模式
  setMode: (mode: TimerMode) => {
    const duration = getDurationForMode(mode);
    const isRunning = get().isRunning;

    // 如果正在运行，先停止
    if (isRunning) {
      get().pause();
    }

    set({
      mode,
      remainingSeconds: duration,
      initialSeconds: duration,
      startTime: null,
      pausedAt: null,
      isRunning: false,
    });

    cancelAllNotifications();
  },

  // 更新时长（当设置改变时调用）
  updateDurations: () => {
    const { mode, isRunning } = get();

    // 只有在计时器没有运行时才更新时长
    // 如果正在运行，不中断用户的工作
    if (!isRunning) {
      const newDuration = getDurationForMode(mode);
      set({
        remainingSeconds: newDuration,
        initialSeconds: newDuration,
      });
    }
  },

  // 直接设置剩余秒数
  setRemainingSeconds: (seconds: number) => {
    set({ remainingSeconds: seconds });
  },

  // 处理应用状态变化（后台/前台切换）
  handleAppStateChange: (nextAppState: string) => {
    const { isRunning, startTime, pausedAt, mode, remainingSeconds } = get();
    const now = Date.now();

    if (nextAppState === 'background' || nextAppState === 'inactive') {
      // 进入后台
      if (isRunning && startTime) {
        // 计算从开始到现在经过了多少时间
        const elapsed = Math.floor((now - startTime) / 1000);
        // 从当前剩余时间中减去经过的时间
        const newRemaining = Math.max(0, remainingSeconds - elapsed);
        set({
          remainingSeconds: newRemaining,
          pausedAt: now,
          isRunning: false,
        });

        // 更新通知
        cancelAllNotifications();
        if (newRemaining > 0) {
          scheduleTimerCompleteNotification(
            getNotificationTitle(mode),
            getNotificationBody(mode),
            newRemaining
          );
        }
      }
    } else if (nextAppState === 'active') {
      // 回到前台
      if (pausedAt) {
        // 从后台恢复时，根据经过的时间更新剩余时间
        const backgroundElapsed = Math.floor((now - pausedAt) / 1000);
        const newRemaining = Math.max(0, remainingSeconds - backgroundElapsed);

        if (newRemaining > 0) {
          // 还有剩余时间，继续计时
          set({
            remainingSeconds: newRemaining,
            startTime: now,
            pausedAt: null,
            isRunning: true,
          });
        } else {
          // 时间已经到，完成番茄
          set({
            remainingSeconds: 0,
            pausedAt: null,
            isRunning: false,
          });
          get().completePomodoro();
        }
      }

      // 清除保存的状态
      clearTimerState();
    }
  },

  // 设置当前任务ID
  setCurrentTaskId: (taskId: string | null) => {
    set({ currentTaskId: taskId });
  },

  // 完成一个番茄时段
  completePomodoro: () => {
    const { mode, pomodoroCount } = get();

    // 震动反馈
    triggerStrongHaptic();

    // 取消通知
    cancelAllNotifications();

    if (mode === 'focus') {
      // 专注完成，更新番茄计数
      const newCount = pomodoroCount + 1;
      set({ pomodoroCount: newCount });

      // 切换到休息模式
      // 每4个番茄后长休息，否则短休息
      const nextMode = newCount % 4 === 0 ? 'longBreak' : 'shortBreak';
      get().setMode(nextMode);
    } else {
      // 休息完成，切换回专注模式
      get().setMode('focus');
    }
  },
}));

// 辅助函数：获取通知标题
function getNotificationTitle(mode: TimerMode): string {
  switch (mode) {
    case 'focus':
      return '专注完成！';
    case 'shortBreak':
      return '短休息结束';
    case 'longBreak':
      return '长休息结束';
  }
}

// 辅助函数：获取通知内容
function getNotificationBody(mode: TimerMode): string {
  switch (mode) {
    case 'focus':
      return '你已经完成了一个番茄时段，休息一下吧！';
    case 'shortBreak':
      return '休息时间结束了，准备开始下一个专注时段！';
    case 'longBreak':
      return '长休息结束，准备好继续工作了吗？';
  }
}
