import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { colors, fontFamily, fontSize, fontWeight, iconSize, padding } from '../../../constant'
import VectorIcon from '../../../utils/VectorIcons'
import firestore from '@react-native-firebase/firestore';

const ChatHeader = ({userId}) => {
    const navigation = useNavigation();
    console.log("UserId in chatHeader: ",userId);
    const [userData,setUserData]=useState(null);

    useEffect(()=>{
        getUserDetails();
    },[userId]);
    
    const getUserDetails=async()=>{
        try {
            const usersSnapshot = await firestore().collection('users').doc(userId).get();
            console.log("UserSnapshot",usersSnapshot.data());
            setUserData(usersSnapshot.data());            
        } catch (error) {
            console.log("Error: ",error);
        }
    }

    function formatWhatsAppLastSeen(timestampMs) {
        const date = new Date(timestampMs);
        const now = new Date();
    
    // Reset hours to compare calendar days
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const timeString = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    
    if (date >= today) {
        return `last seen today at ${timeString}`;
    } else if (date >= yesterday) {
        return `last seen yesterday at ${timeString}`;
    } else {
        const dateString = date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
        return `last seen on ${dateString} at ${timeString}`;
    }
}

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
                <Image source={{uri:userData?.profileImage}} style={styles.img} />
                <View style={styles.textContainer}>
                    <Text 
                        style={styles.name}
                    >
                        {userData?.name}
                    </Text>
                    {
                        userData?.isOnline? 
                    <Text style={styles.status}>
                       Online
                    </Text>
                    :
                    <Text style={styles.status}                         ellipsizeMode='tail'
                    numberOfLines={1}
                    >
                        {
                            formatWhatsAppLastSeen(userData?.lastSeen)
                        }     
                    </Text>
                    }
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
        alignItems:'center',
        paddingTop:30
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
        maxWidth:175
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