import React, { useState, useEffect, useContext } from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { View } from 'react-native';
import { GlobalContext } from '../state';

/**
 * There is a UI cmponent that will check to see if the user is logged in and then redirects the user to a log in
 * screen if they are not, then once they are logged in, we save their access token in global state
 */

export type AuthSessionProps = {
    children: JSX.Element | JSX.Element[]
};

function AuthSession(props: AuthSessionProps) {
    const [isSigninInProgress, setSigninWip] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<any>();
    const state = useContext(GlobalContext);

    useEffect(() => {
        if (!state.user && userInfo) {
            setUserInfo(undefined);
        }
    }, [state.user, userInfo]);

    useEffect(() => {
        GoogleSignin.configure({
            scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
            forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
        });

        GoogleSignin.getCurrentUser()
        .then(currentUser => {
            if (currentUser) {
                setUserInfo(currentUser);
                state.actions.setUser({
                    email: currentUser.user.email,
                    googleId: currentUser.user.id,
                });
            }
        })
        .catch(e => {
            console.warn('Failed to get current user:', e);
            setUserInfo(undefined);
        });
    }, []);

    async function signIn() {
        try {
            await GoogleSignin.hasPlayServices();
            const currentUser = await GoogleSignin.signIn();
            setUserInfo(currentUser);
            state.actions.setUser({
                email: currentUser.user.email,
                googleId: currentUser.user.id,
            });
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

    if (!userInfo) {
        // login screen
        return (
            <View>
                <GoogleSigninButton
                    size={GoogleSigninButton.Size.Wide}
                    color={GoogleSigninButton.Color.Dark}
                    onPress={signIn}
                    disabled={isSigninInProgress}
                />
            </View>
        );
    }
    return props.children;
}

export default AuthSession;
