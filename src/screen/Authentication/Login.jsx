import { View, Text, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ScrollView, Platform } from 'react-native'
import React, {useState} from 'react'
import { colors, fontFamily, fontSize, fontWeight, padding } from '../../constant';
import TextContainer from '../../component/Authentication/TextContainer'
import Footer from '../../component/Authentication/Footer'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../services/auth';
import { setLoginUser } from '../../redux/slice/auth'
import firestore from '@react-native-firebase/firestore';
import { EmailNotVerifiedToast, FillAllFieldToast, LoginSuccessToast } from '../../utils/ToastMsg';

const Login = () => {
    const dispatch = useDispatch();
    const userRedux = useSelector((state) => state.auth.user);
    const [login, setLogin] = useState({
        email: '',
        password: ''
    });
    // const myUid = useSelector(state=>state.auth.user.uid);

    const handleSignin = async () => {
        if (!login.email || !login.password) {
            FillAllFieldToast();
            return;
        }
        try {
            const { user, emailVerified } = await loginUser(login.email, login.password);
            // console.log("emailVerified", emailVerified);

            if (emailVerified) {
                LoginSuccessToast();
                setLogin({
                    email: '',
                    password: ''
                })
                const userDoc = await firestore().collection('users').doc(user.uid).get();
                const firestoreName = userDoc.data()?.name || '';
                dispatch(setLoginUser({
                    uid: user.uid,
                    email: user.email,
                    name: firestoreName,
                }));
                // console.log("User data: ",userRedux);
            } else {
                EmailNotVerifiedToast();
            }
        } catch (error) {
            console.log('Error', error.message);
        }
    }
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1
                    }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.container}>
                        <Text style={styles.loginText}>
                            Login here
                        </Text>

                        <Text style={styles.welcomeText}>
                            Welcome back you've been missed!
                        </Text>

                        <TextContainer
                            type="signin"
                            formData={login}
                            handleSignin={handleSignin}
                            setFormData={setLogin}
                        />

                        <Footer />
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {

    },
    loginText: {
        paddingTop: padding.headingLg,
        textAlign: 'center',
        fontFamily: fontFamily.popinsBold,
        fontSize: fontSize.titleSm,
        color: colors.title,
        fontWeight: fontWeight.bold
    },
    welcomeText: {
        paddingHorizontal: padding.bigS,
        textAlign: 'center',
        paddingTop: padding.xxl,
        fontFamily: fontFamily.popinsMedium,
        fontWeight: fontWeight.highlight,
        fontSize: fontSize.lg
    }
})
export default Login