import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Keyboard,
} from 'react-native';

// Import the Plugins and Thirdparty library.

import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {format} from 'date-fns';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import TextInputParcel from '../../../components/design/TextInput';

// Load the main class.

const PlaceOrderTextInput = (props) => {
  const {isPickupPoint} = props;
  const [firstName, setFirstName] = useState({value: '', error: ''});
  const [lastName, setLastName] = useState({value: '', error: ''});
  const [email, setEmail] = useState({value: '', error: ''});
  const [phone, setPhone] = useState({value: '', error: ''});
  const [street, setStreet] = useState({value: '', error: ''});
  const [apartment, setApartment] = useState({value: '', error: ''});
  const [city, setCity] = useState({value: '', error: ''});
  const [state, setState] = useState({value: '', error: ''});
  const [country, setCountry] = useState({value: '', error: ''});
  const [zipCode, setZipCode] = useState({value: '', error: ''});
  const [sending, setSending] = useState({value: '', error: ''});
  const [weight, setWeight] = useState({value: '', error: ''});
  const [pickupDateTime, setPickupDateTime] = useState({value: '', error: ''});
  const [parcelValue, setParcelValue] = useState({value: '', error: ''});
  const [comment, setComment] = useState({value: '', error: ''});
  const [width, setWidth] = useState({value: '', error: ''});
  const [height, setHeight] = useState({value: '', error: ''});

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState('Pickup Date and Time');

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    var formattedDate = format(date, 'dd-MMM-yyyy HH:MM:SS');
    setIsDateSelected(formattedDate);
    hideDatePicker();
  };

  const onPressNotify = () => {
    if(props.setNotifyRecipient) props.setNotifyRecipient(!props.notifyRecipient);
  };

  const onPressEndTripNotify = () => {
    if(props.setSendEndTripOtpToReceiver) props.setSendEndTripOtpToReceiver(!props.sendEndTripOtpToReceiver);
  }

  return (
    <View>
      {isPickupPoint && (
        <View>
          <TextInputParcel
            //   style={styles.nameInputText}
            label="What are you sending?"
            returnKeyType="next"
            // value={
            //   isPickupPoint ? props.pickupSendingValue : props.dropSendingValue
            // }
            value={sending.value}
            onChangeText={(text) =>
              isPickupPoint
                ? props.pickupOnChangeSending(text)
                : props.dropOnChangeSending(text)
            }
            error={
              isPickupPoint ? props.pickupSendingError : props.dropSendingError
            }
            errorText={
              isPickupPoint
                ? props.pickupSendingErrorText
                : props.dropSendingErrorText
            }
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._sendinginput = ref;
            }}
            onSubmitEditing={() =>
              this._parcelValueinput && this._parcelValueinput.focus()
            }
            multiline
          />
          <TextInputParcel
            // style={styles.weightInputText}
            placeholder="Parcel Value"
            returnKeyType="done"
            value={
              isPickupPoint ? props.pickupParcelValue : props.dropParcelValue
            }
            onChangeText={(text) =>
              isPickupPoint
                ? props.pickupOnChangeParcel(text)
                : props.dropOnChangeParcel(text)
            }
            error={
              isPickupPoint ? props.pickupParcelError : props.dropParcelError
            }
            errorText={
              isPickupPoint
                ? props.pickupParcelErrorText
                : props.dropParcelErrorText
            }
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="number-pad"
            ref={(ref) => {
              this._parcelValueinput = ref;
            }}
            onSubmitEditing={() => this._widthinput && this._widthinput.focus()}
          />
          <TextInputParcel
            // style={styles.weightInputText}
            placeholder="Weight(Tons)"
            returnKeyType="next"
            value={
              isPickupPoint ? props.pickupWeightValue : props.dropWeightValue
            }
            onChangeText={(text) =>
              isPickupPoint
                ? props.pickupOnChangeWeight(text)
                : props.dropOnChangeWeight(text)
            }
            error={
              isPickupPoint ? props.pickupWeightError : props.dropWeightError
            }
            errorText={
              isPickupPoint
                ? props.pickupWeightErrorText
                : props.dropWeightErrorText
            }
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="number-pad"
            ref={(ref) => {
              // this._weightinput = ref;
            }}
            onSubmitEditing={() =>
              this._parcelValueinput && this._parcelValueinput.focus()
            }
          />
          {/* <TextInput
            // style={styles.weightInputText}
            placeholder="width"
            returnKeyType="next"
            value={
              isPickupPoint ? props.pickupWidthValue : props.dropWidthValue
            }
            onChangeText={(text) =>
              isPickupPoint
                ? props.pickupOnChangeWidth(text)
                : props.dropOnChangeWidth(text)
            }
            error={
              isPickupPoint ? props.pickupWidthError : props.dropWidthError
            }
            errorText={
              isPickupPoint
                ? props.pickupWidthErrorText
                : props.dropWidthErrorText
            }
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="number-pad"
            ref={(ref) => {
              this._widthinput = ref;
            }}
            onSubmitEditing={() =>
              this._heightinput && this._heightinput.focus()
            }
          />
          <TextInput
            // style={styles.weightInputText}
            placeholder="Height"
            returnKeyType="done"
            value={
              isPickupPoint ? props.pickupHeightValue : props.dropHeightValue
            }
            onChangeText={(text) =>
              isPickupPoint
                ? props.pickupOnChangeHeight(text)
                : props.dropOnChangeHeight(text)
            }
            error={
              isPickupPoint ? props.pickupHeightError : props.dropHeightError
            }
            errorText={
              isPickupPoint
                ? props.pickupHeightErrorText
                : props.dropHeightErrorText
            }
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="number-pad"
            ref={(ref) => {
              this._heightinput = ref;
            }}
            onSubmitEditing={() =>
              this._commentinput && this._commentinput.focus()
            }
          /> */}
          <View style={styles.dimentionView}>
            <TextInput
              style={styles.widthInputText}
              placeholder="123 cm"
              returnKeyType="next"
              value={
                isPickupPoint
                  ? props.pickupDimensionValue
                  : props.dropDimensionValue
              }
              onChangeText={(text) =>
                isPickupPoint
                  ? props.pickupOnChangeDimension(text)
                  : props.dropOnChangeDimension(text)
              }
              error={
                isPickupPoint
                  ? props.pickupDimensionError
                  : props.dropDimensionError
              }
              errorText={
                isPickupPoint
                  ? props.pickupDimensionErrorText
                  : props.dropDimensionErrorText
              }
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="number-pad"
              ref={(ref) => {
                this._dimensioninput = ref;
              }}
              onSubmitEditing={() =>
                this._widthinput && this._widthinput.focus()
              }
            />
            <Text style={{...styles.textKG, color: Colors.subTitleTextColor}}>
              X
            </Text>
            <TextInput
              style={styles.widthInputText}
              placeholder="Width"
              returnKeyType="next"
              value={
                isPickupPoint ? props.pickupWidthValue : props.dropWidthValue
              }
              onChangeText={(text) =>
                isPickupPoint
                  ? props.pickupOnChangeWidth(text)
                  : props.dropOnChangeWidth(text)
              }
              error={
                isPickupPoint ? props.pickupWidthError : props.dropWidthError
              }
              errorText={
                isPickupPoint
                  ? props.pickupWidthErrorText
                  : props.dropWidthErrorText
              }
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="number-pad"
              ref={(ref) => {
                this._widthinput = ref;
              }}
              onSubmitEditing={() =>
                this._heightinput && this._heightinput.focus()
              }
            />
            <Text style={{...styles.textKG, color: Colors.subTitleTextColor}}>
              X
            </Text>
            <TextInput
              style={styles.widthInputText}
              placeholder="Height"
              returnKeyType="next"
              value={
                isPickupPoint ? props.pickupHeightValue : props.dropHeightValue
              }
              onChangeText={(text) =>
                isPickupPoint
                  ? props.pickupOnChangeHeight(text)
                  : props.dropOnChangeHeight(text)
              }
              error={
                isPickupPoint ? props.pickupHeightError : props.dropHeightError
              }
              errorText={
                isPickupPoint
                  ? props.pickupHeightErrorText
                  : props.dropHeightErrorText
              }
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="number-pad"
              ref={(ref) => {
                this._heightinput = ref;
              }}
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>
          <TouchableOpacity
            onPress={showDatePicker}
            style={styles.buttonPlannedDate}>
           /
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              headerTextIOS="Planned Date of Purchase"
              minimumDate={new Date()}
            />
            <Image
              style={styles.calanderImage}
              source={require('../../../assets/assets/PlaceOrder/calendar.png')}
            />
          </TouchableOpacity>
          <TextInputParcel
            //   style={styles.nameInputText}
            label="Comment"
            returnKeyType="next"
            value={
              isPickupPoint ? props.pickupCommentValue : props.dropCommentValue
            }
            onChangeText={(text) =>
              isPickupPoint
                ? props.pickupOnChangeComment(text)
                : props.dropOnChangeComment(text)
            }
            error={
              isPickupPoint ? props.pickupCommentError : props.dropCommentError
            }
            errorText={
              isPickupPoint
                ? props.pickupCommentErrorText
                : props.dropCommentErrorText
            }
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._commentinput = ref;
            }}
            onSubmitEditing={() => {
              /* this._widtinput && this._weightinput.focus() */
            }}
            multiline
          />
        </View>
      )}
      {/* </View> */}
      {!isPickupPoint && (
        <>
        {/* <TouchableOpacity onPress={onPressNotify} style={styles.buttonNotify}>
          <Image
            style={styles.calanderImage}
            source={
              props.notifyRecipient
                ? require('../../../assets/assets/PlaceOrder/ic_checkbox_check.png')
                : require('../../../assets/assets/PlaceOrder/ic_checkbox_uncheck.png')
            }
          />
          <Text style={styles.textNotify}>
            Notify recipient by email or phone?
          </Text>
        </TouchableOpacity> */}

        <TouchableOpacity onPress={onPressEndTripNotify} style={styles.buttonEndTripOtpNotify}>
          <Image
            style={styles.calanderImage}
            source={
              props.sendEndTripOtpToReceiver
                ? require('../../../assets/assets/PlaceOrder/ic_checkbox_check.png')
                : require('../../../assets/assets/PlaceOrder/ic_checkbox_uncheck.png')
            }
          />
          <Text style={styles.textNotify}>
            Send <Text style={{fontWeight:"bold"}}>END TRIP OTP</Text> to receiver
          </Text>
        </TouchableOpacity>
        </>
      )}
    </View>
  );
};

