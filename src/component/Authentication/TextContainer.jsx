import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { TextInput } from 'react-native-paper'
import { colors, fontFamily, fontSize, fontWeight, gap, padding } from '../../constant';

const TextContainer = ({formData,setFormData,type,handleRegister,handleSignin}) => {
    const signup = type==="signup";
    const navigation = useNavigation();
    const styles = StyleSheet.create({
    textContainer: {
        paddingTop: signup? padding.regular : padding.headingXs,
        marginHorizontal: 35,
        gap: signup ? 18 : gap.xxxl 
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
        color: colors.createAcc,
        textDecorationLine: 'underline',
    }
})
  return (
<View style={styles.textContainer}>
                { signup &&
                <View style={styles.textIpContainer}>
                    <TextInput
                        label='Enter Name'
                        value={formData.name}
                        onChangeText={(text)=>
                            setFormData((prev)=>({
                                ...prev,
                                name:text
                            }))
                        }
                        style={styles.textInput}
                        mode='outlined'
                        activeOutlineColor={colors.title}
                    />
                </View>
                }
                <View style={styles.textIpContainer}>
                    <TextInput
                        label='Email'
                        keyboardType='email-address'
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
                        onPress={()=>handleSignin()}
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

export default TextContainer