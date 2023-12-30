import { createContext } from 'react';

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
};

export type State = {
  user: User,
  threads: EmailThread[],
  sendQueue: EmailMessage[],
  actions: any,
};

const defaultThreads = [
  {
  id: 'fakeid1',
  recipients: ['cat@gmail.com', 'dog@gmail.com'],
  subject: 'Really long chat',
  messages: [
    { threadId: 'fakeid1', id: '1', from: 'dog@gmail.com', ts: new Date(), content: 'hi', sendState: { status: 'sent' }},
    ...Array(20).fill(null).map((x, i) => (
      {
        threadId: 'fakeid1', id: (i+10).toString(), sendState: { status: 'sent' }, from: 'cat@gmail.com', ts: new Date(), content: 'hi'
      }
    ))
  ]
},
  {
  id: 'fakeid2',
  recipients: ['cat@gmail.com', 'dog@gmail.com'],
  subject: 'short chat',
  messages: [
    { threadId: 'fakeid2', sendState: {status: 'sent'}, id: '1', from: 'dog@gmail.com', ts: new Date(), content: 'hi'},
  ]
},
];

function initState() {
  const state = {
    user: {
      email: 'cat@gmail.com',
    },
    threads: defaultThreads,
    sendQueue: [] as EmailMessage[],
    actions: {
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
