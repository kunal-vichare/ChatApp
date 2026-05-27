import { View, Text, StatusBar, ImageBackground, StyleSheet, ActivityIndicator, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ChatHeader, FlatList, TypeBox, ChatBody } from '../../component/MainTab/Chats'
import { colors, padding } from '../../constant'
import WpWallpaper from '../../assets/image/wpBackground.png'
import { useRoute } from '@react-navigation/native'
import { LinkPreview } from 'react-native-preview-url'
import { subscribeToChatInfo } from '../../database/firestoreCRUD'
import VectorIcon from '../../utils/VectorIcons'
import Theme1 from '../../assets/image/theme1.jpg'
import Theme2 from '../../assets/image/theme2.jpg'
import Theme3 from '../../assets/image/theme3.jpg'

const Chat = () => {
  const route = useRoute();
  const [previewUrl, setPreviewUrl] = useState('');
  const [failedMessages, setFailedMessages] = useState([]);
  const [localMessages, setLocalMessages] = useState([]);
  const [chatInfo, setChatInfo] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchValue,setSearchValue]=useState("");
  const [theme, setTheme] = useState();
  const { chatroomId, otherUserId } = route.params;

  // Fetch chat metadata from Firestore
  useEffect(() => {
    if (!chatroomId) return;
    const unsubscribe = subscribeToChatInfo(chatroomId, setChatInfo);
    return () => unsubscribe();
  }, [chatroomId]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={searchVisible ? colors.primary : colors.headerBack}
        barStyle={searchVisible ? 'dark-content' : "light-content"}
      />
      {
        searchVisible ?
          <View style={styles.textContainer}>
            <VectorIcon
              name="keyboard-backspace"
              type="MaterialIcons"
              size={24}
              color={colors.secondary}
              onPress={() => setSearchVisible(false)}
              style={styles.icon}
            />
            <TextInput
              placeholder="Search for chat..."
              style={styles.textIp}
              value={searchValue}
              onChangeText={(val)=>setSearchValue(val)}
            />
            <VectorIcon
              name="content-paste-search"
              type="MaterialIcons"
              size={24}
              color={colors.secondary}
              style={styles.icon}
            />
          </View>
          :
          <ChatHeader userId={otherUserId} isGroup={chatInfo?.isGroup} groupName={chatInfo?.groupName} groupImage={chatInfo?.groupImage} chatroomId={chatroomId} setSearchVisible={setSearchVisible} theme={theme} setTheme={setTheme}/>
      }

      <ImageBackground source={theme==='first' ? Theme1 : theme==='second' ? Theme2 : theme==='third' ? Theme3 : WpWallpaper} style={styles.wpWallpaper}>
        <ChatBody chatroomId={chatroomId} failedMessages={failedMessages} setFailedMessages={setFailedMessages} otherUserId={otherUserId} localMessages={localMessages} replyTo={replyTo} setReplyTo={setReplyTo} searchValue={searchValue}
        />
        {
          previewUrl ? (
            <LinkPreview
              url={previewUrl}
              timeout={3000}
              onError={(error) => console.log(error)}
              containerStyle={{
                flexDirection: 'row',
                alignItems: 'center',
                maxWidth: '95%',
                borderRadius: 10,
                backgroundColor: colors.primary,
                marginHorizontal: 10,
                // marginBottom: 70,
                overflow: 'hidden',
                padding: 10,
              }}
              imageStyle={{
                height: 80,
                width: 150,
                borderRadius: 10,
                resizeMode: 'cover',
              }}
              textContainerStyle={{
                flex: 1,
                marginLeft: 10,
                justifyContent: 'center',
              }}
              titleStyle={{
                fontSize: 16,
                fontWeight: 'bold',
                color: colors.secondary,
              }}
              descriptionStyle={{
                fontSize: 13,
                color: '#666',
              }}
              urlStyle={{
                fontSize: 12,
                color: 'grey',
              }}
              titleLines={1}
              descriptionLines={2}
            />
          ) : null
        }
        <TypeBox
          chatroomId={chatroomId}
          setPreviewUrl={setPreviewUrl}
          otherUserId={otherUserId}
          isGroup={chatInfo?.isGroup}
          participants={chatInfo?.participants}
          onAddLocalMessage={(msg) => {
            setLocalMessages(prev => [msg, ...prev]);
          }}
          onRemoveLocalMessage={(tempId) => {
            setLocalMessages(prev =>
              prev.filter(m => m.id !== tempId)
            );
          }}
          onFail={(tempId, text) => {
            // Remove from local
            setLocalMessages(prev =>
              prev.filter(m => m.id !== tempId)
            );
            // Add to failed
            setFailedMessages(prev => [
              ...prev,
              { id: tempId, text, timestamp: new Date() }
            ]);
          }}
          replyTo={replyTo}
          setReplyTo={setReplyTo}
        />
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  wpWallpaper: {
    flex: 1,
    resizeMode: 'contain'
  },
  textContainer: {
    backgroundColor: '#ece5dd',
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
    margin:8,
    borderRadius:20
  },
  textIp: {
    flex: 1,
    paddingLeft: 5
  },
  icon:{
    paddingHorizontal:10
  }
})

export default Chat