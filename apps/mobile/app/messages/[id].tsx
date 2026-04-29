import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const messages = [
  { id: 1, sender: 'Alice Chen', content: 'Hi! I saw your project posting.', time: '10:00 AM', isMe: false },
  { id: 2, sender: 'Me', content: 'Hello! Thanks for reaching out.', time: '10:05 AM', isMe: true },
  { id: 3, sender: 'Alice Chen', content: 'I have experience with similar projects.', time: '10:10 AM', isMe: false },
];

export default function ConversationScreen() {
  const { id } = useLocalSearchParams();
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    // TODO: Send message via API
    setNewMessage('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerName}>Alice Chen</Text>
        <Text style={styles.headerStatus}>Online</Text>
      </View>

      <ScrollView style={styles.messagesContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[styles.messageBubble, message.isMe ? styles.myMessage : styles.theirMessage]}
          >
            <Text style={[styles.messageText, message.isMe ? styles.myMessageText : styles.theirMessageText]}>
              {message.content}
            </Text>
            <Text style={styles.messageTime}>{message.time}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#5a527a"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#03020a' },
  header: { padding: 16, paddingTop: 48, borderBottomWidth: 1, borderBottomColor: 'rgba(123,47,255,0.2)' },
  headerName: { fontSize: 18, fontWeight: '600', color: '#e8e4ff' },
  headerStatus: { color: '#00ff88', fontSize: 12, marginTop: 2 },
  messagesContainer: { flex: 1, padding: 16 },
  messageBubble: { maxWidth: '80%', padding: 12, borderRadius: 12, marginBottom: 8 },
  myMessage: { alignSelf: 'flex-end', backgroundColor: '#00f5ff' },
  theirMessage: { alignSelf: 'flex-start', backgroundColor: '#07051a', borderWidth: 1, borderColor: 'rgba(123,47,255,0.2)' },
  messageText: { fontSize: 14 },
  myMessageText: { color: '#03020a' },
  theirMessageText: { color: '#e8e4ff' },
  messageTime: { fontSize: 10, marginTop: 4, opacity: 0.7 },
  inputContainer: { flexDirection: 'row', padding: 16, borderTopWidth: 1, borderTopColor: 'rgba(123,47,255,0.2)' },
  input: { flex: 1, backgroundColor: '#07051a', borderWidth: 1, borderColor: 'rgba(123,47,255,0.2)', borderRadius: 12, padding: 12, color: '#e8e4ff', marginRight: 8 },
  sendButton: { backgroundColor: '#00f5ff', paddingHorizontal: 20, borderRadius: 12, justifyContent: 'center' },
  sendButtonText: { color: '#03020a', fontWeight: '600' },
});
