import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

// Import the JS file.
import Colors from '../../../helper/extensions/Colors';
import SelectParcel from '../../../components/Customer/AddParcelDetails/SelectParcel';
const windowWidth = Dimensions.get('window').width;

const RecentOrder = (props) => {
  return (
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
      <SelectParcel parcelHistory={true} />
      <View style={styles.itemRow}>
        <TouchableOpacity style={styles.detailView}>
          <Text style={styles.detailText}>View Details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.acceptView}
          onPress={() =>
            props.navigation.navigate({
              routeName: 'CancelOrderScreen',
            })
          }>
          <Text style={styles.acceptText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
  acceptView: {
    margin: 16,
    marginTop: 0,
    width: windowWidth / 2 - 64,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.acceptedViewColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.titleTextColor,
  },
  acceptText: {
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.backgroundColor,
  },
  acceptedView: {
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: Colors.acceptedViewColor,
    height: 55,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  unSelectedStatusText: {
    padding: 8,
    color: Colors.primaryColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
  },
});

export default RecentOrder;
