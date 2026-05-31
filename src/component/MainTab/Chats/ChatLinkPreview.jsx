import { View, Text, TouchableOpacity, StyleSheet,Image } from 'react-native'
import React from 'react'
import { colors } from '../../../constant'

const ChatLinkPreview = ({ urlPreview }) => {
    return (
        <View
            pointerEvents='none'
            style={styles.linkPreviewContainer}
        >
            {urlPreview?.image && (
                <Image
                    source={{ uri: urlPreview?.image }}
                    style={styles.linkPreviewImage}
                    resizeMode='stretch'
                />
            )}

            <View style={styles.linkPreviewTextContainer}>
                <Text
                    numberOfLines={1}
                    ellipsizeMode='tail'
                    style={styles.linkPreviewTitle}
                >
                    {urlPreview.title}
                </Text>

                <Text
                    numberOfLines={2}
                    ellipsizeMode='tail'
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
        width: 260, // fixed width like WhatsApp
        maxWidth: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 0.5,
        borderColor: '#ddd',
        marginTop: 4,
    },

    linkPreviewImage: {
        width: 80,
        height: 80,
        resizeMode: 'cover',
        backgroundColor: '#e5e5e5',
    },

    linkPreviewTextContainer: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 8,
        justifyContent: 'center',
        minWidth: 0, // VERY IMPORTANT for text truncation
    },

    linkPreviewTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#111',
        marginBottom: 3,
    },

    linkPreviewDesc: {
        fontSize: 11,
        color: '#666',
        lineHeight: 15,
    },

    linkPreviewUrl: {
        fontSize: 10,
        color: '#777',
        marginTop: 6,
        fontWeight: '600',
    },
})

export default ChatLinkPreview