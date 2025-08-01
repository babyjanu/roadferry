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
  AsyncStorage,
  Alert,
  NativeModules,
  Platform,
} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import auth from '@react-native-firebase/auth';

// Import the JS file.

import Colors from '../../helper/extensions/Colors';
import Button from '../../components/design/Button';
import TextInput from '../../components/design/TextInput';
import PasswordTextInput from '../../components/design/PasswordTextInput';

import {
  emailValidator,
  passwordValidator,
} from '../../helper/extensions/Validator';
import Loader from '../../components/design/Loader';

// Load the main class.

const ForgotPasswordScreen = (props) => {
  const [email, setEmail] = useState({value: '', error: ''});
  const [isLoading, setIsLoading] = useState(false);

  const onPressLogin = () => {
    const emailError = emailValidator(email.value);

    if (emailError) {
      setEmail({...email, error: emailError});
      return;
    } else {
      auth()
        .sendPasswordResetEmail(email.value)
        .then(function (user) {
          console.log('Result is : ', user);
          Alert.alert(
            'Alert',
            'Sent a link to reset password on your mail id. Please check your mail.',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
        })
        .catch(function (e) {
          console.log(e);
          console.log('Result is : ', e);
          Alert.alert(
            'Alert',
            'Email id not exist.',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
        });
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor={Colors.mainBackgroundColor}
        barStyle="dark-content"
      />
      <SafeAreaView
        style={{flex: 0, backgroundColor: Colors.mainBackgroundColor}}
      />
      <SafeAreaView
        style={{flex: 1, backgroundColor: Colors.mainBackgroundColor}}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={Platform.OS == "android" ? 0 : 30}>
            <Loader loading={isLoading} />
            <TouchableOpacity onPress={() => props.navigation.pop()}>
              <Image
                style={styles.backImage}
                source={require('../../assets/assets/Authentication/back.png')}
              />
            </TouchableOpacity>
            <Text style={styles.tilteText}>Forgot Password</Text>
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
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>
            <TouchableOpacity style={styles.buttonLogin} onPress={onPressLogin}>
              <Text style={styles.loginText}>SUBMIT</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </>
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
  },
  subTitleText: {
    marginTop: 8,
    // fontFamily: 'Roboto-Regular',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
  },
  headerImage: {
    height: 120,
    width: 70,
  },
  enailInputText: {
    margin: 16,
    backgroundColor: Colors.surfaceColor,
  },
  buttonLogin: {
    margin: 64,
    marginTop: 32,
    fontSize: RFPercentage(2),
    backgroundColor: Colors.buttonColor,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  loginText: {
    color: Colors.backgroundColor,
    fontSize: RFPercentage(2.5),
  },
});

export default ForgotPasswordScreen;
