import Toast from 'react-native-toast-message';

export const LoginSuccessToast = () => {
  Toast.show({
    type: 'success',
    text1: 'You are logged in'
  });
};

export const EmailNotVerifiedToast = () => {
  Toast.show({
    type: 'error',
    text1: 'Email is not verified'
  });
};

export const PasswordWrongToast = () => {
  Toast.show({
    type: 'error',
    text1: 'Password is wrong'
  });
};

export const PasswordNotMatchToast = () => {
  Toast.show({
    type: 'error',
    text1: 'Password not match'
  });
};

export const FillAllFieldToast = () => {
  Toast.show({
    type: 'error',
    text1: 'Please fill all the fields'
  });
};

export const VerificationEmailSendToast = () => {
  Toast.show({
    type: 'success',
    text1: 'A verification email has been sent to your email address'
  });
};

export const ErrorRegisterToast = (error) => {
  Toast.show({
    type: 'error',
    text1: error.message
  });
};

export const ErrorForgotToast = (error) => {
  Toast.show({
    type: 'error',
    text1: error.message
  });
};

export const PasswordResendSendToast = () => {
  Toast.show({
    type: 'success',
    text1: 'Password reset link has been sent to your email address'
  });
};

export const fillEmailToast = () => {
  Toast.show({
    type: 'error',
    text1: 'Please enter your email address'
  });
};