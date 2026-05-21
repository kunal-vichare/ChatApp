import { View, Text, StatusBar, ImageBackground, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { ChatHeader, FlatList, TypeBox, ChatBody } from '../../component/MainTab/Chats'
import { colors } from '../../constant'
import WpWallpaper from '../../assets/image/wpBackground.png'
import { useRoute } from '@react-navigation/native'
import { LinkPreview } from 'react-native-preview-url'
import { Timestamp } from '@react-native-firebase/firestore'

const Chat = () => {
  const route = useRoute();
  const [previewUrl, setPreviewUrl] = useState('');
  const [failedMessages, setFailedMessages] = useState([]);

  const { chatroomId, otherUserId } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={colors.headerBack}
        barStyle="light-content"
      />
      <ChatHeader userId={otherUserId} />
      <ImageBackground source={WpWallpaper} style={styles.wpWallpaper}>
        <ChatBody chatroomId={chatroomId} failedMessages={failedMessages} setFailedMessages={setFailedMessages} otherUserId={otherUserId}/>
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
        onFail={(text)=>{
          setFailedMessages(prev=>[
            ...prev,
            {
              id:Date.now().toString(),
              text:text,
              timestamp : new Date(),
            }
          ])
        }}
      />
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  wpWallpaper: {
    flex: 1,
    resizeMode: 'contain'
  }
})

export default Chat