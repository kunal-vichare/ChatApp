import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import {Welcome,Login,Signup,Forgot} from '../screen/Authentication'

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen 
            name="WelcomeScreen" 
            component={Welcome} 
            options={()=>({
                headerShown:false
            })}
        />
        <Stack.Screen 
            name="LoginScreen" 
            component={Login} 
            options={()=>({
                headerShown:false
            })}            
        />
        <Stack.Screen 
            name="SignupScreen" 
            component={Signup}
            options={()=>({
                headerShown:false
            })}             
        />
        <Stack.Screen 
            name="ForgotScreen" 
            component={Forgot} 
            options={()=>({
                headerShown:false
            })}            
        />
      </Stack.Navigator>
  )
}

export default AuthStack