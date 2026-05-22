import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const ReactionDisplay = ({ reactions = {}, myUid, onPress }) => {
    const entries = Object.entries(reactions);

    if (entries.length === 0) return null;

    return (
        <View style={styles.container}>
            {entries.map(([emoji, uids]) => (
                <TouchableOpacity
                    key={emoji}
                    style={[styles.badge, uids.includes(myUid) && styles.badgeActive]}
                    onPress={() => onPress(emoji)}
                >
                    <Text style={styles.emoji}>{emoji}</Text>
                    <Text style={styles.count}>{uids.length}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginTop: 4,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        paddingHorizontal: 7,
        paddingVertical: 3,
        gap: 3,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    badgeActive: {
        backgroundColor: '#e8f0fe',
        borderColor: '#4a90e2',
    },
    emoji: { fontSize: 14 },
    count: { fontSize: 12, color: '#555', fontWeight: '600' },
});

export default ReactionDisplay;