import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { colors, fontSize, fontWeight, gap, padding } from '../../../constant'
import VectorIcons from '../../../utils/VectorIcons'

const Header = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>Chat Mate</Text>
      <View style={styles.btnContainer}>
        <TouchableOpacity
            style={styles.btn}
            onPress={()=>console.log("Button Pressed")}        
        >
            <VectorIcons type="Entypo" name="add-user" size={fontSize.xl}/>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.btn}
            onPress={()=>console.log("Button Pressed")}        
        >
            <VectorIcons type="Feather" name="camera" size={fontSize.xl}/>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.btn}
            onPress={()=>console.log("Button Pressed")}        
        >
            <VectorIcons type="Entypo" name="dots-three-vertical" size={fontSize.xl}/>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container : {
        flexDirection:'row',
        justifyContent:'space-between',
        paddingBottom:padding.regular,
        paddingTop:40,
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