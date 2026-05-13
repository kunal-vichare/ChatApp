import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import {Welcome,Login,Signup,Forgot} from '../screen/Authentication'
import { colors } from '../constant';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen 
            name="WelcomeScreen" 
            component={Welcome} 
            options={()=>({
                headerShown:false,
                cardStyle:{backgroundColor:colors.primary}
            })}
        />
        <Stack.Screen 
            name="LoginScreen" 
            component={Login} 
            options={()=>({
                headerShown:false,
                cardStyle:{backgroundColor:colors.primary}
            })}        
        />
        <Stack.Screen 
            name="SignupScreen" 
            component={Signup}
            options={()=>({
                headerShown:false,
                cardStyle:{backgroundColor:colors.primary}
            })}        
        />
        <Stack.Screen 
            name="ForgotScreen" 
            component={Forgot} 
            options={()=>({
                headerShown:false,
                cardStyle:{backgroundColor:colors.primary}
            })}        
        />
      </Stack.Navigator>
  )
}

export default AuthStack