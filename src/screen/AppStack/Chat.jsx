import { View, Text, StatusBar, ImageBackground, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { ChatHeader, FlatList, TypeBox, ChatBody } from '../../component/MainTab/Chats'
import { colors } from '../../constant'
import WpWallpaper from '../../assets/image/wpBackground.png'
import { useRoute } from '@react-navigation/native'
import { LinkPreview } from 'react-native-preview-url'

const Chat = () => {
  const route = useRoute();
  const [previewUrl, setPreviewUrl] = useState('');

  const { chatroomId, otherUserId } = route.params;
  // console.log("ChatroomID: ",chatroomId,"otherUserId: ",otherUserId);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={colors.headerBack}
        barStyle="light-content"
      />
      <ChatHeader userId={otherUserId} />
      <ImageBackground source={WpWallpaper} style={styles.wpWallpaper}>
        <ChatBody chatroomId={chatroomId} />
        {
          previewUrl ? (
            <LinkPreview
              url={previewUrl}
              // loaderComponent={<ActivityIndicator />}
              timeout={3000}
              onError={(error) => console.log(error)}
              containerStyle={{
                maxWidth:'95%',
                borderRadius: 10,
                backgroundColor: colors.primary,
                marginHorizontal: 10,
                marginBottom:70,
              }}
              imageStyle={{
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                height: 180,
                width:'100%',
                resizeMode:'cover'
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
              descriptionLines={1}
            />
          ) : null
        }
      </ImageBackground>
      <TypeBox chatroomId={chatroomId} setPreviewUrl={setPreviewUrl} />
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