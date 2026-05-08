import { View, Text } from 'react-native'
import React from 'react'
import {Header,Searchbar,FlatList} from '../../component/MainTab/Chats'

const Chats = () => {
  return (
    <View>
      <Header/>
      <Searchbar/>
      {/* <FlatList/> */}
    </View>
  )
}

export default Chats