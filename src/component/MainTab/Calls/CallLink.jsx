import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import VectorIcon from '../../../utils/VectorIcons';
import { colors, fontSize, fontWeight, iconSize, margin, radius } from '../../../constant';

const CallLink = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconBg}>
        <VectorIcon
          name="link"
          type="Fontisto"
          size={iconSize.lg}
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
    borderRadius: radius.fifty,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callLink: {
    fontSize: fontSize.md,
    color: colors.secondary,
    fontWeight: fontWeight.regular,
  },
  shareLink: {
    fontSize: fontSize.base,
    color: colors.textGrey,
    marginTop: 3,
  },
  linkSection: {
    marginLeft: margin.base,
  },
});

export default CallLink;