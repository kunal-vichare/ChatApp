import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useState } from 'react'
import {flex, fontFamily, fontSize,fontWeight,margin,padding,colors, gap, radius, length} from '../../constant'
import { useNavigation } from '@react-navigation/native'

const Welcome = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
      <Image source={require("../../assets/image/WelcomeImg.png")} style={styles.img}/>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.headerText}>Chat Smarter, Not Harder</Text>
        <Text style={styles.subHeaderText}>Instant messaging that keeps you connected to what matters.</Text>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity 
          style={styles.btn}
          onPress={()=>navigation.navigate("LoginScreen")}
        >
          <Text style={styles.btnText}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.btn}
          onPress={()=>navigation.navigate("SignupScreen",{signup:true})}
        >
          <Text style={styles.btnText}>
            Register
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:flex.one
  },
  imgContainer:{
    marginHorizontal:margin.xxxl,
    marginTop:margin.lg
  },
  img:{
    resizeMode:'contain',
    height:300,
    width:300
  },
  textContainer:{
    justifyContent:'center',
    alignItems:'center',
    paddingHorizontal:padding.headingXs,
    paddingTop: padding.headingMd,
    gap: gap.xl
  },
  headerText:{
    textAlign:'center',
    fontWeight:fontWeight.highlight,
    fontSize:fontSize.titleXl,
    fontFamily:fontFamily.popinsBold,
    color: colors.title
  },
  subHeaderText:{
    textAlign:'center',
    fontWeight:fontWeight.medium,
    fontSize:fontSize.base,
    fontFamily:fontFamily.popinsRegular,
    color: colors.secondary
  },
  btnContainer:{
    flexDirection:'row',
    // flex:flex.one,
    justifyContent:'space-evenly',
    // gap:gap.xs,
    paddingHorizontal:padding.headingXs,
    paddingTop:padding.bigX
  },
  btn:{
    paddingVertical:padding.base,
    paddingHorizontal:padding.lg,
    borderRadius:radius.xs,
    backgroundColor:colors.title,
    minWidth:125,
    alignItems:'center',
    justifyContent:'center'
  },
  btnText:{
    fontFamily:fontFamily.popinsBold,
    fontWeight:fontWeight.highlight,
    fontSize:fontSize.lg,
    color:colors.primary
  }
})

export default Welcome