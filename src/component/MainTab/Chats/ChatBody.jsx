import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import VectorIcon from '../../../utils/VectorIcons';
import { colors, fontWeight } from '../../../constant';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { formatTimestamp } from '../../../utils/GetTime';
import { Loader } from '../../../component/MainTab/Chats';
import { getChatDaySeparator } from '../../../utils/GetTime'
import { getStatusIcon } from '../../../utils/GetStatusIcon'

const ChatBody = ({ chatroomId }) => {
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    // console.log("Messages: ",messages);

    const [otherUserName, setOtherUserName] = useState('');
    const [otherUserTyping, setOtherUserTyping] = useState(false);
    const myUid = useSelector(state => state.auth.user.uid);
    const flatListRef = useRef(null);

    const scrollToBottom = () => {
        flatListRef.current?.scrollToEnd({ animated: true });
    };

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

    const DateSeparator = ({ label }) => (
        <View style={styles.dateSeparatorContainer}>
            <Text style={styles.dateText}>
                {label}
            </Text>
        </View>
    );

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
                updateMessageStatus(msgs);
                setLoading(false);
            },
                error => {
                    console.log(error);
                    setLoading(false);
                });

        return () => unsubscribe();
    }, [chatroomId]);

    useEffect(() => {
        const getOtherUser = async () => {
            const chatDoc = await firestore()
                .collection('chats')
                .doc(chatroomId)
                .get();

            const otherUid = chatDoc
                .data()
                ?.participants?.find(
                    uid => uid !== myUid
                );

            if (otherUid) {
                const userDoc = await firestore()
                    .collection('users')
                    .doc(otherUid)
                    .get();

                setOtherUserName(
                    userDoc.data()?.name || 'Other'
                );
            }
        };

        getOtherUser();
    }, [chatroomId, myUid]);

    //typing...
    useEffect(() => {
        const unsubscribe = firestore()
            .collection('chats')
            .doc(chatroomId)
            .onSnapshot(snapshot => {
                const data = snapshot.data();
                const typing = data?.typing || {};

                const otherUid =
                    data?.participants?.find(
                        uid => uid !== myUid
                    );

                setOtherUserTyping(
                    typing[otherUid] === true
                );
            });

        return () => unsubscribe();
    }, [chatroomId, myUid]);


    //delievery status
    const updateMessageStatus = async (msgs) => {
        const batch = firestore().batch();

        msgs.forEach(msg => {
            // Only update messages sent by OTHER user, not mine
            if (msg.senderId === myUid) return;

            if (msg.status === 'sent' || msg.status === 'delivered') {
                const msgRef = firestore()
                    .collection('chats')
                    .doc(chatroomId)
                    .collection('messages')
                    .doc(msg.id);

                // Receiver got the message → delivered
                batch.update(msgRef, { status: 'read' });
            }
        });

        await batch.commit();
    };

    const UserMessageView = ({ message, time, isFirst, isLast, isMiddle, status }) => (
        <View style={styles.userContainer}>
            <View style={styles.userInnerContainer}>
                {isFirst && (
                    <Text style={styles.sender}>You</Text>
                )}
                <Text style={styles.message}>{message}</Text>
                <View style={styles.metaContainer}>
                    <Text style={styles.time}>{time}</Text>
                    <View style={styles.statusIcon}>
                        {getStatusIcon(status)}
                    </View>
                </View>
            </View>
        </View>
    );

    const OtherUserMessageView = ({ message, time, senderName, isFirst, isLast, isMiddle }) => (
        <View style={styles.otherUserContainer}>
            <View style={styles.otherUserInnerContainer}>
                {
                    isFirst &&
                    <Text style={styles.receiver}>{senderName}</Text>
                }
                <Text style={styles.message}>{message}</Text>
                <View style={styles.metaContainer}>
                    <Text style={styles.time}>{time}</Text>
                </View>
            </View>
        </View>
    );

    const renderItem = ({ item, index }) => {
        const time = formatTimestamp(item.timestamp);
        const { isFirst, isLast, isMiddle } = getGroupFlags(index);

        const currentDate = new Date(item.timestamp);
        const previousDate = index > 0
            ? new Date(messages[index - 1].timestamp)
            : null;
        const separatorLabel = getChatDaySeparator(currentDate, previousDate);

        return (
            <>
                {separatorLabel && (
                    <DateSeparator label={separatorLabel} />
                )}
                {
                    item.senderId === myUid ? (
                        <UserMessageView
                            message={item.text}
                            time={time}
                            isFirst={isFirst}
                            isLast={isLast}
                            isMiddle={isMiddle}
                            status={item.status}
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
                    )
                }
            </>
        )
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
            {otherUserTyping && (
                <View style={styles.typingContainer}>
                    <Text style={styles.typingText}>{`${otherUserName} is typing...`}</Text>
                </View>
            )}

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
        // gap: 3
    },

    otherUserInnerContainer: {
        backgroundColor: colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        maxWidth: '80%',
        gap: 3
    },

message: {
    fontSize: 14,
    color: '#000',
    fontWeight: fontWeight.medium,
    lineHeight: 20,
    flexShrink: 1,
},
metaContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 4,
},

    userTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    otherTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
time: {
    fontSize: 10,
    color: 'grey',
    fontWeight: fontWeight.highlight,
},
statusIcon: {
    marginLeft: 4,
    justifyContent: 'center',
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
    },
    dateSeparatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateText: {
        marginHorizontal: 10,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 15,
        backgroundColor: '#F2F4F5',
        color: '#6B7C85',
        fontSize: 12,
    },
    typingContainer: {
        alignItems: 'center'
    },
    typingText: {
        color: 'blue',
        fontWeight: fontWeight.highlight
    }
});

export default ChatBody;