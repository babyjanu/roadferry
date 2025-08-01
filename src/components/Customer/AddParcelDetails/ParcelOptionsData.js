import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Linking
} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

// Import the JS file.
import Colors from '../../../helper/extensions/Colors';

const ParcelOptionsData = props => {
  const {
    optionTitle,
    optionTitleValue,
    openDialer = false,
    imgSrc = false,
  } = props;

  const onNumberPress = value => {
    if (openDialer) {
      Linking.openURL(`tel:+91${value}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{flex: 0.5, ...styles.titleText}}>{optionTitle}</Text>
      <TouchableOpacity
        style={styles.subTitleContainer}
        disabled={!openDialer}
        onPress={() => onNumberPress(optionTitleValue)}
      >
        {optionTitleValue ? (
          <Text style={openDialer ? styles.boldText : styles.subTitleText}>
            {optionTitleValue}
          </Text>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    marginVertical: 8,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.otherTextColor,
  },
  subTitleText: {
    // flex: 0.5,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-SemiBold',
    textAlign: 'right',
  },
  subTitleContainer: {
    flex: 0.5,
    alignItems: 'flex-end',
  },
  boldText: {
    // flex: 0.5,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Regular',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  eWayChallanImg: {
    height: 98,
    width: 98,
    marginTop: 4,
    // alignSelf: 'flex-end'
    // position: 'absolute',
    // right: 0
  },
  downloadIcon: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.textColor,
    padding: 2,
    marginStart: 8,
  },
});

export default ParcelOptionsData;
