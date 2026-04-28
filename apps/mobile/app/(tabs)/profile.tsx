import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const skills = ['React', 'TypeScript', 'Node.js', 'UI Design', 'Three.js'];
const stats = [
  { label: 'Projects', value: '24' },
  { label: 'Rating', value: '4.9' },
  { label: 'Earnings', value: '$45k' },
];

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AC</Text>
          </View>
          <Text style={styles.name}>Alice Chen</Text>
          <Text style={styles.username}>@alicechen</Text>
          <Text style={styles.bio}>Full-stack developer specializing in React and Three.js</Text>
        </View>

        <View style={styles.statsRow}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsRow}>
            {skills.map((skill) => (
              <View key={skill} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#03020a' },
  content: { padding: 24, paddingTop: 48 },
  header: { alignItems: 'center', marginBottom: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#00f5ff', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: '#03020a', fontSize: 24, fontWeight: 'bold' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#e8e4ff' },
  username: { color: '#00f5ff', marginTop: 4 },
  bio: { color: '#9b94c4', textAlign: 'center', marginTop: 8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 24 },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#ffcc00' },
  statLabel: { color: '#9b94c4', fontSize: 12, marginTop: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#e8e4ff', marginBottom: 12 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillBadge: { backgroundColor: 'rgba(123,47,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  skillText: { color: '#7b2fff', fontSize: 14 },
  editButton: { backgroundColor: '#00f5ff', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  editButtonText: { color: '#03020a', fontSize: 16, fontWeight: '600' },
});
