import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {getDistance} from 'geolib';
import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import {
  Alert,
  Dimensions,
  // FlatList,
  Image,
  Keyboard,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';
import {firebase} from '@react-native-firebase/auth';
import Geocoder from 'react-native-geocoding';
import {TouchableOpacity as RNGHTouchableOpacity} from 'react-native-gesture-handler';
// Import the Plugins and Thirdparty library.
import MapView, {Callout, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import MapViewDirections from 'react-native-maps-directions';
import {RFPercentage} from 'react-native-responsive-fontsize';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import GooglePlacesTextInput from '../../../components/design/GooglePlacesTextInput';
import Loader from '../../../components/design/Loader';
import LargeImage from '../../../components/design/LargeImage';
import AppConstants from '../../../helper/constants/AppConstants';
// Import the JS file.
import Colors from '../../../helper/extensions/Colors';
import AppPreference from '../../../helper/preference/AppPreference';
import * as fetchVehicleTypeListAction from '../../../store/actions/customer/addParcelDetails/getVehicleType';
import * as filterTraspoterListActions from '../../../store/actions/dashboard/filterTranspoterList';
import * as destinationSetActions from '../../../store/actions/dashboard/setDestinationValue';
import * as addressSetActions from '../../../store/actions/dashboard/setSourceValue';
import * as userListActions from '../../../store/actions/dashboard/userlist';
import NotificationCall from '../../../helper/NotificationCall';
import {
  RazorpayCreateOrderApi,
  WidthPercentage,
  handleCheckLocationGPSOn,
  razorpayPreOptions,
  rupeeToPaisa,
} from '../../../helper/extensions/Util';

import PriceView from '../../../components/Customer/PriceView';
import firestore from '@react-native-firebase/firestore';
import {
  getOrderDetailOnSnapshot,
  changeTrans_updateOrderDetails_fs,
  updateOrderDetail_fs,
  getDriverDataById_firestore,
  getVehicleDataById_firestore,
} from '../../../helper/Utils/fireStoreUtils';
import {calculatePrice} from '../../../helper/Price';
import {ActivityIndicator} from 'react-native-paper';
import {setActiveOrderAction} from '../../../store/actions/placeOrder/placeOrder';
import {Menu, MenuItem} from 'react-native-material-menu';

import RazorpayCheckout from 'react-native-razorpay';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';

import GetLocation from 'react-native-get-location';
import CHeader from '../../../components/CHeader';
import webSocketServices from '../../../websocket/webSocketServices';
import {paymentOptionsArr} from '../../../helper/extensions/dummyData';
import FastImage from 'react-native-fast-image';
import CBottomSheet from '../../../components/CBottomSheet';
import {defaultCoordinates, images} from '../../../helper/Utils';
import GooglePlacesSearchTxtInput from '../../../components/design/GooglePlacesSearchTxtInput';
import CCompleteAddressModal from '../../../components/CCompleteAddressModal';
import CModal from '../../../components/design/CModal';
import CPrimaryButton from '../../../components/design/CPrimaryButton';
import socketIo from '../../../websocket/socketIOServices';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

// Load the main class.
navigator.geolocation = require('@react-native-community/geolocation');
Geocoder.init(AppConstants.google_place_api_key);

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const homePlace = {
  description: 'Home',
  geometry: {location: {lat: 22.6898, lng: 72.8567}},
};

let watchId = null;

const DashboardScreenNew = props => {
  const params = props?.route?.params;
  const _objFromParams = params?._obj;

  // ref
  // const addressRef = useRef();
  const mapRef = useRef();
  const bottomSheetRef = useRef(null);
  // variables for bottomSheet
  const snapPoints = useMemo(() => ['30%', '50%'], []); // ['initialSnap', 'snapTo', 'closeSnap']

  const selectedOrderData = params?.selectedOrderData;
  const selectedOrderDataId = params?.selectedOrderDataId;
  const assignTransporterMode = params?.assignTransporterMode;

  // const {selectedOrderData, selectedOrderDataId, assignTransporterMode} = props?.route?.params || {};

  const dispatch = useDispatch();

  let userUID = useSelector(state => state.fetchProfileData.userUID);
  let userProfileData = useSelector(
    state => state.fetchProfileData.fetchProfileData,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isPinAddressLoading, setIsPinAddressLoading] = useState(false);
  const [isShowLargeImage, setIsShowLargeImage] = useState(false);

  const [paymentDetails, setPaymentDetails] = useState(null);
  const [source, setSource] =
    useState(
      '',
    ); /* Ramdev hardware vado, */ /* Abhilasha Cross Road, Raghuvir Nagar, Ekta Nagar, New Sama, Vadodara, Gujarat 390002 */
  const [sourceLatLong, setSourceLatLong] = useState(
    selectedOrderData?.pickup_location?.coordinate
      ? {...selectedOrderData?.pickup_location?.coordinate}
      : defaultCoordinates,
  );
  const [destination, setDestination] =
    useState(
      '',
    ); /* diwalipura, */ /* 85QH+WHH, Rukshmani Nagar, New Sama, Vadodara, Gujarat 390024, India */
  const [destinationLatLong, setDestinationLatLong] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [distance, setDistance] = useState(selectedOrderData?.distance || '');
  // const [distanceValue, setDistanceValue] = useState('');

  // payment Option state
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMode, setPaymentMode] = useState(paymentOptionsArr[0]);

  const activeOrder = useSelector(
    state => state?.placeOrderReducer?.activeOrder,
  );
  const filterDataList = useSelector(
    state => state.allFilterData.allFilterData,
  );
  // const filterIsLoading = useSelector(state => state.allFilterData.isLoading); // old logic
  const [isSocketResLoading, setIsSocketResLoading] = useState(true);
  const [isRetryVisible, setIsRetryVisible] = useState(false);
  const [_assignedDetails, set_assignedDetails] = useState(null);
  const [isTransAssigned, setIsTransAssigned] = useState(false);
  const [searchResMsg, setSearchResMsg] = useState(null);

  // pin states
  const [showCompleteAddressModal, setShowCompleteAddressModal] = useState(false);
  const [showChangeAddressModal, setShowChangeAddressModal] = useState(false);
  const [changeAddressType, setChangeAddressType] = useState(null);
  const [step, setStep] = useState(0);
  const [flatOrBuildingInfo, setFlatOrBuildingInfo] = useState({
    value: '',
    error: '',
  });
  const [landmark, setLandmark] = useState({value: '', error: ''});
  // New variables for pickup and drop flat+landmark
  const [pickupFlatMark, setPickupFlatMark] = useState('');
  const [dropFlatMark, setDropFlatMark] = useState('');

  useEffect(() => {
    const calculate_price = async() =>{
      let price = await calculatePrice(distance, selectedVehicleTypeData);
      if (price) {
        setPrice(price);
        fitPadding();
      }
    };

    calculate_price();
  }, [
    distance,
    sourceLatLong,
    destinationLatLong,
    weight,
    selectedVehicleTypeData,
  ]);

  const [price, setPrice] = useState(selectedOrderData?.price || '');

  const [weight, setWeight] = useState({value: '', error: ''});
  const [dimensions, setDimensions] = useState({value: '', error: ''});
  const [width, setWidth] = useState({value: '', error: ''});
  const [height, setHeight] = useState({value: '', error: ''});
  const [vehicleType, setVehicleType] = useState(
    selectedOrderData?.vehicle_type || 'Vehicle Type',
  );
  const [vehicleTypeFlag, setVehicleTypeFlag] = useState(true);
  const [upperSlider, setUpperSlider] = useState(
    selectedOrderData ? true : false,
  );
  const [selectedVehicleTypeData, setSelectedVehicleTypeData] = useState();
  const [longPressedData, setLongPressedData] = useState();

  const [vehicleTypeSearchList, setVehicleTypeSearchList] = useState([]);

  const vehicleTypeList = useSelector(
    state => state.getVehicleTypeReducer.vehicleTypeList,
  );

  useEffect(() => {
    getVehicleTypeList(true);
  }, [dispatch]);

  useEffect(() => {
    if (assignTransporterMode && selectedOrderData) {
      setDestinationLatLong({...selectedOrderData?.drop_location?.coordinate});
      setSource(selectedOrderData?.pickup_location?.flat_name);
      setDestination(selectedOrderData?.drop_location?.flat_name);
      setWeight({value: selectedOrderData?.pickup_location?.weight, error: ''});

      // getTransporterList('filter');
    }
  }, [selectedOrderData]);

  const getVehicleTypeList = isStartProgress => {
    try {
      dispatch(
        fetchVehicleTypeListAction.fetchVehicleTypeList(isStartProgress),
      );
    } catch (err) {
      console.log(
        `fetchVehicleTypeListAction.fetchVehicleTypeList.error: ${err}`,
      );
    }
  };

  const hasLocationPermission = async () => {
    if (
      AppConstants.isIOS ||
      (AppConstants.isAndroid && Platform.Version < 23)
    ) {
      return true;
    }
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const fitPadding = () => {
    mapRef.current?.fitToCoordinates([sourceLatLong, destinationLatLong], {
      edgePadding: {
        top: 300,
        right: 100,
        bottom: windowHeight - 300,
        left: 100,
      },
      animated: true,
    });
  };

  //to show transporter detail and vehicle detail with price
  useEffect(() => {
    const params = props?.route?.params;
    if (params?.pickupLocationData && params?.dropLocationData) {
      setUpperSlider(true);
    }
  }, [props?.route?.params]);

  // websocket services
  useEffect(() => {
    // webSocketServices.subscribe('orderAssignmentConfirmation', handleOrderAssignmentConfirmation);
    // webSocketServices.subscribe('proximitySearchResult', handleProximitySearchResult);
    socketIo.listenForEvent('orderAssignmentConfirmation', handleOrderAssignmentConfirmation);
    socketIo.listenForEvent('proximitySearchResult', handleProximitySearchResult);

    // Clean up on unmount
    return () => {
      // webSocketServices.unsubscribe('orderAssignmentConfirmation', handleOrderAssignmentConfirmation);
      // webSocketServices.unsubscribe('proximitySearchResult', handleProximitySearchResult);
      socketIo.removeListener('orderAssignmentConfirmation');
      socketIo.removeListener('proximitySearchResult');
    };
  }, []);

  const handleOrderAssignmentConfirmation = res => {
    let _orderData = {
      id: res?.data?.order_details?.id,
      data: {...res?.data?.order_details},
    };
    let _obj = {
      transporter_details: _orderData?.data?.transporter_details || undefined,
      driver_details: _orderData?.data?.driver_details,
      vehicle_details: _orderData?.data?.vehicle_details,
    };
    setIsSocketResLoading(!isSocketResLoading);
    set_assignedDetails(_obj);
    // setIsTransAssigned(true);
    dispatch(setActiveOrderAction(_orderData));
  };

  const handleProximitySearchResult = res => {
    // console.log('proximitySearchResult res: ', res);
    if (res) {
      setIsSocketResLoading(!isSocketResLoading);
      setSearchResMsg(res?.data?.message);
      setIsRetryVisible(true);
    }
  };

  const filterTranspoterList = (
    sourceValue,
    destinationValue,
    weightValue,
    dimensionsValue,
    widthValue,
    heightValue,
    vehicleTypeValue,
    sourceLatitudeValue,
    sourceLongitudeValue,
    destinationLatitudeValue,
    destinationLongitudeValue,
    addressType,
  ) => {
    setWeight({value: weightValue, error: ''});
    setDimensions({value: dimensionsValue, error: ''});
    setWidth({value: widthValue, error: ''});
    setHeight({value: heightValue, error: ''});
    setSource(sourceValue);
    setDestination(destinationValue);
    setVehicleType(vehicleTypeValue);
    setSourceLatLong({
      latitude: sourceLatitudeValue,
      longitude: sourceLongitudeValue,
    });
    setDestinationLatLong({
      latitude: destinationLatitudeValue,
      longitude: destinationLongitudeValue,
    });
  };

  const onPressVehicle = vehicleTypeData => {
    let dimensions = vehicleTypeData.data.dimensions.v_length;
    let width = vehicleTypeData.data.dimensions.v_width;
    let height = vehicleTypeData.data.dimensions.v_height;

    setSelectedVehicleTypeData(vehicleTypeData);
    setDimensions({value: dimensions, error: ''});
    setWidth({value: width, error: ''});
    setHeight({value: height, error: ''});
  };

  const renderVehicleData = itemData => {
    return (
      <TouchableOpacity
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginHorizontal: 8,
        }}
        onPress={() => onPressVehicle(itemData.item)}
        onLongPress={() => {
          setLongPressedData(itemData.item);
          setIsShowLargeImage(true);
        }}
      >
        <View
          style={
            selectedVehicleTypeData &&
            selectedVehicleTypeData.id === itemData.item.id
              ? styles.selectedVehicelView
              : styles.vehicleView
          }
        >
          {itemData.item.data && itemData.item.data.icon ? (
            <FastImage
              style={styles.vehicleImage}
              source={{uri: itemData.item.data.icon}}
              resizeMode="contain"
            />
          ) : (
            <FastImage
              style={styles.vehicleImage}
              source={require('../../../assets/assets/dashboard/bike.png')}
            />
          )}
          {selectedVehicleTypeData &&
            selectedVehicleTypeData.id === itemData.item.id && (
              <View
                style={{
                  flex: 1,
                  position: 'absolute',
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  backgroundColor: Colors.selectedIndexColor,
                  borderRadius: 5,
                }}
              >
                <Image
                  style={styles.selectedVehicleIndicatorImage}
                  source={require('../../../assets/assets/dashboard/click.png')}
                />
              </View>
            )}
        </View>
        <Text style={styles.vehicleNameText}>
          {itemData.item.data.vehicle_type}
        </Text>
      </TouchableOpacity>
    );
  };

  const contains = (data, query) => {
    if (data.vahicle_capacity >= query) {
      return true;
    }
    return false;
  };

  const checkAndClearData = (list, text) => {
    let isClearSelectedData = true;
    if (selectedVehicleTypeData != undefined) {
      for (let i = 0; i < list.length; i++) {
        let searchData = list[i];
        if (searchData.id == selectedVehicleTypeData.id) {
          isClearSelectedData = false;
          break;
        }
      }
    }

    if (isClearSelectedData) {
      setSelectedVehicleTypeData(undefined);
      setDimensions({value: '', error: ''});
      setWidth({value: '', error: ''});
      setHeight({value: '', error: ''});
      filterTranspoterList(
        source,
        destination,
        text,
        '',
        '',
        '',
        vehicleType,
        sourceLatLong.latitude,
        sourceLatLong.longitude,
        destinationLatLong.latitude,
        destinationLatLong.longitude,
        '',
      );
    } else {
      filterTranspoterList(
        source,
        destination,
        text,
        dimensions.value,
        width.value,
        height.value,
        vehicleType,
        sourceLatLong.latitude,
        sourceLatLong.longitude,
        destinationLatLong.latitude,
        destinationLatLong.longitude,
        '',
      );
    }
  };

  const handleFilter = text => {
    const formattedQuery = parseInt(text);
    let searchList = [];
    searchList = vehicleTypeList.filter(vehicleTypeData => {
      return contains(vehicleTypeData.data, formattedQuery);
    });
    setVehicleTypeSearchList(searchList);
    /* console.log(`searchList: `, searchList)
    console.log(`vehicleTypeList: `, vehicleTypeList) */
    if (text == '') {
      checkAndClearData(vehicleTypeList, text);
    } else {
      checkAndClearData(searchList, text);
    }
  };

  const showVehicleList = () => {
    return (
      <FlatList
        horizontal
        keyExtractor={(item, index) => item.id}
        data={weight.value != '' ? vehicleTypeSearchList : vehicleTypeList}
        renderItem={renderVehicleData}
        showsHorizontalScrollIndicator={false}
      />
    );
  };

  const showNoVehiclesTypeView = () => {
    return <Text style={styles.noVehicleText}>No Vehicle Types</Text>;
  };

  const transporterItemView = item => {
    return (
      <>
        <View style={styles.item}>
          {item.data.transporter_photo ? (
            <Image
              style={styles.itemImage}
              source={{uri: item.data.transporter_photo}}
            />
          ) : (
            <Image
              style={styles.itemImage}
              source={require('../../../assets/assets/default_user.png')}
            />
          )}
          <View>
            <Text style={styles.traspoterText}>
              {item.data.first_name} {item.data.last_name}
            </Text>
          </View>
          <View style={styles.priceView}>
            <Text style={styles.priceText}>₹ {price}</Text>
            <Text style={styles.priceText}>(Approx)</Text>
          </View>
        </View>
        <View style={styles.seperateLine} />
      </>
    );
  };

  const assignNewTransporter = transporterSelectedData => {
    let priority = transporterSelectedData?.data?.priority;
    setIsLoading(true);
    firebase
      .firestore()
      .collection('users')
      .doc(transporterSelectedData?.id)
      .update({priority: priority + 1})
      .then(() => {
        firebase
          .firestore()
          .collection('order_details')
          .doc(selectedOrderDataId)
          .update({
            transporter_uid: transporterSelectedData?.id,
            transporter_details: transporterSelectedData?.data,
            status: 'pending',
          })
          .then(() => {
            setIsLoading(false);
            Alert.alert('Success', 'Transporter assigned successfully');

            let parameters = {
              userId: transporterSelectedData?.id,
              type: 'request',
              order_id: selectedOrderDataId,
              orderId: selectedOrderDataId,
            };
            NotificationCall(parameters);
            props.navigation.goBack();
          })
          .catch(err => {
            console.log(`priority.Error.1:`, err);
            Alert.alert('', 'Something went wrong, Please try again.');
            setIsLoading(false);
          });
      })
      .catch(err => {
        console.log(`priority.Error.2:`, err);
        Alert.alert('', 'Something went wrong, Please try again.');
        setIsLoading(false);
      });
  };

  const onPressTransporterItem = item => {
    AsyncStorage.getItem(AppPreference.IS_LOGIN).then(valueLogin => {
      const isLogin = JSON.parse(valueLogin);
      if (isLogin === 1) {
        if (assignTransporterMode) {
          Alert.alert(
            'Confirmation',
            `Are you sure you want to assign "${item?.data?.first_name} ${item?.data?.last_name}" as transporter ?`,
            [
              {
                text: 'Yes',
                onPress: () => assignNewTransporter(item),
              },
              {
                text: 'No',
              },
            ],
            {cancelable: true},
          );
        } else {
          props.navigation.navigate('AddParcelDetails', {
            source: sourceLatLong,
            destination: destinationLatLong,
            selectedData: item,
            selectedVehicleData: selectedVehicleTypeData,
            vehicle_type: vehicleType,
            price: price,
            weight: weight.value,
            dimensions: dimensions.value,
            width: width.value,
            height: height.value,
          });
        }
      } else {
        props.navigation.navigate('Auth');
      }
    });
  };

  // Pass Latitude & Longitude of both points as a parameter
  const fetchDistanceBetweenPoints = async(lat1, lng1, lat2, lng2) => {
    return new Promise((resolve, reject) => {
      let urlToFetchDistance =
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
    fetch(urlToFetchDistance)
      .then(res => {
        return res.json();
      })
      .then(res => {
        if(res){
          let tDistanceValue = res.rows[0].elements[0].distance.value;
          let finalDistanceValue = (((tDistanceValue / 1000) * 10) / 10).toFixed(2);
          resolve(finalDistanceValue);
          // setDistance(finalDistanceValue);
        } else{
          resolve(false);
        }
      })
      .catch(error => {
        console.log('Problem occurred: ', error);
        resolve(false);
      });  
    })
  };

  const openAddParcelDetailsScreen = (orderPrice) => {
    AsyncStorage.getItem(AppPreference.IS_LOGIN).then(valueLogin => {
      const isLogin = JSON.parse(valueLogin);
      if (isLogin === 1) {
        
        const sourceObj = {...sourceLatLong, flatName: pickupFlatMark};
        const destinationObj = {...destinationLatLong, flatName: dropFlatMark};

        props.navigation.navigate('AddParcelDetails', {
          source: sourceObj,
          destination: destinationObj,
          distance: distance,
          selectedVehicleData: selectedVehicleTypeData,
          vehicle_type: vehicleType,
          price: orderPrice,
          weight: weight.value,
          dimensions: dimensions.value,
          width: width.value,
          height: height.value,
        });
      } else {
        props.navigation.navigate('Auth');
      }
    });
  };

  const handleSearchBtnClick = async() => {
    if (
      source.length !== 0 &&
      destination.length !== 0 &&
      weight.value.length !== 0 &&
      weight.value > 0 &&
      selectedVehicleTypeData
    ) {
      let _distance = await fetchDistanceBetweenPoints(
        sourceLatLong.latitude,
        sourceLatLong.longitude,
        destinationLatLong.latitude,
        destinationLatLong.longitude,
      );
      if(_distance){
        setDistance(_distance);
        let _price = await calculatePrice(_distance, selectedVehicleTypeData);
        openAddParcelDetailsScreen(_price);
      }
    } else {
      if (source.length == 0) {
        Alert.alert('', 'Please select pickup location.');
      } else if (destination.length == 0) {
        Alert.alert('', 'Please select destination location.');
      } else if (weight.value.length == 0) {
        Alert.alert('', 'Please fill weight value.');
      } else if (weight.value <= 0) {
        Alert.alert('', 'Please fill weight value more then 0.');
      } else if (!selectedVehicleTypeData) {
        Alert.alert('', 'Please select vehicle type.');
      } else {
        Alert.alert('', 'Please fill required details.');
      }
    }
  };

  const handlePayNowBtnClick = async() => {
    setIsLoading(true);
    let rp_orderRes = await RazorpayCreateOrderApi(price); // amount should be passed in rupee
    
    if(!rp_orderRes && !rp_orderRes?.id){
      setIsLoading(false);
      Alert.alert('Something went wrong! Please try again later.');
      return;
    }

    //razorpay payment dashboard
    let options = {
      ...razorpayPreOptions,
      amount: rupeeToPaisa(price),
      order_id: __DEV__ ? '' : rp_orderRes?.id ?? '',
      prefill: {
        email: userProfileData?.email,
        contact: userProfileData?.phone_number,
        name: `${userProfileData?.first_name} ${userProfileData?.last_name}`,
      },
    };
    
    RazorpayCheckout.open(options)
      .then(data => {
        setIsLoading(false);
        // console.log((`Success: ${data.razorpay_payment_id}`));
        if (data?.razorpay_payment_id) {
          let _obj = {
            is_paymentReceived: true,
            payment_mode: paymentMode?.value,
            payment_details: {...data},
          };
          updateOrderDetail_fs(activeOrder?.id, _obj).then(() => {
            setPaymentDetails({status: 'success', ...data});
          });
        } else {
          setPaymentDetails({status: 'error'});
        }
      })
      .catch(error => {
        console.log('RazorpayCheckout.error: ', error);
        if(error?.error?.source == "customer" && error?.error?.reason == "payment_cancelled"){
          Alert.alert('You have cancelled the payment.');
        } else{
          Alert.alert('Something went wrong! Please try again later.');
        }
        setIsLoading(false);
      });
  };

  

  const handlePaymentSelection = item => {
    // console.log('payment selected: ', item);
    if (item?.name === paymentOptionsArr[0]?.name) {
      // when selecting "COD" payment option
      updateOrderDetail_fs(activeOrder?.id, {payment_mode: item?.value}).then(
        () => {
          setPaymentMode(item);
          setShowPaymentOptions(!showPaymentOptions);
        },
      );
    } else {
      setPaymentMode(item);
      setShowPaymentOptions(!showPaymentOptions);
    }
  };

  const showAssignedDetails = () => {
    const transporter_details = _assignedDetails?.transporter_details;
    const driver_details = _assignedDetails?.driver_details;
    const vehicle_details = _assignedDetails?.vehicle_details;
    if (_assignedDetails) {
      return (
        <View style={{}}>
          {transporter_details &&
          !transporter_details?.transporter_as_driver ? (
            <>
              <Text style={styles.sectionTitleText}>Transporter Details</Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 6,
                }}
              >
                {transporter_details?.transporter_photo ? (
                  <Image
                    source={{
                      uri: transporter_details?.transporter_photo,
                    }}
                    style={styles.tranporterImg}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={require('../../../assets/assets/default_user.png')}
                    style={styles.tranporterImg}
                    resizeMode="contain"
                  />
                )}
                <View style={{paddingHorizontal: 12}}>
                  <Text>
                    {transporter_details?.first_name}{' '}
                    {transporter_details?.last_name}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{position: 'absolute', right: 0}}
                  onPress={() =>
                    Linking.openURL(
                      `tel:+91${transporter_details?.phone_number}`,
                    )
                  }
                >
                  <MaterialCommunityIcons
                    name={'phone'}
                    size={28}
                    color={'grey'}
                    style={{
                      marginHorizontal: 4,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </>
          ) : null}

          <Text style={styles.sectionTitleText}>Driver Details</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: WidthPercentage(100) - 24,
            }}
          >
            {driver_details?.driver_photo ? (
              <Image
                source={{
                  uri: driver_details?.driver_photo,
                }}
                style={styles.tranporterImg}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={require('../../../assets/assets/default_user.png')}
                style={styles.tranporterImg}
                resizeMode="contain"
              />
            )}
            <View style={{paddingHorizontal: 12}}>
              <Text>
                {driver_details?.first_name} {driver_details?.last_name}
              </Text>
              <Text>{vehicle_details?.vehicle_number}</Text>
            </View>
            <TouchableOpacity
              style={{position: 'absolute', right: 0}}
              onPress={() =>
                Linking.openURL(`tel:+91${driver_details?.phone_number}`)
              }
            >
              <MaterialCommunityIcons
                name={'phone'}
                size={28}
                color={'grey'}
                style={{
                  marginHorizontal: 4,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  const assigningTransLoader = () => {
    return (
      <View
        style={{
          flex: 1,
          paddingHorizontal: 12,
          alignItems: 'center',
        }}
      >
        <>
          <ActivityIndicator
            color={Colors.primaryColor}
            animating={isSocketResLoading}
            size="small"
          />
          <Text style={{marginTop: 4, color: Colors.primaryColor}}>
            Finding Transporter...
          </Text>
        </>
      </View>
    );
  };

  const noTransporterFoundView = () => {
    return (
      <View
        style={{
          paddingHorizontal: 12,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            marginTop: 4,
            color: Colors.rejectedColor,
            fontWeight: 'bold',
            fontSize: 14,
          }}
        >
          No transporter found.
        </Text>
      </View>
    );
  };

  const handleTryAgainBtnClick = () => {
    setPaymentDetails(null);
  };

  const showPaymentStatusView = () => {
    const ispaymentSuccess =
      paymentDetails?.status.toLowerCase() === 'success'.toLowerCase()
        ? true
        : false;
    const src = ispaymentSuccess
      ? require('../../../assets/assets/transactionSuccess.png')
      : require('../../../assets/assets/transactionFailed.png');
    const statusTxt = ispaymentSuccess
      ? 'Payment Successful!'
      : 'Payment Failed!';
    const statusDescTxt = ispaymentSuccess
      ? `Transaction Id is ${paymentDetails?.razorpay_payment_id}`
      : `You can try again or choose to pay with Cash(Cash on Delivery).`;
    return (
      <View
        style={{
          paddingHorizontal: 12,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={src}
          style={styles.paymentStatusImg}
          resizeMode="contain"
        />
        <Text
          style={{
            marginTop: 4,
            fontWeight: 'bold',
            fontSize: 14,
          }}
        >
          {statusTxt}
        </Text>
        <Text
          style={{
            marginTop: 4,
            fontWeight: 'bold',
            fontSize: 14,
          }}
        >
          {statusDescTxt}
        </Text>
        {!ispaymentSuccess ? (
          <TouchableOpacity
            style={styles.buttonView}
            onPress={() => handleTryAgainBtnClick()}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  // ---------- pins screen methods

  // Function to animate map to new marker position
  const animateToPosition = coords => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.0042,
          longitudeDelta: 0.0042,
        },
        1000, // animation duration in milliseconds
      );
    }
  };

  // On mount, set initial pickup location to user's current location
  useEffect(() => {
    const setInitialLocation = async () => {
      const hasPermission = await hasLocationPermission();
      if (!hasPermission) return;
      try {
        const location = await handleCheckLocationGPSOn();
        if (location && location.latitude && location.longitude) {
          const coords = {
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
          };
          setSourceLatLong(coords);
          fetchGeoCodingAddressFromCoordinates(coords, 'source');
        } else {
          // fallback to previous logic if location not available
          fetchGeoCodingAddressFromCoordinates(sourceLatLong, 'source');
        }
      } catch (err) {
        // fallback to previous logic if error
        fetchGeoCodingAddressFromCoordinates(sourceLatLong, 'source');
      }
    };
    setInitialLocation();
  }, []);

  const handleCrossClick = async () => {
    const checkLocationPermission = await hasLocationPermission();
    if (!checkLocationPermission) {
      return;
    }
    return new Promise(async (resolve, reject) => {
      handleCheckLocationGPSOn()
        .then(res => {
          setIsLoading(false);
          if (res) {
            let _res = {
              latitude: parseFloat(res?.latitude),
              longitude: parseFloat(res?.longitude),
            };
            if (step == 0) {
              fetchGeoCodingAddressFromCoordinates(_res, 'source');
            } else if (step == 1) {
              fetchGeoCodingAddressFromCoordinates(_res, 'destination');
            }
          } else {
            setIsLoading(false);
            // handleCrossClick();
          }
        })
        .catch(err => {
          setIsLoading(false);
          const {code, message} = err;
          console.warn(code, message);
          Alert.alert(message);
        });
    });
  };

  const fetchGeoCodingAddressFromCoordinates = async (_coordinates, type) => {
    setIsPinAddressLoading(true);
    try {
      const response = await Geocoder.from(
        _coordinates.latitude,
        _coordinates.longitude,
      );

      const geoCodeResult = response.results[0];
      const addressComponents = geoCodeResult.address_components;

      // Use formatted_address for full address
      const fullAddress = geoCodeResult.formatted_address || '';

      setIsPinAddressLoading(false);

      const getComponent = (types) => {
        const found = addressComponents.find(c =>
          types.some(type => c.types.includes(type))
        );
        return found?.long_name || '';
      };
      const area = getComponent([
        'sublocality_level_1',
        'sublocality',
        'neighborhood',
        'locality'
      ]);
      const district = getComponent(['administrative_area_level_2', /* 'locality' */]);
      const pincode = getComponent(['postal_code']);
      const state = getComponent(['administrative_area_level_1']);
      const country = getComponent(['country']);

      const addressPayload = {
        place_id: geoCodeResult?.place_id,
        area,
        city: district,
        state,
        country,
        pincode,
        coordinates: _coordinates,
        fullAddress,
      };

      if (type === 'source') {
        setSourceLatLong(_coordinates);
        setSource(fullAddress);
        animateToPosition(_coordinates);
        dispatch(addressSetActions.setSourceAddressValue(addressPayload));
      } else {
        setDestinationLatLong(_coordinates);
        setDestination(fullAddress);
        animateToPosition(_coordinates);
        dispatch(destinationSetActions.setDestinationAddressValue(addressPayload));
      }
    } catch (error) {
      setIsPinAddressLoading(false);
      console.error('Geocoding error: ', error);
    }
  };

  const handleMarkerDrag = async (e, type) => {
    let _coordinates = e.nativeEvent.coordinate;
    fetchGeoCodingAddressFromCoordinates(_coordinates, type);
  };

  const handleCurrentLocationBtnClick = () => {
    setIsLoading(true);
    handleCrossClick();
  };

  const handleChangeBtnClick = (changeType) => {
    setChangeAddressType(changeType);
    setShowChangeAddressModal(true);
  };

  const handleAddmoreBtnClick = () => {
    if (step == 0 || step == 1) {
      setShowCompleteAddressModal(true);
    } 
  };

  const handleGooglePlacesSearchTxtInput = (data, addressType = null) => {
    const {lat, lng, address} = data;
    if (step == 0) {
      fetchGeoCodingAddressFromCoordinates(
        {latitude: lat, longitude: lng},
        'source',
      );
    } else if (step == 1) {
      fetchGeoCodingAddressFromCoordinates(
        {latitude: lat, longitude: lng},
        'destination',
      );
    }

    // when clicked on "Change"
    if(changeAddressType == 'source'){
      fetchGeoCodingAddressFromCoordinates(
        {latitude: lat, longitude: lng},
        'source',
      );
      setShowChangeAddressModal(false);
      setStep(0); // to show "confirm Pickup location btn"
    } else if(changeAddressType == 'destination') {
      fetchGeoCodingAddressFromCoordinates(
        {latitude: lat, longitude: lng},
        'destination',
      );
      setShowChangeAddressModal(false);
      setStep(1); // to show "confirm Destination location btn"
    }
  };

  const isInputValid = () => {
    let isValid = true;
    if (!flatOrBuildingInfo || flatOrBuildingInfo.length <= 0) {
      isValid = false;
      setFlatOrBuildingInfo({
        ...flatOrBuildingInfo,
        error: 'Please enter Flat / House no / Floor / Building.',
      });
    }
    return isValid;
  };

  const handleConfirmBtn = () => {
    if (isInputValid()) {
      const addressParts = [flatOrBuildingInfo?.value, landmark.value].filter(Boolean);
      const joinedAddress = addressParts.join(', ');
      if (step == 0) {
        setPickupFlatMark(joinedAddress);
        setStep(1);
        setSource(source.replace(/^/, joinedAddress ? `${joinedAddress}, ` : ''));
        dispatch(
          addressSetActions.setSourceAddressValue({
            flatName: joinedAddress,
          }),
        );
      } else if (step == 1) {
        setDropFlatMark(joinedAddress);
        setStep(2);
        setDestination(destination.replace(/^/, joinedAddress ? `${joinedAddress}, ` : ''));
        dispatch(
          destinationSetActions.setDestinationAddressValue({
            flatName: joinedAddress,
          }),
        );
      }

      setShowCompleteAddressModal(false);
      setFlatOrBuildingInfo({value: '', error: ''});
      setLandmark({value: '', error: ''});
    }
  };

  const showPinAddressView = () => {
    return (
      <View /* style={styles.addressesInfoContainer} */>
        <View style={styles.rowView}>
          <FastImage
            style={{...styles.pickupImage, marginEnd: 10}}
            source={images.pickupPin}
            resizeMode="contain"
          />
          <View style={{flex: 0.8}}>
            <Text style={{...styles.titleTxt, marginBottom: 2}}>
              Your pickup point
            </Text>
            {source ? (
              <Text style={{...styles.subTitleTxt, opacity: 0.6}}>
                {source}
              </Text>
            ) : (
              <ActivityIndicator
                color={Colors.primaryColor}
                animating={isPinAddressLoading}
                size="small"
              />
            )}
          </View>
          <TouchableOpacity
            style={{position: 'absolute', right: 0, top: 12}}
            onPress={() => handleChangeBtnClick('source')}
          >
            <Text
              style={{
                ...styles.titleTxt,
                fontFamily: 'SofiaPro-SemiBold',
                color: Colors.primaryColor,
              }}
            >
              Change
            </Text>
          </TouchableOpacity>
        </View>

        {step != 0 ? (
          <View style={styles.rowView}>
            <FastImage
              style={{...styles.pickupImage, marginEnd: 10}}
              source={images.dropPin}
              resizeMode="contain"
            />
            <View style={{flex: 0.8}}>
              <Text style={{...styles.titleTxt, marginBottom: 2}}>
                Your drop point
              </Text>
              {destination ? (
                <Text style={{...styles.subTitleTxt, opacity: 0.6}}>
                  {destination}
                </Text>
              ) : (
                <ActivityIndicator
                  color={Colors.primaryColor}
                  animating={isPinAddressLoading}
                  size="small"
                />
              )}
            </View>
            <TouchableOpacity
              style={{position: 'absolute', right: 0, top: 12}}
              onPress={() => handleChangeBtnClick('destination')}
            >
              <Text
                style={{
                  ...styles.titleTxt,
                  fontFamily: 'SofiaPro-SemiBold',
                  color: Colors.primaryColor,
                }}
              >
                Change
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {step !== 2 ? (
          <TouchableOpacity
            style={styles.confirmLocationBtnView}
            onPress={() => handleAddmoreBtnClick()}
          >
            <Text style={styles.buttonText}>
              {`${
                step == 2
                  ? `Confirm Location`
                  : `Add more ${step == 0 ? `pickup` : `drop`} point details`
              }`}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <CHeader navigation={props.navigation} isBackgroundTransparent={true} isBackBtn={true} /> */}

      <MapView
        ref={mapRef}
        style={{
          // dynamically dependent on initially opening of bottomSheet sanpPoint percent
          height: Dimensions.get('window').height - (Dimensions.get('window').height *parseInt(snapPoints[0].split('%')[0])) / 100 + 8,
        }}
        // showsMyLocationButton={true}
        // showsUserLocation={true}
        initialRegion={{
          ...sourceLatLong,
          latitudeDelta: 0.0042,
          longitudeDelta: 0.0042,
        }}
      >
        <Marker
          key={'pick'}
          draggable={!upperSlider ? true : false}
          onDragEnd={e => handleMarkerDrag(e, 'source')}
          coordinate={sourceLatLong}
        >
          <View
            style={{
              ...styles.container,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{...styles.markerTitleTxt, color: Colors.blueColor}}>
              {`Your pickup location ${!upperSlider ? `will be` : `is` } here ${!upperSlider ? `\nMove pin to your exact location` : `` }`}
            </Text>
            <FastImage
              source={images.pickupPin}
              style={{width: 40, height: 40}}
              resizeMode="contain"
            />
          </View>
        </Marker>

        {step != 0 ? (
          <Marker
            key={'drop'}
            coordinate={destinationLatLong}
            draggable={!upperSlider ? true : false}
            onDragEnd={e => handleMarkerDrag(e, 'destination')}
          >
            <View
              style={{
                ...styles.container,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{...styles.markerTitleTxt, color: Colors.blueColor}}>
                {`Your drop location ${!upperSlider ? `will be` : `is` } here ${!upperSlider ? `\nMove pin to your exact location` : `` }`}
              </Text>
              <FastImage
                source={images.dropPin}
                style={{width: 40, height: 40}}
                resizeMode="contain"
              />
            </View>
          </Marker>
        ) : null}

      {(sourceLatLong && destinationLatLong &&
        sourceLatLong.latitude !== 0 && sourceLatLong.longitude !== 0 &&
        destinationLatLong.latitude !== 0 && destinationLatLong.longitude !== 0) ? (
        <MapViewDirections
          origin={sourceLatLong}
          destination={destinationLatLong}
          apikey={AppConstants.google_place_api_key}
          strokeWidth={4}
          strokeColor={Colors.accentColor}
          onError={errorMessage => {
            console.log(`errorMessage:`, errorMessage);
          }}
        />
      ) : null}
      </MapView>

      <TouchableOpacity
        activeOpacity={0.7}
        style={{position: 'absolute', top: 16, left: 16, zIndex: 99}}
        onPress={() => props.navigation.goBack()}
      >
        <FastImage
          style={styles.menuImage}
          source={require('../../../assets/assets/Authentication/back.png')}
        />
      </TouchableOpacity>

      {!upperSlider ? (
        <View 
          style={{ 
            ...styles.searchAddressContainer,
            position: 'absolute',
            top: 66,
            left: 16,
            zIndex: 99
          }}
        >
          <FastImage
            style={styles.searchIconStyle}
            source={images.searchIconImg}
            resizeMode="contain"
          />
          <GooglePlacesSearchTxtInput
            placeholder="Search for area, street name..."
            customStyles={{
              textInputContainer: {
                height: 45,
                borderRadius: 10,
              },
              textInput: {
                height: 45,
                color: Colors.textColor,
                fontSize: RFPercentage(2),
                fontFamily: 'SofiaPro-Regular',
                // backgroundColor: Colors.subViewBGColor,
                borderRadius: 10,
              },
            }}
            onSelectLocation={data => handleGooglePlacesSearchTxtInput(data)}
          />
        </View>
      ) : null}

      {!upperSlider ? (
        <TouchableOpacity
          style={{
            ...styles.currentLocationBtn,
            top:
              Dimensions.get('window').height -
              (Dimensions.get('window').height *
                parseInt(snapPoints[0].split('%')[0])) /
                100 -
              52,
          }}
          onPress={() => handleCurrentLocationBtnClick()}
        >
          <MaterialCommunityIcons
            name={'crosshairs-gps'}
            size={18}
            color={Colors.primaryColor}
          />
          <Text
            style={{
              ...styles.subTitleTxt,
              color: Colors.primaryColor,
              marginStart: 6,
            }}
          >
            Use current location
          </Text>
        </TouchableOpacity>
      ) : null}

      <BottomSheet
        ref={bottomSheetRef}
        index={0} // 0 means open initially, -1 means closed
        // style={styles.bottomSheetContainer}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose={false}
        keyboardBehavior={'interactive'}
        keyboardBlurBehavior={'restore'}
        android_keyboardInputMode={'adjustResize'}
      >
        <BottomSheetScrollView
          showsVerticalScrollIndicator={
            false
          }
        >
          {upperSlider ? (
            <View style={styles.upperTrackingView}>
              <View style={{ ...styles.rowView, paddingHorizontal: 12 }}>
                <FastImage
                  style={{...styles.pickupImage, marginEnd: 10}}
                  source={images.pickupPin}
                  resizeMode="contain"
                />
                <View style={{flex: 0.8}}>
                  <Text style={{...styles.titleTxt, marginBottom: 2}}>
                    Your pickup point
                  </Text>
                  {source ? (
                    <Text style={{...styles.subTitleTxt, opacity: 0.6}}>
                      {source}
                    </Text>
                  ) : (
                    <ActivityIndicator
                      color={Colors.primaryColor}
                      animating={isPinAddressLoading}
                      size="small"
                    />
                  )}
                </View>
              </View>

              <View style={{ ...styles.rowView, paddingHorizontal: 12 }}>
                <FastImage
                  style={{...styles.pickupImage, marginEnd: 10}}
                  source={images.dropPin}
                  resizeMode="contain"
                />
                <View style={{flex: 0.8}}>
                  <Text style={{...styles.titleTxt, marginBottom: 2}}>
                    Your drop point
                  </Text>
                  {destination ? (
                    <Text style={{...styles.subTitleTxt, opacity: 0.6}}>
                      {destination}
                    </Text>
                  ) : (
                    <ActivityIndicator
                      color={Colors.primaryColor}
                      animating={isPinAddressLoading}
                      size="small"
                    />
                  )}
                </View>
              </View>

              {source &&
                source?.length !== 0 &&
                destination &&
                destination?.length !== 0 &&
                weight &&
                weight?.value?.length !== 0 &&
                upperSlider && (
                  <View /* style={styles.transporterListsContainer} */>
                    {/* <View style={styles.panelHandle} /> */}
                    <View style={{paddingVertical: 6}}>
                      <View style={styles.flexRowView}>
                        <Text style={styles.titleTxt}>Total Distance</Text>
                        <Text style={styles.subTitleTxt}>{`${distance} km`}</Text>
                      </View>
                    </View>

                    <View>
                      <View style={{paddingHorizontal: 12}}>
                        <View style={styles.transporterInfoContainer}>
                          {
                            /* _assignedDetails &&  */ !isSocketResLoading
                              ? showAssignedDetails()
                              : assigningTransLoader()
                          }

                          {searchResMsg ? (
                            <>
                              <View style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                <Text
                                  style={{
                                    ...styles.sectionTitleText,
                                    paddingVertical: 0,
                                    fontWeight: 'normal',
                                    color: Colors.rejectedColor,
                                    textAlign: 'center',
                                    width: '100%',
                                  }}
                                >
                                  {`${searchResMsg}`}
                                </Text>
                                {isRetryVisible && (
                                  <TouchableOpacity
                                    style={{
                                      marginTop: 10,
                                      marginBottom: 10,
                                      paddingVertical: 8,
                                      paddingHorizontal: 20,
                                      backgroundColor: Colors.buttonColor,
                                      borderRadius: 24,
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      shadowColor: '#000',
                                      shadowOffset: { width: 0, height: 2 },
                                      shadowOpacity: 0.25,
                                      shadowRadius: 4,
                                      elevation: 2,
                                    }}
                                    onPress={() => {
                                      setIsRetryVisible(false);
                                      setSearchResMsg(null);
                                      setIsSocketResLoading(true);
                                      if (_objFromParams) {
                                        socketIo.sendEvent(_objFromParams.event, _objFromParams);
                                      }
                                    }}
                                  >
                                    <MaterialCommunityIcons
                                      name={'refresh'}
                                      size={20}
                                      color={Colors.backgroundColor}
                                      style={{marginRight: 8}}
                                    />
                                    <Text style={{color: Colors.backgroundColor, fontFamily: 'SofiaPro-SemiBold', fontSize: 16}}>Retry</Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            </>
                          ) : null}
                        </View>

                        {selectedVehicleTypeData && (
                          <View style={styles.vehicleTypeInfoContainer}>
                            {selectedVehicleTypeData?.data &&
                            selectedVehicleTypeData?.data.icon ? (
                              <Image
                                style={styles.transporterVehicleTypeImg}
                                resizeMode="contain"
                                source={{
                                  uri: selectedVehicleTypeData?.data.icon,
                                }}
                              />
                            ) : (
                              <Image
                                source={require('../../../assets/assets/dashboard/bike.png')}
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: 15,
                                }}
                                resizeMode="contain"
                              />
                            )}
                            <View style={{paddingHorizontal: 12}}>
                              <Text style={styles.vehicleNameText}>
                                {selectedVehicleTypeData?.data?.vehicle_type ||
                                  'Vehicle Type'}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>

                      <View style={{ ...styles.flexRowView, marginTop: 12 }}>
                        <Text style={styles.titleTxt}>Price</Text>
                        <Text style={styles.subTitleTxt}>{`₹ ${price}(Approx.)`}</Text>
                      </View>

                      {/* <PriceView price={price} showPaymentMode={true} /> */}

                      {!paymentDetails ? (
                        <>
                          {_assignedDetails ? 
                            <View style={{ ...styles.flexRowView, alignItems: 'center' }}>
                              <Text style={styles.titleTxt}>Payment mode</Text>
                              <View style={styles.paymentModeContainer}>
                                <Menu
                                  visible={showPaymentOptions}
                                  anchor={
                                    <TouchableOpacity
                                      style={styles.selectionContainer}
                                      onPress={() =>
                                        setShowPaymentOptions(!showPaymentOptions)
                                      }
                                    >
                                      <MaterialCommunityIcons
                                        name={'chevron-down'}
                                        size={24}
                                        color={'grey'}
                                        style={{
                                          marginHorizontal: 4,
                                        }}
                                      />
                                      <Text style={styles.txt}>
                                        {paymentMode?.name}
                                      </Text>
                                    </TouchableOpacity>
                                  }
                                  onRequestClose={() =>
                                    setShowPaymentOptions(!showPaymentOptions)
                                  }
                                >
                                  {paymentOptionsArr.map((item, index) => {
                                    return (
                                      <MenuItem
                                        style={styles.modalTxt}
                                        onPress={() => handlePaymentSelection(item)}
                                      >
                                        {item?.name}
                                      </MenuItem>
                                    );
                                  })}
                                </Menu>
                              </View>
                            </View> : null
                          }
                          {paymentMode?.name !== 'Cash' && _assignedDetails ? (
                            <CPrimaryButton btnTitle={'Pay Now'} onPress={() => handlePayNowBtnClick()} />
                          ) : null }
                        </>
                      ) : (
                        showPaymentStatusView()
                      )}
                    </View>
                  </View>
                )}
            </View>
          ) : (
            <View style={styles.trackingView}>
              {showPinAddressView()}

              {step == 2 ? (
                <>
                  <View style={{paddingStart: 30}}>
                    <View style={styles.viewInputText}>
                      <TextInput // BottomSheetTextInput inherits TextInputProps from react-native.
                        style={styles.weightInputText}
                        placeholder="Weight"
                        returnKeyType="next"
                        value={weight.value}
                        onChangeText={text => {
                          handleFilter(text);
                        }}
                        error={!!weight.error}
                        errorText={weight.error}
                        autoCapitalize="none"
                        autoCompleteType="name"
                        textContentType="name"
                        keyboardType="decimal-pad"
                        ref={ref => {
                          // this._weightinput = ref;
                        }}
                        onSubmitEditing={() => {
                          // this._dimensioninput && this._dimensioninput.focus()
                        }}
                      />
                      <View style={styles.lineView} />
                      <View style={styles.viewKG}>
                        <Text style={styles.textKG}>Tons</Text>
                      </View>
                    </View>

                    {/* <View>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={{marginTop: 12}}
                        onPress={() => handleAddLocationWGoogleMapClick()}
                      >
                        <Text
                          style={{
                            fontSize: RFPercentage(2),
                            fontFamily: 'SofiaPro-SemiBold',
                            color: Colors.rejectedColor,
                          }}
                        >
                          + Add location with google map
                        </Text>
                      </TouchableOpacity>
                    </View> */}

                    <View style={{marginLeft: 0}}>
                      <Text style={styles.vehicleText}>Select Vehicle</Text>
                      {weight.value != ''
                        ? vehicleTypeSearchList &&
                          vehicleTypeSearchList.length != 0
                          ? showVehicleList()
                          : showNoVehiclesTypeView()
                        : vehicleTypeList && vehicleTypeList.length != 0
                        ? showVehicleList()
                        : showNoVehiclesTypeView()}
                    </View>

                    <View style={styles.dimentionView}>
                      <View style={styles.dimensionsContainer}>
                        <Text style={styles.dimensionsTxt}>
                          {dimensions.value || 'Length'}
                          {dimensions.value ? (
                            <Text style={styles.dimensionsUnitTxt}> ft.</Text>
                          ) : null}
                        </Text>
                      </View>

                      <Text
                        style={{...styles.textKG, color: Colors.subViewBGColor}}
                      >
                        X
                      </Text>

                      <View style={styles.dimensionsContainer}>
                        <Text style={styles.dimensionsTxt}>
                          {width.value || 'Width'}
                          {width.value ? (
                            <Text style={styles.dimensionsUnitTxt}> ft.</Text>
                          ) : null}
                        </Text>
                      </View>

                      <Text
                        style={{...styles.textKG, color: Colors.subViewBGColor}}
                      >
                        X
                      </Text>

                      <View style={styles.dimensionsContainer}>
                        <Text style={styles.dimensionsTxt}>
                          {height.value || 'Height'}
                          {height.value ? (
                            <Text style={styles.dimensionsUnitTxt}> ft.</Text>
                          ) : null}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* <TouchableOpacity
                    style={styles.buttonView}
                    onPress={() => handleSearchBtnClick()}
                  >
                    <Text style={styles.buttonText}>SEARCH</Text>
                  </TouchableOpacity> */}
                  <CPrimaryButton btnTitle={'Search'} onPress={() => handleSearchBtnClick()} />
                </>
              ) : null}
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheet>

      <CModal visible={showCompleteAddressModal} isBottomModal={true} onClose={() => setShowCompleteAddressModal(false)}>
        <CCompleteAddressModal
          modalTitle={`Enter complete ${step == 0 ? `pickup` : `drop`} point`}
          btnTitle={`Confirm ${step == 0 ? `pickup` : `drop`} location`}
          show={showCompleteAddressModal}
          onClose={() => setShowCompleteAddressModal(false)}
          pin_address={step == 0 ? source : destination}
          pickup_address={flatOrBuildingInfo}
          onChangePickup_addressTxt={txt =>
            setFlatOrBuildingInfo({value: txt, error: ''})
          }
          landmark={landmark}
          onChangeLandmarkTxt={txt => setLandmark({value: txt, error: ''})}
          handleConfirmLocationBtnClick={() => handleConfirmBtn()}
        />
      </CModal>

      <CModal visible={showChangeAddressModal} isBottomModal={true} onClose={() => setShowChangeAddressModal(false)}>
        <View style={styles.modalSubContainer}>
          <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 14 }} onPress={() => setShowChangeAddressModal(false)}>
            <FastImage style={{ width: 25, height: 25 }} source={images.closeIconImg} resizeMode='contain' />
          </TouchableOpacity>

          <View style={styles.searchAddressContainer}>
            <FastImage
              style={styles.searchIconStyle}
              source={images.searchIconImg}
              resizeMode="contain"
            />
            <GooglePlacesSearchTxtInput
              placeholder="Search for area, street name..."
              customStyles={{
                textInputContainer: {
                  height: 45,
                  borderRadius: 10,
                },
                textInput: {
                  height: 45,
                  color: Colors.textColor,
                  fontSize: RFPercentage(2),
                  fontFamily: 'SofiaPro-Regular',
                  // backgroundColor: Colors.subViewBGColor,
                  borderRadius: 10,
                },
              }}
              onSelectLocation={data => handleGooglePlacesSearchTxtInput(data)}
            />
          </View>
        </View>
      </CModal>

      <LargeImage
        showLargeImage={isShowLargeImage}
        onClosePressed={() => {
          setIsShowLargeImage(false);
        }}
        vehicleData={longPressedData}
      />

      <Loader loading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalSubContainer: {
    flex: 0.5,
    // justifyContent: 'flex-end',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 24,
    backgroundColor: Colors.backgroundColor,
  },
  transporterListsContainer: {
    width: WidthPercentage(100),
    paddingVertical: 12,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'white',
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 40,
    width: 40,
  },
  searchAddressContainer: {
    flexDirection: 'row',
    width: windowWidth - 32,
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 12,
    borderColor: Colors.grey,
    borderWidth: 1,
    /* position: 'absolute',
    top: 66,
    left: 16,
    zIndex: 99, */
  },
  searchIconStyle: {
    height: 20,
    width: 20,
  },
  viewHeaderRight: {
    paddingRight: 16,
  },
  mapStyle: {
    height:
      Dimensions.get('window').height -
      (Dimensions.get('window').height * 25) / 100,
    // zIndex: 9
  },
  bottomSheetContainer: {
    // flex: 1,
    width: windowWidth,
    height: Dimensions.get('window').height,
    // backgroundColor: Colors.backgroundColor,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    position: 'absolute',
    bottom: 0,
    // zIndex: 99,
  },
  callout: {
    backgroundColor: 'white',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    // padding: 4
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.titleTextColor,
  },
  currentLocationBtn: {
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.backgroundColor,
    marginStart: 8,
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderColor: Colors.primaryColor,
    borderWidth: 1,
    borderRadius: 8,
  },
  titleTxt: {
    fontFamily: 'SofiaPro-Bold',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
  },
  subTitleTxt: {
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
  },
  markerTitleTxt: {
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-SemiBold',
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.titleTextColor,
  },
  markerFixed: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Dimensions.get('window').height / -2.0,
  },
  marker: {
    height: 48,
    width: 48,
    resizeMode: 'contain',
  },
  trackingView: {
    // flex: 1,
    // top: 64,
    // position: 'absolute',
    width: '100%',
    paddingHorizontal: 12,
    backgroundColor: Colors.backgroundColor,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
  upperTrackingView: {
    // flex: 1,
    // position: 'absolute',
    // top: 64,
    // width: '100%',
    // alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: Colors.backgroundColor,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
  addressesInfoContainer: {
    // flex: 1,
    marginTop: -8,
    paddingHorizontal: 12,
    backgroundColor: Colors.backgroundColor,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  rowView: {
    /* flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 0,
    // margin: 16,
    marginBottom: -8,
    alignItems: 'center', */
    flexDirection: 'row',
    paddingVertical: 2,
    marginVertical: 8,
    paddingHorizontal: 0,
  },
  pickupImage: {
    height: 30,
    width: 20,
  },
  viewInputText: {
    marginTop: 16,
    // marginHorizontal: 18,
    flexDirection: 'row',
    // width: windowWidth - 68,
    alignItems: 'center',
    // justifyContent: 'space-between',
    backgroundColor: Colors.subViewBGColor,
    borderRadius: 10,
  },
  weightInputText: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 16,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.titleTextColor,
    height: 45,
    // width: windowWidth - 150,
    // borderRadius: 5,
  },
  popupView: {
    margin: 16,
    marginLeft: 55,
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 45,
    backgroundColor: Colors.subViewBGColor,
    borderRadius: 5,
  },
  popupTextUnSelected: {
    marginLeft: 12,
    marginRight: 12,
    color: Colors.titleTextColor,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
  },
  popupTextSelected: {
    marginLeft: 12,
    marginRight: 12,
    color: 'darkgray',
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
  },
  contectMenu: {
    marginTop: 16,
    flexDirection: 'row',
  },
  contentContainerStyle: {
    flex: 1,
    paddingHorizontal: 16,
    // marginLeft: 55,
    backgroundColor: Colors.backgroundColor,
  },
  header: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    paddingVertical: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  panelHandle: {
    width: 35,
    height: 3,
    marginBottom: 8,
    backgroundColor: Colors.subViewBGColor,
    borderRadius: 4,
    alignSelf: 'center',
  },
  item: {
    flexDirection: 'row',
    // alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    // marginVertical: 8,
  },
  sectionTitleText: {
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
    fontWeight: '700',
    paddingVertical: 4,
  },
  traspoterText: {
    marginLeft: 8,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(1.5),
    color: Colors.textColor,
  },
  deliveryText: {
    marginLeft: 8,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.8),
    color: Colors.subTitleTextColor,
  },
  priceView: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  priceText: {
    // padding: 8,
    // paddingTop: 0,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
  },
  vehicleText: {
    marginTop: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.8),
    color: '#9DA4BB',
  },
  noVehicleText: {
    marginTop: 16,
    marginBottom: 24,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
  },
  lineView: {
    width: 1,
    height: 45,
    backgroundColor: Colors.subViewBGColor,
  },
  viewKG: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textKG: {
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: '#9DA4BB',
  },
  dimentionView: {
    marginTop: 0,
    marginBottom: 16,
    // marginLeft: 55,
    flexDirection: 'row',
    width: windowWidth - 68,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  dimensionsContainer: {
    height: 45,
    width: windowWidth / 3 - 48,
    backgroundColor: Colors.subViewBGColor,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexRowView: {
    width: WidthPercentage(100),
    flexDirection: 'row',
    // alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: Colors.backgroundColor,
  },
  distanceText: {
    // paddingLeft: 16,
    // paddingRight: 16,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
  },
  itemImage: {
    height: 50,
    width: 60,
    // marginLeft: 16,
    // resizeMode: 'contain',
    borderRadius: 10,
  },
  itemRow: {
    flex: 1,
    alignItems: 'center',
  },
  seperateLine: {
    backgroundColor: Colors.subViewBGColor,
    height: 1,
    marginTop: 16,
    marginBottom: 16,
    marginLeft: -16,
    marginRight: -16,
  },
  upperPanelView: {
    marginTop: -16,
    height: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleView: {
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: '#9DA4BB',
    borderWidth: 0.5,
    height: 50,
    width: 50,
  },
  selectedVehicelView: {
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: '#9DA4BB',
    borderWidth: 0.5,
    height: 50,
    width: 50,
  },
  vehicleImage: {
    height: 45,
    width: 45,
    borderRadius: 5,
  },
  selectedVehicleIndicatorImage: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  vehicleNameText: {
    marginBottom: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.5),
    color: '#9DA4BB',
    textAlign: 'center',
  },
  confirmLocationBtnView: {
    marginVertical: 18,
    paddingHorizontal: 30,
    paddingVertical: 12,
    // width: 200,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Medium',
    backgroundColor: Colors.buttonColor,
    // height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 6,
  },
  buttonView: {
    margin: 16,
    width: 200,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Medium',
    backgroundColor: Colors.buttonColor,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 30,
  },
  buttonText: {
    fontFamily: 'SofiaPro-Medium',
    color: Colors.backgroundColor,
    fontSize: RFPercentage(2),
  },
  transporterInfoContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    borderColor: 'lightgrey',
    borderBottomWidth: 0.5,
    paddingBottom: 6,
  },
  vehicleTypeInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'lightgrey',
    borderBottomWidth: 0.5,
    paddingVertical: 6,
    marginVertical: 4,
  },
  tranporterImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  transporterVehicleTypeImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  //
  paymentStatusImg: {
    width: 40,
    height: 40,
    // borderRadius: 20,
  },
  paymentModeContainer: {
    width: WidthPercentage(50),
    marginTop: 0,
    // marginBottom: 2,
    paddingHorizontal: 12,
    justifyContent: 'flex-start',
  },
  headerTxt: {
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
    fontWeight: '700',
  },
  dimensionsTxt: {
    // fontFamily: 'SofiaPro-Regular',
    // fontSize: RFPercentage(1.5),
    // color: '#9DA4BB',
    // textAlign: 'center',
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.titleTextColor,
  },
  dimensionsUnitTxt: {
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.5),
    color: '#9DA4BB',
    textAlign: 'center',
  },
  modalTxt: {
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: 'white',
  },
  selectionContainer: {
    width: WidthPercentage(47),
    borderColor: 'grey',
    alignItems: 'center',
    borderWidth: 0.5,
    marginVertical: 4,
    padding: 6,
    // paddingVertical: 2,
    borderRadius: 22,
    // paddingHorizontal: 4,
    flexDirection: 'row',
  },
});

export default DashboardScreenNew;
