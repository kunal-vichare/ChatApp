import { View, Text, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatlistRender } from '.'
import Lock from 'react-native-vector-icons/Fontisto'
import { colors, fontFamily, fontWeight } from '../../../constant'
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux'
import {formatTimestamp} from '../../../utils/GetTime'
import VectorIcon from '../../../utils/VectorIcons'

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
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Chat Room is empty</Text>
            <Text style={styles.emptyText}>Go to all users to create Chat Room</Text>
          </View>
        }
        ListFooterComponent={ chatList.length > 0 ?
          <View style={styles.footerContainer}>
            <VectorIcon 
              type="Fontisto"
              name='locked'
              size={13}
              color={colors.textGrey}
            />
            <Text style={styles.footerText}>
              Your personal message are end-to-end-encrypted
            </Text>
          </View> : null
        }
        ListFooterComponentStyle={{ alignItems: 'center' }}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  emptyContainer:{
    // flexDirection: 'row',
    alignSelf: 'center',
    gap: 3,
    marginTop:'50%'
  },
  emptyText:{
    color: colors.textGrey,
    fontFamily:fontFamily.popinsBold,
    fontWeight:fontWeight.bold,
    textAlign:'center'
  },
  footerContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5
  },
  footerText:{
    color: colors.textGrey
  }
})

export default Clatlist