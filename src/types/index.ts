// 计时器模式类型
export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

// 任务类型
export interface Task {
  id: string;
  title: string;
  targetPomodoros: number;
  completedPomodoros: number;
  isCompleted: boolean;
  createdAt: number;
}

// 每日统计类型
export interface DailyStats {
  date: string; // YYYY-MM-DD
  totalSeconds: number;
  pomodoroCount: number;
}

// 设置类型
export interface Settings {
  focusDuration: number; // 专注时长（分钟）
  shortBreakDuration: number; // 短休息时长（分钟）
  longBreakDuration: number; // 长休息时长（分钟）
  longBreakInterval: number; // 每几个番茄后触发长休息（已弃用，保留兼容）
  breakType: 'short' | 'long'; // 休息类型：短休息或长休息
  notificationsEnabled: boolean; // 通知开关
  hapticsEnabled: boolean; // 震动开关
  theme: 'light' | 'dark'; // 主题
}

// 计时器状态类型
export interface TimerState {
  mode: TimerMode;
  remainingSeconds: number;
  isRunning: boolean;
  startTime: number | null;
  pausedAt: number | null;
  pomodoroCount: number; // 当前会话完成的番茄数
}
