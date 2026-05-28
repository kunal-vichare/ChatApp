import firestore from '@react-native-firebase/firestore';
import { formatTimestamp } from '../utils/GetTime'
export const addUserData = async (user) => {
    try {
        await firestore().collection('users').doc(user.uid).set({
            uid: user.uid,
            email: user.email,
            name: user.name,
            profileImage: 'https://png.pngtree.com/png-vector/20250512/ourmid/pngtree-default-avatar-profile-icon-gray-placeholder-vector-png-image_16213764.png',
            about: 'Available',
            lastSeen: Date.now(),
            isOnline: true,
        });
        console.log("User added successfully");
    } catch (error) {
        console.log("Error adding user data: ", error);
    }
}

export const getUsers = async () => {
    try {
        const usersSnapshot = await firestore().collection('users').get();
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Fetched users: ", users);
        return users;
    } catch (error) {
        console.log("Error fetching data: ", error);
    }
}

export const updateUser = async (id, updatedData) => {
    try {
        await firestore().collection('users').doc(id).update(updatedData);
        console.log("User updated successfully");
    } catch (error) {
        console.log("Error updating user data: ", error);
    }
}

export const deleteUser = async (id) => {
    try {
        await firestore().collection('users').doc(id).delete();
        console.log("User deleted successfully");
    } catch (error) {
        console.log("Error deleting user data: ", error);
    }
}

export const getOrCreateChatroom = async (myUid, otherUid) => {
    const chatroomId = [myUid, otherUid].sort().join('_');
    const ref = firestore().collection('chats').doc(chatroomId);
    await ref.set({
        participants: [myUid, otherUid],
        // lastMessage: '',
        updatedAt: Date.now(),
    }, { merge: true });
    return chatroomId;
};

export const sendMessage = async (chatroomId, text, senderId, senderName, receiverId, replyTo = null, urlPreview = null) => {
    try {
        // throw new Error(Simulatederror);
        await firestore()
            .collection('chats')
            .doc(chatroomId)
            .collection('messages')
            .add({
                text: text,
                senderId: senderId,
                senderName: senderName,
                timestamp: Date.now(),
                status: 'sent',
                ...(replyTo && {
                    replyTo: {
                        id: replyTo.id,
                        text: replyTo.text,
                        senderName: replyTo.senderName,
                    }
                }),
                ...(urlPreview && { urlPreview }),
            });

        await firestore().collection('chats').doc(chatroomId).update({
            lastMessage: text,
            lastMessageStatus: 'sent',
            lastMessageSenderId: senderId,
            updatedAt: Date.now(),
            ...(Array.isArray(receiverId)
                ? receiverId.reduce((acc, uid) => {
                    acc[`unreadCount.${uid}`] = firestore.FieldValue.increment(1);
                    return acc;
                }, {})
                : { [`unreadCount.${receiverId}`]: firestore.FieldValue.increment(1) }
            ),
        });
    } catch (error) {
        console.log('sendMessage error', error);
        throw error;
    }
};

// Subscribe to latest messages (realtime, paginated)
export const subscribeToMessages = (chatroomId, PAGE_SIZE, onUpdate, onError) => {
    return firestore()
        .collection('chats')
        .doc(chatroomId)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .limit(PAGE_SIZE)
        .onSnapshot(snapshot => {
            if (snapshot.empty) {
                onUpdate({ msgs: [], lastDoc: null, hasMore: false });
                return;
            }
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            onUpdate({
                msgs,
                lastDoc: snapshot.docs[snapshot.docs.length - 1],
                hasMore: snapshot.docs.length === PAGE_SIZE,
            });
        }, onError);
};

// Fetch older messages (pagination)
export const fetchMoreMessages = async (chatroomId, lastDoc, PAGE_SIZE) => {
    const snapshot = await firestore()
        .collection('chats')
        .doc(chatroomId)
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .startAfter(lastDoc)
        .limit(PAGE_SIZE)
        .get();

    return {
        msgs: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
        newLastDoc: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === PAGE_SIZE,
    };
};

