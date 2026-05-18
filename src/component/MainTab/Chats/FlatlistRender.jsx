import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { StyleSheet } from 'react-native'
import { colors, fontFamily, fontSize, fontWeight, margin, padding } from '../../../constant'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import {getOrCreateChatroom} from '../../../database/firestoreCRUD'

const FlatlistRender = ({ item }) => {
    const navigation = useNavigation();
    const myUid = useSelector(state=>state.auth.user.uid);
    // console.log("item are: ",item);
    

      const handlePress = async () => {
      const chatroomId = item.chatId
      navigation.navigate('AppStack', {
        screen: 'ChatScreen',
        params: { chatroomId, otherUserId: item.id },
      });
    };

    return (
        <TouchableOpacity
            style={styles.btn}
            onPress={handlePress}
        >
            <View style={styles.leftContainer}>
                <Image source={{ uri: item.profileImage }} style={styles.image} />
                <View style={styles.msgContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.message}>{item.lastMessage}</Text>
                </View>
            </View>
            <View style={styles.rightContainer}>
                <Text style={styles.time}>{item.updatedAt}</Text>
                {/* <View style={styles.messageCountContainer}>
                <Text style={styles.messageCount}>4</Text>
            </View> */}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: margin.md,
        alignItems: 'center',
        flex: 1
    },
    image: {
        height: 54,
        width: 54,
        borderRadius: 27,
        marginHorizontal: margin.base
    },
    name: {
        fontWeight: fontWeight.bold,
        fontSize: fontSize.md,
        color: colors.secondary,
        fontFamily: fontFamily.popinsBold
    },
    msgContainer: {
        paddingTop: 3,
    },
    message: {
        fontWeight: fontWeight.medium,
        fontSize: fontSize.base,
        color: colors.message,
        fontFamily: fontFamily.popinsBold
    },
    time: {
        color: colors.time,
        fontWeight: fontWeight.bold,
        fontFamily: fontFamily.popinsBold,
        fontSize: fontSize.base,
    },
    rightContainer: {
        paddingRight: padding.base,
        gap: 3,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    messageCountContainer: {
        backgroundColor: colors.countBack,
        height: 22,
        width: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center'
    },
    messageCount: {
        fontWeight: fontWeight.bold,
        color: colors.primary
    },
    leftContainer: {
        flexDirection: 'row',
    },
})

export default FlatlistRender