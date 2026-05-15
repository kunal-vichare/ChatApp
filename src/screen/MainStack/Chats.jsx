import { View, Text } from 'react-native'
import React from 'react'
import {Header,Searchbar,Chatlist, FloatingBtn} from '../../component/MainTab/Chats'

const Chats = () => {
  return (
    <View style={{flex:1}}>
      <Header/>
      <Searchbar/>
      <Chatlist/>
      <FloatingBtn/>
    </View>
  )
}

export default Chats