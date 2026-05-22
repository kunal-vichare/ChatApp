import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import VectorIcon from '../../../utils/VectorIcons';
import { colors, fontWeight } from '../../../constant';
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';
import { formatTimestamp } from '../../../utils/GetTime';
import { Loader } from '../../../component/MainTab/Chats';
import { getChatDaySeparator } from '../../../utils/GetTime'
import { getStatusIcon } from '../../../utils/GetStatusIcon';
import { fetchMoreMessages, getOtherUserName, sendMessage, subscribeToMessages, subscribeToTyping, updateMessageStatus } from '../../../database/firestoreCRUD';
import { FailedMessage } from '../../../component/MainTab/Chats';

const ChatBody = ({ chatroomId, failedMessages, setFailedMessages, otherUserId, localMessages }) => {
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [lastDoc, setLastDoc] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [showScrollToEnd, setShowScrollToEnd] = useState(false);
    const [retrying, setRetrying] = useState(false);
    const [otherUserName, setOtherUserName] = useState('');
    const [otherUserTyping, setOtherUserTyping] = useState(false);

    const myUid = useSelector(state => state.auth.user.uid);
    const myName = useSelector((state) => state.auth.user.name);

    const allMessages = [...localMessages, ...messages];
    const flatListRef = useRef(null);
    const PAGE_SIZE = 10;

    const scrollToBottom = () => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    //Message grouping
    const getGroupFlags = (index) => {
        const item = allMessages[index];
        const prevMsg = allMessages[index + 1];
        const nextMsg = allMessages[index - 1];

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

    // Fetch more (pagination)
    const handleFetchMore = async () => {
        if (loadingMore || !hasMore || !lastDoc) return;
        setLoadingMore(true);
        try {
            const { msgs, newLastDoc, hasMore: more } = await fetchMoreMessages(chatroomId, lastDoc, PAGE_SIZE);
            if (msgs.length === 0) { setHasMore(false); return; }
            setMessages(prev => [...prev, ...msgs]);
            setLastDoc(newLastDoc);
            setHasMore(more);
        } catch (error) {
            console.log('fetchMore error:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    // Messages listener
    useEffect(() => {
        setLoading(true);
        const unsubscribe = subscribeToMessages(
            chatroomId,
            PAGE_SIZE,
            ({ msgs, lastDoc: newLastDoc, hasMore: newHasMore }) => {
                setMessages(msgs);
                setLastDoc(newLastDoc);
                setHasMore(newHasMore);
                updateMessageStatus(chatroomId, msgs, myUid);
                setLoading(false);
            },
            (error) => {
                console.log(error);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, [chatroomId]);

    // Other user's name
    useEffect(() => {
        getOtherUserName(chatroomId, myUid).then(setOtherUserName);
    }, [chatroomId, myUid]);

    // Typing indicator
    useEffect(() => {
        const unsubscribe = subscribeToTyping(chatroomId, myUid, setOtherUserTyping);
        return () => unsubscribe();
    }, [chatroomId, myUid]);

    const handleRetry = async (failedMsg) => {
        setRetrying(true);
        try {
            await sendMessage(
                chatroomId,
                failedMsg.text,
                myUid,
                myName,
                otherUserId
            );

            // Success — remove from failed list
            setFailedMessages(prev =>
                prev.filter(m => m.id !== failedMsg.id)
            );

        } catch (error) {
            console.log('retry failed:', error);
        } finally {
            setRetrying(false);
        }
    };

    const UserMessageView = ({ message, time, isFirst, isLast, isMiddle, status }) => (
        <View style={styles.userContainer}>
            <View style={styles.userInnerContainer}>
                {isFirst && (
                    <Text style={styles.sender}>You</Text>
                )}
                <Text style={styles.message}>{message}</Text>
                <View style={styles.metaContainer}>
                    <Text style={styles.time}>{status !== 'pending' ? time : null}</Text>
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
        // console.log("item: ",item);

        const time = formatTimestamp(item.timestamp);
        const { isFirst, isLast, isMiddle } = getGroupFlags(index);

        const currentDate = new Date(item.timestamp) || null;
        const previousDate = allMessages[index + 1] ? new Date(allMessages[index + 1].timestamp) : null;
        const separatorLabel = (currentDate && previousDate) ? getChatDaySeparator(currentDate, previousDate) : null;

        return (
            <>
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
                {(separatorLabel && item.status !== 'pending') ?
                    <DateSeparator label={separatorLabel} /> : null
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
                        data={allMessages}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingVertical: 10,
                        }}
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
                        inverted
                        onEndReached={handleFetchMore}
                        onEndReachedThreshold={0.2}
                        onScroll={(event) => {
                            const offsetY = event.nativeEvent.contentOffset.y;
                            setShowScrollToEnd(offsetY > 300);
                        }}
                        scrollEventThrottle={16}
                        ListFooterComponent={
                            loadingMore ? (
                                <View style={styles.loadingMore}>
                                    <ActivityIndicator size="small" color={colors.secondary} />
                                    <Text style={styles.loadingMoreText}>Loading older messages...</Text>
                                </View>
                            ) : !hasMore && messages.length > 0 ? (
                                <View style={styles.noMoreContainer}>
                                    <Text style={styles.noMoreText}>No more messages</Text>
                                </View>
                            ) : null
                        }
                    />

            }
            {failedMessages.map(msg => (
                <FailedMessage
                    key={msg.id}
                    msg={msg}
                    onRetry={handleRetry}
                    //remove from list if dismiss
                    onDismiss={() => {
                        setFailedMessages(prev =>
                            prev.filter(m => m.id !== msg.id)
                        );
                    }}
                    retrying={retrying}
                />
            ))}
            {otherUserTyping && (
                <View style={styles.typingContainer}>
                    <Text style={styles.typingText}>{`${otherUserName} is typing...`}</Text>
                </View>
            )}

            {showScrollToEnd &&
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
            }
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
        color: '#17860b',
        fontWeight: fontWeight.bold
    },
    loadingMore: {
        alignItems: 'center',
        paddingVertical: 12,
        gap: 6,
    },
    loadingMoreText: {
        fontSize: 12,
        color: colors.textGrey,
    },
    noMoreContainer: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    noMoreText: {
        fontSize: 12,
        color: colors.textGrey,
    },
});

export default ChatBody;