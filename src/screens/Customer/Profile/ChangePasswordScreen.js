import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  ScrollView,
  Dimensions
} from 'react-native';

// Import the Plugins and Thirdparty library.

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import TextInput from '../../../components/design/TextInput';
import {
  oldPasswordValidator,
  newPasswordValidator,
  confirmPasswordValidator,
  passwordMatchValidator,
} from '../../../helper/extensions/Validator';
import {RFPercentage} from 'react-native-responsive-fontsize';
// Load the main class.
import { firebase } from '@react-native-firebase/database';
import Loader from '../../../components/design/Loader';
import Modal from 'react-native-modal';
import CHeader from '../../../components/CHeader';

const windowWidth = Dimensions.get('window').width;

const ChangePasswordScreen = (props) => {
  const [oldPassword, setOldPassword] = useState({value: '', error: ''});
  const [newPassword, setNewPassword] = useState({value: '', error: ''});
  const [confirmPassword, setConfirmPassword] = useState({
    value: '',
    error: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
        user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }

  const changePassword = (currentPassword, newPassword) => {
    reauthenticate(currentPassword).then(() => {
      var user = firebase.auth().currentUser;
      user.updatePassword(newPassword).then(() => {
        console.log("Password updated!");
        setPopup(true)
        setIsLoading(false)
      }).catch((error) => {
        console.log(`updatePassword.error:`, error.message);
        setIsLoading(false)
      });
    }).catch((error) => { 
      console.log(`reauthenticate.error:`, error.message);
      let errorMessage = error.message
      if (errorMessage.includes('too-many-requests')) {
        setErrorMessage('Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.')
        setPopup(true)
      } else if (errorMessage.includes('wrong-password')) {
        setOldPassword({...oldPassword, error: 'The password is invalid or the user does not have a password'});
      } else {
        setErrorMessage('Something went wrong. Please try again.')
        setPopup(true)
      }
      setIsLoading(false)
    });
  }

  const onPressChangePassword = () => {
    // const {currentUser} = auth();
    // console.log('currentUser is ', currentUser);
    const oldPasswordError = oldPasswordValidator(oldPassword.value);
    const newPasswordError = newPasswordValidator(newPassword.value);
    const confirmPasswordError = confirmPasswordValidator(
      confirmPassword.value,
    );
    const passwordMatchError = passwordMatchValidator(
      newPassword.value,
      confirmPassword.value,
    );

    if (oldPasswordError) {
      setOldPassword({...oldPassword, error: oldPasswordError});
      return;
    } else if (newPasswordError) {
      setNewPassword({...newPassword, error: newPasswordError});
      return;
    } else if (confirmPasswordError) {
      setConfirmPassword({...confirmPassword, error: confirmPasswordError});
      return;
    } else if (passwordMatchError) {
      setConfirmPassword({...confirmPassword, error: passwordMatchError});
      return;
    } else {
      console.log('onPressChangePassword');
      setIsLoading(true)
      changePassword(oldPassword.value, newPassword.value)
      // auth()
      //   .currentUser.updatePassword(newPassword.value)
      //   .then((response) => {
      //     console.log('Change password response is : ', response);
      //     Alert.alert(
      //       'Alert',
      //       'Password change successfully',
      //       [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      //       {cancelable: false},
      //     );
      //     props.navigation.navigate('Auth');
      //   })
      //   .catch((err) => {
      //     console.log('Change password error is : ', err);
      //     Alert.alert(
      //       'Alert',
      //       'Invalid!',
      //       [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      //       {cancelable: false},
      //     );
      //   });
    }
  };

  const onPressHomeButton = () => {
    setPopup(false);
    props.navigation.pop();
  };
  
  return (
    <ScrollView style={styles.container}>
      <CHeader navigation={props.navigation} isBackBtn={true} headerTitle={'Change Password'} />

      <View style={{padding: 16}}>
        <TextInput
          label="Old Password"
          returnKeyType="next"
          value={oldPassword.value}
          onChangeText={(text) => setOldPassword({value: text, error: ''})}
          error={!!oldPassword.error}
          errorText={oldPassword.error}
          secureTextEntry={true}
          ref={(ref) => {
            this._oldPasswordinput = ref;
          }}
          onSubmitEditing={() =>
            this._newPasswordinput && this._newPasswordinput.focus()
          }
        />
        <TextInput
          label="New Password"
          returnKeyType="next"
          value={newPassword.value}
          onChangeText={(text) => setNewPassword({value: text, error: ''})}
          error={!!newPassword.error}
          errorText={newPassword.error}
          secureTextEntry={true}
          ref={(ref) => {
            this._newPasswordinput = ref;
          }}
          onSubmitEditing={() =>
            this._confirmPasswordinput && this._confirmPasswordinput.focus()
          }
        />
        <TextInput
          label="Confirm Password"
          returnKeyType="done"
          value={confirmPassword.value}
          onChangeText={(text) => setConfirmPassword({value: text, error: ''})}
          error={!!confirmPassword.error}
          errorText={confirmPassword.error}
          secureTextEntry={true}
          ref={(ref) => {
            this._confirmPasswordinput = ref;
          }}
          onSubmitEditing={Keyboard.dismiss}
        />
      </View>

      <TouchableOpacity
        style={styles.changePasswordView}
        onPress={onPressChangePassword}>
        <Text style={styles.changePasswordText}>Change Password</Text>
      </TouchableOpacity>

      <Modal isVisible={popup}>
          <View style={{flex: 1}}>
            <View style={styles.centeredView}>
              <View style={styles.popupMessageView}>
                {errorMessage === '' ? 
                <>
                  <Image
                    style={styles.clickImage}
                    source={require('../../../assets/assets/PlaceOrder/checkout_click.png')}
                  />
                  <Text style={{...styles.totalAmountText, textAlign: 'center'}}>
                    Your password has been changed successfully.
                  </Text>
                </> :
                <> 
                  <Image
                    style={styles.clickImage}
                    source={require('../../../assets/assets/PlaceOrder/close_icon.png')}
                  />
                  <Text style={{...styles.totalAmountText, textAlign: 'center'}}>
                    {errorMessage}
                  </Text>
                </>
                }
                <TouchableOpacity
                  style={styles.homeButtonView}
                  onPress={() => onPressHomeButton()}>
                  <Text style={styles.placeOrderText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
      </Modal>
      <Loader loading={isLoading} />
    </ScrollView>
  );
};

ChangePasswordScreen.navigationOptions = (navigationData) => {
  return {
    headerShown: true,
    headerTitle: 'Change Password',
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
      backgroundColor: Colors.mainBackgroundColor,
    },
    headerLeft: (
      <View style={styles.viewHeaderLeft}>
        <TouchableOpacity
          onPress={() => {
            navigationData.navigation.pop();
          }}>
          <Image
            style={styles.menuImage}
            source={require('../../../assets/assets/Authentication/back.png')}
          />
        </TouchableOpacity>
      </View>
    ),
  };
};

// Set the components styles.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 30,
    width: 30,
  },
  changePasswordView: {
    margin: 64,
    marginLeft: 64,
    marginRight: 64,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Medium',
    backgroundColor: Colors.buttonColor,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  changePasswordText: {
    fontSize: RFPercentage(2),
    color: Colors.backgroundColor,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupMessageView: {
    backgroundColor: Colors.backgroundColor,
    // height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth - 64,
    borderRadius: 10,
  },
  clickImage: {
    marginTop: 16,
    height: 50,
    width: 50,
  },
  totalAmountText: {
    margin: 16,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
  },
  homeButtonView: {
    margin: 16,
    fontSize: RFPercentage(2),
    backgroundColor: Colors.buttonColor,
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  placeOrderText: {
    color: Colors.backgroundColor,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    // color: Colors.backgroundColor,
  },
});

export default ChangePasswordScreen;