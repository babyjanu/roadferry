import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

// Import the JS file.
import Colors from '../../../helper/extensions/Colors';
import CModal from '../../design/CModal';
const windowWidth = Dimensions.get('window').width;

const UploadImage = (props) => {
  const [popup, setPopup] = useState(false);
  const [resourcePathImage, setResourcePathImage] = useState('');
  const {titleName, titleShow, errorMessage, imageType, saveImageData, data, isEdit, isVerified, isVehicle} = props;  //imageType => 1 for Address Proof, 2 for Identity Proof, 3 for Driver Photo
  // console.log(`imageType:`, imageType)
  // console.log(`isEdit:`, isEdit)
  // console.log(`data:`, data)
  // console.log(`resourcePathImage:`, resourcePathImage)
  // console.log(`isVehicle:`, isVehicle)
  /* if (isVehicle == undefined) {
    isVehicle = false
  } */
  let isPlaceholderImage = true
  if (isVehicle) {
    // console.log(`object.if`)
    if (data != undefined) {
      isPlaceholderImage = false
    }
  } else {
    // console.log(`object.else`)
    if (resourcePathImage != '' || (isEdit && data != undefined)) {
      isPlaceholderImage = false
    }
  }
  // console.log(`isPlaceholderImage: ${isPlaceholderImage}`)

  return (
    <View>
      <Text
        style={
          titleShow
            ? {...styles.tilteText, color: Colors.mainBackgroundColor}
            : styles.tilteText
        }>
        {titleName}
      </Text>
      <TouchableOpacity
        onPress={() => {
          if ((!isVerified || imageType == 3) && !isVehicle) {
            setPopup(true)
          }
        }}
        style={styles.uploadView}>
          {isPlaceholderImage ? 
          <Image
            style={styles.placeholderImage}
            source={require('../../../assets/assets/PlaceOrder/upload.png')}
          />
         : 
          <Image
            style={styles.addPhotosImage}
            // source={{uri: 'data:image/jpeg;base64,' + resourcePath.data}}
            source={{uri: data != undefined && resourcePathImage == '' ? (typeof(data) === 'string' ? data : `data:${data.type};base64,${data.base64}`) : resourcePathImage.uri}}
          />
        }
        {/* <ImageBackground
          style={styles.placeholderImage}
          source={require('../../../assets/assets/PlaceOrder/upload.png')}>
          <Image
            style={styles.addPhotosImage}
            // source={{uri: 'data:image/jpeg;base64,' + resourcePath.data}}
            source={{uri: isEdit && resourcePathImage == '' ? `data:${data.type};base64,${data.base64}` : resourcePathImage.uri}}
          />
        </ImageBackground> */}
      </TouchableOpacity>
      {errorMessage == '' ? null : (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      <CModal visible={popup}>
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
                    maxWidth: 200,
                  },
                  (response) => {
                    setPopup(false);
                    if (!response.didCancel) {
                      setResourcePathImage(response);
                      saveImageData(imageType, response);
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
                    setPopup(false);
                    if (!response.didCancel) {
                      setResourcePathImage(response);
                      saveImageData(imageType, response);
                    }
                  },
                );
              }}>
              <Text style={styles.placeOrderText}>Library</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{...styles.homeButtonView, marginTop: 0}}
              onPress={() => setPopup(false)}>
              <Text style={styles.placeOrderText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CModal>
    </View>
  );
};

const styles = StyleSheet.create({
  tilteText: {
    margin: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    // fontWeight: '500',
    color: Colors.textColor,
  },
  errorText: {
    marginLeft: 16,
    marginTop: -14,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    // fontWeight: '500',
    color: Colors.errorColor,
    marginRight: 16,
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
  addPhotosImage: {
    height: 98,
    width: 98,
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
});

export default UploadImage;