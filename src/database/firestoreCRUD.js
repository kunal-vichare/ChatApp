import firestore from '@react-native-firebase/firestore';

export const addUserData = async(user) => {
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
        console.log("Error adding user data: ",error);
    }
}

export const getUsers = async() => {
    try {
        const usersSnapshot = await firestore().collection('users').get();
        const users = usersSnapshot.docs.map(doc=>({id:doc.id,...doc.data()}));
        console.log("Fetched users: ",users);
        return users;
    } catch (error) {
        console.log("Error fetching data: ",error);
    }
}

export const updateUser = async(id,updatedData) => {
    try {
        await firestore().collection('users').doc(id).update(updatedData);
        console.log("User updated successfully");
    } catch (error) {
        console.log("Error updating user data: ",error);
    }
}

export const deleteUser = async(id) => {
    try {
        await firestore().collection('users').doc(id).delete();
        console.log("User deleted successfully");
    } catch (error) {
        console.log("Error deleting user data: ",error);
    }
}

export const getOrCreateChatroom = async (myUid, otherUid) => {
  const chatroomId = [myUid, otherUid].sort().join('_');
  const ref = firestore().collection('chats').doc(chatroomId);
  await ref.set({
    participants: [myUid, otherUid],
    lastMessage: '',
    updatedAt: Date.now(),
  }, { merge: true });
  return chatroomId;
};

export const sendMessage = async (chatroomId, text, senderId) => {
  const msgRef = firestore()
    .collection('chats')
    .doc(chatroomId)
    .collection('messages')
    .doc();
  await msgRef.set({ text, senderId, timestamp: Date.now() });
  // also update lastMessage on the parent doc
  await firestore().collection('chats').doc(chatroomId).update({
    lastMessage: text,
    updatedAt: Date.now(),
  });
};