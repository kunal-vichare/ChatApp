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