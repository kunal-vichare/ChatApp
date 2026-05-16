import React, { useState } from 'react';
import {
  View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { colors } from '../../../constant';
import VectorIcon from '../../../utils/VectorIcons';
import { sendMessage } from '../../../database/firestoreCRUD'
import firestore from '@react-native-firebase/firestore';
import { useSelector } from 'react-redux';

const TypeBox = ({ chatroomId, setPreviewUrl }) => {
  const [sendEnable, setSendEnable] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const myUid = useSelector(state => state.auth.user.uid);

  const handleTextChange = (text) => {
    setMessage(text);
    setSendEnable(true);

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);

    if (match && match[0]) {
      setPreviewUrl(match[0]);
    } else {
      setPreviewUrl('');
    }
  };

  const handleSend = async () => {
    // !message.trim()) => removes spaces from start and end so handle sending empty spaces as message
    if (isSending || !message.trim()) return; //prevent duplicate tap

    try {
      setIsSending(true);
      await sendMessage(chatroomId, message, myUid);
      setMessage('');
      setSendEnable(false);
      setPreviewUrl('')
    } catch (error) {
      console.log(error);
    } finally {
      setIsSending(false);
    }

  };
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
              onChangeText={handleTextChange}
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
            !sendEnable ? (
              <VectorIcon
                type="MaterialCommunityIcons"
                name="microphone"
                size={25}
                color={colors.primary}
              />
            ) : isSending ? (
              <ActivityIndicator
                size="small"
                color={colors.primary}
              />
            ) : (
              <VectorIcon
                type="MaterialCommunityIcons"
                name="send"
                size={25}
                color={colors.primary}
                onPress={handleSend}
              />
            )
          }
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {

  },

  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 30,
    paddingHorizontal: 15,
    marginRight: 10,
    minHeight: 50,
    maxHeight: 120,
    justifyContent: 'space-between'
  },

  input: {
    fontSize: 16,
    paddingVertical: 12,
  },

  sendButton: {
    backgroundColor: '#075E54',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3
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