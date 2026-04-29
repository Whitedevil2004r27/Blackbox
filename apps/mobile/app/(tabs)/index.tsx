import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const feedItems = [
  { id: 1, type: 'project', title: 'E-commerce Website', budget: '$5,000', user: 'Alice Chen' },
  { id: 2, type: 'proposal', title: 'Proposal accepted', project: 'Mobile App', user: 'Bob Smith' },
  { id: 3, type: 'message', title: 'New message', content: 'Can we discuss the timeline?', user: 'Charlie Davis' },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>FreelanceX</Text>
        <Text style={styles.subtitle}>Your freelance universe</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Active Projects</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, styles.statValueGreen]}>$12.4k</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {feedItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.feedItem}>
            <Text style={styles.feedTitle}>{item.title}</Text>
            <Text style={styles.feedContent}>
              {item.budget || item.content || item.project}
            </Text>
            <Text style={styles.feedUser}>{item.user}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#03020a' },
  content: { padding: 24, paddingTop: 48 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffcc00', marginBottom: 4 },
  subtitle: { color: '#9b94c4', marginBottom: 24 },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#07051a', borderWidth: 1, borderColor: 'rgba(123,47,255,0.2)', borderRadius: 12, padding: 16 },
  statValue: { color: '#00f5ff', fontSize: 24, fontWeight: 'bold' },
  statValueGreen: { color: '#00ff88' },
  statLabel: { color: '#9b94c4', fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#e8e4ff', marginBottom: 16 },
  feedItem: { backgroundColor: '#07051a', borderWidth: 1, borderColor: 'rgba(123,47,255,0.2)', borderRadius: 12, padding: 16, marginBottom: 12 },
  feedTitle: { color: '#e8e4ff', fontWeight: '600', fontSize: 16 },
  feedContent: { color: '#9b94c4', fontSize: 14, marginTop: 4 },
  feedUser: { color: '#5a527a', fontSize: 12, marginTop: 8 },
});

