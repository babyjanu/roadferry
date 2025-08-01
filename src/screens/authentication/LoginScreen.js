import React, {useState, useEffect} from 'react';
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
  NativeModules,
} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
// import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';
// Import the JS file.
import Colors from '../../helper/extensions/Colors';
import Button from '../../components/design/Button';
import TextInput from '../../components/design/TextInput';
import PasswordTextInput from '../../components/design/PasswordTextInput';
import AppPreference from '../../helper/preference/AppPreference';
import * as fetchProfileDataActions from '../../store/actions/customer/profile/fetchProfileData';

import {phoneValidator} from '../../helper/extensions/Validator';
import Loader from '../../components/design/Loader';
import {
  setIsLoginUser,
  setLoginUserType,
} from '../../navigation/MainNavigation';
import {NavigationActions, StackActions} from 'react-navigation';
import AppConstants from '../../helper/constants/AppConstants';
import {useDispatch} from 'react-redux';
import {TextInput as Input} from 'react-native-paper';
import { OTPWidget } from '@msg91comm/sendotp-react-native';

// Load the main class.
const resetDashboardAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'Dashboard'})],
});

const LoginScreen = props => {
  const [phone, setPhone] = useState({value: '', error: ''});
  const [isLoading, setIsLoading] = useState(false);
  const [confirm, setConfirm] = useState(null);

  const dispatch = useDispatch();

  const invalid = () => {
    Alert.alert(
      'Alert',
      'User not register.',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  };

  const clearUserData = () => {
    console.log(`clearUserData`);
    dispatch({
      type: fetchProfileDataActions.FETCH_PROFILE_DATA,
      fetchProfileData: [],
      userUID: '',
    });
  };

  useEffect(() => {
    clearUserData();
    const willFocusSub = props.navigation.addListener('focus', () => {
      clearUserData();
    });

    return () => {
      willFocusSub();
    };
  }, []);

  const handleSendOtp_msg91 = async (login_Data) => {
    let phoneNumber = `91${phone.value}`;
    const data = {
      identifier: phoneNumber
    }
    try {
      const response = await OTPWidget.sendOTP(data);
      // console.log("otpWidget msg91 res: ", response);
      setIsLoading(false);
      if(response?.type === "success"){
        props.navigation.navigate('VerificationScreen', {
          isLogin: true,
          phoneNumber: phone.value,
          otpWidgetMessageId: response?.message,
          loginData: login_Data,
        });
      } else {
        Alert.alert("Sorry, couldn't send otp something went wrong, please try again later.")  
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Something went wrong, please try again later.")
      console.log(error);
    }
  };

  const onPressSkip = () => {
    console.log(`onPressSkip`);
    props.navigation.goBack();
  };

  async function signInWithPhoneNumber(phoneNumber) {
    console.log(`phoneNumber: ${phoneNumber}`);
    // ! check user exist or not on database
    firestore()
      .collection('users')
      .where('user_type', 'in', ['Customer', 'customer'])
      .where('phone_number', '==', phone.value)
      .get()
      .then(querySnapshot => {
        console.log('Total users: ', querySnapshot.size);
        if (querySnapshot.size == 0) {
          setIsLoading(false);
          setTimeout(() => {
            invalid();
          }, 500);
        } else {
          console.log(`Sending code....`);
          // firebase otp auth
          /* auth()
            .signInWithPhoneNumber(phoneNumber)
            .then(confirmResult => {
              // console.log(`confirmResult:`, confirmResult)
              // console.log(`confirmResult: ${JSON.stringify(confirmResult)}`)
              console.log(`Code sent`);
              setIsLoading(false);
              props.navigation.navigate('VerificationScreen', {
                isLogin: true,
                phoneNumber: phone.value,
                confirm: confirmResult,
                loginData: querySnapshot,
              });
            })
            .catch(error => {
              setIsLoading(false);
              alert(error.message);
              console.log(error);
            }); */

          // msg91 otp widget
          handleSendOtp_msg91(querySnapshot);
        }
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
  }

  const verifyPhoneNumber = (phoneNumberWithCode) => {
    console.log('inside verify phone number: ', phoneNumberWithCode);
    auth()
      .verifyPhoneNumber(phoneNumberWithCode)
      .on('state_changed', async phoneAuthSnapshot => {
        console.log('phoneAuthSnapshot: ', phoneAuthSnapshot);
        switch (phoneAuthSnapshot.state) {
          case auth.PhoneAuthState.CODE_SENT:
            console.log('sent sms code');
            break;

          case auth.PhoneAuthState.ERROR:
            console.error('error');
            break;

          case auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT:
            console.error('auto verify timeout error');
            break;

          case auth.PhoneAuthState.AUTO_VERIFIED:
            console.log('auto verified');

            if (phoneAuthSnapshot.code === null) return;

            const phoneCredential = auth.PhoneAuthProvider.credential(
              phoneAuthSnapshot.verificationId,
              phoneAuthSnapshot.code,
            );
            console.log('phoneCredential: ', phoneCredential);
            setIsLoading(false);
            props.navigation.navigate('VerificationScreen', {
              isLogin: true,
              phoneNumber: phone.value,
              confirm: confirmResult,
              loginData: querySnapshot,
            });

            // const response = await auth().signInWithCredential(phoneCredential);
            console.log('response', response);
            console.log('success phone auth sign in and login');
            break;
        }
      });
  };

  const onPressNewLogin = () => {
    Keyboard.dismiss();
    const phoneError = phoneValidator(phone.value);
    if (phoneError) {
      setPhone({...phone, error: phoneError});
      return;
    }

    setIsLoading(true);
    let phoneNumber = `${AppConstants.country_code} ${phone.value}`;
    signInWithPhoneNumber(phoneNumber);
  };

  const changePwdType = () => {
    setPassworVisible(!passworVisible);
  };

  const setLoginView = () => {
    return (
      <>
        <StatusBar
          backgroundColor={Colors.mainBackgroundColor}
          barStyle="dark-content"
        />
        <SafeAreaView
          style={{flex: 1, backgroundColor: Colors.mainBackgroundColor}}
        >
          <ScrollView
            style={styles.container}
            keyboardShouldPersistTaps={'handled'}
            automaticallyAdjustContentInsets={false}
            showsVerticalScrollIndicator={false}
          >
            <Loader loading={isLoading} />
            {/* <TouchableOpacity onPress={() => props.navigation.pop()}>
              <Image
                style={styles.backImage}
                source={require('../../assets/assets/Authentication/back.png')}
              />
            </TouchableOpacity> */}
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Image
                style={styles.logoImage}
                source={require('../../assets/assets/Authentication/logo.png')}
              />
            </View>
            <Text style={styles.tilteText}>Login</Text>
            <View style={{padding: 16}}>
              <TextInput
                //   style={styles.phoneInputText}
                label="Phone"
                returnKeyType="next"
                value={phone.value}
                onChangeText={text => setPhone({value: text, error: ''})}
                error={!!phone.error}
                errorText={phone.error}
                autoCapitalize="none"
                autoCompleteType="tel"
                textContentType="telephoneNumber"
                maxLength={10}
                keyboardType="phone-pad"
                left={
                  <Input.Affix
                    customTextStyle={{marginRight: 12}}
                    text={`${AppConstants.country_code} `}
                  />
                }
                /* ref={(ref) => {
                this._phoneinput = ref;
              }} */
                /* onSubmitEditing={() =>
                this._addressinput && this._addressinput.focus()
              } */
              />
              {/* <PasswordTextInput
                style={styles.passwordInputText}
                label="Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={(text) => setPassword({value: text, error: ''})}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry={passworVisible}
                ref={(ref) => {
                  this._passwordinput = ref;
                }}
                onSubmitEditing={Keyboard.dismiss}
                changePwdType={() => changePwdType()}
                imageName={passworVisible ? 'eye-outline' : 'eye-off-outline'}
              /> */}
            </View>
            {/* <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() =>
                props.navigation.navigate('ForgotPasswordScreen')
              }>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.buttonLogin}
              onPress={onPressNewLogin}
            >
              <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSkip} onPress={onPressSkip}>
              <Text style={styles.skipText}>SKIP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => props.navigation.navigate('RegisterScreen')}
            >
              <Text style={styles.haveAnAccountText}>
                Don't have an account yet?
              </Text>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  };

  return AppConstants.isAndroid ? (
    <View style={{flex: 1}}>{setLoginView()}</View>
  ) : (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: '#fff'}}
      behavior="padding"
      enabled
    >
      {setLoginView()}
    </KeyboardAvoidingView>
  );
};

// Set the components styles.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  logoImage: {
    margin: 32,
    marginTop: 64,
    height: 40,
    resizeMode: 'contain',
  },
  backImage: {
    marginLeft: 16,
    height: 40,
    width: 40,
  },
  tilteText: {
    margin: 16,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(4),
    // fontWeight: '500',
    color: Colors.textColor,
  },
  enailInputText: {
    margin: 16,
    backgroundColor: Colors.surfaceColor,
  },
  passwordInputText: {
    backgroundColor: Colors.surfaceColor,
  },
  buttonLogin: {
    margin: 64,
    marginTop: 32,
    marginBottom: 32,
    fontSize: RFPercentage(2),
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
  buttonSkip: {
    margin: 64,
    marginTop: -16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    height: 60,
    borderRadius: 30,
    borderColor: Colors.buttonColor,
  },
  skipText: {
    fontFamily: 'SofiaPro-Medium',
    color: Colors.buttonColor,
    fontSize: RFPercentage(2),
  },
  registerButton: {
    marginTop: 32,
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
  forgotPasswordButton: {
    marginRight: 16,
    marginTop: -8,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  forgotPasswordText: {
    fontFamily: 'SofiaPro-Medium',
    fontSize: RFPercentage(1.7),
    color: Colors.primaryColor,
  },
});

export default LoginScreen;
