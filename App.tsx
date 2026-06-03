import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Screens
import TimerScreen from './src/screens/TimerScreen';
import TasksScreen from './src/screens/TasksScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#E0E0E0',
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarActiveTintColor: '#FF6B6B',
            tabBarInactiveTintColor: '#999',
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
          }}
        >
          <Tab.Screen
            name="Timer"
            component={TimerScreen}
            options={{
              tabBarLabel: '计时器',
              tabBarIcon: ({ color, size }) => (
                <TabIcon name="timer" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Tasks"
            component={TasksScreen}
            options={{
              tabBarLabel: '任务',
              tabBarIcon: ({ color, size }) => (
                <TabIcon name="tasks" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Stats"
            component={StatsScreen}
            options={{
              tabBarLabel: '统计',
              tabBarIcon: ({ color, size }) => (
                <TabIcon name="stats" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              tabBarLabel: '设置',
              tabBarIcon: ({ color, size }) => (
                <TabIcon name="settings" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// 简单的图标组件（使用文本图标，实际项目中可以使用 @expo/vector-icons）
const TabIcon: React.FC<{ name: string; color: string; size: number }> = ({
  name,
  color,
  size,
}) => {
  const icons: Record<string, string> = {
    timer: '⏱',
    tasks: '📋',
    stats: '📊',
    settings: '⚙️',
  };

  return (
    <Text style={{ fontSize: size, color }}>
      {icons[name] || '•'}
    </Text>
  );
};
