import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { RFPercentage } from '../../helper/extensions/Util';
import Colors from '../../helper/extensions/Colors';

const CPrimaryButton = (props) =>
{
    const { btnTitle, btnActiveOpacity, isDisabled = false, btnStyle, btnTxtStyle, onPress, isLoading = false } = props;
    return (
        <TouchableOpacity
            activeOpacity={btnActiveOpacity || 0.7}
            disabled={isDisabled || isLoading}
            style={{
                ...styles.buttonView,
                ...(isDisabled || isLoading ? { backgroundColor: Colors.unSelectTextColor } : {}),
                ...btnStyle,
            }}
            onPress={onPress}
        >
            {isLoading ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.spinner} />
                    <Text style={{ ...styles.buttonText, ...btnTxtStyle, marginLeft: 8 }}>
                        {btnTitle}
                    </Text>
                </View>
            ) : (
                <Text style={{ ...styles.buttonText, ...btnTxtStyle }}>
                    {btnTitle}
                </Text>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonView: {
        marginVertical: 12,
        paddingHorizontal: 30,
        paddingVertical: 12,
        fontSize: RFPercentage(2),
        fontFamily: 'SofiaPro-Medium',
        backgroundColor: Colors.buttonColor,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 6,
    },
    buttonText: {
        fontFamily: 'SofiaPro-Medium',
        color: Colors.backgroundColor,
        fontSize: RFPercentage(2),
    },
    spinner: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: Colors.backgroundColor,
        borderTopColor: Colors.primaryColor,
        borderRadius: 10,
        marginRight: 4,
        // Simple spinner animation
        // You can replace with ActivityIndicator if using react-native
    },
})

export default CPrimaryButton;
