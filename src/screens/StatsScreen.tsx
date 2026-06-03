import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useStatsStore } from '../store/useStatsStore';
import { useTaskStore } from '../store/useTaskStore';
import StatsChart from '../components/StatsChart';

const StatsScreen: React.FC = () => {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});

export default StatsScreen;
