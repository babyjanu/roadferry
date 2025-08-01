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
import {useSelector} from 'react-redux';
import { WebView } from 'react-native-webview';
import Colors from '../helper/extensions/Colors';
import CHeader from '../components/CHeader';

const windowWidth = Dimensions.get('window').width;

const TermsOfServices = (props) => {
  let userUID = useSelector((state) => state.fetchProfileData.userUID);

  return (
    <View style={styles.container}>
      
      <CHeader navigation={props?.navigation} headerTitle={'Terms of Services'} />
      <WebView style={{ flex: 1 }} source={{ uri: 'https://roadferry.in/terms-of-service-transporter.html' }} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  subContainer: {
    padding: 16,
    flex: 1
  }
});

export default TermsOfServices;
