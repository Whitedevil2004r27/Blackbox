import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>E-commerce Website</Text>
        <Text style={styles.budget}>$5,000</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.text}>Full-stack e-commerce platform with React and Node.js</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills Required</Text>
          <View style={styles.skillsRow}>
            {['React', 'Node.js', 'Stripe'].map((skill) => (
              <View key={skill} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push(`/projects/${id}/workspace`)}
        >
          <Text style={styles.buttonText}>Open Workspace</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#03020a' },
  content: { padding: 24, paddingTop: 48 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffcc00', marginBottom: 8 },
  budget: { fontSize: 24, color: '#00f5ff', fontWeight: '600', marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#e8e4ff', marginBottom: 8 },
  text: { color: '#9b94c4', lineHeight: 22 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillBadge: { backgroundColor: 'rgba(123,47,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  skillText: { color: '#7b2fff', fontSize: 14 },
  button: { backgroundColor: '#00f5ff', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#03020a', fontSize: 16, fontWeight: '600' },
});
