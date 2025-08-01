import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

export const GET_VEHICLE_TYPE_LIST = 'GET_VEHICLE_TYPE_LIST';
export const IS_VEHICLE_TYPE_LOADING = 'IS_VEHICLE_TYPE_LOADING';

export const fetchVehicleTypeList = (isStartProgress) => {
  return async (dispatch) => {
    // any async code you want!
    try {
      const vehicleTypeList = [];
      if (isStartProgress) {
        dispatch({
          type: IS_VEHICLE_TYPE_LOADING,
          isLoading: true,
        });
      }
      firestore()
        .collection('vehicles')
        .where('is_deleted', '==', false)
        .get()
        .then((querySnapshot) => {
          // console.log('Total vehicles data: ', querySnapshot.size);
          querySnapshot.forEach((documentSnapshot) => {
            // console.log('documentSnapshot.id: ', documentSnapshot.id);
            vehicleTypeList.push({id: documentSnapshot.id, data: { ...documentSnapshot.data(), created_at: moment(documentSnapshot.data().created_at).format('dd MM YYYY')}});
          });
          dispatch({
            type: GET_VEHICLE_TYPE_LIST,
            vehicleTypeList: vehicleTypeList,
            isLoading: false
          });
          /* dispatch({
            type: IS_LOADING,
            isLoading: false,
          }); */
        });
    } catch (err) {
      // send to custom analytics server
      dispatch({
        type: IS_VEHICLE_TYPE_LOADING,
        isLoading: false,
      });
      throw err;
    }
  };
};