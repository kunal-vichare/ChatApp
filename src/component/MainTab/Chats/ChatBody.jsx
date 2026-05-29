import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import VectorIcon from '../../../utils/VectorIcons';
import { colors, fontFamily, fontSize, fontWeight } from '../../../constant';
import { useSelector } from 'react-redux';
import { formatTimestamp } from '../../../utils/GetTime';
import { ChatLinkPreview, Loader } from '../../../component/MainTab/Chats';
import { getChatDaySeparator } from '../../../utils/GetTime'
import { getStatusIcon } from '../../../utils/GetStatusIcon';
import { fetchMoreMessages, getOtherUserName, sendMessage, subscribeToMessages, subscribeToTyping, updateMessageStatus, addReaction, getUserName } from '../../../database/firestoreCRUD';
import { FailedMessage, ReactionDisplay, ReactionPicker, SwipeableMessage } from '../../../component/MainTab/Chats';
import LinkPreview from 'react-native-preview-url';

const ChatBody = ({ chatroomId, failedMessages, setFailedMessages, otherUserId, localMessages, replyTo, setReplyTo, searchValue,setOptionVisible,reactionTarget,setReactionTarget,setSelectedMsg }) => {
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [lastDoc, setLastDoc] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [showScrollToEnd, setShowScrollToEnd] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [retrying, setRetrying] = useState(false);
    const [otherUserName, setOtherUserName] = useState('');
    const [otherUserTyping, setOtherUserTyping] = useState(false);
    const [myName,setMyName] = useState('');

    const myUid = useSelector(state => state.auth.user.uid);
    useEffect(() => {
        getUserName(myUid).then(name => setMyName(name || ''));
    }, [myUid]);

    // Merge local + Firestore messages and remove duplicates using id
    const allMessages = [
        ...new Map( //only keeps one value per key.
            [...localMessages, ...messages].map(item => [item.id, item]) //convert items into key value pairs
        ).values() //Gets only the message objects
    ];

    const MatchFound = allMessages.filter(item =>
        item?.text?.toLowerCase().includes(searchValue?.toLowerCase() || '')
    );

    const flatListRef = useRef(null);
    const PAGE_SIZE = 20;

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

    //handle Reaction
    const handleReaction = async (emoji) => {
        if (!reactionTarget) return;
        try {
            setOptionVisible(false);
            await addReaction(chatroomId, reactionTarget, emoji, myUid);
        } catch (error) {
            console.log('reaction error:', error);
        }
    };

    // Fetch more (pagination)
    const handleFetchMore = async () => {
        if (loadingMore || !hasMore || !lastDoc) return;
        setLoadingMore(true);
        try {
            const { msgs, newLastDoc, hasMore: more } = await fetchMoreMessages(chatroomId, lastDoc, PAGE_SIZE);
            if (msgs.length === 0) { setHasMore(false); return; }
            setMessages(prev => [...prev, ...msgs]); //To be fixed: messages are replaced not append
            setLastDoc(newLastDoc);
            setHasMore(more);
        } catch (error) {
            console.log('fetchMore error:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    // Messages listener for real time updates
    useEffect(() => {
        setLoading(true);
        const unsubscribe = subscribeToMessages(
            chatroomId,
            PAGE_SIZE,
            ({ msgs, lastDoc: newLastDoc, hasMore: newHasMore }) => {
                setMessages(msgs); //To be fixed: messages are replaced not append
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
                failedMsg.id,
                chatroomId,
                failedMsg.text,
                myUid,
                myName,
                otherUserId,
                //reply to
                //link preview missing
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

    const UserMessageView = ({ message, time, isFirst, status, reactions, messageId, replyTo, urlPreview,item }) => (
        <View style={styles.userContainer}>
            <View style={styles.userBubbleWrapper}>
                <TouchableOpacity
                    onLongPress={() => {setReactionTarget(messageId);setOptionVisible(true);setSelectedMsg(item)}}
                    activeOpacity={0.5}
                    style={styles.btn}
                >
                    <View style={styles.userInnerContainer}>
                        {isFirst && (
                            <Text style={styles.sender}>You</Text>
                        )}
                        {replyTo && (
                            <View style={styles.quotedMessage}>
                                <View style={styles.quotedAccent} />
                                <View>
                                    <Text style={styles.quotedName}>{replyTo.senderName}</Text>
                                    <Text style={styles.quotedText} numberOfLines={1}>
                                        {replyTo.text}
                                    </Text>
                                </View>
                            </View>
                        )}
                        {urlPreview && (
                            <ChatLinkPreview urlPreview={urlPreview}/>
                        )}

                        <Text style={styles.message}>{message}</Text>
                        <View style={styles.metaContainer}>
                            <Text style={styles.time}>{status !== 'pending' ? time : null}</Text>
                            <View style={styles.statusIcon}>
                                {getStatusIcon(status)}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <ReactionDisplay
                    reactions={reactions}
                    myUid={myUid}
                    onPress={(emoji) => {
                        setReactionTarget(messageId);
                        handleReaction(emoji);
                    }}
                />
            </View>
        </View>
    );

    const OtherUserMessageView = ({ message, time, senderName, isFirst, reactions, messageId, replyTo, urlPreview,item}) => (
        <View style={styles.otherUserContainer}>
            <View style={styles.otherBubbleWrapper}>
                <TouchableOpacity
                    onLongPress={() => {setReactionTarget(messageId);setOptionVisible(true);setSelectedMsg(item)}}
                    activeOpacity={0.8}
                    style={styles.btn}
                >
                    <View style={styles.otherUserInnerContainer}>
                        {isFirst && (
                            <Text style={styles.receiver}>{senderName}</Text>
                        )}
                        {replyTo && (
                            <View style={styles.quotedMessage}>
                                <View style={styles.quotedAccent} />
                                <View>
                                    <Text style={styles.quotedName}>{replyTo.senderName}</Text>
                                    <Text style={styles.quotedText} numberOfLines={1}>
                                        {replyTo.text}
                                    </Text>
                                </View>
                            </View>
                        )}
                        {urlPreview && (
                            <ChatLinkPreview urlPreview={urlPreview}/>
                        )}
                        <Text style={styles.message}>{message}</Text>
                        <View style={styles.metaContainer}>
                            <Text style={styles.time}>{time}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <ReactionDisplay
                    reactions={reactions}
                    myUid={myUid}
                    onPress={(emoji) => {
                        setReactionTarget(messageId);
                        handleReaction(emoji);
                    }}
                />
            </View>
        </View>
    );

    const renderItem = useCallback(({ item, index }) => {
        const time = formatTimestamp(item.timestamp);
        const { isFirst, isLast, isMiddle } = getGroupFlags(index);
        const currentDate = new Date(item.timestamp) || null;
        const previousDate = allMessages[index + 1]
            ? new Date(allMessages[index + 1].timestamp)
            : null;
        const separatorLabel =
            currentDate && previousDate
                ? getChatDaySeparator(currentDate, previousDate)
                : null;

        const isMyMessage = item.senderId === myUid;

        return (
            <>
                <SwipeableMessage
                    isMyMessage={isMyMessage}
                    onSwipe={() => setReplyTo(item)}
                >
                    {isMyMessage ? (
                        <UserMessageView
                            message={item.text}
                            time={time}
                            isFirst={isFirst} isLast={isLast} isMiddle={isMiddle}
                            status={item.status}
                            reactions={item.reactions || {}}
                            messageId={item.id}
                            replyTo={item.replyTo || null}
                            urlPreview={item.urlPreview || null}
                            item={item}
                        />
                    ) : (
                        <OtherUserMessageView
                            message={item.text}
                            time={time}
                            senderName={item.senderName}
                            isFirst={isFirst} isLast={isLast} isMiddle={isMiddle}
                            reactions={item.reactions || {}}
                            messageId={item.id}
                            replyTo={item.replyTo || null}
                            urlPreview={item.urlPreview || null}
                            item={item}
                        />
                    )}
                </SwipeableMessage>
                {separatorLabel && item.status !== 'pending'
                    ? <DateSeparator label={separatorLabel} />
                    : null}
            </>
        );
    },[allMessages, myUid, reactionTarget]);

    return (
        <View style={{ flex: 1 }}>
            {
                loading ?
                    <Loader />
                    :
                    <FlatList
                        ref={flatListRef}
                        data={MatchFound}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.flatlistContent}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <VectorIcon
                                        type="Fontisto"
                                        name='locked'
                                        size={13}
                                        color={colors.textGrey}
                                    />
                                    <Text style={styles.emptyText}>
                                    {"\u00A0"} Message and calls are end-to-end encrypted. Only people in this chat can read, listen to, or share them. <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Team ChatMate</Text>   
                                    </Text>
                                </View>
                            </View>
                        }
                        inverted
                        onEndReached={handleFetchMore}
                        // onEndReachedThreshold={0.2}
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
                            ) : !hasMore && allMessages.length > 0 ? (
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
            {replyTo && (
                <View style={styles.replyBar}>
                    <View style={styles.replyBarAccent} />
                    <View style={styles.replyBarContent}>
                        <Text style={styles.replyBarName}>
                            {replyTo.senderId === myUid ? 'You' : replyTo.senderName}
                        </Text>
                        <Text style={styles.replyBarText} numberOfLines={1}>
                            {replyTo.text}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => setReplyTo(null)}>
                        <VectorIcon type="FontAwesome5" name="times" size={16} color={colors.textGrey} />
                    </TouchableOpacity>
                </View>
            )}
            <ReactionPicker
                visible={reactionTarget !== null}
                onSelect={handleReaction}
                onClose={() => setReactionTarget(null)}
            />
        </View>

    );
};

const styles = StyleSheet.create({

    flatlistContent: {
        paddingVertical: 10,
        paddingHorizontal: 4,
    },

    userContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: 2,
        paddingHorizontal: 10,
    },
    userBubbleWrapper: {
        alignItems: 'flex-end',
        maxWidth: '80%',
    },
    userInnerContainer: {
        backgroundColor: '#DCF8C6',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 18,
        borderTopRightRadius: 4,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 1,
    },

    otherUserContainer: {
        flexDirection: 'row',
        marginVertical: 2,
        paddingHorizontal: 10,
    },
    otherBubbleWrapper: {
        alignItems: 'flex-start',
        maxWidth: '80%',
    },
    otherUserInnerContainer: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 18,
        borderTopLeftRadius: 4,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 1,
        gap: 2,
    },
    message: {
        fontSize: fontSize.base,
        color: '#111',
        fontWeight: fontWeight.medium,
        lineHeight: 20,
        flexShrink: 1,
        fontFamily: fontFamily.popinsRegular,
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 3,
        gap: 3,
    },
    time: {
        fontSize: 10,
        color: '#7a7a7a',
        fontFamily: fontFamily.popinsRegular,
    },
    statusIcon: {
        justifyContent: 'center',
    },
    sender: {
        fontSize: fontSize.sm,
        color: '#1a73e8',
        fontWeight: fontWeight.bold,
        fontFamily: fontFamily.popinsBold,
        marginBottom: 2,
    },
    receiver: {
        fontSize: fontSize.sm,
        color: '#e53935',
        fontWeight: fontWeight.bold,
        fontFamily: fontFamily.popinsBold,
        marginBottom: 2,
    },
    dateSeparatorContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginVertical: 12,
        paddingHorizontal: 16,
        gap: 8,
    },
    dateText: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#E9EDF0',
        color: '#6B7C85',
        fontSize: fontSize.xs,
        fontFamily: fontFamily.popinsBold,
        fontWeight: fontWeight.highlight,
    },
    typingContainer: {
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 6,
    },
    typingText: {
        fontSize: fontSize.sm,
        color: '#17860b',
        fontWeight: fontWeight.bold,
        fontFamily: fontFamily.popinsBold,
    },
    scrollDownArrow: {
        position: 'absolute',
        backgroundColor: '#fff',
        borderRadius: 20,
        height: 36,
        width: 36,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 16,
        right: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    emptyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#DDE8C9',
        marginHorizontal: 30,
        borderRadius: 12,
        padding: 12,
    },
    emptyText: {
        flex: 1,
        textAlign: 'center',
        fontSize: fontSize.sm,
        color: '#555',
        lineHeight: 18,
        fontFamily: fontFamily.popinsRegular,
    },
    loadingMore: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 8,
    },
    loadingMoreText: {
        fontSize: fontSize.sm,
        color: colors.textGrey,
        fontFamily: fontFamily.popinsRegular,
    },
    noMoreContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        gap: 8,
    },
    noMoreText: {
        fontSize: fontSize.sm,
        color: colors.textGrey,
        fontFamily: fontFamily.popinsRegular,
    },
    replyBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F2F5',
        paddingHorizontal: 14,
        paddingVertical: 8,
        gap: 10,
        borderRadius: 10,
        marginLeft: 10,
        marginRight: '20%'
    },
    replyBarAccent: {
        width: 3,
        alignSelf: 'stretch',
        borderRadius: 2,
        backgroundColor: '#a900fe',
    },
    replyBarContent: {
        flex: 1,
    },
    replyBarName: {
        fontSize: 12,
        fontWeight: fontWeight.bold,
        color: colors.secondary,
        fontFamily: fontFamily.popinsBold,
    },
    replyBarText: {
        fontSize: 13,
        color: colors.textGrey,
        fontFamily: fontFamily.popinsRegular,
    },
    quotedMessage: {
        flexDirection: 'row',
        backgroundColor: '#f0eeee',
        borderRadius: 8,
        padding: 6,
        marginBottom: 4,
        gap: 6,
    },
    quotedAccent: {
        width: 3,
        borderRadius: 2,
        backgroundColor: '#a900fe',
    },
    quotedName: {
        fontSize: fontSize.base,
        fontWeight: '600',
        color: colors.secondary,
        fontFamily: fontFamily.popinsBold,
    },
    quotedText: {
        fontSize: 12,
        fontWeight: fontWeight.highlight,
        color: '#555',
        fontFamily: fontFamily.popinsRegular,
    },
});

export default ChatBody;