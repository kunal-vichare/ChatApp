import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'

const AllUserFlatlistData = ({ item }) => {
  return (
    <View style={styles.userContainer}>

      <Image
        source={{
          uri: item.profileImage || 'https://via.placeholder.com/100'
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

    </View>
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
        borderBottomWidth: 0.5,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
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