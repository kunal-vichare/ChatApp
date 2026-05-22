import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native'
import React from 'react'

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const ReactionPicker = ({ visible, onSelect, onClose }) => {
    if (!visible) return null;
    return (
        <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <View style={styles.picker}>
                    {EMOJIS.map(emoji => (
                        <TouchableOpacity
                            key={emoji}
                            onPress={() => {
                                onSelect(emoji);
                                onClose();
                            }}
                            style={styles.emojiBtn}
                        >
                            <Text style={styles.emoji}>{emoji}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </TouchableOpacity>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    picker: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingHorizontal: 10,
        paddingVertical: 8,
        gap: 8,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    emojiBtn: {
        padding: 4,
    },
    emoji: {
        fontSize: 26,
    },
});

export default ReactionPicker