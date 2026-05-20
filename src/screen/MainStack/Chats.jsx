import { View, Text } from 'react-native'
import React, { useState } from 'react'
import {Header,Searchbar,Chatlist, FloatingBtn} from '../../component/MainTab/Chats'

const Chats = () => {
  const [chatroomSearch,setChatroomSearch]=useState("");
  return (
    <View style={{flex:1}}>
      <Header/>
      <Searchbar 
      value={chatroomSearch}
      onSearch={setChatroomSearch}
      placeholder="Ask Meta AI or Search"
      />
      <Chatlist search={chatroomSearch}/>
      <FloatingBtn/>
    </View>
  )
}

export default Chats