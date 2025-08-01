import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {DrawerItems, DrawerActions} from 'react-navigation-drawer';

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
import AppPreference from '../helper/preference/AppPreference';
import * as fetchProfileDataActions from '../store/actions/customer/profile/fetchProfileData';
import {useDispatch} from 'react-redux';
import Session from '../helper/Session';
import {firebase} from '@react-native-firebase/database';
import TrackOrder from '../screens/Customer/TrackOrder';

var isLoginUser = false;
export const setIsLoginUser = tIsLoginUser => {
  isLoginUser = tIsLoginUser;
};

export const getIsLoginUser = () => {
  return isLoginUser;
};

const Auth = createStackNavigator({
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  VerificationScreen: {
    screen: VerificationScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  RegisterScreen: {
    screen: RegisterScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  RegisterAddressScreen: {
    screen: RegisterAddressScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  ForgotPasswordScreen: {
    screen: ForgotPasswordScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const Slider = createStackNavigator({
  SplashScreen: {
    screen: SplashScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  Slider1: {
    screen: SliderScreen1,
    navigationOptions: {
      headerShown: false,
    },
  },
  Slider2: {
    screen: SliderScreen2,
    navigationOptions: {
      headerShown: false,
    },
  },
  Slider3: {
    screen: SliderScreen3,
    navigationOptions: {
      headerShown: false,
    },
  },
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  VerificationScreen: {
    screen: VerificationScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  RegisterScreen: {
    screen: RegisterScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  RegisterAddressScreen: {
    screen: RegisterAddressScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  ForgotPasswordScreen: {
    screen: ForgotPasswordScreen,
    navigationOptions: {
      headerShown: false,
    },
  },
  // this one which is on app startup
  Dashboard: {
    screen: DashboardTrakingScreen,
    navigationOptions: {
      headerShown: true,
    },
  },
  DashboardScreen: {
    screen: DashboardScreen,
    navigationOptions: {
      headerShown: true,
    },
  },
  AddParcelDetails: {
    screen: AddParcelDetails,
    navigationOptions: {
      headerShown: true,
    },
  },
  AddressScreen: {
    screen: AddressScreen,
    navigationOptions: {
      headerShown: true,
    },
  },
  AddAddressScreen: {
    screen: AddAddressScreen,
    navigationOptions: {
      headerShown: true,
    },
  },
  AddSetAddressScreen: {
    screen: AddSetAddressScreen,
    navigationOptions: {
      headerShown: true,
    },
  },
  PlaceOrderDetails: {
    screen: PlaceOrderDetailScreen,
    navigationOptions: {
      headerShown: true,
    },
  },
  Checkout: {
    screen: CheckoutScreen,
    navigationOptions: {
      headerShown: true,
    },
  },
  OrderHistoryScreen: {
    screen: OrderHistoryScreen,
    navigationOptions: {
      headerShown: true,
    },
  },
  OrderDetailsScreen: {
    screen: OrderDetailsScreen,
    navigationOptions: {
      headerShown: true,
    },
  },
  CancelOrderScreen: {
    screen: CancelOrderScreen,
    navigationOptions: {
      headerShown: true,
    },
  },
  NotificationScreen: {
    screen: NotificationScreen,
    navigationOptions: {
      headerShown: true,
    },
  },
});

const DashboardScreenNavigator = createStackNavigator(
  {
    /* // screen: DashboardTrakingScreen,
    Dashboard: {
      screen: DashboardScreen,
      navigationOptions: {
        headerShown: true,
      },
    }, */
    DashboardTraking: {
      screen: DashboardTrakingScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    DashboardScreen: {
      screen: DashboardScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    OldDashboardScreen: {
      screen: OldDashboardScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    AddParcelDetails: {
      screen: AddParcelDetails,
      navigationOptions: {
        headerShown: true,
      },
    },
    AddressScreen: {
      screen: AddressScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    AddAddressScreen: {
      screen: AddAddressScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    AddSetAddressScreen: {
      screen: AddSetAddressScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    PlaceOrderDetails: {
      screen: PlaceOrderDetailScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    Checkout: {
      screen: CheckoutScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    OrderHistoryScreen: {
      screen: OrderHistoryScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    OrderDetailsScreen: {
      screen: OrderDetailsScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    CancelOrderScreen: {
      screen: CancelOrderScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    NotificationScreen: {
      screen: NotificationScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    LoginScreen: {
      screen: LoginScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    VerificationScreen: {
      screen: VerificationScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    RegisterScreen: {
      screen: RegisterScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    RegisterAddressScreen: {
      screen: RegisterAddressScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    ForgotPasswordScreen: {
      screen: ForgotPasswordScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    TrackOrder: {
      screen: TrackOrder,
      navigationOptions: {
        headerShown: true,
      },
    },
  },
  {
    navigationOptions: {
      // headerShown: true,
      // headerTitle: false,
      drawerLabel: 'Dashboard',
      drawerIcon: tabInfo => (
        <Image
          style={[styles.homeLeftImage, {tintColor: 'white'}]}
          source={require('../../src/assets/assets/navigation/ic_dashboard.png')}
        />
      ),
    },
  },
);

const OrderHistoryScreenNavigator = createStackNavigator(
  {
    screen: OrderHistoryScreen,
    OrderDetailsScreen: {
      screen: OrderDetailsScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    CancelOrderScreen: {
      screen: CancelOrderScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    /* LoginScreen: {
      screen: LoginScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    Dashboard: {
      screen: DashboardTrakingScreen,
      navigationOptions: {
        headerShown: true,
      },
    }, */
  },
  {
    navigationOptions: {
      drawerLabel: 'Parcel History',
      drawerIcon: tabInfo => (
        <Image
          style={[styles.homeLeftImage]}
          source={require('../../src/assets/assets/navigation/ic_history.png')}
        />
      ),
    },
  },
);

const ProfileScreenNavigator = createStackNavigator(
  {
    screen: ProfileScreen,
    EditProfile: {
      screen: EditProfileScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    ChangePasswordscreen: {
      screen: ChangePasswordScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
  },
  {
    navigationOptions: {
      drawerLabel: 'My Profile',
      drawerIcon: tabInfo => (
        <Image
          style={[styles.homeLeftImage, {tintColor: tabInfo.tintColor}]}
          source={require('../../src/assets/assets/navigation/ic_profile.png')}
        />
      ),
    },
  },
);

const NotificationScreenNavigator = createStackNavigator(
  {
    screen: NotificationScreen,
  },
  {
    navigationOptions: {
      drawerLabel: 'Notification',
      drawerIcon: tabInfo => (
        <Image
          style={[styles.homeLeftImage, {tintColor: tabInfo.tintColor}]}
          source={require('../../src/assets/assets/navigation/ic_notifications.png')}
        />
      ),
    },
  },
);

const ChangePasswordScreenNavigator = createStackNavigator(
  {
    screen: ChangePasswordScreen,
  },
  {
    navigationOptions: {
      drawerLabel: 'Change Password',
      drawerIcon: tabInfo => (
        <Image
          style={[styles.homeLeftImage, {tintColor: tabInfo.tintColor}]}
          source={require('../../src/assets/assets/navigation/ic_password.png')}
        />
      ),
    },
  },
);

const DeliveryAddressScreenNavigator = createStackNavigator(
  {
    screen: ChangePasswordScreen,
  },
  {
    navigationOptions: {
      drawerLabel: 'Delivery Address',
      drawerIcon: tabInfo => (
        <Image
          style={[styles.homeLeftImage, {tintColor: tabInfo.tintColor}]}
          source={require('../../src/assets/assets/navigation/ic_delivery.png')}
        />
      ),
    },
  },
);

const SupportScreenNavigator = createStackNavigator(
  {
    screen: SupportScreen,
  },
  {
    navigationOptions: {
      drawerLabel: 'Contact Us',
      drawerIcon: tabInfo => (
        <Image
          style={[styles.homeLeftImage, {tintColor: tabInfo.tintColor}]}
          source={require('../../src/assets/assets/navigation/ic_contact.png')}
        />
      ),
    },
  },
);

const SettingsScreenNavigator = createStackNavigator(
  {
    // screen: TranspoterDashboardScreen,
    TranspoterDashboardScreen: {
      screen: TranspoterDashboardScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    NotificationScreen: {
      screen: NotificationScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    ParcelHistoryScreen: {
      screen: ParcelHistoryScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    ParcelDetailsScreen: {
      screen: ParcelDetailsScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    DriverlistScreen: {
      screen: DriverlistScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    AddDriverScreen: {
      screen: AddDriverScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    AddDriverUploadScreen: {
      screen: AddDriverUploadScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    VehicleListScreen: {
      screen: VehicleListScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    AddVehicleScreen: {
      screen: AddVehicleScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
  },
  {
    navigationOptions: {
      drawerLabel: 'Settings',
      drawerIcon: tabInfo => (
        <Image
          style={[styles.homeLeftImage, {tintColor: tabInfo.tintColor}]}
          source={require('../../src/assets/assets/navigation/ic_settings.png')}
        />
      ),
    },
  },
);

const DriverModuleScreenNavigator = createStackNavigator(
  {
    // screen: TranspoterDashboardScreen,
    DriverDashboardScreen: {
      screen: DriverDashboardScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    DriverHistoryScreen: {
      screen: DriverHistoryScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
    DriverDetailScreen: {
      screen: DriverDetailScreen,
      navigationOptions: {
        headerShown: true,
      },
    },
  },
  {
    navigationOptions: {
      drawerLabel: 'Driver Module',
      drawerIcon: tabInfo => (
        <Image
          style={[styles.homeLeftImage, {tintColor: tabInfo.tintColor}]}
          source={require('../../src/assets/assets/navigation/ic_settings.png')}
        />
      ),
    },
  },
);

const MainDrawerNavigator = createDrawerNavigator(
  {
    SplashScreen: {
      screen: SplashScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
    sliderScreen: {
      screen: Slider,
      navigationOptions: {
        drawerLabel: () => null,
      },
    },
    auth: {
      screen: Auth,
      navigationOptions: {
        drawerLabel: () => null,
      },
    },
    Dashboard: DashboardScreenNavigator,
    OrderHistory: OrderHistoryScreenNavigator,
    Profile: ProfileScreenNavigator,
    // Notification: NotificationScreenNavigator,
    // ChangePassword: ChangePasswordScreenNavigator,
    // DeliveryAddress: DeliveryAddressScreenNavigator,
    Support: SupportScreenNavigator,
    // Settings: SettingsScreenNavigator,
    // DriverModule: DriverModuleScreenNavigator,
  },
  {
    defaultNavigationOptions: {
      headerShown: false,
    },
    contentOptions: {
      // activeBackgroundColor: Colors.buttonBackgroundColor,
      activeTintColor: Colors.backgroundColor,
      inactiveTintColor: Colors.backgroundColor,
      // inactiveBackgroundColor: Colors.inputTextBackgroundColor,
    },
    drawerWidth: Math.round(Dimensions.get('window').width) * 0.8,
    drawerBackgroundColor: '#F1592A',
    labelStyle: {
      fontSize: 14,
    },
    contentComponent: props => {
      // console.log(`isLoginUser: ${isLoginUser}`)
      return (
        <View style={{flex: 1}}>
          <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
            <DrawerItems {...props} />
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => {
                if (isLoginUser) {
                  Alert.alert(
                    'Confirmation',
                    'Do you want to logout?',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => {
                          return null;
                        },
                      },
                      {
                        text: 'Ok',
                        onPress: () => {
                          // const dispatch = useDispatch();
                          firebase.auth().signOut();
                          Session.removeAll();
                          // AsyncStorage.clear();
                          // AsyncStorage.setItem(AppPreference.IS_SLIDER, '1');
                          isLoginUser = false;
                          props.navigation.closeDrawer();
                          props.navigation.navigate('LoginScreen');
                        },
                      },
                    ],
                    {cancelable: false},
                  );
                } else {
                  props.navigation.navigate('LoginScreen');
                }
              }}>
              <Image
                style={styles.logoutImage}
                source={require('../../src/assets/assets/navigation/ic_logout.png')}
              />
              <Text style={styles.logoutText}>
                {isLoginUser ? 'Logout' : 'Login'}
              </Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      );
    },
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
  },
);

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

export default createAppContainer(Slider);
