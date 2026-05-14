import { View, Text,StatusBar, ImageBackground, StyleSheet } from 'react-native'
import React from 'react'
import { ChatHeader, FlatList, TypeBox,ChatBody} from '../../component/MainTab/Chats'
import { colors } from '../../constant'
import WpWallpaper from '../../assets/image/wpBackground.png'
import { useRoute } from '@react-navigation/native'

const Chat = () => {
  const route = useRoute();
  const { chatroomId, otherUserId } = route.params;
  // console.log("ChatroomID: ",chatroomId,"otherUserId: ",otherUserId);
  
  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={colors.headerBack}
        barStyle="light-content"
      />
      <ChatHeader userId={otherUserId}/>
      <ImageBackground source={WpWallpaper} style={styles.wpWallpaper}>
        <ChatBody chatroomId={chatroomId}/>
      </ImageBackground>
      <TypeBox chatroomId={chatroomId}/>
    </View>
  )
}

const styles = StyleSheet.create({
  wpWallpaper:{
   flex:1,
   resizeMode:'contain'
  }
})

export default Chat