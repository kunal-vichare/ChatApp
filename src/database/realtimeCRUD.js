import database from '@react-native-firebase/database';
import { use } from 'react';

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