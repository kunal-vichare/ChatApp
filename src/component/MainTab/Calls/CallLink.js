import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import VectorIcon from '../../../utils/VectorIcons';
import { colors } from '../../../constant';

const CallLink = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconBg}>
        <VectorIcon
          name="link"
          type="Fontisto"
          size={20}
          color={colors.primary}
        />
      </View>
      <View style={styles.linkSection}>
        <Text style={styles.callLink}>Create call link</Text>
        <Text style={styles.shareLink}>
          Share a link for your Whatsapp call
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  iconBg: {
    backgroundColor: colors.tertiary,
    height: 45,
    width: 45,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callLink: {
    fontSize: 15,
    color: colors.secondary,
    fontWeight: '500',
  },
  shareLink: {
    fontSize: 13,
    color: colors.textGrey,
    marginTop: 3,
  },
  linkSection: {
    marginLeft: 15,
  },
});

export default CallLink;