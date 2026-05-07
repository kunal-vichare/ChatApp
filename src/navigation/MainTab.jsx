import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Chats,Updates,Calls} from '../screen/MainTab'

const Tab = createBottomTabNavigator();

const MainTab = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="ChatsScreen" component={Chats} />
      <Tab.Screen name="UpdatesScreen" component={Updates} />
      <Tab.Screen name="CallsScreen" component={Calls} />
    </Tab.Navigator>
  )
}

export default MainTab