import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

// Import the Plugins and Thirdparty library.

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';

// Load the main class.

const ProfileButton = (props) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={props.profileButtonClick}>
      <Text style={styles.titleText}>{props.profileTitle}</Text>
    </TouchableOpacity>
  );
};

// Set the components styles.

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: Colors.primaryColor,
    borderRadius: 5,
  },
  titleText: {
    color: Colors.backgroundColor,
    fontSize: RFPercentage(2),
    fontWeight: 'bold',
  },
});

export default ProfileButton;
