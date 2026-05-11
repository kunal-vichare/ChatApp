import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native'
import React from 'react'
import BackIcon from '../../../assets/svg/Back'
import VideoIcon from '../../../assets/svg/VideoIcon'
import CallIcon from '../../../assets/svg/CallIcon'
import MenuIcon from '../../../assets/svg/MenuIcon'
import { useRoute } from '@react-navigation/native'
import { colors, fontFamily, fontSize, fontWeight, padding } from '../../../constant'
const ChatHeader = () => {
    const route = useRoute();
    const item = route.params?.item;
    return (
        <View style={styles.container}>
            <StatusBar         
                backgroundColor={colors.headerBack}
                barStyle="light-content" 
            />
            <View style={styles.firstContainer}>
                <View style={{ paddingHorizontal: 10 }}>
                    <BackIcon />
                </View>
                <Image source={require("../../../assets/image/Pic.jpg")} style={styles.img} />
                <View style={styles.textContainer}>
                    <Text style={styles.name}>
                        Kunal Vichare
                    </Text>
                    <Text style={styles.status}>
                        Online
                    </Text>
                </View>
            </View>
            <View style={styles.secondContainer}>
                <TouchableOpacity>
                    <VideoIcon />
                </TouchableOpacity>
                <TouchableOpacity>
                    <CallIcon />
                </TouchableOpacity>
                <TouchableOpacity>
                    <MenuIcon />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.headerBack,
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    img: {
        height: 54,
        width: 54,
        resizeMode: 'contain',
        borderRadius: 27,
        marginVertical:10
    },
    firstContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    secondContainer: {
        flexDirection: 'row',
        gap:20,
        paddingRight:padding.lg,
        alignItems:'center'
    },
    textContainer: {
        paddingLeft: padding.base,
    },
    name: {
        fontWeight: fontWeight.bold,
        fontSize: fontSize.regular,
        color: colors.primary,
        fontFamily: fontFamily.popinsBold
    },
    status: {
        fontWeight: fontWeight.regular,
        fontSize: fontSize.md,
        color: colors.primary,
        fontFamily: fontFamily.popinsBold
    }
})
export default ChatHeader