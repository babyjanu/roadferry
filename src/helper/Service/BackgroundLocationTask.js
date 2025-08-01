import {PermissionsAndroid, Platform, Alert} from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {useSelector, useDispatch, connect} from 'react-redux';

import Geolocation from '@react-native-community/geolocation';
// import * as userListActions from '../../store/actions/dashboard/userlist';
import firestore from '@react-native-firebase/firestore';
import {getDistance, getPreciseDistance} from 'geolib';
import AppPreference from '../../helper/preference/AppPreference';

export const BackgroundLocationTask = () => {
  setInterval(() => {
    componentDidMount();
  }, 60000);

  const componentDidMount = () => {
    console.log('<<< BackgroundLocationTask');
    var that = this;
    //Checking for the permission just after component loaded
    if (Platform.OS === 'ios') {
      callLocation(that);
    } else {
      async function requestLocationPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            callLocation(that);
          } else {
            Alert.alert('Permission Denied');
          }
        } catch (err) {
          Alert.alert('err', err);
          console.warn(err);
        }
      }
      requestLocationPermission();
    }
  };

  const callLocation = (that) => {
    //alert("callLocation Called");
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        const currentLongitude = position.coords.longitude;
        //getting the Longitude from the location json
        const currentLatitude = position.coords.latitude;
        //getting the Latitude from the location json
        console.log('<<< LAT/LAN' + currentLatitude + ', ' + currentLongitude);
        getNearByTraspoterlist(currentLatitude, currentLongitude);
      },
      // (error) => alert(error.message),
      // {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    that.watchID = Geolocation.watchPosition((position) => {
      //Will give you the location on location change
      console.log(position);
      const currentLongitude = position.coords.longitude;
      //getting the Longitude from the location json
      const currentLatitude = position.coords.latitude;
      //getting the Latitude from the location json
      console.log('<<< LAT/LAN' + currentLatitude + ', ' + currentLongitude);
      getNearByTraspoterlist(currentLatitude, currentLongitude);
    });
  };

  const getNearByTraspoterlist = (lat, lang) => {
    const loadedUserData = [];
    firestore()
      .collection('users')
      .get()
      .then((querySnapshot) => {
        console.log('Total users: ', querySnapshot.size);
        querySnapshot.forEach((documentSnapshot) => {
          /* console.log(
            'User data: ',
            documentSnapshot.id,
            documentSnapshot.data(),
          ); */
          if (documentSnapshot.get('user_type') === 'transpoter') {
            var address = documentSnapshot.get('address');
            // console.log('Latitude is : ', documentSnapshot.get('address'));
            console.log('Coordinate is : ', address.coordinates.latitude);

            var distance = getPreciseDistance(
              {latitude: lat, longitude: lang},
              {
                latitude: address.coordinates.latitude,
                longitude: address.coordinates.longitude,
              },
            );
            if (distance / 1000 <= AppPreference.DISTANCE_MARGIN) {
              console.log('Distance is : ', address.title, distance);
              loadedUserData.push(documentSnapshot.data());
            }
          }
        });
        console.log('User Data from background : ', loadedUserData);
      });
  };
};
