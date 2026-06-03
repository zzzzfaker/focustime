import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';
import { useSettingStore } from '../store/useSettingStore';
import { requestNotificationPermissions } from '../utils/notifications';

const SettingsScreen: React.FC = () => {
  const {
    focusDuration,
    shortBreakDuration,
    longBreakDuration,
    longBreakInterval,
    notificationsEnabled,
    hapticsEnabled,
    theme,
    setFocusDuration,
    setShortBreakDuration,
    setLongBreakDuration,
    setLongBreakInterval,
    toggleNotifications,
    toggleHaptics,
    setTheme,
  } = useSettingStore();

  // 检查通知权限状态
  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    // 这里可以检查权限状态并更新 UI
  };

  // 处理通知开关变化
  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      // 开启通知时请求权限
      const granted = await requestNotificationPermissions();
      if (!granted) {
        Alert.alert(
          '通知权限',
          '请在系统设置中开启通知权限，以接收计时完成提醒',
          [{ text: '确定' }]
        );
        return;
      }
    }
    toggleNotifications();
  };

  // 时间选择项组件
  const TimeSelector: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    unit: string;
  }> = ({ label, value, onChange, min, max, unit }) => {
    const decrease = () => {
      if (value > min) onChange(value - 1);
    };

    const increase = () => {
      if (value < max) onChange(value + 1);
    };

    return (
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>{label}</Text>
        <View style={styles.timeSelector}>
          <TouchableOpacity style={styles.timeButton} onPress={decrease}>
            <Text style={styles.timeButtonText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.timeValue}>
            {value} {unit}
          </Text>
          <TouchableOpacity style={styles.timeButton} onPress={increase}>
            <Text style={styles.timeButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // 间隔选择组件
  const IntervalSelector: React.FC = () => {
    const options = [3, 4, 5, 6];

    return (
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>长休息间隔</Text>
        <View style={styles.intervalSelector}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.intervalButton,
                longBreakInterval === option && styles.intervalButtonActive,
              ]}
              onPress={() => setLongBreakInterval(option)}
            >
              <Text
                style={[
                  styles.intervalButtonText,
                  longBreakInterval === option && styles.intervalButtonTextActive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  // 主题选择组件
  const ThemeSelector: React.FC = () => {
    return (
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>主题</Text>
        <View style={styles.themeSelector}>
          <TouchableOpacity
            style={[
              styles.themeButton,
              theme === 'light' && styles.themeButtonActive,
            ]}
            onPress={() => setTheme('light')}
          >
            <Text
              style={[
                styles.themeButtonText,
                theme === 'light' && styles.themeButtonTextActive,
              ]}
            >
              浅色
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.themeButton,
              theme === 'dark' && styles.themeButtonActive,
            ]}
            onPress={() => setTheme('dark')}
          >
            <Text
              style={[
                styles.themeButtonText,
                theme === 'dark' && styles.themeButtonTextActive,
              ]}
            >
              深色
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 计时设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>计时设置</Text>

        <TimeSelector
          label="专注时长"
          value={focusDuration}
          onChange={setFocusDuration}
          min={15}
          max={60}
          unit="分钟"
        />

        <TimeSelector
          label="短休息时长"
          value={shortBreakDuration}
          onChange={setShortBreakDuration}
          min={5}
          max={15}
          unit="分钟"
        />

        <TimeSelector
          label="长休息时长"
          value={longBreakDuration}
          onChange={setLongBreakDuration}
          min={10}
          max={30}
          unit="分钟"
        />

        <IntervalSelector />
      </View>

      {/* 通知与反馈 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>通知与反馈</Text>

        <View style={styles.settingRow}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.settingLabel}>通知提醒</Text>
            <Text style={styles.settingDescription}>
              计时完成时发送通知
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: '#D1D1D6', true: '#FF6B6B' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.settingLabel}>震动反馈</Text>
            <Text style={styles.settingDescription}>
              计时完成时震动提示
            </Text>
          </View>
          <Switch
            value={hapticsEnabled}
            onValueChange={toggleHaptics}
            trackColor={{ false: '#D1D1D6', true: '#FF6B6B' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* 外观设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>外观</Text>
        <ThemeSelector />
      </View>

      {/* 关于信息 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>关于</Text>
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutText}>Focustime 番茄钟</Text>
          <Text style={styles.aboutSubtext}>版本 1.0.0</Text>
          <Text style={styles.aboutSubtext}>
            使用番茄工作法提升你的专注力
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  switchLabelContainer: {
    flex: 1,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    minWidth: 60,
    textAlign: 'center',
  },
  intervalSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  intervalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
  },
  intervalButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  intervalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  intervalButtonTextActive: {
    color: '#FFFFFF',
  },
  themeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  themeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  themeButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  themeButtonTextActive: {
    color: '#FFFFFF',
  },
  aboutContainer: {
    paddingVertical: 8,
  },
  aboutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  aboutSubtext: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
});

export default SettingsScreen;
