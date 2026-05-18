import { View, Text } from 'react-native'
import React, { useState } from 'react'
import {Header,Searchbar,Chatlist, FloatingBtn} from '../../component/MainTab/Chats'

const Chats = () => {
  const [search,setSearch]=useState("");
  return (
    <View style={{flex:1}}>
      <Header/>
      <Searchbar setSearch={setSearch}/>
      <Chatlist search={search}/>
      <FloatingBtn/>
    </View>
  )
}

export default Chats