import { useState, useEffect, useContext } from 'react';
import { StyleSheet, FlatList, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { GlobalContext } from './state';
import { GmailThreadV1, GmailThreadsV1 } from './gapiClient/types';
import { FROM_EMAILS, getFromQueryParam } from './util';

export function Threads() {
  const state = useContext(GlobalContext);

  useEffect(() => {
    if (!state.fetchThreadsState && state.user) {
      // get threads
      state.fetchThreadsState = 'fetching';
      const url = `/gmail/v1/users/${state.user.googleId}/threads?q="${getFromQueryParam(FROM_EMAILS[0])}"`;
      state.actions.gapi.get(url)
      .then((x: GmailThreadsV1) => {
        state.fetchThreadsState = 'fetched';
        state.threads = x.threads;
      })
      .catch((e: any) => {
        state.fetchThreadsState = 'failed';
        console.error('Failure happened when getting inbox state:', e)
      });
    }
  }, [state, state.user, state.fetchThreadsState]);

  return (
    <View style={styles.container}>
      <FlatList
        data={state.threads.map((m: GmailThreadV1) => ({ ...m, title: m.snippet, key: m.id }))}
        renderItem={({ item }) => (
          <View style={styles.threadBox}>
            <Text style={styles.threadSummary}>{item.title}</Text>
            <Link
                style={styles.openLink}
                href={{
                pathname: `/thread/[threadId]`,
                params: { threadId: item.id } }}>
              Open
          </Link>
        </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  threadSummary: {
    fontSize: 18
  },
  openLink: {
    backgroundColor: 'sienna',
    color: 'mintcream',
    padding: 5,
    textAlign: 'center',
    marginTop: 10
  },
  threadBox: {
    backgroundColor: 'white',
    margin: 10,
    padding: 5,
    borderRadius: 5,
  },
  container: {
    flex: 1,
    backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
      marginBottom: 15
  }
});

