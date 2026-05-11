import { View, Text } from 'react-native'
import React from 'react'
import {Header,Searchbar,FlatList, FloatingBtn} from '../../component/MainTab/Chats'

const Chats = () => {
  return (
    <View style={{flex:1}}>
      <Header/>
      <Searchbar/>
      <FlatList/>
      <FloatingBtn/>
    </View>
  )
}

export default Chats