// Set the components styles.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 30,
    width: 30,
  },
  viewInputText: {
    // marginLeft: 16,
    flexDirection: 'row',
    // width: 100,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weightInputText: {
    // paddingLeft: 12,
    // paddingRight: 16,
    // fontSize: RFPercentage(2),
    // fontFamily: 'SofiaPro-Medium',
    color: Colors.titleTextColor,
    backgroundColor: Colors.backgroundColor,
    height: 50,
    width: Dimensions.get('window').width / 2,
    // borderRadius: 5,
  },
  buttonPlannedDate: {
    marginTop: 8,
    marginBottom: 8,
    // marginLeft: 16,
    // marginRight: 16,
    height: 55,
    borderWidth: 0.8,
    borderRadius: 5,
    borderColor: Colors.borderColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundColor,
  },
  textPlannedDate: {
    marginLeft: 16,
    fontSize: RFPercentage(1.8),
    color: Colors.borderColor,
  },
  calanderImage: {
    marginRight: 16,
    height: 30,
    width: 30,
  },
  buttonNotify: {
    // margin: 16,
    marginTop: 16,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonEndTripOtpNotify: {
    marginTop:8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textNotify: {
    marginLeft: -16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
  },
  dimentionView: {
    marginTop: 16,
    marginBottom: 16,
    // marginLeft: 55,
    flexDirection: 'row',
    width: Dimensions.get('window').width - 32,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  widthInputText: {
    paddingLeft: 12,
    paddingRight: 16,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.titleTextColor,
    height: 50,
    width: Dimensions.get('window').width / 3 - 48,
    backgroundColor: Colors.backgroundColor,
    borderColor: Colors.borderColor,
    borderWidth: 0.8,
    borderRadius: 5,
    textAlign: 'center',
  },
  textKG: {
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: '#9DA4BB',
  },
});

export default PlaceOrderTextInput;
