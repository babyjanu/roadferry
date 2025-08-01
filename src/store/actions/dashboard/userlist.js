import {PermissionsAndroid, Platform, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import UserList from '../../../helper/models/dashboard/UserList';
import Geolocation from '@react-native-community/geolocation';

export const SET_USER_LIST = 'SET_USER_LIST';
import {getDistance, getPreciseDistance} from 'geolib';
import AppPreference from '../../../helper/preference/AppPreference';

export const fetchUserList = (currentLat, currentLong) => {
  return async (dispatch) => {
    // any async code you want!
    try {
      // console.log('<<< BackgroundLocationTask');
      // var that = this;
      // //Checking for the permission just after component loaded
      // if (Platform.OS === 'ios') {
      //   // callLocation(that);
      //   Geolocation.getCurrentPosition(
      //     //Will give you the current location
      //     (position) => {
      //       const currentLongitude = position.coords.longitude;
      //       //getting the Longitude from the location json
      //       const currentLatitude = position.coords.latitude;
      //       //getting the Latitude from the location json
      //       console.log(
      //         '<<< LAT/LAN' + currentLatitude + ', ' + currentLongitude,
      //       );
      //       // getNearByTraspoterlist(currentLatitude, currentLongitude);
      //       currentLat = currentLatitude;
      //       currentLong = currentLongitude;
      //     },
      //     // (error) => alert(error.message),
      //     // {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      //   );
      //   that.watchID = Geolocation.watchPosition((position) => {
      //     //Will give you the location on location change
      //     console.log(position);
      //     const currentLongitude = position.coords.longitude;
      //     //getting the Longitude from the location json
      //     const currentLatitude = position.coords.latitude;
      //     //getting the Latitude from the location json
      //     console.log(
      //       '<<< LAT/LAN' + currentLatitude + ', ' + currentLongitude,
      //     );
      //     // getNearByTraspoterlist(currentLatitude, currentLongitude);
      //     currentLat = currentLatitude;
      //     currentLong = currentLongitude;
      //   });
      // } else {
      //   async function requestLocationPermission() {
      //     try {
      //       const granted = await PermissionsAndroid.request(
      //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      //         {
      //           title: 'Location Access Required',
      //           message: 'This App needs to Access your location',
      //         },
      //       );
      //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      //         //To Check, If Permission is granted
      //         // callLocation(that);
      //         Geolocation.getCurrentPosition(
      //           //Will give you the current location
      //           (position) => {
      //             const currentLongitude = position.coords.longitude;
      //             //getting the Longitude from the location json
      //             const currentLatitude = position.coords.latitude;
      //             //getting the Latitude from the location json
      //             console.log(
      //               '<<< LAT/LAN' + currentLatitude + ', ' + currentLongitude,
      //             );
      //             // getNearByTraspoterlist(currentLatitude, currentLongitude);
      //             currentLat = currentLatitude;
      //             currentLong = currentLongitude;
      //           },
      //           // (error) => alert(error.message),
      //           // {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      //         );
      //         that.watchID = Geolocation.watchPosition((position) => {
      //           //Will give you the location on location change
      //           console.log(position);
      //           const currentLongitude = position.coords.longitude;
      //           //getting the Longitude from the location json
      //           const currentLatitude = position.coords.latitude;
      //           //getting the Latitude from the location json
      //           console.log(
      //             '<<< LAT/LAN' + currentLatitude + ', ' + currentLongitude,
      //           );
      //           // getNearByTraspoterlist(currentLatitude, currentLongitude);
      //           currentLat = currentLatitude;
      //           currentLong = currentLongitude;
      //         });
      //       } else {
      //         Alert.alert('Permission Denied');
      //       }
      //     } catch (err) {
      //       Alert.alert('err', err);
      //       console.warn(err);
      //     }
      //   }
      //   requestLocationPermission();
      // }
      const loadedUserData = [];
      // console.log('check');
      firestore()
        .collection('users')
        .orderBy('priority', 'asc')
        .get()
        .then((querySnapshot) => {
          // console.log('Total users: ', querySnapshot.size);
          querySnapshot.forEach((documentSnapshot) => {
            /* console.log(
              'User data: ',
              documentSnapshot.id,
              documentSnapshot.data(),
            ); */

            var transporterData = documentSnapshot.data();
            if (transporterData.user_type === 'transporter') {
              var address = transporterData.address
              if (address.coordinates != undefined) {
                // console.log('Latitude is : ', documentSnapshot.get('address'));
                // console.log('Coordinate is : ', address.coordinates.latitude);

                var distance = getPreciseDistance(
                  {latitude: currentLat, longitude: currentLong},
                  {
                    latitude: address.coordinates.latitude,
                    longitude: address.coordinates.longitude,
                  },
                );
                if (distance / 1000 <= AppPreference.DISTANCE_MARGIN) {
                  // console.log('Transporter uid is : ', documentSnapshot.id);
                  // loadedUserData.push(documentSnapshot.id);
                  loadedUserData.push(
                    new UserList(documentSnapshot.id, documentSnapshot.data()),
                  );
                }
              }
            }
          });
          // console.log('User Data is : ', loadedUserData);
          dispatch({
            type: SET_USER_LIST,
            allUserData: loadedUserData,
          });
        });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};
