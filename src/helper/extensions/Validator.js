export const emailValidator = (email) => {
  const str = /\S+@\S+\.\S+/;

  if (!email || email.length <= 0) {
    return "Email can't be blank";
  }
  if (!str.test(email)) {
    return 'Please enter your valid email';
  }
  return '';
};

export const passwordValidator = (password) => {
  if (!password || password.length <= 0) {
    return "Password can't be blank";
  }
  return '';
};

export const nameValidator = (name) => {
  if (!name || name.length <= 0) {
    return "First Name can't be empty";
  }
  return '';
};

export const lastNameValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Last Name can't be empty";
  }
  return '';
};

export const commentValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Comment can't be empty";
  }
  return '';
};

export const vehiclePhotsValidator = (value) => {
  if (!value || value.length <= 0) {
    return "Please upload at least one vehicle photo";
  }
  return '';
};

export const phoneValidator = (phone) => {
  if (!phone || phone.length <= 0) {
    return "Phone can't be empty";
  } else if (phone.length !== 10) {
    return 'Phone number atleast 10 digit.';
  }
  return '';
};

export const nameAccountValidator = (name) => {
  if (!name || name.length <= 0) {
    return 'Please enter your name';
  }

  return '';
};

export const oldPasswordValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Old password can't be empty";
  }
  return '';
};

export const newPasswordValidator = (name) => {
  if (!name || name.length <= 0) {
    return "New password can't be empty";
  }
  return '';
};

export const confirmPasswordValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Confirm password can't be empty";
  }
  return '';
};

export const passwordMatchValidator = (newPassword, confirmPassword) => {
  if (newPassword !== confirmPassword) {
    return 'New password and Confirm password not matched';
  }
  return '';
};

export const flatNameValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Flat Name or Number can't be empty";
  }
  return '';
};

export const areaValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Area can't be empty";
  }
  return '';
};

export const cityValidator = (name) => {
  if (!name || name.length <= 0) {
    return "City or Town can't be empty";
  }
  return '';
};

export const stateValidator = (name) => {
  if (!name || name.length <= 0) {
    return "State can't be empty";
  }
  return '';
};

export const countryValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Country can't be empty";
  }
  return '';
};

export const pinCodeValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Pincode can't be empty";
  }
  return '';
};

export const titleValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Title can't be empty";
  }
  return '';
};

export const subjectValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Subject can't be empty";
  }
  return '';
};

export const vehicleNumberValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Vehicle Number can't be empty";
  }
  return '';
};

export const vehicleTypeValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Please select vehicle type";
  }
  return '';
};

export const chasisNumberValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Chassis Number can't be empty";
  }
  return '';
};

// Add Parcel validation 

export const sendigValidator = (name) => {
  if (!name || name.length <= 0) {
    return "What are you sending can't be empty";
  }
  return '';
};

export const parcelValueValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Parcel Value can't be empty";
  }
  return '';
};

export const dimensionValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Dimensions can't be empty";
  }
  return '';
};

export const heightValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Height can't be empty";
  }
  return '';
};

export const widthValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Width can't be empty";
  }
  return '';
};

export const weightValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Weight can't be empty";
  }
  return '';
};

export const isDateSelectorValidator = (name) => {
  if (!name || name.length <= 0 || name === 'Pickup Date and Time') {
    return "Date and Time can't be empty";
  }
  return '';
};

export const selectReasonValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Please select proper reason for reject order";
  }
  return '';
};

export const reasonCommentValidator = (name) => {
  if (!name || name.length <= 0) {
    return "Reason can't be empty";
  }
  return '';
};