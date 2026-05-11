import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import {AllUser} from '../screen/AppStack'

const Stack = createStackNavigator();

const AppStack = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen 
            name="AllUserScreen" 
            component={AllUser}
            options={()=>({
                headerShown:false
            })}
        />
      </Stack.Navigator>
  )
}

export default AppStack