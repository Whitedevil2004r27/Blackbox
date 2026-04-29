import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function PortfolioItemScreen() {
  const { id } = useLocalSearchParams();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageText}>🎨</Text>
        </View>
        <Text style={styles.title}>E-commerce Platform</Text>
        <Text style={styles.category}>Web Development</Text>
        <Text style={styles.description}>
          A full-featured e-commerce platform built with React, Node.js, and Stripe.
          Features include product catalog, shopping cart, checkout flow, and admin dashboard.
        </Text>
        <View style={styles.skillsRow}>
          {['React', 'Node.js', 'Stripe', 'PostgreSQL'].map((skill) => (
            <View key={skill} style={styles.skillBadge}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#03020a' },
  content: { padding: 24, paddingTop: 48 },
  imagePlaceholder: { height: 240, backgroundColor: '#07051a', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  imageText: { fontSize: 64 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#e8e4ff', marginBottom: 4 },
  category: { color: '#00f5ff', marginBottom: 16 },
  description: { color: '#9b94c4', lineHeight: 22, marginBottom: 16 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillBadge: { backgroundColor: 'rgba(123,47,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  skillText: { color: '#7b2fff', fontSize: 14 },
});
