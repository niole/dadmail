import { createContext } from 'react';

export type EmailMessage = {
  id: string,
  from: string,
  ts: Date,
  content: string
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
};

const defaultThreads = [
  {
  id: 'fakeid1',
  recipients: ['cat@gmail.com', 'dog@gmail.com'],
  subject: 'Really long chat',
  messages: [
    { id: '1', from: 'dog@gmail.com', ts: new Date(), content: 'hi'},
    ...Array(20).fill(null).map((x, i) => (
      {
        id: (i+10).toString(), from: 'cat@gmail.com', ts: new Date(), content: 'hi'
      }
    ))
  ]
},
  {
  id: 'fakeid2',
  recipients: ['cat@gmail.com', 'dog@gmail.com'],
  subject: 'short chat',
  messages: [
    { id: '1', from: 'dog@gmail.com', ts: new Date(), content: 'hi'},
    { id: '2', from: 'dog@gmail.com', ts: new Date(), content: 'hi'},
  ]
},
];

export const GlobalContext = createContext<State>({
  user: {
    email: 'cat@gmail.com',
  },
  threads: defaultThreads
});
