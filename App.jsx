import { View, Text, StatusBar } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from './src/navigation/AuthStack'
import MainStack from './src/navigation/MainStack'
import {useSelector} from 'react-redux'
import { colors } from './src/constant'

const App = () => {
  const isLogged = useSelector((state)=>state.auth.isLogged);
  return (
    <NavigationContainer>
      <StatusBar 
        backgroundColor={colors.primary}
        barStyle="dark-content" 
      />
      {
        !isLogged?
        <MainStack/>
        :
        <AuthStack/>
      }
    </NavigationContainer>
  )
}

export default App