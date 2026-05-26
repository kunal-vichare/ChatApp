import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import {formatTimestamp} from '../utils/GetTime'

export const addUserData = async(userData)=>{
    try {
        const newRef = database().ref('/users').push();
        await newRef.set(userData);
        console.log("User added successfully");
    } catch (error) {
        console.log("Error adding user",error);  
    }
}

export const getUsers = async ()=> {
    try {
        const snapshot = await database().ref('/users').once('value');
        const userData = snapshot.val() ? Object.entries(snapshot.val()).map(([id,data])=>({id,...data})) : [];
        console.log("Fetched users: ",userData);
        return userData;
    } catch (error) {
        console.log("Error fetching user data: ",error);
    }
}

export const updateUser = async (id,updatedData) => {
    try {
        await database().ref(`/users/${id}`).update(updatedData);
        console.log('User data updated successfully');
    } catch (error) {
        console.log('User updating User Data',error);
    }
}

export const deleteUser = async (id) => {
    try {
        await database().ref(`/users/${id}`).remove();
        console.log('User data deleted successfully');
    } catch (error) {
        console.log('Error deleting data',error);
    }
}

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

export const subscribeToGroupInfo = (chatroomId,setGroupData,setMembers,setLoading) => {
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