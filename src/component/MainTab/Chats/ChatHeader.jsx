import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { colors, fontFamily, fontSize, fontWeight, iconSize, margin, padding } from '../../../constant'
import VectorIcon from '../../../utils/VectorIcons'
import { formatWhatsAppLastSeen } from '../../../utils/GetTime'
import { get_MemberCount, get_userInfo } from '../../../database/firestoreCRUD'

const ChatHeader = ({ userId, isGroup, groupName, chatroomId, groupImage }) => {
    const navigation = useNavigation();
    const [memberCount, setMemberCount] = useState(0);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (isGroup) {
            // Listen to group doc for member count
            get_MemberCount(chatroomId, setMemberCount);
        }
        // for 1 on 1 chat
        if (!userId) return;
        get_userInfo(userId, setUserData);
    }, [userId, isGroup, chatroomId]);

    return (
        <View style={styles.container}>
            <View style={styles.firstContainer}>
                <VectorIcon
                    type="Ionicons"
                    name="arrow-back"
                    size={iconSize.xxl}
                    color={colors.primary}
                    style={{ paddingLeft: 10 }}
                    onPress={() => navigation.goBack()}
                />
                <TouchableOpacity
                    style={styles.textContainer}
                    onPress={() => navigation.navigate('AppStack', {
                        screen: 'ProfileScreen',
                        params: isGroup
                            ? { isGroup: true, chatroomId }
                            : { isGroup: false, userData },
                    })}
                >
                    <Image source={isGroup ? { uri: groupImage } : { uri: userData?.profileImage }} style={styles.img} />
                    <View style={styles.textInnerContainer}>
                        <Text
                            style={styles.name}
                        >
                            {isGroup ? groupName : userData?.name}
                        </Text>
                        <Text style={styles.status} numberOfLines={1}>{isGroup ? `${memberCount} members` : (userData?.isOnline ? 'Online' : formatWhatsAppLastSeen(userData?.lastSeen))}</Text>
                    </View>
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
        paddingVertical: 10
        // marginTop: 20,
    },
    img: {
        height: 54,
        width: 54,
        resizeMode: 'contain',
        borderRadius: 27,
    },
    firstContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textInnerContainer: {
        marginLeft: 10
    },
    secondContainer: {
        flexDirection: 'row',
        gap: 15,
        marginRight: margin.base,
        alignItems: 'center'
    },
    textContainer: {
        paddingLeft: padding.xs,
        alignItems: 'center',
        maxWidth: 150,
        flexDirection: 'row'
    },
    name: {
        fontWeight: fontWeight.bold,
        fontSize: fontSize.md,
        color: colors.primary,
        fontFamily: fontFamily.popinsBold
    },
    status: {
        fontWeight: fontWeight.regular,
        fontSize: fontSize.base,
        color: colors.primary,
        fontFamily: fontFamily.popinsBold
    }
})
export default ChatHeader