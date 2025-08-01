import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  Alert,
  Platform,
  PermissionsAndroid,
  BackHandler,
  SafeAreaView,
  Button,
  ToastAndroid,
  Linking,
} from 'react-native';
import {useSelector, useDispatch, connect} from 'react-redux';

// Import the Plugins and Thirdparty library.
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import Geolocation from '@react-native-community/geolocation';
import * as userListActions from '../../../store/actions/dashboard/userlist';
import * as filterTraspoterListActions from '../../../store/actions/dashboard/filterTranspoterList';
import * as getOrderHistoryDataActions from '../../../store/actions/customer/orderHistory/getOrderHistoryData';
// Import the JS file.
import Colors from '../../../helper/extensions/Colors';
import AppPreference from '../../../helper/preference/AppPreference';
import {NavigationActions, StackActions} from 'react-navigation';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import AppConstants from '../../../helper/constants/AppConstants';
import CHeader from '../../../components/CHeader';
import { useFocusEffect } from '@react-navigation/core';
// Load the main class.
let currentCount = 0;
const resetDashboardAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'DashboardScreen'})],
});

const resetNotificationAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'NotificationScreen'})],
});

const windowHeight = Dimensions.get('window').height;
const DashboardTrakingScreen = (props, {navigation}) => {
  const [getRegion, setGetRegion] = useState({
    latitude: 23.08571,
    longitude: 72.55132,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  const [source, setSource] = useState('');
  const [sourceLatLong, setSourceLatLong] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [destination, setDestination] = useState('');
  const [destinationLatLong, setDestinationLatLong] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [weight, setWeight] = useState({value: '', error: ''});
  const [dimensions, setDimensions] = useState({value: '', error: ''});
  const [vehicleType, setVehicleType] = useState('Vehicle Type');
  const [vehicleTypeFlag, setVehicleTypeFlag] = useState(true);
  const [trackingId, setTrackingId] = useState('');
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  const userDataList = useSelector(state => state.allUserData.allUserData);
  const sourceText = useSelector(
    state => state.setSourceTextValue.setSourceTextValue,
  );
  const sourceLatitude = useSelector(
    state => state.setSourceLatitude.setSourceLatitude,
  );
  const sourceLongitude = useSelector(
    state => state.setSourceLongitude.setSourceLongitude,
  );
  const destinationText = useSelector(
    state => state.setDestinationTextValue.setDestinationTextValue,
  );
  const destinationLatitude = useSelector(
    state => state.setDestinationLatitude.setDestinationLatitude,
  );
  const destinationLongitude = useSelector(
    state => state.setDestinationLongitude.setDestinationLongitude,
  );
  const filterDataList = useSelector(
    state => state.allFilterData.allFilterData,
  );

  const [notificationCount, setNotificationCount] = useState(props?.route?.params?.notificationCount ?? 0);
  // let notificationCount = props?.route?.params?.notificationCount || 0;

  const dispatch = useDispatch();

  const {fetchProfileData, userUID} = useSelector(
    state => state?.fetchProfileData,
  );

  const requestNotificationPermission = async () => {
    try {
      if (Platform.OS === 'android')
        PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS');
    } catch (err) {
      console.warn('requestNotificationPermission error: ', err);
    }
  };
  requestNotificationPermission();

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
  hasLocationPermission();

  useEffect(() => {
    AsyncStorage.getItem(AppPreference.NOTIFICATION_DATA).then(
      notificationData => {
        if (notificationData != null) {
          let notificationDataObj = JSON.parse(notificationData);
          console.log(
            'notification object',
            notificationDataObj,
            notificationData,
          );
          if (notificationDataObj.type == 'accept') {
            openOrderDetailsScreen(notificationDataObj.orderId);
          } else if (notificationDataObj.type == 'unloaded') {
            openOrderDetailsScreen(notificationDataObj.orderId);
          } else if (notificationDataObj.type == 'assign') {
            openOrderDetailsScreen(notificationDataObj.orderId);
          } else if (notificationDataObj.type == 'transporter_reject') {
            openOrderDetailsScreen(notificationDataObj.orderId);
          } else if (notificationDataObj.type == 'no_transporter_reject') {
            openOrderDetailsScreen(notificationDataObj.orderId);
          } else if (notificationDataObj.type == 'started') {
            console.log('this is the main screen');
            openOrderDetailsScreen(notificationDataObj.orderId);
          } else if (notificationDataObj.type == 'on-way') {
            openOrderDetailsScreen(notificationDataObj.orderId);
          } else if (notificationDataObj.type == 'unloading') {
            openOrderDetailsScreen(notificationDataObj.orderId);
          } else if (notificationDataObj.type == 'dispute') {
            openOrderDetailsScreen(notificationDataObj.orderId);
          }
        }
      },
    );
  }, []);

  // snippet to pre-fetch order history data before navigating to "ParcelHistoryScreen"
  /* const loadOrderHistoryData = useCallback(async () => {
    try {
      dispatch(getOrderHistoryDataActions.getCustomerOrderData(userUID));
    } catch (err) {
      console.log('loadOrderHistoryData Error is : ', err);
    }
  }, [dispatch, userUID]);

  useEffect(() => {
    loadOrderHistoryData();
  }, [userUID]); */

  const openOrderDetailsScreen = orderId => {
    console.log('navigation data', orderId);
    props.navigation.navigate('OrderDetailsScreen', {
      orderID: orderId,
    });
    AsyncStorage.removeItem(AppPreference.NOTIFICATION_DATA);
  };

  useFocusEffect(
    useCallback(() => {
      try {
        fetchAllData();
      } catch (error) {}
      return () => {};
    }, []),
  );

  // Fetch user realted data in parallel
  const fetchAllData = async () => {
    try {
      // Fetch data concurrently
      const results = await Promise.allSettled([
        getNotificationCount(),
        // loadOrderHistoryData(),
      ]);
      results.forEach((result, i) => {
        if (result.status === "fulfilled") {
          let data = result?.value;
          if(data?.notifCount >= 0) { // for notification
            setNotificationCount(data?.notifCount);
          }
        } else {
          console.error("Error:", result.reason);
        }
      });
      // console.log('Output of Promise.all: ', results);
    } catch (err) {
      // Handle errors
      console.log('Failed to fetch data: ', err);
    } finally {
    }
  };

  const getNotificationCount = () => {
    return new Promise((resolve, reject) => {
      // console.log('calling get notif');
      AsyncStorage.getItem(AppPreference.LOGIN_UID).then(userID => {
        if (userID != null) {
          firestore()
            .collection('notification')
            .where('user_id', '==', userID)
            .where('is_read', '==', false)
            .get()
            .then(querySnapshot => {
              resolve({ notifCount: querySnapshot.size });
            })
            .catch(error => {
              resolve(false);
              console.error(error);
            });
        } else{
          setNotificationCount(0);
        }
      });  
    });
  };

  useEffect(() => {
    AsyncStorage.getItem(AppPreference.LOGIN_UID).then(value => {
      // console.log('UID IS : ', value);
    });
    try {
      setInterval(async () => {
        backgroundLocationTask('near');
      }, 60000);
    } catch (err) {
      console.log('Error is : ', err);
    }
    // BackgroundLocationTask();
  }, []);

  const handleTrackOrder = async () => {
    const userId = await AsyncStorage.getItem(AppPreference.LOGIN_UID);
    firestore()
      .collection('order_details')
      .where('requested_uid', '==', userId)
      .where('status', 'in', ['on-way', 'on-loading', 'unloading', 'dispute'])
      .where('order_id', '==', +trackingId)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.size === 0) {
          Alert.alert('', 'No active order with given tracking ID found');
          return;
        }
        const orderData = { id: querySnapshot?.docs[0].id, data: querySnapshot?.docs[0].data()};
        let trackingUrl = AppConstants.trackingOrderUrl + `/${orderData?.id}`;
        Linking.openURL(trackingUrl);
        /* props.navigation.navigate('TrackOrder', {
          orderData: {
            data: orderData,
          },
        }); */
      })
      .catch(error => {
        Alert.alert('', error);
      });
  };

  const backgroundLocationTask = valueType => {
    // console.log('<<< BackgroundLocationTask');
    var that = this;
    //Checking for the permission just after component loaded
    if (Platform.OS === 'ios') {
      // callLocation(that);
      Geolocation.getCurrentPosition(
        //Will give you the current location
        position => {
          const currentLongitude = position.coords.longitude;
          //getting the Longitude from the location json
          const currentLatitude = position.coords.latitude;
          //getting the Latitude from the location json
          // console.log(
          //   '<<< LAT/LAN' + currentLatitude + ', ' + currentLongitude,
          // );
          setGetRegion({
            latitude: parseFloat(currentLatitude),
            longitude: parseFloat(currentLongitude),
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          });
          if (valueType === 'near') {
            dispatch(
              userListActions.fetchUserList(currentLatitude, currentLongitude),
            );
          } else {
            dispatch(
              filterTraspoterListActions.fetchFilterTranspoterList(
                sourceText,
                destinationText,
                weight.value,
                dimensions.value,
                vehicleType,
                sourceLatitude,
                sourceLongitude,
                destinationLatitude,
                destinationLongitude,
                currentLatitude,
                currentLongitude,
              ),
            );
          }
        },
        // (error) => alert(error.message),
        // {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
      that.watchID = Geolocation.watchPosition(position => {
        //Will give you the location on location change
        console.log(position);
        const currentLongitude = position.coords.longitude;
        //getting the Longitude from the location json
        const currentLatitude = position.coords.latitude;
        //getting the Latitude from the location json
        // console.log('<<< LAT/LAN' + currentLatitude + ', ' + currentLongitude);
        setGetRegion({
          latitude: parseFloat(currentLatitude),
          longitude: parseFloat(currentLongitude),
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        });
        if (valueType === 'near') {
          dispatch(
            userListActions.fetchUserList(currentLatitude, currentLongitude),
          );
        } else {
          dispatch(
            filterTraspoterListActions.fetchFilterTranspoterList(
              sourceText,
              destinationText,
              weight.value,
              dimensions.value,
              vehicleType,
              sourceLatitude,
              sourceLongitude,
              destinationLatitude,
              destinationLongitude,
              currentLatitude,
              currentLongitude,
            ),
          );
        }
      });
    } else {
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            // callLocation(that);
            Geolocation.getCurrentPosition(
              //Will give you the current location
              position => {
                const currentLongitude = position.coords.longitude;
                //getting the Longitude from the location json
                const currentLatitude = position.coords.latitude;
                //getting the Latitude from the location json
                // console.log(
                //   '<<< LAT/LAN' + currentLatitude + ', ' + currentLongitude,
                // );
                setGetRegion({
                  latitude: parseFloat(currentLatitude),
                  longitude: parseFloat(currentLongitude),
                  latitudeDelta: 0.5,
                  longitudeDelta: 0.5,
                });
                if (valueType === 'near') {
                  dispatch(
                    userListActions.fetchUserList(
                      currentLatitude,
                      currentLongitude,
                    ),
                  );
                } else {
                  dispatch(
                    filterTraspoterListActions.fetchFilterTranspoterList(
                      sourceText,
                      destinationText,
                      weight.value,
                      dimensions.value,
                      vehicleType,
                      sourceLatitude,
                      sourceLongitude,
                      destinationLatitude,
                      destinationLongitude,
                      currentLatitude,
                      currentLongitude,
                    ),
                  );
                }
              },
              // (error) => alert(error.message),
              // {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
            );
            that.watchID = Geolocation.watchPosition(position => {
              //Will give you the location on location change
              console.log(position);
              const currentLongitude = position.coords.longitude;
              //getting the Longitude from the location json
              const currentLatitude = position.coords.latitude;
              //getting the Latitude from the location json
              // console.log(
              //   '<<< LAT/LAN' + currentLatitude + ', ' + currentLongitude,
              // );
              setGetRegion({
                latitude: parseFloat(currentLatitude),
                longitude: parseFloat(currentLongitude),
                latitudeDelta: 0.5,
                longitudeDelta: 0.5,
              });
              if (valueType === 'near') {
                dispatch(
                  userListActions.fetchUserList(
                    currentLatitude,
                    currentLongitude,
                  ),
                );
              } else {
                dispatch(
                  filterTraspoterListActions.fetchFilterTranspoterList(
                    sourceText,
                    destinationText,
                    weight.value,
                    dimensions.value,
                    vehicleType,
                    sourceLatitude,
                    sourceLongitude,
                    destinationLatitude,
                    destinationLongitude,
                    currentLatitude,
                    currentLongitude,
                  ),
                );
              }
            });
          } else {
            Alert.alert('Permission Denied');
          }
        } catch (err) {
          // Alert.alert('err', err);
          console.log(`requestLocationPermission.err:`, err);
          // console.warn(err);
        }
      }
      requestLocationPermission();
    }
  };

  const filterTranspoterList = (
    sourceValue,
    destinationValue,
    weightValue,
    dimensionsValue,
    vehicleTypeValue,
    sourceLatitudeValue,
    sourceLongitudeValue,
    destinationLatitudeValue,
    destinationLongitudeValue,
    addressType,
  ) => {
    setWeight({value: weightValue, error: ''});
    setDimensions({value: dimensionsValue, error: ''});
    setVehicleType(vehicleTypeValue);
    // if (addressType === 'Source') {
    //   dispatch(
    //     addressSetActions.setSourceAddressValue(
    //       sourceValue,
    //       sourceLatitudeValue,
    //       sourceLongitudeValue,
    //     ),
    //   );
    // } else if (addressType === 'Destination') {
    //   dispatch(
    //     destinationSetActions.setDestinationAddressValue(
    //       destinationValue,
    //       destinationLatitudeValue,
    //       destinationLongitudeValue,
    //     ),
    //   );
    // }
    // console.log('Source lat long' + sourceLatitude + sourceLongitude);
    // console.log(
    //   'Destination lat long' + destinationLatitude + destinationLongitude,
    // );

    if (
      sourceText.length !== 0 &&
      destinationText.length !== 0 &&
      weight.value.length !== 0
    ) {
      backgroundLocationTask('filter');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CHeader
        showLogo={true}
        navigation={props.navigation}
        rightComponent={
          <>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('NotificationScreen');
              }}
            >
              <Image
                style={styles.menuImage}
                source={require('../../../assets/assets/dashboard/notification.png')}
              />
            </TouchableOpacity>
            {notificationCount == 0 ? null : (
              <View
                style={{
                  backgroundColor: 'red',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 12,
                  right: -4,
                  top: -4,
                  position: 'absolute',
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 12,
                  }}
                >
                  {notificationCount >= 100 ? '+99' : notificationCount}
                </Text>
              </View>
            )}
          </>
        }
      />

      <MapView
        style={styles.map}
        // provider={PROVIDER_GOOGLE}
        initialRegion={getRegion}
        showsUserLocation={true}
        // onRegionChangeComplete={onRegionChange}
        showsMyLocationButton={true}
      >
        {userDataList.map((marker, index) => {
          // console.log(`marker.data.address:`, marker.data.address)
          // console.log(`typeof(marker.data.address.coordinates.latitude):`, typeof(marker.data.address.coordinates.latitude))
          // console.log(`typeof(marker.data.address.coordinates.longitude):`, typeof(marker.data.address.coordinates.longitude))
          let coordinates = {
            latitude: parseFloat(marker.data.address.coordinates.latitude),
            longitude: parseFloat(marker.data.address.coordinates.longitude),
          };
          return (
            <Marker
              key={index}
              coordinate={coordinates}
              image={require('../../../assets/assets/dashboard/delivery-truck.png')}
              // title={marker.address.title}
              // description={marker.description}
            />
          );
        })}
      </MapView>
      {/* <View style={styles.markerFixed}>
        <Image
          style={styles.marker}
          source={require('../../../assets/assets/dashboard/markerpin.png')}
        />
      </View> */}

      <View style={styles.trackingView}>
        <View style={styles.viewInputText}>
          <Image
            style={styles.trackingImage}
            source={require('../../../assets/assets/dashboard/barcode.png')}
          />
          <TextInput
            style={styles.weightInputText}
            placeholder="Enter Your Tracking Id"
            returnKeyType="next"
            value={trackingId}
            onChangeText={text => setTrackingId(text)}
            error={!!weight.error}
            errorText={weight.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="number-pad"
            ref={ref => {
              // this._weightinput = ref;
            }}
            onSubmitEditing={() =>
              this._dimensioninput && this._dimensioninput.focus()
            }
          />
          <View style={styles.searchView}>
            <TouchableOpacity onPress={handleTrackOrder}>
              <Image
                style={{...styles.trackingImage, marginLeft: 0}}
                source={require('../../../assets/assets/dashboard/search.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <View style={styles.optionView}>
        <View style={styles.firstView}>
          <TouchableOpacity
            style={styles.otherRowView}
            onPress={() => {
              props.navigation.navigate('DashboardScreen');
            }}
          >
            <Image
              style={styles.optionImage}
              source={require('../../../assets/assets/dashboard/sendParcelNew.png')}
            />
            <Text style={{...styles.tilteText, color: Colors.tilteText}}>
              Send Parcel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.otherRowView}
            onPress={() => {
              AsyncStorage.getItem(AppPreference.IS_LOGIN).then(valueLogin => {
                const isLogin = JSON.parse(valueLogin);
                console.log('Login Value is : ', isLogin);
                if (isLogin != 1) {
                  props.navigation.navigate('Auth');
                } else {
                  props.navigation.navigate('OrderHistoryScreen', {
                    isShowBack: true,
                  });
                }
              });
            }}
          >
            <Image
              style={styles.optionImage}
              source={require('../../../assets/assets/dashboard/parcelHistory.png')}
            />
            <Text style={{...styles.tilteText, color: Colors.tilteText}}>
              Parcel History
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 26,
    backgroundColor: Colors.mainBackgroundColor,
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 40,
    width: 40,
  },
  viewHeaderRight: {
    paddingRight: 16,
    width: 64,
  },
  map: {
    // flex: 1,
    height: Dimensions.get('window').height,
    // ...StyleSheet.absoluteFillObject,
  },
  markerFixed: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Dimensions.get('window').height / -1.8,
    marginBottom: 64,
  },
  marker: {
    height: 48,
    width: 48,
    resizeMode: 'contain',
  },
  trackingView: {
    flex: 1,
    position: 'absolute',
    top: 63,
    width: '100%',
    backgroundColor: Colors.backgroundColor,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
  viewInputText: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.subViewBGColor,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.subViewBGColor,
  },
  weightInputText: {
    paddingLeft: 12,
    paddingRight: 16,
    fontSize: RFPercentage(1.8),
    // fontFamily: 'SofiaPro-Medium',
    color: Colors.titleTextColor,
    // backgroundColor: Colors.backgroundColor,
    height: 50,
    width: Dimensions.get('window').width - 124,
    borderRadius: 10,
  },
  trackingImage: {
    marginLeft: 16,
    height: 25,
    width: 25,
  },
  searchView: {
    marginRight: 16,
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  optionView: {
    // marginTop: 64,
    // alignItems: 'flex-end',
    // justifyContent: 'center',
    // height: 300,
    backgroundColor: Colors.backgroundColor,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
    position: 'absolute',
    bottom: 0,
  },
  firstView: {
    margin: 16,
    width: Dimensions.get('window').width - 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowView: {
    // height: 110,
    width: Dimensions.get('window').width / 2 - 32,
    backgroundColor: Colors.primaryColor,
    borderRadius: 10,
    justifyContent: 'center',
  },
  otherRowView: {
    // height: 110,
    width: Dimensions.get('window').width / 2 - 32,
    backgroundColor: Colors.otherOptionColor,
    borderRadius: 10,
    justifyContent: 'center',
  },
  optionImage: {
    margin: 16,
    height: 30,
    width: 30,
  },
  tilteText: {
    margin: 16,
    marginTop: 0,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(1.8),
    // fontWeight: '500',
    color: Colors.backgroundColor,
  },
  popupView: {
    marginTop: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 40,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 5,
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
  contentContainerStyle: {
    padding: 16,
    backgroundColor: '#F3F4F9',
  },
  header: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    paddingVertical: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  panelHandle: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 4,
  },
  item: {
    backgroundColor: Colors.backgroundColor,
    marginVertical: 8,
  },
  traspoterText: {
    padding: 8,
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
    fontWeight: 'bold',
  },
  priceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceText: {
    padding: 8,
    paddingTop: 0,
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
    fontWeight: 'bold',
  },
  vehicleText: {
    padding: 8,
    paddingTop: 0,
    fontSize: RFPercentage(1.7),
    color: Colors.titleTextColor,
  },
});

export default DashboardTrakingScreen;