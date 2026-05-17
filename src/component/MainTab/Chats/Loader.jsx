import { View, Text,ActivityIndicator, StyleSheet} from 'react-native'
import React from 'react'

const Loader = () => {
  return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color='green' />
          <Text>Loading please wait...</Text>
        </View>
  )
}
const styles = StyleSheet.create({
loaderContainer: {
  // flex: 1,
  marginTop:'50%',
  justifyContent: 'center',
  alignItems: 'center',
  gap:10
}
})
export default Loader