import { createContext } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GmailThreadV1 } from '../gapiClient/types';

export type SendStatus = 'sent' | 'sending' | 'failed';

export type SendState = {
  status: SendStatus,
  msg?: string,
};

export type EmailMessage = {
  threadId: string,
  id: string,
  from: string,
  ts: Date,
  content: string,
  sendState: SendState,
}

export type EmailThread = {
  id: string,
  recipients: string[],
  subject: string,
  messages: EmailMessage[]
};

export type User = {
  email: string,
  googleId: string,
};

export type State = {
  user?: User,
  fetchThreadsState?: 'fetching' | 'fetched' | 'failed',
  threads: GmailThreadV1[],
  sendQueue: EmailMessage[],
  actions: any,
};

function initState() {
  const state: State = {
    threads: [],
    sendQueue: [] as EmailMessage[],
    actions: {
      gapi: {
        sendReq: (path: string, moreHeaders: any = {}): Promise<any> => {
          return GoogleSignin.getTokens()
          .then(({ accessToken }) => {
              return fetch(`https://gmail.googleapis.com${path}`, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  ...moreHeaders
                }
              }).then(x => x.json())
              .catch(e => {
                if (e.statusCode === 401) {
                  if (accessToken) {
                    GoogleSignin.clearCachedAccessToken(accessToken);
                  }

                  // trigger UI login flow
                  state.actions.setUser(undefined);
                }
              });
          });
        },

        get: (path: string): Promise<any> => {
          return state.actions.gapi.sendReq(path);
        }
      },

      setUser: (user?: User) => {
        state.user = user;
      },

      addToSendQueue: (s: EmailMessage) => {
        state.sendQueue.push(s);
        state.actions.sendQueuedMessage(s.id);
      },

      sendQueuedMessage: (id: string) => {
        const msg = state.sendQueue.find(e => e.id === id) ?? throw new Error(`Email with id ${id} is not in the send queue.`);
        console.info('Sending queued message. id: ', msg.id, ', date: ', msg.ts);
      }
    }
  };

  return createContext<State>(state);
}

export const GlobalContext = initState();
