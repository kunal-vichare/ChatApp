import { View, Text, TouchableOpacity, StyleSheet,Image } from 'react-native'
import React from 'react'
import { colors } from '../../../constant'

const ChatLinkPreview = ({ urlPreview }) => {
    return (
        <View
            pointerEvents='none'
            // activeOpacity={0.8}
            style={styles.linkPreviewContainer}
        >
            {urlPreview.image && (
                <Image
                    source={{ uri: urlPreview.image }}
                    style={styles.linkPreviewImage}
                />
            )}

            <View style={styles.linkPreviewTextContainer}>
                <Text
                    numberOfLines={1}
                    style={styles.linkPreviewTitle}
                >
                    {urlPreview.title}
                </Text>

                <Text
                    numberOfLines={2}
                    style={styles.linkPreviewDesc}
                >
                    {urlPreview.description}
                </Text>

                <Text style={styles.linkPreviewUrl}>
                    {urlPreview.siteName}
                </Text>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    linkPreviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: '#fff',
        padding: 4,
        maxWidth: '99%'
    },
linkPreviewImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    resizeMode: 'cover',
},
    linkPreviewTextContainer: {
        marginLeft: 8,
        justifyContent: 'center',
    },
    linkPreviewTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.secondary,
    },
    linkPreviewDesc: {
        fontSize: 11,
        maxWidth:140,
        color: '#666',
    },
    linkPreviewUrl: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
},
})

export default ChatLinkPreview