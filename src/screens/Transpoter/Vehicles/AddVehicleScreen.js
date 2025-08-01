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
  Platform,
  PermissionsAndroid,
} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import auth, {firebase} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import Menu, {MenuItem} from 'react-native-material-menu';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import Button from '../../../components/design/Button';
import TextInput from '../../../components/design/TextInput';
import {
  vehicleTypeValidator,
  vehicleNumberValidator,
  chasisNumberValidator,
  commentValidator,
  vehiclePhotsValidator
} from '../../../helper/extensions/Validator';
import Loader from '../../../components/design/Loader';
import AppConstants from '../../../helper/constants/AppConstants';
import UploadImage from '../../../components/transpoter/Drivers/UploadImage';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Load the main class.

const AddVehicleScreen = (props) => {
  const statusAddAddress = props.navigation.getParam('statusAddAddress');

  var isEdit = props.navigation.getParam('isEdit');
  if (isEdit === undefined) {
    isEdit = false
  }

  let vehicleData = undefined 
  if (isEdit) {
    vehicleData = props.navigation.getParam('vehicleData');
  }

  let vehicleTypeValue = {value: '', error: ''}
  let vehicleNumberValue = {value: '', error: ''}
  let chassisNumberValue = {value: '', error: ''}
  let commentValue = {value: '', error: ''}
  let vehiclePhotosValue = {value: '', error: ''}
  let vehicleTypeFlagValue = true
  let isVerified = false

  const convertData = (imageData) => {
    let base64Data = {}
    base64Data.base64 = imageData.base64.toBase64()
    base64Data.type = imageData.type
    return base64Data
  }

  if (vehicleData != undefined) {
    isVerified = vehicleData.data.status == AppConstants.vehicleStatusVerifiedKey
    vehicleTypeValue = {value: vehicleData.data.vehicle_type, error: ''}
    vehicleNumberValue = {value: vehicleData.data.vehicle_number, error: ''}
    chassisNumberValue = {value: vehicleData.data.chassis_number, error: ''}
    commentValue = {value: vehicleData.data.comment, error: ''}
    // vehiclePhotosValue = {value: vehicleData.data.vehicle_photos, error: ''}
    let tVehiclePhotosList = [...vehicleData.data.vehicle_photos]
    //console.log(`vehicleData.data.vehicle_photos.length: ${vehicleData.data.vehicle_photos.length}`)
    for (let i = 0; i < tVehiclePhotosList.length; i++) {
      // console.log(`tVehiclePhotosList[i].base64:`, tVehiclePhotosList[i].base64)
      let vehiclePhotosData = {...tVehiclePhotosList[i]};
      vehiclePhotosData.base64 = vehiclePhotosData.base64.toBase64()
      vehiclePhotosData.type = vehiclePhotosData.type
      tVehiclePhotosList[i] = vehiclePhotosData
    }
    vehiclePhotosValue = {value: tVehiclePhotosList, error: ''}
    vehicleTypeFlagValue = false
  }

  // console.log('statusAddAddress', statusAddAddress);
  const [vehicleType, setVehicleType] = useState(vehicleTypeValue);
  const [vehicleNumber, setVehicleNumber] = useState(vehicleNumberValue);
  const [chasisNumber, setChassisNumber] = useState(chassisNumberValue);
  const [comments, setComments] = useState(commentValue);
  const [vehiclePhotos, setVehiclePhotos] = useState(vehiclePhotosValue);
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleTypeFlag, setVehicleTypeFlag] = useState(vehicleTypeFlagValue);
  // const [vehicleType, setVehicleType] = useState('Vehicle Type');

  const onPressRegister = () => {
    const refreshData = props.navigation.getParam('refreshData');
    // console.log(`vehicleType: ${vehicleType}`)
    const vehicleTypeError = vehicleTypeValidator(vehicleType.value);
    const vehicleNumberError = vehicleNumberValidator(vehicleNumber.value);
    const chasisNumberError = chasisNumberValidator(chasisNumber.value);
    const commentsError = commentValidator(comments.value);
    const vehiclePhotosError = vehiclePhotsValidator(vehiclePhotos.value);

    if (vehicleTypeError) {
      setVehicleType({...vehicleType, error: vehicleTypeError});
      return;
    } else if (vehicleNumberError) {
      setVehicleNumber({...vehicleNumber, error: vehicleNumberError});
      return;
    } else if (chasisNumberError) {
      setChassisNumber({...chasisNumber, error: chasisNumberError});
      return;
    } else if (commentsError) {
      setComments({...comments, error: commentsError});
      return;
    } else if (vehiclePhotosError) {
      setVehiclePhotos({...vehiclePhotos, error: vehiclePhotosError});
      return;
    } else {
      // console.log('Success');
      let vehiclePhotosList = []
      for (let index = 0; index < vehiclePhotos.value.length; index++) {
        let data = vehiclePhotos.value[index];
        // console.log(`data: ${JSON.stringify(data)}`)
        let dataObject = {}
        dataObject.base64 = firestore.Blob.fromBase64String(data.base64)
        dataObject.type = data.type
        vehiclePhotosList.push(dataObject)
      }
      setIsLoading(true)
      let vehicleDataObject = {
        vehicle_type: vehicleType.value,
        vehicle_number: vehicleNumber.value,
        chassis_number: chasisNumber.value,
        comment: comments.value,
        // device_details: AppConstants.device_details,
        vehicle_photos: vehiclePhotosList,
        status: 'pending',
        is_assign: false
      }
      if (isEdit) {
        console.log(`vehicleData.id: ${vehicleData.id}`)
        firestore().collection('users').doc("B4Ti8IgLgpsKZECGqOJ0").collection('vehicle_details').doc(vehicleData.id).update({...vehicleDataObject}).then(() => {
          setIsLoading(false);
          props.navigation.pop()
          refreshData()
        }).catch(error => {
          setIsLoading(false);
          console.log(`vehicle_details.update.error:`,error)
        });
        
      } else {
        const ref = firestore().collection('users').doc("B4Ti8IgLgpsKZECGqOJ0").collection('vehicle_details');
        ref.add({...vehicleDataObject});
        setIsLoading(false);
        props.navigation.pop()
        refreshData()
      }
    }
  };

  var _menu;
  const setMenuRef = (ref) => {
    _menu = ref;
  };

  const showMenu = () => {
    _menu.show();
  };

  const hideMenu = (popupName) => {
    _menu.hide();
    console.log(`popupName:`, popupName)
    setVehicleTypeFlag(false);
    setVehicleType({value: popupName, error: ''})
  };

  const saveImageData = (imageType, response) => {
    // imageType is for tap index
    let tVehiclePhotos = [...vehiclePhotos.value]
    if (vehiclePhotos.value.length <= imageType-1) {
      tVehiclePhotos.push(response)
    } else {
      tVehiclePhotos[imageType-1] = response
    }
    setVehiclePhotos({ value: tVehiclePhotos, error: '' })
  };

  const addMultipleUploadImageView = () => {
    let uploadImageViewList = []
    for (let i = 0; i < vehiclePhotos.value.length; i++) {
      const photoData = vehiclePhotos.value[i];
      uploadImageViewList.push(
        <View style={{ flexDirection: 'row' }}>
          <UploadImage 
            titleName="Vehicle Photo" 
            titleShow={true}
            imageType={i+1}
            saveImageData={saveImageData}
            data={photoData}
            isEdit={isEdit}
            isVerified={isVerified}
            isVehicle={true}
          />
          {!isVerified ? <TouchableOpacity 
            style={{ borderRadius: 32, padding: 2, backgroundColor: 'black', position: 'absolute', top: 42, right: 6 }}
            onPress={() => {
              vehiclePhotos.value.splice(i, 1)
              setVehiclePhotos({ value: vehiclePhotos.value, error: '' })
            }}>
            <Icon name="close" size={24} color={'white'} style={{ }} />
          </TouchableOpacity> : null}
        </View>
      )
    }
    console.log(`vehiclePhotos.value.length: ${vehiclePhotos.value.length}`)
    if (vehiclePhotos.value.length < 5 && !isVerified) {
      uploadImageViewList.push(
        <UploadImage
          titleName="Vehicle Photo"
          titleShow={true}
          imageType={vehiclePhotos.value.length+1}
          saveImageData={saveImageData}
          data={undefined}
          isEdit={isEdit}
          isVerified={isVerified}
        />
      )
    }
    return uploadImageViewList
  }

  const addVehicleScreenView = () => {
    return (
      <ScrollView style={styles.container}
      keyboardShouldPersistTaps={'handled'}
      automaticallyAdjustContentInsets={false}
      showsVerticalScrollIndicator={false}>
        <Loader loading={isLoading} />
        <Menu
          ref={(ref) => setMenuRef(ref)}
          button={
            <View>
              <TouchableOpacity style={[styles.popupView, {borderColor: vehicleType.error != '' ? Colors.errorColor : Colors.borderColor}]} onPress={showMenu}>
                <Text
                  style={
                    !vehicleTypeFlag
                      ? styles.popupTextUnSelected
                      : styles.popupTextSelected
                  }>
                  {vehicleType.value == '' ? 'Select vehicle type' : vehicleType.value}
                </Text>
              </TouchableOpacity>
              {vehicleType.error != '' ?
              <Text style={styles.error}>{vehicleType.error}</Text> : null
              }
            </View>
          }>
          <View style={styles.contectMenu}>
            <MenuItem onPress={() => hideMenu('Truck')}>Truck</MenuItem>
            <MenuItem onPress={() => hideMenu('Truck')}>
              <Text style={{color: 'white'}}>
                {
                  '                                                                             '
                }
              </Text>
            </MenuItem>
          </View>
          <MenuItem onPress={() => hideMenu('Tempo')}>Tempo</MenuItem>
          <MenuItem onPress={() => hideMenu('Eicher')}>Eicher</MenuItem>
          <MenuItem onPress={() => hideMenu('Utility')}>Utility</MenuItem>
          <MenuItem onPress={() => hideMenu('Bolero')}>Bolero</MenuItem>
        </Menu>
        <View style={{padding: 16}}>
          <TextInput
            //   style={styles.nameInputText}
            label="Vehicle number"
            returnKeyType="next"
            value={vehicleNumber.value}
            onChangeText={(text) => setVehicleNumber({value: text, error: ''})}
            error={!!vehicleNumber.error}
            errorText={vehicleNumber.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._lastinput = ref;
            }}
            onSubmitEditing={() => this._emailinput && this._emailinput.focus()}
          />
          <TextInput
            //   style={styles.emailInputText}
            label="Chassis number"
            returnKeyType="next"
            value={chasisNumber.value}
            onChangeText={(text) => setChassisNumber({value: text, error: ''})}
            error={!!chasisNumber.error}
            errorText={chasisNumber.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._emailinput = ref;
            }}
            onSubmitEditing={() => this._phoneinput && this._phoneinput.focus()}
          />
          <TextInput
            //   style={styles.phoneInputText}
            label="Comments"
            returnKeyType="next"
            value={comments.value}
            onChangeText={(text) => setComments({value: text, error: ''})}
            error={!!comments.error}
            errorText={comments.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._phoneinput = ref;
            }}
            onSubmitEditing={() => Keyboard.dismiss}
            multiline
          />
        </View>
        <Text
          style={styles.tilteText}>
          Vehicle Photo
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {addMultipleUploadImageView()}
          {/* <UploadImage 
            titleName="Vehicle Photo" 
            titleShow={true}
            imageType={1}
            saveImageData={saveImageData}
            data={vehiclePhotos.value[0]}
            isEdit={isEdit}
            //isVerified={driverData != undefined && driverData.data.status == AppConstants.driverStatusVerifiedKey}
          />
          <UploadImage 
            titleName="Vehicle Photo" 
            titleShow={true}
            imageType={2}
            saveImageData={saveImageData}
            data={vehiclePhotos.value.length >= 2 ? vehiclePhotos.value[1] : undefined}
            isEdit={isEdit}
          />
          <UploadImage
            titleName="Vehicle Photo"
            titleShow={true}
            imageType={3}
            saveImageData={saveImageData}
            data={vehiclePhotos.value.length >= 3 ? vehiclePhotos.value[2] : undefined}
            isEdit={isEdit}
          />
          <UploadImage 
            titleName="Vehicle Photo"
            titleShow={true}
            imageType={4}
            saveImageData={saveImageData}
            data={vehiclePhotos.value.length >= 4 ? vehiclePhotos.value[3] : undefined}
            isEdit={isEdit}
          />
          <UploadImage
            titleName="Vehicle Photo"
            titleShow={true}
            imageType={5}
            saveImageData={saveImageData}
            data={vehiclePhotos.value.length >= 5 ? vehiclePhotos.value[4] : undefined}
            isEdit={isEdit}
          /> */}
        </ScrollView>
        {vehiclePhotos.error != '' ? <Text style={styles.error}>{vehiclePhotos.error}</Text> : null}
        {isEdit && isVerified ? <Text
          style={[styles.tilteText, {color: Colors.errorColor}]}>
          {`You can not change those information, because this vehicle are ${AppConstants.driverStatusVerifiedKey}`}
        </Text> : <TouchableOpacity style={styles.buttonLogin} onPress={onPressRegister}>
          <Text style={styles.loginText}>{isEdit ? 'EDIT VEHICLE' : 'ADD VEHICLE'}</Text>
        </TouchableOpacity>}
      </ScrollView>
    )
  }

  return AppConstants.isAndroid ? (
    <View style={{ flex: 1 }}>{addVehicleScreenView()}</View>
  ) : (
    <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#fff' }}
        behavior="padding"
        keyboardVerticalOffset={64}
        enabled>
        {addVehicleScreenView()}
    </KeyboardAvoidingView>
  );
};

