import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {Button as PaperButton} from 'react-native-paper';
import Colors from '../../helper/extensions/Colors';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';

const Button = ({mode, style, children, ...props}) => (
  <PaperButton
    style={[
      styles.button,
      mode === 'outlined' && {backgroundColor: Colors.surfaceColor},
      style,
    ]}
    labelStyle={styles.text}
    mode={mode}
    {...props}>
    {children}
  </PaperButton>
);

const styles = StyleSheet.create({
  button: {
    // width: '100%',
    marginVertical: 10,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  text: {
    // fontWeight: 'bold',
    fontSize: RFPercentage(3),
    // fontFamily: 'Roboto-Regular',
    lineHeight: 60,
  },
});

export default memo(Button);
