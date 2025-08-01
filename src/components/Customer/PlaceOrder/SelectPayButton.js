import React from 'react';
import {Text, View, StyleSheet, Image, TouchableOpacity} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

// Import the JS file.
import Colors from '../../../helper/extensions/Colors';

const SelectPayButton = (props) => {
  const {selection} = props;

  return (
    <TouchableOpacity
      style={selection ? styles.selectedOptionView : styles.optionView}
      onPress={props.selectPay}>
      <View style={styles.row}>
        <Image style={styles.paymentImage} source={props.image} />
        <Text style={styles.titleText}>{props.title}</Text>
        {/* <View style={{flex: 1, alignItems: 'flex-end', marginRight: 16}}>
          <Image
            style={styles.paymentImage}
            source={require('../../../assets/assets/PlaceOrder/ic_next.png')}
          />
        </View> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionView: {
    // flex: 1,
    margin: 16,
    marginBottom: 8,
    borderColor: Colors.subTitleTextColor,
    borderWidth: 0.5,
    borderRadius: 10,
    height: 50,
  },
  selectedOptionView: {
    // flex: 1,
    margin: 16,
    marginBottom: 8,
    borderColor: Colors.primaryColor,
    borderWidth: 0.5,
    borderRadius: 10,
    height: 50,
  },
  row: {
    flex: 1,
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  titleText: {
    marginLeft: 16,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-SemiBold',
    color: Colors.textColor,
  },
  paymentImage: {
    height: 35,
    width: 35,
  },
});

export default SelectPayButton;
