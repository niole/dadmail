import 'react-native-gesture-handler';
import { Threads } from './Threads';
import AuthSession from './gapiClient';

export default function App() {
  return (
    <AuthSession>
      <Threads />
    </AuthSession>
  );
}
