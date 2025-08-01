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
} from 'react-native';
import {useSelector, useDispatch, connect} from 'react-redux';

// Import the Plugins and Thirdparty library.

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import Menu, {MenuItem} from 'react-native-material-menu';
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import Geolocation from '@react-native-community/geolocation';

import * as userListActions from '../../../store/actions/dashboard/userlist';
import * as addressSetActions from '../../../store/actions/dashboard/setSourceValue';
import * as destinationSetActions from '../../../store/actions/dashboard/setDestinationValue';
import * as filterTraspoterListActions from '../../../store/actions/dashboard/filterTranspoterList';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
// import TextInput from '../../../components/design/TextInput';
import GooglePlacesTextInput from '../../../components/design/GooglePlacesTextInput';

// Load the main class.

const windowHeight = Dimensions.get('window').height;

const DashboardScreen = (props) => {
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

  const userDataList = useSelector((state) => state.allUserData.allUserData);
  const sourceText = useSelector(
    (state) => state.setSourceTextValue.setSourceTextValue,
  );
  const sourceLatitude = useSelector(
    (state) => state.setSourceLatitude.setSourceLatitude,
  );
  const sourceLongitude = useSelector(
    (state) => state.setSourceLongitude.setSourceLongitude,
  );
  const destinationText = useSelector(
    (state) => state.setDestinationTextValue.setDestinationTextValue,
  );
  const destinationLatitude = useSelector(
    (state) => state.setDestinationLatitude.setDestinationLatitude,
  );
  const destinationLongitude = useSelector(
    (state) => state.setDestinationLongitude.setDestinationLongitude,
  );
  const filterDataList = useSelector(
    (state) => state.allFilterData.allFilterData,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    try {
      setInterval(async () => {
        backgroundLocationTask('near');
      }, 60000);
    } catch (err) {
      console.log('Error is : ', err);
    }
    // BackgroundLocationTask();
  }, []);

  const backgroundLocationTask = (valueType) => {
    // console.log('<<< BackgroundLocationTask');
    var that = this;
    //Checking for the permission just after component loaded
    if (Platform.OS === 'ios') {
      // callLocation(that);
      Geolocation.getCurrentPosition(
        //Will give you the current location
        (position) => {
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
      that.watchID = Geolocation.watchPosition((position) => {
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
              (position) => {
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
            that.watchID = Geolocation.watchPosition((position) => {
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
          Alert.alert('err', err);
          console.warn(err);
        }
      }
      requestLocationPermission();
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
    setVehicleTypeFlag(false);
    setVehicleType(popupName);
    filterTranspoterList(
      source,
      destination,
      weight.value,
      dimensions.value,
      popupName,
      sourceLatLong,
      destinationLatLong,
      '',
    );
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
    <View style={styles.container}>
      <MapView
        style={styles.map}
        // provider={PROVIDER_GOOGLE}
        initialRegion={getRegion}
        showsUserLocation={true}
        // onRegionChangeComplete={onRegionChange}
        showsMyLocationButton={true}>
        {userDataList.map((marker, index) => {
          // console.log(`marker.data.address:`, marker.data.address)
          // console.log(`typeof(marker.data.address.coordinates.latitude):`, typeof(marker.data.address.coordinates.latitude))
          // console.log(`typeof(marker.data.address.coordinates.longitude):`, typeof(marker.data.address.coordinates.longitude))
          let coordinates = {latitude: parseFloat(marker.data.address.coordinates.latitude), longitude: parseFloat(marker.data.address.coordinates.longitude)}
          return (
            <Marker
              key={index}
              coordinate={coordinates}
              image={require('../../../assets/assets/dashboard/delivery-truck.png')}
              // title={marker.address.title}
              // description={marker.description}
            />
          )}
        )}
      </MapView>
      <View style={styles.markerFixed}>
        <Image
          style={styles.marker}
          source={require('../../../assets/assets/dashboard/markerpin.png')}
        />
      </View>
      <View style={{margin: 16, position: 'absolute'}}>
        <GooglePlacesTextInput
          placeholder="Source"
          soureValue={(data, getLat, getLong) => {
            dispatch(
              addressSetActions.setSourceAddressValue(data, getLat, getLong),
            );
            filterTranspoterList(
              sourceText,
              data,
              weight.value,
              dimensions.value,
              vehicleType,
              getLat,
              getLong,
              destinationLatitude,
              destinationLongitude,
              'Source',
            );
          }}
        />
        <GooglePlacesTextInput
          placeholder="Destination"
          destinationValue={(data, getLat, getLong) => {
            dispatch(
              destinationSetActions.setDestinationAddressValue(
                data,
                getLat,
                getLong,
              ),
            );
            filterTranspoterList(
              data,
              destinationText,
              weight.value,
              dimensions.value,
              vehicleType,
              sourceLatitude,
              sourceLongitude,
              getLat,
              getLong,
              'Destination',
            );
          }}
        />
        <View style={styles.viewInputText}>
          <TextInput
            style={styles.weightInputText}
            placeholder="Weight"
            returnKeyType="next"
            value={weight.value}
            onChangeText={(text) =>
              filterTranspoterList(
                sourceText,
                destinationText,
                text,
                dimensions.value,
                vehicleType,
                sourceLatitude,
                sourceLongitude,
                destinationLatitude,
                destinationLongitude,
                '',
              )
            }
            error={!!weight.error}
            errorText={weight.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="number-pad"
            ref={(ref) => {
              // this._weightinput = ref;
            }}
            onSubmitEditing={() =>
              this._dimensioninput && this._dimensioninput.focus()
            }
          />
          <TextInput
            style={styles.weightInputText}
            placeholder="Dimensions"
            returnKeyType="done"
            value={dimensions.value}
            onChangeText={(text) =>
              filterTranspoterList(
                sourceText,
                destinationText,
                weight.value,
                text,
                vehicleType,
                sourceLatitude,
                sourceLongitude,
                destinationLatitude,
                destinationLongitude,
                '',
              )
            }
            error={!!dimensions.error}
            errorText={dimensions.error}
            autoCapitalize="none"
            autoCompleteType="name"
            textContentType="name"
            keyboardType="default"
            ref={(ref) => {
              this._dimensioninput = ref;
            }}
            // onSubmitEditing={() =>
            //   this._vehicleTypeinput && this._vehicleTypeinput.focus()
            // }
          />
        </View>
        <Menu
          ref={(ref) => setMenuRef(ref)}
          button={
            <TouchableOpacity style={styles.popupView} onPress={showMenu}>
              <Text
                style={
                  !vehicleTypeFlag
                    ? styles.popupTextUnSelected
                    : styles.popupTextSelected
                }>
                {vehicleType}
              </Text>
            </TouchableOpacity>
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
      </View>
      {sourceText.length !== 0 &&
        destinationText.length !== 0 &&
        weight.value.length !== 0 && (
          <ScrollBottomSheet // If you are using TS, that'll infer the renderItem `item` type
            componentType="FlatList"
            snapPoints={[100, '50%', windowHeight - 300]}
            initialSnapIndex={2}
            renderHandle={() => (
              <View style={styles.header}>
                <View style={styles.panelHandle} />
                <Text
                  style={{
                    ...styles.vehicleText,
                    paddingTop: 8,
                    paddingBottom: 0,
                  }}>
                  Choose a traspoter, or swipe up for more
                </Text>
              </View>
            )}
            data={filterDataList}
            keyExtractor={(i) => i}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  props.navigation.navigate({
                    routeName: 'PlaceOrderDetails',
                    // params: {
                    //   firebaseUID: response.user.uid,
                    // },
                  });
                }}>
                <Text style={styles.traspoterText}>{item.first_name}</Text>
                <View style={styles.priceView}>
                  <Text style={styles.priceText}>
                    ₹ {item.transpoter_details.vehicle_details.price_per_km}
                  </Text>
                  <Text style={styles.vehicleText}>Total KM : 50</Text>
                </View>
                <Text style={styles.vehicleText}>
                  Vehicle :
                  {item.transpoter_details.vehicle_details.vehicle_type}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.contentContainerStyle}
          />
        )}
    </View>
  );
};

DashboardScreen.navigationOptions = (navigationData) => {
  return {
    headerShown: true,
    // headerTitle: 'Dashboard',
    headerTitle: (
      <Image
        style={{width: 100, height: 30}}
        source={require('../../../assets/assets/Authentication/logo.png')}
        resizeMode="contain"
      />
    ),
    headerLeft: (
      <View style={styles.viewHeaderLeft}>
        <TouchableOpacity
          onPress={() => {
            navigationData.navigation.toggleDrawer();
          }}>
          <Image
            style={styles.menuImage}
            source={require('../../../assets/assets/dashboard/ic_menu.png')}
          />
        </TouchableOpacity>
      </View>
    ),
    // headerRight: (
    //   <View style={styles.viewHeaderRight}>
    //     <TouchableOpacity
    //       onPress={() => {
    //         console.log('Clicked');
    //       }}>
    //       <Image
    //         style={styles.menuImage}
    //         source={require('../../../assets/assets/dashboard/notification.png')}
    //       />
    //     </TouchableOpacity>
    //   </View>
    // ),
  };
};

// Set the components styles.

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 30,
    width: 30,
  },
  viewHeaderRight: {
    paddingRight: 16,
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
  },
  marker: {
    height: 48,
    width: 48,
    resizeMode: 'contain',
  },
  viewInputText: {
    flexDirection: 'row',
    width: Dimensions.get('window').width - 32,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weightInputText: {
    paddingLeft: 12,
    paddingRight: 16,
    fontSize: RFPercentage(2),
    // fontFamily: 'SofiaPro-Medium',
    color: Colors.titleTextColor,
    backgroundColor: Colors.backgroundColor,
    height: 40,
    width: Dimensions.get('window').width / 2 - 32,
    borderRadius: 5,
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

export default DashboardScreen;
