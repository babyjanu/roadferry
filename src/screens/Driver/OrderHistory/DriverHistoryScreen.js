import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

// Import the Plugins and Thirdparty library.

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import {
  historyStatus,
  OrderHistroyData,
} from '../../../helper/extensions/dummyData';
import SelectParcel from '../../../components/Customer/AddParcelDetails/SelectParcel';

// Load the main class.
const windowWidth = Dimensions.get('window').width;

const DriverHistoryScreen = (props) => {
  const selectedHistoryStatus = props.navigation.getParam('historyStatus');

  const renderPendingHistroyData = (itemData) => {
    return (
      <TouchableOpacity
        style={styles.historyView}
        onPress={() =>
          props.navigation.navigate({
            routeName: 'DriverDetailScreen',
            params: {
              historyStatus: selectedIndex,
            },
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
        <SelectParcel parcelHistory={true} />
        <View style={styles.seperateLine} />
        <View style={{margin: 8}}>
          <Text style={styles.subTitleText}>Customer Details</Text>
          <Text style={{...styles.titleText, marginTop: 4}}>
            Michael Wayans
          </Text>
          <Text style={{...styles.subTitleText, marginTop: 4}}>
            Contact number
          </Text>
          <Text style={{...styles.titleText, marginTop: 4}}>
            +91 99844 38573
          </Text>
        </View>
        <View style={styles.seperateLine} />
        <View style={styles.itemRow}>
          <TouchableOpacity style={styles.detailView}>
            <Text style={styles.detailText}>Details</Text>
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
      </TouchableOpacity>
    );
  };

  const renderCompletedHistroyData = (itemData) => {
    return (
      <TouchableOpacity
        style={styles.historyView}
        onPress={() =>
          props.navigation.navigate({
            routeName: 'DriverDetailScreen',
            params: {
              historyStatus: selectedIndex,
            },
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
        <SelectParcel parcelHistory={true} />
        <View style={styles.itemRow}>
          <TouchableOpacity style={styles.detailView}>
            <Text style={styles.detailText}>Details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderOngoingdHistroyData = (itemData) => {
    return (
      <TouchableOpacity
        style={styles.completedHistoryMainView}
        onPress={() =>
          props.navigation.navigate({
            routeName: 'DriverDetailScreen',
            params: {
              historyStatus: selectedIndex,
            },
          })
        }>
        {/* <View style={styles.acceptedView}>
          <Text style={styles.selectedStatusText}>Accepted</Text>
        </View> */}
        <View style={styles.completedHistorySubView}>
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
          <SelectParcel parcelHistory={true} />
          <View style={styles.seperateLine} />
          <View style={{margin: 8}}>
            <Text style={styles.subTitleText}>Driver Details</Text>
            <Text style={{...styles.titleText, marginTop: 4}}>
              Michael Wayans
            </Text>
            <Text style={{...styles.subTitleText, marginTop: 4}}>
              Contact number
            </Text>
            <Text style={{...styles.titleText, marginTop: 4}}>
              +91 99844 38573
            </Text>
          </View>
          <View style={styles.seperateLine} />
          <View style={styles.itemRow}>
            <TouchableOpacity style={styles.detailView}>
              <Text style={styles.detailText}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.trackOrderView}>
              <Text style={styles.selectedStatusText}>Track Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRejectedHistroyData = (itemData) => {
    return (
      <TouchableOpacity
        style={styles.historyView}
        onPress={() =>
          props.navigation.navigate({
            routeName: 'ParcelDetailsScreen',
            params: {
              historyStatus: selectedIndex,
            },
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
        <SelectParcel parcelHistory={true} />
        <View style={styles.itemRow}>
          <TouchableOpacity style={styles.detailView}>
            <Text style={styles.detailText}>Details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const [selectedIndex, setSelectedIndex] = useState(selectedHistoryStatus);

  const historyStatusData = (itemData) => {
    return (
      <TouchableOpacity
        style={
          selectedIndex === itemData.item.id
            ? styles.selectedStatusView
            : styles.unSelectedStatusView
        }
        onPress={() => setSelectedIndex(itemData.item.id)}>
        <Text
          style={
            selectedIndex === itemData.item.id
              ? styles.selectedStatusText
              : styles.unSelectedStatusText
          }>
          {itemData.item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainerView}>
        <FlatList
          horizontal
          keyExtractor={(item, index) => item.id}
          data={historyStatus}
          renderItem={historyStatusData}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      {selectedIndex === 0 && (
        <FlatList
          style={{marginBottom: 16}}
          keyExtractor={(item, index) => item.id}
          data={OrderHistroyData}
          renderItem={renderPendingHistroyData}
          showsVerticalScrollIndicator={false}
        />
      )}
      {selectedIndex === 1 && (
        <FlatList
          style={{marginBottom: 16}}
          keyExtractor={(item, index) => item.id}
          data={OrderHistroyData}
          renderItem={renderOngoingdHistroyData}
          showsVerticalScrollIndicator={false}
        />
      )}
      {selectedIndex === 2 && (
        <FlatList
          style={{marginBottom: 16}}
          keyExtractor={(item, index) => item.id}
          data={OrderHistroyData}
          renderItem={renderCompletedHistroyData}
          showsVerticalScrollIndicator={false}
        />
      )}
      {selectedIndex === 3 && (
        <FlatList
          style={{marginBottom: 16}}
          keyExtractor={(item, index) => item.id}
          data={OrderHistroyData}
          renderItem={renderRejectedHistroyData}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

DriverHistoryScreen.navigationOptions = (navigationData) => {
  return {
    headerShown: true,
    headerTitle: 'Parcel History',
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
    backgroundColor: Colors.backgroundColor,
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 40,
    width: 40,
  },
  statusContainerView: {
    margin: 16,
    marginBottom: 0,
    // marginRight: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundColor,
    borderRadius: 25,
    // borderTopStartRadius: 25,
    // borderBottomStartRadius: 25,
    borderWidth: 0.5,
    borderColor: Colors.subViewBGColor,
  },
  selectedStatusView: {
    width: windowWidth / 4,
    height: 50,
    backgroundColor: Colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  unSelectedStatusView: {
    width: windowWidth / 4,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  selectedStatusText: {
    padding: 8,
    color: Colors.backgroundColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
  },
  unSelectedStatusText: {
    padding: 8,
    color: Colors.primaryColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
  },
  historyView: {
    // flex: 1,
    margin: 16,
    marginBottom: 0,
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
  textView: {
    margin: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  detailView: {
    margin: 16,
    marginTop: 0,
    width: windowWidth / 2 - 64,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.mainBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionView: {
    margin: 16,
    marginTop: 0,
    width: windowWidth / 2 - 64,
    height: 40,
    borderRadius: 20,
    borderColor: Colors.titleTextColor,
    borderWidth: 0.5,
    flexDirection: 'row',
    // backgroundColor: Colors.acceptedViewColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.titleTextColor,
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
  acceptedView: {
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: Colors.acceptedViewColor,
    height: 55,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  completedHistoryMainView: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 10,
  },
  completedHistorySubView: {
    // marginTop: -16,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 20,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    shadowOpacity: 0.15,
    elevation: 5,
  },
  seperateLine: {
    backgroundColor: Colors.subViewBGColor,
    height: 1,
  },
  trackOrderView: {
    margin: 16,
    marginTop: 0,
    width: windowWidth / 2 - 64,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.trackOrderViewColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DriverHistoryScreen;
