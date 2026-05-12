import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Chats,Status,Calls,Community} from '../screen/MainStack'
import Icon from 'react-native-vector-icons/Ionicons'
import { borderWidth, colors, fontFamily, fontSize, fontWeight, margin, padding } from '../constant';
import VectorIcon from '../utils/VectorIcons';

const Tab = createBottomTabNavigator();

const BottomTab = () => {
    const getTabBarIcon = (routeName, focused, color, size) => {
    let iconName;
    // console.log(routeName,focused,color,size);
    
    if (routeName === 'ChatsScreen') {
      iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'
    }
    else if (routeName === 'CommunityScreen') {
      iconName = focused ? 'people' : 'people-outline'
    }
    else if (routeName === 'StatusScreen') {
      iconName = focused ? 'people' : 'people-outline'
    }
    else if (routeName === 'CallsScreen') {
      iconName = focused ? 'call' : 'call-outline'
    }
    return <Icon name={iconName} size={24} color={color}/>
  }

  return (
    <Tab.Navigator       
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) =>
        getTabBarIcon(route.name, focused, color, size),
        headerShown:false,

        tabBarActiveTintColor: colors.activeTab,
        tabBarInactiveTintColor: colors.inactiveTab,

        tabBarStyle: { 
          backgroundColor: colors.primary, 
          borderTopWidth:borderWidth.one,
          height: 70,
          paddingBottom: padding.xxs,
        },

        tabBarItemStyle:{
          justifyContent: 'center',
          alignItems: 'center',
        },

        tabBarLabelStyle: {
          fontWeight:fontWeight.bold,
          fontFamily:fontFamily.popinsBold,
          fontSize:fontSize.base,
        },
        tabBarIconStyle:{
          marginBottom:margin.xxxs
        },
        sceneStyle: { backgroundColor: colors.primary } 
      })}>

      <Tab.Screen 
      name="ChatsScreen" 
      component={Chats} 
      options={{ 
        tabBarLabel: 'Chats'
      }} 
      />
      <Tab.Screen 
      name="StatusScreen" 
      component={Status} 
      options={{ 
        tabBarLabel: 'Status'
      }} 
      />
      <Tab.Screen 
      name="CommunityScreen" 
      component={Community} 
      options={{ 
        tabBarLabel: 'Community',
      }} 
      />
      <Tab.Screen 
      name="CallsScreen" 
      component={Calls} 
      options={{ 
        tabBarLabel: 'Calls'
      }} 
      />
    </Tab.Navigator>
  )
}

export default BottomTab