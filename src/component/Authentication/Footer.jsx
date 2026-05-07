import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { TextInput } from 'react-native-paper'
import { colors, fontFamily, fontSize, fontWeight, gap, padding } from '../../constant';
// import {Facebook} from '../../assets/svg/Facebook'

const Footer = () => {
    const navigation = useNavigation();
  return (
<View style={styles.footerContainer}>
                <Text style={styles.continueText}>or continue with</Text>
                <View style={styles.footerIconContainer}>
                    <TouchableOpacity
                        style={styles.footerBtn}
                    >
                        <Text>
                            Hello
                        </Text>
                        {/* <Facebook/> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.footerBtn}
                    >
                        <Text>
                            Hello
                        </Text>
                        {/* <Google/> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.footerBtn}
                    >
                        <Text>
                            Hello
                        </Text>
                        {/* <Google/> */}
                    </TouchableOpacity>
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

export default Footer