import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';

// Import the Plugins and Thirdparty library.
import Modal from 'react-native-modal';
import auth, {firebase} from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
// import SelectPayButton from '../../../components/Customer/PlaceOrder/SelectPayButton';
import AppPreference from '../../../helper/preference/AppPreference';
import Loader from '../../../components/design/Loader';
import storage from '@react-native-firebase/storage';
import {useSelector} from 'react-redux';
import NotificationCall from '../../../helper/NotificationCall';
import {NavigationActions, StackActions} from 'react-navigation';

import {
  generateUniqueId,
  jsonToBase64,
} from '../../../helper/extensions/Util';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { addOrderDetails_fs } from '../../../helper/Utils/fireStoreUtils';
import CHeader from '../../../components/CHeader';

// Load the main class.
const windowWidth = Dimensions.get('window').width;
let originalImageWidth = 201;
let originalImageHeight = 46;
let imageHeight = 24;
let imageWidth = (imageHeight * originalImageWidth) / originalImageHeight;

/* const resetDashboardAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({routeName: 'Dashboard'})],
}); */

const CheckoutScreen = props => {

  const params = props?.route?.params;

  const profileData = useSelector(
    state => state.fetchProfileData.fetchProfileData,
  );
  const userId = useSelector(state => state.fetchProfileData.userUID);
  // console.log(`profileData:`, userId)

  const pickupLocationData = params?.pickupLocationData;
  const dropLocationData = params?.dropLocationData;
  const priceValue = params?.price;
  const vehicle_type = params?.vehicle_type;
  const newDistance = params?.newDistance;
  const totalDistance = params?.distance;

  const transporterSelectedData = params?.transporterSelectedData;
  // console.log('pickupLocationData', pickupLocationData);
  // console.log('dropLocationData', dropLocationData);
  const [selectionCOD, setSelectionCOD] = useState(false);
  const [selectionOnlinePay, setSelectionOnlinePay] = useState(true);
  const [popup, setPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onPressSelectPayment = value => {
    if (value === 'cod') {
      setSelectionCOD(true);
      setSelectionOnlinePay(false);
    } else {
      setSelectionCOD(false);
      setSelectionOnlinePay(true);
    }
  };

  const resetDashboardAction = () => {
    props.navigation.reset({
      index: 0,
      routes: [{name: 'Dashboard'}],
    });
  };

  // optimized method
  const onPressCheckout = async () => {
    setErrorMessage('');
    const random_no = Math.floor(Math.random() * 10000000 + 1);
    setIsLoading(true);
    let tPickupLocationData = {...pickupLocationData};
    if (typeof tPickupLocationData?.e_challan !== 'string') {
      let img = tPickupLocationData?.e_challan?.assets[0];
      console.log(`tPickupLocationData.e_challan:`, img);
      storage()
        .ref(img?.fileName)
        .putFile(img?.uri)
        .then(async snapshot => {
          const fileURL = await storage().ref(img?.fileName).getDownloadURL();
          // console.log(`url:`, fileURL)
          pickupLocationData.e_challan = fileURL;
        });
    }
    AsyncStorage.getItem(AppPreference.IS_LOGIN).then(valueLogin => {
      const isLogin = JSON.parse(valueLogin);
      // console.log('Login Value is : ', isLogin);
      if (isLogin === 1) {
        AsyncStorage.getItem(AppPreference.LOGIN_UID).then(valueUID => {
          // console.log('UID IS : ', valueUID);
          let tTransporterSelectedData = JSON.parse(
            JSON.stringify(transporterSelectedData),
          );
          let orderDetails = {
            requested_uid: valueUID,
            transporter_uid: transporterSelectedData?.id,
            payment_mode: selectionOnlinePay ? 'UPI/Card/NetBanking' : 'COD',
            order_id: random_no,
            status: 'pending',
            pickup_location: pickupLocationData,
            drop_location: dropLocationData,
            transporter_details: tTransporterSelectedData?.data,
            price: priceValue,
            vehicle_type: vehicle_type,
            created_at: new Date(),
            distance: totalDistance,
            created_by: {
              first_name: profileData?.first_name,
              last_name: profileData?.last_name,
              phone_number: profileData?.phone_number,
              email: profileData?.email,
            },
          };
          console.log(`orderDetails: ${JSON.stringify(orderDetails)}`);
          console.log(
            `transporterSelectedData.id: ${transporterSelectedData.id}`,
          );
          let transporterSelectedId = transporterSelectedData?.id;
          let priority = transporterSelectedData?.data?.priority;
          console.log(`priority: ${priority}`);
          if (selectionOnlinePay) {
            // start_Transaction(orderDetails, priority, transporterSelectedId);
          } else {
            addOrderDetails(orderDetails, priority, transporterSelectedId);
            // addOrderDetails_fs(orderDetails, priority, transporterSelectedId);
          }
        });
      } else {
        setIsLoading(false);
        props.navigation.navigate('Auth');
      }
    });
  };

  const addOrderDetails = (orderDetails, priority, transporterSelectedId) => {
    firebase
      .firestore()
      .collection('users')
      .doc(transporterSelectedId)
      .update({priority: priority + 1})
      .then(() => {
        setIsLoading(false);
        console.log(orderDetails);
        firebase
          .firestore()
          .collection('order_details')
          .add(orderDetails)
          .then(reddd => {
            setPopup(true);
            setIsLoading(false);
            let parameters = {
              userId: transporterSelectedId,
              type: 'request',
              orderId: reddd.id,
            };
            NotificationCall(parameters);
          })
          .catch(err => {
            console.log(`priority.Error.1:`, err);
            setErrorMessage('Something went wrong, Please try again.');
            setIsLoading(false);
          });
      })
      .catch(err => {
        console.log(`priority.Error.2:`, err);
        setErrorMessage('Something went wrong, Please try again.');
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <CHeader navigation={props.navigation} isBackBtn={true} headerTitle={'Checkout'} />
      <View style={{flexGrow: 1}}>
        <Text style={styles.totalAmountText}>Payment Method</Text>
        {/* <View style={styles.amountView}>
          <Text style={styles.totalAmountText}>Total Amount</Text>
          <Text style={styles.totalAmountSubText}>₹ 3200.00</Text>
        </View> */}
        <View style={{margin: 16, marginTop: 0}}>
          <TouchableOpacity
            style={
              selectionOnlinePay ? styles.selectedOptionView : styles.optionView
            }
            onPress={() => {
              // console.log("Work In Progress")
              // alert("Work in progress.")
              onPressSelectPayment('razor');
            }}
          >
            <View style={styles.row}>
              <Image
                style={{width: imageWidth, height: imageHeight}}
                source={require('../../../assets/assets/PlaceOrder/PayUmoney.png')}
              />
              <Text style={styles.titleText}>UPI/Card/Net Banking</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectionCOD ? styles.selectedOptionView : styles.optionView}
            onPress={() => {
              onPressSelectPayment('cod');
            }}
          >
            <View style={styles.row}>
              <Image
                style={styles.paymentImage}
                source={require('../../../assets/assets/PlaceOrder/ic_cod.png')}
              />
              <Text style={styles.titleText}>Cash on Delivery</Text>
            </View>
          </TouchableOpacity>

          {errorMessage == '' ? null : (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
        </View>
      </View>
      <View style={styles.seperateLine} />
      <View style={styles.amountView}>
        <Text style={styles.totalAmountText}>Total Distance</Text>
        <Text style={styles.totalAmountSubText}>{newDistance}</Text>
      </View>
      <View style={[styles.amountView, {marginTop: 0}]}>
        <Text style={styles.totalAmountText}>Total Estimated Price</Text>
        <Text style={styles.totalAmountSubText}>₹ {priceValue}</Text>
      </View>
      <TouchableOpacity
        style={styles.buttonPlaceOrder}
        onPress={() => onPressCheckout()}
      >
        <Text style={styles.placeOrderText}>CHECKOUT</Text>
      </TouchableOpacity>
      <Modal isVisible={popup}>
        <View style={{flex: 1}}>
          <View style={styles.centeredView}>
            <View style={styles.popupView}>
              <Image
                style={styles.clickImage}
                source={require('../../../assets/assets/PlaceOrder/checkout_click.png')}
              />
              <Text style={{...styles.totalAmountText, textAlign: 'center'}}>
                Your order has been successfully placed. Thank you for choosing
                us
              </Text>
              <TouchableOpacity
                style={styles.homeButtonView}
                onPress={() => {
                  setPopup(false);
                  props.navigation.dispatch(resetDashboardAction);
                }}
              >
                <Text style={styles.placeOrderText}>HOME</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Loader loading={isLoading} />
    </View>
  );
};

CheckoutScreen.navigationOptions = navigationData => {
  return {
    headerShown: true,
    headerTitle: 'Checkout',
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
    headerLeft: (
      <View style={styles.viewHeaderLeft}>
        <TouchableOpacity
          onPress={() => {
            navigationData.navigation.pop();
          }}
        >
          <Image
            style={styles.menuImage}
            source={require('../../../assets/assets/Authentication/back.png')}
          />
        </TouchableOpacity>
      </View>
    ),
  };
};

// Set the components styles.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 40,
    width: 40,
  },
  amountView: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalAmountText: {
    margin: 16,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
  },
  totalAmountSubText: {
    margin: 16,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
  },
  buttonPlaceOrder: {
    margin: 64,
    marginTop: 24,
    fontSize: RFPercentage(2),
    backgroundColor: Colors.buttonColor,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  placeOrderText: {
    color: Colors.backgroundColor,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    // color: Colors.backgroundColor,
  },
  seperateLine: {
    backgroundColor: Colors.subViewBGColor,
    height: 1,
  },
  optionView: {
    // flex: 1,
    margin: 16,
    marginBottom: 8,
    borderColor: Colors.subTitleTextColor,
    borderWidth: 0.5,
    borderRadius: 10,
    height: 50,
  },
  selectedOptionView: {
    // flex: 1,
    margin: 16,
    marginBottom: 8,
    borderColor: Colors.primaryColor,
    borderWidth: 0.5,
    borderRadius: 10,
    height: 50,
  },
  row: {
    flex: 1,
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  titleText: {
    marginLeft: 16,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-SemiBold',
    color: Colors.textColor,
  },
  paymentImage: {
    height: 35,
    width: 35,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clickImage: {
    marginTop: 16,
    height: 50,
    width: 50,
  },
  errorText: {
    marginLeft: 16,
    marginTop: 14,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    // fontWeight: '500',
    color: Colors.errorColor,
    marginRight: 16,
  },
  homeButtonView: {
    margin: 16,
    fontSize: RFPercentage(2),
    backgroundColor: Colors.buttonColor,
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  popupView: {
    backgroundColor: Colors.backgroundColor,
    // height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth - 64,
    borderRadius: 10,
  },
});

export default CheckoutScreen;
