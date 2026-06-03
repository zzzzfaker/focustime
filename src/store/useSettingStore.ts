import { create } from 'zustand';
import { Settings } from '../types';
import { saveSettings, loadSettings } from '../utils/storage';

interface SettingState extends Settings {
  // Actions
  loadSettings: () => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => void;
  setFocusDuration: (minutes: number) => void;
  setShortBreakDuration: (minutes: number) => void;
  setLongBreakDuration: (minutes: number) => void;
  setLongBreakInterval: (interval: number) => void;
  toggleNotifications: () => void;
  toggleHaptics: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// 默认设置
const DEFAULT_SETTINGS: Settings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  notificationsEnabled: true,
  hapticsEnabled: true,
  theme: 'light',
};

export const useSettingStore = create<SettingState>((set, get) => ({
  ...DEFAULT_SETTINGS,

  // 加载设置
  loadSettings: async () => {
    const saved = await loadSettings();
    if (saved) {
      set(saved);
    }
  },

  // 更新设置
  updateSettings: (updates: Partial<Settings>) => {
    const current = get();
    const updated = { ...current, ...updates };
    set(updated);
    saveSettings(updated);
  },

  // 设置专注时长
  setFocusDuration: (minutes: number) => {
    get().updateSettings({ focusDuration: minutes });
  },

  // 设置短休息时长
  setShortBreakDuration: (minutes: number) => {
    get().updateSettings({ shortBreakDuration: minutes });
  },

  // 设置长休息时长
  setLongBreakDuration: (minutes: number) => {
    get().updateSettings({ longBreakDuration: minutes });
  },

  // 设置长休息间隔
  setLongBreakInterval: (interval: number) => {
    get().updateSettings({ longBreakInterval: interval });
  },

  // 切换通知开关
  toggleNotifications: () => {
    const current = get();
    get().updateSettings({ notificationsEnabled: !current.notificationsEnabled });
  },

  // 切换震动开关
  toggleHaptics: () => {
    const current = get();
    get().updateSettings({ hapticsEnabled: !current.hapticsEnabled });
  },

  // 设置主题
  setTheme: (theme: 'light' | 'dark') => {
    get().updateSettings({ theme });
  },
}));

// 初始化时加载设置
useSettingStore.getState().loadSettings();
