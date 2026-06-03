import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AppState,
  AppStateStatus,
} from 'react-native';
import { useTimerStore } from '../store/useTimerStore';
import { useTaskStore } from '../store/useTaskStore';
import { useStatsStore } from '../store/useStatsStore';
import CircularProgress from '../components/CircularProgress';

const TimerScreen: React.FC = () => {
  const {
    mode,
    remainingSeconds,
    initialSeconds,
    isRunning,
    pomodoroCount,
    currentTaskId,
    start,
    pause,
    reset,
    tick,
    setMode,
    handleAppStateChange,
    setCurrentTaskId,
  } = useTimerStore();

  const { tasks, getCurrentTask, incrementTaskPomodoro } = useTaskStore();
  const { addFocusTime, addPomodoro } = useStatsStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 格式化时间显示 MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 获取模式标签
  const getModeLabel = (): string => {
    switch (mode) {
      case 'focus':
        return '专注时间';
      case 'shortBreak':
        return '短休息';
      case 'longBreak':
        return '长休息';
    }
  };

  // 获取进度
  const progress = remainingSeconds / initialSeconds;

  // 监听应用状态变化
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (
      nextAppState: AppStateStatus
    ) => {
      handleAppStateChange(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [handleAppStateChange]);

  // 计时器逻辑
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, tick]);

  // 监听计时结束
  useEffect(() => {
    if (remainingSeconds === 0 && !isRunning) {
      // 计时结束时添加统计数据
      if (mode === 'focus') {
        const focusTime = initialSeconds;
        addFocusTime(focusTime);
        addPomodoro();

        // 如果有当前任务，增加番茄数
        if (currentTaskId) {
          incrementTaskPomodoro(currentTaskId);
        }
      }
    }
  }, [remainingSeconds, isRunning, mode, initialSeconds, currentTaskId]);

  const currentTask = getCurrentTask();

  return (
    <View style={styles.container}>
      {/* 模式选择按钮 */}
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'focus' && styles.modeButtonActive]}
          onPress={() => setMode('focus')}
        >
          <Text
            style={[
              styles.modeButtonText,
              mode === 'focus' && styles.modeButtonTextActive,
            ]}
          >
            专注
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === 'shortBreak' && styles.modeButtonActive,
          ]}
          onPress={() => setMode('shortBreak')}
        >
          <Text
            style={[
              styles.modeButtonText,
              mode === 'shortBreak' && styles.modeButtonTextActive,
            ]}
          >
            短休
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modeButton,
            mode === 'longBreak' && styles.modeButtonActive,
          ]}
          onPress={() => setMode('longBreak')}
        >
          <Text
            style={[
              styles.modeButtonText,
              mode === 'longBreak' && styles.modeButtonTextActive,
            ]}
          >
            长休
          </Text>
        </TouchableOpacity>
      </View>

      {/* 圆形进度条 */}
      <View style={styles.progressContainer}>
        <CircularProgress
          size={280}
          strokeWidth={12}
          progress={progress}
          color={mode === 'focus' ? '#FF6B6B' : '#4CAF50'}
        >
          <Text style={styles.modeLabel}>{getModeLabel()}</Text>
          <Text style={styles.timeText}>{formatTime(remainingSeconds)}</Text>
          {currentTask && mode === 'focus' && (
            <Text style={styles.taskLabel}>{currentTask.title}</Text>
          )}
        </CircularProgress>
      </View>

      {/* 番茄计数 */}
      {mode === 'focus' && (
        <View style={styles.pomodoroCounter}>
          <Text style={styles.pomodoroCounterText}>
            已完成 {pomodoroCount} 个番茄
          </Text>
        </View>
      )}

      {/* 控制按钮 */}
      <View style={styles.controlButtons}>
        <TouchableOpacity
          style={[styles.controlButton, styles.resetButton]}
          onPress={reset}
        >
          <Text style={styles.controlButtonText}>重置</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.mainButton,
            isRunning ? styles.pauseButton : styles.startButton,
          ]}
          onPress={isRunning ? pause : start}
        >
          <Text style={styles.mainButtonText}>
            {isRunning ? '暂停' : '开始'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 当前任务提示 */}
      {tasks.length > 0 && mode === 'focus' && !currentTask && (
        <TouchableOpacity
          style={styles.taskHint}
          onPress={() => {
            // 这里可以导航到任务页面
          }}
        >
          <Text style={styles.taskHintText}>
            去任务页面选择一个任务 →
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingTop: 40,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  modeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  modeButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  modeButtonTextActive: {
    color: '#FFFFFF',
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  modeLabel: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'monospace',
  },
  taskLabel: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  pomodoroCounter: {
    alignItems: 'center',
    marginVertical: 20,
  },
  pomodoroCounterText: {
    fontSize: 16,
    color: '#666',
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 20,
  },
  controlButton: {
    width: 100,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#E0E0E0',
  },
  mainButton: {
    width: 140,
    height: 60,
  },
  startButton: {
    backgroundColor: '#FF6B6B',
  },
  pauseButton: {
    backgroundColor: '#FFA726',
  },
  controlButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  taskHint: {
    alignItems: 'center',
    marginTop: 30,
  },
  taskHintText: {
    fontSize: 14,
    color: '#FF6B6B',
  },
});

export default TimerScreen;
