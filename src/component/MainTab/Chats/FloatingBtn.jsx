import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import FloatingIcon from '../../../assets/svg/FloatingIcon'

const FloatingBtn = () => {
    const navigation = useNavigation();
  return (
    <TouchableOpacity 
        activeOpacity={0.8}
        style={styles.container}
        onPress={()=>navigation.navigate("AppStack",{
            screen :'AllUserScreen'
        })}
    >
        <FloatingIcon/>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
     container: {
        backgroundColor:'#00A884',
        height:58,
        width:58,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:29,

        position:'absolute',
        bottom:25,
        right:20,

        elevation:6,

        shadowColor:'#000',
        shadowOffset:{
            width:0,
            height:3,
        },
        shadowOpacity:0.3,
        shadowRadius:4,
    }
})
export default FloatingBtn