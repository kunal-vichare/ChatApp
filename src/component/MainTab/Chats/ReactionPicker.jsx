import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Pressable } from 'react-native'
import React from 'react'

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const ReactionPicker = ({ visible, onSelect, onClose}) => {
    if (!visible) return null;

    return (
        <>
            <Pressable style={styles.backdrop} onPress={onClose} />

            <View style={styles.container}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.emojiRow}
                >
                    {EMOJIS.map(emoji => (
                        <TouchableOpacity
                            key={emoji}
                            onPress={() => { onSelect(emoji); onClose(); }}
                            style={styles.emojiBtn}
                        >
                            <Text style={styles.emoji}>{emoji}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: 'rgba(0,0,0,0.25)',
        zIndex: 10,
    },
    container: {
        position: 'absolute',
        bottom: 70,
        left: 16,
        right: 16,
        backgroundColor: '#fff',
        borderRadius: 18,
        paddingVertical: 10,
        paddingHorizontal: 6,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        zIndex: 11,
    },
    emojiRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        gap: 4,
    },
    emojiBtn: {
        padding: 6,
    },
    emoji: {
        fontSize: 28,
    },
});

export default ReactionPicker;