import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';

// Import the Plugins and Thirdparty library.

import {RFPercentage} from 'react-native-responsive-fontsize';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import PlaceOrderTextInput from '../../../components/Customer/PlaceOrder/PlaceOrderTextInput';

// Load the main class.

const PlaceOrderDetailScreen = (props) => {
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
  const [parcelValue, setParcelValue] = useState({value: '', error: ''});
  const [comment, setComment] = useState({value: '', error: ''});
  const [width, setWidth] = useState({value: '', error: ''});
  const [height, setHeight] = useState({value: '', error: ''});
  const getFirstName = (valueText, inputValueText) => {
    if (inputValueText === 'pickupFirstName') {
      setFirstName(valueText);
    } else if (inputValueText === 'pickupLastName') {
      setLastName(valueText);
    } else if (inputValueText === 'pickupEmail') {
      setEmail(valueText);
    } else if (inputValueText === 'pickupPhone') {
      setPhone(valueText);
    } else if (inputValueText === 'pickupStreet') {
      setStreet(valueText);
    } else if (inputValueText === 'pickupApartment') {
      setApartment(valueText);
    } else if (inputValueText === 'pickupCity') {
      setCity(valueText);
    } else if (inputValueText === 'pickupState') {
      setState(valueText);
    } else if (inputValueText === 'pickupCountry') {
      setCountry(valueText);
    } else if (inputValueText === 'pickupZipcode') {
      setZipCode(valueText);
    } else if (inputValueText === 'pickupSending') {
      setSending(valueText);
    } else if (inputValueText === 'pickupWeight') {
      setWeight(valueText);
    } else if (inputValueText === 'pickupParcelValue') {
      setParcelValue(valueText);
    } else if (inputValueText === 'pickupWidth') {
      setWidth(valueText);
    } else if (inputValueText === 'pickupHeight') {
      setHeight(valueText);
    } else if (inputValueText === 'pickupComment') {
      setComment(valueText);
    }
    console.log('First name : ', valueText);
  };
  const onPressSubmit = () => {
    props.navigation.navigate('Checkout',{
      //   firebaseUID: response.user.uid,
      },
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={30}> */}
        <Text style={styles.titleText}>Pickup Point</Text>
        <View style={{padding: 16}}>
          <PlaceOrderTextInput
            isPickupPoint={true}
            pickupOnChangeFirstName={(text) => getFirstName(text)}
            pickupFirstNameValue={firstName.value}
            pickupFirstNameError={!!firstName.error}
            pickupFirstNameErrorText={firstName.error}
            pickupOnChangeLastName={(text) => getFirstName(text)}
            pickupLastNameValue={lastName.value}
            pickupLastNameError={!!lastName.error}
            pickupLastNameErrorText={lastName.error}
            pickupOnChangeEmail={(text) => getFirstName(text)}
            pickupEmailValue={email.value}
            pickupEmailError={!!email.error}
            pickupEmailErrorText={email.error}
            pickupOnChangePhone={(text) => getFirstName(text)}
            pickupPhoneValue={phone.value}
            pickupPhoneError={!!phone.error}
            pickupPhoneErrorText={phone.error}
            pickupOnChangeStreet={(text) => getFirstName(text)}
            pickupStreetValue={street.value}
            pickupStreetError={!!street.error}
            pickupStreetErrorText={street.error}
            pickupOnChangeApartment={(text) => getFirstName(text)}
            pickupApartmentValue={apartment.value}
            pickupApartmentError={!!apartment.error}
            pickupApartmentErrorText={apartment.error}
            pickupOnChangeCity={(text) => getFirstName(text)}
            pickupCityValue={city.value}
            pickupCityError={!!city.error}
            pickupCityErrorText={city.error}
            pickupOnChangeState={(text) => getFirstName(text)}
            pickupStateValue={state.value}
            pickupStateError={!!state.error}
            pickupStateErrorText={state.error}
            pickupOnChangeCountry={(text) => getFirstName(text)}
            pickupCountryValue={country.value}
            pickupCountryError={!!country.error}
            pickupCountryErrorText={country.error}
            pickupOnChangeZipCode={(text) => getFirstName(text)}
            pickupZipCodeValue={zipCode.value}
            pickupZipCodeError={!!zipCode.error}
            pickupZipCodeErrorText={zipCode.error}
            pickupOnChangeSending={(text) => getFirstName(text)}
            pickupSendingValue={sending.value}
            pickupSendingError={!!sending.error}
            pickupSendingErrorText={sending.error}
            pickupOnChangeWeight={(text) => getFirstName(text)}
            pickupWeightValue={weight.value}
            pickupWeightError={!!weight.error}
            pickupWeightErrorText={weight.error}
            pickupOnChangeParcel={(text) => getFirstName(text)}
            pickupParcelValue={parcelValue.value}
            pickupParcelError={!!parcelValue.error}
            pickupParcelErrorText={parcelValue.error}
            pickupOnChangeWidth={(text) => getFirstName(text)}
            pickupWidthValue={width.value}
            pickupWidthError={!!width.error}
            pickupWidthErrorText={width.error}
            pickupOnChangeHeight={(text) => getFirstName(text)}
            pickupHeightValue={height.value}
            pickupHeightError={!!height.error}
            pickupHeightErrorText={height.error}
            pickupOnChangeComment={(text) => getFirstName(text)}
            pickupCommentValue={comment.value}
            pickupCommentError={!!comment.error}
            pickupCommentErrorText={comment.error}
          />
        </View>
        <Text style={styles.titleText}>Drop Point</Text>
        <View style={{padding: 16}}>
          <PlaceOrderTextInput
            isPickupPoint={false}
            dropOnChangeFirstName={(text) => getFirstName(text)}
            dropFirstNameValue={firstName.value}
            dropFirstNameError={!!firstName.error}
            dropFirstNameErrorText={firstName.error}
            dropOnChangeLastName={(text) => getFirstName(text)}
            dropLastNameValue={lastName.value}
            dropLastNameError={!!lastName.error}
            dropLastNameErrorText={lastName.error}
            dropOnChangeEmail={(text) => getFirstName(text)}
            dropEmailValue={email.value}
            dropEmailError={!!email.error}
            dropEmailErrorText={email.error}
            dropOnChangePhone={(text) => getFirstName(text)}
            dropPhoneValue={phone.value}
            dropPhoneError={!!phone.error}
            dropPhoneErrorText={phone.error}
            dropOnChangeStreet={(text) => getFirstName(text)}
            dropStreetValue={street.value}
            dropStreetError={!!street.error}
            dropStreetErrorText={street.error}
            dropOnChangeApartment={(text) => getFirstName(text)}
            dropApartmentValue={apartment.value}
            dropApartmentError={!!apartment.error}
            dropApartmentErrorText={apartment.error}
            dropOnChangeCity={(text) => getFirstName(text)}
            dropCityValue={city.value}
            dropCityError={!!city.error}
            dropCityErrorText={city.error}
            dropOnChangeState={(text) => getFirstName(text)}
            dropStateValue={state.value}
            dropStateError={!!state.error}
            dropStateErrorText={state.error}
            dropOnChangeCountry={(text) => getFirstName(text)}
            dropCountryValue={country.value}
            dropCountryError={!!country.error}
            dropCountryErrorText={country.error}
            dropOnChangeZipCode={(text) => getFirstName(text)}
            dropZipCodeValue={zipCode.value}
            dropZipCodeError={!!zipCode.error}
            dropZipCodeErrorText={zipCode.error}
          />
        </View>
        <TouchableOpacity style={styles.buttonSubmit} onPress={onPressSubmit}>
          <Text style={styles.loginSubmit}>SUBMIT</Text>
        </TouchableOpacity>
        {/* </KeyboardAvoidingView> */}
      </ScrollView>
    </View>
  );
};

PlaceOrderDetailScreen.navigationOptions = (navigationData) => {
  return {
    headerShown: true,
    headerTitle: 'Place Order Details',
    headerLeft: (
      <View style={styles.viewHeaderLeft}>
        <TouchableOpacity
          onPress={() => {
            navigationData.navigation.pop();
          }}>
          <Image
            style={styles.menuImage}
            source={require('../../../assets/assets/dashboard/ic_back.png')}
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
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 30,
    width: 30,
  },
  titleText: {
    margin: 16,
    marginBottom: -16,
    fontSize: RFPercentage(2.5),
    color: Colors.titleTextColor,
    fontWeight: 'bold',
  },
  buttonSubmit: {
    margin: 32,
    marginTop: 0,
    fontSize: RFPercentage(2),
    // fontFamily: 'Roboto-Regular',
    backgroundColor: Colors.buttonColor,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  loginSubmit: {
    color: Colors.backgroundColor,
    fontSize: RFPercentage(2.5),
    // color: Colors.backgroundColor,
  },
});

export default PlaceOrderDetailScreen;
