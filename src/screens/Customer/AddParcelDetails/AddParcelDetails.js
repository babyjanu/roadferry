import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ImageBackground,
  Alert,
  Dimensions,
  TextInput,
  Keyboard,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {calculatePrice} from '../../../helper/Price';

// Import the Plugins and Thirdparty library.
import {RFPercentage} from 'react-native-responsive-fontsize';
import ImagePicker from 'react-native-image-picker';
// import ActionSheet from 'react-native-actionsheet';
import Modal from 'react-native-modal';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {addMinutes, format} from 'date-fns';
import Geocoder from 'react-native-geocoding';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as addAddressActions from '../../../store/actions/addAddress/addAddress';
import * as dropAddAddressActions from '../../../store/actions/addAddress/dropAddAddress';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import PlaceOrderTextInput from '../../../components/Customer/PlaceOrder/PlaceOrderTextInput';
import SelectParcel from '../../../components/Customer/AddParcelDetails/SelectParcel';
import * as setPickupLocationDataActions from '../../../store/actions/customer/addParcelDetails/setPickupLocationData';
import * as setDropLocationDataActions from '../../../store/actions/customer/addParcelDetails/setDropLocationData';
import TextInputParcel from '../../../components/design/TextInput';
import {
  sendigValidator,
  parcelValueValidator,
  dimensionValidator,
  heightValidator,
  widthValidator,
  weightValidator,
  isDateSelectorValidator,
  commentValidator,
} from '../../../helper/extensions/Validator';
import DropLocationData from '../../../helper/models/addParcelDetails/DropLocationData';
import AppConstants from '../../../helper/constants/AppConstants';
import Loader from '../../../components/design/Loader';
import AppPreference from '../../../helper/preference/AppPreference';
import moment from 'moment';
import PriceView from '../../../components/Customer/PriceView';
import { addOrderDetails_fs } from '../../../helper/Utils/fireStoreUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IS_TRANSPORTER_LOADING} from '../../../store/actions/dashboard/filterTranspoterList';
import {setActiveOrderAction} from '../../../store/actions/placeOrder/placeOrder';
import CheckboxInput from '../../../components/design/CheckboxInput';
import UploadImage from '../../../components/transpoter/Drivers/UploadImage';

import firestore from '@react-native-firebase/firestore';
import CHeader from '../../../components/CHeader';
import webSocketServices from '../../../websocket/webSocketServices';
import CPrimaryButton from '../../../components/design/CPrimaryButton';
import CModal from '../../../components/design/CModal';
import socketIo from '../../../websocket/socketIOServices';

// Load the main class.
const windowWidth = Dimensions.get('window').width;

const AddParcelDetails = props => {
  const params = props?.route?.params;
  const userUID = useSelector(state => state.fetchProfileData.userUID);
  const profileData = useSelector(
    state => state.fetchProfileData.fetchProfileData,
  );
  const selectedData = useSelector(
    state => state?.allFilterData?.allFilterData || {},
  );

  const sourceData = params?.source;
  const destinationData = params?.destination;
  const selectedVehicleData = params?.selectedVehicleData;
  const distanceValue = params?.distance;
  const vehicle_type = params?.vehicle_type;
  let priceValue = params?.price;
  const weightValue = params?.weight;
  const dimensionsValue = params?.dimensions;
  const widthValue = params?.width;
  const heightValue = params?.height;

  const [popup, setPopup] = useState(false);

  const [flagPickupPoint, setFlagPickupPoint] = useState(true);
  const [flagDropPoint, setFlagDropPoint] = useState(false);
  const [sending, setSending] = useState({value: '', error: ''});
  const [parcelValue, setParcelValue] = useState({value: '', error: ''});
  const [weight, setWeight] = useState({value: weightValue, error: ''});
  const [dimensions, setDimensions] = useState({
    value: dimensionsValue,
    error: '',
  });
  const [width, setWidth] = useState({value: widthValue, error: ''});
  const [height, setHeight] = useState({value: heightValue, error: ''});
  const [comment, setComment] = useState({value: '', error: ''});
  const [notifyRecipient, setNotifyRecipient] = useState(false);
  const [sendEndTripOtpToReceiver, setSendEndTripOtpToReceiver] =
    useState(false);

  const [isScheduled, setIsScheduled] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    var formattedDate = format(date, 'dd-MMM-yyyy hh:mm a');
    if (moment(date).isAfter(moment())) {
      setIsDateSelected(formattedDate);
      hideDatePicker();
    } else {
      Alert.alert('Validation', 'Please choose a valid date and time.');
      hideDatePicker();
    }
  };
  const pickupAddressData = useSelector(
    state => state.pickupAddressData.pickupAddressData,
  );
  const dropAddressData = useSelector(
    state => state.dropAddressData.dropAddressData,
  );
  const pickupLocationData = useSelector(
    state => state.pickupLocationData.pickupLocationData,
  );
  const dropLocationData = useSelector(
    state => state.dropLocationData.dropLocationData,
  );
  const dispatch = useDispatch();

  const state = useSelector(state => state);

  // with new pin logic
  const fetchProfileData = useSelector(state => state.fetchProfileData);
  // Remove old address logic. We'll use geocoding from lat/lng.

