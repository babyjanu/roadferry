import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage} from 'react-native-responsive-fontsize';

// import PageControl from 'react-native-pagecontrol';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';

const AccountData = (props) => {
  return (
    <View style={styles.viewData}>
      <Text style={styles.keyText}>{props.keyName}</Text>
      <View style={styles.valueView}>
        <Text style={styles.valueText}>{props.valueName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewData: {
    margin: 16,
    marginBottom: 0,
  },
  keyText: {
    // marginTop: 16,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.subTitleTextColor,
  },
  valueView: {
    marginTop: 8,
    backgroundColor: Colors.backgroundColor,
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
  },
  valueText: {
    marginLeft: 8,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Medium',
  },
});

export default AccountData;
