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

export const sendMessage = async (chatroomId, text, senderId, senderName, receiverId) => {
    try {
        await firestore()
            .collection('chats')
            .doc(chatroomId)
            .collection('messages')
            .add({
                text: text,
                senderId: senderId,
                senderName: senderName,
                timestamp: Date.now(),
                status:'sent'
            });

        await firestore().collection('chats').doc(chatroomId).update({
            lastMessage: text,
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