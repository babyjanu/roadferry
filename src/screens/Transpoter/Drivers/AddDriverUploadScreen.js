import React, {useState, useEffect, useCallback} from 'react';
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
  ImageBackground,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

// Import the Plugins and Thirdparty library.
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import auth, {firebase} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import TextInput from '../../../components/design/TextInput';
import {
  flatNameValidator,
  areaValidator,
  cityValidator,
  stateValidator,
  countryValidator,
  pinCodeValidator,
} from '../../../helper/extensions/Validator';
import Loader from '../../../components/design/Loader';
import AppConstants from '../../../helper/constants/AppConstants';
import PickupAddAddress from '../../../helper/models/addAddress/PickupAddAddress';
import DropAddAddress from '../../../helper/models/addAddress/DropAddAddress';
import AppPreference from '../../../helper/preference/AppPreference';
import * as addAddressActions from '../../../store/actions/addAddress/addAddress';
import * as dropAddAddressActions from '../../../store/actions/addAddress/dropAddAddress';
import UploadImage from '../../../components/transpoter/Drivers/UploadImage';

// Load the main class.
const windowWidth = Dimensions.get('window').width;

const AddDriverUploadScreen = (props) => {
  const statusAddAddress = props.navigation.getParam('statusAddAddress');
  // console.log('statusAddAddress', statusAddAddress);
  let isEdit = props.navigation.getParam('isEdit');
  if (isEdit === undefined) {
    isEdit = false
  }

  let driverData = undefined 
  if (isEdit) {
    driverData = props.navigation.getParam('driverData');
  }

  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState(false);
  
  const convertData = (imageData) => {
    let base64Data = {}
    base64Data.base64 = imageData.base64.toBase64()
    base64Data.type = imageData.type
    return base64Data
  }

  let addressProofValue = {data: '', error: ''}
  let identityProofValue = {data: '', error: ''}
  let driverPhotoValue = {data: '', error: ''}
  if (driverData != undefined) {
    console.log(`driverData.id: ${driverData.id}`)
    let isVerified = driverData.data.status == AppConstants.driverStatusVerifiedKey
    addressProofValue = {data: convertData(driverData.data.address_proof), error: isVerified ? `You can not change address proof, because this driver are ${AppConstants.driverStatusVerifiedKey}` : ''}
    identityProofValue = {data: convertData(driverData.data.identity_proof), error: isVerified ? `You can not change identity proof, because this driver are ${AppConstants.driverStatusVerifiedKey}` : ''}
    driverPhotoValue = {data: convertData(driverData.data.driver_photo), error: ''}
  }
  
  const [addressProof, setAddressProof] = useState(addressProofValue);
  const [identityProof, setIdentityProof] = useState(identityProofValue);
  const [driverPhoto, setDriverPhoto] = useState(driverPhotoValue);

  const [resourcePathImage, setResourcePathImage] = useState('');

  //   const pickupAddressData = useSelector(
  //     (state) => state.pickupAddressData.pickupAddressData,
  //   );

  const dispatch = useDispatch();

  const onPressRegister = () => {
    const firstName = props.navigation.getParam('firstName');
    const lastName = props.navigation.getParam('lastName');
    const email = props.navigation.getParam('email');
    const phone = props.navigation.getParam('phone');
    const age = props.navigation.getParam('age');
    const password = props.navigation.getParam('password');
    const goBack = props.navigation.getParam('goBack');
    // const newPassword = this.props.route.params.password;
    // console.log(`newPassword: ${newPassword}`)
    
    // return
    if (addressProof.data == '') {
      setAddressProof({...addressProof, error: 'Please upload Address Proof'});
      return;
    } else if (identityProof.data == '') {
      setIdentityProof({
        ...identityProof,
        error: 'Please upload Identity Proof',
      });
      return;
    } else if (driverPhoto.data == '') {
      setDriverPhoto({...driverPhoto, error: 'Please upload Driver Photo'});
      return;
    } else {
      // return
      if (isEdit) {
        setIsLoading(true);
        let editDriverData = {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phone,
          age: age,
          temp_password: driverData.data.temp_password,
          address_proof: {
            base64: firestore.Blob.fromBase64String(addressProof.data.base64),
            type: addressProof.data.type
          },
          identity_proof: {
            base64: firestore.Blob.fromBase64String(identityProof.data.base64),
            type: identityProof.data.type
          },
          driver_photo: {
            base64: firestore.Blob.fromBase64String(driverPhoto.data.base64),
            type: driverPhoto.data.type
          }, 
          status: driverData.data.status,
          is_assign: driverData.data.is_assign
        }
        firestore().collection('users').doc(driverData.data.user_uid).set({...editDriverData, user_type: 'driver'})
        firestore()
          .collection('users')
          .doc("B4Ti8IgLgpsKZECGqOJ0")
          .collection('driver_details')
          .doc(driverData.id).update({...editDriverData, user_uid: driverData.data.user_uid});
        setIsLoading(false);
        props.navigation.pop()
        goBack()
      } else {
        setIsLoading(true);
        auth()
          .createUserWithEmailAndPassword(email, password)
          .then((response) => {
            // console.log('rootRef is : ', response.user.uid);
            let driverData = {
              first_name: firstName,
              last_name: lastName,
              email: email,
              phone_number: phone,
              age: age,
              temp_password: password,
              // device_details: AppConstants.device_details,
              address_proof: {
                base64: firestore.Blob.fromBase64String(addressProof.data.base64),
                type: addressProof.data.type
              },
              identity_proof: {
                base64: firestore.Blob.fromBase64String(identityProof.data.base64),
                type: identityProof.data.type
              },
              driver_photo: {
                base64: firestore.Blob.fromBase64String(driverPhoto.data.base64),
                type: driverPhoto.data.type
              },
              status: 'pending',
              is_assign: false
            }
            // console.log(`driverData.fromBase64String: ${JSON.stringify(driverData.driver_photo)}`)
            // console.log(`driverData.toBase64: ${driverData.driver_photo.toBase64()}`)
            // return
            firestore().collection('users').doc(response.user.uid).set({...driverData, user_type: 'driver'})
            const ref = firestore().collection('users').doc("B4Ti8IgLgpsKZECGqOJ0").collection('driver_details');
            ref.add({...driverData, user_uid: response.user.uid});
            setIsLoading(false);
            props.navigation.pop()
            goBack()
            /* props.navigation.navigate({
              routeName: 'Dashboard',
            }); */
          })
          .catch((error) => {
            setIsLoading(false);
            console.log('Error is : ', error.code);
            console.log('Please login with Email with password account');
            Alert.alert(
              'Alert',
              'Email id already exist.Please login',
              [{text: 'OK', onPress: () => console.log('OK Pressed')}],
              {cancelable: false},
            );
          });
      }
    }
  };

  const saveImageData = (imageType, response) => {
    //imageType => 1 for Address Proof, 2 for Identity Proof, 3 for Driver Photo
    console.log(`imageType: ${imageType}`);
    console.log(`response: ${JSON.stringify(response)}`);
    if (imageType == 1) {
      setAddressProof({data: response, error: ''});
    } else if (imageType == 2) {
      setIdentityProof({data: response, error: ''});
    } else if (imageType == 3) {
      setDriverPhoto({data: response, error: ''});
    }
  };

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={Platform.OS == "android" ? 0 : 30}>
        <Loader loading={isLoading} />
        <View style={styles.lineView}>
          <View style={styles.inActiveDotView}>
            <Text style={styles.inActiveNumberText}>1</Text>
          </View>
          <View style={styles.inActiveLineView} />
          <View style={styles.activeLineView} />
          <View style={styles.activeDotView}>
            <Text style={styles.activeNumberText}>2</Text>
          </View>
        </View>
        <View style={styles.lineViewText}>
          <Text style={styles.registerText}>General details</Text>
          <Text style={styles.haveAnAccountText}>Upload Document</Text>
        </View>
        <UploadImage
          titleName="Address Proof (Pancard, Adhaar Card, Voter Id) - At Least One"
          imageType={1}
          errorMessage={addressProof.error}
          saveImageData={saveImageData}
          data={addressProof.data}
          isEdit={isEdit}
          isVerified={driverData != undefined && driverData.data.status == AppConstants.driverStatusVerifiedKey}
        />
        <UploadImage
          titleName="Identity Proof (License)"
          imageType={2}
          errorMessage={identityProof.error}
          saveImageData={saveImageData}
          data={identityProof.data}
          isEdit={isEdit}
          isVerified={driverData != undefined && driverData.data.status == AppConstants.driverStatusVerifiedKey}
        />
        <UploadImage
          titleName="Driver Photo"
          imageType={3}
          errorMessage={driverPhoto.error}
          saveImageData={saveImageData}
          data={driverPhoto.data}
          isEdit={isEdit}
          isVerified={driverData != undefined && driverData.data.status == AppConstants.driverStatusVerifiedKey}
        />
        <TouchableOpacity style={styles.buttonLogin} onPress={onPressRegister}>
          <Text style={styles.loginText}>{isEdit ? 'EDIT DRIVER' : 'ADD DRIVER'}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

AddDriverUploadScreen.navigationOptions = (navigationData) => {
  var isEdit = navigationData.navigation.getParam('isEdit');
  if (isEdit === undefined) {
    isEdit = false
  }
  
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
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    // fontWeight: '500',
    color: Colors.textColor,
  },
  subTitleText: {
    marginTop: 8,
    // fontFamily: 'Roboto-Regular',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
  },
  uploadView: {
    margin: 16,
    marginTop: 0,
    backgroundColor: Colors.backgroundColor,
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primaryColor,
  },
  placeholderImage: {
    width: 50,
    height: 50,
    justifyContent: 'center',
  },
  addPhtosImage: {
    height: 50,
    width: 50,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupView: {
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
  placeOrderText: {
    color: Colors.backgroundColor,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    // color: Colors.backgroundColor,
  },
  homeButtonView: {
    margin: 16,
    fontSize: RFPercentage(2),
    backgroundColor: Colors.buttonColor,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: windowWidth / 2,
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
    marginBottom: 16,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Medium',
    backgroundColor: Colors.buttonColor,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30
  },
  loginText: {
    fontFamily: 'SofiaPro-Medium',
    color: Colors.backgroundColor,
    fontSize: RFPercentage(2),
  },
  registerButton: {
    // marginTop: -32,
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
    color: Colors.subTitleTextColor,
  },
  haveAnAccountText: {
    fontFamily: 'SofiaPro-Medium',
    fontSize: RFPercentage(1.7),
    color: Colors.primaryColor,
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
    justifyContent: 'center',
    // backgroundColor: Colors.backgroundColor,
  },
  nextImage: {
    height: 150,
    width: 150,
    resizeMode: 'contain',
  },
});

export default AddDriverUploadScreen;
