import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Linking,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/core';
import FastImage from 'react-native-fast-image';
import { icons } from '../helper/Utils';
import SelectParcel from './Customer/AddParcelDetails/SelectParcel';
import Colors from '../helper/extensions/Colors';
import { RFPercentage } from '../helper/extensions/Util';

const windowWidth = Dimensions.get('window').width;

const ParcelHistoryCardNewUI = ({
  data,
  handleDetailsBtnClick,
  isOngoingOrder,
  onTrackOrderClicked,
  showOrderStatusView = false
}) => {
  const navigation = useNavigation();

  const onNumberPress = value => {
    Linking.openURL(`tel:+91${value}`);
  };

  return (
    <View style={styles.historyCardView}>
      {showOrderStatusView ? (
        <View
          style={styles.orderStatusView}
        >
          <Text style={{ ...styles.titleText, color: Colors.backgroundColor }}>{`${data?.item?.data?.status}`}</Text>
        </View>
      ) : null}
      <TouchableOpacity
        style={{ ...styles.historySubCardView, marginTop: showOrderStatusView ? -26 : 0 }}
        onPress={() => handleDetailsBtnClick()}
      >
        <View style={styles.itemRow}>
          <Text style={styles.titleText}>
            {`Order Number: `}
            <Text style={styles.unSelectedStatusText}>
              {`#${data?.item?.data?.order_id}`}
            </Text>
          </Text>

          {/* <Text style={styles.titleText}>₹ {data?.item?.data?.price}</Text> */}
        </View>

        <>
           <View style={{ marginVertical: 12, ...styles.textView}}>
            <Text style={styles.titleText} numberOfLines={1}>
              {data?.item?.data?.pickup_location?.city}
            </Text>
            
            <Text style={styles.subTitleText}>-- to --</Text>

            <Text style={styles.titleText} numberOfLines={1}>
              {data?.item?.data?.drop_location?.city}
            </Text>
          </View>
        </>

        <View style={styles.orderSubInfoContainer}>
          {/* <View style={styles.orderSubInfoSubContainer}>
            <Text style={styles.titleText} numberOfLines={1}>
              {data?.item?.data?.payment_mode}
            </Text>
            <Text style={styles.subTitleText} numberOfLines={1}>
              {`Date`}
            </Text>
          </View>

          <View style={styles.orderSubInfoSubContainer}>
            <Text style={styles.titleText} numberOfLines={1}>
              {data?.item?.data?.payment_mode}
            </Text>
            <Text style={styles.subTitleText} numberOfLines={1}>
              {`Time`}
            </Text>
          </View> */}

          <View style={styles.orderSubInfoSubContainer}>
            <Text style={styles.titleText} numberOfLines={1}>
              {`₹ ${data?.item?.data?.price}`}
            </Text>
            <Text style={styles.subTitleText} numberOfLines={1}>
              {`Price`}
            </Text>
          </View>

          <View style={styles.orderSubInfoSubContainer}>
            <Text style={styles.titleText} numberOfLines={1}>
              {data?.item?.data?.payment_mode}
            </Text>
            <Text style={styles.subTitleText} numberOfLines={1}>
              {`Method`}
            </Text>
          </View>
        </View>

        {isOngoingOrder ? (
          <View style={{paddingHorizontal: 12, marginTop: 0}}>
            <Text style={styles.titleText}>{`Driver Details: `}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <SelectParcel
                isTransporter={true}
                parcelHistory={true}
                data={data?.item?.data?.driver_details}
              />
              <TouchableOpacity
                style={{position: 'absolute', right: 10}}
                onPress={() =>
                  onNumberPress(data?.item?.data?.driver_details?.phone_number)
                }
              >
                <FastImage style={styles.iconImg} source={icons.callImg} />
              </TouchableOpacity>
            </View>
          </View>
          ) : null
        }

        <View style={styles.itemRow}>
          <TouchableOpacity
            style={styles.detailView}
            onPress={() => handleDetailsBtnClick()}
          >
            <Text style={styles.detailText}>Details</Text>
          </TouchableOpacity>

          {isOngoingOrder ? (
            <TouchableOpacity
              style={styles.trackOrderView}
              onPress={() => onTrackOrderClicked()}
            >
              <Text style={styles.whiteColoredTxt}>Track Order</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  unSelectedStatusText: {
    color: Colors.primaryColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
  },
  historyCardView: {
    margin: 16
  },
  orderStatusView: {
    height: 60,
    backgroundColor: Colors.acceptedViewColor,
    paddingTop: 10,
    alignItems: 'center',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30
  },
  historySubCardView: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 30,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 5,
    shadowOpacity: 0.15,
    elevation: 5,
  },
  itemRow: {
    // margin: 8,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locNameText: {
    // margin: 8,
    color: Colors.primaryColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-SemiBold',
  },
  titleText: {
    // margin: 8,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-SemiBold',
  },
  subTitleText: {
    // margin: 8,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.8),
    color: Colors.subTitleTextColor,
  },
  textView: {
    // margin: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  whiteColoredTxt: {
    padding: 8,
    color: Colors.backgroundColor,
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
  },
  trackOrderView: {
    // margin: 16,
    width: windowWidth / 2 - 64,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.trackOrderViewColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailView: {
    // margin: 16,
    marginTop: 0,
    width: windowWidth / 2 - 64,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.mainBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelView: {
    // margin: 16,
    marginTop: 0,
    width: windowWidth / 2 - 64,
    height: 40,
    borderRadius: 20,
    // borderColor: Colors.primaryColor,
    // borderWidth: 0.5,
    backgroundColor: Colors.acceptedViewColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailText: {
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Regular',
    color: Colors.titleTextColor,
  },
  menuViewCustomOptionView: {
    paddingHorizontal: 20,
    width: windowWidth - 58,
    height: 50,
    borderRadius: 25,
    borderColor: Colors.titleTextColor,
    borderWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuViewCustomMenuItemView: {
    // paddingHorizontal: 20,
    // width: windowWidth,
    backgroundColor: Colors.mainBackgroundColor,
  },
  orderSubInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    columnGap: 24,
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderSubInfoSubContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImg: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});

export default ParcelHistoryCardNewUI;
