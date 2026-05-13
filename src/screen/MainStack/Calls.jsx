import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import {CallLink,RecentCalls} from '../../component/MainTab/Calls'

const Calls = () => {
  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{padding:16}}
    >
      <CallLink/>
      <RecentCalls/>
    </ScrollView>
  )
}

export default Calls