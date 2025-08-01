import firestore from '@react-native-firebase/firestore';

export const SET_ADDRESS_LIST = 'SET_ADDRESS_LIST';
export const IS_LOADING_DATA = 'IS_LOADING_DATA';
import AppPreference from '../../../helper/preference/AppPreference';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchAddressList = (valueUID) => {
  return async (dispatch) => {
    // any async code you want!
    try {
      const loadedAddressData = [];
      if (valueUID) {
        dispatch({
          type: IS_LOADING_DATA,
          isLoadingData: true,
        });

        firestore()
        .collection('users')
        .doc(valueUID)
        .collection('address_details')
        .get()
        .then((querySnapshot) => {
          console.log('Total address data: ', querySnapshot.size);
          querySnapshot.forEach((documentSnapshot) => {
            let addressData = documentSnapshot.data()
            addressData.id = documentSnapshot.id
            loadedAddressData.push(documentSnapshot.data());
          });
          console.log(`fetchAddressList.loadedAddressData:`, loadedAddressData)
          dispatch({
            type: SET_ADDRESS_LIST,
            allAddressData: loadedAddressData,
            isLoadingData: false
          });
        })
        .catch((error) =>{
          console.log(`error: ${error}`)
          dispatch({
            type: IS_LOADING_DATA,
            isLoadingData: false,
          });
        });
      }
      else{
        AsyncStorage.getItem(AppPreference.LOCAL_ADDRESS).then((valueLocalAddress) => {
          const loadedAddressData = JSON.parse(valueLocalAddress);
          console.log('Total address data: ', loadedAddressData);
          if (!loadedAddressData)
          {
            loadedAddressData = [];
          }
          dispatch({
            type: SET_ADDRESS_LIST,
            allAddressData: loadedAddressData,
          });
        }); 
      }
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};
