import { View, Text,StyleSheet,TouchableOpacity,ActivityIndicator } from 'react-native'
import React,{useState} from 'react'
import { colors } from '../../../constant';
import VectorIcon from '../../../utils/VectorIcons';


const FailedMessage = ({ msg, onRetry, onDismiss,retrying}) => {
        
return (
        <View style={styles.failedContainer}>
            <View style={styles.failedBubble}>
                <Text style={styles.failedText}>{msg.text}</Text>
                <Text style={styles.failedMeta}>Failed to send</Text>
            </View>

            <View style={styles.failedActions}>
                {/* Retry button */}
                <TouchableOpacity
                    style={styles.retryBtn}
                    onPress={() => onRetry(msg)}
                    disabled={retrying}
                >
                    {retrying ? (
                        <ActivityIndicator size="small" color="black" />
                    ) : (
                        <VectorIcon
                            type="MaterialIcons"
                            name="refresh"
                            size={14}
                            color="black"
                        />
                    )}
                    <Text style={styles.retryBtnText}>
                        {retrying ? 'Retrying...' : 'Retry'}
                    </Text>
                </TouchableOpacity>

                {/* Dismiss button */}
                <TouchableOpacity
                    style={styles.dismissBtn}
                    onPress={onDismiss}
                >
                    <VectorIcon
                        type="Ionicons"
                        name="close"
                        size={14}
                        color="red"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    failedContainer: {
    flexDirection:  'row',
    justifyContent: 'flex-end',
    alignItems:     'center',
    paddingHorizontal: 10,
    marginVertical: 4,
    gap: 6,
},
failedBubble: {
    backgroundColor: '#ffe5e5',
    borderWidth:     1,
    borderColor:     '#ff4444',
    borderRadius:    12,
    paddingVertical:   8,
    paddingHorizontal: 12,
    maxWidth:        '70%',
},
failedText: {
    fontSize: 13,
    color:    '#333',
},
failedMeta: {
    fontSize:  10,
    color:     'red',
    marginTop:  3,
},
failedActions: {
    flexDirection: 'row',
    alignItems:    'center',
    gap: 6,
},
retryBtn: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: colors.tertiary,
    paddingVertical:   5,
    paddingHorizontal: 8,
    borderRadius:    8,
    gap: 3,
},
retryBtnText: {
    color:    'black',
    fontSize: 11,
},
dismissBtn: {
    padding: 4,
},
})

export default FailedMessage