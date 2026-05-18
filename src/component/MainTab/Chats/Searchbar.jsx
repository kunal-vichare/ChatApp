import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import Search from 'react-native-vector-icons/Fontisto'
import { colors, margin, padding, radius } from '../../../constant'

const Searchbar = ({setSearch}) => {
  return (
    <View style={styles.searchContainer}>
        <Search name="search" size={20} style={styles.icon}/>
      <TextInput
        placeholder='Ask Meta AI or Search'
        style={styles.textIp}
        onChangeText={(val)=>setSearch(val)}
      />
    </View>
  )
}
const styles= StyleSheet.create({
    searchContainer:{
        flexDirection:'row',
        alignItems:'center',
        marginHorizontal:margin.xs,
        borderRadius:radius.xxxl,
        backgroundColor:colors.textIpBack,
        padding:padding.xxxs
    },
    icon:{
        paddingLeft:padding.regular
    },
    textIp : {
        paddingLeft:padding.sm
    }
})
export default Searchbar