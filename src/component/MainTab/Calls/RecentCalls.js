import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import VectorIcon from '../../../utils/VectorIcons';
import { colors } from '../../../constant';
// import {colors} from '../theme/colors';
// import VectorIcon from '../utils/VectorIcon';
// import {RecentCallsData} from '../data/RecentCallsData';
import {RecentCallsData} from '../../../data/RecentCallsData'

const RecentCalls = () => {
  return (
    <>
      <Text style={styles.recent}>Recent</Text>
      {RecentCallsData.map(item => (
        <View key={item.id} style={styles.container}>
          <View style={styles.row}>
            <Image source={item.profileImg} style={styles.imgStyle} />
            <View style={styles.linkSection}>
              <Text style={styles.callLink}>{item.name}</Text>
              <View style={styles.callDetails}>
                {item.incoming && (
                  <VectorIcon
                    name="arrow-down-left"
                    type="Feather"
                    size={20}
                    color={colors.red}
                  />
                )}
                {item.outgoing && (
                  <VectorIcon
                    name="arrow-up-right"
                    type="Feather"
                    size={20}
                    color={colors.tertiary}
                  />
                )}
                <Text style={styles.shareLink}>{item.time}</Text>
              </View>
            </View>
          </View>
          {item.video && (
            <VectorIcon
              name="videocam"
              type="Ionicons"
              size={24}
              color={colors.tertiary}
            />
          )}
          {item.audio && (
            <VectorIcon
              name="phone-alt"
              type="FontAwesome5"
              size={16}
              color={colors.tertiary}
            />
          )}
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  recent: {
    fontSize: 14,
    color: colors.textGrey,
    marginTop: 20,
    paddingBottom: 10,
  },
  imgStyle: {
    height: 45,
    width: 45,
    borderRadius: 50,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  callLink: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '500',
  },
  shareLink: {
    fontSize: 13,
    color: colors.textGrey,
    marginLeft: 3,
  },
  linkSection: {
    marginLeft: 15,
  },
});

export default RecentCalls;