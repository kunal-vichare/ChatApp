import {getFirestore,collection,doc,getDoc,getDocs,setDoc,addDoc,updateDoc,deleteDoc,query,where,orderBy,limit,startAfter,onSnapshot,writeBatch,arrayUnion,increment,deleteField} from '@react-native-firebase/firestore';

import { formatTimestamp } from '../utils/GetTime';

const db = getFirestore();

export const addUserData = async (user) => {
    try {
        await setDoc(doc(db, 'users', user.uid), {
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
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const users = usersSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        console.log("Fetched users: ", users);
        return users;
    } catch (error) {
        console.log("Error fetching data: ", error);
    }
}

export const updateUser = async (id, updatedData) => {
    try {
        await updateDoc(doc(db, 'users', id), updatedData);
        console.log("User updated successfully");
    } catch (error) {
        console.log("Error updating user data: ", error);
    }
}

export const deleteUser = async (id) => {
    try {
        await deleteDoc(doc(db, 'users', id));
        console.log("User deleted successfully");
    } catch (error) {
        console.log("Error deleting user data: ", error);
    }
}

export const getOrCreateChatroom = async (myUid, otherUid) => {
    const chatroomId = [myUid, otherUid].sort().join('_');
    const ref = doc(db, 'chats', chatroomId);
    await setDoc(ref, {
        participants: [myUid, otherUid],
        updatedAt: Date.now(),
    }, { merge: true });
    return chatroomId;
};

export const sendMessage = async (messageId, chatroomId, text, senderId, senderName, receiverId, replyTo = null, urlPreview = null) => {
    try {
        await setDoc(doc(db, 'chats', chatroomId, 'messages', messageId), {
            id: messageId,
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
            ...(urlPreview && {
                urlPreview: {
                    url: urlPreview.url,
                    title: urlPreview.title,
                    description: urlPreview.description,
                    image: urlPreview.image,
                    siteName: urlPreview.siteName
                }
            }),
        });

        await updateDoc(doc(db, 'chats', chatroomId), {
            lastMessage: text,
            lastMessageStatus: 'sent',
            lastMessageSenderId: senderId,
            updatedAt: Date.now(),
            ...(Array.isArray(receiverId)
                ? receiverId.reduce((acc, uid) => {
                    acc[`unreadCount.${uid}`] = increment(1);
                    return acc;
                }, {})
                : { [`unreadCount.${receiverId}`]: increment(1) }
            ),
        });
    } catch (error) {
        console.log('sendMessage error', error);
        throw error;
    }
};

export const subscribeToMessages = (chatroomId, PAGE_SIZE, onUpdate, onError) => {
    return onSnapshot(
        query(
            collection(db, 'chats', chatroomId, 'messages'),
            orderBy('timestamp', 'desc'),
            limit(PAGE_SIZE)
        ),
        snapshot => {
            if (snapshot.empty) {
                onUpdate({ msgs: [], lastDoc: null, hasMore: false });
                return;
            }
            const msgs = snapshot.docs.map(d => ({
                id: d.id,
                ...d.data(),
            }));
            onUpdate({
                msgs,
                lastDoc: snapshot.docs[snapshot.docs.length - 1],
                hasMore: snapshot.docs.length === PAGE_SIZE,
            });
        }, onError);
};

export const fetchMoreMessages = async (chatroomId, lastDoc, PAGE_SIZE) => {
    const snapshot = await getDocs(
        query(
            collection(db, 'chats', chatroomId, 'messages'),
            orderBy('timestamp', 'desc'),
            startAfter(lastDoc),
            limit(PAGE_SIZE)
        )
    );
    return {
        msgs: snapshot.docs.map(d => ({ id: d.id, ...d.data() })),
        newLastDoc: snapshot.docs[snapshot.docs.length - 1],
        hasMore: snapshot.docs.length === PAGE_SIZE,
    };
};

export const updateMessageStatus = async (chatroomId, msgs, myUid) => {
    const batch = writeBatch(db);
    let hasUpdates = false;

    msgs.forEach(msg => {
        if (msg.senderId === myUid) return;
        if (msg.status === 'sent' || msg.status === 'delivered') {
            const msgRef = doc(db, 'chats', chatroomId, 'messages', msg.id);
            batch.update(msgRef, { status: 'read' });
            hasUpdates = true;
        }
    });

    if (!hasUpdates) return;

    await batch.commit();

    const lastMsg = msgs[0];
    if (lastMsg?.senderId !== myUid) {
        await updateDoc(doc(db, 'chats', chatroomId), { lastMessageStatus: 'read' });
    }
};

export const markAllDelivered = async (myUid) => {
    try {
        const chatsSnap = await getDocs(
            query(collection(db, 'chats'), where('participants', 'array-contains', myUid))
        );

        for (const chatDoc of chatsSnap.docs) {
            const chatroomId = chatDoc.id;

            const sentMsgs = await getDocs(
                query(
                    collection(db, 'chats', chatroomId, 'messages'),
                    where('status', '==', 'sent')
                )
            );

            if (sentMsgs.empty) continue;

            const batch = writeBatch(db);
            let hasUpdates = false;

            sentMsgs.docs.forEach(d => {
                if (d.data().senderId !== myUid) {
                    batch.update(d.ref, { status: 'delivered' });
                    hasUpdates = true;
                }
            });

            if (!hasUpdates) continue;

            await batch.commit();

            const otherUserMsgs = sentMsgs.docs
                .filter(d => d.data().senderId !== myUid)
                .sort((a, b) => b.data().timestamp - a.data().timestamp);

            if (otherUserMsgs.length === 0) continue;

            const lastUpdatedMsg = otherUserMsgs[0].data();

            const lastMsgSnap = await getDocs(
                query(
                    collection(db, 'chats', chatroomId, 'messages'),
                    orderBy('timestamp', 'desc'),
                    limit(1)
                )
            );

            if (lastMsgSnap.empty) continue;

            const lastMsg = lastMsgSnap.docs[0].data();

            if (lastMsg.senderId !== myUid) {
                await updateDoc(doc(db, 'chats', chatroomId), { lastMessageStatus: 'delivered' });
            }
        }
    } catch (error) {
        console.log('markAllDelivered error:', error);
    }
};

export const subscribeToTyping = (chatroomId, myUid, setOtherUserTyping) => {
    return onSnapshot(doc(db, 'chats', chatroomId), snapshot => {
        const data = snapshot.data();
        const typing = data?.typing || {};
        const otherUid = data?.participants?.find(uid => uid !== myUid);
        setOtherUserTyping(typing[otherUid] === true);
    });
};

export const getOtherUserName = async (chatroomId, myUid) => {
    const chatDoc = await getDoc(doc(db, 'chats', chatroomId));

    const otherUid = chatDoc.data()?.participants?.find(uid => uid !== myUid);
    if (!otherUid) return 'Other';

    const userDoc = await getDoc(doc(db, 'users', otherUid));

    return userDoc.data()?.name || 'Other';
};

export const addReaction = async (chatroomId, messageId, emoji, myUid) => {
    const msgRef = doc(db, 'chats', chatroomId, 'messages', messageId);

    const msgDoc = await getDoc(msgRef);

    const reactions = msgDoc.data()?.reactions || {};

    const currentUsers = reactions[emoji] || [];
    const alreadyReacted = currentUsers.includes(myUid);

    if (alreadyReacted) {
        const updated = currentUsers.filter(uid => uid !== myUid);
        if (updated.length === 0) {
            await updateDoc(msgRef, {
                [`reactions.${emoji}`]: deleteField()
            });
        } else {
            await updateDoc(msgRef, {
                [`reactions.${emoji}`]: updated
            });
        }
    } else {
        await updateDoc(msgRef, {
            [`reactions.${emoji}`]: arrayUnion(myUid)
        });
    }
};

export const createGroupChat = async (myUid, memberUids, groupName) => {
    const groupId = `group_${Date.now()}_${myUid}`;
    const allParticipants = [myUid, ...memberUids];

    await setDoc(doc(db, 'chats', groupId), {
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

export const subscribeToChatInfo = (chatroomId, onUpdate) => {
    return onSnapshot(doc(db, 'chats', chatroomId), snap => {
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

    const unsubscribeChats = onSnapshot(
        query(collection(db, 'chats'), where('participants', 'array-contains', myUid)),
        snapshot => {
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

                    const unsubscribeUser = onSnapshot(
                        doc(db, 'users', otherUid),
                        userDoc => {
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
    const unsubscribe = onSnapshot(doc(db, 'chats', chatroomId), async snap => {
        const data = snap.data();
        if (!data) return;

        setGroupData(data);

        const memberDocs = await Promise.all(
            data.participants.map(uid => getDoc(doc(db, 'users', uid)))
        );
        setMembers(memberDocs.map(d => d.data()).filter(Boolean));
        setLoading(false);
    });

    return () => unsubscribe();
}

export const setOffline = async (myUid) => {
    await updateDoc(doc(db, 'users', myUid), {
        isOnline: false,
        lastSeen: Date.now(),
    });
}

export const setOnline = async (myUid) => {
    await updateDoc(doc(db, 'users', myUid), {
        isOnline: true,
        lastSeen: Date.now(),
    });
}

export const get_MemberCount = (chatroomId, setMemberCount) => {
    return onSnapshot(doc(db, 'chats', chatroomId), snap => {
        setMemberCount(snap.data()?.participants?.length || 0);
    });
}

export const get_userInfo = (userId, setUserData) => {
    return onSnapshot(doc(db, 'users', userId), snap => {
        if (snap?.data()) setUserData(snap?.data());
    });
}

export const getUserName = async (myUid) => {
    const userDoc = await getDoc(doc(db, 'users', myUid));
    const firestoreName = userDoc.data()?.name || ''
    return firestoreName;
}

export const getProfile = async (myUid) => {
    const userDoc = await getDoc(doc(db, 'users', myUid));
    return userDoc.data();
}

export const setTypingStatus = async (chatroomId, myUid, isTyping) => {
    await updateDoc(doc(db, 'chats', chatroomId), {
        [`typing.${myUid}`]: isTyping,
    });
}

export const resetUnreadCount = async (chatroomId, myUid) => {
    await updateDoc(doc(db, 'chats', chatroomId), {
        [`unreadCount.${myUid}`]: 0,
    })
}

export const setCurrentUserOffline = async (currentUser) => {
    await updateDoc(doc(db, 'users', currentUser.uid), {
        isOnline: false,
        lastSeen: Date.now(),
    });
}

export const clearChat = async (chatroomId) => {
    const messages = await getDocs(collection(db, 'chats', chatroomId, 'messages'));
    const batch = writeBatch(db);
    messages.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
    await updateDoc(doc(db, 'chats', chatroomId), {
        lastMessage: '',
        updatedAt: Date.now(),
        lastMessageStatus: '',
        unreadCount: null,
        lastMessageSenderId: ''
    });
};

export const deleteForEveryone = async (chatroomId, messageId) => {
    await updateDoc(doc(db, 'chats', chatroomId, 'messages', messageId), {
        text: 'This message was deleted'
    });
};

export const deleteForMe = async (chatroomId, messageId) => {
    await deleteDoc(doc(db, 'chats', chatroomId, 'messages', messageId));
};

export const generateId = (chatroomId) => {
    return doc(collection(db, 'chats', chatroomId, 'messages')).id;
}