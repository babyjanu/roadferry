import React, { useCallback, useEffect, useRef, useState } from 'react';
import {StyleSheet, View, Alert, AppState} from 'react-native';

//new
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {NavigationContainer, useFocusEffect, useNavigation} from '@react-navigation/native';

import LoginScreen from '../screens/authentication/LoginScreen';
import VerificationScreen from '../screens/authentication/VerificationScreen';
import RegisterScreen from '../screens/authentication/RegisterScreen';
import ForgotPasswordScreen from '../screens/authentication/ForgotPasswordScreen';

import DashboardScreen from '../screens/Customer/Dashboard/DashboardScreen';
import OrderHistoryScreen from '../screens/Customer/OrderHistory/OrderHistoryScreen';
import ProfileScreen from '../screens/Customer/Profile/ProfileScreen';
import NotificationScreen from '../screens/Customer/Notification/NotificationScreen';
import ChangePasswordScreen from '../screens/Customer/Profile/ChangePasswordScreen';
import SupportScreen from '../screens/Customer/Profile/SupportScreen';

import PlaceOrderDetailScreen from '../screens/Customer/PlaceOrder/PlaceOrderDetailScreen';
import CheckoutScreen from '../screens/Customer/PlaceOrder/CheckoutScreen';
import EditProfileScreen from '../screens/Customer/Profile/EditProfileScreen';

import SliderScreen1 from '../screens/Customer/Slider/SliderScreen1';
import SliderScreen2 from '../screens/Customer/Slider/SliderScreen2';
import SliderScreen3 from '../screens/Customer/Slider/SliderScreen3';

import RegisterAddressScreen from '../screens/authentication/RegisterAddressScreen';
import SplashScreen from '../screens/authentication/SplashScreen';
import DashboardTrakingScreen from '../screens/Customer/Dashboard/DashboardTrakingScreen';
import OldDashboardScreen from '../screens/Customer/Dashboard/OldDashboardScreen';
import AddParcelDetails from '../screens/Customer/AddParcelDetails/AddParcelDetails';
import AddressScreen from '../screens/Customer/AddressManage/AddressScreen';
import AddAddressScreen from '../screens/Customer/AddressManage/AddAddressScreen';
import AddSetAddressScreen from '../screens/Customer/AddressManage/AddSetAddressScreen';
import OrderDetailsScreen from '../screens/Customer/OrderHistory/OrderDetailsScreen';
import CancelOrderScreen from '../screens/Customer/OrderHistory/CancelOrderScreen';

// Transpoters Screen

import TranspoterDashboardScreen from '../screens/Transpoter/Dashboard/TranspoterDashboardScreen';
import ParcelHistoryScreen from '../screens/Transpoter/OrderHistory/ParcelHistoryScreen';
import ParcelDetailsScreen from '../screens/Transpoter/OrderHistory/ParcelDetailsScreen';
import DriverlistScreen from '../screens/Transpoter/Drivers/DriverlistScreen';
import AddDriverScreen from '../screens/Transpoter/Drivers/AddDriverScreen';
import AddDriverUploadScreen from '../screens/Transpoter/Drivers/AddDriverUploadScreen';
import VehicleListScreen from '../screens/Transpoter/Vehicles/VehicleListScreen';
import AddVehicleScreen from '../screens/Transpoter/Vehicles/AddVehicleScreen';

// Drivers Screen

import DriverDashboardScreen from '../screens/Driver/Dashboard/DriverDashboardScreen';
import DriverHistoryScreen from '../screens/Driver/OrderHistory/DriverHistoryScreen';
import DriverDetailScreen from '../screens/Driver/OrderHistory/DriverDetailScreen';

import Colors from '../helper/extensions/Colors';
import TrackOrder from '../screens/Customer/TrackOrder';
import DrawerMenu from './DrawerMenu';
import TermsOfServices from '../screens/TermsOfServices';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import { useSelector } from 'react-redux';
import { registerCustomer_ws } from '../websocket/socketMethods';
import ReferralScreen from '../screens/Customer/ReferralScreen';
import DashboardScreenNew from '../screens/Customer/Dashboard/DashboardScreenNew';
import NetInfoComp from '../components/NetInfoComp';
import socketIo from '../websocket/socketIOServices';

