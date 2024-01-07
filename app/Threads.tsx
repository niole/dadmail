import { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { GlobalContext } from './state';

type GmailMessageSummary = {
  id: string,
  threadId: string
};
type GmailInboxState = {
  nextPageToken: string,
  resultSizeEstimate: number,
  messages: GmailMessageSummary[]
};

export function Threads() {
  const [inbox, setInbox] = useState<GmailInboxState | undefined>();
  const state = useContext(GlobalContext);

  useEffect(() => {
    if (!inbox && state.user) {
      state.actions.gapi.get(`/gmail/v1/users/${state.user.googleId}/messages`)
      .then((x: GmailInboxState) => {
        console.log(x);
        setInbox(x);
      })
      .catch((e: any) => console.error('Failure happened when getting inbox state:', e));
    }
  }, [state, state.user, inbox]);


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

