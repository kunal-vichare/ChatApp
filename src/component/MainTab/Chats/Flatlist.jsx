import { View, Text,FlatList } from 'react-native'
import React from 'react'
import {FlatlistRender} from '../../../component/MainTab/Chats'
import Lock from 'react-native-vector-icons/Fontisto'
import { colors } from '../../../constant'

const Flatlist = () => {
  const DATA = [
  { id: '1', title: 'First Item' },
  { id: '2', title: 'Second Item' },
];
  return (
    <View>
    <FlatList
        data={DATA}
        renderItem={({ item }) => (
          <FlatlistRender item={item}/>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{paddingBottom:200}}
        ListFooterComponent={
        <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
          <Lock name="locked" size={13} />
          <Text style={{color:colors.textGrey}}>
            Your personal message are end-to-end-encrypted
          </Text>
        </View>
        }
        ListFooterComponentStyle={{alignItems:'center'}}
      />
    </View>
  )
}

export default Flatlist