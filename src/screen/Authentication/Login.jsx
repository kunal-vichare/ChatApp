import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import React, { use, useState } from 'react'
import { colors, fontFamily, fontSize, fontWeight, padding } from '../../constant';
import TextContainer from '../../component/Authentication/TextContainer'
import Footer from '../../component/Authentication/Footer'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../services/auth';
import {setLoginUser} from '../../redux/slice/auth'

const Login = () => {
    const dispatch = useDispatch();
    const [login,setLogin]=useState({
        email:'',
        password:''
    });

    const handleSignin = async() => {
        if (!login.email || !login.password) {
            Alert.alert("Error","Please fill all the fields")
            return;
        }
        try {
            const {user,emailVerified} = await loginUser(login.email,login.password);
            console.log("emailVerified",emailVerified);
            
            if (emailVerified) {
                Alert.alert('Success','You are logged in');
                setLogin({
                    email:'',
                    password:''
                })
                dispatch(setLoginUser());
            }else{
                Alert.alert('Error','Email is not verified');
            }
        } catch (error) {
                Alert.alert('Error',error.message);
        }
    }
    return (
        <View style={styles.container}>
            <Text style={styles.loginText}>Login here</Text>
            <Text style={styles.welcomeText}>Welcome back you've been missed!</Text>
            <TextContainer
                type="signin"
                formData={login}
                handleSignin={handleSignin}
                setFormData={setLogin}
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
export default Login