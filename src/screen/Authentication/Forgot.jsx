import { View, Text } from 'react-native'
import React from 'react'
import { Button, TextInput } from 'react-native-paper'

const Forgot = () => {
  return (
    <View>
      <Text>Forgot Password</Text>
      <Text>Please enter your email to reset the password</Text>
      <Text>Your Email</Text>
      <TextInput
        label="Enter your email"
        mode='outlined'
      />
      <Button 
        icon="lock-reset" 
        mode="contained" 
        onPress={() => console.log('Pressed')}
      >
        Reset Password
      </Button>
    </View>
  )
}

export default Forgot