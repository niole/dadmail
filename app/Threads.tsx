import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { GlobalContext } from './state';

export function Threads() {
    const state = useContext(GlobalContext);
    return (
      <View style={styles.container}>
        {state.threads.map(t => (
          <View key={t.id} style={styles.chatContainer}>
            <Text>{t.subject}</Text>
            <View>
              {t.recipients.map(r => <Text key={r}>{r}</Text>)}
          </View>
            <Link
                href={{
                pathname: `/thread/[threadId]`,
                params: { threadId: t.id } }}>
              Open
            </Link>
          </View>
        ))}
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
      marginBottom: 15
  }
});

