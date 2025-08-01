import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import {Modal} from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Colors from '../helper/extensions/Colors';
import {RFPercentage} from '../helper/extensions/Util';
import {Dimens, images} from '../helper/Utils';
import FastImage from 'react-native-fast-image';
import TextInput from './design/TextInput';

const CCompleteAddressModal = props => {
  const {
    // show,
    onClose,
    modalTitle,
    btnTitle,
    // modalStyle,
    pin_address,
    pickup_address,
    landmark,
    onChangePickup_addressTxt,
    onChangeLandmarkTxt,
    handleConfirmLocationBtnClick,
  } = props;

  return (
    <View style={styles.modalSubContainer}>
      <KeyboardAwareScrollView /* style={{ flex: 1, }} contentContainerStyle={{ justifyContent: 'flex-end' }} */>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={{
              fontFamily: 'SofiaPro-Bold',
              fontSize: RFPercentage(2),
              color: Colors.textColor,
            }}
          >
            {modalTitle}
          </Text>
          <TouchableOpacity onPress={() => onClose()}>
            <FastImage style={styles.iconImg} source={images.closeIconImg} />
          </TouchableOpacity>
        </View>

        <View style={styles.pinAddressContainer}>
          <Text
            style={{
              flex: 1,
              margin: 6,
              fontFamily: 'SofiaPro-Regular',
              fontSize: RFPercentage(1.8),
              color: Colors.textColor,
              opacity: 0.5,
            }}
          >
            {pin_address}
          </Text>
          <TouchableOpacity
            style={styles.changeBtnView}
            onPress={() => onClose()}
          >
            <Text
              style={{
                fontFamily: 'SofiaPro-Regular',
                fontSize: RFPercentage(2),
                color: Colors.backgroundColor,
              }}
            >
              Change
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            marginStart: 6,
            fontFamily: 'SofiaPro-Regular',
            fontSize: RFPercentage(1.5),
            color: Colors.textColor,
          }}
        >
          {`Updated based on your exact map pin`}
        </Text>

        <TextInput
          label="Flat / House no / Floor / Building *"
          returnKeyType="next"
          value={pickup_address.value}
          onChangeText={
            text =>
              onChangePickup_addressTxt(
                text,
              ) /* setPickup_address({value: text, error: ''}) */
          }
          error={!!pickup_address.error}
          errorText={pickup_address.error}
          autoCapitalize="none"
          autoCompleteType="name"
          textContentType="name"
          keyboardType="default"
        />

        <TextInput
          label="Nearby landmark (optional)"
          returnKeyType="next"
          value={landmark.value}
          onChangeText={text => onChangeLandmarkTxt(text)}
          error={!!landmark.error}
          errorText={landmark.error}
          autoCapitalize="none"
          autoCompleteType="name"
          textContentType="name"
          keyboardType="default"
        />

        <TouchableOpacity
          disabled={!pickup_address.value}
          style={{
            ...styles.buttonView,
            backgroundColor: !pickup_address.value ? Colors.grey : Colors.buttonColor,
          }}
          onPress={() => handleConfirmLocationBtnClick()}
        >
          <Text style={styles.buttonText}>
            {btnTitle}
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  modalSubContainer: {
    // flex: 0.5,
    justifyContent: 'flex-end',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 24,
    backgroundColor: Colors.backgroundColor,
  },
  iconImg: {
    width: 22,
    height: 22,
  },
  buttonView: {
    marginVertical: 12,
    paddingHorizontal: 30,
    paddingVertical: 12,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Medium',
    backgroundColor: Colors.buttonColor,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 6,
  },
  buttonText: {
    fontFamily: 'SofiaPro-Medium',
    color: Colors.backgroundColor,
    fontSize: RFPercentage(2),
  },
  pinAddressContainer: {
    flexDirection: 'row',
    // marginVertical: 12,
    alignItems: 'center',
    marginTop: 18,
    padding: 2,
    justifyContent: 'space-between',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.grey,
  },
  changeBtnView: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
});

export default CCompleteAddressModal;
