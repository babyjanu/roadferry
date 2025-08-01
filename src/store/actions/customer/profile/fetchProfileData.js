import firestore from '@react-native-firebase/firestore';
import profileData from '../../../../helper/models/profile/profileData';

export const FETCH_PROFILE_DATA = 'FETCH_PROFILE_DATA';
export const CLEAR_PROFILE_DATA = 'CLEAR_PROFILE_DATA';

export const fetchProfileData = (currentUID) => {
  return async (dispatch) => {
    // any async code you want!
    try {
      let loadedProfileData = {};

      firestore()
        .collection('users')
        .doc(currentUID)
        .onSnapshot((querySnapshot) => {
          // console.log('Profile Data : ', querySnapshot.data().first_name);
          //   loadedProfileData.push(
          //     new profileData(
          //       querySnapshot.data().first_name,
          //       querySnapshot.data().last_name,
          //       querySnapshot.data().email,
          //       querySnapshot.data().phone_number,
          //     ),
          //   );
          loadedProfileData = querySnapshot.data();
          // console.log('loadedProfileData Data : ', loadedProfileData);
          dispatch({
            type: FETCH_PROFILE_DATA,
            fetchProfileData: loadedProfileData,
            userUID: currentUID
          });
        });
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const clearProfileData = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_PROFILE_DATA,
    })
  }
}