var isLoginUser = false;
export const setIsLoginUser = tIsLoginUser => {
  isLoginUser = tIsLoginUser;
};

export const getIsLoginUser = () => {
  return isLoginUser;
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const Auth = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen
        name="RegisterAddressScreen"
        component={RegisterAddressScreen}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
};

const Slider = ({}) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Slider1" component={SliderScreen1} />
      <Stack.Screen name="Slider2" component={SliderScreen2} />
      <Stack.Screen name="Slider3" component={SliderScreen3} />
    </Stack.Navigator>
  );
};

/* const OrderHistoryScreenNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
      <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} />
      <Stack.Screen name="CancelOrderScreen" component={CancelOrderScreen} />
    </Stack.Navigator>
  );
}; */

const DashboardStackNavigator = ({}) => {
  const appState = useRef(AppState.currentState);

  let userUID = useSelector(state => state.fetchProfileData.userUID);
  let userData = useSelector(state => state.fetchProfileData.fetchProfileData);
  const registerIntervalTime = 20; //in seconds
  let registerCall = null;

  useEffect(() => {
    // registerCall = setInterval(() => { 
      if(userUID){ 
        //code goes here that will be running every 20 sec
        registerCustomer_ws(userUID);
      }
    // }, parseInt(registerIntervalTime * 1000));

    return () => {
      
      /* if(registerCall){
        clearInterval(registerCall);
      } */
    }
  }, [userUID]);

  // re-registering customer to socket when socket is disconnected upon coming from background
  useFocusEffect(
    useCallback(() => {
      // checking app state and socketIo connection
      const subscription = AppState.addEventListener('change', (nextAppState) => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
          let isSocketConnected = socketIo.getSocket()?.connected;

          if (!isSocketConnected) {
            socketIo.connect();
            setTimeout(() => {
              if (userUID) {
                // console.log('are u registering cutomer?');
                registerCustomer_ws(userUID);
              }  
            }, 3500);
          }
        }
        appState.current = nextAppState;
      });
      return () => {
        subscription.remove();
      };
    }, [userUID])
  );

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="DashboardTraking"
    >
      <Stack.Screen
        name="DashboardTraking"
        component={DashboardTrakingScreen}
      />
      {/* <Stack.Screen name="DashboardScreen" component={DashboardScreen} /> */}
      <Stack.Screen name="DashboardScreen" component={DashboardScreenNew} />
      <Stack.Screen name="OldDashboardScreen" component={OldDashboardScreen} />
      <Stack.Screen name="AddParcelDetails" component={AddParcelDetails} />
      <Stack.Screen name="AddressScreen" component={AddressScreen} />
      <Stack.Screen name="AddAddressScreen" component={AddAddressScreen} />
      <Stack.Screen
        name="AddSetAddressScreen"
        component={AddSetAddressScreen}
      />
      <Stack.Screen
        name="PlaceOrderDetails"
        component={PlaceOrderDetailScreen}
      />
      <Stack.Screen name="ReferralScreen" component={ReferralScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
      <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} />
      <Stack.Screen name="CancelOrderScreen" component={CancelOrderScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="TrackOrder" component={TrackOrder} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen
        name="ChangePasswordscreen"
        component={ChangePasswordScreen}
      />
      <Stack.Screen name="TermsOfServicesScreen" component={TermsOfServices} />
      <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicy} />
      <Stack.Screen name="SupportScreen" component={SupportScreen} />
    </Stack.Navigator>
  );
};

const CustomerDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={props => <DrawerMenu {...props} />}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardStackNavigator}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="Slider" component={Slider} />
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="Dashboard" component={CustomerDrawerNavigator} />
    </Stack.Navigator>
  );
};

export default function MainNavigationNew() {
  return (
    <NavigationContainer>
      <NetInfoComp />
      <MainStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  homeLeftImage: {
    height: 20,
    width: 20,
  },
  HomwRightImageView: {
    justifyContent: 'flex-end',
  },
  logoutImage: {
    marginLeft: 14,
    height: 30,
    width: 30,
    tintColor: Colors.backgroundColor,
  },
  logoutText: {
    margin: 16,
    marginLeft: 32,
    fontWeight: 'bold',
    color: Colors.backgroundColor,
  },
});
