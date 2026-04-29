import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const categories = [
  { id: 1, name: 'Development', count: 1240, icon: '💻' },
  { id: 2, name: 'Design', count: 890, icon: '🎨' },
  { id: 3, name: 'Marketing', count: 650, icon: '📈' },
  { id: 4, name: 'Writing', count: 430, icon: '✍️' },
  { id: 5, name: 'Video', count: 320, icon: '🎬' },
  { id: 6, name: 'Music', count: 210, icon: '🎵' },
];

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Discover projects and freelancers</Text>

        <View style={styles.grid}>
          {categories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.count} projects</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#03020a' },
  content: { padding: 24, paddingTop: 48 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffcc00', marginBottom: 4 },
  subtitle: { color: '#9b94c4', marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryCard: { width: '47%', backgroundColor: '#07051a', borderWidth: 1, borderColor: 'rgba(123,47,255,0.2)', borderRadius: 12, padding: 20, marginBottom: 12 },
  categoryIcon: { fontSize: 32, marginBottom: 8 },
  categoryName: { color: '#e8e4ff', fontSize: 16, fontWeight: '600' },
  categoryCount: { color: '#9b94c4', fontSize: 12, marginTop: 4 },
});