// Batch update messages to 'read' status
export const updateMessageStatus = async (chatroomId, msgs, myUid) => {
    const batch = firestore().batch();
    let hasUpdates = false;

    msgs.forEach(msg => {
        if (msg.senderId === myUid) return;
        if (msg.status === 'sent' || msg.status === 'delivered') {
            const msgRef = firestore()
                .collection('chats')
                .doc(chatroomId)
                .collection('messages')
                .doc(msg.id);
            batch.update(msgRef, { status: 'read' });
            hasUpdates = true;
        }
    });

    if (!hasUpdates) return;

    await batch.commit();

    const lastMsg = msgs[0];
    if (lastMsg?.senderId !== myUid) {
        await firestore()
            .collection('chats')
            .doc(chatroomId)
            .update({ lastMessageStatus: 'read' });
    }
};

export const markAllDelivered = async (myUid) => {
    try {
        const chatsSnap = await firestore()
            .collection('chats')
            .where('participants', 'array-contains', myUid)
            .get();

        for (const chatDoc of chatsSnap.docs) {
            const chatroomId = chatDoc.id;

            const sentMsgs = await firestore()
                .collection('chats')
                .doc(chatroomId)
                .collection('messages')
                .where('status', '==', 'sent')
                .get();

            if (sentMsgs.empty) continue;

            const batch = firestore().batch();
            let hasUpdates = false;

            sentMsgs.docs.forEach(doc => {
                if (doc.data().senderId !== myUid) {
                    batch.update(doc.ref, { status: 'delivered' });
                    hasUpdates = true;
                }
            });

            if (!hasUpdates) continue;

            await batch.commit();

            // ✅ Check directly from sentMsgs — no need for extra query
            // Sort by timestamp to find the last message among updated ones
            const otherUserMsgs = sentMsgs.docs
                .filter(doc => doc.data().senderId !== myUid)
                .sort((a, b) => b.data().timestamp - a.data().timestamp);

            if (otherUserMsgs.length === 0) continue;

            const lastUpdatedMsg = otherUserMsgs[0].data();

            // Only update outer if this last updated msg is also
            // the last message of the entire chatroom
            const lastMsgSnap = await firestore()
                .collection('chats')
                .doc(chatroomId)
                .collection('messages')
                .orderBy('timestamp', 'desc')
                .limit(1)
                .get();

            if (lastMsgSnap.empty) continue;

            const lastMsg = lastMsgSnap.docs[0].data();

            // ✅ No status check — just verify last msg belongs to other user
            if (lastMsg.senderId !== myUid) {
                await firestore()
                    .collection('chats')
                    .doc(chatroomId)
                    .update({ lastMessageStatus: 'delivered' });
            }
        }
    } catch (error) {
        console.log('markAllDelivered error:', error);
    }
};

// Subscribe to typing indicator
export const subscribeToTyping = (chatroomId, myUid, onUpdate) => {
    return firestore()
        .collection('chats')
        .doc(chatroomId)
        .onSnapshot(snapshot => {
            const data = snapshot.data();
            const typing = data?.typing || {};
            const otherUid = data?.participants?.find(uid => uid !== myUid);
            onUpdate(typing[otherUid] === true);
        });
};

// Get other participant's name
export const getOtherUserName = async (chatroomId, myUid) => {
    const chatDoc = await firestore()
        .collection('chats')
        .doc(chatroomId)
        .get();

    const otherUid = chatDoc.data()?.participants?.find(uid => uid !== myUid);
    if (!otherUid) return 'Other';

    const userDoc = await firestore()
        .collection('users')
        .doc(otherUid)
        .get();

    return userDoc.data()?.name || 'Other';
};

