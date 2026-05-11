import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import AppStack from './AppStack';
import BottomTab from './BottomTab';

const Stack = createStackNavigator();

const MainStack = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen 
            name="BottomTabs" 
            component={BottomTab} 
            options={()=>({
                headerShown:false
            })}
        />
        <Stack.Screen 
            name="AppStack" 
            component={AppStack} 
            options={()=>({
                headerShown:false
            })}            
        />
      </Stack.Navigator>
  )
}

export default MainStack