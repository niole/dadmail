import { useEffect, useState } from 'react';
import { Threads } from './Threads';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import 'react-native-gesture-handler';

// TODO this may start with a login screen
export default function App() {
  const [isSigninInProgress, setSigninWip] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<any>();
  useEffect(() => {
    GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
        forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
    });
  });

  async function signIn() {
    try {
      await GoogleSignin.hasPlayServices();
      setUserInfo(await GoogleSignin.signIn());
    } catch (error: any) {
      console.error(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('// user cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('// operation (e.g. sign in) is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('// play services not available or outdated');
      } else {
        console.log('// some other error happened');
      }
    }
  }

  console.log(userInfo);
  return (
    <>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
        disabled={isSigninInProgress}
      />
      <Threads />
    </>
  );
}
