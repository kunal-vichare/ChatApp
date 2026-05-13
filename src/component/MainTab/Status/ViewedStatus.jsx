import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {colors} from '../../../constant';
import {ViewedStatusData} from '../../../data/ViewedStatusData';
import { useNavigation } from '@react-navigation/native';

const ViewedStatus = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text style={styles.recentUpdates}>Viewed updates</Text>
      {ViewedStatusData.map(item => (
        <TouchableOpacity 
          key={item.id} 
          style={styles.storySection}
          onPress={()=>navigation.navigate("AppStack",{
            screen:"StatusScreen"
          })}
        >
          <View style={styles.imgStory}>
            <Image source={item.storyImg} style={styles.statusStyle} />
          </View>
          <View style={styles.statusInfo}>
            <Text style={styles.username}>{item.name}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  statusStyle: {
    height: 42,
    width: 42,
    borderRadius: 50,
  },
  recentUpdates: {
    fontSize: 14,
    color: colors.textGrey,
    paddingBottom: 10,
    paddingTop: 20,
  },
  imgStory: {
    height: 50,
    width: 50,
    borderColor: colors.textGrey,
    borderWidth: 2,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: 15,
    color: colors.secondary,
    fontWeight: '500',
  },
  time: {
    fontSize: 13,
    color: colors.textGrey,
    marginTop: 3,
  },
  storySection: {
    flexDirection: 'row',
    marginTop: 15,
  },
  statusInfo: {
    marginLeft: 15,
  },
});

export default ViewedStatus;