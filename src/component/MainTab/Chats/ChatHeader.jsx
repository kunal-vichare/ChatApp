import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { colors, fontFamily, fontSize, fontWeight, iconSize, padding } from '../../../constant'
import VectorIcon from '../../../utils/VectorIcons'
import firestore from '@react-native-firebase/firestore';

const ChatHeader = ({userId}) => {
    const navigation = useNavigation();

    const getUserDetails=async()=>{
        const usersSnapshot = await firestore().collection('users').get();
        console.log("UserSnapshot",usersSnapshot);

    }
    // getUserDetails();

    return (
        <View style={styles.container}>
            <View style={styles.firstContainer}>
                <View style={{ paddingHorizontal: 10 }}>
                    {/* <BackIcon /> */}
                    <VectorIcon 
                        type="Ionicons"
                        name="arrow-back"
                        size={iconSize.xxl}
                        color={colors.primary}
                        onPress={()=>navigation.goBack()}
                    />
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
                    <VectorIcon 
                        type="Ionicons"
                        name="videocam"
                        size={iconSize.xxl}
                        color={colors.primary}
                    />                    
                </TouchableOpacity>
                <TouchableOpacity>
                    <VectorIcon 
                        type="FontAwesome5"
                        name="phone-alt"
                        size={iconSize.xxl}
                        color={colors.primary}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <VectorIcon 
                        type="Entypo"
                        name="dots-three-vertical"
                        size={iconSize.xxl}
                        color={colors.primary}
                    />
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
        marginTop:20,
        marginBottom:10
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