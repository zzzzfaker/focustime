import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, DailyStats, Settings } from '../types';

// 存储键常量
export const STORAGE_KEYS = {
  TASKS: '@focustime_tasks',
  STATS: '@focustime_stats',
  SETTINGS: '@focustime_settings',
  TIMER_STATE: '@focustime_timer_state',
} as const;

// 任务相关存储
export const saveTasks = async (tasks: Task[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks:', error);
  }
};

export const loadTasks = async (): Promise<Task[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load tasks:', error);
    return [];
  }
};

// 统计数据存储
export const saveStats = async (stats: DailyStats[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save stats:', error);
  }
};

export const loadStats = async (): Promise<DailyStats[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.STATS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load stats:', error);
    return [];
  }
};

// 设置存储
export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export const loadSettings = async (): Promise<Settings | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load settings:', error);
    return null;
  }
};

// 计时器状态存储（用于后台恢复）
export const saveTimerState = async (state: {
  mode: string;
  remainingSeconds: number;
  startTime: number | null;
  pausedAt: number | null;
}): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TIMER_STATE, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save timer state:', error);
  }
};

export const loadTimerState = async (): Promise<{
  mode: string;
  remainingSeconds: number;
  startTime: number | null;
  pausedAt: number | null;
} | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TIMER_STATE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load timer state:', error);
    return null;
  }
};

export const clearTimerState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TIMER_STATE);
  } catch (error) {
    console.error('Failed to clear timer state:', error);
  }
};
