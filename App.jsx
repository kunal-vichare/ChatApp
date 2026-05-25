import { View, Text, StatusBar, AppState } from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import MainStack from './src/navigation/MainStack';
import { useDispatch, useSelector } from 'react-redux';
import { colors } from './src/constant';
import auth from '@react-native-firebase/auth';
import { setLoginUser, setLogoutUser } from './src/redux/slice/auth';
import firestore from '@react-native-firebase/firestore';
import BootSplash from 'react-native-bootsplash';
import { Loader } from './src/component/MainTab/Chats';
import {markAllDelivered} from './src/database/firestoreCRUD'
import Toast from 'react-native-toast-message';

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const isLogged = useSelector(state => state.auth.isLogged);
  const myUid = useSelector(state => state.auth.user?.uid);

  //auth state handle
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      // console.log("user",user);
      
      try {
        if (user && user.emailVerified) {
          const userDoc = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();

          const firestoreName = userDoc.data()?.name || '';

          dispatch(
            setLoginUser({
              uid: user.uid,
              email: user.email,
              emailVerified: user.emailVerified,
              name: firestoreName,
            }),
          );

        } else {
          const currentUser = auth().currentUser;

          if (currentUser?.uid) {
            await firestore()
              .collection('users')
              .doc(currentUser.uid)
              .update({
                isOnline: false,
                lastSeen: Date.now(),
              });
          }
          dispatch(setLogoutUser());
        }
      } catch (error) {
        console.log('Auth/Firestore error:', error);
      } finally {
        setLoading(false);
        BootSplash.hide({ fade: true });
      }
    });
    return unsubscribe;
  }, []);

  //app state tracking
  useEffect(() => {
    if (!myUid) return; //dont create user if uid not exist

    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        try {
          //app open in foreground
          if (nextAppState === 'active') {
            await firestore()
              .collection('users')
              .doc(myUid)
              .update({
                isOnline: true,
              });
              await markAllDelivered(myUid);
          }

          //app in background/close/inactive
          else {
            await firestore()
              .collection('users')
              .doc(myUid)
              .update({
                isOnline: false,
                lastSeen: Date.now(),
              });
          }
        } catch (error) {
          console.log('AppState update error:', error);
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [myUid]);

  if (loading) {
    return <Loader/>;
  }

  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={colors.primary}
        barStyle="dark-content"
      />
      {isLogged ? <MainStack /> : <AuthStack />}
      <Toast />
    </NavigationContainer>
  );
};

export default App;