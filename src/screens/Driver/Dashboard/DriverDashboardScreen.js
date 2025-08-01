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
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import RecentOrder from '../../../components/transpoter/Dashboard/RecentOrder';

// Load the main class.

const windowHeight = Dimensions.get('window').height;

const DriverDashboardScreen = (props) => {
  const [getRegion, setGetRegion] = useState({
    latitude: 23.08571,
    longitude: 72.55132,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  return (
    <ScrollView style={styles.container}>
      <View style={styles.optionView}>
        <View style={styles.firstView}>
          <TouchableOpacity
            style={styles.otherRowView}
            onPress={() =>
              props.navigation.navigate({
                routeName: 'DriverHistoryScreen',
                params: {
                  historyStatus: 0,
                },
              })
            }>
            <View style={styles.subRowView}>
              <Text style={{...styles.tilteText, color: Colors.tilteText}}>
                Assigned
              </Text>
              <Image
                style={styles.optionImage}
                source={require('../../../assets/assets/Driver/Dashboard/assigned.png')}
              />
            </View>
            <Text style={styles.countTitleText}>13</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.otherRowView}
            onPress={() =>
              props.navigation.navigate({
                routeName: 'DriverHistoryScreen',
                params: {
                  historyStatus: 1,
                },
              })
            }>
            <View style={styles.subRowView}>
              <Text style={{...styles.tilteText, color: Colors.tilteText}}>
                Ongoing
              </Text>
              <Image
                style={styles.optionImage}
                source={require('../../../assets/assets/Transpoter/Dashboard/ongoing.png')}
              />
            </View>
            <Text style={styles.countTitleText}>13</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.firstView}>
          <TouchableOpacity
            style={styles.otherRowView}
            onPress={() =>
              props.navigation.navigate({
                routeName: 'DriverHistoryScreen',
                params: {
                  historyStatus: 2,
                },
              })
            }>
            <View style={styles.subRowView}>
              <Text style={{...styles.tilteText, color: Colors.tilteText}}>
                Accepted
              </Text>
              <Image
                style={styles.optionImage}
                source={require('../../../assets/assets/Transpoter/Dashboard/accepted.png')}
              />
            </View>
            <Text style={styles.countTitleText}>13</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.otherRowView}
            onPress={() =>
              props.navigation.navigate({
                routeName: 'DriverHistoryScreen',
                params: {
                  historyStatus: 3,
                },
              })
            }>
            <View style={styles.subRowView}>
              <Text style={{...styles.tilteText, color: Colors.tilteText}}>
                Rejected
              </Text>
              <Image
                style={styles.optionImage}
                source={require('../../../assets/assets/Transpoter/Dashboard/rejected.png')}
              />
            </View>
            <Text style={styles.countTitleText}>13</Text>
          </TouchableOpacity>
        </View>
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
      <Text
        style={{
          ...styles.countTitleText,
          fontSize: RFPercentage(2.5),
          marginTop: 32,
        }}>
        Track Ongoing order
      </Text>
      <TouchableOpacity
        style={styles.historyView}
        onPress={() =>
          props.navigation.navigate({
            routeName: 'OrderDetailsScreen',
          })
        }>
        <View style={styles.itemRow}>
          <Text style={styles.unSelectedStatusText}>#264100</Text>
          <Text style={styles.titleText}>₹ {2000}</Text>
        </View>
        <View style={styles.textView}>
          <Text style={styles.titleText} numberOfLines={1}>
            Ahmedabad
          </Text>
          <Text style={styles.subTitleText}>-- to --</Text>
          <Text style={styles.titleText} numberOfLines={1}>
            Vadodara
          </Text>
        </View>
        <MapView
          style={styles.map}
          // provider={PROVIDER_GOOGLE}
          initialRegion={getRegion}
          showsUserLocation={true}
          // onRegionChangeComplete={onRegionChange}
          showsMyLocationButton={true}>
        </MapView>
      </TouchableOpacity>
    </ScrollView>
  );
};

DriverDashboardScreen.navigationOptions = (navigationData) => {
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
  historyView: {
    // flex: 1,
    margin: 16,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 10,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    shadowOpacity: 0.15,
    elevation: 5,
  },
  itemRow: {
    margin: 8,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unSelectedStatusText: {
    padding: 8,
    color: Colors.primaryColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
  },
  textView: {
    margin: 8,
    // marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  titleText: {
    margin: 8,
    marginBottom: 0,
    marginTop: 0,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-SemiBold',
  },
  subTitleText: {
    margin: 8,
    marginBottom: 0,
    marginTop: 0,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.8),
    color: Colors.subTitleTextColor,
  },
  map: {
    // flex: 1,
    height: 200,
    // ...StyleSheet.absoluteFillObject,
    // marginBottom: 32,
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
  },
});

export default DriverDashboardScreen;
