import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

// Import the Plugins and Thirdparty library.
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RFPercentage} from 'react-native-responsive-fontsize';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';

// Import the JS file.

import Colors from '../../../helper/extensions/Colors';
import {VehicleData} from '../../../helper/extensions/dummyData';
import * as addressDataActions from '../../../store/actions/addAddress/addressData';
import * as addAddressActions from '../../../store/actions/addAddress/addAddress';
import * as dropAddAddressActions from '../../../store/actions/addAddress/dropAddAddress';
import AppPreference from '../../../helper/preference/AppPreference';
import EmptyData from '../../../components/design/EmptyData';
import Loader from '../../../components/design/Loader';
import CHeader from '../../../components/CHeader';

// Load the main class.

const AddressScreen = props => {
  // const sourceData = props.navigation.getParam('source');
  // const destinationData = props.navigation.getParam('destination');
  // const statusAddAddress = props.navigation.getParam('statusAddAddress');
  // const isRefreshData = props.navigation.getParam('isRefreshData');

  const { statusAddAddress } = props?.route?.params || {};

  console.log('statusAddAddress', statusAddAddress);
  const addressData = useSelector(state => state.allAddressData.allAddressData);

  const isLoadingData = useSelector(
    state => state.allAddressData.isLoadingData,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    //console.log(`pickupAddressData:`, pickupAddressData)
    //console.log(`dropAddressData:`, dropAddressData)
    if (!addressData) {
      return;
    }
    for (let i = 0; i < addressData.length; i++) {
      let data = addressData[i];
      if (statusAddAddress === 'pickup') {
        if (data.id == dropAddressData.id) {
          addressData.splice(i, 1);
          break;
        }
      } else {
        if (data.id == pickupAddressData.id) {
          addressData.splice(i, 1);
          break;
        }
      }
    }
    console.log(`useEffect.addressData:`, addressData);
    setAddressList(addressData);
  }, [addressData]);

  const [addressList, setAddressList] = useState(true);

  const pickupAddressData = useSelector(
    state => state.pickupAddressData.pickupAddressData,
  );
  const dropAddressData = useSelector(
    state => state.dropAddressData.dropAddressData,
  );

  const fetchAddressList = () => {
    AsyncStorage.getItem(AppPreference.IS_LOGIN).then(valueLogin => {
      const isLogin = JSON.parse(valueLogin);
      console.log('Login Value is : ', isLogin);
      if (isLogin == 1) {
        AsyncStorage.getItem(AppPreference.LOGIN_UID).then(valueUID => {
          try {
            dispatch(addressDataActions.fetchAddressList(valueUID));
          } catch (err) {}
        });
      } else {
        // AsyncStorage.getItem(AppPreference.LOCAL_ADDRESS).then((valueLocalAddress) => {
        //   const localAddress = JSON.parse(valueLocalAddress);
        //   console.log('Local Address is : ', localAddress.length);
        // });
        try {
          dispatch(addressDataActions.fetchAddressList(''));
        } catch (err) {}
      }
    });

    // AsyncStorage.getItem(AppPreference.LOGIN_UID).then((valueUID) => {
    //   try {
    //     dispatch(addressDataActions.fetchAddressList(valueUID));
    //   } catch (err) {}
    // });
  };

  useEffect(() => {
    fetchAddressList();
    const willFocusSubscription = props.navigation.addListener(
      'focus',
      () => {
        fetchAddressList();
      },
    );

    return willFocusSubscription;
  }, [dispatch]);

  const onPressAddress = selectedData => {
    console.log(`onPressAddress`);
    if (statusAddAddress === 'pickup') {
      dispatch(
        addAddressActions.setPickupAddressData(
          selectedData.coordinates,
          selectedData.id,
          selectedData.first_name,
          selectedData.last_name,
          selectedData.email,
          selectedData.phone_number,
          selectedData.flat_name,
          selectedData.area,
          selectedData.city,
          selectedData.state,
          selectedData.country,
          selectedData.pincode,
          statusAddAddress,
          'nochange',
        ),
      );
      props.navigation.pop();
    } else {
      dispatch(
        dropAddAddressActions.setDropAddressData(
          selectedData.coordinates,
          selectedData.id,
          selectedData.first_name,
          selectedData.last_name,
          selectedData.email,
          selectedData.phone_number,
          selectedData.flat_name,
          selectedData.area,
          selectedData.city,
          selectedData.state,
          selectedData.country,
          selectedData.pincode,
          statusAddAddress,
          'nochange',
        ),
      );
      props.navigation.pop();
    }
  };

  const ListEmpty = () => {
    return (
      //View to show when list is empty
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Address not availbale</Text>
      </View>
    );
  };

  const openAddAddressScreen = addressData => {
    console.log(`addressData:`, addressData);
    // return
    props.navigation.navigate('AddAddressScreen', {
      statusAddAddress: statusAddAddress,
      isEdit: true,
      id: addressData.id,
      name: addressData.first_name,
      lastName: addressData.last_name,
      email: addressData.email,
      phone: addressData.phone_number,
      flat_name: addressData.flat_name,
      area: addressData.area,
      city: addressData.city,
      state: addressData.state,
      country: addressData.country,
      pincode: addressData.pincode,
      coordinate: addressData.coordinates,
    });
  };

  const renderAddressData = itemData => {
    return (
      <TouchableOpacity
        style={{margin: 16, marginBottom: -16}}
        onPress={() => {
          onPressAddress(itemData.item);
        }}
      >
        <View style={styles.locationView}>
          <Text style={{...styles.titleText, fontSize: RFPercentage(2.2)}}>
            {itemData.item.first_name + ' ' + itemData.item.last_name}
          </Text>
          <TouchableOpacity
            onPress={() => {
              openAddAddressScreen(itemData.item);
            }}
          >
            <Text style={styles.subTitleText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.locationText}>
          {itemData.item.flat_name +
            ', ' +
            itemData.item.area +
            ', ' +
            itemData.item.city +
            ', ' +
            itemData.item.state +
            ' - ' +
            itemData.item.pincode +
            '. ' +
            itemData.item.country}
        </Text>
        <Text style={styles.locationText}>{itemData.item.phone_number}</Text>
        <View style={styles.seperateLine} />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <CHeader navigation={props.navigation} isBackBtn={true} headerTitle={'Set Address'} />
      {/* <FlatList
        keyExtractor={(item, index) => item.id}
        data={addressData}
        renderItem={renderAddressData}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={addressData.length === 0 && ListEmpty}
      /> */}
      {addressList.length != 0 ? (
        <FlatList
          keyExtractor={(item, index) => item.id}
          data={addressList}
          renderItem={renderAddressData}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyData data={'Address'} />
      )}
      <TouchableOpacity
        style={styles.buttonBookNow}
        onPress={() => {
          props.navigation.navigate('AddAddressScreen', {
            statusAddAddress: statusAddAddress,
          });
        }}
      >
        <Text style={styles.bookNowText}>ADD NEW ADDRESS</Text>
      </TouchableOpacity>
      <Loader loading={isLoadingData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: Colors.backgroundColor,
    justifyContent: 'space-between',
  },
  viewHeaderLeft: {
    paddingLeft: 16,
  },
  backImage: {
    height: 40,
    width: 40,
  },
  locationView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontFamily: 'SofiaPro-SemiBold',
    fontSize: RFPercentage(2),
    color: Colors.textColor,
  },
  subTitleText: {
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(2),
    color: Colors.textColor,
  },
  locationText: {
    marginTop: 4,
    fontFamily: 'SofiaPro-Regular',
    fontSize: RFPercentage(1.8),
    color: Colors.otherTextColor,
  },
  seperateLine: {
    margin: 16,
    marginLeft: -16,
    marginRight: -16,
    backgroundColor: Colors.subViewBGColor,
    height: 1,
  },
  buttonBookNow: {
    margin: 16,
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
});

export default AddressScreen;
