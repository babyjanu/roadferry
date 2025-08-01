import React, {useEffect} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../helper/extensions/Colors';
import AppPreference from '../../helper/preference/AppPreference';
import * as fetchProfileDataActions from '../../store/actions/customer/profile/fetchProfileData';
import {useDispatch} from 'react-redux';
import {setIsLoginUser} from '../../navigation/MainNavigation';
import {Shadow} from 'react-native-neomorph-shadows';
import FastImage from 'react-native-fast-image';
import { registerCustomer_ws } from '../../websocket/socketMethods';

const SplashScreen = props => {
  const dispatch = useDispatch();

  const resetDashboardAction = () => {
    props.navigation.reset({
      index: 0,
      routes: [{name: 'Dashboard'}],
    });
  };

  const resetSliderAction = () => {
    props.navigation.reset({
      index: 0,
      routes: [{name: 'Slider'}],
    });
  }

  useEffect(() => {
    setTimeout(() => {
      checkIsUserLogin();
    }, 3000);
  }, []);

  const checkIsUserLogin = () => {
    AsyncStorage.getItem(AppPreference.IS_SLIDER).then((value) => {
        const slideData = JSON.parse(value);
        AsyncStorage.getItem(AppPreference.LOGIN_USER_DATA).then(userData => {
          if (userData != null) {
            let convertedUserData = JSON.parse(userData);
            AsyncStorage.getItem(AppPreference.LOGIN_UID).then(userUID => {
              console.log(`userUID(splashscreen): ${userUID}`);
              // registerCustomer_ws(userUID); // calling registerCustomer socket event
              dispatch({
                type: fetchProfileDataActions.FETCH_PROFILE_DATA,
                fetchProfileData: convertedUserData,
                userUID: userUID,
              });
              setIsLoginUser(true);
            });
          }
        });
        props.navigation.dispatch(slideData === 1 ? resetDashboardAction : resetSliderAction);
      },
    );
  };

  return (
    <View style={styles.container}>
      <Shadow
        useArt
        style={{
          ...styles.logoView,
          shadowOffset: {width: 2, height: 4},
          shadowOpacity: 1,
          shadowColor: Colors.grey,
          shadowRadius: 4,
        }}
      >
        <FastImage
          style={styles.logoImage}
          source={require('../../assets/assets/Authentication/logo.png')}
          resizeMode={'contain'}
        />
      </Shadow>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoView: {
    backgroundColor: Colors.backgroundColor,
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 110,
    height: 110,
  },
});

export default SplashScreen;
