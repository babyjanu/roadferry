import React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

// Import the JS file.
import Colors from '../../../helper/extensions/Colors';

const SelectParcel = (props) => {
  const {data, parcelHistory, transporterData, price } = props;
  
  return (
    <View style={{backgroundColor: Colors.backgroundColor}}>
      <View style={styles.item}>
        <Image
          style={styles.itemImage}
          source={require('../../../assets/assets/default_user.png')}
        />
        <View style={{ justifyContent: 'center' }}>
          <Text style={styles.traspoterText}>
          {data ? `${data?.first_name} ${data?.last_name}` : transporterData ? `${transporterData?.first_name} ${transporterData?.last_name}` : '[first_name] [last_name]'}
          </Text>
          {/* <Text style={styles.deliveryText}>Delivery time: 3-4 Days</Text> */}
        </View>
        {!parcelHistory && (
          <View style={styles.priceView}>
            <Text style={styles.priceText}>₹ {price}</Text>
          </View>
        )}
      </View>
      {!parcelHistory && <View style={styles.seperateLine} />}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    margin: 16,
    flexDirection: 'row',
    backgroundColor: Colors.backgroundColor,
  },
  itemImage: {
    height: 50,
    width: 60,
    // marginLeft: 16,
    // resizeMode: 'contain',
    borderRadius: 10,
  },
  traspoterText: {
    marginLeft: 8,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: Colors.textColor
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
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
  },
  seperateLine: {
    backgroundColor: Colors.subViewBGColor,
    height: 1,
  },
});

export default SelectParcel;
