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
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

// Import the Plugins and Thirdparty library.
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
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
import localAddressData from '../../../helper/models/addAddress/addressData';
import Geocoder from 'react-native-geocoder-reborn';
import GooglePlacesTextInput from '../../../components/design/GooglePlacesTextInput';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import CHeader from '../../../components/CHeader';

// Load the main class.
const GOOGLE_API_KEY = 'AIzaSyDWcZSbyp_kYJSNxLRVVemkx_5V9JlQDHA';

const AddSetAddressScreen = props => {
  const ref = useRef();

  const params = props?.route?.params;
  const statusAddAddress = params?.statusAddAddress;
  const refreshAddressData = params?.refreshAddressData;
  console.log('statusAddAddress', statusAddAddress);

  useEffect(() => {
    Geocoder.fallbackToGoogle(GOOGLE_API_KEY);
  });

  let isEdit = params?.isEdit;
  if (isEdit == undefined) {
    isEdit = false;
  }
  // console.log('isEdit:', isEdit);

  let isEditFromParcelScreen = params?.isEditFromParcelScreen;
  console.log("isEditFromParcelScreen: ", isEditFromParcelScreen);
  if (isEditFromParcelScreen == undefined) {
    isEditFromParcelScreen = false;
  }

  let id = '';
  let flatnameValue = {value: '', error: ''};
  let areaValue = {value: '', error: ''};
  let cityValue = {value: '', error: ''};
  let stateValue = {value: '', error: ''};
  let countryValue = {value: '', error: ''};
  let pincodeValue = {value: '', error: ''};
  let coordinatesValue = {latitude: 0.0, longitude: 0.0};

  if (isEdit) {
    id = params?.id;
    if (id == '') {
      id = Math.random().toPrecision(21).slice(-6);
    }
    // flatnameValue.value = params?.flat_name;
    if (ref) {
      ref.current?.setAddressText(params?.flat_name);
    }
    areaValue.value = params?.area;
    cityValue.value = params?.city;
    stateValue.value = params?.state;
    countryValue.value = params?.country;
    pincodeValue.value = params?.pincode;
    coordinatesValue = params?.coordinate;
    console.log('coordinatesValue:', coordinatesValue);
  } else {
    id = Math.random().toPrecision(21).slice(-6);
  }
  const [flatname, setFlatName] = useState(flatnameValue);
  const [area, setArea] = useState(areaValue);
  const [city, setCity] = useState(cityValue);
  const [state, setState] = useState(stateValue);
  const [country, setCountry] = useState(countryValue);
  const [pincode, setPincode] = useState(pincodeValue);
  const [coordinates, setCoordinates] = useState(coordinatesValue);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEdit && ref) {
      ref.current?.setAddressText(params?.flat_name);
    }
  }, [props.navigation]);
  //   const pickupAddressData = useSelector(
  //     (state) => state.pickupAddressData.pickupAddressData,
  //   );

  const dispatch = useDispatch();

  /* const getFormattedAddress = (location) => {
    return `${location.flat_name +
      ', ' +
      location.area +
      ', ' +
      location.city +
      ', ' +
      location.state +
      ' - ' +
      location.pincode +
      '. ' +
      location.country}`
  } */
  const goBack = () => {
    
    if (isEdit && isEditFromParcelScreen) {
      props.navigation.navigate('AddParcelDetails');
    } else {
      props.navigation.navigate('AddressScreen');
    }

    //props.navigation.pop()
  };

  const onPressRegister = () => {
    const firstName = params?.firstName;
    const lastName = params?.lastName;
    const email = params?.email;
    const phone = params?.phone;

    const flatNameError = flatNameValidator(
      ref && flatname.value == ''
        ? ref.current?.getAddressText()
        : flatname.value,
    );
    const areaError = areaValidator(area.value);
    const cityError = cityValidator(city.value);
    const stateError = stateValidator(state.value);
    const countryError = countryValidator(country.value);
    const pincodeError = pinCodeValidator(pincode.value);

    if (flatNameError) {
      setFlatName({...flatname, error: flatNameError});
      return;
    } else if (areaError) {
      setArea({...area, error: areaError});
      return;
    } else if (cityError) {
      setCity({...city, error: cityError});
      return;
    } else if (stateError) {
      setState({...state, error: stateError});
      return;
    } else if (countryError) {
      setCountry({...country, error: countryError});
      return;
    } else if (pincodeError) {
      setPincode({...pincode, error: pincodeError});
      return;
    } else {
      let formattedAddress = `${
        (ref && flatname.value == ''
          ? ref.current?.getAddressText()
          : flatname.value) +
        ', ' +
        area.value +
        ', ' +
        city.value +
        ', ' +
        state.value +
        ' - ' +
        pincode.value +
        '. ' +
        country.value
      }`;

      /* console.log(`formattedAddress123:`, formattedAddress)
      console.log(`flatname.value:`, flatname.value) */

      /* Geocoder.geocodeAddress(formattedAddress).then(res => {
        // res is an Array of geocoding object (see below)
        console.log(res[0])
      }) */
      /* let coordinates = {
        latitude: 0,
        longitude: 0
      } */

      // return
      setIsLoading(true);
      if (statusAddAddress == 'pickup') {
        console.log('Check Pickup');

        AsyncStorage.getItem(AppPreference.IS_LOGIN).then(valueLogin => {
          const isLogin = JSON.parse(valueLogin);
          // console.log('Login Value is : ', isLogin);

          if (isLogin === 1) {
            AsyncStorage.getItem(AppPreference.LOGIN_UID).then(valueUID => {
              dispatch(
                addAddressActions.setPickupAddressData(
                  coordinates,
                  id,
                  firstName,
                  lastName,
                  email,
                  phone,
                  ref && flatname.value == ''
                    ? ref.current?.getAddressText()
                    : flatname.value,
                  area.value,
                  city.value,
                  state.value,
                  country.value,
                  pincode.value,
                  statusAddAddress,
                  'yes',
                  valueUID,
                  isEdit,
                ),
              );
              goBack();
            });
          } else {
            dispatch(
              addAddressActions.setPickupAddressData(
                coordinates,
                id,
                firstName,
                lastName,
                email,
                phone,
                ref && flatname.value == ''
                  ? ref.current?.getAddressText()
                  : flatname.value,
                area.value,
                city.value,
                state.value,
                country.value,
                pincode.value,
                statusAddAddress,
                'no',
                '',
                isEdit,
              ),
            );
            goBack();
          }
        });
      } else {
        console.log('Check Drop');
        AsyncStorage.getItem(AppPreference.IS_LOGIN).then(valueLogin => {
          const isLogin = JSON.parse(valueLogin);
          // console.log('Login Value is : ', isLogin);

          if (isLogin === 1) {
            // console.log(`ref.current?.getAddressText():`, ref.current?.getAddressText())
            // console.log('AddSetADdressScrenn.if:', ref && flatname.value == '' ? ref.current?.getAddressText() : flatname.value);
            AsyncStorage.getItem(AppPreference.LOGIN_UID).then(valueUID => {
              dispatch(
                dropAddAddressActions.setDropAddressData(
                  coordinates,
                  id,
                  firstName,
                  lastName,
                  email,
                  phone,
                  ref && flatname.value == ''
                    ? ref.current?.getAddressText()
                    : flatname.value,
                  area.value,
                  city.value,
                  state.value,
                  country.value,
                  pincode.value,
                  statusAddAddress,
                  'yes',
                  valueUID,
                  isEdit,
                ),
              );
              goBack();
            });
          } else {
            // console.log('AddSetADdressScrenn.else');
            // console.log('Login not found');
            dispatch(
              dropAddAddressActions.setDropAddressData(
                coordinates,
                id,
                firstName,
                lastName,
                email,
                phone,
                ref && flatname.value == ''
                  ? ref.current?.getAddressText()
                  : flatname.value,
                area.value,
                city.value,
                state.value,
                country.value,
                pincode.value,
                statusAddAddress,
                'no',
                '',
                isEdit,
              ),
            );
            goBack();
          }
        });
      }
    }
  };

  const replaceSpanTag = (element, startRegex) => {
    const result = element.replace(startRegex, '');
    console.log(`result:`, result);
    // const endRegex = /<\/span>/;
    // const finalResult = result.replace(endRegex, '');
    // console.log(`finalResult:`, finalResult);
    // return finalResult;
    return result;
  };

  const onPressAddressItem = (data, details) => {
    console.log(`data: ${JSON.stringify(data)}`);
    console.log(`details for set address: ${JSON.stringify(details)}`);
    var componentList = details.adr_address.split(', ');

    let flatDetails = ''; // ? extended-address
    let area = ''; // ? street-address
    let city = ''; // ? locality
    let state = ''; // ? region
    let country = ''; // ? country-name
    let pincode = ''; // ? postal-code

    for (const component of details.address_components) {
      const componentType = component.types[0];

      switch (componentType) {
        case 'street_number': {
          flatDetails = `${component.long_name}`;
          break;
        }

        /* case "route": {
          flatDetails += component.short_name;
          break;
        } */

        case 'sublocality_level_2': {
          flatDetails =
            flatDetails === ''
              ? ''
              : `${flatDetails}, ` + `${component.long_name}`;
          break;
        }

        case 'route': {
          area += component.long_name;
          break;
        }

        case 'postal_code_suffix': {
          pincode = `${pincode}-${component.long_name}`;
          break;
        }

        case 'locality': {
          city = component.long_name;
          break;
        }

        case 'administrative_area_level_1': {
          state = component.short_name;
          break;
        }

        case 'country': {
          country = component.long_name;
          break;
        }

        case 'postal_code': {
          pincode = `${component.long_name}${pincode}`;
          break;
        }
      }
    }

    setFlatName({value: flatDetails, error: ''});
    setArea({value: area, error: ''});
    setCity({value: city, error: ''});
    setState({value: state, error: ''});
    setCountry({value: country, error: ''});
    setPincode({value: pincode, error: ''});
    setCoordinates({
      latitude: details.geometry.location.lat.toFixed(6),
      longitude: details.geometry.location.lng.toFixed(6),
    });

    // console.log(`coordinates: ${JSON.stringify(coordinates)}`)
    if (ref) {
      ref.current?.setAddressText(flatDetails);
    }
    /* for (let i = 0; i < componentList.length; i++) {
      const element = componentList[i];

      console.log(`element IS: ${JSON.stringify(element)}`);

      const regex = /(<([^>]+)>)/ig;
      if (element.includes('street-address')) {
        flatDetails = replaceSpanTag(
          element,
          regex,
        );
      } else if (
        element.includes('extended-address') ||
        (element.includes('postal-code') && !element.includes('locality'))
      ) {
        var subComponentList = element.split('</span> ');
        if (subComponentList.length >= 0) {
          for (let j = 0; j < subComponentList.length; j++) {
            const subElement = subComponentList[j];
            if (subElement.includes('extended-address')) {
              area = replaceSpanTag(
                subElement,
                /<span[^>]*class="extended-address"[^>]*>/,
              );
            } else if (subElement.includes('postal-code')) {
              pincode = replaceSpanTag(
                subElement,
                /<span[^>]*class="postal-code"[^>]*>/,
              );
            }
          }
        }
      } else if (
        element.includes('locality') ||
        element.includes('postal-code')
      ) {
        var subComponentList = element.split('</span> ');
        if (subComponentList.length >= 0) {
          for (let j = 0; j < subComponentList.length; j++) {
            const subElement = subComponentList[j];
            if (subElement.includes('locality')) {
              city = replaceSpanTag(
                subElement,
                /<span[^>]*class="locality"[^>]*>/,
              );
            } else if (subElement.includes('postal-code')) {
              pincode = replaceSpanTag(
                subElement,
                /<span[^>]*class="postal-code"[^>]*>/,
              );
            }
          }
        }
      } else if (element.includes('region')) {
        state = replaceSpanTag(
          element,
          /<span[^>]*class="region"[^>]*>/,
        );
      } else if (element.includes('country-name')) {
        country = replaceSpanTag(
          element,
          /<span[^>]*class="country-name"[^>]*>/,
        );
      }
    } */
  };

  const addSetAddressView = () => {
    return (
      <View style={{flex: 1, backgroundColor: Colors.mainBackgroundColor }}>
        <CHeader navigation={props.navigation} isBackBtn={true} headerTitle={!isEdit ? 'Add Address' : 'Edit Address'} />
        <ScrollView style={styles.container} keyboardShouldPersistTaps="always">
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
            <Text style={styles.haveAnAccountText}>General details</Text>
            <Text style={styles.registerText}>Address</Text>
          </View>
          <View style={{padding: 16}}>
            {/* <GooglePlacesTextInput
              placeholder="Flat name or Number"
              setAddressText={flatname.value}
              keyboardShouldPersistTaps='always'
              addressValue={onPressAddressItem}
            /> */}

            <ScrollView
              horizontal={true}
              style={{flex: 1}}
              contentContainerStyle={{flex: 1}}
              keyboardShouldPersistTaps="always">
              <GooglePlacesAutocomplete
                ref={ref}
                placeholder={'Flat name or Number'}
                minLength={3}
                returnKeyType={'next'}
                listViewDisplayed="auto"
                fetchDetails={true}
                keyboardShouldPersistTaps="always"
                // renderDescription={(row) => row.description}
                onPress={onPressAddressItem}
                /* textInputProps={{
                  value: flatname.value,
                  onChangeText: text => {
                    setFlatName({value: text, error: ''})
                  }
                }} */
                onNotFound={() => {
                  console.log(`onNotFound`);
                }}
                query={{
                  key: AppConstants.google_place_api_key,
                  language: 'en',
                  components: 'country:in',
                  // types: '(cities)',
                }}
                enablePoweredByContainer={false}
                /* GooglePlacesDetailsQuery={{
                  // fields: ['formatted_address', 'geometry'],
                  fields: 'geometry',
                }} */
                styles={{
                  textInputContainer: {
                    height: 60,
                    borderRadius: 4,
                  },
                  textInput: {
                    height: 60,
                    color: Colors.textColor,
                    fontSize: RFPercentage(2.4),
                    // fontFamily: 'SofiaPro-Regular',
                    backgroundColor: Colors.surfaceColor,
                    borderRadius: 4,
                    borderWidth: 1,
                  },
                  /* predefinedPlacesDescription: {
                    color: '#1faadb',
                  } */
                }}
              />
            </ScrollView>
            {flatname.error == '' ? null : (
              <Text style={styles.error}>{flatname.error}</Text>
            )}
            {/* <TextInput
              //   style={styles.nameInputText}
              label="Flat name or Number"
              returnKeyType="next"
              value={flatname.value}
              onChangeText={(text) => setFlatName({value: text, error: ''})}
              error={!!flatname.error}
              errorText={flatname.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="default"
              ref={(ref) => {
                this._flatinput = ref;
              }}
              onSubmitEditing={() => this._areainput && this._areainput.focus()}
            /> */}
            <TextInput
              //   style={styles.nameInputText}
              label="Area"
              returnKeyType="next"
              value={area.value}
              onChangeText={text => setArea({value: text, error: ''})}
              error={!!area.error}
              errorText={area.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="default"
              ref={ref => {
                this._areainput = ref;
              }}
              onSubmitEditing={() => this._cityinput && this._cityinput.focus()}
            />
            <TextInput
              //   style={styles.nameInputText}
              label="City or Town"
              returnKeyType="next"
              value={city.value}
              onChangeText={text => setCity({value: text, error: ''})}
              error={!!city.error}
              errorText={city.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="default"
              ref={ref => {
                this._cityinput = ref;
              }}
              onSubmitEditing={() => this._stateinput && this._stateinput.focus()}
            />
            <TextInput
              //   style={styles.nameInputText}
              label="State"
              returnKeyType="next"
              value={state.value}
              onChangeText={text => setState({value: text, error: ''})}
              error={!!state.error}
              errorText={state.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="default"
              ref={ref => {
                this._stateinput = ref;
              }}
              onSubmitEditing={() =>
                this._countryinput && this._countryinput.focus()
              }
            />
            <TextInput
              //   style={styles.nameInputText}
              label="Country"
              returnKeyType="next"
              value={country.value}
              onChangeText={text => setCountry({value: text, error: ''})}
              error={!!country.error}
              errorText={country.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="default"
              ref={ref => {
                this._countryinput = ref;
              }}
              onSubmitEditing={() =>
                this._pincodeinput && this._pincodeinput.focus()
              }
            />
            <TextInput
              //   style={styles.nameInputText}
              label="Pincode"
              returnKeyType="next"
              value={pincode.value}
              onChangeText={text => setPincode({value: text, error: ''})}
              error={!!pincode.error}
              errorText={pincode.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="default"
              ref={ref => {
                this._pincodeinput = ref;
              }}
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>
          <TouchableOpacity style={styles.buttonLogin} onPress={onPressRegister}>
            <Text style={styles.loginText}>{isEdit ? 'EDIT' : 'ADD'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };

  return Platform.OS == 'android' ? (
    <View style={{flex: 1}}>{addSetAddressView()}</View>
  ) : (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      keyboardVerticalOffset={64}>
      {addSetAddressView()}
    </KeyboardAvoidingView>
  );
};

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
    marginBottom: 16,
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
    marginRight: 85,
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
  error: {
    fontSize: RFPercentage(2),
    // fontFamily: 'Roboto-Regular',
    color: Colors.errorColor,
    paddingHorizontal: 8,
    paddingTop: 0,
  },
});

export default AddSetAddressScreen;