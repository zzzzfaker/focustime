import { create } from 'zustand';
import { Task } from '../types';
import { saveTasks, loadTasks } from '../utils/storage';

interface TaskState {
  tasks: Task[];
  currentTaskId: string | null;

  // Actions
  loadTasks: () => Promise<void>;
  addTask: (title: string, targetPomodoros: number) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  incrementTaskPomodoro: (id: string) => void;
  setCurrentTask: (id: string | null) => void;
  getCurrentTask: () => Task | null;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTaskId: null,

  // 加载任务
  loadTasks: async () => {
    const tasks = await loadTasks();
    set({ tasks });
  },

  // 添加任务
  addTask: (title: string, targetPomodoros: number) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      targetPomodoros,
      completedPomodoros: 0,
      isCompleted: false,
      createdAt: Date.now(),
    };

    const { tasks } = get();
    const updatedTasks = [...tasks, newTask];
    set({ tasks: updatedTasks });

    saveTasks(updatedTasks);
  },

  // 更新任务
  updateTask: (id: string, updates: Partial<Task>) => {
    const { tasks } = get();
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, ...updates } : task
    );
    set({ tasks: updatedTasks });

    saveTasks(updatedTasks);
  },

  // 删除任务
  deleteTask: (id: string) => {
    const { tasks, currentTaskId } = get();
    const updatedTasks = tasks.filter(task => task.id !== id);

    // 如果删除的是当前任务，清空当前任务ID
    if (currentTaskId === id) {
      set({ currentTaskId: null });
    }

    set({ tasks: updatedTasks });
    saveTasks(updatedTasks);
  },

  // 切换任务完成状态
  toggleTaskComplete: (id: string) => {
    const { tasks } = get();
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    });
    set({ tasks: updatedTasks });

    saveTasks(updatedTasks);
  },

  // 增加任务的番茄数
  incrementTaskPomodoro: (id: string) => {
    const { tasks } = get();
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        const newCount = task.completedPomodoros + 1;
        const isCompleted = newCount >= task.targetPomodoros;
        return {
          ...task,
          completedPomodoros: newCount,
          isCompleted,
        };
      }
      return task;
    });
    set({ tasks: updatedTasks });

    saveTasks(updatedTasks);
  },

  // 设置当前任务
  setCurrentTask: (id: string | null) => {
    set({ currentTaskId: id });
  },

  // 获取当前任务
  getCurrentTask: () => {
    const { tasks, currentTaskId } = get();
    return tasks.find(task => task.id === currentTaskId) || null;
  },
}));

// 初始化时加载任务
useTaskStore.getState().loadTasks();
