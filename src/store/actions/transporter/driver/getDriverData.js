import firestore from '@react-native-firebase/firestore';

export const GET_DRIVER_LIST = 'GET_DRIVER_LIST';
export const IS_LOADING = 'IS_LOADING';

export const fetchDriverList = (userID, isStartProgress) => {
  return async (dispatch) => {
    // any async code you want!
    try {
      const driverList = [];
      if (isStartProgress) {
        dispatch({
          type: IS_LOADING,
          isLoading: true,
        });
      }
      firestore()
        .collection('users')
        .doc(userID)
        .collection('driver_details')
        .get()
        .then((querySnapshot) => {
          console.log('Total driver_details data: ', querySnapshot.size);
          querySnapshot.forEach((documentSnapshot) => {
            // console.log('documentSnapshot.id: ', documentSnapshot.id);
            driverList.push({id: documentSnapshot.id, data: documentSnapshot.data()});
          });
          dispatch({
            type: GET_DRIVER_LIST,
            driverData: driverList,
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
        type: IS_LOADING,
        isLoading: false,
      });
      throw err;
    }
  };
};