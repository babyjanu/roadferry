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
  ScrollView,
} from 'react-native';
import {useSelector, useDispatch, connect} from 'react-redux';

// Import the Plugins and Thirdparty library.

import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';

import RecentOrder from '../../../../src/components/transpoter/Dashboard/RecentOrder';
import * as getOrderHistoryDataActions from '../../../../src/store/actions/customer/orderHistory/getOrderHistoryData';

// Load the main class.

const windowHeight = Dimensions.get('window').height;

const TranspoterDashboardScreen = props => {
  /* const [pendingCount, setPendingCount] = useState(0);
  const [ongoingCount, setOngoingCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0); */

  const pendingData = useSelector(
    state => state.customerPendingOrderData.customerPendingOrderData,
  );

  const ongoingData = useSelector(
    state => state.customerOngoingOrderData.customerOngoingOrderData,
  );

  const completedData = useSelector(
    state => state.customerCompletedOrderData.customerCompletedOrderData,
  );

  const rejectedData = useSelector(
    state => state.customerRejectedOrderData.customerRejectedOrderData,
  );

  const dispatch = useDispatch();
  const loadOrderHistoryData = useCallback(async () => {
    // AsyncStorage.getItem(AppPreference.LOGIN_UID).then((valueUID) => {
    let valueUID = 'B4Ti8IgLgpsKZECGqOJ0'; //transporter login user id
    console.log('UID IS : ', valueUID);
    try {
      dispatch(getOrderHistoryDataActions.getCustomerOrderData(valueUID, true));
    } catch (err) {
      console.log('Error is : ', err);
    }
    // });
  }, [dispatch]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'focus',
      loadOrderHistoryData,
    );

    return () => {
      willFocusSub();
    };
  }, [loadOrderHistoryData]);

  useEffect(() => {
    loadOrderHistoryData().then(() => {
      /* console.log(`pendingData: ${pendingData}`)
      console.log(`ongoingData: ${ongoingData}`)
      console.log(`completedData: ${completedData}`)
      console.log(`rejectedData: ${rejectedData}`) */
    });
  }, [dispatch, loadOrderHistoryData]);

  useEffect(() => {
    // console.log(`pendingData: ${pendingData}`)
  });

  openParcelHistoryScreen = index => {
    props.navigation.navigate({
      routeName: 'ParcelHistoryScreen',
      params: {
        historyStatus: index,
        pendingData: pendingData,
        ongoingData: ongoingData,
        completedData: completedData,
        rejectedData: rejectedData,
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.optionView}>
        <View style={styles.firstView}>
          <TouchableOpacity
            style={styles.otherRowView}
            onPress={() => openParcelHistoryScreen(0)}>
            <View style={styles.subRowView}>
              <Text style={{...styles.tilteText, color: Colors.tilteText}}>
                Pending
              </Text>
              <Image
                style={styles.optionImage}
                source={require('../../../assets/assets/Transpoter/Dashboard/pending.png')}
              />
            </View>
            <Text style={styles.countTitleText}>{pendingData.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.otherRowView}
            onPress={() => openParcelHistoryScreen(1)}>
            <View style={styles.subRowView}>
              <Text style={{...styles.tilteText, color: Colors.tilteText}}>
                Ongoing
              </Text>
              <Image
                style={styles.optionImage}
                source={require('../../../assets/assets/Transpoter/Dashboard/ongoing.png')}
              />
            </View>
            <Text style={styles.countTitleText}>{ongoingData.length}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.firstView}>
          <TouchableOpacity
            style={styles.otherRowView}
            onPress={() => openParcelHistoryScreen(2)}>
            <View style={styles.subRowView}>
              <Text style={{...styles.tilteText, color: Colors.tilteText}}>
                Accepted
              </Text>
              <Image
                style={styles.optionImage}
                source={require('../../../assets/assets/Transpoter/Dashboard/accepted.png')}
              />
            </View>
            <Text style={styles.countTitleText}>{completedData.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.otherRowView}
            onPress={() => openParcelHistoryScreen(3)}>
            <View style={styles.subRowView}>
              <Text style={{...styles.tilteText, color: Colors.tilteText}}>
                Rejected
              </Text>
              <Image
                style={styles.optionImage}
                source={require('../../../assets/assets/Transpoter/Dashboard/rejected.png')}
              />
            </View>
            <Text style={styles.countTitleText}>{rejectedData.length}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text
        style={{
          ...styles.countTitleText,
          fontSize: RFPercentage(2.5),
          marginTop: 16,
        }}>
        Quick access
      </Text>
      <View style={styles.firstView}>
        <TouchableOpacity
          style={styles.otherRowView}
          onPress={() =>
            props.navigation.navigate({
              routeName: 'VehicleListScreen',
            })
          }>
          <View style={{...styles.subRowView, marginBottom: 16}}>
            <Image
              style={styles.optionImage}
              source={require('../../../assets/assets/Transpoter/Dashboard/add_vehicle.png')}
            />
            <Text style={{...styles.tilteText, color: Colors.tilteText}}>
              Add Vehicle
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.otherRowView}
          onPress={() =>
            props.navigation.navigate({
              routeName: 'DriverlistScreen',
            })
          }>
          <View style={{...styles.subRowView, marginBottom: 16}}>
            <Image
              style={styles.optionImage}
              source={require('../../../assets/assets/Transpoter/Dashboard/add_driver.png')}
            />
            <Text style={{...styles.tilteText, color: Colors.tilteText}}>
              Add Driver
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          ...styles.countTitleText,
          fontSize: RFPercentage(2.5),
          marginTop: 16,
        }}>
        Recent order
      </Text>
      <RecentOrder />
    </ScrollView>
  );
};

TranspoterDashboardScreen.navigationOptions = navigationData => {
  return {
    headerShown: true,
    // headerTitle: 'Dashboard',
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
      backgroundColor: Colors.mainBackgroundColor,
    },
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
    headerRight: (
      <View style={styles.viewHeaderRight}>
        <TouchableOpacity
          onPress={() => {
            navigationData.navigation.navigate({
              routeName: 'NotificationScreen',
            });
          }}>
          <Image
            style={styles.menuImage}
            source={require('../../../assets/assets/dashboard/notification.png')}
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
  },
  optionView: {
    backgroundColor: Colors.mainBackgroundColor,
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
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
    backgroundColor: Colors.backgroundColor,
    borderRadius: 10,
    // justifyContent: 'center',
  },
  otherRowView: {
    width: Dimensions.get('window').width / 2 - 32,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 15,
    justifyContent: 'center',
  },
  subRowView: {
    flexDirection: 'row',
    margin: 16,
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionImage: {
    // margin: 16,
    height: 25,
    width: 25,
  },
  tilteText: {
    // margin: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.8),
    // color: Colors.backgroundColor,
  },
  countTitleText: {
    margin: 16,
    marginTop: 0,
    fontFamily: 'SofiaPro-Bold',
    fontSize: RFPercentage(3),
    color: Colors.titleTextColor,
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

export default TranspoterDashboardScreen;
