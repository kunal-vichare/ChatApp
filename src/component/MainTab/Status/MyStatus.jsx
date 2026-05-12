import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Profile from '../../../assets/image/user1.jpeg';
import { colors } from '../../../constant';
import VectorIcon from '../../../utils/VectorIcons';

const MyStatus = () => {
  return (
    <View style={styles.container}>
      <Image source={Profile} style={styles.profileStyle} />
      <TouchableOpacity style={styles.iconBg}>
        <VectorIcon
          name="pluscircle"
          type="AntDesign"
          size={20}
          color={colors.tertiary}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.statusContainer}>
        <Text style={styles.myStatus}>My Status</Text>
        <Text style={styles.addStatus}>Tap to add status update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  profileStyle: {
    borderRadius: 50,
    height: 50,
    width: 50,
    position: 'relative',
  },
  myStatus: {
    fontSize: 15,
    color: colors.secondary,
    fontWeight: '500',
  },
  addStatus: {
    fontSize: 13,
    color: colors.textGrey,
    marginTop: 3,
  },
  statusContainer: {
    marginLeft: 15,
  },
  iconBg: {
    backgroundColor: colors.primary,
    height: 20,
    width: 20,
    borderRadius: 50,
    position: 'absolute',
    bottom: 0,
    left: 30,
  },
});

export default MyStatus;