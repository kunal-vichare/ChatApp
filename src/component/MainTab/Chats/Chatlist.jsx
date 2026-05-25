import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { FlatlistRender } from '.'
import Lock from 'react-native-vector-icons/Fontisto'
import { colors, fontFamily, fontWeight } from '../../../constant'
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux'
import { formatTimestamp } from '../../../utils/GetTime'
import VectorIcon from '../../../utils/VectorIcons'
import { Loader } from '../../../component/MainTab/Chats'
import useColors from '../../../hook/useColors'
import { markAllDelivered } from '../../../database/firestoreCRUD'
import { useFocusEffect } from '@react-navigation/native'

const Chatlist = ({ search }) => {
  const colors = useColors();
  const styles = createStyles(colors);

  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const myUid = useSelector(state => state.auth.user.uid);

  useEffect(() => {
    const unsubscribers = [];

    //chat collection
    const unsubscribeChats = firestore()
      .collection('chats')
      .where('participants', 'array-contains', myUid)
      .onSnapshot(snapshot => {

        snapshot.docs.forEach(chatDoc => {
          const data = chatDoc.data();
          const chatId = chatDoc.id;
          const otherUid = data.participants.find(uid => uid !== myUid);

          //userDoc for each chat
          const unsubscribeUser = firestore()
            .collection('users')
            .doc(otherUid)
            .onSnapshot(userDoc => {
              const userData = userDoc.data();
              // Update only this specific chat in state
              setChatList(prev => {
                const existingIndex = prev.findIndex(
                  c => c.chatId === chatId
                );

                const updatedChat = {
                  chatId,
                  id: userData?.uid,
                  name: userData?.name,
                  profileImage: userData?.profileImage,
                  lastSeen: userData?.lastSeen,
                  isOnline: userData?.isOnline,
                  lastMessage: data?.lastMessage,
                  lastMessageStatus: data?.lastMessageStatus,
                  lastMessageSenderId: data?.lastMessageSenderId,
                  typing: data?.typing,
                  updatedAt: formatTimestamp(data?.updatedAt),
                  unreadCount: data?.unreadCount?.[myUid] || 0,
                };

                if (existingIndex !== -1) {
                  const updated = [...prev];
                  updated[existingIndex] = updatedChat;
                  return updated;
                } else {
                  return [...prev, updatedChat];
                }
              });
              setLoading(false);
            });
          unsubscribers.push(unsubscribeUser);
        });


        // Handle empty snapshot
        if (snapshot.empty) {
          setLoading(false);
        }
      });

    unsubscribers.push(unsubscribeChats);

    // Cleanup ALL listeners on unmount
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };

  }, [myUid]);

  const getAlldelivered = (myUid) => {
    markAllDelivered(myUid)
  }

  useEffect(() => {
    getAlldelivered(myUid)
  }, [chatList])

  // Sort by latest message
  const sortedList = [...chatList].sort((a, b) => {
    if (!a.updatedAt) return 1;
    if (!b.updatedAt) return -1;
    return b.updatedAt - a.updatedAt;
  });

  // Search filter
  const finalData = sortedList.filter(item =>
    item?.name?.toLowerCase().includes(search?.toLowerCase() || '')
  );

  return (
    <View style={styles.container}>

      {
        loading ?
          <Loader />
          :
          <FlatList
            data={finalData}
            renderItem={({ item }) => (
              <FlatlistRender item={item} />
            )}
            keyExtractor={item => item.chatId}
            contentContainerStyle={{ paddingBottom: 200 }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Chat Room is empty</Text>
                <Text style={styles.emptyText}>Go to all users to create Chat Room</Text>
              </View>
            }
            ListFooterComponent={finalData.length > 0 ?
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
      }


    </View>
  )
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    backgroundColor: colors.bg
  },
  emptyContainer: {
    // flexDirection: 'row',
    alignSelf: 'center',
    gap: 3,
    marginTop: '50%'
  },
  emptyText: {
    color: colors.textGrey,
    fontFamily: fontFamily.popinsBold,
    fontWeight: fontWeight.bold,
    textAlign: 'center'
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.bg
  },
  footerText: {
    color: colors.textGrey
  }
})

export default Chatlist