export const addReaction = async (chatroomId, messageId, emoji, myUid) => {
    const msgRef = firestore()
        .collection('chats')
        .doc(chatroomId)
        .collection('messages')
        .doc(messageId);

    const msgDoc = await msgRef.get();

    const reactions = msgDoc.data()?.reactions || {};

    // Each emoji holds an array of uids who reacted with it
    const currentUsers = reactions[emoji] || [];
    const alreadyReacted = currentUsers.includes(myUid);

    if (alreadyReacted) {
        // Toggle off — remove uid from that emoji's array
        const updated = currentUsers.filter(uid => uid !== myUid);
        if (updated.length === 0) {
            // Remove emoji key entirely if no users left
            await msgRef.update({
                [`reactions.${emoji}`]: firestore.FieldValue.delete()
            });
        } else {
            await msgRef.update({
                [`reactions.${emoji}`]: updated
            });
        }
    } else {
        // Add uid to emoji's array
        await msgRef.update({
            [`reactions.${emoji}`]: firestore.FieldValue.arrayUnion(myUid)
        });
    }
};

// Create a group chatroom
export const createGroupChat = async (myUid, memberUids, groupName) => {
    const groupId = `group_${Date.now()}_${myUid}`;
    const allParticipants = [myUid, ...memberUids];

    await firestore().collection('chats').doc(groupId).set({
        isGroup: true,
        groupName,
        groupAdmin: myUid,
        participants: allParticipants,
        lastMessage: '',
        description: 'Dream big, live bigger.',
        updatedAt: Date.now(),
        groupImage: 'https://cdn-icons-png.flaticon.com/256/8184/8184182.png',
        unreadCount: allParticipants.reduce((acc, uid) => {
            acc[uid] = 0;
            return acc;
        }, {}),
    });

    return groupId;
};

// Get group info (name, members)
// export const getGroupInfo = async (chatroomId) => {
//     const doc = await firestore().collection('chats').doc(chatroomId).get();
//     return doc.data();
// };

export const subscribeToChatInfo = (chatroomId, onUpdate) => {
    return firestore()
        .collection('chats')
        .doc(chatroomId)
        .onSnapshot(snap => {
            const data = snap.data();
            if (data) {
                onUpdate({
                    isGroup: data.isGroup || false,
                    groupName: data.groupName || '',
                    participants: data.participants || [],
                    groupImage: data.groupImage || null
                });
            }
        });
};

export const subscribeToChatList = (myUid, setChatList, setLoading) => {
    const unsubscribers = [];

    const unsubscribeChats = firestore()
        .collection('chats')
        .where('participants', 'array-contains', myUid)
        .onSnapshot(snapshot => {

            if (snapshot.empty) {
                setLoading(false);
                return;
            }

            snapshot.docs.forEach(chatDoc => {
                const data = chatDoc.data();
                const chatId = chatDoc.id;

                if (data.isGroup) {
                    setChatList(prev => {
                        const existingIndex = prev.findIndex(c => c.chatId === chatId);
                        const updatedChat = {
                            chatId,
                            isGroup: true,
                            name: data.groupName || 'Group',
                            profileImage: data.groupImage || '',
                            lastMessage: data.lastMessage || '',
                            lastMessageStatus: data.lastMessageStatus || '',
                            lastMessageSenderId: data.lastMessageSenderId || '',
                            updatedAt: formatTimestamp(data.updatedAt),
                            unreadCount: data.unreadCount?.[myUid] || 0,
                            typing: data.typing || {},
                        };
                        if (existingIndex !== -1) {
                            const updated = [...prev];
                            updated[existingIndex] = updatedChat;
                            return updated;
                        }
                        return [...prev, updatedChat];
                    });
                    setLoading(false);

                } else {
                    const otherUid = data.participants.find(uid => uid !== myUid);

                    const unsubscribeUser = firestore()
                        .collection('users')
                        .doc(otherUid)
                        .onSnapshot(userDoc => {
                            const userData = userDoc.data();
                            setChatList(prev => {
                                const existingIndex = prev.findIndex(c => c.chatId === chatId);
                                const updatedChat = {
                                    chatId,
                                    isGroup: false,
                                    id: userData?.uid,
                                    name: userData?.name,
                                    profileImage: userData?.profileImage,
                                    lastSeen: userData?.lastSeen,
                                    isOnline: userData?.isOnline,
                                    lastMessage: data.lastMessage || '',
                                    lastMessageStatus: data.lastMessageStatus || '',
                                    lastMessageSenderId: data.lastMessageSenderId || '',
                                    typing: data.typing || {},
                                    updatedAt: formatTimestamp(data.updatedAt),
                                    unreadCount: data.unreadCount?.[myUid] || 0,
                                };
                                if (existingIndex !== -1) {
                                    const updated = [...prev];
                                    updated[existingIndex] = updatedChat;
                                    return updated;
                                }
                                return [...prev, updatedChat];
                            });
                            setLoading(false);
                        });

                    unsubscribers.push(unsubscribeUser);
                }
            });
        });

    unsubscribers.push(unsubscribeChats);
    return () => unsubscribers.forEach(unsub => unsub());
};

