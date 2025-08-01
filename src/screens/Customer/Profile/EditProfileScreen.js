import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  Alert,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';
import {useSelector, useDispatch, connect} from 'react-redux';

// Import the Plugins and Thirdparty library.
import {RFPercentage} from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';

// Import the JS file.
import Colors from '../../../helper/extensions/Colors';
import TextInput from '../../../components/design/TextInput';
import {
  nameValidator,
  emailValidator,
  phoneValidator,
  passwordValidator,
  lastNameValidator,
} from '../../../helper/extensions/Validator';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import Loader from '../../../components/design/Loader';
import storage from '@react-native-firebase/storage'
import AppConstants from '../../../helper/constants/AppConstants';
import CHeader from '../../../components/CHeader';
import CModal from '../../../components/design/CModal';

// Load the main class.
const windowWidth = Dimensions.get('window').width;

const EditProfileScreen = (props) => {
  let userUID = useSelector(
    (state) => state.fetchProfileData.userUID,
  );
  // userUID = "B4Ti8IgLgpsKZECGqOJ0"
  console.log(`EditProfileScreen.userUID: ${userUID}`)

  const profileData = useSelector(
    (state) => state.fetchProfileData.fetchProfileData,
  );
  const [name, setName] = useState({
    value: profileData.first_name,
    error: '',
  });
  const [lastName, setLastName] = useState({
    value: profileData.last_name,
    error: '',
  });
  const [email, setEmail] = useState({value: profileData.email, error: ''});
  const [phone, setPhone] = useState({
    value: profileData.phone_number,
    error: '',
  });
  const [popup, setPopup] = useState(false);
  const [uploadPopup, setUploadPopup] = useState(false);

  // Image Picker view method
  const [selectedImage, setSelectedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectFile = (selectedImageValue) => {
    var options = {
      title: 'Select Image',
      //   customButtons: [
      //     {
      //       name: 'customOptionKey',
      //       title: 'Choose file from Custom Option',
      //     },
      //   ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (res) => {
      // console.log('Response = ', res);
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
        Alert.alert(
          'Alert',
          res.error,
          [{text: 'OK', onPress: () => console.log('OK Pressed')}],
          {cancelable: false},
        );
      } else {
        let source = res;
        setSelectedImage(source);
        // selectedImageCheck = true;
        // imageBase64 = res.uri;
      }
    });
  };

  const onPressHomeButton = () => {
    setPopup(false);
    props.navigation.pop();
  };

  const updateUserData = (userData) => {
    firestore()
      .collection('users')
      .doc(userUID)
      .update(userData)
      .then(() => {
        setIsLoading(false)
        setPopup(true);
      })
      .catch(error => {
        console.log(`EditProfileScreen.Error:`, error)
        setIsLoading(false)
      })
  }

  const onPressSave = () => {

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
      setIsLoading(true)
      let userData = {
        first_name: name.value,
        last_name: lastName.value,
        email: email.value,
        phone_number: phone.value
      }
      if (selectedImage != '') {
        const _pImg = selectedImage?.assets[0];
        storage().ref(_pImg.fileName)
        .putFile(_pImg.uri)
        .then(async (snapshot) => {
          //You can check the image is now uploaded in the storage bucket
          console.log(`${_pImg.fileName} has been successfully uploaded.`);
          const url = await storage().ref(_pImg.fileName).getDownloadURL()
          console.log(`url:`, url)
          userData = {...userData, customer_photo: url}
          updateUserData(userData)
        })
      } else {
        updateUserData(userData)
      }
      // console.log(`driverData:`, driverData)
      // console.log(`profileData:`, profileData)
    }  
  };

  const loadProfileImage = () => {
    // console.log(`loadProfileImage.selectedImage:`, selectedImage)
    let image = '';
    // let tProfileData = {...profileData}
    if (profileData != undefined) {
      // console.log(`profileData.driver_photo.base64:`, profileData.driver_photo.base64)
      if (selectedImage != '') {
        image = `data:${selectedImage?.assets[0]?.type};base64,${selectedImage?.assets[0]?.base64}`
      } else if (profileData.customer_photo) {
        image = typeof(profileData.customer_photo) === 'string' ? profileData.customer_photo : `data:${profileData.customer_photo.type};base64,${profileData.customer_photo.base64}`
      }
    }
    // console.log(`image: ${image}`)
    return image == '' ? (
      <Image
        style={styles.imageLogo}
        source={require('../../../assets/assets/default_user.png')}
      />
    ) : (
      <Image
        style={styles.imageLogo}
        source={{uri: image}}
      />
    )
  }
  const setEditProfileView = () => {
    return (
      <View style={styles.container}>
        <CHeader navigation={props.navigation} isBackBtn={true} headerTitle={'Edit Profile'} />

        <ScrollView style={styles.container}
          keyboardShouldPersistTaps={'handled'}
          automaticallyAdjustContentInsets={false}
          showsVerticalScrollIndicator={false}>
          <View
            style={{marginTop: 32, alignItems: 'center', justifyContent: 'center'}}>
            {/* <Image
              style={styles.imageLogo}
              source={require('../../../assets/assets/default_user.png')}
            /> */}
            {loadProfileImage()}
            <TouchableOpacity style={styles.viewUplaodImage} onPress={()=> { setUploadPopup(true) }}>
              <Image
                style={styles.imageUpload}
                source={require('../../../assets/assets/MyProfile/camera.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={{margin: 16}}>
            <TextInput
              label="First Name"
              returnKeyType="next"
              value={name.value}
              onChangeText={(text) => setName({value: text, error: ''})}
              error={!!name.error}
              errorText={name.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="default"
              ref={(ref) => {
                this._nameinput = ref;
              }}
              onSubmitEditing={() => this._lastinput && this._lastinput.focus()}
            />
            <TextInput
              label="Last Name"
              returnKeyType="next"
              value={lastName.value}
              onChangeText={(text) => setLastName({value: text, error: ''})}
              error={!!lastName.error}
              errorText={lastName.error}
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
              editable={false}
              style={{ opacity: AppConstants.opacityLevel, backgroundColor: 'white' }}
              ref={(ref) => {
                this._phoneinput = ref;
              }}
              onSubmitEditing={() =>
                Keyboard.dismiss()
              }
            />
          </View>
          <TouchableOpacity
            style={styles.buttonBookNow}
            onPress={() => onPressSave()}>
            <Text style={styles.bookNowText}>SAVE</Text>
          </TouchableOpacity>
          
          <CModal visible={popup}>
            <View style={styles.centeredView}>
              <View style={styles.popupMessageView}>
                <Image
                  style={styles.clickImage}
                  source={require('../../../assets/assets/PlaceOrder/checkout_click.png')}
                />
                <Text style={{...styles.totalAmountText, textAlign: 'center'}}>
                  Your Profile updated.
                </Text>
                <TouchableOpacity
                  style={styles.homeButtonView}
                  onPress={() => onPressHomeButton()}>
                  <Text style={styles.placeOrderText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </CModal>

          <CModal visible={uploadPopup}>
            <View style={styles.centeredView}>
              <View style={styles.popupView}>
                <Text
                  style={{
                    ...styles.placeOrderText,
                    color: Colors.titleText,
                    marginTop: 16,
                  }}>
                  Select Image
                </Text>
                <TouchableOpacity
                  style={styles.homeButtonView}
                  onPress={() => {
                    // setPopup(false)
                    launchCamera(
                      {
                        mediaType: 'photo',
                        includeBase64: true,
                        maxHeight: 512,
                        maxWidth: 512,
                      },
                      (response) => {
                        setUploadPopup(false);
                        if (!response.didCancel) {
                          /* setResourcePathImage(response);
                          saveImageData(imageType, response); */
                          setSelectedImage(response);
                        }
                      },
                    );
                  }}>
                  <Text style={styles.placeOrderText}>Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{...styles.homeButtonView, marginTop: 0}}
                  onPress={() => {
                    // setPopup(false)
                    launchImageLibrary(
                      {
                        mediaType: 'photo',
                        includeBase64: true,
                        maxHeight: 512,
                        maxWidth: 512,
                      },
                      (response) => {
                        setUploadPopup(false);
                        if (!response.didCancel) {
                          /* setResourcePathImage(response);
                          saveImageData(imageType, response); */
                          setSelectedImage(response);
                        }
                      },
                    );
                  }}>
                  <Text style={styles.placeOrderText}>Library</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{...styles.homeButtonView, marginTop: 0}}
                  onPress={() => setUploadPopup(false)}>
                  <Text style={styles.placeOrderText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </CModal>
          
          <Loader loading={isLoading} />
        </ScrollView>
      </View>
    );
  }

  return AppConstants.isAndroid ? (
    <View style={{ flex: 1 }}>{setEditProfileView()}</View>
  ) : (
    <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#fff' }}
        behavior="padding"
        keyboardVerticalOffset={64}
        enabled>
        {setEditProfileView()}
    </KeyboardAvoidingView>
  );
};

EditProfileScreen.navigationOptions = (navigationData) => {
  return {
    headerShown: true,
    headerTitle: 'Edit Profile',
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
    backgroundColor: Colors.mainBackgroundColor,
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 40,
    width: 40,
  },
  gradiantImage: {
    width: Math.round(Dimensions.get('window').width),
    height: 150,
    justifyContent: 'flex-end',
    backgroundColor: Colors.buttonBackgroundColor,
  },
  viewImageLogo: {
    alignItems: 'center',
    marginVertical: -50,
  },
  imageLogo: {
    justifyContent: 'center',
    height: 100,
    width: 100,
    borderRadius: 100 / 2,
    // backgroundColor: Colors.inputTextBackgroundColor,
  },
  selectedImageLogo: {
    marginLeft: 40,
    height: 150,
    width: 150,
    borderRadius: 150 / 2,
    // backgroundColor: Colors.inputTextBackgroundColor,
  },
  viewUplaodImage: {
    marginTop: -32,
    marginRight: -72,
    backgroundColor: Colors.backgroundColor,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  imageUpload: {
    height: 20,
    width: 20,
  },
  buttonBookNow: {
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
  popupView: {
    backgroundColor: Colors.backgroundColor,
    // height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth - 64,
    borderRadius: 10,
  },
  bookNowText: {
    fontFamily: 'SofiaPro-Medium',
    color: Colors.backgroundColor,
    fontSize: RFPercentage(2),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clickImage: {
    marginTop: 16,
    height: 50,
    width: 50,
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
  popupMessageView: {
    backgroundColor: Colors.backgroundColor,
    // height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth - 64,
    borderRadius: 10,
  },
  placeOrderText: {
    color: Colors.backgroundColor,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    // color: Colors.backgroundColor,
  },
});

export default EditProfileScreen;
