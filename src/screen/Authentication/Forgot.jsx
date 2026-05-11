import { View, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import { Button, TextInput } from 'react-native-paper'
import {resetPassword} from '../../services/auth'

const Forgot = () => {
  const [email,setEmail]=useState();

  const handleResetPassword = async() => {
    if (!email) {
      Alert.alert("Error","Please enter your email address");
      return;
    }
    try {
      await resetPassword(email);
      Alert.alert('Success','Password reset link has been successfully send to your email address');
      setEmail('');
    } catch (error) {
      Alert.alert("Error",error.message)
    }
  }
  return (
    <View>
      <Text>Forgot Password</Text>
      <Text>Please enter your email to reset the password</Text>
      <Text>Your Email</Text>
      <TextInput
        label="Enter your email"
        mode='outlined'
        value={email}
        onChangeText={(text)=>setEmail(text)}
      />
      <Button 
        icon="lock-reset" 
        mode="contained" 
        onPress={() => handleResetPassword()}
      >
        Reset Password
      </Button>
    </View>
  )
}

export default Forgot