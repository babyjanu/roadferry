import PickupAddAddress from '../../../helper/models/addAddress/PickupAddAddress';
import DropAddAddress from '../../../helper/models/addAddress/DropAddAddress';

export const SET_ADDRESS_DATA = 'SET_ADDRESS_DATA';
import firestore from '@react-native-firebase/firestore';
import auth, {firebase} from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppPreference from '../../../helper/preference/AppPreference';

export const setPickupAddressData = (
  coordinates,
  id,
  firstName,
  lastName,
  email,
  phone,
  flatName,
  area,
  city,
  state,
  country,
  pincode,
  status,
  flag,
  UID,
  isEdit,
) => {
  if (isEdit == undefined) {
    isEdit = false;
  }
  //console.log(`coordinates:`, coordinates)
  return async dispatch => {
    // any async code you want!
    //   if (status === 'pickup') {
    //console.log('ENTER');
    const loadedPickupAddressData = new PickupAddAddress(
      coordinates,
      id,
      firstName,
      lastName,
      email,
      phone,
      flatName,
      area,
      city,
      state,
      country,
      pincode,
    );

    if (flag === 'no') {
      AsyncStorage.getItem(AppPreference.LOCAL_ADDRESS).then(
        valueLocalAddress => {
          // const localAddress = JSON.parse(valueLocalAddress);
          // console.log(`valueLocalAddress.update: `, valueLocalAddress)
          let allLocalAddressData = [];
          if (valueLocalAddress != null) {
            allLocalAddressData = JSON.parse(valueLocalAddress);
          }

          if (isEdit) {
            for (let i = 0; i < allLocalAddressData.length; i++) {
              let addressData = allLocalAddressData[i];
              if (addressData.id == loadedPickupAddressData.id) {
                allLocalAddressData[i] = loadedPickupAddressData;
                break;
              }
            }
          } else {
            allLocalAddressData.push(loadedPickupAddressData);
          }
          AsyncStorage.setItem(
            AppPreference.LOCAL_ADDRESS,
            JSON.stringify(allLocalAddressData),
          );
        },
      );
    }

    if (flag === 'yes') {
      if (isEdit) {
        firebase
          .firestore()
          .collection('users')
          .doc(UID)
          .collection('address_details')
          .get()
          .then(querySnapshot => {
            if (querySnapshot.size) {
              // address_details is present then update or add
              firebase
                .firestore()
                .collection('users')
                .doc(UID)
                .collection('address_details')
                .doc(id)
                .update({
                  coordinates: coordinates,
                  first_name: firstName,
                  last_name: lastName,
                  email: email,
                  phone_number: phone,
                  flat_name: flatName,
                  area: area,
                  city: city,
                  state: state,
                  country: country,
                  pincode: pincode,
                });
            } else {
              firebase
                .firestore()
                .collection('users')
                .doc(UID)
                .collection('address_details')
                .add({
                  coordinates: coordinates,
                  first_name: firstName,
                  last_name: lastName,
                  email: email,
                  phone_number: phone,
                  flat_name: flatName,
                  area: area,
                  city: city,
                  state: state,
                  country: country,
                  pincode: pincode,
                });
            }
          })
          .catch(error => {
            console.log(`add_address(address_details) error: ${error}`);
          });
      } else {
        firebase
          .firestore()
          .collection('users')
          .doc(UID)
          .collection('address_details')
          .add({
            coordinates: coordinates,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone_number: phone,
            flat_name: flatName,
            area: area,
            city: city,
            state: state,
            country: country,
            pincode: pincode,
          });
      }
    }

    dispatch({
      type: SET_ADDRESS_DATA,
      pickupAddressData: loadedPickupAddressData,
      // dropAddressData: loadedDropAddressData,
    });
    //   } catch (err) {
    //     throw err;
    //     //   throw new Error(err, 0);
    //   }
  };
};
