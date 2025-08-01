import React, { memo } from 'react'
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Colors from '../../helper/extensions/Colors';

const CheckboxInput = ({onPress, checked, label}) => {
    return(
        <TouchableOpacity onPress={onPress} style={styles.checkboxContainer}>
            <Image
                style={styles.calendarImage}
                source={
                checked
                    ? require('../../assets/assets/PlaceOrder/ic_checkbox_check.png')
                    : require('../../assets/assets/PlaceOrder/ic_checkbox_uncheck.png')
                }
            />
            <View style={styles.checkboxLabel}>
                {label}
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    calendarImage: {
      marginRight: 16,
      height: 30,
      width: 30,
    },
    checkboxContainer: {
      marginTop: 16,
      height: 40,
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkboxLabel: {
      marginLeft: -16,
      fontFamily: 'SofiaPro-Regular',
      fontSize: RFPercentage(2),
      color: Colors.titleTextColor,
    }
});

export default memo(CheckboxInput);