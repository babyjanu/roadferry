import firestore from '@react-native-firebase/firestore';
import UserList from '../../../helper/models/dashboard/UserList';

export const SET_FILTER_TRANSPOTER_LIST = 'SET_FILTER_TRANSPOTER_LIST';
export const IS_TRANSPORTER_LOADING = 'IS_TRANSPORTER_LOADING';
export const UPDATE_TRANSPORTER_LIST = 'UPDATE_TRANSPORTER_LIST';
import {getDistance, getPreciseDistance} from 'geolib';
import AppPreference from '../../../helper/preference/AppPreference';

export const fetchFilterTranspoterList = (
  source,
  destination,
  weight,
  dimensions,
  width,
  height,
  vehicleType,
  sourceLatitude,
  sourceLongitude,
  destinationLatitude,
  destinationLongitude,
  currentLat,
  currentLong,
) => {
  let transporterCount = 0;
  let index = 0;
  return async dispatch => {
    // any async code you want!
    try {
      const loadedFilterData = [];
      firestore()
        .collection('users')
        .orderBy('priority', 'desc')
        .get()
        .then(querySnapshot => {
          // console.log('fetchFilterTranspoterList.users.total: ', querySnapshot.size);
          querySnapshot.forEach(documentSnapshot => {
            var transporterData = documentSnapshot.data();
            if (
              transporterData.user_type == 'transporter' &&
              transporterData.is_request &&
              transporterData.status
            ) {
              console.log('transporter data', transporterData);
              var address = transporterData;
              if (
                address.coordinates != undefined &&
                Object.keys(address.coordinates).length != 0
              ) {
                // console.log(`Object.keys(address.coordinates).length: ${Object.keys(address.coordinates).length}`)
                // console.log(`address.coordinates:`, address.coordinates)
                var distance = getPreciseDistance(
                  {latitude: currentLat, longitude: currentLong},
                  {
                    latitude: address.coordinates.latitude,
                    longitude: address.coordinates.longitude,
                  },
                );
                // console.log(`documentSnapshot.id->distance:`, documentSnapshot.id, distance)
                transporterCount += 1;
                if (distance / 1000 <= 10000000) {
                  // console.log(`[filterTranspoterList] vehicleType:`, vehicleType)
                  documentSnapshot.ref
                    .collection('vehicle_details')
                    .where('vehicle_type', '==', vehicleType)
                    .where('is_verified', '==', 'verified')
                    .where('is_assign', '==', false)
                    .where('is_deleted', '==', false)
                    .get()
                    .then(querySnapshot => {
                      // console.log('documentSnapshot.id->Total vehicle_details (vehicle_type) data: ', documentSnapshot.id, querySnapshot.size);
                      index += 1;
                      if (querySnapshot.size != 0) {
                        loadedFilterData.push(
                          new UserList(
                            documentSnapshot.id,
                            documentSnapshot.data(),
                          ),
                        );
                      }

                      /* console.log(`transporterCount:`, transporterCount)
                      console.log(`index:`, index) */
                      if (index == transporterCount) {
                        // console.log('loadedFilterData:', loadedFilterData);
                        dispatch({
                          type: SET_FILTER_TRANSPOTER_LIST,
                          allFilterData: loadedFilterData,
                          isLoading: false,
                        });
                      }
                    })
                    .catch(error => {
                      console.log(`error:`, error);
                      dispatch({
                        type: IS_TRANSPORTER_LOADING,
                        isLoading: false,
                      });
                    });
                  /* loadedFilterData.push(
                    new UserList(documentSnapshot.id, documentSnapshot.data()),
                  ); */
                } else {
                  dispatch({
                    type: IS_TRANSPORTER_LOADING,
                    isLoading: false,
                  });
                }
              } else {
                dispatch({
                  type: IS_TRANSPORTER_LOADING,
                  isLoading: false,
                });
              }
            } else {
              dispatch({
                type: IS_TRANSPORTER_LOADING,
                isLoading: false,
              });
            }
          });
        });
    } catch (err) {
      // send to custom analytics server
      console.log(`fetchFilterTranspoterList.err:`, err);
      dispatch({
        type: IS_TRANSPORTER_LOADING,
        isLoading: false,
      });
      // throw err;
    }
  };
};

// {
//   "rules": {
//     ".read": false,
//     ".write": false
//   }
// }

// {
//   "rules": {
//     ".read": "now < 1605724200000",  // 2020-11-19
//     ".write": "now < 1605724200000",  // 2020-11-19
//   }
// }

