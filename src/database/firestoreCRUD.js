import firestore from '@react-native-firebase/firestore';

export const addUserData = async(user) => {
    try {
        await firestore().collection('users').doc(user.uid).set({
            uid: user.uid,
            email: user.email,
            name: user.name,
            profileImage: 'https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg',
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