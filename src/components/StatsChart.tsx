import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { DailyStats } from '../types';

interface StatsChartProps {
  dailyStats: DailyStats[];
  totalPomodoros: number;
  totalFocusMinutes: number;
  tasksCompleted?: number;
  tasksTotal?: number;
}

const screenWidth = Dimensions.get('window').width;

const StatsChart: React.FC<StatsChartProps> = ({
  dailyStats,
  totalPomodoros,
  totalFocusMinutes,
  tasksCompleted = 0,
  tasksTotal = 0,
}) => {
  // 获取最近7天的数据
  const getLast7DaysData = () => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const last7Days: DailyStats[] = [];
    const labels: string[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = formatDate(date);
      const dayStats = dailyStats.find(s => s.date === dateStr);

      last7Days.push(
        dayStats || { date: dateStr, totalSeconds: 0, pomodoroCount: 0 }
      );
      labels.push(days[date.getDay()]);
    }

    return { data: last7Days, labels };
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { data: last7Days, labels } = getLast7DaysData();

  // 柱状图配置
  const chartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.6,
    propsForLabels: {
      fontSize: 11,
    },
  };

  // 柱状图数据
  const barData = {
    labels,
    datasets: [
      {
        data: last7Days.map(day => Math.floor(day.totalSeconds / 60)),
      },
    ],
  };

  // 任务完成率数据
  const tasksPending = Math.max(0, tasksTotal - tasksCompleted);
  const pieData = [
    {
      name: '已完成',
      population: tasksCompleted,
      color: '#4CAF50',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: '进行中',
      population: tasksPending,
      color: '#FFC107',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
  ].filter(item => item.population > 0);

  return (
    <ScrollView style={styles.container}>
      {/* 概览卡片 */}
      <View style={styles.overviewContainer}>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>今日专注</Text>
          <Text style={styles.overviewValue}>
            {Math.floor((last7Days[6]?.totalSeconds || 0) / 60)}
          </Text>
          <Text style={styles.overviewUnit}>分钟</Text>
        </View>

        <View style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>累计番茄</Text>
          <Text style={styles.overviewValue}>{totalPomodoros}</Text>
          <Text style={styles.overviewUnit}>个</Text>
        </View>

        <View style={styles.overviewCard}>
          <Text style={styles.overviewLabel}>累计专注</Text>
          <Text style={styles.overviewValue}>{totalFocusMinutes}</Text>
          <Text style={styles.overviewUnit}>分钟</Text>
        </View>
      </View>

      {/* 近7天专注时长柱状图 */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>近7天专注时长</Text>
        <BarChart
          data={barData}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          showValuesOnTopOfBars
          fromZero
          yAxisLabel=""
          yAxisSuffix=" min"
          style={styles.chart}
        />
      </View>

      {/* 任务完成率饼图 */}
      {tasksTotal > 0 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>任务完成率</Text>
          <View style={styles.pieChartContainer}>
            <PieChart
              data={pieData}
              width={screenWidth - 32}
              height={200}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
          <View style={styles.legendContainer}>
            {pieData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendColor,
                    { backgroundColor: item.color },
                  ]}
                />
                <Text style={styles.legendText}>
                  {item.name}: {item.population}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  overviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  overviewUnit: {
    fontSize: 10,
    color: '#999',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  chart: {
    borderRadius: 12,
  },
  pieChartContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});

export default StatsChart;
