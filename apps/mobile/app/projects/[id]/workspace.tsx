import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const tasks = {
  backlog: [
    { id: 1, title: 'Design system setup', priority: 'high' },
    { id: 2, title: 'API documentation', priority: 'medium' },
  ],
  todo: [
    { id: 3, title: 'User authentication', priority: 'high' },
  ],
  in_progress: [
    { id: 4, title: 'Database schema', priority: 'high' },
  ],
  review: [
    { id: 5, title: 'Landing page', priority: 'medium' },
  ],
  done: [
    { id: 6, title: 'Project setup', priority: 'low' },
  ],
};

const priorityColors: Record<string, string> = {
  low: '#5a527a',
  medium: '#fbbf24',
  high: '#ff2fa0',
  urgent: '#ff2fa0',
};

export default function WorkspaceScreen() {
  const { id } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container} horizontal>
      <View style={styles.board}>
        {Object.entries(tasks).map(([status, statusTasks]) => (
          <View key={status} style={styles.column}>
            <Text style={styles.columnTitle}>{status.replace('_', ' ').toUpperCase()}</Text>
            {statusTasks.map((task) => (
              <View key={task.id} style={styles.taskCard}>
                <View style={[styles.priorityIndicator, { backgroundColor: priorityColors[task.priority] }]} />
                <Text style={styles.taskTitle}>{task.title}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add Task</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#03020a' },
  board: { flexDirection: 'row', padding: 16, gap: 12 },
  column: { width: 280, backgroundColor: '#07051a', borderRadius: 12, padding: 12 },
  columnTitle: { color: '#e8e4ff', fontWeight: '600', marginBottom: 12, fontSize: 12 },
  taskCard: { backgroundColor: '#0d0a2e', borderRadius: 8, padding: 12, marginBottom: 8 },
  priorityIndicator: { width: 4, height: 4, borderRadius: 2, marginBottom: 8 },
  taskTitle: { color: '#e8e4ff', fontSize: 14 },
  addButton: { padding: 12, alignItems: 'center' },
  addButtonText: { color: '#5a527a', fontSize: 14 },
});
