import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useStatsStore } from '../store/useStatsStore';
import { useTaskStore } from '../store/useTaskStore';
import { useTheme } from '../contexts/ThemeContext';
import StatsChart from '../components/StatsChart';

// 创建动态样式函数
const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
  });

const StatsScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const { dailyStats, totalPomodoros, totalFocusMinutes } = useStatsStore();
  const { tasks } = useTaskStore();

  // 计算任务统计
  const tasksTotal = tasks.length;
  const tasksCompleted = tasks.filter(t => t.isCompleted).length;

  return (
    <View style={styles.container}>
      <StatsChart
        dailyStats={dailyStats}
        totalPomodoros={totalPomodoros}
        totalFocusMinutes={totalFocusMinutes}
        tasksCompleted={tasksCompleted}
        tasksTotal={tasksTotal}
      />
    </View>
  );
};

export default StatsScreen;
