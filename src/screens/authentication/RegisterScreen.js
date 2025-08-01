import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
  BackHandler
} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import auth, {firebase} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';

// Import the JS file.

import Colors from '../../helper/extensions/Colors';
import Button from '../../components/design/Button';
import TextInput from '../../components/design/TextInput';
import {
  nameValidator,
  emailValidator,
  phoneValidator,
  passwordValidator,
  lastNameValidator,
} from '../../helper/extensions/Validator';
import Loader from '../../components/design/Loader';
import AppConstants from '../../helper/constants/AppConstants';
import StepIndicator from 'react-native-step-indicator';
import { customStyles, seconds } from '../../helper/Data';
import {TextInput as Input} from 'react-native-paper';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import moment from 'moment';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {
  flatNameValidator,
  areaValidator,
  cityValidator,
  stateValidator,
  countryValidator,
  pinCodeValidator,
} from '../../helper/extensions/Validator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppPreference from '../../helper/preference/AppPreference';
import * as fetchProfileDataActions from '../../store/actions/customer/profile/fetchProfileData';
import { useDispatch } from 'react-redux';
import { setIsLoginUser } from '../../navigation/MainNavigation';
import CheckboxInput from '../../components/design/CheckboxInput';
import { OTPWidget } from '@msg91comm/sendotp-react-native';
import CHeader from '../../components/CHeader';
import { useFocusEffect } from '@react-navigation/core';

// Load the main class.
let stepLabels = ["General\ndetails", "Verification",/*  "Address" */];

