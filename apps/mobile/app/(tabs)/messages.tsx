import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const conversations = [
  { id: 1, name: 'Alice Chen', lastMessage: 'Thanks for the update!', time: '2m ago', unread: 2 },
  { id: 2, name: 'Bob Smith', lastMessage: 'Can we discuss the timeline?', time: '1h ago', unread: 0 },
  { id: 3, name: 'Project Team', lastMessage: 'Meeting at 3pm', time: '3h ago', unread: 1 },
];

export default function MessagesScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Messages</Text>

        {conversations.map((conversation) => (
          <TouchableOpacity
            key={conversation.id}
            style={styles.conversationCard}
            onPress={() => router.push(`/messages/${conversation.id}`)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{conversation.name.charAt(0)}</Text>
            </View>
            <View style={styles.conversationInfo}>
              <View style={styles.conversationHeader}>
                <Text style={styles.conversationName}>{conversation.name}</Text>
                <Text style={styles.conversationTime}>{conversation.time}</Text>
              </View>
              <Text style={styles.conversationMessage} numberOfLines={1}>
                {conversation.lastMessage}
              </Text>
            </View>
            {conversation.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{conversation.unread}</Text>
              </View>
            )}
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
  conversationCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#07051a', borderWidth: 1, borderColor: 'rgba(123,47,255,0.2)', borderRadius: 12, padding: 16, marginBottom: 12 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#00f5ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#03020a', fontSize: 18, fontWeight: 'bold' },
  conversationInfo: { flex: 1 },
  conversationHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  conversationName: { color: '#e8e4ff', fontSize: 16, fontWeight: '600' },
  conversationTime: { color: '#5a527a', fontSize: 12 },
  conversationMessage: { color: '#9b94c4', fontSize: 14 },
  unreadBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#00f5ff', alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  unreadText: { color: '#03020a', fontSize: 12, fontWeight: 'bold' },
});
