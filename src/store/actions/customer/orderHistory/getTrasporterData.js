import firestore from '@react-native-firebase/firestore';

export const GET_TRANSPOTER_DATA = 'GET_TRANSPOTER_DATA';

export const getTransporterData = (transporter_uid) => {
  return async (dispatch) => {
    // any async code you want!
    try {
      const loadedTransporterData = [];

      firestore()
        .collection('users')
        .doc(transporter_uid)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((documentSnapshot) => {
            loadedTransporterData.push(documentSnapshot.data());
          });
          dispatch({
            type: GET_TRANSPOTER_DATA,
            transporterData: loadedTransporterData,
          });
        });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};
