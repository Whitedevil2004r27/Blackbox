import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const skills = ['React', 'TypeScript', 'Node.js', 'UI Design', 'Three.js'];
const portfolio = [
  { id: 1, title: 'E-commerce Platform', category: 'Web Development' },
  { id: 2, title: 'Mobile Banking App', category: 'Mobile Design' },
];

export default function FreelancerScreen() {
  const { username } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AC</Text>
          </View>
          <Text style={styles.name}>Alice Chen</Text>
          <Text style={styles.username}>@{username}</Text>
          <Text style={styles.bio}>Full-stack developer specializing in React and Three.js</Text>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio</Text>
          {portfolio.map((item) => (
            <View key={item.id} style={styles.portfolioItem}>
              <View style={styles.portfolioImage} />
              <View>
                <Text style={styles.portfolioTitle}>{item.title}</Text>
                <Text style={styles.portfolioCategory}>{item.category}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Contact</Text>
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
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#e8e4ff', marginBottom: 12 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillBadge: { backgroundColor: 'rgba(123,47,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  skillText: { color: '#7b2fff', fontSize: 14 },
  portfolioItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#07051a', borderRadius: 12, padding: 12, marginBottom: 8 },
  portfolioImage: { width: 60, height: 60, backgroundColor: '#0d0a2e', borderRadius: 8, marginRight: 12 },
  portfolioTitle: { color: '#e8e4ff', fontWeight: '600' },
  portfolioCategory: { color: '#9b94c4', fontSize: 12, marginTop: 2 },
  button: { backgroundColor: '#00f5ff', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#03020a', fontSize: 16, fontWeight: '600' },
});
