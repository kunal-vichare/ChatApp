import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { useState } from 'react'
import { colors, fontFamily, fontSize, fontWeight, padding } from '../../constant';
import TextContainer from '../../component/Authentication/TextContainer'
import Footer from '../../component/Authentication/Footer'
import {registerUser} from '../../services/auth'

const Signup = () => {
    const [signup,setSignup]=useState({
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
            await registerUser(signup.email,signup.password);
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
        <View style={styles.container}>
            <Text style={styles.loginText}>Create Account</Text>
            <Text style={styles.welcomeText}>Join the conversation, anytime, anywhere.</Text>

            {/* Both use same component but maintain different state. */}
            <TextContainer
                type="signup"
                handleRegister={handleRegister}
                formData={signup}
                setFormData={setSignup}
            />
            <Footer/>
        </View>
  )
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

export default Signup