import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Keyboard,
  Modal,
} from 'react-native';
import { useTaskStore } from '../store/useTaskStore';
import { useTimerStore } from '../store/useTimerStore';
import TaskItem from '../components/TaskItem';
import { Task } from '../types';

const TasksScreen: React.FC = () => {
  const { tasks, currentTaskId, addTask, deleteTask, updateTask, setCurrentTask } = useTaskStore();
  const { currentTaskId: timerTaskId, setCurrentTaskId: setTimerCurrentTaskId } = useTimerStore();

  const [taskTitle, setTaskTitle] = useState('');
  const [targetPomodoros, setTargetPomodoros] = useState('4');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPomodoros, setEditPomodoros] = useState('4');
  const [showAddModal, setShowAddModal] = useState(false);

  // 分离进行中和已完成的任务
  const activeTasks = tasks.filter(t => !t.isCompleted);
  const completedTasks = tasks.filter(t => t.isCompleted);

  // 添加任务
  const handleAddTask = () => {
    if (!taskTitle.trim()) {
      Alert.alert('提示', '请输入任务标题');
      return;
    }

    const pomodoros = parseInt(targetPomodoros) || 4;
    if (pomodoros < 1) {
      Alert.alert('提示', '番茄数至少为1');
      return;
    }

    addTask(taskTitle.trim(), pomodoros);
    setTaskTitle('');
    setTargetPomodoros('4');
    setShowAddModal(false);
    Keyboard.dismiss();
  };

  // 删除任务
  const handleDeleteTask = (task: Task) => {
    Alert.alert(
      '删除任务',
      `确定要删除"${task.title}"吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => deleteTask(task.id),
        },
      ]
    );
  };

  // 开始编辑任务
  const startEditing = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditPomodoros(task.targetPomodoros.toString());
  };

  // 保存编辑
  const saveEdit = () => {
    if (!editingTask) return;

    if (!editTitle.trim()) {
      Alert.alert('提示', '请输入任务标题');
      return;
    }

    const pomodoros = parseInt(editPomodoros) || 4;
    if (pomodoros < 1) {
      Alert.alert('提示', '番茄数至少为1');
      return;
    }

    updateTask(editingTask.id, {
      title: editTitle.trim(),
      targetPomodoros: pomodoros,
    });

    setEditingTask(null);
    setEditTitle('');
    setEditPomodoros('4');
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle('');
    setEditPomodoros('4');
  };

  // 选择当前任务
  const handleSelectTask = (task: Task) => {
    const taskId = currentTaskId === task.id ? null : task.id;
    setCurrentTask(taskId);
    setTimerCurrentTaskId(taskId);
  };

  // 渲染任务项
  const renderTaskItem = ({ item }: { item: Task }) => (
    <TaskItem
      task={item}
      isActive={currentTaskId === item.id}
      onPress={() => {}}
      onDelete={() => handleDeleteTask(item)}
      onToggleActive={(taskId) => handleSelectTask(item)}
    />
  );

  return (
    <View style={styles.container}>
      {/* 添加任务按钮 */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.addButtonText}>+ 添加任务</Text>
      </TouchableOpacity>

      {/* 任务列表 */}
      <FlatList
        data={activeTasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无任务</Text>
            <Text style={styles.emptySubtext}>点击上方按钮添加新任务</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />

      {/* 已完成任务标题 */}
      {completedTasks.length > 0 && (
        <View style={styles.completedHeader}>
          <Text style={styles.completedHeaderText}>已完成 ({completedTasks.length})</Text>
        </View>
      )}

      {/* 已完成任务列表 */}
      {completedTasks.length > 0 && (
        <FlatList
          data={completedTasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* 添加任务弹窗 */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>添加新任务</Text>

            <TextInput
              style={styles.input}
              placeholder="任务标题"
              value={taskTitle}
              onChangeText={setTaskTitle}
              autoFocus
            />

            <View style={styles.pomodoroSelector}>
              <Text style={styles.pomodoroLabel}>目标番茄数:</Text>
              <View style={styles.pomodoroButtons}>
                {[1, 2, 4, 6, 8].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.pomodoroButton,
                      targetPomodoros === num.toString() && styles.pomodoroButtonActive,
                    ]}
                    onPress={() => setTargetPomodoros(num.toString())}
                  >
                    <Text
                      style={[
                        styles.pomodoroButtonText,
                        targetPomodoros === num.toString() && styles.pomodoroButtonTextActive,
                      ]}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowAddModal(false);
                  setTaskTitle('');
                  setTargetPomodoros('4');
                }}
              >
                <Text style={styles.modalButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleAddTask}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextConfirm]}>
                  添加
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 编辑任务弹窗 */}
      <Modal
        visible={editingTask !== null}
        transparent
        animationType="slide"
        onRequestClose={cancelEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>编辑任务</Text>

            <TextInput
              style={styles.input}
              placeholder="任务标题"
              value={editTitle}
              onChangeText={setEditTitle}
            />

            <View style={styles.pomodoroSelector}>
              <Text style={styles.pomodoroLabel}>目标番茄数:</Text>
              <View style={styles.pomodoroButtons}>
                {[1, 2, 4, 6, 8].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={[
                      styles.pomodoroButton,
                      editPomodoros === num.toString() && styles.pomodoroButtonActive,
                    ]}
                    onPress={() => setEditPomodoros(num.toString())}
                  >
                    <Text
                      style={[
                        styles.pomodoroButtonText,
                        editPomodoros === num.toString() && styles.pomodoroButtonTextActive,
                      ]}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={cancelEdit}
              >
                <Text style={styles.modalButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={saveEdit}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextConfirm]}>
                  保存
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BBB',
  },
  completedHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#E8E8E8',
  },
  completedHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  pomodoroSelector: {
    marginBottom: 20,
  },
  pomodoroLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  pomodoroButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pomodoroButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pomodoroButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  pomodoroButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  pomodoroButtonTextActive: {
    color: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#E0E0E0',
  },
  modalButtonConfirm: {
    backgroundColor: '#FF6B6B',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  modalButtonTextConfirm: {
    color: '#FFFFFF',
  },
});

export default TasksScreen;
