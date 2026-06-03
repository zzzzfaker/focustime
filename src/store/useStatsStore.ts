import { create } from 'zustand';
import { DailyStats } from '../types';
import { saveStats, loadStats } from '../utils/storage';

interface StatsState {
  dailyStats: DailyStats[];
  todayStats: DailyStats | null;
  totalPomodoros: number;
  totalFocusMinutes: number;

  // Actions
  loadStats: () => Promise<void>;
  addFocusTime: (seconds: number) => void;
  addPomodoro: () => void;
  getTodayDateString: () => string;
  getLast7DaysStats: () => DailyStats[];
  getWeeklyChartLabels: () => string[];
  getWeeklyChartData: () => number[];
}

// 获取今天的日期字符串（YYYY-MM-DD）
const getTodayString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 获取最近7天的日期标签
const getLast7DaysLabels = (): string[] => {
  const labels: string[] = [];
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(days[date.getDay()]);
  }

  return labels;
};

export const useStatsStore = create<StatsState>((set, get) => ({
  dailyStats: [],
  todayStats: null,
  totalPomodoros: 0,
  totalFocusMinutes: 0,

  // 加载统计数据
  loadStats: async () => {
    const stats = await loadStats();
    const today = getTodayString();

    // 计算总数
    const totalPomodoros = stats.reduce((sum, day) => sum + day.pomodoroCount, 0);
    const totalFocusMinutes = Math.floor(
      stats.reduce((sum, day) => sum + day.totalSeconds, 0) / 60
    );

    // 找到今天的统计数据
    const todayStats = stats.find(s => s.date === today) || null;

    // 只保留最近30天的数据
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const filteredStats = stats.filter(s => {
      const date = new Date(s.date);
      return date >= thirtyDaysAgo;
    });

    set({
      dailyStats: filteredStats,
      todayStats,
      totalPomodoros,
      totalFocusMinutes,
    });
  },

  // 添加专注时间
  addFocusTime: (seconds: number) => {
    const { dailyStats, todayStats } = get();
    const today = getTodayString();

    const updatedToday: DailyStats = {
      date: today,
      totalSeconds: (todayStats?.totalSeconds || 0) + seconds,
      pomodoroCount: (todayStats?.pomodoroCount || 0),
    };

    // 更新或添加今天的记录
    const updatedStats = dailyStats.filter(s => s.date !== today);
    updatedStats.push(updatedToday);

    // 按日期排序
    updatedStats.sort((a, b) => a.date.localeCompare(b.date));

    set({
      dailyStats: updatedStats,
      todayStats: updatedToday,
      totalFocusMinutes: Math.floor(
        (get().totalFocusMinutes * 60 + seconds) / 60
      ),
    });

    saveStats(updatedStats);
  },

  // 添加番茄数
  addPomodoro: () => {
    const { dailyStats, todayStats } = get();
    const today = getTodayString();

    const updatedToday: DailyStats = {
      date: today,
      totalSeconds: todayStats?.totalSeconds || 0,
      pomodoroCount: (todayStats?.pomodoroCount || 0) + 1,
    };

    // 更新或添加今天的记录
    const updatedStats = dailyStats.filter(s => s.date !== today);
    updatedStats.push(updatedToday);

    // 按日期排序
    updatedStats.sort((a, b) => a.date.localeCompare(b.date));

    set({
      dailyStats: updatedStats,
      todayStats: updatedToday,
      totalPomodoros: get().totalPomodoros + 1,
    });

    saveStats(updatedStats);
  },

  // 获取今天的日期字符串
  getTodayDateString: () => {
    return getTodayString();
  },

  // 获取最近7天的统计数据
  getLast7DaysStats: () => {
    const { dailyStats } = get();
    const last7Days: DailyStats[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = getTodayStringFromDate(date);

      const dayStats = dailyStats.find(s => s.date === dateStr);
      if (dayStats) {
        last7Days.push(dayStats);
      } else {
        last7Days.push({
          date: dateStr,
          totalSeconds: 0,
          pomodoroCount: 0,
        });
      }
    }

    return last7Days;
  },

  // 获取周图表标签
  getWeeklyChartLabels: () => {
    return getLast7DaysLabels();
  },

  // 获取周图表数据（分钟数）
  getWeeklyChartData: () => {
    const last7Days = get().getLast7DaysStats();
    return last7Days.map(day => Math.floor(day.totalSeconds / 60));
  },
}));

// 辅助函数：从日期获取字符串
const getTodayStringFromDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 初始化时加载统计
useStatsStore.getState().loadStats();
