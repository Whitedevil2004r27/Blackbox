import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const projects = [
  { id: 1, title: 'E-commerce Website', status: 'in_progress', budget: '$5,000' },
  { id: 2, title: 'Mobile App Design', status: 'open', budget: '$3,500' },
  { id: 3, title: 'API Development', status: 'completed', budget: '$2,000' },
];

const statusColors: Record<string, string> = {
  open: '#4ade80',
  in_progress: '#fbbf24',
  completed: '#818cf8',
};

export default function ProjectsScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My Projects</Text>

        {projects.map((project) => (
          <TouchableOpacity key={project.id} style={styles.projectCard}>
            <View style={styles.projectHeader}>
              <Text style={styles.projectTitle}>{project.title}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColors[project.status] + '20' }]}>
                <Text style={[styles.statusText, { color: statusColors[project.status] }]}>
                  {project.status.replace('_', ' ')}
                </Text>
              </View>
            </View>
            <Text style={styles.projectBudget}>{project.budget}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#03020a' },
  content: { padding: 24, paddingTop: 48 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffcc00', marginBottom: 24 },
  projectCard: { backgroundColor: '#07051a', borderWidth: 1, borderColor: 'rgba(123,47,255,0.2)', borderRadius: 12, padding: 16, marginBottom: 12 },
  projectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  projectTitle: { color: '#e8e4ff', fontSize: 16, fontWeight: '600', flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '500', textTransform: 'capitalize' },
  projectBudget: { color: '#00f5ff', fontSize: 14, fontWeight: '600' },
});
