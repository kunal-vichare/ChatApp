import {View, StyleSheet, Text} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import VectorIcon from '../../utils/VectorIcons';
import { colors } from '../../constant';

const AllUserHeader = ({length,setIsSelectionMode,isSelectionMode,setSelectedIds}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <VectorIcon
          name="arrow-back"
          type="Ionicons"
          size={24}
          color={colors.secondary}
          onPress={() => navigation.goBack()}
        />
        <View>
          <Text style={styles.selectContact}>Select Contact</Text>
          <Text style={styles.count}>{length} Contacts</Text>
        </View>
      </View>

      <View style={styles.headerContainer}>
        {
          isSelectionMode?
          <VectorIcon
            type="MaterialIcons"
            name="cancel"
            color={colors.white}
            size={24}
            onPress={()=>{setIsSelectionMode(false);setSelectedIds([])}}
          />
          :
          <VectorIcon
            type="Entypo"
            name="dots-three-vertical"
            color={colors.white}
            size={18}
          />
          
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.primaryColor,
    paddingTop: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom:'3%'
  },
  selectContact: {
    fontSize: 17,
    color: colors.secondary,
    marginLeft: 20,
  },
  count: {
    fontSize: 12,
    color: colors.secondary,
    marginLeft: 20,
    marginTop: 2,
  },
  iconStyle: {
    marginHorizontal: 25,
  },
});

export default AllUserHeader;