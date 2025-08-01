import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView
} from 'react-native';
import {RFPercentage} from 'react-native-responsive-fontsize';
import {useSelector, useDispatch} from 'react-redux';

// Import the Plugins and Thirdparty library.
import Modal from 'react-native-modal';
import Menu, {MenuItem} from 'react-native-material-menu';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import TextInput from '../../../components/design/TextInput';
import AppConstants from '../../../helper/constants/AppConstants';

import {
  selectReasonValidator,
  reasonCommentValidator
} from '../../../helper/extensions/Validator';
import firestore from '@react-native-firebase/firestore';
import Loader from '../../../components/design/Loader';
import CHeader from '../../../components/CHeader';
import CModal from '../../../components/design/CModal';

// Load the main class.
const windowWidth = Dimensions.get('window').width;

const CancelOrderScreen = (props) => {
  
  const params = props?.route?.params;

  let orderData = params?.orderData;
  const refreshData = params?.refreshData;
  // console.log(`orderData:`, orderData)
  let orderIDValue = {value: '', error: ''}
  if (orderData != undefined) {
    orderIDValue = {value: `#${orderData.data.order_id}`, error: ''}
  }

  let userUID = useSelector(
    (state) => state.fetchProfileData.userUID,
  );
  // userUID = "B4Ti8IgLgpsKZECGqOJ0"
  console.log(`DriverDetailScreen.userUID: ${userUID}`)

  // console.log(`orderIDValue:`, orderIDValue)
  const [orderId, setOrderId] = useState(orderIDValue);
  const [selectReason, setSelectReason] = useState({value: '', error: ''});
  const [reasonTypeFlag, setReasonTypeFlag] = useState(false);
  const [comment, setComment] = useState({value: '', error: ''});
  const [popup, setPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  var _menu;
  const setMenuRef = (ref) => {
    _menu = ref;
  };

  const showMenu = () => {
    _menu.show();
  };

  const hideMenu = (popupName) => {
    _menu.hide();
    setReasonTypeFlag(true);
    setSelectReason({value: popupName, error: ''});
  };

  const onPressHomeButton = () => {
    setPopup(false);
    refreshData()
    props.navigation.goBack();
  };

  const rejectOrderTapHandler = () => {
    Keyboard.dismiss()
    const selectReasonError = selectReasonValidator(selectReason.value);
    const commentError = reasonCommentValidator(comment.value);

    if (selectReasonError) {
      setSelectReason({...selectReason, error: selectReasonError});
      return;
    } else if (commentError) {
      setComment({...comment, error: commentError});
      return;
    } else {
      setIsLoading(true)
      let rejectDetailsList = []
      let rejectDetailsData = {
        reason_type: selectReason.value,
        reason_comment: comment.value,
        rejected_by: userUID,
        user_type: 'customer',
        rejected_at: new Date()
      }
      
      let rejectDetails = orderData.reject_details
      console.log(`rejectDetails:`, rejectDetails)
      if (rejectDetails != undefined) {
        rejectDetailsList = [...rejectDetails]
      }
      rejectDetailsList.push(rejectDetailsData)

      console.log(`orderData.id:`, orderData.id)
      firestore()
      .collection('order_details')
      .doc(orderData.id)
      .update({status: 'rejected', reject_details: rejectDetailsList})
      .then(()=> {
          console.log(`order_details.updated`)
          // this.hideLoading()
          // this.props.onPressAcceptOrder()
          setIsLoading(false)
          setPopup(true);
      }).catch(error => {
          console.log(`order_details.error:`, error)
          setIsLoading(false)
      })
    }
  }

  const cancelOrderScreenView = () => {
    return (
      <View style={styles.container}>
        <CHeader navigation={props.navigation} isBackBtn={true} headerTitle={'Cancel Order'} />
        <ScrollView 
            style={styles.container}
            keyboardShouldPersistTaps={'handled'}
            automaticallyAdjustContentInsets={false}
            showsVerticalScrollIndicator={false}>
          <View style={{margin: 16}}>
            <TextInput
              label="Order id"
              returnKeyType="next"
              value={orderId.value}
              onChangeText={(text) => setOrderId(text)}
              error={orderId.error}
              errorText={orderId.errorText}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="default"
              ref={(ref) => {
                this._orderidinput = ref;
              }}
              onSubmitEditing={() =>
                this._selectReasoninput && this._selectReasoninput.focus()
              }
              editable={false}
            />
            <Menu
              ref={(ref) => setMenuRef(ref)}
              button={
                <View>
                  <TouchableOpacity style={styles.popupView} onPress={showMenu}>
                    <Text
                      style={
                        !reasonTypeFlag
                          ? styles.popupTextUnSelected
                          : styles.popupTextSelected
                      }>
                      {selectReason.value == '' ? 'Select reason' : selectReason.value}
                    </Text>
                  </TouchableOpacity>
                  {selectReason.error != '' ?
                  <Text style={styles.error}>{selectReason.error}</Text> : null
                  }
                </View>
              }>
              <MenuItem onPress={() => hideMenu('Change in delivery address')}>
                Change in delivery address
              </MenuItem>
              {/* <MenuItem onPress={() => hideMenu('Recipient not available')}>
                Driver is not available
              </MenuItem> */}
              <MenuItem onPress={() => hideMenu('Recipient not available')}>
                Recipient not available
              </MenuItem>
              <MenuItem onPress={() => hideMenu('Cash not available for COD')}>
                Cash not available for COD
              </MenuItem>
              <MenuItem onPress={() => hideMenu('Cheaper alternative available')}>
                Cheaper alternative available
              </MenuItem>
              {/* <MenuItem onPress={() => hideMenu('Bolero')}>Bolero</MenuItem> */}
            </Menu>
            <TextInput
              label="Describe your reason to cancel"
              returnKeyType="next"
              style={{ maxHeight: 160, backgroundColor: Colors.surfaceColor, textAlignVertical : 'top', paddingTop: 0, paddingBottom:0}}
              // textAlignVertical={'top'}
              value={comment.value}
              onChangeText={(text) => setComment({value: text, error: ''})}
              error={comment.error}
              errorText={comment.error}
              autoCapitalize="none"
              autoCompleteType="name"
              textContentType="name"
              keyboardType="default"
              /* ref={(ref) => {
                this._orderidinput = ref;
              }} */
              onSubmitEditing={() => {
                // Keyboard.dismiss()
              }}
              multiline
            />
          </View>
          <TouchableOpacity
            style={styles.buttonBookNow}
            onPress={() => {
              rejectOrderTapHandler()
            }}>
            <Text style={styles.bookNowText}>REJECT NOW</Text>
          </TouchableOpacity>
          
          <CModal visible={popup}>
            <View style={styles.centeredView}>
              <View style={styles.popupMessageView}>
                <Image
                  style={styles.clickImage}
                  source={require('../../../assets/assets/PlaceOrder/checkout_click.png')}
                />
                <Text style={{...styles.totalAmountText, textAlign: 'center'}}>
                  Your order has been successfully cancelled. Thank you for
                  choosing us
                </Text>
                <TouchableOpacity
                  style={styles.homeButtonView}
                  onPress={() => onPressHomeButton()}>
                  <Text style={styles.placeOrderText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </CModal>

          <Loader loading={isLoading} />
        </ScrollView>
      </View>
    );
  }
  
  return AppConstants.isAndroid ? (
    <View style={{ flex: 1 }}>{cancelOrderScreenView()}</View>
  ) : (
    <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: '#fff' }}
        behavior="padding"
        keyboardVerticalOffset={64}
        enabled>
        {cancelOrderScreenView()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mainBackgroundColor,
  },
  error: {
    fontSize: RFPercentage(2),
    // fontFamily: 'Roboto-Regular',
    color: Colors.errorColor,
    paddingHorizontal: 8,
    paddingTop: 8,
    marginBottom: 0
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  menuImage: {
    height: 40,
    width: 40,
  },
  popupView: {
    marginTop: 8,
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: 55,
    backgroundColor: Colors.backgroundColor,
    borderRadius: 5,
    borderColor: Colors.borderColor,
    borderWidth: 0.8,
  },
  popupTextUnSelected: {
    marginLeft: 12,
    marginRight: 12,
    color: 'gray',
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Regular',
  },
  popupTextSelected: {
    marginLeft: 12,
    marginRight: 12,
    color: Colors.titleTextColor,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Regular',
  },
  contectMenu: {
    marginTop: 16,
    flexDirection: 'row',
  },
  buttonBookNow: {
    margin: 64,
    marginLeft: 64,
    marginRight: 64,
    fontSize: RFPercentage(2),
    fontFamily: 'SofiaPro-Medium',
    backgroundColor: Colors.buttonColor,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  bookNowText: {
    fontFamily: 'SofiaPro-Medium',
    color: Colors.backgroundColor,
    fontSize: RFPercentage(2),
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
  popupMessageView: {
    backgroundColor: Colors.backgroundColor,
    // height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth - 64,
    borderRadius: 10,
  },
  placeOrderText: {
    color: Colors.backgroundColor,
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    // color: Colors.backgroundColor,
  },
});

export default CancelOrderScreen;
