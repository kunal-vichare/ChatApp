export const validateField = (field,value,formData = {}) => {
  let error = '';

  const nameRegex =
    /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/;

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$!%*?&]{6,}$/;

  switch (field) {
    case 'name':
      if (!nameRegex.test(value)) {
        error = 'Please enter valid fullname';
      }
      break;

    case 'email':
      if (!emailRegex.test(value)) {
        error = 'Please enter valid email';
      }
      break;

    case 'password':
      if (value && !passwordRegex.test(value)) {
        error = 'Please enter valid password';
      }
      break;

    case 'confirmPassword':
      if (value !== formData.password) {
        error = 'Password not match';
      }
      break;

    default:
      break;
  }

  return error;
};