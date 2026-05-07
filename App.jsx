import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from './src/navigation/AuthStack'
import MainTab from './src/navigation/MainTab'
import {useSelector} from 'react-redux'

const App = () => {
  const isLogged = useSelector((state)=>state.auth.isLogged);
  return (
    <NavigationContainer>
      {
        isLogged?
        <MainTab/>
        :
        <AuthStack/>
      }
    </NavigationContainer>
  )
}

export default App