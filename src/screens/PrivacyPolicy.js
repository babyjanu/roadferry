import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Keyboard,
  Dimensions,
  Linking,
} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Colors from '../helper/extensions/Colors';
import {useSelector} from 'react-redux';
import { WebView } from 'react-native-webview';
import CHeader from '../components/CHeader';

const windowWidth = Dimensions.get('window').width;

const PrivacyPolicy = (props) => {
  let userUID = useSelector((state) => state.fetchProfileData.userUID);

  return (
    <View style={styles.container}>
      
      <CHeader navigation={props?.navigation} headerTitle={'Privacy Policy'} />
      <WebView style={{ flex: 1 }} source={{ uri: 'https://roadferry.in/privacy-policy.html' }} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  subContainer: {
    padding: 16
  }
});

export default PrivacyPolicy;
