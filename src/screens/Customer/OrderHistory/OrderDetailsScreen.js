import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useSelector, useDispatch } from 'react-redux';
import firestore from '@react-native-firebase/firestore';

// Import the Plugins and Thirdparty library.
import Modal from 'react-native-modal';
import RazorpayCheckout from 'react-native-razorpay';
// Import the JS file.
import {Menu, MenuItem} from 'react-native-material-menu';
import Colors from '../../../helper/extensions/Colors';
import { OrderDetailsOptions, paymentOptionsArr } from '../../../helper/extensions/dummyData';
import ParcelOptionsData from '../../../components/Customer/AddParcelDetails/ParcelOptionsData';
import Loader from '../../../components/design/Loader';
import CHeader from '../../../components/CHeader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { updateOrderDetail_fs } from '../../../helper/Utils/fireStoreUtils';
import { RazorpayCreateOrderApi, WidthPercentage, razorpayPreOptions, rupeeToPaisa } from '../../../helper/extensions/Util';
import PriceView from '../../../components/Customer/PriceView';
import { useFocusEffect } from '@react-navigation/core';

const windowWidth = Dimensions.get('window').width;

const OrderDetailsScreen = (props) => {
  const params = props?.route?.params;

  const orderID = params?.selectedOrderData?.id;
  const orderData = params?.selectedOrderData;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMode, setPaymentMode] = useState(paymentOptionsArr[0]);
  const [paymentDetails, setPaymentDetails] = useState(null);

  let userUID = useSelector(state => state.fetchProfileData.userUID);
  let userProfileData = useSelector(
    state => state.fetchProfileData.fetchProfileData,
  );
  const pickupAddressData = useSelector(
    (state) => state.pickupAddressData.pickupAddressData,
  );
  const dropAddressData = useSelector(
    (state) => state.dropAddressData.dropAddressData,
  );

  const [selectedOrderData, setSelectedOrderData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (orderID) {
      try {
        setIsLoading(true)
        firestore()
          .collection('order_details')
          .doc(orderID)
          .onSnapshot((querySnapshot) => {
            // console.log('querySnapshot: ', querySnapshot);
            let tSelectedOrderData = { id: querySnapshot?.id, data: querySnapshot?.data() }
            setSelectedOrderData(tSelectedOrderData)
            setIsLoading(false)
          });
      } catch (err) {
        console.log(`error:`,err)
        setIsLoading(false)
      }
    }
  }, [orderID]);

  useEffect(() => {
    if (orderData) {
      setSelectedOrderData(orderData)
    }
  }, [orderData])

  const renderDetailsOption = (itemData) => {
    return (
      <TouchableOpacity
        style={styles.optionRow}
        onPress={() => setSelectedIndex(itemData.item.id)}>
        <Text
          style={
            selectedIndex === itemData.item.id
              ? styles.titleText
              : styles.subTitleText
          }>
          {itemData.item.title}
        </Text>
        <View
          style={
            selectedIndex === itemData.item.id
              ? styles.activeDotView
              : styles.unActiveDotView
          }
        />
      </TouchableOpacity>
    );
  };

  const handlePaymentSelection = item => {
    // console.log('payment selected: ', item);
    if(item?.name === paymentOptionsArr[0]?.name){ // when selecting "COD" payment option
      updateOrderDetail_fs(selectedOrderData?.id, { payment_mode: item?.value }).then(() => {
        setPaymentMode(item);
        setShowPaymentOptions(!showPaymentOptions);
      });
    } else {
      setPaymentMode(item);
      setShowPaymentOptions(!showPaymentOptions);
    }
  };

  const handlePayNowBtnClick = async() => {
    setIsLoading(true);
    let rp_orderRes = await RazorpayCreateOrderApi(selectedOrderData?.data?.price); // amount should be passed in rupee

    if(!rp_orderRes && !rp_orderRes?.id){
      setIsLoading(false);
      Alert.alert('Something went wrong! Please try again later.');
      return;
    }
    
    let options = {
      ...razorpayPreOptions,
      amount: rupeeToPaisa(selectedOrderData?.data?.price),
      order_id: __DEV__ ? '' : rp_orderRes?.id ?? '',
      prefill: {
        email: userProfileData?.email,
        contact: userProfileData?.phone_number,
        name: `${userProfileData?.first_name} ${userProfileData?.last_name}`,
      },
    };
    
    RazorpayCheckout.open(options)
      .then(data => {
        setIsLoading(false);
        // console.log((`Success: ${data.razorpay_payment_id}`));
        if (data?.razorpay_payment_id) {
          let _obj = {
            is_paymentReceived: true,
            payment_mode: paymentMode?.value,
            payment_details: { ...data },
          };
          updateOrderDetail_fs(selectedOrderData?.id, _obj).then(() => {
            setPaymentDetails({status: 'success', ...data});
          });
        } else {
          setPaymentDetails({status: 'error'});
        }
      })
      .catch(error => {
        console.log('RazorpayCheckout.error: ', error);
        if(error?.error?.source == "customer" && error?.error?.reason == "payment_cancelled"){
          Alert.alert('You have cancelled the payment.');
        } else{
          Alert.alert('Something went wrong! Please try again later.');
        }
        setIsLoading(false);
      });
  };

  const showPaymentStatusView = () => {
    const ispaymentSuccess = paymentDetails?.status.toLowerCase() === 'success'.toLowerCase() ? true : false ;
    const src = ispaymentSuccess ? 
      require('../../../assets/assets/transactionSuccess.png') : 
      require('../../../assets/assets/transactionFailed.png');
    const statusTxt = ispaymentSuccess ?
     'Payment Successful!' :
     'Payment Failed!';
    const statusDescTxt = ispaymentSuccess ?
      `Transaction Id is ${paymentDetails?.razorpay_payment_id}`
      : `You can try again or choose to pay with Cash(Cash on Delivery).`; 
    return (
      <View
        style={{
          padding: 12,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={src}
          style={styles.paymentStatusImg}
          resizeMode="contain"
        />
        <Text
          style={{
            marginTop: 4,
            fontWeight: 'bold',
            fontSize: 14,
          }}
        >
          {statusTxt}
        </Text>
        <Text
          style={{
            marginTop: 4,
            fontWeight: 'bold',
            fontSize: 14,
          }}
        >
          {statusDescTxt}
        </Text>
        {!ispaymentSuccess ? <TouchableOpacity
          style={styles.buttonView}
          onPress={() => handleTryAgainBtnClick()}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity> : null }
      </View>
    );
  };

  const openGoogleMaps = (orderData) => {
    const { data } = orderData
    const { pickup_location, drop_location } = data
    if (
      (pickup_location.coordinate.latitude != undefined && pickup_location.coordinate.longitude != undefined) && 
      (drop_location.coordinate.latitude != undefined && drop_location.coordinate.longitude != undefined)
    ) {
        let url = `https://www.google.com/maps/dir/?api=1&origin=${pickup_location?.coordinate?.latitude},${pickup_location?.coordinate?.longitude}&destination=${drop_location?.coordinate?.latitude},${drop_location?.coordinate?.longitude}`
        Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <CHeader navigation={props.navigation} isBackBtn={true} headerTitle={'Order Details'} />
      <View>
        <FlatList
          horizontal
          keyExtractor={(item, index) => item.id}
          data={OrderDetailsOptions}
          renderItem={renderDetailsOption}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <ScrollView style={{ margin: 16, marginTop: 0 }}>
        {selectedIndex === 0 && selectedOrderData && (
          <View style={styles.greyRoundedContainer}>
            <ParcelOptionsData
              optionTitle="Tracking Id"
              optionTitleValue={selectedOrderData?.data?.order_id}
            />
            <ParcelOptionsData
              optionTitle="Items"
              optionTitleValue={selectedOrderData?.data?.pickup_location?.sending}
            />
            <ParcelOptionsData
              optionTitle="Parcel Value"
              optionTitleValue={selectedOrderData?.data?.pickup_location?.parcel_value}
            />
            <ParcelOptionsData
              optionTitle="Parcel Weight"
              optionTitleValue={selectedOrderData?.data?.pickup_location?.weight + ' Tons'}
            />
            <ParcelOptionsData
              optionTitle="Parcel LWH"
              optionTitleValue={
                selectedOrderData?.data?.pickup_location?.dimensions +
                ' feet * ' +
                selectedOrderData?.data?.pickup_location?.width +
                ' feet *' +
                selectedOrderData?.data?.pickup_location?.height +
                ' feet '
              }
              cm
            />
            <ParcelOptionsData
              optionTitle="Vehicle"
              optionTitleValue={
                selectedOrderData?.data?.vehicle_type
              }
            />
            {(selectedOrderData?.data?.status != 'pending' && selectedOrderData?.data?.status != 'rejected') && selectedOrderData?.data?.vehicle_details?.vehicle_number &&
              <ParcelOptionsData
                optionTitle="Vehicle Number"
                optionTitleValue={selectedOrderData?.data?.vehicle_details?.vehicle_number}
              />}
            <ParcelOptionsData
              optionTitle="Pickup Date and Time"
              optionTitleValue={selectedOrderData?.data?.pickup_location?.pickup_date_time}
            />
            {selectedOrderData?.data?.pickup_location?.comment ? 
              <ParcelOptionsData
                optionTitle="Comment"
                optionTitleValue={selectedOrderData?.data?.pickup_location?.comment}
              /> : null
            }
            {(selectedOrderData?.data?.status != 'pending' && selectedOrderData?.data?.status != 'rejected') ?
              <View>
                {selectedOrderData?.data?.driver_details?.user_uid == selectedOrderData?.data?.transporter_uid ?
                  <View>
                    <ParcelOptionsData
                      optionTitle="Transporter/Driver Name"
                      optionTitleValue={selectedOrderData?.data?.transporter_details?.first_name + ' ' + selectedOrderData?.data?.transporter_details?.last_name}
                    />
                    <ParcelOptionsData
                      optionTitle="Transporter/Driver Contact Number"
                      openDialer={true}
                      optionTitleValue={selectedOrderData?.data?.transporter_details?.phone_number}
                    />
                  </View>
                  :
                  <View>
                    <ParcelOptionsData
                      optionTitle="Transporter Name"
                      optionTitleValue={selectedOrderData?.data?.transporter_details?.first_name + ' ' + selectedOrderData?.data?.transporter_details?.last_name}
                    />
                    <ParcelOptionsData
                      optionTitle="Transporter Contact Number"
                      openDialer={true}
                      optionTitleValue={selectedOrderData?.data?.transporter_details?.phone_number}
                    />
                    {(selectedOrderData?.data?.status != 'pending' && selectedOrderData?.data?.status != 'rejected') && selectedOrderData?.data?.driver_details?.first_name &&
                      <ParcelOptionsData
                        optionTitle="Driver Name"
                        optionTitleValue={selectedOrderData?.data?.driver_details?.first_name + ' ' + selectedOrderData?.data?.driver_details?.last_name}
                      />}
                    {(selectedOrderData?.data?.status != 'pending' && selectedOrderData?.data?.status != 'rejected') && selectedOrderData?.data?.driver_details?.phone_number &&
                      <ParcelOptionsData
                        optionTitle="Driver Contact Number"
                        openDialer={true}
                        optionTitleValue={selectedOrderData?.data?.driver_details?.phone_number}
                      />}
                  </View>
                }
              </View>
              :
              <View>
                {selectedOrderData?.data?.transporter_details?.first_name &&
                <ParcelOptionsData
                  optionTitle="Transporter Name"
                  optionTitleValue={selectedOrderData?.data?.transporter_details?.first_name + ' ' + selectedOrderData?.data?.transporter_details?.last_name}
                />}
                {selectedOrderData?.data?.transporter_details?.phone_number &&
                <ParcelOptionsData
                  optionTitle="Transporter Contact Number"
                  openDialer={true}
                  optionTitleValue={selectedOrderData?.data?.transporter_details?.phone_number}
                />}
              </View>
            }
          </View>
        )}
        {selectedIndex === 1 && selectedOrderData && (
          <TouchableOpacity style={styles.greyRoundedContainer} activeOpacity={0.7} onPress={() => openGoogleMaps(selectedOrderData)}>
            <View>
              <Text style={styles.locationTitleText}>Pickup Point</Text>
              <View style={{ marginTop: 8 }}>
                <View style={styles.locationView}>
                  <Text
                    style={{ ...styles.titleText, fontSize: RFPercentage(2.2) }}>
                    {selectedOrderData?.data?.pickup_location?.first_name +
                      ' ' +
                      selectedOrderData?.data?.pickup_location?.last_name}
                  </Text>
                </View>
                <Text style={styles.locationText}>
                  {selectedOrderData?.data?.pickup_location?.flat_name +
                    ', ' +
                    selectedOrderData?.data?.pickup_location?.area +
                    ', ' +
                    selectedOrderData?.data?.pickup_location?.city +
                    ', ' +
                    selectedOrderData?.data?.pickup_location?.state +
                    ' - ' +
                    selectedOrderData?.data?.pickup_location?.pincode +
                    '. ' +
                    selectedOrderData?.data?.pickup_location?.country}
                </Text>
                <Text style={styles.locationText}>
                  {selectedOrderData?.data?.pickup_location?.phone_number}
                </Text>
              </View>
            </View>
            
            <View style={{ marginTop: 16 }}>
              <Text style={styles.locationTitleText}>Drop Point</Text>
              <View style={{ marginTop: 8 }}>
                <View style={styles.locationView}>
                  <Text
                    style={{ ...styles.titleText, fontSize: RFPercentage(2.2) }}>
                    {selectedOrderData.data.drop_location.first_name +
                      ' ' +
                      selectedOrderData.data.drop_location.last_name}
                  </Text>
                </View>
                <Text style={styles.locationText}>
                  {selectedOrderData.data.drop_location.flat_name +
                    ', ' +
                    selectedOrderData.data.drop_location.area +
                    ', ' +
                    selectedOrderData.data.drop_location.city +
                    ', ' +
                    selectedOrderData.data.drop_location.state +
                    ' - ' +
                    selectedOrderData.data.drop_location.pincode +
                    '. ' +
                    selectedOrderData.data.drop_location.country}
                </Text>
                <Text style={styles.locationText}>
                  {selectedOrderData.data.drop_location.phone_number}
                </Text>
              </View>
            </View>
            
            {selectedOrderData.data.distance != undefined &&
              <View style={{ marginTop: 16, borderTopColor: Colors.horizontalSeperatorColor, borderTopWidth: 1, alignItems: 'center', paddingVertical: 18 }}>
                <Text style={styles.locationTitleText}>Total Distance</Text>
                <Text
                  style={{ ...styles.titleText, fontSize: RFPercentage(2.2) }}>{selectedOrderData.data.distance} KM</Text>
              </View>
            }
          </TouchableOpacity>
        )}
        {selectedIndex === 2 && selectedOrderData && (
          <View style={styles.greyRoundedContainer}>
            <ParcelOptionsData
              optionTitle="Payment method"
              optionTitleValue={selectedOrderData?.data?.payment_mode}
            />
            <ParcelOptionsData
              optionTitle="Total amount"
              optionTitleValue={'₹' + selectedOrderData?.data?.price}
            />
            {selectedOrderData?.data?.payment_mode !== "COD" ?
              <ParcelOptionsData
                optionTitle="Payment Transaction Id"
                optionTitleValue={selectedOrderData?.data?.payment_details?.merchantTransactionId ?? selectedOrderData?.data?.payment_details?.razorpay_payment_id}
              /> : null
            }
          </View>
        )}

        {!selectedOrderData?.data?.is_paymentReceived ? 
          <View style={{ ...styles.greyRoundedContainer, paddingVertical: 0, marginVertical: 12 }}>
            {/* <PriceView price={selectedOrderData?.data?.price} showPaymentMode={true} /> */}
            {selectedIndex !== 2 && 
              <ParcelOptionsData
                optionTitle="Total amount"
                optionTitleValue={'₹' + selectedOrderData?.data?.price}
              />
            }

            {!paymentDetails ? (
              <>
                <View style={styles.paymentModeContainer}>
                  <Text 
                    style={{
                      fontFamily: 'SofiaPro-Regular',
                      fontSize: RFPercentage(2),
                      color: Colors.otherTextColor,
                      flex: 0.5,
                    }}
                  >
                    Payment mode
                  </Text>
                  
                  <Menu
                    visible={showPaymentOptions}
                    anchor={
                      <TouchableOpacity
                        style={{ ...styles.selectionContainer, marginTop: selectedIndex !== 2 ? 0 : 12,}}
                        onPress={() =>
                          setShowPaymentOptions(!showPaymentOptions)
                        }
                      >
                        <MaterialCommunityIcons
                          name={'chevron-down'}
                          size={24}
                          color={'grey'}
                          style={{
                            marginHorizontal: 4,
                          }}
                        />
                        <Text style={styles.txt}>{paymentMode?.name}</Text>
                      </TouchableOpacity>
                    }
                    onRequestClose={() =>
                      setShowPaymentOptions(!showPaymentOptions)
                    }
                  >
                    {paymentOptionsArr.map((item, index) => {
                      return (
                        <MenuItem
                          style={styles.modalTxt}
                          onPress={() => handlePaymentSelection(item)}
                        >
                          {item?.name}
                        </MenuItem>
                      );
                    })}
                  </Menu>
                </View>

                {paymentMode?.name !== 'Cash' ? (
                  <TouchableOpacity
                    style={styles.buttonView}
                    onPress={() => handlePayNowBtnClick()}
                  >
                    <Text style={styles.buttonText}>Pay Now</Text>
                  </TouchableOpacity>
                ) : null}
              </>
            ) : (
              showPaymentStatusView()
            )}
          </View> : null
        }
        
      </ScrollView>
      <Loader loading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  greyRoundedContainer: {
    backgroundColor: '#F7F7F7',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12 
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 40,
    width: 40,
  },
  optionRow: {
    margin: 16,
    // height: 40,
    // marginRight: 0,
    // backgroundColor: Colors.backgroundColor,
  },
  titleText: {
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-SemiBold',
  },
  subTitleText: {
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: Colors.subTitleTextColor,
  },
  activeDotView: {
    marginTop: 8,
    height: 3,
    width: 25,
    backgroundColor: Colors.primaryColor,
    borderRadius: 5,
  },
  unActiveDotView: {
    marginTop: 8,
    height: 3,
    width: 25,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 5,
  },
  locationTitleText: {
    color: Colors.primaryColor,
    fontSize: RFPercentage(2.2),
    fontFamily: 'SofiaPro-SemiBold',
  },
  locationView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationText: {
    marginTop: 4,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.8),
    color: Colors.otherTextColor,
  },
  //
  paymentStatusImg: {
    width: 40,
    height: 40,
    // borderRadius: 20,
  },
  paymentModeContainer: {
    flex: 1,
    flexDirection: 'row',
    // width: WidthPercentage(100),
    // alignItems: 'center',
    // paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  headerTxt: {
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
    fontWeight: '700',
  },
  txt: {
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: Colors.titleTextColor,
  },
  modalTxt: {
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: 'white',
  },
  selectionContainer: {
    // width: WidthPercentage(55),
    borderColor: 'grey',
    alignItems: 'center',
    borderWidth: 0.5,
    // marginVertical: 4,
    paddingEnd: 8,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
  },
  buttonView: {
    margin: 16,
    width: 200,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Medium',
    backgroundColor: Colors.buttonColor,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 30,
  },
  buttonText: {
    fontFamily: 'SofiaPro-Medium',
    color: Colors.backgroundColor,
    fontSize: RFPercentage(2),
  },
});

export default OrderDetailsScreen;
