import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation} from '@react-navigation/native'
import { colors, fontFamily, fontSize, fontWeight, iconSize, padding } from '../../../constant'
import VectorIcon from '../../../utils/VectorIcons'
import firestore from '@react-native-firebase/firestore';
import {formatWhatsAppLastSeen} from '../../../utils/GetTime'

const ChatHeader = ({ userId }) => {
    const navigation = useNavigation();
    const [userData, setUserData] = useState(null);  

    useEffect(() => {
    if (!userId) return;

    // Realtime listener
    const unsubscribe = firestore()
        .collection('users')
        .doc(userId)
        .onSnapshot(
            snapshot => {
                if (snapshot?.data()) {
                    setUserData(snapshot.data());
                }
            },
            error => {
                console.log('Realtime user fetch error:', error);
            }
        );

    // Cleanup listener
    return () => unsubscribe();
}, [userId]);

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
                        onPress={() => navigation.goBack()}
                    />
                </View>
                <Image source={{ uri: userData?.profileImage }} style={styles.img} />
                <TouchableOpacity 
                    style={styles.textContainer}
                    onPress={()=>navigation.navigate('AppStack',{
                        screen:'ProfileScreen',
                        params: { userData : userData },
                    })}
                >
                    <Text
                        style={styles.name}
                    >
                        {userData?.name}
                    </Text>
                    {
                        userData?.isOnline ?
                            <Text style={styles.status}>
                                Online
                            </Text>
                            :
                            <Text style={styles.status} ellipsizeMode='tail'
                                numberOfLines={1}
                            >
                                {
                                    formatWhatsAppLastSeen(userData?.lastSeen)
                                }
                            </Text>
                    }
                </TouchableOpacity>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        // paddingTop: 30
    },
    img: {
        height: 54,
        width: 54,
        resizeMode: 'contain',
        borderRadius: 27,
        marginTop: 20,
        marginBottom: 10
    },
    firstContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    secondContainer: {
        flexDirection: 'row',
        gap: 20,
        paddingRight: padding.lg,
        alignItems: 'center'
    },
    textContainer: {
        paddingLeft: padding.base,
        maxWidth: 155,
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