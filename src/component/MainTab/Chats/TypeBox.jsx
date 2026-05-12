import React, { useState } from 'react';
import {
  View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { colors } from '../../../constant';
import VectorIcon from '../../../utils/VectorIcons';

const TypeBox = () => {
  const [message, setMessage] = useState("");
  const [sendEnable, setSendEnable] = useState(false);
  return (
    <View
      style={styles.wrapper}
    >
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <View style={styles.firstView}>
            <VectorIcon
              type="MaterialIcons"
              name="emoji-emotions"
              size={24}
              color={colors.secondary}
            />
            <TextInput
              multiline
              placeholder="Type a message"
              value={message}
              style={styles.input}
              onChangeText={(val) => { setMessage(val); setSendEnable(true)}}
            />
          </View>
          <View style={styles.secondView}>
            <VectorIcon
              type="Entypo"
              name="attachment"
              size={18}
              color={colors.secondary}
            />
            {
              !sendEnable &&
              <>
                <VectorIcon
                  type="FontAwesome"
                  name="rupee"
                  size={20}
                  color={colors.secondary}
                  style={styles.iconStyle}
                />
                <VectorIcon
                  type="FontAwesome"
                  name="camera"
                  size={18}
                  color={colors.secondary}
                />
              </>
            }
          </View>
        </View>

        <TouchableOpacity style={styles.sendButton}>
          {
            !sendEnable ?
              <VectorIcon
                type="MaterialCommunityIcons"
                name="microphone"
                size={25}
                color={colors.primary}
              />
              :
              <VectorIcon
                type="MaterialCommunityIcons"
                name="send"
                size={25}
                color={colors.primary}
                onPress={()=>{setMessage('');setSendEnable(false)}}
              />
          }
        </TouchableOpacity>
      </View>
    </View>
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
    paddingBottom:7
  },

  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginRight: 10,
    maxHeight: 120,
    justifyContent: 'space-between'
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
  firstView: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  },
  secondView: {
    flexDirection: 'row',
    gap: 20
  }
});

export default TypeBox;