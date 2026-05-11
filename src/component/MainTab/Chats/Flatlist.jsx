import { View, Text,FlatList } from 'react-native'
import React from 'react'
import {FlatlistRender} from '../../../component/MainTab/Chats'
import Lock from 'react-native-vector-icons/Fontisto'

const Flatlist = () => {
  const DATA = [
  { id: '1', title: 'First Item' },
  { id: '2', title: 'Second Item' },
  { id: '3', title: 'First Item' },
  { id: '4', title: 'Second Item' },
  { id: '5', title: 'First Item' },
  { id: '6', title: 'Second Item' },
  { id: '7', title: 'First Item' },
  { id: '8', title: 'Second Item' },
  { id: '9', title: 'First Item' },
  { id: '10', title: 'Second Item' },
  { id: '11', title: 'First Item' },
  { id: '12', title: 'Second Item' },
  { id: '13', title: 'First Item' },
  { id: '14', title: 'Second Item' },
  { id: '15', title: 'First Item' },
  { id: '16', title: 'Second Item' },
  { id: '17', title: 'First Item' },
  { id: '18', title: 'Second Item' },
  { id: '19', title: 'First Item' },
  { id: '20', title: 'Second Item' },
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
          <Text>
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