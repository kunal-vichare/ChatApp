import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { colors, fontFamily, fontSize, fontWeight, iconSize, margin, padding } from '../../../constant'
import VectorIcon from '../../../utils/VectorIcons'
import { formatWhatsAppLastSeen } from '../../../utils/GetTime'
import { get_MemberCount, get_userInfo } from '../../../database/firestoreCRUD'
import { Divider, Menu } from 'react-native-paper'
import Theme1 from '../../../assets/image/theme1.jpg'

const ChatHeader = ({ userId, isGroup, groupName, chatroomId, groupImage, setSearchVisible }) => {
    const navigation = useNavigation();
    const [memberCount, setMemberCount] = useState(0);
    const [visible, setVisible] = useState(false);
    const [userData, setUserData] = useState(null);
    const [showModal, setShowModal] = useState(false);

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
                    <Image source={isGroup ? { uri: groupImage } : { uri: userData?.profileImage }} style={styles.img} resizeMode='contain' />
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
                <VectorIcon
                    type="Ionicons"
                    name="videocam"
                    size={iconSize.xxl}
                    color={colors.primary}
                />
                <VectorIcon
                    type="FontAwesome5"
                    name="phone-alt"
                    size={iconSize.xxl}
                    color={colors.primary}
                />
                <Menu
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    anchor={
                        <VectorIcon
                            type="Entypo"
                            name="dots-three-vertical"
                            size={iconSize.xxl}
                            color={colors.primary}
                            onPress={() => setVisible(true)}
                        />
                    }
                >
                    <Menu.Item
                        onPress={() => {
                            navigation.navigate('AppStack', {
                                screen: 'AllUserScreen'
                            }); setVisible(false)
                        }
                        }
                        leadingIcon="account-multiple"
                        title="New group"
                    />
                    <Divider />
                    <Menu.Item
                        onPress={() => {
                            navigation.navigate('AppStack', {
                                screen: 'ProfileScreen',
                                params: isGroup
                                    ? { isGroup: true, chatroomId }
                                    : { isGroup: false, userData },
                            }); setVisible(false)
                        }
                        }
                        leadingIcon="account-outline"
                        title="View contact"
                    />
                    <Menu.Item
                        onPress={() => { setSearchVisible(true); setVisible(false) }}
                        leadingIcon="email-search-outline"
                        title="Search"
                    />
                    <Menu.Item
                        onPress={() => { setShowModal(true); setVisible(false) }}
                        leadingIcon="theme-light-dark"
                        title="Chat theme"
                    />
                    <Menu.Item
                        onPress={() => { setVisible(false) }}
                        leadingIcon="format-clear"
                        title="Clear chat"
                    />
                    <Divider />
                    <Menu.Item
                        onPress={() => { setVisible(false) }}
                        leadingIcon="more"
                        title="More"
                    />
                </Menu>
            </View>
            <Modal
                visible={showModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.imageContainer}>
                            <Image source={Theme1} resizeMethod='contain' style={{height:100,width:50}} />
                            <Image source={Theme1} resizeMethod='contain' style={{height:100,width:50}} />
                            <Image source={Theme1} resizeMethod='contain' style={{height:100,width:50}} />
                        </View>

                        <TouchableOpacity
                            onPress={() => setShowModal(false)}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>
                                Apply Theme
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
    },

    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    button: {
        backgroundColor: 'blue',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },

    buttonText: {
        color: colors.primary,
        fontWeight: 'bold',
    }
})
export default ChatHeader