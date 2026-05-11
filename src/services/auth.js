import auth from '@react-native-firebase/auth'

export const registerUser = async(email,password) => {
    try {
        const userCredentials = await auth().createUserWithEmailAndPassword(email,password);
        await userCredentials.user.sendEmailVerification();
        return userCredentials.user;
    } catch (error) {
        let errorMessage;
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMessage = 'This email is already in use. Please use a different email address'
                break;
            case 'auth/invalid-email':
                errorMessage = 'Invalid email address'
                break;
            case 'auth/weak-password':
                errorMessage = 'Password is too weak please use atleast 6 characters'
                break;
            default:
                errorMessage="Invalid error occured"
                break;
        }
        throw new Error(errorMessage);
    }
}

export const loginUser = async (email,password) => {
    try {
        const userCredentials = await auth().signInWithEmailAndPassword(email,password);
        const user = userCredentials.user;
        const emailVerified = user.emailVerified;
        return {user,emailVerified}
    } catch (error) {
        let errorMessage;
        switch (error.code) {
            case 'auth/wrong-password':
                errorMessage = 'Wrong Password'
                break;
            case 'auth/user-not-found':
                errorMessage = 'No user found!'
                break;
            default:
                errorMessage="An unknown error occured"
                break;
        }
        throw new Error(errorMessage);
    }
}

export const resetPassword = async(email)=> {
    try {
        await auth().sendPasswordResetEmail(email);
    } catch (error) {
        let errorMessage;
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'This user does not exist'
                break;
            case 'auth/invalid-email-address':
                errorMessage = 'Invalid email address'
                break;
            default:
                errorMessage="An unknown error occured"
                break;
        }
        throw new Error(errorMessage);        
    }
}