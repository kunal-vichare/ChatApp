import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import {MyStatus,RecentStatus,ViewedStatus} from '../../component/MainTab/Status'

const Status = () => {
  return (
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
      <MyStatus/>
        <RecentStatus/>
        <ViewedStatus/>
      </ScrollView>
  )
}

const styles = StyleSheet.create({
  container :{
    padding:16
  }
})

export default Status