AddVehicleScreen.navigationOptions = (navigationData) => {
  var isEdit = navigationData.navigation.getParam('isEdit');
  if (isEdit === undefined) {
    isEdit = false
  }

  return {
    headerShown: true,
    headerTitle: isEdit ? 'Edit Vehicle' : 'Add Vehicle',
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
  error: {
    fontSize: RFPercentage(2),
    // fontFamily: 'Roboto-Regular',
    color: Colors.errorColor,
    paddingHorizontal: 8,
    paddingTop: 8,
    marginLeft: 16,
    marginBottom: -8
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
    fontSize: RFPercentage(2),
    // fontWeight: '500',
    marginBottom: -28,
    marginTop: 12,
    color: Colors.textColor,
  },
  subTitleText: {
    marginTop: 8,
    // fontFamily: 'Roboto-Regular',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
  },
  popupView: {
    margin: 16,
    marginBottom: 0,
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 55,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 5,
    borderColor: Colors.borderColor,
    borderWidth: 0.8,
  },
  popupTextUnSelected: {
    marginLeft: 12,
    marginRight: 12,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2),
  },
  popupTextSelected: {
    marginLeft: 12,
    marginRight: 12,
    color: 'darkgray',
    fontSize: RFPercentage(2),
  },
  contectMenu: {
    marginTop: 16,
    flexDirection: 'row',
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
    justifyContent: 'center',
    // backgroundColor: Colors.backgroundColor,
  },
  nextImage: {
    height: 150,
    width: 150,
    resizeMode: 'contain',
  },
});

export default AddVehicleScreen;