const RegisterScreen = (props) => {
  const ref = useRef();

  const [name, setName] = useState({value: '', error: ''});
  const [lastName, setLastName] = useState({value: '', error: ''});
  const [email, setEmail] = useState({value: '', error: ''});
  const [phone, setPhone] = useState({value: '', error: ''});
  const [referenceMobNumber, setReferenceMobNumber] = useState({value: '', error: ''});
  const [referenceName, setReferenceName] = useState({value: '', error: ''});

  const [address, setAddress] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});
  const [isLoading, setIsLoading] = useState(false);
  const [currentLong, setCurrentLongitude] = useState('unknown');
  const [currentLat, setCurrentLatitude] = useState('unknown');
  const [currentPosition, setCurrentPosition] = useState(0);

  const [otp, setOtp] = useState({value: '', error: ''});
  const [isResendNow, setIsResendNow] = useState(false)
  const [timer, setTimer] = useState(0)
  const [confirm, setConfirm] = useState(null);
  const [uID, setUID] = useState(null);
  const [token, setToken] = useState('');
  let clockCall = null

  const [flatName, setFlatName] = useState({value: '', error: ''});
  const [area, setArea] = useState({value: '', error: ''});
  const [city, setCity] = useState({value: '', error: ''});
  const [state, setState] = useState({value: '', error: ''});
  const [country, setCountry] = useState({value: '', error: ''});
  const [pincode, setPincode] = useState({value: '', error: ''});

  const [termsAndConditionsAgreed, setTermsAndConditionsAgreed] = useState(false);

  const [otpWidgetMessageId, setOtpWidgetMessageId] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    componentDidMount();
  }, []);
  
  const otpRef = useRef(null);

  useEffect(() => {
    if(currentPosition == 1) setTimeout(() => otpRef.current?.focusField(0), 250);
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => subscription.remove();
  }, [currentPosition]);

  /* useFocusEffect(
    React.useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [])
  ); */

  const onBackPress = () => {
    console.log('back btn of android clicked!');
    if(currentPosition > 0){
      setCurrentPosition(0);
    } else {
      props.navigation.pop();
    }
    return true;
  };

  const invalid = ({isDuplicatePhoneNumber, isDuplicateEmailAddress}) => {
    const errorText = {
      phone_number_dup: 'User already registered. Please try again with different number.',
      email_dup: 'Email already registered. Please try again with a different email address.',
      common: 'Unknown error occurred. Please try again.'
    }
    Alert.alert(
      'Alert',
      isDuplicatePhoneNumber ? 
        errorText.phone_number_dup : 
        isDuplicateEmailAddress ? 
        errorText.email_dup :
        errorText.common,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }

  let onlyNumberFieldRegex = '^[0-9]+$';
  const validateOnlyNumber = text => {
    let reg = new RegExp(onlyNumberFieldRegex, 'i');
    if (reg.test(text) === false) {
      return false;
    } else {
      return true;
    }
  };

  const decrementClock = asSeconds => {
    if (asSeconds <= -seconds) {
      if (clockCall) {
        clearInterval(clockCall);
      }
      setIsResendNow(true)
    }
    setTimer(asSeconds)
  };

  const startTimer = () => {
    setIsResendNow(false)
    setTimer(0)
    let setOpenTime = moment(new Date());
    clockCall = setInterval(() => {
      let nowTime = moment(new Date());
      let asSeconds = Math.round(
        moment.duration(setOpenTime.diff(nowTime)).asSeconds(),
      );
      decrementClock(asSeconds);
    }, 1000);
  };

  async function confirmCode() {
    try {
      setIsLoading(true)
      console.log(`otp.value: ${otp.value}`)
      console.log(`confirm:`, confirm)
      await confirm.confirm(otp.value)
      .then(confirmResult => {
        // console.log(`confirmResult:`, confirmResult)
        console.log(`confirmResult(confirmCode): ${JSON.stringify(confirmResult)}`)
        setUID(confirmResult.user.uid)
        confirmResult.user.getIdToken(true).then(token => {
          setToken(token)
          setIsLoading(false);
          setCurrentPosition(currentPosition+1)
        })
      })
      .catch(error => {
        setIsLoading(false);
        setOtp({value: otp.value, error: "Invalid Code."})
        console.log(error)
      });;
    } catch (error) {
      setIsLoading(false);
      setOtp({value: otp.value, error: "Invalid Code."})
      console.log('Invalid code.');
    }
  }

  async function signInWithPhoneNumber(phoneNumber, isResend) {
    console.log(`phoneNumber: ${phoneNumber}`)
    setIsLoading(true);
    auth()
      .signInWithPhoneNumber(phoneNumber,isResend)
      .then(confirmResult => {
        console.log(`confirmResult(signInWithPhoneNumber): ${JSON.stringify(confirmResult)}`)
        setIsLoading(false);
        setConfirm(confirmResult)
        if (!isResend) {
          setCurrentPosition(currentPosition+1)
        }
      })
      .catch(error => {
        setIsLoading(false);
        alert(error.message)
        console.log(error)
      });
  };

  // otpWidget methods ----------------------------
  const handleSendOtp_msg91 = async () => {
    let phoneNumber = `91${phone.value}`;
    const data = {
      identifier: phoneNumber
    }
    try {
      const response = await OTPWidget.sendOTP(data);
      console.log("otpWidget msg91 res: ", response);
      setIsLoading(false);
      if(response?.type === "success"){
        setOtpWidgetMessageId(response?.message);
        setCurrentPosition(currentPosition+1);
      } else {
        Alert.alert("Sorry, couldn't send otp something went wrong, please try again later.")  
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Something went wrong, please try again later.")
      console.log(error);
    }
  };

  const handleRetryOtp_msg91 = async () => {
    const body = {
      reqId: otpWidgetMessageId,
      // retryChannel: 11 // Retry channel code (here, SMS:11)
    }
    // console.log('body of retry method: ', body);
    
    try {
      const response = await OTPWidget.retryOTP(body);
      console.log("handleRetryOtp_msg91: ", response);
      setIsLoading(false);
      if(response?.type === "success"){
        setOtp({value: '', error: ''});
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Something went wrong, please try again later.")
      console.log('Error catch handleRetryOtp_msg91: ', error);
    }
  };

  const handleVerifyOtp_msg91 = async () => {
    setIsLoading(true);
    const body = {
      reqId: otpWidgetMessageId,
      otp: otp.value
    }

    try {
      const response = await OTPWidget.verifyOTP(body);
      // console.log("handleVerifyOtp_msg91: ", response);
      setIsLoading(false);
      if(response?.type === "success"){
        console.log('Sign up user with data, boi');
        // setCurrentPosition(currentPosition+1); // to redirect user to enter address details
        newSignUPUser();
      } else {
        setOtp({ value: otp.value, error: "Please enter the correct verification code again or try 'Resend Code'." })
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Something went wrong, please try again later.")
      console.log('Error catch handleVerifyOtp_msg91: ', error);
    }
  };

  const signUpUser = (userDataObj) => {
    return new Promise((resolve, reject) => {
      const reqHeader = {
        accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const reqBody = userDataObj;
      // console.log('body: ', reqBody);
      fetch(AppConstants?.signupUserUrl, {
        method: 'POST',
        headers: reqHeader,
        body: JSON.stringify(reqBody),
      })
        .then(res => res.json())
        .then(res => {
          console.log('signUpUser res: ', res);
          if(res && !!res?.message){
            resolve(res);
          } else {
            resolve(false);
          }
        })
        .catch(error => {
          console.log(`signUpUser.error: ${error}`);
          resolve(false);
        });  
    });
  }

  const onPressStep1Next = () => {
    const nameError = nameValidator(name.value);
    const lastNameError = lastNameValidator(lastName.value);
    const emailError = emailValidator(email.value);
    const phoneError = phoneValidator(phone.value);
    const passwordError = passwordValidator(password.value);

    if (nameError) {
      setName({...name, error: nameError});
      return;
    } else if (lastNameError) {
      setLastName({...lastName, error: lastNameError});
      return;
    }/*  else if (emailError) {
      setEmail({...email, error: emailError});
      return;
    } */ else if (phoneError) {
      setPhone({...phone, error: phoneError});
      return;
    }/*  else if (passwordError) {
      setPassword({...password, error: passwordError});
      return;
    } */ else {
      setIsLoading(true);

      const usersWithMatchingPhoneNumbers = firestore()
        .collection('users')
        .where('user_type', 'in', ['Customer', 'customer'])
        .where('phone_number', '==', phone.value);
      const usersWithMatchingEmailAddresses = firestore()
        .collection('users')
        .where('user_type', 'in', ['Customer', 'customer'])
        .where('email', '==', email.value);
      
      Promise.all([usersWithMatchingPhoneNumbers.get(), usersWithMatchingEmailAddresses.get()])
      .then(querySnapshots => {
        const querySnapshot = !querySnapshots[0].empty ? querySnapshots[0] : querySnapshots[1];
        console.log('Total users: ', querySnapshot.size);
        if (querySnapshot.size == 0) {
          // setIsLoading(false);
          startTimer()
          // old firebase sign up
          /* let phoneNumberWithCode = `${AppConstants.country_code} ${phone.value}`
          signInWithPhoneNumber(phoneNumberWithCode, false) */

          // new sign up with otpWidget
          handleSendOtp_msg91();
        } else {
          const data = querySnapshot.docs[0]?.data();
          const isDuplicatePhoneNumber = data?.phone_number === phone?.value;
          const isDuplicateEmailAddress = data?.email?.toLowerCase() === email?.value?.toLowerCase();

          setIsLoading(false)
          setTimeout(() => {
            invalid({isDuplicatePhoneNumber, isDuplicateEmailAddress})
          }, 100)
        }
      }).catch(error => {
        setIsLoading(false)
        console.error(error)
      });
    }
  };

  const onPressStep2Next = () => {
    console.log(`otp:`, otp)
    if (otp.value.length < 6) {
      setOtp({ value: otp.value, error: "Please enter valid code." })
      return
    }
    // old firebase signup
    // confirmCode();

    // new signup with otpwidget
    handleVerifyOtp_msg91();
  }

  const onPressStep3Signup = () => {
    const flatNameError = flatNameValidator(ref ? ref.current?.getAddressText() : flatName.value);
    const areaError = areaValidator(area.value);
    const cityError = cityValidator(city.value);
    const stateError = stateValidator(state.value);
    const countryError = countryValidator(country.value);
    const pincodeError = pinCodeValidator(pincode.value);

    if (flatNameError) {
      setFlatName({...flatName, error: flatNameError});
      return;
    } else if (areaError) {
      setArea({...area, error: areaError});
      return;
    } else if (cityError) {
      setCity({...city, error: cityError});
      return;
    } else if (stateError) {
      setState({...state, error: stateError});
      return;
    } else if (countryError) {
      setCountry({...country, error: countryError});
      return;
    } else if (pincodeError) {
      setPincode({...pincode, error: pincodeError});
      return;
    } else if(!termsAndConditionsAgreed){
      Alert.alert("","Please accept the Terms and Conditions to proceed");
      return;
    } else {
      setIsLoading(true);
        
      let addressData = {}
      addressData.flat_number = flatName.value
      addressData.area = area.value
      addressData.city = city.value
      addressData.state = state.value
      addressData.country = country.value
      addressData.pincode = pincode.value
      addressData.latitude = currentLat
      addressData.longitude = currentLong

      let registerData = {
        // access_token: token,
        // fcm_token: fcmToken,
        first_name: name.value,
        last_name: lastName.value,
        email: email.value,
        phone_number: phone.value,
        used_reference_mobNumber: referenceMobNumber.value,
        used_reference_name: referenceName.value,
        country_code: AppConstants.country_code,
        latitude: currentLat,
        longitude: currentLong,
        user_type: 'customer',
        // device_details: AppConstants.device_details,
        address: addressData,
        reason: '',
        status: true,
        is_deleted: false,
        terms_and_conditions_accepted: termsAndConditionsAgreed,
        created_at: new Date()
      };

      console.log('token:', token);
      AsyncStorage.getItem(AppPreference.FCM_TOKEN).then((fcmToken) => {
        if (fcmToken == null) {
          setIsLoading(false);
          console.log(`AppPreference.FCM_TOKEN.null`)
        } else {
          console.log(`AppPreference.FCM_TOKEN:`, fcmToken)
          registerData.fcm_token = fcmToken
          // registerData.access_token = token

          // console.log(`data:`, data)
          firestore()
          .collection('users')
          .doc(uID)
          .set(registerData)
          .then(querySnapshot => {
            // console.log('Total users: ', querySnapshot.size);
            setIsLoading(false);
            AsyncStorage.setItem(AppPreference.IS_LOGIN, '1');
            // AsyncStorage.setItem(AppPreference.LOGIN_TOKEN,token);
            AsyncStorage.setItem(AppPreference.LOGIN_UID, uID).then(
              () => {
                console.log(`AsyncStorage.setItem.LOGIN_UID`)
                AsyncStorage.setItem(
                  AppPreference.LOGIN_USER_DATA,
                  JSON.stringify(registerData),
                ).then(() => {
                  dispatch({
                    type: fetchProfileDataActions.FETCH_PROFILE_DATA,
                    fetchProfileData: registerData,
                    userUID: uID
                  });
                  setIsLoginUser(true)
                  props.navigation.navigate('Dashboard')
                })
              },
            );
          }).catch(error => {
            setIsLoading(false);
            console.error(error)
          });
        }
      });
    }
  };

  const newSignUPUser = () => {
    setIsLoading(true);

    let registerData = {
      first_name: name.value,
      last_name: lastName.value,
      email: email.value,
      phone_number: phone.value,
      used_reference_mobNumber: referenceMobNumber.value,
      used_reference_name: referenceName.value,
      country_code: AppConstants.country_code,
      // latitude: currentLat,
      // longitude: currentLong,
      user_type: 'customer',
      // device_details: AppConstants.device_details,
      // address: addressData,
      reason: '',
      status: true,
      is_deleted: false,
      terms_and_conditions_accepted: termsAndConditionsAgreed,
      created_at: new Date()
    };

    AsyncStorage.getItem(AppPreference.FCM_TOKEN).then((fcmToken) => {
      if (fcmToken == null) {
        setIsLoading(false);
        console.log(`AppPreference.FCM_TOKEN.null`)
      } else {
        console.log(`AppPreference.FCM_TOKEN:`, fcmToken)
        registerData.fcm_token = fcmToken
        // registerData.access_token = token

        // console.log(`data:`, data)

        // new signup with otpWidget
        signUpUser(registerData).then((res) => {
          setIsLoading(false);
          if(res){
            AsyncStorage.setItem(AppPreference.IS_LOGIN, '1');
            AsyncStorage.setItem(AppPreference.LOGIN_UID, res?.userId).then(
              () => {
                console.log(`AsyncStorage.setItem.LOGIN_UID`)
                AsyncStorage.setItem(
                  AppPreference.LOGIN_USER_DATA,
                  JSON.stringify(registerData),
                ).then(() => {
                  dispatch({
                    type: fetchProfileDataActions.FETCH_PROFILE_DATA,
                    fetchProfileData: registerData,
                    userUID: res?.userId
                  });
                  setIsLoginUser(true)
                  props.navigation.navigate('Dashboard')
                })
              },
            );
          }
        });
      }
    });
  };

  const componentDidMount = () => {
    var that = this;
    if (Platform.OS === 'ios') {
      callLocation(that);
    } else {
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            callLocation(that);
          } else {
            alert('Permission Denied');
          }
        } catch (err) {
          // alert('err', err);
          console.log(`error:`, err);
        }
      }
      requestLocationPermission();
    }
  };
  const callLocation = (that) => {
    //alert("callLocation Called");
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        const currentLongitude = position.coords.longitude;
        //getting the Longitude from the location json
        const currentLatitude = position.coords.latitude;
        console.log('Latitude : ', currentLatitude);
        console.log('Longitude : ', currentLongitude);
        //getting the Latitude from the location json
        setCurrentLongitude(currentLongitude);
        // that.setState({ currentLongitude:currentLongitude });
        //Setting state Longitude to re re-render the Longitude Text
        // that.setState({ currentLatitude:currentLatitude });
        setCurrentLatitude(currentLatitude);
        //Setting state Latitude to re re-render the Longitude Text
      },
      // (error) => alert(error.message),
      // {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    that.watchID = Geolocation.watchPosition((position) => {
      //Will give you the location on location change
      console.log(position);
      const currentLongitude = position.coords.longitude;
      //getting the Longitude from the location json
      const currentLatitude = position.coords.latitude;
      console.log('Latitude : ', currentLatitude);
      console.log('Longitude : ', currentLongitude);

      //getting the Latitude from the location json
      //  that.setState({ currentLongitude:currentLongitude });
      setCurrentLongitude(currentLongitude);

      //Setting state Longitude to re re-render the Longitude Text
      //  that.setState({ currentLatitude:currentLatitude });
      setCurrentLatitude(currentLatitude);
      //Setting state Latitude to re re-render the Longitude Text
    });
  };
  const componentWillUnmount = () => {
    Geolocation.clearWatch(this.watchID);
  };

  const step1GeneralDetails = () => {
    return (
      <>
        <View style={{padding: 16}}>
          <TextInput
            //   style={styles.nameInputText}
            label="First Name"
            returnKeyType="next"
            value={name.value}
            onChangeText={(text) => setName({value: text, error: ''})}
            error={!!name.error}
            errorText={name.error}
            autoCapitalize="words"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._nameinput = ref;
            }}
            onSubmitEditing={() =>
              this._lastinput && this._lastinput.focus()
            }
          />
          <TextInput
            //   style={styles.nameInputText}
            label="Last Name"
            returnKeyType="next"
            value={lastName.value}
            onChangeText={(text) => setLastName({value: text, error: ''})}
            error={!!lastName.error}
            errorText={lastName.error}
            autoCapitalize="words"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._lastinput = ref;
            }}
            onSubmitEditing={() =>
              this._emailinput && this._emailinput.focus()
            }
          />
          <TextInput
            //   style={styles.emailInputText}
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({value: text, error: ''})}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            ref={(ref) => {
              this._emailinput = ref;
            }}
            onSubmitEditing={() =>
              this._phoneinput && this._phoneinput.focus()
            }
          />
          <TextInput
            //   style={styles.phoneInputText}
            label="Phone"
            returnKeyType="next"
            value={phone.value}
            onChangeText={(text) => setPhone({value: text, error: ''})}
            error={!!phone.error}
            errorText={phone.error}
            autoCapitalize="none"
            autoCompleteType="tel"
            textContentType="telephoneNumber"
            maxLength={10}
            keyboardType="phone-pad"
            ref={(ref) => {
              this._phoneinput = ref;
            }}
            onSubmitEditing={() =>
              this._referenceMobNumberinput && this._referenceMobNumberinput.focus()
            }
            left={<Input.Affix customTextStyle={{ marginRight: 12 }} text={`${AppConstants.country_code} `} />}
          />
          <TextInput
            //   style={styles.phoneInputText}
            label="Reference Mobile Number"
            returnKeyType="next"
            value={referenceMobNumber.value}
            onChangeText={(text) => setReferenceMobNumber({value: text, error: ''})}
            error={!!referenceMobNumber.error}
            errorText={referenceMobNumber.error}
            autoCapitalize="none"
            autoCompleteType="tel"
            textContentType="telephoneNumber"
            maxLength={10}
            keyboardType="phone-pad"
            ref={(ref) => {
              this._referenceMobNumberinput = ref;
            }}
            onSubmitEditing={() =>
              this._referenceNameinput && this._referenceNameinput.focus()
            }
            left={<Input.Affix customTextStyle={{ marginRight: 12 }} text={`${AppConstants.country_code} `} />}
          />
          <TextInput
            //   style={styles.nameInputText}
            label="Reference Name(Full name)"
            returnKeyType="next"
            value={referenceName.value}
            onChangeText={(text) => setReferenceName({value: text, error: ''})}
            error={!!referenceName.error}
            errorText={referenceName.error}
            autoCapitalize="words"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._referenceNameinput = ref;
            }}
            onSubmitEditing={() =>
              this._addressinput && this._addressinput.focus()
            }
          />
          {/* <TextInput
            //   style={styles.nameInputText}
            label="Address"
            returnKeyType="next"
            value={address.value}
            onChangeText={(text) => setAddress({value: text, error: ''})}
            error={!!address.error}
            errorText={address.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._addressinput = ref;
            }}
            onSubmitEditing={() =>
              this._passwordinput && this._passwordinput.focus()
            }
            multiline
          /> */}
          {/* <TextInput
            //   style={styles.passwordInputText}
            label="Password"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({value: text, error: ''})}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry={true}
            ref={(ref) => {
              this._passwordinput = ref;
            }}
            onSubmitEditing={Keyboard.dismiss}
          /> */}
        </View>
        <TouchableOpacity style={styles.nextView} onPress={onPressStep1Next}>
          <Image
            style={styles.nextImage}
            source={require('../../assets/assets/SliderScreen/next.png')}
          />
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.buttonLogin}
          onPress={onPressRegister}>
          <Text style={styles.loginText}>SIGN UP</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => props.navigation.pop()}>
          <Text style={styles.haveAnAccountText}>
            Already have an account?
          </Text>
          <Text style={styles.registerText}>Login</Text>
        </TouchableOpacity>
      </>
    )
  }

  const step2Verification = () => {
    return (
      <View style={{padding: 16}}>
        <Text style={styles.subTitleText}>{"An authentication code has been sent to "}
          <Text style={{ color: Colors.accentColor }}>
            {`${AppConstants.country_code} ${phone.value}`}
          </Text>
        </Text>
        <View style={{padding: 16}}>
          <OTPInputView
            autoFocusOnLoad={false}
            ref={otpRef}
            pinCount={6}
            style={{height: 64, alignSelf: 'center', width: '94%'}}
            codeInputFieldStyle={{
              width: 44,
              height: 44,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: Colors.borderColor,
              color: Colors.textColor,
              fontSize: 20,
              // fontFamily: getFontFamily().BOLD,
            }}
            codeInputHighlightStyle={{
              borderColor: Colors.primaryColor,
              borderWidth: 3,
            }}
            onCodeChanged={code => {
              if (!validateOnlyNumber(code)) {
                return;
              }
              setOtp({value: code, error: ''})
              /* this.setState({otp: '' + code, errorMessage: ''}, () => {
                let tIsDisable = true;
                if (this.state.otp.length == 4) {
                  tIsDisable = false;
                }
                this.setState({isDisable: tIsDisable});
              }); */
            }}
          />
          {otp.error == '' ? null : (
            <Text style={styles.errorText}>{otp.error}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.nextView} onPress={onPressStep2Next}>
          <Image
            style={styles.nextImage}
            source={require('../../assets/assets/SliderScreen/next.png')}
          />
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            marginTop: -16,
            justifyContent: 'center',
          }}>
          {isResendNow ? (
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.subTitleTextColor,
                  textAlign: 'center',
                  fontFamily: "SofiaPro-Regular"
                }}>
                {"Didn't receive OTP? "}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  startTimer();
                  // old firebase resend otp
                  /* let phoneNumberWithCode = `${AppConstants.country_code} ${phone.value}`;
                  signInWithPhoneNumber(phoneNumberWithCode, true); */

                  // new otp widget resend otp
                  handleRetryOtp_msg91();
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.primaryColor,
                    fontFamily: "SofiaPro-Regular"
                  }}>
                  {" Resend Code"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.subTitleTextColor,
                  textAlign: 'center',
                  fontFamily: "SofiaPro-Regular"
                }}>
                {"Code sent. Resend code in "}
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.subTitleTextColor,
                    fontFamily: "SofiaPro-Regular"
                  }}>
                  {timer + seconds}
                </Text>
              </Text>
            </View>
          )}
        </View>
      </View>
    )
  }

  const onPressAddressItem = (data, details) => {
    console.log(`data: ${JSON.stringify(data)}`)
    console.log(`details: ${JSON.stringify(details)}`)
    var componentList = details.adr_address.split(', ');

    let flatDetails = ''  // ? extended-address
    let area = ''         // ? street-address
    let city = ''         // ? locality
    let state = ''        // ? region
    let country = ''      // ? country-name
    let pincode = ''      // ? postal-code

    for (const component of details.address_components) {
      const componentType = component.types[0];
  
      switch (componentType) {
        case "street_number": {
          flatDetails = `${component.long_name}`;
          break;
        }
  
        /* case "route": {
          flatDetails += component.short_name;
          break;
        } */

        case "sublocality_level_2": {
          flatDetails = flatDetails === '' ? '' : `${flatDetails}, ` + `${component.long_name}`;
          break;
        }
  
        case "route": {
          area += component.long_name;
          break;
        }
  
        case "postal_code_suffix": {
          pincode = `${pincode}-${component.long_name}`;
          break;
        }

        case "locality": {
          city = component.long_name;
          break;
        }

        case "administrative_area_level_1": {
          state = component.short_name;
          break;
        }

        case "country": {
          country = component.long_name;
          break;
        }

        case "postal_code": {
          pincode = `${component.long_name}${pincode}`;
          break;
        }
      }
    }

    setFlatName({value: flatDetails, error: ''})
    setArea({value: area, error: ''})
    setCity({value: city, error: ''})
    setState({value: state, error: ''})
    setCountry({value: country, error: ''})
    setPincode({value: pincode, error: ''})
    
    if (ref) {
      ref.current?.setAddressText(flatDetails);
    }
  }

  const step3AddressView = () => {
    return (
      <View>
        <View style={{padding: 16}}>
          <ScrollView 
            horizontal={true}
            style={{ flex: 1, marginBottom: 8 }}
            contentContainerStyle={{ flex: 1 }}
            keyboardShouldPersistTaps='always'
          >
            <GooglePlacesAutocomplete
              ref={ref}
              placeholder={"Flat name or Number"}
              minLength={3}
              returnKeyType={'next'}
              listViewDisplayed="auto"
              fetchDetails={true}
              keyboardShouldPersistTaps='always'
              // renderDescription={(row) => row.description}
              onPress={onPressAddressItem}
              onNotFound={() => {
                console.log(`onNotFound`)
              }}
              query={{
                key: AppConstants.google_place_api_key,
                language: 'en',
                components: 'country:in'
                // types: '(cities)',
              }}
              textInputProps={{
                placeholderTextColor: 'black',
                returnKeyType: "search"
              }}
              enablePoweredByContainer={false}
              /* GooglePlacesDetailsQuery={{
                // fields: ['formatted_address', 'geometry'],
                fields: 'geometry',
              }} */
              
              styles={{
                textInputContainer: {
                  height: 60,
                  borderRadius: 4,
                  color: 'black'
                },
                textInput: {
                  height: 60,
                  color: Colors.textColor,
                  // color: 'black',
                  fontSize: RFPercentage(2.4),
                  // fontFamily: 'SofiaPro-Regular',
                  backgroundColor: Colors.surfaceColor,
                  borderRadius: 4,
                  borderWidth: 1
                },
                description: {
                  color: 'black'
                },
                /* predefinedPlacesDescription: {
                  color: '#1faadb',
                } */
                poweredContainer: {
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  borderBottomRightRadius: 5,
                  borderBottomLeftRadius: 5,
                  borderColor: '#c8c7cc',
                  borderTopWidth: 0.5,
                }
              }}
            />
          </ScrollView>
          {flatName.error == '' ? null : (
            <Text style={styles.error}>{flatName.error}</Text>
          )}
          {/* <TextInput
            //   style={styles.nameInputText}
            label="Flat name or Number"
            returnKeyType="next"
            value={flatName.value}
            onChangeText={(text) => setFlatName({value: text, error: ''})}
            error={!!flatName.error}
            errorText={flatName.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._flatinput = ref;
            }}
            onSubmitEditing={() =>
              this._areainput && this._areainput.focus()
            }
          /> */}
          <TextInput
            //   style={styles.nameInputText}
            label="Area"
            returnKeyType="next"
            value={area.value}
            onChangeText={(text) => setArea({value: text, error: ''})}
            error={!!area.error}
            errorText={area.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._areainput = ref;
            }}
            onSubmitEditing={() =>
              this._cityinput && this._cityinput.focus()
            }
          />
          <TextInput
            //   style={styles.nameInputText}
            label="City or Town"
            returnKeyType="next"
            value={city.value}
            onChangeText={(text) => setCity({value: text, error: ''})}
            error={!!city.error}
            errorText={city.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._cityinput = ref;
            }}
            onSubmitEditing={() =>
              this._stateinput && this._stateinput.focus()
            }
          />
          <TextInput
            //   style={styles.nameInputText}
            label="State"
            returnKeyType="next"
            value={state.value}
            onChangeText={(text) => setState({value: text, error: ''})}
            error={!!state.error}
            errorText={state.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._stateinput = ref;
            }}
            onSubmitEditing={() =>
              this._countryinput && this._countryinput.focus()
            }
          />
          <TextInput
            //   style={styles.nameInputText}
            label="Country"
            returnKeyType="next"
            value={country.value}
            onChangeText={(text) => setCountry({value: text, error: ''})}
            error={!!country.error}
            errorText={country.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._countryinput = ref;
            }}
            onSubmitEditing={() =>
              this._pincodeinput && this._pincodeinput.focus()
            }
          />
          <TextInput
            //   style={styles.nameInputText}
            label="Pincode"
            returnKeyType="next"
            value={pincode.value}
            onChangeText={(text) => setPincode({value: text, error: ''})}
            error={!!pincode.error}
            errorText={pincode.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="number-pad"
            ref={(ref) => {
              this._pincodeinput = ref;
            }}
            onSubmitEditing={Keyboard.dismiss}
          />
          
          <CheckboxInput
            label={
              <View>
                <Text style={{ color: 'black'}}>I have read and accept the
                  <Text
                    onPress={() => {
                      Linking.openURL(`https://roadferry.in/terms-of-service-customer.html`);
                    }}
                    style={styles.tandcText}
                  > Terms and Conditions.</Text>
                </Text>
              </View>
            }
            checked={termsAndConditionsAgreed}
            onPress={() => setTermsAndConditionsAgreed(!termsAndConditionsAgreed)}
          />
        </View>
        <TouchableOpacity
          style={styles.buttonLogin}
          onPress={onPressStep3Signup}>
          <Text style={styles.loginText}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const handleBackBtnClick = () => {
    if(currentPosition > 0){
      setCurrentPosition(0);
    } else {
      props.navigation.pop();
    }
  };

  const registerView = () => {
    return (
      <>
        <StatusBar
          backgroundColor={Colors.mainBackgroundColor}
          barStyle="dark-content"
        />
        <SafeAreaView
          style={{flex: 1, backgroundColor: Colors.mainBackgroundColor}}>
          <ScrollView 
            style={styles.container}
            keyboardShouldPersistTaps='always'
          >
            <Loader loading={isLoading} />
            {/* <TouchableOpacity onPress={() => handleBackBtnClick()}>
              <Image
                style={styles.backImage}
                source={require('../../assets/assets/Authentication/back.png')}
              />
            </TouchableOpacity>
            <Text style={styles.tilteText}>Sign Up</Text> */}
            <CHeader isBackBtn={true} headerTitle={'Sign Up'} handleBackBtnClick={() => handleBackBtnClick()} />
           
            <StepIndicator
              customStyles={customStyles}
              currentPosition={currentPosition}
              labels={stepLabels}
              stepCount={stepLabels.length}
              renderLabel={({position, stepStatus, label, currentPosition}) => {
                return (
                  <Text style={[position == currentPosition ? styles.registerText : styles.haveAnAccountText, {marginTop: 8, textAlign: 'center'}]}>
                    {stepLabels[position]}
                  </Text>
                )
              }}
              // onPress={onPageChange}
            />
            <View style={{flex: 1}}>
              {currentPosition == 0 ?
                step1GeneralDetails() 
              : currentPosition == 1 ? 
                step2Verification()
              : null/* step3AddressView() */ }
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }

  return AppConstants.isAndroid ? (
    <View style={{ flex: 1 }}>{registerView()}</View>
  ) : (
    <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#fff' }}
        behavior="padding"
        enabled>
        {registerView()}
    </KeyboardAvoidingView>
  );
};

// Set the components styles.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  headerContainer: {
    height: 200,
    backgroundColor: Colors.headerBGColor,
    // justifyContent: 'flex-end',
  },
  backImage: {
    marginLeft: 16,
    height: 40,
    width: 40,
  },
  cellHeaderFooler: {
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tilteText: {
    margin: 16,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(4),
    // fontWeight: '500',
    color: Colors.textColor,
    marginBottom: 30
  },
  subTitleText: {
    margin: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2.3),
    color: Colors.titleTextColor,
  },
  headerImage: {
    height: 120,
    width: 70,
  },
  nameInputText: {
    margin: 32,
    backgroundColor: Colors.surfaceColor,
  },
  emailInputText: {
    margin: 32,
    marginTop: -16,
    backgroundColor: Colors.surfaceColor,
  },
  phoneInputText: {
    margin: 32,
    marginTop: -16,
    backgroundColor: Colors.surfaceColor,
  },
  passwordInputText: {
    margin: 32,
    marginTop: -16,
    backgroundColor: Colors.surfaceColor,
  },
  buttonLogin: {
    margin: 64,
    marginTop: 32,
    marginBottom: 0,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Medium',
    backgroundColor: Colors.buttonColor,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  loginText: {
    fontFamily: 'SofiaPro-Medium',
    color: Colors.backgroundColor,
    fontSize: RFPercentage(2),
  },
  registerButton: {
    marginTop: -32,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // justifyContent: 'space-around',
  },
  registerText: {
    marginLeft: 4,
    fontFamily: 'SofiaPro-Medium',
    fontSize: RFPercentage(1.7),
    color: Colors.primaryColor,
  },
  haveAnAccountText: {
    fontFamily: 'SofiaPro-Medium',
    fontSize: RFPercentage(1.7),
    color: Colors.subTitleTextColor,
  },
  socialButtonView: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialImage: {
    height: 60,
    width: 60,
  },
  // loginText: {
  //   color: Colors.backgroundColor,
  //   fontSize: RFPercentage(2.5),
  // },
  lineView: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDotView: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeNumberText: {
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.7),
    color: Colors.backgroundColor,
  },
  activeLineView: {
    marginLeft: -1,
    width: 80,
    height: 5,
    backgroundColor: Colors.primaryColor,
  },
  inActiveDotView: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.inActiveLineColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inActiveNumberText: {
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.7),
    color: Colors.backgroundColor,
  },
  inActiveLineView: {
    marginLeft: -1,
    width: 80,
    height: 5,
    backgroundColor: Colors.inActiveLineColor,
  },
  lineViewText: {
    marginLeft: 55,
    marginRight: 85,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextView: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: Colors.backgroundColor,
  },
  nextImage: {
    height: 150,
    width: 150,
    resizeMode: 'contain',
  },
  errorText: {
    marginLeft: 8,
    marginTop: 0,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    // fontWeight: '500',
    color: Colors.errorColor,
    marginRight: 16,
  },
  tandcText: {
    color: '#0000EE'
  }
});

export default RegisterScreen;
