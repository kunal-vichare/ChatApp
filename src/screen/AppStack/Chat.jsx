import { View, Text,StatusBar, ImageBackground, StyleSheet } from 'react-native'
import React from 'react'
import { ChatHeader, FlatList, TypeBox,ChatBody} from '../../component/MainTab/Chats'
import { colors } from '../../constant'
import WpWallpaper from '../../assets/image/wpBackground.png'
import { useRoute } from '@react-navigation/native'

const Chat = () => {
  const route = useRoute();
  const userId = route.params.userId;
  console.log("UserID",userId);
  
  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={colors.headerBack}
        barStyle="light-content"
      />
      <ChatHeader />
      <ImageBackground source={WpWallpaper} style={styles.wpWallpaper}>
        <ChatBody/>
      </ImageBackground>
      <TypeBox />
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