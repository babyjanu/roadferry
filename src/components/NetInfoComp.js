import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import { StyleSheet, Text, View } from 'react-native';
import { hasNotch } from 'react-native-device-info';
import Animated, { BounceIn } from 'react-native-reanimated';
import { RFPercentage } from '../helper/extensions/Util';
import Colors from '../helper/extensions/Colors';

const NetInfoComp = () => {
  const [hasInternet, setHasInternet] = useState(true);
  
  useFocusEffect(
    useCallback(() => {
      const netInfoSubscription = NetInfo.addEventListener((state) => {
        setHasInternet(state.isConnected);
      });
      return () => {
        netInfoSubscription();
      };
    }, [])
  );

  return !hasInternet ? (
    <Animated.View entering={BounceIn.delay(400)} style={styles.container}>
      <Text style={styles.titleTxt}>
        {`No internet connection.`}
      </Text>
      <Text style={styles.subTitleTxt}>
        {`Please check your network settings and try again.`}
      </Text>
    </Animated.View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingVertical: 15,
    position: 'absolute',
    zIndex: 1,
    top: hasNotch() ? 60 : 20,
    marginHorizontal: 10,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderStartWidth: 5,
    borderColor: Colors.errorColor,
  },
  titleTxt: { 
    color: Colors.black,
    fontSize: RFPercentage(2.2),
    fontFamily: 'SofiaPro-Bold',
    marginBottom: 5
  },
  subTitleTxt: {
    fontSize: RFPercentage(1.8),
    fontFamily: 'SofiaPro-Medium'
  },
});

export default NetInfoComp;