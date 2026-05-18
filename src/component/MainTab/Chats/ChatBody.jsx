import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import VectorIcon from '../../../utils/VectorIcons';
import { colors, fontWeight } from '../../../constant';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { formatTimestamp } from '../../../utils/GetTime';
import { Loader } from '../../../component/MainTab/Chats'

const ChatBody = ({ chatroomId }) => {
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const myUid = useSelector(state => state.auth.user.uid);
    const myName = useSelector(state => state.auth.user.name);

    //Message grouping
    const getGroupFlags = (index) => {
        const item = messages[index];
        const prevMsg = messages[index - 1];
        const nextMsg = messages[index + 1];

        const isFirst = !prevMsg || prevMsg.senderId !== item.senderId;
        const isLast = !nextMsg || nextMsg.senderId !== item.senderId;
        const isMiddle = !isFirst && !isLast;
        return { isFirst, isLast, isMiddle };
    }

    const flatListRef = useRef(null);

    const scrollToBottom = () => {
        flatListRef.current?.scrollToEnd({ animated: true });
    };

    useEffect(() => {
        setLoading(true);
        const unsubscribe = firestore()
            .collection('chats')
            .doc(chatroomId)
            .collection('messages')
            .orderBy('timestamp')
            .onSnapshot(snapshot => {
                const msgs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setMessages(msgs);
                setLoading(false);
            },
                error => {
                    console.log(error);
                    setLoading(false);
                });

        return () => unsubscribe();
    }, [chatroomId]);

    const UserMessageView = ({ message, time, isFirst, isLast, isMiddle }) => (
        <View style={styles.userContainer}>
            <View style={styles.userInnerContainer}>
                {isFirst && (
                    <Text style={styles.sender}>You</Text>
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.message}>{message}</Text>
                    <Text style={styles.time}>{time}</Text>
                    <VectorIcon
                        name="checkmark-done-sharp"
                        type="Ionicons"
                        color={colors.blue}
                        size={15}
                        style={styles.doubleCheck}
                    />
                </View>
            </View>
        </View>
    );

    const OtherUserMessageView = ({ message, time, senderName, isFirst, isLast, isMiddle }) => (
        <View style={styles.otherUserContainer}>
            <View style={styles.otherUserInnerContainer}>
                <Text style={styles.receiver}>{senderName}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                    <Text style={styles.message}>{message}</Text>
                    <Text style={styles.time}>{time}</Text>
                </View>
            </View>
        </View>
    );

    const renderItem = ({ item, index }) => {
        const time = formatTimestamp(item.timestamp);
        const { isFirst, isLast, isMiddle } = getGroupFlags(index);

        return item.senderId === myUid ? (
            <UserMessageView
                message={item.text}
                time={time}
                isFirst={isFirst}
                isLast={isLast}
                isMiddle={isMiddle}
            />
        ) : (
            <OtherUserMessageView
                message={item.text}
                time={time}
                senderName={item.senderName}
                isFirst={isFirst}
                isLast={isLast}
                isMiddle={isMiddle}
            />
        );
    };

    return (
        <View style={{ flex: 1 }}>
            {
                loading ?
                    <Loader />
                    :
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingVertical: 10,
                        }}
                        onContentSizeChange={scrollToBottom}
                        onLayout={scrollToBottom}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>
                                    <VectorIcon
                                        type="Fontisto"
                                        name='locked'
                                        size={13}
                                        color={colors.textGrey}
                                    />
                                    {"\u00A0"} Message and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them. <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Team ChatMate</Text>
                                </Text>
                            </View>
                        }
                    />
            }

            <TouchableOpacity
                style={styles.scrollDownArrow}
                onPress={scrollToBottom}
            >
                <VectorIcon
                    name="angle-double-down"
                    type="FontAwesome5"
                    size={25}
                    color={colors.secondary}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    userContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 5,
        paddingHorizontal: 10,
    },

    otherUserContainer: {
        flexDirection: 'row',
        marginVertical: 5,
        paddingHorizontal: 10,
    },

    userInnerContainer: {
        backgroundColor: colors.userMsg,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderTopLeftRadius: 30,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        // flexDirection: 'row',
        // alignItems: 'flex-end',
        maxWidth: '80%',
        gap: 3
    },

    otherUserInnerContainer: {
        backgroundColor: colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        // flexDirection: 'row',
        // alignItems: 'flex-end',
        maxWidth: '80%',
        gap: 3
    },

    message: {
        fontSize: 13,
        color: colors.white,
    },

    time: {
        fontSize: 9,
        color: colors.white,
        marginLeft: 5,
    },

    doubleCheck: {
        marginLeft: 5,
    },

    scrollDownArrow: {
        position: 'absolute',
        backgroundColor: colors.primary,
        borderRadius: 50,
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 20,
        right: 20,
        opacity: 0.5
    },
    emptyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#c4c5bc',
        marginHorizontal: 40,
        borderRadius: 15,
        padding: 10
    },
    emptyText: {
        textAlign: 'center'
    },
    sender: {
        color: 'blue',
        fontWeight: fontWeight.highlight,
    },
    receiver: {
        color: 'red',
        fontWeight: fontWeight.highlight,
    }
});

export default ChatBody;