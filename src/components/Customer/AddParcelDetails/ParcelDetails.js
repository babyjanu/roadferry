import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';

// Import the Plugins and Thirdparty library.
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

// Import the JS file.
import Colors from '../../../helper/extensions/Colors';

const ParcelDetails = (props) => {
  return (
    <View>
      <Text>{props.titleText}</Text>
      {/* <View>

      </View>
      <TextInput
        style={styles.weightInputText}
        placeholder="Weight"
        returnKeyType="next"
        value={weight.value}
        onChangeText={(text) =>
          filterTranspoterList(
            sourceText,
            destinationText,
            text,
            dimensions.value,
            width.value,
            height.value,
            vehicleType,
            sourceLatitude,
            sourceLongitude,
            destinationLatitude,
            destinationLongitude,
            '',
          )
        }
        error={!!weight.error}
        errorText={weight.error}
        autoCapitalize="none"
        autoCompleteType="name"
        textContentType="name"
        keyboardType="number-pad"
        ref={(ref) => {
          this._weightinput = ref;
        }}
        onSubmitEditing={() =>
          this._dimensioninput && this._dimensioninput.focus()
        }
      />{' '} */}
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    margin: 16,
    flexDirection: 'row',
    backgroundColor: Colors.backgroundColor,
  },
});

export default ParcelDetails;
