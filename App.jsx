import { View, Text, StatusBar, AppState } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from './src/navigation/AuthStack'
import MainStack from './src/navigation/MainStack'
import { useDispatch, useSelector } from 'react-redux'
import { colors } from './src/constant'
import auth from '@react-native-firebase/auth'
import { setLoginUser, setLogoutUser } from './src/redux/slice/auth'

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userRedux = useSelector((state) => state.auth.user);
  const isLogged = useSelector((state) => state.auth.isLogged);
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      console.log("firebase user:", user);
      if (user) {
        dispatch(setLoginUser({
          uid: user.uid,
          email: user.email,
          // emailVerified:
          //   user.emailVerified,
          // name:
          //   user.name || '',
        }));
        console.log("User data in redux: ",userRedux);
        
      } else {
        dispatch(setLogoutUser());
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  //   useEffect(() => {
  //   const subscription =
  //     AppState.addEventListener(
  //       'change',
  //       async state => {
  //         if (state === 'active') {
  //           await firestore()
  //             .collection('users')
  //             .doc(myUid)
  //             .update({
  //               isOnline: true,
  //             });
  //         } else {
  //           await firestore()
  //             .collection('users')
  //             .doc(myUid)
  //             .update({
  //               isOnline: false,
  //             });
  //         }
  //       }
  //     );

  //   return () => subscription.remove();
  // }, []);

  if (loading) {
    return null;
  }
  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={colors.primary}
        barStyle="dark-content"
      />
      {
        isLogged ?
          <MainStack />
          :
          <AuthStack />
      }
    </NavigationContainer>
  )
}

export default App