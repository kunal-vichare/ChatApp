import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import {AllUser,Chat,StatusScreen} from '../screen/AppStack'
import { colors } from '../constant';

const Stack = createStackNavigator();

const AppStack = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen 
            name="AllUserScreen" 
            component={AllUser}
            options={()=>({
                headerShown:false,
                cardStyle:{backgroundColor:colors.primary}
            })}
        />
        <Stack.Screen 
            name="ChatScreen" 
            component={Chat}
            options={()=>({
                headerShown:false,
            })}
        />
        <Stack.Screen 
            name="StatusScreen" 
            component={StatusScreen}
            options={()=>({
                headerShown:false,
            })}
        />
      </Stack.Navigator>
  )
}

export default AppStack