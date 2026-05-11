import { View, Text } from 'react-native'
import React from 'react'
import { ChatHeader,FlatList,TypeBox } from '../../component/MainTab/Chats'

const Chat = () => {
  return (
    <View style={{flex:1}}>
        <ChatHeader/>
        <TypeBox/>
    </View>
  )
}

export default Chat