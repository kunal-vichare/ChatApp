import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const AllUserFlatlistData = ({ item }) => {
  const navigation = useNavigation();
  const onNavigate =(userId)=>{
    navigation.navigate("ChatScreen",{
      userId:userId
    })
  }
  return (
    <TouchableOpacity 
      style={styles.userContainer}
      onPress={()=>onNavigate(item.uid)}
    >

      <Image
        source={{
          uri: item.profileImage || 'https://png.pngtree.com/png-vector/20250512/ourmid/pngtree-default-avatar-profile-icon-gray-placeholder-vector-png-image_16213764.png'
        }}
        style={styles.image}
      />

      <View>
        <Text style={styles.name}>
          {item.name}
        </Text>

        <Text style={styles.about}>
          {item.about}
        </Text>
      </View>

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        resizeMode:'cover'
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
    },
    about: {
        fontSize: 14,
        color: 'gray',
        marginTop: 2,
    }
})

export default AllUserFlatlistData