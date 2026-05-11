import React from 'react';
import {View,TextInput,TouchableOpacity,StyleSheet,KeyboardAvoidingView,Platform,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../../constant';

const TypeBox = () => {
  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
    >
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            multiline
            placeholder="Type a message"
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    backgroundColor: colors.chatBack,
  },

  inputContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
    maxHeight: 120,
  },

  input: {
    fontSize: 16,
    paddingVertical: 15,
  },

  sendButton: {
    backgroundColor: '#075E54',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TypeBox;