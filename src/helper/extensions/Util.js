import {Platform, StatusBar, Dimensions, Alert, PermissionsAndroid, ToastAndroid} from 'react-native';
import { Buffer } from 'buffer';
import Config from "react-native-config";
import AppConstants from '../constants/AppConstants';
import {
  isLocationEnabled,
  promptForEnableLocationIfNeeded,
} from 'react-native-android-location-enabler';
import Geolocation from '@react-native-community/geolocation';

import Colors from './Colors';
import RazorpayCheckout from 'react-native-razorpay';

export const {height, width} = Dimensions.get('window');

const standardLength = width > height ? width : height;
const offset =
  width > height ? 0 : Platform.OS === 'ios' ? 78 : StatusBar.currentHeight; // iPhone X style SafeAreaView size in portrait

export function isIphoneX() {
  return (
    Platform.OS === 'ios' &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (height === 812 || width === 812 || height === 896 || width === 896)
  );
}

const deviceHeight =
  isIphoneX() || Platform.OS === 'android'
    ? standardLength - offset
    : standardLength;

export function RFPercentage(percent) {
  const heightPercent = (percent * deviceHeight) / 100;
  return Math.round(heightPercent);
}

export function WidthPercentage(percent) {
  const widthPercent = (percent * width) / 100;
  return Math.round(widthPercent);
}


export function generateOrderId(length = 14) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let orderId = '';
  for (let i = 0; i < length; i++) {
      orderId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `order_${orderId}`;
}

export const generateUniqueId = () => {
  let S4 = function() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
 };
 return (S4()+S4()+S4()+S4()+S4()+S4());
}

export const jsonToBase64 = (object) => {
  const json = JSON.stringify(object);
  return Buffer.from(json).toString("base64");
}

export const base64ToJson = (base64String) => {
  const json = Buffer.from(base64String, "base64").toString();
  return JSON.parse(json);
}

export const envParse = (str) => {
  return new Promise(async (resolve, reject) => {
    resolve({str});
  });
}

export const rupeeToPaisa = (amount) => {
  // 1 rupee = 100 paisa
  let paisa = 100;
  return parseInt(amount * paisa);
}

/* export const Get_phonepe_cred = () => {
  let _testCred = AppConstants?.phonepeCred?.test2;
  let obj = {
    hostURL: Config.REACT_APP_PHONEPE_CRED_HOSTURL || _testCred?.hostURL, 
    merchantId: Config.REACT_APP_PHONEPE_CRED_MERCHANTID || _testCred?.merchantId, 
    key: Config.REACT_APP_PHONEPE_CRED_KEY || _testCred?.key,
    keyIndex: Config.REACT_APP_PHONEPE_CRED_KEYINDEX || _testCred?.keyIndex
  }
  // console.log('phonep Cred: ', obj);
  return obj;
} */

export const Get_razorpay_cred = () => {
  let _testCred = AppConstants?.razorpayCred?.test;
  let obj = {
    keysecret: Config.REACT_APP_RAZORPAY_CRED_KEYSECRET ?? _testCred?.keysecret, 
    keyId: Config.REACT_APP_RAZORPAY_CRED_KEYID ?? _testCred?.keyId,
  }
  // console.log('phonep Cred: ', obj);
  return obj;
}

export const Get_msg91OTPWidget_cred = () => {
  let obj = {
    widgetId: Config.REACT_APP_MSG91_OTPWIDGETID ?? '', 
    tokenAuth: Config.REACT_APP_MSG91_TOKENAUTH ?? '',
  }
  // console.log('otpwidget Cred: ', obj);
  return obj;
}

export const razorpayPreOptions = {
  // description: 'description for payment',
  name: AppConstants?.app_Info?.name,
  image: AppConstants?.app_Info?.logo,
  currency: 'INR',
  key: Get_razorpay_cred()?.keyId, // Your api key
  theme: {color: Colors.primaryColor} // theme color of razorpay dashboard
};

export const RazorpayCreateOrderApi = (amount) => {
  return new Promise((resolve, reject) => {
    const reqHeader = {
      accept: 'application/json',
      'Content-Type': 'application/json',
    };
    const reqBody = {
      "amount" : rupeeToPaisa(amount)
    };
    try {
      fetch(AppConstants?.razorPayCreateOrderUrl, {
        method: 'POST',
        headers: reqHeader,
        body: JSON.stringify(reqBody),
      })
        .then(res => res.json())
        .then(res => {
          if(res && !res?.error){
            resolve(res);
          } else {
            resolve(false);
          }
        })
        .catch(error => {
          console.log('RazorpayCreateOrderApi.error: ', error);
          resolve(false);
        }); 
    } catch (error) {
      console.log('RazorpayCreateOrderApi api.error: ', error);
      resolve(false);
    }
  })
}

export const handleCheckLocationGPSOn = async () => {
  try {
    // Handle the enabling of location for Android and iOS
    let locationCoordinates = await enableLocationPrompt();
    if (locationCoordinates) {
      return locationCoordinates;
    } else {
      // handleCheckLocationGPSOn();
    }
    
  } catch (error) {
    console.error('Error in handling location GPS:', error);
    // enableLocationPrompt();
  }
};

// Helper to enable location prompt (Android-specific)
const enableLocationPrompt = async () => {
  try {
    if (Platform.OS === 'android') {
      const data = await promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      });

      // If location enabled or already enabled
      if (data === 'already-enabled' || data === 'enabled') {
        const locCoordinates = await getCurrentLocation();
        return locCoordinates;
      } else {
        // enableLocationPrompt()
        throw new Error('Location not enabled');
      }
    } else {
      // enableLocationPrompt()
      throw new Error('Location not enabled on iOS');
    }
  } catch (error) {
    console.error('Error enabling location:', error);
    // enableLocationPrompt()
    throw error;
  }
};

// Function to get current location with permission check
export const getCurrentLocation = async () => {
  try {
    const checkLocationPermission = await hasLocationPermission();
    if (!checkLocationPermission) {
      return;
    }

    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coordinates = {
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
          };
          resolve(coordinates);
        },
        (error) => {
          console.error('Error getting current location:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 50,
          interval: 5000,
          fastestInterval: 2000,
        }
      );
    });
  } catch (error) {
    console.error('Error in getting current location:', error);
  }
};

export const hasLocationPermission = async () => {
  // console.log(`hasLocationPermission`);
  if (
    AppConstants.isIOS ||
    (AppConstants.isAndroid && Platform.Version < 23)
  ) {
    return true;
  }
  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (hasPermission) {
    return true;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  if (status === PermissionsAndroid.RESULTS.DENIED) {
    ToastAndroid.show(
      'Location permission denied by user.',
      ToastAndroid.LONG,
    );
  } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
    ToastAndroid.show(
      'Location permission revoked by user.',
      ToastAndroid.LONG,
    );
  }

  return false;
};