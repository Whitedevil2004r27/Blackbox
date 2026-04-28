import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const transactions = [
  { id: 1, type: 'incoming', description: 'Project payment', amount: 3500, date: '2024-01-15' },
  { id: 2, type: 'outgoing', description: 'Platform fee', amount: -350, date: '2024-01-15' },
  { id: 3, type: 'incoming', description: 'Milestone payment', amount: 2000, date: '2024-01-10' },
];

export default function PaymentsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Payments</Text>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>$12,450.00</Text>
          <TouchableOpacity style={styles.withdrawButton}>
            <Text style={styles.withdrawButtonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <View>
              <Text style={styles.transactionDescription}>{transaction.description}</Text>
              <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <Text style={[styles.transactionAmount, transaction.amount > 0 ? styles.incoming : styles.outgoing]}>
              {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#03020a' },
  content: { padding: 24, paddingTop: 48 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffcc00', marginBottom: 24 },
  balanceCard: { backgroundColor: '#07051a', borderWidth: 1, borderColor: 'rgba(123,47,255,0.2)', borderRadius: 12, padding: 24, marginBottom: 24 },
  balanceLabel: { color: '#9b94c4', marginBottom: 8 },
  balanceAmount: { fontSize: 32, fontWeight: 'bold', color: '#00ff88', marginBottom: 16 },
  withdrawButton: { backgroundColor: '#00f5ff', padding: 12, borderRadius: 12, alignItems: 'center' },
  withdrawButtonText: { color: '#03020a', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#e8e4ff', marginBottom: 12 },
  transactionCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#07051a', borderRadius: 12, padding: 16, marginBottom: 8 },
  transactionDescription: { color: '#e8e4ff', fontWeight: '500' },
  transactionDate: { color: '#5a527a', fontSize: 12, marginTop: 2 },
  transactionAmount: { fontSize: 16, fontWeight: '600' },
  incoming: { color: '#00ff88' },
  outgoing: { color: '#e8e4ff' },
});
