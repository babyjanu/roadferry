import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RFPercentage, WidthPercentage} from '../../helper/extensions/Util';
import Colors from '../../helper/extensions/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CModal from '../design/CModal';
import {updateOrderDetail_fs} from '../../helper/Utils/fireStoreUtils';
import {useSelector} from 'react-redux';
import {Menu, MenuItem} from 'react-native-material-menu';
import AppConstants from '../../helper/constants/AppConstants';

const windowWidth = Dimensions.get('window').width;
const paymentOptionsArr = [
  {
    id: 1,
    name: 'Cash',
    value: 'COD',
  },
  {
    id: 2,
    name: 'UPI/Card/NetBanking',
    value: 'UPI/Card/NetBanking',
  },
];

const PriceView = ({price, showPaymentMode = false}) => {
  const [priceValue, setPriceValue] = useState(price || 0);
  const [showOptions, setShowOptions] = useState(false);
  const [paymentMode, setPaymentMode] = useState(paymentOptionsArr[0]);

  const activeOrder = useSelector(
    state => state?.placeOrderReducer?.activeOrder,
  );
  const destinationAllData = useSelector(
    state => state.setDestinationTextValue.destinationAllData,
  );
  const sourceAllData = useSelector(
    state => state.setSourceTextValue.sourceAllData,
  );

  useEffect(() => {
    /* fetchDistanceBetweenPoints(
      sourceAllData?.coordinates?.latitude,
      sourceAllData?.coordinates?.longitude,
      destinationAllData?.coordinates?.latitude,
      destinationAllData?.coordinates?.longitude,
    ).then(res => {
      if(res){
        setPriceValue(res);
      }
    }); */
  }, [sourceAllData, destinationAllData]);

  const fetchDistanceBetweenPoints = async (lat1, lng1, lat2, lng2) => {
    return new Promise((resolve, reject) => {
      let urlToFetchDistance =
        'https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=' +
        lat1 +
        ',' +
        lng1 +
        '&destinations=' +
        lat2 +
        '%2C' +
        lng2 +
        '&key=' +
        AppConstants.google_place_api_key; // + '&mode=driving';
      fetch(urlToFetchDistance)
        .then(res => {
          return res.json();
        })
        .then(res => {
          if (res) {
            let tDistanceValue = res.rows[0].elements[0].distance.value;
            let finalDistanceValue = (
              ((tDistanceValue / 1000) * 10) /
              10
            ).toFixed(2);
            resolve(finalDistanceValue);
          } else {
            resolve(false);
          }
        })
        .catch(error => {
          console.log('Problem occurred: ', error);
          resolve(false);
        });
    });
  };

  const handlePaymentSelection = item => {
    console.log('payment selected: ', item);
    console.log('activeOrder: ', activeOrder);
    setPaymentMode(item);
    setShowOptions(!showOptions);
    updateOrderDetail_fs(activeOrder?.orderId, {payment_mode: item?.value});
  };

  return (
    <View style={styles.container}>
      {!showPaymentMode ? <View style={styles.bar} /> : null}

      <View style={styles.subContainer}>
        <View style={styles.priceContainer}>
          <View style={styles.priceView}>
            <Text style={styles.headerTxt}>Price</Text>
            {/* <TouchableOpacity>
              <Text style={{...styles.txt, color: Colors.primaryColor}}>
                View Price Breakup
              </Text>
            </TouchableOpacity> */}
          </View>

          <Text style={{...styles.txt, marginTop: 2}}>
            ₹ {priceValue} (Approx.)
          </Text>
        </View>

        {/* {showPaymentMode ? (
          <View style={styles.paymentModeContainer}>
            <Text style={styles.headerTxt}>Payment mode</Text>
            <Menu
              visible={showOptions}
              anchor={
                <TouchableOpacity
                  style={styles.selectionContainer}
                  onPress={() => setShowOptions(!showOptions)}
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
              onRequestClose={() => setShowOptions(!showOptions)}
            >
              {paymentOptionsArr.map((item, index) => {
                  return (
                    <MenuItem style={styles.modalTxt} onPress={() => handlePaymentSelection(item)}>
                      {item?.name}
                    </MenuItem>
                  );
                })}
            </Menu>
          </View>
        ) : null} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: WidthPercentage(100),
    paddingVertical: 12,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: 'white',
  },
  bar: {
    marginVertical: 10,
    alignSelf: 'center',
    padding: 2,
    paddingHorizontal: 22,
    borderRadius: 4,
    backgroundColor: 'lightgrey',
  },
  priceContainer: {},
  subContainer: {
    paddingHorizontal: 16,
  },
  selectionContainer: {
    borderColor: 'grey',
    alignItems: 'center',
    borderWidth: 0.5,
    marginVertical: 4,
    paddingVertical: 2,
    borderRadius: 6,
    //   paddingHorizontal: 4,
    flexDirection: 'row',
  },
  priceView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentModeContainer: {
    width: WidthPercentage(50),
    marginTop: 16,
    // marginBottom: 2,
    justifyContent: 'flex-start',
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
  //
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsContainer: {
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth - 64,
    borderRadius: 10,
    paddingVertical: 12,
  },
  txtContainer: {
    marginVertical: 10,
    fontSize: RFPercentage(2),
    backgroundColor: Colors.buttonColor,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: windowWidth / 2,
  },
  modalTxt: {
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: 'white',
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
});

export default PriceView;
