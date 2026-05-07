import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { colors, fontFamily, fontSize, fontWeight, padding } from '../../constant';
import TextContainer from '../../component/Authentication/TextContainer'
import Footer from '../../component/Authentication/Footer'

const Signup = () => {
  return (
        <View style={styles.container}>
            <Text style={styles.loginText}>Create Account</Text>
            <Text style={styles.welcomeText}>Join the conversation, anytime, anywhere.</Text>
            <TextContainer/>
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