export const newFetchFilterTransporterList = (
  vehicleType,
  currentLat,
  currentLong,
  rejected_transporters = [],
) => {
  let transporterCount = 0;
  let index = 0;
  return async dispatch => {
    // any async code you want!
    try {
      const loadedFilterData = [];
      if (!rejected_transporters) rejected_transporters = [];

      dispatch({
        type: IS_TRANSPORTER_LOADING,
        isLoading: true,
      });
      firestore()
        .collection('users')
        .where('user_type', '==', 'transporter')
        .orderBy('priority', 'desc')
        .get()
        .then(querySnapshot => {
          /* console.log(
            'fetchFilterTranspoterList.users.total: ',
            querySnapshot.size,
          ); */
          if (querySnapshot.size != 0) {
            var failCount = 0;
            querySnapshot.forEach(documentSnapshot => {
              var transporterData = documentSnapshot.data();
              if (rejected_transporters.includes(documentSnapshot.id)) {
                failCount += 1;
                /* console.log(
                  `${transporterData.first_name} ${transporterData.last_name} falls under rejected transporters list`,
                ); */
              } else if (
                transporterData.user_type == 'transporter' &&
                transporterData.is_request &&
                transporterData.isTransporterOnline &&
                !transporterData.is_deleted &&
                transporterData.status
              ) {
                /* console.log(
                  `${transporterData.first_name} ${transporterData.last_name} falls under transporters list`,
                ); */
                var address = transporterData.address;
                if (
                  address.coordinates != undefined &&
                  Object.keys(address.coordinates).length != 0
                ) {
                  /* console.log(`current_location: ${currentLat}-${currentLong}`);
                  console.log(
                    `transporter_location: ${address.coordinates.latitude}-${address.coordinates.longitude}`,
                  ); */
                  var distanceValue = getPreciseDistance(
                    {latitude: currentLat, longitude: currentLong},
                    {
                      latitude: address.coordinates.latitude,
                      longitude: address.coordinates.longitude,
                    },
                  );
                  /* console.log(
                    `distanceValue:`,
                    distanceValue,
                    distanceValue / 1000 <= AppPreference.DISTANCE_MARGIN,
                  ); */
                  if (distanceValue / 1000 <= AppPreference.DISTANCE_MARGIN) {
                    transporterCount += 1;
                    documentSnapshot.ref
                      .collection('vehicle_details')
                      .where('vehicle_type', '==', vehicleType)
                      .where('is_verified', '==', 'verified')
                      .where('isVehicleOnline', '==', true)
                      .where('is_assign', '==', false)
                      .where('is_deleted', '==', false)
                      .get()
                      .then(querySnapshot => {
                        index += 1;
                        // console.log('querySnapshot size: ', querySnapshot);
                        loadedFilterData.push({
                          user: new UserList(
                            documentSnapshot.id,
                            { ...documentSnapshot.data(), id: documentSnapshot.id},
                          ),
                          distance: distanceValue, // Include distance value in the object
                        });
                        /* if (querySnapshot.size != 0) {
                          
                          loadedFilterData.push({
                            user: new UserList(
                              documentSnapshot.id,
                              documentSnapshot.data(),
                            ),
                            distance: distanceValue, // Include distance value in the object
                          });
                        } */
                        /* console.log('loadedFilterData: ', loadedFilterData);
                        console.log('index: ', documentSnapshot.data());
                        console.log(`transporterCount: ${transporterCount}`);
                        console.log(
                          `condition: ${index}, ${transporterCount}, ${
                            index == transporterCount
                          }`,
                        ); */
                        if (index == transporterCount) {
                          loadedFilterData.sort((a, b) =>
                            a.distance > b.distance ? 1 : -1,
                          );
                          let _fltrData = loadedFilterData.map(
                            item => item.user,
                          );
                          console.log('_fltrData: ', _fltrData);
                          dispatch({
                            type: SET_FILTER_TRANSPOTER_LIST,
                            allFilterData: _fltrData,
                            // isLoading: false,
                          });
                        } else {
                          dispatch({
                            type: IS_TRANSPORTER_LOADING,
                            // isLoading: false,
                          });
                        }
                      })
                      .catch(error => {
                        console.log(`error:`, error);
                        dispatch({
                          type: IS_TRANSPORTER_LOADING,
                          isLoading: false,
                        });
                      });
                    /* loadedFilterData.push(
                      new UserList(documentSnapshot.id, documentSnapshot.data()),
                    ); */
                  } else {
                    console.log(
                      `${transporterData.first_name} ${transporterData.last_name} is distanceValue ${distanceValue} is over 100`,
                    );
                    failCount += 1;
                  }
                } else {
                  failCount += 1;
                  console.log(
                    `${transporterData.first_name} ${transporterData.last_name} is coordinates is undefine`,
                  );
                }
              } else {
                failCount += 1;
                console.log(
                  `${transporterData.first_name} ${transporterData.last_name} is !Transporter && !is_request`,
                );
              }
            });
            console.log(`failCount: ${failCount}`);
            if (failCount == querySnapshot.size) {
              dispatch({
                type: IS_TRANSPORTER_LOADING,
                // isLoading: false,
              });
            }
          } else {
            dispatch({
              type: IS_TRANSPORTER_LOADING,
              // isLoading: false,
            });
          }
        })
        .catch(err => {
          throw err;
        });
    } catch (err) {
      console.log(`fetchFilterTranspoterList.err:`, err);
      dispatch({
        type: IS_TRANSPORTER_LOADING,
        isLoading: false,
      });
    }
  };
};

export const updateTransporterList = (list) => {
  // console.log('_fltrData(list): ', list);
  return async dispatch => {
    dispatch({
      type: UPDATE_TRANSPORTER_LIST,
      data: list,
      isLoading: false,
    });
  };
}