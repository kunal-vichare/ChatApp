import { View, Text, TouchableOpacity, StyleSheet, Alert,KeyboardAvoidingView,Platform,ScrollView,TouchableWithoutFeedback,Keyboard } from 'react-native'
import React, { useState } from 'react'
import { colors, fontFamily, fontSize, fontWeight, padding } from '../../constant';
import TextContainer from '../../component/Authentication/TextContainer'
import Footer from '../../component/Authentication/Footer'
import {registerUser} from '../../services/auth'
import {addUserData} from '../../database/firestoreCRUD'

const Signup = () => {
    const [signup,setSignup]=useState({
        name:'',
        email:'',
        password:'',
        confirmPassword:''
    })

    const handleRegister = async ()=> {
        if (!signup.email || !signup.password) {
            Alert.alert("Error","Please fill all the fields")
            return;
        }
        if (signup.password!==signup.confirmPassword) {
            Alert.alert('Error','Password not match');
            return;
        }
        try {
            const user = await registerUser(signup.email,signup.password);

            await addUserData({
                uid: user.uid,
                email: user.email,
                name: signup.name,
            });
            Alert.alert('Success','A verification email has been sent to your email address');
            setSignup({
                email:'',
                password:'',
                confirmPassword:''
            })
        } catch (error) {
            Alert.alert('Error registering user: ',error.message)
        }
    };

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
                        Create Account
                    </Text>

                    <Text style={styles.welcomeText}>
                        Join the conversation, anytime, anywhere.
                    </Text>

                    <TextContainer
                        type="signup"
                        handleRegister={handleRegister}
                        formData={signup}
                        setFormData={setSignup}
                    />

                    <Footer />
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
)
}

const styles = StyleSheet.create({
    container: {

    },
    loginText: {
        paddingTop: padding.headingS,
        textAlign: 'center',
        fontFamily: fontFamily.popinsBold,
        fontSize: fontSize.titleSm,
        color: colors.title,
        fontWeight: fontWeight.bold
    },
    welcomeText: {
        paddingHorizontal: padding.bigS,
        textAlign: 'center',
        paddingTop: padding.base,
        fontFamily: fontFamily.popinsMedium,
        fontWeight: fontWeight.highlight,
        fontSize: fontSize.lg
    }
})

export default Signup