import React, { useState } from 'react';
import {View,Text,Alert,StyleSheet,KeyboardAvoidingView,Platform,ScrollView,TouchableWithoutFeedback,Keyboard} from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { resetPassword } from '../../services/auth';
import {colors,fontFamily,fontSize,fontWeight,padding} from '../../constant';

const Forgot = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert(
        'Error',
        'Please enter your email address'
      );
      return;
    }

    try {
      await resetPassword(email);

      Alert.alert(
        'Success',
        'Password reset link has been sent to your email address'
      );

      setEmail('');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
    >
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Text style={styles.heading}>
              Forgot Password?
            </Text>

            <Text style={styles.subHeading}>
              Enter your registered email address
              and we'll send you a password reset
              link.
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                Email Address
              </Text>

              <TextInput
                label="Enter your email"
                mode="outlined"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                left={<TextInput.Icon icon="email-outline" />}
                style={styles.input}
                outlineStyle={styles.inputOutline}
              />
            </View>

            <Button
              icon="lock-reset"
              mode="contained"
              onPress={handleResetPassword}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Reset Password
            </Button>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  
  scrollContainer: {
    flexGrow: 1,
  },
  
  container: {
    flex: 1,
    paddingHorizontal: 35,
    paddingTop: padding.headingLg,
  },

  heading: {
    textAlign: 'center',
    fontFamily: fontFamily.popinsBold,
    fontSize: fontSize.titleSm,
    color: colors.title,
    fontWeight: fontWeight.bold,
  },

  subHeading: {
    textAlign: 'center',
    marginTop: padding.base,
    fontFamily: fontFamily.popinsMedium,
    fontWeight: fontWeight.highlight,
    fontSize: fontSize.md,
    color: colors.textGrey,
    lineHeight: 22,
    paddingHorizontal: 15,
  },

  inputContainer: {
    marginTop: 50,
  },

  label: {
    marginBottom: 10,
    fontSize: fontSize.md,
    fontFamily: fontFamily.popinsMedium,
    color: colors.title,
  },

  input: {
    backgroundColor: 'transparent',
  },

  inputOutline: {
    borderRadius: 14,
  },

  button: {
    marginTop: 35,
    borderRadius: 14,
    backgroundColor:colors.title
  },

  buttonContent: {
    height: 52,
  },
});

export default Forgot;