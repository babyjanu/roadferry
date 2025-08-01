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

import {
  emailValidator,
  passwordValidator,
} from '../../helper/extensions/Validator';
import Loader from '../../components/design/Loader';
import { setIsLoginUser, setLoginUserType } from '../../navigation/MainNavigation';
import { NavigationActions, StackActions } from 'react-navigation';
import AppConstants from '../../helper/constants/AppConstants';
import {useDispatch} from 'react-redux';

// Load the main class.
const resetDashboardAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Dashboard" })]
});

const LoginScreen_Old = (props) => {
  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});
  const [isLoading, setIsLoading] = useState(false);
  const [passworVisible, setPassworVisible] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const dispatch = useDispatch();

  const invalid = () => {
    Alert.alert(
      'Alert',
      'Email or Password invalid!',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }

  const clearUserData = () => {
    console.log(`clearUserData`)
    dispatch({
      type: fetchProfileDataActions.FETCH_PROFILE_DATA,
      fetchProfileData: [],
      userUID: ''
    });
  }

  useEffect(() => {
    clearUserData()
    const willFocusSub = props.navigation.addListener('focus', () => {
      clearUserData()
    });

    return () => {
      willFocusSub();
    };
  }, []);

  const onPressSkip = () => {
    // props.navigation.dispatch(resetDashboardAction)
    console.log(`onPressSkip`)
    // props.navigation.pop(2)
    /* props.navigation.navigate({
      routeName: 'Dashboard',
    }); */
    props.navigation.goBack()
  }

  const onPressLogin = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError) {
      setEmail({...email, error: emailError});
      return;
    } else if (passwordError) {
      setPassword({...password, error: passwordError});
      return;
    } else {
      setIsLoading(true);
      auth()
        .fetchSignInMethodsForEmail(email.value)
        .then((result) => {
          console.log('result', result);
          if (result.toString() === 'password') {
            auth()
              .signInWithEmailAndPassword(email.value, password.value)
              .then((response) => {
                setIsLoading(false);
                // console.log('Email response is : ', response);
                console.log('rootRef is :', response.user.uid);
                console.log('firebase.firestore.FieldPath.documentId():', firebase.firestore.FieldPath.documentId());

                response.user.getIdToken(true).then(token => {
                  firestore()
                  .collection('users')
                  .where('user_type', 'in', ['Customer', 'customer'])
                  .where(firebase.firestore.FieldPath.documentId(), '==', response.user.uid)
                  .get()
                  .then(querySnapshot => {
                    console.log('Total users: ', querySnapshot.size);
                    if (querySnapshot.size == 0) {
                      setIsLoading(false);
                      setTimeout(() => {
                        invalid()
                      }, 500)
                    } else {
                      querySnapshot.forEach(documentSnapshot => {
                        console.log('User ID: ', documentSnapshot.id);
                        // if (documentSnapshot.id == response.user.uid) {
                          AsyncStorage.setItem(AppPreference.IS_LOGIN, '1');
                          AsyncStorage.setItem(AppPreference.LOGIN_UID,response.user.uid);
                          AsyncStorage.setItem(AppPreference.LOGIN_TOKEN,token);

                          AsyncStorage.getItem(AppPreference.FCM_TOKEN).then((fcmToken) => {
                            if (fcmToken == null) {
                              setIsLoading(false);
                              console.log(`AppPreference.FCM_TOKEN.null`)
                            } else {
                              console.log(`AppPreference.FCM_TOKEN:`, fcmToken)

                              let updatedData = { access_token: token, fcm_token: fcmToken }
                              firestore()
                              .collection('users')
                              .doc(documentSnapshot.id)
                              .update(updatedData)

                              let userData = {...documentSnapshot.data()}
                              userData.access_token = token
                              userData.fcm_token = fcmToken
                              console.log(`userData:`, userData)

                              AsyncStorage.setItem(
                                AppPreference.LOGIN_USER_DATA,
                                JSON.stringify(userData),
                              ).then(() => {
                                setIsLoginUser(true)
                                dispatch({
                                  type: fetchProfileDataActions.FETCH_PROFILE_DATA,
                                  fetchProfileData: documentSnapshot.data(),
                                  userUID: documentSnapshot.id
                                });
                                /* props.navigation.navigate({
                                  routeName: 'Dashboard',
                                }); */
                                props.navigation.goBack()
                              })
                            }
                          });
                        // }
                      });
                    }
                  }).catch(error => {
                    setIsLoginUser(true)
                    console.error(error)
                  });
                }).catch(error => {
                  setIsLoginUser(true)
                  console.log(`error:`, error)
                })
                // props.navigation.navigate({
                //   routeName: 'Dashboard',
                //   params: {
                //     firebaseUID: response.user.uid,
                //   },
                // });
              })
              .catch((error) => {
                setIsLoading(false);
                console.log('Error is : ', error.code);
                setTimeout(() => {
                  invalid()
                }, 500)
              });
          } else {
            setIsLoading(false);
            console.log('Email id not available');
            setTimeout(() => {
              Alert.alert(
                'Alert',
                'Email id not available',
                [{text: 'OK', onPress: () => console.log('OK Pressed')}],
                {cancelable: false},
              );
            }, 500)
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.log('Error is : ', error.code);
        });
    }
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
          style={{flex: 1, backgroundColor: Colors.mainBackgroundColor}}>
          <ScrollView style={styles.container}
          keyboardShouldPersistTaps={'handled'}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator={false}>
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
                // style={styles.enailInputText}
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
                  this._passwordinput && this._passwordinput.focus()
                }
              />
              <PasswordTextInput
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
              />
            </View>
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() =>
                props.navigation.navigate({
                  routeName: 'ForgotPasswordScreen',
                })
              }>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonLogin} onPress={onPressLogin}>
              <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonSkip} onPress={onPressSkip}>
              <Text style={styles.skipText}>SKIP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() =>
                props.navigation.navigate({
                  routeName: 'RegisterScreen',
                })
              }>
              <Text style={styles.haveAnAccountText}>
                Don't have an account yet?
              </Text>
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }

  return AppConstants.isAndroid ? (
    <View style={{ flex: 1 }}>{setLoginView()}</View>
  ) : (
    <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#fff' }}
        behavior="padding"
        enabled>
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
    fontSize: RFPercentage(2)
  },
  buttonSkip: {
    margin: 64,
    marginTop: -16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    height: 60,
    borderRadius: 30,
    borderColor: Colors.buttonColor
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

export default LoginScreen_Old;
