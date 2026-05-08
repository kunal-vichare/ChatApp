import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { TextInput } from 'react-native-paper'
import { colors, fontFamily, fontSize, fontWeight, gap, padding } from '../../constant';
import { useDispatch } from 'react-redux';
import {login} from '../../redux/slice/auth'

const TextContainer = ({formData,setFormData,type,handleRegister}) => {
    const signup = type==="signup";
    const navigation = useNavigation();
    const dispatch = useDispatch();
  return (
<View style={styles.textContainer}>
                <View style={styles.textIpContainer}>
                    <TextInput
                        label='Email'
                        value={formData.email}
                        onChangeText={(text)=>
                            setFormData(prev=>({
                                ...prev,
                                email:text
                            }))
                        }
                        style={styles.textInput}
                        mode='outlined'
                        activeOutlineColor={colors.title}
                    />
                </View>
                <View style={styles.textIpContainer}>
                    <TextInput
                        label='Password'
                        value={formData.password}
                        onChangeText={(text)=>{
                            setFormData(prev=>({
                                ...prev,
                                password:text
                            }))
                        }}
                        style={styles.textInput}
                        mode='outlined'
                        activeOutlineColor={colors.title}
                    />
                </View>
                { signup &&
                <View style={styles.textIpContainer}>
                    <TextInput
                        label='Confirm Password'
                        value={formData.confirmPassword}
                        onChangeText={(text)=>
                            setFormData((prev)=>({
                                ...prev,
                                confirmPassword:text
                            }))
                        }
                        style={styles.textInput}
                        mode='outlined'
                        activeOutlineColor={colors.title}
                    />
                </View>
                }

                <View style={styles.fgtContainer}>
                        {
                            !signup &&
                    <TouchableOpacity 
                        style={styles.fgtBtn}
                        onPress={()=>navigation.navigate("ForgotScreen")}
                    >
                        <Text style={styles.fgtText}>
                            Forgot Your Password?
                        </Text>
                    </TouchableOpacity>
                        }
                </View>
                <View style={styles.btnContainer}>
                    {
                        signup?
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={()=>handleRegister()}
                    >
                        <Text
                            style={styles.btnText}
                        >
                            Sign up
                        </Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                        style={styles.btn}
                        onPress={()=>dispatch(login())}
                        >
                        <Text
                            style={styles.btnText}
                        >
                            Sign in
                        </Text>
                    </TouchableOpacity>
                        }
                </View>
                <View style={styles.btnContainer}>
                    {
                        signup?
                    <TouchableOpacity
                        style={styles.createBtn}
                        onPress={()=>navigation.replace("LoginScreen")}
                    >
                        <Text
                            style={styles.createBtnText}
                        >
                            Already have an Account
                        </Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                        style={styles.createBtn}
                        onPress={()=>navigation.replace("SignupScreen")}
                    >
                        <Text
                            style={styles.createBtnText}
                        >
                            Don't have account Register Now
                        </Text>
                    </TouchableOpacity>
                    }
                </View>
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
    },
    textContainer: {
        paddingTop: padding.headingXs,
        marginHorizontal: 35,
        gap: gap.xxxl
    },
    textIpContainer: {
        // borderRadius:10
    },
    textInput: {

    },
    fgtContainer: {
        // flex:1,
        alignSelf: 'flex-end',
    },
    fgtBtn: {

    },
    fgtText: {
        fontFamily: fontFamily.popinsBold,
        fontWeight: fontWeight.highlight,
        fontSize: fontSize.base,
        color: colors.title

    },
    btnContainer: {
        alignItems: 'center',
    },
    btn: {
        backgroundColor: colors.title,
        borderRadius: 10
    },
    btnText: {
        paddingVertical: padding.base,
        paddingHorizontal: padding.bigMs,
        color: colors.primary,
        fontFamily: fontFamily.popinsBold,
        fontWeight: fontWeight.highlight,
        fontSize: fontSize.lg
    },
    createBtn: {

    },
    createBtnText: {
        paddingVertical: padding.xs,
        fontFamily: fontFamily.popinsBold,
        fontWeight: fontWeight.highlight,
        fontSize: fontSize.base,
        color: colors.createAcc
    },
    footerContainer: {
        paddingTop: padding.headingXs,
        alignItems: 'center'
        // paddingHorizontal:114
    },
    continueContainer: {

    },
    continueText: {
        fontFamily: fontFamily.popinsBold,
        fontWeight: fontWeight.bold,
        fontSize: fontSize.base,
        color: colors.title
    },
    footerIconContainer: {
        flexDirection: 'row',
        gap: gap.xs,
        paddingTop: padding.lg
    },
    footerBtn: {
        backgroundColor: colors.footerBtnBack,
        paddingVertical: padding.xs,
        paddingHorizontal: padding.regular
    }
})

export default TextContainer