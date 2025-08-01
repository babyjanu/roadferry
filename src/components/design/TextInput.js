import React, {memo} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TextInput as Input} from 'react-native-paper';
// import {theme} from '../core/theme';
import Colors from '../../helper/extensions/Colors';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

const TextInput = ({errorText, customRef, ...props}) => {
  /* console.log(`TextInput`)
  console.log(errorText)
  console.log(customRef)
  console.log(props) */
  return (
  <View style={styles.container}>
    <Input
      ref={customRef}
      style={styles.input}
      selectionColor={Colors.primaryColor}
      underlineColor="transparent"
      mode="outlined"
      theme={{colors: {primary: Colors.primaryColor}}}
      {...props}
    />
    {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
  </View>
)};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 8,
  },
  input: {
    backgroundColor: Colors.surfaceColor,
  },
  error: {
    fontSize: RFPercentage(2),
    // fontFamily: 'Roboto-Regular',
    color: Colors.errorColor,
    paddingHorizontal: 8,
    paddingTop: 8,
  },
});

export default memo(TextInput);
