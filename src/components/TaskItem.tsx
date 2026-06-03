import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  isActive?: boolean;
  onPress?: (task: Task) => void;
  onDelete?: () => void;
  onToggleActive?: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isActive = false,
  onPress,
  onDelete,
  onToggleActive,
}) => {
  // 渲染右侧删除按钮
  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={onDelete}
      activeOpacity={0.7}
    >
      <Text style={styles.deleteButtonText}>删除</Text>
    </TouchableOpacity>
  );

  const handlePress = () => {
    if (onPress) {
      onPress(task);
    }
  };

  const handleToggleActive = () => {
    if (onToggleActive && !task.isCompleted) {
      onToggleActive(task.id);
    }
  };

  const progress = task.targetPomodoros > 0
    ? task.completedPomodoros / task.targetPomodoros
    : 0;

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        style={[
          styles.container,
          isActive && styles.activeContainer,
          task.isCompleted && styles.completedContainer,
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {/* 左侧：选择按钮 */}
        <TouchableOpacity
          style={[
            styles.checkButton,
            task.isCompleted && styles.checkButtonCompleted,
          ]}
          onPress={handleToggleActive}
          disabled={task.isCompleted}
        >
          <Text style={styles.checkButtonText}>
            {task.isCompleted ? '✓' : isActive ? '●' : '○'}
          </Text>
        </TouchableOpacity>

        {/* 中间：任务信息 */}
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              task.isCompleted && styles.completedText,
            ]}
            numberOfLines={1}
          >
            {task.title}
          </Text>
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              {task.completedPomodoros}/{task.targetPomodoros} 番茄
            </Text>
            {/* 进度条 */}
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(100, progress * 100)}%` },
                  task.isCompleted && styles.progressFillCompleted,
                ]}
              />
            </View>
          </View>
        </View>

        {/* 右侧：完成状态 */}
        {task.isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedBadgeText}>已完成</Text>
          </View>
        )}
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeContainer: {
    backgroundColor: '#FFF5F5',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  completedContainer: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkButtonCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  checkButtonText: {
    fontSize: 16,
    color: '#E0E0E0',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 3,
  },
  progressFillCompleted: {
    backgroundColor: '#4CAF50',
  },
  completedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  completedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    marginVertical: 4,
    borderRadius: 12,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TaskItem;