useEffect(() => {
    // Use destinationData for drop location
    if (!destinationData?.latitude || !destinationData?.longitude) return;
    Geocoder.from(destinationData.latitude, destinationData.longitude)
      .then(json => {
        const addressComp = json.results[0]?.address_components || [];
        // Compose area from all relevant address parts in order
        const areaTypes = [
          'premise',
          'sublocality_level_3',
          'sublocality_level_2',
          'sublocality_level_1',
          'sublocality',
          'route',
          'neighborhood',
        ];
        const areaParts = [];
        areaTypes.forEach(type => {
          addressComp.forEach(c => {
            if (c.types.includes(type) && !areaParts.includes(c.long_name)) {
              areaParts.push(c.long_name);
            }
          });
        });
        const area = areaParts.join(', ');
        const getType = type => addressComp.find(c => c.types.includes(type))?.long_name || '';
        const city = getType('locality') || getType('administrative_area_level_2') || '';
        const state = getType('administrative_area_level_1') || '';
        const country = getType('country') || '';
        const pincode = getType('postal_code') || '';
        dispatch(
          dropAddAddressActions.setDropAddressData(
            {
              longitude: destinationData.longitude,
              latitude: destinationData.latitude,
            },
            destinationData.place_id || '',
            fetchProfileData.fetchProfileData.first_name,
            fetchProfileData.fetchProfileData.last_name,
            fetchProfileData.fetchProfileData.email,
            fetchProfileData.fetchProfileData.phone_number,
            destinationData.flatName || '',
            area,
            city,
            state,
            country,
            pincode,
            '', // fullAddress not needed
            'no',
            '',
            false,
          ),
        );
      })
      .catch(e => {
        // fallback: set minimal data
        dispatch(
          dropAddAddressActions.setDropAddressData(
            {
              longitude: destinationData.longitude,
              latitude: destinationData.latitude,
            },
            destinationData.place_id || '',
            fetchProfileData.fetchProfileData.first_name,
            fetchProfileData.fetchProfileData.last_name,
            fetchProfileData.fetchProfileData.email,
            fetchProfileData.fetchProfileData.phone_number,
            destinationData.flatName || '',
            '', '', '', '', '', '', 'no', '', false,
          ),
        );
      });
  }, []);

