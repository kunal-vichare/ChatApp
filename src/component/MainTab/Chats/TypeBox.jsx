import React, { useEffect, useRef, useState } from 'react';
import {
  View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { colors } from '../../../constant';
import VectorIcon from '../../../utils/VectorIcons';
import { generateId, getUserName, resetUnreadCount, sendMessage, setTypingStatus } from '../../../database/firestoreCRUD'
import { useSelector } from 'react-redux';

const TypeBox = ({ chatroomId, setPreviewUrl, otherUserId, onAddLocalMessage, onRemoveLocalMessage, onFail, replyTo, setReplyTo,participants, isGroup,message,setMessage }) => {
  const [sendEnable, setSendEnable] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const myUid = useSelector(state => state.auth.user.uid);
  const [myName, setMyName] = useState('');
  const typingTimeoutRef = useRef(null);
  useEffect(() => {
      getUserName(myUid).then(name => setMyName(name || ''));
  }, [myUid]);

  const receiverIds = isGroup
    ? (participants || []).filter(uid => uid !== myUid)
    : [otherUserId];

  const updateTypingStatus = async (isTyping) => {
    try {
      setTypingStatus(chatroomId,myUid,isTyping);
    } catch (error) {
      console.log('typing update error:', error);
    }
  };

  const urlMatch = message.match(/(https?:\/\/[^\s]+)/g);
  const urlPreview = urlMatch ? urlMatch[0] : null;

  const handleTextChange = (text) => {
    setMessage(text);
    setSendEnable(text.trim().length > 0);
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    if (match && match[0]) {
      setPreviewUrl(match[0]);
    } else {
      setPreviewUrl('');
    }
    updateTypingStatus(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      updateTypingStatus(false);
    }, 2000);

  };

  useEffect(() => {
    const resetUnread = async () => {
      resetUnreadCount(chatroomId,myUid);
    }
    resetUnread();
  }, [myUid]);

  useEffect(() => {
    return () => {
      // Clear typing status when user leaves the screen
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      updateTypingStatus(false);
    };
  }, []);

  const handleSend = async () => {
    // !message.trim()) => removes spaces from start and end so handle sending empty spaces as message
    if (isSending || !message.trim()) return; //prevent duplicate tap
    const msgText = message;
    const messageId = generateId(chatroomId);
    // const tempId = `temp_${Date.now()}`;
    const optimisticMsg = {
      id: messageId,
      text: msgText,
      senderId: myUid,
      senderName: myName,
      timestamp: {
        toDate: () => new Date(),
        toMillis: () => Date.now(),
      },
      status: 'pending',
      isLocal: true,
    };
    onAddLocalMessage(optimisticMsg);
    try {
      setIsSending(true);
      await sendMessage(messageId,chatroomId, message, myUid, myName, isGroup ? receiverIds : otherUserId, replyTo ? { id: replyTo.id, text: replyTo.text, senderName: replyTo.senderName } : null, urlPreview);
      setReplyTo(null);
      onRemoveLocalMessage(messageId);
      setMessage('');
      setSendEnable(false);
      setPreviewUrl('');

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      };
      await updateTypingStatus(false);
    } catch (error) {
      console.error(error);
      onFail?.(messageId, msgText);
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
              !sendEnable && (
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
              )}
          </View>
        </View>

        <TouchableOpacity
          style={styles.sendButton}
          disabled={isSending}
          onPress={sendEnable ? handleSend : null}
        >
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
              // onPress={handleSend}

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
    flex: 1,
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
    flex: 1,
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