import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatlistRender } from '.'
import Lock from 'react-native-vector-icons/Fontisto'
import { colors } from '../../../constant'
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux'
import {formatTimestamp} from '../../../utils/GetTime'

const Clatlist = () => {

  const [chatList, setChatList] = useState([]);
  const myUid = useSelector(state => state.auth.user.uid);

  console.log("chatList: ", chatList);

  useEffect(() => {

    const unsubscribe = firestore()
      .collection('chats')
      .where('participants', 'array-contains', myUid)
      .onSnapshot(async snapshot => {

        try {

          const chatData = await Promise.all(
            snapshot.docs.map(async chatDoc => {

              const data = chatDoc.data();
              
              const otherUserUid = data.participants.find(
                uid => uid !== myUid
              );

              const userDoc = await firestore()
                .collection('users')
                .doc(otherUserUid)
                .get();

              const userData = userDoc.data();

              return {
                chatId: chatDoc.id,
                id: userData?.uid,
                name: userData?.name,
                profileImage: userData?.profileImage,
                lastSeen: userData?.lastSeen,
                lastMessage : data?.lastMessage,
                updatedAt: formatTimestamp(data?.updatedAt)
              };

            })
          );

          setChatList(chatData);

        } catch (error) {
          console.log(error);
        }

      });

    return () => unsubscribe();

  }, [myUid]);

  return (
    <View>

      <FlatList
        data={chatList}
        renderItem={({ item }) => (
          <FlatlistRender item={item} />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 200 }}
        ListFooterComponent={
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Lock name="locked" size={13} color={colors.textGrey}/>
            <Text style={{ color: colors.textGrey }}>
              Your personal message are end-to-end-encrypted
            </Text>
          </View>
        }
        ListFooterComponentStyle={{ alignItems: 'center' }}
      />

    </View>
  )
}

export default Clatlist