useEffect(() => {
    // Use sourceData for pickup location
    if (!sourceData?.latitude || !sourceData?.longitude) return;
    Geocoder.from(sourceData.latitude, sourceData.longitude)
      .then(json => {
        const addressComp = json.results[0]?.address_components || [];
        // Compose area from all relevant address parts in order
        const areaTypes = [
          'premise',
          'sublocality_level_3',
          'sublocality_level_2',
          'sublocality_level_1',
          'sublocality',
          'route',
          'neighborhood',
        ];
        const areaParts = [];
        areaTypes.forEach(type => {
          addressComp.forEach(c => {
            if (c.types.includes(type) && !areaParts.includes(c.long_name)) {
              areaParts.push(c.long_name);
            }
          });
        });
        const area = areaParts.join(', ');
        const getType = type => addressComp.find(c => c.types.includes(type))?.long_name || '';
        const city = getType('locality') || getType('administrative_area_level_2') || '';
        const state = getType('administrative_area_level_1') || '';
        const country = getType('country') || '';
        const pincode = getType('postal_code') || '';
        dispatch(
          addAddressActions.setPickupAddressData(
            {
              longitude: sourceData.longitude,
              latitude: sourceData.latitude,
            },
            sourceData.place_id || '',
            fetchProfileData.fetchProfileData.first_name,
            fetchProfileData.fetchProfileData.last_name,
            fetchProfileData.fetchProfileData.email,
            fetchProfileData.fetchProfileData.phone_number,
            sourceData.flatName || '',
            area,
            city,
            state,
            country,
            pincode,
            '', // fullAddress not needed
            'no',
            '',
            false,
          ),
        );
      })
      .catch(e => {
        // fallback: set minimal data
        dispatch(
          addAddressActions.setPickupAddressData(
            {
              longitude: sourceData.longitude,
              latitude: sourceData.latitude,
            },
            sourceData.place_id || '',
            fetchProfileData.fetchProfileData.first_name,
            fetchProfileData.fetchProfileData.last_name,
            fetchProfileData.fetchProfileData.email,
            fetchProfileData.fetchProfileData.phone_number,
            sourceData.flatName || '',
            '', '', '', '', '', '', 'no', '', false,
          ),
        );
      });
  }, []);

  // to hide view when keyboard appears
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const onPressSelectLocation = valueText => {
    //console.log(`valueText: ${valueText}`)
    if (valueText === 'pickup') {
      setFlagPickupPoint(true);
      setFlagDropPoint(false);
    } else {
      // setFlagPickupPoint(false);
      // setFlagDropPoint(true);
      pickupLocationCheckValidation('drop');
    }

    //console.log(`dropLocation: ${JSON.stringify(dropAddressData)}`)
  };

  // Image Picker view method
  const [resourcePathImage, setResourcePathImage] = useState('');
  const [echallanError, setEchallanError] = useState(false);

  const checkDistanceBetweenPoints = (
    lat1,
    lng1,
    lat2,
    lng2,
    changeValue,
    isPickup,
  ) => {
    var urlToFetchDistance =
      'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=' +
      lat1 +
      ',' +
      lng1 +
      '&destinations=' +
      lat2 +
      '%2C' +
      lng2 +
      '&key=' +
      AppConstants.google_place_api_key; // + '&mode=driving';
    // console.log(`urlToFetchDistance: ${urlToFetchDistance}`);
    setIsLoading(true);
    fetch(urlToFetchDistance)
      .then(res => {
        return res.json();
      })
      .then(res => {
        // console.log('res from api:', res);
        if (res.rows[0].elements[0].status == 'OK') {
          var tDistanceValue = res.rows[0].elements[0].distance.value;
          let finalDistanceValue = (
            ((tDistanceValue / 1000) * 10) /
            10
          ).toFixed(2);
            if (isPickup) {
              onPressPickupNext(changeValue);
              setIsLoading(false);
            } else {
              fetchDistanceBetweenPoints(
                pickupAddressData.coordinates.latitude,
                pickupAddressData.coordinates.longitude,
                dropAddressData.coordinates.latitude,
                dropAddressData.coordinates.longitude,
              );
            // }
          }
        } else {
          setIsLoading(false);
          Alert.alert(
            'Alert',
            'Selected address was incorrect please update or add new address and try again.',
            [{text: 'OK', onPress: () => console.log('OK Pressed')}],
            {cancelable: false},
          );
        }
      })
      .catch(error => {
        console.log('Problem occurred: ', error);
        setIsLoading(false);
      });
  };

  const fetchDistanceBetweenPoints = (lat1, lng1, lat2, lng2) => {
    var urlToFetchDistance =
      'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=' +
      lat1 +
      ',' +
      lng1 +
      '&destinations=' +
      lat2 +
      '%2C' +
      lng2 +
      '&key=' +
      AppConstants.google_place_api_key; // + '&mode=driving';
    // console.log(`urlToFetchDistance: ${urlToFetchDistance}`);
    setIsLoading(true);
    fetch(urlToFetchDistance)
      .then(res => {
        return res.json();
      })
      .then(async(res) => {
        // console.log(`res: ${JSON.stringify(res)}`);
        var tDistanceValue = res.rows[0].elements[0].distance.value;
        let finalDistanceValue = (((tDistanceValue / 1000) * 10) / 10).toFixed(
          2,
        );
        // console.log(`tDistanceValue: ${tDistanceValue}`);
        // console.log(`finalDistanceValue: ${finalDistanceValue}`);
        let finalPrice = await calculatePrice(finalDistanceValue, selectedVehicleData);
        // to checkout process or auto assign transporter
        // openCheckoutScreen(finalPrice, finalDistanceValue)
        openDashboardScreen(finalPrice, finalDistanceValue);
        setIsLoading(false);
      })
      .catch(error => {
        console.log('Problem occurred: ', error);
        setIsLoading(false);
      });
  };

  const pickupLocationCheckValidation = changeValue => {
    //console.log(`changeValue: ${changeValue}`)
    const sendingError = sendigValidator(sending.value);
    const parcelValueError = parcelValueValidator(parcelValue.value);
    const weightError = weightValidator(weight.value);
    const dimensionsError = dimensionValidator(dimensions.value);
    const widthError = widthValidator(width.value);
    const heightError = heightValidator(height.value);
    const isDateSelectedError = isDateSelectorValidator(isDateSelected);
    // const commentError = commentValidator(comment.value);
    // console.log('resource path', resourcePathImage);
    if (pickupAddressData == '') {
      Alert.alert(
        'Alert',
        'Please add pickup location',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return;
    } else if (sendingError) {
      setSending({...sending, error: sendingError});
      return;
    } else if (parcelValueError) {
      setParcelValue({...parcelValue, error: parcelValueError});
      return;
    } else if (weightError) {
      setWeight({...weight, error: weightError});
      return;
    } else if (dimensionsError) {
      // setDimensions({...dimensions, error: dimensionsError});
      Alert.alert(
        'Alert',
        dimensionsError,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return;
    } else if (widthError) {
      // setWidth({...width, error: widthError});
      Alert.alert(
        'Alert',
        widthError,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return;
    } else if (heightError) {
      // setHeight({...height, error: heightError});
      Alert.alert(
        'Alert',
        heightError,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return;
    } else if (isScheduled && isDateSelectedError) {
      Alert.alert(
        'Alert',
        isDateSelectedError,
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return;
    } 
    // E-way challan is now optional, so do not block if not uploaded
    else if (!isValidAddress(pickupAddressData)) {
      Alert.alert(
        'Alert',
        'Pickup location is missing some details.',
        [{text: 'Update', onPress: () => openAddAddressScreen(true)}],
        {cancelable: false},
      );
      return;
    } else {
      setEchallanError(false);
      if (pickupAddressData && pickupAddressData.coordinates && sourceData) {
        checkDistanceBetweenPoints(
          pickupAddressData.coordinates.latitude,
          pickupAddressData.coordinates.longitude,
          sourceData.latitude,
          sourceData.longitude,
          changeValue,
          true,
        );
      } else {
        alert('Something went wrong. Please try again.');
      }

    }
  };

  const onPressPickupNext = changeValue => {
    let eChallan = null;
    if (resourcePathImage != '') {
      eChallan = resourcePathImage;
    }
    dispatch(
      setPickupLocationDataActions.setPickupLocationData(
        pickupAddressData.coordinates,
        pickupAddressData.first_name,
        pickupAddressData.last_name,
        pickupAddressData.email,
        pickupAddressData.phone_number,
        pickupAddressData.flat_name,
        pickupAddressData.area,
        pickupAddressData.city,
        pickupAddressData.state,
        pickupAddressData.country,
        pickupAddressData.pincode,
        sending.value,
        parcelValue.value,
        weight.value,
        dimensions.value,
        width.value,
        height.value,
        !isDateSelected
          ? moment(new Date()).add(30, 'm').format('DD-MMM-yyyy hh:mm a')
          : isDateSelected,
        comment.value,
        eChallan,
      ),
    );
    // onPressSelectLocation('drop');
    setFlagPickupPoint(false);
    setFlagDropPoint(true);
  };

  const onPressDropNext = () => {
    if (dropAddressData === '') {
      Alert.alert(
        'Alert',
        'Please add drop location',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
      return;
    } else if (!isValidAddress(dropAddressData)) {
      Alert.alert(
        'Alert',
        'Drop location is missing some details.',
        [{text: 'Update', onPress: () => openAddAddressScreen(true)}],
        {cancelable: false},
      );
      return;
    } else {
      if (dropAddressData && dropAddressData.coordinates && sourceData) {
        checkDistanceBetweenPoints(
          dropAddressData.coordinates.latitude,
          dropAddressData.coordinates.longitude,
          destinationData.latitude,
          destinationData.longitude,
          null,
          false,
        );
      } else {
        alert('Something went wrong. Please try again.');
      }
    }
  };

  const openDashboardScreen = (totalPrice, totalDistance) => {
    dispatch(
      setDropLocationDataActions.setDropLocationData(
        dropAddressData.coordinates,
        dropAddressData.first_name,
        dropAddressData.last_name,
        dropAddressData.email,
        dropAddressData.phone_number,
        dropAddressData.flat_name,
        dropAddressData.area,
        dropAddressData.city,
        dropAddressData.state,
        dropAddressData.country,
        dropAddressData.pincode,
        notifyRecipient,
        true,
        sendEndTripOtpToReceiver,
      ),
    ).then(async() => {
      const loadedDropLocationData = new DropLocationData(
        dropAddressData.coordinates,
        dropAddressData.first_name,
        dropAddressData.last_name,
        dropAddressData.email,
        dropAddressData.phone_number,
        dropAddressData.flat_name,
        dropAddressData.area,
        dropAddressData.city,
        dropAddressData.state,
        dropAddressData.country,
        dropAddressData.pincode,
        notifyRecipient,
        true,
        sendEndTripOtpToReceiver,
      );

      handleNewOrderRequest(
        totalPrice,
        totalDistance,
        loadedDropLocationData,
      ).then((_obj) => {
        props.navigation.navigate('DashboardScreen', {
          pickupLocationData: pickupLocationData,
          dropLocationData: loadedDropLocationData,
          transporterSelectedData: selectedData,
          selectedVehicleData: selectedVehicleData,
          price: totalPrice,
          vehicle_type: vehicle_type,
          newDistance: `${totalDistance} km`,
          distance: totalDistance,
          _obj: _obj,
        });
        setIsLoading(false);
      });
    });
  };

  const handleNewOrderRequest = async(
    totalPrice,
    totalDistance,
    drop_locData,
  ) => {
    const random_no = Math.floor(Math.random() * 10000000 + 1);

    let orderDetails = {
      requested_uid: userUID,
      // transporter_uid: transporterData?.id,
      payment_mode: 'COD',
      order_id: random_no.toString(),
      status: 'pending',
      pickup_location: pickupLocationData,
      drop_location: drop_locData,
      // transporter_details: transporterData,
      price: totalPrice,
      is_paymentReceived: false,
      vehicle_type: vehicle_type,
      created_at: new Date(),
      distance: totalDistance,
      is_sendOTPEndTrip: sendEndTripOtpToReceiver,
      created_by: {
        customer_id: userUID,
        first_name: profileData?.first_name,
        last_name: profileData?.last_name,
        phone_number: profileData?.phone_number,
        email: profileData?.email,
      },
    };
    console.log('orderDetails: ', orderDetails);
    // dispatch(setActiveOrderAction(orderDetails));

    return addOrderDetails_fs(orderDetails).then(res => {
      console.log('addOrderDetails_fs res: ', res);
      let _obj = null;
      if (res) {
        _obj = {
          event: 'proximitySearch',
          data: {
            customerId: userUID,
            pickupLocation: pickupLocationData?.coordinate,
            vehicleType: selectedVehicleData?.id,
            orderDetails: {
              order_id: res?.orderId,
            },
          },
        };
        // console.log('proximitySearch(webSocketServices): ', _obj);
        // webSocketServices.send(_obj);
        socketIo.sendEvent('proximitySearch', _obj);
        dispatch(setActiveOrderAction(res));
      }
      return _obj;
    }); // to add order to db
  };

  const openCheckoutScreen = (price, newDistance) => {
    dispatch(
      setDropLocationDataActions.setDropLocationData(
        dropAddressData.coordinates,
        dropAddressData.first_name,
        dropAddressData.last_name,
        dropAddressData.email,
        dropAddressData.phone_number,
        dropAddressData.flat_name,
        dropAddressData.area,
        dropAddressData.city,
        dropAddressData.state,
        dropAddressData.country,
        dropAddressData.pincode,
        notifyRecipient,
        true,
        sendEndTripOtpToReceiver,
      ),
    ).then(() => {
      const loadedDropLocationData = new DropLocationData(
        dropAddressData.coordinates,
        dropAddressData.first_name,
        dropAddressData.last_name,
        dropAddressData.email,
        dropAddressData.phone_number,
        dropAddressData.flat_name,
        dropAddressData.area,
        dropAddressData.city,
        dropAddressData.state,
        dropAddressData.country,
        dropAddressData.pincode,
        notifyRecipient,
        true,
        sendEndTripOtpToReceiver,
      );
      /* console.log(
        `dropLocationData: for checkout`,
        loadedDropLocationData,
        pickupLocationData,
      ); */

      props.navigation.navigate('Checkout', {
        pickupLocationData: pickupLocationData,
        dropLocationData: loadedDropLocationData,
        transporterSelectedData: selectedData,
        price: price,
        vehicle_type: vehicle_type,
        newDistance: `${newDistance} km`,
        distance: newDistance,
      });
    });
  };

  const openAddAddressScreen = (onlyAddressUpdate = false) => {
    props.navigation.navigate('AddAddressScreen', {
      statusAddAddress: flagPickupPoint ? 'pickup' : 'drop',
      isEdit: true,
      isEditFromParcelScreen: true,
      id: flagPickupPoint ? pickupAddressData.id : dropAddressData.id,
      name: flagPickupPoint
        ? pickupAddressData.first_name
        : dropAddressData.first_name,
      lastName: flagPickupPoint
        ? pickupAddressData.last_name
        : dropAddressData.last_name,
      email: flagPickupPoint ? pickupAddressData.email : dropAddressData.email,
      phone: flagPickupPoint
        ? pickupAddressData.phone_number
        : dropAddressData.phone_number,
      flat_name: flagPickupPoint
        ? pickupAddressData.flat_name
        : dropAddressData.flat_name,
      area: flagPickupPoint ? pickupAddressData.area : dropAddressData.area,
      city: flagPickupPoint ? pickupAddressData.city : dropAddressData.city,
      state: flagPickupPoint ? pickupAddressData.state : dropAddressData.state,
      country: flagPickupPoint
        ? pickupAddressData.country
        : dropAddressData.country,
      pincode: flagPickupPoint
        ? pickupAddressData.pincode
        : dropAddressData.pincode,
      coordinate: flagPickupPoint
        ? pickupAddressData.coordinates
        : dropAddressData.coordinates,
      onlyAddressUpdate: onlyAddressUpdate,
    });
  };

  const getFormattedAddress = location => {
    // Show flat_name, area, city, state, pincode (each only once, from their own variable)
    let addressParts = [];
    if (location.flat_name) addressParts.push(location.flat_name);
    if (location.area) addressParts.push(location.area);
    if (location.city) addressParts.push(location.city);
    if (location.state) addressParts.push(location.state);
    if (location.pincode) addressParts.push(location.pincode);
    return addressParts.join(', ');
  };

  const isValidAddress = location => {
    if (
      location.flat_name &&
      location.flat_name?.length > 0 &&
      location.area &&
      location.area?.length > 0 &&
      location.city &&
      location.city?.length > 0 &&
      location.state &&
      location.state?.length > 0 &&
      location.pincode &&
      location.pincode?.length > 0 &&
      location.country &&
      location.country?.length > 0
    ) {
      return true;
    }
    return false;
  };

  return (
    <View style={styles.container}>
      <CHeader
        navigation={props.navigation}
        isBackBtn={true}
        headerTitle={'Add Parcel Details'}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* <SelectParcel data={selectedData.data} price={priceValue} /> */}

        <View style={styles.selectDetailView}>
          <TouchableOpacity
            onPress={() => {
              onPressSelectLocation('pickup');
            }}
          >
            <Text
              style={flagPickupPoint ? styles.selectText : styles.unSelectText}
            >
              Pickup Location
            </Text>
            <View
              style={
                flagPickupPoint ? styles.activeDotView : styles.unActiveDotView
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onPressSelectLocation('drop');
            }}
          >
            <Text
              style={flagDropPoint ? styles.selectText : styles.unSelectText}
            >
              Drop Point
            </Text>
            <View
              style={
                flagDropPoint ? styles.activeDotView : styles.unActiveDotView
              }
            />
          </TouchableOpacity>
        </View>
        <View style={{margin: 16}}>
          {/* <Text style={styles.titleText}>Choose Location</Text> */}
          
          {flagPickupPoint && pickupAddressData.first_name && (
            <View style={{marginTop: 8}}>
              <View style={styles.locationView}>
                <Text
                  style={{...styles.titleText, fontSize: RFPercentage(2.2)}}
                >
                  {pickupAddressData.first_name +
                    ' ' +
                    pickupAddressData.last_name}
                </Text>
                {/* <TouchableOpacity
                  onPress={() => {
                    openAddAddressScreen();
                  }}
                >
                  <Text style={styles.subTitleText}>Edit</Text>
                </TouchableOpacity> */}
              </View>
              <Text style={styles.locationText}>
                {getFormattedAddress(pickupAddressData)}
              </Text>
              <Text style={styles.locationText}>
                {pickupAddressData.phone_number}
              </Text>
            </View>
          )}
          
          {flagDropPoint && dropAddressData.first_name && (
            <View style={{marginTop: 8}}>
              <View style={styles.locationView}>
                <Text
                  style={{...styles.titleText, fontSize: RFPercentage(2.2)}}
                >
                  {dropAddressData.first_name + ' ' + dropAddressData.last_name}
                </Text>
                {/* <TouchableOpacity
                  onPress={() => {
                    openAddAddressScreen();
                  }}
                >
                  <Text style={styles.subTitleText}>Edit</Text>
                </TouchableOpacity> */}
              </View>
              <Text style={styles.locationText}>
                {getFormattedAddress(dropAddressData)}
              </Text>
              <Text style={styles.locationText}>
                {dropAddressData.phone_number}
              </Text>
            </View>
          )}

          {/* <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('AddressScreen', {
                statusAddAddress: flagPickupPoint ? 'pickup' : 'drop',
              });
            }}
          >
            <Text style={styles.newAddressText}>+ Add new address</Text>
          </TouchableOpacity> */}
        </View>
        {flagPickupPoint && (
          <View style={{margin: 16, marginTop: 0}}>
            <Text style={styles.titleText}>Package details</Text>
            <TextInputParcel
              //   style={styles.nameInputText}
              label="What are you sending?"
              returnKeyType="next"
              value={sending.value}
              onChangeText={text => setSending({value: text, error: ''})}
              error={!!sending.error}
              errorText={sending.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="default"
              // ref={(ref) => {
              //   this._sendinginput = ref;
              // }}
              // onSubmitEditing={() =>
              //   this._parcelValueinput && this._parcelValueinput.focus()
              // }
              multiline
            />
            <TextInputParcel
              // style={styles.weightInputText}
              placeholder="Parcel Value"
              returnKeyType="next"
              value={parcelValue.value}
              onChangeText={text => setParcelValue({value: text, error: ''})}
              error={!!parcelValue.error}
              errorText={parcelValue.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="number-pad"
              // ref={(ref) => {
              //   this._parcelValueinput = ref;
              // }}
              // onSubmitEditing={() => this._widthinput && this._widthinput.focus()}
            />
            <TextInputParcel
              // style={styles.weightInputText}
              placeholder="Weight(KG)"
              returnKeyType="next"
              value={weight.value}
              editable={false}
              onChangeText={text => setWeight({value: text, error: ''})}
              error={!!weight.error}
              errorText={weight.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="number-pad"
              // ref={(ref) => {
              // this._weightinput = ref;
              // }}
              // onSubmitEditing={() =>
              //   this._dimensioninput && this._dimensioninput.focus()
              // }
            />
            <View style={styles.dimentionView}>
              <TextInput
                style={styles.widthInputText}
                placeholder="123 cm"
                returnKeyType="next"
                value={dimensions.value}
                editable={false}
                onChangeText={text => setDimensions({value: text, error: ''})}
                error={!!dimensions.error}
                errorText={dimensions.error}
                autoCapitalize="none"
                autoCompleteType="name"
                textContentType="name"
                keyboardType="number-pad"
                // ref={(ref) => {
                //   this._dimensioninput = ref;
                // }}
                // onSubmitEditing={() =>
                //   this._widthinput && this._widthinput.focus()
                // }
              />
              <Text style={{...styles.textKG, color: Colors.subTitleTextColor}}>
                X
              </Text>
              <TextInput
                style={styles.widthInputText}
                placeholder="Width"
                returnKeyType="next"
                value={width.value}
                editable={false}
                onChangeText={text => setWidth({value: text, error: ''})}
                error={!!width.error}
                errorText={width.error}
                autoCapitalize="none"
                autoCompleteType="name"
                textContentType="name"
                keyboardType="number-pad"
                // ref={(ref) => {
                //   this._widthinput = ref;
                // }}
                // onSubmitEditing={() =>
                //   this._heightinput && this._heightinput.focus()
                // }
              />
              <Text style={{...styles.textKG, color: Colors.subTitleTextColor}}>
                X
              </Text>
              <TextInput
                style={styles.widthInputText}
                placeholder="Height"
                returnKeyType="next"
                value={height.value}
                editable={false}
                onChangeText={text => setHeight({value: text, error: ''})}
                error={!!height.error}
                errorText={height.error}
                autoCapitalize="none"
                autoCompleteType="name"
                textContentType="name"
                keyboardType="number-pad"
                // ref={(ref) => {
                //   this._heightinput = ref;
                // }}
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>

            <View style={{marginTop: -14, marginStart: -6}}>
              <CheckboxInput
                label={
                  <Text style={{...styles.titleText, fontWeight: '600'}}>
                    Scheduled pickup
                  </Text>
                }
                checked={isScheduled}
                onPress={() => {
                  setIsScheduled(!isScheduled);
                  setIsDateSelected(false);
                }}
              />
            </View>
            {isScheduled ? (
              <TouchableOpacity
                onPress={showDatePicker}
                style={styles.buttonPlannedDate}
              >
                <Text style={styles.textPlannedDate}>
                  {!isDateSelected ? 'Pickup Date and Time' : isDateSelected}
                </Text>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="datetime"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                  headerTextIOS="Planned Date of Purchase"
                  minimumDate={addMinutes(new Date(), 1)}
                />
                <Image
                  style={styles.calanderImage}
                  source={require('../../../assets/assets/PlaceOrder/calendar.png')}
                />
              </TouchableOpacity>
            ) : null}
            <TextInputParcel
              //   style={styles.nameInputText}
              label="Comment"
              returnKeyType="next"
              value={comment.value}
              onChangeText={text => setComment({value: text, error: ''})}
              error={!!comment.error}
              errorText={comment.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="default"
              // // ref={(ref) => {
              //   this._commentinput = ref;
              // }}
              onSubmitEditing={() => {
                /* this._widtinput && this._weightinput.focus() */
              }}
              multiline
            />

            <TouchableOpacity
              onPress={() => setPopup(true)}
              style={styles.uploadView}
            >
              {resourcePathImage != '' ? (
                <Image
                  style={styles.addPhtosImage}
                  // source={{uri: resourcePathImage.uri}}
                  source={{
                    uri:
                      resourcePathImage?.assets[0] != undefined
                        ? typeof resourcePathImage === 'string'
                          ? resourcePathImage
                          : `data:${resourcePathImage?.assets[0]?.type};base64,${resourcePathImage?.assets[0]?.base64}`
                        : '',
                  }}
                />
              ) : (
                <Image
                  style={styles.placeholderImage}
                  source={require('../../../assets/assets/PlaceOrder/upload.png')}
                />
              )}
            </TouchableOpacity>
            {flagPickupPoint && (
            <Text style={{...styles.locationText, marginTop: 6, textAlign: 'center' }}>
              Add your E-Way challan (optional)
            </Text>
            )}
          </View>
        )}
        {flagDropPoint && (
          <View style={{margin: 16, marginTop: 0}}>
            <PlaceOrderTextInput
              isPickupPoint={false}
              notifyRecipient={notifyRecipient}
              sendEndTripOtpToReceiver={sendEndTripOtpToReceiver}
              setNotifyRecipient={val => setNotifyRecipient(val)}
              setSendEndTripOtpToReceiver={val =>
                setSendEndTripOtpToReceiver(val)
              }
            />
          </View>
        )}
        {flagPickupPoint && (
          <CPrimaryButton btnTitle={'Continue'} onPress={() => { onPressSelectLocation('drop'); }} />
        )}
        {flagDropPoint && (
          <CPrimaryButton
            btnTitle={'Book Now'}
            onPress={() => onPressDropNext()}
            isLoading={isLoading}
            isDisabled={isLoading}
          />
        )}
        
        <CModal visible={popup}>
          <View style={styles.centeredView}>
            <View style={styles.popupView}>
              <Text
                style={{
                  ...styles.placeOrderText,
                  color: Colors.titleText,
                  marginTop: 16,
                }}
              >
                Select Image
              </Text>
              <TouchableOpacity
                style={styles.homeButtonView}
                onPress={() =>
                  launchCamera(
                    {
                      mediaType: 'photo',
                      includeBase64: true,
                      maxHeight: 512,
                      maxWidth: 512,
                    },
                    response => {
                      setPopup(false);
                      if (!response.didCancel) {
                        setResourcePathImage(response);
                      }
                    },
                  )
                }
              >
                <Text style={styles.placeOrderText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{...styles.homeButtonView, marginTop: 0}}
                onPress={() =>
                  launchImageLibrary(
                    {
                      mediaType: 'photo',
                      includeBase64: true,
                      maxHeight: 512,
                      maxWidth: 512,
                    },
                    response => {
                      setPopup(false);
                      if (!response.didCancel) {
                        setResourcePathImage(response);
                      }
                    },
                  )
                }
              >
                <Text style={styles.placeOrderText}>Library</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{...styles.homeButtonView, marginTop: 0}}
                onPress={() => setPopup(false)}
              >
                <Text style={styles.placeOrderText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CModal>

        <Loader loading={isLoading} />
      </ScrollView>
      {/* new flow for auto-booking */}
      {!isKeyboardVisible && <PriceView price={priceValue} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  backImage: {
    height: 40,
    width: 40,
  },
  selectDetailView: {
    backgroundColor: Colors.backgroundColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    margin: 16,
    marginTop: 8,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2.5),
    color: Colors.textColor,
  },
  unSelectText: {
    margin: 16,
    marginTop: 8,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2.5),
    color: Colors.unSelectTextColor,
  },
  activeDotView: {
    margin: 16,
    marginTop: -8,
    height: 3,
    width: 25,
    backgroundColor: Colors.primaryColor,
    borderRadius: 5,
  },
  unActiveDotView: {
    margin: 16,
    marginTop: -8,
    height: 3,
    width: 25,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 5,
  },
  locationView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: Colors.textColor,
  },
  subTitleText: {
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.textColor,
  },
  locationText: {
    marginTop: 4,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.8),
    color: Colors.otherTextColor,
  },
  newAddressText: {
    marginTop: 16,
    color: Colors.primaryColor,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2.2),
  },
  placeholderImage: {
    width: 50,
    height: 50,
    justifyContent: 'center',
  },
  addPhtosImage: {
    height: 98,
    width: 98,
  },
  uploadView: {
    marginTop: 16,
    backgroundColor: Colors.backgroundColor,
    // height: 100,
    // width: 100,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.primaryColor,
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
  buttonBookNow: {
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
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: windowWidth / 2,
  },
  popupView: {
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
  errorText: {
    paddingTop: 8,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.errorColor,
  },
});

export default AddParcelDetails;
