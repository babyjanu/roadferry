import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import Config from 'react-native-config';

// let BASE_URL = 'https://stagingapi.roadferry.in'; //staging
// let BASE_URL = 'http://127.0.0.1:8081' // localhost
// let BASE_URL = 'https://api.roadferry.in'; // prod server
let BASE_URL = Config.REACT_APP_BASEURL ?? '';
let WEBSOCKET_URL = Config.REACT_APP_WEBSOCKETURL ?? '';

export default {
  SYSLOCALTIME: 'system_local_time',
  TIMEZONE: 'system_time_zone',
  DEVICEID: 'device_id',
  SYSOSVERSION: 'system_os_version',
  APPVERSION: 'app_version',
  DEVICETYPE: 'device_type',
  DEVICEMMODEL: 'device_make_model',
  isAndroid: Platform.OS === 'android',
  isIOS: Platform.OS === 'ios',
  driverStatusVerifiedKey: 'verified',
  vehicleStatusVerifiedKey: 'verified',
  SEND_NOTIFICATION: `${BASE_URL}/api/sendNotification`,
  trackingOrderUrl: 'https://tracking.roadferry.in',
  // ! Key 1
  // ? Account: unknown
  // ? Project: unknown
  // ? Link: unknown
  // google_place_api_key: 'AIzaSyCDcXgJPp5FE1Tiw_Uzh7LJlbfoHu3SwLc',
  // ! Key 2
  // ? Account: models.mobio@gmail.com
  // ? Project: Logistics-OnDemand app
  // ? Link: https://console.cloud.google.com/google/maps-apis/credentials?project=logistics-ondemand-app
  // google_place_api_key: 'AIzaSyDWcZSbyp_kYJSNxLRVVemkx_5V9JlQDHA',
  // ! Key 3
  // ? Account: models.mobio@gmail.com
  // ? Project: Road Ferry
  // ? Link: https://console.cloud.google.com/google/maps-apis/credentials?authuser=3&project=road-ferry-338510&supportedpurview=project
  google_place_api_key: 'AIzaSyCItzj5w3MbKo3zTyY0i4K6fPvbUYGNN-4',  
  country_code: "+91",
  opacityLevel: 0.6,
  signupUserUrl: `${BASE_URL}/user/signup`,
  razorPayCreateOrderUrl: `${BASE_URL}/razorpay/create/order`,
  socketIOUrl: `${BASE_URL}`,
  webSocketUrl: `${WEBSOCKET_URL}`,
  device_details: {
    SYSLOCALTIME: new Date().toLocaleString(),
    TIMEZONE: 'EST',
    DEVICEID: DeviceInfo.getUniqueId(),
    SYSOSVERSION: parseInt(Platform.Version, 10),
    APPVERSION: DeviceInfo.getVersion(),
    DEVICETYPE: Platform.OS === 'ios' ? '2' : '1',
    DEVICEMMODEL: DeviceInfo.getModel(),
  },
  app_Info: {
    name: 'Road Ferry',
    logo: 'https://roadferry.in/theme/log_markup/build/images/logo.png' // 'https://roadferry.in/images/roadferry.png'
  },
  phonepeCred: {
    test: {
      hostURL: 'https://api-preprod.phonepe.com/apis/hermes', 
      merchantId: 'PGTESTPAYUAT', 
      key: '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399',
      keyIndex: '1'
    },
    //if it gives 'Too many requests' error
    test2: { 
      hostURL: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay', 
      merchantId: 'PGTESTPAYUAT86', 
      key: '96434309-7796-489d-8924-ab56988a6076',
      keyIndex: '1'
    }
  },
  //for payments
  razorpayCred: {
    test: {
      keyId: 'rzp_test_Eo05XqzMUnhkBd',
      keysecret: 'QrbVX7RbspzWL6moFQx9zPx5',
    },
  },
};
