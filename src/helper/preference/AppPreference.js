import React, {useState, useEffect} from 'react';
// import {AsyncStorage} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default {
  IS_LOGIN: 'IS_LOGIN',
  LOGIN_UID: 'LOGIN_UID',
  LOGIN_USER_DATA: 'LOGIN_USER_DATA',
  LOGIN_TOKEN: 'LOGIN_TOKEN',
  DISTANCE_MARGIN: 100,
  MIN_DISTANCE: 5,
  IS_SLIDER: 'IS_SLIDER',
  PICKUP_ADDRESS: 'PICKUP_ADDRESS',
  DROP_ADDRESS: 'DROP_ADDRESS',
  LOCAL_ADDRESS: 'LOCAL_ADDRESS',
  FCM_TOKEN: 'FCM_TOKEN',
  NOTIFICATION_DATA: 'NOTIFICATION_DATA',
  ORDER_DATA: "ORDER_DATA"
};

export const setPreferenceData = async (key, data) => {
  await AsyncStorage.setItem(key, JSON.stringify(data));
};

export const getPreferenceData = async (key) => {
  var data;
  await AsyncStorage.getItem(key).then((value) => {
    // console.log('Data is : ', JSON.parse(value));
    data = JSON.parse(value);
  });
  return data;
};

// export const getMultiPreferenceData = async (key) => {
//   var data;
//   await AsyncStorage.multiGet(key).then((value) => {
//     // console.log('Data is : ', JSON.parse(value));
//     data = value;
//   });
//   return data;
// };
