import firestore from '@react-native-firebase/firestore';
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

export const sendMessage = async (chatroomId, text, senderId, senderName, receiverId, replyTo = null) => {
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
            });

        await firestore().collection('chats').doc(chatroomId).update({
            lastMessage: text,
            lastMessageStatus:'sent',
            lastMessageSenderId: senderId,
            updatedAt: Date.now(),
            [`unreadCount.${receiverId}`]: firestore.FieldValue.increment(1)
        });
    } catch (error) {
        console.log('sendMessage error', error);
        throw error;
    }
};

export const markAllDelivered = async (myUid) => {
    try {
        const chatsSnap = await firestore()
            .collection('chats')
            .where('participants', 'array-contains', myUid)
            .get();

        for (const chatDoc of chatsSnap.docs) {

            // Only one where clause — no composite index needed
            const sentMsgs = await firestore()
                .collection('chats')
                .doc(chatDoc.id)
                .collection('messages')
                .where('status', '==', 'sent')
                .get();

            if (sentMsgs.empty) continue;

            const batch = firestore().batch();

            sentMsgs.docs.forEach(doc => {
                // Filter out MY own messages in JS instead of Firestore
                if (doc.data().senderId !== myUid) {
                    batch.update(doc.ref, { status: 'delivered' });
                }
            });

            await batch.commit();
        }
    } catch (error) {
        console.log('markAllDelivered error:', error);
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