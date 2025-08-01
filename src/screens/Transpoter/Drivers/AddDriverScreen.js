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
  AsyncStorage,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import auth, {firebase} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import Button from '../../../components/design/Button';
import TextInput from '../../../components/design/TextInput';
import {
  nameValidator,
  emailValidator,
  phoneValidator,
  lastNameValidator,
} from '../../../helper/extensions/Validator';
import Loader from '../../../components/design/Loader';
import AppConstants from '../../../helper/constants/AppConstants';

// Load the main class.

const AddDriverScreen = (props) => {
  const statusAddAddress = props.navigation.getParam('statusAddAddress');
  // console.log('statusAddAddress', statusAddAddress);

  let isEdit = props.navigation.getParam('isEdit');
  if (isEdit === undefined) {
    isEdit = false
  }
  // props.navigation.setParams({ isEdit: isEdit })

  let driverData = undefined 
  // props.navigation.setOptions({ title: 'Add Driver' })
  if (isEdit) {
    driverData = props.navigation.getParam('driverData');
    // props.navigation.setOptions({ title: 'Edit Driver' })
  }
  let nameValue = {value: '', error: ''}
  let lastNameValue = {value: '', error: ''}
  let emailValue = {value: '', error: ''}
  let phoneValue = {value: '', error: ''}
  let ageValue = {value: '', error: ''}

  if (driverData != undefined) {
    console.log(`driverData.id: ${driverData.id}`)
    let isVerified = driverData.data.status == AppConstants.driverStatusVerifiedKey
    nameValue = {value: driverData.data.first_name, error: isVerified ? `You can not change first name, because this driver are ${AppConstants.driverStatusVerifiedKey}` : ''}
    lastNameValue = {value: driverData.data.last_name, error: isVerified ? `You can not change last name, because this driver are ${AppConstants.driverStatusVerifiedKey}` : ''}
    emailValue = {value: driverData.data.email, error: ''}
    phoneValue = {value: driverData.data.phone_number, error: ''}
    ageValue = {value: driverData.data.age, error: isVerified ? `You can not change age, because this driver are ${AppConstants.driverStatusVerifiedKey}` : ''}
  }

  const [name, setName] = useState(nameValue);
  const [lastName, setLastName] = useState(lastNameValue);
  const [email, setEmail] = useState(emailValue);
  const [phone, setPhone] = useState(phoneValue);
  const [age, setAge] = useState(ageValue);
  const [isLoading, setIsLoading] = useState(false);
  // const [lastNameInputRef, setLastNameInputRef] = React.useState(null);
  const lastNameInputRef = useRef(null);

  const onPressRegister = () => {
    const refreshData = props.navigation.getParam('refreshData');
    const nameError = nameValidator(name.value);
    const lastNameError = lastNameValidator(lastName.value);
    const emailError = emailValidator(email.value);
    const phoneError = phoneValidator(phone.value);

    if (nameError) {
      setName({...name, error: nameError});
      return;
    } else if (lastNameError) {
      setLastName({...lastName, error: lastNameError});
      return;
    } else if (emailError) {
      setEmail({...email, error: emailError});
      return;
    } else if (phoneError) {
      setPhone({...phone, error: phoneError});
      return;
    } else {
      var password = '';
      if (isEdit) {
        if (driverData != undefined) {
          password = driverData.data.temp_password
        }
      } else {
        password = Math.random().toString(36).slice(-8);
      }
      console.log(`email.value: ${email.value}`)
      console.log(`password: ${password}`)
      props.navigation.navigate({
        routeName: 'AddDriverUploadScreen',
        params: {
          firstName: name.value,
          lastName: lastName.value,
          email: email.value,
          phone: phone.value,
          age: age.value,
          password: password,
          statusAddAddress: statusAddAddress,
          goBack: () => {
            props.navigation.pop()
            refreshData()
          },
          isEdit: isEdit,
          driverData: driverData
        },
      });
      return
    }
  };

  const addDriverScreenView = () => {
    let isVerified = driverData != undefined && driverData.data.status == AppConstants.driverStatusVerifiedKey
    console.log(`isVerified: ${isVerified}`)
    return (
      <ScrollView 
        style={styles.container}
        keyboardShouldPersistTaps={'handled'}
        automaticallyAdjustContentInsets={false}
        showsVerticalScrollIndicator={false}>
          <Loader loading={isLoading} />
          <View style={styles.lineView}>
            <View style={styles.activeDotView}>
              <Text style={styles.activeNumberText}>1</Text>
            </View>
            <View style={styles.activeLineView} />
            <View style={styles.inActiveLineView} />
            <View style={styles.inActiveDotView}>
              <Text style={styles.inActiveNumberText}>2</Text>
            </View>
          </View>
          <View style={styles.lineViewText}>
            <Text style={styles.registerText}>General details</Text>
            <Text style={styles.haveAnAccountText}>Upload Document</Text>
          </View>
          <View style={{padding: 16}}>
            <TextInput
              //   style={styles.nameInputText}
              label="First Name"
              returnKeyType="next"
              value={name.value}
              onChangeText={(text) => setName({value: text, error: ''})}
              editable={!isVerified}
              error={isVerified ? !name.error : !!name.error}
              errorText={name.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="default"
              // blurOnSubmit={false}
              ref={(ref) => {
                this._nameinput = ref;
              }}
              onSubmitEditing={() => {
                console.log(`lastNameInputRef: `, lastNameInputRef)
                /* if (lastNameInputRef != null) {
                  lastNameInputRef.current._root.focus()
                } */
              }}
            />
            <TextInput
              ref={lastNameInputRef}
              label="Last Name"
              returnKeyType="next"
              value={lastName.value}
              onChangeText={(text) => setLastName({value: text, error: ''})}
              editable={!isVerified}
              error={isVerified ? !lastName.error : !!lastName.error}
              errorText={lastName.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="default"
              onSubmitEditing={() => this._emailinput && this._emailinput.focus()}
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
              onSubmitEditing={() => this._phoneinput && this._phoneinput.focus()}
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
              onSubmitEditing={() => this._ageinput && this._ageinput.focus()}
            />
            <TextInput
              //   style={styles.phoneInputText}
              label="Age"
              returnKeyType="next"
              value={age.value}
              onChangeText={(text) => setAge({value: text, error: ''})}
              editable={!isVerified}
              error={isVerified ? !age.error : !!age.error}
              errorText={age.error}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={10}
              keyboardType="number-pad"
              ref={(ref) => {
                this._ageinput = ref;
              }}
              onSubmitEditing={() => Keyboard.dismiss}
            />
          </View>
          <TouchableOpacity style={styles.nextView} onPress={onPressRegister}>
            <Image
              style={styles.nextImage}
              source={require('../../../assets/assets/SliderScreen/next.png')}
            />
          </TouchableOpacity>
      </ScrollView>
    )
  }

  return AppConstants.isAndroid ? (
    <View style={{ flex: 1 }}>{addDriverScreenView()}</View>
  ) : (
    <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#fff' }}
        behavior="padding"
        keyboardVerticalOffset={64}
        enabled>
        {addDriverScreenView()}
    </KeyboardAvoidingView>
  );
};

AddDriverScreen.navigationOptions = (navigationData) => {
  var isEdit = navigationData.navigation.getParam('isEdit');
  if (isEdit === undefined) {
    isEdit = false
  }
  // console.log(`isEdit: ${isEdit}`)

  return {
    headerShown: true,
    headerTitle: isEdit ? 'Edit Driver' : 'Add Driver',
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
            style={styles.backImage}
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
    marginTop: 32,
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
    marginRight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nextView: {
    alignItems: 'center',
    justifyContent: 'center'
    // backgroundColor: Colors.backgroundColor,
  },
  nextImage: {
    height: 150,
    width: 150,
    resizeMode: 'contain'
  },
});

export default AddDriverScreen;