export const subscribeToGroupInfo = (chatroomId, setGroupData, setMembers, setLoading) => {
    const unsubscribe = firestore()
        .collection('chats')
        .doc(chatroomId)
        .onSnapshot(async snap => {
            const data = snap.data();
            if (!data) return;

            setGroupData(data);

            // Fetch all members' user docs
            const memberDocs = await Promise.all(
                data.participants.map(uid =>
                    firestore().collection('users').doc(uid).get()
                )
            );
            setMembers(memberDocs.map(d => d.data()).filter(Boolean));
            setLoading(false);
        });

    return () => unsubscribe();
}

export const setOffline = async (myUid) => {
    await firestore()
        .collection('users')
        .doc(myUid)
        .update({
            isOnline: false,
            lastSeen: Date.now(),
        });
}
export const setOnline = async (myUid) => {
    await firestore()
        .collection('users')
        .doc(myUid)
        .update({
            isOnline: true,
            lastSeen: Date.now(),
        });
}
export const get_MemberCount = async (chatroomId, setMemberCount) => {
    return firestore()
        .collection('chats')
        .doc(chatroomId)
        .onSnapshot(snap => {
            setMemberCount(snap.data()?.participants?.length || 0);
        });
}
export const get_userInfo = async (userId, setUserData) => {
    return firestore().collection('users').doc(userId)
        .onSnapshot(snap => {
            if (snap?.data()) setUserData(snap?.data());
        });
}

export const getUserName = async (myUid) => {
    const userDoc = await firestore()
        .collection('users')
        .doc(myUid)
        .get();
    const firestoreName = userDoc.data()?.name || ''
    return firestoreName;
}
export const getProfile = async(myUid) => {
    const userDoc = await firestore()
        .collection('users')
        .doc(myUid)
        .get();
    return userDoc.data();
}
export const setTypingStatus = async (chatroomId, myUid, isTyping) => {
    await firestore()
        .collection('chats')
        .doc(chatroomId)
        .update({
            [`typing.${myUid}`]: isTyping,
        });
}
export const resetUnreadCount = async (chatroomId, myUid) => {
    await firestore()
        .collection('chats')
        .doc(chatroomId)
        .update({
            [`unreadCount.${myUid}`]: 0,
        })
}
export const setCurrentUserOffline = async (currentUser) => {
    await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .update({
            isOnline: false,
            lastSeen: Date.now(),
        });
}
export const clearChat = async (chatroomId) => {
    const messages = await firestore()
        .collection('chats').doc(chatroomId)
        .collection('messages').get();
    const batch = firestore().batch();
    messages.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    await firestore().collection('chats').doc(chatroomId)
        .update({ lastMessage: '', updatedAt: Date.now(),lastMessageStatus:'',unreadCount:null,lastMessageSenderId:'' });
};

export const deleteForEveryone = async (chatroomId, messageId) => {
    const ref = firestore()
        .collection('chats').doc(chatroomId)
        .collection('messages').doc(messageId);
        await ref.update({ text: 'This message was deleted'});
};

export const deleteForMe = async (chatroomId, messageId) => {
    const ref = firestore()
        .collection('chats').doc(chatroomId)
        .collection('messages').doc(messageId);
        await ref.delete();
};