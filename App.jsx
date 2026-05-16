import { View, Text, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from './src/navigation/AuthStack'
import MainStack from './src/navigation/MainStack'
import {useDispatch, useSelector} from 'react-redux'
import { colors } from './src/constant'
import auth from '@react-native-firebase/auth'
import {setLoginUser,setLogoutUser} from './src/redux/slice/auth'

const App = () => {
  const [loading,setLoading]=useState(true);
  const dispatch = useDispatch();
  const isLogged = useSelector((state)=>state.auth.isLogged);
  useEffect(()=>{
    const unsubscribe = auth().onAuthStateChanged(user=>{
      if (user) {
        dispatch(setLoginUser(user));
      }else{
        dispatch(setLogoutUser());
      }
      setLoading(false);
    });
    return unsubscribe;
  },[]);

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
        isLogged?
        <MainStack/>
        :
        <AuthStack/>
      }
    </NavigationContainer>
  )
}

export default App