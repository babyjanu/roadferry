import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  ScrollView,
  TextInput,
  Keyboard,
  Alert,
} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {useSelector, useDispatch} from 'react-redux';

// Import the Plugins and Thirdparty library.
import ScrollBottomSheet from 'react-native-scroll-bottom-sheet';
import Modal from 'react-native-modal';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import {OrderDetailsOptions} from '../../../helper/extensions/dummyData';
import ParcelOptionsData from '../../../components/Customer/AddParcelDetails/ParcelOptionsData';
import CModal from '../../../components/design/CModal';

// Load the main class.
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const DriverDetailScreen = (props) => {
  const selectedHistoryStatus = props.navigation.getParam('historyStatus');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [flagAccept, setFlagAccept] = useState(false);
  const [flagDriver, setFlagDriver] = useState(true);
  const [flagVehicle, setFlagVehicle] = useState(false);
  const [search, setSearch] = useState({value: '', error: ''});
  const [selectedDriverIndex, setSelectedDriverIndex] = useState('');
  const [selectedVehicleIndex, setSelectedVehicleIndex] = useState('');
  const [popup, setPopup] = useState(false);

  const pickupAddressData = useSelector(
    (state) => state.pickupAddressData.pickupAddressData,
  );
  const dropAddressData = useSelector(
    (state) => state.dropAddressData.dropAddressData,
  );
  const renderDetailsOption = (itemData) => {
    return (
      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => setSelectedIndex(itemData.item.id)}>
        <Text
          style={
            selectedIndex === itemData.item.id
              ? styles.titleText
              : styles.subTitleText
          }>
          {itemData.item.title}
        </Text>
        <View
          style={
            selectedIndex === itemData.item.id
              ? styles.activeDotView
              : styles.unActiveDotView
          }
        />
      </TouchableOpacity>
    );
  };

  const onPressAccept = () => {
    return (
      <ScrollBottomSheet // If you are using TS, that'll infer the renderItem `item` type
        componentType="FlatList"
        snapPoints={[100, '50%', windowHeight - 300]}
        initialSnapIndex={2}
        renderHandle={() => (
          <View>
            <View style={styles.header}>
              <View style={styles.panelHandle} />
              {/* <Text
                  style={{
                    ...styles.vehicleText,
                    paddingTop: 8,
                    paddingBottom: 0,
                  }}>
                  Choose a traspoter, or swipe up for more
                </Text> */}
            </View>
            <View style={styles.distanceView}>
              <Text style={styles.distanceText}>Total Distance</Text>
              <Text style={styles.distanceText}>294 KM</Text>
            </View>
          </View>
        )}
        data={OrderDetailsOptions}
        keyExtractor={(i) => i}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate({
                routeName: 'AddParcelDetails',
                params: {
                  selectedData: item,
                },
              });
            }}>
            <View style={styles.item}>
              <Image
                style={styles.itemImage}
                source={require('../../../assets/assets/default_user.png')}
              />
              <View>
                <Text style={styles.traspoterText}>sdsdsd</Text>
                <Text style={styles.deliveryText}>Delivery time: 3-4 Days</Text>
              </View>
              <View style={styles.priceView}>
                <Text style={styles.priceText}>₹ {2000}</Text>
              </View>
            </View>
            <View style={styles.seperateLine} />
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.contentContainerStyle}
      />
    );
  };

  // On press select driver and vehicle event
  const onPressSelectDriver_Vehicle = (valueType) => {
    if (valueType === 'driver') {
      setFlagDriver(true);
      setFlagVehicle(false);
    } else {
      setFlagDriver(false);
      setFlagVehicle(true);
    }
  };

  const onPressDriverNext = () => {
    console.log('Driver Index : ', selectedDriverIndex);
    if (selectedDriverIndex !== '') {
      setFlagDriver(false);
      setFlagVehicle(true);
    } else {
      Alert.alert(
        'Alert',
        'Please select the driver',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  };

  const onPressVehicleAssign = () => {
    console.log('Driver Index : ', selectedDriverIndex);
    console.log('Vehicle Index : ', selectedVehicleIndex);
    if (selectedDriverIndex !== '' && selectedVehicleIndex !== '') {
      setPopup(true);
    } else {
      Alert.alert(
        'Alert',
        'Please select the Driver or Vehicle',
        [{text: 'OK', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <View>
          <FlatList
            horizontal
            keyExtractor={(item, index) => item.id}
            data={OrderDetailsOptions}
            renderItem={renderDetailsOption}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <ScrollView style={{margin: 16, marginTop: 0}}>
          {selectedIndex === 0 && (
            <View>
              <ParcelOptionsData
                optionTitle="Tracking Id"
                optionTitleValue="#264100"
              />
              <ParcelOptionsData
                optionTitle="Items"
                optionTitleValue="Household Items"
              />
              <ParcelOptionsData
                optionTitle="Parcel Value"
                optionTitleValue="120,000"
              />
              <ParcelOptionsData
                optionTitle="Parcel Weight"
                optionTitleValue="250 Tons"
              />
              <ParcelOptionsData
                optionTitle="Parcel LWH"
                optionTitleValue="134 feet * 3400 feet * 200 feet"
              />
              <ParcelOptionsData
                optionTitle="Vehicle"
                optionTitleValue="Mini Truck"
              />
              <ParcelOptionsData
                optionTitle="Pickup Date and Time"
                optionTitleValue="01/12/2020 12:40 PM"
              />
              <ParcelOptionsData
                optionTitle="Comment"
                optionTitleValue="Please drive slowly"
              />
            </View>
          )}
          {selectedIndex === 1 && (
            <View>
              <View>
                <Text style={styles.locationTitleText}>Pickup Point</Text>
                <View style={{marginTop: 8}}>
                  <View style={styles.locationView}>
                    <Text
                      style={{
                        ...styles.titleText,
                        fontSize: RFPercentage(2.2),
                      }}>
                      {pickupAddressData.first_name +
                        ' ' +
                        pickupAddressData.last_name}
                    </Text>
                  </View>
                  <Text style={styles.locationText}>
                    {pickupAddressData.flat_name +
                      ', ' +
                      pickupAddressData.area +
                      ', ' +
                      pickupAddressData.city +
                      ', ' +
                      pickupAddressData.state +
                      ' - ' +
                      pickupAddressData.pincode +
                      '. ' +
                      pickupAddressData.country}
                  </Text>
                  <Text style={styles.locationText}>
                    {pickupAddressData.phone_number}
                  </Text>
                </View>
              </View>
              <View style={{marginTop: 16}}>
                <Text style={styles.locationTitleText}>Drop Point</Text>
                <View style={{marginTop: 8}}>
                  <View style={styles.locationView}>
                    <Text
                      style={{
                        ...styles.titleText,
                        fontSize: RFPercentage(2.2),
                      }}>
                      {dropAddressData.first_name +
                        ' ' +
                        dropAddressData.last_name}
                    </Text>
                  </View>
                  <Text style={styles.locationText}>
                    {dropAddressData.flat_name +
                      ', ' +
                      dropAddressData.area +
                      ', ' +
                      dropAddressData.city +
                      ', ' +
                      dropAddressData.state +
                      ' - ' +
                      dropAddressData.pincode +
                      '. ' +
                      dropAddressData.country}
                  </Text>
                  <Text style={styles.locationText}>
                    {dropAddressData.phone_number}
                  </Text>
                </View>
              </View>
            </View>
          )}
          {selectedIndex === 2 && (
            <View>
              <ParcelOptionsData
                optionTitle="Payment method"
                optionTitleValue="Cash on Delivery"
              />
              <ParcelOptionsData
                optionTitle="Total paid amount"
                optionTitleValue="₹ 23990"
              />
            </View>
          )}
        </ScrollView>
      </View>
      {selectedHistoryStatus === 0 && (
        <View style={styles.actionButtonRow}>
          <TouchableOpacity
            style={styles.cancelView}
            onPress={() =>
              props.navigation.navigate({
                routeName: 'CancelOrderScreen',
              })
            }>
            <Text style={styles.cancelText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionView}
            onPress={() =>
              props.navigation.navigate({
                routeName: 'CancelOrderScreen',
              })
            }>
            <Text style={styles.optionText}>Not started</Text>
            <Image
              style={styles.optionImage}
              source={require('../../../assets/assets/Driver/Dashboard/ic_dropdown.png')}
            />
          </TouchableOpacity>
        </View>
      )}
      {selectedHistoryStatus === 1 && (
        <View style={{...styles.actionButtonRow, justifyContent: 'center'}}>
          <TouchableOpacity
            style={{
              ...styles.cancelView,
              backgroundColor: Colors.trackOrderViewColor,
            }}
            onPress={() =>
              props.navigation.navigate({
                routeName: 'CancelOrderScreen',
              })
            }>
            <Text style={styles.cancelText}>Track Order</Text>
          </TouchableOpacity>
        </View>
      )}
      {flagAccept && (
        <ScrollBottomSheet // If you are using TS, that'll infer the renderItem `item` type
          componentType="FlatList"
          snapPoints={[100, '50%', windowHeight - 300]}
          initialSnapIndex={1}
          renderHandle={() => (
            <View>
              <View style={styles.header}>
                <View style={styles.panelHandle} />
                <Text style={{...styles.titleText, marginTop: 8}}>
                  Assign the driver & Vehicle
                </Text>
              </View>
              <View style={styles.selectView}>
                <TouchableOpacity
                  onPress={() => onPressSelectDriver_Vehicle('driver')}>
                  <Text
                    style={
                      flagDriver ? styles.selectText : styles.unSelectText
                    }>
                    Select Driver
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    ...styles.subTitleText,
                    marginLeft: 16,
                    marginRight: 16,
                  }}>
                  &gt;
                </Text>
                <TouchableOpacity
                  onPress={() => onPressSelectDriver_Vehicle('vehicle')}>
                  <Text
                    style={
                      flagVehicle ? styles.selectText : styles.unSelectText
                    }>
                    Select Vehicle
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.trackingView}>
                <View style={styles.viewInputText}>
                  <Image
                    style={styles.trackingImage}
                    source={
                      flagDriver
                        ? require('../../../assets/assets/Transpoter/Dashboard/add_driver.png')
                        : require('../../../assets/assets/Transpoter/Dashboard/add_vehicle.png')
                    }
                  />
                  <TextInput
                    style={styles.weightInputText}
                    placeholder={
                      flagDriver ? 'Search Driver' : 'Search Vehicle'
                    }
                    returnKeyType="done"
                    value={search.value}
                    onChangeText={(text) => setSearch(text)}
                    error={!!search.error}
                    errorText={search.error}
                    autoCapitalize="none"
                    autoCompleteType="name"
                    textContentType="name"
                    keyboardType="default"
                    ref={(ref) => {
                      this._searchinput = ref;
                    }}
                    onSubmitEditing={() => Keyboard.dismiss}
                  />
                  <View style={styles.searchView}>
                    <Image
                      style={{...styles.trackingImage, marginLeft: 0}}
                      source={require('../../../assets/assets/dashboard/search.png')}
                    />
                  </View>
                </View>
              </View>
              <Text
                style={{
                  ...styles.titleText,
                  marginLeft: 16,
                  backgroundColor: Colors.backgroundColor,
                }}>
                {flagDriver
                  ? '12 Drivers are available'
                  : '12 Vehicles are available'}
              </Text>
            </View>
          )}
          data={OrderDetailsOptions}
          keyExtractor={(i) => i}
          renderItem={({item}) => (
            <View>
              {flagDriver && (
                <TouchableOpacity
                  style={styles.itemRow}
                  onPress={() => {
                    setSelectedDriverIndex(item.id);
                  }}>
                  <View style={{...styles.itemRow, marginTop: 0}}>
                    {selectedDriverIndex === item.id ? (
                      <Image
                        style={styles.itemImage}
                        source={require('../../../assets/assets/Transpoter/Dashboard/selected_tick.png')}
                      />
                    ) : (
                      <Image
                        style={styles.itemImage}
                        source={require('../../../assets/assets/dashboard/parcelImage.jpeg')}
                      />
                    )}
                    <Text
                      style={
                        selectedDriverIndex === item.id
                          ? styles.selectTitleText
                          : styles.unSelectTitleText
                      }>
                      James Snow
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              {flagVehicle && (
                <TouchableOpacity
                  style={styles.itemRow}
                  onPress={() => {
                    setSelectedVehicleIndex(item.id);
                  }}>
                  <View style={{...styles.itemRow, marginTop: 0}}>
                    {selectedVehicleIndex === item.id ? (
                      <Image
                        style={styles.itemImage}
                        source={require('../../../assets/assets/Transpoter/Dashboard/selected_tick.png')}
                      />
                    ) : (
                      <Image
                        style={styles.itemImage}
                        source={require('../../../assets/assets/dashboard/heavy_truck.png')}
                      />
                    )}
                    <Text
                      style={
                        selectedVehicleIndex === item.id
                          ? styles.selectTitleText
                          : styles.unSelectTitleText
                      }>
                      Heavy Truck I GJ-DD 407
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}
          contentContainerStyle={styles.contentContainerStyle}
        />
      )}
      {flagAccept && flagDriver && (
        <View style={{...styles.actionButtonRow, justifyContent: 'center'}}>
          <TouchableOpacity
            style={{
              ...styles.cancelView,
              backgroundColor: Colors.primaryColor,
            }}
            onPress={() => onPressDriverNext()}>
            <Text style={styles.cancelText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}
      {flagAccept && flagVehicle && (
        <View style={{...styles.actionButtonRow, justifyContent: 'center'}}>
          <TouchableOpacity
            style={{
              ...styles.cancelView,
              backgroundColor: Colors.acceptedViewColor,
            }}
            onPress={() => onPressVehicleAssign()}>
            <Text style={styles.cancelText}>Accept Order</Text>
          </TouchableOpacity>
        </View>
      )}

      <CModal visible={popup}>
        <View style={styles.centeredView}>
          <View style={styles.popupView}>
            <Image
              style={styles.clickImage}
              source={require('../../../assets/assets/PlaceOrder/checkout_click.png')}
            />
            <Text style={{...styles.totalAmountText, textAlign: 'center'}}>
              Your order has been successfully assigned.
            </Text>
            <TouchableOpacity
              style={styles.homeButtonView}
              onPress={() =>
                props.navigation.navigate({
                  routeName: 'TranspoterDashboardScreen',
                })
              }>
              <Text style={styles.placeOrderText}>HOME</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CModal>
    </View>
  );
};

DriverDetailScreen.navigationOptions = (navigationData) => {
  return {
    headerShown: true,
    headerTitle: 'Order Details',
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
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
    flexGrow: 1,
    backgroundColor: Colors.backgroundColor,
    justifyContent: 'space-between',
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 40,
    width: 40,
  },
  optionRow: {
    margin: 16,
    // height: 40,
    // marginRight: 0,
    // backgroundColor: Colors.backgroundColor,
  },
  titleText: {
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-SemiBold',
  },
  subTitleText: {
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: Colors.subTitleTextColor,
  },
  activeDotView: {
    marginTop: 8,
    height: 3,
    width: 25,
    backgroundColor: Colors.primaryColor,
    borderRadius: 5,
  },
  unActiveDotView: {
    marginTop: 8,
    height: 3,
    width: 25,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 5,
  },
  locationTitleText: {
    color: Colors.primaryColor,
    fontSize: RFPercentage(2.2),
    fontFamily: 'SofiaPro-SemiBold',
  },
  locationView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationText: {
    marginTop: 4,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.8),
    color: Colors.otherTextColor,
  },
  actionButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundColor,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    shadowOpacity: 0.15,
    elevation: 5,
  },
  cancelView: {
    margin: 16,
    marginBottom: 32,
    width: windowWidth / 2 - 32,
    height: 50,
    borderRadius: 25,
    // borderColor: Colors.primaryColor,
    // borderWidth: 0.5,
    backgroundColor: Colors.rejectedColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.backgroundColor,
  },
  contentContainerStyle: {
    flex: 1,
    padding: 16,
    // marginLeft: 55,
    backgroundColor: Colors.backgroundColor,
  },
  header: {
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
    paddingVertical: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowOffset: {width: 5, height: 0},
    shadowRadius: 5,
    shadowOpacity: 0.25,
    elevation: 5,
  },
  panelHandle: {
    width: 35,
    height: 3,
    backgroundColor: Colors.subViewBGColor,
    borderRadius: 4,
  },
  selectView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  selectText: {
    // margin: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.primaryColor,
  },
  unSelectText: {
    // margin: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
  },
  seperateLine: {
    backgroundColor: Colors.backgroundColor,
    height: 10,
  },
  trackingView: {
    width: '100%',
    backgroundColor: Colors.backgroundColor,
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
  itemRow: {
    flexGrow: 1,
    marginTop: 16,
    flexDirection: 'row',
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
  },
  itemImage: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  selectTitleText: {
    marginLeft: 16,
    color: Colors.primaryColor,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-SemiBold',
  },
  unSelectTitleText: {
    marginLeft: 16,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-SemiBold',
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
  optionView: {
    margin: 16,
    marginTop: 0,
    width: windowWidth / 2 - 64,
    height: 50,
    borderRadius: 25,
    borderColor: Colors.titleTextColor,
    borderWidth: 0.5,
    flexDirection: 'row',
    // backgroundColor: Colors.acceptedViewColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.titleTextColor,
  },
  optionImage: {
    height: 30,
    width: 30,
  },
});

export default DriverDetailScreen;
