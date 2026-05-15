import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import VectorIcon from '../../../utils/VectorIcons';
import { colors } from '../../../constant';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import {formatTimestamp} from '../../../utils/GetTime'

const ChatBody = ({ chatroomId }) => {
    const myUid = useSelector(state => state.auth.user.uid);
    const [messages, setMessages] = useState([]);
    console.log("All messages are: ", messages);


    const scrollViewRef = useRef();
    const scrollToBottom = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true })
    }

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('chats')
            .doc(chatroomId)
            .collection('messages')
            .orderBy('timestamp')
            .onSnapshot(snapshot => {
                const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMessages(msgs);
            });
        return () => unsubscribe(); // cleanup on unmount
    }, [chatroomId]);

    const UserMessageView = ({ message, time }) => {
        return (
            <View style={styles.userContainer}>
                <View style={styles.userInnerContainer}>
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
        );
    };

    const OtherUserMessageView = ({ message, time }) => {
        return (
            <View style={styles.otherUserContainer}>
                <View style={styles.otherUserInnerContainer}>
                    <Text style={styles.message}>{message}</Text>
                    <Text style={styles.time}>{time}</Text>
                </View>
            </View>
        );
    };

    return (
        <>
            <ScrollView
                ref={scrollViewRef}
                onContentSizeChange={scrollToBottom}
                showsVerticalScrollIndicator={false}
            >
                <View>
                    {
                        messages.map((item) => (
                            item.senderId === myUid ?
                                <View key={item.id}>
                                    <UserMessageView message={item.text} time={formatTimestamp(item.timestamp)} />
                                </View>
                                :
                                <View key={item.id}>
                                    <OtherUserMessageView message={item.text} time={formatTimestamp(item.timestamp)} />
                                </View>
                        ))
                    }
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.scrollDownArrow}>
                <VectorIcon
                    name="angle-double-down"
                    type="FontAwesome5"
                    size={25}
                    color={colors.secondary}
                    onPress={scrollToBottom}
                />
            </TouchableOpacity>
        </>
    );
};

const styles = StyleSheet.create({
    userContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 5,
    },
    otherUserContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    userInnerContainer: {
        backgroundColor: colors.userMsg,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderTopLeftRadius: 30,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        flexDirection: 'row',
        alignItems: 'flex-end',
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
    otherUserInnerContainer: {
        backgroundColor: colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    scrollDownArrow: {
        position: 'absolute',
        backgroundColor: colors.primary,
        borderRadius: 50,
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 80,
        opacity: 0.8,
        right: 20
    },
    scrollIcon: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
});

export default ChatBody;