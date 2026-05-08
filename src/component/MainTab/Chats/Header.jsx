import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import Menu from 'react-native-vector-icons/Entypo'
import Camera from 'react-native-vector-icons/Feather'
import { colors, fontSize, fontWeight, gap, padding } from '../../../constant'

const Header = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>Chat Mate</Text>
      <View style={styles.btnContainer}>
        <TouchableOpacity
            style={styles.btn}
            onPress={()=>console.log("Button Pressed")}        
        >
            <Menu name ="add-user" size={fontSize.xl} />
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.btn}
            onPress={()=>console.log("Button Pressed")}        
        >
            <Camera name ="camera" size={fontSize.xl} />
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.btn}
            onPress={()=>console.log("Button Pressed")}        
        >
            <Menu name ="dots-three-vertical" size={fontSize.xl} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container : {
        flexDirection:'row',
        justifyContent:'space-between',
        paddingVertical:padding.xs,
        paddingHorizontal:padding.xs,
        alignItems:'center'
    },
    mainText:{
        fontSize:fontSize.titleXs,
        color:colors.wp,
        fontWeight:fontWeight.max,
        paddingLeft:padding.base,
    },
    btnContainer:{
        flexDirection:'row',
        gap:gap.lg
    }
})

export default Header